(function(){
 const S=window.CHAGShop;
 const m=location.pathname.match(/^\/shop\/([a-z0-9-]+)\/?$/i);
 if(!m)return;
 const slug=m[1].toLowerCase();
 const host=document.getElementById('prodview');
 if(!host)return;
 let P=null;
 function notFound(){
  host.innerHTML='<div class="wrap page" style="text-align:center;padding:60px 0"><h1>Page <em>not found</em></h1><p class="lead" style="margin:0 auto 22px">That product does not exist.</p><div class="cta"><a class="btn" href="/shop/">Back to the shop</a></div></div>';
 }
 function render(){
  const p=P,c=p.c||{};
  const q=window.CHAGCart.read()[p.id]||0;
  const builtin=p.image&&p.image===((window.CHAG_FALLBACK||{})[p.sku]);
  const img=`<div class="product-photo ${builtin?'builtin':''}">${p.image?`<img src="${S.esc(p.image)}" alt="${S.esc(p.name)}">`:`<span>No photo yet</span>`}</div>`;
  const intro=(c.tagline?`<p class="tagline">${S.esc(c.tagline)}</p>`:'');
  const desc=(c.description?`<p class="desc">${S.esc(c.description)}</p>`:'');
  const cleanWu=html=>{const d=document.createElement('div');d.innerHTML=String(html);d.querySelectorAll('script,style,iframe,object,embed,link,meta').forEach(el=>el.remove());const OK={B:1,STRONG:1,BR:1,P:1,DIV:1,SPAN:1,FONT:1,I:1,EM:1};(function walk(n){[...n.children].forEach(el=>{walk(el);if(!OK[el.tagName]){el.replaceWith(...[...el.childNodes]);return;}const col=el.style.color||(el.tagName==='FONT'?el.getAttribute('color'):'');[...el.attributes].forEach(a=>el.removeAttribute(a.name));if(el.tagName==='FONT'||el.tagName==='DIV'){const t=document.createElement(el.tagName==='FONT'?'span':'p');if(col)t.style.color=col;t.append(...[...el.childNodes]);el.replaceWith(t);}else if(col)el.style.color=col;});})(d);return d.innerHTML;};
  const writeup=(c.writeup?`<div class="writeup">${String(c.writeup).includes('<')?cleanWu(c.writeup):String(c.writeup).split(/\n\s*\n/).map(x=>`<p>${S.esc(x.trim()).replace(/\n/g,'<br>')}</p>`).join('')}</div>`:'');
  const controls=p.orderable
   ?`<div class="pr">${S.money(p.price)} <small>${S.esc(c.price_note||'')}</small></div>${c.deal_text?`<div class="deal">${S.esc(c.deal_text)}</div>`:''}${p.available===false?`<p>${S.esc(c.out_of_stock_text||'Temporarily out of stock')}</p>`:''}<div class="qty big"><button type="button" data-pdec ${q===0?'disabled':''} aria-label="Less">-</button><span>${q}</span><button type="button" data-pinc ${p.available===false||q>=p.maxQuantity?'disabled':''} aria-label="More">+</button></div>`
   :`<div class="pr soon-t">${S.esc(c.status_text||S.STATUS_DEFAULT[p.status]||'Currently unavailable')}</div><div class="qty big off" aria-disabled="true"><button type="button" disabled aria-label="Less">-</button><span>0</span><button type="button" disabled aria-label="More">+</button></div>`;
  host.innerHTML=`<a class="back" href="/shop/">&larr; Back to shop</a><div class="prod${p.orderable?'':' soon'}">${img}<div class="b"><h1 style="font-size:clamp(28px,5vw,44px);margin:0">${S.esc(p.name)}</h1>${intro}${controls}${desc}${writeup}</div></div>`;
  document.title=p.name+' - Chag Solutions';
 }
 host.addEventListener('click',e=>{
  const t=e.target;
  if(!P)return;
  if(t.hasAttribute('data-pinc')&&!t.disabled){const q=window.CHAGCart.read()[P.id]||0;if(q<P.maxQuantity)window.CHAGCart.set(P.id,q+1)}
  if(t.hasAttribute('data-pdec')&&!t.disabled){const q=window.CHAGCart.read()[P.id]||0;if(q>0)window.CHAGCart.set(P.id,q-1)}
 });
 window.addEventListener('chag-cart',()=>{if(P)render()});
 S.loadCatalog().then(PS=>{
  const p=PS.find(x=>x.id===slug);
  if(!p){notFound();return}
  P=p;render();
 }).catch(()=>{host.innerHTML='<p class="lead">This page is having trouble loading. Please try again in a moment.</p>'});
})();
