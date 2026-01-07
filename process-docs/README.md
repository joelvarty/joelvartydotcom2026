# Process Documentation

This folder contains blog-style documentation of the development process for JoelVarty.com. Each post documents significant features, decisions, milestones, and challenges encountered during development.

> **For agent instructions**: See `AGENTS.md` in this folder for specific guidelines on writing blog posts.
> **For complete project guidelines**: See the main `AGENTS.md` at the project root.

## Structure

- **Markdown blog posts** - Document features, decisions, and milestones
- **images/** - Screenshots and diagrams for process posts
- **README.md** - This index file

## Post Naming Convention

Use descriptive filenames: `YYYY-MM-DD-feature-name.md`

Examples:
- `2026-01-06-01-planning-joelvarty-com.md`
- `2026-01-06-02-phase-1-cursor`
- `2026-01-06-03-blogpost-model-challenges.md`
- `2026-01-06-04-phase-3-layout-components.md`
- `2026-01-27-phase-4-blog-system.md`

## CRITICAL: Authorship and Voice Guidelines

**IMPORTANT**: These blog posts are written from **Joel's perspective** (first person "I" = Joel). AI agents must clearly distinguish their contributions.

### Main Narrative Sections
- **Written as if Joel is speaking** - Use first person "I" to refer to Joel
- **Voice**: Conversational, direct, practical, story-driven (see Joel's writing voice in AGENTS.md)
- **Perspective**: Joel is the author telling the story of building the site
- **Agent actions**: Refer to "the agent" or "the AI agent" (not "I" when describing agent work)

### Examples of Correct Voice:

✅ **Correct** (Joel's voice):
```markdown
I started by running `create-next-agility-app` to spin up a new Next.js project.
The AI agent helped me set up ShadCN UI with the "new-york" style.
```

❌ **Incorrect** (Agent's voice):
```markdown
I set up ShadCN UI with the "new-york" style. I created the folder structure.
```

✅ **Correct** (Describing agent work):
```markdown
The agent attempted to create the BlogPost model but ran into issues with
LinkedContent field configuration. I manually fixed it in the Agility CMS UI.
```

### Technical Details Sections

All technical implementation details must be in a clearly marked section:

```markdown
---

## Technical Details (Written by [Agent Name])

**Agent**: [Agent Name]
**Purpose**: Reference documentation for technical implementation details

[Technical content here]
```

### Required Header Note

Every blog post must start with a note clarifying authorship:

```markdown
# [Post Title]

**Date**: [Date]
**Phase**: [Phase Name]
**Status**: [Status]

> **Note**: This post is written from Joel's perspective (first person "I" = Joel).
> Technical details sections are clearly marked as written by the AI agent ([Agent Name]).
```

### Writing Style

- **Narrative style** - Write as blog posts, not just technical notes
- **Include context** - Explain what was built, how, and why
- **Document challenges** - Include problems encountered and solutions
- **Add screenshots** - Visual documentation in `images/` subfolder
- **Update as you go** - Don't wait until the end, document as work progresses
- **Joel's voice** - Conversational, direct, practical, story-driven (see AGENTS.md for full voice guidelines)

## Index

### 2026

**January 2026**
- [2026-01-06-01-planning-joelvarty-com.md](2026-01-06-01-planning-joelvarty-com.md) - Planning phase documentation
- [2026-01-06-02-phase-1-cursor](2026-01-06-02-phase-1-cursor) - Phase 1 setup completion
- [2026-01-06-03-blogpost-model-challenges.md](2026-01-06-03-blogpost-model-challenges.md) - BlogPost model setup challenges and learnings
- [2026-01-06-04-phase-3-layout-components.md](2026-01-06-04-phase-3-layout-components.md) - Phase 3 layout components implementation
- [2026-01-06-05-phase-4-blog-system.md](2026-01-06-05-phase-4-blog-system.md) - Phase 4 blog system with gallery support
- [2026-01-06-06-phase-6-uses-page.md](2026-01-06-06-phase-6-uses-page.md) - Phase 6 uses page
- [2026-01-06-07-phase-7-content-cms.md](2026-01-06-07-phase-7-content-cms.md) - Phase 7 content and CMS integration
- [2026-01-06-08-phase-8-styling-polish.md](2026-01-06-08-phase-8-styling-polish.md) - Phase 8 styling and polish
- [2026-01-06-09-project-summary.md](2026-01-06-09-project-summary.md) - Complete project summary

---

**Note**: These blog posts are collaborative documents. AI agents create initial content, and Joel adds personal thoughts, reactions, and creative direction. They will be published as a series when development is complete.

**Last Updated**: 2026-01-27

