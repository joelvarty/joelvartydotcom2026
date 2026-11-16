This is a [Next.js](https://nextjs.org) project for [joelvarty.com](https://www.joelvarty.com), powered by [Agility CMS](https://agilitycms.com).

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture

- **CMS**: Agility CMS (content, sitemap, dynamic pages)
- **Framework**: Next.js 16 App Router + React 19.3, with **Cache Components** (`cacheComponents: true`)
- **Routing**: `[locale]/[...slug]` dynamic routing driven by the Agility sitemap
- **Hosting**: Vercel
- **Proxy**: `src/proxy.ts` handles preview, redirects, locale rewrites, real 404s and CDN cache headers

### Key Files

| File | Purpose |
|------|---------|
| `src/app/[locale]/[...slug]/page.tsx` | Page renderer, with `generateStaticParams` from the sitemap |
| `src/lib/cms/getAgilityPage.ts` | Composes the cached getters (sitemap → page → dynamic item) |
| `src/lib/cms/getAgilityContext.ts` | The ONE place `draftMode()` is read |
| `src/lib/cms/get*.ts` | Cached Agility reads (`"use cache"` + tag), uncached in preview |
| `src/lib/cms/publishedPaths.ts` | Published-path check the proxy uses for real 404s |
| `src/app/api/revalidate/route.ts` | Agility publish webhook: clears cache tags |
| `src/app/api/preview/route.ts` | Enables draft mode for preview requests |
| `src/proxy.ts` | Preview, redirects, locale routing, 404s, cache headers |

## Caching & Revalidation

Every page is prerendered. Every published Agility read is a `"use cache"`
entry with a cache tag; preview reads are never cached. `preview` is passed
explicitly to every read, and `draftMode()` is read only in `getAgilityContext()`.

### How a publish goes live

1. Content is published in Agility CMS
2. The webhook posts to `/api/revalidate` with the content or page ID
3. The handler clears the matching tags (`agility-content-*`, `agility-page-*`, `agility-sitemap-*`) and revalidates the page's path
4. The next request renders with the new content

The tag strings in `src/lib/cms/` and in the webhook are a contract: change them together.

`FORCE_PUBLISHED=1 npm run dev` serves published content locally (dev serves staging by default).

See [src/docs/07-caching-strategies.md](src/docs/07-caching-strategies.md) for full details.

## GEO / AEO

Every page carries one schema.org JSON-LD `@graph` (built with `@agility/geo`) with Joel as the central `Person`. The site also serves `/llms.txt`, a markdown twin of every page (`/{page}.md`, `/index.md` for home) and a `robots.txt` that allows AI crawlers by name. See [src/docs/12-geo-structured-data.md](src/docs/12-geo-structured-data.md).

## Documentation

Detailed docs are in `src/docs/`:

- [01 - Agility CMS Overview](src/docs/01-agility-cms-overview.md)
- [02 - Page Routing](src/docs/02-page-routing.md)
- [03 - Creating Components](src/docs/03-creating-components.md)
- [04 - Data Fetching](src/docs/04-data-fetching.md)
- [05 - Containers and Lists](src/docs/05-containers-and-lists.md)
- [06 - Localization](src/docs/06-localization.md)
- [07 - Caching Strategies](src/docs/07-caching-strategies.md)
- [08 - Common Components](src/docs/08-common-components.md)
- [12 - GEO, Structured Data and AI Surfaces](src/docs/12-geo-structured-data.md)

## Deploy on Vercel

Deployed automatically via Git integration on the `main` branch.
