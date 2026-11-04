import fs from 'fs';
const L=(process.env.NS_LIBS||'./libs/node_modules')+'/';
export async function wire(ctx){
  await ctx.route(/cdnjs\.cloudflare\.com.*gsap\.min\.js/, r=>r.fulfill({contentType:'application/javascript',body:fs.readFileSync(L+'gsap/dist/gsap.min.js')}));
  await ctx.route(/cdnjs\.cloudflare\.com.*ScrollTrigger\.min\.js/, r=>r.fulfill({contentType:'application/javascript',body:fs.readFileSync(L+'gsap/dist/ScrollTrigger.min.js')}));
  await ctx.route(/unpkg\.com\/lenis/, r=>r.fulfill({contentType:'application/javascript',body:fs.readFileSync(L+'lenis/dist/lenis.min.js')}));
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, r=>r.fulfill({status:200,contentType:'text/css',body:''}));
}
