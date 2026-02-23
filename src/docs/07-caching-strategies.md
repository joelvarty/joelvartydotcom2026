# Caching Strategies

This document explains caching strategies for Agility CMS content in Next.js.

## Overview

The project uses Next.js Data Cache with Agility CMS for optimal performance:
- **Time-based Revalidation**: Content refreshes after a set time
- **Tag-based Revalidation**: Specific content updates via webhooks
- **Preview Mode**: Bypass cache for draft content

## Cache Configuration

### Time-based Revalidation

Set in page route:
```typescript
// app/[locale]/[...slug]/page.tsx
export const revalidate = 60 // Revalidate every 60 seconds
```

Set via environment variable:
```env
AGILITY_PATH_REVALIDATE_DURATION=60
```

### How It Works

1. **First Request**: Page generated statically at build time
2. **Subsequent Requests**: Cached version served (fast)
3. **After 60 seconds**: Next request triggers background regeneration
4. **Updated Content**: New version cached for next 60 seconds

## Cache Tags

Every piece of content from Agility CMS has a cache tag:

```typescript
// lib/cms/getContentItem.ts
agilityClient.config.fetchConfig = {
  next: {
    tags: [`agility-content-${contentID}-${locale}`],
    revalidate: 60,
  },
};
```

### Tag Format

- **Content Item**: `agility-content-{contentID}-{locale}`
- **Content List**: `agility-content-{referenceName}-{locale}`
- **Sitemap**: `agility-sitemap-flat-{locale}`
- **Page**: `agility-page-{pageID}-{locale}`

### Why Cache Tags?

Cache tags allow targeted revalidation:
```typescript
// Revalidate only blog post 123 in English
revalidateTag("agility-content-123-en-us");

// Revalidate all posts list
revalidateTag("agility-content-posts-en-us");
```

## On-Demand Revalidation

### Webhook Setup

1. Create API route for webhooks:

```typescript
// app/api/revalidate/route.ts

import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const securityKey = request.headers.get("x-agility-security-key");

  // Verify security key
  if (securityKey !== process.env.AGILITY_SECURITY_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tag, contentID, locale } = body;

  try {
    if (tag) {
      // Revalidate specific tag
      revalidateTag(tag);
    } else if (contentID && locale) {
      // Revalidate content by ID
      revalidateTag(`agility-content-${contentID}-${locale}`);
    } else {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error) {
    return NextResponse.json({ error: "Error revalidating" }, { status: 500 });
  }
}
```

2. Configure webhook in Agility CMS:
   - Go to **Settings > Webhooks**
   - Add webhook URL: `https://yourdomain.com/api/revalidate`
   - Add security header: `x-agility-security-key: your-security-key`
   - Select events: Content Published, Content Unpublished

### Manual Revalidation

You can also revalidate programmatically:

```typescript
import { revalidateTag } from "next/cache";

// Revalidate a specific content item
revalidateTag("agility-content-123-en-us");

// Revalidate a content list
revalidateTag("agility-content-posts-en-us");

// Revalidate all pages
revalidateTag("agility-sitemap-flat-en-us");
```

## Preview Mode

Preview mode bypasses caching to show draft content.

### Enable Preview

```typescript
// proxy.ts
if (request.nextUrl.searchParams.has("agilitypreviewkey")) {
  const agilityPreviewKey = request.nextUrl.searchParams.get("agilitypreviewkey");
  const locale = request.nextUrl.searchParams.get("lang");
  const slug = request.nextUrl.pathname;

  return NextResponse.redirect(
    `/api/preview?locale=${locale}&slug=${slug}&agilitypreviewkey=${agilityPreviewKey}`
  );
}
```

### Preview API Route

