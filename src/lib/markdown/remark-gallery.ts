/**
 * Remark plugin to parse gallery syntax before ReactMarkdown processes it
 * Transforms: ![gallery:type](url1 "caption1", url2 "caption2")
 * Into a format that ReactMarkdown can parse
 */

import { visit } from "unist-util-visit"
import type { Root, Image } from "mdast"

/**
 * Gallery syntax regex
 * Matches: ![gallery:type:options](url1 "caption1", url2 "caption2", ...)
 */
const GALLERY_REGEX = /^gallery:([a-z]+)(?::([a-z0-9-]+))?$/

export function remarkGallery() {
	return (tree: Root) => {
		visit(tree, "image", (node: Image, index: number | undefined, parent: any) => {
			if (!node.alt || typeof node.alt !== "string") return

			const match = node.alt.match(GALLERY_REGEX)
			if (!match) return

			const [, type, options] = match

			// Parse the URL and title to extract all images
			// Standard markdown: ![alt](url "title")
			// Gallery: ![gallery:type](url1 "caption1", url2 "caption2")
			// ReactMarkdown will parse first URL as node.url, rest as node.title

			// Store gallery metadata in the node
			;(node as any).data = {
				...(node.data || {}),
				hProperties: {
					...(node.data?.hProperties || {}),
					"data-gallery-type": type,
					"data-gallery-options": options || "",
					"data-gallery-syntax": "true",
				},
			}
		})
	}
}

