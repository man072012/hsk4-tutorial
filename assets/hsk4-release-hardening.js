/* HSK4 Release Hardening — Stage 5. Visual/UX helpers only; academic text is untouched. */
(function(){
  const ready = (fn)=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn):fn();
  const $ = (sel,ctx=document)=>ctx.querySelector(sel);
  const $$ = (sel,ctx=document)=>Array.from(ctx.querySelectorAll(sel));

  function toast(message){
    let t=$('.hsk-stage5-toast');
    if(!t){t=document.createElement('div');t.className='hsk-stage5-toast';t.setAttribute('role','status');t.setAttribute('aria-live','polite');document.body.appendChild(t);}
    t.textContent=message;t.classList.add('is-visible');
    clearTimeout(t._timer);t._timer=setTimeout(()=>t.classList.remove('is-visible'),2200);
  }

  function addReleaseTools(){
    if($('.hsk-stage5-tools')) return;
    const tools=document.createElement('div');
    tools.className='hsk-stage5-tools';
    tools.innerHTML=`
      <button class="hsk-stage5-tool-action" type="button" data-action="top">↑ أعلى الصفحة</button>
      <button class="hsk-stage5-tool-action" type="button" data-action="print">🖨️ طباعة / PDF</button>
      <button class="hsk-stage5-tool-action" type="button" data-action="copy">🔗 نسخ الرابط</button>
      <button class="hsk-stage5-tool-main" type="button" aria-expanded="false" aria-label="أدوات الصفحة"><span aria-hidden="true">✦</span> أدوات</button>`;
    document.body.appendChild(tools);
    const main=$('.hsk-stage5-tool-main',tools);
    main.addEventListener('click',()=>{
      const open=!tools.classList.contains('is-open');
      tools.classList.toggle('is-open',open);main.setAttribute('aria-expanded',String(open));
    });
    tools.addEventListener('click',async(e)=>{
      const btn=e.target.closest('[data-action]'); if(!btn) return;
      const action=btn.dataset.action;
      if(action==='top') window.scrollTo({top:0,behavior:'smooth'});
      if(action==='print') window.print();
      if(action==='copy'){
        try{await navigator.clipboard.writeText(location.href);toast('تم نسخ رابط الصفحة');}
        catch(_){toast('انسخ الرابط من شريط المتصفح');}
      }
    });
  }

  function lazyMedia(){
    $$('img').forEach(img=>{
      if(!img.hasAttribute('loading')) img.loading='lazy';
      if(!img.hasAttribute('decoding')) img.decoding='async';
    });
  }

  function activeLinks(){
    const path=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    $$('nav a').forEach(a=>{
      const href=(a.getAttribute('href')||'').split('#')[0]||'index.html';
      if(href.toLowerCase()===path) a.setAttribute('aria-current','page');
    });
  }

  function keyboardShortcuts(){
    document.addEventListener('keydown',e=>{
      if(e.altKey && !e.ctrlKey && !e.metaKey && e.key.toLowerCase()==='t'){
        e.preventDefault();window.scrollTo({top:0,behavior:'smooth'});toast('تم الرجوع لأعلى الصفحة');
      }
      if(e.altKey && !e.ctrlKey && !e.metaKey && e.key.toLowerCase()==='p'){
        e.preventDefault();window.print();
      }
    });
  }

  function registerServiceWorker(){
    if(!('serviceWorker' in navigator)) return;
    if(location.protocol!=='https:' && location.hostname!=='localhost' && location.hostname!=='127.0.0.1') return;
    if(new URLSearchParams(location.search).has('no-sw')) return;
    window.addEventListener('load',()=>{
      navigator.serviceWorker.register('./sw.js').catch(()=>{});
    });
  }

  function boot(){
    document.body.classList.add('hsk-stage5-ready');
    addReleaseTools();
    lazyMedia();
    activeLinks();
    keyboardShortcuts();
    registerServiceWorker();
  }
  ready(boot);
})();
