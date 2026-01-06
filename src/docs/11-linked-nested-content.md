# Linked and Nested Content in Agility CMS

This document explains the different types of linked and nested content in Agility CMS and how to properly fetch and work with each type.

## Understanding Content Relationships

Agility CMS supports several types of content relationships. Understanding which type you're working with is **CRITICAL** for correct data fetching.

### The Two Main Types

1. **Auto-Populated Linked Content** (Single Item Links)
2. **Reference-Based Nested Content** (Content Lists/Grids)

## Type 1: Auto-Populated Linked Content

### What is it?

When you use these Agility field types, the linked content is **automatically populated** by the SDK:
- **Content Link** (Single item selector)
- **Dropdown** (Single item from list)
- **Checkbox** (Multiple items from list)
- **Search List Box** (Searchable single/multiple item selector)

### Key Characteristic

The field contains the **complete content item** with all fields, not just a reference.

### How to Use

**NO separate fetch needed!** The data is already there.

```tsx
import type { ContentItem } from "@agility/nextjs";

interface Author {
  name: string;
  bio: string;
  avatar: ImageField;
}

interface BlogPost {
  title: string;
  content: string;
  author: ContentItem<Author>;  // ✅ Complete author object
  category: ContentItem<Category>;  // ✅ Complete category object
}

export default async function BlogPost({ module, locale }: any) {
  const { fields: { title, content, author, category } } = module;

  return (
    <article>
      <h1>{title}</h1>

      {/* ✅ CORRECT: Access linked content directly */}
      {author && (
        <div className="author">
          <img src={author.fields.avatar.url} alt={author.fields.name} />
          <span>{author.fields.name}</span>
        </div>
      )}

      {/* ✅ CORRECT: No fetch needed */}
      {category && (
        <span className="badge">{category.fields.name}</span>
      )}

      <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
}
```

### Common Mistake

```tsx
// ❌ WRONG: Don't fetch content that's already populated
const author = await getContentItem({
  contentID: post.fields.author.contentID,  // Unnecessary!
  locale,
});

// ✅ CORRECT: Use it directly
const authorName = post.fields.author.fields.name;
```

## Type 2: Reference-Based Nested Content

### What is it?

When you use these Agility field types, you get a **reference** that you must fetch separately:
- **Linked Content** (Grid/list of items)
- **Content Link (Multi)** (Multiple content items)

### Key Characteristic

The field contains a **referencename** property that points to a content list, NOT the actual content.

### Critical Pattern

**You MUST fetch the content separately using the `referencename`.**

```tsx
import { getContentItem } from "@/lib/cms/getContentItem";
import { getContentList } from "@/lib/cms/getContentList";

interface BentoSection {
  heading: string;
  cards: {
    referencename: string;  // ⚠️ Just a reference, not the actual content!
  };
}

export default async function BentoSection({ module, locale }: any) {
  // Step 1: Get the module fields
  const { fields: { heading, cards } } = await getContentItem<BentoSection>({
    contentID: module.contentid,
    languageCode: locale,
  });

  // Step 2: Fetch the nested content using the reference name
  const cardItems = await getContentList({
    referenceName: cards.referencename,  // ✅ CRITICAL: Use referencename
    languageCode: locale,
    take: 20,
  });

  return (
    <section>
      <h2>{heading}</h2>
      <div className="grid grid-cols-3 gap-4">
        {cardItems.map((card) => (
          <div key={card.contentID}>
            <h3>{card.fields.title}</h3>
            <p>{card.fields.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

### Common Mistakes

```tsx
// ❌ WRONG: Trying to access fields directly
<div>{cards.fields.title}</div>  // This won't work!

// ❌ WRONG: Using contentID instead of referencename
const items = await getContentList({
  referenceName: cards.contentID,  // Wrong property!
  locale,
});

// ✅ CORRECT: Fetch using referencename
const items = await getContentList({
  referenceName: cards.referencename,  // Correct!
  locale,
});
```

## How to Tell Which Type You Have

### Method 1: Check the Field Type in Agility CMS

| Field Type | Populated? | How to Access |
|------------|-----------|---------------|
| Content Link (Single) | ✅ Yes | `field.fields.xxx` |
| Dropdown | ✅ Yes | `field.fields.xxx` |
| Checkbox | ✅ Yes | `field.fields.xxx` |
| Search List Box | ✅ Yes | `field.fields.xxx` |
| **Linked Content (Grid)** | ❌ No | `await getContentList({ referenceName: field.referencename })` |
| **Content Link (Multi)** | ❌ No | `await getContentList({ referenceName: field.referencename })` |

### Method 2: Inspect the Data Structure

```tsx
// Auto-populated linked content has 'fields'
if (module.fields.author?.fields) {
  // ✅ Auto-populated - use directly
  console.log(module.fields.author.fields.name);
}

