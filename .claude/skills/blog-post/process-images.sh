#!/usr/bin/env bash
#
# Resize and convert blog post images to web-friendly JPG.
#
# Usage:
#   process-images.sh <input-dir-or-file> [output-dir] [max-width] [quality]
#
# Defaults: output-dir=<input>/processed, max-width=2000, quality=82
#
# Behavior:
#   - Accepts JPG, JPEG, PNG, HEIC, HEIF, WEBP, TIFF, GIF, BMP inputs.
#   - Downscales so the longest edge is at most <max-width> px (never upscales).
#   - Converts everything to baseline JPG, strips metadata, flattens alpha on white.
#   - Writes <name>.jpg into the output dir (lowercased, spaces -> dashes).
#
# Picks the first available backend: ImageMagick (magick/convert),
# macOS sips, or Python Pillow.

set -euo pipefail

IN="${1:?Usage: process-images.sh <input-dir-or-file> [output-dir] [max-width] [quality]}"
MAXW="${3:-2000}"
QUALITY="${4:-82}"

if [ -d "$IN" ]; then
  OUT="${2:-$IN/processed}"
else
  OUT="${2:-$(dirname "$IN")/processed}"
fi
mkdir -p "$OUT"

# Collect input files
shopt -s nullglob nocaseglob
files=()
if [ -d "$IN" ]; then
  for f in "$IN"/*.{jpg,jpeg,png,heic,heif,webp,tif,tiff,gif,bmp}; do files+=("$f"); done
else
  files+=("$IN")
fi
shopt -u nullglob nocaseglob

if [ "${#files[@]}" -eq 0 ]; then
  echo "No images found in $IN" >&2
  exit 1
fi

# Detect backend
backend=""
if command -v magick >/dev/null 2>&1; then backend="magick"
elif command -v convert >/dev/null 2>&1; then backend="convert"
elif command -v sips >/dev/null 2>&1; then backend="sips"
elif python3 -c "import PIL" >/dev/null 2>&1; then backend="pillow"
else
  echo "No image backend found. Install one of: ImageMagick (brew install imagemagick), or Pillow (pip install Pillow). macOS sips is built in." >&2
  exit 1
fi
echo "Using backend: $backend  (max-width=$MAXW, quality=$QUALITY)"

slugify() {
  # lowercase, strip extension, spaces/underscores -> dash, drop other junk
  basename "$1" | sed -E 's/\.[^.]+$//' | tr '[:upper:]' '[:lower:]' \
    | sed -E 's/[ _]+/-/g; s/[^a-z0-9-]//g; s/-+/-/g; s/^-|-$//g'
}

for f in "${files[@]}"; do
  name="$(slugify "$f")"
  dest="$OUT/$name.jpg"
  case "$backend" in
    magick|convert)
      "$backend" "$f" -auto-orient -resize "${MAXW}x${MAXW}>" \
        -background white -flatten -strip -quality "$QUALITY" "$dest"
      ;;
    sips)
      # sips: resampleHeightWidthMax downscales longest edge; convert to jpeg
      cp "$f" "$dest.tmp.src"
      sips -s format jpeg -s formatOptions "$QUALITY" \
        --resampleHeightWidthMax "$MAXW" "$dest.tmp.src" --out "$dest" >/dev/null
      rm -f "$dest.tmp.src"
      ;;
    pillow)
      python3 - "$f" "$dest" "$MAXW" "$QUALITY" <<'PY'
import sys
from PIL import Image, ImageOps
src, dest, maxw, q = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
im = Image.open(src)
im = ImageOps.exif_transpose(im)
if im.mode in ("RGBA", "LA", "P"):
    bg = Image.new("RGB", im.size, (255, 255, 255))
    im = im.convert("RGBA")
    bg.paste(im, mask=im.split()[-1])
    im = bg
else:
    im = im.convert("RGB")
im.thumbnail((maxw, maxw), Image.LANCZOS)  # only downscales
im.save(dest, "JPEG", quality=q, optimize=True)
PY
      ;;
  esac
  echo "  $f -> $dest"
done

echo "Done. Processed ${#files[@]} image(s) into $OUT"
