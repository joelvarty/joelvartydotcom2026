# JoelVarty.com - Website Development Plan

**Filename**: When moved to the project folder, this file should be named `DEVELOPMENT-PLAN.md`

## 🎯 Project Overview

**Goal**: Build a personal website showcasing who I am, my career, and my blog. Inspired by Daring Fireball's clean design and Wes Bos's /uses page. Built with Next.js 16, Agility CMS, and AI-assisted development.

**Philosophy**: AI does the heavy lifting, I provide the creative direction and vision.

**Performance Goal**: **100 Lighthouse scores** across all categories. The site must be SUPER fast and lightweight while maintaining cool UI features and animations. All images use `<AgilityPic>` with responsive sizing (mobile fallbacks + high-res versions based on screen size and DPI).

### 📍 Quick Reference - Key URLs & Paths

**Design Inspiration:**
- Wes Bos /uses: https://wesbos.com/uses
- Daring Fireball: https://daringfireball.net
- Tailwind Plus Spotlight Demo: https://spotlight.tailwindui.com
- **Local Spotlight Template**: `/Users/joelvarty/Downloads/tailwind-plus-spotlight/spotlight-ts/src`

**Code References:**
- Agility Next.js Demo: https://github.com/agility/nextjs-demo-site-2025

**Component Libraries:**
- ShadCN UI: https://ui.shadcn.com
- ShadCN Directory: https://ui.shadcn.com/docs/directory
- abui.io: https://www.abui.io (primary preferred)
- @smoothui: Motion components with subtle animations (best match for Spotlight)
- @reui: Animated effects that pair beautifully with shadcn/ui
- ShadCN MCP: https://ui.shadcn.com/docs/mcp

**Documentation:**
- Next.js 16: https://nextjs.org/docs
- Agility CMS: https://agilitycms.com/docs

---

## 🏗️ Technical Stack

### Core Framework
- **Next.js 16** (App Router, React Server Components, Server Actions)
- **React 19**
- **TypeScript** (strict mode)
- **Agility CMS** (headless CMS for content management)

### Styling & UI
- **Tailwind CSS v4** (with custom configuration inspired by Tailwind Plus Spotlight)
- **ShadCN UI** (component library base) - https://ui.shadcn.com
- **abui.io components** (from ShadCN directory - primary preferred) - https://www.abui.io
- **@smoothui** (motion components with subtle animations - best match for Spotlight styling)
  - Install: `npx shadcn add @smoothui/<component>`
  - Focus: Smooth animations, subtle feedback, delightful microinteractions
- **@reui** (animated effects that pair beautifully with shadcn/ui)
  - Install: `npx shadcn add @reui/<component>`
  - Focus: Animated effects built with React, TypeScript, Tailwind CSS, and Motion
- **ShadCN Directory** (source for component selection) - https://ui.shadcn.com/docs/directory
- **Tailwind Plus Spotlight styling patterns** (design inspiration)
  - Demo: https://spotlight.tailwindui.com
  - Local template: `/Users/joelvarty/Downloads/tailwind-plus-spotlight/spotlight-ts/src`

### Development Tools
- **AI Agents**: Cursor (primary), GitHub Copilot, Gravity, Claude Code
- **MCP Servers**:
  - Agility CMS MCP Server (content management)
  - ShadCN MCP Server (component generation)
  - Chrome DevTools MCP (browser automation)
  - Playwright MCP (testing & automation)

### Additional Tools
- **Playwright** (E2E testing)
- **ESLint** + **Prettier** (code quality)
- **TypeScript** (type safety)

---

## 📁 Project Structure

