/* HSK4 Mock 9 Stage 2 UI helper: visual-only enhancements. */
(function(){
  function annotate(tab){
    if(!tab) return;
    tab.querySelectorAll('.question').forEach((card,i)=>{
      card.style.setProperty('--card-index', i);
      card.setAttribute('data-visual-upgraded','stage-2');
    });
  }
  function syncRing(){
    const text=document.getElementById('progress-text');
    const ring=document.querySelector('.mk9-progress-ring');
    if(!text||!ring) return;
    const m=text.textContent.match(/\((\d+)%\)/)||text.textContent.match(/(\d+)%/);
    const pct=m?Number(m[1]):0;
    ring.style.background='conic-gradient(var(--mk-blue) '+pct+'%, rgba(226,232,240,.85) 0)';
    const s=ring.querySelector('strong'); if(s) s.textContent=pct+'%';
  }
  function boot(){
    document.body.classList.add('mock9-redesign-ready');
    document.querySelectorAll('.tab').forEach(annotate);
    syncRing(); setInterval(syncRing,1500);
    document.querySelectorAll('#mainNav button').forEach(btn=>btn.addEventListener('click',()=>setTimeout(()=>{
      annotate(document.getElementById('tab-'+btn.dataset.tab));
      const panel=document.querySelector('.mk9-main-panel'); if(panel) panel.scrollIntoView({behavior:'smooth',block:'start'});
    },25)));
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
