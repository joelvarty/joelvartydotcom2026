# Planning JoelVarty.com - Before the Build

**Date**: January 15, 2024
**Phase**: Pre-Development Planning
**Status**: Planning Complete, Ready for Implementation

## The Goal

Build a personal website showcasing who I am, my career, and my blog. Inspired by Daring Fireball's clean design and Wes Bos's /uses page. Built with Next.js 16 and Agility CMS, targeting 100 Lighthouse scores.

## How We Planned It

I worked with Cursor AI to create a comprehensive development plan. The philosophy: **AI does the heavy lifting, I provide the creative direction and vision**.

Cursor helped structure the plan, research component libraries, document technical approaches, and organize everything into actionable phases. I provided the vision, requirements, and design direction. Together we created a plan that any AI agent can pick up and start implementing.

## What We Decided

- **Tech Stack**: Next.js 16, React 19, TypeScript, Agility CMS, Tailwind CSS v4, ShadCN UI
- **Component Libraries**: abui.io (primary), @smoothui for motion, @reui for effects
- **Performance**: 100 Lighthouse scores – not negotiable
- **AI Workflow**: Agility CMS MCP Server is PRIMARY for all CMS operations
- **Documentation**: Document as we go, not at the end

The plan covers everything from project structure to content models to performance optimization strategies. It's all in `DEVELOPMENT-PLAN.md` – the single source of truth for this project.

## Joel's Thoughts / Reflections

_[Space for Joel to add personal thoughts, reactions, or reflections on the planning process]_

---

## Technical Details (Written by Cursor AI)

**Agent**: Cursor AI
**Purpose**: Reference documentation for technical implementation details

### AI-Assisted Planning Process

This development plan was created with significant help from Cursor AI. The process exemplifies the philosophy: **AI does the heavy lifting, I provide the creative direction and vision**.

**How Cursor AI Helped**:
- **Initial Planning**: Structured the comprehensive development plan, researched component libraries from ShadCN directory, identified performance optimization strategies, organized project structure
- **Technical Decisions**: Suggested @smoothui and @reui as component libraries that mesh well with Spotlight styling, researched and documented AgilityPic syntax and responsive image strategies, structured gallery system with multiple format options, created troubleshooting workflow for MCP operations
- **Documentation**: Formatted and organized the extensive development plan, created code examples and syntax documentation, structured checklist-style development phases

**Key Collaboration Points**:
1. **Joel provided**: Vision, design inspiration, specific requirements (like 100 Lighthouse scores, AgilityPic usage)
2. **Cursor AI provided**: Technical structure, research on component libraries, code examples, documentation formatting
3. **Together we created**: A comprehensive, actionable development plan

### Technical Stack Decisions

**Core Framework**:
- Next.js 16 (App Router, React Server Components, Server Actions)
- React 19
- TypeScript (strict mode)
- Agility CMS (headless CMS)

**Styling & UI**:
- Tailwind CSS v4 (inspired by Tailwind Plus Spotlight template)
- ShadCN UI as base component library
- **abui.io** components (primary preferred from ShadCN directory)
- **@smoothui** for motion components and microinteractions
- **@reui** for additional animated effects
- Tailwind Plus Spotlight styling patterns for design inspiration

**Development Tools**:
- AI Agents: Cursor (primary), GitHub Copilot, Gravity, Claude Code
- MCP Servers:
  - Agility CMS MCP Server (PRIMARY method for all CMS work)
  - ShadCN MCP Server (component generation)
  - Chrome DevTools MCP (browser automation)
  - Playwright MCP (testing & automation)

### Design Inspiration

- **Daring Fireball**: Clean, minimal, content-first design
- **Wes Bos /uses page**: Comprehensive, well-organized gear/software lists
- **Tailwind Plus Spotlight**: Modern Tailwind styling patterns, subtle animations
  - Demo: https://spotlight.tailwindui.com
  - Local template reference: `/Users/joelvarty/Downloads/tailwind-plus-spotlight/spotlight-ts/src`

### Key Features Planned

1. **Homepage** - Hero section, recent blog posts, quick links
2. **About Page** - Personal introduction, background, current focus
3. **Blog System** - Flexible markdown-based blog with multiple gallery formats
4. **Career Page** - Timeline showcasing experience and achievements
5. **/uses Page** - Comprehensive list of software, hardware, and tools I use

### Blog Gallery System

Flexible gallery system for blog posts supporting:

**Gallery Formats**:
1. **Carousel** - Image slideshow with navigation
2. **Masonry Layout** - Pinterest-style grid with lightbox
3. **Grid Gallery** - Uniform grid layout
4. **Thumbnail Gallery** - Main image with thumbnail navigation
5. **Stacked/Vertical** - Images stacked vertically
6. **Before/After Comparison** - Side-by-side or slider comparison
7. **Tabs Gallery** - Images organized by categories/tabs

**Markdown Syntax**:
```markdown
![gallery:carousel](image1.jpg "Caption 1", image2.jpg "Caption 2", image3.jpg "Caption 3")
![gallery:masonry](image1.jpg "Caption 1", image2.jpg "Caption 2")
![gallery:grid:columns-3](image1.jpg "Caption 1", image2.jpg "Caption 2")
```

All galleries use `<AgilityPic>` component with responsive image sizing (mobile fallbacks + high-res versions based on screen size and DPI).

### Performance Requirements

**Target: 100 Lighthouse Scores** across all categories.

