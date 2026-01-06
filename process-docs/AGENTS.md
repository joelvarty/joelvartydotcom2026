# AGENTS.md - Process Documentation

This file contains specific instructions for AI agents working on blog posts in the `process-docs/` folder.

> **Note**: For complete project guidelines, see the main `AGENTS.md` at the project root. This file focuses specifically on writing process documentation blog posts.

## CRITICAL: Authorship and Voice Guidelines

**IMPORTANT**: Blog posts are written from **Joel's perspective** (first person "I" = Joel). AI agents must clearly distinguish their contributions.

### Main Narrative Sections
- **Written as if Joel is speaking** - Use first person "I" to refer to Joel
- **Voice**: Conversational, direct, practical, story-driven (see main AGENTS.md for full voice guidelines)
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

### Technical Details Sections

All technical implementation details must be in a clearly marked section at the bottom:

```markdown
---

## Technical Details (Written by [Agent Name])

**Agent**: [Agent Name]
**Purpose**: Reference documentation for technical implementation details

[Technical content here]
```

## Post Naming Convention

Use descriptive filenames: `YYYY-MM-DD-feature-name.md`

Examples:
- `2026-01-06-01-planning-joelvarty-com.md`
- `2026-01-06-02-phase-1-cursor`
- `2026-01-06-03-blogpost-model-challenges.md`

## Writing Style

- **Narrative style** - Write as blog posts, not just technical notes
- **Include context** - Explain what was built, how, and why
- **Document challenges** - Include problems encountered and solutions
- **Add screenshots** - Visual documentation in `images/` subfolder
- **Update as you go** - Don't wait until the end, document as work progresses
- **Joel's voice** - Conversational, direct, practical, story-driven

## Blog Post Template

```markdown
# [Feature Name] - [Date]

**Date**: [Date]
**Phase**: [Phase Name]
**Status**: [Status]

> **Note**: This post is written from Joel's perspective (first person "I" = Joel).
> Technical details sections are clearly marked as written by the AI agent ([Agent Name]).

## Overview
Brief description of what was built/implemented (written as if Joel is speaking).

## What We Built
Detailed description of the feature (written from Joel's perspective).

Example: "I started by running `create-next-agility-app`. The AI agent helped me set up ShadCN UI with the 'new-york' style."

## Implementation Details
- Technical approach
- Components used
- MCP operations (if applicable)

## Screenshots
![Description](images/YYYY-MM-DD-feature-name-1.png)

## Challenges & Solutions
Any issues encountered and how they were resolved (written from Joel's perspective).

Example: "The agent ran into issues with LinkedContent field configuration. I manually fixed it in the Agility CMS UI."

## Joel's Thoughts / Reflections
_[Space for Joel to add personal thoughts, reactions, design decisions, or creative direction]_

## Next Steps
What comes next or what needs to be done.

---

## Technical Details (Written by [Agent Name])

**Agent**: [Agent Name]
**Purpose**: Reference documentation for technical implementation details

[All technical implementation details, code examples, and specific technical information goes here]
```

## Key Principles

1. **Main narrative = Joel's voice** - First person "I" always refers to Joel
2. **Agent work = Third person** - Refer to "the agent" or "the AI agent"
3. **Technical details = Separate section** - Clearly marked as written by the agent
4. **Collaborative** - Leave space for Joel to add thoughts and reflections
5. **Story-driven** - Tell the story of building, not just list features

## When to Create a New Post

Create a new blog post for:
- ✅ Significant milestones (completing a phase, major feature)
- ✅ Important decisions or changes in approach
- ✅ Challenges encountered and how they were solved
- ✅ Learning moments (like the BlogPost model setup)
- ✅ Major technical implementations

Update existing posts when:
- ✅ Iterating on features already documented
- ✅ Adding new information to existing topics
- ✅ Correcting or clarifying previous content

## Screenshots

- Save screenshots in `images/` subfolder
- Use descriptive filenames: `YYYY-MM-DD-feature-name-1.png`
- Reference in markdown: `![Description](images/filename.png)`

---

**For complete project guidelines**: See the main `AGENTS.md` at the project root.

