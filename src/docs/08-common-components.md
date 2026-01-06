# Common Components and Patterns

This document provides ready-to-use component examples for common Agility CMS patterns.

## ⚠️ CRITICAL: Image Handling with AgilityPic

**ALL images from Agility CMS MUST be rendered using the `<AgilityPic>` component!**

### Why AgilityPic?

The `<AgilityPic>` component provides:
- **Automatic optimization**: Serves appropriately sized images
- **Responsive images**: Built-in support for different screen sizes
- **CMS integration**: Maintains compatibility with Agility's inline editing
- **Performance**: Lazy loading and modern image formats

### Basic Usage

```tsx
import { AgilityPic } from "@agility/nextjs";
import type { ImageField } from "@agility/nextjs";

interface MyComponentProps {
  module: {
    fields: {
      image: ImageField;  // Always use ImageField type
    };
  };
}

export default function MyComponent({ module }: MyComponentProps) {
  return (
    <AgilityPic
      image={module.fields.image}
      fallbackWidth={600}
      className="w-full h-auto"
      data-agility-field="image"
    />
  );
}
```

### Key Props

- **`image`** (required): The `ImageField` object from Agility CMS
- **`fallbackWidth`**: Width in pixels for fallback (default: 640)
- **`alt`**: Alt text override (uses CMS alt text by default)
- **`className`**: CSS classes for styling
- **`priority`**: Set `true` for above-the-fold images (loads eagerly)
- **`sources`**: Array of responsive sources with media queries
- **`data-agility-field`**: Field name for CMS inline editing

### Responsive Images Example

```tsx
<AgilityPic
  image={imageField}
  fallbackWidth={800}
  sources={[
    { media: "(max-width: 639px)", width: 640 },   // Mobile
    { media: "(max-width: 767px)", width: 800 },   // Tablet
    { media: "(max-width: 1023px)", width: 1200 }, // Desktop
  ]}
  className="w-full h-full object-cover"
/>
```

### ❌ WRONG - Don't Do This

```tsx
// ❌ NEVER use Next.js Image for Agility images
import Image from "next/image";
<Image src={imageField.url} alt="..." />

// ❌ NEVER use plain img tags for Agility images
<img src={imageField.url} alt="..." />
```

---

## Header Component

A reusable header with navigation from Agility CMS:

```tsx
// src/components/Header.tsx

import { getSitemapNested } from "@/lib/cms/getSitemapNested";
import LocaleSwitcher from "./LocaleSwitcher";

interface HeaderProps {
  locale: string;
}

export default async function Header({ locale }: HeaderProps) {
  const sitemap = await getSitemapNested({ locale });

  // Get top-level nav items (children of home)
  const navItems = sitemap[0]?.children || [];

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <a href="/" className="text-2xl font-bold">
          Your Site
        </a>

        <nav className="flex gap-6">
          {navItems.map((item: any) => (
            <a
              key={item.pageID}
              href={item.path}
              className="hover:text-blue-600"
            >
              {item.menuText || item.title}
            </a>
          ))}
        </nav>

        <LocaleSwitcher currentLocale={locale} />
      </div>
    </header>
  );
}
```

## Footer Component

```tsx
// src/components/Footer.tsx

import { getContentItem } from "@/lib/cms/getContentItem";

interface FooterProps {
  locale: string;
}

export default async function Footer({ locale }: FooterProps) {
  const footer = await getContentItem({
    referenceName: "footerSettings",
    locale,
  });

  if (!footer) return null;

  const { copyrightText, socialLinks, columns } = footer.fields;

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {columns?.map((column: any, index: number) => (
            <div key={index}>
              <h3 className="font-bold mb-4">{column.title}</h3>
              <ul className="space-y-2">
                {column.links?.map((link: any, i: number) => (
                  <li key={i}>
                    <a href={link.href} className="hover:text-gray-300">
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 flex justify-between items-center">
          <p>{copyrightText}</p>

          {socialLinks && (
            <div className="flex gap-4">
              {socialLinks.map((social: any, i: number) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-300"
                >
                  {social.text}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
```

## Hero Component

**IMPORTANT**: Always use `<AgilityPic>` for images from Agility CMS!

