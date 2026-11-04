import {createRequire} from 'module'; const {chromium}=createRequire('/usr/')('playwright');
import {wire} from './route.mjs'; import fs from 'fs';
const [,, variant='base', device='desktop', traceOut=''] = process.argv;
const html0 = fs.readFileSync('/home/user/northstar/site-v2/index.html','utf8');
let html = html0;
if (variant.includes('nowobble')) { const a='if (g.kind === \'stop\' && !reduce) t ='; if(!html.includes(a)) throw 'wobble marker'; html=html.replace(a,'if (false) t ='); }
if (variant.includes('noblur')) html=html.replace('</head>','<style>*{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}</style></head>');
const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});
const mob = device==='mobile';
const ctx=await b.newContext(mob?{viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:true,hasTouch:true,userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'}:{viewport:{width:1440,height:900}});
await wire(ctx);
if (variant.includes('nolenis')) await ctx.route(/unpkg\.com\/lenis/, r=>r.fulfill({contentType:'application/javascript',body:'/* lenis removed */'}));
await ctx.route(/localhost:8123\/(index\.html)?(\?.*)?$/, r=>r.fulfill({contentType:'text/html',body:html}));
await ctx.addInitScript(()=>{
  const M=window.__M={frames:[],long:[],seeks:[],seekStarts:0,wheel:[],samples:[],pres:[]}; window.__pt=-1;
  new PerformanceObserver(l=>l.getEntries().forEach(e=>M.long.push([e.startTime,e.duration]))).observe({type:'longtask',buffered:true});
  let last=0; const tick=t=>{ if(last) M.frames.push([t,t-last]); last=t; const f=document.getElementById('film');
    if (window.__rec) { let s={t,y:scrollY}; try{ s.tgt=S.target; s.cur=S.cur; s.ls=lastSeek; s.ct=f.currentTime; s.sk=f.seeking; s.rs=f.readyState; s.g=segAt(S.cur).name; const gt=segAt(S.target); s.gt=gt.name; s.w=filmTime(gt,band(S.target,gt.p0,gt.p1)); s.pt=window.__pt; }catch(e){} M.samples.push(s);} requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
  addEventListener('wheel',()=>M.wheel.push(performance.now()),{capture:true,passive:true});
  document.addEventListener('DOMContentLoaded',()=>{ const f=document.getElementById('film'); let s0=0;
    f.addEventListener('seeking',()=>{s0=performance.now(); M.seekStarts++;}); f.addEventListener('seeked',()=>M.seeks.push([s0,performance.now()-s0])); const cb=(n,md)=>{ window.__pt=md.mediaTime; if(window.__rec) M.pres.push([n,md.mediaTime]); f.requestVideoFrameCallback(cb); }; f.requestVideoFrameCallback(cb); });
});
const page=await ctx.newPage(); const errs=[]; page.on('pageerror',e=>errs.push(e.message));
const cdp=await ctx.newCDPSession(page); await cdp.send('Performance.enable');
if (mob) await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
await page.goto('http://localhost:8123/',{waitUntil:'load'});
await page.waitForFunction(()=>!document.getElementById('loader'),null,{timeout:30000});
await page.waitForTimeout(1500);
const info=await page.evaluate(()=>({st:ScrollTrigger.getAll().length, lenis:!!window.lenis||typeof lenis!=='undefined'&&!!lenis, H:document.documentElement.scrollHeight, film:document.getElementById('film').currentSrc.split('/').pop(), videos:[...document.querySelectorAll('video')].map(v=>[v.id,v.preload,(v.currentSrc||'').split('/').pop(),v.paused])}));
const met=async()=>Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(m=>[m.name,m.value]));
const phases={};
async function phase(name, fn){ await page.evaluate(()=>{__M.frames=[];__M.long=[];__M.seeks=[];__M.seekStarts=0;__M.samples=[];__M.wheel=[];__M.pres=[];window.__rec=1;});
  const m0=await met(); const t0=Date.now(); await fn(); const wall=Date.now()-t0; const m1=await met();
  const M=await page.evaluate(()=>{window.__rec=0; return __M;});
  const ft=M.frames.map(f=>f[1]).sort((a,b)=>a-b), q=p=>ft.length?ft[Math.min(ft.length-1,Math.floor(p*ft.length))]:0;
  const sd=M.seeks.map(s=>s[1]).sort((a,b)=>a-b), qs=p=>sd.length?sd[Math.min(sd.length-1,Math.floor(p*sd.length))]:0;
  // stalls: wheel active (event within 100ms) but scrollY unchanged for >=150ms
  let stall=0, stallMax=0, run=null; const sm=M.samples;
  for(let i=1;i<sm.length;i++){ const active=M.wheel.some(w=>w<=sm[i].t&&sm[i].t-w<100); if(active&&sm[i].y===sm[i-1].y){ if(run===null) run=sm[i-1].t; } else { if(run!==null){const d=sm[i-1].t-run; if(d>=150){stall++; stallMax=Math.max(stallMax,d);} run=null;} } }
  // film lag: how far the displayed frame trails the time the page asked for (seconds of film), sampled each frame in film segments
  const lag=sm.filter(s=>s.ls>=0&&s.ct!==undefined&&!['scan','plat','toworld','brand','contact'].includes(s.g)).map(s=>Math.abs(s.ls-s.ct)); lag.sort((a,b)=>a-b);
  const easeLag=sm.filter(s=>s.tgt!==undefined).map(s=>Math.abs(s.tgt-s.cur)*(document=>0)(0)+Math.abs(s.tgt-s.cur)); easeLag.sort((a,b)=>a-b);
  const FS=['intro','d1','trans1','enter','walk0','h1','walk1','trans2','walk2','q1','depart'];
  const fs=sm.filter(s=>FS.includes(s.gt)&&s.w!==undefined&&s.pt>=0); const lat=[]; const err=[];
  for(let i=0;i<fs.length;i++){ err.push(Math.abs(fs[i].w-fs[i].pt)); const dir=Math.sign(fs[i].w-fs[i].pt); if(Math.abs(fs[i].w-fs[i].pt)<1/24){lat.push(0);continue;}
    let j=i+1; for(;j<fs.length;j++){ if((fs[j].pt-fs[i].w)*dir>=-1/24) break; } if(j<fs.length) lat.push(fs[j].t-fs[i].t); }
  lat.sort((a,b)=>a-b); err.sort((a,b)=>a-b); const ql=(a,p)=>a.length?+a[Math.min(a.length-1,Math.floor(p*a.length))].toFixed(a===err?2:0):null;
  const presRate = M.pres.length/(wall/1000);
  phases[name]={picture_trails_scroll_p50_ms:ql(lat,.5), picture_trails_scroll_p95_ms:ql(lat,.95), film_err_p95_s:ql(err,.95), film_frames_shown_per_s:+presRate.toFixed(1), wall_s:+(wall/1000).toFixed(1), frames:ft.length, fps:+(ft.length/(wall/1000)).toFixed(1), frame_p50:+q(.5).toFixed(1), frame_p95:+q(.95).toFixed(1), frame_max:+q(1).toFixed(0), frames_over_50ms:ft.filter(x=>x>50).length, frames_over_100ms:ft.filter(x=>x>100).length,
    longtasks:M.long.length, longtask_ms:Math.round(M.long.reduce((a,l)=>a+l[1],0)), seeks:M.seekStarts, seeks_per_s:+(M.seekStarts/(wall/1000)).toFixed(1), seek_p50_ms:+qs(.5).toFixed(0), seek_p95_ms:+qs(.95).toFixed(0), seek_max_ms:+qs(1).toFixed(0),
    scroll_stalls_150ms:stall, stall_max_ms:Math.round(stallMax), film_lag_p95_s:lag.length?+lag[Math.floor(.95*lag.length)].toFixed(2):null,
    layouts:m1.LayoutCount-m0.LayoutCount, style_recalcs:m1.RecalcStyleCount-m0.RecalcStyleCount, layout_ms:Math.round((m1.LayoutDuration-m0.LayoutDuration)*1000), style_ms:Math.round((m1.RecalcStyleDuration-m0.RecalcStyleDuration)*1000), script_ms:Math.round((m1.ScriptDuration-m0.ScriptDuration)*1000), task_ms:Math.round((m1.TaskDuration-m0.TaskDuration)*1000)};
}
const H=info.H, vh=mob?844:900;
const wheelTo=async(target, step=60, dt=16)=>{ if(mob){ // touch: use scrollBy in steps (no real touch inertia)
    let y=await page.evaluate(()=>scrollY); const dir=Math.sign(target-y); while((target-y)*dir>0){ await page.mouse.wheel(0,dir*step); await page.waitForTimeout(dt); y+=dir*step; } return; }
  let y=await page.evaluate(()=>scrollY); const dir=Math.sign(target-y); while((target-y)*dir>0){ await page.mouse.wheel(0,dir*step); await page.waitForTimeout(dt); y+=dir*step; } };
if (traceOut) await b.startTracing(page,{path:traceOut,categories:['devtools.timeline','disabled-by-default-devtools.timeline','blink.user_timing','media']});
const pD1 = await page.evaluate(()=>{const g=SEGS.d1; return (g.p0+g.p1)/2*(sec.offsetHeight-innerHeight);});
const pQ1 = await page.evaluate(()=>{const g=SEGS.q1; return (g.p0+g.p1)/2*(sec.offsetHeight-innerHeight);});
const pPlat = await page.evaluate(()=>{const g=SEGS.plat; return (g.p0+g.p1)/2*(sec.offsetHeight-innerHeight);});
await phase('1_idle_at_top_3s', ()=>page.waitForTimeout(3000));
await phase('2_scroll_to_drone_stop', ()=>wheelTo(pD1));
await page.waitForTimeout(2500);
await phase('3_idle_at_drone_stop_5s', ()=>page.waitForTimeout(5000));
await phase('4_scroll_forward_to_quadruped_stop', ()=>wheelTo(pQ1));
await page.waitForTimeout(2500);
await phase('5_idle_at_quadruped_stop_5s', ()=>page.waitForTimeout(5000));
await phase('6_scroll_forward_to_platform', ()=>wheelTo(pPlat));
await page.waitForTimeout(2500);
await phase('7_idle_on_platform_5s', ()=>page.waitForTimeout(5000));
await phase('8_scroll_forward_to_end', ()=>wheelTo(H-vh));
await page.waitForTimeout(2000);
await phase('9_scroll_backward_to_top', ()=>wheelTo(0));
await page.waitForTimeout(1500);
await phase('10_fast_flick_forward_to_humanoid', ()=>wheelTo(pD1*3.2, 240, 16));
if (traceOut) await b.stopTracing();
console.log(JSON.stringify({variant,device,info,errs,phases}));
await b.close();
