# Blog Post Creation for joelvarty.com

When I say "create a blog post on joelvarty.com" or ask to create/publish a blog post, use the Agility CMS MCP tools.

## Instance Configuration

- **Instance GUID**: `e9a21a52-u`
- **Locale**: `en-us`
- **Posts Container**: `Posts`

## Categories

Use the `categoryID` field with these values:

| ID  | Name       |
| --- | ---------- |
| 18  | Football   |
| 19  | Work       |
| 17  | 3rd Spaces |

To get current categories: `get_content_items(instanceGuid: "e9a21a52-u", referenceName: "Categories", locale: "en-us")`

## Tags

Use the `tagIDs` field (comma-separated IDs like "22,69"):

| ID  | Name       |
| --- | ---------- |
| 20  | sports     |
| 21  | theatre    |
| 22  | coding     |
| 23  | leadership |
| 69  | ai         |

To get current tags: `get_content_items(instanceGuid: "e9a21a52-u", referenceName: "Tags", locale: "en-us")`

## Series

To get current series: `get_content_items(instanceGuid: "e9a21a52-u", referenceName: "BlogSeries", locale: "en-us")`

## Blog Post Fields

| Field           | Type     | Required | Notes                                                       |
| --------------- | -------- | -------- | ----------------------------------------------------------- |
| `title`         | Text     | No       | Post title                                                  |
| `Slug`          | Text     | **Yes**  | URL slug - generate from title, must be unique              |
| `excerpt`       | LongText | No       | Short summary                                               |
| `publishedDate` | Date     | **Yes**  | Format: `YYYY-MM-DDTHH:MM:SS` (e.g., `2026-01-13T14:30:00`) |
| `categoryID`    | Integer  | **Yes**  | Use ID from categories table above                          |
| `tagIDs`        | Text     | **Yes**  | Comma-separated IDs, no spaces (e.g., "22,69")              |
| `seriesID`      | Integer  | No       | ID of series if applicable                                  |
| `Content`       | Text     | **Yes**  | Markdown body content                                       |
| `featuredImage` | Image    | No       | Object: `{url: "...", label: "alt text"}`                   |

## Image Upload Process

1. **Initialize upload**:

   ```
   initialize_media_upload(instanceGuid: "e9a21a52-u", fileName: "image-name.jpg", folderPath: "blog-images")
   ```

2. **Upload the file** to the returned `uploadUrl`

3. **Use the CDN URL** in your content or as `featuredImage`

## Gallery Syntax

Insert galleries in the `Content` field using fenced code blocks:

### Carousel (slideshow)

````
```gallery:carousel
https://cdn.agilitycms.com/image1.jpg "Caption for image 1"
https://cdn.agilitycms.com/image2.jpg "Caption for image 2"
````

```

### Grid
```

```gallery:grid:columns-3
https://cdn.agilitycms.com/image1.jpg "Caption 1"
https://cdn.agilitycms.com/image2.jpg "Caption 2"
```

````

### Other gallery types
- `gallery:masonry` - Pinterest-style layout
- `gallery:thumbnail` - Grid with hover effects
- `gallery:stacked` - Vertically stacked
- `gallery:comparison` - Before/after slider (2 images only)
- `gallery:tabs` - Tabbed image selector

## Creating a Blog Post

Use `save_content_items` with:

```json
{
  "instanceGuid": "e9a21a52-u",
  "locale": "en-us",
  "items": [{
    "contentID": -1,
    "referenceName": "Posts",
    "fields": {
      "title": "Post Title Here",
      "Slug": "post-title-here",
      "excerpt": "A short summary of the post",
      "publishedDate": "2026-01-13T10:00:00",
      "categoryID": 19,
      "tagIDs": "22,69",
      "Content": "# Markdown content\n\nYour post body here...",
      "featuredImage": {
        "url": "https://cdn.agilitycms.com/...",
        "label": "Descriptive alt text"
      }
    }
  }]
}
````

## When Given Multiple Images

1. Upload all images to the CDN
2. **Select the best one for `featuredImage`**:
   - Prefer landscape orientation (better for headers)
   - Prefer clear subjects and good composition
   - Choose the one that best represents the post topic
3. Create a gallery in the Content with the remaining images
4. **Tell me which image you selected as featured and why**

## Creating New Categories or Tags

**New Category**:

```json
{
	"instanceGuid": "e9a21a52-u",
	"locale": "en-us",
	"items": [
		{
			"contentID": -1,
			"referenceName": "Categories",
			"fields": {
				"name": "Category Name",
				"slug": "category-name",
				"description": "Optional description"
			}
		}
	]
}
```

**New Tag**:

```json
{
	"instanceGuid": "e9a21a52-u",
	"locale": "en-us",
	"items": [
		{
			"contentID": -1,
			"referenceName": "Tags",
			"fields": {
				"name": "tagname",
				"slug": "tagname"
			}
		}
	]
}
```

## Workflow Summary

1. Gather: title, content, category, tags, images
2. Upload images (if any)
3. Select best featured image (if multiple)
4. Generate slug from title
5. Create gallery markdown (if multiple images)
6. Save the post
7. Confirm success with content ID
8. Provide a link to edit the post in Agility CMS: `https://app.agilitycms.com/instance/e9a21a52-u/en-us/content/list-11/listitem-{contentID}` (replace `{contentID}` with actual ID)
