/* 8.2 route highlights: same sidebar DOM across all pages. */
(()=>{'use strict';
 const sectionTabs=[['textbook','tab_textbook','교과서 학습'],['timeline','tab_timeline','역사 연표'],['museum','tab_museum','사료 박물관'],['story','tab_explore','역사 탐험']];
 function refresh(){const page=(location.hash||'#home').slice(1).split('?')[0];
  const view=document.getElementById('view');
  if(view&&['textbook','timeline','museum','story'].includes(page)&&!view.querySelector('#gameCanvas')){
   let quick=view.querySelector('#v82-quicknav');
   if(!quick){
    quick=document.createElement('nav');quick.id='v82-quicknav';quick.className='v82-quicknav';quick.setAttribute('aria-label','역사 학습 화면 빠른 이동');
    quick.innerHTML=sectionTabs.map(([r,img,label])=>'<button type="button" data-route="'+r+'" aria-label="'+label+'"><img src="assets/ui/redrawn/history/'+img+'.png" alt="" draggable="false"></button>').join('');
    const header=view.querySelector('.pagehead');if(header)header.insertAdjacentElement('afterend',quick);else view.prepend(quick);
   }
   for(const btn of quick.querySelectorAll('button')){
    const on=btn.dataset.route===page;btn.classList.toggle('selected',on);btn.setAttribute('aria-current',on?'page':'false');
   }
  }
  for(const b of document.querySelectorAll('.v82-nav-item')){
   const target=b.dataset.aGo==='arcade'?'arcade':b.dataset.route;
   const isNotes=page==='notes'&&target==='notes';
   const isQuiz=(page==='quiz'||page.startsWith('arcade'))&&target==='arcade';
   const on=isNotes?b.dataset.uiFocus===(window.__dmdNotesFocus||'wrong'):(isQuiz||target===page);
   b.classList.toggle('active',!!on);b.setAttribute('aria-current',on?'page':'false');
  }
 }
 window.addEventListener('hashchange',()=>queueMicrotask(refresh));
 const view=document.getElementById('view');if(view)new MutationObserver(()=>queueMicrotask(refresh)).observe(view,{childList:true});
 refresh();
})();
