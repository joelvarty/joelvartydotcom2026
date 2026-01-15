# Building a CMS-Driven Website with AI: Part 1 - Planning and Foundation

*This is Part 1 of a 3-part series on using AI to build production-ready websites with Agility CMS. Based on the real-world experience of building [joelvarty.com](https://joelvarty.com).*

---

## TL;DR

- **The approach**: AI handles implementation, you provide creative direction and vision
- **Tech stack**: Next.js 16 + Agility CMS with MCP integration + TypeScript + Tailwind CSS v4
- **Key insight**: The Agility CMS MCP server lets AI interact directly with the CMS—creating models, containers, and content programmatically
- **Gotcha**: AI made assumptions about CMS patterns (like using HTML instead of Markdown, missing linked content patterns) that needed manual fixes
- **Time saved**: Foundation set up in ~2 hours instead of days
- **Best practice**: Start with a structured plan, document as you go, and expect iteration on CMS-specific patterns

---

## The Vision: AI Does the Heavy Lifting

What if you could describe your website to an AI and have it build the entire thing - from content models to React components to styling? Not a toy project, but a real, production-ready site with:

- Perfect Lighthouse scores
- A headless CMS for content management
- Advanced features like image galleries and blog series
- Clean, maintainable code

That's exactly what I set out to build. The result is [joelvarty.com](https://joelvarty.com), and the entire codebase is open source on [GitHub](https://github.com/joelvarty/joelvartydotcom-2026).

## The Philosophy

Before writing a single line of code, I established a clear principle:

> **AI does the heavy lifting. I provide the creative direction and vision.**

This isn't about replacing developers. It's about augmenting them. I made all the design decisions, chose the tech stack, and defined what success looked like. The AI handled the implementation details, boilerplate code, and tedious configuration.

## The Tech Stack

After researching what would give us the best foundation, we settled on:

- **Next.js 16** with App Router and React Server Components
- **Agility CMS** for headless content management
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling
- **ShadCN UI** as the component library base

The key differentiator: **Agility CMS with MCP (Model Context Protocol) integration**. This would allow the AI to directly interact with the CMS - creating content models, containers, and even content items without me having to copy-paste JSON or manually configure things in the UI.

## Creating the Development Plan

The first step was creating a comprehensive development plan. I opened [Cursor](https://cursor.sh) (my AI coding assistant at the time) and described what I wanted:

```
Build a personal website showcasing who I am, my career, and my blog.
Inspired by Daring Fireball's clean design and Wes Bos's /uses page.
Built with Next.js 16 and Agility CMS, targeting 100 Lighthouse scores.
```

The AI didn't just start coding. It created a structured plan:

1. **Project Setup** - Initialize Next.js, configure tools
2. **Core Infrastructure** - Agility CMS setup, content models
3. **Homepage & Layout** - Navigation, footer, responsive design
4. **Blog System** - Posts, galleries, markdown processing
5. **About & Career Pages** - Timeline, personal content
6. **Uses Page** - Software/hardware lists
7. **Content & CMS Integration** - Webhooks, preview mode
8. **Styling & Polish** - Animations, dark mode
9. **Testing & QA** - Performance, accessibility
10. **Deployment** - CI/CD, monitoring

This plan became our north star. Every AI session started with "follow the development plan."

## The AI Created Its Own Systems

Something unexpected happened. When I asked the AI to follow the plan, it created its own organizational systems:

- **AGENTS.md** - A file describing how AI agents should work on this project
- **process-docs/** - A folder for documenting progress as blog posts
- **prompts/troubleshooting/** - Documentation for when MCP operations fail

The AI was thinking about maintainability and documentation from day one. It understood that other AI agents (or future versions of itself) might need to pick up the project.

## Setting Up the Foundation

Phase 1 was straightforward. Using `create-next-agility-app`, we scaffolded a new Next.js project with Agility CMS integration pre-configured:

```bash
npx create-next-agility-app@latest joelvartydotcom-2026
```

The AI then:

1. Installed ShadCN UI with the "new-york" style
2. Set up the folder structure matching our plan
3. Configured TypeScript with strict mode
4. Connected the Agility CMS MCP server

**Total time for Phase 1: About 30 minutes.**

## The First Challenge: Content Models

This is where things got interesting. I asked the AI to create the BlogPost content model in Agility CMS using the MCP server. It made several assumptions:

❌ **Used HTML field type** for content (I wanted Markdown)
❌ **Added an Author field** (unnecessary for a single-author blog)
❌ **Missed the linked content pattern** for Categories and Tags

The AI was trying to be helpful, but it didn't understand Agility CMS's specific patterns for linked content fields.

### The Fix

I had to manually configure the BlogPost model:

- **Category**: `LinkedContentDropdown` pointing to a Categories container
- **Tags**: `LinkedContentSearchListBox` pointing to a Tags container
- **Hidden fields**: `categoryID` and `tagIDs` to store the actual values
- **Content**: A custom Markdown field type

**Key Learning**: AI assistants need specific guidance about CMS patterns. Generic assumptions about "blog posts" don't account for the nuances of each CMS platform.

## What Worked Well

Despite the content model hiccup, the AI excelled at:

1. **Boilerplate generation** - TypeScript types, component scaffolding, configuration files
2. **Pattern recognition** - Once I showed it one working component, it replicated the pattern
3. **Documentation** - It documented everything as it worked
4. **Problem-solving** - When errors occurred, it proposed solutions

## What Needed Human Oversight

1. **CMS-specific patterns** - The AI needed guidance on Agility's linked content system
2. **Design decisions** - Which gallery types to support, how to structure URLs
3. **Performance trade-offs** - Where to optimize vs. keep things simple
4. **Content strategy** - What content models actually make sense for the use case

## The MCP Advantage

The Agility CMS MCP server changed the game. Instead of:

1. Reading documentation
2. Writing code
3. Copying configuration to the CMS UI
4. Testing
5. Debugging
6. Repeat

The AI could:

1. Query the CMS directly to understand existing structure
2. Create models and containers programmatically
3. Verify changes immediately
4. Fix issues in real-time

This feedback loop is crucial. When the AI can see the results of its actions, it learns and adapts much faster than when operating blindly.

## Setting Up for Success

By the end of Phase 1 and 2, we had:

- ✅ A working Next.js project connected to Agility CMS
- ✅ Content models for BlogPost, Category, Tag, CareerEntry, UsesItem
- ✅ Containers configured for each content type
- ✅ A clear development plan for the remaining phases
- ✅ Documentation created as we worked

**Total development time so far: About 2 hours.**

## Key Takeaways for Agility CMS Users

1. **Start with a plan** - Give your AI assistant clear requirements and a structured approach
2. **Use MCP** - The Agility CMS MCP server dramatically accelerates AI-assisted development
3. **Expect iteration** - AI won't get everything right the first time, especially CMS-specific patterns
4. **Document as you go** - Have the AI create documentation; it's surprisingly good at it
5. **Stay in control** - Make design decisions yourself; let AI handle implementation

## What's Next

In [Part 2](/blog/building-cms-website-ai-part-2-components-content-models), we'll dive into building React components, implementing the blog system with seven gallery types, and the lessons learned when AI makes assumptions about how Agility CMS components work.

---

*The complete codebase is available at [github.com/joelvarty/joelvartydotcom-2026](https://github.com/joelvarty/joelvartydotcom-2026). The development plan and AI instructions are in the DEVELOPMENT-PLAN.md and AGENTS.md files.*

**Series Navigation:**
- **Part 1: Planning and Foundation** (You are here)
- [Part 2: Building Components and Content Models](/blog/building-cms-website-ai-part-2-components-content-models)
- [Part 3: AI-Powered Content Workflow](/blog/building-cms-website-ai-part-3-content-workflow)
