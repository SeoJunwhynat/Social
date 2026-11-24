(function(){
"use strict";
const D=window.HISTORY_DATA;
if(!D||window.HISTORY_UPGRADE_109)return;
window.HISTORY_UPGRADE_109=true;
const ESC=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

/* Restore original uploaded image assets already present in the deployed museum. */
const verifiedImageAliases={
 exam_map_map_acheson:"m065",exam_map_map_start:"m070",exam_map_map_incheon:"m071",
 exam_map_map_china:"m072",exam_map_map_armistice:"m073",
 v108src_sanfran:"m022",v108src_preparation:"m024",v108src_line38_reason:"m028",
 v108src_us_occupation:"m030",v108src_sov_occupation:"m031",v108src_moscow:"m032",
 v108src_joint_seven:"m044",v108src_un_vote:"m043",v108src_kim_gu_appeal:"m045",
 v108src_agrarian:"m063",v108src_constitution_compare:"m086"
};
for(const [brokenId,originalId] of Object.entries(verifiedImageAliases)){
 const original=D.assets.find(a=>a.id===originalId),target=D.assets.find(a=>a.id===brokenId);
 if(original?.path?.startsWith("/history/assets/media/")&&target){
  target.path=original.path;
  target.original=original.original;
  target.sourceAlias=originalId;
 }
}
for(const question of D.questions){
 if(question.mapMaskImage&&verifiedImageAliases[question.sourceAssetId]){
  delete question.mapMaskImage; // Missing masked files: use the original genuine map instead of a broken image.
 }
}

const lessons={
17:"냉전 체제와 동아시아",18:"8·15 광복과 정치 세력",19:"모스크바 회의와 신탁 통치",20:"좌우 합작·단독선거 논쟁",21:"대한민국 정부 수립과 제주 4·3",22:"6·25 전쟁과 정전",23:"이승만 정부와 장기 집권",24:"4·19 혁명과 장면 내각",25:"5·16과 박정희 정부",26:"신군부와 5·18 민주화 운동",27:"6월 민주 항쟁과 직선제 개헌"};
const ranges={17:[1,2],18:[3,4],19:[5,6],20:[7,9],21:[10,12],22:[13,15],23:[16,17],24:[18,20],25:[21,24],26:[25,26],27:[27,30]};
let sheetPromise=null, sheet=null, selectedPage=1, answer=false, query="";
const getSheet=()=>{if(!sheetPromise)sheetPromise=fetch("/history/worksheet_17_27.json",{cache:"force-cache"}).then(r=>{if(!r.ok)throw Error("학습지 데이터를 불러오지 못했습니다");return r.json()}).then(v=>{sheet=v;paintReader();window.dispatchEvent(new Event("dmd-worksheet-loaded"));return v}).catch(e=>{const x=document.getElementById("v109WorksheetContent");if(x)x.textContent=e.message;return null});return sheetPromise};
const pageLesson=p=>Object.keys(ranges).find(k=>p>=ranges[k][0]&&p<=ranges[k][1])||"17";
function renderReader(){
 queueMicrotask(()=>getSheet());
 return `<div class="v109-read"><div class="pagehead"><div><div class="page-kicker">WORKSHEET · 2ND EXAM</div><h1 class="page-title">학습지 읽기</h1><p class="page-desc">학습지 17~27번 · PDF 1~30쪽 · 학생용과 정답본을 페이지별로 비교합니다.</p></div></div>
 <div class="v109-read-top"><label>학습지 <select id="v109Lesson">${Object.keys(ranges).map(k=>`<option value="${k}" ${pageLesson(selectedPage)===k?"selected":""}>${k}. ${ESC(lessons[k])}</option>`).join("")}</select></label><label>자료 보기 <select id="v109View"><option value="student" ${!answer?"selected":""}>학생용 · 빈칸</option><option value="answer" ${answer?"selected":""}>정답본 · 개념 확인</option></select></label><button type="button" data-v109-page="${Math.max(1,selectedPage-1)}">← 이전</button><strong id="v109PageLabel">${selectedPage} / 30쪽</strong><button type="button" data-v109-page="${Math.min(30,selectedPage+1)}">다음 →</button></div>
 <div class="v109-reader-head"><strong id="v109ReaderTitle"></strong><span>학습지 PDF 원문에서 추출한 텍스트</span></div>
 <div class="v109-reader-paper" id="v109WorksheetContent" role="document">학습지를 불러오는 중…</div>
 <p class="v109-reader-foot">그림·표·사료 사진은 텍스트 변환만으로 모두 재현되지 않습니다. 해당 자료는 사료 박물관의 이미지와 함께 확인해 주세요.</p></div>`;
}
function paintReader(){
 const el=document.getElementById("v109WorksheetContent");if(!el||!sheet)return;
 const x=(sheet.pages||[]).find(x=>x.page===selectedPage&&x.kind===(answer?"정답":"학생용"));
 document.getElementById("v109PageLabel").textContent=selectedPage+" / 30쪽";
 document.getElementById("v109ReaderTitle").textContent="학습지 "+pageLesson(selectedPage)+" · "+lessons[pageLesson(selectedPage)];
 el.textContent=x?.text||"해당 페이지를 찾지 못했습니다.";
}
window.HISTORY_WORKSHEET={render:renderReader,getData:getSheet};
const people=[
["여운형","건국준비위원회 조직과 좌우 합작 운동을 이끈 인물","1947. 7. 19. 암살"],["김규식","좌우 합작과 남북 협상에 참여한 통일정부 수립 지향 인물","1946~1948"],["김구","남한 단독정부 수립에 반대하고 남북 협상을 추진","1948"],["이승만","대한민국 초대 대통령, 남한 단독정부 수립 주장과 장기 집권 시도","1948~1960"],["안재홍","건국준비위원회 및 좌우 합작 활동","1945~1947"],["송진우","광복 직후 한국민주당을 이끈 주요 인사","1945"],["김성수","한국민주당 창당에 참여한 주요 인사","1945"],["박헌영","광복 직후 좌익 정치 세력의 주요 인물","1945~"],["조만식","북한 지역에서 활동한 민족주의 계열 지도자","1945"],["장면","4·19 혁명 후 제2공화국 내각의 국무총리","1960~1961"],["조봉암","진보당 창당 등 평화통일론을 주장했던 정치인","1950년대"],["박정희","5·16 군사 정변 이후 집권, 유신 체제 수립","1961~1979"],["전태일","노동자의 근로조건 개선을 요구한 인물","1970"],["김대중","유신 체제와 신군부에 반대하며 민주화 운동을 전개","1970~1987"],["김영삼","유신 반대 운동과 민주화 운동에 참여","1970~1987"],["전두환","12·12 군사 반란을 주도한 신군부 핵심 인물","1979~1987"],["노태우","신군부의 주요 인물, 6·29 민주화 선언 발표","1987"],["박종철","고문치사 사건이 1987년 민주화 운동의 발단이 된 대학생","1987. 1."],["이한열","6월 민주 항쟁 과정에서 민주화 요구의 상징이 된 학생","1987. 6."],["허정","4·19 혁명 후 과도정부를 이끈 인물","1960"],["최규하","10·26 이후 대통령 취임","1979~1980"]];
const tabs=()=>`<div class="v109-museum-tabs" role="tablist" aria-label="박물관 보기"><button type="button" role="tab" aria-selected="true" data-v109-tab="sources">사료·사진·지도</button><button type="button" role="tab" aria-selected="false" data-v109-tab="people">역사 인물</button><button type="button" role="tab" aria-selected="false" data-v109-tab="events">주요 사건 정리</button></div>
<section id="v109People" class="v109-museum-panel" hidden><h2>시험범위 역사 인물</h2><p>인물이 남긴 활동과 당시 사건을 연결해 보세요.</p><div class="v109-person-grid">${people.map(p=>`<article><strong>${ESC(p[0])}</strong><span>${ESC(p[2])}</span><p>${ESC(p[1])}</p></article>`).join("")}</div></section>
<section id="v109Events" class="v109-museum-panel" hidden><h2>주요 사건 정리</h2><p>학습지 17~27번의 사건을 연도와 설명으로 정리했습니다.</p><div class="v109-event-grid">${(D.events||[]).filter(e=>Number(e.year)<=1987).map(e=>`<article><time>${ESC(e.date)}</time><strong>${ESC(e.title)}</strong><p>${ESC(e.summary)}</p></article>`).join("")}</div></section>`;
window.HISTORY_EXTRA={museumTabs:tabs};
document.addEventListener("click",e=>{
 const page=e.target.closest("[data-v109-page]");if(page){selectedPage=Number(page.dataset.v109Page);paintReader();return}
 const tab=e.target.closest("[data-v109-tab]");if(tab){
  const name=tab.dataset.v109Tab;const host=document.querySelector(".v109-museum-tabs");if(!host)return;
  host.querySelectorAll("[data-v109-tab]").forEach(b=>b.setAttribute("aria-selected",String(b===tab)));
  const view=document.getElementById("view");if(view)view.dataset.v109Museum=name;
  document.getElementById("v109People").hidden=name!=="people";
  document.getElementById("v109Events").hidden=name!=="events";
 }
});
document.addEventListener("change",e=>{
 if(e.target.id==="v109Lesson"){selectedPage=ranges[e.target.value]?.[0]||1;paintReader()}
 if(e.target.id==="v109View"){answer=e.target.value==="answer";paintReader()}
});
const cleanQuestion=q=>{
 if(!q||typeof q.prompt!=="string")return;
 q.prompt=q.prompt.replace(/\[(?:자료|사료)\s*\d+(?:[-–]\S+)?\]/g,"").replace(/[ \t]{2,}/g," ").replace(/다음 네 역사 사건을 발생한 순서대로 바르게 나열한 것은\?/g,"다음 사건들을 실제로 일어난 순서대로 배열한 것은?").replace(/다음 역사 사건이 일어난 연월로 옳은 것은\?/g,"이 사건은 언제 일어났을까?").replace(/자료가 나타내는 역사적 주장의 의미를 해석한 것으로 적절한 것은\?/g,"자료에서 확인할 수 있는 주장은 무엇일까?").trim();
};

const reviewedSources=[[2,"트루먼 독트린 자료에서 미국이 그리스와 튀르키예를 지원하려 한 까닭은?","공산주의의 확산을 막기 위해서","일본의 식민지 지배를 재개하기 위해서","한국에서 남북 총선거를 주관하기 위해서","정전협정을 체결하기 위해서","트루먼 독트린은 냉전 초기 공산주의 확산을 억제하려는 미국의 봉쇄 정책을 보여 준다."],[2,"샌프란시스코 강화 조약의 내용으로 알 수 있는 일본의 변화는?","연합국과의 강화 조약으로 주권을 회복했다","군정 체제를 조선에 확대했다","한반도에서 남북 총선거를 실시했다","미국과 소련의 공동 통치를 시작했다","이 조약은 일본의 전후 국제사회 복귀에 영향을 주었다."],[4,"미군정 포고문에서 통치 권한을 미군 사령관에게 두었다는 것은 무엇을 의미할까?","38도선 이남을 미군정이 직접 통치했다","조선 건국 준비 위원회가 공식 정부로 승인되었다","정전협정이 이미 체결되었다","제헌국회가 대통령을 선출했다","남한에는 미군정청이 설치되고 직접 통치가 시행되었다."],[5,"모스크바 3국 외상 회의에서 논의된 임시정부는 어떤 성격이었을까?","한국인의 민주주의 임시정부","일본의 조선총독부를 유지할 정부","미군 단독 통치만을 영구화할 정부","국회가 이미 구성된 대한민국 정부","모스크바 결정에는 한국 민주주의 임시정부 수립과 미·소 공동위원회 설치 등이 들어 있었다."],[6,"신탁 통치를 둘러싼 양쪽의 주장이 달랐던 가장 큰 이유는?","독립 과정에서 신탁 통치가 갖는 의미를 다르게 해석했기 때문이다","신탁 통치 여부가 농지개혁의 배분 가격만 결정했기 때문이다","양쪽 모두 정전협정에 반대했기 때문이다","남북이 이미 통일 정부를 수립했기 때문이다","같은 결정을 두고 독립의 지연으로 보는 입장과 독립 준비 과정으로 보는 입장이 대립했다."],[7,"좌우 합작 7원칙에서 친일 행위자 처벌을 언급한 취지는?","통일정부 수립과 함께 식민지 지배 협력 문제를 청산하기 위해서","일본의 식민지 지배를 인정하기 위해서","정전 협정의 체결을 지지하기 위해서","대통령 직선제 개헌을 위해서","좌우 합작 운동은 정치적 협력과 친일 청산 등 여러 과제를 함께 논의했다."],[8,"김구의 호소문에서 남한만의 단독 정부에 반대한 까닭은?","분단의 고착을 우려하고 통일정부 수립을 원했기 때문이다","미군정이 곧바로 전쟁을 시작했기 때문이다","한일 협정을 거부했기 때문이다","제헌 헌법의 대통령 선출 방식을 바꾸기 위해서","김구는 분단을 전제로 한 정부 수립보다 남북 협상을 통한 통일정부를 추구했다."],[10,"제헌 헌법 전문이 3·1 운동의 정신을 계승한다고 밝힌 이유는?","대한민국의 정통성을 독립운동의 역사와 연결하기 위해서","소련군의 직접 통치를 헌법화하기 위해서","정전선을 국경으로 확정하기 위해서","일본군의 주둔을 허용하기 위해서","제헌 헌법은 3·1 운동의 독립 정신 계승을 밝힌다."],[12,"반민족행위처벌법의 취지와 가장 가까운 설명은?","식민지 시기 친일 반민족 행위에 책임을 묻는 것","전쟁 포로의 송환 절차를 정하는 것","군사분계선을 설정하는 것","유신 헌법을 제정하는 것","반민족행위처벌법은 친일 청산을 위한 법률이었다."],[12,"농지개혁법을 통해 농지를 농민에게 나누려 한 목적은?","소작 관계를 개선하고 경작 농민의 경제적 자립을 도우려는 것","지주의 소유 농지를 영구히 보호하려는 것","모든 농업 생산을 중단하려는 것","농촌 주민의 선거권을 폐지하려는 것","농지개혁법은 경자유전 실현과 농민 생활 안정을 목표로 했다."],[14,"정전 협정에 비무장지대 설치 조항이 포함된 이유를 추론하면?","군대의 직접 충돌을 줄이기 위한 완충지대를 마련하려고","남북한 정부를 하나로 통합하려고","미·소 군정을 재개하려고","한일 국교 정상화를 준비하려고","정전 협정은 군사분계선과 비무장지대를 두어 적대행위를 중단하도록 했다."],[17,"1952년 발췌 개헌을 통해 달라진 대통령 선출 방식은?","국회 간접선거에서 국민 직접선거로 바뀌었다","국민 직선제에서 국회 간선제로 바뀌었다","통일주체국민회의에서 대통령을 뽑게 됐다","대통령 선거 자체가 완전히 폐지됐다","발췌 개헌은 대통령 직선제를 도입했다."],[18,"2·28 민주 운동에서 학생들이 부당한 등교 지시에 저항한 이유를 추론하면?","학생들의 정치적 참여를 막으려는 조치라고 판단했기 때문이다","정전 협정 체결을 반대했기 때문이다","농지개혁법에 따른 세금을 거부했기 때문이다","남북 공동위원회가 중단됐기 때문이다","학생들은 야당 집회 참여를 막는 등교 지시 등에 반발하였다."],[19,"대학교수단 시국 선언이 학생 시위를 지지한 이유는?","부정선거와 독재에 대한 저항을 정당한 민주적 행동으로 보았기 때문이다","군사정변을 지지했기 때문이다","남북 군사분계선 수정을 요구했기 때문이다","신탁 통치 방안을 마련하려고","교수단은 민주주의 회복을 요구한 학생과 시민의 행동을 지지했다."],[21,"5·16 군사 정변 공약에서 반공과 경제 재건을 강조한 까닭은?","정권 장악의 명분으로 질서 회복과 경제 발전을 제시하기 위해서","6월 민주 항쟁 이후 직접선거를 준비하기 위해서","정전 협정 이후 유엔군을 철수시키기 위해서","해방 직후 건국준비위원회를 재조직하기 위해서","군부는 반공과 경제 재건 등을 정변의 명분으로 내세웠다."],[22,"한일 기본 조약의 '이미 무효'라는 표현이 논쟁이 된 이유는?","과거 조약이 언제부터 무효인지 양국 해석이 달랐기 때문이다","전쟁이 언제 시작됐는지를 놓고 다퉜기 때문이다","남북선거의 투표권 연령을 달리 봤기 때문이다","농지 분배 가격을 결정하지 못했기 때문이다","한일 기본 조약 제2조를 둘러싸고 식민지 지배의 불법성 등에 관한 역사 인식 차이가 있었다."],[24,"긴급조치 제1호가 유신 헌법 비판을 금지한 것은 무엇을 보여 줄까?","정치적 표현의 자유가 크게 제한됐음을 보여 준다","대통령 직선제가 곧바로 도입됐음을 보여 준다","농민에게 농지를 무상으로 분배했음을 보여 준다","정전협정이 폐기됐음을 보여 준다","긴급조치는 유신 체제를 비판하는 행위를 금지하여 시민의 기본권을 제한했다."],[26,"5·18 민주화 운동 관련 시민의 호소문에서 알 수 있는 것은?","시민들이 국가폭력에 맞서 민주적 권리를 요구했다는 점","시민들이 정전 협정의 군사분계선을 바꾸려 했다는 점","미소 공동위원회가 다시 열렸다는 점","일본 식민지 지배를 재개했다는 점","5·18 민주화 운동은 국가폭력에 대한 시민의 저항과 민주화 요구의 맥락에서 이해해야 한다."],[28,"4·13 호헌 조치에 시민들이 반대한 가장 중요한 이유는?","대통령 직선제 개헌 요구를 정부가 받아들이지 않았기 때문이다","농지개혁법이 폐지됐기 때문이다","한일 협정 체결을 지연시켰기 때문이다","미군정 재설치를 결정했기 때문이다","호헌 조치는 기존 대통령 간선제를 유지하려는 방침으로, 직선제 개헌 요구와 충돌했다."],[29,"6·29 선언이 발표된 직접적인 정치적 배경은?","6월 민주 항쟁을 통해 대통령 직선제 개헌을 요구하는 목소리가 커졌기 때문이다","이승만의 정읍 발언이 다시 발표됐기 때문이다","제1차 미소 공동위원회가 성과를 냈기 때문이다","국군이 인천에 상륙했기 때문이다","1987년 6월 민주 항쟁 뒤 여당 대통령 후보가 직선제 개헌 등을 수용하겠다고 발표했다."]];
reviewedSources.forEach((row,n)=>{const [page,prompt,a,b,c,d,explanation]=row;const opts=[a,b,c,d],rotation=(n*3+1)%4;const rotated=opts.slice(rotation).concat(opts.slice(0,rotation));const chapter=Object.keys(ranges).find(k=>page>=ranges[k][0]&&page<=ranges[k][1]);const era=page<13?"광복·정부 수립":page<18?"전쟁·전후":page<25?"민주주의·산업화":"민주화 운동";const id="v109_source_"+String(n+1).padStart(3,"0");if(!D.questions.some(q=>q.id===id))D.questions.push({id,type:"사료 맥락 분석",era,level:"보통",prompt,options:rotated,answer:rotated.indexOf(a),explanation,sourcePage:page,lesson:Number(chapter),worksheetSourcePage:page,sourceVerifiedForQuestion:true,sourceNote:"제공된 학습지 원문에 기반한 해석 문제"});});

const baseEvents=(D.events||[]).filter(e=>e.year>=1943&&e.year<=1987&&typeof e.summary==="string");
const blankEvents=baseEvents.filter((e,i)=>i%2===0 && e.title && e.summary.length>16).slice(0,50);
blankEvents.forEach((e,i)=>{
 const others=baseEvents.filter(x=>x.era===e.era&&x.id!==e.id&&x.title!==e.title&&Math.abs(x.year-e.year)<=12).map(x=>x.title);
 const opts=[e.title,...new Set(others)].slice(0,4);if(opts.length!==4)return;
 const selected=(i*3)%4;const rotated=opts.slice(selected).concat(opts.slice(0,selected));
 const detail=e.summary.replaceAll(e.title,"(가)");
 const p="다음 설명의 빈칸 (가)에 들어갈 사건은 무엇일까요?\n"+e.year+"년 무렵, "+detail+"\n(가) = _____";
 const id="v109_blank_"+String(i+1).padStart(3,"0");
 if(D.questions.some(q=>q.id===id))return;
 D.questions.push({id,type:"학습지 빈칸",era:e.era,level:"보통",prompt:p,options:rotated,answer:rotated.indexOf(e.title),explanation:e.title+" — "+e.summary,sourcePage:Number(String(e.source||"").match(/PDF (\d+)쪽/)?.[1])||undefined,examScope:true});
});
window.HISTORY_V2_TYPES=[...new Set(["전체",...D.questions.map(q=>q.type)])];
if(window.HISTORY_EXAM_SCOPE){window.HISTORY_EXAM_SCOPE.questionCount=D.questions.length;window.HISTORY_EXAM_SCOPE.questionTypes=Object.fromEntries([...new Set(D.questions.map(q=>q.type))].map(t=>[t,D.questions.filter(q=>q.type===t).length]));}window.HISTORY_V2_QUESTION_COUNT={...(window.HISTORY_V2_QUESTION_COUNT||{}),total:D.questions.length};


const detailedEvents={"카이로 회담":["제2차 세계 대전 중 연합국이 전후 동아시아 문제를 논의했다.","1943년 11월 미국·영국·중국 정상이 한국의 독립을 '적절한 시기'에 실현할 것을 언급했다.","한국 독립을 국제회의에서 선언한 중요한 근거가 되었다."],"포츠담 선언":["연합국은 일본에 무조건 항복을 요구했다.","1945년 7월 포츠담 선언으로 카이로 선언의 이행을 재확인했다.","한국 독립에 대한 앞선 약속을 재확인했다."],"모스크바 3국 외상 회의":["일본 패전 뒤 한국의 임시정부 수립과 전후 처리 문제가 국제적 쟁점이 됐다.","1945년 12월 한국 민주주의 임시정부 수립과 미소공동위원회 설치 등 방안을 결정했다.","신탁 통치와 회의 결정의 해석을 둘러싼 국내 정치 세력의 대립이 심화됐다."],"좌우 합작 7원칙 발표":["미소공동위원회가 교착되면서 좌우 정치 세력이 통일정부 수립을 위해 협력하려 했다.","1946년 10월 좌우합작위원회는 임시정부 수립, 토지 개혁, 친일 청산 등의 원칙을 제시했다.","이념 대립 속에서도 통일된 국가 건설 방안을 모색했음을 보여 준다."],"5·10 총선거":["유엔한국임시위원단이 한반도 북쪽 지역에서 선거를 감시할 수 없는 상황이었다.","1948년 5월 10일 감시 가능 지역인 남한에서 총선거가 시행됐다.","제헌국회가 구성되어 대한민국 정부 수립으로 이어졌다."],"반민족행위처벌법 제정":["광복 이후 일제에 협력한 행위에 대한 역사적 책임을 묻는 문제가 제기됐다.","1948년 9월 제헌국회가 반민족행위처벌법을 제정했다.","법률에 따라 반민특위가 활동했으나 정치적 방해와 압력에 직면했다."],"농지개혁법 제정":["식민지 시기 지주·소작 관계를 개선하고 농민의 경제적 자립을 돕는 일이 과제였다.","1949년 농지개혁법이 제정되어 정부의 유상 매입과 농민에게 유상 분배하는 개혁을 추진했다.","경작 농민의 토지 소유 확대와 농촌 사회 변화에 영향을 주었다."],"6·25 전쟁 발발":["광복 뒤 분단과 냉전 대립이 격화되고 38도선 인근에서 무력 충돌이 벌어졌다.","1950년 6월 25일 북한군이 남침하며 전면전이 시작됐다.","유엔군과 중국군 등이 개입한 전쟁으로 확대되었고 큰 피해를 남겼다."],"인천 상륙 작전":["국군과 유엔군은 전쟁 초기 낙동강 방어선까지 후퇴해 방어했다.","1950년 9월 15일 인천 상륙 작전으로 북한군 후방을 공격했다.","서울 수복과 북진으로 이어지는 전세 역전의 계기가 됐다."],"정전 회담 시작":["전쟁 장기화에 따라 군사적 적대행위를 멈추기 위한 협상이 추진됐다.","1951년 7월 10일 정전 회담이 시작됐다.","군사분계선과 포로 송환 등 문제를 둘러싼 논의가 계속됐다."],"정전 협정 체결":["1951년부터 이어진 정전 회담에서 군사분계선과 포로 송환 문제가 쟁점이 됐다.","1953년 7월 27일 정전 협정이 체결됐다.","전투는 중단되었지만 평화조약이 체결된 것은 아니었다."],"2·28 민주 운동":["1960년 대구 학생들에게 야당 집회 참가를 막으려는 부당한 일요 등교 지시가 내려졌다.","학생들이 이에 항의하며 민주적 권리와 자유를 요구했다.","3·15 부정 선거에 대한 저항과 4·19 혁명으로 이어지는 민주화 흐름에 영향을 주었다."],"4·19 혁명":["3·15 부정 선거와 김주열 학생의 죽음이 알려지면서 시민의 분노가 커졌다.","1960년 4월 19일 학생과 시민이 부정 선거와 독재에 맞서 항의했다.","이승만은 4월 26일 하야했고 제1공화국이 끝났다."],"5·16 군사 정변":["4·19 혁명 뒤 수립된 제2공화국에서 정치적 불안정과 사회 변화 요구가 맞물렸다.","1961년 5월 16일 군부 세력이 정권을 장악했다.","장면 내각이 무너지고 군사정부 체제가 이어졌다."],"10월 유신 선포":["박정희 정부의 장기 집권과 권력 집중을 둘러싼 갈등이 커졌다.","1972년 10월 유신을 선포하고 기존 헌정 질서를 중단시켰다.","유신 헌법을 통해 대통령 권한이 크게 강화됐다."],"부마 민주 항쟁":["유신 체제의 독재와 기본권 제한에 대한 반발이 확산됐다.","1979년 부산과 마산의 학생·시민이 유신 체제에 반대하는 시위를 전개했다.","유신 체제의 위기가 심화되는 계기가 됐다."],"5·18 민주화 운동 시작":["1980년 5월 17일 비상계엄이 전국으로 확대되었고 정치 활동이 제한됐다.","5월 18일 광주에서 민주화 요구에 대한 군의 폭력적 진압에 맞서 항의가 시작됐다.","시민들의 민주화 요구와 저항이 확대되었다."],"6·10 국민대회":["4·13 호헌 조치와 박종철 고문치사 사건 은폐에 대한 비판이 커졌다.","1987년 6월 10일 전국에서 민주화와 대통령 직선제 개헌을 요구하는 집회가 열렸다.","6월 민주 항쟁의 전국적 확산과 6·29 선언으로 이어졌다."],"6·29 선언":["6월 민주 항쟁으로 시민들의 대통령 직선제와 민주화 요구가 확산됐다.","1987년 6월 29일 여당 대통령 후보 노태우가 직선제 개헌 등을 수용하겠다고 발표했다.","제9차 헌법 개정과 대통령 직선제 실현으로 이어졌다."],"제9차 개헌 국민투표":["6월 민주 항쟁 이후 대통령 직선제 개헌안이 마련됐다.","1987년 10월 27일 국민투표로 개헌안이 확정됐다.","10월 29일 개정 헌법이 공포되었으며 대통령 직선제와 5년 단임제를 규정했다."]};
(D.events||[]).forEach(e=>{const v=detailedEvents[e.title];if(v){e.background=v[0];e.development=v[1];e.impact=v[2]}});

const actualSourceByPage={4:"m030",5:"m032",7:"m044",8:"m045",12:"m063"};
for(const q of D.questions){
 if(!q.worksheetSourcePage||!q.id?.startsWith("v109_source_"))continue;
 const id=actualSourceByPage[q.worksheetSourcePage];
 const a=D.assets.find(a=>a.id===id);
 if(a?.path?.startsWith("/history/assets/media/")){
  q.sourceAssetId=id;q.sourceType="사료";q.sourceCaption=a.title;
  delete q.worksheetSourcePage;
 }
}

D.questions.forEach(cleanQuestion);
// The source from the worksheet is used only when a matching *original image* is not available.
const orig=window.HISTORY_MATERIALS?.render;
const escText=v=>ESC(v).replace(/\n/g,"<br>");
if(typeof orig==="function")window.HISTORY_MATERIALS.render=function(q,compact,revealed){
 const asset=D.assets.find(a=>a.id===q?.sourceAssetId);
 const path=asset?.path||"";
 const mayBeMissing=!!q?.worksheetSourcePage|| (!!q?.sourceAssetId&&!path.startsWith("/history/assets/media/")&&!path.startsWith("data:image/"));
 if(!mayBeMissing){const rendered=orig.call(this,q,compact,revealed);return q?.sourceType==="지도"||q?.type==="지도 분석"?rendered.replace("🖼 사료·사진","🗺 지도"):rendered;}
 const page=Number(q.worksheetSourcePage||q.sourcePage||asset?.source_page);
 const exact=(sheet?.pages||[]).find(a=>a.kind==="학생용"&&a.page===page);
 const text=exact?.text||"";
 const title=asset?.title||q.sourceCaption||"학습지 사료";
 const at=Math.max(0,text.indexOf(title));
 const slice=text?text.slice(at,at+1000):"";
 getSheet();
 return `<section class="v109-source-fallback" data-v109-source-page="${page}"><strong>${ESC(title)}</strong><p>원본 이미지 파일 연결을 확인하고 있습니다. 아래는 제공된 학습지의 실제 텍스트입니다.</p><blockquote data-v109-source-text>${escText(slice||"학습지 원문을 불러오는 중…")}</blockquote></section>`;
};

document.addEventListener("click",e=>{
 const x=e.target.closest('[data-arcade-go="arcade-ranking"],[data-a-go="arcade-ranking"]');
 if(x){e.preventDefault();e.stopImmediatePropagation();alert("아직 업데이트 준비중이에요!");}
},true);
window.addEventListener("dmd-worksheet-loaded",()=>{
 document.querySelectorAll(".v109-source-fallback[data-v109-source-page]").forEach(el=>{
  const pg=Number(el.dataset.v109SourcePage);
  const record=(sheet?.pages||[]).find(x=>x.kind==="학생용"&&x.page===pg);
  const out=el.querySelector("[data-v109-source-text]");
  if(out)out.textContent=record?.text?.slice(0,1100)||"학습지에서 원문을 확인해 주세요.";
 });
});
// The materials become readable immediately after asynchronous worksheet data arrives.
})();