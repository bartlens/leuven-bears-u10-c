#!/usr/bin/env python3
"""Lock every Spelers portrait sticker to one 640×960 card rectangle.

Detects the opaque white/orange card (not the soft drop shadow), then
stretches that card onto a shared destination box so every file has the
same top Y, bottom Y, left X, and right X. Canvas padding is opaque ink
so CSS object-fit:contain shows identical cards.

Covers players, staff, and the U10 C emblem. Does not touch groep photos.
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
STICKER_DIR = ROOT / "public" / "stickers"

PORTRAITS = [
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
    "jonathan",
    "rafa",
    "els",
    "embleem-u10c",
]

CANVAS_W = 640
CANVAS_H = 960
# Thin even ink margin; cards stay large (no extra black that shrinks one).
PAD_X_PX = 17
PAD_Y_PX = 27
DEST = (PAD_X_PX, PAD_Y_PX, CANVAS_W - PAD_X_PX, CANVAS_H - PAD_Y_PX)
INK = (10, 10, 10, 255)
SOLID_ALPHA = 220
WEBP_QUALITY = 92


INK_RGB = np.array(INK[:3], dtype=np.int16)


def solid_card_bbox(arr: np.ndarray) -> tuple[int, int, int, int]:
    """Bounding box of the visible card (not ink padding or soft shadow)."""
    rgb = arr[:, :, :3].astype(np.int16)
    alpha = arr[:, :, 3]
    non_ink = np.abs(rgb - INK_RGB).sum(axis=2) > 18
    solid = non_ink & (alpha >= SOLID_ALPHA)
    if not solid.any():
        solid = non_ink
    if not solid.any():
        solid = alpha >= SOLID_ALPHA
    if not solid.any():
        raise ValueError("no card pixels")
    rows = np.where(np.any(solid, axis=1))[0]
    cols = np.where(np.any(solid, axis=0))[0]
    return int(cols[0]), int(rows[0]), int(cols[-1]) + 1, int(rows[-1]) + 1


def normalize(im: Image.Image) -> Image.Image:
    src = im.convert("RGBA")
    arr = np.array(src)
    x0, y0, x1, y1 = solid_card_bbox(arr)
    card = src.crop((x0, y0, x1, y1))

    dest_w = DEST[2] - DEST[0]
    dest_h = DEST[3] - DEST[1]
    # Non-uniform resize: tops and bottoms land on the same pixel rows.
    fitted = card.resize((dest_w, dest_h), Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", (CANVAS_W, CANVAS_H), INK)
    canvas.paste(fitted, (DEST[0], DEST[1]), fitted)
    locked = np.array(canvas)
    locked[: DEST[1], :] = INK
    locked[DEST[3] :, :] = INK
    locked[:, : DEST[0]] = INK
    locked[:, DEST[2] :] = INK
    return Image.fromarray(locked)


def metrics(path: Path) -> dict[str, float]:
    arr = np.array(Image.open(path).convert("RGBA"))
    h, w = arr.shape[:2]
    x0, y0, x1, y1 = solid_card_bbox(arr)
    return {
        "w": w,
        "h": h,
        "x0": x0,
        "y0": y0,
        "x1": x1,
        "y1": y1,
        "fill_w": (x1 - x0) / w,
        "fill_h": (y1 - y0) / h,
    }


def main() -> None:
    dx0, dy0, dx1, dy1 = DEST
    print(
        f"canvas={CANVAS_W}x{CANVAS_H}  dest=({dx0},{dy0})-({dx1},{dy1})  "
        f"card={dx1 - dx0}x{dy1 - dy0}"
    )
    for name in PORTRAITS:
        path = STICKER_DIR / f"{name}.webp"
        before = metrics(path)
        out = normalize(Image.open(path))
        out.save(path, format="WEBP", lossless=True, method=6)
        after = metrics(path)
        ok = (
            after["w"] == CANVAS_W
            and after["h"] == CANVAS_H
            and after["x0"] == dx0
            and after["y0"] == dy0
            and after["x1"] == dx1
            and after["y1"] == dy1
        )
        print(
            f"{name:14s}  {before['w']:.0f}x{before['h']:.0f} "
            f"card=({before['x0']:.0f},{before['y0']:.0f})-({before['x1']:.0f},{before['y1']:.0f})"
            f"  ->  {after['w']:.0f}x{after['h']:.0f} "
            f"card=({after['x0']:.0f},{after['y0']:.0f})-({after['x1']:.0f},{after['y1']:.0f})"
            f"  {'OK' if ok else 'DRIFT'}"
        )


if __name__ == "__main__":
    main()
