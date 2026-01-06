# Agility CMS Overview

This Next.js project is integrated with Agility CMS, a headless content management system. This document provides an overview of how Agility CMS works in this project.

## What is Agility CMS?

Agility CMS is a headless CMS that provides:
- **Content Management**: Create and manage content using a web-based interface
- **Page Management**: Build pages by combining components (called "modules" in CMS)
- **Multi-locale Support**: Manage content in multiple languages
- **API Access**: Fetch content via REST API or SDK
- **Preview Mode**: Preview draft content before publishing

## Key Concepts

### 1. Pages
Pages in Agility CMS are composed of:
- **Title and SEO**: Meta title, description, keywords
- **Template**: Defines the layout structure (e.g., MainTemplate, TwoColumnTemplate)
- **Zones**: Areas where components (modules) can be added (e.g., "main-content-zone", "sidebar")
- **Path**: The URL path for the page (e.g., `/about`, `/blog/post-1`)

### 2. Page Templates
Templates define the layout structure of a page. Each template has:
- **Named Zones**: ContentZone components where components (modules) are placed
- **Layout Structure**: Header, footer, sidebars, etc.
- **React Component**: A server component that renders the zones

Example: `MainTemplate.tsx` has a single zone called "main-content-zone"

### 3. Components (Called "Modules" in CMS)
**Components** (referred to as "modules" in the Agility CMS interface) are reusable building blocks that can be added to page zones:
- **Reference Name**: Unique identifier (e.g., "RichTextArea", "Hero", "PostListing")
- **Fields**: Content fields defined in Agility CMS
- **React Component**: The implementation that renders the component

**Note**: While these are called "modules" in the CMS, we refer to them as "components" in code to align with React terminology.

### 4. Content Items
Standalone content that can be:
- **Referenced by Components**: A component can reference a content item by ID or reference name
- **Listed in Collections**: Grouped content (e.g., blog posts, team members)
- **Shared Across Pages**: Reusable content (e.g., site settings, navigation)

### 5. Content Lists
Collections of content items:
- **Reference Name**: Identifier for the list (e.g., "posts", "testimonials")
- **Content Type**: Type of items in the list (e.g., "BlogPost", "Testimonial")
- **Pagination**: Support for paginated lists

## How This Project Works

### Data Flow
```
Agility CMS → API Fetch → Next.js Page → Page Template → Components
```

1. **User visits a page**: Next.js receives the request
2. **Middleware processes**: Handles preview, redirects, locale routing
3. **Page fetches data**: `getAgilityPage()` fetches page data from Agility CMS
4. **Template renders**: The appropriate page template component is selected
5. **Components render**: ContentZone renders each component in order
6. **Component receives data**: Each component receives its data and renders

### File Organization

```
src/
├── app/
│   └── [locale]/
│       └── [...slug]/
│           └── page.tsx          # Dynamic page route
├── components/
│   ├── agility-pages/            # Page templates
│   │   ├── index.ts              # Template registry
│   │   └── MainTemplate.tsx      # Main page template
│   └── agility-components/       # CMS components (called "modules" in CMS)
│       ├── index.ts              # Component registry
│       └── RichTextArea.tsx      # Example component
└── lib/
    └── cms/                      # CMS helper functions
        ├── getAgilitySDK.ts      # Initialize SDK
        ├── getAgilityPage.ts     # Fetch page data
        ├── getContentItem.ts     # Fetch single content
        ├── getContentList.ts     # Fetch content lists
        ├── getSitemapFlat.ts     # Fetch flat sitemap
        ├── getSitemapNested.ts   # Fetch nested sitemap
        └── getRedirections.ts    # Fetch redirects
```

## Environment Configuration

Required environment variables (in `.env.local`):

```env
# Agility Instance
AGILITY_GUID=your-instance-guid

# API Keys
AGILITY_API_FETCH_KEY=your-fetch-key         # Published content
AGILITY_API_PREVIEW_KEY=your-preview-key     # Draft content

# Security
AGILITY_SECURITY_KEY=your-security-key       # For webhooks

# Locale Settings
AGILITY_LOCALES=en-us                        # Comma-separated (e.g., "en-us,fr,es")
AGILITY_SITEMAP=website                      # Sitemap name

# Caching
AGILITY_FETCH_CACHE_DURATION=60              # Seconds
AGILITY_PATH_REVALIDATE_DURATION=60          # Seconds
```

## Preview Mode

To preview draft content:
1. Add `?agilitypreviewkey=your-preview-key` to any URL
2. The middleware redirects to `/api/preview`
3. A cookie is set to enable preview mode
4. All subsequent requests use the preview API key

To exit preview mode:
1. Add `?AgilityPreview=0` to any URL
2. The preview cookie is cleared

## Caching Strategy

The project uses Next.js caching with Agility CMS:

1. **Time-based Revalidation**: Pages revalidate every 60 seconds (configurable)
2. **Cache Tags**: Each piece of content has a tag (e.g., `agility-content-123-en-us`)
3. **On-demand Revalidation**: Webhook can revalidate specific content via `/api/revalidate`

## Next Steps

- Read [02-page-routing.md](./02-page-routing.md) to understand page routing
- Read [03-creating-components.md](./03-creating-components.md) to create new components
- Read [04-data-fetching.md](./04-data-fetching.md) to fetch content from Agility CMS
