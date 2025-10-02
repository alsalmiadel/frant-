# ملفات الصوت

## gulf-greeting.mp3
ملف الترحيب الصوتي باللهجة الخليجية

### لتوليد الملف باستخدام Azure TTS:

```bash
curl -s -X POST "https://YOUR_REGION.tts.speech.microsoft.com/cognitiveservices/v1" \
  -H "Ocp-Apim-Subscription-Key: YOUR_KEY" \
  -H "Content-Type: application/ssml+xml" \
  -H "X-Microsoft-OutputFormat: audio-48khz-192kbitrate-mono-mp3" \
  --data-binary @- > gulf-greeting.mp3 << 'SSML'
<speak version="1.0" xml:lang="ar-SA">
  <voice name="ar-SA-HamedNeural">
    <prosody rate="-5%" pitch="+0%">
      يا هلا والله! معك سمارت ستارت أي آي — مستشارك الذكي باللهجة الخليجية.
      <break time="500ms"/>
      وش تبينا نساعدك فيه اليوم؟
    </prosody>
  </voice>
</speak>
SSML
```

### النص المستخدم:
"يا هلا والله! معك سمارت ستارت أي آي — مستشارك الذكي باللهجة الخليجية. وش تبينا نساعدك فيه اليوم؟ مشروع جديد؟ دراسة جدوى؟ ولا تسويق؟"

### البديل:
إذا لم يتوفر الملف، سيستخدم النظام Web Speech API تلقائياً.