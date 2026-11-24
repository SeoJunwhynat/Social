/* 시간의 서고 7.3 | 한국사 학습 모드 → 문제 유형 → 풀이
 * 독립 실행형: 서버 기능(온라인 로그인·채팅·실시간 1:1·공개방·글로벌 랭킹)은 의도적으로 사용 불가 표시.
 */
(()=>{'use strict';
const D=window.HISTORY_DATA, types=window.HISTORY_V2_TYPES||[];
if(!D)return;
const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const key='history_arcade_local_v2',coreKey='history_archive_local_v1';
const defaultData=()=>({records:[],session:null,touchEffect:true,selectedEra:'전체',selectedKind:'전체',selectedKinds:['전체'],selectedLevel:'전체',pendingMode:'practice',count:10,muted:false});
let state=defaultData();
try{
 const stored=JSON.parse(localStorage.getItem(key)||'{}')||{};
 state={...state,...stored};
 // Migrate pre-10.2 single-choice preferences without invalidating saved quiz sessions.
 state.selectedKinds=Array.isArray(stored.selectedKinds)?[...new Set(stored.selectedKinds.filter(x=>typeof x==='string'))]:[stored.selectedKind||'전체'];
 if(state.selectedKinds.includes('전체'))state.selectedKinds=['전체'];
 state.selectedKind=state.selectedKinds[0]||'전체';
}catch{}
let ticker=null;
// 시험범위가 바뀐 경우, 범위 밖 옛 문제 세션은 더 이상 이어서 풀지 않게 한다.
if(state.session?.ids?.length && !state.session.ids.every(id=>D.questions.some(q=>q.id===id)))state.session=null;
if(!Object.hasOwn(D.eras,state.selectedEra))state.selectedEra='전체';
if(!Array.isArray(state.selectedKinds)||!state.selectedKinds.some(t=>t==='전체'||D.questions.some(q=>q.type===t)))state.selectedKinds=['전체'];
const icon={practice:'📚',infinite:'∞',hardcore:'⚔',timed:'⌛',ranked:'🏆',applied:'🧩',written:'✍',versus:'⚔',source:'📜',timeline:'🗓',museum:'🏛',public:'🌐'};
const definitions=[
 {id:'practice',title:'기본 연습',desc:'문제 유형과 시대를 선택해 부담 없이 학습',tag:'기본 학습'},
 {id:'infinite',title:'무한모드',desc:'문제를 계속 풀며 누적 점수·연속 정답에 도전',tag:'제한 없음'},
 {id:'hardcore',title:'하드코어',desc:'한 문제라도 틀리면 종료되는 생존 퀴즈',tag:'1회 실수 탈락'},
 {id:'timed',title:'시간제한',desc:'120초 안에 최대한 많은 문제 정답',tag:'120초'},
 {id:'ranked',title:'랭킹전',desc:'10문제 실전 점수 대결 · 이 기기에서 기록',tag:'기기별 랭킹'},
 {id:'applied',title:'응용·심화',desc:'사료 분석, 인과관계, 사건 비교 중심 심화 연습',tag:'심화 학습'},
 {id:'written',title:'서술형 연습',desc:'선지 없이 사건·인물·개념을 직접 입력',tag:'직접 입력'},
 {id:'versus',title:'1:1 대전',desc:'한 기기에서 두 명이 번갈아 답하는 로컬 대결',tag:'로컬 2인'},
 {id:'museum',title:'역사 박물관',desc:'업로드된 사료·지도·사진을 살펴보고 역사 탐험',tag:'싱글 플레이'},
 {id:'public',title:'공개방 · 온라인',desc:'실시간 대전·공개방·채팅은 서버 연결 후 이용',tag:'서버 필요'}
];
const labels={arcade:'문제 모드 선택', 'arcade-quiz':'도전 진행 중', 'arcade-result':'학습 결과', 'arcade-types':'문제 유형·범위 선택', 'arcade-ranking':'기기별 랭킹', 'arcade-achievements':'업적 · 칭호', 'arcade-online':'온라인 기능', 'arcade-manage':'학습 설정'};
const isArcadeRoute=hash=>Object.prototype.hasOwnProperty.call(labels,hash);
const R=()=>location.hash.slice(1).split('?')[0]||'home';
function save(){try{localStorage.setItem(key,JSON.stringify(state))}catch{}}
function updateCore(q,correct){
 try{const core={...JSON.parse(localStorage.getItem(coreKey)||'{}')};core.attempts=(core.attempts||0)+1;core.correct=(core.correct||0)+(correct?1:0);core.mistakes=core.mistakes||{};if(correct)delete core.mistakes[q.id];else core.mistakes[q.id]=(core.mistakes[q.id]||0)+1;core.recent=Array.isArray(core.recent)?core.recent:[];core.recent.unshift({id:q.id,ok:correct,time:new Date().toISOString()});core.recent=core.recent.slice(0,80);localStorage.setItem(coreKey,JSON.stringify(core));window.historyCoreSync?.();}catch{}
}
function go(hash){if(location.hash!=='#'+hash)location.hash=hash;else renderArcade();if(['arcade','arcade-types','arcade-quiz','arcade-result'].includes(hash))window.scrollTo({top:0,behavior:'instant'});}
function neat(s){return String(s).normalize('NFKC').toLocaleLowerCase('ko').replace(/[\s·ㆍ・.,()\[\]「」『』'"?！!\-]/g,'')}
function writtenOK(q,typed){const t=neat(typed);return [q.answerText,...(Array.isArray(q.answerAliases)?q.answerAliases:[])].filter(Boolean).some(x=>neat(x)===t)}
const shuffle=a=>{let b=[...a];for(let i=b.length-1;i>0;i--){let n=Math.floor(Math.random()*(i+1));[b[i],b[n]]=[b[n],b[i]]}return b};
const tough=['지도 가리기','사료 원문 분석','사건 요약 추론','지도 분석','사료 추론','개념·인과','인물·기관','역사 기록 카드','지역 추론','실제 자료 분석','사료 맥락 분석','비교·대조','사건 순서','연표 비교','A·B 사이','ㄱ~ㅁ 연표','연·월·일'];
const typeDefs=[
 {id:'전체',name:'모든 문제 섞기',desc:'선택한 모드에서 가능한 모든 유형을 섞어 풀기',group:'추천',symbol:'✦'},
 {id:'교과서 심화',name:'교과서 심화',desc:'교과서 핵심 내용을 응용하는 심화 문항',group:'심화',symbol:'📘'},
 {id:'지도 가리기',name:'지도 가리기',desc:'원본 지도에서 핵심 명칭만 가리고 위치·전선·사건을 추론',group:'자료',symbol:'🗺'},
 {id:'사료 원문 분석',name:'사료 밑줄 분석',desc:'실제 법률·헌법 원문에서 표시된 조항 비교',group:'자료',symbol:'📜'},
 {id:'사료 맥락 분석',name:'사료 내용 요지 분석',desc:'역사 문서의 내용·배경·결과를 비교 (직접 인용 아님)',group:'자료',symbol:'📜'},
 {id:'사건 순서',name:'사건 순서 배열',desc:'네 사건의 실제 선후 관계를 판단',group:'연표·날짜',symbol:'⇢'},
 {id:'비교·대조',name:'사건·자료 비교 분석',desc:'두 기록을 비교하여 관련 사건·배경을 연결',group:'심화',symbol:'⚖'},
 {id:'사건 요약 추론',name:'사건 맥락 추론',desc:'학습지 속 기록이 의미하는 역사적 사건을 찾기',group:'기본 개념',symbol:'▤'},
 {id:'연표 비교',name:'연표 시기 비교',desc:'네 사건의 최초·최후 시기 분석',group:'연표·날짜',symbol:'◷'},
 {id:'실제 자료 분석',name:'실제 자료 분석',desc:'원본 사료·사진·지도·통계를 보며 풀기',group:'자료',symbol:'🗂'},
 {id:'지도 분석',name:'지도 분석',desc:'역사 지도에서 사건의 흐름 찾기',group:'자료',symbol:'🗺'},
 {id:'사료 추론',name:'사료 맥락 추론',desc:'역사 기록의 내용과 배경 파악',group:'자료',symbol:'📜'},
 {id:'역사 기록 카드',name:'역사 기록 카드',desc:'설명 자료를 읽고 역사적 맥락 파악',group:'자료',symbol:'▤'},
 {id:'지역 추론',name:'지역·장소 추론',desc:'사건의 장소와 특징 연결 (지도 이미지 없음)',group:'자료',symbol:'⌖'},
 {id:'연도',name:'연도 맞히기',desc:'사건이 일어난 연도 구분',group:'연표·날짜',symbol:'◷'},
 {id:'연·월·일',name:'월·날짜 추론',desc:'연월일 또는 사건의 시기 판단',group:'연표·날짜',symbol:'▣'},
 {id:'ㄱ~ㅁ 연표',name:'연표 순서 추론',desc:'ㄱ~ㅁ 사건의 선후 관계 찾기',group:'연표·날짜',symbol:'⇢'},
 {id:'A·B 사이',name:'사건 사이 추론',desc:'두 사건 사이에 발생한 사건 찾기',group:'연표·날짜',symbol:'↔'},
 {id:'객관식',name:'핵심 개념 객관식',desc:'주요 사건·제도·인물 기초 학습',group:'기본 개념',symbol:'☑'},
 {id:'OX',name:'OX 판단',desc:'역사 사실의 참·거짓 판단',group:'기본 개념',symbol:'◯'},
 {id:'개념·인과',name:'개념·원인·결과',desc:'사건의 배경·전개·영향 연결',group:'기본 개념',symbol:'⚙'},
 {id:'인물·기관',name:'인물·기관',desc:'인물과 단체·기관의 역할 구분',group:'기본 개념',symbol:'♟'},
 {id:'학습지 빈칸',name:'학습지 빈칸',desc:'핵심 개념이나 사건을 빈칸으로 확인',group:'기본 개념',symbol:'✎'},
 {id:'서술형',name:'서술형 단답',desc:'정답을 직접 입력하는 문제',group:'서술형',symbol:'✍'}
];
let typeGroup='전체',typeQuery='';
function effectiveKinds(mode){
 const allowed=new Set(modesAllowedTypes(mode).map(t=>t.id));
 const clean=[...new Set((Array.isArray(state.selectedKinds)?state.selectedKinds:[state.selectedKind||'전체']).filter(x=>allowed.has(x)))];
 if(mode==='written')return ['서술형'];
 return clean.includes('전체')?['전체']:clean;
}
function selectKind(id){
 const mode=state.pendingMode||'practice';
 if(!modesAllowedTypes(mode).some(t=>t.id===id))return;
 const before=effectiveKinds(mode);
 let after;
 if(mode==='written')after=['서술형'];
 else if(id==='전체')after=['전체'];
 else if(before.includes('전체'))after=[id];
 else if(before.includes(id))after=before.filter(k=>k!==id);
 else after=[...before,id];
 state.selectedKinds=after;
 state.selectedKind=after[0]||'전체';
 save();
 keepViewportStable(renderArcade);
}

function bankFor(mode,kind=state.selectedKinds,era=state.selectedEra,level=state.selectedLevel||'전체'){
 const kinds=Array.isArray(kind)?kind:[kind];
 if(!kinds.length)return [];
 const all=kinds.includes('전체');
 let qs=D.questions.filter(q=>(era==='전체'||q.era===era)&&(level==='전체'||q.level===level));
 if(mode==='written')qs=qs.filter(q=>q.type==='서술형');
 else if(mode==='applied')qs=qs.filter(q=>tough.includes(q.type));
 else qs=qs.filter(q=>q.type!=='서술형');
 // OR semantics: a question matching multiple selected types is still returned exactly once.
 if(!all){const named=new Set(kinds.filter(k=>k!=='교과서 심화'));
   qs=qs.filter(q=>named.has(q.type)||(kinds.includes('교과서 심화')&&q.v4Curated&&q.type!=='서술형'));
 }
 return qs;
}
function modesAllowedTypes(mode){return typeDefs.filter(t=>{
  if(t.id!=='전체'&&!D.questions.some(q=>q.type===t.id))return false;
  if(mode==='written')return t.id==='서술형';
  if(t.id==='서술형')return false;
  if(mode==='applied'&&t.id!=='전체'&&t.id!=='교과서 심화'&&!tough.includes(t.id))return false;
  return true;
 });}
function chooseMode(mode){
 if(resumable()&&state.session?.mode!==mode&&!window.confirm('진행 중인 문제가 있어요. 새 모드를 시작해도 기존 기록은 새 문제를 시작하기 전까지 저장됩니다. 계속할까요?'))return;
 if(mode==='museum'){go('museum');return}
 if(mode==='public'){go('arcade-online');return}
 state.pendingMode=mode;
 state.selectedKind=mode==='written'?'서술형':'전체';
 state.selectedKinds=[state.selectedKind];
 state.selectedLevel='전체';
 typeGroup='전체';typeQuery='';save();go('arcade-types');
}
function sessionNew(mode){if(mode==='museum'){go('museum');return}if(mode==='public'){go('arcade-online');return}
 const bank=bankFor(mode);if(!bank.length){alert('선택한 범위에 해당하는 문제가 없습니다. 문제 유형을 전체로 바꿔 주세요.');return}
 const activeKinds=effectiveKinds(mode);
 const shuffleBank=shuffle(bank),limit=mode==='ranked'?10:mode==='versus'?10:mode==='timed'?Math.min(60,bank.length):mode==='hardcore'?Math.min(30,bank.length):mode==='infinite'?Math.min(20,bank.length):Math.min(state.count||10,bank.length);
 state.session={mode,kinds:[...activeKinds],ids:shuffleBank.slice(0,limit).map(q=>q.id),i:0,score:0,correct:0,mistakes:0,streak:0,selected:null,answerText:'',finished:false,clock:(mode==='timed'?120:mode==='ranked'?150:null),deadline:(mode==='timed'?Date.now()+120000:mode==='ranked'?Date.now()+150000:null),byPlayer:[0,0],history:[],createdAt:Date.now()};save();go('arcade-quiz');startTimer();
}
function resumable(){const s=state.session;if(!s||s.finished||!Array.isArray(s.ids)||!s.ids.length)return null;if(s.i<0||s.i>=s.ids.length)return null;return D.questions.some(q=>q.id===s.ids[s.i])?s:null}
function resumeSession(){const s=resumable();if(!s){go('arcade');return}if(s.deadline&&s.deadline<=Date.now()){finish('중단 중 제한 시간이 종료됐습니다.');return}go('arcade-quiz');if(s.deadline)startTimer();}
function resumeCard(){const s=resumable();if(!s)return `<div class="v74-resume-empty"><span>📖</span><div><strong>이어서 풀 문제 없음</strong><small>새 문제를 시작하면 이곳에 자동으로 진행 상황을 저장해요.</small></div><button class="btn ghost" data-a-go="arcade">새 문제 시작</button></div>`;
const mode=definitions.find(m=>m.id===s.mode)?.title||'문제 풀이';const q=D.questions.find(q=>q.id===s.ids[s.i]);const n=s.history?.length||0;const ended=Boolean(s.deadline&&s.deadline<=Date.now());
return `<div class="v74-resume-card" role="group" aria-label="이어서 풀기"><div class="v74-resume-head"><span class="tag gold">📖 진행 중 학습</span><strong>${esc(mode)}</strong></div><h3>${s.i+1}번 문제부터 이어서 풀기</h3><p>${esc(q?.type||'문제')} · ${esc(q?.era||'한국사')} · 정답 ${s.correct||0}개 / 응답 ${n}개 ${s.mode==='infinite'||s.mode==='timed'?'':'· 전체 '+s.ids.length+'문항'}</p><div class="v74-resume-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.min(100,Math.round(s.i/s.ids.length*100))}"><span style="width:${Math.min(100,Math.round(s.i/s.ids.length*100))}%"></span></div><button class="btn primary v74-resume-cta" data-a-resume="1">${ended?'시간 종료 · 결과 확인':'▶ 이어서 풀기'}</button><small>이 기기 브라우저에 자동 저장${s.deadline?' · 제한시간은 중단 중에도 흐름':''}</small></div>`}
function current(){const s=state.session;return s?D.questions.find(q=>q.id===s.ids[s.i]):null}
function formatTime(sec){return `${Math.floor(Math.max(0,sec)/60).toString().padStart(2,'0')}:${(Math.max(0,sec)%60).toString().padStart(2,'0')}`}
function remaining(){const s=state.session;if(!s||!s.deadline)return null;return Math.max(0,Math.ceil((s.deadline-Date.now())/1000))}
function startTimer(){if(ticker)return;ticker=setInterval(()=>{const s=state.session;if(!s||s.finished||!s.deadline){clearInterval(ticker);ticker=null;return}const secs=remaining(),node=$('#arcadeTimer');if(node){node.textContent=formatTime(secs);node.classList.toggle('urgent',secs<=20)}if(secs===0)finish('제한 시간이 종료됐습니다.')},200)}
function keepViewportStable(renderFn){const y=window.scrollY||document.documentElement.scrollTop||0;const x=window.scrollX||document.documentElement.scrollLeft||0;renderFn();requestAnimationFrame(()=>{const maxY=Math.max(0,document.documentElement.scrollHeight-window.innerHeight);window.scrollTo({left:x,top:Math.min(y,maxY),behavior:'instant'});});}
function answer(value,isText=false){const s=state.session,q=current();if(!s||s.finished||s.selected!==null||!q)return;if(s.deadline&&remaining()<=0){finish('제한 시간이 종료됐습니다.');return}
 let idx=Number(value);let correct=isText?writtenOK(q,value):idx===q.answer;
 s.selected=isText?String(value):idx;s.answerText=isText?String(value):'';s.history.push({q:q.id,correct,answer:s.selected});s.correct+=Number(correct);s.streak=correct?s.streak+1:0;s.mistakes+=Number(!correct);
 const bonus=correct?(100+(q.level==='최상'?70:q.level==='어려움'?40:0)+Math.min(s.streak,10)*10):0;s.score+=bonus;
 if(s.mode==='versus'&&correct)s.byPlayer[(s.i%2)]++;
 updateCore(q,correct);save();keepViewportStable(renderArcade);
}
function next(){const s=state.session;if(!s||s.finished)return;if(s.selected===null)return;
 if(s.mode==='hardcore'&&s.mistakes>0){finish('첫 오답으로 하드코어 도전이 종료됐습니다.');return}
 s.i++;s.selected=null;s.answerText='';
 if(s.i>=s.ids.length){if(s.mode==='infinite'||s.mode==='timed'){
 const used=new Set(s.ids.slice(-Math.min(D.questions.length,100)));const matchingBank=bankFor(s.mode,s.kinds||state.selectedKinds);const more=shuffle(matchingBank.filter(q=>!used.has(q.id)));const picks=more.length?more:shuffle(matchingBank);s.ids.push(...picks.slice(0,Math.min(20,picks.length)).map(q=>q.id));
 }else{finish('도전이 완료됐습니다.');return}}
 save();keepViewportStable(renderArcade);
}
function finish(reason){const s=state.session;if(!s||s.finished)return;s.finished=true;s.reason=reason||'도전 완료';s.finishedAt=Date.now();s.elapsed=Math.max(0,Math.round((s.finishedAt-s.createdAt)/1000));state.records.unshift({mode:s.mode,score:s.score,correct:s.correct,total:s.history.length,mistakes:s.mistakes,elapsed:s.elapsed,date:new Date().toISOString(),versus:s.byPlayer});state.records=state.records.slice(0,200);save();if(ticker){clearInterval(ticker);ticker=null}go('arcade-result')}
function pagehead(kicker,title,desc){return `<div class="pagehead"><div><div class="page-kicker">${kicker}</div><h1 class="page-title">${esc(title)}</h1><p class="page-desc">${esc(desc)}</p></div></div>`}
function cardMode(m){return `<button class="arcade-mode" data-a-mode="${m.id}" aria-label="${esc(m.title)} 선택 후 문제 유형 고르기"><span class="arcade-mode-icon">${icon[m.id]||'✦'}</span><div><span class="arcade-mode-tag">${m.tag}</span><strong>${esc(m.title)}</strong><p>${esc(m.desc)}</p></div><span class="arcade-mode-arrow">›</span></button>`}
function stageStep(step){return `<div class="select-steps" aria-label="문제풀이 단계"><span class="step-chip ${step===1?'now':'done'}"><b>1</b> 학습 모드</span><span class="step-line">›</span><span class="step-chip ${step===2?'now':''}"><b>2</b> 문제 유형·범위</span><span class="step-line">›</span><span class="step-chip"><b>3</b> 문제 풀이</span></div>`}
function renderModes(){
 const items=[['assets/ui/v9/mode_basic.png','practice','기본 학습'],['assets/ui/v9/mode_applied.png','applied','응용 문제'],['assets/ui/v9/mode_essay.png','written','서술형'],['assets/ui/v9/mode_infinite.png','infinite','무한모드'],['assets/ui/v9/mode_hardcore.png','hardcore','하드코어'],['assets/ui/v9/mode_timed.png','timed','시간제한'],['assets/ui/v9/mode_ranking.png','ranked','랭킹전'],['assets/ui/v9/mode_duel.png','versus','1:1 대전']];
 const resume=resumable();
 return `<section class="v9-modes" aria-label="문제 모드 선택"><div class="v9-modes-head"><h1>문제 모드 선택</h1><p>2학기 2차 지필 · 학습지 17~27번 · 교과서 111쪽까지 · 선택한 유형만 출제</p></div>
 <div class="v9-resume-row"><div><strong>이어 풀기</strong><p>${resume?esc((definitions.find(x=>x.id===resume.mode)?.title||'문제 학습')+' · '+(resume.i+1)+'번째 문제부터'):'진행 중인 문제가 없습니다.'}</p></div><button data-a-resume="1" ${resume?'':'disabled'}>이어서 풀기 ›</button></div>
 <div class="v9-mode-grid">${items.map(([img,id,label])=>`<button type="button" class="v9-mode-btn" data-a-mode="${id}" aria-label="${label} 선택"><img src="${img}" alt="${label}" draggable="false"></button>`).join('')}</div>
 <p class="v9-mode-disclaimer">※ 랭킹 기록과 1:1 대전은 로컬 기능이며 온라인 서버 랭킹은 연결되어 있지 않습니다.</p></section>`;
}
function typeGridHtml(){
 const mode=state.pendingMode||'practice',kinds=effectiveKinds(mode);
 const list=modesAllowedTypes(mode).filter(t=>(typeGroup==='전체'||t.group===typeGroup)&&(`${t.name} ${t.desc} ${t.id}`).toLocaleLowerCase('ko').includes(typeQuery.toLocaleLowerCase('ko')));
 return list.length?list.map(t=>{
   const count=bankFor(mode,t.id).length,selected=kinds.includes(t.id);
   return `<button type="button" class="arcade-type-card v73-type ${selected?'selected':''}" data-a-pick="${esc(t.id)}" ${count===0?'disabled':''} aria-pressed="${selected}" aria-label="${esc(t.name)} ${selected?'선택됨':'선택 안 됨'} ${count}문항"><span class="v73-type-icon">${t.symbol}</span><span class="v73-type-content"><strong>${esc(t.name)}</strong><small>${esc(t.desc)}</small></span><span class="v73-type-count">${count}문항 <b class="v102-kind-tick" aria-hidden="true">${selected?'✓':'+'}</b></span></button>`;
 }).join(''):'<div class="v73-no-types">조건에 맞는 유형이 없어요. 분류나 검색어를 바꿔 주세요.</div>';
}
function renderTypes(){
 const mode=state.pendingMode||'practice',info=definitions.find(m=>m.id===mode)||definitions[0];
 const kinds=effectiveKinds(mode);
 if(JSON.stringify(kinds)!==JSON.stringify(state.selectedKinds)){
   state.selectedKinds=[...kinds];state.selectedKind=kinds[0]||'전체';save();
 }
 const count=bankFor(mode,kinds).length;
 const isFixed=['ranked','versus','timed','hardcore','infinite'].includes(mode);
 const lengthLabel=mode==='timed'?'120초 제한':mode==='ranked'?'10문항 / 150초':mode==='versus'?'10문항 / 번갈아 풀기':mode==='hardcore'?'최대 30문항':mode==='infinite'?'문항 수 제한 없음':`${Math.min(state.count,count)}문항`;
 const groupNames=['전체','기본 개념','자료','연표·날짜','심화','서술형'].filter(g=>g==='전체'||modesAllowedTypes(mode).some(t=>t.group===g));
 const selection=kinds.includes('전체')?'모든 유형':kinds.length?kinds.map(id=>typeDefs.find(t=>t.id===id)?.name||id).join(' · '):'아직 선택한 유형 없음';
 const disabled=!count||!kinds.length;
 return pagehead('QUESTION SETUP','문제 유형 선택','카드를 여러 개 선택해 함께 출제할 수 있습니다. 선택한 유형은 합쳐지며 같은 문항이 중복 출제되지 않습니다.')+
 stageStep(2)+
 `<div class="v73-current-mode"><button type="button" data-a-go="arcade" class="btn ghost sm">← 모드 다시 선택</button><div><span class="small">선택한 모드</span><strong>${icon[mode]||'✦'} ${esc(info.title)}</strong><small>${esc(info.desc)}</small></div></div>`+
 `<section class="arcade-section v73-type-section"><div class="section-heading"><h2>1. 출제 유형 고르기</h2><span>여러 카드를 눌러 복수 선택</span></div><div class="v102-selection-bar" role="status" aria-live="polite"><div><strong>선택 유형 ${kinds.includes('전체')?'전체':kinds.length+'개'}</strong><span>${esc(selection)}</span></div><button type="button" data-a-all="1">모든 유형</button><button type="button" data-a-none="1" ${mode==='written'?'disabled':''}>선택 해제</button></div><div class="v73-search-row"><input id="v73TypeSearch" value="${esc(typeQuery)}" placeholder="유형 검색 (예: 사료, 연표, 날짜)" aria-label="문제 유형 검색" autocomplete="off"><button class="v73-clear" data-a-clear-search="1" type="button">검색 초기화</button></div><div class="v73-type-groups" role="group" aria-label="유형별 보기">${groupNames.map(g=>`<button type="button" data-a-group="${esc(g)}" class="${typeGroup===g?'active':''}" aria-pressed="${typeGroup===g}">${esc(g)}</button>`).join('')}</div><div class="arcade-type-grid v73-types" id="v73TypeGrid">${typeGridHtml()}</div></section>`+
 `<section class="arcade-section v73-filters"><div class="section-heading"><h2>2. 출제 범위 설정</h2><span>선택한 조건에 맞는 문제만 출제</span></div><div class="arcade-setup"><label>학습 시대<select id="a-era"><option value="전체">전체 시대</option>${Object.keys(D.eras).map(x=>`<option value="${esc(x)}" ${x===state.selectedEra?'selected':''}>${esc(x)}</option>`).join('')}</select></label><label>난이도<select id="a-level">${['전체','쉬움','보통','어려움','최상'].map(x=>`<option value="${x}" ${x===state.selectedLevel?'selected':''}>${x==='전체'?'전체 난이도':x}</option>`).join('')}</select></label>${isFixed?`<div class="v73-fixed-count"><small>이 모드의 문제 수</small><strong>${lengthLabel}</strong></div>`:`<label>연습 문항 수<select id="a-count">${[5,10,20,30,50].map(x=>`<option value="${x}" ${state.count===x?'selected':''}>${x}문항</option>`).join('')}</select></label>`}</div></section>`+
 `<div class="v73-startbar"><div class="v73-start-summary"><small>선택 완료 · ${esc(info.title)} / ${esc(selection)}</small><strong>${count}문항 <span>출제 가능</span></strong><span>${esc(lengthLabel)} · ${esc(state.selectedEra==='전체'?'전체 시대':state.selectedEra)} · ${esc(state.selectedLevel==='전체'?'모든 난이도':state.selectedLevel)}</span></div><button class="btn primary v73-start" data-a-start="1" ${disabled?'disabled':''}>${disabled?'출제 유형을 선택해 주세요':'선택한 유형으로 문제 시작 →'}</button></div>`;
}
function renderLive(){const s=state.session,q=current();if(!s||!q)return pagehead('QUIZ','진행할 문제가 없습니다','다른 모드를 시작해 주세요.')+`<button class="btn primary" data-a-go="arcade">모드 선택</button>`;
 if(s.deadline&&remaining()<=0){queueMicrotask(()=>finish('제한 시간이 종료됐습니다.'));return '<div class="loading">결과 계산 중…</div>'}
 const text=q.type==='서술형',revealed=s.selected!==null,correct=revealed&&(text?writtenOK(q,s.selected):s.selected===q.answer);
 const name=(definitions.find(x=>x.id===s.mode)?.title)||'문제 도전';
 const materialHTML=window.HISTORY_MATERIALS?.render(q,false,revealed)||'';
 const longChoices=Boolean(q.options?.some(op=>String(op).length>51))||/지도|사료|자료|사건 순서|연표/.test(q.type||'');
 const currentPlayer=s.mode==='versus'?`<div class="turn-banner">🎮 플레이어 ${(s.i%2)+1}의 차례 · 번갈아 기기를 넘겨 주세요</div>`:'';
 return `<div class="arcade-live-wrap"><div class="arcade-live-head"><button class="btn ghost sm" data-a-leave="1">← 나가기 · 자동 저장</button><button class="btn ghost sm v74-end" data-a-finish="1">도전 종료</button><span class="arcade-chip">${esc(name)}</span>${s.deadline?`<span class="arcade-timer" id="arcadeTimer">${formatTime(remaining())}</span>`:''}</div>${currentPlayer}
 <div class="arcade-live-metrics"><div><strong>${s.i+1}</strong><span>문제</span></div><div><strong>${s.score.toLocaleString()}</strong><span>점수</span></div><div><strong>${s.streak}</strong><span>연속 정답</span></div><div><strong>${s.mode==='hardcore'?s.mistakes>0?'실패':'1회':s.mistakes}</strong><span>${s.mode==='hardcore'?'남은 기회':'오답'}</span></div></div>
 <div class="arcade-progress"><div style="width:${s.mode==='infinite'||s.mode==='timed'?100:Math.round((s.i+1)/s.ids.length*100)}%"></div></div>
 <article class="arcade-paper ${materialHTML?'v88-with-material':''} ${longChoices?'v88-long-choices':''}"><div class="arcade-paper-top"><span>QUESTION ${String(s.i+1).padStart(3,'0')}</span><span>${esc(q.era)} · ${esc(q.type)} · ${esc(q.level)}</span></div><div class="v88-question-label">문제</div><h2 class="arcade-prompt">${esc(q.prompt)}</h2>${materialHTML?`<div class="v88-material-label"><strong>제시 자료</strong><span>자료의 내용과 시기를 확인하세요</span></div>${materialHTML}`:''}${q.sourceNote?`<p class="source-disclaimer">${esc(q.sourceNote)}</p>`:''}
 ${text?`<div class="written-area"><label for="arcadeWritten">정답 입력</label><input id="arcadeWritten" placeholder="사건명을 입력하세요" ${revealed?'disabled':''} value="${esc(s.answerText||'')}" autocomplete="off"><button class="btn primary" data-a-written ${revealed?'disabled':''}>답안 제출</button></div>`:
 `<div class="arcade-answers" role="group" aria-label="정답 선택">${q.options.map((op,i)=>`<button class="arcade-choice ${revealed?(i===q.answer?'correct':s.selected===i?'incorrect':''):''}" data-a-answer="${i}" ${revealed?'disabled':''}><span class="arcade-choice-no">${q.type==='OX'?(i===0?'O':'X'):i+1}</span><span>${esc(op)}</span></button>`).join('')}</div>`}
 ${revealed?`<div class="arcade-feedback ${correct?'yes':'no'}" role="status"><strong>${correct?'✓ 정답!':'✕ 오답'} · ${text?esc(q.answerText):esc(q.options[q.answer])}</strong><p>${esc(q.explanation||'')}</p>${q.v4Curated?`<p class="v4-source-foot">교과서 핵심 개념을 재구성한 연습 문항</p>`:''}<button class="btn primary" data-a-next="1">${(s.mode==='hardcore'&&s.mistakes>0)?'도전 결과 보기':s.mode!=='infinite'&&s.mode!=='timed'&&s.i>=s.ids.length-1?'결과 보기':'다음 문제 →'} (Space)</button></div>`:''}
 </article><div class="arcade-hint">키보드: 숫자 1~5로 선택 · Enter/Space로 다음 · 서술형은 입력 후 Enter</div></div>`}
function renderResult(){const s=state.session;if(!s)return renderModes();const rate=s.history.length?Math.round(s.correct/s.history.length*100):0,versus=s.mode==='versus';return pagehead('SESSION COMPLETE','도전 결과','틀린 문제는 오답노트에 자동으로 기록됩니다.')+`<div class="arcade-result"><div class="result-crown">${rate===100?'🏆':'📜'}</div><div class="small">${esc(definitions.find(x=>x.id===s.mode)?.title||s.mode)} · ${esc(s.reason||'완료')}</div><h2>${s.score.toLocaleString()} <small>점</small></h2><div class="result-stats"><div><b>${s.correct} / ${s.history.length}</b><small>맞힌 문제</small></div><div><b>${rate}%</b><small>정답률</small></div><div><b>${s.elapsed||0}초</b><small>풀이 시간</small></div></div>${versus?`<p class="versus-summary">플레이어 1: ${s.byPlayer[0]}점 · 플레이어 2: ${s.byPlayer[1]}점</p>`:''}<div class="arcade-action-row"><button class="btn primary" data-a-retry="${s.mode}">같은 모드 재도전</button><button class="btn ghost" data-a-go="arcade-ranking">기록 보기</button><button class="btn ghost" data-a-go="arcade">모드 선택</button></div></div>`}
function renderRanking(){const list=state.records.filter(x=>x.mode!=='versus').sort((a,b)=>b.score-a.score).slice(0,30);return pagehead('LOCAL SCOREBOARD','랭킹전 · 기록실','서버가 없는 독립 실행 버전이므로, 이 기기의 기록만 보여 줍니다.')+`<div class="arcade-quick"><button data-a-mode="ranked">🏆 랭킹전 시작</button><button data-a-mode="infinite">∞ 무한모드</button><button data-a-mode="hardcore">⚔ 하드코어</button><button data-a-mode="timed">⌛ 시간제한</button></div><div class="arcade-table"><div class="rank-head"><b>순위</b><b>모드</b><b>점수</b><b>정답</b><b>날짜</b></div>${list.length?list.map((r,i)=>`<div class="rank-row"><strong>${i+1}</strong><span>${esc(definitions.find(x=>x.id===r.mode)?.title||r.mode)}</span><b>${r.score.toLocaleString()}</b><span>${r.correct}/${r.total}</span><span>${esc((r.date||'').slice(0,10))}</span></div>`).join(''):`<p class="empty-state">기록이 없습니다. 모드를 플레이하면 이곳에 점수가 표시됩니다.</p>`}</div><p class="small muted">※ 다른 기기·사용자와 공유되는 글로벌 랭킹이 아닙니다.</p>`}
function renderAchievements(){let r=state.records,allCorrect=r.some(x=>x.total>=10&&x.correct===x.total),core;try{core=JSON.parse(localStorage.getItem(coreKey)||'{}')}catch{core={}};const list=[['첫 발자국','역사 문제 한 개 풀기',(core.attempts||0)>0],['끈기의 기록','총 20개 문제 풀이',(core.attempts||0)>=20],['백발백중','10문제 이상 완벽하게 정답',allCorrect],['무한의 서고','무한모드 한 번 완료',r.some(x=>x.mode==='infinite')],['결의의 서약','하드코어 도전 10문제 이상 정답',r.some(x=>x.mode==='hardcore'&&x.correct>=10)],['시간의 지배자','시간제한 모드에서 1,000점 이상',r.some(x=>x.mode==='timed'&&x.score>=1000)],['역사 탐험가','2D 역사 탐험 에피소드 하나 완료',(core.chapters||[]).length>0]];return pagehead('HONORS & TITLES','업적 · 칭호','맛춘범의 업적·칭호 구조를 역사 학습에 맞게 재구성했어요.')+`<div class="arcade-badges">${list.map(([name,desc,done],i)=>`<article class="arcade-badge ${done?'unlocked':'locked'}"><div class="medal">${done?['✦','❖','★','∞','⚔','⌛','史'][i]:'🔒'}</div><strong>${name}</strong><p>${desc}</p><small>${done?'획득 완료':'달성 전'}</small></article>`).join('')}</div>`}
function renderOnline(){return pagehead('SERVER MODE','온라인 기능 연결 준비','맛춘범에 있던 온라인 모드는 실제 서버가 있어야 동작해요.')+`<div class="arcade-offline"><span>🌐</span><h2>온라인 기능은 아직 연결되지 않았습니다</h2><p>계정 로그인 · 글로벌 랭킹 · 다른 이용자와 1:1 실시간 대전 · 공개방 · 사용자 채팅 · 멀티 박물관은 별도 Render 서버·데이터베이스·WebSocket이 필요합니다. 이 파일에서 가짜 사용자나 가짜 랭킹을 표시하지 않습니다.</p><div class="arcade-action-row"><button class="btn primary" data-a-mode="versus">한 기기 1:1 대전 시작</button><button class="btn ghost" data-a-go="arcade">오프라인 모드로 이동</button></div></div>`}
function renderManage(){return pagehead('PREFERENCES','학습·화면 설정','이 기기에서 사용할 UI 효과와 문제풀이 기본값을 설정할 수 있어요.')+`<div class="surface pad"><div class="switch"><div><strong>클릭·터치 시각 효과</strong><div class="small sub">버튼뿐 아니라 화면 전체를 터치했을 때 작은 잉크 파동을 표시합니다.</div></div><button class="btn ${state.touchEffect?'primary':'ghost'}" data-a-touch="1">${state.touchEffect?'켜짐':'꺼짐'}</button></div><hr><p class="small sub">학습 기록: 본문 문제은행과 오답노트는 기존 시간의 서고 기록을 공유하고, 모드 점수는 별도의 로컬 저장소에 보존합니다.</p><button class="btn ghost" data-a-go="settings">기존 설정·백업 화면 이동</button></div>`}
function renderArcade(){const hash=R();if(!isArcadeRoute(hash))return;document.body.classList.toggle('v74-in-quiz',hash==='arcade-quiz');document.body.classList.toggle('v87-learning-setup',hash==='arcade-types');const v=$('#view');if(!v)return;
 const html=hash==='arcade'?renderModes():hash==='arcade-quiz'?renderLive():hash==='arcade-result'?renderResult():hash==='arcade-types'?renderTypes():hash==='arcade-ranking'?renderRanking():hash==='arcade-achievements'?renderAchievements():hash==='arcade-online'?renderOnline():renderManage();
 v.innerHTML=`<div class="arcade-page">${html}</div>`;$('#crumb').innerHTML=`대민다위 <span> / ${labels[hash]}</span>`;$$('.nav-btn').forEach(n=>n.classList.toggle('active',n.dataset.arcadeGo===hash||((hash==='arcade-types'||hash==='arcade-quiz')&&(n.dataset.arcadeGo==='arcade'||n.dataset.aGo==='arcade'))));
 if(hash==='arcade-quiz'&&state.session?.deadline)startTimer();
}
function enhanceSidebar(){const sidebar=$('#sidebar');if(!sidebar||$('#arcadeNav'))return;
 const n=document.createElement('div');n.id='arcadeNav';n.innerHTML=`<div class="side-label second">문제풀이 · 기록</div><nav class="main-nav"><button class="nav-btn" data-arcade-go="arcade"><span class="nav-ico">⚑</span> 문제 모드 선택</button><button class="nav-btn v74-resume-nav" data-a-resume="1"><span class="nav-ico">↺</span> 이어서 풀기</button><button class="nav-btn" data-arcade-go="arcade-ranking"><span class="nav-ico">♕</span> 랭킹전 · 기기 기록</button><button class="nav-btn" data-arcade-go="arcade-achievements"><span class="nav-ico">✦</span> 업적 · 칭호</button><button class="nav-btn" data-arcade-go="arcade-online"><span class="nav-ico">◎</span> 온라인 · 공개방</button></nav>`;
 sidebar.insertBefore(n,$('.sidebar-foot'));
 
 const label=$('#crumb');if(label)label.setAttribute('aria-live','polite');
}
function afterCoreRender(){enhanceSidebar();const r=R();document.body.classList.toggle('v74-in-quiz',r==='arcade-quiz');if(isArcadeRoute(r)){renderArcade();return}if(false&&r==='home'){const v=$('#view');if(v&&!$('#arcadeEntry')){v.insertAdjacentHTML('beforeend',`<section class="arcade-section" id="arcadeEntry"><div class="section-heading"><h2>한국사 문제풀이</h2><span>무한 · 하드코어 · 시간제한 · 랭킹전 · 응용 · 서술형</span></div>${resumable()?resumeCard():''}<div class="arcade-home-tiles"><button data-a-go="arcade"><span>⚔</span><strong>문제 모드 선택</strong><small>모드를 고른 다음 문제 유형 선택</small></button><button data-a-resume="1" class="v74-home-resume" ${resumable()?'':'disabled'}><span>↺</span><strong>이어서 풀기</strong><small>${resumable()?esc((definitions.find(m=>m.id===resumable().mode)?.title||'학습')+' · '+(resumable().i+1)+'번 문제'):'진행 중인 문제가 없습니다'}</small></button><button data-a-go="arcade-achievements"><span>🏅</span><strong>업적 · 기록</strong><small>개인 학습 성과 확인</small></button></div></section>`)} }
 if(r==='settings'){const v=$('#view');if(v&&!$('#arcadeSettingEntry'))v.insertAdjacentHTML('beforeend',`<div id="arcadeSettingEntry" class="data-banner"><button class="btn ghost" data-a-go="arcade-manage">화면 전체 클릭·터치 시각 효과 설정</button></div>`)}
}
function ripple(e){if(!state.touchEffect)return;const t=e.target;if(t.closest?.('input,textarea,select'))return;const dot=document.createElement('span');dot.className='tap-ripple';dot.style.left=e.clientX+'px';dot.style.top=e.clientY+'px';document.body.append(dot);setTimeout(()=>dot.remove(),560)}
document.addEventListener('pointerdown',ripple,{passive:true});
document.addEventListener('click',e=>{const t=e.target.closest('[data-a-go],[data-arcade-go],[data-a-mode],[data-a-answer],[data-a-written],[data-a-next],[data-a-finish],[data-a-pick],[data-a-all],[data-a-none],[data-a-retry],[data-a-touch],[data-a-start],[data-a-group],[data-a-clear-search],[data-a-resume],[data-a-leave]');if(!t)return;
 e.preventDefault();if(t.dataset.aResume!==undefined){resumeSession();return}if(t.dataset.aLeave!==undefined){save();go('arcade');return}if(t.dataset.aGo||t.dataset.arcadeGo){go(t.dataset.aGo||t.dataset.arcadeGo);return}
 if(t.dataset.aMode){chooseMode(t.dataset.aMode);return}
 if(t.dataset.aRetry){sessionNew(t.dataset.aRetry);return}
 if(t.dataset.aPick){selectKind(t.dataset.aPick);return}
 if(t.dataset.aAll!==undefined){state.selectedKinds=[state.pendingMode==='written'?'서술형':'전체'];state.selectedKind=state.selectedKinds[0];save();keepViewportStable(renderArcade);return}
 if(t.dataset.aNone!==undefined){if(state.pendingMode!=='written'){state.selectedKinds=[];state.selectedKind='전체';save();keepViewportStable(renderArcade)}return}
 if(t.dataset.aGroup!==undefined){typeGroup=t.dataset.aGroup;renderArcade();return}
 if(t.dataset.aClearSearch!==undefined){typeQuery='';renderArcade();$('#v73TypeSearch')?.focus();return}
 if(t.dataset.aStart!==undefined){sessionNew(state.pendingMode||'practice');return}
 if(t.dataset.aAnswer!==undefined){answer(Number(t.dataset.aAnswer));return}
 if(t.hasAttribute('data-a-written')){const v=$('#arcadeWritten')?.value.trim();if(v)answer(v,true);return}
 if(t.dataset.aNext!==undefined){next();return}
 if(t.dataset.aFinish!==undefined){finish('사용자가 도전을 마쳤습니다.');return}
 if(t.dataset.aTouch!==undefined){state.touchEffect=!state.touchEffect;save();renderArcade()}
});
document.addEventListener('change',e=>{const id=e.target.id,v=e.target.value;if(id==='a-era')state.selectedEra=v;if(id==='a-kind'){state.selectedKind=v;state.selectedKinds=[v]}if(id==='a-count')state.count=Number(v);if(id==='a-level')state.selectedLevel=v;if(['a-era','a-kind','a-count','a-level'].includes(id)){save();renderArcade()}});
document.addEventListener('input',e=>{if(e.target.id==='v73TypeSearch'){typeQuery=e.target.value;const grid=$('#v73TypeGrid');if(grid)grid.innerHTML=typeGridHtml();}});
document.addEventListener('keydown',e=>{if(R()!=='arcade-quiz')return;const s=state.session;if(!s||s.finished)return;const text=e.target.matches('input,textarea,[contenteditable="true"]');if(text){if(e.key==='Enter'){e.preventDefault();if(s.selected!==null)next();else{const v=$('#arcadeWritten')?.value.trim();if(v)answer(v,true)}}return}
 if(s.selected===null&&/^[1-5]$/.test(e.key)){e.preventDefault();const q=current();if(q?.options?.[+e.key-1]!==undefined)answer(+e.key-1)}else if(s.selected!==null&&(e.key===' '||e.key==='Enter')){e.preventDefault();next()}});
window.addEventListener('hashchange',()=>queueMicrotask(afterCoreRender));
window.HistoryArcade={afterCoreRender,launch:chooseMode,prefillEra:(era)=>{state.selectedEra=Object.keys(D.eras).includes(era)?era:'전체';save();chooseMode('practice')},syncFromStorage:()=>{try{const old=JSON.parse(localStorage.getItem(key)||'{}')||{};state={...defaultData(),...old};state.selectedKinds=Array.isArray(old.selectedKinds)?[...new Set(old.selectedKinds.filter(x=>typeof x==='string'))]:[old.selectedKind||'전체'];if(state.selectedKinds.includes('전체'))state.selectedKinds=['전체'];state.selectedKind=state.selectedKinds[0]||'전체'}catch{state=defaultData()}afterCoreRender()}};
afterCoreRender();
if(state.session&&!state.session.finished&&state.session.deadline)startTimer();
})();
