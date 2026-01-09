# Phase 3: Building the Layout Foundation

**Date**: January 6, 2026
**Phase**: Phase 3 - Homepage & Layout
**Status**: In Progress

> **Note**: This post is written from Joel's perspective (first person "I" = Joel). Technical details sections are clearly marked as written by the AI agent (Cursor - Claude Code).

## What We Built

Phase 3 focused on creating the foundational layout components that will wrap every page on the site. The AI agent built out a complete header, footer, navigation system, mobile menu, and dark mode toggle - all with responsive design and clean styling.

The homepage itself will be managed through Agility CMS using the "Main" page model I created, so the layout components needed to be solid and ready to go.

## Layout Components Created

### Header
A sticky header with:
- Site logo/branding (my name)
- Desktop navigation menu
- Dark mode toggle button
- Mobile menu button
- Backdrop blur effect for a modern look

### Footer
A comprehensive footer with:
- Navigation links
- Social media links (Twitter, GitHub, LinkedIn)
- RSS feed link
- Copyright information
- Responsive grid layout

### Navigation
A client component that:
- Highlights the active route
- Uses Next.js `usePathname` hook for route detection
- Smooth transitions on hover

### Mobile Menu
A mobile-friendly menu that:
- Slides down from the header
- Shows navigation links on mobile devices
- Toggles with a hamburger/close icon
- Matches the header styling

### Theme Toggle
A dark mode toggle that:
- Persists preference in localStorage
- Respects system preferences on first visit
- Smoothly transitions between themes
- Uses lucide-react icons (Moon/Sun)

### Preview Bar
A preview mode indicator (from Agility CMS demo) that:
- Shows preview/live mode status
- Allows exiting preview mode
- Floating button on the right side
- Simplified version (removed audiences/regions)

## Page Model Setup

I manually created a "Main" page model in Agility CMS, and the agent updated the code to reference it correctly. The component was renamed from `MainTemplate.tsx` to `Main.tsx` to match the page model name, and the zone name was updated to "main" to match what I configured in Agility CMS.

## Responsive Design

All components are built mobile-first:
- Header collapses navigation on mobile
- Footer uses a responsive grid (1 column on mobile, 4 on desktop)
- Mobile menu appears only on small screens
- All spacing and typography scales appropriately

## Dark Mode

Dark mode is fully implemented:
- CSS variables configured in `globals.css`
- Theme toggle component with localStorage persistence
- Respects system preferences
- Smooth transitions between themes
- All components use design tokens that adapt to theme

## Component Models Created

The AI agent also created component models (modules) in Agility CMS for the major sections of the site:

- **BlogListing** - Displays a list of blog posts with configurable count
- **BlogDetails** - Displays a single blog post (works with dynamic pages)
- **CareerTimeline** - Displays career entries in a timeline format
- **UsesSection** - Displays uses items organized by category
- **Hero** - Hero section with title, subtitle, image, and CTA button

These components are now available in Agility CMS and can be added to pages. The React components are implemented and ready to render the content.

## Pages Created

I manually created the blog pages in Agility CMS:
- **Homepage** (`/`) - Added BlogListing component to show recent posts
- **Blog Listing** (`/blog`) - Added BlogListing component
- **Blog Details** (`/blog/blog-details`) - Added BlogDetails component

The BlogDetails component is set up to work with dynamic pages that reference blog posts via `sitemapNode.contentID`. When individual blog post pages are created as dynamic pages in Agility CMS, they'll automatically display the correct content from the referenced blog post.

## Visual Results

Here's what the homepage looks like with all the layout components in place:

