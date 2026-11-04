import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--mute-audio','--autoplay-policy=no-user-gesture-required']});
for(const [w,h,m] of [[1440,900,false],[390,844,true]]){const p=await b.newPage();await p.setViewport({width:w,height:h,isMobile:m,hasTouch:m});const bad=[],errs=[];p.on('response',r=>{if(r.status()>=400)bad.push(r.status()+' '+r.url())});p.on('requestfailed',r=>{const e=r.failure()?.errorText;if(e!=='net::ERR_ABORTED')bad.push('failed '+r.url()+' '+e)});p.on('pageerror',e=>errs.push(e.message));
await p.goto('https://northstar.viralinbound.in/ref/',{waitUntil:'load',timeout:90000});await new Promise(r=>setTimeout(r,11000));
const a=await p.evaluate(()=>({title:document.title,loader:!!document.querySelector('#loader'),h:document.documentElement.scrollHeight,film:document.querySelector('#film')?.currentSrc,brokenImgs:[...document.images].filter(i=>i.complete&&!i.naturalWidth&&i.loading!=='lazy').map(i=>i.src)}));
await p.screenshot({path:`ref-${w}.jpg`,quality:70});
await p.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight*.45));await new Promise(r=>setTimeout(r,2500));await p.screenshot({path:`ref-${w}b.jpg`,quality:70});
console.log(w,JSON.stringify(a),'bad:',bad.slice(0,8),'errs:',errs.slice(0,3));await p.close();}
await b.close();
