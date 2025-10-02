# نشر سريع على Netlify (بدون إعداد إضافي)

1. ادخل على Netlify > Add new site > Import an existing project.
2. ارفع المجلد المضغوط `project_netlify_ready.zip` (أو اربطه بمستودع Git).
3. ما يحتاج تعدل أي شيء:
   - Build command: `npm ci && npm run build`
   - Publish directory: `dist`
   - Node: 20 / NPM: 10 (مضبوطة في `netlify.toml`)
4. لو تطبيقك SPA (React Router/Vue Router) بيشتغل التوجيه تلقائيًا عبر `_redirects`.

> ملاحظة: لو مشروعك يحتاج مفاتيح سرية أثناء التشغيل، ستحتاج إضافتها لاحقًا من Netlify Dashboard > Site settings > Environment variables.
