export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  apiResponseTime: number;
  memoryUsage: number;
  errorRate: number;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics[] = [];
  private observers: PerformanceObserver[] = [];

  private constructor() {
    this.initializeObservers();
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initializeObservers(): void {
    if (typeof window === 'undefined') return;

    // مراقب أداء التنقل
    if ('PerformanceObserver' in window) {
      const navigationObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            this.recordNavigationMetrics(entry as PerformanceNavigationTiming);
          }
        });
      });

      try {
        navigationObserver.observe({ entryTypes: ['navigation'] });
        this.observers.push(navigationObserver);
      } catch (error) {
        console.warn('Navigation observer not supported:', error);
      }

      // مراقب أداء الموارد
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'resource') {
            this.recordResourceMetrics(entry as PerformanceResourceTiming);
          }
        });
      });

      try {
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.push(resourceObserver);
      } catch (error) {
        console.warn('Resource observer not supported:', error);
      }

      // مراقب أداء الرسم
      const paintObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'paint') {
            this.recordPaintMetrics(entry as PerformancePaintTiming);
          }
        });
      });

      try {
        paintObserver.observe({ entryTypes: ['paint'] });
        this.observers.push(paintObserver);
      } catch (error) {
        console.warn('Paint observer not supported:', error);
      }
    }
  }

  private recordNavigationMetrics(entry: PerformanceNavigationTiming): void {
    const metrics = {
      loadTime: entry.loadEventEnd - entry.navigationStart,
      renderTime: entry.domContentLoadedEventEnd - entry.navigationStart,
      apiResponseTime: 0, // سيتم تحديثه من API calls
      memoryUsage: this.getMemoryUsage(),
      errorRate: 0 // سيتم حسابه من الأخطاء المسجلة
    };

    this.metrics.push(metrics);
    this.trimMetrics();
  }

  private recordResourceMetrics(entry: PerformanceResourceTiming): void {
    // تسجيل أداء تحميل الموارد
    if (entry.name.includes('/api/')) {
      const responseTime = entry.responseEnd - entry.requestStart;
      this.updateApiResponseTime(responseTime);
    }
  }

  private recordPaintMetrics(entry: PerformancePaintTiming): void {
    // تسجيل أوقات الرسم
    console.log(`${entry.name}: ${entry.startTime}ms`);
  }

  private getMemoryUsage(): number {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize / memory.jsHeapSizeLimit;
    }
    return 0;
  }

  private updateApiResponseTime(responseTime: number): void {
    if (this.metrics.length > 0) {
      const latest = this.metrics[this.metrics.length - 1];
      latest.apiResponseTime = responseTime;
    }
  }

  private trimMetrics(): void {
    // الاحتفاظ بآخر 100 قياس فقط
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
  }

  public getAverageMetrics(): PerformanceMetrics {
    if (this.metrics.length === 0) {
      return {
        loadTime: 0,
        renderTime: 0,
        apiResponseTime: 0,
        memoryUsage: 0,
        errorRate: 0
      };
    }

    const totals = this.metrics.reduce(
      (acc, metric) => ({
        loadTime: acc.loadTime + metric.loadTime,
        renderTime: acc.renderTime + metric.renderTime,
        apiResponseTime: acc.apiResponseTime + metric.apiResponseTime,
        memoryUsage: acc.memoryUsage + metric.memoryUsage,
        errorRate: acc.errorRate + metric.errorRate
      }),
      { loadTime: 0, renderTime: 0, apiResponseTime: 0, memoryUsage: 0, errorRate: 0 }
    );

    const count = this.metrics.length;
    return {
      loadTime: totals.loadTime / count,
      renderTime: totals.renderTime / count,
      apiResponseTime: totals.apiResponseTime / count,
      memoryUsage: totals.memoryUsage / count,
      errorRate: totals.errorRate / count
    };
  }

  public recordError(error: Error, context?: string): void {
    // تسجيل الخطأ وتحديث معدل الأخطاء
    if (this.metrics.length > 0) {
      const latest = this.metrics[this.metrics.length - 1];
      latest.errorRate += 1;
    }

    // إرسال تقرير الخطأ للمراقبة
    this.reportError(error, context);
  }

  private async reportError(error: Error, context?: string): Promise<void> {
    try {
      const errorReport = {
        message: error.message,
        stack: error.stack,
        context: context || 'unknown',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        metrics: this.getAverageMetrics()
      };

      // في بيئة الإنتاج، أرسل للخادم
      if (import.meta.env.PROD) {
        fetch('/api/v1/errors/report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(errorReport)
        }).catch(reportError => {
          console.warn('Failed to report error:', reportError);
        });
      }
    } catch (reportError) {
      console.warn('Error reporting failed:', reportError);
    }
  }

  public getPerformanceReport(): {
    metrics: PerformanceMetrics;
    recommendations: string[];
    score: number;
  } {
    const metrics = this.getAverageMetrics();
    const recommendations: string[] = [];
    let score = 100;

    // تقييم الأداء وإعطاء توصيات
    if (metrics.loadTime > 3000) {
      recommendations.push('تحسين سرعة تحميل الصفحة');
      score -= 20;
    }

    if (metrics.apiResponseTime > 2000) {
      recommendations.push('تحسين سرعة استجابة API');
      score -= 15;
    }

    if (metrics.memoryUsage > 0.8) {
      recommendations.push('تحسين استخدام الذاكرة');
      score -= 15;
    }

    if (metrics.errorRate > 0.05) {
      recommendations.push('تقليل معدل الأخطاء');
      score -= 25;
    }

    return {
      metrics,
      recommendations,
      score: Math.max(0, score)
    };
  }

  public destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics = [];
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();

// تنظيف عند إغلاق النافذة
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    performanceMonitor.destroy();
  });
}