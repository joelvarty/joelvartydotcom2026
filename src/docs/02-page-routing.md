# Page Routing

This document explains how page routing works with Agility CMS in this Next.js project.

## Dynamic Page Route

All Agility CMS pages are handled by a single dynamic route:

```
app/[locale]/[...slug]/page.tsx
```

This route:
- **`[locale]`**: Handles locale/language (e.g., `en-us`, `fr`, `es`)
- **`[...slug]`**: Captures the entire path (e.g., `about`, `blog/post-1`, `products/category/item`)

## How It Works

### 1. Generate Static Params

At build time, Next.js generates all pages from the Agility sitemap:

```typescript
export async function generateStaticParams() {
  const allPaths: { locale: string; slug: string[] }[] = [];

  for (const locale of locales) {
    const sitemap = await agilityClient.getSitemapFlat({
      channelName: "website",
      languageCode: locale,
    });

    const localePaths = Object.values(sitemap)
      .filter((node) => !node.redirect && !node.isFolder)
      .map((node) => ({
        locale,
        slug: node.path.split("/").slice(1),
      }));

    allPaths.push(...localePaths);
  }

  return allPaths;
}
```

**Result**: All pages are pre-rendered at build time for optimal performance.

### 2. Generate Metadata

Each page generates SEO metadata:

```typescript
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const agilityData = await getAgilityPage({ params });

  return {
    title: agilityData.page?.seo?.metaTitle || 'Page',
    description: agilityData.page?.seo?.metaDescription || '',
  };
}
```

### 3. Render Page

The page component fetches data and renders:

```typescript
export default async function Page({ params }: PageProps) {
  const agilityData = await getAgilityPage({ params });
  if (!agilityData.page) notFound();

  const AgilityPageTemplate = getPageTemplate(
    agilityData.pageTemplateName || "MainTemplate"
  );

  return (
    <div data-agility-page={agilityData.page?.pageID}>
      <AgilityPageTemplate {...agilityData} />
    </div>
  );
}
```

## Proxy Flow

The `proxy.ts` file handles special routing cases:

### 1. Preview Mode
```
URL: /about?agilitypreviewkey=xxx
→ Redirects to: /api/preview?slug=/about&agilitypreviewkey=xxx
```

### 2. Exit Preview
```
URL: /about?AgilityPreview=0
→ Redirects to: /api/preview/exit?slug=/about
```

### 3. Content ID Routing
```
URL: /?ContentID=123
→ Rewrite to: /api/dynamic-redirect?ContentID=123
```

### 4. Locale Query Param
```
URL: /about?lang=fr
→ Redirects to: /fr/about
```

### 5. Search Params Encoding
```
URL: /products?category=shirts&size=large
→ Rewrite to: /products/~~~category=shirts&size=large~~~
```

This encoding allows Next.js to cache pages with different query parameters.

### 6. Default Locale Handling
```
URL: /about (no locale prefix)
→ Rewrite to: /en-us/about (internal)
```

The default locale doesn't appear in URLs for cleaner paths.

## Locale Configuration

Locales are configured in `src/lib/i18n/config.ts`:

```typescript
export const defaultLocale = "en-us"
export const locales = ["en-us", "fr", "es"] as const
```

### URL Structure

- **Default locale**: `/about` (no prefix)
- **Other locales**: `/fr/about`, `/es/about`

### Adding a New Locale

1. Update environment variable:
   ```env
   AGILITY_LOCALES=en-us,fr,es,de
   ```

2. Update config file:
   ```typescript
   export const locales = ["en-us", "fr", "es", "de"] as const
   ```

3. Add content in Agility CMS for the new locale

4. Rebuild the site

## Static Generation with ISR

The project uses Incremental Static Regeneration (ISR):

```typescript
export const revalidate = 60  // Revalidate every 60 seconds
```

**How it works**:
1. First request: Page is generated statically at build time
2. Subsequent requests: Serve cached page
3. After 60 seconds: Next request triggers regeneration in background
4. New version: Cached for next 60 seconds

## Dynamic Routing Scenarios

### Scenario 1: Simple Page
```
Path: /about
Locale: en-us
Template: MainTemplate
Zones: [main-content-zone]
```

### Scenario 2: Blog Post
```
Path: /blog/my-first-post
Locale: en-us
Template: BlogPostTemplate
Zones: [main-content-zone]
Dynamic Content: BlogPost item
```

### Scenario 3: Multi-locale Page
```
Path: /about (en-us)
Path: /fr/about (fr)
Path: /es/acerca-de (es)
```

## Search Parameters

Search parameters are supported and passed to page templates:

```typescript
// URL: /products?category=shirts&size=large
const globalSearchParams = agilityData.globalData?.["searchParams"] || {};

// In your module component:
function ProductListing({ searchParams }) {
  const category = searchParams.category; // "shirts"
  const size = searchParams.size;         // "large"
  // ... filter products
}
```

## Important Notes

1. **Case Sensitivity**: Page paths in Agility CMS are case-insensitive
2. **Trailing Slashes**: Automatically handled by proxy
3. **404 Pages**: Non-existent pages return 404 with `not-found.tsx`
4. **Error Handling**: Errors are caught by `error.tsx`
5. **Folders**: Folder pages in Agility CMS are filtered out (not rendered)
6. **Redirects**: Redirect pages are handled by proxy

## Common Routing Patterns

### Pattern 1: Homepage
```
Path: /
Slug: []
Template: HomeTemplate
```

### Pattern 2: Single Level
```
Path: /about
Slug: ["about"]
Template: MainTemplate
```

### Pattern 3: Multi Level
```
Path: /blog/category/post-title
Slug: ["blog", "category", "post-title"]
Template: BlogPostTemplate
```

## Next Steps

- Read [03-creating-components.md](./03-creating-components.md) to add components to pages
- Read [04-data-fetching.md](./04-data-fetching.md) to fetch dynamic content
- Read [06-localization.md](./06-localization.md) for multi-language support
