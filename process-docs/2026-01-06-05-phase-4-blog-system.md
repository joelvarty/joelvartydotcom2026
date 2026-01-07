# Phase 5: About & Career Pages

**Date**: January 27, 2026
**Phase**: Phase 5 - About & Career Pages
**Status**: Completed

> **Note**: This post is written from Joel's perspective (first person "I" = Joel). Technical details sections are clearly marked as written by the AI agent (Cursor - Claude Code).

Phase 5 was actually pretty straightforward since most of the heavy lifting was already done. The CareerTimeline component was already created in Phase 3, and the CareerEntry content model already existed in Agility CMS. I just needed to polish things up and make sure everything works together.

## What We Had

The CareerTimeline component was already built, but it was using basic image tags and simple HTML rendering for the markdown content. Since we'd just built the markdown processor with gallery support in Phase 4, it made sense to update the career timeline to use the same system.

## What We Improved

The agent updated the CareerTimeline component to:
- Use AgilityPic for company logos (instead of regular img tags)
- Use the markdown processor for career entry descriptions (so I can use galleries in career entries if I want)
- Better responsive image handling

The component already had a nice timeline design with alternating left/right layout on desktop, so we kept that. It looks clean and professional.

## About Page

The About page will be created in Agility CMS using the existing components:
- Hero component for the intro section
- RichTextArea or Markdown component for the main content
- CareerTimeline component to show my career history

Since pages are managed in Agility CMS, I'll create the About page there and add these components to it. The layout is already set up, so it's just a matter of adding content.

## The Result

The career timeline now uses the same optimized image system as the rest of the site, and I can use markdown with galleries in career entries if I want to show project screenshots or other images. The About page will be simple to set up once I add the content in Agility CMS.

---

## Technical Details (Written by Cursor - Claude Code)

### Implementation Overview

Phase 5 focused on completing the About & Career pages functionality. The CareerTimeline component already existed but needed updates to use the new markdown processor and AgilityPic component.

### CareerTimeline Component Updates

**File**: `src/components/agility-components/CareerTimeline.tsx`

**Changes Made**:
1. **AgilityPic Integration**: Replaced `<img>` tags with `<AgilityPic>` component for company logos
   - Added responsive image sources for high-DPI displays
   - Fallback width of 64px for mobile
   - Proper alt text handling

2. **Markdown Processing**: Replaced simple HTML rendering with `processMarkdown()` function
   - Enables gallery support in career entry descriptions
   - Full markdown parsing with proper typography
   - Consistent with blog post content rendering

**Code Changes**:
```typescript
// Before
<img src={entry.fields.logo.url} alt={...} />

// After
<AgilityPic
  image={entry.fields.logo}
  fallbackWidth={64}
  className="h-10 w-10 rounded-full object-cover"
  sources={[...]}
/>
```

```typescript
// Before
dangerouslySetInnerHTML={{
  __html: entry.fields.markdown.replace(/\n/g, "<br />"),
}}

// After
{processMarkdown(entry.fields.markdown)}
```

### CareerEntry Content Model

**Model ID**: 10
**Model Name**: Career Entry

**Fields**:
- `company` (Text) - Company name
- `title` (Text) - Job title
- `startDate` (Date) - Start date
- `endDate` (Date, optional) - End date
- `markdown` (Text) - Markdown content for description
- `logo` (ImageAttachment) - Company logo
- `currentRole` (Boolean) - Whether this is the current role

**Container**: CareerEntries (List, shared)

### About Page Structure

The About page will be created in Agility CMS using the "Main" page model with the following components:

1. **Hero Component** - Introduction section with title and subtitle
2. **RichTextArea or Markdown Component** - Main about content
3. **CareerTimeline Component** - Career history timeline

All components are already created and registered in the component registry.

### Component Registry

All components are registered in `src/components/agility-components/index.ts`:
- `CareerTimeline` - Maps to "CareerTimeline" module name in Agility CMS
- `Hero` - Maps to "Hero" module name
- `RichTextArea` - Maps to "RichTextArea" module name

### Timeline Design

The CareerTimeline component features:
- **Responsive Layout**: Single column on mobile, alternating left/right on desktop
- **Timeline Line**: Vertical line connecting all entries
- **Timeline Dots**: Circular indicators with company logos
- **Card Design**: Each entry in a card with border and shadow
- **Date Formatting**: Formatted as "Month Year - Month Year" or "Month Year - Present"
- **Markdown Support**: Full markdown rendering with gallery support

### Performance Considerations

- AgilityPic handles logo optimization automatically
- Markdown processing happens server-side
- Timeline layout uses CSS transforms for smooth rendering
- Responsive images reduce bandwidth on mobile devices

### Next Steps

The About page can be created in Agility CMS by:
1. Creating a new page with path `/about`
2. Using the "Main" page model
3. Adding Hero, RichTextArea/Markdown, and CareerTimeline components to the "main" zone
4. Populating content in each component

The Career page can be created similarly, focusing primarily on the CareerTimeline component.

