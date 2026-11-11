/* 사회범 v16 경제 개념 실험실: 교육용 가상 환율/금리 변화 시뮬레이터, 외부경제와 외부불경제 비교 */
(()=>{
'use strict';
const $=id=>document.getElementById(id);
const fmt=(n,d=0)=>Number(n).toLocaleString('ko-KR',{maximumFractionDigits:d,minimumFractionDigits:d});
const sign=(n)=>n>0?'+'+(fmt(n)):n<0?'−'+fmt(-n):'0';
function lineSvg(start,end,isFx){
 const H=355,W=720,L=88,R=654,T=53,B=286;
 const vals=Array.from({length:7},(_,i)=>{const t=i/6;return start+(end-start)*(t*t*(3-2*t)+(i===2?.035:i===4?-.025:0));}); vals[0]=start;vals[6]=end;
 const margin=isFx?Math.max(40,Math.abs(end-start)*.35):Math.max(.45,Math.abs(end-start)*.35);
 const lo=Math.max(0,Math.min(...vals)-margin),hi=Math.max(...vals)+margin;
 const x=i=>L+(R-L)*i/6,y=n=>B-(B-T)*(n-lo)/(hi-lo);
 let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${isFx?'원 달러 환율':'연이율'} 변화 가상 시계열 그래프"><rect width="${W}" height="${H}" rx="5" fill="#171f2e"/>`;
 for(let i=0;i<=4;i++){
  const v=lo+(hi-lo)*i/4,yy=y(v);s+=`<line x1="${L}" x2="${R}" y1="${yy}" y2="${yy}" stroke="#657086" stroke-dasharray="4 5"/>`;
  s+=`<text x="${L-12}" y="${yy+5}" font-size="15" font-weight="750" text-anchor="end" fill="#f5f5ee">${fmt(v,isFx?0:2)}</text>`;
 }
 s+=`<path d="M${L} ${T}V${B}H${R}" fill="none" stroke="#faf4df" stroke-width="2"/>`;
 s+=`<text x="${L}" y="28" font-size="16" font-weight="850" fill="#ffe6a9">${isFx?'원/달러 환율 (원)':'금리 (연 %) '}</text>`;
 for(let i=0;i<7;i++)s+=`<text x="${x(i)}" y="${B+25}" fill="#e1e7f3" font-size="13" text-anchor="middle">${i+1}기</text>`;
 let path=`M${x(0)} ${y(start)}`;
 for(let i=1;i<7;i++){const mid=(x(i-1)+x(i))/2;path+=` C${mid} ${y(vals[i-1])},${mid} ${y(vals[i])},${x(i)} ${y(vals[i])}`;}
 s+=`<path d="${path}" fill="none" stroke="${isFx?'#85dcff':'#a9f1b7'}" stroke-width="5" stroke-linecap="round"/>`;
 for(let i=0;i<7;i++)s+=`<circle cx="${x(i)}" cy="${y(vals[i])}" r="${i===6||i===0?6.5:4}" fill="${i===6?'#ffda83':'#f5f8ff'}" stroke="#142134" stroke-width="2"/>`;
 const label=(v,idx,anchor)=>`<text x="${x(idx)}" y="${Math.max(T+8,y(v)-17)}" text-anchor="${anchor}" fill="${idx===6?'#ffe18d':'#ffffff'}" font-size="17" font-weight="900">${fmt(v,isFx?0:2)}${isFx?'원':'%'}</text>`;
 s+=label(start,0,'start')+label(end,6,'end')+`<text x="${R}" y="${H-13}" text-anchor="end" fill="#ced9e6" font-size="12">1~7기 수치는 변화 방향을 설명하기 위한 가상 경로</text></svg>`;
 return s;
}
const TABLE=(rows)=>`<div class="econ16-compare"><table><thead><tr><th>비교 항목</th><th>이전</th><th>현재</th><th>차이</th></tr></thead><tbody>${rows.map(row=>`<tr>${row.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const KPIS=(v)=>`<div class="econ16-kpis">${v.map(x=>`<div class="econ16-kpi"><b>${x[0]}</b><strong>${x[1]}</strong><span>${x[2]}</span></div>`).join('')}</div>`;
function fxPanel(){return `<section class="econ16-pane" data-econ16-pane="fx" data-pane="fx" hidden><h4 class="econ16-title">💱 환율 변화 실험실</h4><p class="econ16-lead">원/달러 환율은 <b>1달러를 사는 데 필요한 원화</b>야. 높아지면 원화 가치는 떨어지고, 낮아지면 원화 가치는 올라가. 그래프는 실제 환율이 아닌 교육용 가상 자료야.</p><div class="econ16-layout"><div class="econ16-control"><label for="econ16fxRange">현재 원/달러 환율 <output id="econ16fxValue">1,400원</output><input id="econ16fxRange" type="range" min="1100" max="1700" value="1400" step="10"></label><small>기준 환율 1,300원에서 어떻게 달라지는지 비교해 봐.</small><div class="econ16-preset"><button type="button" data-fxpreset="1200">환율 하락</button><button type="button" data-fxpreset="1300">기준</button><button type="button" data-fxpreset="1500">환율 상승</button></div><small>가정: 달러 표시 가격이 일정하고 환전 수수료는 0원.</small></div><div class="econ16-chart"><div class="econ16-chart-title">원/달러 환율 · 이전과 현재</div><div id="econ16fxPlot"></div></div></div><div id="econ16fxKpis"></div><div id="econ16fxTable"></div><div class="econ16-insight" id="econ16fxInsight" aria-live="polite"></div><p class="econ16-note">주의: 실제 수출입의 변화량은 외국 수요·가격·계약 통화 등에 영향을 받으므로, 환율만으로 수출량이나 수입량을 단정할 수 없어.</p></section>`;}
function ratePanel(){return `<section class="econ16-pane" data-econ16-pane="rate" data-pane="rate" hidden><h4 class="econ16-title">🏦 금리 변화 실험실</h4><p class="econ16-lead">금리가 오르면 같은 원금에 대한 <b>1년 단리 이자</b>는 증가해. 아래는 예·대출 계산 원리를 보여 주는 가상 사례로, 세금·수수료·대출 상환 방식·복리는 고려하지 않아.</p><div class="econ16-layout"><div class="econ16-control"><label for="econ16rateRange">연이율 <output id="econ16rateValue">4.00%</output><input id="econ16rateRange" type="range" min="0.5" max="6" value="4" step="0.25"></label><small>기준 연이율은 3.00%, 예금과 대출의 원금은 각각 1,000만 원으로 가정.</small><div class="econ16-preset"><button type="button" data-ratepreset="2">금리 인하</button><button type="button" data-ratepreset="3">기준</button><button type="button" data-ratepreset="5">금리 인상</button></div><small>예·대출 상품의 실제 이율은 서로 다를 수 있어.</small></div><div class="econ16-chart"><div class="econ16-chart-title">연이율 · 이전과 현재</div><div id="econ16ratePlot"></div></div></div><div id="econ16rateKpis"></div><div id="econ16rateTable"></div><div class="econ16-insight" id="econ16rateInsight" aria-live="polite"></div><p class="econ16-note">참고: 금리 상승은 일반적으로 차입 비용을 높여 투자·소비에 하방 압력을 줄 수 있지만 실제 효과의 크기와 방향은 여러 경제 여건에 따라 달라질 수 있어.</p></section>`;}
function extPanel(){return `<section class="econ16-pane" data-econ16-pane="ext16" data-pane="ext16" hidden><h4 class="econ16-title">🌱 외부경제·외부불경제 비교</h4><p class="econ16-lead">시장 거래 당사자 외의 사람에게 미치는 혜택·피해가 거래 가격에 반영되지 않으면 사적 거래량과 사회적 최적 거래량이 달라질 수 있어. <b>선 3개와 <b>값이 표시된 두 교점</b>으로 비교해 봐.</p><div class="econ16-ext-types" role="group" aria-label="외부효과 유형"><button data-exttype="negProd" aria-pressed="true">부정적 생산 외부효과 · 공장 오염</button><button data-exttype="negCons" aria-pressed="false">부정적 소비 외부효과 · 소음</button><button data-exttype="posProd" aria-pressed="false">긍정적 생산 외부효과 · 기술 확산</button><button data-exttype="posCons" aria-pressed="false">긍정적 소비 외부효과 · 예방접종</button></div><div class="econ16-layout"><div class="econ16-control"><label for="econ16extRange">단위당 외부효과 크기 <output id="econ16extValue">20,000원</output><input id="econ16extRange" type="range" min="0" max="30" value="20" step="2"></label><small>실험용 선형 시장: 사적 편익 MPB=100−Q, 사적 비용 MPC=20+Q. 한 단위당 외부효과가 일정하다고 가정.</small><div class="econ16-preset"><button type="button" data-extpreset="0">없음</button><button type="button" data-extpreset="10">약함</button><button type="button" data-extpreset="24">강함</button></div></div><div class="econ16-chart"><div class="econ16-chart-title">사적 균형 vs. 사회적 최적</div><div id="econ16extPlot"></div><div class="econ16-legend"><span class="econ16-legenditem"><i style="background:#63ceff"></i>사적 편익 MPB</span><span class="econ16-legenditem"><i style="background:#ffc179"></i>사적 비용 MPC</span><span class="econ16-legenditem"><i style="background:#9ff3a3"></i>사회적 편익/비용</span><span class="econ16-legenditem"><i style="background:#ffe072"></i>시장 교점</span><span class="econ16-legenditem"><i style="background:#daaaff"></i>사회적 교점</span></div></div></div><div class="sb17-external-theory"><h4>▤ 외부효과, 어떤 부분이 다른 걸까?</h4><p><u><strong>외부효과</strong></u>는 생산·소비가 거래 당사자 이외의 제3자에게 편익이나 비용을 주지만, 그 영향이 시장가격에 충분히 반영되지 않는 현상이야.</p><table><thead><tr><th>유형</th><th>사적·사회적 한계의 관계</th><th>시장 결과</th><th>예시</th></tr></thead><tbody><tr><td>부정적 생산</td><td><u>MSC &gt; MPC</u></td><td>과다 생산</td><td>공장 오염</td></tr><tr><td>부정적 소비</td><td><u>MSB &lt; MPB</u></td><td>과다 소비</td><td>간접흡연</td></tr><tr><td>긍정적 생산</td><td><u>MSC &lt; MPC</u></td><td>과소 생산</td><td>기술 공유</td></tr><tr><td>긍정적 소비</td><td><u>MSB &gt; MPB</u></td><td>과소 소비</td><td>예방접종</td></tr></tbody></table><h4>그래프를 읽는 4단계</h4><ol><li><u>MPB와 MPC의 교점</u>에서 시장이 실제 선택하는 수량을 찾아.</li><li><u>MSB와 MSC의 교점</u>에서 사회적으로 바람직한 수량을 찾아.</li><li>두 교점의 <u>가로좌표(Q)</u>를 비교해 과다·과소를 판단해.</li><li>두 수량 사이의 사회적 순편익 차이를 면적으로 읽어 후생손실을 구해.</li></ol><p><strong>주의:</strong> 외부경제는 단순히 이익을 내는 기업이란 뜻이 아니고, 외부불경제도 물건이 나쁘다는 뜻이 아니야. 거래에 포함되지 않은 제3자의 혜택·피해가 핵심이야.</p></div><div id="econ16extKpis" aria-label="시뮬레이션 시장 및 최적 값"></div><details class="sb17-solution"><summary>🧩 교점 계산 과정·표 자세히 보기 (학습용)</summary><div id="econ16extTable"></div><div class="econ16-insight" id="econ16extInsight" aria-live="polite"></div></details><p class="econ16-note">정책 설명: 외부불경제에는 사회적 비용을 부담하게 하는 수단, 외부경제에는 보조금·지원 등 유인 제공을 고려할 수 있어. 단, 구체적 정책 효과는 상황에 따라 달라져.</p></section>`;}
function renderFX(){
 const v=Number($('econ16fxRange').value),old=1300,change=v-old,usd=100;
 $('econ16fxValue').textContent=fmt(v)+'원';$('econ16fxPlot').innerHTML=lineSvg(old,v,true);
 $('econ16fxKpis').innerHTML=KPIS([['현재 1달러 가격',fmt(v)+'원','기준 '+fmt(old)+'원'],['원화 가치',v>old?'하락 ↓':v<old?'상승 ↑':'변화 없음','원/달러 환율과 반대 방향'],['100달러 원화비용',fmt(100*v)+'원','기준 '+fmt(100*old)+'원']]);
 $('econ16fxTable').innerHTML=TABLE([['원/달러 환율',fmt(old)+'원',fmt(v)+'원',sign(change)+'원'],['100달러 구매 비용',fmt(old*100)+'원',fmt(v*100)+'원',sign(change*100)+'원'],['500달러 구매 비용',fmt(old*500)+'원',fmt(v*500)+'원',sign(change*500)+'원']]);
 $('econ16fxInsight').textContent=change>0?`환율이 ${fmt(change)}원 올랐어. 원화 가치는 하락하며, 달러 가격이 그대로라면 100달러짜리 물건의 원화 구매 비용은 ${fmt(change*100)}원 증가해.`:change<0?`환율이 ${fmt(-change)}원 내렸어. 원화 가치는 상승하며, 달러 가격이 그대로라면 100달러짜리 물건의 원화 구매 비용은 ${fmt(-change*100)}원 감소해.`:'기준과 환율이 같아. 이 모형에서는 환율 변화로 인한 원화 비용 차이가 없어.';
}
function renderRate(){
 const r=Number($('econ16rateRange').value),old=3,amount=10000000,delta=r-old;
 const a=amount*old/100,b=amount*r/100;
 $('econ16rateValue').textContent=fmt(r,2)+'%';$('econ16ratePlot').innerHTML=lineSvg(old,r,false);
 $('econ16rateKpis').innerHTML=KPIS([['현재 연이율',fmt(r,2)+'%','기준 '+fmt(old,2)+'%'],['1,000만 원 연이자',fmt(b)+'원','1년 단리'],['기준 대비 이자',sign(b-a)+'원','금리 차이 '+sign(delta)+'%p']]);
 $('econ16rateTable').innerHTML=TABLE([['연이율',fmt(old,2)+'%',fmt(r,2)+'%',sign(delta)+'%p'],['1년 단리 이자',fmt(a)+'원',fmt(b)+'원',sign(b-a)+'원'],['100만 원 1년 이자',fmt(a/10)+'원',fmt(b/10)+'원',sign((b-a)/10)+'원']]);
 $('econ16rateInsight').textContent=delta>0?`금리가 ${fmt(delta,2)}%p 올랐어. 다른 조건이 같다면 1,000만 원을 1년 동안 차입했을 때 단리 이자 부담은 ${fmt(b-a)}원 증가해.`:delta<0?`금리가 ${fmt(-delta,2)}%p 내렸어. 다른 조건이 같다면 1,000만 원을 1년 동안 차입했을 때 단리 이자 부담은 ${fmt(a-b)}원 감소해.`:'기준 금리와 같아서 단리 이자 변화가 없어.';
}
let extType='negProd';
const EXT_TYPES={negProd:['외부불경제·생산','공장 오염','과다 생산','단위당 환경 피해를 반영하면 사회적 한계비용이 사적 한계비용보다 높아져.'],negCons:['외부불경제·소비','소음 발생','과다 소비','사회적 한계편익이 사적 한계편익보다 작아져.'],posProd:['외부경제·생산','기술 확산','과소 생산','긍정적 파급효과를 반영하면 사회적 한계비용이 사적 한계비용보다 낮아져.'],posCons:['외부경제·소비','예방접종','과소 소비','사회적 한계편익이 사적 한계편익보다 커져.']};
function renderExternal(){
 const val=Number($('econ16extRange').value),negative=extType.startsWith('neg'),production=extType.endsWith('Prod');
 const qm=40,qs=qm+(negative?-val/2:val/2),dwl=val*Math.abs(qs-qm)/2;
 const a=100,c=20,mb=q=>a-q,mc=q=>c+q,msb=q=>mb(q)+(production?0:negative?-val:val),msc=q=>mc(q)+(production?negative?val:-val:0);
 const L=78,R=646,T=46,B=279,maxp=130,maxq=80,x=q=>L+(R-L)*q/maxq,y=p=>B-(B-T)*p/maxp;
 const curve=(fn,color,dashed)=>{let d='';for(let q=0;q<=80;q+=1){const p=fn(q);if(p<0||p>maxp)continue;d+=`${d?'L':'M'}${x(q).toFixed(1)},${y(p).toFixed(1)} `;}return `<path d="${d}" fill="none" stroke="${color}" stroke-width="4.5" ${dashed?'stroke-dasharray="9 6"':''}/>`};
 let z=`<svg viewBox="0 0 720 425" role="img" aria-label="${EXT_TYPES[extType][0]}: 시장균형 거래량·가격과 사회적 최적 거래량·가격을 수치로 나타낸 그래프"><rect width="720" height="425" fill="#171f2e"/>`;
 for(let i=0;i<=4;i++){let yy=B-(B-T)*i/4;z+=`<line x1="${L}" y1="${yy}" x2="${R}" y2="${yy}" stroke="#536178" stroke-dasharray="5 6"/><text x="${L-8}" y="${yy+4}" font-size="14" text-anchor="end" fill="#f4f4ef">${fmt(maxp*i/4*1000,0)}</text>`;}
 for(let i=0;i<=4;i++){let xx=L+(R-L)*i/4;z+=`<line x1="${xx}" y1="${T}" x2="${xx}" y2="${B}" stroke="#536178" stroke-dasharray="5 6"/><text x="${xx}" y="${B+23}" text-anchor="middle" fill="#f4f4ef" font-size="14">${i*20}</text>`;}
 z+=`<path d="M${L} ${T}V${B}H${R}" stroke="#fff4e0" fill="none" stroke-width="2"/><text x="${L}" y="26" fill="#ffe1a0" font-size="15" font-weight="850">가격(원)</text><text x="${R}" y="${B+46}" text-anchor="end" fill="#ffe1a0" font-size="15" font-weight="850">거래량(개)</text>`;
 const point=(q,p,col,label,dx,dy)=>`<circle cx="${x(q)}" cy="${y(p)}" r="7.2" fill="${col}" stroke="#1a2230" stroke-width="2.5"/><path d="M${x(q)} ${y(p)}V${B}" fill="none" stroke="${col}" stroke-width="2" stroke-dasharray="4 5"/><text x="${Math.max(L+15,Math.min(R-15,x(q)+dx))}" y="${y(p)+dy}" text-anchor="${dx<0?'end':'start'}" fill="${col}" font-weight="900" font-size="14" paint-order="stroke" stroke="#171f2e" stroke-width="3">${label}</text>`;
 const pm=mb(qm),ps=msb(qs);
 z+=curve(mb,'#63ceff')+curve(mc,'#ffc179')+(production?curve(msc,'#9ff3a3',true):curve(msb,'#9ff3a3',true));
 // 개념 시뮬레이션: 시장 교점과 사회적 최적 교점은 색·좌표·값을 모두 표시한다.
 // 퀴즈는 econ-renderer-v17.js의 외부효과 그래프를 사용하므로 이 표시가 퀴즈 정답을 누출하지 않는다.
 const atMarket=point(qm,pm,'#ffe072',val===0?'시장 = 최적':'시장균형',12,27);
 const atOptimal=val===0?'':point(qs,ps,'#daaaff','사회적 최적',-14,-13);
 // 교점 사이 간격이 좁을 땐 숫자가 가려지지 않도록 아래 정보 카드에서 완전한 값을 제공한다.
 z+=atMarket+atOptimal;
 if(val===0){
   z+=`<text x="${Math.min(R-112,x(qm)+12)}" y="${y(pm)+23}" fill="#f5d8ff" font-size="15" font-weight="850">시장 = 사회적 최적</text>`;
 }
 const info=(left,label,color,quantity,price)=>`<rect x="${left}" y="350" width="270" height="65" rx="6" fill="#293448" stroke="${color}" stroke-width="2.5"/><rect x="${left}" y="350" width="270" height="6" rx="3" fill="${color}"/><text x="${left+14}" y="374" fill="${color}" font-weight="900" font-size="17">${label}</text><text x="${left+14}" y="399" fill="#ffffff" font-weight="800" font-size="17">Q ${fmt(quantity,0)}개 · P ${fmt(price*1000,0)}원</text>`;
 z+=info(84,'● 시장균형 (MPB = MPC)','#ffe072',qm,pm)+info(368,'◆ 사회적 최적 (MSB = MSC)','#daaaff',qs,ps);
 z+='</svg>';
 $('econ16extPlot').innerHTML=z;
 $('econ16extValue').textContent=fmt(val*1000)+'원';
 const typ=EXT_TYPES[extType];
 $('econ16extKpis').innerHTML=KPIS([['시장 거래량 Qm',qm+'개','사적 편익=사적 비용'],['사회적 최적 Q★',qs+'개',typ[2]],['후생손실 DWL',fmt(dwl*1000,0)+'원','1/2 × 외부효과 × 거래량 차이']]);
 $('econ16extTable').innerHTML=TABLE([['거래량',qm+'개',qs+'개',sign(qs-qm)+'개'],['단위당 외부효과','0원',fmt(val*1000,0)+'원',sign(val*1000)+'원'],['후생손실',fmt(dwl*1000,0)+'원','0원','−'+fmt(dwl*1000,0)+'원']]);
 $('econ16extInsight').textContent=`${typ[0]} · ${typ[1]} 사례. ${typ[3]} 이 시뮬레이션의 시장량 ${qm}개와 사회 최적량 ${qs}개를 비교하면 ${val===0?'차이가 없어.':typ[2]+' 문제가 생긴다는 점을 볼 수 있어.'} 후생손실은 ${fmt(dwl*1000,0)}원이야.`;
}
function mount(){
 const host=$('sb-v12-workshop');if(!host||!host.querySelector('.sb12-shell'))return;
 const shell=host.querySelector('.sb12-shell');if(shell.dataset.econ16Attached==='yes')return;
 shell.dataset.econ16Attached='yes';
 const tabs=shell.querySelector('.sb12-tabs');if(!tabs)return;
 // compact at-a-glance legend; existing 4 original tabs stay intact
 tabs.insertAdjacentHTML('beforebegin',`<div class="econ16-topline" aria-label="경제 핵심 정리"><div><b>수요·공급</b><span>가격·거래량·시장 불균형</span></div><div><b>환율·금리</b><span>원화 가치와 1년 이자 계산</span></div><div><b>외부경제·외부불경제</b><span>사적 균형과 사회적 최적 비교</span></div></div>`);
 tabs.insertAdjacentHTML('beforeend','<button type="button" data-econtab="fx" role="tab" aria-selected="false">⑤ 환율 변화</button><button type="button" data-econtab="rate" role="tab" aria-selected="false">⑥ 금리 변화</button><button type="button" data-econtab="ext16" role="tab" aria-selected="false">⑦ 외부효과 심화</button>');
 shell.insertAdjacentHTML('beforeend',fxPanel()+ratePanel()+extPanel());
 const activate=target=>{tabs.querySelectorAll('[data-econtab]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.econtab===target)));shell.querySelectorAll('[data-pane]').forEach(p=>p.hidden=p.dataset.pane!==target);};
 tabs.querySelectorAll('[data-econtab="fx"],[data-econtab="rate"],[data-econtab="ext16"]').forEach(b=>b.addEventListener('click',()=>{activate(b.dataset.econtab);if(b.dataset.econtab==='fx')renderFX();if(b.dataset.econtab==='rate')renderRate();if(b.dataset.econtab==='ext16')renderExternal();}));
 $('econ16fxRange').addEventListener('input',renderFX);
 $('econ16rateRange').addEventListener('input',renderRate);
 $('econ16extRange').addEventListener('input',renderExternal);
 shell.querySelectorAll('[data-fxpreset]').forEach(b=>b.addEventListener('click',()=>{$('econ16fxRange').value=b.dataset.fxpreset;renderFX()}));
 shell.querySelectorAll('[data-ratepreset]').forEach(b=>b.addEventListener('click',()=>{$('econ16rateRange').value=b.dataset.ratepreset;renderRate()}));
 shell.querySelectorAll('[data-extpreset]').forEach(b=>b.addEventListener('click',()=>{$('econ16extRange').value=b.dataset.extpreset;renderExternal()}));
 shell.querySelectorAll('[data-exttype]').forEach(b=>b.addEventListener('click',()=>{extType=b.dataset.exttype;shell.querySelectorAll('[data-exttype]').forEach(a=>a.setAttribute('aria-pressed',String(a===b)));renderExternal()}));
 renderFX();renderRate();renderExternal();
 shell.querySelectorAll('.econ16-chart,.sb12-plotbox').forEach(box=>{
   if(box.querySelector('.econ16-zoom-action'))return;
   const btn=document.createElement('button');btn.type='button';btn.className='econ16-zoom-action';btn.textContent='🔎 그래프 크게 보기';
   btn.addEventListener('click',()=>zoomGraph(box));box.prepend(btn);
 });
}
function zoomGraph(box){
 const svg=box.querySelector('svg');if(!svg)return;
 let modal=document.getElementById('econ16ZoomModal');
 if(!modal){
   modal=document.createElement('div');modal.id='econ16ZoomModal';modal.className='econ16-zoom-modal';modal.hidden=true;
   modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-label','경제 그래프 확대 보기');
   modal.innerHTML='<div class="econ16-zoom-dialog"><div class="econ16-zoom-bar"><strong>🔎 경제 그래프 확대</strong><button class="econ16-zoom-close" type="button">닫기 ✕</button></div><div class="econ16-zoom-scroll"></div><small>모바일은 그래프를 좌우로 스크롤해 자세히 볼 수 있어. 확대 화면은 읽기 전용이야.</small></div>';
   document.body.appendChild(modal);
   modal.addEventListener('click',e=>{if(e.target===modal||e.target.closest('.econ16-zoom-close'))modal.hidden=true;});
   document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)modal.hidden=true;});
 }
 const area=modal.querySelector('.econ16-zoom-scroll');area.innerHTML='';area.appendChild(svg.cloneNode(true));
 modal.hidden=false;modal.querySelector('.econ16-zoom-close').focus();
}
const previousRefresh=window.SB_V12_REFRESH;
if(typeof previousRefresh==='function')window.SB_V12_REFRESH=function(unit){previousRefresh(unit);if(unit==='경제')mount();};
document.querySelectorAll('[data-econ16-focus]').forEach(b=>b.addEventListener('click',()=>{
 // Respect original app's filter/event logic, no forked quiz engine.
 const unit=document.querySelector('#page-home [data-unit="경제"]');if(unit)unit.click();
 const focus=document.querySelector('#page-home [data-study-focus="경제심화"]');if(focus)focus.click();
 const difficulty=$('difficultySelect');if(difficulty&&difficulty.value!=='all'){difficulty.value='all';difficulty.dispatchEvent(new Event('change',{bubbles:true}));}
 const type=$('graphTypeSelect');if(type){type.value=b.dataset.econ16Focus;type.dispatchEvent(new Event('change',{bubbles:true}));}
 const action=document.querySelector('#page-home .graph-study-action');if(action)action.click();
}));
})();
