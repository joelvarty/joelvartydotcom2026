# AGENTS.md - AI Coding Guide for joelvarty.com

## Project Overview

Next.js 16 App Router site (React 19.3, Cache Components) powered by Agility CMS, hosted on Vercel. All pages route through `src/app/[locale]/[...slug]/page.tsx` using a flat sitemap from the CMS.

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
│   │   ├── getAgilityPage.ts         # composes the cached getters below
│   │   ├── getPage.ts
│   │   ├── getContentItem.ts
│   │   ├── getContentList.ts
│   │   ├── getSitemapFlat.ts
│   │   ├── getSitemapNested.ts
│   │   ├── getAgilityContext.ts
│   │   ├── getAgilitySDK.ts
│   │   ├── getRedirections.ts
│   │   └── publishedPaths.ts        # published-path check for proxy 404s
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
import { type UnloadedModuleProps } from "@agility/nextjs";
import { getContentItem } from "@/lib/cms/getContentItem";

interface YourModuleFields {
  title: string;
  // ... fields from CMS
}

export default async function YourModule({ module, languageCode, isPreview }: UnloadedModuleProps) {
  const { fields: { title } } = await getContentItem<YourModuleFields>({
    contentID: module.contentid,
    languageCode,
    preview: isPreview, // ALWAYS pass this through
  });
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
const posts = await getContentList({ referenceName: "posts", languageCode, take: 10, preview: isPreview });

// Single item
const item = await getContentItem({ contentID: 123, languageCode: "en-us", preview: isPreview });
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

## Caching & Revalidation (Cache Components)

`cacheComponents: true` is on. Every route is prerendered as a static shell.

- **`preview` is an explicit parameter, never ambient state.** `draftMode()` is
  read only in `getAgilityContext()`. Components get `isPreview` in their props
  and pass `preview: isPreview` to every read. A `draftMode()` call inside
  `src/lib/cms/` would make every read request-scoped and stop prerendering.
- Each primitive in `src/lib/cms/` is `"use cache"` + `cacheTag` +
  `cacheLife("days")` when published, and an uncached fetch after
  `await connection()` in preview.
- `getAgilityPage` composes the primitives (sitemap → page → dynamic item). Do
  not go back to `getAgilityPageProps`: it fetches uncached and calls `Date.now()`.
- Tags (`agility-content-{id|refname}-{locale}`, `agility-page-{id}-{locale}`,
  `agility-sitemap-{flat|nested}-{locale}`) are a **contract** with
  `/api/revalidate`. Change both in the same commit.
- **Rejected under cacheComponents:** `export const revalidate/runtime/dynamic`.
  `new Date()`/`Date.now()`/`Math.random()` in render outside a cache fail the
  build (dates parsed from content are fine).
- **404s come from the proxy**, checked against the published sitemap. Add
  hand-written routes to `APP_PATHS`/`APP_PREFIXES` in
  `src/lib/cms/publishedPaths.ts`, or they 404 in production only.
- Preview params are handled by both the proxy and `beforeFiles` rewrites in
  `next.config.ts` (cached pages skip the proxy). Keep both.
- Only the `page` and `order` query params reach pages (encoded into the path by
  the proxy); add to `ALLOWED_QUERY_PARAMS` in `src/proxy.ts` if a component needs another.
- `FORCE_PUBLISHED=1 npm run dev` serves published content locally.
- See `src/docs/07-caching-strategies.md` for details.

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
