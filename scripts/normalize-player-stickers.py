#!/usr/bin/env python3
"""Re-export player Panini stickers onto a shared 640×960 canvas.

Some source WebPs (especially thomas, bas-d, sam) fill the frame tighter than
the others. CSS slots are already 2:3 + object-fit:contain, so tighter artwork
reads as a larger card. This script detects the solid card (white/orange frame)
and places every player sticker with the same relative padding.

Does not touch staff, groep, embleem, or jersey assets.
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
STICKER_DIR = ROOT / "public" / "stickers"

PLAYERS = [
    "alfred",
    "bas-d",
    "bas-n",
    "elias",
    "felix",
    "jacob",
    "jarne",
    "jia-le",
    "ilya",
    "charlie",
    "sam",
    "thomas",
]

CANVAS_W = 640
CANVAS_H = 960
# Match the looser-framed player cards (Jarne / Jia Le / Elias / Felix / Jacob).
PAD_X = 0.027
PAD_Y = 0.028
SOLID_ALPHA = 200
WEBP_QUALITY = 90


def solid_card_bbox(arr: np.ndarray) -> tuple[int, int, int, int]:
    """Bounding box of the opaque white/orange card (not the soft drop shadow)."""
    alpha = arr[:, :, 3]
    solid = alpha >= SOLID_ALPHA
    if not solid.any():
        solid = alpha >= 16
    if not solid.any():
        raise ValueError("no opaque card pixels")
    rows = np.where(np.any(solid, axis=1))[0]
    cols = np.where(np.any(solid, axis=0))[0]
    y0, y1 = int(rows[0]), int(rows[-1]) + 1
    x0, x1 = int(cols[0]), int(cols[-1]) + 1
    return x0, y0, x1, y1


def normalize(im: Image.Image) -> Image.Image:
    src = im.convert("RGBA")
    arr = np.array(src)
    x0, y0, x1, y1 = solid_card_bbox(arr)
    card_w = x1 - x0
    card_h = y1 - y0

    inner_w = CANVAS_W * (1.0 - 2.0 * PAD_X)
    inner_h = CANVAS_H * (1.0 - 2.0 * PAD_Y)
    scale = min(inner_w / card_w, inner_h / card_h)

    new_card_w = card_w * scale
    new_card_h = card_h * scale
    dest_x = (CANVAS_W - new_card_w) / 2.0
    dest_y = (CANVAS_H - new_card_h) / 2.0

    # Map the whole source so drop-shadow / AA outside the solid bbox is kept.
    scaled_w = max(1, int(round(src.width * scale)))
    scaled_h = max(1, int(round(src.height * scale)))
    scaled = src.resize((scaled_w, scaled_h), Image.Resampling.LANCZOS)

    paste_x = int(round(dest_x - x0 * scale))
    paste_y = int(round(dest_y - y0 * scale))

    canvas = Image.new("RGBA", (CANVAS_W, CANVAS_H), (0, 0, 0, 0))
    canvas.alpha_composite(scaled, (paste_x, paste_y))
    return canvas


def metrics(path: Path) -> dict[str, float]:
    arr = np.array(Image.open(path).convert("RGBA"))
    h, w = arr.shape[:2]
    x0, y0, x1, y1 = solid_card_bbox(arr)
    return {
        "w": w,
        "h": h,
        "card_w": x1 - x0,
        "card_h": y1 - y0,
        "fill_w": (x1 - x0) / w,
        "fill_h": (y1 - y0) / h,
        "pad_l": x0 / w,
        "pad_r": (w - x1) / w,
        "pad_t": y0 / h,
        "pad_b": (h - y1) / h,
    }


def main() -> None:
    print(
        f"canvas={CANVAS_W}x{CANVAS_H}  pad_x={PAD_X:.3f}  pad_y={PAD_Y:.3f}  "
        f"inner={CANVAS_W * (1 - 2 * PAD_X):.1f}x{CANVAS_H * (1 - 2 * PAD_Y):.1f}"
    )
    for name in PLAYERS:
        path = STICKER_DIR / f"{name}.webp"
        before = metrics(path)
        src = Image.open(path)
        out = normalize(src)
        out.save(path, format="WEBP", quality=WEBP_QUALITY, method=6)
        after = metrics(path)
        print(
            f"{name:8s}  {before['w']:.0f}x{before['h']:.0f} fill={before['fill_w']:.3f}x{before['fill_h']:.3f}"
            f"  ->  {after['w']:.0f}x{after['h']:.0f} fill={after['fill_w']:.3f}x{after['fill_h']:.3f}"
            f"  pad LRTB={after['pad_l']:.3f}/{after['pad_r']:.3f}/{after['pad_t']:.3f}/{after['pad_b']:.3f}"
        )


if __name__ == "__main__":
    main()
