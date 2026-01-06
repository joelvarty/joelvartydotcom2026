# AI Assistant Guide for Agility CMS Projects

This guide helps AI coding assistants (Claude Code, Cursor, GitHub Copilot, Google AI Studio, etc.) understand and work with this Agility CMS + Next.js project.

## Project Overview

This is a Next.js 15 project with Agility CMS headless CMS integration. It uses:
- **Next.js 15** with App Router
- **React 19** Server Components
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Agility CMS** for content management

## Key Architecture Patterns

### 1. Headless CMS Flow
```
Agility CMS (Content) → API Fetch → Next.js (Server Component) → React Component → Browser
```

### 2. File Structure
```
src/
├── app/[locale]/[...slug]/page.tsx  ← All pages route here
├── components/
│   ├── agility-components/          ← CMS modules (Hero, Blog, etc.)
│   └── agility-pages/               ← Page templates
└── lib/
    └── cms/                         ← CMS helper functions
```

### 3. Module Pattern
Agility CMS "modules" are React components that editors add to pages:
- Module defined in Agility CMS → React component in `agility-components/`
- Registered in `agility-components/index.ts`
- Renders via `<ContentZone>` in page template

## How to Help Users

### When User Wants a New Feature

1. **Identify Type**: Is it a module, page template, or standalone component?
2. **Create Files**: Generate TypeScript component files
3. **Register**: Add to appropriate index.ts
4. **Fetch Data**: Use `getContentList()` or `getContentItem()` for CMS data
5. **Add Types**: Define TypeScript interfaces

### When User Wants to Fix a Bug

1. **Read Files**: Use Read tool on relevant files
2. **Understand Pattern**: Check similar working components
3. **Apply Fix**: Use Edit tool to fix issues
4. **Verify**: Explain the fix and ask user to test

### When User Wants a Blog/List Feature

1. **Content List Module**: Create in `agility-components/`
2. **Fetch Data**: Use `getContentList({ referenceName: "posts", locale })`
3. **Display**: Map over items and render
4. **Pagination**: Use searchParams for page numbers

### When User Wants Multi-Language

1. **Check Config**: Read `lib/i18n/config.ts`
2. **Use Locale**: Always pass `locale` prop to CMS functions
3. **URL Structure**: Default locale has no prefix, others do (/fr/, /es/)

## Common Tasks

### Task: Create a New Module Component

```tsx
// 1. Create file: src/components/agility-components/MyModule.tsx
interface MyModuleProps {
  module: {
    fields: {
      title: string;
      // ... other fields
    };
  };
  locale: string;
}

export default function MyModule({ module, locale }: MyModuleProps) {
  const { title } = module.fields;
  return <div>{title}</div>;
}

// 2. Register in src/components/agility-components/index.ts
import MyModule from "./MyModule";

export const getModule = (moduleName: string) => {
  switch (moduleName) {
    case "MyModule":  // Must match Agility CMS reference name
      return MyModule;
    // ... other cases
  }
};
```

### Task: Fetch and Display Content List

```tsx
import { getContentList } from "@/lib/cms/getContentList";

export default async function PostListing({ locale }: any) {
  const posts = await getContentList({
    referenceName: "posts",
    locale,
    take: 10,
    sort: "fields.date desc",
  });

  return (
    <div>
      {posts.map((post) => (
        <article key={post.contentID}>
          <h3>{post.fields.title}</h3>
          <p>{post.fields.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
```

### Task: Add Interactive Client Component

```tsx
// Server component (data fetching)
import MyComponentClient from "./MyComponent.client";

export default async function MyComponent({ module, locale }: any) {
  const data = await fetchData(locale);
  return <MyComponentClient data={data} />;
}

// Client component (interactivity)
"use client";
import { useState } from "react";

export default function MyComponentClient({ data }: any) {
  const [state, setState] = useState(0);
  return <button onClick={() => setState(state + 1)}>{state}</button>;
}
```

### Task: Add a New Page Template

```tsx
// 1. Create file: src/components/agility-pages/TwoColumn.tsx
import { ContentZone } from "@agility/nextjs";
import { getModule } from "../agility-components";

export default function TwoColumn(props: any) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <ContentZone name="left-zone" {...props} getModule={getModule} />
      <ContentZone name="right-zone" {...props} getModule={getModule} />
    </div>
  );
}

// 2. Register in src/components/agility-pages/index.ts
import TwoColumn from "./TwoColumn";

export const getPageTemplate = (templateName: string) => {
  switch (templateName) {
    case "TwoColumn":
      return TwoColumn;
    // ... other cases
  }
};
```

## Important Patterns to Remember

### 1. Always Use AgilityPic for Images

**CRITICAL**: All images from Agility CMS MUST be rendered using the `<AgilityPic>` component from `@agility/nextjs`. Never use Next.js `<Image>` or plain `<img>` tags for Agility CMS images.

```tsx
import { AgilityPic } from "@agility/nextjs";
import type { ImageField } from "@agility/nextjs";

// GOOD - Use AgilityPic for Agility CMS images
<AgilityPic
  image={imageField}
  fallbackWidth={600}
  className="w-full h-auto rounded-2xl"
  data-agility-field="image"
/>

// BAD - Never use Next.js Image or img for Agility images
<Image src={imageField.url} alt="..." />  // ❌ WRONG
<img src={imageField.url} alt="..." />    // ❌ WRONG
```

