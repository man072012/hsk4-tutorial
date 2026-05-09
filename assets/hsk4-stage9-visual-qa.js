
// HSK4 Stage 9 visual QA marker.
// Does not change academic content; only marks pages for consistency checks.
(function(){
  document.documentElement.classList.add('hsk-stage9-visual-consistency');
  document.addEventListener('DOMContentLoaded', function(){
    document.body.classList.add('hsk-stage9-ready');
    document.querySelectorAll('img.hsk-card-image').forEach(function(img){
      if(!img.hasAttribute('loading')) img.setAttribute('loading','lazy');
      if(!img.hasAttribute('decoding')) img.setAttribute('decoding','async');
    });
  });
})();
