import puppeteer from 'puppeteer-core';
const base=process.argv[2];
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const out=[];
for (const [w,h,m] of [[1680,1050],[1536,864],[1440,900],[1366,768],[1280,720]]) {
 const p=await b.newPage(); await p.setViewport({width:w,height:h,isMobile:!!m,hasTouch:!!m});
 for (const s of ['d1','h1','q1']) { await p.goto(`${base}?seg=${s}&u=.5`,{waitUntil:'load',timeout:90000}); await new Promise(r=>setTimeout(r,1800));
  const a=await p.evaluate(s=>{const st=STOP.find(q=>q.seg===SEGS[s]),r=st.pnl.getBoundingClientRect(),[x0,y0]=fmap(0,0),[x1,y1]=fmap(100,100);const b=st.box,[bx0,by0]=fmap(b[0],b[1]),[bx1,by1]=fmap(b[2],b[3]);const hd=document.querySelector('#hdr').getBoundingClientRect().bottom,rail=document.querySelector('#rail').getBoundingClientRect();return {w:innerWidth,h:innerHeight,pl:(r.left-x0)/(x1-x0)*100,pt:(r.top-y0)/(y1-y0)*100,pr:(r.right-x0)/(x1-x0)*100,pb:(r.bottom-y0)/(y1-y0)*100,bx0,by0,bx1,by1,hd,pnlBottom:r.bottom,railTop:rail.top,k:kCur}},s);
  out.push({w,h,s,...a}); }
 await p.close(); }
await b.close();
console.log(JSON.stringify(out));
