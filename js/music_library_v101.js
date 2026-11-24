/* 대민다위 9.7: 화면 간 끊기지 않는 음악 라이브러리. 소스: 사용자 사회범 GitHub 프로젝트. */
(() => {
'use strict';
const legacyKey='daemindawi_home_music_v96';
const key='daemindawi_music_library_v97';
const coreTracks=[
 {id:'core_empire',title:'Empire of Concrete',file:'assets/audio/home/Empire_of_Concrete.mp3',category:'core',duration_sec:182},
 {id:'core_asphalt',title:'Asphalt Resolve',file:'assets/audio/home/Asphalt_Resolve.mp3',category:'core',duration_sec:182},
 {id:'core_urban',title:'Urban Collision',file:'assets/audio/home/Urban_Collision.mp3',category:'core',duration_sec:182}
];
const socialTracks=[{"id":"track_001","title":"Man in the forest of MORT","file":"track_001.mp3","category":"backrooms","duration_sec":143.2},{"id":"track_002","title":"Menu Drift","file":"track_002.mp3","category":"backrooms","duration_sec":149.6},{"id":"track_003","title":"Menu Drift (1)","file":"track_003.mp3","category":"backrooms","duration_sec":143.8},{"id":"track_004","title":"Nostalgic Tape","file":"track_004.mp3","category":"backrooms","duration_sec":119.2},{"id":"track_005","title":"Nostalgic Tape (1)","file":"track_005.mp3","category":"backrooms","duration_sec":121.3},{"id":"track_006","title":"The Weight Behind You","file":"track_006.mp3","category":"backrooms","duration_sec":90.4},{"id":"track_007","title":"Full Tilt Parade","file":"track_007.mp3","category":"challenge","duration_sec":180.8},{"id":"track_008","title":"Moonlight Pumpkin Sprint","file":"track_008.mp3","category":"challenge","duration_sec":179.8},{"id":"track_009","title":"Neon Quiz Funk · 30초","file":"track_009.mp3","category":"challenge","duration_sec":30.0},{"id":"track_010","title":"Neon Quiz Funk · 30초 · 변형","file":"track_010.mp3","category":"challenge","duration_sec":30.0},{"id":"track_011","title":"Neon Quiz Funk · 30초 · 변형 · 믹스 2","file":"track_011.mp3","category":"challenge","duration_sec":30.0},{"id":"track_012","title":"Neon Quiz Funk · 30초 · 변형 · 믹스 3","file":"track_012.mp3","category":"challenge","duration_sec":30.0},{"id":"track_013","title":"Neon Quiz Funk · 90초","file":"track_013.mp3","category":"challenge","duration_sec":90.0},{"id":"track_014","title":"Out of Flux - ARTIFICIALFUTURE","file":"track_014.mp3","category":"challenge","duration_sec":141.4},{"id":"track_015","title":"Peppermint Pursuit","file":"track_015.mp3","category":"challenge","duration_sec":177.8},{"id":"track_016","title":"Transit at Midnight","file":"track_016.mp3","category":"challenge","duration_sec":179.9},{"id":"track_017","title":"ネオン・ループ","file":"track_017.mp3","category":"challenge","duration_sec":90.0},{"id":"track_018","title":"ネオン・ループ (1)","file":"track_018.mp3","category":"challenge","duration_sec":89.4},{"id":"track_019","title":"퀴즈의 리듬","file":"track_019.mp3","category":"challenge","duration_sec":90.5},{"id":"track_020","title":"퀴즈의 리듬 (1)","file":"track_020.mp3","category":"challenge","duration_sec":89.7},{"id":"track_027","title":"Afternoon in a Seoul Teahouse","file":"track_027.mp3","category":"home","duration_sec":177.7},{"id":"track_028","title":"Flowers Beneath the Wall","file":"track_028.mp3","category":"home","duration_sec":155.2},{"id":"track_029","title":"Gathered by the Hearth","file":"track_029.mp3","category":"home","duration_sec":176.5},{"id":"track_030","title":"따스한 이 밤에","file":"track_030.mp3","category":"home","duration_sec":150.0},{"id":"track_031","title":"신비로운 모험","file":"track_031.mp3","category":"home","duration_sec":89.1},{"id":"track_032","title":"신비로운 모험 (1)","file":"track_032.mp3","category":"home","duration_sec":89.5},{"id":"track_033","title":"Ariel Dahan - On up on Winning","file":"track_033.mp3","category":"result","duration_sec":112.6},{"id":"track_034","title":"Triumphant Fanfare","file":"track_034.mp3","category":"result","duration_sec":79.6},{"id":"track_035","title":"Triumphant Fanfare (1)","file":"track_035.mp3","category":"result","duration_sec":79.6},{"id":"track_036","title":"Ziv Moran - Wild Grace","file":"track_036.mp3","category":"result","duration_sec":154.7},{"id":"track_037","title":"마지막 장을 넘겨도","file":"track_037.mp3","category":"result","duration_sec":178.6},{"id":"track_039","title":"Late Night Study Session","file":"track_039.mp3","category":"study","duration_sec":90.0},{"id":"track_040","title":"Late Night Study Session(1)","file":"track_040.mp3","category":"study","duration_sec":138.3},{"id":"track_041","title":"Magical Bookshelf","file":"track_041.mp3","category":"study","duration_sec":88.6},{"id":"track_042","title":"Magical Bookshelf(1)","file":"track_042.mp3","category":"study","duration_sec":88.7},{"id":"track_043","title":"Questions in the Gallery","file":"track_043.mp3","category":"study","duration_sec":121.9},{"id":"track_044","title":"The Clockmaker s Ledger","file":"track_044.mp3","category":"study","duration_sec":100.3},{"id":"track_045","title":"The Quiet Between Seasons","file":"track_045.mp3","category":"study","duration_sec":179.4},{"id":"track_046","title":"Tony Balluff - Under the Tent","file":"track_046.mp3","category":"study","duration_sec":174.7},{"id":"track_047","title":"역사의 여정","file":"track_047.mp3","category":"study","duration_sec":187.8},{"id":"track_048","title":"역사의 여정 (1)","file":"track_048.mp3","category":"study","duration_sec":147.1}];
const storyTracks=[{"id":"story_theme_01","title":"스토리 테마 01 — 첫 번째 기록","file":"assets/audio/story/story_theme_01.mp3","category":"story","duration_sec":147.5},{"id":"story_theme_02","title":"스토리 테마 02 — 두 번째 기록","file":"assets/audio/story/story_theme_02.mp3","category":"story","duration_sec":149.0},{"id":"story_theme_03","title":"스토리 테마 03 — 세 번째 기록","file":"assets/audio/story/story_theme_03.mp3","category":"story","duration_sec":148.9}];
const tracks=[...coreTracks,...socialTracks,...storyTracks];
const byId=id=>tracks.find(t=>t.id===id)||null;
const groups={core:'기본 메인',social:'전체 음악',home:'홈 · 휴식',study:'학습 · 집중',challenge:'도전 · 속도',result:'성과 · 엔딩',backrooms:'긴장 · 공포',story:'스토리 전용'};
let migratedCore=0;
let prefs={selectedId:null,volume:35,repeat:true,shuffle:false,enabled:true};
try{const prev=JSON.parse(localStorage.getItem(legacyKey)||'null');if(prev){if(Number.isFinite(prev.volume))prefs.volume=Math.max(0,Math.min(100,prev.volume));if(Number.isInteger(prev.track)&&prev.track>=0&&prev.track<coreTracks.length)migratedCore=prev.track;}}catch{}
try{const prev=JSON.parse(localStorage.getItem(key)||'null');if(prev&&typeof prev==='object')prefs={...prefs,...prev}}catch{}
prefs.volume=Number.isFinite(Number(prefs.volume))?Math.max(0,Math.min(100,Number(prefs.volume))):35;
let current=byId(prefs.selectedId)||coreTracks[migratedCore];
/* v10.1: Stable per-screen BGM. Only study/challenge music may auto-play during quizzes. */
const studyPool=socialTracks.filter(t=>t.category==='study');
const challengePool=socialTracks.filter(t=>t.category==='challenge');
// Dedicated offline story soundtrack, isolated from home and quiz rotation.
const storyPool=storyTracks;
const challengeModes=new Set(['hardcore','timed','ranked','infinite','versus']);
let lastMusicZone=null;
function routePart(){return (location.hash.slice(1).split('?')[0]||'home')}
function musicZone(){
 const r=routePart();
 if(r==='home'||!r)return 'home';
 if(r==='story')return 'story';
 if(r==='quiz')return 'study';
 if(r==='arcade'||r==='arcade-manage'||r==='arcade-online')return 'study';
 if(r==='arcade-types'||r==='arcade-quiz'||r==='arcade-result'||r==='arcade-ranking'||r==='arcade-achievements'){
   let state={};try{state=JSON.parse(localStorage.getItem('history_arcade_local_v2')||'{}')||{}}catch(_){}
   const mode=r==='arcade-types'?(state.pendingMode||'practice'):(state.session?.mode||'practice');
   return challengeModes.has(mode)?'challenge':'study';
 }
 return 'other';
}
function zonePool(){const z=musicZone();return z==='story'?storyPool:z==='study'?studyPool:z==='challenge'?challengePool:null}
function preferredTrack(zone){
 if(zone==='home')return byId(prefs.selectedId)?.category!=='story'&&byId(prefs.selectedId)?byId(prefs.selectedId):coreTracks[migratedCore];
 if(zone==='story')return (byId(prefs.storyTrackId)?.category==='story'?byId(prefs.storyTrackId):storyPool[0]);
 if(zone==='study')return (byId(prefs.quizStudyId)?.category==='study'?byId(prefs.quizStudyId):studyPool[0]);
 if(zone==='challenge')return (byId(prefs.quizChallengeId)?.category==='challenge'?byId(prefs.quizChallengeId):challengePool[0]);
 return null;
}
function updateMusicForRoute(initial=false){
 const zone=musicZone();
 if(zone===lastMusicZone)return;
 if(lastMusicZone==='story' && zone!=='story')storyQuiet=false;
 lastMusicZone=zone;
 const target=preferredTrack(zone);
 if(zone==='story')filter='story';else if(filter==='story')filter='core';
 renderList();
 if(!target||target.id===current.id)return; // Preserve one Audio instance; do not restart every question.
 chooseTrack(target,!initial&&!userPaused&&prefs.enabled,false);
}

let storyQuiet=false;
let filter='core', fallbackUsed=false, isStarting=false, needsGesture=false, userPaused=!prefs.enabled;
const audio=new Audio();audio.preload='metadata';audio.volume=prefs.volume/100;audio.loop=false;
const $=id=>document.getElementById(id);
const persist=()=>{try{localStorage.setItem(key,JSON.stringify(prefs))}catch{}};
const safeTime=t=>Number.isFinite(t)?`${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,'0')}`:'0:00';
const socialSource=t=>window.DMD_SOCIAL_AUDIO_LOCAL?`assets/audio/social/${t.file}`:`https://social-fun.vercel.app/assets/audio/${t.file}`;
function source(t,alternate=false){if(t.category==='core'||t.category==='story')return t.file;if(alternate)return `https://raw.githubusercontent.com/SeoJunwhynat/Social/main/assets/audio/${t.file}`;return socialSource(t)}
function playerList(){return zonePool()||(current?.category==='core'?coreTracks:socialTracks)}
function setStatus(s){const x=$('v97MusicStatus');if(x)x.textContent=s}
function sync(){
 const play=$('v97PlayPause');if(play)play.textContent=audio.paused?'▶ 재생':'⏸ 일시정지';
 const t=$('v97NowTitle');if(t)t.textContent=current?.title||'음악 없음';
 const b=$('musicLibraryToggle');if(b){b.classList.toggle('is-playing',!audio.paused);b.setAttribute('aria-label',audio.paused?'음악 설정 열기':'음악 재생 중 · 설정 열기')}
 const currentT=$('v97TimeCurrent');if(currentT)currentT.textContent=safeTime(audio.currentTime);
 const duration=$('v97TimeDuration');if(duration)duration.textContent=safeTime(audio.duration||current.duration_sec||0);
 const seek=$('v97MusicSeek');if(seek&&!seek.matches(':active'))seek.value=Number.isFinite(audio.duration)&&audio.duration>0?Math.round(audio.currentTime/audio.duration*1000):0;
 const vol=$('v97MusicVolume');if(vol&&Number(vol.value)!==prefs.volume)vol.value=String(prefs.volume);
 const rep=$('v97MusicRepeat');if(rep)rep.checked=!!prefs.repeat;
 const shuf=$('v97MusicShuffle');if(shuf)shuf.checked=!!prefs.shuffle;
 document.querySelectorAll('.v97-music-item').forEach(x=>x.classList.toggle('active',x.dataset.trackId===current.id));
}
function chooseTrack(track,shouldPlay=true,remember=true){
 if(!track)return;
 const zone=musicZone();
 // The requested quiz soundtrack excludes both main-theme and horror/backrooms music.
 if(remember&&zone==='story'&&track.category!=='story'){setStatus('스토리에서는 스토리 전용 음악만 재생합니다.');return;}
 if(remember&&zone!=='story'&&track.category==='story'){setStatus('스토리 전용 음악은 역사 스토리에서 재생됩니다.');return;}
 if(remember&&(zone==='study'||zone==='challenge')&&(track.category==='core'||track.category==='backrooms')){
   setStatus('문제풀이에서는 메인·공포·백룸 BGM을 재생하지 않습니다.');return;
 }
 if(track.id===current.id){if(shouldPlay&&audio.paused)play();return}
 current=track;
 if(remember){
   if(zone==='story')prefs.storyTrackId=track.id;
   else if(zone==='study'||zone==='challenge'){
     if(track.category==='study')prefs.quizStudyId=track.id;
     if(track.category==='challenge')prefs.quizChallengeId=track.id;
   }else prefs.selectedId=track.id;
   persist();
 }
 fallbackUsed=false;isStarting=false;
 audio.pause();audio.src=source(track);audio.load();sync();
 if(shouldPlay)play();else setStatus('선택한 곡을 재생할 수 있습니다.');
 renderList();
}
function play(){
 if(musicZone()==='story'&&storyQuiet){setStatus('긴장 장면 · 배경음악 일시정지');return;}
 if(userPaused){userPaused=false;prefs.enabled=true;persist()}
 if(!audio.getAttribute('src')){audio.src=source(current);audio.load();}
 if(isStarting)return;
 isStarting=true;
 let p;try{p=audio.play()}catch(e){isStarting=false;needsGesture=true;setStatus('재생 버튼 또는 화면 터치로 음악을 시작하세요.');return}
 if(p&&typeof p.then==='function')p.then(()=>{isStarting=false;needsGesture=false;setStatus('♪ 재생 중');sync()}).catch(()=>{isStarting=false;needsGesture=true;setStatus('브라우저 자동재생 제한 · 화면을 한번 클릭하면 재생됩니다.');sync()});
 else {isStarting=false;setStatus('♪ 재생 중');sync()}
}
function pause(){userPaused=true;prefs.enabled=false;persist();audio.pause();needsGesture=false;setStatus('일시정지');sync()}
function advance(n){
 const pool=playerList();let i=Math.max(0,pool.findIndex(t=>t.id===current.id));
 if(prefs.shuffle&&pool.length>1){let j=Math.floor(Math.random()*(pool.length-1));if(j>=i)j++;i=j}else i=(i+n+pool.length)%pool.length;
 const t=pool[i];if(t)chooseTrack(t,true,musicZone()==='story')
}
function open(){
 const dlg=$('musicLibraryPanel');if(!dlg)return;
 if(dlg.open){close();return;}
 renderList();sync();
 // Non-modal: other buttons on the page must remain interactive.
 if(typeof dlg.show==='function')dlg.show();else dlg.setAttribute('open','');
 $('musicLibraryToggle')?.setAttribute('aria-expanded','true');
}
function close(){const dlg=$('musicLibraryPanel');if(!dlg)return;if(dlg.open&&dlg.close)dlg.close();else dlg.removeAttribute('open');$('musicLibraryToggle')?.setAttribute('aria-expanded','false')}
function filtered(){if(musicZone()==='story')return storyTracks;
 if(filter==='core')return coreTracks;
 if(filter==='social')return [...coreTracks,...socialTracks];
 return socialTracks.filter(t=>t.category===filter)}
function renderList(){
 const cats=$('v97MusicGroups');if(cats){cats.replaceChildren();for(const [id,name] of Object.entries(groups)){
   if(musicZone()==='story'&&id!=='story'||musicZone()!=='story'&&id==='story')continue;
   const b=document.createElement('button');b.type='button';b.textContent=name;b.dataset.group=id;b.className=id===filter?'active':'';cats.append(b);
 }}
 const root=$('v97MusicList');if(!root)return;root.replaceChildren();for(const t of filtered()){
  const b=document.createElement('button');b.type='button';b.className='v97-music-item'+(t.id===current.id?' active':'');b.dataset.trackId=t.id;
  const name=document.createElement('span');name.textContent=t.title;const dur=document.createElement('small');dur.textContent=safeTime(t.duration_sec);b.append(name,dur);root.append(b);
 }
 sync();
}
audio.addEventListener('playing',()=>{setStatus('♪ 재생 중');sync()});
audio.addEventListener('pause',sync);
audio.addEventListener('timeupdate',sync);
audio.addEventListener('loadedmetadata',sync);
audio.addEventListener('ended',()=>{if(prefs.repeat)advance(1);else pause()});
audio.addEventListener('error',()=>{
 if(current.category!=='core'&&current.category!=='story'&&!fallbackUsed&&!window.DMD_SOCIAL_AUDIO_LOCAL){fallbackUsed=true;isStarting=false;audio.src=source(current,true);audio.load();play();return}
 isStarting=false;needsGesture=false;setStatus('음악 파일을 열지 못했습니다. 인터넷 연결을 확인하거나 기본 메인 음악을 선택해 주세요.');sync();
});
$('musicLibraryToggle')?.addEventListener('click',open);
// A click anywhere else closes the non-modal panel without swallowing the click.
document.addEventListener('pointerdown',e=>{
 const dlg=$('musicLibraryPanel');if(!dlg?.open)return;
 if(dlg.contains(e.target)||$('musicLibraryToggle')?.contains(e.target))return;
 close();
},{capture:true});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('musicLibraryPanel')?.open){close();e.stopPropagation();}},{capture:true});
$('v97MusicClose')?.addEventListener('click',close);
$('v97Prev')?.addEventListener('click',()=>advance(-1));
$('v97Next')?.addEventListener('click',()=>advance(1));
$('v97PlayPause')?.addEventListener('click',()=>audio.paused?play():pause());
$('v97ResetDefault')?.addEventListener('click',()=>{filter='core';prefs.selectedId=null;persist();if(musicZone()==='home')chooseTrack(coreTracks[0],!userPaused,false);else setStatus('홈으로 이동하면 기본 메인 음악이 재생됩니다.');});
$('v97MusicGroups')?.addEventListener('click',e=>{const t=e.target.closest('[data-group]');if(!t)return;filter=t.dataset.group;renderList()});
$('v97MusicList')?.addEventListener('click',e=>{const t=e.target.closest('[data-track-id]');if(!t)return;chooseTrack(byId(t.dataset.trackId),true)});
$('v97MusicVolume')?.addEventListener('input',e=>{prefs.volume=Number(e.target.value);audio.volume=prefs.volume/100;persist();sync()});
$('v97MusicRepeat')?.addEventListener('change',e=>{prefs.repeat=e.target.checked;persist()});
$('v97MusicShuffle')?.addEventListener('change',e=>{prefs.shuffle=e.target.checked;persist()});
$('v97MusicSeek')?.addEventListener('change',e=>{if(Number.isFinite(audio.duration)&&audio.duration>0)audio.currentTime=Number(e.target.value)/1000*audio.duration});
// Browser permits audible autoplay only when policy allows. Retry once on a real gesture, not on route changes.
function unlock(e){if(!needsGesture||userPaused)return;if(e.target?.closest?.('input,textarea,select'))return;play()}
document.addEventListener('pointerdown',unlock,{passive:true,capture:true});
document.addEventListener('keydown',unlock,{capture:true});
window.addEventListener('pagehide',()=>{audio.pause()});
window.DaemindawiMusic={getState:()=>({track:current.id,category:current.category,zone:musicZone(),playing:!audio.paused,storyQuiet,volume:prefs.volume,total:tracks.length}),play,pause,open};
function applyStoryMood(quiet){
 if(musicZone()!=='story'||storyQuiet===quiet)return;
 storyQuiet=quiet;
 if(quiet){
   // Pause only: retain the same song and playback position, do not alter the user's music preference.
   audio.pause();setStatus('긴장 장면 · 배경음악 일시정지');sync();
 }else if(!userPaused&&prefs.enabled){
   audio.volume=prefs.volume/100;play();
 }else{
   setStatus('스토리 BGM은 사용자 설정에 따라 꺼져 있습니다.');sync();
 }
}
window.addEventListener('message',event=>{
 const f=document.getElementById('v99StoryFrame');
 if(!f||event.source!==f.contentWindow)return;
 const message=event.data;
 if(!message||message.type!=='dmd-story-scene-music-v104'||typeof message.quiet!=='boolean')return;
 applyStoryMood(message.quiet);
});
window.addEventListener('hashchange',()=>updateMusicForRoute());
updateMusicForRoute(true);
if(prefs.enabled){if(!audio.getAttribute('src')){audio.src=source(current);audio.load()}play()}else setStatus('배경음 꺼짐');
renderList();
})();
