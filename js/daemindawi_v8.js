/* Keep the same sidebar across every route, including arcade routes. */
(()=>{'use strict';
 const R=()=>location.hash.slice(1).split('?')[0]||'home';
 function refresh(){const r=R();document.body.classList.toggle('dmd-home-route',r==='home');document.body.classList.toggle('dmd-mode-route',r==='arcade');document.body.classList.toggle('dmd-other-route',r!=='home'&&r!=='arcade');
 const menu=document.getElementById('sidebar');if(!menu)return;
 if(window.DAEMIN_ASSETS){document.querySelectorAll('img[src^="assets/ui/daemindawi/"]').forEach(img=>{const k=img.getAttribute('src'),data=window.DAEMIN_ASSETS[k];if(data)img.src=data;});}
 menu.querySelectorAll('.dmd-sidebar-hit').forEach(btn=>{let active=false;if(r.startsWith('arcade'))active=btn.dataset.aGo==='arcade';else if(r==='notes')active=btn.dataset.route==='notes'&&btn.dataset.uiFocus===(window.__dmdNotesFocus||'wrong');else active=btn.dataset.route===r;btn.classList.toggle('active',active);btn.setAttribute('aria-current',active?'page':'false');});
 }
 document.addEventListener('click',e=>{const b=e.target.closest?.('[data-ui-focus]');if(b){window.__dmdNotesFocus=b.dataset.uiFocus;queueMicrotask(refresh);}const menuBtn=e.target.closest?.('.dmd-sidebar-hit');if(menuBtn){document.getElementById('sidebar')?.classList.remove('open');document.getElementById('overlay')?.classList.remove('active');}});
 window.addEventListener('hashchange',()=>queueMicrotask(refresh));
 const view=document.getElementById('view');if(view)new MutationObserver(()=>queueMicrotask(refresh)).observe(view,{childList:true});
 refresh();
})();
