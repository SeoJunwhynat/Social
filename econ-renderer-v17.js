/* 사회범 v16 그래프 렌더러 확장 — 자체 교육용 가상 데이터 */
(()=>{
 'use strict';
 const previous=window.SOCIAL_RENDER_GRAPH;
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const fmt=(n,d=1)=>Number(n).toLocaleString('ko-KR',{maximumFractionDigits:d});
 const X0=84,X1=652,Y0=48,Y1=275,W=720,H=360;
 const axis=(maxQ,maxP,yl='가격(천 원)')=>{
   let z=`<rect width="720" height="360" rx="7" fill="#171f2e"/>`;
   for(let i=0;i<=5;i++){
     const y=Y1-(Y1-Y0)*i/5,x=X0+(X1-X0)*i/5;
     z+=`<line x1="${X0}" x2="${X1}" y1="${y}" y2="${y}" stroke="#58657a" stroke-width="1" stroke-opacity=".6" stroke-dasharray="4 5"/>`;
     z+=`<line x1="${x}" x2="${x}" y1="${Y0}" y2="${Y1}" stroke="#58657a" stroke-width="1" stroke-opacity=".6" stroke-dasharray="4 5"/>`;
     z+=`<text x="${X0-14}" y="${y+4}" text-anchor="end" font-size="13" font-weight="700" fill="#e4e9f3">${fmt(maxP*i/5*1000,0)}</text>`;
     z+=`<text x="${x}" y="${Y1+22}" text-anchor="middle" font-size="13" fill="#e4e9f3">${fmt(maxQ*i/5,0)}</text>`;
   }
   return z+`<path d="M${X0} ${Y0}V${Y1}H${X1}" fill="none" stroke="#f7f2dd" stroke-width="2"/>`+
      `<text x="${X0}" y="28" fill="#f8e4b5" font-size="14" font-weight="800">${esc(yl)}</text>`+
      `<text x="${X1}" y="${Y1+48}" fill="#f8e4b5" text-anchor="end" font-size="14" font-weight="800">수량(Q)</text>`;
 };
 const xy=(q,p,mq,mp)=>[X0+(X1-X0)*q/mq,Y1-(Y1-Y0)*p/mp];
 function strokeCurve(f,mq,mp,color,dash=''){
   let coords=[];
   for(let i=0;i<=120;i++){
     const q=mq*i/120,p=f(q);
     if(p>=0&&p<=mp){const [x,y]=xy(q,p,mq,mp);coords.push(`${coords.length?'L':'M'}${x.toFixed(1)} ${y.toFixed(1)}`)}
     else if(coords.length)break;
   }
   return `<path d="${coords.join(' ')}" fill="none" stroke="${color}" stroke-width="4.8" stroke-linejoin="round" stroke-linecap="round" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
 }
 const point=(q,p,mq,mp,color)=>{const [x,y]=xy(q,p,mq,mp);return `<circle cx="${x}" cy="${y}" r="7" fill="${color}" stroke="#111827" stroke-width="2.8"/>`+`<path d="M${x} ${y}V${Y1}M${X0} ${y}H${x}" stroke="${color}" stroke-opacity=".65" stroke-width="2" stroke-dasharray="5 5" fill="none"/>`;};
 function external(g){
   const {a,b,c,d,external:e}=g;
   const neg=g.extType.startsWith('neg'), prod=g.extType.endsWith('Prod');
   const qm=(a-c)/(b+d), qs=qm+(neg?-1:1)*e/(b+d);
   const benefit=q=>a-b*q, privateCost=q=>c+d*q;
   const socialBenefit=q=>prod?benefit(q):benefit(q)+(neg?-e:e);
   const socialCost=q=>prod?privateCost(q)+(neg?e:-e):privateCost(q);
   const maxQ=Math.max(60,Math.ceil((Math.max(qm,qs)+12)/10)*10);
   const maxP=Math.max(80,Math.ceil(Math.max(a+e,c+d*maxQ+e,80)/50)*50);
   let z=axis(maxQ,maxP,'가격(원)');
   z+=strokeCurve(benefit,maxQ,maxP,'#6cd5ff');
   z+=strokeCurve(privateCost,maxQ,maxP,'#ffcd86');
   z+=prod?strokeCurve(socialCost,maxQ,maxP,'#aaf2b0','8 5'):strokeCurve(socialBenefit,maxQ,maxP,'#aaf2b0','8 5');
   // Never draw Qm/Q★ points or computed price/quantity labels in an unanswered quiz.
   // Keep the functions as data so learners can derive exact intersections themselves.
   const ref=`<tspan>MPB = ${fmt(a*1000,0)} − ${fmt(b*1000,0)}Q</tspan><tspan dx="25">MPC = ${fmt(c*1000,0)} + ${fmt(d*1000,0)}Q</tspan>`;
   z+=`<text x="${X0+4}" y="${Y1+53}" font-size="14" fill="#edf3ff" font-weight="800">${ref}</text>`;
   const relation=prod?`MSC = MPC ${neg?'+':'−'} ${fmt(e,0)}`:`MSB = MPB ${neg?'−':'+'} ${fmt(e,0)}`;
   return {body:z,legend:[['#6cd5ff','MPB · 사적 한계편익'],['#ffcd86','MPC · 사적 한계비용'],['#aaf2b0',prod?'MSC · 사회적 한계비용':'MSB · 사회적 한계편익']],stats:'교점을 직접 찾아 시장균형과 사회적 최적을 비교하세요.',relation};
 }
 function choiceGraph(g){
   const options=g.options||[], count=options.length;
   const left=94,right=630,top=46,bottom=268,max=Math.max(...options.flatMap(o=>[o.benefit,o.cost]),10)*1.12;
   let z=`<rect width="720" height="360" fill="#171f2e" rx="7"/>`;
   z+=`<text x="94" y="27" fill="#fff0d5" font-size="16" font-weight="800">가상 선택지의 편익·명시적 비용 (단위: 원)</text>`;
   for(let i=0;i<=5;i++){const xx=left+(right-left)*i/5;z+=`<path d="M${xx} ${top}V${bottom}" stroke="#617187" stroke-width="1" stroke-dasharray="3 5"/><text x="${xx}" y="${bottom+25}" fill="#eef0f4" font-size="13" text-anchor="middle">${fmt(max*i/5*1000,0)}</text>`;}
   options.forEach((o,i)=>{const yy=top+9+i*(bottom-top-18)/count,hh=Math.min(16,(bottom-top-20)/(count*2+1));
      const bw=(right-left)*o.benefit/max,cw=(right-left)*o.cost/max;
      z+=`<text x="${left-19}" y="${yy+hh+2}" fill="#fff4df" font-size="18" font-weight="900" text-anchor="end">${esc(o.label)}</text>`;
      z+=`<rect x="${left}" y="${yy}" width="${bw}" height="${hh}" fill="#78cbff" rx="2"/><rect x="${left}" y="${yy+hh+3}" width="${cw}" height="${hh}" fill="#ffca82" rx="2"/>`;
   });
   return {body:z,legend:[['#78cbff','예상 편익'],['#ffca82','선택 시 지출 비용']],stats:'각 대안의 편익과 비용을 읽고 직접 순편익과 기회비용을 계산하세요.'};
 }
 function trend(g,isFx){
   const start=g.start,end=g.end;
   const length=7;
   const vals=Array.from({length},(_,i)=>{const t=i/(length-1);return start+(end-start)*(t*t*(3-2*t)+(i===2?.05:i===4?-.04:0));});
   vals[0]=start;vals[vals.length-1]=end;
   const delta=isFx?Math.max(50,Math.ceil(Math.abs(end-start)*.5/10)*10):Math.max(.5,Math.abs(end-start)*.5);
   const lo=Math.max(0,Math.min(...vals)-delta),hi=Math.max(...vals)+delta;
   const cy=v=>Y1-(v-lo)/(hi-lo)*(Y1-Y0),cx=i=>X0+i*(X1-X0)/6;
   let z=`<rect width="720" height="360" fill="#171f2e" rx="7"/>`;
   for(let i=0;i<=5;i++){
     let y=Y1-(Y1-Y0)*i/5;
     z+=`<line x1="${X0}" x2="${X1}" y1="${y}" y2="${y}" stroke="#536278" stroke-dasharray="5 5"/>`;
     z+=`<text x="${X0-9}" y="${y+5}" font-size="13" font-weight="800" text-anchor="end" fill="#e4e9f3">${fmt(lo+(hi-lo)*i/5,isFx?0:2)}</text>`;
   }
   for(let i=0;i<7;i++)z+=`<text x="${cx(i)}" y="${Y1+23}" font-size="13" text-anchor="middle" fill="#e4e9f3">${i+1}기</text>`;
   z+=`<path d="M${X0} ${Y0}V${Y1}H${X1}" stroke="#fff4db" stroke-width="2" fill="none"/>`;
   z+=`<text x="${X0}" y="30" font-size="14" font-weight="800" fill="#fff1d4">${isFx?'원/달러(원)':'연이율(%)'}</text>`;
   let path=`M ${cx(0)} ${cy(vals[0])}`;
   for(let i=1;i<7;i++){
     const mid=(cx(i-1)+cx(i))/2;
     path+=` C ${mid} ${cy(vals[i-1])}, ${mid} ${cy(vals[i])}, ${cx(i)} ${cy(vals[i])}`;
   }
   z+=`<path d="${path}" stroke="${isFx?'#79d6ff':'#b8f6a6'}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
   vals.forEach((v,i)=>z+=`<circle cx="${cx(i)}" cy="${cy(v)}" r="${i===0||i===6?7:4}" fill="${i===6?'#ffd56e':'#fff8e5'}" stroke="#253044" stroke-width="2"/>`);
   z+=`<text x="${cx(0)+4}" y="${Math.max(60,cy(start)-16)}" font-size="17" font-weight="900" fill="#ffffff">${fmt(start,isFx?0:2)}${isFx?'원':'%'}</text>`;
   z+=`<text x="${cx(6)-4}" y="${Math.max(60,cy(end)-16)}" text-anchor="end" font-size="18" font-weight="900" fill="#ffd56e">${fmt(end,isFx?0:2)}${isFx?'원':'%'}</text>`;
   return {body:z,legend:[[isFx?'#79d6ff':'#b8f6a6',isFx?'달러당 원화 가격':'1년 연이율 변화'],['#ffd56e','현재 값']],stats:`${isFx?'원/달러 환율':'연이율'} ${fmt(start,isFx?0:2)} → ${fmt(end,isFx?0:2)} ${isFx?'원':'%'} (교육용 가상 추이)`};
 }
 window.SOCIAL_RENDER_GRAPH=function(g){
   if(!g||!['ext16','fx16','rate16','choice17'].includes(g.type))return typeof previous==='function'?previous(g):'';
   try{
     const x=g.type==='ext16'?external(g):g.type==='choice17'?choiceGraph(g):trend(g,g.type==='fx16');
     const legend=x.legend.map(([c,name])=>`<span class="econ16-legenditem"><i style="background:${c}"></i>${esc(name)}</span>`).join('');
     return `<figure class="sb-graph-figure econ16-figure"><div class="sb-graph-top"><span>📊 경제 심화</span><strong>${esc(g.title)}</strong></div><div class="econ16-graph-surface"><svg class="sb-graph-svg econ16-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${esc(g.title)}. 축과 세 곡선의 교점을 직접 읽어야 하는 그래프">${x.body}</svg></div><div class="econ16-legend">${legend}</div>${x.relation?'<p class="sb17-curve-equation">'+esc(x.relation)+'</p>':''}<figcaption>${g.type==='ext16'?'실선: 사적 편익·비용, 점선: 사회적 편익 또는 비용. 시장과 사회적 최적 교점은 직접 찾아보세요.':'<strong>'+esc(x.stats)+'</strong><br>그래프 수치는 교육용 가상 자료야.'}</figcaption></figure>`;
   }catch(e){console.error('v16 graph error',e);return typeof previous==='function'?previous(g):'';}
 };
})();
