import puppeteer from 'puppeteer-core';
const base = process.argv[2], outd = process.argv[3];
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--mute-audio','--autoplay-policy=no-user-gesture-required'] });
const R = []; const ok = (vp, name, pass, extra='') => { R.push([vp,name,pass,extra]); console.log(pass?'PASS':'FAIL', vp, name, extra); };
const sleep = ms => new Promise(r => setTimeout(r, ms));
for (const [w,h,touch] of [[1440,900,false],[1280,720,false],[820,1180,true],[390,844,true]]) {
  const vp = `${w}x${h}`, p = await b.newPage();
  await p.setViewport({ width:w, height:h, deviceScaleFactor:1, isMobile:touch, hasTouch:touch });
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(`${base}?seg=plat&u=.5`,{waitUntil:'load',timeout:120000}); await sleep(5500);
  const press = async sel => { // a real pointer press at the element's on-screen spot, only if it is really on top
    const pt = await p.evaluate(s=>{const e=typeof s==='string'?document.querySelector(s):s; e.scrollIntoView&&0; const r=e.getBoundingClientRect(); const x=r.left+r.width/2,y=r.top+r.height/2; const t=document.elementFromPoint(x,y); return {x,y,top:!!t&&(t===e||e.contains(t)||t.contains(e)),inView:y>0&&y<innerHeight,tag:t&&t.className};},sel);
    if(!pt.inView||!pt.top) return pt;
    if(touch) await p.touchscreen.tap(pt.x,pt.y); else { await p.mouse.move(pt.x,pt.y); await p.mouse.down(); await p.mouse.up(); }
    await sleep(450); return pt;
  };
  const nth = async (list,i) => `${list} > :nth-child(${i+1})`;
  const state = () => p.evaluate(()=>({site:SV.site,view:SV.view,sel:SV.sel,img:document.querySelector('#mapImg').getAttribute('src'),pins:document.querySelectorAll('#pins .pin').length,title:document.querySelector('#feedTitle').textContent,first:document.querySelector('#issues').firstElementChild?.textContent.slice(0,40),tag:document.querySelector('#maptag').textContent,pop:!document.querySelector('#pop').hidden,popT:document.querySelector('#pop').textContent.slice(0,30),hash:location.hash,t:film.currentTime,y:scrollY,active:[...document.querySelectorAll('#siteList button')].findIndex(x=>x.classList.contains('on')),vOn:[...document.querySelectorAll('#viewList button')].map(x=>x.classList.contains('on'))}));
  // on phones the dashboard slides up with the scroll, so walk to where the control is
  const reach = async sel => { await p.evaluate(s=>{const e=document.querySelector(s);const r=e.getBoundingClientRect();const rail=document.querySelector('#rail').getBoundingClientRect().top; const hd=document.querySelector('#hdr').getBoundingClientRect().bottom; const g=SEG.find(x=>x.name==='plat'),H=sec.offsetHeight-innerHeight; const u=band(S.cur,g.p0,g.p1); const card=pwrap.scrollHeight,avail=innerHeight-pwrap.offsetTop-railRoom(); const over=Math.max(0,card-avail); if(!isPhone()||over===0)return; const relY=r.top-pwrap.getBoundingClientRect().top; const want=Math.max(0,relY-(hd+40-pwrap.offsetTop)); const v=Math.min(1,want/over); const uu=.3+v*.62; const y=(g.p0+(g.p1-g.p0)*uu)*H; window.scrollTo(0,y);},sel); await sleep(1100); };
  const SITES=[['Riverside','s-site.jpg'],['North Depot','s-aerial.jpg'],['Solar','s-scan.jpg'],['Plant Room','s-plant.jpg']];
  for (const i of [1,2,3,0]) { await reach(`#siteList > :nth-child(${i+1})`); const pt=await press(`#siteList > :nth-child(${i+1})`); await sleep(500); const s=await state(); ok(vp,`site ${SITES[i][0]}`, s.site===i&&s.img.includes(SITES[i][1])&&s.active===i&&s.pins===4&&!s.hash, pt.top?'':'not on top:'+pt.tag); }
  // views
  for (const [i,k,lab] of [[0,'v3d','3D model'],[1,'cmp','Compare'],[2,'rep','Reports']]) { await reach(`#viewList > :nth-child(${i+1})`); const pt=await press(`#viewList > :nth-child(${i+1})`); const s=await state(); ok(vp,`view ${lab}`, s.view===k&&s.vOn[i]&&!s.hash, pt.top?'':'not on top:'+pt.tag); if(k==='rep') ok(vp,'reports list names the site', s.title==='Reports'&&(await p.evaluate(()=>document.querySelector('#issues').textContent)).length>20); }
  // persistence: pick a site while on Reports, switch view, site stays
  await reach('#siteList > :nth-child(3)'); await press('#siteList > :nth-child(3)'); let s=await state(); ok(vp,'site change keeps Reports open', s.site===2&&s.view==='rep', (await p.evaluate(()=>document.querySelector('#issues').firstElementChild.textContent.slice(0,60))));
  ok(vp,'reports names the selected site', (await p.evaluate(()=>document.querySelector('#issues').textContent)).includes('Solar Field East'));
  await reach('#viewList > :nth-child(1)'); await press('#viewList > :nth-child(1)'); s=await state(); ok(vp,'site kept on switching to 3D', s.site===2&&s.view==='v3d');
  await press('#viewList > :nth-child(1)'); s=await state(); ok(vp,'clicking active view returns to map', s.view==='map'&&s.site===2&&s.title==='Flagged');
  // compare slider
  await reach('#viewList > :nth-child(2)'); await press('#viewList > :nth-child(2)'); await p.evaluate(()=>{const c=document.querySelector('#cmp');c.value=30;c.dispatchEvent(new Event('input',{bubbles:true}));}); ok(vp,'compare slider moves', await p.evaluate(()=>document.querySelector('#map').style.getPropertyValue('--cmp')==='30%')); await press('#viewList > :nth-child(2)');
  // markers + findings
  await sleep(600);
  for (const i of [0,3]) { await reach(`#pins > :nth-child(${i+1})`); const pt=await press(`#pins > :nth-child(${i+1})`); const st=await state(); const f=await p.evaluate(k=>SITES[SV.site].f[k].t,i); const hl=await p.evaluate(k=>document.querySelectorAll('#issues .issue')[k].classList.contains('sel')&&document.querySelectorAll('#pins .pin')[k].classList.contains('sel'),i); ok(vp,`map marker ${i+1}`, st.sel===i&&st.pop&&st.popT.startsWith(f.slice(0,20))&&hl, pt.top?'':'not on top:'+pt.tag); await press(`#pins > :nth-child(${i+1})`); }
  await sleep(400);
  for (const i of [1,2]) { await reach(`#issues > :nth-child(${i+1})`); const pt=await press(`#issues > :nth-child(${i+1})`); const st=await state(); const onpin=await p.evaluate(k=>document.querySelectorAll('#pins .pin')[k].classList.contains('sel'),i); ok(vp,`flagged issue ${i+1}`, st.sel===i&&st.pop&&onpin, pt.top?'':'not on top:'+pt.tag); await press(`#issues > :nth-child(${i+1})`); }
  // keyboard
  await p.evaluate(()=>{document.querySelector('#siteList > :nth-child(2)').focus()}); await p.keyboard.press('Enter'); await sleep(400); s=await state(); ok(vp,'keyboard Enter on site',s.site===1);
  await p.evaluate(()=>{document.querySelector('#issues > :nth-child(1)').focus()}); await p.keyboard.press('Enter'); await sleep(300); s=await state(); ok(vp,'keyboard Enter on flagged issue',s.sel===0); await p.keyboard.press('Enter');
  await p.evaluate(()=>{document.querySelector('#pins > :nth-child(2)').focus()}); await p.keyboard.press('Space'); await sleep(300); s=await state(); ok(vp,'keyboard Space on marker',s.sel===1);
  // hold: film doesn't move, page does scroll
  const t0=(await state()).t; const y0=(await state()).y; await sleep(1200); ok(vp,'background stable during hold',Math.abs((await state()).t-t0)<.01);
  if(!touch){ await p.mouse.move(w/2,h/2); await p.mouse.wheel({deltaY:600}); await sleep(900); const y1=(await state()).y; ok(vp,'wheel over dashboard still scrolls',y1>y0+100,`${y0}->${y1}`);} 
  ok(vp,'hover/active styling present',await p.evaluate(()=>{const sh=[...document.styleSheets].flatMap(x=>{try{return [...x.cssRules].map(r=>r.cssText)}catch(e){return[]}}).join();return /\.issue[^{]*:hover|\.issue[^{]*\.sel/.test(sh)&&/\.side[^{]*button[^{]*:hover|button:hover/.test(sh)}));
  await p.screenshot({path:`${outd}/plat-${w}.jpg`,quality:70});
  // contact
  await p.goto(`${base}?seg=contact&u=.6`,{waitUntil:'load',timeout:120000}); await sleep(4000);
  const sub=()=>p.evaluate(()=>{document.querySelector('#demoForm').requestSubmit();});
  const fs=()=>p.evaluate(()=>({errs:[...document.querySelectorAll('#demoForm .ferr')].map(x=>x.textContent),note:document.querySelector('#formNote').textContent,focus:document.activeElement.name,live:document.querySelector('#contactScene').classList.contains('live')}));
  await sub(); await sleep(200); let c=await fs(); ok(vp,'empty form: two inline errors, focus on name',c.errs.length===2&&c.focus==='name',c.errs.join(' / '));
  await p.evaluate(()=>{const f=document.querySelector('#demoForm');f.elements.name.value='Test';f.elements.name.dispatchEvent(new Event('input',{bubbles:true}));f.elements.email.value='abc@';f.elements.email.dispatchEvent(new Event('input',{bubbles:true}));}); await sub(); await sleep(200); c=await fs(); ok(vp,'bad email rejected',c.errs.length===1&&c.focus==='email',c.errs.join());
  await p.evaluate(()=>{const f=document.querySelector('#demoForm');f.elements.email.value='a@b.co';f.elements.email.dispatchEvent(new Event('input',{bubbles:true}));}); await sub(); await sleep(200); c=await fs(); ok(vp,'valid form clears errors; states it is not sending yet',c.errs.length===0&&/not taking/.test(c.note),c.note);
  ok(vp,'focus ring on inputs',await p.evaluate(()=>{const i=document.querySelector('#demoForm input');i.blur();const a=getComputedStyle(i).borderColor+getComputedStyle(i).outlineStyle+getComputedStyle(i).boxShadow;i.focus();return a!==getComputedStyle(i).borderColor+getComputedStyle(i).outlineStyle+getComputedStyle(i).boxShadow;}));
  const rc=await p.evaluate(()=>{const a=document.querySelector('#rail').getBoundingClientRect();const items=[...document.querySelectorAll('#demoForm .btn,.cfoot span,.cfoot img')].map(e=>e.getBoundingClientRect());return {hit:items.some(r=>r.bottom>a.top&&r.top<a.bottom&&r.right>a.left&&r.left<a.right&&r.bottom>0&&r.top<innerHeight),n:document.querySelector('#rail').querySelectorAll('a').length,on:document.querySelector('#rail a.on')?.textContent}}); ok(vp,'chapter bar: 7 labels, Contact active',rc.n===7&&rc.on==='Contact'); 
  await p.goto(`${base}?seg=contact&u=1`,{waitUntil:'load',timeout:120000}); await sleep(3000); const rc2=await p.evaluate(()=>{const a=document.querySelector('#rail').getBoundingClientRect();const items=[...document.querySelectorAll('#demoForm .btn,.cfoot span,.cfoot img')].map(e=>({r:e.getBoundingClientRect(),t:e.textContent||'img'}));return items.filter(({r})=>r.bottom>a.top&&r.top<a.bottom&&r.right>a.left&&r.left<a.right).map(x=>x.t.slice(0,20))}); ok(vp,'chapter bar clear of form/footer at end',rc2.length===0,rc2.join());
  await p.screenshot({path:`${outd}/contact-${w}.jpg`,quality:70});
  // rail click + backward
  await p.goto(`${base}?seg=contact&u=.4`,{waitUntil:'load',timeout:120000}); await sleep(3000);
  await press('#rail a:nth-child(3)'); await sleep(3500); let a=await p.evaluate(()=>({on:document.querySelector('#rail a.on')?.textContent,seg:segAt(S.cur).name})); ok(vp,'chapter click goes back to Humanoid',a.on==='Humanoid',JSON.stringify(a));
  await press('#rail a:nth-child(1)'); await sleep(3500); a=await p.evaluate(()=>({on:document.querySelector('#rail a.on')?.textContent,y:scrollY})); ok(vp,'Brand returns to top',a.on==='Brand'&&a.y<50,JSON.stringify(a));
  ok(vp,'timecode gone',await p.evaluate(()=>!document.querySelector('#tc,#tcw,.tc')));
  ok(vp,'no page errors',errs.length===0,errs.slice(0,2).join('|'));
  await p.close();
}
const fails=R.filter(r=>!r[2]); console.log(`\n${R.length-fails.length}/${R.length} passed`); fails.forEach(f=>console.log('FAIL',f.join(' | ')));
await b.close();
