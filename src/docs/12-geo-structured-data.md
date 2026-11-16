# GEO / AEO: Structured Data and Machine-Readable Surfaces

How joelvarty.com tells search engines and AI answer engines who Joel is and what
each page says. Everything here is generated from Agility content; nothing is
hand-maintained.

## The entity graph (JSON-LD)

Every page renders ONE `<script type="application/ld+json">` holding one
`@graph`, built by `@agility/geo` in `src/lib/seo/buildPageJsonLd.ts` and
rendered by the page route through `<JsonLd>` (`src/lib/seo/JsonLd.tsx`).

| Node | `@id` | Notes |
|---|---|---|
| `WebSite` | `https://www.joelvarty.com/#website` | `publisher` is the Person |
| `Person` (Joel) | `https://www.joelvarty.com/#person` | the central entity, on every page; `sameAs` = social profiles |
| `WebPage` / `ProfilePage` / `CollectionPage` / `ItemPage` | `{url}#webpage` | typed by the GEO tab's Page Type, else the defaults below |
| `BreadcrumbList` | `{url}#breadcrumb` | starts at Home (`/`), skips folders |
| `BlogPosting` | `{url}#article` | from the BlogPost model's fields; author and publisher are the Person |
| `VideoObject` | `{url}#video-N` | one per YouTube video the post embeds (or its `videoUrl` field) |

Rules:

- **Always render through `<JsonLd data={...} />`.** It uses `serializeJsonLd`,
  which writes `<`, `>` and `&` as `<` etc. Plain `JSON.stringify` would let a
  post containing `</script>` break out of the tag.
- **Reference entities by `@id`** (`src/lib/seo/schema.ts`), never inline a new
  Person or WebSite: a crawler should resolve the whole site to one Joel.
- **Map content models in `src/lib/seo/contentModelMappings.ts`**, keyed by the
  model's `definitionName`. Don't build JSON-LD inside components.
- Who Joel is (name, job title, image, description) lives in `src/config/site.ts`.

### Page types

The editor's GEO tab Page Type wins. Without one (`DEFAULT_PAGE_TYPES` in
`buildPageJsonLd.ts`): `/about`, `/career`, `/story` are `ProfilePage` (with
`mainEntity` = the Person), `/blog` and category/series pages are
`CollectionPage`, a post is an `ItemPage` whose `mainEntity` is the
`BlogPosting`, the home page is a `WebPage` `about` the Person.

### The editor's GEO tab

`@agility/content-fetch` 2.0.14 delivers `page.geo` and `item.geo`. They are read
by `@agility/geo` / `@agility/nextjs/geo`:

| GEO tab field | Used for |
|---|---|
| Page Type | the WebPage `@type` |
| Summary | `<meta name="description">` fallback, BlogPosting/VideoObject `description`, llms.txt and `.md` summary |
| JSON-LD | merged into the graph by `@id` (the editor's values win) |
| llms.txt include | `include` / `exclude` / `inherit` (follows "show in sitemap") |
| AI crawlers | `block` adds `Disallow: {path}` for the AI agents in robots.txt |

On a post, the post's own `geo` applies; Page Type, robots and AI settings fall
back to the dynamic page's (`resolvePageGeo`).

## Metadata

`src/lib/cms-content/resolveAgilityMetaData.ts` merges `generateAgilityMetadata`
from `@agility/nextjs/geo` (SEO title, canonical, robots, GEO Summary, share image)
with the site's own: the post's featured image and excerpt, `og:type=article`,
and `<link rel="alternate" type="text/markdown">` pointing at the `.md` twin.

## The home page is `/`

The home page is the sitemap node `/home`, served at `/`. Every URL built from a
sitemap path goes through `toPublicPath` (`src/lib/cms/homePage.ts`): canonical,
og:url, JSON-LD, breadcrumbs, sitemap.xml, llms.txt and `.md`. `/home` 308s to
`/` (and `/home.md` to `/index.md`) in `next.config.ts`.

## Machine-readable surfaces

| URL | Source | What |
|---|---|---|
| `/robots.txt` | `src/app/robots.txt/route.ts` | every crawler allowed; AI agents named explicitly; per-page GEO "block" |
| `/sitemap.xml` | `src/app/sitemap.tsx` | published pages; posts carry `lastModified` |
| `/llms.txt` | `src/app/llms.txt/route.ts` | llmstxt.org index: who Joel is, pages, every post with its summary, linking the `.md` twins |
| `/{page}.md` | proxy → `src/app/api/page-md/[...slug]` | the page as markdown (`/index.md` for home), `Link: rel=canonical` to the HTML |
| `/blog/rss.xml` | `src/app/blog/rss.xml/route.ts` | RSS 2.0 |

All of them read through the cached getters (via `getSiteIndex` in
`src/lib/cms-content/getSiteIndex.ts`), so the publish webhook refreshes them.

## Checking it

Fetch a page and confirm: one `ld+json` block, it parses, no raw `<` inside it,
every `@id` reference resolves, the breadcrumb starts at Home, and no URL ends in
`/home`. Then paste the URL into Google's Rich Results Test and the Schema.org
validator.
