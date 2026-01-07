# Data Fetching from Agility CMS

This document explains how to fetch content from Agility CMS in your Next.js application.

## Helper Functions

The project includes helper functions in `src/lib/cms/` for fetching data:

### 1. `getAgilitySDK()`
Initializes the Agility SDK with proper configuration.

```typescript
import { getAgilitySDK } from "@/lib/cms/getAgilitySDK";

const agilityClient = getAgilitySDK({ locale: "en-us" });
```

### 2. `getAgilityPage()`
Fetches complete page data including modules and zones.

```typescript
import { getAgilityPage } from "@/lib/cms/getAgilityPage";

const pageData = await getAgilityPage({
  params: { locale: "en-us", slug: ["about"] }
});

// Returns:
// {
//   page: { pageID, title, seo, zones, ... },
//   sitemap: [...],
//   sitemapNode: { path, title, ... },
//   pageTemplateName: "Main",
//   globalData: { ... }
// }
```

### 3. `getContentItem()`
Fetches a single content item by ID or reference name.

```typescript
import { getContentItem } from "@/lib/cms/getContentItem";

// By contentID
const post = await getContentItem({
  contentID: 123,
  locale: "en-us",
});

// Returns:
// {
//   contentID: 123,
//   fields: {
//     title: "My Blog Post",
//     content: "<p>...</p>",
//     date: "2024-01-15",
//     ...
//   }
// }
```

### 4. `getContentList()`
Fetches a collection of content items.

```typescript
import { getContentList } from "@/lib/cms/getContentList";

const posts = await getContentList({
  referenceName: "posts",
  locale: "en-us",
  sort: "fields.date desc",
  take: 10,
  skip: 0,
});

// Returns array:
// [
//   { contentID: 1, fields: { ... } },
//   { contentID: 2, fields: { ... } },
//   ...
// ]
```

### 5. `getSitemapFlat()`
Fetches the flat sitemap (all pages as a dictionary).

```typescript
import { getSitemapFlat } from "@/lib/cms/getSitemapFlat";

const sitemap = await getSitemapFlat({ locale: "en-us" });

// Returns:
// {
//   "/": { pageID: 1, path: "/", title: "Home", ... },
//   "/about": { pageID: 2, path: "/about", title: "About", ... },
//   "/blog/post-1": { pageID: 3, path: "/blog/post-1", title: "Post 1", ... },
// }
```

### 6. `getSitemapNested()`
Fetches the nested sitemap (hierarchical structure).

```typescript
import { getSitemapNested } from "@/lib/cms/getSitemapNested";

const sitemap = await getSitemapNested({ locale: "en-us" });

// Returns nested structure:
// [
//   {
//     pageID: 1,
//     path: "/",
//     title: "Home",
//     children: [
//       { pageID: 2, path: "/about", title: "About", children: [] },
//       { pageID: 3, path: "/blog", title: "Blog", children: [...] }
//     ]
//   }
// ]
```

### 7. `getRedirections()`
Fetches redirects configured in Agility CMS.

```typescript
import { getRedirections } from "@/lib/cms/getRedirections";

const redirects = await getRedirections({ locale: "en-us" });

// Returns:
// [
//   { url: "/old-page", redirectUrl: "/new-page", statusCode: 301 },
//   ...
// ]
```

## Caching

All CMS functions automatically cache data using Next.js caching with tags:

```typescript
// Example from getContentItem.ts
agilityClient.config.fetchConfig = {
  next: {
    tags: [`agility-content-${contentID}-${locale}`],
    revalidate: 60, // Revalidate every 60 seconds
  },
};
```

### Cache Tags Format

- **Content Item**: `agility-content-{contentID}-{locale}`
- **Content List**: `agility-content-{referenceName}-{locale}`
- **Sitemap**: `agility-sitemap-flat-{locale}` or `agility-sitemap-nested-{locale}`
- **Page**: `agility-page-{pageID}-{locale}`

### On-Demand Revalidation

Use the `/api/revalidate` endpoint with a webhook:

```typescript
// Webhook from Agility CMS
POST /api/revalidate
{
  "tag": "agility-content-123-en-us",
  "securityKey": "your-security-key"
}
```

This immediately revalidates the cached content.

## Common Patterns

### Pattern 1: Fetch in Server Component

```tsx
import { getContentList } from "@/lib/cms/getContentList";

export default async function BlogPage({ params }: any) {
  const { locale } = await params;

  const posts = await getContentList({
    referenceName: "posts",
    locale,
    take: 20,
  });

  return (
    <div>
      {posts.map((post) => (
        <article key={post.contentID}>
          <h2>{post.fields.title}</h2>
          <p>{post.fields.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
```

### Pattern 2: Nested Content Fetching

When a module references a content list by reference name (not contentID):

```tsx
import { getContentList } from "@/lib/cms/getContentList";

export default async function CardGrid({ module, locale }: any) {
  const { title, cards } = module.fields;

  // cards.referenceName is the list reference name
  const cardItems = await getContentList({
    referenceName: cards.referenceName, // e.g., "testimonials"
    locale,
  });

  return (
    <div>
      <h2>{title}</h2>
      <div className="grid grid-cols-3 gap-4">
        {cardItems.map((card) => (
          <div key={card.contentID}>
            <h3>{card.fields.title}</h3>
            <p>{card.fields.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Important**: Always use `referenceName`, not `contentID` when fetching lists.

### Pattern 3: Pagination

```tsx
import { getContentList } from "@/lib/cms/getContentList";

