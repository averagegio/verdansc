# Export notes

## Motion 16:9 (LinkedIn / landscape, free ffmpeg)

Higgsfield and other paid web generators are not required. Rebuild the Ken Burns landscape ad:

```bash
bash marketing/ads/export-motion-16x9.sh
```

Output: `exports/verdansc-motion-ad-30s-16x9.mp4` (also copied to `/opt/cursor/artifacts/verdansc_higgsfield_ad_30s.mp4` and `verdansc_motion_ad_30s_16x9.mp4`).

- Stronger per-beat pan + zoom than the original center-only `zoompan` in `export-video.sh`.
- Same 30.00s / 1920×1080 / H.264 / silent AAC contract.
- See `/opt/cursor/artifacts/higgsfield_ad.md` for hashes and method notes.


## Still ads
- Compose: `python3 marketing/ads/compose_ads.py`
- Outputs land in `exports/` as PNG (lossless), JPEG, and WebP.

## Video
- Tooling: ffmpeg 6.1, libx264 CRF 18, yuv420p, 30 fps, silent AAC stereo.
- Ken Burns: `zoompan` 1.00 → 1.08 over each beat.
- Transitions: 0.5s `xfade` fade.
- Duration math: 5.5 + 5.5 + 6.0 + 7.0 + 8.0 − 4×0.5 = **30.00s**.
- Verified with `ffprobe`: `format.duration = 30.000000`, 1920×1080, 900 frames.

## UI captures
Seeded via `POST /api/auth/register` + `POST /api/intake/listings` with fictional Maya Chen / Jordan Hale / Harborline Flats 2B, then Playwright screenshots of `/`, `/listings`, `/credit-check`, `/rental-application`, `/apply/:id`.
