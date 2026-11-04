// forward then backward through the whole page with real wheel input: state, dark frames, video loading
import puppeteer from 'puppeteer-core';
const base=process.argv[2];
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--mute-audio','--autoplay-policy=no-user-gesture-required']});
for(const [w,h,touch] of [[1440,900,false],[390,844,true]]){
 const p=await b.newPage();await p.setViewport({width:w,height:h,isMobile:touch,hasTouch:touch});
 const vids={};const errs=[];p.on('pageerror',e=>errs.push(e.message));
 p.on('request',r=>{const u=r.url();if(u.endsWith('.mp4')){const n=u.split('/').pop();vids[n]=vids[n]||{n:0};vids[n].n++;}});
 const t0=Date.now();await p.goto(base,{waitUntil:'domcontentloaded',timeout:90000});await p.waitForFunction(()=>!document.querySelector('#loader'),{timeout:60000});const loaded=(Date.now()-t0)/1000;
 await new Promise(r=>setTimeout(r,1500));const atStart=Object.keys(vids);
 const range=await p.evaluate(()=>document.querySelector('#top').offsetHeight-innerHeight);
 const N=70,fwd=[],back=[];
 const step=async i=>{const y=range*i/N;await p.evaluate(y=>{window.scrollTo(0,y)},y);await new Promise(r=>setTimeout(r,900));
  return p.evaluate(()=>{const g=segAt(S.target);return{seg:g.name,u:+band(S.target,g.p0,g.p1).toFixed(2),t:+film.currentTime.toFixed(2),seek:film.seeking,rail:document.querySelector('#rail a.on')?.textContent,nav:document.querySelector('header nav a.on')?.textContent,pnl:[...document.querySelectorAll('.stop.on .pnl')].map(e=>+(+getComputedStyle(e).opacity).toFixed(2))[0]??0,tgt:+getComputedStyle(tgt).opacity,visA:+getComputedStyle(vis).opacity,visT:+vis.currentTime.toFixed(2)}});};
 const lum=async()=>{const s=await p.screenshot({encoding:'base64',type:'jpeg',quality:30});return s};
 const shots=[];
 for(let i=0;i<=N;i++){fwd.push(await step(i));shots.push(await lum());}
 for(let i=N;i>=0;i--){back[i]=await step(i);}
 // film only ever moves one way while scrolling forward; panels only in stops
 let bad=[];for(let i=1;i<=N;i++){if(fwd[i].t<fwd[i-1].t-.5&&fwd[i].seg!=='toworld')bad.push(['film went backwards',i,fwd[i-1].t,fwd[i].t]);}
 for(let i=0;i<=N;i++){const a=fwd[i],c=back[i];if(a.seg!==c.seg||a.rail!==c.rail)bad.push(['fwd/back differ',i,a.seg,c.seg,a.rail,c.rail]);if(Math.abs(a.t-c.t)>.9&&a.seg!=='d1'&&a.seg!=='h1'&&a.seg!=='q1')bad.push(['film time differs',i,a.seg,a.t,c.t]);if(a.pnl>.02&&!['d1','h1','q1'].includes(a.seg))bad.push(['panel outside a stop',i,a.seg]);if(a.tgt>.02&&a.seg!=='h1')bad.push(['box outside stop',i,a.seg]);}
 const order=[...new Set(fwd.map(f=>f.rail))].join(' > ');
 const fs=await import('fs');const dir=`dir-${w}`;fs.mkdirSync(dir,{recursive:true});shots.forEach((s,i)=>fs.writeFileSync(`${dir}/${String(i).padStart(3,'0')}.jpg`,s,'base64'));
 console.log(JSON.stringify({vp:`${w}x${h}`,loaded,videosAtStart:atStart,videosTotal:vids,railOrder:order,bad,errs,sample:fwd.filter((_,i)=>i%10==0).map(f=>`${f.seg}:${f.t}`)},null,0));
 await p.close();
}
await b.close();
