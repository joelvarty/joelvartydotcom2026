This is a [Next.js](https://nextjs.org) project for [joelvarty.com](https://www.joelvarty.com), powered by [Agility CMS](https://agilitycms.com).

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture

- **CMS**: Agility CMS (content, sitemap, dynamic pages)
- **Framework**: Next.js App Router with `[locale]/[...slug]` dynamic routing
- **Hosting**: Vercel
- **Localization**: Locale-based routing via middleware (`src/proxy.ts`)

### Key Files

| File | Purpose |
|------|---------|
| `src/app/[locale]/[...slug]/page.tsx` | Dynamic page renderer with static param generation |
| `src/app/api/revalidate/route.ts` | Webhook handler for Agility CMS publish events |
| `src/app/api/preview/route.ts` | Enables draft mode for preview requests |
| `src/proxy.ts` | Middleware for locale routing, preview, and redirects |
| `src/lib/cms/getAgilityPage.ts` | Wrapper around Agility SDK's page props |
| `src/lib/cms/getAgilityContext.ts` | Determines preview mode based on draft mode |
| `src/lib/cms/getAgilitySDK.ts` | Initializes SDK with correct API key |

## Caching & Revalidation

Content is cached using Next.js Data Cache with on-demand revalidation via Agility CMS webhooks.

### How Revalidation Works

1. Content is published in Agility CMS
2. Webhook fires to `/api/revalidate` with content/page IDs
3. Relevant cache tags are invalidated (`agility-content-*`, `agility-sitemap-flat-*`)
4. `revalidatePath()` purges the Full Route Cache for the affected page
5. Next request triggers a fresh server render with updated data

### Important: Sitemap Tag Revalidation

When content items change, the revalidation route must also invalidate the sitemap cache tag (`agility-sitemap-flat-{locale}`). The `@agility/nextjs` SDK caches the sitemap in the Data Cache and uses it to look up pages by path. If only content tags are invalidated, the SDK may use a stale sitemap and fail to find the page, producing a cached 404.

See [src/docs/07-caching-strategies.md](src/docs/07-caching-strategies.md) for full details.

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

## Deploy on Vercel

Deployed automatically via Git integration on the `main` branch.
