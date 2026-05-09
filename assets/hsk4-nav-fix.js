/* HSK4 Navigation: tab-based + mobile hamburger + nav-toggle injection */
(function(){
  // === Mock9 button function patches (define if missing or override broken) ===
  // Bug 1: checkTF - add revealed class + correct/wrong
  if (typeof window.checkTF !== 'function' || !window.__hsk4_checkTF_patched){
    window.checkTF = function(btn, userAns, correctAns){
      const q = btn.closest('.question, .q-card');
      if (!q) return;
      q.classList.add('revealed');
      const isCorrect = userAns === correctAns;
      btn.classList.add(isCorrect ? 'user-correct' : 'user-wrong');
      // Also disable other TF buttons in same question
      q.querySelectorAll('.tf-btn, .tf-choices button').forEach(function(b){
        if (b === btn) return;
        b.disabled = true;
        b.classList.add('disabled');
        // Highlight correct one
        const bAns = b.getAttribute('data-answer') || (b.textContent.includes('صح') ? 'T' : 'F');
        if (bAns === correctAns) b.classList.add('is-correct');
      });
    };
    window.__hsk4_checkTF_patched = true;
  }

  // Bug 2: toggleExplain - actually reveal explanation
  if (typeof window.toggleExplain !== 'function' || !window.__hsk4_toggleExplain_patched){
    window.toggleExplain = function(btn){
      const q = btn.closest('.question, .q-card');
      if (!q) return;
      const isRevealing = !q.classList.contains('revealed');
      q.classList.toggle('revealed', isRevealing);
      btn.textContent = isRevealing ? '🙈 إخفاء الشرح' : '💡 إظهار الشرح';
    };
    window.__hsk4_toggleExplain_patched = true;
  }

  // Bug 3: recordAndCompare - simple stub using browser SpeechRecognition / fallback
  if (typeof window.recordAndCompare !== 'function'){
    window.recordAndCompare = function(btn){
      const card = btn.closest('.flashcard, .question, .q-card, .vocab-item');
      const target = card ? (card.querySelector('.chinese, .hanzi, .fc-front, [lang="zh"]') || card).textContent.trim() : '';
      if (!target){
        alert('لم أجد نصاً صينياً للمقارنة');
        return;
      }
      // Try Web Speech API
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR){
        alert('متصفحك لا يدعم التسجيل الصوتي. استخدم Chrome/Edge.');
        return;
      }
      btn.disabled = true;
      const oldText = btn.innerHTML;
      btn.innerHTML = '🎤 جاري التسجيل...';
      const rec = new SR();
      rec.lang = 'zh-CN';
      rec.interimResults = false;
      rec.continuous = false;
      rec.onresult = function(e){
        const said = e.results[0][0].transcript;
        const matches = said.replace(/\s/g, '').includes(target.replace(/\s/g, '').slice(0, 3));
        alert((matches ? '✅ ممتاز! نطقك صحيح:\n' : '⚠️ حاول مرة أخرى. سمعتك تقول:\n') + said + '\n\nالنص: ' + target);
        btn.innerHTML = oldText;
        btn.disabled = false;
      };
      rec.onerror = function(e){
        alert('خطأ في التسجيل: ' + e.error);
        btn.innerHTML = oldText;
        btn.disabled = false;
      };
      rec.onend = function(){
        btn.innerHTML = oldText;
        btn.disabled = false;
      };
      try { rec.start(); } catch(err){
        alert('فشل بدء التسجيل: ' + err.message);
        btn.innerHTML = oldText;
        btn.disabled = false;
      }
    };
  }

  // Mock6/Mock9 enhancement: when wrong answer chosen, also reveal correct
  document.addEventListener('click', function(e){
    const btn = e.target.closest('.tf-btn, .opt-item, [class*="user-wrong"], [class*="user-correct"]');
    if (!btn) return;
    setTimeout(function(){
      if (btn.classList.contains('user-wrong')){
        const q = btn.closest('.q-card, .question');
        if (q) q.classList.add('revealed');
      }
    }, 50);
  }, false);

  // Skip-nav: register early at document level (capturing) to catch ALL focus events
  document.addEventListener('focusin', function(e){
    if (e.target && e.target.matches && e.target.matches('.skip-nav, .skip-link')){
      e.target.classList.add('skip-nav-shown');
      e.target.style.setProperty('top', '0', 'important');
      e.target.style.setProperty('outline', '3px solid #facc15', 'important');
    }
  }, true);
  document.addEventListener('focusout', function(e){
    if (e.target && e.target.classList && e.target.classList.contains('skip-nav-shown')){
      e.target.classList.remove('skip-nav-shown');
      e.target.style.removeProperty('top');
      e.target.style.removeProperty('outline');
    }
  }, true);

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
    const isMk9 = document.body.classList.contains('mk9-redesign') || document.body.classList.contains('mock9-redesign');
    // Detach pinyin from any sticky/positioned parent that would constrain fixed positioning
    if (pinyin.parentElement && pinyin.parentElement !== document.body){
      const parentCS = getComputedStyle(pinyin.parentElement);
      if (parentCS.position === 'sticky' || parentCS.transform !== 'none' || parentCS.willChange !== 'auto'){
        document.body.appendChild(pinyin);
      }
    }
    // Remove ALL shorthand properties first to avoid conflicts (inset overrides individual)
    pinyin.style.removeProperty('inset');
    pinyin.style.removeProperty('inset-inline');
    pinyin.style.removeProperty('inset-inline-start');
    pinyin.style.removeProperty('inset-inline-end');
    pinyin.style.removeProperty('inset-block');
    // Set ONLY individual properties (predictable cascade)
    pinyin.style.setProperty('position', 'fixed', 'important');
    pinyin.style.setProperty('z-index', '1000', 'important');
    pinyin.style.setProperty('top', 'auto', 'important');
    if (isMk9){
      // Mock9: physical right (RTL), lifted higher to clear bottom controls
      pinyin.style.setProperty('left', 'auto', 'important');
      pinyin.style.setProperty('right', '20px', 'important');
      pinyin.style.setProperty('bottom', '120px', 'important');
    } else {
      // Mock6 / index: physical left
      pinyin.style.setProperty('right', 'auto', 'important');
      pinyin.style.setProperty('left', '20px', 'important');
      pinyin.style.setProperty('bottom', '78px', 'important');
    }
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


  });
})();
