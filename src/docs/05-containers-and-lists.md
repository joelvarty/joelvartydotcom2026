# Containers and Content Lists

This document explains how to work with content lists (containers) in Agility CMS, including common patterns like blog posts, testimonials, team members, and shared data.

## What are Content Lists?

Content lists (also called containers) are collections of content items of the same type. Common examples:
- **Blog Posts**: Articles, news, updates
- **Testimonials**: Customer reviews, quotes
- **Team Members**: Staff, leadership team
- **Products**: Catalog items
- **FAQs**: Question and answer pairs
- **Categories**: Taxonomy for organizing content

## Creating a Content List

### Step 1: Define Content Definition in Agility CMS

1. Go to **Settings > Content Definitions**
2. Click **New Content Definition**
3. Choose **Content List**
4. Add a **Reference Name** (e.g., "BlogPost")
5. Add fields (e.g., title, content, date, author, category)

### Step 2: Create Container in Agility CMS

1. Go to **Shared Content**
2. Click **New Container**
3. Select your content definition (e.g., "BlogPost")
4. Give it a **Reference Name** (e.g., "posts")
5. Add content items

## Displaying Content Lists

### Pattern 1: Simple List Module

Create a module that displays items from a content list:

```tsx
// src/components/agility-components/PostListing.tsx

import { getContentList } from "@/lib/cms/getContentList";

interface PostListingProps {
  module: {
    fields: {
      title: string;
      numberOfPosts: number;
    };
  };
  locale: string;
}

export default async function PostListing({ module, locale }: PostListingProps) {
  const { title, numberOfPosts } = module.fields;

  const posts = await getContentList({
    referenceName: "posts",
    locale,
    take: numberOfPosts || 10,
    sort: "fields.date desc",
  });

  return (
    <section className="py-16">
      <h2 className="text-4xl font-bold mb-8">{title}</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <article key={post.contentID} className="border rounded-lg p-6">
            {post.fields.image && (
              <img
                src={post.fields.image.url}
                alt={post.fields.image.label}
                className="w-full h-48 object-cover rounded mb-4"
              />
            )}
            <h3 className="text-xl font-semibold mb-2">{post.fields.title}</h3>
            <p className="text-gray-600 mb-4">{post.fields.excerpt}</p>
            <a
              href={`/blog/${post.fields.slug}`}
              className="text-blue-600 hover:underline"
            >
              Read More →
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
```

### Pattern 2: Nested Content List Reference

When a module references a content list (not hardcoded):

```tsx
// src/components/agility-components/CardGrid.tsx

import { getContentList } from "@/lib/cms/getContentList";

interface CardGridProps {
  module: {
    fields: {
      title: string;
      cards: {
        referenceName: string; // The list reference name
      };
    };
  };
  locale: string;
}

export default async function CardGrid({ module, locale }: CardGridProps) {
  const { title, cards } = module.fields;

  // Fetch items from the referenced list
  const cardItems = await getContentList({
    referenceName: cards.referenceName, // e.g., "testimonials", "team", etc.
    locale,
  });

  return (
    <section className="py-16">
      <h2 className="text-4xl font-bold mb-8 text-center">{title}</h2>
      <div className="grid md:grid-cols-4 gap-6">
        {cardItems.map((card) => (
          <div key={card.contentID} className="text-center">
            {card.fields.image && (
              <img
                src={card.fields.image.url}
                alt={card.fields.image.label}
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
            )}
            <h3 className="font-semibold">{card.fields.title}</h3>
            <p className="text-sm text-gray-600">{card.fields.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

**Why this pattern?** Editors can choose different content lists without code changes.

### Pattern 3: Testimonials Carousel

```tsx
// src/components/agility-components/Testimonials.server.tsx

import { getContentList } from "@/lib/cms/getContentList";
import TestimonialsClient from "./Testimonials.client";

export default async function Testimonials({ module, locale }: any) {
  const { title } = module.fields;

  const testimonials = await getContentList({
    referenceName: "testimonials",
    locale,
    take: 10,
  });

  return (
    <section className="py-16 bg-gray-50">
      <h2 className="text-4xl font-bold mb-8 text-center">{title}</h2>
      <TestimonialsClient testimonials={testimonials} />
    </section>
  );
}
```

```tsx
// src/components/agility-components/Testimonials.client.tsx
"use client";

import { useState } from "react";

