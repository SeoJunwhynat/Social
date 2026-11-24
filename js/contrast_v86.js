/* Keep route semantics stable without replacing the live '문제 풀기' menu with an unrelated image. */
(()=>{'use strict';
 const page=()=>decodeURIComponent((location.hash||'#home').slice(1).split('?')[0]);
 const update=()=>{
   const route=page();
   document.body.classList.toggle('v86-question-ui',route==='quiz'||route.startsWith('arcade'));
   document.body.classList.toggle('v86-question-active',route==='quiz'||route.startsWith('arcade'));
   document.querySelectorAll('.v83-nav-item[data-a-go="arcade"]').forEach(b=>{
     const active=route==='quiz'||route.startsWith('arcade');
     b.classList.toggle('active',active);
     b.setAttribute('aria-current',active?'page':'false');
     b.title='문제 풀기';
     b.querySelectorAll('img,.v83-nav-label').forEach(el=>el.style.removeProperty('opacity'));
   });
 };
 addEventListener('hashchange',()=>queueMicrotask(update));
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',update,{once:true});
 else update();
 const v=document.getElementById('view');
 if(v)new MutationObserver(()=>queueMicrotask(update)).observe(v,{childList:true});
})();
