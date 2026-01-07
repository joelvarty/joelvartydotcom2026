# Agility CMS + Next.js Documentation

Complete documentation for building websites with Agility CMS and Next.js. Optimized for both human developers and AI coding assistants.

## Quick Start

1. **[01-agility-cms-overview.md](./01-agility-cms-overview.md)** - Understand how Agility CMS works
2. **[03-creating-components.md](./03-creating-components.md)** - Create your first module
3. **[08-common-components.md](./08-common-components.md)** - See production-ready examples

## 📚 Documentation Index

### Core Concepts
- **[01-agility-cms-overview.md](./01-agility-cms-overview.md)** - How Agility CMS works with Next.js
- **[02-page-routing.md](./02-page-routing.md)** - Dynamic routing, URLs, and the proxy

### Development Guide
- **[03-creating-components.md](./03-creating-components.md)** - Build module components step-by-step
- **[04-data-fetching.md](./04-data-fetching.md)** - Fetch content from Agility CMS
- **[05-containers-and-lists.md](./05-containers-and-lists.md)** - Work with content lists (blogs, testimonials, etc.)
- **[08-common-components.md](./08-common-components.md)** - Production-ready component examples

### Advanced Features
- **[06-localization.md](./06-localization.md)** - Multi-language support
- **[07-caching-strategies.md](./07-caching-strategies.md)** - Performance and caching
- **[11-linked-nested-content.md](./11-linked-nested-content.md)** - Linked and nested content patterns

### Setup & Configuration
- **[10-mcp-server-setup.md](./10-mcp-server-setup.md)** - Connect AI assistants to Agility CMS via MCP
- **[09-whats-included.md](./09-whats-included.md)** - Feature checklist

## 🎯 Common Tasks

### Add a Blog
1. Read [05-containers-and-lists.md](./05-containers-and-lists.md)
2. Create PostListing component using examples
3. Configure "posts" content list in Agility CMS
4. Add content and it renders automatically

### Add a Hero Section
1. See examples in [08-common-components.md](./08-common-components.md)
2. Copy Hero component code
3. Register in `components/agility-components/index.ts`
4. Create Hero module in Agility CMS

### Enable Multi-Language
1. Read [06-localization.md](./06-localization.md)
2. Update `AGILITY_LOCALES` environment variable
3. Update `lib/i18n/config.ts` with new locales
4. Add locale-specific content in Agility CMS

### Optimize Performance
1. Read [07-caching-strategies.md](./07-caching-strategies.md)
2. Configure revalidation time in page routes
3. Set up webhooks for on-demand revalidation
4. Monitor and debug cache behavior

## 🏗️ Project Architecture

```
/
├── app/
│   └── [locale]/
│       ├── [...slug]/
│       │   └── page.tsx           # All pages route here
│       └── layout.tsx
├── components/
│   ├── agility-components/        # CMS modules (Hero, Blog, etc.)
│   │   ├── index.ts               # Component registry
│   │   ├── RichTextArea.tsx
│   │   └── ...
│   └── agility-pages/             # Page templates
│       ├── index.ts               # Template registry
│       ├── Main.tsx
│       └── ...
├── lib/
│   ├── cms/                       # CMS helper functions
│   │   ├── getAgilityPage.ts     # Fetch page with modules
│   │   ├── getContentItem.ts     # Fetch single item
│   │   ├── getContentList.ts     # Fetch list of items
│   │   └── ...
│   └── i18n/
│       └── config.ts              # Locale configuration
├── proxy.ts                        # Routing proxy (Next.js 16+)
└── docs/                          # This documentation
```

## 🔑 Key Concepts

### Modules
Reusable components that content editors add to pages in Agility CMS.
- Examples: Hero, PostListing, Testimonials, ContactForm
- Stored in: `components/agility-components/`
- Registered in: `components/agility-components/index.ts`

### Page Templates
Define the layout structure of pages. Each template has named content zones where modules can be placed.
- Stored in: `components/agility-pages/`
- Registered in: `components/agility-pages/index.ts`

### Content Lists
Collections of structured content items (posts, team members, testimonials).
- Defined in Agility CMS
- Fetched with `getContentList()`
- Can be filtered, sorted, and paginated

### Locales
Multi-language support with clean URLs.
- Default locale has no prefix: `/about`
- Other locales use prefix: `/fr/about`, `/es/about`
- Configured in: `lib/i18n/config.ts`

### Caching
Automatic caching with Next.js Data Cache.
- Time-based revalidation (ISR)
- On-demand revalidation via webhooks
- Cache tags for targeted updates

## 🛠️ CMS Helper Functions

| Function | Purpose | Example |
|----------|---------|---------|
| `getAgilityPage()` | Fetch complete page with modules | Page routes |
| `getContentItem()` | Fetch single content item | Module component |
| `getContentList()` | Fetch collection of items | Blog listing |
| `getSitemapFlat()` | Fetch flat sitemap | Navigation |
| `getSitemapNested()` | Fetch hierarchical sitemap | Breadcrumbs |

## 🤖 For AI Coding Assistants

This documentation enables AI tools to:
- ✅ Generate production-ready components following established patterns
- ✅ Fetch content correctly with proper TypeScript types
- ✅ Handle locales, caching, and routing automatically
- ✅ Create maintainable, type-safe code
- ✅ Connect to Agility CMS via MCP server (optional)

**AI-Specific Guide**: See [../../agents.md](../../agents.md)

## 📖 Documentation Philosophy

1. **Example-Driven** - Lots of copy-paste ready code
2. **Pattern-Based** - Consistent patterns throughout
3. **Production-Ready** - Real-world examples that work
4. **Type-Safe** - TypeScript types in all examples

## ✅ Success Metrics

You know the docs are working when:
- You can build features without checking other files
- Generated code follows existing patterns
- TypeScript types are always included
- CMS integration "just works"

## 🔗 Related Documentation

- **[../../agents.md](../../agents.md)** - Guide for AI coding assistants
- **[../.claude/QUICK-START.md](../.claude/QUICK-START.md)** - 5-minute quick start
- **[../DEVELOPMENT.md](../DEVELOPMENT.md)** - Development workflow
- **[../README.md](../README.md)** - Project overview

---

**Need help?** Start with [01-agility-cms-overview.md](./01-agility-cms-overview.md) or jump to [08-common-components.md](./08-common-components.md) for examples. 🚀
