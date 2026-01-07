/**
 * RSS Feed Route
 *
 * Generates an RSS 2.0 feed for blog posts.
 * Accessible at /blog/rss.xml
 */

import { getContentList } from "@/lib/cms/getContentList"
import { NextResponse } from "next/server"

interface BlogPost {
	contentID: number
	fields: {
		title: string
		Slug: string
		excerpt?: string
		Content?: string
		publishedDate?: string
		featuredImage?: {
			url: string
			label: string
		}
	}
}

/**
 * Generate RSS feed XML
 */
function generateRSSFeed(posts: BlogPost[], siteUrl: string): string {
	const feedItems = posts
		.map((post) => {
			const slug = post.fields.Slug || `post-${post.contentID}`
			const url = `${siteUrl}/blog/${slug}`
			const pubDate = post.fields.publishedDate
				? new Date(post.fields.publishedDate).toUTCString()
				: new Date().toUTCString()
			const description = post.fields.excerpt || ""
			const content = post.fields.Content || ""

			return `
    <item>
      <title><![CDATA[${escapeXML(post.fields.title)}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${escapeXML(description)}]]></description>
      ${content ? `<content:encoded><![CDATA[${content}]]></content:encoded>` : ""}
    </item>`
		})
		.join("")

	return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Joel Varty - Blog</title>
    <link>${siteUrl}</link>
    <description>Blog posts by Joel Varty</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <ttl>60</ttl>
${feedItems}
  </channel>
</rss>`
}

/**
 * Escape XML special characters
 */
function escapeXML(str: string): string {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;")
}

export async function GET() {
	try {
		const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://joelvarty.com"
		const locale = "en-us"

		// Fetch published blog posts
		const posts = await getContentList<BlogPost>({
			referenceName: "Posts",
			languageCode: locale,
			sort: "fields.publishedDate desc",
			take: 20, // Limit to 20 most recent posts
		})

		// Filter to only published posts with dates
		const publishedPosts = posts.items.filter(
			(post: BlogPost) => post.fields.publishedDate && post.fields.title
		)

		const rssXML = generateRSSFeed(publishedPosts, siteUrl)

		return new NextResponse(rssXML, {
			headers: {
				"Content-Type": "application/xml; charset=utf-8",
				"Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
			},
		})
	} catch (error) {
		console.error("Error generating RSS feed:", error)
		return new NextResponse("Error generating RSS feed", { status: 500 })
	}
}

