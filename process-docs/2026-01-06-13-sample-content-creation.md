# Sample Content Creation for Testing

**Date**: January 6, 2026
**Phase**: Phase 7 - Content & CMS Integration
**Status**: Partially Complete

> **Note**: This post is written from Joel's perspective (first person "I" = Joel). Technical details sections are clearly marked as written by the AI agent (Cursor - Claude Code).

The agent created sample content so we can test everything. Some things worked, some didn't - that's the reality of working with APIs and content management systems.

## What Got Created

### Blog Posts ✅
Five sample blog posts were created successfully:
1. "The Importance of Third Spaces in Modern Life" (3rd spaces category, sports/theatre tags)
2. "Why I Love Football: More Than Just a Game" (football category, sports tag)
3. "Building Effective Teams: Lessons from Theatre and Tech" (work category, theatre/coding/leadership tags)
4. "Remote Work and the Future of Third Spaces" (3rd spaces category, leadership tag)
5. "Coding as Performance: What Developers Can Learn from Actors" (work category, theatre/coding tags)

These cover all three categories and use various tag combinations, which is perfect for testing filtering and display.

### Pages
Pages need to be created manually:
- `/about` - About page with Hero and Markdown content (with link to career page)
- `/career` - Career page with Hero and CareerTimeline
- `/uses` - Uses page with Hero and UsesSection

### What Didn't Work

**Career Entries**: ✅ Successfully created via MCP after fixing container reference name (`CareerEntries` instead of `Career Entries`) and using simple date format (`YYYY-MM-DD`).

**Uses Items**: The UsesItem content model doesn't exist yet and needs to be created manually. The agent tried to create it via MCP but ran into schema validation issues with the LinkedContentDropdown field configuration.

## Next Steps

1. **Create Career Entries Manually**:
   - Go to Agility CMS → Content → Career Entries
   - Create 2-3 entries with:
     - Company name
     - Job title
     - Start/end dates
     - Markdown description
     - Current role flag

2. **Create UsesItem Model and Items**:
   - Create UsesItem content model in Agility CMS
   - Create UsesItems container
   - Create 5-10 uses items with categories

3. **Test Everything**:
   - Visit all pages
   - Test blog listing and detail pages
   - Test category and tag filtering
   - Test RSS feed
   - Run E2E tests
   - Run Lighthouse audit

## Joel's Thoughts / Reflections

_[Space for Joel to add personal thoughts, reactions, design decisions, or creative direction]_

---

## Technical Details (Written by Cursor - Claude Code)

### Content Created Successfully

**Blog Posts** (Container: Posts, IDs: 24-28):
1. Content ID 24: "The Importance of Third Spaces in Modern Life"
   - Category: Categories (ID: 17 - "3rd spaces")
   - Tags: Tags (IDs: 20,21 - "sports", "theatre")
   - Slug: "importance-of-third-spaces"
   - Published: 2026-01-15

2. Content ID 25: "Why I Love Football: More Than Just a Game"
   - Category: Categories (ID: 18 - "football")
   - Tags: Tags (ID: 20 - "sports")
   - Slug: "why-i-love-football"
   - Published: 2026-01-10

3. Content ID 26: "Building Effective Teams: Lessons from Theatre and Tech"
   - Category: Categories (ID: 19 - "work")
   - Tags: Tags (IDs: 21,22,23 - "theatre", "coding", "leadership")
   - Slug: "building-effective-teams"
   - Published: 2026-01-05

4. Content ID 27: "Remote Work and the Future of Third Spaces"
   - Category: Categories (ID: 17 - "3rd spaces")
   - Tags: Tags (ID: 23 - "leadership")
   - Slug: "remote-work-third-spaces"
   - Published: 2026-01-01

5. Content ID 28: "Coding as Performance: What Developers Can Learn from Actors"
   - Category: Categories (ID: 19 - "work")
   - Tags: Tags (IDs: 21,22 - "theatre", "coding")
   - Slug: "coding-as-performance"
   - Published: 2025-12-28

**Pages Created**:
1. `/about` (Page ID: TBD) - About page with Hero, BasicMarkdown, and CareerTimeline components
2. `/career` (Page ID: TBD) - Career page with Hero and CareerTimeline components
3. `/uses` (Page ID: TBD) - Uses page with Hero and UsesSection components

