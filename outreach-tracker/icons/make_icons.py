#!/usr/bin/env python3
"""Write Verdansc-style PNG icons (no third-party deps)."""
from __future__ import annotations

import struct
import zlib
from pathlib import Path


def chunk(tag: bytes, data: bytes) -> bytes:
    return (
        struct.pack(">I", len(data))
        + tag
        + data
        + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
    )


def write_png(path: Path, width: int, height: int, rgba: bytes) -> None:
    raw = b""
    stride = width * 4
    for y in range(height):
        raw += b"\x00" + rgba[y * stride : (y + 1) * stride]
    png = (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0))
        + chunk(b"IDAT", zlib.compress(raw, 9))
        + chunk(b"IEND", b"")
    )
    path.write_bytes(png)


def clamp(n: int) -> int:
    return 0 if n < 0 else 255 if n > 255 else n


def draw_icon(size: int, *, pad: int = 0) -> bytes:
    pixels = bytearray(size * size * 4)
    cx = cy = (size - 1) / 2.0
    inner = size - pad * 2

    def set_px(x: int, y: int, r: int, g: int, b: int, a: int = 255) -> None:
        if 0 <= x < size and 0 <= y < size:
            i = (y * size + x) * 4
            pixels[i : i + 4] = bytes((clamp(r), clamp(g), clamp(b), a))

    for y in range(size):
        for x in range(size):
            if pad and (x < pad or y < pad or x >= size - pad or y >= size - pad):
                set_px(x, y, 10, 8, 6, 255)
                continue
            dx = (x - cx) / size
            dy = (y - cy) / size
            t = max(0.0, 1.0 - (dx * dx + dy * dy) * 1.8)
            set_px(x, y, int(14 + 46 * t), int(10 + 22 * t), int(8 + 16 * t))

    # Cyan-stroked V
    stroke = max(3, size // 28)
    top = pad + int(inner * 0.22)
    bottom = pad + int(inner * 0.72)
    left = pad + int(inner * 0.22)
    right = pad + int(inner * 0.78)
    mid_x = size // 2

    def stamp(x: int, y: int) -> None:
        for oy in range(-stroke, stroke + 1):
            for ox in range(-stroke, stroke + 1):
                if ox * ox + oy * oy <= stroke * stroke:
                    # fill + cyan edge
                    set_px(x + ox, y + oy, 240, 249, 255)
                    if ox * ox + oy * oy > (stroke - 2) ** 2:
                        set_px(x + ox, y + oy, 34, 211, 238)

    steps = size * 3
    for i in range(steps):
        t = i / (steps - 1)
        stamp(int(left + (mid_x - left) * t), int(top + (bottom - top) * t))
        stamp(int(right - (right - mid_x) * t), int(top + (bottom - top) * t))

    # Gold widget dot
    dot_y = pad + int(inner * 0.84)
    radius = max(4, size // 22)
    for y in range(dot_y - radius, dot_y + radius + 1):
        for x in range(mid_x - radius, mid_x + radius + 1):
            if (x - mid_x) ** 2 + (y - dot_y) ** 2 <= radius ** 2:
                set_px(x, y, 245, 185, 66)

    return bytes(pixels)


def main() -> None:
    here = Path(__file__).resolve().parent
    write_png(here / "icon-192.png", 192, 192, draw_icon(192))
    write_png(here / "icon-512.png", 512, 512, draw_icon(512))
    write_png(here / "icon-512-maskable.png", 512, 512, draw_icon(512, pad=56))
    write_png(here / "apple-touch-icon.png", 180, 180, draw_icon(180))


if __name__ == "__main__":
    main()
