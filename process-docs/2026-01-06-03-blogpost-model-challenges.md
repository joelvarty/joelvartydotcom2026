# BlogPost Model Setup: Learning from Assumptions

**Date**: January 6, 2026
**Phase**: Phase 2 - Core Infrastructure
**Status**: Complete (with manual intervention)

> **Note**: This post is written from Joel's perspective (first person "I" = Joel). The narrative describes what the AI agent attempted and what Joel fixed manually. Technical details sections are clearly marked as written by the AI agent (Cursor - Claude Code).

## The Challenge

When setting up the BlogPost content model in Agility CMS, the AI agent (Cursor) ran into several issues trying to configure it via the MCP Server. The model needed specific field types and relationships that weren't immediately clear from the schema documentation, and the agent made several assumptions that didn't match what I actually needed.

## What the Agent Tried

The agent attempted to create the BlogPost model with these assumptions:

### Assumption 1: Content Field Type
- **What the agent tried**: Used `Html` field type for the blog post content
- **Why**: Assumed rich text content would need HTML formatting
- **Reality**: I wanted a `Text` field configured as a custom "Markdown" field, matching the pattern I'd already established with my Basic Markdown component model

### Assumption 2: Author Field
- **What the agent tried**: Added a `LinkedContentSharedLink` field for Author
- **Why**: The development plan mentioned an Author model, and the agent assumed blog posts would need to reference authors
- **Reality**: Since it's my personal blog with only one author (me), the Author field wasn't needed at all

### Assumption 3: Category and Tags as Simple Fields
- **What the agent tried**: Initially tried to use `Text` field for tags (comma-separated) and `DropdownList` for category
- **Why**: Assumed these could be simple field types
- **Reality**: I wanted Category and Tags to be their own content models with proper linked content relationships

### Assumption 4: LinkedContent Field Configuration
- **What the agent tried**: Struggled to configure `LinkedContentDropdown` and `LinkedContentSearchListBox` fields properly
- **Why**: The MCP schema requires specific properties that weren't immediately clear:
  - `contentModel` (string) - reference name of the linked model
  - `renderAs` (specific literal values like "dropdown" or "searchlistbox")
  - `saveValueToField` (string) - hidden field name to store the selected value
  - `displayColumn` (string) - which field to display in the dropdown
- **Reality**: These fields need hidden helper fields (`categoryID`, `tagIDs`) to store the actual values, and the LinkedContent fields reference those

### Assumption 5: Field Naming
- **What the agent tried**: Used lowercase field names like `slug` and `content`
- **Why**: Standard naming convention
- **Reality**: I used capitalized field names ("Slug", "Content") as custom fields in Agility CMS, which is a specific configuration choice

## What I Fixed Manually

I manually configured the BlogPost model in Agility CMS with the correct setup:

1. **Removed Author field** - Not needed for a single-author blog
2. **Created Category and Tag models** - Separate content models for proper relationships
3. **Set up LinkedContent fields correctly**:
   - Category: `LinkedContentDropdown` pointing to Category model
   - Tags: `LinkedContentSearchListBox` pointing to Tag model
   - Both configured with proper hidden fields (`categoryID`, `tagIDs`) to store values
4. **Used custom fields** - "Slug" and "Content" (Markdown) as custom field types
5. **Organized with tabs** - Used tab fields to organize the form interface

## Visual Reference: Agility CMS Configuration

Here's what the final BlogPost model looks like in Agility CMS:

