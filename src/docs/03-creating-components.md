# Creating Agility Components

This document explains how to create new components (also called modules in the CMS) for Agility CMS.

## What is an Agility Component?

An **Agility Component** (also referred to as a "module" in the CMS interface) is a reusable component that editors can add to pages in Agility CMS. Common examples:
- Hero sections
- Rich text content
- Image galleries
- Blog post listings
- Contact forms
- Testimonials
- Call-to-action buttons

**Note**: While these are called "modules" in the Agility CMS interface, we refer to them as "components" in code to align with React terminology.

## Component Architecture

### Server vs Client Components

**Server Components** (default):
- Fetch data from Agility CMS or other APIs
- No client-side JavaScript
- Better performance
- Use `.server.tsx` extension (optional but recommended)

**Client Components**:
- Interactive features (forms, carousels, tabs)
- Use React hooks (useState, useEffect, etc.)
- Must have `"use client"` directive
- Use `.client.tsx` extension (optional but recommended)

**Hybrid Pattern** (recommended for complex components):
- Server component fetches data
- Passes data to client component for interactivity

## Creating a New Component

### Step 1: Define the Component Model in Agility CMS

In Agility CMS:
1. Go to **Settings > Content Definitions**
2. Click **New Module** (Components are called "modules" in the CMS interface)
3. Add a **Reference Name** (e.g., "Hero")
4. Add **Fields** (e.g., title, subtitle, image, ctaButton)

### Step 2: Create the Component File

Create a new file in `src/components/agility-components/`:

#### Example 1: Simple Server Component

```tsx
// src/components/agility-components/Hero.tsx

interface HeroProps {
  module: {  // Note: prop is called "module" for historical reasons
    fields: {
      title: string;
      subtitle: string;
      backgroundImage: {
        url: string;
        label: string;
      };
    };
  };
  locale: string;
}

export default function Hero({ module, locale }: HeroProps) {
  const { title, subtitle, backgroundImage } = module.fields;

  return (
    <div className="relative h-screen">
      <img
        src={backgroundImage.url}
        alt={backgroundImage.label}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
        <h1 className="text-6xl font-bold">{title}</h1>
        <p className="text-2xl mt-4">{subtitle}</p>
      </div>
    </div>
  );
}
```

#### Example 2: Client Component with Interactivity

```tsx
// src/components/agility-components/Carousel.client.tsx
"use client";

import { useState } from "react";

interface CarouselProps {
  module: {
    fields: {
      slides: Array<{
        image: { url: string; label: string };
        caption: string;
      }>;
    };
  };
}

export default function Carousel({ module }: CarouselProps) {
  const { slides } = module.fields;
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((i) => (i + 1) % slides.length);
  const prev = () => setCurrentIndex((i) => (i - 1 + slides.length) % slides.length);

  return (
    <div className="relative">
      <img
        src={slides[currentIndex].image.url}
        alt={slides[currentIndex].image.label}
        className="w-full h-96 object-cover"
      />
      <p className="text-center mt-2">{slides[currentIndex].caption}</p>
      <button onClick={prev} className="absolute left-4 top-1/2">←</button>
      <button onClick={next} className="absolute right-4 top-1/2">→</button>
    </div>
  );
}
```

#### Example 3: Hybrid Pattern (Server + Client)

```tsx
// src/components/agility-components/PostListing.server.tsx

import { getContentList } from "@/lib/cms/getContentList";
import PostListingClient from "./PostListing.client";

interface PostListingProps {
  module: {
    fields: {
      title: string;
      postsToShow: number;
    };
  };
  locale: string;
}

export default async function PostListing({ module, locale }: PostListingProps) {
  const { title, postsToShow } = module.fields;

  // Fetch posts from Agility CMS
  const posts = await getContentList({
    referenceName: "posts",
    locale,
    take: postsToShow,
  });

  return (
    <div>
      <h2>{title}</h2>
      <PostListingClient posts={posts} />
    </div>
  );
}
```

```tsx
// src/components/agility-components/PostListing.client.tsx
"use client";

import { useState } from "react";

interface Post {
  contentID: number;
  fields: {
    title: string;
    excerpt: string;
    date: string;
  };
}

interface PostListingClientProps {
  posts: Post[];
}

export default function PostListingClient({ posts }: PostListingClientProps) {
  const [filter, setFilter] = useState("");

  const filteredPosts = posts.filter((post) =>
    post.fields.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search posts..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border p-2 mb-4"
      />
      <div className="grid gap-4">
        {filteredPosts.map((post) => (
          <article key={post.contentID}>
            <h3>{post.fields.title}</h3>
            <p>{post.fields.excerpt}</p>
            <time>{post.fields.date}</time>
          </article>
        ))}
      </div>
    </div>
  );
}
```

### Step 3: Register the Component

Add the component to `src/components/agility-components/index.ts`:

