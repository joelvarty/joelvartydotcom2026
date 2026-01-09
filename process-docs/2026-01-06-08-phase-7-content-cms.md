# Phase 7: Content & CMS Integration

**Date**: January 6, 2026
**Phase**: Phase 7 - Content & CMS Integration
**Status**: Ready for Manual Completion

> **Note**: This post is written from Joel's perspective (first person "I" = Joel). Technical details sections are clearly marked as written by the AI agent (Cursor - Claude Code).

Phase 7 is about populating the CMS with content and creating the actual pages. Most of this work needs to be done manually in Agility CMS, but the agent has prepared everything needed.

## What's Ready

All the components, models, and infrastructure are in place:
- BlogPost model exists
- CareerEntry model exists
- Category and Tag models exist
- All component models are created
- Containers are set up
- Pages can be created using the "Main" page model

## What Needs to Be Done

I'll need to:
1. Create the UsesItem content model (if not already created)
2. Populate content in the CMS:
   - Blog posts
   - Career entries
   - Uses items
   - Categories and tags
3. Create pages in Agility CMS:
   - Homepage (already has BlogListing)
   - /about page
   - /career page
   - /uses page
   - Individual blog post pages (dynamic)
4. Configure webhooks for revalidation
5. Test content updates and revalidation

The revalidation API route is already set up at `/api/revalidate`, so webhooks just need to be configured in Agility CMS to point to that endpoint.

## The Result

Once content is populated and pages are created, the site will be fully functional. All the technical infrastructure is ready - it's just a matter of adding content and creating pages in the CMS.

## Visual Reference: Page Structure in Agility CMS

Here's what the homepage looks like in the Agility CMS interface, showing how components are organized in the page structure:

