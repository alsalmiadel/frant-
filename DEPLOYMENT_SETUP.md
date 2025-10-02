# إعداد النشر - متغيرات البيئة المطلوبة

## متغيرات Netlify البيئة الإلزامية

يجب إعداد هذه المتغيرات في Netlify Dashboard → Site settings → Environment variables:

### الأمان والأصل
```
ALLOWED_ORIGIN=https://smartstart-ai.net
PDPL_SAFE_MODE_DEFAULT=true
```

### OpenAI API
```
OPENAI_API_KEY=your_openai_api_key_here
CHAT_MODEL=gpt-4o-mini
TTS_MODEL=tts-1
STT_MODEL=whisper-1
TTS_VOICE=alloy
```

### Google Services (اختياري)
```
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
VITE_GA_MEASUREMENT_ID=your_analytics_id
```

## ملاحظات مهمة

1. **CORS محدود**: تم قفل CORS على الدومين المحدد فقط
2. **PDF عربي**: تم استبدال pdf-lib بـ Puppeteer لدعم الخطوط العربية
3. **تعقيم المزودين**: جميع المخرجات تحذف ذكر مزودي AI
4. **أرشفة TS**: ملفات TypeScript منقولة إلى `_src_archive/`

## قائمة التحقق قبل النشر

- [ ] إعداد جميع متغيرات البيئة
- [ ] تشغيل `npm install` لتحديث الحزم
- [ ] اختبار الصوت (STT/TTS) على Chrome
- [ ] تجربة توليد PDF بالعربي
- [ ] التحقق من عمل خرائط Google
- [ ] فحص Google Analytics

## الحزم الجديدة المضافة

- `@sparticuz/chromium`: لتشغيل Puppeteer على Netlify
- `puppeteer-core`: لتوليد PDF بالعربية

تم تحديث `netlify.toml` ليشمل هذه الحزم في `external_node_modules`.
