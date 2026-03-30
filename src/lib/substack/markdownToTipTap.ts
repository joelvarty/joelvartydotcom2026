/**
 * Markdown to TipTap JSON Converter
 *
 * Converts markdown content (from Agility CMS blog posts) into TipTap/ProseMirror
 * JSON format required by Substack's internal draft API.
 *
 * Uses marked.lexer() to tokenize, then maps tokens to TipTap nodes.
 */

import { marked, type Token, type Tokens } from "marked"
import type { TipTapDocument, TipTapNode, TipTapMark } from "./substackClient"

/**
 * Convert a markdown string to a TipTap document for Substack.
 */
export function markdownToTipTap(markdown: string): TipTapDocument {
	// Preprocess: convert gallery code blocks to individual images
	const processed = preprocessForSubstack(markdown)

	const tokens = marked.lexer(processed)
	const content: TipTapNode[] = []

	for (const token of tokens) {
		const nodes = convertBlock(token)
		if (nodes) {
			if (Array.isArray(nodes)) {
				content.push(...nodes)
			} else {
				content.push(nodes)
			}
		}
	}

	// Ensure at least one node (empty paragraph)
	if (content.length === 0) {
		content.push({ type: "paragraph" })
	}

	return { type: "doc", content }
}

/**
 * Preprocess markdown for Substack:
 * - Convert gallery code blocks to individual image lines
 * - Convert embed code blocks to plain URLs
 */
function preprocessForSubstack(markdown: string): string {
	// Convert ```gallery:type blocks to individual images
	let result = markdown.replace(
		/```gallery:[a-z]+(?::[a-z0-9-]+)?\n([\s\S]*?)```/g,
		(_match, content: string) => {
			const lines = content.trim().split("\n")
			return lines
				.map((line: string) => {
					const trimmed = line.trim()
					if (!trimmed) return ""
					// Parse: url "caption" or just url
					const match = trimmed.match(/^(\S+)(?:\s+"([^"]+)")?$/)
					if (match) {
						const url = match[1]
						const caption = match[2] || ""
						return `![${caption}](${url})`
					}
					return ""
				})
				.filter(Boolean)
				.join("\n\n")
		}
	)

	// Convert ```embed blocks to plain URLs (Substack handles embeds by URL)
	result = result.replace(/```embed\n([\s\S]*?)```/g, (_match, content: string) => {
		const url = content.trim().split("\n")[0]?.trim()
		return url || ""
	})

	// Also handle image-style gallery syntax: ![gallery:type](urls...)
	result = result.replace(
		/!\[gallery:[a-z]+(?::[a-z0-9-]+)?\]\(([^)]+)\)/g,
		(_match, content: string) => {
			// Split by comma-separated URLs
			const parts = content.split(/,\s*(?=https?:\/\/)/)
			return parts
				.map((part: string) => {
					const trimmed = part.trim()
					const m = trimmed.match(/^(\S+)(?:\s+"([^"]+)")?$/)
					if (m) {
						return `![${m[2] || ""}](${m[1]})`
					}
					return ""
				})
				.filter(Boolean)
				.join("\n\n")
		}
	)

	return result
}

// --- Block-level conversion ---

function convertBlock(token: Token): TipTapNode | TipTapNode[] | null {
	switch (token.type) {
		case "heading":
			return {
				type: "heading",
				attrs: { level: token.depth },
				content: convertInlineTokens(token.tokens || []),
			}

		case "paragraph": {
			// Check if paragraph contains only an image
			if (token.tokens && token.tokens.length === 1 && token.tokens[0].type === "image") {
				const img = token.tokens[0] as Tokens.Image
				return {
					type: "captionedImage",
					attrs: {
						src: img.href,
						title: img.title || img.text || "",
						fullscreen: false,
					},
				}
			}
			const content = convertInlineTokens(token.tokens || [])
			if (content.length === 0) return null
			return { type: "paragraph", content }
		}

		case "blockquote":
			return {
				type: "blockquote",
				content: (token.tokens || [])
					.map((t: Token) => convertBlock(t))
					.filter(Boolean)
					.flat() as TipTapNode[],
			}

		case "code":
			return {
				type: "codeBlock",
				attrs: token.lang ? { language: token.lang } : undefined,
				content: [{ type: "text", text: token.text }],
			}

		case "list":
			return {
				type: token.ordered ? "orderedList" : "bulletList",
				content: token.items.map(convertListItem),
			}

		case "hr":
			return { type: "horizontalRule" }

		case "image":
			return {
				type: "captionedImage",
				attrs: {
					src: (token as Tokens.Image).href,
					title: (token as Tokens.Image).title || (token as Tokens.Image).text || "",
					fullscreen: false,
				},
			}

		case "html": {
			// Pass through simple HTML as a paragraph
			const text = token.text.trim()
			if (!text) return null
			return { type: "paragraph", content: [{ type: "text", text }] }
		}

		case "space":
			return null

		default:
			// For any unhandled block type, try to extract text
			if ("text" in token && typeof token.text === "string" && token.text.trim()) {
				return { type: "paragraph", content: [{ type: "text", text: token.text }] }
			}
			return null
	}
}

