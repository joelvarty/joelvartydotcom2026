# Localization (i18n)

This document explains how to implement multi-language support in your Agility CMS Next.js application.

## Locale Configuration

Locales are configured in `src/lib/i18n/config.ts`:

```typescript
export const defaultLocale = "en-us"
export const locales = ["en-us", "fr", "es"] as const

export type Locale = (typeof locales)[number]

export function isValidLocale(locale: string, locales: readonly string[]): boolean {
  return locales.includes(locale)
}

export function getLocaleFromPathname(
  pathname: string,
  locales: readonly string[]
): string | null {
  const segments = pathname.split("/").filter(Boolean)
  const firstSegment = segments[0]
  return firstSegment && locales.includes(firstSegment) ? firstSegment : null
}

export function removeLocaleFromPathname(
  pathname: string,
  locale: string
): string {
  if (pathname.startsWith(`/${locale}`)) {
    return pathname.slice(`/${locale}`.length) || "/"
  }
  return pathname
}
```

## URL Structure

### Default Locale (Clean URLs)
The default locale doesn't appear in URLs:
```
/                    → en-us homepage
/about               → en-us about page
/blog/my-post        → en-us blog post
```

### Other Locales (Prefixed)
Other locales have a prefix:
```
/fr                  → French homepage
/fr/a-propos         → French about page
/es/blog/mi-post     → Spanish blog post
```

## Environment Configuration

Configure locales in `.env.local`:

```env
AGILITY_LOCALES=en-us,fr,es
```

## Adding a New Locale

### Step 1: Update Configuration

1. Add to environment variable:
```env
AGILITY_LOCALES=en-us,fr,es,de
```

2. Update config file:
```typescript
// src/lib/i18n/config.ts
export const locales = ["en-us", "fr", "es", "de"] as const
```

### Step 2: Add Content in Agility CMS

1. Go to **Settings > Locales**
2. Add the new locale (e.g., "de" - German)
3. Add content for all pages and modules in the new locale

### Step 3: Rebuild

```bash
npm run build
```

All pages will be generated for the new locale.

## Locale Detection and Routing

The proxy handles locale routing:

```typescript
// proxy.ts

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const hasLocalePrefix = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // If no locale prefix, rewrite to default locale
  if (!hasLocalePrefix) {
    const localeBasedUrl = new URL(`/${defaultLocale}${pathname}`, request.url)
    return NextResponse.rewrite(localeBasedUrl)
  }
}
```

### Lang Query Parameter

You can switch locales using `?lang=` parameter:

```
/about?lang=fr     → Redirects to /fr/about
/fr/about?lang=es  → Redirects to /es/about
/about?lang=en-us  → Redirects to /about (default locale)
```

## Fetching Localized Content

### In Page Components

```tsx
// app/[locale]/[...slug]/page.tsx

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  const agilityData = await getAgilityPage({ params });

  // Data is automatically fetched for the current locale
  return <div>{/* ... */}</div>;
}
```

### In Module Components

```tsx
// components/agility-components/PostListing.tsx

import { getContentList } from "@/lib/cms/getContentList";

export default async function PostListing({ module, locale }: any) {
  // Always pass locale to CMS functions
  const posts = await getContentList({
    referenceName: "posts",
    locale, // Current locale from props
    take: 10,
  });

  return <div>{/* ... */}</div>;
}
```

### Manual Locale Selection

```tsx
import { getContentItem } from "@/lib/cms/getContentItem";

// Fetch content in specific locale
const frenchPost = await getContentItem({
  contentID: 123,
  locale: "fr",
});

const spanishPost = await getContentItem({
  contentID: 123,
  locale: "es",
});
```

## Locale Switcher Component

### Simple Locale Switcher