**Key AgilityPic Props**:
- `image` (required): The ImageField object from Agility CMS
- `fallbackWidth`: Width in pixels for fallback (e.g., 600)
- `alt`: Optional alt text (uses CMS alt by default)
- `className`: CSS classes for styling
- `priority`: Set true for above-the-fold images
- `sources`: Array of responsive sources with media queries
- `data-agility-field`: Field name for inline editing

**Example with Responsive Images**:
```tsx
<AgilityPic
  image={post.image}
  fallbackWidth={400}
  className="w-full h-full object-cover rounded-2xl"
  sources={[
    { media: "(max-width: 639px)", width: 640 },
    { media: "(max-width: 767px)", width: 800 },
    { media: "(max-width: 1023px)", width: 1200 },
  ]}
  data-agility-field="image"
/>
```

### 2. Always Use Locale
```tsx
// GOOD
const data = await getContentList({ referenceName: "posts", locale });

// BAD - missing locale
const data = await getContentList({ referenceName: "posts" });
```

### 3. Reference Name for Lists
```tsx
// GOOD - use referenceName from fields
const items = await getContentList({
  referenceName: cards.referenceName,
  locale,
});

// BAD - hardcoded string
const items = await getContentList({
  referenceName: "testimonials",
  locale,
});
```

### 4. Server vs Client Components
```tsx
// Server Component (default) - for data fetching
export default async function MyComponent() {
  const data = await fetchData();
  return <div>{data}</div>;
}

// Client Component - for interactivity
"use client";
export default function MyComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### 5. Type Safety
```tsx
import type { ImageField } from "@agility/nextjs";

// GOOD - define types with ImageField for images
interface Post {
  contentID: number;
  fields: {
    title: string;
    slug: string;
    image: ImageField;  // Always use ImageField for Agility images
  };
}

const posts: Post[] = await getContentList({ ... });

// BAD - using any
const posts: any = await getContentList({ ... });
```

## File Naming Conventions

- `.tsx` - React component (auto-detected as server or client)
- `.server.tsx` - Explicitly server component (optional)
- `.client.tsx` - Explicitly client component (must have "use client")
- `index.ts` - Registry/barrel file for exports

## Common Gotchas

1. **Image Components**: ALWAYS use `<AgilityPic>` for Agility CMS images, NEVER use `<Image>` or `<img>`
2. **Module Reference Names**: Must match EXACTLY between Agility CMS and code
3. **Locale Param**: Always pass locale to CMS functions
4. **ContentID vs ReferenceName**: Use referenceName for lists, contentID for single items
5. **Preview Mode**: Uses different API key (PREVIEW vs FETCH)
6. **Cache Tags**: Automatically added, no manual setup needed
7. **Search Params**: Encoded with ~~~ in URLs for static generation

## CMS Helper Functions Reference

| Function | Purpose | Example |
|----------|---------|---------|
| `getAgilityPage()` | Full page data | `await getAgilityPage({ params })` |
| `getContentItem()` | Single content | `await getContentItem({ contentID: 123, locale })` |
| `getContentList()` | Content collection | `await getContentList({ referenceName: "posts", locale })` |
| `getSitemapFlat()` | Flat sitemap | `await getSitemapFlat({ locale })` |
| `getSitemapNested()` | Nested sitemap | `await getSitemapNested({ locale })` |

## When in Doubt

1. **Read existing code**: Check similar components in `agility-components/`
2. **Check documentation**: Read the relevant `.md` file in `.claude/docs/`
3. **Ask clarifying questions**: If requirements are unclear, ask the user
4. **Keep it simple**: Don't over-engineer, follow existing patterns
5. **Type everything**: Use TypeScript interfaces for all props

## Documentation Index

- [01-agility-cms-overview.md](./01-agility-cms-overview.md) - CMS concepts
- [02-page-routing.md](./02-page-routing.md) - Routing and URL structure
- [03-creating-components.md](./03-creating-components.md) - Module components
- [04-data-fetching.md](./04-data-fetching.md) - Fetching CMS data
- [05-containers-and-lists.md](./05-containers-and-lists.md) - Content lists
- [06-localization.md](./06-localization.md) - Multi-language
- [07-caching-strategies.md](./07-caching-strategies.md) - Caching patterns
- [08-common-components.md](./08-common-components.md) - Component examples
- [11-linked-nested-content.md](./11-linked-nested-content.md) - Linked/nested content patterns

## Goal: Enable Vibe Coding

This documentation enables users to build complete websites by:
1. **Describing what they want** ("Add a blog with categories and pagination")
2. **AI generates code** using patterns from docs
3. **User configures in Agility CMS** (creates modules, adds content)
4. **Site works immediately** following established patterns

The key is that AI assistants should be able to:
- Generate new components following the patterns
- Fetch data correctly using helper functions
- Handle locales, caching, and routing automatically
- Create type-safe, production-ready code

## Success Criteria

You're helping effectively when:
1. ✅ Generated code follows existing patterns
2. ✅ All CMS functions include locale parameter
3. ✅ TypeScript types are defined
4. ✅ Server/client split is correct
5. ✅ Module names match Agility CMS reference names
6. ✅ Code is production-ready and maintainable

Good luck building amazing websites! 🚀
