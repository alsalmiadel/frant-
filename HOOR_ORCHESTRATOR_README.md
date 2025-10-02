# Hoor Orchestrator — Netlify Implementation

## 🎯 نظرة عامة
تم دمج "حور" - العقل المركزي للمستشار الذكي في SmartStartAI كوظائف Netlify Functions.

## 🚀 المتطلبات
- حساب Netlify مع مفاتيح البيئة
- مفتاح OpenAI صالح
- Node.js 18+

## ⚡ تشغيل محلي
```bash
npm install
npm run dev:netlify
```

## 🔗 نقاط النهاية (API Endpoints)

### العقل المركزي
```bash
POST /api/brain
Content-Type: application/json

{
  "text": "أبغى دراسة لمقهى مختص بالرياض",
  "context": {
    "sector": "F&B",
    "city": "Riyadh",
    "capex": 120000,
    "price_avg": 18,
    "customers_month": 900,
    "cogs_ratio": 0.45,
    "opex_monthly": 35000,
    "months": 60,
    "projectName": "مقهى الأصالة"
  }
}
```

### الحسابات المالية فقط
```bash
POST /api/feasibility
Content-Type: application/json

{
  "sector": "F&B",
  "price_avg": 18,
  "customers_month": 900,
  "cogs_ratio": 0.45,
  "opex_monthly": 35000,
  "capex": 120000,
  "months": 60
}
```

### درجة الملاءمة التمويلية
```bash
POST /api/bankability
Content-Type: application/json

{
  "monthly": {"revenue": 16200, "gross": 8910, "ebitda": -26090},
  "breakeven": false,
  "payback_months": null,
  "assumptions": {"price_avg": 18, "customers_month": 900}
}
```

### تحويل النص إلى صوت
```bash
POST /api/tts
Content-Type: application/json

{
  "text": "مرحبًا! أنا حور، مستشارك الذكي."
}
```

### تحويل الصوت إلى نص
```bash
POST /api/stt
Content-Type: application/json

{
  "audioBase64": "<BASE64_AUDIO_DATA>",
  "mime": "audio/webm;codecs=opus"
}
```

### حزمة البيانات (ZIP)
```bash
POST /api/dataroom
Content-Type: application/json

{
  "feasibility": {...},
  "narrative": "ملخص المشروع",
  "projectName": "مشروع تجريبي"
}
```

## 🧪 اختبارات القبول

### 1. اختبار الحسابات المالية
```bash
curl -X POST http://localhost:8888/api/feasibility \
  -H 'Content-Type: application/json' \
  -d '{
    "sector": "F&B",
    "price_avg": 18,
    "customers_month": 900,
    "cogs_ratio": 0.45,
    "opex_monthly": 35000,
    "capex": 120000,
    "months": 60
  }' | jq .
```

**النتيجة المتوقعة**: JSON يحتوي على `monthly.ebitda` و `payback_months`

### 2. اختبار درجة الملاءمة
```bash
curl -X POST http://localhost:8888/api/bankability \
  -H 'Content-Type: application/json' \
  -d '{
    "monthly": {"revenue": 16200, "gross": 8910, "ebitda": -26090},
    "breakeven": false,
    "payback_months": null
  }' | jq .
```

**النتيجة المتوقعة**: `{ "score": 35, "reasons": [...], "improve": [...] }`

### 3. اختبار العقل المركزي
```bash
curl -X POST http://localhost:8888/api/brain \
  -H 'Content-Type: application/json' \
  -d '{
    "text": "أبغى دراسة لمقهى بالرياض",
    "context": {
      "sector": "F&B",
      "city": "Riyadh",
      "capex": 120000,
      "price_avg": 18,
      "customers_month": 900
    }
  }' | jq .
```

**النتيجة المتوقعة**: JSON شامل مع `summary`, `analysis`, `financials`, `bankability`, `files`

