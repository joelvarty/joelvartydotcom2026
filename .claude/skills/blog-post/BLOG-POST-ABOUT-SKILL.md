# How to Create a Claude AI Skill for Publishing Blog Posts to Agility CMS

Ever wished you could just tell an AI "create a blog post" and have it handle everything - uploading images, formatting galleries, selecting the best featured image, and publishing to your CMS? With Claude's Projects feature and the Agility CMS MCP server, you can do exactly that.

In this guide, I'll walk you through setting up a Claude Project that turns content creation into a simple conversation.

## What We're Building

By the end of this tutorial, you'll be able to:

- Say "create a blog post on my website" and have Claude create it in Agility CMS
- Attach multiple images and have Claude upload them, create galleries, and pick the best featured image
- Have Claude automatically handle categories, tags, and series relationships
- Get a direct link to edit the post in Agility CMS when it's done

## Prerequisites

- A Claude Pro, Team, or Max subscription (for Projects and MCP integrations)
- An Agility CMS account with API access
- The Agility CMS MCP server URL: `https://mcp.agilitycms.com/api/mcp`

## Step 1: Create a Claude Project

1. Go to [claude.ai](https://claude.ai)
2. Click **Projects** in the left sidebar
3. Click **Create project**
4. Give it a name like "My Blog" and a description of what you're trying to achieve

## Step 2: Connect the Agility CMS MCP Server

Once inside your project:

1. Click the **three dots menu** (⋯) near the project title
2. Look for **Connectors** or **Integrations**
3. Click **Add custom connector**
4. Enter the Agility CMS MCP server URL: `https://mcp.agilitycms.com/api/mcp`
5. Click **Configure** to authenticate with your Agility CMS account

## Step 3: Add the Domain to Your Allowlist

For Claude to upload images to Agility CMS, you need to allow the domain:

1. Go to your Claude **Settings** (click your profile icon)
2. Find **Code execution and file creation**
3. Under **Additional allowed domains**, add: `mcp.agilitycms.com`
4. Click **Add**

This allows Claude to upload files directly to the Agility CMS media library.

## Step 4: Create Your Project Instructions

This is where the magic happens. Click on **Instructions** in your project and add detailed instructions for Claude. Here's a template you can customize:

```markdown
# Blog Post Creation

When I say "create a blog post" or ask to publish content, use the Agility CMS MCP tools.

## Instance Configuration

- **Instance GUID**: `your-instance-guid`
- **Locale**: `en-us`
- **Posts Container**: `Posts`

## Categories

Use the `categoryID` field with these values:

| ID | Name |
|----|------|
| 1 | Technology |
| 2 | Business |
| 3 | Lifestyle |

## Tags

Use the `tagIDs` field (comma-separated IDs):

| ID | Name |
|----|------|
| 10 | tutorial |
| 11 | guide |
| 12 | tips |

## Blog Post Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | Text | Yes | Post title |
| `Slug` | Text | Yes | URL slug - generate from title |
| `excerpt` | LongText | No | Short summary |
| `publishedDate` | Date | Yes | Format: YYYY-MM-DD |
| `categoryID` | Integer | Yes | Category ID from table above |
| `tagIDs` | Text | Yes | Comma-separated tag IDs |
| `Content` | Text | Yes | Markdown body content |
| `featuredImage` | Image | No | Object: {url, label} |

## Image Upload Process

1. Initialize upload with `initialize_media_upload`
2. Upload the file to the returned `uploadUrl`
3. Use the CDN URL in content or as `featuredImage`

## Gallery Syntax

For multiple images, create galleries in the Content field:

```gallery:carousel
https://cdn.agilitycms.com/image1.jpg "Caption 1"
https://cdn.agilitycms.com/image2.jpg "Caption 2"
```

Gallery types: carousel, grid:columns-3, masonry, thumbnail, stacked

## When Given Multiple Images

1. Upload all images to the CDN
2. Select the best one for `featuredImage`:
   - Prefer landscape orientation
   - Choose the image that best represents the topic
3. Create a gallery with the remaining images
4. Tell me which image you selected as featured and why

## Workflow

1. Gather: title, content, category, tags, images
2. Upload images (if any)
3. Select best featured image (if multiple)
4. Generate slug from title
5. Create gallery markdown (if multiple images)
6. Save the post
7. Confirm success with content ID
8. Provide a link to edit the post in Agility CMS
```

### Customizing for Your Instance

To get your specific values:

1. **Instance GUID**: Find this in Agility CMS under Settings > API Keys, or in your `.vercel/project.json` if you've linked Vercel
2. **Categories and Tags**: Use the MCP tools to query your content lists, or check Agility CMS directly
3. **Content Model Fields**: Match these to your actual blog post content model in Agility

## Step 5: Test It Out

Start a new chat in your project and try:

> "Create a blog post about how to make the perfect cup of coffee"

Claude will:
1. Ask for any missing information (category, tags)
2. Generate the content
3. Create the post in Agility CMS
4. Give you a link to review it

### With Images

Attach some images to your message:

> "Create a blog post about my trip to the mountains"
> *[attach 5 photos]*

Claude will:
1. Upload all images to your Agility CMS media library
2. Analyze the images and select the best one for the featured image
3. Create a gallery with the remaining images
4. Write engaging content around the photos
5. Publish the post

## Advanced: Using with Claude Code (CLI)

If you use Claude Code (the CLI tool), you can create a local skill that works in your development environment. Create a file at `.claude/skills/blog-post/SKILL.md`:

```yaml
---
name: blog-post
description: Use when the user says "create a blog post" or wants to publish content. Handles image uploads, galleries, categories, tags, and series.
allowed-tools: mcp__Agility-CMS__*, Bash, Read, Write
---

# Blog Post Creation Skill

[Same instructions as above]
```

This gives you the same capabilities when working in VS Code or your terminal.

## Tips for Better Results

1. **Be specific about your content model** - The more detail you give Claude about your fields and their formats, the better the results

2. **Include example values** - Show Claude what valid category IDs and tag IDs look like

3. **Define your gallery syntax** - If your site supports specific gallery types, document them

4. **Add validation rules** - If slugs must be unique or dates must be in a specific format, say so

5. **Include links** - Tell Claude how to construct the edit URL so you can quickly review posts

## What's Next?

Once you have the basics working, you can extend your instructions to:

- Support multiple content types (not just blog posts)
- Handle series and related content
- Create drafts vs. published posts
- Add SEO metadata
- Schedule posts for future publication

The Agility CMS MCP server exposes the full content management API, so anything you can do in the Agility CMS UI, Claude can do programmatically.

## Conclusion

By combining Claude's natural language understanding with Agility CMS's headless content management, you've created a powerful content creation workflow. No more context-switching between writing tools and your CMS - just describe what you want, and let AI handle the rest.

The best part? This same approach works on claude.ai, the Claude iOS app, and the Claude Android app. Create content from anywhere, on any device, with just a conversation.

---

*Want to try this yourself? Sign up for [Agility CMS](https://agilitycms.com) and connect the MCP server to your Claude account today.*
