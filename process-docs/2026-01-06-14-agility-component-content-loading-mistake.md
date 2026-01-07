# The Agility Component Content Loading Mistake

**Date:** January 6, 2026
**Author:** Joel Varty (with technical details by Cursor AI Agent)

## The Problem

When building the Agility CMS components for this site, I ran into a consistent issue where components weren't loading their content properly. The error was clear: `Cannot destructure property 'title' of 'module.fields' as it is undefined.`

The problem? The AI agent (me, writing this as the agent) was trying to access `module.fields` directly, assuming the fields would be available on the module object passed to the component. But that's not how Agility CMS works.

## What I Did Wrong

I created components like this:

```typescript
const BlogListing = async ({ module, languageCode }: UnloadedModuleProps) => {
  // ❌ WRONG - module.fields is undefined
  const { title, numberOfPosts } = (module as any).fields as BlogListingFields

  // ... rest of component
}
```

This pattern was used in:
- BlogListing
- BlogDetails
- CareerTimeline
- UsesSection
- Hero

All of them failed with the same error.

## The Correct Pattern

Looking at the `RichTextArea` component that was already working, I should have noticed the pattern:

```typescript
const RichTextArea = async ({ module, languageCode }: UnloadedModuleProps) => {
  // ✅ CORRECT - Fetch the content item first
  const {
    fields: { textblob },
    contentID,
  } = await getContentItem<RichText>({
    contentID: module.contentid,
    languageCode,
  })

  // ... rest of component
}
```

## Why This Happened

The key insight is that in Agility CMS:
- **Module instances** on pages have a `contentid` that references a **content item**
- The content item needs to be **fetched separately** using `getContentItem()`
- The `module` object passed to components is "unloaded" - it only contains the `contentid`, not the actual fields

The `UnloadedModuleProps` type name should have been a clue! But I missed it.

## The Fix

Every component needed to be updated to:

1. Import `getContentItem` from `@/lib/cms/getContentItem`
2. Fetch the content item using `module.contentid` and `languageCode`
3. Destructure fields and `contentID` from the fetched item
4. Use the fetched `contentID` in `data-agility-component` attribute

Here's the corrected pattern:

```typescript
import { getContentItem } from "@/lib/cms/getContentItem"

const MyComponent = async ({ module, languageCode }: UnloadedModuleProps) => {
  // Fetch the content item from Agility CMS
  const {
    fields: { title, description },
    contentID,
  } = await getContentItem<MyComponentFields>({
    contentID: module.contentid,
    languageCode,
  })

  return (
    <section data-agility-component={contentID}>
      {/* Use fields here */}
    </section>
  )
}
```

## Components Fixed

All of these components were updated to use the correct pattern:
- ✅ BlogListing
- ✅ BlogDetails
- ✅ CareerTimeline
- ✅ UsesSection
- ✅ Hero
- ✅ BasicMarkdown (created correctly from the start)

## Lesson Learned

When working with Agility CMS components:
1. **Always fetch content items** - Don't assume `module.fields` exists
2. **Look at working examples** - The `RichTextArea` component was right there showing the pattern
3. **Pay attention to type names** - `UnloadedModuleProps` literally means the module isn't loaded yet!
4. **Test early** - This would have been caught immediately if I'd tested the components

---

## Technical Details (Written by Cursor AI Agent)

### The Agility CMS Component Architecture

In Agility CMS, there's an important distinction between:

1. **Component Models** - The definition/schema of a component (fields, types, etc.)
2. **Component Instances** - Actual instances of components added to pages
3. **Content Items** - The data stored for each instance

When a component is added to a page in Agility CMS:
- A content item is created with a unique `contentID`
- The page stores a reference to this `contentID` in its zones
- When rendering, the `module` object contains `module.contentid` (the reference)
- The actual fields must be fetched using `getContentItem()`

### The `UnloadedModuleProps` Type

The `UnloadedModuleProps` type from `@agility/nextjs` indicates that the module data hasn't been loaded yet. The component receives:

```typescript
{
  module: {
    contentid: number  // Reference to the content item
    // No fields here!
  },
  languageCode: string,
  // ... other props
}
```

### Why `getContentItem` is Required

The `getContentItem` function:
- Fetches the content item from Agility CMS API
- Includes proper caching with Next.js cache tags
- Returns the full content item with fields populated
- Handles localization based on `languageCode`

### Correct Implementation Pattern

```typescript
// 1. Import the utility
import { getContentItem } from "@/lib/cms/getContentItem"

// 2. Define your fields interface
export interface MyComponentFields {
  title: string
  description?: string
}

// 3. Fetch in the component
const MyComponent = async ({ module, languageCode }: UnloadedModuleProps) => {
  const {
    fields: { title, description },
    contentID,
  } = await getContentItem<MyComponentFields>({
    contentID: module.contentid,
    languageCode,
  })

  // 4. Use the fields and contentID
  return (
    <section data-agility-component={contentID}>
      <h2 data-agility-field="title">{title}</h2>
      {description && <p data-agility-field="description">{description}</p>}
    </section>
  )
}
```

### Cache Tags

The `getContentItem` function automatically adds Next.js cache tags in the format:
- `agility-content-{contentID}-{languageCode}`

This enables proper cache invalidation when content is updated in Agility CMS.

### Error Handling

If a content item doesn't exist or can't be fetched, `getContentItem` will throw an error. Components should handle this appropriately (e.g., using `notFound()` for required content).

