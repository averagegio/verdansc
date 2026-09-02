#!/usr/bin/env bash
# Distinct Ken Burns / pan motion 16:9 ad from split storyboard stills.
# Not a remux/copy of verdansc-split-ad-30s-16x9.mp4 — each beat pans on a
# different axis with a stronger zoom than the original center-only zoompan.
set -euo pipefail
ROOT="/workspace/marketing/ads"
FRAMES="$ROOT/frames/16x9"
OUT="$ROOT/exports"
CLIPS="/tmp/verdansc-motion-clips"
mkdir -p "$OUT" "$CLIPS" /opt/cursor/artifacts

W=1920
H=1080
FPS=30

# Scale each still larger than 16:9 so crop/pan has room, then Ken Burns.
# Duration math matches original: 5.5+5.5+6.0+7.0+8.0 - 4*0.5 = 30.0s
make_clip() {
  local src="$1"
  local seconds="$2"
  local dest="$3"
  local zexpr="$4"
  local xexpr="$5"
  local yexpr="$6"
  local frames
  frames="$(python3 - <<PY
print(int(round($seconds * $FPS)))
PY
)"
  # 18% overscan so pan+zoom never samples outside the scaled frame
  ffmpeg -y -hide_banner -loglevel error -loop 1 -i "$src" \
    -vf "scale=$((W * 118 / 100)):$((H * 118 / 100)):force_original_aspect_ratio=increase,crop=$((W * 118 / 100)):$((H * 118 / 100)),zoompan=z=${zexpr}:x=${xexpr}:y=${yexpr}:d=${frames}:s=${W}x${H}:fps=${FPS},format=yuv420p" \
    -frames:v "$frames" -r "$FPS" -an "$dest"
}

# Beat 1: slow zoom-in, pan left → right (search + photograph)
make_clip "$FRAMES/01-search-photo.jpg" 5.5 "$CLIPS/h01.mp4" \
  "'min(1.0+0.0016*on,1.14)'" \
  "'(iw-iw/zoom)*(on/165)'" \
  "'(ih-ih/zoom)*0.35'"

# Beat 2: zoom-in, pan right → left (credit + upload)
make_clip "$FRAMES/02-credit-upload.jpg" 5.5 "$CLIPS/h02.mp4" \
  "'min(1.02+0.0014*on,1.15)'" \
  "'(iw-iw/zoom)*(1.0-on/165)'" \
  "'(ih-ih/zoom)*0.55'"

# Beat 3: start tighter, ease out + pan down (apply + listing live)
make_clip "$FRAMES/03-apply-intake.jpg" 6.0 "$CLIPS/h03.mp4" \
  "'max(1.16-0.0012*on,1.04)'" \
  "'(iw-iw/zoom)*0.45'" \
  "'(ih-ih/zoom)*(on/180)'"

# Beat 4: zoom-in, pan up (notifications climax)
make_clip "$FRAMES/04-notifications.jpg" 7.0 "$CLIPS/h04.mp4" \
  "'min(1.0+0.0013*on,1.16)'" \
  "'(iw-iw/zoom)*0.52'" \
  "'(ih-ih/zoom)*(1.0-on/210)'"

# Beat 5: gentle center zoom on end card / CTA
make_clip "$FRAMES/05-endcard.jpg" 8.0 "$CLIPS/h05.mp4" \
  "'min(1.0+0.0011*on,1.13)'" \
  "'iw/2-(iw/zoom/2)'" \
  "'ih/2-(ih/zoom/2)'"

DEST="$OUT/verdansc-motion-ad-30s-16x9.mp4"

ffmpeg -y -hide_banner -loglevel error \
  -i "$CLIPS/h01.mp4" \
  -i "$CLIPS/h02.mp4" \
  -i "$CLIPS/h03.mp4" \
  -i "$CLIPS/h04.mp4" \
  -i "$CLIPS/h05.mp4" \
  -f lavfi -t 30 -i anullsrc=channel_layout=stereo:sample_rate=48000 \
  -filter_complex "[0:v][1:v]xfade=transition=fade:duration=0.5:offset=5.0[v01]; \
[v01][2:v]xfade=transition=fade:duration=0.5:offset=10.0[v02]; \
[v02][3:v]xfade=transition=fade:duration=0.5:offset=15.5[v03]; \
[v03][4:v]xfade=transition=fade:duration=0.5:offset=22.0[vout]" \
  -map "[vout]" -map 5:a \
  -c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium -profile:v high -movflags +faststart \
  -c:a aac -b:a 128k -shortest \
  "$DEST"

# Canonical artifact names expected by LinkedIn + this task
cp -f "$DEST" /opt/cursor/artifacts/verdansc_motion_ad_30s_16x9.mp4
cp -f "$DEST" /opt/cursor/artifacts/verdansc_higgsfield_ad_30s.mp4

echo "Wrote $DEST"
ffprobe -v error -show_entries format=duration,size -show_entries stream=codec_name,width,height,avg_frame_rate,nb_frames -of default "$DEST"
md5sum "$DEST" "$ROOT/exports/verdansc-split-ad-30s-16x9.mp4" /opt/cursor/artifacts/verdansc_motion_ad_30s_16x9.mp4 /opt/cursor/artifacts/verdansc_higgsfield_ad_30s.mp4
ls -lh "$DEST" /opt/cursor/artifacts/verdansc_*.mp4