```tsx
// src/components/agility-components/Hero.tsx

import { AgilityPic } from "@agility/nextjs";
import type { ImageField, URLField } from "@agility/nextjs";

interface HeroProps {
  module: {
    fields: {
      title: string;
      subtitle: string;
      ctaButton?: URLField;
      backgroundImage?: ImageField;  // Use ImageField type
    };
  };
  locale: string;
}

export default function Hero({ module, locale }: HeroProps) {
  const { title, subtitle, ctaButton, backgroundImage } = module.fields;

  return (
    <section className="relative h-screen flex items-center justify-center text-white">
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          {/* ✅ CORRECT: Use AgilityPic for Agility CMS images */}
          <AgilityPic
            image={backgroundImage}
            fallbackWidth={1920}
            className="w-full h-full object-cover"
            priority={true}  // Above-the-fold image
            data-agility-field="backgroundImage"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
      )}

      <div className="relative z-10 text-center max-w-4xl px-4">
        <h1 className="text-6xl font-bold mb-6" data-agility-field="title">
          {title}
        </h1>
        <p className="text-2xl mb-8" data-agility-field="subtitle">
          {subtitle}
        </p>

        {ctaButton && (
          <a
            href={ctaButton.href}
            target={ctaButton.target}
            className="inline-block bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg text-lg font-semibold transition"
            data-agility-field="ctaButton"
          >
            {ctaButton.text}
          </a>
        )}
      </div>
    </section>
  );
}
```

## Blog Post Listing

**IMPORTANT**: Always use `<AgilityPic>` for post images with responsive sources!

```tsx
// src/components/agility-components/PostListing.tsx

import { getContentList } from "@/lib/cms/getContentList";
import { AgilityPic } from "@agility/nextjs";
import type { ImageField } from "@agility/nextjs";
import Link from "next/link";

interface Post {
  contentID: number;
  fields: {
    title: string;
    slug: string;
    date: string;
    excerpt: string;
    image?: ImageField;  // Use ImageField type
  };
}

interface PostListingProps {
  module: {
    fields: {
      title: string;
      numberOfPosts: number;
    };
  };
  locale: string;
  searchParams?: {
    page?: string;
  };
}

export default async function PostListing({
  module,
  locale,
  searchParams,
}: PostListingProps) {
  const { title, numberOfPosts } = module.fields;
  const page = parseInt(searchParams?.page || "1");
  const perPage = numberOfPosts || 9;

  const posts = await getContentList<Post>({
    referenceName: "posts",
    locale,
    take: perPage,
    skip: (page - 1) * perPage,
    sort: "fields.date desc",
  });

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center" data-agility-field="title">
          {title}
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.contentID}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              {/* ✅ CORRECT: Use AgilityPic with responsive sources */}
              {post.fields.image && (
                <AgilityPic
                  image={post.fields.image}
                  fallbackWidth={400}
                  className="w-full h-48 object-cover"
                  sources={[
                    { media: "(max-width: 639px)", width: 640 },
                    { media: "(max-width: 1023px)", width: 800 },
                  ]}
                />
              )}

              <div className="p-6">
                <time className="text-sm text-gray-600">
                  {new Date(post.fields.date).toLocaleDateString(locale)}
                </time>

                <h3 className="text-xl font-semibold mt-2 mb-3">
                  {post.fields.title}
                </h3>

                <p className="text-gray-600 mb-4">{post.fields.excerpt}</p>

                <Link
                  href={`/blog/${post.fields.slug}`}
                  className="text-blue-600 hover:underline"
                >
                  Read More →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination */}
        <nav className="flex justify-center gap-2 mt-12">
          {page > 1 && (
            <a
              href={`?page=${page - 1}`}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Previous
            </a>
          )}

          <span className="px-4 py-2">Page {page}</span>

          {posts.length === perPage && (
            <a
              href={`?page=${page + 1}`}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Next
            </a>
          )}
        </nav>
      </div>
    </section>
  );
}
```

## Contact Form

```tsx
// src/components/agility-components/ContactForm.server.tsx

import ContactFormClient from "./ContactForm.client";

interface ContactFormProps {
  module: {
    fields: {
      title: string;
      subtitle: string;
      submitButtonText: string;
    };
  };
}

export default function ContactForm({ module }: ContactFormProps) {
  const { title, subtitle, submitButtonText } = module.fields;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4">{title}</h2>
          <p className="text-xl text-gray-600">{subtitle}</p>
        </div>

        <ContactFormClient submitButtonText={submitButtonText} />
      </div>
    </section>
  );
}
```

```tsx
// src/components/agility-components/ContactForm.client.tsx
"use client";

import { useState } from "react";

export default function ContactFormClient({ submitButtonText }: any) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block font-semibold mb-2">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full p-3 border rounded"
        />
      </div>

      <div>
        <label htmlFor="email" className="block font-semibold mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="w-full p-3 border rounded"
        />
      </div>

      <div>
        <label htmlFor="message" className="block font-semibold mb-2">
          Message
        </label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
          rows={5}
          className="w-full p-3 border rounded"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400"
      >
        {status === "loading" ? "Sending..." : submitButtonText}
      </button>

      {status === "success" && (
        <p className="text-green-600 text-center">Message sent successfully!</p>
      )}
      {status === "error" && (
        <p className="text-red-600 text-center">Error sending message. Please try again.</p>
      )}
    </form>
  );
}
```

