# Process Documentation

This folder contains blog-style documentation of the development process for JoelVarty.com. Each post documents significant features, decisions, milestones, and challenges encountered during development.

> **For agent instructions**: See `AGENTS.md` in this folder for specific guidelines on writing blog posts.
> **For complete project guidelines**: See the main `AGENTS.md` at the project root.

## Structure

- **Markdown blog posts** - Document features, decisions, and milestones
- **images/** - Screenshots and diagrams for process posts (enhanced with comprehensive screenshots on January 8, 2026)
- **README.md** - This index file

## Screenshots Documentation (Updated January 8, 2026)

The documentation has been significantly enhanced with screenshots captured using Chrome DevTools MCP, showing:

**Application Screenshots:**
- Homepage (light and dark modes)
- Blog listing page
- Blog post detail pages
- Career timeline page
- Uses page
- About page

**Agility CMS Screenshots:**
- Blog Post content model with field configuration
- Linked content field details (Category field)
- Basic Markdown component model (using Power Fields)
- Posts content list with sample content
- Blog post editor with gallery markdown examples
- Blog post with category and tag selection
- Homepage page structure with components

**Documentation Enhanced with Screenshots:**
- Phase 3 (Layout Components) - Homepage light/dark modes
- Phase 5 (About & Career) - Career and About pages
- Phase 6 (Uses Page) - Uses page interface
- Phase 7 (Content & CMS) - Homepage page structure in CMS
- Project Summary - Complete visual tour of all major pages
- Phase 2/3 (BlogPost Model) - Agility CMS configuration screenshots
- Blog Details Fix - Gallery examples in markdown editor

All screenshots are stored in `images/` folder and embedded in the relevant documentation files.

## Post Naming Convention

Use descriptive filenames: `YYYY-MM-DD-feature-name.md`

Examples:
- `2026-01-06-01-planning-joelvarty-com.md`
- `2026-01-06-02-phase-1-cursor`
- `2026-01-06-03-blogpost-model-challenges.md`
- `2026-01-06-04-phase-3-layout-components.md`
- `2026-01-06-05-phase-4-blog-system.md`

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
- [2026-01-06-06-phase-5-about-career.md](2026-01-06-06-phase-5-about-career.md) - Phase 5 about and career pages
- [2026-01-06-07-phase-6-uses-page.md](2026-01-06-07-phase-6-uses-page.md) - Phase 6 uses page
- [2026-01-06-08-phase-7-content-cms.md](2026-01-06-08-phase-7-content-cms.md) - Phase 7 content and CMS integration
- [2026-01-06-09-phase-8-styling-polish.md](2026-01-06-09-phase-8-styling-polish.md) - Phase 8 styling and polish
- [2026-01-06-10-project-summary.md](2026-01-06-10-project-summary.md) - Complete project summary
- [2026-01-06-11-testing-content-requirements.md](2026-01-06-11-testing-content-requirements.md) - Testing content requirements
- [2026-01-06-12-phase-9-testing-setup.md](2026-01-06-12-phase-9-testing-setup.md) - Phase 9 testing infrastructure setup
- [2026-01-06-13-sample-content-creation.md](2026-01-06-13-sample-content-creation.md) - Sample content creation for testing
- [2026-01-06-14-agility-component-content-loading-mistake.md](2026-01-06-14-agility-component-content-loading-mistake.md) - The Agility component content loading mistake
- [2026-01-06-15-blog-details-dynamic-page-item-fix.md](2026-01-06-15-blog-details-dynamic-page-item-fix.md) - Blog Details component: The dynamicPageItem discovery
- [2026-01-06-16-career-timeline-8starlabs-upgrade.md](2026-01-06-16-career-timeline-8starlabs-upgrade.md) - Upgrading the Career Timeline with 8star Labs
- [2026-01-08-01-switching-to-claude-code.md](2026-01-08-01-switching-to-claude-code.md) - Switching from Cursor to Claude Code: A New Development Partner
- [2026-01-08-02-markdown-gallery-refactoring.md](2026-01-08-02-markdown-gallery-refactoring.md) - Markdown Gallery Refactoring: From Regex to Remark Plugin
- [2026-01-08-03-series-feature.md](2026-01-08-03-series-feature.md) - Series Feature: Grouping Blog Posts with Context

### Key Reference Documents
- [AI-DEVELOPMENT-WORKFLOW.md](AI-DEVELOPMENT-WORKFLOW.md) - **📚 ESSENTIAL READING: Comprehensive guide explaining the human-AI collaboration model, what MCP changes, real-world examples, and lessons learned**
- [WHERE-TO-ADD-YOUR-THOUGHTS.md](WHERE-TO-ADD-YOUR-THOUGHTS.md) - **✍️ Quick reference showing where Joel can add personal perspective to each document**
- [SCREENSHOTS-INVENTORY.md](SCREENSHOTS-INVENTORY.md) - Inventory of all 21 screenshots captured for documentation

---

**Note**: These blog posts are collaborative documents. AI agents create initial content, and Joel adds personal thoughts, reactions, and creative direction. They will be published as a series when development is complete.

**Last Updated**: 2026-01-08