// Reference-based content has 'referencename'
if (module.fields.cards?.referencename) {
  // ⚠️ Reference-based - must fetch separately
  const items = await getContentList({
    referenceName: module.fields.cards.referencename,
    locale,
  });
}
```

## Real-World Examples

### Example 1: Blog Post with Auto-Populated Links

```tsx
import { AgilityPic } from "@agility/nextjs";
import type { ContentItem, ImageField } from "@agility/nextjs";

interface Category {
  name: string;
  slug: string;
  color: string;
}

interface Author {
  name: string;
  bio: string;
  avatar: ImageField;
}

interface Tag {
  name: string;
  slug: string;
}

interface BlogPost {
  title: string;
  content: string;
  image: ImageField;
  author: ContentItem<Author>;  // Auto-populated
  category: ContentItem<Category>;  // Auto-populated
  tags: ContentItem<Tag>[];  // Auto-populated array
}

export default async function BlogPostDetail({ module, locale }: any) {
  const { fields } = module as { fields: BlogPost };

  return (
    <article>
      <header>
        <h1>{fields.title}</h1>

        {/* ✅ Category is auto-populated */}
        {fields.category && (
          <span
            className="badge"
            style={{ backgroundColor: fields.category.fields.color }}
          >
            {fields.category.fields.name}
          </span>
        )}

        {/* ✅ Author is auto-populated */}
        {fields.author && (
          <div className="author-info">
            <AgilityPic
              image={fields.author.fields.avatar}
              fallbackWidth={48}
              className="rounded-full"
            />
            <div>
              <p className="font-bold">{fields.author.fields.name}</p>
              <p className="text-sm">{fields.author.fields.bio}</p>
            </div>
          </div>
        )}
      </header>

      <AgilityPic
        image={fields.image}
        fallbackWidth={1200}
        className="w-full"
      />

      <div dangerouslySetInnerHTML={{ __html: fields.content }} />

      {/* ✅ Tags are auto-populated array */}
      {fields.tags && fields.tags.length > 0 && (
        <footer className="flex gap-2">
          {fields.tags.map((tag) => (
            <a
              key={tag.contentID}
              href={`/tags/${tag.fields.slug}`}
              className="tag"
            >
              {tag.fields.name}
            </a>
          ))}
        </footer>
      )}
    </article>
  );
}
```

### Example 2: Testimonials Grid with Reference-Based Content

```tsx
import { getContentItem } from "@/lib/cms/getContentItem";
import { getContentList } from "@/lib/cms/getContentList";
import { AgilityPic } from "@agility/nextjs";
import type { ImageField } from "@agility/nextjs";

interface TestimonialsModule {
  heading: string;
  subheading: string;
  testimonials: {
    referencename: string;  // Reference, not actual content
  };
}

interface Testimonial {
  quote: string;
  name: string;
  company: string;
  avatar: ImageField;
  rating: number;
}

