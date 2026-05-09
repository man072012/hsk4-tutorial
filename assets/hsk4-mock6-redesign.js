/* HSK4 Mock 6 Stage 3 UI helper: structural visual enhancements only. */
(function(){
  const SELECTORS={q:'.q-card',tabs:'.tabs'};
  function createTopbar(){
    if(document.querySelector('.m6-topbar')) return;
    const top=document.createElement('header');
    top.className='m6-topbar';
    top.setAttribute('aria-label','شريط الموقع');
    top.innerHTML=`
      <div class="m6-topbar-inner">
        <a class="m6-brand" href="index.html" aria-label="العودة إلى صفحة HSK4 الرئيسية">
          <span class="m6-logo" aria-hidden="true">汉</span>
          <span><strong>HSK4</strong><small>中文水平考试</small></span>
        </a>
        <nav class="m6-mini-nav" aria-label="روابط سريعة">
          <a href="index.html">الرئيسية</a>
          <a class="is-active" href="#listening">الاستماع</a>
          <a href="#reading">القراءة</a>
          <a href="#writing">الكتابة</a>
          <a href="#flashcards">البطاقات والقواعد</a>
        </nav>
        <div class="m6-lang" aria-label="اللغة">🌐 العربية</div>
      </div>`;
    const skip=document.querySelector('.skip-nav');
    if(skip && skip.parentNode) skip.insertAdjacentElement('afterend', top); else document.body.prepend(top);
  }
  function rewriteHero(){
    const h=document.querySelector('.hero h1');
    if(h && !h.dataset.m6){
      h.innerHTML='📚 شرح اختبار HSK4 المحاكي رقم <span class="m6-blue">6</span>';
      h.dataset.m6='1';
    }
  }
  function annotateCards(){
    document.querySelectorAll(SELECTORS.q).forEach((card,i)=>{
      if(card.dataset.m6Upgraded) return;
      card.dataset.m6Upgraded='stage-3';
      card.style.setProperty('--card-index', i);
      const header=card.querySelector('.q-header');
      if(header && !header.querySelector('.m6-mini-chip')){
        const chip=document.createElement('span');
        chip.className='m6-mini-chip';
        chip.textContent='تحليل تعليمي';
        chip.style.cssText='background:rgba(11,101,216,.08);color:#0b65d8;border:1px solid rgba(11,101,216,.18);border-radius:999px;padding:7px 12px;font-weight:950;font-size:12px';
        header.appendChild(chip);
      }
      card.querySelectorAll('.chinese-box .label,.trans-box .label,.vocab-section .label,.explain-box .label,.why-box .label,.memory-box .label').forEach(label=>{
        if(!label.dataset.m6Icon){
          const txt=label.textContent.trim();
          if(!/^[🔊📘🧩💡🔑🧠📌]/.test(txt)){
            if(label.closest('.chinese-box')) label.textContent='📘 '+txt;
            else if(label.closest('.trans-box')) label.textContent='🌍 '+txt;
            else if(label.closest('.vocab-section')) label.textContent='🔑 '+txt;
            else if(label.closest('.explain-box')) label.textContent='📐 '+txt;
            else if(label.closest('.why-box')) label.textContent='🧠 '+txt;
            else if(label.closest('.memory-box')) label.textContent='💡 '+txt;
          }
          label.dataset.m6Icon='1';
        }
      });
    });
  }
  function syncActiveMiniNav(){
    const map={intro:'index.html',listening:'#listening',reading:'#reading',writing:'#writing',flashcards:'#flashcards'};
    let active=document.querySelector('.tab-content.active');
    document.querySelectorAll('.m6-mini-nav a').forEach(a=>a.classList.remove('is-active'));
    if(active){
      const a=document.querySelector(`.m6-mini-nav a[href="${map[active.id]||'#listening'}"]`);
      if(a) a.classList.add('is-active');
    }
  }
  function enhanceTabClicks(){
    document.querySelectorAll('.tab-btn').forEach(btn=>{
      if(btn.dataset.m6Listener) return;
      btn.dataset.m6Listener='1';
      btn.addEventListener('click',()=>setTimeout(()=>{annotateCards();syncActiveMiniNav();},80));
    });
  }
  function addSummaryFloat(){
    if(document.querySelector('.summary-float-btn')) return;
    const btn=document.createElement('button');
    btn.className='summary-float-btn';
    btn.type='button';
    btn.setAttribute('aria-label','عرض ملخص الأداء');
    btn.textContent='📊';
    btn.style.cssText='position:fixed;bottom:84px;left:20px;width:50px;height:50px;border-radius:18px;background:linear-gradient(135deg,#0b65d8,#084db3);color:#fff;border:0;cursor:pointer;font-size:20px;z-index:200';
    btn.addEventListener('click',()=>{
      if(typeof window.showSummary==='function') window.showSummary();
      else document.querySelector('.summary-card')?.scrollIntoView({behavior:'smooth'});
    });
    document.body.appendChild(btn);
  }
  function addVisualStatus(){
    const welcome=document.querySelector('.welcome-card');
    if(!welcome || welcome.querySelector('.m6-status-strip')) return;
    const strip=document.createElement('div');
    strip.className='m6-status-strip';
    strip.innerHTML=`
      <span>🎧 45 سؤال استماع</span>
      <span>📖 40 سؤال قراءة</span>
      <span>✏️ 15 سؤال كتابة</span>
      <span>🎨 54 بطاقة ذاكرة</span>`;
    strip.style.cssText='display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px;margin-top:18px';
    strip.querySelectorAll('span').forEach(s=>s.style.cssText='background:rgba(255,255,255,.72);border:1px solid rgba(148,163,184,.18);border-radius:16px;padding:11px 13px;text-align:center;font-weight:950;color:#0b65d8;box-shadow:0 8px 20px rgba(15,23,42,.05)');
    welcome.appendChild(strip);
  }
  function boot(){
    document.body.classList.add('mock6-redesign-ready');
    createTopbar();rewriteHero();addVisualStatus();annotateCards();enhanceTabClicks();syncActiveMiniNav();addSummaryFloat();
    setInterval(()=>{annotateCards();syncActiveMiniNav();},1800);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