```typescript
import RichTextArea from "./RichTextArea";
import Hero from "./Hero";
import Carousel from "./Carousel.client";
import PostListing from "./PostListing.server";

export const getModule = (moduleName: string) => {
  switch (moduleName) {
    case "RichTextArea":
      return RichTextArea;
    case "Hero":
      return Hero;
    case "Carousel":
      return Carousel;
    case "PostListing":
      return PostListing;
    default:
      return null;
  }
};
```

**Important**: The `moduleName` must match the **Reference Name** you defined in Agility CMS.

### Step 4: Add Component to Page in Agility CMS

In Agility CMS:
1. Edit a page
2. Click **Add Module** in a content zone (this adds a component instance)
3. Select your new component
4. Fill in the fields
5. Save and publish

## Component Props

Every Agility component receives these props:

```typescript
interface ComponentProps {
  module: {                     // Note: prop is called "module" for historical reasons
    contentID: number;          // Unique ID
    properties: {
      referenceName: string;    // Component reference name
    };
    fields: {                   // Your custom fields
      [key: string]: any;
    };
  };
  locale: string;               // Current locale (e.g., "en-us")
  sitemap: Array<any>;          // Full sitemap
  page: {                       // Current page data
    pageID: number;
    title: string;
    seo: {
      metaTitle: string;
      metaDescription: string;
    };
  };
  pageTemplateName: string;     // Template name
  dynamicPageItem?: any;        // For dynamic pages
  searchParams?: Record<string, string>; // Query parameters
}
```

## Common Field Types

### Text Fields
```typescript
fields: {
  title: string;
  description: string;
}
```

### Rich Text
```typescript
fields: {
  content: string; // HTML string
}
```

### Images
```typescript
fields: {
  image: {
    url: string;
    label: string;
    width: number;
    height: number;
  };
}
```

### Content References
```typescript
fields: {
  featuredPost: {
    contentID: number;
    fields: {
      title: string;
      // ... other post fields
    };
  };
}
```

### Content Lists
```typescript
fields: {
  posts: {
    referenceName: string; // "posts"
  };
}
```

### Links
```typescript
fields: {
  ctaButton: {
    href: string;
    text: string;
    target: string;
  };
}
```

## Fetching Nested Content

If a component references content or content lists, fetch it in the component:

### Example: Featured Post Component

```tsx
import { getContentItem } from "@/lib/cms/getContentItem";

interface FeaturedPostProps {
  module: {
    fields: {
      title: string;
      post: {
        contentID: number;
      };
    };
  };
  locale: string;
}

export default async function FeaturedPost({ module, locale }: FeaturedPostProps) {
  const { title, post } = module.fields;

  // Fetch the full post data
  const fullPost = await getContentItem({
    contentID: post.contentID,
    locale,
  });

  return (
    <div>
      <h2>{title}</h2>
      <article>
        <h3>{fullPost.fields.title}</h3>
        <p>{fullPost.fields.excerpt}</p>
        <a href={`/blog/${fullPost.fields.slug}`}>Read More</a>
      </article>
    </div>
  );
}
```

### Example: Post Listing with Categories

```tsx
import { getContentList } from "@/lib/cms/getContentList";

export default async function PostListing({ module, locale }: any) {
  const posts = await getContentList({
    referenceName: "posts",
    locale,
    sort: "fields.date desc",
    take: 10,
  });

  // Fetch category for each post
  const postsWithCategories = await Promise.all(
    posts.map(async (post) => {
      if (post.fields.category?.contentID) {
        const category = await getContentItem({
          contentID: post.fields.category.contentID,
          locale,
        });
        return { ...post, category };
      }
      return post;
    })
  );

  return (
    <div className="grid gap-4">
      {postsWithCategories.map((post) => (
        <article key={post.contentID}>
          <h3>{post.fields.title}</h3>
          {post.category && (
            <span className="badge">{post.category.fields.name}</span>
          )}
          <p>{post.fields.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
```

## Best Practices

1. **Type Safety**: Define TypeScript interfaces for component props
2. **Error Handling**: Check for missing fields and provide defaults
3. **Loading States**: Use Suspense for data fetching
4. **Caching**: Data is automatically cached by Next.js
5. **Responsive Design**: Use Tailwind classes for responsive layouts
6. **Accessibility**: Include proper ARIA labels and semantic HTML
7. **Performance**: Optimize images with next/image when possible

## Component Examples from Demo Site

Here are real-world component examples from the demo site:

1. **BackgroundHero**: Hero component with image/gradient backgrounds
2. **BentoSection**: Grid layout component with nested card collection
3. **LogoStrip**: Logo gallery component with CTA
4. **PostListing**: Blog listing component with pagination
5. **Testimonials**: Testimonial carousel component
6. **TeamListing**: Team member grid component
7. **CompanyStats**: Animated statistics component
8. **ContactUs**: Contact form component (hybrid pattern)
9. **FrequentlyAskedQuestions**: FAQ accordion component
10. **PricingCards**: Pricing display component

## Next Steps

- Read [04-data-fetching.md](./04-data-fetching.md) for data fetching patterns
- Read [05-containers-and-lists.md](./05-containers-and-lists.md) for content lists
- Read [08-common-components.md](./08-common-components.md) for more examples
