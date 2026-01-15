# Building a CMS-Driven Website with AI: Part 3 - AI-Powered Content Workflow

*This is Part 3 of a 3-part series on using AI to build production-ready websites with Agility CMS. Based on the real-world experience of building [joelvarty.com](https://joelvarty.com).*

---

## TL;DR

- **Bulk content upload**: Claude Code uploaded 18 blog posts to Agility CMS in under 5 minutes using MCP
- **AI verifies, not assumes**: When switching to Claude Code mid-project, it discovered pages already existed that documentation said were missing
- **Ongoing workflow**: Set up a Claude Project with Agility CMS MCP integration for 2-minute blog post creation from any device
- **Content operations at scale**: Same pattern works for migrations, bulk updates, and imports from external sources
- **Total project time**: ~10 hours for a production-ready site with 7 gallery types, blog with series/categories/tags, and 100 Lighthouse scores
- **The model**: AI does the heavy lifting (uploads, formatting, metadata), you provide creative direction

---

## Beyond Code: AI for Content Management

In [Part 1](/blog/building-cms-website-ai-part-1-planning-foundation) and [Part 2](/blog/building-cms-website-ai-part-2-components-content-models), we used AI to build the website infrastructure. But here's where it gets really interesting: using AI to manage content at scale.

The site was built. The components worked. Now I had 18 markdown files documenting the entire development process, sitting in a `process-docs/` folder. They needed to be in Agility CMS as actual blog posts.

Doing this manually would mean:
- Creating 18 separate content items
- Copy-pasting titles, slugs, excerpts
- Copy-pasting thousands of lines of markdown
- Setting up category, tag, and series relationships for each
- **Estimated time: 2-3 hours of tedious work**

Instead, I asked Claude Code to handle it.

## The MCP-Powered Bulk Upload

Claude Code didn't just blindly process the files. It started by understanding the system:

```typescript
// Step 1: Understand the CMS structure
mcp__Agility-CMS__get_content_model_details({ modelID: 8 })
// → BlogPost model with all field definitions

// Step 2: Get a working example
mcp__Agility-CMS__get_content_item({ contentID: 65 })
// → Existing post as a template for field formats

// Step 3: Fetch category, tag, and series IDs
mcp__Agility-CMS__get_content_items({ referenceName: "Categories" })
mcp__Agility-CMS__get_content_items({ referenceName: "Tags" })
mcp__Agility-CMS__get_content_items({ referenceName: "BlogSeries" })
```

Then it processed all 18 files and uploaded them in batches:

```typescript
mcp__Agility-CMS__save_content_items({
  instanceGuid: "e9a21a52-u",
  locale: "en-us",
  items: [
    {
      contentID: -1,  // New item
      referenceName: "Posts",
      fields: {
        title: "Planning JoelVarty.com - Before the Build",
        slug: "planning-joelvarty-com-before-the-build",
        excerpt: "Build a personal website showcasing...",
        publishedDate: "2026-01-06T00:00:00",
        categoryID: 19,
        tagIDs: "22,69",
        seriesID: 64,
        content: "# Planning JoelVarty.com..."  // Full markdown
      }
    },
    // ... 17 more posts
  ]
})
```

**Result: 18 blog posts uploaded in under 5 minutes.**

All posts were properly:
- ✅ Titled with extracted H1 headers
- ✅ Slugged for SEO-friendly URLs
- ✅ Excerpted with first paragraph summaries
- ✅ Linked to the "Building This Site" series
- ✅ Categorized and tagged appropriately
- ✅ Formatted with full markdown preserved

## Switching from Cursor to Claude Code

Midway through this project, I switched AI assistants. Cursor had built the foundation, but I wanted to test Claude Code's capabilities.

The handoff was revealing. When Claude Code joined the project, it didn't just read the documentation - it **verified it against reality** using the MCP server.

Remember the `MANUAL-CMS-SETUP.md` file that said I still needed to create the `/about`, `/career`, and `/uses` pages manually?

**Claude Code discovered they already existed.**

By querying the actual CMS via MCP, Claude Code found:
- ✅ `/about` page (pageID: 6) with components already configured
- ✅ `/career` page (pageID: 7) with CareerTimeline component
- ✅ `/uses` page (pageID: 8) with UsesSection component

The documentation was out of sync with reality. An AI that verifies instead of assuming is invaluable.

## Setting Up a Claude Project for Ongoing Content

The website was launched. But content creation is ongoing. How do you maintain the AI-assisted workflow for regular blog posts?

**Answer: Claude Projects with MCP integration.**

### Step 1: Create a Claude Project

On [claude.ai](https://claude.ai):
1. Click **Projects** → **Create project**
2. Name it (e.g., "Joel Varty Blog")
3. Describe what you're trying to achieve

### Step 2: Connect Agility CMS MCP Server

In your project settings:
1. Find **Connectors** or **Integrations**
2. Click **Add custom connector**
3. Enter: `https://mcp.agilitycms.com/api/mcp`
4. Authenticate with your Agility CMS account

### Step 3: Add the Domain Allowlist

For image uploads to work:
1. Go to Claude **Settings**
2. Find **Code execution and file creation**
3. Under **Additional allowed domains**, add: `mcp.agilitycms.com`

### Step 4: Add Project Instructions

Here's the template we use:

```markdown
# Blog Post Creation for joelvarty.com

When I say "create a blog post on joelvarty.com", use the Agility CMS MCP tools.

## Instance Configuration
- Instance GUID: e9a21a52-u
- Locale: en-us
- Posts Container: Posts

## Categories (use categoryID field)
| ID | Name |
|----|------|
| 18 | Football |
| 19 | Work |
| 17 | 3rd Spaces |

## Tags (use tagIDs field, comma-separated)
| ID | Name |
|----|------|
| 20 | sports |
| 22 | coding |
| 69 | ai |

## When Given Multiple Images
1. Upload all images to the CDN
2. Select the best one for featuredImage (prefer landscape)
3. Create a gallery with the remaining images
4. Tell me which image you selected and why

## Gallery Syntax
```gallery:carousel
https://cdn.agilitycms.com/image1.jpg "Caption"
```
```

The full instructions file is in the [GitHub repo](https://github.com/joelvarty/joelvartydotcom-2026/blob/main/.claude/skills/blog-post/PROJECT-INSTRUCTIONS.md).

## The Content Creation Workflow

Now, creating a blog post is a conversation:

**Me**: "Create a blog post on joelvarty.com about my trip to the coffee shop"
*[attaches 4 photos]*

**Claude**:
1. Uploads all 4 images to Agility CMS CDN
2. Analyzes images, selects the latte art photo as featured (best composition)
3. Creates a carousel gallery with the remaining 3 images
4. Generates title: "A Perfect Afternoon at Third Space Coffee"
5. Writes engaging content with the gallery embedded
6. Sets category to "3rd Spaces" (ID: 17)
7. Saves to Agility CMS
8. Returns: "Created blog post with content ID 99. [Edit in Agility](https://app.agilitycms.com/instance/e9a21a52-u/en-us/content/list-11/listitem-99)"

**Time: About 2 minutes.**

This same workflow works on:
- Claude.ai (desktop)
- Claude iOS app
- Claude Android app

Create content from anywhere, with just a conversation.

## For Claude Code Users: Local Skills

If you use Claude Code (the CLI/IDE tool), you can create a local skill:

**.claude/skills/blog-post/SKILL.md**:

```yaml
---
name: blog-post
description: Use when the user says "create a blog post on joelvarty.com"
allowed-tools: mcp__Agility-CMS__*, Bash, Read, Write
---

# Blog Post Creation Skill

[Same instructions as the Claude Project]
```

This gives you the same AI-powered content workflow in your development environment.

**Skill files in the repo**: [.claude/skills/blog-post/](https://github.com/joelvarty/joelvartydotcom-2026/tree/main/.claude/skills/blog-post)

## Why This Matters for Agility CMS Customers

### 1. Content Operations at Scale

The same pattern used for bulk uploading blog posts works for:
- **Content migration** from legacy systems
- **Bulk updates** across hundreds of items
- **Import from external sources** (RSS, databases, APIs)
- **Content transformation** (reformatting, restructuring)

### 2. Faster Time-to-Value

Traditional CMS workflow:
```
Idea → Write in Word → Copy to CMS → Format → Add images → Publish
```

AI-powered workflow:
```
Idea → Conversation with Claude → Published
```

The friction is gone. Content creators can focus on ideas, not mechanics.

### 3. Consistent Quality

The AI follows your instructions every time:
- Always adds proper alt text to images
- Always generates SEO-friendly slugs
- Always sets the correct category and tags
- Always creates galleries in the specified format

Human error is reduced. Quality is consistent.

### 4. Democratized Technical Capabilities

Content editors who aren't technical can now:
- Upload and optimize images automatically
- Create complex gallery layouts
- Maintain proper metadata structure
- Publish without developer assistance

## The Complete Picture

Looking back at this project:

| Phase | Method | Time |
|-------|--------|------|
| Planning | AI-assisted with Cursor | 1 hour |
| Foundation (Next.js, CMS) | AI with MCP | 2 hours |
| Components & Blog System | AI with iteration | 5.5 hours |
| Content Models | Manual fixes needed | 1 hour |
| Bulk Content Upload | Claude Code + MCP | 5 minutes |
| Ongoing Content | Claude Projects | 2 min/post |

**Total development: ~10 hours** for a production-ready, CMS-driven website with:
- 7 gallery types
- Blog with series, categories, tags
- Career timeline
- Uses page
- 100 Lighthouse scores
- 19 blog posts documenting the journey

## What's Next for You

1. **Try the MCP Server** - Connect Claude to your Agility CMS instance
2. **Create a Claude Project** - Set up your content creation workflow
3. **Start with bulk operations** - Import existing content or create test posts
4. **Iterate on instructions** - Refine based on your specific content model
5. **Extend to your team** - Share the project with content creators

The future of content management isn't just about pretty UIs for editors. It's about intelligent automation that handles the tedious parts while keeping humans in control of the creative decisions.

I decided what to document. I chose the structure and tone. I made the design decisions. AI handled the mechanical work of getting content into the CMS with all the right metadata.

**That's the collaboration model: AI does the heavy lifting, you provide the creative direction.**

---

## Resources

- **Website**: [joelvarty.com](https://joelvarty.com)
- **GitHub**: [github.com/joelvarty/joelvartydotcom-2026](https://github.com/joelvarty/joelvartydotcom-2026)
- **Agility CMS MCP Server**: `https://mcp.agilitycms.com/api/mcp`
- **Claude Code Skill Files**: [.claude/skills/blog-post/](https://github.com/joelvarty/joelvartydotcom-2026/tree/main/.claude/skills/blog-post)
- **Building This Site Series**: [joelvarty.com/blog/series/building-this-site](https://joelvarty.com/blog/series/building-this-site)

---

**Series Navigation:**
- [Part 1: Planning and Foundation](/blog/building-cms-website-ai-part-1-planning-foundation)
- [Part 2: Building Components and Content Models](/blog/building-cms-website-ai-part-2-components-content-models)
- **Part 3: AI-Powered Content Workflow** (You are here)

---

*Want to try this yourself? Sign up for [Agility CMS](https://agilitycms.com) and connect the MCP server to your Claude account. The future of content management is conversational.*