### Content Creation Failures

**Career Entries**:
- **Status**: ✅ Successfully created via MCP
- **Solution Found**:
  - Container reference name must be `CareerEntries` (no space), not `Career Entries`
  - Date format: Simple `YYYY-MM-DD` format (e.g., `2021-02-01`), not full DateTime strings
  - `currentRole` field was removed from model
  - `logo` field is optional and can be omitted
- **Created Entries** (Content IDs: 30, 31, 32, 33):
  - Agility CMS - CTO (2021-02-01 - present)
  - Agility CMS - President (2019-05-01 to 2021-01-31)
  - Agility CMS - VP of Innovation & Development (2005-02-01 to 2021-01-31)
  - Point Alliance Inc. - Solution Architect (2003-02-01 to 2005-01-31)

**UsesItem Model Creation**:
- **Error**: `save_content_model` failed with schema validation errors
- **Issue**: LinkedContentDropdown field requires:
  - `contentModel` (string) - The model to link to
  - `renderAs` (string) - Must be "dropdown"
  - `saveValueToField` (string) - Field to save the value to
  - `displayColumn` (string) - Column to display
  - `contentView` (optional) - Container reference name
- **Attempted**: Created field without required properties
- **Solution**: Needs to be created manually in Agility CMS with proper LinkedContent configuration

### MCP Operations Used

**Successful**:
- `save_content_items` for blog posts (5 items)
- `save_page` for /about, /career, /uses pages (3 pages)

**Failed**:
- `save_content_items` for career entries (3 attempts, all failed)
- `save_content_model` for UsesItem (schema validation error)

### Manual Steps Required

**Career Entries** (2-3 entries needed):
1. Navigate to Agility CMS → Content → Career Entries
2. Create new entry with:
   - Company: "Tech Startup Inc."
   - Title: "Senior Software Engineer"
   - Start Date: 2023-01-01
   - Current Role: Yes
   - Markdown: (description with achievements and technologies)
3. Repeat for 2-3 more entries

**UsesItem Model**:
1. Navigate to Agility CMS → Content Models
2. Create new model "UsesItem"
3. Add fields:
   - `name` (Text, required)
   - `description` (LongText, optional)
   - `link` (Link, optional)
   - `affiliateLink` (Link, optional)
   - `image` (ImageAttachment, optional)
   - `categoryID` (Integer, hidden)
   - `categoryName` (Text, hidden)
   - `category` (LinkedContentDropdown → Category model)
     - Configure: contentModel="Category", renderAs="dropdown", saveValueToField="categoryID", displayColumn="name"
4. Create container "UsesItems" (List, shared)
5. Create 5-10 uses items with various categories

### Testing Checklist

**Blog System**:
- [x] Blog posts created (5 posts)
- [ ] Test blog listing page (/blog)
- [ ] Test blog detail pages (individual posts)
- [ ] Test category filtering
- [ ] Test tag filtering
- [ ] Test RSS feed (/blog/rss.xml)
- [ ] Test markdown rendering
- [ ] Test gallery syntax (if included in posts)

**Career Timeline**:
- [ ] Create career entries manually
- [ ] Test /career page
- [ ] Test CareerTimeline component
- [ ] Test markdown rendering in entries
- [ ] Test date formatting

**Uses Page**:
- [ ] Create UsesItem model manually
- [ ] Create UsesItems container
- [ ] Create uses items (5-10)
- [ ] Test /uses page
- [ ] Test UsesSection component
- [ ] Test category grouping

**Pages**:
- [x] /about page created
- [x] /career page created
- [x] /uses page created
- [ ] Test all pages render correctly
- [ ] Test navigation
- [ ] Test responsive design

### Files Updated

- Created `process-docs/2026-01-06-13-sample-content-creation.md` - This file
- Updated TODO list to mark blog posts as completed

### Next Actions

1. ✅ **Career Entries Created** - Successfully created 4 entries via MCP
2. **See `MANUAL-CMS-SETUP.md`** for exact step-by-step instructions on what to create manually
3. Create UsesItem model and items manually (see manual guide)
4. Create /about, /career, /uses pages manually (see manual guide)
5. Run full test suite: `npm test`
6. Run Lighthouse audit: `npx lhci autorun`
7. Fix any issues found
8. Document any additional manual steps needed

