/* v10.0 — iframe srcdoc bridge, no relative iframe src requests. */
(() => {
 'use strict';
 let pending = null;
 const payloadURL='story/story_payload_v100.js';
 const $ = sel => document.querySelector(sel);
 function status(text,failed=false){
   const box=$('#v100StoryStatus');if(!box)return;
   box.hidden=false;box.classList.toggle('failed',failed);
   const main=box.querySelector('strong');if(main)main.textContent=text;
   const sub=box.querySelector('p');if(sub){sub.textContent=failed?'전체 ZIP을 압축 해제하고 index.html을 실행해 주세요.':'컷신 및 캐릭터 이미지 데이터를 준비하고 있습니다.';}
   if(failed&&!box.querySelector('.v100-direct-link')){
     const a=document.createElement('a');a.className='v100-direct-link';a.href='story/nameless_history_ch1-4.html';a.textContent='스토리 파일 직접 열기';a.target='_blank';a.rel='noopener';box.append(a);
   }
 }
 function getEmbedded(){
   // Standalone v9.9 includes a large application/json payload. Parse it only when story is opened.
   if(typeof window.DMD_STORY_INLINE_DOC==='string' && window.DMD_STORY_INLINE_DOC.length>10000)return window.DMD_STORY_INLINE_DOC;
   if(typeof window.DMD_STORY_PAYLOAD==='string' && window.DMD_STORY_PAYLOAD.length>10000)return window.DMD_STORY_PAYLOAD;
   return null;
 }
 function loadPayload(){
   try{if(getEmbedded())return Promise.resolve(getEmbedded());}catch(err){return Promise.reject(err)}
   if(pending)return pending;
   pending=new Promise((resolve,reject)=>{
     const script=document.createElement('script');script.src=payloadURL;script.async=true;
     script.onload=()=>{const doc=window.DMD_STORY_PAYLOAD;if(typeof doc==='string'&&doc.length>10000)resolve(doc);else reject(new Error('스토리 데이터 없음'))};
     script.onerror=()=>reject(new Error('스토리 데이터 파일 로드 실패'));
     document.head.append(script);
   }).catch(err=>{pending=null;throw err});
   return pending;
 }
 function prepareStoryDocument(doc){
   // about:srcdoc can have storage blocked in file-preview and embedded browsers.
   // Reuse same-origin parent storage if available; otherwise let the story run with an in-memory fallback.
   const bootstrap = '<scr'+'ipt>'+`(() => {
      const k='dmd_probe_v100';let store=null;let mode='local';
      try{store=window.localStorage;store.getItem(k)}catch(e){
        try{store=window.parent!==window?window.parent.localStorage:null;if(!store||typeof store.getItem!=='function')throw new Error('no parent store');store.getItem(k);mode='parent'}catch(_){
          const memory=new Map();store={getItem:x=>memory.has(x)?memory.get(x):null,setItem:(x,v)=>memory.set(x,String(v)),removeItem:x=>memory.delete(x),clear:()=>memory.clear()};mode='memory';
        }
        try{Object.defineProperty(window,'localStorage',{value:store,configurable:true})}catch(_){}
      }
      window.__DMD_STORY_STORAGE_MODE=mode;
    })();`+'</scr'+'ipt>';
   return doc.replace(/<\/head>/i,bootstrap+'</head>');
 }
 function removeNativeTips(root){
   if(!root?.querySelectorAll)return;
   root.querySelectorAll('button[title],[role="button"][title],a[title]').forEach(el=>{
     if(!el.hasAttribute('aria-label'))el.setAttribute('aria-label',el.getAttribute('title'));
     el.removeAttribute('title');
   });
 }
 async function mount(frame){
   if(!frame)return;
   const token=Symbol();frame._v100Token=token;
   status('역사 스토리를 불러오는 중…');
   try{
     const html=await loadPayload();
     if(!frame.isConnected||frame._v100Token!==token)return;
     // Crucial: never set iframe src. We supply the complete HTML directly and keep its own CSS/JS isolated.
     frame.removeAttribute('src');
     frame.onload=()=>{
       if(!frame.isConnected||frame._v100Token!==token)return;
       const statusEl=$('#v100StoryStatus');if(statusEl)statusEl.hidden=true;
       try{
         removeNativeTips(frame.contentDocument);
         const doc=frame.contentDocument;new MutationObserver(()=>removeNativeTips(doc)).observe(doc,{subtree:true,childList:true});
         if(frame.contentWindow?.__DMD_STORY_STORAGE_MODE==='memory'){
            const help=$('.v99-story-help');if(help&&!help.dataset.storageWarning){help.dataset.storageWarning='1';help.append(' · 현재 브라우저는 저장을 제한하여 진행 기록이 유지되지 않을 수 있어요.');}
         }
       }catch(_){}
     };
     frame.srcdoc=prepareStoryDocument(html);
   }catch(e){
     if(frame.isConnected&&frame._v100Token===token){console.error('[대민다위] 역사 스토리 로드 실패',e);status('스토리 파일을 열 수 없습니다.',true)}
   }
 }
 window.DMD_STORY_BRIDGE={mount};
 // Defensively support old app versions by detecting a pre-existing story frame on startup.
 if(document.readyState==='complete'||document.readyState==='interactive'){
   const f=$('#v99StoryFrame');if(f&&!f.srcdoc)mount(f);
 }else document.addEventListener('DOMContentLoaded',()=>{const f=$('#v99StoryFrame');if(f&&!f.srcdoc)mount(f)},{once:true});
})();
