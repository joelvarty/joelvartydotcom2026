# Blog Details Component: The dynamicPageItem Discovery

**Date:** January 6, 2026
**Author:** Joel Varty (with technical details by Cursor AI Agent)

## The Problem

After fixing the content loading issue in all Agility components, I was still getting "Page Not Found" errors on blog post detail pages like `/blog/why-i-love-football`. The console showed that `getAgilityPageProps` was being called successfully, but the page wasn't rendering.

The issue was in the `BlogDetails` component - it was trying to find the blog post using complex logic involving `sitemapNode.contentID` and slug matching, when Agility CMS was already providing the blog post directly.

## What Was Wrong

The `BlogDetails` component had this convoluted logic:

```typescript
// ❌ WRONG - Trying to extract contentID from sitemapNode
const dynamicContentID = (page as any)?.sitemapNode?.contentID
if (dynamicContentID) {
  // Fetch the content item...
}

// Then try contentID from module fields...
// Then try slug matching...
```

This was overly complicated and wasn't working correctly. The component was calling `notFound()` even though the page existed.

## The Solution

For dynamic pages in Agility CMS, the content item that the page references is **already available** as `dynamicPageItem` in the `UnloadedModuleProps`. No need to fetch it separately!

The fix was simple:

```typescript
// ✅ CORRECT - Use dynamicPageItem directly
const BlogDetails = async ({ module, languageCode, dynamicPageItem, page }: UnloadedModuleProps) => {
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

1. **Slug field name inconsistency** - The `BlogListing` component was using `post.fields.slug` (lowercase) but the actual field name in Agility CMS is `Slug` (capitalized). Fixed to use `Slug` consistently.

2. **Interface mismatch** - The `BlogPost` interface in `BlogListing` had `slug: string` but should have been `Slug: string` to match the actual CMS field.

## Lesson Learned

When working with Agility CMS dynamic pages:
- **Check `dynamicPageItem` first** - It's already there, no need to fetch!
- **Field names are case-sensitive** - Match exactly what's in Agility CMS
- **Keep it simple** - Agility CMS provides what you need, don't overcomplicate it

---

## Technical Details (Written by Cursor AI Agent)

### Dynamic Pages in Agility CMS

In Agility CMS, there are two types of pages:

1. **Static Pages** - Regular pages with fixed content
2. **Dynamic Pages** - Pages generated from a content list (like blog posts)

For dynamic pages:
- The page template is defined once
- Each content item in the list generates a page
- The content item is passed to components as `dynamicPageItem`

### The `UnloadedModuleProps` Type

The `UnloadedModuleProps` type from `@agility/nextjs` includes:

```typescript
interface UnloadedModuleProps {
  module: {
    contentid: number
    // ... other module properties
  }
  languageCode: string
  dynamicPageItem?: any  // ← The content item for dynamic pages!
  page: {
    pageID: number
    // ... other page properties
  }
  // ... other props
}
```

### How Dynamic Pages Work

1. **Page Model Configuration** - In Agility CMS, a dynamic page model is configured with:
   - A reference to a content list (e.g., "Posts")
   - Formulas for generating page paths, titles, etc.

2. **Page Generation** - When a blog post is published:
   - Agility CMS generates a page using the dynamic page template
   - The page path is generated from the blog post's slug field
   - The blog post content item is linked to the page

3. **Component Rendering** - When the page renders:
   - `getAgilityPage` fetches the page data
   - The linked content item (blog post) is included as `dynamicPageItem`
   - Components receive `dynamicPageItem` with the full blog post data

### Correct Implementation Pattern

```typescript
const BlogDetails = async ({
  module,
  languageCode,
  dynamicPageItem,  // ← Available for dynamic pages
  page
}: UnloadedModuleProps) => {
  // Fetch module configuration
  const { fields: { containerReferenceName } } = await getContentItem<BlogDetailsFields>({
    contentID: module.contentid,
    languageCode,
  })

  let post: BlogPost | null = null

  // Priority 1: Use dynamicPageItem (for dynamic pages)
  if (dynamicPageItem) {
    post = dynamicPageItem as unknown as BlogPost
  }

  // Priority 2: Fetch by contentID (for static pages with specified contentID)
  if (!post && contentID) {
    post = await getContentItem({ contentID: parseInt(contentID, 10), languageCode })
  }

  // Priority 3: Fetch by slug (fallback)
  if (!post) {
    // ... slug matching logic ...
  }

  if (!post) {
    notFound()
  }

  // Render the post...
}
```

### Field Name Consistency

Agility CMS field names are case-sensitive. If a field is defined as `Slug` (capitalized) in the CMS, it must be accessed as `fields.Slug` in code, not `fields.slug`.

The `BlogPost` interface should match the actual field names:

```typescript
interface BlogPost {
  contentID: number
  fields: {
    title: string
    Slug: string  // ← Capitalized to match CMS
    Content?: string
    // ... other fields
  }
}
```

### Why This Matters

Using `dynamicPageItem` directly:
- **More efficient** - No extra API calls needed
- **More reliable** - No slug matching or contentID extraction logic
- **Simpler code** - Less complexity, fewer edge cases
- **Better performance** - One less database query per page load

