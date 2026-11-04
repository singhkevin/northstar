import {createRequire} from 'module'; const {chromium}=createRequire('/usr/')('playwright');
import {wire} from './route.mjs';
const b=await chromium.launch(); const out={};
for (const variant of ['base','nolenis']) {
  const ctx=await b.newContext({viewport:{width:1440,height:900}}); await wire(ctx);
  if (variant==='nolenis') await ctx.route(/unpkg\.com\/lenis/, r=>r.fulfill({contentType:'application/javascript',body:''}));
  const page=await ctx.newPage(); await page.goto('http://localhost:8123/'); await page.waitForFunction(()=>!document.getElementById('loader'),null,{timeout:30000});
  await page.evaluate(()=>{ const f=document.getElementById('film'); window.__pt=-1; const cb=(n,m)=>{window.__pt=m.mediaTime; f.requestVideoFrameCallback(cb);}; f.requestVideoFrameCallback(cb); });
  const res=[];
  for (const seg of ['walk0','trans1','trans2','walk2']) {
    await page.evaluate(n=>{const g=SEGS[n]; const y=(g.p0+(g.p1-g.p0)*.2)*(sec.offsetHeight-innerHeight); if(window.lenis||typeof lenis!=='undefined'&&lenis) lenis.scrollTo(y,{immediate:true}); else scrollTo(0,y);}, seg);
    await page.waitForTimeout(2500); await page.mouse.move(700,450);
    for (let i=0;i<8;i++){ await page.mouse.wheel(0,100); await page.waitForTimeout(16); }
    const r=await page.evaluate(()=>new Promise(res=>{ const t0=performance.now(); let L={y:scrollY,c:S.cur,p:__pt}, lc={y:0,c:0,p:0};
      const tick=()=>{ const t=performance.now()-t0; if(scrollY!==L.y){L.y=scrollY;lc.y=t;} if(Math.abs(S.cur-L.c)>1e-6){L.c=S.cur;lc.c=t;} if(Math.abs(__pt-L.p)>1/48){L.p=__pt;lc.p=t;}
        if(t>3000) return res({scroll_settles_ms:Math.round(lc.y), timeline_settles_ms:Math.round(lc.c), picture_settles_ms:Math.round(lc.p)}); requestAnimationFrame(tick); }; requestAnimationFrame(tick); }));
    res.push([seg,r]);
  }
  out[variant]=res; await ctx.close();
}
console.log(JSON.stringify(out)); await b.close();
