#!/bin/bash
# Kanha ASA product story (9:16, 1080x1920). Usage: bash make_story.sh
set -e
cd "$(dirname "$0")"
F=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf
FS=/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf
GOLD=0xF5C542
# seg <name> <src> <start> <dur> <caption>
seg() {
  ffmpeg -y -loglevel error -ss "$3" -t "$4" -i "raw/$2" -filter_complex "
  [0:v]split[a][b];
  [a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=30:5,eq=brightness=-0.15[bg];
  [b]scale=1080:1920:force_original_aspect_ratio=decrease[fg];
  [bg][fg]overlay=(W-w)/2:(H-h)/2,setsar=1,fps=30,
  drawbox=x=0:y=1450:w=iw:h=230:color=black@0.55:t=fill,
  drawtext=fontfile=$F:text='$5':fontcolor=$GOLD:fontsize=68:x=(w-tw)/2:y=1530:alpha='min(1,t/0.4)',
  fade=t=in:st=0:d=0.3,fade=t=out:st=$(echo "$4-0.3"|bc):d=0.3[v]" \
  -map "[v]" -an -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p "seg/$1.mp4"
}
seg 1 WhatsApp-Video-2025-09-23-at-10.21.11-AM.mp4 0.5 3.5 "Asli Nepali Rudraksha"
seg 2 WhatsApp-Video-2025-10-08-at-1.19.01-PM.mp4 2 3.5 "Har dana haath se check"
seg 3 WhatsApp-Video-2025-10-29-at-4.32.37-PM.mp4 40 3.5 "Gauri Shankar Rudraksha"
seg 4 WhatsApp-Video-2026-11-08-at-2.37.39-PM.mp4 3 4 "Lab certificate ke saath"
seg 5 video-2.mp4 4 4 "Certified Gemstones bhi"
# end card
ffmpeg -y -loglevel error -f lavfi -i "color=c=0x2a1606:s=1080x1920:d=4:r=30" -vf "
 drawtext=fontfile=$FS:text='Kanha ASA':fontcolor=$GOLD:fontsize=130:x=(w-tw)/2:y=700:alpha='min(1,t/0.5)',
 drawtext=fontfile=$F:text='Rudraksha | Gemstones | Astrology':fontcolor=white:fontsize=44:x=(w-tw)/2:y=880:alpha='min(1,(t-0.4)/0.5)',
 drawtext=fontfile=$F:text='Call / WhatsApp':fontcolor=white@0.8:fontsize=46:x=(w-tw)/2:y=1080:alpha='min(1,(t-0.8)/0.5)',
 drawtext=fontfile=$F:text='91318 05622':fontcolor=$GOLD:fontsize=96:x=(w-tw)/2:y=1150:alpha='min(1,(t-0.8)/0.5)',
 drawtext=fontfile=$F:text='kanhaasa.com':fontcolor=white:fontsize=54:x=(w-tw)/2:y=1320:alpha='min(1,(t-1.2)/0.5)',
 fade=t=in:st=0:d=0.3,format=yuv420p" -c:v libx264 -crf 20 seg/6.mp4
printf "file '%s.mp4'\n" 1 2 3 4 5 6 > seg/list.txt
# soft drone music (generated) so story isn't silent
ffmpeg -y -loglevel error -f concat -safe 0 -i seg/list.txt -f lavfi -i "sine=f=196:d=30,volume=0.05" -f lavfi -i "sine=f=294:d=30,volume=0.03" \
 -filter_complex "[1][2]amix=inputs=2,afade=t=in:d=1,afade=t=out:st=21:d=1.5[a]" -map 0:v -map "[a]" -shortest -c:v copy -c:a aac -b:a 128k -movflags +faststart export/kanha-asa-story-v1.mp4
