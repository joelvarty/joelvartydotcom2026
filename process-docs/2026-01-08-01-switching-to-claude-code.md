# Switching from Cursor to Claude Code: A New Development Partner

**Date:** January 8, 2026
**Author:** Joel Varty (with Claude Code)
**Phase:** 7 → 9 (Discovery & Transition)

## How We Got Here

I started building this personal website using Cursor as my primary AI coding assistant. Cursor did a fantastic job - it built out the entire infrastructure, created all the Agility CMS models, implemented the blog system with seven different gallery types, and got us about 80% of the way there.

But here's the thing about AI development tools - they're evolving rapidly, and it's worth experimenting. I've been hearing great things about Claude Code, Anthropic's official CLI tool, and I wanted to see how it handles project handoff and continuation. Can it pick up where Cursor left off? Can it understand the existing codebase? How well does it work with the Agility CMS MCP server?

Today I'm finding out.

## The Handoff Challenge

When you switch AI assistants mid-project, you're essentially asking a new developer to jump into an existing codebase. The challenge is context - can the new tool understand:
- What's already been built?
- What still needs to be done?
- The architectural decisions that were made?
- The patterns and conventions in use?

This is where having good documentation becomes critical. I had:
- A comprehensive `DEVELOPMENT-PLAN.md` file (1,600+ lines!)
- Process documentation in `process-docs/` (16+ files documenting the journey)
- A `MANUAL-CMS-SETUP.md` file listing remaining tasks
- All the code itself, of course

Let's see how Claude Code does.

## First Impressions: The Discovery

I asked Claude Code to "examine this codebase, especially @DEVELOPMENT-PLAN.md and get up to speed with where we're at. Include the documentation of the project at /process-docs."

What happened next was impressive.

### Claude Code's Approach

Instead of just reading files, Claude Code took a methodical, investigative approach:

1. **Found all the process docs** - Used the Glob tool to locate every markdown file in `process-docs/`
2. **Examined the recent history** - Checked git status to see what was just worked on
3. **Read the latest documentation** - Focused on recent process docs to understand the current state
4. **Checked the package.json** - Understood the tech stack
5. **Explored the codebase structure** - Mapped out the file organization

But here's where it got really interesting...

## The Surprise Discovery: Using Agility MCP

Instead of just reading the documentation and accepting it at face value, Claude Code did something Cursor hadn't done recently - **it actually queried the Agility CMS instance directly using the MCP server**.

Here's what it did:

```typescript
// Got the list of available Agility instances
mcp__Agility-CMS__get_available_instances()

// Found my instance: "Joel Varty Dot Com" (e9a21a52-u)
mcp__Agility-CMS__get_locales({ instanceGuid: "e9a21a52-u" })
mcp__Agility-CMS__get_content_models({ instanceGuid: "e9a21a52-u" })
mcp__Agility-CMS__get_component_models({ instanceGuid: "e9a21a52-u" })
mcp__Agility-CMS__get_containers({ instanceGuid: "e9a21a52-u" })

// Then checked the sitemap and pages
mcp__Agility-CMS__get_sitemaps({ instanceGuid: "e9a21a52-u", locale: "en-us" })
mcp__Agility-CMS__get_sitemap({ instanceGuid: "e9a21a52-u", locale: "en-us", sitemapID: 1 })

// And here's the kicker - it actually checked each page
mcp__Agility-CMS__get_page({ instanceGuid: "e9a21a52-u", locale: "en-us", pageID: 3 }) // Home
mcp__Agility-CMS__get_page({ instanceGuid: "e9a21a52-u", locale: "en-us", pageID: 6 }) // About
mcp__Agility-CMS__get_page({ instanceGuid: "e9a21a52-u", locale: "en-us", pageID: 7 }) // Career
mcp__Agility-CMS__get_page({ instanceGuid: "e9a21a52-u", locale: "en-us", pageID: 8 }) // Uses
```

## The Big Discovery

Remember `MANUAL-CMS-SETUP.md`? The file that said I still needed to create the `/about`, `/career`, and `/uses` pages manually?

**Turns out they already existed!**

Claude Code discovered:
- ✅ `/about` page exists (pageID: 6) with RichTextArea + Hero + BasicMarkdown components
- ✅ `/career` page exists (pageID: 7) with Hero + CareerTimeline components
- ✅ `/uses` page exists (pageID: 8) with Hero + UsesSection components

