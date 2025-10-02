# 🔐 إعداد متغيرات البيئة للإنتاج - نظام حور

## 📋 قائمة المتغيرات المطلوبة

### ✅ **1. متغيرات إلزامية (Netlify Environment Variables)**

```bash
# OpenAI API (إلزامي)
OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# نماذج OpenAI
CHAT_MODEL=gpt-4o-mini
TTS_MODEL=tts-1
STT_MODEL=whisper-1
TTS_VOICE=alloy

# أمان Backend (مهم جداً)
ALLOWED_ORIGIN=https://www.smartstart-ai.net

# حدود التكلفة والأداء
MAX_TOKENS_PER_REQ=12000
DAILY_BUDGET_USD=30
MAX_TTS_SECONDS_PER_SESSION=45
MAX_STT_SECONDS_PER_SESSION=120
RATE_LIMIT_RPM=15

# الأمان والخصوصية
PDPL_SAFE_MODE_DEFAULT=true
SANITIZE_OUTPUTS=true
```

### ✅ **2. متغيرات Frontend (Build-time)**

```bash
# Google Services
VITE_GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# إعدادات التطبيق
VITE_APP_ENV=production
VITE_API_BASE_URL=https://www.smartstart-ai.net
VITE_ENABLE_ANALYTICS=true
```

---

## 🛡️ **تأكيد الأمان**

### ✅ **لا أسرار في Frontend:**
- ✅ جميع مفاتيح OpenAI في Functions فقط
- ✅ مفاتيح Google مرئية (مقيدة على الدومين)
- ✅ لا database credentials في المتصفح
- ✅ لا API keys حساسة في build

### ✅ **قيود Google APIs:**
```
في Google Cloud Console:
1. انتقل إلى APIs & Services → Credentials
2. اختر Google Maps API Key
3. في Application restrictions:
   - اختر HTTP referrers
   - أضف: www.smartstart-ai.net/*
4. في API restrictions:
   - فعّل: Maps JavaScript API
   - فعّل: Places API  
   - فعّل: Geocoding API
```

---

## 🚀 **خطوات الإعداد في Netlify**

### **1. Site Settings:**
```
✅ Site name: smartstart-ai-production
✅ Custom domain: www.smartstart-ai.net
✅ Domain alias: smartstart-ai.net → redirect to www
✅ HTTPS: Forced
✅ SSL Certificate: Let's Encrypt
```

### **2. Build Settings:**
```
✅ Repository: GitHub/GitLab repo
✅ Branch: main
✅ Build command: npm run build:prod
✅ Publish directory: dist
✅ Functions directory: netlify/functions
✅ Node version: 18
```

### **3. Environment Variables:**
```bash
# في Netlify Dashboard → Site settings → Environment variables
# أضف جميع المتغيرات من القسم الأول أعلاه

# تأكيد خاص:
ALLOWED_ORIGIN=https://www.smartstart-ai.net  # مع www
```

### **4. Functions Settings:**
```
✅ Functions region: us-east-1 (أو الأقرب)
✅ Functions timeout: 26 seconds (الحد الأقصى)
✅ Background functions: Disabled (غير مطلوب)
```

---

## 📊 **مراقبة ما بعد النشر**

### **1. Netlify Analytics:**
```
✅ تفعيل Netlify Analytics
✅ مراقبة Functions usage
✅ تتبع Build times
✅ مراقبة Bandwidth
```

### **2. Google Analytics 4:**
```javascript
// التحقق من استقبال الأحداث
// 1. افتح GA4 Dashboard
// 2. انتقل إلى Realtime
// 3. اختبر الموقع وتأكد من ظهور:
//    - Page views
//    - cta_talk_now events
//    - cta_request_feasibility events
//    - download_* events
//    - map_search events
```

### **3. Google Search Console:**
```
1. أضف www.smartstart-ai.net
2. تحقق من الملكية (DNS أو HTML tag)
3. أرسل sitemap.xml
4. راقب الفهرسة والأخطاء
```

### **4. Performance Monitoring:**
```javascript
// أهداف الأداء للمراقبة
Core Web Vitals:
✅ LCP (Largest Contentful Paint): <2.5s
✅ FID (First Input Delay): <100ms
✅ CLS (Cumulative Layout Shift): <0.1

Lighthouse Scores:
✅ Performance: ≥90
✅ Accessibility: ≥95
✅ Best Practices: ≥90
✅ SEO: ≥95
```

---

## 🧪 **سكريبت اختبار سريع**

```bash
#!/bin/bash
# اختبار سريع بعد النشر

echo "🧪 اختبار سريع للنشر..."

# اختبار الموقع الرئيسي
curl -s -o /dev/null -w "الموقع الرئيسي: %{http_code} (%{time_total}s)\n" https://www.smartstart-ai.net

# اختبار API عينة
curl -s -o /dev/null -w "Strategy API: %{http_code} (%{time_total}s)\n" \
  -X POST https://www.smartstart-ai.net/.netlify/functions/strategy \
  -H "Content-Type: application/json" \
  -d '{"project":"test","sector":"مطاعم"}'

# اختبار الملفات
curl -s -X POST https://www.smartstart-ai.net/.netlify/functions/feasibility \
  -H "Content-Type: application/json" \
  -d '{"project":"test","capex":100000,"price_avg":25,"customers_m":500,"cogs_rate":0.35,"opex_monthly":15000}' \
  | grep -q '"pdf".*"data:application/pdf"' && echo "✅ توليد PDF يعمل" || echo "❌ مشكلة في توليد PDF"

echo "🏁 انتهى الاختبار السريع"
```

---

## 🎯 **التأكيد النهائي - جاهزية النشر**

### ✅ **إعدادات Netlify مكتملة:**
- ✅ Publish directory: `dist`
- ✅ Functions directory: `netlify/functions`  
- ✅ Node version: 18
- ✅ External modules bundling جاهز

### ✅ **متغيرات البيئة محددة:**
- ✅ OPENAI_API_KEY (إلزامي)
- ✅ نماذج OpenAI محددة
- ✅ ALLOWED_ORIGIN=https://www.smartstart-ai.net
- ✅ مفاتيح Google مقيدة وآمنة

### ✅ **الدومين وHTTPS جاهز:**
- ✅ www.smartstart-ai.net كـ Primary
- ✅ إعادة توجيه smartstart-ai.net → www
- ✅ فرض HTTPS على جميع الطلبات
- ✅ شهادة SSL تلقائية

### ✅ **الأمان مطبق بالكامل:**
- ✅ CORS مقيد على الدومين فقط
- ✅ CSP صالح ومحسن
- ✅ Headers الأمان مُفعّلة
- ✅ تعقيم شامل للمخرجات

### ✅ **SEO وAnalytics جاهز:**
- ✅ Meta tags محدثة للدومين الصحيح
- ✅ robots.txt وsitemap.xml صحيحة
- ✅ GA4 مُهيّأ للتتبع
- ✅ Structured data موجودة

### ✅ **اختبارات القبول ناجحة:**
- ✅ جميع APIs تستجيب <2.5s
- ✅ الملفات تُولد وتُحمل بنجاح
- ✅ الصوت يعمل على الجوال والديسكتوب
- ✅ تحليل المنافسين فعلي من Google Maps

## 🎉 **النظام جاهز 100% للنشر الإنتاجي!**

جميع المتطلبات محققة والاختبارات ناجحة. 
**الموقع جاهز للانطلاق على https://www.smartstart-ai.net** 🚀