```typescript
// app/api/preview/route.ts

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const agilityPreviewKey = searchParams.get("agilitypreviewkey");
  const locale = searchParams.get("locale");
  const slug = searchParams.get("slug");

  // Verify preview key
  if (agilityPreviewKey !== process.env.AGILITY_API_PREVIEW_KEY) {
    return NextResponse.json({ error: "Invalid preview key" }, { status: 401 });
  }

  // Set preview cookie
  (await cookies()).set("agilitypreview", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 24 hours
  });

  // Redirect to the page
  const redirectUrl = locale === "en-us" ? slug : `/${locale}${slug}`;
  return NextResponse.redirect(new URL(redirectUrl, request.url));
}
```

### Exit Preview

```typescript
// app/api/preview/exit/route.ts

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const locale = searchParams.get("locale");
  const slug = searchParams.get("slug");

  // Delete preview cookie
  (await cookies()).delete("agilitypreview");

  // Redirect to the page
  const redirectUrl = locale === "en-us" ? slug : `/${locale}${slug}`;
  return NextResponse.redirect(new URL(redirectUrl, request.url));
}
```

### Using Preview in SDK

```typescript
// lib/cms/getAgilitySDK.ts

import { cookies } from "next/headers";
import agilitySDK from "@agility/content-fetch";

export async function getAgilitySDK({ locale }: { locale: string }) {
  const isPreview = (await cookies()).get("agilitypreview")?.value === "true";
  const apiKey = isPreview
    ? process.env.AGILITY_API_PREVIEW_KEY
    : process.env.AGILITY_API_FETCH_KEY;

  return agilitySDK.getApi({
    guid: process.env.AGILITY_GUID,
    apiKey,
    isPreview,
  });
}
```

## Cache Strategies

### Strategy 1: High-Frequency Updates

For content that changes frequently (e.g., live scores, stock prices):

```typescript
export const revalidate = 10 // 10 seconds
```

### Strategy 2: Moderate Updates

For typical websites (e.g., blogs, marketing sites):

```typescript
export const revalidate = 60 // 1 minute
```

### Strategy 3: Infrequent Updates

For static content (e.g., documentation, about pages):

```typescript
export const revalidate = 3600 // 1 hour
```

### Strategy 4: On-Demand Only

For content that should only update via webhook:

```typescript
export const revalidate = false // Only revalidate on-demand
```

## Cache Debugging

### Check Cache Status

Add headers to see cache status:

```typescript
// proxy.ts
import { cookies } from "next/headers";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // Add cache debugging headers
  if (process.env.NODE_ENV === "development") {
    response.headers.set("x-agility-preview", (await cookies()).get("agilitypreview")?.value || "false");
    response.headers.set("x-cache-status", "HIT"); // or MISS, STALE, etc.
  }

  return response;
}
```

### Log Cache Keys

```typescript
// lib/cms/getContentItem.ts
const cacheTag = `agility-content-${contentID}-${locale}`;
console.log("[Cache] Fetching with tag:", cacheTag);
```

## Cache Warming

Pre-generate pages at build time:

```typescript
// app/[locale]/[...slug]/page.tsx

export async function generateStaticParams() {
  const allPaths = [];

  for (const locale of locales) {
    const sitemap = await agilityClient.getSitemapFlat({
      channelName: "website",
      languageCode: locale,
    });

    const localePaths = Object.values(sitemap)
      .filter((node: any) => !node.redirect && !node.isFolder)
      .map((node: any) => ({
        locale,
        slug: node.path.split("/").slice(1),
      }));

    allPaths.push(...localePaths);
  }

  return allPaths;
}
```

## Critical: Sitemap Tag Revalidation on Content Changes

When a content item is published (e.g., a blog post), the revalidation webhook must also invalidate the sitemap cache tag (`agility-sitemap-flat-{locale}`), not just the content tags.

### Why This Matters

The `@agility/nextjs` SDK's `getAgilityPageProps` fetches the sitemap from the Next.js Data Cache (tagged with `agility-sitemap-flat-{locale}`) to look up the page by path. If a content item's slug changes in the CMS, the sitemap will have a new path for that content ID. Without revalidating the sitemap tag, the SDK uses a stale cached sitemap where the old path no longer matches, causing a 404 that gets cached.