All three pages had been created (probably by Cursor in an earlier session) but I hadn't updated the documentation to reflect it. The manual setup doc was out of date.

This is **exactly** the kind of thing you want an AI assistant to catch - the gap between documentation and reality.

## What Actually Needs to Be Done

Claude Code's comprehensive investigation revealed the real status:

### ✅ What's Complete (Discovered via MCP):

**Content Models** (5 total):
- Blog Post, Career Entry, Category, Tag, Uses Item

**Component Models** (6 total):
- Basic Markdown, Blog Details, Blog Listing, Career Timeline, Hero, Uses Section

**Containers** (5 total):
- Career Entries, Categories, Posts, Tags, Uses Items

**Pages** (7 total):
- Home, Blog, About, Career, Uses, Blog Details (dynamic), Category Details (dynamic)

**Content**:
- 5 blog posts (with all 7 gallery types demonstrated!)
- 6 career entries
- 10 uses items
- 3 categories
- 4 tags

### ⚠️ What's Still Needed:

1. **Publish the blog posts** - They're currently in "Staging" state (state: 1), need to be published (state: 2)
2. **Test the site** - Start dev server and verify all pages work
3. **Run Lighthouse audit** - Target 100 scores
4. **Deploy to production** - Vercel recommended

That's it. We're **way** closer than I thought.

## Claude Code vs. Cursor: Initial Observations

It's early days, but here are some initial observations about the differences:

### Claude Code Strengths (So Far):

1. **Proactive Investigation** - It didn't just read docs, it verified them against reality using MCP
2. **Systematic Approach** - Very methodical in how it explored the codebase
3. **MCP Integration** - Seamlessly used the Agility CMS MCP server to query real data
4. **Comprehensive Reporting** - Gave me a detailed, well-organized status report
5. **Documentation Analysis** - Read through 16+ process docs to understand the journey

### What Cursor Did Well:

1. **Building the Foundation** - Created the entire infrastructure from scratch
2. **Component Implementation** - Built all 7 gallery types, all Agility components
3. **Process Documentation** - Generated detailed docs as it worked
4. **Problem Solving** - Figured out complex issues like the BlogDetails dynamicPageItem fix

### The Collaborative Nature

Here's what's interesting - I'm not picking one over the other. They're both excellent tools with different strengths. Cursor was fantastic for the heavy lifting of building the initial project. Claude Code is showing promise for project continuation, verification, and cleanup.

Maybe the best approach is to use both - switching between them based on the task at hand. Kind of like how you might use different editors for different purposes.

## What This Tells Us About AI-Assisted Development

This experiment highlights something important about modern AI-assisted development:

1. **Documentation is Critical** - Having comprehensive documentation (like `DEVELOPMENT-PLAN.md`) makes handoffs possible
2. **MCP Servers are Game-Changers** - The ability for Claude Code to directly query Agility CMS was powerful
3. **Verification Matters** - Documentation can get out of sync with reality; tools that verify are valuable
4. **Context is King** - The more context you provide (docs, process notes, code), the better results you get

## Next Steps with Claude Code

Now that Claude Code has the full picture, let's see how it handles:
1. Publishing the blog posts (using Agility MCP)
2. Testing the site
3. Running the Lighthouse audit
4. Preparing for deployment

I'll document the experience and see how it compares to working with Cursor.

## Joel's Thoughts

This is fascinating to me. I'm not just building a website - I'm also experimenting with how different AI tools approach software development. Claude Code's first action was to verify the documentation against reality using the MCP server, which is exactly what a good developer would do when joining a project.

The fact that it discovered the pages already existed (when the docs said they needed to be created) is a huge win. That kind of investigative approach could save a lot of time and prevent duplicate work.

I'm also impressed by how Claude Code structured its status report - it wasn't just a dump of information, but a well-organized summary with clear sections, emojis for visual scanning, and specific next steps.

Let's see how the rest of this goes. If Claude Code can help me get to 100 Lighthouse scores and deployment, it'll have proven itself as a valuable partner in this project.

The future of software development is weird, wonderful, and full of AI assistants. I'm here for it.

---

**Agent**: Claude Code (Claude Sonnet 4.5)
**Date**: 2026-01-08
**Phase**: Transition & Discovery
**Note**: This post documents the switch from Cursor to Claude Code and Claude Code's comprehensive investigation of the project state using MCP tools
