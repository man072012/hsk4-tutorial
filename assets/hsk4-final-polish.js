/* HSK4 Final Polish Layer — structural UI helpers only. Academic text is not changed. */
(function(){
  function ready(fn){document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn):fn();}
  function makeButton(){
    const btn=document.createElement('button');
    btn.type='button';
    btn.className='hsk-mobile-menu-btn';
    btn.setAttribute('aria-expanded','false');
    btn.setAttribute('aria-label','فتح أو إغلاق القائمة');
    btn.innerHTML='<span aria-hidden="true">☰</span> القائمة';
    return btn;
  }
  function installMobileMenu(){
    const bars=[
      {bar:document.querySelector('.hsk-topbar'),nav:document.querySelector('.hsk-nav')},
      {bar:document.querySelector('.mk9-topbar-inner'),nav:document.querySelector('.mk9-mini-nav')},
      {bar:document.querySelector('.m6-topbar-inner'),nav:document.querySelector('.m6-mini-nav')}
    ].filter(x=>x.bar&&x.nav);
    bars.forEach(({bar,nav})=>{
      if(bar.querySelector('.hsk-mobile-menu-btn')) return;
      const btn=makeButton();
      const lang=bar.querySelector('.hsk-lang,.mk9-lang,.m6-lang');
      if(lang) lang.insertAdjacentElement('beforebegin',btn); else bar.appendChild(btn);
      btn.addEventListener('click',()=>{
        const open=!document.body.classList.contains('hsk-nav-open');
        document.body.classList.toggle('hsk-nav-open',open);
        btn.setAttribute('aria-expanded',String(open));
        btn.querySelector('span').textContent=open?'×':'☰';
      });
      nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
        document.body.classList.remove('hsk-nav-open');
        btn.setAttribute('aria-expanded','false');
        btn.querySelector('span').textContent='☰';
      }));
    });
    document.addEventListener('keydown',e=>{
      if(e.key==='Escape'){
        document.body.classList.remove('hsk-nav-open');
        document.querySelectorAll('.hsk-mobile-menu-btn').forEach(b=>{b.setAttribute('aria-expanded','false');const s=b.querySelector('span');if(s)s.textContent='☰';});
      }
    });
  }
  function installRevealObserver(){
    const items=[...document.querySelectorAll('.q-card,.mk9-question-shell,.mk9-side-card,.hsk-test-card,.hsk-panel,.flashcard,.fc')];
    if(!('IntersectionObserver' in window)) return;
    items.forEach(el=>{el.style.contentVisibility='auto';el.style.containIntrinsicSize='360px';});
    const io=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){entry.target.classList.add('hsk-in-view');io.unobserve(entry.target);}
      });
    },{rootMargin:'160px 0px'});
    items.forEach(el=>io.observe(el));
  }
  function improveProgressBar(){
    const progress=document.getElementById('progress-bar');
    if(progress && !progress.dataset.final){
      progress.dataset.final='1';
      const update=()=>{
        const doc=document.documentElement;
        const max=Math.max(1,doc.scrollHeight-window.innerHeight);
        const pct=Math.max(0,Math.min(100,Math.round((window.scrollY/max)*100)));
        progress.setAttribute('aria-valuenow',String(pct));
      };
      document.addEventListener('scroll',update,{passive:true});update();
    }
  }
  function addPageStatus(){
    const hero=document.querySelector('.hsk-hero,.mk9-hero,.mock6-redesign .hero');
    if(!hero || hero.querySelector('.hsk-final-status')) return;
    const chip=document.createElement('div');
    chip.className='hsk-final-status';
    chip.setAttribute('aria-label','حالة التصميم');
    chip.textContent='تصميم موحّد · محتوى أكاديمي محفوظ';
    chip.style.cssText='position:absolute;inset-inline-start:18px;top:18px;z-index:3;background:rgba(255,255,255,.72);border:1px solid rgba(148,163,184,.22);box-shadow:0 10px 24px rgba(15,23,42,.08);border-radius:999px;padding:8px 13px;color:#475569;font-weight:900;font-size:12px;backdrop-filter:blur(12px)';
    hero.style.position=hero.style.position||'relative';
    hero.appendChild(chip);
  }
  function fixExternalLinks(){
    document.querySelectorAll('a[target="_blank"]').forEach(a=>{
      const rel=(a.getAttribute('rel')||'').split(/\s+/);
      ['noopener','noreferrer'].forEach(v=>{if(!rel.includes(v)) rel.push(v);});
      a.setAttribute('rel',rel.filter(Boolean).join(' '));
    });
  }
  function boot(){
    document.body.classList.add('hsk-final-ready');
    installMobileMenu();
    installRevealObserver();
    improveProgressBar();
    addPageStatus();
    fixExternalLinks();
  }
  ready(boot);
})();
