# Caching Strategies

This site runs Next.js 16 with **Cache Components** (`cacheComponents: true` in
`next.config.ts`). Every route is prerendered as a static shell, every published
Agility read is a tagged `"use cache"` entry, and the Agility publish webhook
clears exactly the tags that changed. There is no time-based ISR any more.

## The one rule: `preview` is an argument, never ambient state

`draftMode()` is read in exactly ONE place: `getAgilityContext()` in
`src/lib/cms/getAgilityContext.ts`. Everything downstream takes `preview` as a
plain boolean.

- Pages and layouts call `getAgilityContext()` and pass `isPreview` on.
- `ContentZone` hands every module component `isPreview` in its props
  (`UnloadedModuleProps`). Components pass it to every read:

```tsx
const MyModule = async ({ module, languageCode, isPreview }: UnloadedModuleProps) => {
  const { fields } = await getContentItem<MyFields>({
    contentID: module.contentid,
    languageCode,
    preview: isPreview,
  })
  // ...
}
```

If you call `draftMode()` (or `cookies()`, `headers()`) inside `src/lib/cms/`,
every content read becomes request-scoped, nothing can live in a cache, and the
whole site stops prerendering.

Local `next dev` reads staging content by default. `FORCE_PUBLISHED=1 npm run dev`
reads published content, which is how you test the production experience locally.

## The cached primitives

Each primitive in `src/lib/cms/` splits two ways:

- **published** → `"use cache"` + `cacheTag(...)` + `cacheLife("days")`
- **preview** → `await connection()`, then an uncached fetch (editors always see
  their latest draft)

| Primitive | Cache tag |
|---|---|
| `getContentItem` | `agility-content-{contentID}-{locale}` |
| `getContentList` | `agility-content-{referenceName lowercased}-{locale}` |
| `getPage` | `agility-page-{pageID}-{locale}` |
| `getSitemapFlat` | `agility-sitemap-flat-{locale}` |
| `getSitemapNested` | `agility-sitemap-nested-{locale}` |

**These tag strings are a CONTRACT with `/api/revalidate`.** Change one and change
the webhook in the same commit, or publishing silently stops updating the site.

`cacheLife("days")` is only a self-healing backstop. The webhook is the real
invalidation path, so a publish goes live immediately.

## Composing a page: `getAgilityPage`

`getAgilityPage` (`src/lib/cms/getAgilityPage.ts`) composes the primitives:
flat sitemap → node by path → `getPage(pageID)` → for a dynamic page,
`getContentItem(contentID)` (the `dynamicPageItem`). It does **not** call
`getAgilityPageProps` from `@agility/nextjs/node`: that function does its own
uncached fetching and calls `Date.now()`, both fatal under Cache Components.

It returns the same shape as `AgilityPageProps`, so it spreads straight into the
page template and `<ContentZone>`. It also strips non-alphanumerics from
`templateName`, because the CMS returns the template's display name.

The home page is the first non-folder node in the sitemap (`/home`), served at `/`.

## The publish webhook (`/api/revalidate`)

Configure it in Agility: Settings → Webhooks → `https://www.joelvarty.com/api/revalidate`.

On a publish (or delete/unpublish) it:

1. Clears the flat and nested sitemap tags for the locale (a publish can add or
   rename a page or a blog post's URL).
2. For a content item: clears `agility-content-{referenceName}-{locale}` (every
   list it belongs to) and `agility-content-{contentID}-{locale}` (the item).
3. For a page: clears `agility-page-{pageID}-{locale}`.
4. Reads the latest sitemap (uncached) and calls `revalidatePath()` on the URL
   that renders the item or page.
5. For a published blog post (`posts`), cross-posts to Substack in `after()`.

A publish with no content or page ID is a URL redirection: it calls
`BUILD_HOOK_URL` so the prebuild step refreshes `data/redirections.json`.

`revalidateTag(tag, "max")`: Next 16 requires a cacheLife profile as the second
argument. `"max"` marks the entry stale, so the next request gets the old copy
once while the new one is fetched.

## Things that break the build under Cache Components

- **Route segment configs** `revalidate`, `runtime`, `dynamic`, `dynamicParams`
  are rejected. Don't add them.
- **Unstable values in render**: `new Date()`, `Date.now()`, `Math.random()`
  outside a cached scope fail the prerender. Wrap them in `"use cache"`, move
  them to a client component, or compute them at module scope (see
  `components/layout/Footer.tsx`). Dates derived from content
  (`new Date(post.fields.publishedDate)`) are fine.
- **Uncached request data outside `<Suspense>`** (`cookies()`, `headers()`,
  `searchParams`) makes the page dynamic. Query strings reach pages through the
  path instead: the proxy encodes the allowed params (`page`, `order`) as a
  `~~~...~~~` segment and `getAgilityPage` decodes them into
  `globalData.searchParams`.

## 404s and CDN caching live in `src/proxy.ts`

**404s are decided in the proxy, not by `notFound()`.** With a prerendered shell,
a `200` status line can be on the wire before a page resolves the sitemap, so
`notFound()` alone gives a soft 404. The proxy checks each path against the
published flat sitemap (`src/lib/cms/publishedPaths.ts`, folders and redirect
nodes excluded) and answers 404 itself. It is skipped in dev and in draft mode,
and fails open if Agility is unreachable.

**Adding a hand-written route under `app/`?** Add it to `APP_PATHS` or
`APP_PREFIXES` in `publishedPaths.ts`, or it will 404 in production while working
in `next dev`. (Paths with a file extension, like `/blog/rss.xml`, skip the
check.)

**Cache headers are set in the proxy**, because it can see the draft cookie:
draft renders get `private, no-store`; everything else gets
`CDN-Cache-Control: public, s-maxage=60, stale-while-revalidate=86400`.

## Preview must survive a CDN cache hit

`?agilitypreviewkey=`, `?AgilityPreview=0` and `?ContentID=` are handled twice on
purpose: by the proxy (uncached requests) and by `beforeFiles` rewrites in
`next.config.ts` (cached ones). Vercel serves prerendered pages from the edge
without running the proxy, so without the rewrites preview would silently show
published content. Don't delete either side.

## Pages outside the CMS

- `/sitemap.xml` (`app/sitemap.tsx`) and `/blog/rss.xml` read through the same
  cached primitives with `preview: false`, so the webhook refreshes them too.
- They don't stamp "now" on anything: the RSS `lastBuildDate` is the newest
  post's date.
