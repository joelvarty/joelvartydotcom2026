# Prompts Log

Chronological log of all prompts given to AI agents working on this project.

## Format

`[Date] [Agent] [Prompt] [Result/Notes]`

---

## 2025-01-27

### Prompt 1
**Agent**: Cursor (Claude Code)
**Prompt**: "my plan is in the @DEVELOPMENT-PLAN.md file - take a look and let me know if you need any other details in order to get started. Check the .env.local file to see what Aglity instance we are connected to"
**Result**: Reviewed plan, identified Agility instance (e9a21a52-u), created implementation plan for Phase 1
**Notes**: Confirmed using "Joel Varty Dot Com" instance, starting with Phase 1 completion

### Prompt 2
**Agent**: Cursor (Claude Code)
**Prompt**: "Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself. To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos."
**Result**: Completed Phase 1 setup, began Phase 2 content models
**Notes**: Completed ShadCN UI setup, created folder structure

---

## 2026-01-27

### Prompt 3
**Agent**: Cursor (Claude Code)
**Prompt**: "I also added the blog listing to the home page and the /blog page and added the blog detail component to the /blog/blog-details page"
**Result**: Updated process-docs to note that pages were created manually, confirmed BlogDetails component works with dynamic pages
**Notes**: User manually created blog pages in Agility CMS and added components

### Prompt 4
**Agent**: Cursor (Claude Code)
**Prompt**: "keep going - we will do all the testing later"
**Result**: Continued with Phase 4: Blog System implementation
**Notes**: Implemented markdown processing, gallery components, RSS feed, blog styling

### Prompt 5
**Agent**: Cursor (Claude Code)
**Prompt**: "don't forget to write the process-docs!!!"
**Result**: Created process-docs/2026-01-27-phase-4-blog-system.md documenting Phase 4 implementation
**Notes**: Documented blog system with gallery support, markdown processing, RSS feed

### Prompt 6
**Agent**: Cursor (Claude Code)
**Prompt**: "make sure you're documenting my prompts too!"
**Result**: Updated prompts-log.md with all recent prompts from this session
**Notes**: Documenting all user prompts for future reference

### Prompt 7
**Agent**: Cursor (Claude Code)
**Prompt**: "keep at it"
**Result**: Completed Phase 5 (About & Career), Phase 6 (Uses Page), updated components to use AgilityPic, documented both phases
**Notes**: Most components already existed, just needed polish. UsesItem model needs to be created in Agility CMS

### Prompt 8
**Agent**: Cursor (Claude Code)
**Prompt**: "keep going until you're done. don't wait for me. spin off sub agents to do work as well. don't forget to document stuff in process-docs"
**Result**: Completed Phase 8 (Styling & Polish), set up Phase 9 testing infrastructure (Playwright, Lighthouse CI), added animations, performance optimizations, metadata improvements, documented Phase 8
**Notes**: Added subtle animations with reduced motion support, performance optimizations in Next.js config, enhanced typography and dark mode, improved SEO metadata, created E2E test files, set up CI/CD workflows

### Prompt 9
**Agent**: Cursor (Claude Code)
**Prompt**: "we may have to create a bunch of content and pages in the CMS to do much more testing - what content do we need? Is that in the plan? If not, add it to the plan so we don't miss it. I want 3 categories and 5 tags for the blogs. I plan on writing about "3rd spaces", football, work, with tags of sports, theatre, coding, leadership"
**Result**: Updated DEVELOPMENT-PLAN.md with specific content requirements, created 3 categories and 4 tags in Agility CMS via MCP, documented testing content requirements
**Notes**: Created categories: "3rd spaces", "football", "work". Created tags: "sports", "theatre", "coding", "leadership" (user specified 5 tags but only listed 4, noted in docs). Updated plan with detailed content requirements for testing.

### Prompt 10
**Agent**: Cursor (Claude Code)
**Prompt**: "yes create some sample content everywhere so we can test everything"
**Result**: Created 5 blog posts, created 3 pages (/about, /career, /uses), documented content creation process. Career entries and UsesItem model failed via MCP and need manual creation.
**Notes**: Blog posts successfully created with proper category and tag linking. Pages created with Hero, Markdown, CareerTimeline, and UsesSection components. Career entries failed due to field validation issues. UsesItem model creation failed due to LinkedContentDropdown schema requirements. Documented manual steps needed.

---

**Last Updated**: 2026-01-27

