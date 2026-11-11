/* 사회범 v17: 5개 대안 기회비용 계산 실험실 */
(()=>{
'use strict';
const fmt=n=>Number(n).toLocaleString('ko-KR',{maximumFractionDigits:0});
const $=id=>document.getElementById(id);
const f=v=>fmt(v*1000)+'원';
const records=[
 {label:'A',name:'디자인 외주',benefit:75,cost:18},
 {label:'B',name:'프로그래밍',benefit:86,cost:32},
 {label:'C',name:'영상 편집',benefit:71,cost:9},
 {label:'D',name:'행사 기획',benefit:95,cost:29},
 {label:'E',name:'번역 작업',benefit:64,cost:8}
];
function render(){
 const host=$('sb17ChoiceLab');if(!host)return;
 host.innerHTML=`<div class="sb17-choice-head"><h4>▣ 5개 대안 기회비용 실험</h4><p>동일 시간에 <u>한 가지 일만</u> 할 수 있어. 편익은 받는 가치, 명시적 비용은 실제 지출액이야. 모든 수치는 가상 예시야.</p></div><div class="sb17-choice-layout"><div class="sb17-choice-table"><table><thead><tr><th>대안</th><th>예상 편익</th><th>명시적 비용</th><th>순편익</th></tr></thead><tbody>${records.map(o=>`<tr><td><b>${o.label}. ${o.name}</b></td><td><input data-choice-field="benefit" data-choice-id="${o.label}" type="number" min="0" max="500" step="1" value="${o.benefit}" aria-label="${o.label} 편익 (천 원)"></td><td><input data-choice-field="cost" data-choice-id="${o.label}" type="number" min="0" max="500" step="1" value="${o.cost}" aria-label="${o.label} 명시적 비용 (천 원)"></td><td class="sb17-unrevealed" data-net="${o.label}">계산하기</td></tr>`).join('')}</tbody></table><small>입력은 <u>천 원 단위</u>이며 계산 결과는 원 단위로 나타나. 예: 입력 30 → 30,000원</small></div><div class="sb17-choice-controls"><label>어느 대안을 선택할까?<select id="sb17Chosen">${records.map(o=>`<option value="${o.label}">${o.label}. ${o.name}</option>`).join('')}</select></label><button id="sb17Calc" type="button" class="btn-primary">선택의 기회비용 계산</button><button id="sb17Reset" type="button" class="btn-outline">기본값 복원</button><div id="sb17CalcResult" class="sb17-calc-result" aria-live="polite">왼쪽 표에서 금액과 선택지를 설정한 뒤 계산 버튼을 눌러 봐.</div></div></div><div class="sb17-choice-guide"><p><u><strong>순편익 = 편익 − 명시적 비용</strong></u>. 한 대안을 선택하면 그 대안에 실제로 지출한 돈과, <u>포기한 다른 대안 중 순편익이 가장 높은 하나</u>를 함께 생각해야 해.</p><p><u><strong>기회비용 = 선택한 대안의 명시적 비용 + 포기한 최선 대안의 순편익(암묵적 비용)</strong></u>. 따라서 선택의 경제적 순편익은 선택의 편익에서 기회비용을 뺀 값이야. 이 모형은 선택지 간 기회가 양립하지 않고 동일한 기간을 사용하는 상황을 가정해.</p></div>`;
 const read=()=>records.map(o=>{const b=host.querySelector(`[data-choice-field="benefit"][data-choice-id="${o.label}"]`),c=host.querySelector(`[data-choice-field="cost"][data-choice-id="${o.label}"]`);return {...o,benefit:Math.max(0,Math.min(500,Number(b?.value)||0)),cost:Math.max(0,Math.min(500,Number(c?.value)||0))}});
 $('sb17Calc').onclick=()=>{
    const arr=read(), chosen=$('sb17Chosen').value, sel=arr.find(o=>o.label===chosen), rest=arr.filter(o=>o.label!==chosen).sort((a,b)=>(b.benefit-b.cost)-(a.benefit-a.cost)), top=rest[0];
    const implicit=Math.max(0,top.benefit-top.cost),opp=sel.cost+implicit,net=sel.benefit-opp;
    host.querySelectorAll('[data-net]').forEach(el=>{const o=arr.find(x=>x.label===el.dataset.net);el.textContent=f(o.benefit-o.cost);el.classList.remove('sb17-unrevealed');});
    $('sb17CalcResult').innerHTML=`<strong>선택 ${sel.label} · ${sel.name}</strong><ul><li>명시적 비용: <b>${f(sel.cost)}</b></li><li>포기한 최선 대안: <b>${top.label}. ${top.name}</b> (순편익 ${f(implicit)})</li><li><u>기회비용 = ${f(sel.cost)} + ${f(implicit)} = <strong>${f(opp)}</strong></u></li><li>경제적 순편익 = ${f(sel.benefit)} − ${f(opp)} = <b>${f(net)}</b></li></ul><small>최선 대안의 순편익이 0 이하라면 암묵적 비용을 0으로 간주했어.</small>`;
 };
 $('sb17Reset').onclick=render;
}
function mount(){
 const shell=document.querySelector('#sb-v12-workshop .sb12-shell');if(!shell||shell.dataset.sb17Choice==='yes')return;
 const tabs=shell.querySelector('.sb12-tabs');if(!tabs)return;
 shell.dataset.sb17Choice='yes';
 tabs.insertAdjacentHTML('beforeend','<button type="button" data-econtab="choice17" role="tab" aria-selected="false">⑧ 기회비용 5대안</button>');
 shell.insertAdjacentHTML('beforeend','<section data-pane="choice17" id="sb17ChoiceLab" class="sb17-choice-panel" hidden></section>');
 tabs.querySelector('[data-econtab="choice17"]').onclick=()=>{
   tabs.querySelectorAll('[data-econtab]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.econtab==='choice17')));
   shell.querySelectorAll('[data-pane]').forEach(p=>p.hidden=p.dataset.pane!=='choice17');render();
 };
}
const prev=window.SB_V12_REFRESH;
if(typeof prev==='function')window.SB_V12_REFRESH=(unit)=>{prev(unit);if(unit==='경제')mount();};
if(document.querySelector('#sb-v12-workshop .sb12-shell'))mount();
})();