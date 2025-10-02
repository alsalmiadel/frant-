import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'smartstart-ai-default-key-2025';

export class SecurityUtils {
  // تشفير البيانات الحساسة
  static encrypt(data: string): string {
    try {
      return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
    } catch (error) {
      console.error('Encryption error:', error);
      return data;
    }
  }

  // فك تشفير البيانات
  static decrypt(encryptedData: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption error:', error);
      return encryptedData;
    }
  }

  // تنظيف البيانات من XSS
  static sanitizeInput(input: string): string {
    if (!input) return '';
    
    return input
      .replace(/[<>]/g, '') // إزالة HTML tags
      .replace(/javascript:/gi, '') // إزالة JavaScript URLs
      .replace(/on\w+=/gi, '') // إزالة event handlers
      .replace(/data:/gi, '') // إزالة data URLs
      .trim()
      .substring(0, 1000); // تحديد الطول الأقصى
  }

  // التحقق من قوة كلمة المرور
  static validatePassword(password: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) {
      score += 20;
    } else {
      feedback.push('يجب أن تكون 8 أحرف على الأقل');
    }

    if (/[a-z]/.test(password)) {
      score += 20;
    } else {
      feedback.push('يجب أن تحتوي على حرف صغير');
    }

    if (/[A-Z]/.test(password)) {
      score += 20;
    } else {
      feedback.push('يجب أن تحتوي على حرف كبير');
    }

    if (/\d/.test(password)) {
      score += 20;
    } else {
      feedback.push('يجب أن تحتوي على رقم');
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 20;
    } else {
      feedback.push('يجب أن تحتوي على رمز خاص');
    }

    // فحص الكلمات الشائعة
    const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'user'];
    if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
      score -= 30;
      feedback.push('تجنب الكلمات الشائعة');
    }

    return {
      isValid: score >= 80,
      score: Math.max(0, score),
      feedback
    };
  }

  // التحقق من صحة البريد الإلكتروني
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    
    // فحص إضافي للبريد الإلكتروني المشبوه
    const suspiciousDomains = ['tempmail', '10minutemail', 'guerrillamail'];
    const domain = email.split('@')[1]?.toLowerCase();
    const isSuspicious = suspiciousDomains.some(suspicious => domain?.includes(suspicious));
    
    return isValid && !isSuspicious;
  }

  // التحقق من رقم الجوال السعودي
  static validateSaudiPhone(phone: string): boolean {
    // إزالة المسافات والرموز
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    // التحقق من الصيغة السعودية
    const phoneRegex = /^(05|5)[0-9]{8}$/;
    return phoneRegex.test(cleanPhone);
  }

  // إنشاء session token آمن
  static generateSessionToken(): string {
    return CryptoJS.lib.WordArray.random(32).toString();
  }

  // التحقق من CSRF token
  static validateCSRFToken(token: string, expectedToken: string): boolean {
    return token === expectedToken;
  }

  // تسجيل محاولات الدخول المشبوهة
  static logSuspiciousActivity(activity: {
    type: string;
    ip?: string;
    userAgent?: string;
    timestamp: Date;
    details?: any;
  }) {
    // في بيئة الإنتاج، يجب إرسال هذا لنظام المراقبة
    console.warn('Suspicious activity detected:', activity);
    
    // حفظ في localStorage للمراجعة
    const logs = JSON.parse(localStorage.getItem('security_logs') || '[]');
    logs.push(activity);
    
    // الاحتفاظ بآخر 100 سجل فقط
    if (logs.length > 100) {
      logs.splice(0, logs.length - 100);
    }
    
    localStorage.setItem('security_logs', JSON.stringify(logs));
  }

  // تنظيف البيانات الحساسة من الذاكرة
  static clearSensitiveData(obj: any) {
    if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach(key => {
        if (key.toLowerCase().includes('password') || 
            key.toLowerCase().includes('token') ||
            key.toLowerCase().includes('secret') ||
            key.toLowerCase().includes('key')) {
          try {
            obj[key] = null;
            delete obj[key];
          } catch (e) {
            // تجاهل الأخطاء في التنظيف
          }
        }
      });
    }
  }

  // فحص أمان المتصفح
  static checkBrowserSecurity(): {
    isSecure: boolean;
    warnings: string[];
  } {
    const warnings: string[] = [];
    let isSecure = true;

    // فحص HTTPS
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      warnings.push('الموقع غير آمن (HTTP)');
      isSecure = false;
    }

    // فحص Local Storage
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
    } catch (e) {
      warnings.push('التخزين المحلي غير متاح');
    }

    // فحص Cookies
    if (!navigator.cookieEnabled) {
      warnings.push('الكوكيز معطلة');
    }

    // فحص JavaScript
    if (typeof window === 'undefined') {
      warnings.push('JavaScript غير مفعل');
      isSecure = false;
    }

    return { isSecure, warnings };
  }

  // تشفير البيانات الحساسة للتخزين المحلي
  static secureLocalStorage = {
    setItem: (key: string, value: string) => {
      try {
        const encrypted = SecurityUtils.encrypt(value);
        localStorage.setItem(key, encrypted);
      } catch (error) {
        console.error('Secure storage error:', error);
      }
    },
    
    getItem: (key: string): string | null => {
      try {
        const encrypted = localStorage.getItem(key);
        if (!encrypted) return null;
        return SecurityUtils.decrypt(encrypted);
      } catch (error) {
        console.error('Secure retrieval error:', error);
        return null;
      }
    },
    
    removeItem: (key: string) => {
      localStorage.removeItem(key);
    }
  };
}

