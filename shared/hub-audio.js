(()=>{
"use strict";
if(window.StudyHubAudio&&window.StudyHubAudio.version==="3")return;
const frames={history:document.getElementById("frame-history"),social:document.getElementById("frame-social")};
if(!frames.history||!frames.social)return;
const catalogue=[{"id":"core_empire","title":"Empire of Concrete","category":"core","src":"/history/assets/media/0739fbace7e153c71bb8.mp3"},{"id":"core_asphalt","title":"Asphalt Resolve","category":"core","src":"/history/assets/media/86a4adbfbe798e89c80c.mp3"},{"id":"core_urban","title":"Urban Collision","category":"core","src":"/history/assets/media/42e32bb06fa67abde476.mp3"},{"id":"track_001","title":"Man in the forest of MORT","category":"backrooms","src":"/assets/audio/track_001.mp3"},{"id":"track_002","title":"Menu Drift","category":"backrooms","src":"/assets/audio/track_002.mp3"},{"id":"track_003","title":"Menu Drift (1)","category":"backrooms","src":"/assets/audio/track_003.mp3"},{"id":"track_004","title":"Nostalgic Tape","category":"backrooms","src":"/assets/audio/track_004.mp3"},{"id":"track_005","title":"Nostalgic Tape (1)","category":"backrooms","src":"/assets/audio/track_005.mp3"},{"id":"track_006","title":"The Weight Behind You","category":"backrooms","src":"/assets/audio/track_006.mp3"},{"id":"track_007","title":"Full Tilt Parade","category":"challenge","src":"/assets/audio/track_007.mp3"},{"id":"track_008","title":"Moonlight Pumpkin Sprint","category":"challenge","src":"/assets/audio/track_008.mp3"},{"id":"track_009","title":"Neon Quiz Funk · 30초","category":"challenge","src":"/assets/audio/track_009.mp3"},{"id":"track_010","title":"Neon Quiz Funk · 30초 · 변형","category":"challenge","src":"/assets/audio/track_010.mp3"},{"id":"track_011","title":"Neon Quiz Funk · 30초 · 변형 · 믹스 2","category":"challenge","src":"/assets/audio/track_011.mp3"},{"id":"track_012","title":"Neon Quiz Funk · 30초 · 변형 · 믹스 3","category":"challenge","src":"/assets/audio/track_012.mp3"},{"id":"track_013","title":"Neon Quiz Funk · 90초","category":"challenge","src":"/assets/audio/track_013.mp3"},{"id":"track_014","title":"Out of Flux - ARTIFICIALFUTURE","category":"challenge","src":"/assets/audio/track_014.mp3"},{"id":"track_015","title":"Peppermint Pursuit","category":"challenge","src":"/assets/audio/track_015.mp3"},{"id":"track_016","title":"Transit at Midnight","category":"challenge","src":"/assets/audio/track_016.mp3"},{"id":"track_017","title":"ネオン・ループ","category":"challenge","src":"/assets/audio/track_017.mp3"},{"id":"track_018","title":"ネオン・ループ (1)","category":"challenge","src":"/assets/audio/track_018.mp3"},{"id":"track_019","title":"퀴즈의 리듬","category":"challenge","src":"/assets/audio/track_019.mp3"},{"id":"track_020","title":"퀴즈의 리듬 (1)","category":"challenge","src":"/assets/audio/track_020.mp3"},{"id":"track_027","title":"Afternoon in a Seoul Teahouse","category":"home","src":"/assets/audio/track_027.mp3"},{"id":"track_028","title":"Flowers Beneath the Wall","category":"home","src":"/assets/audio/track_028.mp3"},{"id":"track_029","title":"Gathered by the Hearth","category":"home","src":"/assets/audio/track_029.mp3"},{"id":"track_030","title":"따스한 이 밤에","category":"home","src":"/assets/audio/track_030.mp3"},{"id":"track_031","title":"신비로운 모험","category":"home","src":"/assets/audio/track_031.mp3"},{"id":"track_032","title":"신비로운 모험 (1)","category":"home","src":"/assets/audio/track_032.mp3"},{"id":"track_033","title":"Ariel Dahan - On up on Winning","category":"result","src":"/assets/audio/track_033.mp3"},{"id":"track_034","title":"Triumphant Fanfare","category":"result","src":"/assets/audio/track_034.mp3"},{"id":"track_035","title":"Triumphant Fanfare (1)","category":"result","src":"/assets/audio/track_035.mp3"},{"id":"track_036","title":"Ziv Moran - Wild Grace","category":"result","src":"/assets/audio/track_036.mp3"},{"id":"track_037","title":"마지막 장을 넘겨도","category":"result","src":"/assets/audio/track_037.mp3"},{"id":"track_039","title":"Late Night Study Session","category":"study","src":"/assets/audio/track_039.mp3"},{"id":"track_040","title":"Late Night Study Session(1)","category":"study","src":"/assets/audio/track_040.mp3"},{"id":"track_041","title":"Magical Bookshelf","category":"study","src":"/assets/audio/track_041.mp3"},{"id":"track_042","title":"Magical Bookshelf(1)","category":"study","src":"/assets/audio/track_042.mp3"},{"id":"track_043","title":"Questions in the Gallery","category":"study","src":"/assets/audio/track_043.mp3"},{"id":"track_044","title":"The Clockmaker s Ledger","category":"study","src":"/assets/audio/track_044.mp3"},{"id":"track_045","title":"The Quiet Between Seasons","category":"study","src":"/assets/audio/track_045.mp3"},{"id":"track_046","title":"Tony Balluff - Under the Tent","category":"study","src":"/assets/audio/track_046.mp3"},{"id":"track_047","title":"역사의 여정","category":"study","src":"/assets/audio/track_047.mp3"},{"id":"track_048","title":"역사의 여정 (1)","category":"study","src":"/assets/audio/track_048.mp3"},{"id":"story_theme_01","title":"스토리 테마 01 — 첫 번째 기록","category":"story","src":"/history/assets/media/b710d60ad027faf81d16.mp3"},{"id":"story_theme_02","title":"스토리 테마 02 — 두 번째 기록","category":"story","src":"/history/assets/media/717d2519f65136e0f845.mp3"},{"id":"story_theme_03","title":"스토리 테마 03 — 세 번째 기록","category":"story","src":"/history/assets/media/76d13ea04dd98d5f107b.mp3"}];
const byId=id=>catalogue.find(t=>t.id===id);
const key="studyhub.shared.audio.v3";
let state={trackId:"core_empire",muted:false,volume:45,paused:false};
try{const s=JSON.parse(localStorage.getItem(key)||"null");if(s&&typeof s==="object")state={...state,...s}}catch(_){}
state.volume=Math.min(100,Math.max(0,Number(state.volume)||45));
const native=new Audio();native.preload="metadata";native.loop=false;
let current=byId(state.trackId)||catalogue[0];
let unlockNeeded=false;let storyAutoPaused=false;
const active=()=>Object.entries(frames).find(([k,f])=>f.parentElement?.classList.contains("active"))?.[0]||"home";
const url=src=>{
 try{
  if(typeof src!=="string"||src.length>9000000)return null;
  if(/^data:audio\/(?:mpeg|mp3|ogg|wav|webm)(?:;base64)?,/i.test(src))return src;
  if(src.startsWith("blob:")&&src.startsWith("blob:"+location.origin))return src;
  let u=new URL(src,location.href);
  if(u.origin!==location.origin){
   if(u.hostname!=="social-fun.vercel.app"||!u.pathname.startsWith("/assets/audio/"))return null;
   u=new URL(u.pathname+u.search,location.origin);
  }
  return /^\/(?:assets\/audio\/|history\/assets\/media\/)/.test(u.pathname)?u.href:null;
 }catch(_){return null}
};
const save=()=>{try{localStorage.setItem(key,JSON.stringify(state))}catch(_){}};
const label=id=>document.getElementById(id);
let panel=null,trackSelect=null,volumeEl=null,playButton=null,statusEl=null;
function report(t){if(statusEl)statusEl.textContent=t}
function sync(){
 if(playButton)playButton.textContent=state.paused||native.paused?"▶":"❚❚";
 if(playButton)playButton.setAttribute("aria-label",state.paused||native.paused?"공통 음악 재생":"공통 음악 일시정지");
 if(volumeEl&&document.activeElement!==volumeEl)volumeEl.value=state.volume;
 if(trackSelect&&trackSelect.value!==current?.id)trackSelect.value=current?.id||"";
 const title=label("hubTrackName");if(title)title.textContent=current?.title||"음악";
 const m=label("hubMute");if(m)m.textContent=state.muted?"🔇":"🔊";
}
function setTrack(t,playNow=true){
 if(!t)return;
 current=t;state.trackId=t.id;save();
 const resolved=url(t.src);if(!resolved){report("음원 경로 오류");sync();return}
 if(native.src!==resolved){native.src=resolved;native.load()}
 if(playNow)start(false);else sync();
}
function start(user=true){
 if(user){state.paused=false;save()}
 if(state.paused)return sync();
 const resolved=url(current?.src||"");
 if(!resolved){report("음원 파일을 찾을 수 없음");sync();return}
 if(native.src!==resolved){native.src=resolved;native.load()}
 native.volume=state.muted?0:state.volume/100;
 try{
  const p=native.play();
  p?.then?.(()=>{unlockNeeded=false;report("♪ 재생 중");sync()})
   ?.catch?.(()=>{unlockNeeded=true;report("브라우저 자동재생 제한 · ▶ 버튼을 눌러 재생하세요");sync()});
 }catch(_){unlockNeeded=true;report("▶ 버튼을 눌러 재생하세요")}
 sync();
}
function pause(user=true){if(user){state.paused=true;save()}native.pause();report("일시정지");sync()}
function next(){let pool=current?.category==="story"?catalogue.filter(t=>t.category==="story"):catalogue.filter(t=>t.category!=="backrooms"&&t.category!=="story");let i=pool.findIndex(t=>t.id===current?.id);setTrack(pool[(i+1+pool.length)%pool.length]||catalogue[0],true)}
native.addEventListener("ended",next);
native.addEventListener("error",()=>{report("음원 로딩 실패 · 다른 곡을 선택하세요");sync()});
native.addEventListener("playing",sync);
native.addEventListener("pause",sync);
const area=document.createElement("div");area.id="hubSharedMusicV3";
area.innerHTML='<button type="button" id="hubAudioPlay" title="공통 음악 재생/일시정지" aria-label="공통 음악">▶</button><button type="button" id="hubAudioSettings" aria-label="공통 음악 목록 및 설정" title="음악 설정">♫</button>';
const nav=document.querySelector("header nav");nav?.after(area);
const settings=document.createElement("section");settings.id="hubAudioPanelV3";settings.hidden=true;settings.setAttribute("aria-label","사회·역사 공통 음악");
settings.innerHTML='<div class="hub-audio-top"><strong>♫ 통합 학습관 공통 음악</strong><button type="button" id="hubAudioClose" aria-label="음악 설정 닫기">✕</button></div><p>사회·한국사에서 동일한 한 곡만 재생됩니다. 화면을 바꿔도 음악이 이어집니다.</p><label>곡 선택 <select id="hubAudioTracks"></select></label><div class="hub-audio-controls"><button type="button" id="hubAudioPrevious">⏮ 이전</button><button type="button" id="hubAudioNext">다음 ⏭</button><button type="button" id="hubMute">🔊</button></div><label>음량 <input type="range" id="hubAudioVolume" min="0" max="100" value="45" /></label><p id="hubAudioStatus" aria-live="polite">재생 준비</p>';
document.body.append(settings);panel=settings;
const select=label("hubAudioTracks");trackSelect=select;volumeEl=label("hubAudioVolume");playButton=label("hubAudioPlay");statusEl=label("hubAudioStatus");
for(const t of catalogue){
 const opt=document.createElement("option");opt.value=t.id;opt.textContent=t.title+" · "+({core:"메인",study:"학습",challenge:"도전",home:"휴식",result:"결과",backrooms:"긴장",story:"스토리"}[t.category]||"기타");select.append(opt);
}
const style=document.createElement("style");style.textContent='#hubSharedMusicV3{display:flex;gap:4px;align-items:center;padding:2px 5px;border:1px solid #95705d;border-radius:8px;background:#3c2835}#hubSharedMusicV3 button{border:0;background:transparent;color:#fff0d7;min-width:32px;height:34px;font-weight:900;cursor:pointer}#hubAudioPanelV3{position:fixed;z-index:450;top:73px;right:12px;width:min(345px,calc(100vw - 24px));box-sizing:border-box;background:#2c202c;color:#ffe9cf;border:2px solid #d7ab80;border-radius:13px;padding:15px;box-shadow:0 20px 50px #000a;font-size:13px;line-height:1.6}#hubAudioPanelV3[hidden]{display:none!important}#hubAudioPanelV3 .hub-audio-top{display:flex;align-items:center;justify-content:space-between}#hubAudioPanelV3 button{cursor:pointer;border:1px solid #947266;border-radius:6px;background:#4e3441;color:#ffebd5;padding:6px 9px}#hubAudioPanelV3 select{display:block;width:100%;max-width:100%;padding:9px;background:#493340;border:1px solid #a9826b;color:#fff}#hubAudioPanelV3 input{width:100%;accent-color:#f4c586}#hubAudioPanelV3 label{display:block;margin:11px 0}#hubAudioPanelV3 .hub-audio-controls{display:flex;gap:7px;justify-content:space-between}#hubAudioPanelV3 p{margin:8px 0;color:#dfc5bc}@media(max-width:760px){#hubSharedMusicV3{padding:1px 2px}#hubSharedMusicV3 button{min-width:26px;height:30px;font-size:14px}#hubAudioPanelV3{top:66px}}';document.head.append(style);
const togglePanel=()=>{panel.hidden=!panel.hidden;sync()};
label("hubAudioSettings").addEventListener("click",togglePanel);
label("hubAudioClose").addEventListener("click",()=>panel.hidden=true);
playButton.addEventListener("click",()=>state.paused||native.paused?start(true):pause(true));
select.addEventListener("change",e=>{state.paused=false;setTrack(byId(e.target.value),true)});
volumeEl.addEventListener("input",e=>{state.volume=Number(e.target.value);native.volume=state.muted?0:state.volume/100;save();sync()});
label("hubMute").addEventListener("click",()=>{state.muted=!state.muted;native.volume=state.muted?0:state.volume/100;save();sync()});
label("hubAudioNext").addEventListener("click",next);
label("hubAudioPrevious").addEventListener("click",()=>{const pool=catalogue.filter(t=>t.category!=="backrooms"&&t.category!=="story");const i=pool.findIndex(t=>t.id===current?.id);setTrack(pool[(i-1+pool.length)%pool.length]||catalogue[0],true)});

function patchLegacyFrame(frame,subject){
 try{
  const win=frame.contentWindow;
  if(!win?.HTMLMediaElement)return;
  const proto=win.HTMLMediaElement.prototype;
  if(proto.__sharedAudioV3)return;
  const nativePlay=proto.play,nativePause=proto.pause;
  const music=el=>{
   if(el?.tagName!=="AUDIO")return false;
   const src=el.currentSrc||el.src||"";
   return !/(effect_|sfx|click|correct|wrong|footstep|heartbeat)/i.test(src);
  };
  const notify=(action,el,gesture)=>{
   const src=el.currentSrc||el.src||el.getAttribute("src")||"";
   if(!src||active()!==subject)return;
   window.postMessage({type:"studyhub.audio.v3",action:action,subject:subject,src:src,gesture:!!gesture},location.origin);
  };
  proto.play=function(...args){
   if(!music(this))return nativePlay.apply(this,args);
   notify("play",this,!!win.navigator?.userActivation?.isActive);
   try{nativePause.call(this)}catch(_){}
   return Promise.resolve();
  };
  proto.pause=function(...args){
   if(music(this)&&win.navigator?.userActivation?.isActive)notify("pause",this,true);
   return nativePause.apply(this,args);
  };
  Object.defineProperty(proto,"__sharedAudioV3",{value:true});
  win.document.querySelectorAll("audio").forEach(a=>{
   if(music(a)&&!a.paused){const src=a.currentSrc||a.src;try{nativePause.call(a)}catch(_){};if(src)notify("play",a,false)}
  });
 }catch(_){}
}
for(const [subject,frame]of Object.entries(frames)){
 frame.addEventListener("load",()=>patchLegacyFrame(frame,subject));
 try{if(frame.contentDocument?.readyState==="complete")patchLegacyFrame(frame,subject)}catch(_){}
}

window.addEventListener("message",e=>{
 const msg=e.data;if(e.origin!==location.origin||!msg||msg.type!=="studyhub.audio.v3")return;
 if(!["history","social"].includes(msg.subject)||active()!==msg.subject)return;
 const src=url(msg.src||"");
 if(msg.action==="story-quiet"){if(!state.paused){storyAutoPaused=true;native.pause();report("스토리 긴장 장면 · 음악 잠시 중단");sync()}return}
 if(msg.action==="story-resume"){if(storyAutoPaused){storyAutoPaused=false;if(!state.paused)start(false)}return}
 if(msg.action==="play"){
  if(!src)return;
  let known=catalogue.find(t=>url(t.src)===src);
  if(!known){known={id:"external_"+msg.subject,title:"선택한 음악",src:src,category:"other"}}
  if(storyAutoPaused){storyAutoPaused=false;if(!state.paused)start(false);return}
  if(state.paused && !msg.gesture)return;
  if(!current||!native.src){setTrack(known,true);return}
  if(msg.gesture && src!==native.src){state.paused=false;setTrack(known,true);return}
  if(!state.paused&&native.paused&&!unlockNeeded)start(false);
 }
 if(msg.action==="pause"&&msg.storyQuiet){storyAutoPaused=true;native.pause();report("스토리 긴장 장면 · BGM 일시정지");sync()}
 if(msg.action==="pause"&&msg.gesture&&!msg.storyQuiet){storyAutoPaused=false;pause(true)}
});
document.addEventListener("click",ev=>{
 if(!ev.target.closest("[data-view]"))return;
 if(!native.src && !state.paused)start(false);
},true);
window.StudyHubAudio={version:"3",state:()=>({active:active(),track:current?.title,playing:!native.paused,muted:state.muted,volume:state.volume,paused:state.paused}),play:()=>start(true),pause:()=>pause(true),next:next,player:native,tracks:catalogue};
sync();
})();