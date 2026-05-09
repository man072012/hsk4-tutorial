/* HSK4 Navigation: tab-based + mobile hamburger + nav-toggle injection */
(function(){
  function ready(fn){
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  const TAB_MAP = {
    '#listening': 'listening',
    '#reading': 'reading',
    '#writing': 'writing',
    '#flashcards': 'flashcards',
    '#grammar': 'grammar',
    '#tab-listening': 'tab-listening',
    '#tab-reading': 'tab-reading',
    '#tab-writing': 'tab-writing',
    '#tab-grammar': 'tab-grammar'
  };

  function activateTab(tabId){
    if (!tabId) return;
    document.querySelectorAll('.tab-content, .tab').forEach(el => el.classList.remove('active'));
    const target = document.getElementById(tabId);
    if (target){
      target.classList.add('active');
      document.body.dataset.activeTab = tabId;
      // Force-load images that were dormant in hidden tab
      target.querySelectorAll('img[data-src]').forEach(img => {
        if (!img.src && img.dataset.src) img.src = img.dataset.src;
      });
      target.querySelectorAll('img[loading="lazy"]').forEach(img => {
        img.loading = 'eager';
      });
    }
    document.querySelectorAll('.m6-mini-nav a, .mk9-mini-nav a, .hsk-nav a').forEach(a => {
      a.classList.remove('is-active', 'active');
      const href = a.getAttribute('href') || '';
      if (TAB_MAP[href] === tabId) a.classList.add('is-active', 'active');
    });
    window.scrollTo({top: 0, behavior: 'smooth'});
    document.body.classList.remove('nav-open');
    const mobBtn = document.querySelector('.nav-toggle-btn');
    if (mobBtn){
      mobBtn.setAttribute('aria-expanded', 'false');
      mobBtn.innerHTML = '☰';
    }
  }

  function injectNavToggle(){
    const target = document.querySelector('.m6-topbar-inner, .mk9-topbar-inner') ||
                   document.querySelector('.m6-topbar, .mk9-topbar, .hsk-topbar');
    if (!target) return false;
    if (target.querySelector('.nav-toggle-btn')) return true;
    const btn = document.createElement('button');
    btn.className = 'nav-toggle-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'القائمة');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '☰';
    btn.style.cssText = 'display:flex;width:44px;height:44px;align-items:center;justify-content:center;border-radius:50%;background:linear-gradient(135deg,#0b63ce,#064aa3);color:#fff;border:none;cursor:pointer;flex-shrink:0;font-size:20px;box-shadow:0 4px 12px rgba(0,0,0,0.15);font-weight:bold;';
    btn.onclick = function(){
      const isOpen = document.body.classList.toggle('nav-open');
      this.setAttribute('aria-expanded', String(isOpen));
      this.innerHTML = isOpen ? '✕' : '☰';
    };
    target.appendChild(btn);
    return true;
  }


  function forcePinyinPosition(){
    const pinyin = document.getElementById('pinyinToggle') || document.getElementById('togglePinyin');
    if (!pinyin) return;
    // CRITICAL ORDER: shorthand 'inset' includes top/right/bottom/left
    // Set 'inset' FIRST to clear, then individual properties
    pinyin.style.setProperty('inset', 'auto', 'important');
    pinyin.style.setProperty('inset-inline-start', 'auto', 'important');
    pinyin.style.setProperty('inset-inline-end', 'auto', 'important');
    pinyin.style.setProperty('inset-inline', 'auto', 'important');
    pinyin.style.setProperty('top', 'auto', 'important');
    pinyin.style.setProperty('right', 'auto', 'important');
    pinyin.style.setProperty('bottom', '78px', 'important');
    pinyin.style.setProperty('left', '20px', 'important');
    pinyin.style.setProperty('position', 'fixed', 'important');
    pinyin.style.setProperty('z-index', '1000', 'important');
  }

  ready(function(){
    // Persistent nav-toggle injection
    injectNavToggle();
    forcePinyinPosition();
    setTimeout(forcePinyinPosition, 500);
    setTimeout(forcePinyinPosition, 2000);
    let tries = 0;
    const retry = setInterval(function(){
      if (injectNavToggle() || ++tries > 20) clearInterval(retry);
    }, 300);
    try {
      const obs = new MutationObserver(function(){ injectNavToggle(); forcePinyinPosition(); });
      obs.observe(document.body, {childList: true, subtree: true});
    } catch(e){}

    // Convert nav links to tab switchers
    document.querySelectorAll('.m6-mini-nav a, .mk9-mini-nav a, .hsk-nav a').forEach(function(link){
      const href = link.getAttribute('href') || '';
      const text = link.textContent.trim();
      if (text === 'الرئيسية' && !location.pathname.endsWith('index.html') && location.pathname !== '/'){
        link.addEventListener('click', function(e){
          e.preventDefault();
          activateTab('listening');
        });
      } else if (TAB_MAP[href]){
        link.addEventListener('click', function(e){
          e.preventDefault();
          activateTab(TAB_MAP[href]);
          history.pushState(null, '', href);
        });
      }
    });

    // Initial active tab
    const hash = location.hash;
    let initialTab = TAB_MAP[hash] || 'listening';
    if (!document.getElementById(initialTab)){
      const first = document.querySelector('.tab-content, .tab');
      if (first && first.id) initialTab = first.id;
    }
    activateTab(initialTab);

    window.addEventListener('popstate', function(){
      const newTab = TAB_MAP[location.hash] || 'listening';
      activateTab(newTab);
    });

    document.addEventListener('click', function(e){
      const isToggle = e.target.classList.contains('nav-toggle-btn');
      const inNav = e.target.closest('.m6-mini-nav, .mk9-mini-nav, .hsk-nav');
      if (!isToggle && !inNav && document.body.classList.contains('nav-open')){
        document.body.classList.remove('nav-open');
        const btn = document.querySelector('.nav-toggle-btn');
        if (btn){
          btn.setAttribute('aria-expanded', 'false');
          btn.innerHTML = '☰';
        }
      }
    });

    // Skip-nav: add class on focus (works around :focus pseudo edge cases)
    document.querySelectorAll('.skip-nav, .skip-link').forEach(function(el){
      el.addEventListener('focus', function(){ this.classList.add('skip-nav-shown'); });
      el.addEventListener('blur', function(){ this.classList.remove('skip-nav-shown'); });
    });
  });
})();
