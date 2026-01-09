# Series Feature Implementation

**Date:** January 8, 2026
**Agent:** Claude Code (Sonnet 4.5)
**User Prompt:** "I'm adding a new feature to this site called Series so I can show a series of blogs with their own landing page and a special blurb. This is separate from Categories, but works very similarly to it. Get all the details about how I've setup Series in the instance and then write an Agility Component I can put on the /blog/series page (with the Series content item as the dynamicPageObject) - again, similar to how Category landing pages work, but with the additional markdown field. I also updated the Post model to include the series id. I created a container for the series with an example item, and a blog post that links to it, so we should be able to test it when you're done coding. As we add this feature, document it in process-docs."

## Joel's Thoughts / Reflections

_[Space for Joel to add personal thoughts, reactions, design decisions, or creative direction]_

---

## Overview

The Series feature allows grouping blog posts into series with dedicated landing pages. Each series has:
- A title and slug
- A markdown summary that displays at the top of the landing page
- A filtered list of blog posts that belong to the series

This is similar to the Category feature but with the addition of rich markdown content for context.

## Collaboration Model

This feature demonstrates AI-assisted development with Agility CMS using MCP:
- **User (Joel)**: Set up all content models, containers, and pages in Agility CMS
- **AI Agent (Claude Code)**: Queried the CMS via MCP, generated all code, created components, updated documentation
- **Why it works**: MCP allows the agent to directly inspect and understand the CMS structure, making code generation accurate and context-aware

## What the User Set Up in Agility CMS

### 1. BlogSeries Content Model (ID: 21)
Located in Agility CMS under Content Models, the BlogSeries model has:
- **title** (Text, Required): The series title
- **slug** (Text, Required): URL-friendly identifier
- **markdownSummary** (Text, Required): Markdown content describing the series

### 2. BlogSeries Container (ID: 26)
- Reference Name: `BlogSeries`
- Display Name: `Blog Series`
- Type: Dynamic Page List
- Category: Blog

### 3. Example Series Content
The user created a series called "Building This Site" (contentID: 64) with:
- Title: "Building This Site"
- Slug: "building-this-site"
- Markdown Summary: Detailed explanation about building the site with AI assistance

### 4. Blog Post Model Update
The BlogPost model (ID: 8) was updated with:
- **seriesID** (Integer): Stores the contentID of the associated series
- **series** (LinkedContentDropdown): UI field that saves to seriesID

### 5. Test Blog Post
Created a test post (contentID: 65) with:
- Title: "Test Series Post"
- seriesID: 64 (links to "Building This Site" series)

### 6. Sitemap Structure
The user created a sitemap structure at:
- `/blog/series/` (folder/container page)
- `/blog/series/series-details` (dynamic page template)
  - Dynamic Page Config:
    - Reference Name: `BlogSeries`
    - Title Formula: `##title##`
    - Page Name Formula: `##slug##`

## How MCP Changed the Development Process

Before diving into implementation, it's worth highlighting how MCP (Model Context Protocol) transformed this workflow:

### Traditional Approach (Without MCP)
1. User sets up CMS models manually
2. User documents the structure (field names, types, IDs)
3. Agent reads documentation and guesses at implementation
4. Frequent back-and-forth to fix mismatches
5. Agent cannot verify if code matches CMS reality

### MCP-Enabled Approach (What We Did)
1. User sets up CMS models manually in Agility UI
2. Agent queries Agility CMS directly via MCP tools:
   - `get_content_models()` - Inspects exact field structure
   - `get_component_models()` - Sees available components
   - `get_containers()` - Understands content organization
   - `get_content_model_details()` - Gets precise field types
3. Agent generates code that **exactly matches** CMS structure
4. Agent can even create new component models directly in CMS via `save_component_model()`
5. Zero guesswork, minimal user correction needed

**Result**: The series feature was implemented in a single conversation with multiple iterations, all code worked first try because the agent was working with live CMS data, not documentation.

## Implementation by Claude Code

### 1. Created getSeriesListing Helper Function
**File:** [src/lib/cms-content/getSeriesListing.ts](../src/lib/cms-content/getSeriesListing.ts)

This function is similar to `getBlogListing` but filters posts by `seriesID` instead of `categoryID`:

