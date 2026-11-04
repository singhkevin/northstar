import sys
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageOps
S=sys.argv[1]; F=S+'/frames/'; O=S+'/out/'
W,H=1280,720
drone=Image.open(S+'/drone-hero.png').convert('RGBA')
drone=drone.crop(drone.getbbox())
def plate(name, dark=1.0, blur=0):
    im=Image.open(F+name).convert('RGB')
    im=ImageOps.fit(im,(W,H),Image.LANCZOS)
    if dark!=1.0: im=ImageEnhance.Brightness(im).enhance(dark)
    if blur: im=im.filter(ImageFilter.GaussianBlur(blur))
    return im.convert('RGBA')
def rotors(d):
    # translucent spinning-rotor discs over the four motors (approx positions on the cropped drone)
    w,h=d.size; ov=Image.new('RGBA',d.size,(0,0,0,0)); dr=ImageDraw.Draw(ov)
    for (fx,fy,rw) in [(0.05,0.47,0.17),(0.62,0.08,0.18),(0.97,0.60,0.15),(0.40,0.45,0.0)]:
        if rw==0: continue
        cx,cy=fx*w,fy*h; rx,ry=rw*w,rw*w*0.22
        dr.ellipse([cx-rx,cy-ry,cx+rx,cy+ry],fill=(20,24,34,70),outline=(90,100,120,90),width=2)
    ov=ov.filter(ImageFilter.GaussianBlur(3))
    return Image.alpha_composite(d,ov) if False else Image.alpha_composite(ov,d) if False else _merge(d,ov)
def _merge(d,ov):
    base=Image.new('RGBA',d.size,(0,0,0,0)); base.alpha_composite(ov); base.alpha_composite(d); return base
def put(bg, width, cx, cy, flip=False, rot=0, dim=1.0, soft=0):
    d=drone.copy()
    if flip: d=ImageOps.mirror(d)
    s=width/d.size[0]; d=d.resize((int(d.size[0]*s),int(d.size[1]*s)),Image.LANCZOS)
    d=rotors(d)
    if rot: d=d.rotate(rot,resample=Image.BICUBIC,expand=True)
    if dim!=1.0:
        rgb=ImageEnhance.Brightness(d.convert('RGB')).enhance(dim); a=d.split()[3]; d=rgb.convert('RGBA'); d.putalpha(a)
    if soft: d=d.filter(ImageFilter.GaussianBlur(soft))
    # contact shadow glow under drone for grounding
    bg.alpha_composite(d,(int(cx-d.size[0]/2),int(cy-d.size[1]/2)))
    return bg
def save(im,name): im.convert('RGB').save(O+name,quality=84,optimize=True)

save(plate('hero-0.jpg'),'01-arrival.jpg')
save(put(plate('twin.jpg'),300,600,215,rot=-7),'02-lift.jpg')
save(put(plate('twin.jpg',dark=0.75),170,640,125,dim=0.9),'03-scan.jpg')
save(put(plate('iot-0.jpg'),250,640,335,flip=True,dim=0.85),'04-corridor.jpg')
save(put(plate('quad-2.2.jpg'),230,330,150,flip=True,dim=0.9),'05-handoff.jpg')
save(put(plate('humanoid-2.2.jpg'),160,230,165,dim=0.8),'06-alongside.jpg')
save(plate('night-0.jpg'),'07-nightwatch.jpg')
save(put(plate('construction-4.3.jpg',dark=0.9),430,640,470),'08-landing.jpg')
# also a tiny drone sprite for the HTML
d=drone.copy(); d.thumbnail((640,640)); d.save(O+'drone.png',optimize=True)
print('done')
