# Agility CMS + Next.js Project

This project was created with [`create-next-agility-app`](https://github.com/agility/create-next-agility-app).

**✨ Built for AI-assisted development** - Includes comprehensive documentation for Claude Code, Cursor, GitHub Copilot, and all AI coding tools.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your site.

## 📚 Documentation

This project includes extensive documentation optimized for both developers and AI assistants:

### Quick Links
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Complete development guide
- **[.claude/QUICK-START.md](./.claude/QUICK-START.md)** - Get started in 5 minutes
- **[.claude/README.md](./.claude/README.md)** - Full documentation index
- **[docs/README.md](./docs/README.md)** - Documentation overview

### For Developers
- [Agility CMS Overview](./.claude/docs/01-agility-cms-overview.md) - How Agility CMS works
- [Creating Components](./.claude/docs/03-creating-components.md) - Build features
- [Common Components](./.claude/docs/08-common-components.md) - Ready-to-use examples

### For AI Coding Assistants
- [AI Assistant Guide](./.claude/docs/00-ai-assistant-guide.md) - Optimized for AI tools
- Works with: Claude Code, Cursor, GitHub Copilot, Google AI Studio, Continue.dev, Windsurf

## 🤖 AI-Assisted Development

This project is designed for AI-assisted development. Try these prompts:

```
"Add a blog listing component with pagination"
"Create a hero section with background image"
"Implement a testimonials carousel"
"Add a contact form with validation"
```

### Platform-Specific Tips

**Claude Code:**
```
Just ask naturally - documentation is auto-discovered!
"Add a blog with categories"
```

**Cursor:**
```
Reference docs explicitly:
@.claude/docs/03-creating-components.md create a testimonials carousel
```

**GitHub Copilot:**
```
Use workspace context:
@workspace /new Create a team members grid following Agility CMS patterns
```

## 📂 Project Structure

```
src/
├── app/
│   └── [locale]/
│       └── [...slug]/
│           └── page.tsx          # All pages route through here
├── components/
│   ├── agility-components/       # CMS components (add yours here)
│   │   ├── index.ts             # Component registry
│   │   └── RichTextArea.tsx     # Example component
│   └── agility-pages/            # Page templates
│       ├── index.ts             # Template registry
│       └── MainTemplate.tsx     # Main template
└── lib/
    ├── cms/                      # CMS helper functions
    │   ├── getAgilityPage.ts
    │   ├── getContentItem.ts
    │   ├── getContentList.ts
    │   └── ...
    └── i18n/
        └── config.ts             # Locale configuration
```

## 🔧 Environment Variables

Configure your Agility CMS connection in `.env.local`:

```env
AGILITY_GUID=your-instance-guid
AGILITY_API_FETCH_KEY=your-fetch-api-key
AGILITY_API_PREVIEW_KEY=your-preview-api-key
AGILITY_LOCALES=en-us
AGILITY_SITEMAP=website
```

## 🎯 Common Tasks

### Add a New Component

1. Create file: `src/components/agility-components/YourComponent.tsx`
2. Register in: `src/components/agility-components/index.ts`
3. Create component model in Agility CMS (Settings > Content Definitions > New Module)
4. Add to page in CMS

**See:** [.claude/docs/03-creating-components.md](./.claude/docs/03-creating-components.md)

### Fetch Content Lists

```typescript
import { getContentList } from "@/lib/cms/getContentList";

const posts = await getContentList({
  referenceName: "posts",
  locale: "en-us",
  take: 10,
});
```

**See:** [.claude/docs/04-data-fetching.md](./.claude/docs/04-data-fetching.md)

### Add Multi-Language Support

1. Update `AGILITY_LOCALES` in `.env.local`
2. Update `src/lib/i18n/config.ts`
3. Add locale content in Agility CMS

**See:** [.claude/docs/06-localization.md](./.claude/docs/06-localization.md)

## 🏗️ Development Commands

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

## 📦 What's Included

- ✅ **Agility CMS Integration** - Full SDK with type-safe helpers
- ✅ **Next.js 15** - App Router with Server Components
- ✅ **Multi-Locale Support** - Built-in internationalization
- ✅ **TypeScript** - Full type safety
- ✅ **Caching** - ISR with on-demand revalidation
- ✅ **Preview Mode** - See draft content before publishing
- ✅ **AI-Friendly Docs** - Optimized for all AI coding tools

## 🔗 Key Concepts

### Components (Called "Modules" in CMS)
Reusable building blocks that editors add to pages. Created in Agility CMS, implemented as React components.

### Page Templates
Define page layout with zones. Components are placed in these zones.

### Content Lists
Collections like blog posts, testimonials, team members. Fetched with `getContentList()`.

### Locales
Multi-language support. Default locale (en-us) has clean URLs, others are prefixed (/fr/, /es/).

## 📖 Learn More

### Documentation
- **[Development Guide](./DEVELOPMENT.md)** - Comprehensive dev guide
- **[Quick Start](./.claude/QUICK-START.md)** - 5-minute setup
- **[Full Docs](./.claude/README.md)** - Complete documentation

### Agility CMS Resources
- [Agility CMS Documentation](https://agilitycms.com/docs)
- [Agility CMS Help Center](https://help.agilitycms.com)
- [Agility CMS Community](https://community.agilitycms.com)

### Next.js Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js GitHub](https://github.com/vercel/next.js)

## 🚢 Deployment

### Deploy on Vercel

The easiest way to deploy:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your code to GitHub
2. Import repository in Vercel
3. Add environment variables
4. Deploy!

### Environment Variables for Production

Set these in your hosting platform:
- `AGILITY_GUID`
- `AGILITY_API_FETCH_KEY`
- `AGILITY_API_PREVIEW_KEY`
- `AGILITY_SECURITY_KEY` (for webhooks)
- `AGILITY_LOCALES`
- `AGILITY_SITEMAP`

## 🐛 Troubleshooting

### Build Fails
- Check all environment variables are set
- Ensure components are registered in `index.ts`
- Verify Agility CMS content exists

### Preview Mode Not Working
- Check `AGILITY_API_PREVIEW_KEY` is set
- Verify preview key matches in CMS
- Clear cookies and try again

### Components Not Rendering
- Verify component is registered in `agility-components/index.ts`
- Check component reference name matches CMS exactly (case-sensitive)
- Ensure component model exists in Agility CMS

**More help:** See [.claude/docs/11-troubleshooting.md](./.claude/docs/11-troubleshooting.md) (if available)

## 🤝 Contributing

Contributions are welcome! Please read the [contribution guidelines](https://github.com/agility/create-next-agility-app/blob/main/CONTRIBUTING.md) first.

## 📄 License

MIT

---

**Built with [Agility CMS](https://agilitycms.com) ❤️**