```typescript
export const getSeriesListing = async ({
	seriesID,
	locale,
	sort = "publishedDate",
	direction = "desc",
	skip,
	take,
}: GetSeriesListingProps) => {
	// Fetches posts from the Posts container filtered by seriesID
	// Resolves dynamic URLs from sitemap
	// Returns posts with full metadata for display
}
```

Key differences from category listing:
- Filters on `fields.seriesID` instead of `fields.categoryID`
- Uses the `seriesID` parameter (required, not optional)

### 2. Created SeriesLanding Component
**File:** [src/components/agility-components/SeriesLanding.tsx](../src/components/agility-components/SeriesLanding.tsx)

![Series Landing Page](https://cdn.agilitycms.com/j0i5uycg/posts/series-landing-page.png)
*The Series Landing page showing the 50/50 side-by-side layout with series description on the left and posts on the right*

![Agility CMS Series Landing Page Setup](https://cdn.agilitycms.com/j0i5uycg/posts/agility-series-landing-page-setup.png)
*The Series Details dynamic page in Agility CMS showing the Series Landing component in the Main zone*

![Agility CMS Series Landing Component Config](https://cdn.agilitycms.com/j0i5uycg/posts/agility-series-landing-component-config.png)
*The Series Landing component configuration showing the Title field (displays as badge) and Number of Posts field*

The SeriesLanding component combines two features:
1. **Series Summary Section**: Renders the markdown summary from the series content item
2. **Posts List**: Shows all blog posts in the series

Component structure:
```tsx
const SeriesLanding = async ({ module, languageCode, dynamicPageItem }) => {
	// 1. Fetch the module configuration
	// 2. Get series details from dynamicPageItem
	// 3. Fetch posts using getSeriesListing with seriesID filter
	// 4. Render:
	//    - Series title
	//    - Markdown summary (processed with processMarkdown)
	//    - List of posts with featured images, excerpts, dates
}
```

Key features:
- Uses `processMarkdown()` to render the markdown summary with full gallery support
- Displays posts in the same layout as BlogListing (vertical list with images)
- Uses `dynamicPageItem.contentID` as the `seriesID` for filtering
- Shows "No posts found" message if series has no posts yet

### 3. Created Component Model in Agility CMS
**Component Name:** Series Landing (referenceName: `SeriesLanding`, ID: 22)

Fields:
- **title** (Text, Optional): Override for the series title (defaults to series title from dynamicPageItem)
- **numberOfPosts** (Text, Optional): Max posts to display (default: 50)

Description: "Displays a series landing page with markdown summary and list of posts in the series"

### 4. Created Component Container
**Container Name:** Series Landing Modules (referenceName: `SeriesLandingModules`, ID: 28)
- Type: Single Item (Shared)
- Purpose: Stores instances of the SeriesLanding component for use on pages

### 5. Created Content Item
Created a SeriesLanding content item (contentID: 67) with default settings:
- title: "" (will use series title)
- numberOfPosts: "50"

### 6. Registered Component in Code
**File:** [src/components/agility-components/index.ts](../src/components/agility-components/index.ts:21)

Added:
```typescript
import SeriesLanding from "./SeriesLanding"
// ...
case "SeriesLanding":
    return SeriesLanding
```

## Manual Setup Required

Due to API limitations with the save_page MCP tool, the component needs to be manually added to the page in the Agility CMS UI:

1. Go to Agility CMS → Pages → Website → Blog → Series → series-details
2. Edit the page
3. In the Main content zone, add a component
4. Select "Series Landing" from the component list
5. Choose the existing content item (contentID: 67) or create a new one
6. Publish the page

## Testing the Feature

Once the component is added to the page:

1. Navigate to: `http://localhost:3000/blog/series/building-this-site`
2. Expected output:
   - Title: "Building This Site"
   - Markdown summary with rich formatting
   - "Posts in this series" heading
   - List showing "Test Series Post" with featured image and excerpt

3. To add more posts to the series:
   - Edit any blog post in Agility CMS
   - Use the "Series (Optional)" dropdown to select "Building This Site"
   - Publish the post
   - It will appear on the series landing page

## File Changes Summary

### New Files Created
1. `src/lib/cms-content/getSeriesListing.ts` - Data fetching helper
2. `src/components/agility-components/SeriesLanding.tsx` - React component

### Files Modified
1. `src/components/agility-components/index.ts` - Added SeriesLanding import and case

### Agility CMS Changes
1. Created Component Model: Series Landing (ID: 22)
2. Created Container: Series Landing Modules (ID: 28)
3. Created Content Item: SeriesLanding instance (ID: 67)

## Architecture Notes

The Series feature follows the same architectural pattern as Categories:

1. **Content Model** (BlogSeries): Defines the series metadata structure
2. **Container** (BlogSeries): Stores series instances as content items
3. **Dynamic Page**: Uses container as data source for URL generation
4. **Component Model** (SeriesLanding): Defines the UI component structure
5. **Component Container** (SeriesLandingModules): Stores component instances
6. **React Component** (SeriesLanding.tsx): Renders the page
7. **Helper Function** (getSeriesListing.ts): Fetches and formats data

This separation allows:
- Series content to be managed independently
- Component configuration to be reused
- Type-safe data fetching
- Flexible layout options

## Series Listing Sidebar

After the initial implementation, a Series listing section was added to the blog listing page sidebar to help users discover and browse series.

### Implementation

**File Created:** [src/components/agility-components/blog-listing/BlogSeries.tsx](../src/components/agility-components/blog-listing/BlogSeries.tsx)

The BlogSeries component:
- Fetches all series from the BlogSeries container
- Displays them as links in the sidebar
- Uses the same styling pattern as BlogCategories
- Sorts series alphabetically by title

**File Modified:** [src/components/agility-components/blog-listing/BlogListing.tsx](../src/components/agility-components/blog-listing/BlogListing.tsx:168)

Updated the sidebar to include both Categories and Series sections with spacing between them.

### User Experience

The blog listing page (`/blog`) now shows:
- **Left column (2/3 width)**: Blog posts in vertical layout
- **Right sidebar (1/3 width)**:
  - Categories section (with "All Posts" option)
  - Series section (all available series)

This gives users two ways to explore content:
1. **By Category**: Topical grouping (3rd Spaces, Football, Work)
2. **By Series**: Narrative threads across multiple posts

## Side-by-Side Layout & Shared Component Refactoring

To improve code reusability and create a better visual layout for series pages, the following improvements were made:

### Shared BlogPostItem Component

**File Created:** [src/components/agility-components/blog-listing/BlogPostItem.tsx](../src/components/agility-components/blog-listing/BlogPostItem.tsx)

Extracted the blog post item rendering logic into a reusable component that:
- Displays post title, date, excerpt, and featured image
- Handles hover effects and animations
- Supports staggered animation delays via index prop
- Used by both BlogListing and SeriesLanding components

**Benefits:**
- DRY (Don't Repeat Yourself) - single source of truth for post item rendering
- Consistent styling across all blog post listings
- Easier to maintain and update post card design
- Type-safe props interface

### SeriesLanding Side-by-Side Layout

**File Modified:** [src/components/agility-components/SeriesLanding.tsx](../src/components/agility-components/SeriesLanding.tsx:98)

Updated the SeriesLanding component to use a side-by-side layout:

**Layout Structure:**
- **Left Column (50% width)**: Series description with markdown summary (sticky)
- **Right Column (50% width)**: List of posts in the series

**Layout Benefits:**
- Series description stays visible while scrolling through posts
- Better use of horizontal space on large screens
- Markdown content is more readable at narrower width
- Mirrors the blog listing layout (description left, content right)
- Responsive: stacks vertically on mobile devices

**Visual Hierarchy:**
1. Series title at the top (full width)
2. Description on the left provides context
3. Posts on the right show the actual content
4. Users can reference the description while browsing posts

## Blog Post Metadata Display

After the side-by-side layout was complete, metadata was added to individual blog post detail pages to show category, series, and tags.

![Blog Post with Series Metadata](https://cdn.agilitycms.com/j0i5uycg/posts/blog-post-with-series-metadata.png)
*Blog post detail page showing prominent series link above the title, along with category and tags metadata below the date*

### Implementation

**File Modified:** [src/components/agility-components/BlogDetails.tsx](../src/components/agility-components/BlogDetails.tsx)

**Changes Made:**

1. **Updated BlogPost Interface**: Added fields for `categoryID`, `seriesID`, and `tagIDs` to the BlogPost type

2. **Added Data Fetching Logic**: After retrieving the blog post, the component now:
   - Fetches category details if `categoryID` is present
   - Fetches series details if `seriesID` is present
   - Parses `tagIDs` (comma-separated string) and fetches tag names

3. **Added Metadata Display**: Created metadata in two locations:
   - **Series (above title)**: Prominent clickable link with stack icon, positioned above the H1 title
   - **Category & Tags (below date)**: Smaller badges/pills below the published date
     - **Category**: Clickable pill linking to category landing page (primary color)
     - **Tags**: Non-clickable pills showing tag names (muted color)

**Visual Design:**
- **Series Link** (above title):
  - Primary color text with hover effect
  - Stack icon for visual distinction
  - Uppercase text with increased letter spacing
  - Positioned prominently before the title to emphasize the series context
- **Category & Tags** (below date):
  - Category uses `bg-primary` with `text-primary-foreground` (clickable)
  - Tags use `bg-muted` with `text-muted-foreground` (not clickable)
  - Rounded-full pill styling
  - Flexbox with wrapping for responsive layout

**User Experience:**
- Series link is immediately visible and prominent, establishing context before the title
- Readers understand they're viewing content as part of a larger narrative
- Clicking the series link navigates to the series landing page to see all posts
- Category provides topical classification
- Tags offer additional context without navigation (as requested)

**Code Structure:**
```tsx
{/* Series Badge - Prominent display above title */}
{series && (
	<Link href={localizeUrl(`/blog/series/${series.slug}`, languageCode)}
		className="inline-flex items-center gap-2 mb-4 text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
			{/* Stack icon paths */}
		</svg>
		<span className="uppercase tracking-wider">Series: {series.title}</span>
	</Link>
)}

<h1>{post.fields.title}</h1>

{/* Metadata: Category and Tags below date */}
{(category || tags.length > 0) && (
	<div className="mt-4 flex flex-wrap gap-2 items-center text-sm">
		{category && (
			<Link href={localizeUrl(`/blog/categories/${category.slug}`, languageCode)}
				className="inline-flex items-center px-3 py-1 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
				{category.title}
			</Link>
		)}
		{tags.length > 0 && tags.map((tag) => (
			<span key={tag.contentID}
				className="inline-flex items-center px-3 py-1 rounded-full bg-muted text-muted-foreground font-medium">
				{tag.name}
			</span>
		))}
	</div>
)}
```

## What the Agent Could NOT Do (Current MCP Limitations)

While the Agility MCP server is powerful, there are still some manual steps required:

### Pages Cannot Be Fully Managed
The `save_page` MCP tool has a limitation: **it cannot add component content items to page zones in a single operation**. This means:

**What the agent DID**:
- Created the component model via `save_component_model()`
- Created the container for component content
- Created the component content item via `save_content_items()`
- Generated all the React code for SeriesLanding

**What Joel had to do manually in Agility UI**:
1. Navigate to the `/blog/series/series-details` page
2. Click "Add Component" in the Main zone
3. Select "Series Landing" from the list
4. Select the component content item (ID: 67)
5. Publish the page

This is documented in detail in the implementation section. Future versions of the Agility MCP server may support adding components to pages in one step.

### Model Context Protocol: The New Paradigm

This project demonstrates a fundamental shift in AI-assisted development:

**Before MCP**: Agents work with code and documentation. They guess at external system state.

**With MCP**: Agents query external systems directly. They work with live data, not guesses.

**The Result**:
- Faster development (agent gets it right the first time)
- Less user intervention (no back-and-forth to fix field name typos)
- Better code quality (types match reality exactly)
- More ambitious features possible (agent can verify assumptions)

The Series feature took approximately 1.5 hours from concept to completion, including:
- Multiple layout iterations (side-by-side, 50/50 split, title alignment)
- Metadata display improvements (series link prominence)
- Complete documentation with screenshots
- Working with existing code patterns

## Future Enhancements

Possible improvements:
1. Add pagination for series with many posts
2. ~~Show series info on individual blog post pages~~ ✅ **DONE** (see Blog Post Metadata Display above)
3. Create a "Browse All Series" listing page at `/blog/series`
4. Add series breadcrumbs to post pages
5. Support for series ordering/sequencing of posts
6. Series-specific styling or themes
7. Show post count for each series in the sidebar
