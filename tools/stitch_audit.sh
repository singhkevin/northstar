#!/bin/bash
# Re-stitch the main-page film from the audit clips (2 Nov 2026):
#   a1 drone approach (0-5) + a2 over site (5-10) + a3 drone exits behind tower (10-15)
#   + a4 corridor, humanoid emerges (15-20) + a5 humanoid walks past camera (20-25)
#   + the original quadruped shot (old film 20.1667 s to end, ~5 s)  => film-1600-c.mp4 / film-960-c.mp4 + poster
set -e
cd "$(dirname "$0")/.."
A=assets/audit/out; T=assets/audit/tmp; mkdir -p $T
norm() { ffmpeg -v error -y -i "$1" -an -vf "scale=1600:900:force_original_aspect_ratio=increase,crop=1600:900,fps=24,setsar=1" -c:v libx264 -preset fast -crf 16 -pix_fmt yuv420p "$2"; }
norm $A/a1-drone-approach.mp4 $T/01.mp4
norm $A/a2-drone-over-site.mp4 $T/02.mp4
norm $A/a3-drone-exits.mp4 $T/03.mp4
norm $A/a4-humanoid-emerges.mp4 $T/04.mp4
norm $A/a5-humanoid-walks-past.mp4 $T/05.mp4
ffmpeg -v error -y -ss 20.1667 -i site-v2/media/film-1600-b.mp4 -an -vf "fps=24,setsar=1" -c:v libx264 -preset fast -crf 16 -pix_fmt yuv420p $T/06.mp4
printf "file '01.mp4'\nfile '02.mp4'\nfile '03.mp4'\nfile '04.mp4'\nfile '05.mp4'\nfile '06.mp4'\n" > $T/list.txt
ffmpeg -v error -y -f concat -safe 0 -i $T/list.txt -c:v libx264 -preset slow -crf 20 -g 24 -bf 2 -pix_fmt yuv420p -movflags +faststart site-v2/media/film-1600-c.mp4
ffmpeg -v error -y -i site-v2/media/film-1600-c.mp4 -vf "scale=960:-2:flags=lanczos" -c:v libx264 -preset slow -crf 23 -g 24 -bf 2 -pix_fmt yuv420p -movflags +faststart site-v2/media/film-960-c.mp4
ffmpeg -v error -y -i site-v2/media/film-1600-c.mp4 -frames:v 1 -q:v 4 site-v2/media/poster-c.jpg
for f in $T/0?.mp4 site-v2/media/film-1600-c.mp4; do printf "%s  " "$f"; ffprobe -v error -show_entries format=duration -of csv=p=0 "$f"; done
ls -la site-v2/media/film-*-c.mp4 | awk '{print $5,$9}'
