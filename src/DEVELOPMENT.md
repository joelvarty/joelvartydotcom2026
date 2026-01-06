# Development Guide

This project includes comprehensive documentation for building with Agility CMS and AI coding assistants.

## 🚀 Quick Start

**New to this project?** Start here: [.claude/QUICK-START.md](./.claude/QUICK-START.md)

## 📚 Documentation

All documentation is located in the `.claude/` directory:

### For Developers
- **[Quick Start](./.claude/QUICK-START.md)** - Get up and running in 5 minutes
- **[Agility CMS Overview](./.claude/docs/01-agility-cms-overview.md)** - How Agility CMS works
- **[Creating Components](./.claude/docs/03-creating-components.md)** - Build new features
- **[Common Components](./.claude/docs/08-common-components.md)** - Ready-to-use examples

### For AI Coding Assistants
- **[AI Assistant Guide](./.claude/docs/00-ai-assistant-guide.md)** - Guide for AI tools
- **[Full Documentation Index](./.claude/README.md)** - Complete documentation

## 🤖 Using with AI Tools

### Claude Code
Documentation is automatically discovered. Just ask:
```
"Add a blog with pagination"
"Create a hero section"
```

### Cursor
Reference docs explicitly:
```
"Following the pattern in .claude/docs/03-creating-components.md,
create a testimonials carousel"
```

Or use the AI sidebar with:
```
@.claude/docs/03-creating-components.md
```

### GitHub Copilot
Use workspace context:
```
@workspace /new Using the Agility CMS patterns in .claude/docs/,
create a team members grid component
```

### Google AI Studio / Gemini
Share the documentation files and reference them:
```
"Based on the patterns in .claude/docs/03-creating-components.md..."
```

## 📖 Common Tasks

### Add a New Component
1. Read [.claude/docs/03-creating-components.md](./.claude/docs/03-creating-components.md)
2. Create file in `src/components/agility-components/YourComponent.tsx`
3. Register in `src/components/agility-components/index.ts`
4. Create component model in Agility CMS
5. Add to pages in CMS

### Fetch Content Lists
1. Read [.claude/docs/05-containers-and-lists.md](./.claude/docs/05-containers-and-lists.md)
2. Use `getContentList()` helper
3. Always pass `locale` parameter

### Add Multi-Language Support
1. Read [.claude/docs/06-localization.md](./.claude/docs/06-localization.md)
2. Update `AGILITY_LOCALES` in `.env.local`
3. Update `lib/i18n/config.ts`

## 🎯 AI Prompt Examples

Try these prompts with any AI assistant:

```
"Add a blog listing component with pagination following the Agility CMS patterns"

"Create a contact form component using the hybrid server/client pattern from the docs"

"Implement a testimonials carousel like the example in .claude/docs/08-common-components.md"

"Add a FAQ accordion component with the patterns from .claude/docs/"
```

## 📂 Project Structure

```
src/
├── app/[locale]/[...slug]/page.tsx  # All pages route here
├── components/
│   ├── agility-components/          # CMS components (add here)
│   └── agility-pages/               # Page templates
└── lib/cms/                         # CMS helper functions
```

## 🔧 Development Commands

```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run start   # Start production server
```

## 📞 Getting Help

- **Documentation**: See [.claude/README.md](./.claude/README.md)
- **Agility CMS Docs**: https://agilitycms.com/docs
- **Next.js Docs**: https://nextjs.org/docs

## 🌟 Key Features

- ✅ Agility CMS integration with type-safe helpers
- ✅ Multi-locale support out of the box
- ✅ Server Components with ISR caching
- ✅ AI-friendly documentation
- ✅ Production-ready patterns

---

**Ready to build?** Check out [.claude/QUICK-START.md](./.claude/QUICK-START.md) and start creating! 🚀
