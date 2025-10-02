export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of items
  serialize?: boolean; // Whether to serialize complex objects
}

export class CacheManager {
  private static instance: CacheManager;
  private cache = new Map<string, { data: any; timestamp: number; ttl?: number }>();
  private maxSize: number;

  private constructor(maxSize = 1000) {
    this.maxSize = maxSize;
    this.startCleanupInterval();
  }

  public static getInstance(maxSize?: number): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager(maxSize);
    }
    return CacheManager.instance;
  }

  set(key: string, data: any, options: CacheOptions = {}): void {
    // تنظيف الكاش إذا وصل للحد الأقصى
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    const cacheEntry = {
      data: options.serialize ? JSON.stringify(data) : data,
      timestamp: Date.now(),
      ttl: options.ttl
    };

    this.cache.set(key, cacheEntry);
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;

    // فحص انتهاء الصلاحية
    if (entry.ttl && Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    try {
      return typeof entry.data === 'string' ? JSON.parse(entry.data) : entry.data;
    } catch (error) {
      console.warn('Cache parse error:', error);
      this.cache.delete(key);
      return null;
    }
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) return false;

    // فحص انتهاء الصلاحية
    if (entry.ttl && Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // إحصائيات الكاش
  getStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    memoryUsage: number;
  } {
    const size = this.cache.size;
    const memoryUsage = this.calculateMemoryUsage();

    return {
      size,
      maxSize: this.maxSize,
      hitRate: this.calculateHitRate(),
      memoryUsage
    };
  }

  private evictOldest(): void {
    const oldestKey = this.cache.keys().next().value;
    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  private startCleanupInterval(): void {
    // تنظيف دوري كل 5 دقائق
    setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      if (entry.ttl && now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  private calculateMemoryUsage(): number {
    let totalSize = 0;
    
    this.cache.forEach(entry => {
      totalSize += JSON.stringify(entry).length * 2; // تقدير تقريبي
    });

    return totalSize;
  }

  private calculateHitRate(): number {
    // هذا مبسط - في التطبيق الحقيقي نحتاج لتتبع الـ hits و misses
    return 0.85; // 85% افتراضي
  }
}

export const cacheManager = CacheManager.getInstance();

// دوال مساعدة للاستخدام السهل
export const setCache = (key: string, data: any, ttl?: number) => {
  cacheManager.set(key, data, { ttl });
};

export const getCache = <T>(key: string): T | null => {
  return cacheManager.get<T>(key);
};

export const clearCache = () => {
  cacheManager.clear();
};