### 4. اختبار TTS
```bash
curl -X POST http://localhost:8888/api/tts \
  -H 'Content-Type: application/json' \
  -d '{"text": "مرحبًا! أنا حور، تحت أمرك."}' \
  --output hoor_test.mp3
```

**النتيجة المتوقعة**: ملف MP3 يعمل

### 5. اختبار STT
```bash
# تحتاج ملف صوتي محول لـ base64
curl -X POST http://localhost:8888/api/stt \
  -H 'Content-Type: application/json' \
  -d '{"audioBase64": "<BASE64_DATA>", "mime": "audio/webm"}' | jq .
```

**النتيجة المتوقعة**: `{ "text": "النص المحول من الصوت" }`

## 🔒 الأمان والخصوصية

### متغيرات البيئة المطلوبة
```env
OPENAI_API_KEY=your_key_here
ALLOWED_ORIGIN=https://your-domain.com
PDPL_SAFE_MODE_DEFAULT=true
```

### ميزات الأمان
- ✅ CORS مقيد بـ `ALLOWED_ORIGIN`
- ✅ CSP headers أساسية
- ✅ تنظيف ذكر المزودين من النصوص
- ✅ وضع الخصوصية PDPL افتراضي
- ✅ حدود حجم البيانات

## 📁 هيكل الملفات المضافة

```
netlify/
  functions/
    brain.ts              # العقل المركزي
    chat.ts               # محادثة مبسطة
    feasibility.ts        # حسابات مالية
    bankability.ts        # درجة ملاءمة تمويلية
    tts.ts               # نص → صوت
    stt.ts               # صوت → نص
    dataroom.ts          # حزمة ZIP
    memory.ts            # ذاكرة/تفضيلات
    engines/
      utils.ts           # أدوات مشتركة
      openai.ts          # استدعاءات OpenAI
      finance.ts         # محرك مالي حتمي
      bankability.ts     # حساب درجة الملاءمة
      files.ts           # توليد PDF/Excel/ZIP
      rag.ts             # قاعدة معرفة خفيفة
```

## 🎯 التكامل مع الواجهة

تم تحديث `src/services/hoorAPI.ts` لاستخدام نقاط النهاية الجديدة:
- `/api/brain` للمحادثة الذكية
- `/api/tts` لتحويل النص إلى صوت
- `/api/stt` لتحويل الصوت إلى نص

## 📊 المخرجات

### العقل المركزي (`/api/brain`)
```json
{
  "summary": "ملخص عربي من حور",
  "analysis": {
    "assumptions": [...],
    "causal_links": [...],
    "forecast": [...],
    "actions": [...]
  },
  "financials": {
    "monthly": {"revenue": 16200, "gross": 8910, "ebitda": -26090},
    "breakeven": false,
    "payback_months": null
  },
  "bankability": {
    "score": 35,
    "reasons": [...],
    "improve": [...]
  },
  "files": {
    "pdf": "data:application/pdf;base64,...",
    "excel": "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,...",
    "zip": "data:application/zip;base64,..."
  }
}
```

## 🚀 النشر على Netlify

1. **ادفع الكود** إلى المستودع المربوط بـ Netlify
2. **أضف متغيرات البيئة** في Netlify Dashboard
3. **تأكد من البناء** - Netlify سيبني الوظائف تلقائياً
4. **اختبر النقاط** باستخدام أوامر curl أعلاه

## ⚠️ ملاحظات مهمة

- **الأرقام المالية**: دائماً محسوبة في `engines/finance.ts` (حتمية)
- **دور LLM**: التفسير والتوصيات فقط، لا اختراع أرقام
- **الخصوصية**: `PDPL_SAFE_MODE=true` يمنع التخزين افتراضياً
- **الأمان**: جميع النصوص تمر عبر `sanitizeProviderMentions`

## 🔄 التطوير المستقبلي

- ربط قاعدة بيانات للتخزين الدائم
- تحسين قوالب PDF/Excel
- إضافة المزيد من القطاعات
- تطوير نماذج تحليل أكثر تعقيداً

---

**تم التنفيذ بنجاح! 🎉**