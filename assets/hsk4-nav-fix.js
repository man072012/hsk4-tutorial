/* HSK4 Topbar Navigation Fix - smooth scroll + active scroll-spy */
(function(){
  function ready(fn){
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }
  
  ready(function(){
    // Find all nav links in topbar
    const navs = document.querySelectorAll('.m6-mini-nav, .mk9-mini-nav, .hsk-nav');
    if (navs.length === 0) return;
    
    // For each nav, fix the links
    navs.forEach(nav => {
      const links = nav.querySelectorAll('a');
      
      // 1. Make "الرئيسية" go to top of CURRENT page (not index.html)
      // unless we're already on index.html
      const isHomePage = location.pathname.endsWith('/') || location.pathname.endsWith('index.html');
      
      links.forEach(link => {
        const href = link.getAttribute('href');
        
        // "الرئيسية" link
        if (link.textContent.trim() === 'الرئيسية' && !isHomePage){
          // On mock pages, scroll to top instead of going home
          link.setAttribute('data-original-href', href);
          link.addEventListener('click', function(e){
            e.preventDefault();
            window.scrollTo({top: 0, behavior: 'smooth'});
            // Update active state immediately
            updateActiveState();
          });
        }
        // Anchor links - smooth scroll
        else if (href && href.startsWith('#')){
          link.addEventListener('click', function(e){
            const target = document.querySelector(href);
            if (target){
              e.preventDefault();
              const topbar = document.querySelector('.m6-topbar, .mk9-topbar, .hsk-topbar');
              const offset = topbar ? topbar.offsetHeight + 20 : 80;
              const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
              window.scrollTo({top, behavior: 'smooth'});
              // Update URL hash without jumping
              history.pushState(null, '', href);
              updateActiveState();
            }
          });
        }
        // Anchor links to other pages (e.g., "mock9.html#tab-listening") - leave default
      });
    });
    
    // Scroll-spy: update active class based on scroll position
    function updateActiveState(){
      const sections = document.querySelectorAll('[id="listening"],[id="reading"],[id="writing"],[id="flashcards"],[id="grammar"]');
      let current = '';
      const scrollY = window.scrollY + 150; // offset for topbar
      
      sections.forEach(sec => {
        if (sec.offsetTop <= scrollY){
          current = sec.id;
        }
      });
      
      // If at very top, mark "الرئيسية" as active
      if (window.scrollY < 100) current = '__home__';
      
      // Update all nav links
      document.querySelectorAll('.m6-mini-nav a, .mk9-mini-nav a, .hsk-nav a').forEach(a => {
        a.classList.remove('is-active', 'active');
        const href = a.getAttribute('href') || '';
        const linkText = a.textContent.trim();
        
        if (current === '__home__' && linkText === 'الرئيسية'){
          a.classList.add('is-active', 'active');
        } else if (href === '#' + current){
          a.classList.add('is-active', 'active');
        }
      });
    }
    
    // Throttled scroll listener
    let ticking = false;
    window.addEventListener('scroll', function(){
      if (!ticking){
        window.requestAnimationFrame(function(){
          updateActiveState();
          ticking = false;
        });
        ticking = true;
      }
    });
    
    // Initial call
    updateActiveState();
  });
})();
