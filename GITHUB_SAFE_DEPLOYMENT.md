# رفع المشروع إلى GitHub Pages بطريقة آمنة

## تنبيه أمني

لا تستخدم أي GitHub Token ظهر داخل محادثة أو رسالة أو ملف. إذا ظهر Token سابقاً، ألغِه من GitHub فوراً ثم أنشئ Token جديداً عند الحاجة.

## الطريقة اليدوية الآمنة

1. فك ضغط الملف النهائي.
2. افتح مجلد:

   `hsk4-project-full`

3. انسخ كل محتوياته إلى جذر مستودع:

   `man072012/hsk4-tutorial`

4. نفّذ الأوامر:

```bash
git add .
git commit -m "Release final HSK4 visual redesign"
git push origin main
```

5. انتظر تحديث GitHub Pages ثم افتح:

   `https://man072012.github.io/hsk4-tutorial/`

## طريقة PowerShell المرفقة

يوجد ملف:

`publish_to_github_pages.ps1`

يشترط وجود Git على جهازك. هذا الملف لا يحتوي على Token ولا يحفظ أي Token. يعتمد على تسجيل دخولك المحلي في Git/GitHub CLI أو اعتماديات Git Credential Manager.
