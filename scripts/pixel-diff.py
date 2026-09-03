#!/usr/bin/env python3
"""Compare a Figma export against an app screenshot.

  python3 scripts/pixel-diff.py figma.png app.png [diff.png]

Prints the share of pixels differing by more than a small tolerance, plus a
per-row breakdown so you can see *where* the drift is. Requires Pillow.
"""
import sys
from PIL import Image, ImageChops

TOLERANCE = 24  # per-channel; absorbs font antialiasing, not layout drift


def main(ref_path, shot_path, diff_path=None):
    ref = Image.open(ref_path).convert("RGB")
    shot = Image.open(shot_path).convert("RGB")
    if ref.size != shot.size:
        print(f"size mismatch: figma {ref.size} vs app {shot.size}")
        shot = shot.resize(ref.size)

    delta = ImageChops.difference(ref, shot).convert("L")
    mask = delta.point(lambda v: 255 if v > TOLERANCE else 0)
    px = mask.load()
    w, h = mask.size

    bad = 0
    rows = []
    for y in range(h):
        row = sum(1 for x in range(w) if px[x, y])
        bad += row
        rows.append(row)

    print(f"{ref_path} vs {shot_path}  ({w}x{h})")
    print(f"differing pixels: {bad}/{w * h} = {bad / (w * h) * 100:.2f}%")

    worst = sorted(range(h), key=lambda y: -rows[y])[:10]
    print("worst rows (y: differing px):")
    for y in sorted(worst):
        print(f"  y={y:5d}  {rows[y]}")

    if diff_path:
        mask.save(diff_path)
        print(f"diff mask -> {diff_path}")

    return 0 if bad / (w * h) < 0.02 else 1


if __name__ == "__main__":
    sys.exit(main(*sys.argv[1:4]))
