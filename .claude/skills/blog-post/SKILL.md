---
name: blog-post
description: Use when the user says "create a blog post on joelvarty.com" or wants to create/publish a new blog post for Joel Varty's website. Handles image uploads, gallery creation, categories, tags, and series using Agility CMS.
allowed-tools: mcp__Agility-CMS__*, Bash, Read, Write
---

# Blog Post Creation Skill

Create blog posts for joelvarty.com using Agility CMS.

## Instance Configuration

- **Instance GUID**: `e9a21a52-u`
- **Locale**: `en-us`
- **Posts Container**: `Posts`

## Available Categories

| Content ID | Name | Description |
|------------|------|-------------|
| 18 | Football | Posts about football - the game, tactics, analysis, and fandom |
| 19 | Work | Posts about work, career, professional development, and workplace thoughts |
| 17 | 3rd Spaces | Third spaces - places that are neither home nor work, but where you connect with others (sports, theatre, gym, etc.) |
| 104 | Gear and Gadgets | Tech and gadgets that make it easier or more fun to experience and capture life |

To get the current list, call:
```
mcp__Agility-CMS__get_content_items(instanceGuid: "e9a21a52-u", referenceName: "Categories", locale: "en-us")
```

## Available Tags

| Content ID | Name |
|------------|------|
| 20 | sports |
| 21 | theatre |
| 22 | coding |
| 23 | leadership |
| 69 | ai |

To get the current list, call:
```
mcp__Agility-CMS__get_content_items(instanceGuid: "e9a21a52-u", referenceName: "Tags", locale: "en-us")
```

## Available Series

Query for current series:
```
mcp__Agility-CMS__get_content_items(instanceGuid: "e9a21a52-u", referenceName: "BlogSeries", locale: "en-us")
```

## Blog Post Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | Text | No | Post title |
| `Slug` | Text | Yes | URL slug (generate from title) |
| `excerpt` | LongText | No | Short summary |
| `publishedDate` | Date | Yes | Format: YYYY-MM-DD |
| `categoryID` | Integer | Yes | Set automatically via Category linked field |
| `tagIDs` | Text | Yes | Comma-separated IDs (e.g., "22,69") |
| `seriesID` | Integer | No | Set automatically via series linked field |
| `featuredImage` | ImageAttachment | No | Main post image |
| `Content` | Text | Yes | Markdown body |

## Complete Workflow

### Step 1: Gather Information

Ask the user for:
1. **Title** - Post title
2. **Content** - Main content (text or dictated)
3. **Category** - Football, Work, or 3rd Spaces
4. **Tags** - Which tags apply
5. **Series** (optional) - If part of a series
6. **Images** (optional) - Images to include

### Step 2: Upload Images (if provided)

For each image the user attaches:

1. **Initialize upload:**
```
mcp__Agility-CMS__initialize_media_upload({
  instanceGuid: "e9a21a52-u",
  fileName: "descriptive-name.jpg",
  folderPath: "blog-images"
})
```

2. **Upload the file** using curl to the returned `uploadUrl`:
```bash
curl -X POST "<uploadUrl>" -F "file=@/path/to/image.jpg"
```

3. **Capture the CDN URL** from the response for use in content.

### Step 3: Select Featured Image

When multiple images are provided without explicit featured image selection:

1. **Analyze the images** to determine the best candidate:
   - Prefer the image that best represents the post topic
   - Prefer landscape orientation for header display
   - Prefer images with clear subjects and good composition

2. **Tell the user** which image was selected and why

3. **Default**: If unable to analyze, use the first image

### Step 4: Create Gallery Markdown

Insert galleries in the Content field using this syntax:

**Carousel (slideshow):**
```
```gallery:carousel
https://cdn.agilitycms.com/image1.jpg "Caption 1"
https://cdn.agilitycms.com/image2.jpg "Caption 2"
```
```

**Grid (columns):**
```
```gallery:grid:columns-3
https://cdn.agilitycms.com/image1.jpg "Caption 1"
https://cdn.agilitycms.com/image2.jpg "Caption 2"
```
```

**Masonry:**
```
```gallery:masonry
https://cdn.agilitycms.com/image1.jpg "Caption 1"
https://cdn.agilitycms.com/image2.jpg "Caption 2"
```
```

**Other types:** `gallery:thumbnail`, `gallery:stacked`, `gallery:comparison` (2 images only), `gallery:tabs`

### Step 5: Save the Blog Post