export default function TestimonialsClient({ testimonials }: any) {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((i) => (i + 1) % testimonials.length);
  const prev = () =>
    setCurrent((i) => (i - 1 + testimonials.length) % testimonials.length);

  const testimonial = testimonials[current];

  return (
    <div className="max-w-4xl mx-auto relative">
      <div className="text-center">
        <p className="text-xl italic mb-4">"{testimonial.fields.quote}"</p>
        <p className="font-semibold">{testimonial.fields.name}</p>
        <p className="text-gray-600">{testimonial.fields.company}</p>
      </div>
      <div className="flex justify-center gap-4 mt-8">
        <button onClick={prev} className="px-4 py-2 bg-gray-200 rounded">
          ←
        </button>
        <button onClick={next} className="px-4 py-2 bg-gray-200 rounded">
          →
        </button>
      </div>
    </div>
  );
}
```

### Pattern 4: Team Listing

```tsx
// src/components/agility-components/TeamListing.tsx

import { getContentList } from "@/lib/cms/getContentList";

export default async function TeamListing({ module, locale }: any) {
  const { title, subtitle } = module.fields;

  const team = await getContentList({
    referenceName: "team",
    locale,
    sort: "fields.order asc",
  });

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">{title}</h2>
        <p className="text-xl text-gray-600">{subtitle}</p>
      </div>
      <div className="grid md:grid-cols-4 gap-8">
        {team.map((member) => (
          <div key={member.contentID} className="text-center">
            <img
              src={member.fields.photo.url}
              alt={member.fields.name}
              className="w-48 h-48 rounded-full mx-auto mb-4 object-cover"
            />
            <h3 className="text-xl font-semibold">{member.fields.name}</h3>
            <p className="text-gray-600 mb-2">{member.fields.title}</p>
            <p className="text-sm">{member.fields.bio}</p>
            {member.fields.linkedin && (
              <a
                href={member.fields.linkedin.href}
                className="text-blue-600 mt-2 inline-block"
              >
                LinkedIn →
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
```

## Pagination

### Pattern 1: Simple Pagination

```tsx
// src/components/agility-components/BlogListing.tsx

import { getContentList } from "@/lib/cms/getContentList";

export default async function BlogListing({ searchParams, locale }: any) {
  const page = parseInt(searchParams?.page || "1");
  const perPage = 12;

  const posts = await getContentList({
    referenceName: "posts",
    locale,
    take: perPage,
    skip: (page - 1) * perPage,
    sort: "fields.date desc",
  });

  // Calculate total pages (you may need to fetch total count separately)
  const hasMore = posts.length === perPage;

  return (
    <div>
      <div className="grid md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <article key={post.contentID}>{/* Post card */}</article>
        ))}
      </div>
      <nav className="flex justify-center gap-4 mt-8">
        {page > 1 && (
          <a
            href={`?page=${page - 1}`}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Previous
          </a>
        )}
        <span className="px-4 py-2">Page {page}</span>
        {hasMore && (
          <a
            href={`?page=${page + 1}`}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Next
          </a>
        )}
      </nav>
    </div>
  );
}
```

### Pattern 2: Load More Button

```tsx
// src/components/agility-components/PostListing.server.tsx

import { getContentList } from "@/lib/cms/getContentList";
import LoadMoreClient from "./LoadMore.client";

export default async function PostListing({ module, locale }: any) {
  const initialPosts = await getContentList({
    referenceName: "posts",
    locale,
    take: 6,
    sort: "fields.date desc",
  });

  return (
    <div>
      <LoadMoreClient initialPosts={initialPosts} locale={locale} />
    </div>
  );
}
```

```tsx
// src/components/agility-components/LoadMore.client.tsx
"use client";

import { useState } from "react";

export default function LoadMoreClient({ initialPosts, locale }: any) {
  const [posts, setPosts] = useState(initialPosts);
  const [skip, setSkip] = useState(6);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    setLoading(true);
    // Call API route to fetch more posts
    const res = await fetch(`/api/posts?skip=${skip}&take=6&locale=${locale}`);
    const newPosts = await res.json();
    setPosts([...posts, ...newPosts]);
    setSkip(skip + 6);
    setLoading(false);
  };

  return (
    <div>
      <div className="grid md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <article key={post.contentID}>{/* Post card */}</article>
        ))}
      </div>
      <div className="text-center mt-8">
        <button
          onClick={loadMore}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded"
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      </div>
    </div>
  );
}
```

## Filtering and Categories

### Pattern 1: Category Filter

```tsx
// src/components/agility-components/BlogWithCategories.tsx

import { getContentList } from "@/lib/cms/getContentList";

