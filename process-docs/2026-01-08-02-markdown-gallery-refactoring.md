# Refactoring Markdown Gallery Processing: A Deep Dive

**Date:** January 8, 2026
**Author:** Joel Varty (with Claude Code)
**Phase:** 9 → 10 (Polish & Optimization)

## Joel's Thoughts / Reflections

_[Space for Joel to add personal thoughts, reactions, design decisions, or creative direction]_

---

## The Problem We Were Solving

_**[This section written by Claude Code agent]**_

The blog system supports seven different gallery types that can be embedded in markdown using a custom syntax:

```markdown
![gallery:grid](image1.jpg "Caption 1", image2.jpg "Caption 2")
![gallery:carousel](image1.jpg, image2.jpg, image3.jpg)
![gallery:masonry](image1.jpg "Tall", image2.jpg "Wide")
```

The processing pipeline had grown organically over time, with gallery parsing happening inside the main markdown processing component ([src/lib/markdown/processMarkdown.tsx](src/lib/markdown/processMarkdown.tsx)). While it worked, there were some issues:

1. **Tight coupling** - Gallery parsing was embedded directly in the `ReactMarkdown` components prop
2. **Complexity** - The `processMarkdown.tsx` file was handling too many concerns
3. **Poor separation** - Remark plugins (which parse markdown AST) and React components (which render) were mixed together
4. **Maintenance burden** - Adding new gallery features required touching the main rendering logic

## The Solution: Proper Remark Plugin Architecture

_**[This section written by Claude Code agent]**_

### What We Built

We refactored the gallery processing into a proper **Remark plugin** that follows the unified/remark ecosystem patterns:

**New file:** [src/lib/markdown/remark-gallery.ts](src/lib/markdown/remark-gallery.ts)

```typescript
/**
 * Remark plugin to parse gallery syntax before ReactMarkdown processes it
 * Transforms: ![gallery:type](url1 "caption1", url2 "caption2")
 * Into a format that ReactMarkdown can parse
 */

import { visit } from "unist-util-visit"
import type { Root, Image } from "mdast"

const GALLERY_REGEX = /^gallery:([a-z]+)(?::([a-z0-9-]+))?$/

export function remarkGallery() {
  return (tree: Root) => {
    visit(tree, "image", (node: Image, index: number | undefined, parent: any) => {
      if (!node.alt || typeof node.alt !== "string") return

      const match = node.alt.match(GALLERY_REGEX)
      if (!match) return

      const [, type, options] = match

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
```

### How It Works

The plugin uses the **visitor pattern** to walk through the markdown Abstract Syntax Tree (AST):

1. **Visit all image nodes** - Uses `unist-util-visit` to find every `image` node in the AST
2. **Check for gallery syntax** - Tests the alt text against the gallery regex pattern
3. **Extract metadata** - Parses the gallery type and optional parameters
4. **Attach data attributes** - Adds `data-*` attributes to the HTML output that React components can read

This happens **before** ReactMarkdown renders anything, keeping concerns properly separated.

### Integration

We updated [src/lib/markdown/processMarkdown.tsx](src/lib/markdown/processMarkdown.tsx) to use the new plugin:

```typescript
import { remarkGallery } from "./remark-gallery"

export default async function processMarkdown(
  markdown: string | null | undefined
): Promise<React.ReactElement | null> {
  // ... validation ...

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkGallery]} // <-- Added here
      components={{
        // Gallery rendering logic stays in components
        img({ node, alt, src, title, ...props }) {
          // Check for gallery data attributes
          const galleryType = (node as any)?.data?.hProperties?.["data-gallery-type"]

          if (galleryType) {
            // Parse and render gallery
            return <GalleryComponent {...galleryData} />
          }

          // Regular image
          return <AgilityPic {...imageProps} />
        }
      }}
    />
  )
}
```

### Benefits

✅ **Separation of concerns** - Parsing is separate from rendering
✅ **Standard architecture** - Follows unified/remark ecosystem patterns
✅ **Easier to test** - Plugin can be tested independently
✅ **Extensible** - New gallery options can be added in one place
✅ **Maintainable** - Clear boundaries between different parts of the system

## Gallery Components Improvements

_**[This section written by Claude Code agent]**_

While refactoring the markdown processing, we also improved all seven gallery components:

### 1. Gallery Carousel ([src/components/galleries/GalleryCarousel.tsx](src/components/galleries/GalleryCarousel.tsx))
- Added proper navigation arrow positioning
- Improved touch/swipe handling
- Better responsive behavior on mobile
- Enhanced visual feedback on hover

### 2. Gallery Grid ([src/components/galleries/GalleryGrid.tsx](src/components/galleries/GalleryGrid.tsx))
- Optimized grid layout for various screen sizes
- Better image aspect ratio handling
- Improved loading states

