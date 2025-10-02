import { performanceMonitor } from '../lib/performance';

export interface ErrorReport {
  id: string;
  timestamp: Date;
  error: Error;
  context: string;
  userId?: string;
  sessionId?: string;
  userAgent: string;
  url: string;
  stackTrace: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  metadata: Record<string, any>;
}

export class ErrorReportingService {
  private static instance: ErrorReportingService;
  private errorQueue: ErrorReport[] = [];
  private isOnline = navigator.onLine;

  private constructor() {
    this.initializeErrorHandling();
    this.initializeNetworkMonitoring();
  }

  public static getInstance(): ErrorReportingService {
    if (!ErrorReportingService.instance) {
      ErrorReportingService.instance = new ErrorReportingService();
    }
    return ErrorReportingService.instance;
  }

  private initializeErrorHandling(): void {
    // التقاط الأخطاء العامة
    window.addEventListener('error', (event) => {
      this.captureError(event.error, 'global_error', {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // التقاط أخطاء Promise غير المعالجة
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(
        new Error(event.reason), 
        'unhandled_promise_rejection',
        { reason: event.reason }
      );
    });

    // التقاط أخطاء React (سيتم استدعاؤها من ErrorBoundary)
    (window as any).__SMARTSTART_ERROR_HANDLER__ = (error: Error, errorInfo: any) => {
      this.captureError(error, 'react_error', errorInfo);
    };
  }

  private initializeNetworkMonitoring(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushErrorQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  public captureError(
    error: Error, 
    context: string = 'unknown', 
    metadata: Record<string, any> = {}
  ): string {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const errorReport: ErrorReport = {
      id: errorId,
      timestamp: new Date(),
      error,
      context,
      userId: this.getCurrentUserId(),
      sessionId: this.getSessionId(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      stackTrace: error.stack || '',
      severity: this.determineSeverity(error, context),
      tags: this.generateTags(error, context),
      metadata: {
        ...metadata,
        performance: performanceMonitor.getAverageMetrics(),
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        timestamp: Date.now()
      }
    };

    // إضافة للطابور
    this.errorQueue.push(errorReport);

    // تسجيل في الأداء
    performanceMonitor.recordError(error, context);

    // محاولة الإرسال فوراً إذا كان متصلاً
    if (this.isOnline) {
      this.flushErrorQueue();
    }

    // تسجيل محلي للأخطاء الحرجة
    if (errorReport.severity === 'critical') {
      this.logCriticalError(errorReport);
    }

    return errorId;
  }

  private async flushErrorQueue(): Promise<void> {
    if (this.errorQueue.length === 0 || !this.isOnline) return;

    const errorsToSend = [...this.errorQueue];
    this.errorQueue = [];

    try {
      // إرسال الأخطاء للخادم
      const response = await fetch('/api/v1/errors/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({ errors: errorsToSend })
      });

      if (!response.ok) {
        // إعادة الأخطاء للطابور إذا فشل الإرسال
        this.errorQueue.unshift(...errorsToSend);
      }
    } catch (error) {
      console.warn('Failed to send error reports:', error);
      // إعادة الأخطاء للطابور
      this.errorQueue.unshift(...errorsToSend);
    }
  }

  private determineSeverity(error: Error, context: string): 'low' | 'medium' | 'high' | 'critical' {
    // أخطاء حرجة
    if (context.includes('auth') || context.includes('payment') || context.includes('security')) {
      return 'critical';
    }

    // أخطاء عالية
    if (error.name === 'TypeError' || error.name === 'ReferenceError') {
      return 'high';
    }

    // أخطاء متوسطة
    if (context.includes('api') || context.includes('network')) {
      return 'medium';
    }

    // أخطاء منخفضة
    return 'low';
  }

  private generateTags(error: Error, context: string): string[] {
    const tags = [context];

    if (error.name) tags.push(error.name);
    if (error.message.includes('network')) tags.push('network');
    if (error.message.includes('timeout')) tags.push('timeout');
    if (error.message.includes('permission')) tags.push('permission');

    return tags;
  }

  private logCriticalError(errorReport: ErrorReport): void {
    // تسجيل محلي للأخطاء الحرجة
    const criticalErrors = JSON.parse(localStorage.getItem('critical_errors') || '[]');
    criticalErrors.push({
      id: errorReport.id,
      timestamp: errorReport.timestamp,
      message: errorReport.error.message,
      context: errorReport.context
    });

    // الاحتفاظ بآخر 50 خطأ حرج فقط
    if (criticalErrors.length > 50) {
      criticalErrors.splice(0, criticalErrors.length - 50);
    }

    localStorage.setItem('critical_errors', JSON.stringify(criticalErrors));
  }

  private getCurrentUserId(): string | undefined {
    try {
      // الحصول على معرف المستخدم من الجلسة الحالية
      const session = JSON.parse(localStorage.getItem('supabase.auth.token') || '{}');
      return session.user?.id;
    } catch {
      return undefined;
    }
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  }

  private async getAuthToken(): Promise<string> {
    try {
      const { data: { session } } = await (window as any).supabase.auth.getSession();
      return session?.access_token || '';
    } catch {
      return '';
    }
  }

  public getErrorStats(): {
    total: number;
    bySeverity: Record<string, number>;
    byContext: Record<string, number>;
    recent: ErrorReport[];
  } {
    const bySeverity: Record<string, number> = {};
    const byContext: Record<string, number> = {};

    this.errorQueue.forEach(error => {
      bySeverity[error.severity] = (bySeverity[error.severity] || 0) + 1;
      byContext[error.context] = (byContext[error.context] || 0) + 1;
    });

    return {
      total: this.errorQueue.length,
      bySeverity,
      byContext,
      recent: this.errorQueue.slice(-10) // آخر 10 أخطاء
    };
  }

  public clearErrorQueue(): void {
    this.errorQueue = [];
  }
}

export const errorReporting = ErrorReportingService.getInstance();

// تصدير دالة مساعدة للاستخدام السهل
export const reportError = (error: Error, context?: string, metadata?: Record<string, any>) => {
  return errorReporting.captureError(error, context, metadata);
};