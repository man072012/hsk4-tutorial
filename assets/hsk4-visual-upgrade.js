/* HSK4 Visual Upgrade helper: purely visual, does not modify academic data. */
(function(){
  const root = document.documentElement;
  root.classList.add('hsk4-visual-upgrade-ready');
  const cards = document.querySelectorAll('.card,.q-card,.question,.fc');
  cards.forEach((el,i)=>{
    el.style.setProperty('--hsk-order', String(i));
  });
})();
