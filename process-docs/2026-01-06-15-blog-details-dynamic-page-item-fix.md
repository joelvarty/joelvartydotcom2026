# Blog Details Component: The dynamicPageItem Discovery

**Date:** January 6, 2026
**Author:** Joel Varty (with technical details by Cursor AI Agent)

## The Problem

After fixing the content loading issue in all Agility components, I was still getting "Page Not Found" errors on blog post detail pages like `/blog/why-i-love-football`. The console showed that `getAgilityPageProps` was being called successfully, but the page wasn't rendering.

The issue was in the `BlogDetails` component - it was trying to find the blog post using complex logic involving `sitemapNode.contentID` and slug matching, when Agility CMS was already providing the blog post directly.

## The Solution

For dynamic pages in Agility CMS, the content item that the page references is **already available** as `dynamicPageItem` in the `UnloadedModuleProps`. No need to fetch it separately!

The fix was simple:

```typescript
// ✅ CORRECT - Use dynamicPageItem directly
const BlogDetails = async ({module, languageCode, dynamicPageItem, page}: UnloadedModuleProps) => {
	// ... fetch module config ...

	let post: BlogPost | null = null

	// For dynamic pages, the blog post is available as dynamicPageItem
	if (dynamicPageItem) {
		post = dynamicPageItem as unknown as BlogPost
	}

	// Fallbacks for static pages...
}
```

## Additional Fixes

While fixing this, I also discovered and fixed:

1. **Slug field name inconsistency** - The `BlogListing` component was using `post.fields.slug` (lowercase) but the actual field name in Agility CMS is `Slug` (capitalized).

2. **Interface mismatch** - The `BlogPost` interface in `BlogListing` had `slug: string` but should have been `Slug: string` to match the actual CMS field.

## Visual Reference: Blog Post in Agility CMS

![Blog Post with Gallery Examples](https://cdn.agilitycms.com/j0i5uycg/posts/agility-blog-post-with-gallery-examples.png)

This screenshot shows how the markdown content field supports rich formatting and custom gallery syntax.

## Lesson Learned

When working with Agility CMS dynamic pages:

- **Check `dynamicPageItem` first** - It's already there, no need to fetch!
- **Field names are case-sensitive** - Match exactly what's in Agility CMS
- **Keep it simple** - Agility CMS provides what you need, don't overcomplicate it

## Joel's Thoughts / Reflections

This is another one of those unique situations where I wish an AI Agent could be prompted ahead of time (as with an AGENTS.MD file) to understand how Agility works in all of these little nuanced ways.

When dynamic pages are setup, a list item can become the dynamicPageItem that is used to render a page, and each item in that list gets its own route under the parent page. It's such a great feature, but it's unique to Agility, so I'm hoping future updates to the create-next-agility-app package template can incorporate that, in addition to things like preview mode, redirects, routing, caching, and more.

So many details!
