#!/bin/bash
# usage: journey.sh base outdir w h
IDS="intro:.02 intro:.7 d1:.5 trans1:.55 enter:.6 walk0:.9 h1:.5 walk1:.6 trans2:.5 walk2:.7 q1:.5 depart:.5 scan:.5 scan:.85 plat:.5 toworld:.7 brand:.2 brand:.66 brand:.88 contact:.5"
node shot4.mjs "$1" "$2" "$3" "$4" $IDS
python3 - "$IDS" "$2" "$3" "$4" <<'P'
import sys
from PIL import Image
ids=sys.argv[1].split(); d,w,h=sys.argv[2],sys.argv[3],int(sys.argv[4]); ww=int(w)
cols=4 if ww>h else 7; W=640 if ww>h else 270; H=int(W*h/ww); rows=(len(ids)+cols-1)//cols
c=Image.new('RGB',(W*cols,H*rows))
for i,n in enumerate(ids):
    c.paste(Image.open(f"{d}/{w}-{n.replace(':','_')}.jpg").resize((W,H)),(W*(i%cols),H*(i//cols)))
c.save(f'{d}/sheet.jpg',quality=84)
P
