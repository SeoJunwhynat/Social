/* 6.2: Resolve EVERY quiz reference from the actual embedded textbook asset manifest.
   When no image is attached to a question, the nearest unit overview is labelled as such,
   not falsely presented as a reproduced historical source. */
(()=>{'use strict';
const d=window.HISTORY_DATA;if(!d)return;
const escapeHTML=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pages={'광복·정부 수립':7,'전쟁·전후':13,'민주주의·산업화':20,'민주화 운동':24,'남북관계·현대':34};
const clues=[[/6[·.\-]?25|전쟁|인천\s*상륙|정전/,13],[/4[·.\-]?19|부정\s*선거/,18],[/5[·.\-]?18|광주/,23],[/6월\s*민주|6[·.\-]?10|직선제|6[·.\-]?29|이한열|박종철/,24],[/1972|유신|7[·.\-]?4\s*남북/,21],[/경제\s*개발|공단|수출|산업화/,25],[/제헌|5[·.\-]?10|1948|남북\s*협상/,8],[/1945|광복|해방|신탁\s*통치/,4],[/남북\s*정상|6[·.\-]?15|2000년/,34]];
function resolve(q){const p=Number(q?.textbookPage)||Number(String(q?.materialImage||'').match(/textbook\/(\d{3})\.webp/)?.[1]);let n=p;if(!n){const prompt=String(q?.prompt||'');n=clues.find(v=>v[0].test(prompt))?.[1]||pages[q?.era]||7;}n=Math.min(44,Math.max(1,n));return {page:n,asset:d.assets.find(a=>a.group==='textbook'&&Number(a.index)===n),attached:!!p};}
function render(q,compact=false){const r=resolve(q);if(!r.asset)return `<p class="v62-no-source" role="status">참고 자료 이미지를 찾을 수 없습니다. 박물관의 교과서 탭을 확인하세요.</p>`;
 const label=r.attached?`교과서 연계 자료 · ${r.page}번 캡처`:`관련 단원 참고 · ${r.page}번 캡처`;
 const note=r.attached?'문항과 연결된 참고 교과서 화면입니다.':'이 문항에 원문 사료가 지정되어 있지 않아 관련 단원 화면을 표시합니다. 문제 원문 이미지와 동일한 자료는 아닙니다.';
 const key=`t${String(r.page).padStart(3,'0')}`;
 return `<figure class="v62-question-material${compact?' compact':''}"><figcaption><span>📖 ${escapeHTML(label)}</span><span class="v62-reference-type">${r.attached?'연계 이미지':'단원 개요'}</span></figcaption><img src="${escapeHTML(r.asset.path)}" alt="${escapeHTML(label)}" loading="eager" decoding="async" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><p class="v62-image-error" hidden>이미지가 표시되지 않습니다. 전체 프로젝트 ZIP을 완전히 압축 해제했는지 확인해 주세요.</p><div class="v62-material-foot"><small>${escapeHTML(note)}</small><button type="button" class="v62-zoom" data-v62-image="${key}">↗ 자료 전체 화면 보기</button></div></figure>`;}
function show(id){const asset=d.assets.find(x=>x.id===id&&x.group==='textbook');if(!asset)return;document.getElementById('v62ImageOverlay')?.remove();const node=document.createElement('div');node.id='v62ImageOverlay';node.className='v62-image-overlay';node.setAttribute('role','dialog');node.setAttribute('aria-modal','true');node.setAttribute('aria-label','교과서 자료 전체 화면 확대');node.innerHTML=`<div class="v62-image-bar"><strong>교과서 ${Number(asset.index)}번 화면 · 원본 비율</strong><button type="button" class="v62-image-close" data-v62-close>닫기 ✕</button></div><img src="${escapeHTML(asset.path)}" alt="교과서 화면 원본" />`;document.body.append(node);node.querySelector('button').focus();}
document.addEventListener('click',e=>{const btn=e.target.closest('[data-v62-image],[data-v62-close]');if(btn?.dataset.v62Image){e.preventDefault();show(btn.dataset.v62Image)}else if(btn?.hasAttribute('data-v62-close')||e.target.id==='v62ImageOverlay'){document.getElementById('v62ImageOverlay')?.remove();}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.getElementById('v62ImageOverlay')){e.preventDefault();e.stopImmediatePropagation();document.getElementById('v62ImageOverlay').remove();}},true);
// 교과서 페이지는 퀴즈에 표시하지 않으므로 자료 렌더러로 등록하지 않습니다.
})();
