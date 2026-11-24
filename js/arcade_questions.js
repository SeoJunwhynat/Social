/* 한국사2 v2: 중간고사 훈련기의 문제 유형을 현대사 사건 데이터에 적용한 학습용 문항 */
(()=>{'use strict';
const d=window.HISTORY_DATA;if(!d)return;
const es=[...d.events].sort((a,b)=>a.date.localeCompare(b.date));
const pool=d.questions;const pad=n=>String(n).padStart(2,'0');
const normDate=s=>{const p=String(s).split('-');return p.length===3?`${+p[1]}월 ${+p[2]}일`:s};
function vals(correct,choices,count=4){const list=[correct,...choices.filter(x=>x!==correct&&!([correct,...choices.slice(0,choices.indexOf(x))].includes(x)))];return [...new Set(list)].slice(0,count);}
function rotate(arr,n){return arr.slice(n).concat(arr.slice(0,n));}
function buildOptions(correct,other,seed,count=4){const choices=rotate([...new Set(other.filter(x=>x!==correct))],seed%Math.max(1,other.length));const a=[correct,...choices].slice(0,count);const idx=seed%a.length;[a[0],a[idx]]=[a[idx],a[0]];return [a,idx]}
function add(kind,era,level,prompt,correct,others,why,extra={}){
 const i=pool.length,seed=i*13+7;const [options,answer]=buildOptions(String(correct),others.map(String),seed,extra.count||4);
 if(options.length<2)return;
 pool.push({id:`v2_${pad(i+1)}`,era,level,type:kind,prompt,options,answer,explanation:why,...extra});
}
const hideAnswer=(summary,title)=>String(summary).split(title).join('이 사건');
const titles=es.map(e=>e.title),years=[...new Set(es.map(e=>String(e.year)))],dates=[...new Set(es.map(e=>normDate(e.date)))],places=[...new Set(es.map(e=>e.place))];
for(let i=0;i<es.length;i++){
 const e=es[i],local=es.filter(a=>a.era===e.era),others=[...local,...es.filter(a=>a.era!==e.era)].map(x=>x.title);
 add('사료 추론',e.era,'보통',`다음은 당시 상황을 정리한 학습용 사료 요약이다. 관련된 사건은?\n\n「${hideAnswer(e.summary,e.title)}」`,e.title,others,`${e.date}에 해당하는 사건은 ${e.title}이다.`,{sourceKind:'사료 요약',sourceNote:'원문 인용이 아닌 학습용 재구성 자료'});
 add('연·월·일',e.era,'보통',`다음 사건이 발생한 연도는?\n\n${e.title}`,e.year,years,`${e.title}의 기록 날짜는 ${e.date}이다.`);
 add('연·월·일',e.era,'어려움',`다음 사건이 일어난 월·일은?\n\n${e.title}`,normDate(e.date),dates,`${e.title}의 기록 날짜는 ${e.date}이다.`);
 add('학습지 빈칸',e.era,'보통',`다음 역사 학습지의 빈칸 (가)에 들어갈 사건은?\n\n${e.year}년, ${e.place}과(와) 관련해 기록된 주요 사건 → (가)\n단서: ${e.summary}`,e.title,others,`${e.title}을(를) 묻는 빈칸 문제이다. 관련 시기 ${e.date}.`);
 add('지도 분석',e.era,'어려움',`다음 사건과 연결되는 장소·지역은?\n\n${e.title}\n${e.summary}`,e.place,places,`연표에 기록된 사건의 관련 지역은 '${e.place}'이다.`,{sourceKind:'지역 단서',sourceNote:'실제 지도가 아닌 학습용 위치 정보 문제'});
 add('개념·인과',e.era,'어려움',`다음 설명의 사건을 고르시오.\n\n${e.summary}`,e.title,others,`${e.title}: ${e.summary}`);
 add('사진·도표',e.era,'보통',`다음 역사 자료 카드의 빈칸에 들어갈 사건명은?\n\n[역사 기록 카드]\n시기: ${e.year}년\n내용: ${e.summary}`,e.title,others,`역사 기록 카드가 설명하는 사건은 ${e.title}이다.`,{sourceKind:'자료형 모식도',sourceNote:'교과서 사진 자체가 아닌 사건 요약 카드'});
 if(i>0&&i<es.length-1){const bef=es[i-1],aft=es[i+1];const wrong=es.filter(x=>x.date<=bef.date||x.date>=aft.date).map(x=>x.title);add('A·B 사이',e.era,'최상',`다음 A와 B 사이에 일어난 사건은?\n\nA: ${bef.title} (${bef.date})\nB: ${aft.title} (${aft.date})`,e.title,wrong,`${bef.title} → ${e.title} → ${aft.title}의 순서이다.`)}
 if(i<=es.length-5){const five=es.slice(i,i+5);if(new Set(five.map(v=>v.date)).size===5){const labels=['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ'];const mapped=rotate(five,(i+2)%5).map((a,j)=>({label:labels[j],evt:a}));const correct=mapped.slice().sort((a,b)=>a.evt.date.localeCompare(b.evt.date)).map(x=>x.label).join(' → ');const fakes=[];for(let k=1;k<=8;k++)fakes.push(rotate(mapped,k%5).map(x=>x.label).join(' → '));add('ㄱ~ㅁ 연표',e.era,'최상',`다음 사건을 시간순으로 옳게 배열한 것은?\n\n${mapped.map(v=>`${v.label}. ${v.evt.title}`).join('\n')}`,correct,fakes,`${five.map(v=>v.date+' '+v.title).join(' → ')}`)}}
}
const people=[
 ['여운형','좌우 합작과 통합을 모색했으며 1947년 피살된 인물','광복·정부 수립'],
 ['이승만','대한민국 정부 수립 직후 초대 대통령','광복·정부 수립'],
 ['장면','1960년 내각 책임제 아래 출범한 정부의 국무총리','민주주의·산업화'],
 ['박종철','1987년 경찰의 고문 과정에서 사망했으며 민주화 여론을 자극한 대학생','민주화 운동']
];
for(const [person,desc,era] of people){add('인물·기관',era,'어려움',`다음 설명에 해당하는 역사 인물은?\n\n${desc}`,person,people.map(x=>x[0]),`${person}: ${desc}`)}
const written=es.map((e,i)=>({id:`v2_write_${i+1}`,era:e.era,level:i%3===0?'어려움':'보통',type:'서술형',prompt:`다음 설명에 해당하는 역사 사건의 정확한 명칭을 작성하시오.\n\n${e.date} / ${e.summary}`,options:[],answer:-1,answerText:e.title,explanation:`정답 예시: ${e.title} (${e.date}).`,sourceNote:'띄어쓰기 및 일부 기호 차이는 무시하여 채점'}));
pool.push(...written);
window.HISTORY_V2_TYPES=['전체','객관식','연도','OX','사료 추론','개념·인과','인물·기관','사진·도표','지도 분석','A·B 사이','ㄱ~ㅁ 연표','연·월·일','학습지 빈칸','서술형'];
window.HISTORY_V2_QUESTION_COUNT={legacy:pool.length-written.length-Object.keys(d.events).length,generated:pool.length-97,total:pool.length};
})();