![Homepage Page Structure](https://cdn.agilitycms.com/j0i5uycg/posts/agility-homepage-structure.png)

This screenshot shows the homepage page editor in Agility CMS, displaying the "MainContent" zone with the BlogListing component. This is how pages are assembled in the CMS - you select a page model, then add and configure components in the defined content zones. Each component can be configured with its specific settings and content.

---

## Technical Details (Written by Cursor - Claude Code)

### Implementation Status

Phase 7 focuses on content population and page creation in Agility CMS. The technical infrastructure is complete, but content creation requires manual work in the Agility CMS interface.

### Existing Infrastructure

**Content Models** (Verified via MCP):
- Blog Post (ID: 8)
- Career Entry (ID: 10)
- Category (ID: 12)
- Tag (ID: 13)

**Containers** (Verified via MCP):
- Posts (ID: 11) - Blog posts container
- Categories (ID: 9) - Categories container
- Tags (ID: 10) - Tags container
- Career Entries (ID: 12) - Career entries container

**Component Models** (Created):
- BlogListing
- BlogDetails
- CareerTimeline
- UsesSection
- Hero
- RichTextArea

**Page Models**:
- Main (created manually by user)

### Content Model Requirements

**UsesItem Model** (To Be Created):
- `name` (Text, required)
- `description` (LongText, optional)
- `link` (Link, optional)
- `affiliateLink` (Link, optional)
- `image` (ImageAttachment, optional)
- `category` (LinkedContentDropdown → Category model)
- `categoryID` (Integer, hidden) - Stores category ID
- `categoryName` (Text, hidden) - Stores category name

**Container**: UsesItems (List, shared) - To be created

### Page Creation Checklist

**Homepage** (`/`):
- ✅ Already created with BlogListing component
- Can add Hero component for intro section

**About Page** (`/about`):
- Create page using "Main" page model
- Add Hero component (optional intro)
- Add RichTextArea or Markdown component (main content)
- Add CareerTimeline component (career history)

**Career Page** (`/career`):
- Create page using "Main" page model
- Add CareerTimeline component
- Optional: Add Hero component for page title

**Uses Page** (`/uses`):
- Create page using "Main" page model
- Add UsesSection component
- Optional: Add Hero component for page title

**Blog Pages**:
- `/blog` - Already created with BlogListing component
- `/blog/blog-details` - Template page for dynamic blog posts
- Individual blog post pages will be created as dynamic pages referencing BlogPost content items

### Webhook Configuration

**Revalidation Endpoint**: `/api/revalidate`

**Webhook Setup in Agility CMS**:
1. Go to Settings → Webhooks in Agility CMS
2. Create new webhook
3. URL: `https://yourdomain.com/api/revalidate`
4. Events: Content Published, Page Published
5. Method: POST
6. Headers: Add `Content-Type: application/json`

**Webhook Payload**:
The revalidation route expects:
```json
{
  "state": "Published",
  "instanceGuid": "...",
  "languageCode": "en-us",
  "referenceName": "Posts",
  "contentID": 123,
  "pageID": 456
}
```

### Revalidation Route

**File**: `src/app/api/revalidate/route.ts`

**Functionality**:
- Receives webhook from Agility CMS
- Revalidates Next.js cache tags
- Revalidates specific paths when content changes
- Handles both content and page updates

**Cache Tags**:
- Content: `agility-content-{referenceName}-{locale}`
- Pages: `agility-page-{pageID}-{locale}`
- Sitemaps: `agility-sitemap-flat-{locale}`, `agility-sitemap-nested-{locale}`

### Content Population Strategy

**Categories** (Required for Testing):
1. "3rd spaces" - Posts about third spaces (community gathering spots)
2. "football" - Posts about football (the beautiful game)
3. "work" - Posts about work and career

**Tags** (Required for Testing):
1. "sports" - Sports-related content
2. "theatre" - Theatre-related content
3. "coding" - Coding and development
4. "leadership" - Leadership and management
5. (5th tag TBD - user specified 5 tags but only listed 4)

**Blog Posts** (Minimum for Testing):
1. Create categories first (see above)
2. Create tags (see above)
3. Create 3-5 sample blog posts with:
   - Title, Slug, Excerpt
   - Featured image (optional for testing)
   - Markdown content (can include gallery syntax for testing)
   - Link to one category (dropdown)
   - Link to 1-3 tags (search list box)
   - Published date
   - **Sample topics**: Mix of the three categories to test filtering

**Career Entries**:
1. Create career entries with:
   - Company name
   - Job title
   - Start date, end date (or mark as current role)
   - Company logo (optional)
   - Markdown description (can include galleries)

**Uses Items**:
1. Create categories (e.g., "Software", "Hardware", "Tools")
2. Create uses items with:
   - Name
   - Description
   - Link (optional)
   - Affiliate link (optional)
   - Image/icon (optional)
   - Category (linked)

### Testing Checklist

Once content is populated:
- [ ] Verify blog posts display correctly
- [ ] Test blog post detail pages
- [ ] Verify career timeline displays correctly
- [ ] Test uses page with categories
- [ ] Test RSS feed (`/blog/rss.xml`)
- [ ] Verify revalidation works (publish content, check cache)
- [ ] Test preview mode
- [ ] Verify all images load correctly
- [ ] Test responsive design on mobile/tablet/desktop
- [ ] Verify dark mode works correctly

### Manual Steps Required

1. **Create UsesItem Model** (if not exists):
   - Go to Content Models in Agility CMS
   - Create new model "UsesItem"
   - Add fields as specified above
   - Link category field to Category model

2. **Create UsesItems Container**:
   - Go to Content → Containers
   - Create new container "UsesItems"
   - Set as List, Shared
   - Link to UsesItem model

3. **Populate Content**:
   - Add blog posts to Posts container
   - Add career entries to Career Entries container
   - Add uses items to UsesItems container
   - Create categories and tags

4. **Create Pages**:
   - Create /about page
   - Create /career page
   - Create /uses page
   - Verify /blog and /blog/blog-details pages

5. **Configure Webhooks**:
   - Set up webhook in Agility CMS
   - Point to revalidation endpoint
   - Test webhook delivery

### Files Ready

All technical infrastructure is complete:
- ✅ Revalidation API route
- ✅ Preview mode routes
- ✅ All component models
- ✅ All content models (except UsesItem - needs creation)
- ✅ RSS feed
- ✅ Markdown processor with gallery support
- ✅ All React components

### Next Steps

1. Create UsesItem model and container in Agility CMS
2. Populate content (blog posts, career entries, uses items)
3. Create pages in Agility CMS
4. Configure webhooks
5. Test everything
6. Run Lighthouse audit (Phase 8 - pending)

