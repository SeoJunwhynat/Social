(()=>{
"use strict";
if(window.top===window)return;
const subject=location.pathname.startsWith("/history/")?"history":"social";
const origin=location.origin;
let suspended=false;
function send(action,src,gesture,storyQuiet){try{window.top.postMessage({type:"studyhub.audio.v3",action:action,subject:subject,src:src,gesture:!!gesture,storyQuiet:!!storyQuiet},origin)}catch(_){}}
function patch(realm){
 try{
  if(!realm?.HTMLMediaElement)return;
  const p=realm.HTMLMediaElement.prototype;
  if(p.__sharedAudioV3)return;
  const nativePlay=p.play,nativePause=p.pause;
  function isBGM(el){
   if(el?.tagName!=="AUDIO")return false;
   const src=el.currentSrc||el.src||el.getAttribute("src")||"";
   if(/(?:effect_|sfx|click|wrong|correct|footstep|heartbeat|jump)/i.test(src))return false;
   return true;
  }
  p.play=function(...args){
   if(!isBGM(this))return nativePlay.apply(this,args);
   const src=this.currentSrc||this.src||this.getAttribute("src")||"";
   if(!suspended&&src)send("play",src,!!realm.navigator?.userActivation?.isActive,false);
   try{nativePause.call(this)}catch(_){}
   return Promise.resolve();
  };
  p.pause=function(...args){
   if(isBGM(this)){
    const src=this.currentSrc||this.src||this.getAttribute("src")||"";
    const gesture=!!realm.navigator?.userActivation?.isActive;
    const quiet=subject==="history"&&/story/.test(location.hash)&&!gesture;
    if(gesture||quiet)send("pause",src,gesture,quiet);
   }
   return nativePause.apply(this,args);
  };
  Object.defineProperty(p,"__sharedAudioV3",{value:true});
  function patchFrame(f){
   const fn=()=>{try{patch(f.contentWindow)}catch(_){}};
   f.addEventListener("load",fn);fn();
  }
  const doc=realm.document;
  if(doc?.documentElement){
   doc.querySelectorAll("iframe").forEach(patchFrame);
   new realm.MutationObserver(items=>{
    for(const r of items)for(const n of r.addedNodes)if(n.tagName==="IFRAME")patchFrame(n);
   }).observe(doc.documentElement,{subtree:true,childList:true});
   doc.querySelectorAll("audio").forEach(a=>{
    if(isBGM(a)&&!a.paused){const src=a.currentSrc||a.src;try{nativePause.call(a)}catch(_){};if(src&&!suspended)send("play",src,false,false)}
   });
  }
 }catch(_){}
}
patch(window);
window.addEventListener("message",e=>{
 if(e.origin!==origin||!e.data||e.data.source!=="studyhub.v1")return;
 suspended=e.data.action==="suspend";
 if(e.data.action==="activate")suspended=false;
});
})();