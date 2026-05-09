# 🚀 كيفية نشر المشروع على GitHub Pages

## الطريقة 1: واجهة GitHub (الأسهل)

1. اذهب إلى https://github.com/man072012/hsk4-tutorial
2. اضغط **"Add file"** → **"Upload files"**
3. اسحب وأفلت كل الملفات:
   - index.html
   - mock6.html
   - mock9.html
   - og-image.png
   - og-mock6.png
   - og-mock9.png
   - README.md
4. اضغط **"Commit changes"**
5. انتظر 1-3 دقائق
6. افتح: https://man072012.github.io/hsk4-tutorial/

## الطريقة 2: Git (للمحترفين)

```bash
git clone https://github.com/man072012/hsk4-tutorial.git
cd hsk4-tutorial
# انسخ ملفات هذا الأرشيف فوق الملفات القديمة
cp /path/to/this/folder/*.html .
cp /path/to/this/folder/*.png .
cp /path/to/this/folder/README.md .

git add -A
git commit -m "Update files"
git push origin main
```

## ملاحظات
- GitHub Pages يحدّث تلقائياً بعد كل commit
- التحديث يستغرق 30 ثانية إلى 3 دقائق
- استخدم `Ctrl+Shift+R` للتحديث القسري
