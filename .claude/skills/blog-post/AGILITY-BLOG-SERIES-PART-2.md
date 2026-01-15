# Building a CMS-Driven Website with AI: Part 2 - Components and Content Models

*This is Part 2 of a 3-part series on using AI to build production-ready websites with Agility CMS. Based on the real-world experience of building [joelvarty.com](https://joelvarty.com).*

---

## TL;DR

- **Critical pattern**: Agility components receive `UnloadedModuleProps`—you must call `getContentItem()` to fetch the actual fields
- **Dynamic pages**: Don't overcomplicate it—the `dynamicPageItem` prop already contains your content item
- **Gallery system**: Built 7 gallery types (carousel, grid, masonry, thumbnail, stacked, comparison, tabs) using custom markdown syntax and Remark plugins
- **Performance**: Used `AgilityPic` with responsive sources throughout for optimized images
- **Time investment**: ~5.5 hours for all components, blog system, career timeline, and uses page
- **Key lesson**: When AI makes a pattern mistake, fix it once and explain why—it learns and applies correctly going forward

---

## From Foundation to Features

In [Part 1](/blog/building-cms-website-ai-part-1-planning-foundation), we set up the project foundation and learned that AI needs specific guidance on CMS patterns. Now it's time to build the actual features - components, blog system, and the image gallery system.

## The Agility Component Pattern

Agility CMS uses a component-based architecture where:

1. **Page Templates** define content zones
2. **Components** (called "Modules") are placed in those zones
3. Each component instance references a **Content Item** in the CMS

This is powerful but requires understanding a specific pattern. And this is where the AI made its first major mistake.

### The "Unloaded Module" Mistake

The AI created components like this:

```typescript
// ❌ WRONG - This doesn't work
const BlogListing = async ({ module }: UnloadedModuleProps) => {
  const { title, numberOfPosts } = module.fields // undefined!
  // ...
}
```

Every component failed with: `Cannot destructure property 'title' of 'module.fields' as it is undefined.`

The AI assumed that when Agility passes a module to a component, the fields are already loaded. But the type name should have been a clue: `UnloadedModuleProps`. The module is **unloaded** - it only contains a `contentid` reference.

### The Correct Pattern

Looking at a working component (`RichTextArea`) revealed the fix:

```typescript
// ✅ CORRECT - Fetch the content item first
const BlogListing = async ({ module, languageCode }: UnloadedModuleProps) => {
  const { fields } = await getContentItem<BlogListingFields>({
    contentID: module.contentid,
    languageCode,
  })

  const { title, numberOfPosts } = fields
  // Now it works!
}
```

**Five components had to be fixed**: BlogListing, BlogDetails, CareerTimeline, UsesSection, and Hero.

### Lesson for AI-Assisted Development

When the AI makes a pattern mistake, fix it once and explain why. The AI then applied the correct pattern to all remaining components. It learns from corrections - that's the collaboration model.

## The Dynamic Page Discovery

Even after fixing the content loading issue, blog post pages showed "Page Not Found." The AI had created complex logic to find blog posts:

```typescript
// ❌ WRONG - Overcomplicated
const BlogDetails = async ({ module, sitemapNode }) => {
  // Complex logic to find post by slug from sitemapNode.contentID
  // Multiple API calls to search through posts
  // Slug matching logic...
}
```

The solution was embarrassingly simple. For dynamic pages in Agility, the content item is already available:

```typescript
// ✅ CORRECT - It's already there!
const BlogDetails = async ({ module, dynamicPageItem }: UnloadedModuleProps) => {
  if (dynamicPageItem) {
    const post = dynamicPageItem as BlogPost
    // That's it. The post is right there.
  }
}
```

Agility's dynamic page system automatically provides the content item that matches the current URL. No need to fetch it separately.

**This fix is now in the codebase**: [BlogDetails.tsx](https://github.com/joelvarty/joelvartydotcom-2026/blob/main/src/components/agility-components/BlogDetails.tsx)

## Building the Gallery System

The blog needed to support rich image galleries embedded in markdown content. We designed seven gallery types:

| Type | Use Case |
|------|----------|
| **Carousel** | Slideshow with navigation |
| **Grid** | Uniform image grid (configurable columns) |
| **Masonry** | Pinterest-style varied heights |
| **Thumbnail** | Large image + thumbnail strip |
| **Stacked** | Vertical sequence (tutorials) |
| **Comparison** | Before/after slider |
| **Tabs** | Categorized image sets |

### The Markdown Syntax

We created a custom syntax using fenced code blocks:

```markdown
```gallery:carousel
https://cdn.agilitycms.com/image1.jpg "Caption for image 1"
https://cdn.agilitycms.com/image2.jpg "Caption for image 2"
```
```

```markdown
```gallery:grid:columns-3
https://cdn.agilitycms.com/image1.jpg "Photo 1"
https://cdn.agilitycms.com/image2.jpg "Photo 2"
https://cdn.agilitycms.com/image3.jpg "Photo 3"
```
```

The AI built the entire gallery system:

1. **Remark plugin** to parse the custom syntax from the markdown AST
2. **Seven React components** for different gallery layouts
3. **Lightbox integration** for full-screen viewing
4. **AgilityPic integration** for optimized responsive images

**Gallery components**: [src/components/galleries/](https://github.com/joelvarty/joelvartydotcom-2026/tree/main/src/components/galleries)

### The Remark Plugin Architecture

Initially, gallery parsing was embedded in the React component. The AI refactored it into a proper Remark plugin following the unified/remark ecosystem patterns:

```typescript
// src/lib/markdown/remark-gallery.ts
import { visit } from 'unist-util-visit'

export function remarkGallery() {
  return (tree: Node) => {
    visit(tree, 'code', (node) => {
      if (node.lang?.startsWith('gallery:')) {
        // Parse gallery type and options
        // Transform to custom node with metadata
      }
    })
  }
}
```

**Benefits of this architecture:**
- ✅ Separation of parsing from rendering
- ✅ Follows ecosystem conventions
- ✅ Testable independently
- ✅ Easy to extend with new gallery types

**Markdown processing code**: [src/lib/markdown/processMarkdown.tsx](https://github.com/joelvarty/joelvartydotcom-2026/blob/main/src/lib/markdown/processMarkdown.tsx)

## Performance: The AgilityPic Pattern

Every image on the site uses `AgilityPic` for automatic optimization. The AI created a consistent pattern:

```typescript
<AgilityPic
  image={image}
  className="w-full h-full object-cover"
  fallbackWidth={400}
  sources={[
    // Desktop high-DPI
    { media: "(min-width: 1280px) and (min-resolution: 2dppx)", width: 2400 },
    { media: "(min-width: 1280px)", width: 1200 },
    // Tablet
    { media: "(min-width: 640px) and (min-resolution: 2dppx)", width: 1600 },
    { media: "(min-width: 640px)", width: 800 },
    // Mobile
    { media: "(max-width: 639px) and (min-resolution: 2dppx)", width: 1280 },
    { media: "(max-width: 639px)", width: 640 },
  ]}
/>
```

This pattern was applied to:
- Blog post featured images
- Gallery images
- Career timeline images
- About page images

The AI understood that performance was a core requirement (100 Lighthouse score target) and consistently applied the optimization pattern.

## Blog Features Built

By the end of this phase, the blog system included:

### Blog Listing
- Paginated post list
- Category filtering
- Responsive grid layout
- Featured image thumbnails

**Component**: [BlogListing.tsx](https://github.com/joelvarty/joelvartydotcom-2026/blob/main/src/components/agility-components/blog-listing/BlogListing.tsx)

### Blog Details
- Full markdown rendering
- Gallery support (7 types)
- Category and tag display
- Series navigation
- Related posts

**Component**: [BlogDetails.tsx](https://github.com/joelvarty/joelvartydotcom-2026/blob/main/src/components/agility-components/BlogDetails.tsx)

### RSS Feed
- Auto-generated from blog posts
- Proper XML formatting
- Category/tag metadata

### Series Support
- Group related posts
- Series landing pages
- Navigation between posts

**Series component**: [SeriesLanding.tsx](https://github.com/joelvarty/joelvartydotcom-2026/blob/main/src/components/agility-components/SeriesLanding.tsx)

## Key Learnings from Component Development

### 1. Pattern Documentation is Critical

Once we established the correct Agility component pattern, we documented it. The AI then followed it consistently. Without documentation, the AI would make the same mistakes repeatedly.

### 2. Let AI Refactor

The AI's initial implementations often worked but weren't well-structured. Asking it to refactor (like the Remark plugin extraction) produced cleaner, more maintainable code.

### 3. Performance as a Constraint

By making "100 Lighthouse score" a hard requirement from the start, the AI considered performance in every decision. It didn't need reminding to optimize images or lazy-load content.

### 4. Visual Verification Matters

Screenshots in the development documentation helped verify that components looked correct. The AI couldn't see the UI, so I provided visual feedback that guided iterations.

## Time Investment

| Task | Time |
|------|------|
| Fixing component loading pattern | 30 minutes |
| Building all 7 gallery types | 2 hours |
| Blog listing and details | 1 hour |
| Career timeline | 30 minutes |
| Uses page | 30 minutes |
| Refactoring and polish | 1 hour |
| **Total** | **~5.5 hours** |

Compare this to building the same features manually - we're talking 2-3 weeks of development time compressed into an afternoon.

## What's Next

In [Part 3](/blog/building-cms-website-ai-part-3-content-workflow), we'll cover the most powerful aspect of this project: using AI to manage content at scale. We'll show how Claude Code bulk-uploaded 18 blog posts in under 5 minutes, and how to set up a Claude Project for ongoing content creation.

---

*The complete codebase is available at [github.com/joelvarty/joelvartydotcom-2026](https://github.com/joelvarty/joelvartydotcom-2026).*

**Series Navigation:**
- [Part 1: Planning and Foundation](/blog/building-cms-website-ai-part-1-planning-foundation)
- **Part 2: Building Components and Content Models** (You are here)
- [Part 3: AI-Powered Content Workflow](/blog/building-cms-website-ai-part-3-content-workflow)
