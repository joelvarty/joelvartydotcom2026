# Claude Code Instructions

See [AGENTS.md](./AGENTS.md) for full coding guidelines and project structure.

## Quick Reference

- **Stack**: Next.js 15 App Router + Agility CMS + TypeScript
- **Docs**: Detailed docs in `src/docs/` (01 through 11)
- **Components**: `src/components/agility-components/` - register in `index.ts`
- **Pages**: `src/components/agility-pages/` - register in `index.ts`
- **CMS helpers**: `src/lib/cms/` (getAgilityPage, getContentItem, getContentList, getSitemapFlat)
- **Routing**: Dynamic `[locale]/[...slug]` with middleware rewrites in `src/proxy.ts`
- **MCP Server**: Agility CMS MCP is pre-configured for direct CMS access

## Commands

```bash
npm run dev     # Dev server
npm run build   # Production build
npm run start   # Production server
```

## Content Source: Thought Leadership Project

Page content for joelvarty.com is authored and maintained in a separate Cowork project at:
`~/Library/CloudStorage/OneDrive-AgilityInc/Claude/thought-leadership/`

### Key files to reference:

| File                                       | Use For                                                                                                 |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `website-pages/joelvarty-story-page.md`    | Content for /story page                                                                                 |
| `website-pages/joelvarty-speaking-page.md` | Content for /speaking page                                                                              |
| `Joel-Varty-Thought-Leadership-Dossier.md` | Full bio, quotes, speaking history, awards, links (reference for any page that needs biographical info) |
| `agents.md`                                | Full project context, strategic goals, brand voice guidelines                                           |

### Workflow:

- Content is drafted and approved in the Cowork project first
- When building or updating pages, read the latest version from the paths above
- Do NOT edit the markdown files in the OneDrive folder from this project. If content needs changes, note it and Joel will update it in Cowork.
- The Cowork project has access to Joel's email, calendar, Slack, and web search for research. This project does not.

### Voice & Tone:

- Direct, warm, personal. Not corporate.
- No em-dashes.
- Joel's opening line: "I design systems. Technical ones and human ones."
- See agents.md in the thought-leadership folder for full brand guidelines.
