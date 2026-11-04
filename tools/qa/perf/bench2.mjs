import {createRequire} from 'module'; const {chromium}=createRequire('/usr/')('playwright');
const b=await chromium.launch(); const p=await b.newPage(); await p.goto('http://localhost:8124/bench.html'); const res={};
for (const rep of [1,2]) for (const f of ['g24','g6','g1']) res[f+'#'+rep]=await p.evaluate(async(src)=>{ const v=document.createElement('video'); v.muted=true; v.preload='auto'; document.body.append(v); v.src=src;
  await new Promise(r=>{v.addEventListener('canplaythrough',r,{once:true}); setTimeout(r,6000)}); await new Promise(r=>setTimeout(r,800));
  const step=[],jump=[]; let x=7; const rnd=()=>{x=(x*16807)%2147483647; return x/2147483647;};
  const sk=t=>new Promise(r=>{const s=performance.now(); const to=setTimeout(()=>r(3000),3000); v.addEventListener('seeked',()=>{clearTimeout(to); r(performance.now()-s)},{once:true}); v.currentTime=t;});
  let t=0.3; for(let i=0;i<60;i++){ t=(t+0.125)%19.5; step.push(await sk(t)); }
  for(let i=0;i<40;i++){ jump.push(await sk(0.2+rnd()*19)); }
  const q=(a,p)=>{a.sort((m,n)=>m-n); return Math.round(a[Math.min(a.length-1,Math.floor(p*a.length))]);};
  v.remove(); return {scroll_step_p50:q(step,.5),scroll_step_p95:q(step,.95),jump_p50:q(jump,.5),jump_p95:q(jump,.95)}; }, f+'.mp4');
console.log(JSON.stringify(res,null,0)); await b.close();
