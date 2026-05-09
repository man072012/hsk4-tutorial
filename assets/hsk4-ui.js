(function(){
  const qs = (sel, root=document) => root.querySelector(sel);
  const tip = qs('#introTip');
  const close = qs('#closeTip');
  const KEY = 'hsk4_intro_dismissed_v2';
  if (tip && localStorage.getItem(KEY) === '1') tip.style.display = 'none';
  if (close) close.addEventListener('click', () => {
    if (tip) tip.style.display = 'none';
    localStorage.setItem(KEY, '1');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest && e.target.closest('.hsk-test-card');
    if (!card) return;
    card.click();
  });

  const cards = document.querySelectorAll('.hsk-test-card');
  cards.forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - .5) * 5;
      const y = ((e.clientY - r.top) / r.height - .5) * -5;
      card.style.transform = `translateY(-9px) rotateX(${y}deg) rotateY(${x}deg)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
})();
