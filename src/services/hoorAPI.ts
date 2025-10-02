// خدمة API للتفاعل مع "حور" - المساعد الذكي السعودي
import toast from 'react-hot-toast';

export class HoorAPI {
  private static instance: HoorAPI;
  
  private constructor() {}
  
  public static getInstance(): HoorAPI {
    if (!HoorAPI.instance) {
      HoorAPI.instance = new HoorAPI();
    }
    return HoorAPI.instance;
  }

  // المحادثة النصية مع حور
  async chat(text: string): Promise<string> {
    try {
      if (!text.trim()) {
        throw new Error('النص مطلوب');
      }

      const response = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text.trim() })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.text || 'عذراً، لم أتمكن من فهم طلبك';
    } catch (error: any) {
      console.error('Chat error:', error);
      toast.error('خطأ في المحادثة مع حور');
      throw error;
    }
  }

  // تحويل النص إلى صوت وتشغيله
  async speak(text: string): Promise<void> {
    try {
      if (!text.trim()) {
        throw new Error('النص مطلوب');
      }

      const response = await fetch('/.netlify/functions/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text.trim() })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      return new Promise((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        audio.onerror = () => {
          URL.revokeObjectURL(audioUrl);
          reject(new Error('خطأ في تشغيل الصوت'));
        };
        audio.play().catch(reject);
      });
    } catch (error: any) {
      console.error('TTS error:', error);
      toast.error('خطأ في تحويل النص إلى صوت');
      throw error;
    }
  }

  // تحويل الصوت إلى نص
  async speechToText(audioBlob: Blob): Promise<string> {
    try {
      if (!audioBlob || audioBlob.size === 0) {
        throw new Error('ملف صوتي مطلوب');
      }

      // تحويل إلى base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      const response = await fetch('/.netlify/functions/stt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          audioBase64: base64Audio, 
          mime: audioBlob.type || 'audio/webm' 
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.text || '';
    } catch (error: any) {
      console.error('STT error:', error);
      toast.error('خطأ في تحويل الصوت إلى نص');
      throw error;
    }
  }

  // محادثة صوتية كاملة: تسجيل → نص → رد → صوت
  async voiceChat(audioBlob: Blob): Promise<{ userText: string; hoorResponse: string }> {
    try {
      // تحويل الصوت إلى نص
      const userText = await this.speechToText(audioBlob);
      
      if (!userText.trim()) {
        throw new Error('لم أتمكن من فهم ما قلته، يرجى المحاولة مرة أخرى');
      }

      // الحصول على رد من حور
      const hoorResponse = await this.chat(userText);

      // تشغيل رد حور صوتياً
      await this.speak(hoorResponse);

      return { userText, hoorResponse };
    } catch (error: any) {
      console.error('Voice chat error:', error);
      toast.error(error.message || 'خطأ في المحادثة الصوتية');
      throw error;
    }
  }

  // فحص حالة الخدمة
  async healthCheck(): Promise<boolean> {
    try {
      const API_BASE = import.meta.env.VITE_API_BASE || 'https://smartstartai-backend-production.up.railway.app';
      const response = await fetch(`${API_BASE}/api/v1/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: 'مرحبا',
          context: { sector: "test" }
        })
      });

      return response.ok;
    } catch (error) {
      console.warn('Health check failed:', error);
      return false;
    }
  }
}

export const hoorAPI = HoorAPI.getInstance();

// دوال مساعدة للاستخدام السهل
export const chatWithHoor = (text: string) => hoorAPI.chat(text);
export const speakText = (text: string) => hoorAPI.speak(text);
export const transcribeAudio = (audioBlob: Blob) => hoorAPI.speechToText(audioBlob);
export const voiceChatWithHoor = (audioBlob: Blob) => hoorAPI.voiceChat(audioBlob);