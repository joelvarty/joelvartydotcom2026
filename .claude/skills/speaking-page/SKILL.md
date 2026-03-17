---
name: speaking-page
description: Use when the user wants to update Joel Varty's speaking page, upload speaking photos, add gallery images, or manage speaking history on joelvarty.com. Handles image uploads to Agility CMS CDN and markdown gallery syntax.
allowed-tools: mcp__Agility-CMS__*, Bash, Read, Write, Edit, Glob, Grep
---

# Speaking Page Management Skill

Manage the speaking page content and images for joelvarty.com.

## Instance Configuration

- **Instance GUID**: `e9a21a52-u`
- **CDN Base**: `https://cdn.agilitycms.com/j0i5uycg`
- **Image Upload Folder**: `speaking-images`

## Source File

The speaking page content lives as a markdown file. When the user references it, look for `joelvarty-speaking-page.md` in the current working directory or ask the user for the path.

## Image Upload Workflow

### Step 1: View the Images

Always read the images first using the Read tool. Claude can view JPEG/PNG files directly. This is essential for writing accurate captions and choosing gallery layout.

### Step 2: Initialize Uploads in Parallel

Call `mcp__claude_ai_Agility_CMS__initialize_media_upload` for every image at once:

```
mcp__claude_ai_Agility_CMS__initialize_media_upload({
  instanceGuid: "e9a21a52-u",
  fileName: "descriptive-name.jpg",
  folderPath: "speaking-images"
})
```

Use descriptive filenames based on event, year, and content. Examples:
- `aarhus-2024-content-models-title.jpg`
- `cms-connect-2025-idol-live-coding.jpeg`
- `cms-kickoff-2025-gutenberg.jpg`
- `fitc-2025-nextjs-demo.jpg`

### Step 3: Upload via curl in Parallel

```bash
curl -s -X POST "<uploadUrl>" -F "file=@/path/to/image.jpg"
```

**Important**: If filenames contain spaces, either ask the user to rename them or use proper shell quoting with the actual filename.

### Step 4: Capture CDN URLs

The CDN URL pattern is: `https://cdn.agilitycms.com/j0i5uycg/speaking-images/{fileName}`

## Gallery Markdown Syntax

Insert galleries in the markdown using fenced code blocks:

**Grid (most common for speaking photos):**

````
```gallery:grid:columns-3
https://cdn.agilitycms.com/j0i5uycg/speaking-images/image1.jpg "Caption 1"
https://cdn.agilitycms.com/j0i5uycg/speaking-images/image2.jpg "Caption 2"
https://cdn.agilitycms.com/j0i5uycg/speaking-images/image3.jpg "Caption 3"
```
````

**Carousel (slideshow):**

````
```gallery:carousel
https://cdn.agilitycms.com/j0i5uycg/speaking-images/image1.jpg "Caption 1"
https://cdn.agilitycms.com/j0i5uycg/speaking-images/image2.jpg "Caption 2"
```
````

**Other types:** `gallery:masonry`, `gallery:thumbnail`, `gallery:stacked`, `gallery:comparison` (2 images only), `gallery:tabs`

### Gallery Layout Guidelines

- **2 images**: Use `grid:columns-2`
- **3 images**: Use `grid:columns-3`
- **4 images**: Use `grid:columns-2` (2x2 grid)
- **5+ images**: Use `carousel` or `masonry`
- Place galleries immediately after the relevant year/event section in the speaking history
- Each year section can have its own gallery

### Caption Guidelines

- Include event name and year
- Describe what's happening: presenting, live demo, group photo, etc.
- Reference slide content if visible and relevant
- Keep captions concise but specific

## Speaking Page Structure

The markdown file follows this structure:

```
# Speaking
[intro paragraph]

## Talk Topics
[4 talk topic sections with descriptions and "Best for" tags]

## Complete Speaking History
### 2026
### 2025
[gallery after entries]
### 2024
[gallery after entries]
### 2023
[gallery after entries]
...

### Ongoing / Recurring
### Podcasts & Interviews
### Video Series (CMS Critic)
### Upcoming

## As Seen In
## The Details
[bios, AV needs, booking info]

## Book Me
[contact info]
```

## Adding New Speaking Entries

When adding a new speaking engagement:

1. Place it in the correct year section, ordered by date (newest first within the year)
2. Format: `- **Event Name** (Month Year, City) - "Talk Title" or description`
3. Bold the event name
4. Include location if known
5. If photos are provided, add a gallery block after all entries in that year section

## Key Details About Joel

- **Title**: CTO of Agility CMS (NOT President)
- **Based in**: Port Hope / GTA, Ontario, Canada
- **Company**: Agility CMS - bootstrapped, 21+ years, no VC funding
- **Key achievement**: CMS Idol 2025 Winner (live AI demo, audience vote, Montreal)
- **Recurring events**: Boye Aarhus (2023, 2024, 2025, invited 2026), FITC Toronto, CMS Experts Toronto, Boye CMS Kickoff

## Example: Adding Photos to a Year

User provides 3 photos from FITC 2025.

1. Read all 3 images to understand content
2. Initialize 3 uploads in parallel with descriptive names
3. Upload all 3 via curl in parallel
4. Add gallery block after the FITC 2025 entry:

````
```gallery:grid:columns-3
https://cdn.agilitycms.com/j0i5uycg/speaking-images/fitc-2025-ai-components.jpg "Presenting 'Real-Time AI Components in Next.js' at FITC Web Unleashed 2025"
https://cdn.agilitycms.com/j0i5uycg/speaking-images/fitc-2025-live-demo.jpg "Live demo at FITC Web Unleashed 2025, Toronto"
https://cdn.agilitycms.com/j0i5uycg/speaking-images/fitc-2025-audience.jpg "FITC Web Unleashed 2025"
```
````

## Important Notes

- Always view images before uploading to write accurate captions
- Batch all uploads in parallel for efficiency
- If filenames have spaces, ask the user to rename or handle quoting carefully
- Keep the speaking history chronologically ordered (newest year first, newest event first within year)
- Update the entry description if photos reveal more detail (e.g., "Attendee" to "Speaker" if photos show them presenting)
