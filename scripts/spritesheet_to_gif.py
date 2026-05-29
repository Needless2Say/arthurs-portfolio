#!/usr/bin/env python3
"""
Convert goku-kamehameha-pixel-art.png into an animated GIF and WebP.

Non-uniform layout:
  Row 1: 6 frames
  Row 2: 6 frames
  Row 3: 6 frames
  Row 4: 6 frames
  Row 5: 4 frames  (last row is shorter)
  Total: 28 frames

Run from the arthurs-portfolio root:
    py scripts/spritesheet_to_gif.py
"""

from PIL import Image
import os, sys

# -- Config -------------------------------------------------------------------
SHEET_PATH  = "public/goku-kamehameha-pixel-art.png"
OUT_GIF     = "public/goku_kamehameha.gif"
OUT_WEBP    = "public/goku_kamehameha.webp"
OUT_PREVIEW = "public/goku_preview.png"   # tiled preview to verify frame cuts

# Columns per row  (define each row explicitly to handle the non-uniform layout)
ROWS_LAYOUT = [6, 6, 6, 6, 4]

FPS         = 10    # frames per second
SCALE       = 0.5   # resize before saving  (0.5 = half size, crisp pixel art)
SAVE_PREVIEW = True # set False to skip the preview image
# -----------------------------------------------------------------------------


def load_frames(sheet_path, rows_layout, scale):
    sheet = Image.open(sheet_path)
    sw, sh = sheet.size
    num_rows = len(rows_layout)
    max_cols = max(rows_layout)

    # Derive frame size from the maximum-column count and total row count
    fw = sw // max_cols
    fh = sh // num_rows
    tw = int(fw * scale)
    th = int(fh * scale)

    print(f"  Sheet   : {sw} x {sh} px  |  mode={sheet.mode}")
    print(f"  Frame   : {fw} x {fh} px  (raw)  ->  {tw} x {th} px  (scaled x{scale})")
    print(f"  Layout  : {rows_layout}  =  {sum(rows_layout)} frames total")

    frames = []
    for row_idx, cols in enumerate(rows_layout):
        y = row_idx * fh
        for col in range(cols):
            x = col * fw
            frame = sheet.crop((x, y, x + fw, y + fh))
            if scale != 1.0:
                frame = frame.resize((tw, th), Image.NEAREST)
            frames.append(frame)

    return frames, tw, th


def save_preview(frames, path, cols=6):
    """Tile all frames into one image so you can visually verify the cuts."""
    if not frames:
        return
    fw, fh = frames[0].size
    rows = (len(frames) + cols - 1) // cols
    canvas = Image.new("RGB", (fw * cols, fh * rows), (30, 30, 30))
    for i, frame in enumerate(frames):
        x = (i % cols) * fw
        y = (i // cols) * fh
        canvas.paste(frame, (x, y))
    canvas.save(path)
    print(f"  Preview -> {path}  ({len(frames)} frames, verify cuts look correct)")


def save_webp(frames, path, fps):
    frames[0].save(
        path,
        save_all=True,
        append_images=frames[1:],
        duration=1000 // fps,
        loop=0,
        lossless=True,
    )
    print(f"  WebP    -> {path}  ({os.path.getsize(path) // 1024} KB)")


def save_gif(frames, path, fps):
    gif_frames = [
        f.convert("P", palette=Image.ADAPTIVE, dither=Image.Dither.NONE)
        for f in frames
    ]
    gif_frames[0].save(
        path,
        save_all=True,
        append_images=gif_frames[1:],
        duration=1000 // fps,
        loop=0,
        optimize=False,
    )
    print(f"  GIF     -> {path}  ({os.path.getsize(path) // 1024} KB)")


def main():
    root    = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    sheet   = os.path.join(root, SHEET_PATH)
    gif     = os.path.join(root, OUT_GIF)
    webp    = os.path.join(root, OUT_WEBP)
    preview = os.path.join(root, OUT_PREVIEW)

    if not os.path.exists(sheet):
        print(f"ERROR: spritesheet not found at {sheet}")
        sys.exit(1)

    print("\n-- Loading frames -------------------------------------------")
    frames, fw, fh = load_frames(sheet, ROWS_LAYOUT, SCALE)
    print(f"  Loaded  : {len(frames)} frames")

    if SAVE_PREVIEW:
        print("\n-- Saving preview -------------------------------------------")
        save_preview(frames, preview)

    print("\n-- Saving animations ----------------------------------------")
    save_webp(frames, webp, FPS)
    save_gif(frames, gif, FPS)

    print("\nDone!")
    print("  Check public/goku_preview.png first to verify frames are correct.")
    print("  If frames look misaligned, adjust ROWS_LAYOUT or SCALE in this script.")


if __name__ == "__main__":
    main()
