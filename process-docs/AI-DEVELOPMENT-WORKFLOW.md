# AI-Assisted Development Workflow: A Real-World Case Study

**Date:** January 8, 2026
**Author:** Joel Varty
**Project:** joelvarty.com rebuild with Next.js 16, Agility CMS, and AI assistance

## Overview

This document explains the collaboration model between human developer (me) and AI agents (Cursor, then Claude Code) used to build this website. It serves as a practical guide for understanding what AI can and cannot do in modern web development, especially when working with headless CMS via MCP (Model Context Protocol).

## The Development Stack

- **Framework**: Next.js 16.1.1 (App Router, Turbopack)
- **CMS**: Agility CMS (headless)
- **AI Tools**:
  - Cursor (Phases 1-7)
  - Claude Code with MCP (Phases 8-10)
- **Key Innovation**: Agility CMS MCP Server

## The Collaboration Model

### What I (The Human) Do

#### 1. Strategic Decisions
- Choose technologies and architecture
- Define feature requirements
- Make UX/design decisions
- Prioritize what to build next

#### 2. CMS Content Modeling (Manual Work)
All content models, components, and containers are created manually in the Agility CMS UI:
- Define content structures (fields, types, validation)
- Create containers (shared lists, dynamic page lists)
- Set up page templates and sitemap structure
- Configure linked content relationships
- Create initial content items

**Why Manual?**: CMS modeling requires deep understanding of the content domain, editorial workflow, and business requirements. While agents can create models via MCP, I prefer to do this myself to ensure the structure matches my mental model.

#### 3. Content Creation
- Write blog posts
- Upload images and media
- Create category and tag taxonomies
- Populate content for testing

#### 4. Final Page Assembly
Some Agility UI operations that MCP cannot yet fully automate:
- Adding components to page zones
- Ordering components within zones
- Publishing pages

### What AI Agents Do

#### 1. Code Generation
**With MCP** (Claude Code):
```typescript
// Agent queries CMS directly
const models = await mcp__Agility-CMS__get_content_models({ instanceGuid: "..." })
const details = await mcp__Agility-CMS__get_content_model_details({
  instanceGuid: "...",
  modelID: 21
})

// Generates TypeScript interfaces that EXACTLY match CMS structure
interface BlogSeries {
  contentID: number
  fields: {
    title: string
    slug: string
    markdownSummary: string
  }
}
```

**Without MCP** (Traditional):
```typescript
// Agent reads documentation and guesses
interface BlogSeries {
  // Hope this is right!
  title?: string  // Is this required?
  slug?: string   // What's the exact field name?
  // Missing markdownSummary field entirely
}
```

#### 2. Component Implementation
- Create React server components
- Implement data fetching with proper types
- Handle edge cases (missing data, loading states)
- Apply styling with Tailwind
- Add proper TypeScript types

#### 3. Feature Integration
- Register components in component registry
- Update routing configuration
- Add helper functions
- Integrate with existing patterns

#### 4. Documentation
- Generate comprehensive process docs
- Document architectural decisions
- Create code examples
- Add inline code comments

#### 5. Testing & Iteration
- Test generated code
- Fix issues found during testing
- Refine based on my feedback
- Iterate on layout and design

## The MCP Advantage: A Concrete Example

### Series Feature Implementation

Here's how the Series feature was built, showing the clear division of labor:

#### Phase 1: I Set Up Content Models (Manual - 15 minutes)
In Agility CMS UI, I created:
1. **BlogSeries Model** (ID: 21)
   - title (Text, Required)
   - slug (Text, Required)
   - markdownSummary (Text, Required)

2. **BlogSeries Container** (ID: 26)
   - Type: Dynamic Page List
   - Reference Name: `BlogSeries`

3. **Updated BlogPost Model** (ID: 8)
   - Added seriesID (Integer, hidden)
   - Added series (LinkedContentDropdown → saves to seriesID)

4. **Sitemap Structure**
   - Created `/blog/series/` folder
   - Created `/blog/series/series-details` dynamic page
   - Configured dynamic page formulas

5. **Test Content**
   - Created "Building This Site" series (ID: 64)
   - Created test blog post linked to series (ID: 65)

**Total time**: About 15 minutes of clicking through Agility UI.

#### Phase 2: Agent Built Everything Else (AI - 1.5 hours)

**Step 1: Discovery via MCP**
```bash
# Agent inspected the live CMS
mcp__Agility-CMS__get_content_models({ instanceGuid: "e9a21a52-u" })
# → Found BlogSeries model (ID: 21)

mcp__Agility-CMS__get_content_model_details({
  instanceGuid: "e9a21a52-u",
  modelID: 21
})
# → Got exact field structure: title, slug, markdownSummary

mcp__Agility-CMS__get_containers({ instanceGuid: "e9a21a52-u" })
# → Found BlogSeries container (ID: 26, type: dynamic page list)
```

**Step 2: Code Generation**
Agent created:
- `getSeriesListing.ts` - Helper to fetch posts by seriesID
- `SeriesLanding.tsx` - Series landing page component
- `BlogSeries.tsx` - Sidebar widget to list all series
- `BlogPostItem.tsx` - Shared component for post rendering

**Step 3: CMS Component Creation via MCP**
```typescript
mcp__Agility-CMS__save_component_model({
  instanceGuid: "e9a21a52-u",
  model: {
    id: -1,  // New component
    displayName: "Series Landing",
    referenceName: "SeriesLanding",
    fields: [
      { type: "Text", name: "title", label: "Title (Optional)" },
      { type: "Integer", name: "numberOfPosts", label: "Number of Posts", defaultValue: 50 }
    ]
  }
})
```