export default async function TestimonialsGrid({ module, locale }: any) {
  // Step 1: Get module configuration
  const { fields } = await getContentItem<TestimonialsModule>({
    contentID: module.contentid,
    languageCode: locale,
  });

  // Step 2: Fetch the actual testimonials using the reference
  const testimonials = await getContentList<Testimonial>({
    referenceName: fields.testimonials.referencename,
    languageCode: locale,
    take: 12,
  });

  return (
    <section>
      <div className="text-center mb-12">
        <h2>{fields.heading}</h2>
        <p>{fields.subheading}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial.contentID} className="testimonial-card">
            <div className="flex items-center gap-3 mb-4">
              <AgilityPic
                image={testimonial.fields.avatar}
                fallbackWidth={64}
                className="rounded-full"
              />
              <div>
                <p className="font-bold">{testimonial.fields.name}</p>
                <p className="text-sm">{testimonial.fields.company}</p>
              </div>
            </div>
            <p className="italic">"{testimonial.fields.quote}"</p>
            <div className="stars">
              {"★".repeat(testimonial.fields.rating)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

### Example 3: Mixed - Both Types in One Component

```tsx
import { getContentItem } from "@/lib/cms/getContentItem";
import { getContentList } from "@/lib/cms/getContentList";
import type { ContentItem, ImageField } from "@agility/nextjs";

interface FeaturedSection {
  title: string;
  featuredPost: ContentItem<BlogPost>;  // Auto-populated single item
  relatedPosts: {
    referencename: string;  // Reference to list
  };
}

interface BlogPost {
  title: string;
  excerpt: string;
  image: ImageField;
  slug: string;
}

export default async function FeaturedSection({ module, locale }: any) {
  // Get module data
  const { fields } = await getContentItem<FeaturedSection>({
    contentID: module.contentid,
    languageCode: locale,
  });

  // Fetch the referenced list
  const relatedPosts = await getContentList<BlogPost>({
    referenceName: fields.relatedPosts.referencename,
    languageCode: locale,
    take: 3,
  });

  return (
    <section>
      <h2>{fields.title}</h2>

      {/* ✅ Featured post is auto-populated - use directly */}
      {fields.featuredPost && (
        <div className="featured-post">
          <h3>{fields.featuredPost.fields.title}</h3>
          <p>{fields.featuredPost.fields.excerpt}</p>
          <a href={`/blog/${fields.featuredPost.fields.slug}`}>Read more</a>
        </div>
      )}

      {/* ⚠️ Related posts were fetched separately */}
      <div className="grid grid-cols-3 gap-4">
        {relatedPosts.map((post) => (
          <article key={post.contentID}>
            <h4>{post.fields.title}</h4>
            <p>{post.fields.excerpt}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
```

## TypeScript Typing Best Practices

### For Auto-Populated Content

```tsx
import type { ContentItem } from "@agility/nextjs";

interface Author {
  name: string;
  email: string;
}

interface MyModule {
  title: string;
  author: ContentItem<Author>;  // Type the linked content
}
```

### For Reference-Based Content

```tsx
interface MyModule {
  title: string;
  items: {
    referencename: string;  // This is just a string reference
    sortids?: string;
  };
}
```

## Performance Considerations

### Auto-Populated Content

**Pros:**
- Single API call - already included
- No additional fetch latency
- Simpler code

**Cons:**
- Included even if you don't need it
- Can increase payload size

### Reference-Based Content

**Pros:**
- Flexible - fetch only when needed
- Can control what data is fetched
- Can add filters, sorts, pagination

**Cons:**
- Additional API call required
- Slightly more complex code
- Must remember to fetch

### Parallel Fetching for Multiple References

```tsx
export default async function Dashboard({ module, locale }: any) {
  const { fields } = await getContentItem({
    contentID: module.contentid,
    languageCode: locale,
  });

  // Fetch multiple referenced lists in parallel
  const [testimonials, teamMembers, stats] = await Promise.all([
    getContentList({
      referenceName: fields.testimonials.referencename,
      languageCode: locale,
    }),
    getContentList({
      referenceName: fields.team.referencename,
      languageCode: locale,
    }),
    getContentList({
      referenceName: fields.stats.referencename,
      languageCode: locale,
    }),
  ]);

  return (
    <div>
      {/* Use the fetched data */}
    </div>
  );
}
```

## Decision Tree: Which Approach?

```
Is the field a Linked Content (Grid) or Content Link (Multi)?
│
├─ YES → It's reference-based
│   │
│   └─ Must fetch using:
│       await getContentList({
│         referenceName: field.referencename,
│         languageCode: locale
│       })
│
└─ NO → It's auto-populated
    │
    └─ Access directly:
        field.fields.propertyName
```

## Common Patterns Summary

### Pattern 1: Direct Access (Auto-Populated)

```tsx
// Single linked item
const authorName = post.fields.author.fields.name;

// Multiple linked items (array)
post.fields.tags.map((tag) => tag.fields.name);
```

### Pattern 2: Fetch by Reference

```tsx
// Get reference name first
const { fields } = await getContentItem({ contentID, languageCode });

// Then fetch the list
const items = await getContentList({
  referenceName: fields.myList.referencename,
  languageCode,
});
```

### Pattern 3: Conditional Fetching

```tsx
// Only fetch if reference exists
const items = fields.optionalList?.referencename
  ? await getContentList({
      referenceName: fields.optionalList.referencename,
      languageCode: locale,
    })
  : [];
```

## Debugging Tips

### Check What You Have

```tsx
console.log("Field keys:", Object.keys(module.fields.myField));

// Auto-populated will show: ['contentID', 'fields', ...]
// Reference-based will show: ['referencename', 'sortids', ...]
```

### Verify Data Structure

```tsx
// Auto-populated
if (module.fields.author?.fields) {
  console.log("✅ Auto-populated linked content");
}

// Reference-based
if (module.fields.items?.referencename) {
  console.log("⚠️ Reference-based - need to fetch");
}
```

## Summary

| Aspect | Auto-Populated | Reference-Based |
|--------|---------------|-----------------|
| **Field Types** | Content Link, Dropdown, Checkbox, Search List Box | Linked Content (Grid), Content Link (Multi) |
| **Data Structure** | `{ contentID, fields: {...} }` | `{ referencename: "..." }` |
| **Access Pattern** | Direct: `field.fields.name` | Fetch: `getContentList({ referenceName })` |
| **API Calls** | 0 (included) | 1 (separate fetch required) |
| **When to Use** | Single related items | Lists/grids of items |

## Key Takeaways

1. ✅ **Auto-populated links** (dropdowns, checkboxes, etc.) - use directly with `.fields`
2. ⚠️ **Reference-based links** (grids, linked content) - fetch using `.referencename`
3. 🔍 **Check the field structure** to determine which type you have
4. 📦 **Use TypeScript** to document which type each field is
5. ⚡ **Use Promise.all()** when fetching multiple referenced lists

Following these patterns ensures correct data access and optimal performance!
