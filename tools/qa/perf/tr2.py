import json,sys,collections
d=json.load(open(sys.argv[1])); ev=d['traceEvents'] if isinstance(d,dict) else d
cnt=collections.Counter((e.get('pid'),e.get('tid')) for e in ev if e.get('name')=='FireAnimationFrame')
main=cnt.most_common(1)[0][0]
tn={(e['pid'],e['tid']):e['args']['name'] for e in ev if e.get('name')=='thread_name'}
print('main thread',tn.get(main))
m=[e for e in ev if (e.get('pid'),e.get('tid'))==main and e.get('ph')=='X']
c=collections.Counter(); n=collections.Counter()
for e in m: c[e['name']]+=e.get('dur',0); n[e['name']]+=1
for k,v in c.most_common(18): print('%8.0f ms %6d  %s'%(v/1000,n[k],k))
big=sorted(m,key=lambda e:-e.get('dur',0))[:5]
for t in big:
  ts,te=t['ts'],t['ts']+t['dur']; inner=collections.Counter()
  for e in m:
    if e is t or e['ts']<ts or e['ts']+e.get('dur',0)>te: continue
    a=e.get('args',{}).get('data',{}); k=e['name']
    if k in('FunctionCall','FireAnimationFrame','TimerFire','EventDispatch','v8.callFunction'): k+=' '+str(a.get('functionName',''))+':'+str(a.get('lineNumber',''))+' '+str(a.get('type',''))
    inner[k]+=e.get('dur',0)
  print('LONGEST %s %.0f ms'%(t['name'],t['dur']/1000)); [print('     %6.1f %s'%(v/1000,k)) for k,v in inner.most_common(7)]
# Layouts inside FireAnimationFrame = forced sync layouts from our rAF code
fa=[(e['ts'],e['ts']+e['dur']) for e in m if e['name']=='FireAnimationFrame']
import bisect; fa.sort(); starts=[a for a,b in fa]
lay=collections.Counter(); layms=collections.Counter()
for e in m:
  if e['name'] in('Layout','UpdateLayoutTree'):
    i=bisect.bisect_right(starts,e['ts'])-1
    if i>=0 and e['ts']<=fa[i][1]: lay[e['name']]+=1; layms[e['name']]+=e['dur']
print('Layout/style forced inside rAF callbacks:',dict(lay),{k:round(v/1000) for k,v in layms.items()},'ms; rAF callbacks:',len(fa))
