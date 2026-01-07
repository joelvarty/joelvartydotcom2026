# Manual CMS Setup Guide

**Date**: January 6, 2026
**Status**: Remaining Manual Steps Only

This document lists what still needs to be created manually in Agility CMS.

**Already Completed** ✅:
- Blog posts (5 created)
- Categories (3 created: 3rd spaces, football, work)
- Tags (4 created: sports, theatre, coding, leadership)
- Career entries (6 created: all positions from LinkedIn profile)
- UsesItem content model (ID: 20) - created with text field for category
- UsesItems container (ID: 16) - created
- Uses items (10 created: VS Code, Next.js, Agility CMS, TypeScript, GitHub, MacBook Pro, Tailwind CSS, Vercel, Cursor, Playwright)

---

## 1. Pages

**Location**: Pages → Create New Page

### Page 1: /about

1. **Page Details**:
   - **Name**: `about`
   - **Title**: `About`
   - **Menu Text**: `About`
   - **Page Model**: Select `Main`
   - **Parent Page**: Select `home` (the root page)

2. **Content Zones** → `main` zone:
   - Add **Hero** component:
     - Title: `About Me`
     - Subtitle: `I'm a software engineer, theatre enthusiast, and football fan. This is my corner of the internet where I write about work, life, and the things that interest me.`

   - Add **Basic Markdown** component:
     - Markdown (paste this):
```
# Hi, I'm Joel

I'm a software engineer with a background in theatre and a passion for football. I love building things, solving problems, and connecting with people.

## What I Do

I build web applications using modern technologies like React, Next.js, and TypeScript. I'm passionate about creating great user experiences and writing clean, maintainable code.

## Beyond Code

When I'm not coding, you'll find me:
- Watching football (the beautiful game)
- Exploring third spaces in my city
- Thinking about leadership and team dynamics
- Writing about the intersection of tech, theatre, and life

## Why This Site

This site is a place for me to share my thoughts, document my work, and connect with others who share similar interests. It's built with Next.js, Agility CMS, and a focus on performance and simplicity.

## My Career

Want to learn more about my professional journey? Check out my [career timeline](/career).
```

**Save and publish the page.**

---

### Page 2: /career

1. **Page Details**:
   - **Name**: `career`
   - **Title**: `Career`
   - **Menu Text**: `Career`
   - **Page Model**: Select `Main`
   - **Parent Page**: Select `home` (the root page)

2. **Content Zones** → `main` zone:
   - Add **Hero** component:
     - Title: `My Career`
     - Subtitle: `A timeline of my professional journey`

   - Add **Career Timeline** component:
     - Title: `Career Timeline`
     - Container Reference Name: `CareerEntries`

**Save and publish the page.**

---

### Page 3: /uses

1. **Page Details**:
   - **Name**: `uses`
   - **Title**: `Uses`
   - **Menu Text**: `Uses`
   - **Page Model**: Select `Main`
   - **Parent Page**: Select `home` (the root page)

2. **Content Zones** → `main` zone:
   - Add **Hero** component:
     - Title: `What I Use`
     - Subtitle: `The tools, software, and hardware I use in my work and daily life`

   - Add **Uses Section** component:
     - Title: `My Setup`
     - Container Reference Name: `UsesItems`

**Save and publish the page.**

---

## Summary Checklist

- [x] Create UsesItem content model with all required fields ✅ (Done via MCP)
- [x] Create UsesItems container (List, Shared) ✅ (Done via MCP)
- [x] Create 5-10 Uses Items in UsesItems container ✅ (10 items created via MCP)
- [x] Create /about page with Hero and Markdown components (with link to career page)
- [x] Create /career page with Hero and CareerTimeline components
- [x] Create /uses page with Hero and UsesSection components
- [ ] Publish all pages
- [ ] Test all pages on the site

---

## Notes

- **Career Entries**: ✅ Already created (6 entries via MCP)
- **Blog Posts**: ✅ Already created (5 posts via MCP)
- **Categories**: ✅ Already created (3 categories via MCP)
- **Tags**: ✅ Already created (4 tags via MCP)
- **UsesItem Model**: ✅ Already created (ID: 20) with simple text field for category
- **UsesItems Container**: ✅ Already created (ID: 16)
- **Uses Items**: ✅ Already created (10 items via MCP: VS Code, Next.js, Agility CMS, TypeScript, GitHub, MacBook Pro, Tailwind CSS, Vercel, Cursor, Playwright)
- **Pages**: Use the "Main" page model that already exists
- **Components**: All components (Hero, BasicMarkdown, CareerTimeline, UsesSection) already exist
- **Category Field**: Simple text field - items are grouped by category text (Software, Hardware, Tools)

---

**Once all items are created, you can test:**
- Blog listing and detail pages ✅ (already have content)
- Category and tag filtering ✅ (already have content)
- RSS feed ✅ (already have content)
- Career timeline ✅ (already have content)
- Uses page ✅ (already have content - 10 items created)
- All navigation (needs pages)
- E2E tests
- Lighthouse audit
