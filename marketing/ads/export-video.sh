#!/usr/bin/env bash
set -euo pipefail
ROOT="/workspace/marketing/ads"
FRAMES_H="$ROOT/frames/16x9"
FRAMES_V="$ROOT/frames/9x16"
OUT="$ROOT/exports"
mkdir -p "$OUT" /tmp/verdansc-clips

make_clip() {
  local src="$1"
  local seconds="$2"
  local dest="$3"
  local w="$4"
  local h="$5"
  local frames
  frames="$(python3 - <<PY
print(int(round($seconds * 30)))
PY
)"
  local sw sh
  sw="$(python3 - <<PY
print(int($w * 1.12))
PY
)"
  sh="$(python3 - <<PY
print(int($h * 1.12))
PY
)"
  ffmpeg -y -loop 1 -i "$src" -vf "scale=${sw}:${sh}:force_original_aspect_ratio=increase,crop=${sw}:${sh},zoompan=z='min(1.0+0.0009*on,1.08)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=${w}x${h}:fps=30,format=yuv420p" -t "$seconds" -an "$dest"
}

# 16:9 clips  — durations chosen so 4 x 0.5s xfades land at exactly 30.0s
# 5.5 + 5.5 + 6.0 + 7.0 + 8.0 - 4*0.5 = 32.0 - 2.0 = 30.0
make_clip "$FRAMES_H/01-search-photo.jpg" 5.5 /tmp/verdansc-clips/h01.mp4 1920 1080
make_clip "$FRAMES_H/02-credit-upload.jpg" 5.5 /tmp/verdansc-clips/h02.mp4 1920 1080
make_clip "$FRAMES_H/03-apply-intake.jpg" 6.0 /tmp/verdansc-clips/h03.mp4 1920 1080
make_clip "$FRAMES_H/04-notifications.jpg" 7.0 /tmp/verdansc-clips/h04.mp4 1920 1080
make_clip "$FRAMES_H/05-endcard.jpg" 8.0 /tmp/verdansc-clips/h05.mp4 1920 1080

ffmpeg -y \
  -i /tmp/verdansc-clips/h01.mp4 \
  -i /tmp/verdansc-clips/h02.mp4 \
  -i /tmp/verdansc-clips/h03.mp4 \
  -i /tmp/verdansc-clips/h04.mp4 \
  -i /tmp/verdansc-clips/h05.mp4 \
  -f lavfi -t 30 -i anullsrc=channel_layout=stereo:sample_rate=48000 \
  -filter_complex "[0:v][1:v]xfade=transition=fade:duration=0.5:offset=5.0[v01]; \
[v01][2:v]xfade=transition=fade:duration=0.5:offset=10.0[v02]; \
[v02][3:v]xfade=transition=fade:duration=0.5:offset=15.5[v03]; \
[v03][4:v]xfade=transition=fade:duration=0.5:offset=22.0[vout]" \
  -map "[vout]" -map 5:a -c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium -c:a aac -b:a 128k -shortest \
  "$OUT/verdansc-split-ad-30s-16x9.mp4"

# 9:16 Reels / Stories
make_clip "$FRAMES_V/01-search-photo.jpg" 5.5 /tmp/verdansc-clips/v01.mp4 1080 1920
make_clip "$FRAMES_V/02-credit-upload.jpg" 5.5 /tmp/verdansc-clips/v02.mp4 1080 1920
make_clip "$FRAMES_V/03-apply-intake.jpg" 6.0 /tmp/verdansc-clips/v03.mp4 1080 1920
make_clip "$FRAMES_V/04-notifications.jpg" 7.0 /tmp/verdansc-clips/v04.mp4 1080 1920
make_clip "$FRAMES_V/05-endcard.jpg" 8.0 /tmp/verdansc-clips/v05.mp4 1080 1920

ffmpeg -y \
  -i /tmp/verdansc-clips/v01.mp4 \
  -i /tmp/verdansc-clips/v02.mp4 \
  -i /tmp/verdansc-clips/v03.mp4 \
  -i /tmp/verdansc-clips/v04.mp4 \
  -i /tmp/verdansc-clips/v05.mp4 \
  -f lavfi -t 30 -i anullsrc=channel_layout=stereo:sample_rate=48000 \
  -filter_complex "[0:v][1:v]xfade=transition=fade:duration=0.5:offset=5.0[v01]; \
[v01][2:v]xfade=transition=fade:duration=0.5:offset=10.0[v02]; \
[v02][3:v]xfade=transition=fade:duration=0.5:offset=15.5[v03]; \
[v03][4:v]xfade=transition=fade:duration=0.5:offset=22.0[vout]" \
  -map "[vout]" -map 5:a -c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium -c:a aac -b:a 128k -shortest \
  "$OUT/verdansc-split-ad-30s-9x16.mp4"

ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$OUT/verdansc-split-ad-30s-16x9.mp4"
ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$OUT/verdansc-split-ad-30s-9x16.mp4"
ls -lh "$OUT"