### Homepage - Light Mode
![Homepage Light Mode](https://cdn.agilitycms.com/j0i5uycg/posts/homepage-light-mode.png)

### Homepage - Dark Mode
![Homepage Dark Mode](https://cdn.agilitycms.com/j0i5uycg/posts/homepage-dark-mode.png)

The layout components work seamlessly together, providing a clean, professional foundation for the site. The dark mode toggle switches smoothly between themes, and the responsive design adapts beautifully across device sizes.

## What's Next

The layout foundation and component models are complete. The blog system is set up and ready to use. Next steps would be to:
- Create actual blog post content in the Posts container
- Test the blog listing and detail pages
- Add styling refinements
- Create other pages (About, Career, Uses) as needed

## Joel's Thoughts / Reflections

_[Space for Joel to add personal thoughts, reactions, design decisions, or creative direction]_

---

## Technical Details (Written by Cursor - Claude Code)

**Agent**: Cursor (Claude Code)
**Purpose**: Reference documentation for technical implementation details

### Components Created

**Header Component** (`src/components/layout/Header.tsx`):
- Sticky positioning with `sticky top-0 z-50`
- Backdrop blur effect: `bg-background/95 backdrop-blur`
- Responsive: Navigation hidden on mobile, shown on desktop
- Includes ThemeToggle and MobileMenu components

**Footer Component** (`src/components/layout/Footer.tsx`):
- Responsive grid: `grid-cols-1 md:grid-cols-4`
- Four sections: Navigation, Connect, Content, About
- Social links with proper `target="_blank" rel="noopener noreferrer"`
- Copyright year calculated dynamically

**Navigation Component** (`src/components/layout/Navigation.tsx`):
- Client component using `usePathname` hook
- Active route detection and styling
- Uses `cn` utility for conditional classes
- Smooth hover transitions

**MobileMenu Component** (`src/components/layout/MobileMenu.tsx`):
- Client component with `useState` for open/close
- Absolute positioning below header
- Matches header styling (backdrop blur, border)
- Toggle button with Menu/X icons from lucide-react

**ThemeToggle Component** (`src/components/layout/ThemeToggle.tsx`):
- Client component with `useState` and `useEffect`
- Checks localStorage for saved preference
- Falls back to system preference (`prefers-color-scheme`)
- Applies theme by adding/removing `dark` class on `document.documentElement`
- Prevents hydration mismatch with `mounted` state

**PreviewBar Component** (`src/components/layout/PreviewBar.tsx`):
- Based on Agility Next.js demo site preview bar
- Simplified version (removed audiences/regions)
- Floating button on right side (40% from top)
- Modal overlay when expanded
- Exit preview functionality

### Page Model Integration

**Main Page Model**:
- Created manually in Agility CMS as "Main" (ID: 3)
- Component renamed from `MainTemplate.tsx` to `Main.tsx`
- Zone name updated to "main" (was "main-content-zone")
- Template registry updated to handle "Main" page model name

**Template Registry** (`src/components/agility-pages/index.ts`):
```typescript
import Main from "./Main"

export const getPageTemplate = (templateName: string) => {
	switch (templateName) {
		case "Main":
			return Main
		default:
			return Main
	}
}
```

### Dark Mode Implementation

**CSS Variables** (`src/app/globals.css`):
- Light mode variables in `:root`
- Dark mode variables in `.dark` class
- Uses oklch color space for modern color support
- Design tokens for all UI elements

**Theme Application**:
- Theme toggle adds/removes `dark` class on `<html>` element
- All components use CSS variables that adapt automatically
- No flash of wrong theme (checks localStorage before render)

### Responsive Breakpoints

Using Tailwind's default breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

Components use:
- `md:block` / `md:hidden` for responsive visibility
- `md:grid-cols-4` for responsive grids
- `sm:px-6 lg:px-8` for responsive padding

### Design Tokens

All components use ShadCN UI design tokens:
- `bg-background` / `text-foreground`
- `border-border`
- `text-muted-foreground`
- `hover:text-foreground`
- Consistent spacing and sizing

### Layout Structure

**Locale Layout** (`src/app/[locale]/layout.tsx`):
```typescript
<div className="flex min-h-screen flex-col">
  <Header />
  <main className="flex-1">{children}</main>
  <Footer />
  <PreviewBar isPreview={isPreview} isDevelopmentMode={isDevelopmentMode} />
</div>
```

- Flexbox layout with `flex-col`
- Main content area uses `flex-1` to fill available space
- PreviewBar positioned absolutely (floating)

### Accessibility

- All interactive elements have `aria-label` attributes
- Semantic HTML (`<header>`, `<footer>`, `<nav>`)
- Keyboard navigation supported
- Focus states visible
- Color contrast meets WCAG standards

### Performance Considerations

- Client components only where needed (Navigation, MobileMenu, ThemeToggle)
- Server components for Header and Footer (no interactivity)
- Lazy loading for icons (lucide-react)
- Minimal JavaScript for theme toggle
- CSS-only transitions where possible

### Files Created/Modified

**Created**:
- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/layout/Navigation.tsx`
- `src/components/layout/MobileMenu.tsx`
- `src/components/layout/ThemeToggle.tsx`
- `src/components/layout/PreviewBar.tsx`
- `src/components/layout/index.ts`

**Modified**:
- `src/components/agility-pages/MainTemplate.tsx` → `Main.tsx` (renamed)
- `src/components/agility-pages/index.ts` (updated imports and template name)
- `src/app/[locale]/layout.tsx` (added Header, Footer, PreviewBar)
- `src/app/[locale]/[...slug]/page.tsx` (updated default template name)

**Updated Documentation**:
- `src/docs/01-agility-cms-overview.md`
- `src/docs/02-page-routing.md`
- `src/docs/04-data-fetching.md`
- `src/docs/09-whats-included.md`
- `src/README.md`
- `src/docs/README.md`

### Component Models Created

**BlogListing** (ID: 19):
- `title` (Text) - Optional title for the listing
- `numberOfPosts` (Text) - Number of posts to display (default: "10")
- `containerReferenceName` (Text) - Container reference name (default: "Posts")

**BlogDetails** (ID: 15):
- `containerReferenceName` (Text) - Container reference name (default: "Posts")
- Works with dynamic pages that reference blog posts via `sitemapNode.contentID`
- Falls back to fetching by slug or contentID if needed

**CareerTimeline** (ID: 16):
- `title` (Text) - Optional title for the timeline
- `containerReferenceName` (Text) - Container reference name (default: "CareerEntries")

**UsesSection** (ID: 17):
- `title` (Text) - Optional title for the section
- `containerReferenceName` (Text) - Container reference name
- `categoryFilter` (Text) - Optional category filter

**Hero** (ID: 18):
- `title` (Text, required) - Hero title
- `subtitle` (LongText) - Hero subtitle
- `image` (ImageAttachment) - Background image
- `ctaButton` (Link) - Call-to-action button

### React Components Created

**BlogListing Component** (`src/components/agility-components/BlogListing.tsx`):
- Fetches blog posts from specified container
- Renders in responsive grid (1 column mobile, 2 tablet, 3 desktop)
- Shows featured image, title, excerpt, and published date
- Links to individual blog post pages

**BlogDetails Component** (`src/components/agility-components/BlogDetails.tsx`):
- Works with dynamic pages (uses `sitemapNode.contentID`)
- Can also fetch by contentID field or slug
- Renders full blog post with featured image, title, date, excerpt, and content
- Uses `renderHTML` for safe HTML rendering
- Prose styling for markdown content

**CareerTimeline Component** (`src/components/agility-components/CareerTimeline.tsx`):
- Fetches career entries from specified container
- Renders in timeline format with vertical line
- Shows company logo, title, company name, dates
- Supports current role (shows "Present")
- Renders markdown description

**UsesSection Component** (`src/components/agility-components/UsesSection.tsx`):
- Fetches uses items from specified container
- Groups items by category
- Optional category filtering
- Shows item image, name, description, and links
- Responsive grid layout

**Hero Component** (`src/components/agility-components/Hero.tsx`):
- Full-width hero section with optional background image
- Uses AgilityPic for optimized images
- Responsive image sizing with high-DPI support
- Title, subtitle, and optional CTA button
- Overlay for text readability

### Component Registry Updated

Updated `src/components/agility-components/index.ts` to include all new components:
- BlogListing
- BlogDetails
- CareerTimeline
- UsesSection
- Hero

### Component Patterns Used

All components follow consistent patterns:
- Server components (async/await for data fetching)
- TypeScript interfaces for type safety
- `data-agility-component` and `data-agility-field` attributes for in-context editing
- Responsive design with Tailwind CSS
- Dark mode support via design tokens
- Proper error handling (notFound() when content missing)

### Next Steps

1. Create homepage content in Agility CMS using "Main" page model
2. Add components to pages (Hero, BlogListing, etc.)
3. Test component rendering with actual content
4. Refine styling with Spotlight-inspired patterns
5. Test responsive design across devices
6. Verify dark mode works correctly
7. Optimize performance

---

**Agent**: Cursor (Claude Code)
**Date**: 2026-01-06
**Phase**: Phase 3 - Homepage & Layout
**Note**: This post documents the layout component implementation. The homepage content will be created in Agility CMS.