### Blog Post Content Model
![Blog Post Model](https://cdn.agilitycms.com/j0i5uycg/posts/agility-blogpost-model.png)

The model includes all the necessary fields organized into tabs (Main, Media, Content) for a clean editing experience.

### Category Field Configuration (Linked Content)
![Category Field Details](https://cdn.agilitycms.com/j0i5uycg/posts/agility-blogpost-category-field-details.png)

This shows the detailed configuration of the Category linked content field, demonstrating:
- **Link Type**: Specific Item(s) from a List
- **Render UI**: Dropdown List (Select One)
- **Content Reference**: Categories container
- **Visible Column**: Name
- **Save Value To Field**: CategoryID (hidden field)

### Blog Post Editing Experience
![Blog Post with Category and Tags](https://cdn.agilitycms.com/j0i5uycg/posts/agility-blog-post-category-tags.png)

The actual content editing interface showing how the Category dropdown and Tags selection work in practice, along with the featured image upload and other fields.

### Sample Content
![Posts Content List](https://cdn.agilitycms.com/j0i5uycg/posts/agility-posts-content-list.png)

The Posts container showing all the sample blog posts created for testing.

## Key Learnings

### For Future Content Model Creation:

1. **Check existing patterns first** - Look at how similar models are configured (like the Basic Markdown component)
2. **Custom fields matter** - Agility CMS supports custom field types that may not be obvious from the API schema
3. **LinkedContent requires helper fields** - Always create hidden Integer/Text fields to store the actual values
4. **Field naming can be custom** - Capitalized field names are valid and may be intentional
5. **Question assumptions** - Just because a model exists in the plan doesn't mean it's needed (Author example)

### For LinkedContent Fields:

The proper structure for LinkedContent fields requires:
- **Hidden value fields**: Create hidden fields first (e.g., `categoryID: Integer`, `tagIDs: Text`)
- **LinkedContent field**: References the content model and points to the hidden field via `saveValueToField`
- **Display configuration**: Use `displayColumn` to specify which field from the linked model to show
- **Content view**: May need to specify `contentView` (container reference name) for shared content

### Example Structure:

```typescript
// Hidden fields first
{ type: "Integer", name: "categoryID", label: "Category ID", hidden: true }
{ type: "Text", name: "categoryName", label: "Category Name", hidden: true }

// Then the LinkedContent field
{
  type: "LinkedContentDropdown",
  name: "category",
  label: "Category",
  contentModel: "Category",
  renderAs: "dropdown",
  saveValueToField: "categoryID",
  saveTextToField: "categoryName", // optional
  displayColumn: "name",
  contentView: "Categories" // container reference name
}
```

## What This Means Going Forward

When creating content models via MCP Server:
1. **Ask first** - If the structure isn't clear, ask about existing patterns
2. **Check existing models** - Use `get_content_model_details` to see how similar models are configured
3. **Document assumptions** - When making assumptions, document them so they can be corrected
4. **Iterate based on feedback** - Use manual corrections as learning opportunities

## Joel's Thoughts / Reflections

_[Space for Joel to add thoughts on the model structure, why certain choices were made, or any insights about the Agility CMS configuration]_

---

## Technical Details (Written by Cursor - Claude Code)

**Agent**: Cursor (Claude Code)
**Purpose**: Reference documentation for technical implementation details

### BlogPost Model Final Structure

The BlogPost model (ID: 8) was manually configured with:

**Fields**:
- `title` (Text, required)
- `Slug` (Text, custom field, required, unique)
- `excerpt` (LongText)
- `Content` (Text, custom Markdown field)
- `publishedDate` (Date)
- `featuredImage` (ImageAttachment)
- `galleryData` (LongText, optional) - JSON string for gallery images
- `categoryID` (Integer, hidden) - Stores selected category ID
- `categoryName` (Text, hidden) - Stores selected category name
- `category` (LinkedContentDropdown) - Links to Category model
- `tagIDs` (Text, hidden) - Stores comma-separated tag IDs
- `tagNames` (Text, hidden) - Stores comma-separated tag names
- `tags` (LinkedContentSearchListBox) - Links to Tag model

**Organization**: Fields organized using Tab fields for better UX in the Agility CMS editor.

### Category Model Structure

Created as a separate content model (ID: 12):
- `name` (Text, required)
- `slug` (Text, required, unique)
- `description` (LongText)

**Container**: "Categories" (ID: 9, shared list)

### Tag Model Structure

Created as a separate content model (ID: 13):
- `name` (Text, required, unique)
- `slug` (Text, required, unique)

**Container**: "Tags" (ID: 10, shared list)

### LinkedContent Field Configuration Details

**LinkedContentDropdown** (for Category):
- `contentModel`: "Category" (reference name)
- `renderAs`: "dropdown"
- `saveValueToField`: "categoryID"
- `saveTextToField`: "categoryName"
- `displayColumn`: "name"
- `contentView`: "Categories" (container reference name)

**LinkedContentSearchListBox** (for Tags):
- `contentModel`: "Tag" (reference name)
- `renderAs`: "searchlistbox"
- `saveValueToField`: "tagIDs"
- `saveTextToField`: "tagNames" (optional)
- `displayColumn`: "name"
- `contentView`: "Tags" (container reference name)

### MCP Server Limitations Encountered

While the MCP Server is the primary method for CMS operations, some configurations are easier to do manually in the Agility CMS UI:
- Custom field types (like Markdown) may need UI configuration
- Tab organization is clearer in the UI
- Field validation and relationships are easier to verify visually

### Next Steps

When implementing BlogPost in code:
- Access fields using their exact names (case-sensitive): "Slug", "Content"
- Read linked content values from hidden fields: `categoryID`, `tagIDs`
- Resolve linked content by fetching Category/Tag items using the stored IDs
- Parse `tagIDs` as comma-separated values for multiple selections

---

**Agent**: Cursor (Claude Code)
**Date**: 2026-01-06
**Phase**: Phase 2 - Core Infrastructure
**Note**: This post documents the learning process and assumptions made during content model setup, and how manual configuration corrected the approach.

