#!/usr/bin/env python3
"""Crop hero sticker WebPs so the white/outer card sits on the bitmap edge."""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
STICKER_DIR = ROOT / "public" / "stickers"
INK = np.array([10, 10, 10], dtype=np.int16)
SOLID_ALPHA = 200
WEBP_QUALITY = 92


def card_bbox(arr: np.ndarray) -> tuple[int, int, int, int]:
    rgb = arr[:, :, :3].astype(np.int16)
    alpha = arr[:, :, 3]
    lum = arr[:, :, :3].max(axis=2)
    non_ink = np.abs(rgb - INK).sum(axis=2) > 18
    bright = lum >= 160
    solid = (non_ink | bright) & (alpha >= SOLID_ALPHA)
    if not solid.any():
        solid = non_ink
    rows = np.where(np.any(solid, axis=1))[0]
    cols = np.where(np.any(solid, axis=0))[0]
    return int(cols[0]), int(rows[0]), int(cols[-1]) + 1, int(rows[-1]) + 1


def crop_flush(src: Path, dest: Path) -> None:
    im = Image.open(src).convert("RGBA")
    x0, y0, x1, y1 = card_bbox(np.array(im))
    cropped = im.crop((x0, y0, x1, y1))
    dest.parent.mkdir(parents=True, exist_ok=True)
    cropped.save(dest, "WEBP", quality=WEBP_QUALITY, method=6)
    print(f"{src.name} {im.size} -> {dest.name} {cropped.size} crop=({x0},{y0},{x1},{y1})")


def main() -> None:
    crop_flush(STICKER_DIR / "groep-u10c-2026.webp", STICKER_DIR / "groep-u10c-2026-hero.webp")
    crop_flush(STICKER_DIR / "embleem-u10c.webp", STICKER_DIR / "embleem-u10c-hero.webp")


if __name__ == "__main__":
    main()
