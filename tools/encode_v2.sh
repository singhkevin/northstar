#!/bin/bash
# Encode Northstar v2 clips: seamless loop (tail cross-fades into head), 1080 + 720 H.264, poster jpg.
# usage: encode_v2.sh <name> [loop|bridge] ...   reads assets/v2/video/<name>.mp4 -> site-v2/v2/media/<name>-{1080,720}.mp4 + <name>.jpg
set -e
cd "$(dirname "$0")/.."
OUT=site-v2/v2/media
while [ $# -gt 0 ]; do
  n=$1; kind=${2:-loop}; shift; shift || true
  in=assets/v2/video/$n.mp4
  D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$in")
  if [ "$kind" = loop ]; then
    OFF=$(python3 -c "print(max(0.1, $D-1.0))")
    FC="[0:v]trim=0.5,setpts=PTS-STARTPTS[m];[0:v]trim=0:0.5,setpts=PTS-STARTPTS[h];[m][h]xfade=transition=fade:duration=0.5:offset=$OFF,format=yuv420p[v]"
  else
    FC="[0:v]format=yuv420p[v]"
  fi
  ffmpeg -v error -y -i "$in" -filter_complex "$FC;[v]split=2[a][b];[a]scale=1920:-2:flags=lanczos[a1];[b]scale=1280:-2:flags=lanczos[b1]" \
    -map "[a1]" -an -c:v libx264 -preset slow -crf 20 -g 48 -bf 2 -movflags +faststart "$OUT/$n-1080.mp4" \
    -map "[b1]" -an -c:v libx264 -preset slow -crf 22 -g 48 -bf 2 -movflags +faststart "$OUT/$n-720.mp4"
  ffmpeg -v error -y -i "$OUT/$n-1080.mp4" -frames:v 1 -q:v 4 "$OUT/$n.jpg"
  echo "encoded $n ($kind, src ${D}s)"
done