function convertListItem(item: Tokens.ListItem): TipTapNode {
	const content: TipTapNode[] = []

	if (item.tokens) {
		for (const token of item.tokens) {
			if (token.type === "text" && "tokens" in token && token.tokens) {
				// Inline text content within a list item
				content.push({
					type: "paragraph",
					content: convertInlineTokens(token.tokens),
				})
			} else if (token.type === "list") {
				// Nested list
				const nestedList = convertBlock(token)
				if (nestedList && !Array.isArray(nestedList)) {
					content.push(nestedList)
				}
			} else {
				const block = convertBlock(token)
				if (block) {
					if (Array.isArray(block)) {
						content.push(...block)
					} else {
						content.push(block)
					}
				}
			}
		}
	}

	// Ensure list item has at least one child
	if (content.length === 0) {
		content.push({ type: "paragraph" })
	}

	return { type: "listItem", content }
}

// --- Inline-level conversion ---

function convertInlineTokens(tokens: Token[]): TipTapNode[] {
	const result: TipTapNode[] = []

	for (const token of tokens) {
		const nodes = convertInline(token, [])
		result.push(...nodes)
	}

	return result
}

/**
 * Convert an inline token to TipTap text nodes with marks.
 * Marks accumulate as we recurse into nested inline tokens (e.g., bold inside link).
 */
function convertInline(token: Token, parentMarks: TipTapMark[]): TipTapNode[] {
	switch (token.type) {
		case "text": {
			const text = token.text
			if (!text) return []
			return [makeTextNode(text, parentMarks)]
		}

		case "strong": {
			const marks = [...parentMarks, { type: "bold" }]
			if ("tokens" in token && token.tokens) {
				return token.tokens.flatMap((t: Token) => convertInline(t, marks))
			}
			return [makeTextNode(token.text, marks)]
		}

		case "em": {
			const marks = [...parentMarks, { type: "italic" }]
			if ("tokens" in token && token.tokens) {
				return token.tokens.flatMap((t: Token) => convertInline(t, marks))
			}
			return [makeTextNode(token.text, marks)]
		}

		case "codespan":
			return [makeTextNode(token.text, [...parentMarks, { type: "code" }])]

		case "link": {
			const marks = [...parentMarks, { type: "link", attrs: { href: token.href } }]
			if (token.tokens) {
				return token.tokens.flatMap((t: Token) => convertInline(t, marks))
			}
			return [makeTextNode(token.text, marks)]
		}

		case "image":
			// Inline image -- emit as a captionedImage node (breaks out of paragraph)
			return [
				{
					type: "captionedImage",
					attrs: {
						src: token.href,
						title: token.title || token.text || "",
						fullscreen: false,
					},
				},
			]

		case "br":
			return [{ type: "hardBreak" }]

		case "escape":
			return [makeTextNode(token.text, parentMarks)]

		default:
			if ("text" in token && typeof token.text === "string" && token.text) {
				return [makeTextNode(token.text, parentMarks)]
			}
			return []
	}
}

function makeTextNode(text: string, marks: TipTapMark[]): TipTapNode {
	const node: TipTapNode = { type: "text", text }
	if (marks.length > 0) {
		node.marks = marks
	}
	return node
}