**Key Performance Strategies**:
- All images use `<AgilityPic>` component (Agility CMS optimized)
- Mobile fallback versions (small) as default
- High-res versions via `sources` array with media queries
- Bundle size < 100KB initial load (gzipped)
- Lazy loading for below-the-fold content
- Code splitting by route
- CSS transforms for animations (GPU accelerated)
- Core Web Vitals targets:
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1
  - FCP < 1.8s

**AgilityPic Implementation**:
```typescript
<AgilityPic
  image={image}
  className="w-full h-full object-cover"
  fallbackWidth={400}
  sources={[
    // Desktop - high DPI first (more specific)
    { media: "(min-width: 1280px) and (min-resolution: 2dppx)", width: 2400 },
    { media: "(min-width: 1280px)", width: 1200 },
    // Tablet - high DPI
    { media: "(min-width: 640px) and (min-resolution: 2dppx)", width: 1600 },
    { media: "(min-width: 640px)", width: 800 },
    // Mobile - high DPI
    { media: "(max-width: 639px) and (min-resolution: 2dppx)", width: 1280 },
    { media: "(max-width: 639px)", width: 640 },
  ]}
/>
```

### AI Agent Workflow

**Critical Requirements**:
1. **Agility CMS MCP Server is PRIMARY** - Use MCP for ALL CMS operations
2. **Update plan in checklist style** - Mark off completed items as work progresses
3. **Document process as blog posts** - Create posts in `process-docs/` folder with screenshots
4. **Troubleshooting workflow** - If MCP operations fail, document everything in `prompts/troubleshooting/` so a human can complete the work manually

**Process Documentation**:
- Each agent creates/updates blog posts in `process-docs/` folder
- Screenshots stored in `process-docs/images/` subfolder
- Write in narrative blog post style (not just technical notes)
- Use format: `YYYY-MM-DD-feature-name.md`

### Project Structure

Comprehensive project structure based on the Agility Next.js demo site, adapted for Next.js 16:

```
joelvarty.com/
├── src/
│   ├── app/                    # Next.js 16 App Router
│   ├── components/             # React components
│   │   ├── agility-components/ # Agility CMS components
│   │   ├── ui/                 # ShadCN UI components
│   │   ├── abui/               # abui.io components
│   │   ├── smoothui/           # @smoothui components
│   │   ├── reui/               # @reui components
│   │   ├── blog/               # Blog components
│   │   │   └── galleries/      # Gallery components
│   ├── lib/                    # Utility functions
│   └── types/                  # TypeScript types
├── process-docs/               # Development process blog posts
│   ├── images/                 # Screenshots and images
│   └── *.md                    # Process documentation
├── prompts/                    # AI prompt documentation
│   └── troubleshooting/        # Troubleshooting docs
└── AGENTS.md                   # AI agent instructions
```

### Agility CMS Configuration

**Content Models Planned**:
1. **BlogPost** - Blog post content with markdown and gallery support
2. **Author** - Author information
3. **CareerEntry** - Career timeline entries
4. **UsesItem** - Items for the /uses page
5. **PageContent** - Generic page content

**Containers**:
- BlogPosts (List, shared)
- Authors (List, shared)
- CareerEntries (List, shared)
- UsesItems (List, shared)
- PageContent (Single item, per page)

**Components (Agility Modules)**:
- RichTextArea, Image, Hero
- BlogPostList, BlogPostGallery
- CareerTimeline, UsesSection

### Development Phases

Broken down into 10 phases:

1. **Project Setup** - Initialize Next.js 16, configure tools, set up MCP servers
2. **Core Infrastructure** - Agility CMS setup, content models, containers
3. **Homepage & Layout** - Design and build homepage, navigation, footer
4. **Blog System** - Blog listing, posts, galleries, markdown processing
5. **About & Career Pages** - About page and career timeline
6. **Uses Page** - Comprehensive /uses page with categories
7. **Content & CMS Integration** - Populate content, configure workflows
8. **Styling & Polish** - Apply Spotlight styling, animations, optimize
9. **Testing & QA** - E2E tests, accessibility, performance testing
10. **Deployment** - Production setup, CI/CD, monitoring

### Key Decisions Made

1. **Agility CMS MCP Server is PRIMARY** - All CMS work should be done via MCP, with troubleshooting docs if it fails
2. **Performance is Critical** - 100 Lighthouse scores is the target, not a nice-to-have
3. **AgilityPic for All Images** - Never use Next.js Image, always use AgilityPic with responsive sizing
4. **Component Library Strategy** - abui.io as primary, @smoothui for motion, @reui for effects
5. **Process Documentation** - Document as we go, not at the end
6. **Checklist Updates** - Agents must update the plan in checklist style as work progresses
7. **AI-Assisted Development** - Use Cursor AI (and other agents) for heavy lifting while maintaining creative control

### Resources & References

**Design Inspiration**:
- Wes Bos /uses: https://wesbos.com/uses
- Daring Fireball: https://daringfireball.net
- Tailwind Plus Spotlight: https://spotlight.tailwindui.com

**Code References**:
- Agility Next.js Demo: https://github.com/agility/nextjs-demo-site-2025
- Local Spotlight Template: `/Users/joelvarty/Downloads/tailwind-plus-spotlight/spotlight-ts/src`

**Component Libraries**:
- ShadCN UI: https://ui.shadcn.com
- ShadCN Directory: https://ui.shadcn.com/docs/directory
- abui.io: https://www.abui.io
- ShadCN MCP: https://ui.shadcn.com/docs/mcp

---

**Planning Completed**: January 15, 2024
**AI Agent**: Cursor AI
**Next Step**: Wait for `create-next-agility-app` CLI, then begin Phase 1
