// A person browsing: real wheel / touch / keys at random, resting at random places. Audits every rest.
import puppeteer from 'puppeteer-core';
import fs from 'fs';
const [,, BASE, who, seedArg, outRoot = 'human'] = process.argv;
const P = { reader:{w:1440,h:900}, flicker:{w:1920,h:1080}, impatient:{w:1366,h:768}, phone:{w:390,h:844,touch:true,slow:true}, tablet:{w:820,h:1180,touch:true} }[who];
let seed = +(seedArg||7); const R=()=>(seed=(seed*16807)%2147483647)/2147483647, rnd=(a,b)=>a+(b-a)*R(), sleep=ms=>new Promise(r=>setTimeout(r,ms));
const OUT=`${outRoot}/${who}`; fs.mkdirSync(OUT,{recursive:true});
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--mute-audio','--autoplay-policy=no-user-gesture-required']});
const p=await b.newPage(); await p.setViewport({width:P.w,height:P.h,deviceScaleFactor:1,isMobile:!!P.touch,hasTouch:!!P.touch});
const cdp=await p.createCDPSession();
if(P.slow){await p.setCacheEnabled(false);await cdp.send('Network.enable');await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:60,downloadThroughput:10e6/8,uploadThroughput:5e6/8});}
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
const t0=Date.now();await p.goto(BASE,{waitUntil:'domcontentloaded',timeout:60000});await p.waitForFunction(()=>!document.querySelector('#loader'),{timeout:60000});const loaderMs=Date.now()-t0;
const audit=()=>p.evaluate(()=>{
 const op=el=>{let o=1;for(let e=el;e&&e!==document.documentElement;e=e.parentElement){const c=getComputedStyle(e);if(c.visibility==='hidden'||c.display==='none')return 0;o*=+c.opacity}return o};
 const items=[],w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 while(w.nextNode()){const n=w.currentNode,s=n.textContent.trim();if(s.length<2)continue;const el=n.parentElement;if(['SCRIPT','STYLE','NOSCRIPT','OPTION'].includes(el.tagName)||el.closest('.c0.out .w'))continue;const o=op(el);if(o<.2)continue;const ra=document.createRange();ra.selectNodeContents(n);const r=ra.getBoundingClientRect();if(!r.width||!r.height||r.bottom<0||r.top>innerHeight||r.right<0||r.left>innerWidth)continue;const bl=el.closest('.pnl,.cap,.phead,.pwrap,.bwrap,.cwrap,.rail,.tc,header,.hint,.c0')||el;items.push({s:s.slice(0,34),l:r.left,t:r.top,r:r.right,b:r.bottom,bk:bl.id||bl.className||bl.tagName})}
 const clash=[];for(let i=0;i<items.length;i++)for(let j=i+1;j<items.length;j++){const A=items[i],B=items[j];if(A.bk===B.bk)continue;const ow=Math.min(A.r,B.r)-Math.max(A.l,B.l),oh=Math.min(A.b,B.b)-Math.max(A.t,B.t);if(ow<=2||oh<=2)continue;const sm=Math.min((A.r-A.l)*(A.b-A.t),(B.r-B.l)*(B.b-B.t));if(ow*oh/sm>.15)clash.push(`${A.s} [${A.bk}] x ${B.s} [${B.bk}]`)}
 const g=segAt(S.cur),h=document.querySelector('header').getBoundingClientRect(),tg=document.querySelector('#tgt'),tr=tg.getBoundingClientRect();
 const pnl=[...document.querySelectorAll('.stop.on .pnl')].map(e=>+getComputedStyle(e).opacity)[0];
 return {y:Math.round(scrollY),p:+S.cur.toFixed(4),seg:g.name,u:+((S.cur-g.p0)/(g.p1-g.p0)).toFixed(2),t:+film.currentTime.toFixed(2),pnl:pnl??null,loopA:+getComputedStyle(loop).opacity,nav:[...document.querySelectorAll('nav a.on')].map(a=>a.textContent).join(),rail:[...document.querySelectorAll('.rail div.on')].map(a=>a.textContent).join(),railShown:document.querySelector('#rail').classList.contains('show'),tagHitsHeader:+getComputedStyle(tg).opacity>.1&&tr.top-26<h.bottom,clash:[...new Set(clash)]}});
