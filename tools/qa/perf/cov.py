import re,sys
SP=sys.argv[1]
f=open(SP+'/founders.txt').read()
norm=lambda s: re.sub(r'[^a-z0-9]+',' ',s.lower().replace('&amp;','&')).strip()
cur=norm(open(SP+'/text-cur.txt').read().replace('\n',' '))
ref=norm(open(SP+'/text-ref.txt').read().replace('\n',' '))
# paragraphs -> sentences and pipe items
paras=[re.sub(r'\s+',' ',p).strip() for p in re.split(r'\n\s*\n',f) if p.strip()]
units=[]
for p in paras:
    if re.match(r'^\d\d\. ',p) or p in('FOOTER','NORTHSTAR'): continue
    if ':' in p and '|' in p:
        lab,rest=p.split(':',1); units+= [x.strip() for x in rest.split('|')]
    elif '|' in p: units+=[x.strip(' []') for x in p.split('|')]
    else: units+= [s.strip() for s in re.split(r'(?<=[.!?])\s+',p) if s.strip()]
words=lambda s: len(s.split())
tot=cw=rw=0; nc=nr=0; miss=[]
for u in units:
    n=norm(u); 
    if not n: continue
    w=words(u); tot+=w
    c= n in cur; r= n in ref
    cw+= w if c else 0; rw+= w if r else 0; nc+=c; nr+=r
    if not r: miss.append(u)
print('units',len(units),'words',tot)
print('current page: units',nc,'words',cw, f'{cw/tot:.0%}')
print('/ref page: units',nr,'words',rw, f'{rw/tot:.0%}')
print('NOT verbatim on /ref:'); [print(' -',m) for m in miss]