```tsx
// components/LocaleSwitcher.tsx

import { locales, defaultLocale } from "@/lib/i18n/config";

interface LocaleSwitcherProps {
  currentLocale: string;
  currentPath: string;
}

export default function LocaleSwitcher({
  currentLocale,
  currentPath,
}: LocaleSwitcherProps) {
  return (
    <div className="flex gap-2">
      {locales.map((locale) => {
        // Build the locale-specific URL
        let href = currentPath;
        if (locale === defaultLocale) {
          // Remove locale prefix for default locale
          href = currentPath.replace(/^\/[a-z]{2}(-[a-z]{2})?/, "") || "/";
        } else {
          // Add or replace locale prefix
          href = currentPath.replace(/^\/[a-z]{2}(-[a-z]{2})?/, "");
          href = `/${locale}${href}`;
        }

        return (
          <a
            key={locale}
            href={href}
            className={locale === currentLocale ? "font-bold" : ""}
          >
            {locale.toUpperCase()}
          </a>
        );
      })}
    </div>
  );
}
```

### Using in Layout

```tsx
// app/[locale]/layout.tsx

import LocaleSwitcher from "@/components/LocaleSwitcher";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html lang={locale}>
      <body>
        <header>
          <LocaleSwitcher currentLocale={locale} currentPath="/" />
        </header>
        {children}
      </body>
    </html>
  );
}
```

## Translation Helpers

### Creating Translation Files

```typescript
// lib/i18n/translations.ts

export const translations = {
  "en-us": {
    nav: {
      home: "Home",
      about: "About",
      contact: "Contact",
    },
    common: {
      readMore: "Read More",
      loadMore: "Load More",
      backToHome: "Back to Home",
    },
  },
  fr: {
    nav: {
      home: "Accueil",
      about: "À propos",
      contact: "Contact",
    },
    common: {
      readMore: "Lire la suite",
      loadMore: "Charger plus",
      backToHome: "Retour à l'accueil",
    },
  },
  es: {
    nav: {
      home: "Inicio",
      about: "Acerca de",
      contact: "Contacto",
    },
    common: {
      readMore: "Leer más",
      loadMore: "Cargar más",
      backToHome: "Volver al inicio",
    },
  },
} as const;

export function t(locale: string, key: string) {
  const keys = key.split(".");
  let value: any = translations[locale as keyof typeof translations];

  for (const k of keys) {
    value = value?.[k];
  }

  return value || key;
}
```

### Using Translations

```tsx
// components/Header.tsx

import { t } from "@/lib/i18n/translations";

export default function Header({ locale }: { locale: string }) {
  return (
    <nav>
      <a href="/">{t(locale, "nav.home")}</a>
      <a href="/about">{t(locale, "nav.about")}</a>
      <a href="/contact">{t(locale, "nav.contact")}</a>
    </nav>
  );
}
```

## Date and Number Formatting

### Date Formatting

```tsx
// lib/i18n/formatters.ts

export function formatDate(date: string, locale: string): string {
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
```

Usage:
```tsx
import { formatDate } from "@/lib/i18n/formatters";

export default function BlogPost({ post, locale }: any) {
  return (
    <article>
      <h1>{post.fields.title}</h1>
      <time>{formatDate(post.fields.date, locale)}</time>
      <div dangerouslySetInnerHTML={{ __html: post.fields.content }} />
    </article>
  );
}
```

### Number Formatting

```tsx
export function formatNumber(num: number, locale: string): string {
  return new Intl.NumberFormat(locale).format(num);
}

export function formatCurrency(
  amount: number,
  locale: string,
  currency: string = "USD"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}
```

## Locale-Specific Sitemap

Each locale has its own sitemap in Agility CMS:

```typescript
// Generate pages for each locale
export async function generateStaticParams() {
  const allPaths: { locale: string; slug: string[] }[] = [];

  for (const locale of locales) {
    const sitemap = await agilityClient.getSitemapFlat({
      channelName: "website",
      languageCode: locale,
    });

    const localePaths = Object.values(sitemap).map((node: any) => ({
      locale,
      slug: node.path.split("/").slice(1),
    }));

    allPaths.push(...localePaths);
  }

  return allPaths;
}
```