## FAQ Accordion

```tsx
// src/components/agility-components/FAQ.server.tsx

import { getContentList } from "@/lib/cms/getContentList";
import FAQClient from "./FAQ.client";

export default async function FAQ({ module, locale }: any) {
  const { title } = module.fields;

  const faqs = await getContentList({
    referenceName: "faqs",
    locale,
    sort: "fields.order asc",
  });

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-4xl font-bold mb-12 text-center">{title}</h2>
        <FAQClient faqs={faqs} />
      </div>
    </section>
  );
}
```

```tsx
// src/components/agility-components/FAQ.client.tsx
"use client";

import { useState } from "react";

export default function FAQClient({ faqs }: any) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {faqs.map((faq: any, index: number) => (
        <div key={faq.contentID} className="border rounded-lg">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50"
          >
            <span className="font-semibold text-lg">{faq.fields.question}</span>
            <span className="text-2xl">{openIndex === index ? "−" : "+"}</span>
          </button>

          {openIndex === index && (
            <div
              className="p-6 pt-0 text-gray-600"
              dangerouslySetInnerHTML={{ __html: faq.fields.answer }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
```

## Image Gallery

```tsx
// src/components/agility-components/ImageGallery.server.tsx

import { getContentList } from "@/lib/cms/getContentList";
import ImageGalleryClient from "./ImageGallery.client";

export default async function ImageGallery({ module, locale }: any) {
  const { title, gallery } = module.fields;

  const images = await getContentList({
    referenceName: gallery.referenceName,
    locale,
  });

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center">{title}</h2>
        <ImageGalleryClient images={images} />
      </div>
    </section>
  );
}
```

```tsx
// src/components/agility-components/ImageGallery.client.tsx
"use client";

import { useState } from "react";

export default function ImageGalleryClient({ images }: any) {
  const [selectedImage, setSelectedImage] = useState<any>(null);

  return (
    <>
      <div className="grid md:grid-cols-4 gap-4">
        {images.map((image: any) => (
          <button
            key={image.contentID}
            onClick={() => setSelectedImage(image)}
            className="aspect-square overflow-hidden rounded-lg hover:opacity-75 transition"
          >
            <img
              src={image.fields.image.url}
              alt={image.fields.image.label}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>
          <img
            src={selectedImage.fields.image.url}
            alt={selectedImage.fields.image.label}
            className="max-w-full max-h-full"
          />
        </div>
      )}
    </>
  );
}
```

## Testimonial Slider

```tsx
// src/components/agility-components/Testimonials.server.tsx

import { getContentList } from "@/lib/cms/getContentList";
import TestimonialsClient from "./Testimonials.client";

export default async function Testimonials({ module, locale }: any) {
  const { title } = module.fields;

  const testimonials = await getContentList({
    referenceName: "testimonials",
    locale,
  });

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center">{title}</h2>
        <TestimonialsClient testimonials={testimonials} />
      </div>
    </section>
  );
}
```

```tsx
// src/components/agility-components/Testimonials.client.tsx
"use client";

import { useState, useEffect } from "react";

export default function TestimonialsClient({ testimonials }: any) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((i) => (i + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const testimonial = testimonials[current];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center">
        <p className="text-2xl italic mb-6">"{testimonial.fields.quote}"</p>

        <div className="flex items-center justify-center gap-4">
          {testimonial.fields.photo && (
            <img
              src={testimonial.fields.photo.url}
              alt={testimonial.fields.name}
              className="w-16 h-16 rounded-full"
            />
          )}
          <div className="text-left">
            <p className="font-semibold">{testimonial.fields.name}</p>
            <p className="text-gray-600">{testimonial.fields.company}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_: any, index: number) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition ${
              index === current ? "bg-blue-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
```

## Best Practices

1. **Server Components**: Use for data fetching (default)
2. **Client Components**: Use for interactivity only
3. **Hybrid Pattern**: Server fetches, client renders interactive parts
4. **Type Safety**: Define interfaces for props
5. **Accessibility**: Use semantic HTML and ARIA labels
6. **Responsive**: Use Tailwind responsive classes
7. **Loading States**: Show loading indicators for async actions

## Next Steps

- Read [03-creating-components.md](./03-creating-components.md) for module creation
- Read [09-example-components.md](./09-example-components.md) for more examples
- Read [04-data-fetching.md](./04-data-fetching.md) for data patterns
