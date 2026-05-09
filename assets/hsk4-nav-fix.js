/* HSK4 Navigation: tab-based + mobile hamburger */
(function(){
  function ready(fn){
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }
  
  // Map nav link href → tab id
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
    
    // Hide all tab-content
    document.querySelectorAll('.tab-content, .tab').forEach(el => {
      el.classList.remove('active');
    });
    
    // Show target tab
    const target = document.getElementById(tabId);
    if (target){
      target.classList.add('active');
      document.body.dataset.activeTab = tabId;
    }
    
    // Update nav active state
    document.querySelectorAll('.m6-mini-nav a, .mk9-mini-nav a, .hsk-nav a').forEach(a => {
      a.classList.remove('is-active', 'active');
      const href = a.getAttribute('href') || '';
      if (TAB_MAP[href] === tabId){
        a.classList.add('is-active', 'active');
      }
    });
    
    // Scroll to top of content
    window.scrollTo({top: 0, behavior: 'smooth'});
    
    // Close mobile nav
    document.body.classList.remove('nav-open');
    const mobBtn = document.querySelector('.nav-toggle-btn');
    if (mobBtn) mobBtn.setAttribute('aria-expanded', 'false');
  }
  
  ready(function(){
    // === Add hamburger button for mobile (persistent injection) ===
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
      btn.setAttribute('aria-controls', 'main-nav-menu');
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
    // Persistent injection: try every 300ms for up to 6 seconds
    injectNavToggle();
    let navTries = 0;
    const navRetry = setInterval(() => {
      if (injectNavToggle() || ++navTries > 20) clearInterval(navRetry);
    }, 300);
    // Re-inject if removed by other scripts (defensive)
    setTimeout(() => {
      const obs = new MutationObserver(() => { injectNavToggle(); });
      obs.observe(document.body, {childList: true, subtree: true});
      // Final attempt
      setTimeout(() => injectNavToggle(), 2000);
    }, 100);

    // === Convert nav links to tab switchers ===
    document.querySelectorAll('.m6-mini-nav a, .mk9-mini-nav a, .hsk-nav a').forEach(link => {
      const href = link.getAttribute('href') || '';
      const text = link.textContent.trim();
      
      // "الرئيسية" - go to listening (the default first section)
      if (text === 'الرئيسية' && !location.pathname.endsWith('index.html') && location.pathname !== '/'){
        link.addEventListener('click', function(e){
          e.preventDefault();
          activateTab('listening');
        });
      }
      // Anchor links - switch tabs
      else if (TAB_MAP[href]){
        link.addEventListener('click', function(e){
          e.preventDefault();
          activateTab(TAB_MAP[href]);
          // Update URL hash
          history.pushState(null, '', href);
        });
      }
    });
    
    // === Determine initial active tab ===
    const hash = location.ha