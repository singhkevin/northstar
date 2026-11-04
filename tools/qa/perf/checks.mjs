import {createRequire} from 'module'; const {chromium}=createRequire('/usr/')('playwright');
import {wire} from './route.mjs';
const b=await chromium.launch(); const out={};
for (const [W,H] of [[1440,900],[1280,720]]) {
const ctx=await b.newContext({viewport:{width:W,height:H}}); await wire(ctx); const page=await ctx.newPage(); const errs=[]; page.on('pageerror',e=>errs.push(e.message));
await ctx.addInitScript(()=>{ window.__fn={}; });
await page.goto('http://localhost:8123/'); await page.waitForFunction(()=>!document.getElementById('loader'),null,{timeout:30000});
// time the one-off heavy functions
await page.evaluate(()=>{ for (const n of ['cloudSample','miniBuild','cloudDraw','scenePlat','sceneBrand']) { const f=window[n]; if(typeof f!=='function') continue; window[n]=function(...a){const s=performance.now(); const r=f.apply(this,a); const d=performance.now()-s; const o=__fn[n]||(__fn[n]={calls:0,max:0,total:0}); o.calls++; o.total+=d; o.max=Math.max(o.max,d); return r;}; } });
const jump=async(name,frac)=>{ await page.evaluate(([n,f])=>{const g=SEGS[n]; const y=(g.p0+(g.p1-g.p0)*f)*(sec.offsetHeight-innerHeight); lenis.scrollTo(y,{immediate:true});},[name,frac]); await page.waitForTimeout(1800); };
// 11E: Flagged panel at the moment the platform first becomes visible
const issueVis=[]; for (const f of [.62,.75,.9,1.0]) { await jump('scan',Math.min(f,.999)); issueVis.push(await page.evaluate(()=>{ const r=[...document.querySelectorAll('#issues .issue')]; return {platOpacity:getComputedStyle(document.getElementById('pwrap')).opacity, issuesVisible:r.filter(e=>+getComputedStyle(e).opacity>0.5).length, of:r.length}; })); }
await jump('plat',.3);
const ctl={}; 
for (const sel of ['#siteList button','#siteList li','#siteList a','#siteList [role=tab]','#siteList > *']) { const n=await page.locator(sel).count(); if(n){ctl.siteSel=sel; ctl.sites=n; break;} }
const res=[];
for (let i=0;i<(ctl.sites||0);i++){ const el=page.locator(ctl.siteSel).nth(i); await el.click(); await page.waitForTimeout(700); res.push(await page.evaluate(()=>({img:(document.querySelector('#map img')||{}).src?.split('/').pop(), pins:document.querySelectorAll('#pins > *').length, issues:document.querySelectorAll('#issues .issue').length, first:document.querySelector('#issues .issue')?.innerText.split('\n')[0]}))); }
ctl.siteResults=res;
const views=[]; const vsel='#viewList > *'; const nv=await page.locator(vsel).count();
for (let i=0;i<nv;i++){ const el=page.locator(vsel).nth(i); const label=(await el.innerText()).trim(); await el.click(); await page.waitForTimeout(900); views.push(await page.evaluate(l=>({label:l, mapClass:document.getElementById('map').className, feedTitle:document.getElementById('feedTitle').innerText, scrollY:scrollY}),label)); }
ctl.views=views;
const y0=await page.evaluate(()=>scrollY); await page.locator('#pins > *').first().click(); await page.waitForTimeout(600);
ctl.pinPopup=await page.evaluate(()=>{const p=document.getElementById('pop'); return {opacity:getComputedStyle(p).opacity, text:p.innerText.slice(0,80)};}); ctl.scrollMovedOnClick=(await page.evaluate(()=>scrollY))-y0;
// 11F ghost: visplat during brand
const ghost=[]; for (const f of [.55,.6,.65,.7,.75]) { await jump('brand',f); ghost.push(await page.evaluate(()=>+getComputedStyle(document.getElementById('visplat')).opacity)); }
// 11G rail vs footer overlap in contact
const ov=[]; for (const f of [.3,.6,.9,.99]) { await jump('contact',f); ov.push(await page.evaluate(()=>{ const a=document.getElementById('rail').getBoundingClientRect(), f=document.querySelector('.cfoot').getBoundingClientRect(); const x=Math.max(0,Math.min(a.right,f.right)-Math.max(a.left,f.left)), y=Math.max(0,Math.min(a.bottom,f.bottom)-Math.max(a.top,f.top)); return {overlapPx:Math.round(x*y), footOpacity:getComputedStyle(document.querySelector('.cfoot')).opacity}; })); }
// form: submit empty, then filled
await jump('contact',.6);
const form=await page.evaluate(async()=>{ const f=document.querySelector('#contactScene form'); const btn=f.querySelector('button[type=submit],button:not([type])'); btn.click(); await new Promise(r=>setTimeout(r,400)); const inv=[...f.querySelectorAll(':invalid')].map(e=>e.name||e.id); const note=document.getElementById('formNote').innerText; return {invalidAfterEmptySubmit:inv, note}; });
await page.fill('#contactScene input[name=name], #contactScene #name', 'Test').catch(()=>{});
out[`${W}x${H}`]={errs, issueVis, ctl, ghostOpacity:ghost, railFooterOverlap:ov, form, fnTimes:await page.evaluate(()=>__fn)};
await ctx.close(); }
console.log(JSON.stringify(out,null,1)); await b.close();
