/* Mock9 Writing Part 2 (Q96-100) - Image-based sentence questions from hskmock.cn */
(function(){
  const BASE_URL = 'https://public.hskmock.cn/hsk-examination/hsk4/891e0db07b831452/';
  window.MOCK9_WRITING_PIC = {"96": {"image": "793777ff-973a-459c-8b3a-d779e1ce2775.jpg", "word": "破", "meaning": "مكسور / تالف", "sample_zh": "我的眼镜破了。", "sample_py": "wǒ de yǎnjìng pò le", "sample_ar": "نظارتي مكسورة."}, "97": {"image": "729f3cbd-f520-4a1f-9298-37bd4fbb626e.jpg", "word": "挂", "meaning": "يعلّق", "sample_zh": "墙上挂着一幅画。", "sample_py": "qiáng shang guà zhe yī fú huà", "sample_ar": "على الحائط لوحة معلقة."}, "98": {"image": "51c30f02-5012-4a1e-a548-b371ebad2e53.jpg", "word": "吃惊", "meaning": "مندهش / متفاجئ", "sample_zh": "看到他的成绩，我很吃惊。", "sample_py": "kàndào tā de chéngjì, wǒ hěn chījīng", "sample_ar": "مندهش من نتائجه."}, "99": {"image": "69875956-d081-4756-8ec5-f6d0cfd88f37.jpg", "word": "美丽", "meaning": "جميل", "sample_zh": "这里的风景真美丽。", "sample_py": "zhèlǐ de fēngjǐng zhēn měilì", "sample_ar": "المناظر هنا جميلة جداً."}, "100": {"image": "d46763fb-23bf-440a-a28e-1f88c90e224b.jpg", "word": "减肥", "meaning": "يخسر الوزن", "sample_zh": "为了减肥，她每天跑步。", "sample_py": "wèile jiǎnféi, tā měitiān pǎobù", "sample_ar": "لكي تخسر الوزن، تجري كل يوم."}};

  function buildPicWriting(){
    if (!document.body.classList.contains('mock9-redesign') && !document.body.classList.contains('mk9-redesign')) return;
    const container = document.getElementById('writingQuestions');
    if (!container) return;
    if (container.dataset.picWritingBuilt === '1') return;
    
    const data = window.MOCK9_WRITING_PIC;
    if (!data) return;
    
    // Append to existing writing content (after Q86-95)
    let html = '<h2 class="section-break">📝 الجزء 2: تكوين جملة من صورة (96-100)</h2>';
    
    Object.keys(data).sort(function(a,b){return +a-+b;}).forEach(function(n){
      const q = data[n];
      const imgUrl = BASE_URL + q.image;
      html += '<div class="question">';
      html += '<div class="qheader"><span class="qnum">سؤال '+n+'</span><span class="answer">جملة نموذجية</span></div>';
      html += '<div style="text-align:center;margin:14px 0">';
      html += '<img src="'+imgUrl+'" alt="صورة السؤال '+n+'" loading="lazy" style="max-width:100%;max-height:300px;border-radius:12px;border:2px solid #d97706;box-shadow:0 4px 12px rgba(0,0,0,0.1)">';
      html += '</div>';
      html += '<div class="chinese" style="background:#fef3c7;border-right-color:#d97706;font-size:24px;text-align:center;font-weight:bold">الكلمة المفتاحية: <span class="chinese-inline">'+q.word+'</span> <small style="color:#92400e">('+q.meaning+')</small></div>';
      html += '<button class="show-answer-btn" onclick="toggleExplain(this)">💡 إظهار الجملة النموذجية</button>';
      html += '<div class="explanation explanation-hidden">';
      html += '<h4>✅ جملة نموذجية:</h4>';
      html += '<div class="chinese" style="font-size:22px">'+q.sample_zh+'<br><span class="pinyin">'+q.sample_py+'</span></div>';
      html += '<h4 style="margin-top:12px">🌐 الترجمة:</h4>';
      html += '<p>'+q.sample_ar+'</p>';
      html += '</div>';
      // Recording button
      html += '<div style="margin-top:10px"><button class="recbtn" onclick="recordAndCompare(this)">🎤 سجّل نطقك</button><div class="rec-result"></div></div>';
      html += '</div>';
    });
    
    container.insertAdjacentHTML('beforeend', html);
    container.dataset.picWritingBuilt = '1';
  }
  
  function init(){
    buildPicWriting();
    setTimeout(buildPicWriting, 500);
    setTimeout(buildPicWriting, 1500);
  }
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

