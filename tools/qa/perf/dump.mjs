import {createRequire} from 'module'; const {chromium}=createRequire('/usr/')('playwright'); import {wire} from './route.mjs'; import fs from 'fs';
const b=await chromium.launch(); const ctx=await b.newContext({viewport:{width:1440,height:900}}); await wire(ctx);
for (const [path,out] of [['/','cur'],['/ref/','ref']]) {
  const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('http://localhost:8123'+path,{waitUntil:'load'}); await p.waitForTimeout(1500);
  const t=await p.evaluate(()=>{ const out=[]; const skip=new Set(['SCRIPT','STYLE','NOSCRIPT','SVG','svg']);
    const walk=(n,depth)=>{ for(const c of n.childNodes){ if(c.nodeType===3){const s=c.textContent.replace(/\s+/g,' ').trim(); if(s) out.push(s);} else if(c.nodeType===1&&!skip.has(c.tagName)){ if(/^(H[1-6]|P|LI|BUTTON|A|LABEL|SPAN|DT|DD|TD|TH|DIV|SECTION|OPTION)$/.test(c.tagName)&&c.id) out.push('#'+c.id); walk(c,depth+1);} } };
    walk(document.body,0); return out.join('\n'); });
  fs.writeFileSync(`/tmp/claude-0/-home-user-northstar/9a6162df-3175-5f63-8c7b-2e0208350630/scratchpad/text-${out}.txt`,t);
  console.log(path,'lines',t.split('\n').length,'errors',errs);
}
await b.close();