```
mcp__Agility-CMS__save_content_items({
  instanceGuid: "e9a21a52-u",
  locale: "en-us",
  items: [{
    contentID: -1,
    referenceName: "Posts",
    fields: {
      title: "Post Title",
      Slug: "post-slug",
      excerpt: "Short summary of the post",
      publishedDate: "2026-01-13",
      categoryID: 19,
      tagIDs: "22,69",
      Content: "# Heading\n\nMarkdown content with galleries...",
      featuredImage: {
        url: "https://cdn.agilitycms.com/...",
        label: "Alt text describing the image"
      }
    }
  }]
})
```

### Step 6: Confirm Success

After saving, inform the user:
- Content ID of the new post
- Title and slug
- Which image was used as featured
- **Preview link**: `https://joelvarty.com/blog/blog-details?ContentID={contentID}&lang=en-us&agilitypreviewkey=3nk7vbaxfaImYdOFex4jVGKQKwyExoMI2ucw4906nxwWLt1CvMpqCoOOUr1y9kjnpkmfVhFxCMwDb1ieY6leRQ%3d%3d&agilityts={YYYYMMDDHHMMSS}`
- **Edit link**: `https://app.agilitycms.com/instance/e9a21a52-u/en-us/content/list-11/listitem-{contentID}`

Replace `{contentID}` with the actual content ID and `{YYYYMMDDHHMMSS}` with the current timestamp (e.g., `20260114044115`).

## Creating New Categories or Tags

If a needed category or tag doesn't exist:

**New Category:**
```
mcp__Agility-CMS__save_content_items({
  instanceGuid: "e9a21a52-u",
  locale: "en-us",
  items: [{
    contentID: -1,
    referenceName: "Categories",
    fields: {
      name: "Category Name",
      slug: "category-slug",
      description: "Optional description"
    }
  }]
})
```

**New Tag:**
```
mcp__Agility-CMS__save_content_items({
  instanceGuid: "e9a21a52-u",
  locale: "en-us",
  items: [{
    contentID: -1,
    referenceName: "Tags",
    fields: {
      name: "tagname",
      slug: "tagname"
    }
  }]
})
```

## Writing Style Guide

Write in Joel's voice, which is:

**Tone:**
- Conversational and authentic, like talking to a friend
- Personal and reflective, sharing real experiences
- Grounded in concrete details (names, places, specific moments)
- Builds to emotional insights naturally

**Structure:**
- Let sentences run longer when the thought flows that way
- Short paragraphs mixed with longer ones for natural pacing
- Use parenthetical asides (like this) to add personality
- Avoid starting multiple sentences with "And"
- Minimal use of em-dashes (use them sparingly)

**Voice patterns:**
- "Here's the thing..." or "Look at that..."
- Specific names and places create authenticity
- Stories build to moments of connection or realization
- Use italics for genuine emphasis on key words, not decoration
- Questions to the reader feel natural: "You know what I mean?"

**Category and Tag Usage:**
- Only assign categories that truly fit the post content
- Only use existing tags that genuinely apply
- NEVER force a post into a category just because one exists
- If no category fits perfectly, ask the user which one makes most sense
- Same for tags - only include relevant ones

**Series Assignment:**
- ONLY assign to a series if the user explicitly says so
- Don't suggest series membership - let the user decide
- If unsure, leave series blank

## Example Session

**User:** "Create a blog post about my coffee shop visit" *[attaches 4 images]*

**Claude:**
1. Uploads all 4 images to Agility CMS CDN
2. Analyzes images, selects best one for featured (e.g., the latte art photo)
3. Generates title: "A Perfect Afternoon at Third Space Coffee"
4. Generates slug: "perfect-afternoon-third-space-coffee"
5. Writes engaging excerpt in Joel's voice
6. Creates markdown content with a carousel gallery, using Joel's authentic conversational style
7. Suggests category: "3rd Spaces" (ID: 17) - because it genuinely fits
8. Suggests only tags that truly apply based on content
9. Does NOT assign to series unless user specified
10. Saves the post
11. Reports: "Created blog post with content ID 123. Featured image: latte art photo (best composition for header)."

## Important Notes

- Use `contentID: -1` for new items
- `Slug` must be unique
- `publishedDate` format: `YYYY-MM-DD`
- `tagIDs`: comma-separated, no spaces (e.g., "20,22,69")
- Always provide alt text in `featuredImage.label`
- Gallery captions go in quotes after the URL