### 3. Gallery Masonry ([src/components/galleries/GalleryMasonry.tsx](src/components/galleries/GalleryMasonry.tsx))
- Fixed column calculations for responsive layouts
- Better gap handling between items
- Improved image positioning

### 4. Gallery Comparison ([src/components/galleries/GalleryComparison.tsx](src/components/galleries/GalleryComparison.tsx))
- Enhanced slider interaction
- Better visual indicators
- Mobile-optimized controls

### 5. Gallery Stacked ([src/components/galleries/GalleryStacked.tsx](src/components/galleries/GalleryStacked.tsx))
- Improved spacing consistency
- Better caption placement
- Enhanced responsive behavior

### 6. Gallery Thumbnail ([src/components/galleries/GalleryThumbnail.tsx](src/components/galleries/GalleryThumbnail.tsx))
- Optimized thumbnail grid layout
- Better active state indicators
- Improved click/tap targets for mobile

All galleries now:
- Use `AgilityPic` component for optimized image delivery
- Support responsive sizing with proper mobile/desktop breakpoints
- Include proper alt text and captions
- Handle loading states gracefully
- Work smoothly on touch devices

## Dependencies Added

_**[This section written by Claude Code agent]**_

To support the new remark plugin architecture, we added:

```json
{
  "dependencies": {
    "unist-util-visit": "^5.0.0",
    "mdast": "^3.0.0" // Type definitions
  }
}
```

These are standard packages in the unified/remark ecosystem:
- **unist-util-visit** - Utilities for walking the markdown AST
- **mdast** - TypeScript types for markdown syntax trees

## Testing Performed

_**[This section written by Claude Code agent]**_

We verified the refactoring by:

1. **Manual testing** - Checked all 7 gallery types render correctly
2. **Blog post verification** - All existing blog posts with galleries still work
3. **Responsive testing** - Tested on various screen sizes
4. **Performance** - No degradation in rendering speed

All test cases passed ✅

## Files Changed

_**[This section written by Claude Code agent]**_

**New files:**
- [src/lib/markdown/remark-gallery.ts](src/lib/markdown/remark-gallery.ts) - New remark plugin

**Modified files:**
- [src/lib/markdown/processMarkdown.tsx](src/lib/markdown/processMarkdown.tsx) - Integrated new plugin
- [src/components/galleries/GalleryCarousel.tsx](src/components/galleries/GalleryCarousel.tsx) - UI improvements
- [src/components/galleries/GalleryGrid.tsx](src/components/galleries/GalleryGrid.tsx) - Layout optimizations
- [src/components/galleries/GalleryMasonry.tsx](src/components/galleries/GalleryMasonry.tsx) - Responsive fixes
- [src/components/galleries/GalleryComparison.tsx](src/components/galleries/GalleryComparison.tsx) - Interaction improvements
- [src/components/galleries/GalleryStacked.tsx](src/components/galleries/GalleryStacked.tsx) - Spacing updates
- [src/components/galleries/GalleryThumbnail.tsx](src/components/galleries/GalleryThumbnail.tsx) - Grid optimization
- [src/components/agility-components/BlogDetails.tsx](src/components/agility-components/BlogDetails.tsx) - Minor adjustments
- [package.json](package.json) - Added unist dependencies
- [src/app/globals.css](src/app/globals.css) - Minor CSS updates

## What's Next

_**[This section written by Claude Code agent]**_

With the markdown processing now properly architected, future enhancements become easier:

- **Additional gallery types** - Can be added by extending the plugin
- **Gallery options** - Support for parameters like `![gallery:grid:3-columns](...)`
- **Custom transformations** - Other markdown extensions can follow the same pattern
- **Performance optimizations** - Plugin architecture makes it easier to cache and optimize

The codebase is now better positioned for long-term maintenance and feature additions.

## Developer Notes

_**[This section written by Claude Code agent]**_

### Why Remark Plugins?

Remark plugins operate on the **Abstract Syntax Tree (AST)** of the markdown before it's rendered. This means:

1. **Earlier processing** - Transformations happen before React rendering
2. **Type safety** - AST nodes have well-defined TypeScript types
3. **Composability** - Multiple plugins can be chained together
4. **Ecosystem** - Hundreds of existing remark/rehype plugins available
5. **Performance** - AST transformations are fast

### The unified/remark Ecosystem

Our site now uses the standard remark plugin chain:

```
Markdown string
  ↓
remarkGfm (GitHub Flavored Markdown)
  ↓
remarkGallery (Our custom gallery syntax)
  ↓
ReactMarkdown (Renders to React)
  ↓
React components (AgilityPic, galleries)
```

Each plugin has a single responsibility and can be tested independently.

---

**Agent**: Claude Code (Claude Sonnet 4.5)
**Date**: 2026-01-08
**Phase**: Polish & Optimization
**Note**: This post documents the refactoring of markdown gallery processing from inline parsing to a proper Remark plugin architecture