export default async function BlogWithCategories({ searchParams, locale }: any) {
  const categoryId = searchParams?.category;

  // Fetch categories
  const categories = await getContentList({
    referenceName: "categories",
    locale,
    sort: "fields.name asc",
  });

  // Fetch all posts
  const allPosts = await getContentList({
    referenceName: "posts",
    locale,
    sort: "fields.date desc",
  });

  // Filter by category if selected
  const posts = categoryId
    ? allPosts.filter((post) => post.fields.category?.contentID === parseInt(categoryId))
    : allPosts;

  return (
    <div>
      <nav className="flex gap-4 mb-8">
        <a
          href="?"
          className={!categoryId ? "font-bold" : ""}
        >
          All
        </a>
        {categories.map((cat) => (
          <a
            key={cat.contentID}
            href={`?category=${cat.contentID}`}
            className={categoryId === String(cat.contentID) ? "font-bold" : ""}
          >
            {cat.fields.name}
          </a>
        ))}
      </nav>
      <div className="grid md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <article key={post.contentID}>{/* Post card */}</article>
        ))}
      </div>
    </div>
  );
}
```

### Pattern 2: Search and Filter

```tsx
// src/components/agility-components/PostSearch.tsx

import { getContentList } from "@/lib/cms/getContentList";

export default async function PostSearch({ searchParams, locale }: any) {
  const query = searchParams?.q?.toLowerCase() || "";

  const allPosts = await getContentList({
    referenceName: "posts",
    locale,
    sort: "fields.date desc",
  });

  const filteredPosts = query
    ? allPosts.filter(
        (post) =>
          post.fields.title.toLowerCase().includes(query) ||
          post.fields.excerpt.toLowerCase().includes(query)
      )
    : allPosts;

  return (
    <div>
      <form method="GET" className="mb-8">
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Search posts..."
          className="w-full p-4 border rounded"
        />
      </form>
      <p className="mb-4">
        {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"} found
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <article key={post.contentID}>{/* Post card */}</article>
        ))}
      </div>
    </div>
  );
}
```

## Shared Data Pattern

Content lists can be used as shared data across the site:

### Example: Site Settings

```tsx
// src/lib/cms/getSiteSettings.ts

import { getContentList } from "./getContentList";

export async function getSiteSettings(locale: string) {
  const settings = await getContentList({
    referenceName: "siteSettings",
    locale,
    take: 1,
  });

  return settings[0]?.fields || {};
}
```

```tsx
// src/components/Header.tsx

import { getSiteSettings } from "@/lib/cms/getSiteSettings";

export default async function Header({ locale }: any) {
  const settings = await getSiteSettings(locale);

  return (
    <header>
      <img src={settings.logo.url} alt={settings.siteName} />
      <nav>
        {settings.navigationLinks.map((link: any) => (
          <a key={link.href} href={link.href}>
            {link.text}
          </a>
        ))}
      </nav>
    </header>
  );
}
```

## Related Content

### Example: Posts with Author

```tsx
import { getContentList, getContentItem } from "@/lib/cms";

export default async function PostsWithAuthors({ locale }: any) {
  const posts = await getContentList({
    referenceName: "posts",
    locale,
    take: 10,
  });

  // Fetch author for each post
  const postsWithAuthors = await Promise.all(
    posts.map(async (post) => {
      if (post.fields.author?.contentID) {
        const author = await getContentItem({
          contentID: post.fields.author.contentID,
          locale,
        });
        return { ...post, author };
      }
      return post;
    })
  );

  return (
    <div>
      {postsWithAuthors.map((post) => (
        <article key={post.contentID}>
          <h3>{post.fields.title}</h3>
          {post.author && (
            <div className="flex items-center gap-2 mt-2">
              <img
                src={post.author.fields.avatar.url}
                alt={post.author.fields.name}
                className="w-8 h-8 rounded-full"
              />
              <span>{post.author.fields.name}</span>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
```

## Best Practices

1. **Use Reference Names**: Always use `referenceName`, not hardcoded strings
2. **Pagination**: Implement pagination for large lists
3. **Sorting**: Always specify a sort order for consistency
4. **Caching**: Let Next.js handle caching automatically
5. **Error Handling**: Check for empty lists and show appropriate messages
6. **Type Safety**: Define TypeScript interfaces for content types
7. **Performance**: Use `Promise.all()` for parallel fetching

## Next Steps

- Read [04-data-fetching.md](./04-data-fetching.md) for more data patterns
- Read [06-localization.md](./06-localization.md) for multi-locale lists
- Read [09-example-components.md](./09-example-components.md) for real examples
