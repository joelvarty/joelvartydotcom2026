# Upgrading the Career Timeline with 8star Labs

**Date:** January 6, 2026
**Author:** Joel Varty (with technical details by Cursor AI Agent)

## The Change

I decided to upgrade the career timeline component to use a more polished, professional timeline from 8star Labs. The original custom timeline was functional, but I wanted something with better visual hierarchy and a more refined look.

## Why 8star Labs?

8star Labs offers a collection of beautifully designed components that are shadcn/ui compatible. Their Timeline component caught my eye because it:

- Has a cleaner, more modern design
- Better visual hierarchy with proper spacing
- Built-in connector lines and icons
- Fully accessible and responsive
- Easy to customize with Tailwind classes

## The Implementation

The upgrade was straightforward thanks to shadcn's CLI. I just ran:

```bash
npx shadcn@latest add @8starlabs-ui/timeline
```

This installed the Timeline component and all its dependencies. Then I updated the CareerTimeline component to use the new Timeline primitives:

- `Timeline` - The main container (default export)
- `TimelineItem` - Individual timeline entries
- `TimelineItemDate` - Displays the date range
- `TimelineItemTitle` - The job title
- `TimelineItemDescription` - The company, dates, and description

The component now has a much cleaner structure and better visual presentation. The timeline automatically handles the connector lines, alternating sides, and spacing, making it easier to maintain.

## What Changed

**Before:**
- Custom timeline with manual positioning
- Complex flex layouts for alternating sides
- Manual connector line positioning
- More CSS to maintain

**After:**
- Clean component-based structure
- Automatic connector handling
- Better responsive behavior
- Less custom CSS needed

The data structure and CMS integration remained the same - only the presentation layer changed.

## Joel's Thoughts / Reflections

_[Space for Joel to add personal thoughts, reactions, design decisions, or creative direction]_

---

## Technical Details (Written by Cursor AI Agent)

### Installation

The 8star Labs Timeline component was installed using the shadcn CLI:

```bash
npx shadcn@latest add @8starlabs-ui/timeline --yes
```

This command:
1. Fetched the component from the `@8starlabs-ui` registry
2. Installed it to `src/components/ui/timeline.tsx`
3. Added any required dependencies

### Component Structure

The Timeline component from 8star Labs provides these primitives:

```typescript
Timeline          // Main container component
├── TimelineItem  // Individual timeline entry
    ├── TimelineConnector  // Line connecting to next item
    ├── TimelineHeader     // Container for icon and content
    │   ├── TimelineIcon   // Icon/badge area
    │   ├── TimelineTitle // Main title text
    │   └── TimelineDescription // Supporting text
    └── TimelineConnector  // Line to next item (if not last)
```

### Implementation Details

**File:** `src/components/agility-components/CareerTimeline.tsx`

**Key Changes:**

1. **Imports:**
   ```typescript
   import Timeline, { TimelineItem, TimelineItemDate, TimelineItemTitle, TimelineItemDescription } from "@/components/ui/timeline"
   ```
   Note: `Timeline` is the default export, others are named exports.

2. **Timeline Configuration:**
   ```typescript
   <Timeline orientation="vertical" alternating={true} vertItemSpacing={80}>
   ```
   - `orientation="vertical"` - Vertical timeline layout
   - `alternating={true}` - Alternates items on left/right sides
   - `vertItemSpacing={80}` - Spacing between items in pixels

3. **Structure:**
   - Wrapped all entries in `<Timeline>` component
   - Each entry is a `<TimelineItem>` (automatically handles connectors and positioning)
   - `<TimelineItemDate>` displays the date range as a string
   - `<TimelineItemTitle>` displays the job title
   - `<TimelineItemDescription>` contains company name and markdown content

4. **Logo Handling:**
   - If logo exists, displays using `AgilityPic` component above the timeline item
   - Logo is shown as a circular image with border
   - Maintains responsive image sources for performance

5. **Date Formatting:**
   - Changed from "short" month format to "long" for better readability
   - Maintains "Present" for current roles
   - Date range is passed as a string to `TimelineItemDate`

6. **Markdown Content:**
   - Still processes markdown in the description area
   - Uses prose classes for proper typography

### Benefits

1. **Less Code:** The component structure is cleaner and more declarative
2. **Better Accessibility:** Built-in ARIA attributes and semantic HTML
3. **Responsive:** Better mobile behavior out of the box
4. **Maintainable:** Less custom CSS to maintain
5. **Consistent:** Uses the same design system as other shadcn components

### Registry Information

The 8star Labs registry is part of the shadcn/ui directory: https://ui.shadcn.com/docs/directory

To add components from this registry:
```bash
npx shadcn@latest add @8starlabs-ui/<component-name>
```

### References

- [8star Labs Timeline Documentation](https://ui.8starlabs.com/docs/components/timeline)
- [shadcn/ui Directory](https://ui.shadcn.com/docs/directory)
- [8star Labs Registry](https://ui.8starlabs.com)

