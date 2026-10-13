window.CHAGShop=(function(){
 const $=s=>document.querySelector(s);
 const money=n=>'$'+n.toLocaleString('en-US');
 const esc=x=>String(x==null?'':x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const STATUS_DEFAULT={coming_soon:'New product coming soon',unavailable:'Currently unavailable',discontinued:'Discontinued'};
 const CATALOG='https://ysqbsalasmeufdifvxfh.supabase.co/functions/v1/chag-checkout/catalog';
 function loadCatalog(){
  return fetch(CATALOG).then(r=>{if(!r.ok)throw Error('Catalog unavailable');return r.json()}).then(d=>{
   const FB=window.CHAG_FALLBACK||{};
   const arr=Array.isArray(d)?d:(d.products||[]);
   return arr.map(p=>({uuid:p.id,id:(p.sku||'').toLowerCase(),sku:p.sku,name:p.name,price:(p.regular_cents||0)/100,neighborPrice:p.bulk_cents!=null?(p.bulk_cents||0)/100:null,bulkThreshold:p.bulk_threshold||0,maxQuantity:Math.max(0,Math.min(999,Number(p.max_quantity)||0)),available:p.available,status:p.status||'available',orderable:p.orderable!==false&&(p.status||'available')==='available',c:p.content||{},image:p.image_url||FB[p.sku]||''}));
  });
 }
 const units=cart=>Object.values(cart||{}).reduce((a,b)=>a+(+b||0),0);
 const unitPrice=(p,cart)=>p.neighborPrice!=null&&p.bulkThreshold&&units(cart)>=p.bulkThreshold?p.neighborPrice:p.price;
 function calc(PS,cart){let lines=[],tot=0,base=0;(PS||[]).forEach(p=>{const q=+((cart||{})[p.id])||0;if(q>0){const u=unitPrice(p,cart);lines.push({p,q,u});tot+=q*u;base+=q*p.price}});return{lines,tot,base,save:base-tot}}
 return{$,money,esc,STATUS_DEFAULT,loadCatalog,units,unitPrice,calc};
})();
