/* 한국사 7.2 | 원문과 실제 자료를 대조해 발견된 출제 결함 수정.
 * 교과서 44장·기존 저장 ID·학습 모드는 보존합니다. */
(()=>{'use strict';
const d=window.HISTORY_DATA;if(!d?.questions)return;
const qmap=new Map(d.questions.map(q=>[q.id,q]));
// 교과서 이미지 외 실제 자료를 확대해 확인하여 수정한 임시 메타데이터.
const a=d.assets?.find(a=>a.id==='m185');
if(a){a.title='샌프란시스코 강화 조약 제2조(a)';a.category='독도·영토 관련 사료';}
const m=qmap.get('src_v71_028');if(m){m.sourceCaption='샌프란시스코 강화 조약 제2조(a)';m.sourceNote='첨부된 강화 조약 제2조(a) 발췌를 읽고 푸는 문제입니다. 최초 이미지 출처는 별도 확인이 필요합니다.';}
// 실제 사진·지도가 없는 80개 자동 생성 문제를 자료 형태에 맞게 정직하게 분류.
let renamedCards=0,renamedLocations=0;
for(const q of d.questions){
 if(q.id.startsWith('v2_')&&q.type==='사진·도표'&&!q.sourceAssetId){q.type='역사 기록 카드';q.sourceNote='실제 사진이 아닌, 사건 설명을 재구성한 학습용 기록 카드입니다.';renamedCards++;}
 if(q.id.startsWith('v2_')&&q.type==='지도 분석'&&!q.sourceAssetId){q.type='지역 추론';q.sourceNote='실제 지도 이미지가 아닌, 사건과 장소를 연결하는 연습 문제입니다.';renamedLocations++;}
}
// 정답 문구가 지문에 노출된 10문항: 기존 정답/선지 ID를 보존하면서 지문을 정정.
const fixes={
'v2_110':'1945년 12월에 미국·영국·소련의 외무장관이 한국 문제와 임시정부 수립을 논의한 회의는 어느 도시에서 열렸는가?',
'v2_172':'다음 역사 학습지의 (가)에 들어갈 사건은?\\n\\n1948년 8월 15일, 서울 중앙청 광장에서 새 국가 정부의 출범을 대내외에 알리는 경축식이 열렸다. → (가)',
'v2_174':'1948년 8월 15일, 제헌 헌법에 따라 조직된 정부가 국내외에 정식 출범을 알린 사건은?',
'v2_175':'다음 역사 기록 카드가 가리키는 사건은?\\n\\n[연도] 1948년\\n[단서] 제헌 국회의 헌법 제정과 초대 대통령 선출 뒤, 8월 15일 서울에서 정부의 출범을 선포하였다.',
'v2_181':'다음 학습지의 빈칸 (가)에 들어갈 사건은?\\n\\n1948년 9월 9일, 평양에서 새로운 정권의 수립이 공식 선포되었다. → (가)',
'v2_183':'1948년 9월 9일 평양에서 김일성을 중심으로 한 정권의 수립을 선포한 사건은?',
'v2_184':'다음 역사 기록 카드가 가리키는 사건은?\\n\\n[연도] 1948년\\n[장소] 평양\\n[단서] 9월 9일, 북쪽 지역에서 새 정권의 출범이 선포되었다.',
'v2_191':'1950년 6월에 시작되어 북쪽과 남쪽 지역 모두에 막대한 피해를 남긴 전쟁의 주요 전장은 어디인가?',
'v2_317':'1979년 10월, 유신 체제에 반대하는 학생과 시민의 대규모 시위가 전개된 남부 두 도시는?',
'v2_422':'2018년 4월 27일, 남북 정상이 군사분계선 인근에서 회담하고 공동선언을 발표한 장소는?'
};
for(const [id,str] of Object.entries(fixes)){const q=qmap.get(id);if(q){q.prompt=str.replace(/\\n/g,'\n');q.reviewNote='7.2 정답 노출 지문 수정';}}
// 기본 문제와 심화 문제에 완전히 같은 질문이 있던 부분: 연도 자체를 외우는 문제를 시대 특징으로 재출제.
const dup=qmap.get('qm027');if(dup){dup.prompt='제4공화국 성립의 계기가 된 비상 조치와 유신 헌법이 추진된 해는?';dup.explanation='1972년 10월 17일 비상 조치 발표와 유신 헌법 제정 과정이 이어졌다.';}
// 실제 도표가 없는데 '그래프 읽기'라고 쓴 심화 문항을 설명 자료형으로 고침.
const relabel={
'v4_auth_067':['개념·인과','1960~70년대 수출과 제조업 생산 비중이 증가한 경제 구조의 변화로 알맞은 것은?'],
'v4_auth_088':['개념·인과','1987년 6월 민주 항쟁에서 외친 ‘호헌 철폐·독재 타도’가 요구한 핵심적인 정치적 변화는?'],
'v4_auth_113':['개념·인과','출생아 수 감소와 65세 이상 인구 비율 증가가 함께 나타나는 사회 현상을 무엇이라 하는가?'],
'v4_auth_072':['실제 자료 분석','제시된 5·18 민주화 운동 당시의 사진이 기록된 주요 도시는?']
};
for(const [id,[kind,prompt]] of Object.entries(relabel)){const q=qmap.get(id);if(q){q.type=kind;q.prompt=prompt;}}
// 국가기록원 내부 자료에도 1962.1.5 공표/1.13 정부 발표 등 기준일 표기가 달라
// 모호한 '몇 월 며칠?' 대신 공통으로 확인되는 월 단위로 묻는다.
const economic=qmap.get('v2_270');if(economic){
 economic.prompt='제1차 경제 개발 5개년 계획이 공식 발표·공표된 시기는 1962년 몇 월인가?';
 economic.options=['1월','3월','6월','10월'];economic.answer=0;
 economic.explanation='1962년 1월에 제1차 계획이 공표·발표되었다. 기록에 따라 1월 5일(공표)과 1월 13일(정부 발표) 등이 구분되어 적히므로 날짜의 기준을 확인해야 한다.';
 economic.reviewNote='7.2 날짜 기준 구분';
}
// 개별 사료와 직접 대응되지 않는 '교과서 페이지'는 문제풀이에 절대 붙이지 않음.
for(const q of d.questions){delete q.textbookPage;if(q.materialImage?.includes('/textbook/'))delete q.materialImage;}
const kinds=['전체','객관식','연도','OX','실제 자료 분석','사료 추론','역사 기록 카드','지역 추론','개념·인과','인물·기관','A·B 사이','ㄱ~ㅁ 연표','연·월·일','학습지 빈칸','서술형','교과서 심화'];
window.HISTORY_V2_TYPES=kinds;
window.HISTORY_AUDIT_72={questionCount:d.questions.length,renamedCards,renamedLocations,rewrittenPrompts:Object.keys(fixes).length,rewrittenDuplicates:1,correctedAssetMetadata:['m185'],imageSourceQuestions:d.questions.filter(q=>q.sourceAssetId&&q.sourceVerifiedForQuestion).length};
})();