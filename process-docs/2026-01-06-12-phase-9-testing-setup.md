# Phase 9: Testing & QA Setup

**Date**: January 6, 2026
**Phase**: Phase 9 - Testing & QA
**Status**: Infrastructure Complete, Awaiting Content

> **Note**: This post is written from Joel's perspective (first person "I" = Joel). Technical details sections are clearly marked as written by the AI agent (Cursor - Claude Code).

I've set up the testing infrastructure, but we can't do full testing until we have content in the CMS. The agent created Playwright tests, Lighthouse CI configuration, and GitHub Actions workflows, but we'll need to populate content first to really test everything.

## What's Been Set Up

### Playwright E2E Tests
The agent created a full Playwright test suite with:
- Homepage tests (navigation, responsive design, dark mode)
- Accessibility tests (using @axe-core/playwright)
- Performance tests (Core Web Vitals, load times)
- Blog system tests (RSS feed, blog listing)

### Lighthouse CI
Set up Lighthouse CI with:
- Configuration for 100 score targets
- GitHub Actions workflow
- Performance assertions

### CI/CD Workflows
Created GitHub Actions workflows for:
- E2E tests on push/PR
- Lighthouse CI on main branch
- Test reports and artifacts

## What's Blocking Full Testing

We need content in Agility CMS to properly test:
- Blog posts (to test blog listing and detail pages)
- Career entries (to test career timeline)
- Uses items (to test uses page)
- Pages (/about, /career, /uses)

The categories and tags are created, so we're ready to add blog posts. Once we have content, we can run the full test suite and Lighthouse audits.

---

## Technical Details (Written by Cursor - Claude Code)

### Testing Infrastructure Created

**Playwright Configuration** (`playwright.config.ts`):
- Configured for multiple browsers (Chrome, Firefox, Safari)
- Mobile viewport testing (Pixel 5, iPhone 12)
- Automatic dev server startup
- HTML reporter for test results
- Screenshot on failure
- Trace collection on retry

**Test Files Created**:
1. `tests/e2e/homepage.spec.ts` - Homepage functionality tests
2. `tests/e2e/accessibility.spec.ts` - Accessibility audits using axe-core
3. `tests/e2e/performance.spec.ts` - Performance and Core Web Vitals tests
4. `tests/e2e/blog.spec.ts` - Blog system tests

**Lighthouse CI** (`.lighthouserc.js`):
- Configured for localhost:3000
- Multiple URL testing
- Assertions for 100 scores across all categories
- Core Web Vitals thresholds:
  - FCP < 1.8s
  - LCP < 2.5s
  - CLS < 0.1
  - TBT < 200ms

**GitHub Actions Workflows**:
1. `.github/workflows/test.yml` - E2E tests on push/PR
2. `.github/workflows/lighthouse.yml` - Lighthouse CI on main branch

**Vercel Configuration** (`vercel.json`):
- Security headers
- Cache control for RSS feed
- Framework detection

### Test Coverage

**Homepage Tests**:
- Page loads correctly
- Header and footer visible
- Navigation links work
- Mobile responsive (375x667 viewport)
- Dark mode toggle functional

**Accessibility Tests**:
- WCAG 2.1 AA compliance (using axe-core)
- Proper heading hierarchy
- All images have alt text
- All links have accessible names
- Keyboard navigation support
- Focus indicators visible

**Performance Tests**:
- Page load time < 3s
- First Contentful Paint < 1.8s
- Images optimized (AgilityPic or modern formats)
- Lazy loading for below-the-fold content

**Blog Tests**:
- Blog listing page loads
- RSS feed accessible and valid
- RSS feed has proper structure

### Dependencies Added

- `@playwright/test` - E2E testing framework
- `@axe-core/playwright` - Accessibility testing
- `@lhci/cli` - Lighthouse CI

### Scripts Added

- `npm test` - Run Playwright tests
- `npm run test:ui` - Run tests with UI mode
- `npm run test:debug` - Debug mode
- `npm run test:accessibility` - Run only accessibility tests
- `npm run test:performance` - Run only performance tests

### Testing Requirements

**For Full Testing, Need**:
- 3-5 blog posts (to test listing, detail pages, filtering)
- 2-3 career entries (to test timeline component)
- 5-10 uses items (to test uses page, categories)
- /about, /career, /uses pages created

**Current Status**:
- ✅ Categories created (3rd spaces, football, work)
- ✅ Tags created (sports, theatre, coding, leadership)
- ⏳ Blog posts needed
- ⏳ Career entries needed
- ⏳ Uses items needed
- ⏳ Pages needed

### Next Steps

1. Create sample blog posts in Agility CMS
2. Create career entries
3. Create uses items
4. Create /about, /career, /uses pages
5. Run full test suite: `npm test`
6. Run Lighthouse audit: `npx lhci autorun`
7. Fix any issues found
8. Repeat until 100 scores achieved

### Files Created

1. `playwright.config.ts` - Playwright configuration
2. `tests/e2e/homepage.spec.ts` - Homepage tests
3. `tests/e2e/accessibility.spec.ts` - Accessibility tests
4. `tests/e2e/performance.spec.ts` - Performance tests
5. `tests/e2e/blog.spec.ts` - Blog tests
6. `.lighthouserc.js` - Lighthouse CI configuration
7. `.github/workflows/test.yml` - E2E test workflow
8. `.github/workflows/lighthouse.yml` - Lighthouse CI workflow
9. `vercel.json` - Vercel deployment configuration

### Testing Strategy

**Local Testing**:
- Run `npm run dev` to start dev server
- Run `npm test` to execute all tests
- Run `npm run test:ui` for interactive test debugging

**CI Testing**:
- Tests run automatically on push/PR
- Lighthouse CI runs on main branch
- Test reports uploaded as artifacts

**Performance Targets**:
- Lighthouse Performance: 100
- Lighthouse Accessibility: 100
- Lighthouse Best Practices: 100
- Lighthouse SEO: 100
- FCP < 1.8s
- LCP < 2.5s
- CLS < 0.1
- TBT < 200ms

