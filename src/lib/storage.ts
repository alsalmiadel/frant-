import { SecurityUtils } from '../utils/security';

export interface StorageOptions {
  encrypt?: boolean;
  expiry?: number; // milliseconds
  compress?: boolean;
}

export class SecureStorage {
  private static instance: SecureStorage;
  private readonly prefix = 'smartstart_';

  private constructor() {}

  public static getInstance(): SecureStorage {
    if (!SecureStorage.instance) {
      SecureStorage.instance = new SecureStorage();
    }
    return SecureStorage.instance;
  }

  setItem(key: string, value: any, options: StorageOptions = {}): boolean {
    try {
      const fullKey = this.prefix + key;
      
      let processedValue = JSON.stringify(value);
      
      // تشفير البيانات إذا طُلب
      if (options.encrypt) {
        processedValue = SecurityUtils.encrypt(processedValue);
      }

      // إضافة معلومات انتهاء الصلاحية
      const storageData = {
        value: processedValue,
        timestamp: Date.now(),
        expiry: options.expiry ? Date.now() + options.expiry : null,
        encrypted: options.encrypt || false
      };

      localStorage.setItem(fullKey, JSON.stringify(storageData));
      return true;
    } catch (error) {
      console.error('Storage setItem error:', error);
      return false;
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const fullKey = this.prefix + key;
      const stored = localStorage.getItem(fullKey);
      
      if (!stored) return null;

      const storageData = JSON.parse(stored);
      
      // فحص انتهاء الصلاحية
      if (storageData.expiry && Date.now() > storageData.expiry) {
        this.removeItem(key);
        return null;
      }

      let value = storageData.value;
      
      // فك التشفير إذا كان مشفراً
      if (storageData.encrypted) {
        value = SecurityUtils.decrypt(value);
      }

      return JSON.parse(value);
    } catch (error) {
      console.error('Storage getItem error:', error);
      this.removeItem(key); // إزالة البيانات التالفة
      return null;
    }
  }

  removeItem(key: string): void {
    const fullKey = this.prefix + key;
    localStorage.removeItem(fullKey);
  }

  clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }

  // تنظيف البيانات المنتهية الصلاحية
  cleanup(): number {
    let cleanedCount = 0;
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        try {
          const stored = localStorage.getItem(key);
          if (stored) {
            const storageData = JSON.parse(stored);
            if (storageData.expiry && Date.now() > storageData.expiry) {
              localStorage.removeItem(key);
              cleanedCount++;
            }
          }
        } catch (error) {
          // إزالة البيانات التالفة
          localStorage.removeItem(key);
          cleanedCount++;
        }
      }
    });

    return cleanedCount;
  }

  // الحصول على حجم التخزين المستخدم
  getStorageSize(): { used: number; total: number; percentage: number } {
    let used = 0;
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        const value = localStorage.getItem(key);
        if (value) {
          used += new Blob([value]).size;
        }
      }
    });

    const total = 5 * 1024 * 1024; // 5MB تقريبي لـ localStorage
    const percentage = (used / total) * 100;

    return { used, total, percentage };
  }

  // نسخ احتياطي للبيانات
  exportData(): string {
    const data: Record<string, any> = {};
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        const value = localStorage.getItem(key);
        if (value) {
          try {
            data[key.replace(this.prefix, '')] = JSON.parse(value);
          } catch (error) {
            console.warn(`Failed to parse stored data for key: ${key}`);
          }
        }
      }
    });

    return JSON.stringify(data, null, 2);
  }

  // استيراد البيانات من نسخة احتياطية
  importData(jsonData: string): { success: boolean; imported: number; errors: number } {
    let imported = 0;
    let errors = 0;

    try {
      const data = JSON.parse(jsonData);
      
      Object.entries(data).forEach(([key, value]) => {
        try {
          const fullKey = this.prefix + key;
          localStorage.setItem(fullKey, JSON.stringify(value));
          imported++;
        } catch (error) {
          console.error(`Failed to import data for key: ${key}`, error);
          errors++;
        }
      });

      return { success: true, imported, errors };
    } catch (error) {
      console.error('Import data error:', error);
      return { success: false, imported, errors: errors + 1 };
    }
  }
}

export const secureStorage = SecureStorage.getInstance();

// تنظيف تلقائي عند تحميل الصفحة
if (typeof window !== 'undefined') {
  // تنظيف البيانات المنتهية الصلاحية عند بدء التطبيق
  secureStorage.cleanup();
  
  // تنظيف دوري كل ساعة
  setInterval(() => {
    secureStorage.cleanup();
  }, 60 * 60 * 1000);
}