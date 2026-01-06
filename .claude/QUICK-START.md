# Quick Start Guide

Get up and running with Agility CMS + Next.js in 5 minutes.

## 1. Project Setup ✅

Your project is already set up with:
- ✅ Next.js 15 with App Router
- ✅ Agility CMS integration
- ✅ Multi-locale support
- ✅ TypeScript
- ✅ Caching configured
- ✅ MCP Server configured (connects AI assistants to your Agility CMS)

## 2. Environment Variables

Required in `.env.local`:
```env
AGILITY_GUID=your-instance-guid
AGILITY_API_FETCH_KEY=your-fetch-key
AGILITY_API_PREVIEW_KEY=your-preview-key
AGILITY_LOCALES=en-us
AGILITY_SITEMAP=website
```

## 3. File Structure

```
src/
├── app/[locale]/[...slug]/page.tsx  ← All pages route here
├── components/
│   ├── agility-components/          ← Add modules here
│   └── agility-pages/               ← Add templates here
└── lib/cms/                         ← CMS helper functions
```

## 4. Common Tasks

### Add a New Component

```tsx
// 1. Create: src/components/agility-components/Hero.tsx
interface HeroProps {
  module: {
    fields: {
      title: string;
      subtitle: string;
    };
  };
  locale: string;
}

export default function Hero({ module, locale }: HeroProps) {
  return (
    <div>
      <h1>{module.fields.title}</h1>
      <p>{module.fields.subtitle}</p>
    </div>
  );
}

// 2. Register: src/components/agility-components/index.ts
import Hero from "./Hero";

export const getModule = (moduleName: string) => {
  switch (moduleName) {
    case "Hero":
      return Hero;
    // ... other modules
  }
};

// 3. Create module in Agility CMS with reference name "Hero"
// 4. Add to page in Agility CMS
```

### Fetch a Content List

```tsx
import { getContentList } from "@/lib/cms/getContentList";

export default async function BlogList({ locale }: any) {
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
          <h2>{post.fields.title}</h2>
        </article>
      ))}
    </div>
  );
}
```

### Add Interactive Component

```tsx
// Server component (fetches data)
import MyClient from "./MyComponent.client";

export default async function MyComponent({ locale }: any) {
  const data = await fetchData(locale);
  return <MyClient data={data} />;
}

// Client component (interactivity)
"use client";
import { useState } from "react";

export default function MyClient({ data }: any) {
  const [active, setActive] = useState(false);
  return <button onClick={() => setActive(!active)}>Toggle</button>;
}
```

## 5. Development

```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run start   # Start production server
```

## 6. Key Concepts

### Components (Modules in CMS)
Reusable components editors add to pages. Created in Agility CMS, implemented as React components.

### Page Templates
Define page layout with zones. Components (Modules in CMS) are placed in zones.

### Content Lists
Collections like blog posts, testimonials, team members. Fetched with `getContentList()`.

### Locales
Multi-language support. Default locale (en-us) has clean URLs, others prefixed (/fr/, /es/).

## 7. CMS Helper Functions

```tsx
import {
  getAgilityPage,     // Fetch complete page
  getContentItem,     // Fetch single item
  getContentList,     // Fetch collection
  getSitemapFlat,     // Fetch sitemap
} from "@/lib/cms";

// Fetch page
const page = await getAgilityPage({ params });

// Fetch single item
const item = await getContentItem({ contentID: 123, locale: "en-us" });

// Fetch list
const items = await getContentList({ referenceName: "posts", locale: "en-us" });
```

## 8. MCP Server Setup (Optional but Recommended)

The Agility CMS MCP Server allows AI assistants to directly access your CMS content and configuration. This makes it easier to build components and features.

**The MCP server is pre-configured in this project!** Just authenticate when prompted.

For manual setup or troubleshooting, see [10-mcp-server-setup.md](./docs/10-mcp-server-setup.md).

## 9. Next Steps

1. **Setup MCP**: Read [10-mcp-server-setup.md](./docs/10-mcp-server-setup.md) to connect your AI assistant
2. **Read docs**: Check `.claude/README.md`
3. **Create modules**: Follow [03-creating-components.md](./docs/03-creating-components.md)
4. **See examples**: Check [08-common-components.md](./docs/08-common-components.md)
5. **Build your site**: Ask your AI assistant to help!

## 10. Getting Help

### Documentation
- [MCP Server Setup](./docs/10-mcp-server-setup.md) - Connect AI assistant to CMS
- [AI Assistant Guide](./docs/00-ai-assistant-guide.md) - For AI coding
- [Agility CMS Overview](./docs/01-agility-cms-overview.md) - How it works
- [Creating Components](./docs/03-creating-components.md) - Build components
- [Common Components](./docs/08-common-components.md) - Examples

### AI Assistant Prompts

Try these prompts with your AI assistant:

```
"Add a blog listing with pagination"
"Create a hero section with background image"
"Add a contact form"
"Implement a testimonials carousel"
"Add FAQ accordion"
"Create a team members grid"
```

## 11. Checklist

Before deploying, make sure:
- [ ] Environment variables set
- [ ] Components (Modules in CMS) registered in index.ts
- [ ] Content created in Agility CMS
- [ ] Locales configured if multi-language
- [ ] Build succeeds (`npm run build`)
- [ ] Test preview mode
- [ ] Test all pages and modules

## Quick Reference

| Task | File | Function |
|------|------|----------|
| Add module | `agility-components/YourModule.tsx` | `export default function` |
| Register module | `agility-components/index.ts` | Add to `getModule()` |
| Add template | `agility-pages/YourTemplate.tsx` | Use `<ContentZone>` |
| Register template | `agility-pages/index.ts` | Add to `getPageTemplate()` |
| Fetch page | Any component | `getAgilityPage({ params })` |
| Fetch item | Any component | `getContentItem({ contentID, locale })` |
| Fetch list | Any component | `getContentList({ referenceName, locale })` |
| Configure locales | `lib/i18n/config.ts` | Update `locales` array |
| Env vars | `.env.local` | Add `AGILITY_*` vars |

---

**Ready to build? Start with: "Hey assistant, add a blog to my site!"** 🚀
