/* v10.0 Remove native mouseover tooltip boxes while preserving accessible button names. */
(() => {
 'use strict';
 function clean(root=document){
   if(!root?.querySelectorAll)return;
   for(const el of root.querySelectorAll('button[title],a[title],[role="button"][title]')){
     if(!el.hasAttribute('aria-label'))el.setAttribute('aria-label',el.getAttribute('title'));
     el.removeAttribute('title');
   }
 }
 function init(){
   clean();
   const target=document.body;
   if(target)new MutationObserver(records=>{
     for(const r of records){
       if(r.type==='attributes'&&r.target.matches?.('button[title],a[title],[role="button"][title]')){
         const el=r.target;if(!el.hasAttribute('aria-label'))el.setAttribute('aria-label',el.getAttribute('title'));el.removeAttribute('title');
       }else if(r.addedNodes.length){for(const n of r.addedNodes){if(n.nodeType!==1)continue; if(n.matches?.('button[title],a[title],[role="button"][title]')){if(!n.hasAttribute('aria-label'))n.setAttribute('aria-label',n.getAttribute('title'));n.removeAttribute('title')}clean(n)}}
     }
   }).observe(target,{subtree:true,childList:true,attributes:true,attributeFilter:['title']});
 }
 document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init,{once:true}):init();
})();