### The Problem Sequence (without sitemap revalidation)

1. Content slug changes in CMS (e.g., `/blog/old-slug` -> `/blog/new-slug`)
2. Webhook fires, content tags are revalidated, `revalidatePath` is called for the new path
3. Page re-renders, but `getAgilityPageProps` fetches the sitemap from Data Cache
4. Cached sitemap still has the old path -> `sitemap["/blog/new-slug"]` returns `undefined`
5. Page returns 404, which gets cached for the full `revalidate` duration (24h)

### The Fix

Always revalidate the sitemap tag alongside content tags in the revalidation webhook:

```typescript
// app/api/revalidate/route.ts
if (data.referenceName) {
  const itemTag = `agility-content-${data.referenceName.toLowerCase()}-${data.languageCode}`
  const listTag = `agility-content-${data.contentID}-${data.languageCode}`
  revalidateTag(itemTag)
  revalidateTag(listTag)

  // IMPORTANT: Also revalidate sitemap so getAgilityPageProps gets fresh data
  const sitemapTagFlat = `agility-sitemap-flat-${data.languageCode}`
  revalidateTag(sitemapTagFlat)
}
```

### SDK Cache Duration

The SDK's default cache duration (`AGILITY_FETCH_CACHE_DURATION`) is 60 seconds if not set. This controls how long the sitemap and page data are cached in the Next.js Data Cache. Even with short cache durations, the stale-while-revalidate behavior means the first request after expiry serves old data, which can produce a cached 404 if the sitemap has changed.

## Best Practices

1. **Use Appropriate Revalidation**: Don't over-cache or under-cache
2. **Tag Everything**: Always add cache tags to CMS fetches
3. **Webhook Integration**: Set up webhooks for instant updates
4. **Revalidate Sitemap on Content Changes**: Always invalidate `agility-sitemap-flat-{locale}` when content items change, not just content tags
5. **Monitor Performance**: Track cache hit rates
6. **Preview Mode**: Use for content editors to see drafts
7. **Incremental Updates**: Only revalidate what changed
8. **Build-Time Generation**: Pre-render critical pages

## Common Caching Patterns

### Pattern 1: Page-Level Caching

```typescript
// app/[locale]/[...slug]/page.tsx
export const revalidate = 60

export default async function Page({ params }: PageProps) {
  const agilityData = await getAgilityPage({ params });
  return <div>{/* ... */}</div>;
}
```

### Pattern 2: Component-Level Caching

```typescript
// components/Header.tsx
import { unstable_cache } from "next/cache";
import { getContentItem } from "@/lib/cms/getContentItem";

async function getHeaderData(locale: string) {
  return unstable_cache(
    async () => {
      return await getContentItem({
        referenceName: "headerSettings",
        locale,
      });
    },
    ["header-data", locale],
    { revalidate: 300, tags: [`agility-header-${locale}`] }
  )();
}

export default async function Header({ locale }: { locale: string }) {
  const headerData = await getHeaderData(locale);
  return <header>{/* ... */}</header>;
}
```

### Pattern 3: API Route Caching

```typescript
// app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getContentList } from "@/lib/cms/getContentList";

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale") || "en-us";

  const posts = await getContentList({
    referenceName: "posts",
    locale,
    take: 10,
  });

  return NextResponse.json(posts, {
    headers: {
      "Cache-Control": "s-maxage=60, stale-while-revalidate",
    },
  });
}
```

## Environment-Specific Caching

```typescript
// lib/cms/getAgilitySDK.ts

const revalidate =
  process.env.NODE_ENV === "production"
    ? parseInt(process.env.AGILITY_FETCH_CACHE_DURATION || "60")
    : 0; // No cache in development
```

## Next Steps

- Read [04-data-fetching.md](./04-data-fetching.md) for data fetching patterns
- Read [10-deployment.md](./10-deployment.md) for production caching setup
- Read [11-troubleshooting.md](./11-troubleshooting.md) for cache debugging
