# Export notes

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