const rests=[];let n=0;
const rest=async(label,ms)=>{await sleep(ms??rnd(500,2400));const a=await audit();a.label=label;a.shot=`${String(n++).padStart(3,'0')}-${a.seg}-${label}`.replace(/[^\w-]/g,'');await p.screenshot({path:`${OUT}/${a.shot}.jpg`,quality:62,type:'jpeg'});rests.push(a);return a};
const wheel=async(dy,parts=1,gap=30)=>{for(let i=0;i<parts;i++){await p.mouse.wheel({deltaY:dy/parts});await sleep(gap)}};
const swipe=(dy,speed=1400)=>cdp.send('Input.synthesizeScrollGesture',{x:P.w/2,y:P.h*.6,yDistance:-dy,speed,gestureSourceType:'touch'}).catch(()=>{});
const range=await p.evaluate(()=>document.querySelector('#top').offsetHeight-innerHeight);
const nearEnd=()=>p.evaluate(r=>scrollY>r*.985,range);const extra={};
await rest('landed',1200);
if(who==='reader'){await p.mouse.move(700,450);while(!(await nearEnd())){await wheel(100*Math.round(rnd(2,7)),Math.round(rnd(2,7)),70);await rest('read');if(R()<.16){await wheel(-100*Math.round(rnd(2,6)),3,60);await rest('backup')}if(rests.length>90)break}}
if(who==='flicker'){await p.mouse.move(960,500);while(!(await nearEnd())){const big=R()<.3;await wheel(big?rnd(1500,3600):rnd(150,800),big?26:12,16);await rest(big?'flick':'nudge',rnd(200,1600));if(R()<.25){await wheel(-rnd(500,1800),14,16);await rest('flickback',rnd(200,1000))}if(rests.length>70)break}await wheel(-range,60,16);await rest('allthewayback',2500)}
if(who==='impatient'){await p.mouse.move(683,400);
 await p.keyboard.press('PageDown');await rest('pgdn-400ms',400);for(let i=0;i<3;i++){await p.keyboard.press('PageDown');await rest('pgdn',500)}
 for(let i=0;i<3;i++){await p.keyboard.press('Space');await rest('space',400)}
 await p.keyboard.press('End');await rest('end-300ms',300);await rest('end-settled',2500);await p.keyboard.press('Home');await rest('home-300ms',300);await rest('home-settled',2500);
 const links=await p.$$('nav a');const order=[5,1,3,0,4,2];
 for(const k of order){await links[k].click().catch(()=>{});await rest('nav'+k+'-interrupted',rnd(300,900))}
 await p.keyboard.press('Home');await sleep(2500);await links[5].click();await rest('topjump-500ms',500);await sleep(3000);
 for(const k of order){await links[k].click().catch(()=>{});await rest('nav'+k+'-settled',3200)}
 await p.click('.logo').catch(()=>{});await rest('logo',3000);
 await p.evaluate(()=>{const g=SEGS.plat;scrollTo(0,(g.p0+(g.p1-g.p0)*.3)*(document.querySelector('#top').offsetHeight-innerHeight))});await rest('plat',2500);
 await p.click('#siteList button:nth-child(3)');extra.site=await p.evaluate(()=>document.querySelector('#siteList button.on')?.textContent);
 await p.evaluate(()=>scrollTo(0,0));await sleep(1800);await p.evaluate(()=>document.activeElement.blur());extra.tab=[];for(let i=0;i<14;i++){await p.keyboard.press('Tab');await sleep(60);extra.tab.push(await p.evaluate(()=>{const a=document.activeElement;let o=1;for(let e=a;e&&e!==document.documentElement;e=e.parentElement)o*=+getComputedStyle(e).opacity;return [a.tagName,(a.textContent||a.name||'').trim().slice(0,16),'op'+o.toFixed(1)].join(' ')}))}
 await p.evaluate(()=>{const g=SEGS.h1;scrollTo(0,(g.p0+(g.p1-g.p0)*.5)*(document.querySelector('#top').offsetHeight-innerHeight))});await rest('before-reload',2500);extra.yBefore=await p.evaluate(()=>scrollY);await p.reload({waitUntil:'domcontentloaded'});await p.waitForFunction(()=>!document.querySelector('#loader'),{timeout:40000});await rest('after-reload',1800);extra.yAfter=await p.evaluate(()=>scrollY);
 await p.setViewport({width:1100,height:700});await rest('resized-small',1500);await p.setViewport({width:1366,height:768});await rest('resized-back',1500)}
if(P.touch){while(!(await nearEnd())){const f=R()<.25;await swipe(f?rnd(1400,3000):rnd(250,800),f?3500:1200);await rest(f?'fling':'swipe',rnd(400,2000));if(R()<.14){await swipe(-rnd(300,900));await rest('swipeback',rnd(300,1200))}if(rests.length>90)break}}
const stops=rests.filter(r=>['d1','d2','h1','h2','q1','q2'].includes(r.seg)&&!/settled/.test(r.label));
const sum={who,vp:`${P.w}x${P.h}`,loaderMs,range,rests:rests.length,stops:stops.length,readable:stops.filter(r=>r.pnl>=.97).length,noText:stops.filter(r=>!r.pnl||r.pnl<.05).length,tagHits:rests.filter(r=>r.tagHitsHeader).map(r=>r.shot),clash:[...new Set(rests.flatMap(r=>r.clash.map(c=>r.seg+': '+c)))].slice(0,14),loopGhost:rests.filter(r=>r.p>.012&&r.loopA>.01).map(r=>r.shot),navWrong:rests.filter(r=>r.nav&&((r.t<15&&r.t>0&&r.seg==='trans1'&&r.nav!=='Drone')||(r.t>=15.1&&r.seg==='trans1'&&r.nav!=='Humanoid')||(r.t<24.9&&r.seg==='trans2'&&r.nav!=='Humanoid')||(r.t>25.2&&r.seg==='trans2'&&r.nav!=='Quadruped'))).map(r=>r.shot+' '+r.nav),railInContact:rests.filter(r=>r.seg==='contact'&&r.railShown).length,extra,errs:[...new Set(errs)]};
fs.writeFileSync(`${OUT}/rests.json`,JSON.stringify(rests,null,1));console.log(JSON.stringify(sum));await b.close();