interface BlogListingProps {
  searchParams?: {
    page?: string;
  };
}

export default async function BlogListing({ searchParams }: BlogListingProps) {
  const page = parseInt(searchParams?.page || "1");
  const perPage = 10;

  const posts = await getContentList({
    referenceName: "posts",
    locale: "en-us",
    take: perPage,
    skip: (page - 1) * perPage,
    sort: "fields.date desc",
  });

  return (
    <div>
      {posts.map((post) => (
        <article key={post.contentID}>{/* ... */}</article>
      ))}
      <nav>
        <a href={`?page=${page - 1}`}>Previous</a>
        <a href={`?page=${page + 1}`}>Next</a>
      </nav>
    </div>
  );
}
```

### Pattern 4: Filtering and Sorting

```tsx
import { getContentList } from "@/lib/cms/getContentList";

export default async function PostsByCategory({ categoryId, locale }: any) {
  // Fetch all posts
  const allPosts = await getContentList({
    referenceName: "posts",
    locale,
    sort: "fields.date desc",
  });

  // Filter by category (client-side filtering)
  const filteredPosts = allPosts.filter(
    (post) => post.fields.category?.contentID === categoryId
  );

  // Or use OData-style filter (server-side)
  const posts = await getContentList({
    referenceName: "posts",
    locale,
    filter: `fields.category.contentID eq ${categoryId}`,
    sort: "fields.date desc",
  });

  return (
    <div>
      {posts.map((post) => (
        <article key={post.contentID}>{/* ... */}</article>
      ))}
    </div>
  );
}
```

### Pattern 5: Fetch Related Content

```tsx
import { getContentItem } from "@/lib/cms/getContentItem";

export default async function BlogPost({ postId, locale }: any) {
  // Fetch the blog post
  const post = await getContentItem({
    contentID: postId,
    locale,
  });

  // Fetch related content
  const author = post.fields.author?.contentID
    ? await getContentItem({
        contentID: post.fields.author.contentID,
        locale,
      })
    : null;

  const category = post.fields.category?.contentID
    ? await getContentItem({
        contentID: post.fields.category.contentID,
        locale,
      })
    : null;

  return (
    <article>
      <h1>{post.fields.title}</h1>
      {author && <p>By {author.fields.name}</p>}
      {category && <span className="badge">{category.fields.name}</span>}
      <div dangerouslySetInnerHTML={{ __html: post.fields.content }} />
    </article>
  );
}
```

### Pattern 6: Parallel Fetching

```tsx
import { getContentList } from "@/lib/cms/getContentList";

export default async function Homepage({ locale }: any) {
  // Fetch multiple lists in parallel
  const [posts, testimonials, stats] = await Promise.all([
    getContentList({ referenceName: "posts", locale, take: 3 }),
    getContentList({ referenceName: "testimonials", locale, take: 5 }),
    getContentList({ referenceName: "stats", locale }),
  ]);

  return (
    <div>
      <section>
        <h2>Latest Posts</h2>
        {posts.map((post) => (/* ... */))}
      </section>
      <section>
        <h2>Testimonials</h2>
        {testimonials.map((t) => (/* ... */))}
      </section>
      <section>
        <h2>Company Stats</h2>
        {stats.map((s) => (/* ... */))}
      </section>
    </div>
  );
}
```

## Error Handling

Always handle potential errors:

```tsx
import { getContentItem } from "@/lib/cms/getContentItem";

export default async function ContentDisplay({ contentID, locale }: any) {
  try {
    const content = await getContentItem({ contentID, locale });

    if (!content) {
      return <div>Content not found</div>;
    }

    return <div>{content.fields.title}</div>;
  } catch (error) {
    console.error("Error fetching content:", error);
    return <div>Error loading content</div>;
  }
}
```

## Preview Mode

In preview mode, the SDK automatically uses the preview API key:

```typescript
// In getAgilitySDK.ts
import { cookies } from "next/headers";

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

This allows editors to preview draft content before publishing.

## TypeScript Types

Define types for your content:

```typescript
// types/agility.ts

export interface BlogPost {
  contentID: number;
  fields: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    date: string;
    author: {
      contentID: number;
      fields: {
        name: string;
        bio: string;
        avatar: { url: string };
      };
    };
    category: {
      contentID: number;
      fields: {
        name: string;
        slug: string;
      };
    };
    image: {
      url: string;
      label: string;
    };
  };
}

// Usage
const posts = await getContentList<BlogPost>({
  referenceName: "posts",
  locale: "en-us",
});
```

## Best Practices

1. **Always Specify Locale**: Pass locale to all CMS functions
2. **Use Cache Tags**: Leverage automatic cache tagging for revalidation
3. **Parallel Fetching**: Use `Promise.all()` for independent fetches
4. **Error Boundaries**: Wrap components in error boundaries
5. **Loading States**: Use Suspense for streaming
6. **Type Safety**: Define TypeScript interfaces for content
7. **Optimize Queries**: Only fetch what you need (use `take` parameter)

## Next Steps

- Read [05-containers-and-lists.md](./05-containers-and-lists.md) for content list patterns
- Read [06-localization.md](./06-localization.md) for multi-locale data
- Read [07-caching-strategies.md](./07-caching-strategies.md) for advanced caching
