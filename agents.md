# AGENTS.md - AI Coding Guide for joelvarty.com

## Project Overview

Next.js 15 App Router site powered by Agility CMS, hosted on Vercel. All pages route through `src/app/[locale]/[...slug]/page.tsx` using a flat sitemap from the CMS.

## File Structure

```
src/
├── app/[locale]/[...slug]/page.tsx   # All pages route here
├── components/
│   ├── agility-components/           # CMS module components
│   │   ├── index.ts                  # Component registry (getModule)
│   │   ├── RichTextArea.tsx
│   │   ├── BlogDetails.tsx
│   │   ├── blog-listing/BlogListing.tsx
│   │   ├── CareerTimeline.tsx
│   │   ├── UsesSection.tsx
│   │   ├── Hero.tsx
│   │   ├── BasicMarkdown.tsx
│   │   └── SeriesLanding.tsx
│   └── agility-pages/               # Page templates
│       ├── index.ts                  # Template registry (getPageTemplate)
│       └── Main.tsx
├── lib/
│   ├── cms/                          # CMS helper functions
│   │   ├── getAgilityPage.ts
│   │   ├── getContentItem.ts
│   │   ├── getContentList.ts
│   │   ├── getSitemapFlat.ts
│   │   ├── getSitemapNested.ts
│   │   ├── getAgilityContext.ts
│   │   ├── getAgilitySDK.ts
│   │   ├── getRedirections.ts
│   │   └── cacheConfig.ts
│   └── i18n/config.ts               # Locale configuration
├── proxy.ts                          # Routing middleware (locale rewrites)
└── docs/                             # Detailed reference docs (01-11)
```

## Adding a New Module Component

1. Create `src/components/agility-components/YourModule.tsx`
2. Register it in `src/components/agility-components/index.ts` (add import + switch case)
3. The case name must match the module's reference name in Agility CMS

```tsx
// YourModule.tsx
interface YourModuleProps {
  module: {
    fields: {
      title: string;
      // ... fields from CMS
    };
  };
  locale: string;
}

export default function YourModule({ module, locale }: YourModuleProps) {
  const { title } = module.fields;
  return <div>{title}</div>;
}
```

## Adding a Page Template

1. Create `src/components/agility-pages/YourTemplate.tsx` with `<ContentZone>` components
2. Register in `src/components/agility-pages/index.ts`

## Fetching Content

```tsx
import { getContentList } from "@/lib/cms/getContentList";
import { getContentItem } from "@/lib/cms/getContentItem";
import { getSitemapFlat } from "@/lib/cms/getSitemapFlat";

// List of items
const posts = await getContentList({ referenceName: "posts", locale, take: 10, sort: "fields.date desc" });

// Single item
const item = await getContentItem({ contentID: 123, locale: "en-us" });
```

## Client Components

For interactivity, split into server + client components:

```tsx
// ServerComponent.tsx (fetches data)
import ClientPart from "./ClientPart.client";
export default async function ServerComponent({ module, locale }: Props) {
  const data = await fetchData();
  return <ClientPart data={data} />;
}

// ClientPart.client.tsx
"use client";
export default function ClientPart({ data }: { data: any }) {
  // useState, onClick, etc.
}
```

## Caching & Revalidation

- Page revalidation: `export const revalidate = 86400` (24h) in page.tsx
- On-demand revalidation: webhook at `/api/revalidate`
- **Critical**: When content changes, the sitemap tag `agility-sitemap-flat-{locale}` must be revalidated alongside content tags, or 404s get cached for 24h
- See `src/docs/07-caching-strategies.md` for details

## Locales

- Default locale (`en-us`) has clean URLs: `/about`
- Other locales are prefixed: `/fr/about`
- Configure in `src/lib/i18n/config.ts`

## MCP Server

Agility CMS MCP server is pre-configured. Use it to browse content models, fetch content items, and manage CMS configuration directly.

## Detailed Docs

Reference documentation lives in `src/docs/`:

| Doc | Topic |
|-----|-------|
| 01-agility-cms-overview | How Agility CMS works |
| 02-page-routing | Dynamic routing and URLs |
| 03-creating-components | Module components step-by-step |
| 04-data-fetching | Fetching content from CMS |
| 05-containers-and-lists | Content lists (blogs, etc.) |
| 06-localization | Multi-language support |
| 07-caching-strategies | Caching and revalidation |
| 08-common-components | Production-ready examples |
| 09-whats-included | Feature checklist |
| 10-mcp-server-setup | AI assistant MCP integration |
| 11-linked-nested-content | Linked and nested content |

## Environment Variables

Required in `.env.local`:
```
AGILITY_GUID=your-instance-guid
AGILITY_API_FETCH_KEY=your-fetch-key
AGILITY_API_PREVIEW_KEY=your-preview-key
AGILITY_LOCALES=en-us
AGILITY_SITEMAP=website
```
