# Testing Content Requirements

**Date**: January 6, 2026
**Phase**: Phase 7 & 9 - Content & Testing
**Status**: In Progress

> **Note**: This post is written from Joel's perspective (first person "I" = Joel). Technical details sections are clearly marked as written by the AI agent (Cursor - Claude Code).

To properly test the site, we need actual content in Agility CMS. I've specified what content we need to create so we can test all the features properly.

## Content Requirements

### Blog Categories (3 required)
I want to write about three main topics:
1. **"3rd spaces"** - Places that are neither home nor work, but serve as important community gathering spots
2. **"football"** - The beautiful game, tactics, analysis, and fandom
3. **"work"** - Work, career, professional development, and workplace thoughts

### Blog Tags (5 required)
I specified 5 tags but only listed 4, so we'll need to figure out the 5th one:
1. **"sports"** - Sports-related content
2. **"theatre"** - Theatre-related content
3. **"coding"** - Coding and development
4. **"leadership"** - Leadership and management
5. (TBD - need to decide on 5th tag)

### Sample Blog Posts
We need at least 3-5 sample blog posts to test:
- Blog listing page displays correctly
- Blog detail pages work
- Category filtering
- Tag filtering
- RSS feed generation
- Markdown processing
- Gallery functionality

### Career Entries
We need 2-3 career entries to test:
- CareerTimeline component
- Date formatting
- Markdown rendering in career entries
- Logo display

### Uses Items
We need 5-10 uses items organized by categories to test:
- UsesSection component
- Category grouping
- Link and affiliate link handling
- Image display

## What's Been Created

The agent created the categories and tags in Agility CMS using the MCP server. Now we have:
- ✅ 3 categories created
- ✅ 4 tags created (5th TBD)

Next steps are to create sample blog posts, career entries, and uses items so we can properly test everything.

---

## Technical Details (Written by Cursor - Claude Code)

### Content Created

**Categories** (Container: Categories, ID: 9):
1. "3rd spaces" (slug: "3rd-spaces")
2. "football" (slug: "football")
3. "work" (slug: "work")

**Tags** (Container: Tags, ID: 10):
1. "sports" (slug: "sports")
2. "theatre" (slug: "theatre")
3. "coding" (slug: "coding")
4. "leadership" (slug: "leadership")
5. (5th tag TBD - user specified 5 but only listed 4)

### Content Models Verified

**Category Model** (ID: 12):
- `name` (Text)
- `slug` (Text)
- `description` (LongText)

**Tag Model** (ID: 13):
- `name` (Text)
- `slug` (Text)

### Testing Content Checklist

**For Blog System Testing**:
- [ ] 3-5 blog posts with:
  - Mix of categories (at least one post per category)
  - Mix of tags (posts with 1-3 tags each)
  - Featured images (some with, some without)
  - Markdown content with gallery syntax (at least one post)
  - Published dates (various dates for sorting tests)
  - Excerpts

**For Career Timeline Testing**:
- [ ] 2-3 career entries with:
  - Company names
  - Job titles
  - Start/end dates (mix of current and past roles)
  - Company logos (some with, some without)
  - Markdown descriptions

**For Uses Page Testing**:
- [ ] 5-10 uses items with:
  - Mix of categories (Software, Hardware, Tools, etc.)
  - Names and descriptions
  - Links (some with, some without)
  - Affiliate links (some with, some without)
  - Images/icons (some with, some without)

**For Page Testing**:
- [ ] /about page with Hero and CareerTimeline components
- [ ] /career page with CareerTimeline component
- [ ] /uses page with UsesSection component
- [ ] Verify /blog page exists
- [ ] Verify /blog/blog-details template page exists

### MCP Operations Used

**Categories Created**:
```json
[
  {
    "contentID": -1,
    "referenceName": "Categories",
    "fields": {
      "name": "3rd spaces",
      "slug": "3rd-spaces",
      "description": "Posts about third spaces..."
    }
  },
  // ... football and work categories
]
```

**Tags Created**:
```json
[
  {
    "contentID": -1,
    "referenceName": "Tags",
    "fields": {
      "name": "sports",
      "slug": "sports"
    }
  },
  // ... theatre, coding, leadership tags
]
```

### Next Steps

1. Create sample blog posts (3-5 minimum)
2. Create career entries (2-3 minimum)
3. Create uses items (5-10 minimum)
4. Create /about, /career, /uses pages
5. Run E2E tests
6. Run Lighthouse audit
7. Fix any issues found

### Files Updated

- `DEVELOPMENT-PLAN.md` - Added specific content requirements to Phase 7
- Created categories and tags via MCP server