## SEO for Multi-Locale

### Alternate Language Links

```tsx
// app/[locale]/[...slug]/page.tsx

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const agilityData = await getAgilityPage({ params });

  const alternates: Record<string, string> = {};

  for (const loc of locales) {
    if (loc === defaultLocale) {
      alternates[loc] = `https://yourdomain.com${agilityData.sitemapNode.path}`;
    } else {
      alternates[loc] = `https://yourdomain.com/${loc}${agilityData.sitemapNode.path}`;
    }
  }

  return {
    title: agilityData.page?.seo?.metaTitle,
    description: agilityData.page?.seo?.metaDescription,
    alternates: {
      languages: alternates,
    },
  };
}
```

### Sitemap.xml with Locales

```tsx
// app/sitemap.ts

import { locales, defaultLocale } from "@/lib/i18n/config";
import { getSitemapFlat } from "@/lib/cms/getSitemapFlat";

export default async function sitemap() {
  const urls = [];

  for (const locale of locales) {
    const sitemap = await getSitemapFlat({ locale });

    for (const path in sitemap) {
      const url =
        locale === defaultLocale
          ? `https://yourdomain.com${path}`
          : `https://yourdomain.com/${locale}${path}`;

      urls.push({
        url,
        lastModified: new Date(),
        alternates: {
          languages: locales.reduce((acc, loc) => {
            acc[loc] =
              loc === defaultLocale
                ? `https://yourdomain.com${path}`
                : `https://yourdomain.com/${loc}${path}`;
            return acc;
          }, {} as Record<string, string>),
        },
      });
    }
  }

  return urls;
}
```

## Right-to-Left (RTL) Support

For RTL languages like Arabic:

```tsx
// app/[locale]/layout.tsx

const rtlLocales = ["ar", "he"];

export default function LocaleLayout({ children, params }: any) {
  const { locale } = params;
  const dir = rtlLocales.includes(locale) ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <body>{children}</body>
    </html>
  );
}
```

## Best Practices

1. **Always Pass Locale**: Pass locale to all CMS functions
2. **Use Translation Keys**: Don't hardcode strings in components
3. **Format Dates/Numbers**: Use locale-specific formatting
4. **SEO Optimization**: Add alternate language links
5. **Test All Locales**: Ensure content exists for all locales
6. **Fallback Content**: Handle missing translations gracefully
7. **URL Structure**: Keep URLs SEO-friendly in each locale

## Common Patterns

### Pattern 1: Locale-Aware Navigation

```tsx
import { getSitemapNested } from "@/lib/cms/getSitemapNested";

export default async function Navigation({ locale }: { locale: string }) {
  const sitemap = await getSitemapNested({ locale });

  return (
    <nav>
      {sitemap[0].children.map((item: any) => (
        <a key={item.pageID} href={item.path}>
          {item.menuText || item.title}
        </a>
      ))}
    </nav>
  );
}
```

### Pattern 2: Locale-Specific Footer

```tsx
import { getContentItem } from "@/lib/cms/getContentItem";

export default async function Footer({ locale }: { locale: string }) {
  const footer = await getContentItem({
    referenceName: "footerSettings",
    locale,
  });

  return (
    <footer>
      <p>{footer.fields.copyrightText}</p>
      <nav>
        {footer.fields.links.map((link: any) => (
          <a key={link.href} href={link.href}>
            {link.text}
          </a>
        ))}
      </nav>
    </footer>
  );
}
```

## Next Steps

- Read [02-page-routing.md](./02-page-routing.md) for locale routing details
- Read [04-data-fetching.md](./04-data-fetching.md) for fetching localized content
- Read [07-caching-strategies.md](./07-caching-strategies.md) for locale-specific caching
