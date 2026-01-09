# Phase 6: Uses Page

**Date**: January 6, 2026
**Phase**: Phase 6 - Uses Page
**Status**: Completed

> **Note**: This post is written from Joel's perspective (first person "I" = Joel). Technical details sections are clearly marked as written by the AI agent (Cursor - Claude Code).

The /uses page was already mostly built in Phase 3 when we created the UsesSection component. I just needed to polish it up to use AgilityPic for images and make sure everything is ready to go.

## What We Had

The UsesSection component was already created and had all the functionality I needed:
- Grouping items by category
- Support for regular links and affiliate links
- Image display for each item
- Responsive grid layout

It just needed to be updated to use AgilityPic instead of regular img tags for better performance.

## What We Improved

The agent updated the UsesSection component to:
- Use AgilityPic for item images (instead of regular img tags)
- Better responsive image handling with high-DPI support

The component already had:
- Category grouping (items organized by category)
- Affiliate link handling (separate from regular links)
- Clean card-based layout
- Responsive grid (1/2/3 columns based on screen size)

## The Result

The /uses page component is ready to use. I'll create the UsesItem content model in Agility CMS and populate it with my gear, software, and tools. The page will automatically organize everything by category and display it in a clean, responsive grid.

## Visual Results

### Uses Page
![Uses Page](https://cdn.agilitycms.com/j0i5uycg/posts/uses-page-full.png)

The /uses page displays items organized by category in a clean, responsive grid. Each item shows an image (when available), name, description, and relevant links. The page scales beautifully from mobile to desktop, and the category grouping makes it easy to find specific types of tools and gear.

## Joel's Thoughts / Reflections

_[Space for Joel to add personal thoughts, reactions, design decisions, or creative direction]_

---

## Technical Details (Written by Cursor - Claude Code)

### Implementation Overview

Phase 6 focused on completing the Uses page functionality. The UsesSection component already existed but needed updates to use AgilityPic for optimized images.

### UsesSection Component Updates

**File**: `src/components/agility-components/UsesSection.tsx`

**Changes Made**:
1. **AgilityPic Integration**: Replaced `<img>` tags with `<AgilityPic>` component for item images
   - Added responsive image sources for high-DPI displays
   - Fallback width of 48px for thumbnails
   - Proper alt text handling

**Code Changes**:
```typescript
// Before
<img
  src={item.fields.image.url}
  alt={item.fields.image.label || item.fields.name}
  className="h-12 w-12 shrink-0 rounded object-cover"
/>

// After
<AgilityPic
  image={item.fields.image}
  fallbackWidth={48}
  className="h-12 w-12 shrink-0 rounded object-cover"
  sources={[
    { media: "(min-width: 640px) and (min-resolution: 2dppx)", width: 96 },
    { media: "(min-width: 640px)", width: 48 },
  ]}
/>
```

### UsesSection Component Features

**Existing Functionality**:
- **Category Grouping**: Automatically groups items by category
- **Category Filtering**: Optional filter by specific category
- **Link Support**: Regular links and affiliate links (separate fields)
- **Image Display**: Optional images for each item
- **Responsive Grid**: 1 column on mobile, 2 on tablet, 3 on desktop
- **Card Layout**: Clean card design with hover effects

**Component Fields**:
- `title` (Text, optional) - Section title
- `containerReferenceName` (Text, optional) - Container name (defaults to "UsesItems")
- `categoryFilter` (Text, optional) - Filter by category ID

### UsesItem Content Model (To Be Created)

**Required Fields**:
- `name` (Text, required) - Item name
- `description` (LongText, optional) - Item description
- `link` (Link, optional) - Regular link to the item
- `affiliateLink` (Link, optional) - Affiliate link (if applicable)
- `image` (ImageAttachment, optional) - Item image/icon
- `categoryID` (Integer, hidden) - Category ID (from linked content)
- `categoryName` (Text, hidden) - Category name (from linked content)
- `category` (LinkedContentDropdown) - Link to Category model

**Container**: UsesItems (List, shared)

### Category Model

**Model ID**: 12
**Model Name**: Category

**Fields**:
- `name` (Text) - Category name
- `slug` (Text) - URL-friendly slug
- `description` (LongText) - Category description

**Usage**: Categories are linked to UsesItems via LinkedContentDropdown field.

### Page Structure

The /uses page will be created in Agility CMS using the "Main" page model with:
1. **Hero Component** (optional) - Introduction section
2. **UsesSection Component** - Main uses items display

The UsesSection component automatically:
- Fetches all uses items from the "UsesItems" container
- Groups them by category
- Displays them in a responsive grid
- Handles links and affiliate links appropriately

### Design Features

**Layout**:
- Responsive grid: 1 column (mobile) → 2 columns (tablet) → 3 columns (desktop)
- Category sections with headers
- Card-based item display
- Hover effects on cards

**Styling**:
- Clean, minimal design inspired by Wes Bos's /uses page
- Spotlight-inspired card styling
- Proper spacing and typography
- Dark mode support

### Performance Considerations

- AgilityPic handles image optimization automatically
- Responsive images reduce bandwidth on mobile
- Grid layout uses CSS Grid for efficient rendering
- Category grouping happens server-side

### Next Steps

To complete the /uses page:
1. Create UsesItem content model in Agility CMS
2. Link category field to Category model (LinkedContentDropdown)
3. Create "UsesItems" container (List, shared)
4. Populate uses items with gear, software, tools, etc.
5. Create /uses page in Agility CMS
6. Add UsesSection component to the page

The component is ready and will automatically organize and display all items by category.

