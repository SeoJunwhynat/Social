/* 7.0: every supplied textbook screenshot indexed in real chronological file order.
   This viewer does not reproduce textbook text; notes are independently paraphrased.
   Quiz source matching is a topic recommendation, NOT verified quotation or exact source. */
(()=>{'use strict';
const d=window.HISTORY_DATA, pages=window.HISTORY_TEXTBOOK_INDEX;if(!d||!pages?.length)return;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=(n)=>String(n).padStart(2,'0');
const byOriginal=new Map(pages.map(p=>[p.assetIndex,p]));
for(const p of pages){p.asset=d.assets.find(a=>a.group==='textbook'&&a.index===p.assetIndex);if(p.asset){p.asset.title=`교과서 ${num(p.page)} · ${p.title}`;p.asset.readingPage=p.page;}}
// These cues are deliberately conservative: matched pages are contextual study material.
const cues=[
 [/제주\s*4[·.\-]?3|4[·.\-]?3\s*사건|한라산\s*금족|3[·.\-]?1\s*발포/,5],
 [/반민특위|반민족\s*행위\s*처벌|반민족행위특별조사/,7],
 [/농지\s*개혁|유상\s*매수|유상\s*분배|여순|여수[·.\s-]*순천/,7],
 [/미소\s*공동\s*위원회|모스크바\s*3국|신탁\s*통치/,3],
 [/좌우\s*합작|여운형|김규식|남북\s*협상/,4],
 [/5[·.\-]?10\s*총선|제헌\s*헌법|제헌\s*국회|1948년\s*8월\s*15일|정부\s*수립/,6],
 [/1945년\s*8월\s*15일|조선\s*건국\s*준비|38선|미군정|광복/,2],
 [/6[·.\-]?25|인천\s*상륙|중국군\s*참전|정전\s*협정|정전\s*회담|1950년\s*6월/,9],
 [/피란|전쟁\s*고아|학도\s*의용|전쟁\s*중\s*민간인|이산가족/,10],
 [/사사오입|발췌\s*개헌|진보당\s*사건/,11],
 [/삼백\s*산업|원조\s*경제|천리마\s*운동/,12],
 [/4[·.\-]?19|3[·.\-]?15\s*부정|2[·.\-]?28|김주열|장면\s*내각/,14],
 [/5[·.\-]?16|3선\s*개헌|한일\s*협정|6[·.\-]?3\s*시위|베트남\s*파병/,15],
 [/10월\s*유신|유신\s*헌법|긴급\s*조치|부마\s*민주|YH\s*무역|10[·.\-]?26|3[·.\-]?1\s*민주구국/,16],
 [/5[·.\-]?18|광주\s*민주화|12[·.\-]?12\s*군사/,17],
 [/6월\s*민주|6[·.\-]?10|6[·.\-]?29|이한열|박종철|4[·.\-]?13\s*호헌/,18],
 [/9차\s*개헌|1987\s*개헌|대통령\s*직선제/,19],
 [/경제\s*개발|5개년\s*계획|경부\s*고속|수출\s*주도|중화학|석유\s*파동|3저\s*호황/,21],
 [/전태일|노동\s*운동|새마을\s*운동|도시화|동일방직|광주대단지/,22],
 [/환경\s*운동|원진레이온|낙동강\s*페놀|공해|산업\s*재해/,23],
 [/프로야구|대중\s*가요|검열|금지곡|텔레비전/,24],
 [/금융실명제|문민정부|김영삼|김대중|노무현|평화적\s*정권\s*교체|OECD/,29],
 [/촛불\s*집회|박근혜|탄핵|세월호|코로나/,30],
 [/지방\s*자치|호주제|대체\s*복무/,31],
 [/진실[·.\s-]*화해|과거사\s*정리/,32],
 [/외환\s*위기|IMF|금\s*모으기|구조\s*조정|노동자\s*대투쟁/,33],
 [/저출산|고령화|다문화|기초생활보장|양극화/,35],
 [/한류|신한류|BTS|기생충|강남스타일/,36],
 [/장마당|고난의\s*행군|북한\s*핵|김정은|합영법/,38],
 [/남북\s*기본\s*합의|남북\s*정상|6[·.\-]?15\s*공동|10[·.\-]?4\s*남북|판문점\s*선언|개성\s*공단/,39],
 [/7[·.\-]?4\s*남북/,16],
 [/독도|대한제국\s*칙령\s*41|샌프란시스코\s*강화|평화선/,40],
 [/동북공정|역사\s*교과서\s*왜곡/,41]
];
const fallback={'광복·정부 수립':4,'전쟁·전후':9,'민주주의·산업화':21,'민주화 운동':18,'남북관계·현대':29};
function resolve(q){const prompt=String(q?.prompt||'')+' '+String(q?.answerText||'');const match=cues.find(([re])=>re.test(prompt));let p,kind;
 if(match){p=pages[match[1]-1];kind='핵심어에 따른 관련 단원';}
 else if(q?.textbookPage){p=byOriginal.get(Number(q.textbookPage));kind='기존 연결 자료 · 검토 필요';}
 else {p=pages[(fallback[q?.era]||1)-1];kind='단원 배경 참고 자료';}
 return {...p,asset:p?.asset,kind,attached:false,page:p?.assetIndex,chapter:p?.page};}
function render(q,compact=false){const r=resolve(q);if(!r?.asset)return '<p role="status">관련 이미지가 없습니다.</p>';
 const title=`교과서 학습 순서 ${num(r.chapter)} · ${r.title}`;
 return `<figure class="v62-question-material v7-question-material${compact?' compact':''}"><figcaption><span>📚 ${esc(title)}</span><span class="v62-reference-type">${esc(r.kind)}</span></figcaption><img src="${esc(r.asset.path)}" alt="${esc(title)}" loading="eager" decoding="async" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><p class="v62-image-error" hidden>참고 이미지 파일을 불러올 수 없습니다. 전체 ZIP 압축 해제 상태를 확인해 주세요.</p><div class="v62-material-foot"><small>교과서의 <b>관련 단원 전체 화면</b>입니다. 문제에 제시된 원문 사료와 같은 자료라고 보장하지 않습니다.</small><button type="button" class="v62-zoom" data-v62-image="t${String(r.assetIndex).padStart(3,'0')}">↗ 확대</button></div></figure>`;
}
// 교과서 페이지는 퀴즈에 표시하지 않으므로 자료 렌더러로 등록하지 않습니다.
const initial=(x)=>{try{const n=Number(new URLSearchParams((location.hash.split('?')[1]||'')).get('pg'));return Number.isInteger(n)&&n>=1&&n<=44?n:1}catch{return 1}};
function renderBook(){const n=initial(),p=pages[n-1],img=p.asset?.path,preview=pages.map(c=>`<button class="v7-chapter-card ${c.page===n?'current':''}" data-textbook-page="${c.page}"><span class="v7-chapter-number">${num(c.page)}</span><strong>${esc(c.title)}</strong><span>${esc(c.era)}</span></button>`).join('');
 return `<div class="pagehead"><div><div class="page-kicker">TEXTBOOK VERIFIED · 44/44 IMAGES INDEXED</div><h1 class="page-title">교과서 원본 학습실</h1><p class="page-desc">제공된 교과서 44장 전체를 원본 시간순으로 배열했습니다. 1945~2022년 대한민국의 발전을 읽고 자료와 문항을 연결해 보세요.</p></div></div>
 <section class="surface pad v7-reader"><div class="v7-reader-heading"><span class="tag gold">${num(n)} / 44 · ${esc(p.era)}</span><div class="row"><button class="btn ghost sm" data-textbook-page="${Math.max(1,n-1)}" ${n===1?'disabled':''}>← 이전</button><button class="btn primary sm" data-textbook-page="${Math.min(44,n+1)}" ${n===44?'disabled':''}>다음 →</button></div></div><h2>${esc(p.title)}</h2><div class="v7-reader-grid"><div><button class="v7-clickable-image" type="button" data-v62-image="t${String(p.assetIndex).padStart(3,'0')}" title="눌러서 원본 확대"><img src="${esc(img)}" alt="${esc(p.title)} 교과서 캡처" loading="eager"><span>🔍 눌러서 원본 확대 · 원본 이미지 #${num(p.assetIndex)}</span></button></div><div class="v7-points"><h3>이 화면에서 확인할 내용</h3><ul>${p.points.map(s=>`<li>${esc(s)}</li>`).join('')}</ul><p class="v7-audit-note">교과서의 해당 화면을 바탕으로 직접 요약한 학습 항목입니다. 세부 사료 문구나 그래프 수치는 이미지 원본에서 확인해야 합니다.</p><button class="btn outline" data-route="quiz">연계 문제 풀기</button><button class="btn ghost" data-route="timeline">역사 연표 보기</button></div></div></section>
 <div class="page-kicker" style="margin:30px 0 12px">전체 교과서 학습 목차 · 44장</div><div class="v7-chapter-grid">${preview}</div><div class="data-banner" style="margin-top:22px">📌 본 화면은 현재 첨부된 교과서 캡처 44장을 분석한 색인입니다. 캡처에 없는 교과서 다른 쪽과 교사용 지도서는 포함하지 않았습니다. 자료명 및 사건별 세부 수치는 원문·공식 기록과 재검토가 필요합니다.</div>`;
}
window.HISTORY_TEXTBOOK={render:renderBook,pages,resolve};
document.addEventListener('click',e=>{const el=e.target.closest('[data-textbook-page]');if(!el||el.disabled)return;e.preventDefault();const p=Number(el.dataset.textbookPage);if(p>=1&&p<=44){const next='#textbook?pg='+p;if(location.hash===next)document.getElementById('view')?.scrollTo(0,0);else location.hash=next;window.scrollTo({top:0,behavior:'instant'});}},true);
})();
