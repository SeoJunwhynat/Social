/* 한국사 7.5 · UI navigation state layer. Keeps 7.4 study logic unchanged. */
(()=>{'use strict';
let noteFocus='wrong';
const page=()=>location.hash.slice(1).split('?')[0]||'home';
function refreshActive(){const route=page();let isArcade=route.startsWith('arcade');
 document.querySelectorAll('#sidebar .nav-btn').forEach(btn=>{
  let active=false;
  if(isArcade){active=btn.dataset.aGo==='arcade'}
  else if(route==='notes'){active=btn.dataset.route==='notes'&&btn.dataset.uiFocus===noteFocus}
  else{active=btn.dataset.route===route}
  btn.classList.toggle('active',active);
 });
 document.querySelectorAll('.mobile-ui-dock button').forEach(btn=>{
  const active=isArcade?btn.dataset.aGo==='arcade':btn.dataset.route===route;
  btn.classList.toggle('active',active);
 });
 if(route==='notes'){
  const target=document.getElementById(noteFocus==='wrong'?'ui-notes-wrong':'ui-notes-records');
  if(target&&window.__historyNoteFocusPending){window.__historyNoteFocusPending=false;target.scrollIntoView({block:'start',behavior:'instant'});}
 }
}
document.addEventListener('click',e=>{
 const el=e.target.closest?.('[data-ui-focus]');if(el){noteFocus=el.dataset.uiFocus;window.__historyNoteFocusPending=true;queueMicrotask(refreshActive)}
});
window.addEventListener('hashchange',()=>queueMicrotask(refreshActive));
const view=document.getElementById('view');if(view){const observer=new MutationObserver(()=>queueMicrotask(refreshActive));observer.observe(view,{childList:true});}
queueMicrotask(refreshActive);
})();
