# Post Image Staging

Working area for preparing images before uploading them to Agility CMS via the
`blog-post` skill.

## Layout

```
post-images/
  <post-slug>/
    post.md        # the pulled blog post (frontmatter + body) for reference
    source/        # drop original photos here (any format/size)
    processed/     # resized + JPG-converted output, ready to upload
```

## Workflow

1. Drop original photos into `<post-slug>/source/`.
2. Resize and convert them to web-friendly JPG:
   ```bash
   .claude/skills/blog-post/process-images.sh post-images/<post-slug>/source post-images/<post-slug>/processed
   ```
3. Upload the files from `processed/` using the `blog-post` skill (it handles the
   Agility CDN upload and gallery markdown).

`source/` and `processed/` are git-ignored so large originals are not committed.
