# 📚 HSK4 Tutorial Project - النسخة الكاملة المحلية

## 🌐 الروابط
- **الموقع المنشور:** https://man072012.github.io/hsk4-tutorial/
- **مستودع GitHub:** https://github.com/man072012/hsk4-tutorial
- **مصدر البيانات:** https://www.hskmock.cn

## 📁 محتويات هذا الأرشيف

### الملفات الرئيسية (للنشر)
- `index.html` - صفحة الهبوط (8 KB)
- `mock6.html` - دليل الاختبار 6 (660 KB)
- `mock9.html` - دليل الاختبار 9 (95 KB)
- `og-image.png` - صورة المشاركة الرئيسية (1200×630)
- `og-mock6.png` - صورة Mock 6
- `og-mock9.png` - صورة Mock 9
- `README.md` - وصف المشروع
- `شغّل_الدليل.bat` - ملف تشغيل HTTP server محلي على Windows

### مجلد البيانات
- `data/hsk4_mock9_audio_urls.json` - 45 رابط MP3 لـ Mock 9
- `data/hsk4_mock9_extracted.json` - بيانات الأسئلة المستخرجة
- `data/hsk4_mock9_extracted_full.json` - بيانات كاملة بالـ metadata

## 🚀 التشغيل المحلي

### Windows:
1. انقر مرتين على `شغّل_الدليل.bat`
2. سيُفتح متصفحك تلقائياً

### macOS / Linux:
```bash
cd hsk4-project-full
python3 -m http.server 8000
# ثم افتح http://localhost:8000
```

### بدون خادم:
يمكن فتح `index.html` مباشرة في المتصفح، لكن بعض الميزات قد لا تعمل (مثل الميكروفون).

## ✨ الميزات

### Mock 6 (للمبتدئين)
- 100 سؤال (45 استماع + 40 قراءة + 15 كتابة)
- 54 بطاقة ذاكرة بصرية SVG
- 70 ملف صوت أصلي MP3
- 4 محركات نطق (iFlytek + Youdao + Google + Web Speech)
- تسجيل الصوت ومقارنة النطق
- 518 كلمة مفردات قابلة للنقر

### Mock 9 (متقدم)
- 100 سؤال
- 57 بطاقة SVG
- 45 ملف صوت أصلي
- 20 قاعدة نحوية
- زر تحميل الأصوات مسبقاً

### مشترك بين الاختبارين
- 🔒 وضع الاختبار (الإجابات مخفية افتراضياً)
- ✅ تفاعل النقر (صح/خطأ مع رسومات متحركة)
- 🌙 الوضع الليلي
- 📊 شريط تقدم مع تتبع localStorage
- 📈 ملخص أداء (✓ صحيح، ✗ خطأ، 🔍 مكشوف)
- 👁️ زر إخفاء/إظهار Pinyin
- 🎤 تسجيل الصوت
- ♿ دعم قارئات الشاشة (ARIA)
- 📱 تصميم متجاوب (Mobile + Tablet + Desktop)

## 🎯 الميزات التقنية
- HTML5 + CSS3 + JavaScript (vanilla, no build)
- WebSocket لـ iFlytek TTS مع HMAC-SHA256
- MediaRecorder API للتسجيل
- LocalStorage للتفضيلات والتقدم
- Open Graph + Twitter Card meta
- JSON-LD Schema.org structured data
- Inline SVG favicons
- ARIA labels + skip nav + keyboard support

## 📝 سجل التغييرات الرئيسية

### Latest commits:
1. **922d3ed8** - Address final 3 review points (ARIA stats, closeable tip, real og:image PNG)
2. **d379fb23** - Final improvements based on second professional review
3. **5737bfb5** - Comprehensive enhancements: SEO, accessibility, dark mode, progress tracking
4. **d54635a3** - Make vocab cards clickable for pronunciation
5. **02dc10d5** - Hide dialogue lines but keep question visible in test mode
6. **927b785d** - Hide audio transcripts and option translations in test mode
7. **9244df8a** - Add interactive testing features
8. **f8366d18** - Add Mock 9 tutorial + landing page

## 📜 الترخيص
محتوى تعليمي مجاني للاستخدام الشخصي. الصوت والأسئلة الأصلية ملكية hskmock.cn.

---
**صنع بحب** 💖 لتعلم الصينية بأسلوب الفهم بدون حفظ.