// Rate limiting للحماية من الهجمات
export class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts = 5, windowMs = 15 * 60 * 1000) { // 5 محاولات كل 15 دقيقة
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(identifier);

    if (!attempt) {
      this.attempts.set(identifier, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (now > attempt.resetTime) {
      this.attempts.set(identifier, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (attempt.count >= this.maxAttempts) {
      return false;
    }

    attempt.count++;
    return true;
  }

  getRemainingAttempts(identifier: string): number {
    const attempt = this.attempts.get(identifier);
    if (!attempt || Date.now() > attempt.resetTime) {
      return this.maxAttempts;
    }
    return Math.max(0, this.maxAttempts - attempt.count);
  }

  getResetTime(identifier: string): number {
    const attempt = this.attempts.get(identifier);
    return attempt?.resetTime || 0;
  }
}

// Content Security Policy
export class CSPManager {
  static setupCSP() {
    // إعداد Content Security Policy للحماية من XSS
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      font-src 'self' https://fonts.gstatic.com;
      img-src 'self' data: https: blob:;
      connect-src 'self' https://api.supabase.co wss://api.supabase.co;
      media-src 'self' blob:;
    `.replace(/\s+/g, ' ').trim();
    
    document.head.appendChild(meta);
  }
}

// Session Management
export class SessionManager {
  private static readonly SESSION_KEY = 'smartstart_session';
  private static readonly MAX_IDLE_TIME = 30 * 60 * 1000; // 30 دقيقة

  static startSessionMonitoring() {
    let lastActivity = Date.now();

    // تتبع النشاط
    const updateActivity = () => {
      lastActivity = Date.now();
      SecurityUtils.secureLocalStorage.setItem('last_activity', lastActivity.toString());
    };

    // إضافة مستمعي الأحداث
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    // فحص انتهاء صلاحية الجلسة
    const checkSession = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivity;

      if (timeSinceLastActivity > SessionManager.MAX_IDLE_TIME) {
        SessionManager.expireSession();
        clearInterval(checkSession);
      }
    }, 60000); // فحص كل دقيقة

    return () => {
      clearInterval(checkSession);
      ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }

  static expireSession() {
    toast.error('انتهت صلاحية الجلسة بسبب عدم النشاط');
    
    // تنظيف البيانات
    SecurityUtils.clearSensitiveData(window);
    localStorage.clear();
    sessionStorage.clear();
    
    // إعادة توجيه لصفحة تسجيل الدخول
    window.location.href = '/';
  }
}

// إنشاء مثيلات Rate Limiter
export const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 محاولات كل 15 دقيقة
export const apiRateLimiter = new RateLimiter(100, 60 * 1000); // 100 طلب كل دقيقة
export const voiceRateLimiter = new RateLimiter(20, 60 * 1000); // 20 طلب صوتي كل دقيقة

// تهيئة الأمان عند تحميل الصفحة
if (typeof window !== 'undefined') {
  // إعداد CSP
  CSPManager.setupCSP();
  
  // بدء مراقبة الجلسة
  SessionManager.startSessionMonitoring();
  
  // فحص أمان المتصفح
  const securityCheck = SecurityUtils.checkBrowserSecurity();
  if (!securityCheck.isSecure) {
    console.warn('Browser security warnings:', securityCheck.warnings);
  }
}