**Step 4: Iteration Based on My Feedback**
- Changed layout from 1/3-2/3 to 50/50
- Aligned titles horizontally
- Made series link prominent above title
- Added metadata (category, tags) to blog post details

**Step 5: Documentation with Screenshots**
Agent:
- Navigated to the live site via Playwright MCP
- Captured screenshots of the feature
- Documented the implementation
- Updated process docs

#### Phase 3: I Finished Page Setup (Manual - 2 minutes)
In Agility UI:
1. Opened `/blog/series/series-details` page
2. Clicked "Add Component"
3. Selected "Series Landing"
4. Published

**Why manual?** Current MCP limitation - cannot add components to page zones yet.

## What Makes MCP Transformative

### Before MCP (Traditional AI Workflow)

```
User: "Add a series field to blog posts"
Agent: "I'll add a series field. What should I call it?"
User: "seriesID"
Agent: *generates code with field name 'seriesId'* (lowercase 'd')
User: "It's seriesID with capital D"
Agent: *fixes typo*
User: "Also it's an integer, not a string"
Agent: *fixes type*
User: "And there's a series dropdown field too"
Agent: "Oh, let me update that..."
```

Lots of back-and-forth. Agent is guessing.

### With MCP (Our Workflow)

```
User: "Add series support to the blog"
Agent: *queries CMS via MCP*
Agent: "I see you've added a BlogSeries model with seriesID (integer)
       and series (dropdown) fields. I'll generate matching code."
Agent: *generates correct code first try*
User: "Perfect!"
```

Zero back-and-forth about structure. Agent **knows** the reality.

## Current Limitations & Workarounds

### What Agents Still Cannot Do Well

1. **Content Strategy** - Deciding what content models make sense for the business
2. **UX Design** - Making subjective design decisions (though they can iterate based on feedback)
3. **Visual Design** - Choosing colors, layouts without specific direction
4. **Business Logic** - Understanding domain-specific rules without explanation
5. **Some CMS Operations** - Adding components to page zones (MCP limitation)

### Workarounds We Use

1. **CMS Modeling**: I do it manually (faster than explaining)
2. **Design Iteration**: I give specific feedback ("50/50 layout", "make series link prominent")
3. **Content Creation**: I write the content, agent handles the code
4. **Page Assembly**: Quick manual step in Agility UI after agent creates components

## Key Learnings

### 1. MCP Is a Game-Changer
Before: "Let me tell you about my CMS structure..."
After: "Just look at my CMS directly."

The reduction in back-and-forth is dramatic.

### 2. Clear Division of Labor Works
- Human: Strategy, content modeling, content creation, subjective decisions
- AI: Code generation, implementation, documentation, iteration

### 3. Documentation Is Still Critical
Even with MCP, agents benefit from:
- Development plan showing project architecture
- Process docs explaining past decisions
- Code comments explaining non-obvious logic

### 4. Agents Need Feedback, Not Instructions
Instead of: "Add this exact code..."
Better: "The series link should be more prominent"

Let the agent figure out HOW.

### 5. The Handoff Problem Is Solved
Switching from Cursor to Claude Code mid-project worked because:
- Comprehensive documentation provided context
- MCP let Claude inspect CMS directly
- Code itself was well-structured

## Time Savings

### Series Feature (Real Numbers)
- **Manual CMS Setup**: 15 minutes (me)
- **Code Generation**: 1.5 hours (agent)
- **Manual Page Assembly**: 2 minutes (me)
- **Total**: ~1.75 hours

**Without AI?** Probably 4-6 hours of coding, debugging, testing.

**Savings**: 2-4 hours per feature

**But More Importantly**: The code quality is high because the agent:
- Follows existing patterns
- Generates proper TypeScript types
- Handles edge cases
- Creates comprehensive documentation

## Best Practices

### For Working with AI + MCP

1. **Set up CMS first** - Do content modeling manually, let agent query it
2. **Give feedback, not instructions** - Say what you want, not how to do it
3. **Iterate freely** - Making changes is cheap with AI
4. **Trust but verify** - Agent code is usually correct, but always test
5. **Document as you go** - Helps the agent understand context

### For Content Modeling

1. **Model in CMS UI** - Faster than explaining to agent
2. **Use clear field names** - Agent will use exact names in code
3. **Create test content** - Helps agent verify implementation
4. **Think ahead** - Model structure drives code structure

### For Collaboration

1. **Be specific about UX** - "Make it prominent" is good
2. **Let agent handle details** - Don't micromanage implementation
3. **Provide context** - Explain the "why", not the "how"
4. **Iterate based on results** - See the output, then refine

## Conclusion

AI-assisted development with MCP represents a fundamental shift:
- **Agents become teammates**, not tools
- **Context comes from live systems**, not documentation
- **Iteration is the norm**, not the exception
- **Quality improves** through access to ground truth

The result: Faster development, fewer errors, better code.

But the human still drives:
- Strategic decisions
- Content strategy
- UX direction
- Quality standards

MCP doesn't replace developers. It amplifies them.

---

**This workflow built**: A complete Next.js 16 site with headless CMS, dynamic routing, 7 gallery types, series feature, markdown processing, and comprehensive documentation.

**Time**: ~2 weeks part-time

**AI Contribution**: ~70% of code, 100% of documentation

**Human Contribution**: 100% of strategy, content modeling, UX direction

**Result**: A production-ready site that showcases the power of human-AI collaboration.
