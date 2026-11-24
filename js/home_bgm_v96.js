/* 대민다위 9.6 — 홈 화면 전용 3곡 음악 재생 (사용자 조작 후 재생) */
(() => {
 'use strict';
 const tracks = [
   { title: 'Empire of Concrete', src: 'assets/audio/home/Empire_of_Concrete.mp3' },
   { title: 'Asphalt Resolve', src: 'assets/audio/home/Asphalt_Resolve.mp3' },
   { title: 'Urban Collision', src: 'assets/audio/home/Urban_Collision.mp3' },
 ];
 const key = 'daemindawi_home_music_v96';
 let prefs = {track: 0, volume: 35};
 try {
   const old=JSON.parse(localStorage.getItem(key)||'null');
   if(old && typeof old === 'object'){
     if(Number.isInteger(old.track)&&old.track>=0&&old.track<tracks.length) prefs.track=old.track;
     if(Number.isFinite(old.volume))prefs.volume=Math.max(0,Math.min(100,old.volume));
   }
 } catch(_){}
 const audio = new Audio();
 audio.preload='none';
 audio.loop=false;
 audio.volume=prefs.volume/100;
 let activeIndex=prefs.track;
 let currentLoaded=-1;
 let status='재생 버튼을 누르면 음악이 시작됩니다.';
 const home=()=>!location.hash || location.hash.split('?')[0]==='#home';
 const persist=()=>{try{localStorage.setItem(key,JSON.stringify({track:activeIndex,volume:prefs.volume}))}catch(_){}};
 const setStatus=s=>{status=s;sync()};
 const sync=()=>{
   const root=document.querySelector('.v96-bgm');if(!root)return;
   const toggle=root.querySelector('[data-bgm-action="toggle"]');
   const sel=root.querySelector('#v96BgmTrack');
   const volume=root.querySelector('#v96BgmVolume');
   const statusEl=root.querySelector('#v96BgmStatus');
   const playing=!audio.paused&&!audio.ended;
   if(toggle){toggle.textContent=playing?'⏸ 일시정지':'▶ 재생';toggle.setAttribute('aria-label',playing?'배경음악 일시정지':'배경음악 재생')}
   if(sel && sel.value!==String(activeIndex))sel.value=String(activeIndex);
   if(volume && Number(volume.value)!==Math.round(prefs.volume))volume.value=String(Math.round(prefs.volume));
   if(statusEl)statusEl.textContent=status;
 };
 const setTrack=(index,continuePlaying)=>{
   const n=(index+tracks.length)%tracks.length;
   audio.pause();activeIndex=n;currentLoaded=-1;persist();
   if(continuePlaying)start();else{audio.removeAttribute('src');audio.load();setStatus('선택한 곡을 재생할 수 있습니다.')}
 };
 const start=()=>{
   if(!home()){setStatus('홈 화면에서만 배경음악을 재생합니다.');return}
   if(currentLoaded!==activeIndex){audio.src=tracks[activeIndex].src;currentLoaded=activeIndex;audio.load()}
   const play=audio.play();
   if(play&&typeof play.catch==='function')play.catch(()=>setStatus('재생이 차단됐습니다. 재생 버튼을 다시 눌러 주세요.'));
   setStatus('재생 준비 중…');
 };
 const pause=(message)=>{audio.pause();setStatus(message||'일시정지됨 · 재생 버튼으로 이어 듣기')};
 audio.addEventListener('playing',()=>setStatus('♪ '+tracks[activeIndex].title+' 재생 중'));
 audio.addEventListener('pause',()=>sync());
 audio.addEventListener('ended',()=>{if(home())setTrack(activeIndex+1,true);else pause()});
 audio.addEventListener('error',()=>setStatus('음악 파일을 불러오지 못했습니다.'));
 document.addEventListener('click',e=>{
   const b=e.target.closest?.('[data-bgm-action]');if(!b)return;
   e.preventDefault();
   switch(b.dataset.bgmAction){
    case 'toggle': if(audio.paused)start();else pause();break;
    case 'prev': setTrack(activeIndex-1,!audio.paused);break;
    case 'next': setTrack(activeIndex+1,!audio.paused);break;
   }
 });
 document.addEventListener('change',e=>{if(e.target?.id==='v96BgmTrack')setTrack(Number(e.target.value),!audio.paused)});
 document.addEventListener('input',e=>{if(e.target?.id==='v96BgmVolume'){
    prefs.volume=Number(e.target.value);audio.volume=prefs.volume/100;persist();sync();
 }});
 const ensureHome=()=>{if(!home()&&!audio.paused)pause('홈을 벗어나 음악을 일시정지했습니다.');requestAnimationFrame(sync)};
 window.addEventListener('hashchange',ensureHome);
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&!audio.paused)pause('탭이 비활성화되어 음악을 일시정지했습니다.')});
 window.addEventListener('pagehide',()=>audio.pause());
 const view=document.getElementById('view');
 if(view)new MutationObserver(()=>requestAnimationFrame(sync)).observe(view,{childList:true});
 sync();
 window.DaemindawiHomeBGM={getState:()=>({track:activeIndex,playing:!audio.paused,volume:prefs.volume}),pause:()=>pause()};
})();
