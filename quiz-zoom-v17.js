/* 사회범 v17 문제 그래프 확대 — 채점 정보는 노출하지 않음 */
(()=>{
 const host=document.getElementById('graphQuestionFigure');if(!host)return;
 const onChange=()=>{if(host.hidden||!host.querySelector('svg')||host.querySelector('.sb17-quiz-zoom-btn'))return;
    const b=document.createElement('button');b.type='button';b.className='sb17-quiz-zoom-btn';b.textContent='🔎 문제 그래프 크게 보기';host.prepend(b);
 };
 const observer=new MutationObserver(onChange);observer.observe(host,{childList:true});
 const modal=document.createElement('div');modal.className='sb17-graph-modal';modal.hidden=true;
 modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-label','그래프 확대 보기');
 modal.innerHTML='<div class="sb17-graph-modal-inner"><div class="sb17-graph-modal-head"><strong>🔎 문제 그래프 확대</strong><button type="button" class="sb17-zoom-close">닫기 ✕</button></div><div class="sb17-graph-modal-scroll"></div><p>수요·공급·사회적 곡선의 교점을 직접 구해 보세요. 확대한 그래프는 읽기 전용입니다.</p></div>';
 document.body.appendChild(modal);
 host.addEventListener('click',e=>{if(!e.target.closest('.sb17-quiz-zoom-btn'))return;
    const svg=host.querySelector('svg');if(!svg)return;
    const area=modal.querySelector('.sb17-graph-modal-scroll');area.replaceChildren(svg.cloneNode(true));modal.hidden=false;
    modal.querySelector('button').focus();
 });
 modal.addEventListener('click',e=>{if(e.target===modal||e.target.closest('.sb17-zoom-close'))modal.hidden=true;});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)modal.hidden=true;});
})();