Based on the [Agility Next.js Demo Site](https://github.com/agility/nextjs-demo-site-2025) structure, adapted for Next.js 16.

**Reference**:
- GitHub: https://github.com/agility/nextjs-demo-site-2025
- Note: Demo uses Next.js 15, we're using Next.js 16

```
joelvarty.com/
├── .github/                    # GitHub workflows
│   └── workflows/
├── .cursor/                     # Cursor-specific settings
├── .playwright-mcp/            # Playwright MCP configuration
├── docs/                        # In-site documentation (optional)
├── src/
│   ├── app/                    # Next.js 16 App Router
│   │   ├── (routes)/           # Route groups
│   │   │   ├── about/          # About page
│   │   │   ├── blog/           # Blog listing & posts
│   │   │   │   └── [slug]/     # Individual blog posts
│   │   │   ├── uses/           # /uses page (inspired by Wes Bos)
│   │   │   ├── career/         # Career timeline/history
│   │   │   └── layout.tsx      # Main layout
│   │   ├── api/                # API routes
│   │   │   ├── revalidate/     # Agility CMS webhook
│   │   │   └── agility/        # Agility API helpers
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Homepage
│   ├── components/             # React components
│   │   ├── agility-components/ # Agility CMS components
│   │   │   └── index.ts        # Component registry
│   │   ├── ui/                 # ShadCN UI components
│   │   │   └── (shadcn components)
│   │   ├── abui/               # abui.io components (from ShadCN directory - primary)
│   │   ├── smoothui/           # @smoothui components (motion & microinteractions)
│   │   ├── reui/               # @reui components (animated effects)
│   │   ├── layout/             # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   ├── blog/               # Blog-specific components
│   │   │   └── galleries/      # Gallery components (carousel, masonry, single)
│   │   ├── career/             # Career-specific components
│   │   └── uses/               # /uses page components
│   ├── lib/                    # Utility functions
│   │   ├── agility/            # Agility CMS helpers
│   │   ├── utils.ts            # General utilities
│   │   └── formatDate.ts       # Date formatting
│   ├── types/                  # TypeScript types
│   │   ├── agility.ts          # Agility CMS types
│   │   └── index.ts            # General types
│   └── styles/                 # Additional styles
├── public/                     # Static assets
│   ├── images/
│   └── favicon.ico
├── data/                       # Data files (redirects, etc.)
├── prompts/                    # AI prompt documentation
│   ├── current-agent.md        # Which AI agent is currently being used
│   ├── prompts-log.md          # Log of all prompts given to agents
│   ├── process-notes.md        # Development process notes
│   └── troubleshooting/       # Troubleshooting documentation
│       └── agility-issue-*.md  # Agility CMS MCP issues (when stuck)
├── process-docs/               # Development process blog posts
│   ├── images/                 # Screenshots and images for process docs
│   │   └── (screenshots, diagrams, etc.)
│   ├── YYYY-MM-DD-feature-name.md  # Process documentation posts
│   └── README.md               # Index/guide to process documentation
├── DEVELOPMENT-PLAN.md         # This file - comprehensive development plan
├── AGENTS.md                   # AI agent instructions (single source of truth)
├── .cursorrules                # Cursor-specific rules (references AGENTS.md)
├── .copilot-instructions.md    # GitHub Copilot instructions (references AGENTS.md)
├── .windsurf-rules.md          # Windsurf rules (references AGENTS.md)
├── .claude-context.md          # Claude context (references AGENTS.md)
├── package.json
├── tsconfig.json
├── tailwind.config.ts          # Tailwind config (inspired by Spotlight)
├── next.config.ts
├── playwright.config.ts
└── README.md
```

---

## 🎨 Design & Styling Approach

### Design Inspiration
- **Daring Fireball**: Clean, minimal, content-first design - https://daringfireball.net
- **Wes Bos /uses page**: Comprehensive, well-organized gear/software lists - https://wesbos.com/uses
- **Tailwind Plus Spotlight**: Modern Tailwind styling patterns, subtle animations
  - Demo: https://spotlight.tailwindui.com
  - Local template path: `/Users/joelvarty/Downloads/tailwind-plus-spotlight/spotlight-ts/src`

### Component Strategy
1. **Base**: ShadCN UI components (via ShadCN MCP server) - https://ui.shadcn.com
2. **Primary Preferred**: abui.io components from ShadCN directory - https://www.abui.io (source: https://ui.shadcn.com/docs/directory)
3. **Motion & Animations**: @smoothui components for subtle microinteractions and smooth animations
   - Best match for Spotlight's subtle animation style
   - Install: `npx shadcn add @smoothui/<component>`
4. **Animated Effects**: @reui components for additional animated effects
   - Pairs beautifully with shadcn/ui
   - Install: `npx shadcn add @reui/<component>`
5. **Custom**: Tailored components using Spotlight-inspired Tailwind patterns
   - Reference: `/Users/joelvarty/Downloads/tailwind-plus-spotlight/spotlight-ts/src`
   - Demo: https://spotlight.tailwindui.com
6. **Agility Components**: CMS-driven components registered in `src/components/agility-components/index.ts`

### Styling Principles
- **Dark mode first** (with light mode support)
- **Subtle animations** (inspired by Spotlight template)
- **Typography-focused** (readable, clean fonts)
- **Responsive by default** (mobile-first approach)
- **Accessibility** (WCAG 2.1 AA compliance)

---

## 📝 Content Structure

### Pages & Routes

#### 1. Homepage (`/`)
- Hero section with introduction
- Recent blog posts preview
- Quick links to key sections
- Social links

#### 2. About (`/about`)
- Personal introduction
- Background story
- Current focus/interests
- Contact information

#### 3. Blog (`/blog`)
- Blog post listing (paginated)
- Individual post pages (`/blog/[slug]`)
- Categories/tags (if needed)
- RSS feed

#### 4. Career (`/career`)
- Career timeline
- Current role
- Previous positions
- Skills & expertise
- Projects/achievements

#### 5. Uses (`/uses`)
- Software I use (editor, terminal, browser, etc.)
- Hardware setup (desk, monitors, peripherals)
- Development tools & workflows
- Productivity apps
- Design tools
- Living document (updated regularly)

---

## 🤖 AI Agent Workflow

### Agent Instructions File (`AGENTS.md`)
**Single source of truth** for all AI agents. Should include:
- Project architecture and patterns
- Code style guidelines
- Component conventions
- Agility CMS integration patterns
- **MCP server usage instructions (Agility CMS MCP is PRIMARY method)**
- **Troubleshooting workflow (when MCP operations fail)**
- **Process documentation requirements (blog posts in process-docs/)**
- Testing requirements
- Deployment guidelines
- **Plan update requirements (checklist style - update DEVELOPMENT-PLAN.md)**

### Agent-Specific Files
- `.cursorrules` → References `AGENTS.md`
- `.copilot-instructions.md` → References `AGENTS.md`
- `.windsurf-rules.md` → References `AGENTS.md`
- `.claude-context.md` → References `AGENTS.md`

### Plan Updates - Checklist Style
**IMPORTANT**: When working on this project, agents MUST:
- ✅ Update `DEVELOPMENT-PLAN.md` in **checklist style** as work progresses
- ✅ Check off completed items in the Development Phases section
- ✅ Add notes or updates to relevant sections when making changes
- ✅ Keep the plan current and accurate

**Example of checklist updates**:
```markdown
### Phase 4: Blog System
- [x] Create blog listing page ✅ Completed 2024-01-15
- [x] Create individual blog post pages ✅ Completed 2024-01-15
- [ ] Set up blog post content model
- [x] Implement markdown processing with gallery support ✅ Completed 2024-01-16
```

### Process Documentation - Blog Posts
**CRITICAL**: Agents MUST document the development process as they work.

**Requirements**:
- ✅ Create or update markdown blog post files in `process-docs/` folder
- ✅ Document significant features, decisions, and milestones
- ✅ Include screenshots/images in `process-docs/images/` subfolder
- ✅ Use descriptive filenames: `YYYY-MM-DD-feature-name.md`
- ✅ Write in blog post style (narrative, not just technical notes)
- ✅ Update existing posts when iterating on features

**Process Documentation Structure**:
```
process-docs/
├── images/                          # All screenshots and images
│   ├── 2024-01-15-blog-setup-1.png
│   ├── 2024-01-15-agility-models.png
│   └── ...
├── 2024-01-15-setting-up-blog-system.md
├── 2024-01-16-creating-gallery-components.md
├── 2024-01-17-agility-cms-integration.md
└── README.md                         # Index of all process posts
```

**What to Document**:
- Feature implementation (what was built, how, why)
- Key decisions and rationale
- Challenges encountered and solutions
- Screenshots of UI, Agility CMS setup, code examples
- MCP operations used (with examples)
- Performance optimizations
- Design decisions
- Integration steps

**Blog Post Template**:
```markdown
# [Feature Name] - [Date]

## Overview
Brief description of what was built/implemented.

## What We Built
Detailed description of the feature.

## Implementation Details
- Technical approach
- Components used
- MCP operations (if applicable)

## Screenshots
![Description](images/YYYY-MM-DD-feature-name-1.png)

## Challenges & Solutions
Any issues encountered and how they were resolved.

## Next Steps
What comes next or what needs to be done.

---
**Agent**: [Agent Name]
**Date**: YYYY-MM-DD
**Phase**: [Phase Number]
```

### Prompt Documentation (`prompts/`)
- **`current-agent.md`**: Which AI agent is currently being used
- **`prompts-log.md`**: Chronological log of all prompts given to agents
  - Format: `[Date] [Agent] [Prompt] [Result/Notes]`
- **`process-notes.md`**: Development process notes (technical/internal)
  - Decisions made
  - Challenges encountered
  - Solutions implemented

### Process Documentation (`process-docs/`)
**Blog-style documentation of the development process**:
- **Markdown blog posts** documenting features, decisions, and milestones
- **Images folder** (`process-docs/images/`) for screenshots and diagrams
- **Narrative style** - written as blog posts, not just technical notes
- **Updated as work progresses** - not just at the end
- Each agent should create/update posts as they work on features

### Troubleshooting Documentation
When an agent encounters issues, especially with Agility CMS MCP operations:
- Create a troubleshooting file in `prompts/troubleshooting/`
- File naming: `agility-issue-YYYY-MM-DD-HHMM.md` or descriptive name
- Document:
  - What was attempted
  - Full JSON input sent to MCP server
  - Full JSON output/response received
  - Any error messages (complete error text)
  - Steps taken to resolve
  - Current status (blocked, needs manual intervention, etc.)
- This allows a human to manually complete the work in Agility CMS if needed

---

## 🔧 MCP Server Integration

### Agility CMS MCP Server
**Purpose**: Content management and CMS operations

**CRITICAL**: **Use the Agility CMS MCP Server for AS MUCH work as possible**. This is the primary method for all Agility CMS operations.

**Priority Order**:
1. **FIRST**: Always try Agility CMS MCP Server operations
2. **ONLY if stuck**: Create troubleshooting documentation (see below)
3. **FALLBACK**: Human manually completes work in Agility CMS UI

**Usage**:
- **Create/update content models** - Use `save_content_model` via MCP
- **Manage content items** - Use `save_content_items` via MCP
- **Configure pages and sitemaps** - Use `save_page` via MCP
- **Handle media uploads** - Use `initialize_media_upload` via MCP
- **Set up webhooks** - Use MCP operations where available
- **List/query content** - Use `get_content_models`, `get_content_items` via MCP

**Key Operations** (use these via MCP):
- `get_content_models` - List available content models
- `get_content_model_details` - Get specific model details
- `save_content_model` - Create/update content models
- `get_content_items` - Fetch content from containers
- `get_content_item` - Get single content item
- `save_content_items` - Create/update content
- `get_containers` - List containers
- `save_container` - Create/update containers
- `save_page` - Create/update pages
- `get_page_models` - List page models
- `initialize_media_upload` - Upload images/assets
- `get_locales` - Get available locales

**When MCP Operations Fail**:
If an Agility CMS MCP operation fails or gets stuck:
1. **DO NOT** give up immediately - try variations of the operation
2. **DO** create a troubleshooting file: `prompts/troubleshooting/agility-issue-[description].md`
3. **Document everything**:
   - Exact MCP operation attempted
   - Complete JSON input (all parameters)
   - Complete JSON output/response
   - Full error messages (copy entire error text)
   - Instance GUID used
   - Locale used
   - Any relevant context
4. **Update DEVELOPMENT-PLAN.md** with a note about the issue
5. **Mark the task** as "Blocked - see troubleshooting file"

**Example Troubleshooting File**:
```markdown
# Agility CMS Issue: Content Model Creation Failed

**Date**: 2024-01-15
**Agent**: Cursor
**Task**: Creating BlogPost content model

## What Was Attempted
Tried to create BlogPost content model using `save_content_model` MCP operation.

## MCP Operation
`mcp_Agility_CMS_save_content_model`

## Input JSON
```json
{
  "instanceGuid": "abc123...",
  "model": {
    "id": -1,
    "displayName": "Blog Post",
    "referenceName": "BlogPost",
    "fields": [...]
  }
}
```

## Output/Response
```json
{
  "error": "Field validation failed",
  "message": "..."
}
```

## Error Messages
[Full error text here]

## Steps Taken
1. Verified instance GUID
2. Checked field structure
3. Tried with minimal fields
4. Still failing

## Status
BLOCKED - Needs manual creation in Agility CMS UI

## Manual Steps for Human
1. Log into Agility CMS
2. Go to Content Models
3. Create new model "BlogPost"
4. Add fields as specified in input JSON above
```

### ShadCN MCP Server
**Purpose**: Component generation and management

**Usage**:
- Generate ShadCN UI components
- Add abui.io components from ShadCN directory (primary preferred)
- Add @smoothui components for motion and microinteractions
- Add @reui components for animated effects
- Customize component variants
- Manage component dependencies

**Key Operations**:
- Add components from ShadCN directory
- Generate component code
- Update component configurations
- Install commands:
  - `npx shadcn add @abui/<component>`
  - `npx shadcn add @smoothui/<component>`
  - `npx shadcn add @reui/<component>`

### Chrome DevTools MCP
**Purpose**: Browser automation and testing

**Usage**:
- Visual testing
- Browser-based debugging
- Performance analysis
- Accessibility checks

### Playwright MCP
**Purpose**: E2E testing and automation

**Usage**:
- Write and run E2E tests
- Test CMS content rendering
- Verify page functionality
- Cross-browser testing

---

## 🗄️ Agility CMS Configuration

### Content Models

#### 1. Blog Post (`BlogPost`)
- `title` (Text, required)
- `slug` (Text, required, unique)
- `excerpt` (LongText)
- `content` (Html) - Markdown content with embedded gallery syntax
- `publishedDate` (Date)
- `featuredImage` (ImageAttachment)
- `tags` (Text, comma-separated or LinkedContent)
- `author` (LinkedContent → Author model)
- `galleryData` (LongText, optional) - JSON string for gallery images (alternative to inline syntax)

#### 2. Author (`Author`)
- `name` (Text)
- `bio` (LongText)
- `avatar` (ImageAttachment)
- `socialLinks` (LinkedContent → SocialLink model)

#### 3. Career Entry (`CareerEntry`)
- `company` (Text)
- `title` (Text)
- `startDate` (Date)
- `endDate` (Date, optional)
- `description` (Html)
- `logo` (ImageAttachment)
- `currentRole` (Boolean)

#### 4. Uses Item (`UsesItem`)
- `category` (DropdownList: Software, Hardware, Tools, etc.)
- `name` (Text)
- `description` (LongText)
- `link` (Link, optional)
- `affiliateLink` (Link, optional)
- `image` (ImageAttachment, optional)

#### 5. Page Content (`PageContent`)
- Generic page content model for flexible pages
- `title` (Text)
- `content` (Html)
- `seoMetaDescription` (Text)
- `seoMetaKeywords` (Text)

### Containers
- `BlogPosts` (List, shared)
- `Authors` (List, shared)
- `CareerEntries` (List, shared)
- `UsesItems` (List, shared)
- `PageContent` (Single item, per page)

### Components (Agility Modules)
- `RichTextArea` - Rich text content
- `Image` - Image display
- `Hero` - Hero section
- `BlogPostList` - Blog post listing
- `BlogPostGallery` - Gallery display (carousel, masonry, single)
- `CareerTimeline` - Career timeline display
- `UsesSection` - Uses page sections

---

## 📸 Blog Gallery System

### Overview
The blog will support flexible image galleries embedded directly in markdown content. Galleries can be rendered in three different formats: carousel, masonry layout with lightbox, or single image display.

### Markdown Gallery Syntax

**Standard Syntax** (based on common markdown extension patterns):

```markdown
<!-- Gallery: [type] -->
![Gallery: carousel](image1.jpg "Caption 1" | image2.jpg "Caption 2" | image3.jpg "Caption 3")

<!-- Or using YAML frontmatter style -->
```gallery
type: carousel
images:
  - url: image1.jpg
    caption: Caption 1
  - url: image2.jpg
    caption: Caption 2
  - url: image3.jpg
    caption: Caption 3
```

**Recommended Syntax** (simplified inline format):

```markdown
<!-- Carousel Gallery -->
![gallery:carousel](image1.jpg "Caption 1", image2.jpg "Caption 2", image3.jpg "Caption 3")

<!-- Masonry Gallery with Lightbox -->
![gallery:masonry](image1.jpg "Caption 1", image2.jpg "Caption 2", image3.jpg "Caption 3")

<!-- Grid Gallery -->
![gallery:grid:columns-3](image1.jpg "Caption 1", image2.jpg "Caption 2", image3.jpg "Caption 3")

<!-- Thumbnail Gallery -->
![gallery:thumbnail](image1.jpg "Caption 1", image2.jpg "Caption 2", image3.jpg "Caption 3")

<!-- Stacked/Vertical Gallery -->
![gallery:stacked](image1.jpg "Caption 1", image2.jpg "Caption 2", image3.jpg "Caption 3")

<!-- Before/After Comparison -->
![gallery:comparison](before.jpg "Before", after.jpg "After")

<!-- Tabs Gallery (requires YAML format) -->
```

**Alternative: YAML Frontmatter Block** (for complex galleries):

```markdown
---
gallery:
  type: carousel
  images:
    - url: /images/photo1.jpg
      caption: Beautiful sunset
      alt: Sunset over mountains
    - url: /images/photo2.jpg
      caption: Mountain landscape
      alt: Snow-capped peaks
---
```

**Final Recommended Syntax** (most flexible and standard):

```markdown
<!-- Simple inline syntax -->
![gallery:carousel](url1.jpg "Caption 1", url2.jpg "Caption 2", url3.jpg "Caption 3")

<!-- With options -->
![gallery:masonry:columns-3](url1.jpg "Caption 1", url2.jpg "Caption 2", url3.jpg "Caption 3")
![gallery:grid:columns-4](url1.jpg "Caption 1", url2.jpg "Caption 2")

<!-- Before/After Comparison -->
![gallery:comparison](before.jpg "Before caption", after.jpg "After caption")

<!-- Tabs Gallery (YAML format for complex structure) -->
```yaml
---
gallery:
  type: tabs
  tabs:
    - name: "Category 1"
      images:
        - url: image1.jpg
          caption: "Caption 1"
    - name: "Category 2"
      images:
        - url: image2.jpg
          caption: "Caption 2"
---
```

### Gallery Rendering Options

1. **Carousel** - Image carousel/slideshow
   - Navigation arrows
   - Dots/pagination indicators
   - Auto-play (optional)
   - Keyboard navigation
   - Touch/swipe support

2. **Masonry Layout with Lightbox** - Grid layout with varying image heights
   - Responsive masonry grid (Pinterest-style)
   - Click to open lightbox
   - Image details/captions in lightbox
   - Navigation between images in lightbox
   - Zoom functionality

3. **Grid Gallery** - Uniform grid layout
   - Equal-sized or responsive grid
   - Click to open lightbox
   - Configurable columns (2, 3, 4 columns)
   - Consistent spacing and sizing

4. **Thumbnail Gallery** - Main image with thumbnail navigation
   - Large featured image display
   - Thumbnail strip below or beside main image
   - Click thumbnails to change main image
   - Optional lightbox for full-size viewing

5. **Stacked/Vertical Gallery** - Images stacked vertically
   - Full-width or constrained width
   - Images displayed one after another
   - Good for step-by-step tutorials or sequential content
   - Optional lightbox on click

6. **Before/After Comparison** - Side-by-side or slider comparison
   - Split view with slider to reveal before/after
   - Or side-by-side comparison
   - Useful for transformations, comparisons, tutorials

7. **Tabs Gallery** - Images organized by categories/tabs
   - Multiple image sets in tabbed interface
   - Each tab contains its own gallery (carousel, grid, or masonry)
   - Useful for organizing related images by category

### Recommended ShadCN Directory Components

#### 1. Carousel Component
**Source**: ShadCN UI core component
- **Component**: `Carousel` (from `@/components/ui/carousel`)
- **Install**: `npx shadcn add carousel`
- **Features**: Built-in carousel with navigation, autoplay, and responsive design
- **Customization**: Can be styled to match Spotlight aesthetic

#### 2. Masonry Layout with Lightbox
**Option A - ShadCN Core Components:**
- **Dialog Component**: `Dialog` (for lightbox) - `npx shadcn add dialog`
- **Custom Masonry**: Build using CSS Grid or Tailwind with `columns` utility
- **Image Component**: Next.js `Image` component for optimization

**Option B - ShadCN Directory Registries:**
- **@smoothui**: Check for masonry/grid gallery components
- **@reui**: Check for lightbox/modal components with animations
- **@abui**: May have gallery/lightbox components

**Recommended Approach**:
- Use ShadCN `Dialog` component for lightbox
- Build custom masonry layout with Tailwind CSS
- Use `<AgilityPic>` component for all images (with responsive sizing)
- Add smooth animations from @smoothui or @reui

#### 3. Grid Gallery
**Components**:
- **ShadCN Dialog**: `npx shadcn add dialog` (for lightbox)
- **AgilityPic**: Agility CMS image component (with responsive sizing)
- **Custom Grid**: CSS Grid or Tailwind `grid` utilities
- **Aspect Ratio**: `npx shadcn add aspect-ratio` (for consistent sizing)

#### 4. Thumbnail Gallery
**Components**:
- **ShadCN Carousel**: `npx shadcn add carousel` (can be adapted for thumbnail navigation)
- **ShadCN Dialog**: `npx shadcn add dialog` (for lightbox)
- **AgilityPic**: Agility CMS image component (with responsive sizing)
- **Custom Layout**: Flexbox or Grid for thumbnail strip

#### 5. Stacked/Vertical Gallery
**Components**:
- **AgilityPic**: Agility CMS image component (with responsive sizing)
- **ShadCN Dialog**: `npx shadcn add dialog` (optional lightbox)
- **Aspect Ratio**: `npx shadcn add aspect-ratio` (for consistent sizing)

#### 6. Before/After Comparison
**Components**:
- **ShadCN Slider**: `npx shadcn add slider` (for comparison slider)
- **AgilityPic**: Agility CMS image component (with responsive sizing)
- **Custom Component**: Build split-view or slider comparison
- **@smoothui**: Check for animated comparison components

#### 7. Tabs Gallery
**Components**:
- **ShadCN Tabs**: `npx shadcn add tabs` (for tabbed interface)
- **Nested Galleries**: Each tab can contain carousel, grid, or masonry
- **AgilityPic**: Agility CMS image component (with responsive sizing)

### Implementation Strategy

1. **Markdown Parser**: Use `remark` or `MDX` to parse markdown and identify gallery syntax
2. **Custom MDX Components**: Create React components for each gallery type
3. **Component Registry**: Register gallery components in `src/components/blog/galleries/`
4. **Image Optimization**: Use `<AgilityPic>` component for all gallery images with responsive sizing
   - Mobile fallback versions (small) as default
   - High-res versions via srcset (1x, 2x, 3x) based on screen size and DPI
   - Lazy loading for below-the-fold galleries
5. **Responsive Design**: Ensure all gallery types work on mobile devices
6. **Performance**: Lazy load gallery components, optimize bundle size

### Component Structure

```
src/components/blog/galleries/
├── GalleryCarousel.tsx       # Carousel gallery component
├── GalleryMasonry.tsx        # Masonry layout with lightbox
├── GalleryGrid.tsx           # Uniform grid gallery
├── GalleryThumbnail.tsx      # Thumbnail gallery with main image
├── GalleryStacked.tsx        # Stacked/vertical gallery
├── GalleryComparison.tsx     # Before/after comparison
├── GalleryTabs.tsx          # Tabs gallery with categories
├── GalleryLightbox.tsx       # Shared lightbox component
└── index.ts                  # Component exports
```

### Gallery Data Format

```typescript
interface GalleryImage {
  url: string
  caption?: string
  alt?: string
  width?: number
  height?: number
  // Agility CMS image object
  image?: AgilityImageObject
}

interface GalleryProps {
  type: 'carousel' | 'masonry' | 'grid' | 'thumbnail' | 'stacked' | 'comparison' | 'tabs'
  images: GalleryImage[]
  options?: {
    autoplay?: boolean
    columns?: number
    showCaptions?: boolean
    thumbnailPosition?: 'bottom' | 'side'
    comparisonType?: 'slider' | 'side-by-side'
    tabs?: Array<{
      name: string
      images: GalleryImage[]
    }>
  }
}
```

### AgilityPic Usage in Galleries

**Example: Carousel Gallery Image** (with high-DPI support):
```typescript
<AgilityPic
  image={image} // Agility CMS image object
  className="w-full h-full object-cover"
  fallbackWidth={640}
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

**Example: Grid Gallery Image** (with high-DPI support):
```typescript
<AgilityPic
  image={image}
  className="w-full h-full object-cover"
  fallbackWidth={400}
  sources={[
    // Desktop - high DPI
    { media: "(min-width: 1280px) and (min-resolution: 2dppx)", width: 1600 },
    { media: "(min-width: 1280px)", width: 800 },
    // Tablet - high DPI
    { media: "(min-width: 640px) and (min-resolution: 2dppx)", width: 1200 },
    { media: "(min-width: 640px)", width: 600 },
  ]}
/>
```

**Example: Thumbnail** (with high-DPI support):
```typescript
<AgilityPic
  image={image}
  className="w-full h-full object-cover"
  fallbackWidth={200}
  sources={[
    // Tablet+ - high DPI
    { media: "(min-width: 640px) and (min-resolution: 2dppx)", width: 600 },
    { media: "(min-width: 640px)", width: 300 },
  ]}
/>
```

**Note on Media Query Order**: Always place high-DPI queries (more specific) before standard queries. The browser will use the first matching media query.

### Integration with Agility CMS

- Store gallery data as JSON in `galleryData` field (optional)
- Or parse gallery syntax directly from markdown `content` field
- Use Agility's `ImageAttachment` field type for image URLs
- **All images must use `<AgilityPic>` component** for optimal performance
- AgilityPic uses `image` prop (Agility CMS image object from ImageAttachment)
- Use `fallbackWidth` for mobile fallback (small default image)
- Use `sources` array with media queries for responsive sizing
- Media query breakpoints align with Tailwind CSS breakpoints
- Support both inline markdown syntax and CMS-managed galleries
- AgilityPic handles responsive image sizing and format optimization automatically

---

## 🚀 Development Phases

### Phase 1: Project Setup
- [ ] Initialize Next.js 16 project
- [ ] Set up TypeScript configuration
- [ ] Configure Tailwind CSS v4
- [ ] Install and configure ShadCN UI
- [ ] Set up component libraries (abui.io, @smoothui, @reui)
- [ ] Set up Agility CMS integration
- [ ] Configure AgilityPic component
- [ ] Set up performance monitoring tools
- [ ] Configure bundle analyzer
- [ ] Configure MCP servers
- [ ] Create project structure
- [ ] Set up AGENTS.md and agent-specific files
- [ ] Initialize prompt documentation folder
- [ ] **Create process-docs folder structure**
- [ ] **Document Phase 1 setup in process-docs/ (with screenshots)**

### Phase 2: Core Infrastructure
- [ ] Set up Agility CMS instance
- [ ] Create content models in Agility (**USE MCP SERVER - `save_content_model`**)
- [ ] Configure containers (**USE MCP SERVER - `save_container`**)
- [ ] Set up API routes for revalidation
- [ ] Create base layout components
- [ ] Implement navigation
- [ ] Set up routing structure
- [ ] Configure environment variables
- [ ] **If MCP operations fail**: Document in `prompts/troubleshooting/` for manual completion

### Phase 3: Homepage & Layout
- [ ] Design and build homepage
- [ ] Create header/navigation
- [ ] Create footer
- [ ] Implement responsive layout
- [ ] Add dark mode support
- [ ] Style with Tailwind Plus patterns
- [ ] **Document homepage design and implementation in process-docs/**

### Phase 4: Blog System
- [ ] Create blog listing page
- [ ] Create individual blog post pages
- [ ] Set up blog post content model
- [ ] Implement markdown processing with gallery support
- [ ] Create gallery components (carousel, masonry, grid, thumbnail, stacked, comparison, tabs)
- [ ] Implement gallery markdown syntax parser
- [ ] Integrate AgilityPic component in all galleries
- [ ] Add responsive image sizing (mobile fallbacks + high-res)
- [ ] Add blog post components
- [ ] Implement RSS feed
- [ ] Style blog pages
- [ ] Optimize gallery component bundle size
- [ ] **Document blog system implementation in process-docs/ (with gallery examples and screenshots)**

### Phase 5: About & Career Pages
- [ ] Build about page
- [ ] Create career timeline component
- [ ] Set up career content model
- [ ] Design career page layout
- [ ] Add career entry components

### Phase 6: Uses Page
- [ ] Design /uses page layout
- [ ] Create uses content model
- [ ] Build uses item components
- [ ] Organize by categories
- [ ] Add affiliate link handling (if applicable)
- [ ] Style with Spotlight-inspired design

### Phase 7: Content & CMS Integration
- [ ] Populate initial content (**USE MCP SERVER - `save_content_items`**)
- [ ] Create pages (**USE MCP SERVER - `save_page`**)
- [ ] Set up content workflows
- [ ] Configure webhooks
- [ ] Test content updates
- [ ] Verify revalidation
- [ ] **If MCP operations fail**: Document in `prompts/troubleshooting/` for manual completion

### Phase 8: Styling & Polish
- [ ] Apply Tailwind Plus Spotlight styling
- [ ] Add subtle animations (performance-optimized)
- [ ] Polish typography
- [ ] Refine dark mode
- [ ] Implement AgilityPic component with responsive images
- [ ] Optimize all images (mobile fallbacks + high-res versions)
- [ ] Performance optimization (code splitting, lazy loading)
- [ ] Bundle size optimization
- [ ] Lighthouse performance audit and fixes

### Phase 9: Testing & QA
- [ ] Write Playwright E2E tests
- [ ] Test CMS content rendering
- [ ] Cross-browser testing
- [ ] Accessibility audit (target: 100)
- [ ] Performance testing (target: 100 Lighthouse score)
- [ ] Mobile responsiveness check
- [ ] Image loading performance testing
- [ ] Core Web Vitals optimization
- [ ] Bundle size analysis

### Phase 10: Deployment
- [ ] Set up production environment
- [ ] Configure production Agility CMS
- [ ] Set up CI/CD pipeline
- [ ] Deploy to hosting (Vercel recommended)
- [ ] Configure custom domain
- [ ] Set up monitoring

---

## 📋 Key Features

### Must-Have Features
- ✅ Next.js 16 App Router
- ✅ Agility CMS integration
- ✅ Blog system with flexible galleries
- ✅ About page
- ✅ Career timeline
- ✅ /uses page
- ✅ Dark mode
- ✅ Responsive design
- ✅ SEO optimization
- ✅ RSS feed
- ✅ **Perfect performance** (100 Lighthouse scores)
- ✅ **AgilityPic** for all images with responsive sizing
- ✅ Optimized animations and UI features

### Nice-to-Have Features
- 🔲 Search functionality
- 🔲 Newsletter signup
- 🔲 Comments system (optional)
- 🔲 Analytics integration
- 🔲 Performance monitoring
- 🔲 Multi-language support (if needed)

---

## 🛠️ Development Guidelines

### Code Style
- TypeScript strict mode
- Functional components with hooks
- Server Components by default, Client Components when needed
- Consistent naming conventions (camelCase for variables, PascalCase for components)
- Meaningful component and file names

### Process Documentation
- **Document as you go**: Create/update blog posts in `process-docs/` folder
- **Include screenshots**: Save images in `process-docs/images/` subfolder
- **Blog post style**: Write narrative documentation, not just technical notes
- **File naming**: Use `YYYY-MM-DD-feature-name.md` format
- **Update existing posts**: When iterating on features, update the relevant post
- **Document significant milestones**: Features, decisions, challenges, solutions

### Component Patterns
- Use ShadCN UI as base
- Prefer abui.io components when available (primary choice)
- Use @smoothui for motion components and microinteractions (best match for Spotlight)
- Use @reui for additional animated effects
- Customize with Tailwind Plus patterns
- Keep components focused and reusable
- Document component props with TypeScript
- **Performance First**: All components must be lightweight and optimized
- **Lazy Loading**: Implement lazy loading for below-the-fold content
- **Code Splitting**: Use dynamic imports for heavy components
- **Animation Performance**: Use CSS transforms and will-change for smooth animations

### Agility CMS Patterns
- **CRITICAL: Use Agility CMS MCP Server for ALL CMS operations**
  - Create/update content models via `save_content_model` MCP operation
  - Create/update content items via `save_content_items` MCP operation
  - Create/update pages via `save_page` MCP operation
  - Create/update containers via `save_container` MCP operation
  - Upload media via `initialize_media_upload` MCP operation
  - **Only use Agility CMS UI manually if MCP operations fail** (with troubleshooting documentation)
- Register all components in `src/components/agility-components/index.ts`
- Use TypeScript interfaces for content types
- Implement proper error handling
- Cache content appropriately
- Use revalidation webhooks
- **Always use `<AgilityPic>` for images** (never Next.js Image)
- AgilityPic handles responsive sizing automatically
- **If MCP operation fails**: Create troubleshooting file in `prompts/troubleshooting/` with full JSON input/output and error messages

### Testing Strategy
- E2E tests with Playwright for critical paths
- Test CMS content rendering
- Test responsive design
- Accessibility testing
- Performance testing (Lighthouse CI)
- Core Web Vitals monitoring
- Image loading performance testing
- Bundle size monitoring

---

## ⚡ Performance Optimization Strategy

### Goal: 100 Lighthouse Scores
**Target**: Perfect 100 scores across Performance, Accessibility, Best Practices, and SEO.

### Core Principles
1. **Lightweight First**: Minimize bundle size, eliminate unnecessary dependencies
2. **Progressive Enhancement**: Core content loads first, enhancements layer on top
3. **Lazy Loading**: Load below-the-fold content and images on demand
4. **Optimized Animations**: Use CSS transforms and GPU acceleration
5. **Responsive Images**: Serve appropriate image sizes based on device and DPI

### Image Optimization Strategy

#### AgilityPic Component
**All images must use `<AgilityPic>` component** (Agility CMS optimized image component)

**Implementation Requirements**:
- Use AgilityPic instead of Next.js Image component
- Small mobile versions as fallback (via `fallbackWidth`)
- High-res versions loaded via `sources` array with media queries
- Proper sizing based on screen size (responsive breakpoints)
- Lazy loading for below-the-fold images
- Proper aspect ratio to prevent layout shift

**AgilityPic Syntax**:
```typescript
<AgilityPic
  image={image} // Agility CMS image object
  className="w-full h-full object-cover"
  fallbackWidth={400} // Small mobile fallback (default)
  sources={[
    // Desktop - high DPI
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

**Key Points**:
- `fallbackWidth`: Small mobile version (400px recommended) - serves as default/fallback
- `sources` array: Media queries determine which image size to load based on viewport and DPI
- Media queries align with Tailwind breakpoints:
  - Mobile: `(max-width: 639px)` - matches Tailwind `sm` breakpoint
  - Tablet: `(min-width: 640px)` - matches Tailwind `sm` breakpoint
  - Desktop: `(min-width: 1280px)` - matches Tailwind `xl` breakpoint
- **High-DPI Support**: Include `(min-resolution: 2dppx)` for retina/2x displays
  - High-DPI images should be 2x the base width (e.g., 1200px → 2400px for 2x)
  - Order matters: Place high-DPI queries before standard queries (more specific first)
- Component automatically handles responsive image loading
- AgilityPic uses the `image` prop (Agility CMS image object), not `src`

**Responsive Image Sizes** (using AgilityPic sources array):
- **Mobile (< 640px)**:
  - Standard: `fallbackWidth={400}` or `sources: [{ media: "(max-width: 639px)", width: 640 }]`
  - High-DPI: `{ media: "(max-width: 639px) and (min-resolution: 2dppx)", width: 1280 }`
- **Tablet (640px - 1279px)**:
  - Standard: `sources: [{ media: "(min-width: 640px)", width: 800 }]`
  - High-DPI: `{ media: "(min-width: 640px) and (min-resolution: 2dppx)", width: 1600 }`
- **Desktop (≥ 1280px)**:
  - Standard: `sources: [{ media: "(min-width: 1280px)", width: 1200 }]`
  - High-DPI: `{ media: "(min-width: 1280px) and (min-resolution: 2dppx)", width: 2400 }`

**Gallery Images - Recommended Sizes** (with high-DPI support):
- **Thumbnails**:
  - `fallbackWidth={200}`
  - `sources: [{ media: "(min-width: 640px) and (min-resolution: 2dppx)", width: 600 }, { media: "(min-width: 640px)", width: 300 }]`
- **Grid items**:
  - `fallbackWidth={400}`
  - `sources: [{ media: "(min-width: 1280px) and (min-resolution: 2dppx)", width: 1600 }, { media: "(min-width: 1280px)", width: 800 }, { media: "(min-width: 640px) and (min-resolution: 2dppx)", width: 1200 }, { media: "(min-width: 640px)", width: 600 }]`
- **Carousel**:
  - `fallbackWidth={640}`
  - `sources: [{ media: "(min-width: 1280px) and (min-resolution: 2dppx)", width: 2400 }, { media: "(min-width: 1280px)", width: 1200 }, { media: "(min-width: 640px) and (min-resolution: 2dppx)", width: 1600 }, { media: "(min-width: 640px)", width: 800 }]`
- **Lightbox**:
  - `fallbackWidth={800}`
  - `sources: [{ media: "(min-width: 1280px) and (min-resolution: 2dppx)", width: 3840 }, { media: "(min-width: 1280px)", width: 1920 }, { media: "(min-width: 640px) and (min-resolution: 2dppx)", width: 2400 }, { media: "(min-width: 640px)", width: 1200 }]`

### Code Optimization

#### Bundle Size
- **Target**: Initial bundle < 100KB (gzipped)
- Use dynamic imports for heavy components
- Code split by route
- Tree-shake unused code
- Analyze bundle with `@next/bundle-analyzer`

#### Lazy Loading
- Lazy load gallery components
- Lazy load animations (@smoothui, @reui)
- Lazy load below-the-fold content
- Use `React.lazy()` and `Suspense` for route-based splitting

#### Animation Performance
- Use CSS transforms (translate, scale, rotate) instead of position/width/height
- Use `will-change` property for animated elements
- Prefer CSS animations over JavaScript when possible
- Use `requestAnimationFrame` for JS animations
- Debounce/throttle scroll and resize handlers
- Use `transform: translateZ(0)` or `transform: translate3d(0,0,0)` to trigger GPU acceleration

### Core Web Vitals Targets

**Largest Contentful Paint (LCP)**: < 2.5 seconds
- Optimize images (AgilityPic with proper sizing)
- Preload critical resources
- Minimize render-blocking resources
- Use efficient caching strategies

**First Input Delay (FID)**: < 100 milliseconds
- Minimize JavaScript execution time
- Break up long tasks
- Use web workers for heavy computations
- Defer non-critical JavaScript

**Cumulative Layout Shift (CLS)**: < 0.1
- Set explicit dimensions on images (AgilityPic)
- Reserve space for dynamic content
- Avoid inserting content above existing content
- Use aspect-ratio CSS property

**First Contentful Paint (FCP)**: < 1.8 seconds
- Minimize critical rendering path
- Inline critical CSS
- Defer non-critical CSS
- Optimize fonts (preload, font-display: swap)

### Caching Strategy

#### Static Assets
- Cache images with long-term cache headers
- Use CDN for Agility CMS images
- Implement service worker for offline support (optional)

#### API Responses
- Cache Agility CMS API responses
- Use Next.js revalidation for ISR
- Implement stale-while-revalidate pattern

### Font Optimization
- Use `font-display: swap` for web fonts
- Preload critical fonts
- Subset fonts to include only needed characters
- Use system fonts where possible
- Limit number of font families and weights

### Third-Party Scripts
- Load analytics asynchronously
- Defer non-critical third-party scripts
- Use privacy-friendly analytics (minimal impact)
- Consider self-hosting analytics if needed

### Performance Monitoring

#### Development
- Use Next.js built-in performance monitoring
- Lighthouse CI in development
- Bundle analyzer for size monitoring
- React DevTools Profiler

#### Production
- Real User Monitoring (RUM)
- Core Web Vitals tracking
- Error tracking
- Performance budgets in CI/CD

### Performance Checklist

**Images**:
- [ ] All images use AgilityPic component (never Next.js Image)
- [ ] `fallbackWidth` set to small mobile size (400px default)
- [ ] `sources` array with media queries for responsive sizing
- [ ] Media queries: mobile (< 640px), tablet (640px+), desktop (1280px+)
- [ ] **High-DPI support**: Include `(min-resolution: 2dppx)` queries for retina displays
- [ ] High-DPI images are 2x the base width (e.g., 1200px → 2400px for 2x)
- [ ] Media query order: high-DPI queries before standard queries (more specific first)
- [ ] Proper sizing based on viewport, breakpoints, and DPI
- [ ] Lazy loading for below-the-fold images
- [ ] Proper aspect ratios to prevent CLS
- [ ] AgilityPic handles format optimization automatically

**Code**:
- [ ] Bundle size < 100KB initial load
- [ ] Code splitting by route
- [ ] Dynamic imports for heavy components
- [ ] Tree-shaking enabled
- [ ] No unused dependencies

**Animations**:
- [ ] CSS transforms instead of position/width/height
- [ ] GPU acceleration (will-change, transform3d)
- [ ] Debounced/throttled event handlers
- [ ] requestAnimationFrame for JS animations

**Core Web Vitals**:
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] FCP < 1.8s

**Caching**:
- [ ] Long-term cache for static assets
- [ ] ISR for CMS content
- [ ] Proper cache headers

**Fonts**:
- [ ] font-display: swap
- [ ] Preload critical fonts
- [ ] Limited font families/weights

---

## 📚 Documentation Requirements

### For AI Agents (`AGENTS.md`)
- Project architecture
- Code patterns and conventions
- Component guidelines
- **CMS integration patterns (Agility CMS MCP is PRIMARY)**
- **MCP server usage (use MCP for as much as possible)**
- **Plan update requirements (checklist style - update DEVELOPMENT-PLAN.md)**
- **Process documentation requirements (blog posts in process-docs/)**
- **Troubleshooting workflow (when MCP fails)**
- Testing requirements
- Deployment process

### For Developers (if shared)
- Setup instructions
- Environment variables
- CMS configuration
- Deployment guide
- Contributing guidelines

### For Content Editors
- How to create blog posts
- How to update pages
- How to manage content
- Image upload guidelines

---

## 🔐 Environment Variables

```env
# Agility CMS
AGILITY_API_FETCH_KEY=
AGILITY_API_PREVIEW_KEY=
AGILITY_GUID=
AGILITY_SECURITY_KEY=
AGILITY_LOCALES=en-us

# Next.js
NEXT_PUBLIC_SITE_URL=
NODE_ENV=development

# Optional
ANALYTICS_ID=
NEWSLETTER_API_KEY=
```

---

## 🎯 Success Criteria

1. ✅ Clean, modern design inspired by Daring Fireball and Spotlight
2. ✅ Fully functional blog system
3. ✅ Comprehensive /uses page
4. ✅ Career timeline showcasing experience
5. ✅ **Perfect performance** (Lighthouse score 100 across all categories)
6. ✅ Accessible (WCAG 2.1 AA)
7. ✅ Mobile responsive
8. ✅ Easy content management via Agility CMS
9. ✅ Well-documented for AI agents
10. ✅ SEO optimized

---

## 📋 Additional Items to Consider

### 1. AGENTS.md Template
**Status**: To be created
**Priority**: High
**Description**: Create the initial agent instructions file that serves as the single source of truth for all AI agents. Should include comprehensive project architecture, patterns, conventions, and guidelines.

**Contents should include**:
- Project overview and philosophy
- Code style and conventions
- Component patterns and guidelines
- **Agility CMS integration patterns**
  - **CRITICAL: Use Agility CMS MCP Server for ALL operations**
  - MCP operations are the PRIMARY method
  - Only fall back to manual UI work if MCP fails (with documentation)
- **MCP server usage instructions**
  - Agility CMS MCP is the primary tool
  - List of all available MCP operations
  - When and how to use each operation
- **Plan update requirements**
  - Update `DEVELOPMENT-PLAN.md` in checklist style
  - Check off completed items
  - Add notes when making changes
- **Process documentation requirements**
  - Create/update blog posts in `process-docs/` folder
  - Document features, decisions, and milestones as work progresses
  - Include screenshots in `process-docs/images/` subfolder
  - Write in blog post style (narrative, not just technical notes)
  - Use descriptive filenames: `YYYY-MM-DD-feature-name.md`
- **Troubleshooting workflow**
  - What to do when MCP operations fail
  - How to create troubleshooting documentation
  - Format for troubleshooting files
- Testing requirements and patterns
- Deployment process
- Common tasks and workflows
- Troubleshooting guide

### 2. Prompt Templates
**Status**: To be created
**Priority**: Medium
**Description**: Create starter templates for common development tasks to ensure consistency in how prompts are structured and to speed up development.

**Templates needed**:
- Component creation prompts
- Page creation prompts
- Content model setup prompts
- Styling/design prompts
- Bug fix prompts
- Refactoring prompts
- Testing prompts

**Location**: `prompts/templates/`

### 3. Component Inventory
**Status**: To be created
**Priority**: Medium
**Description**: Document which components from abui.io, @smoothui, and @reui will be used in the project, along with any customizations needed.

**Should include**:
- List of abui.io components to integrate (primary preferred)
- List of @smoothui components for motion and microinteractions
- List of @reui components for animated effects
- **Gallery Components**:
  - ShadCN Carousel (`npx shadcn add carousel`) - for carousel and thumbnail galleries
  - ShadCN Dialog (`npx shadcn add dialog`) - for lightbox
  - ShadCN Tabs (`npx shadcn add tabs`) - for tabs gallery
  - ShadCN Slider (`npx shadcn add slider`) - for before/after comparison
  - ShadCN Aspect Ratio (`npx shadcn add aspect-ratio`) - for image sizing
  - **AgilityPic** - Agility CMS image component (MUST use for all images)
  - Custom masonry, grid, and stacked layout components
- Component usage mapping (which components for which pages/features)
- Customization requirements
- Dependencies and prerequisites
- Integration notes
- Installation commands for each component

**Location**: `docs/component-inventory.md`

### 4. Design System Documentation
**Status**: To be created
**Priority**: Medium
**Description**: Document the design system including color palette, typography, spacing, and other design tokens inspired by Tailwind Plus Spotlight.

**Should include**:
- Color palette (light/dark mode)
- Typography scale and font choices
- Spacing system
- Border radius values
- Shadow system
- Animation/transition patterns
- Breakpoints
- Component variants

**Location**: `docs/design-system.md`

### 5. Content Migration Plan
**Status**: To be created (if needed)
**Priority**: Low
**Description**: If migrating existing content from another platform or format, create a plan for content migration.

**Should include**:
- Source content inventory
- Migration mapping (old format → Agility CMS models)
- Data transformation requirements
- Migration scripts/tools
- Testing checklist
- Rollback plan

**Location**: `docs/content-migration.md`

### 6. Component Usage Examples
**Status**: To be created
**Priority**: Low
**Description**: Create examples and documentation showing how to use common components and patterns in the project.

**Should include**:
- Code examples for common patterns
- Component composition examples
- Best practices
- Common pitfalls to avoid

**Location**: `docs/component-examples.md`

---

## 📝 Next Steps

1. **Review this plan** and adjust as needed
2. **Set up Agility CMS instance** and get API keys
3. **Initialize Next.js 16 project** with TypeScript
4. **Configure MCP servers** in development environment
5. **Create AGENTS.md** with comprehensive instructions
6. **Set up prompt documentation** structure
7. **Create prompt templates** for common tasks
8. **Document component inventory** (abui.io, @smoothui, @reui components)
9. **Create design system documentation**
10. **Begin Phase 1** development

---

## 🔗 Reference Links & Resources

### Design Inspiration
- [Wes Bos /uses Page](https://wesbos.com/uses) - Inspiration for the /uses page design and structure
- [Daring Fireball](https://daringfireball.net) - Clean, minimal, content-first design inspiration
- [Tailwind Plus Spotlight Demo](https://spotlight.tailwindui.com) - Live demo of the Spotlight template
- **Local Tailwind Plus Spotlight Template**: `/Users/joelvarty/Downloads/tailwind-plus-spotlight/spotlight-ts/src` - Local reference for styling patterns and component structure

### Code Examples & Templates
- [Agility Next.js Demo Site](https://github.com/agility/nextjs-demo-site-2025) - Reference implementation for project structure and Agility CMS integration (Next.js 15, adapt for Next.js 16)

### Component Libraries
- [ShadCN UI](https://ui.shadcn.com) - Base component library
- [ShadCN Directory](https://ui.shadcn.com/docs/directory) - Component directory (source for all component registries)
- [abui.io Components](https://www.abui.io) - Primary preferred components from ShadCN directory
- **@smoothui** - Motion components with subtle animations (best match for Spotlight styling)
  - Install: `npx shadcn add @smoothui/<component>`
  - Focus: Smooth animations, subtle feedback, delightful microinteractions
- **@reui** - Animated effects that pair beautifully with shadcn/ui
  - Install: `npx shadcn add @reui/<component>`
  - Focus: Animated effects built with React, TypeScript, Tailwind CSS, and Motion

### MCP Servers & Tools
- [ShadCN MCP Server](https://ui.shadcn.com/docs/mcp) - Component generation via MCP

### Documentation
- [Next.js 16 Documentation](https://nextjs.org/docs)
- [Agility CMS Documentation](https://agilitycms.com/docs)

---

## 📅 Development Timeline

**Estimated Duration**: 4-6 weeks (part-time development)

- Week 1: Phases 1-2 (Setup & Infrastructure)
- Week 2: Phases 3-4 (Layout & Blog)
- Week 3: Phases 5-6 (About, Career, Uses)
- Week 4: Phases 7-8 (Content & Styling)
- Week 5: Phase 9 (Testing)
- Week 6: Phase 10 (Deployment & Polish)

---

**Last Updated**: [Date will be updated as plan evolves]
**Current Phase**: Planning
**Active Agent**: [To be updated in prompts/current-agent.md]
