import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug, Mail, Phone, Copy } from 'lucide-react';
import { errorReporting } from '../utils/errorReporting';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      error,
      errorId: errorReporting.captureError(error, 'react_error_boundary')
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('خطأ في التطبيق:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
      errorId: errorReporting.captureError(error, 'react_component_error', {
        componentStack: errorInfo.componentStack
      })
    });

    // استدعاء callback إضافي إذا تم توفيره
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // إشعار النظام العام للأخطاء
    if ((window as any).__SMARTSTART_ERROR_HANDLER__) {
      (window as any).__SMARTSTART_ERROR_HANDLER__(error, errorInfo);
    }
  }

  private handleReload = () => {
    // تنظيف البيانات المؤقتة
    sessionStorage.clear();
    
    // إعادة تحميل الصفحة
    window.location.reload();
  };

  private handleGoHome = () => {
    // تنظيف الحالة
    this.setState({ hasError: false });
    
    // العودة للرئيسية
    window.location.href = '/';
  };

  private copyErrorDetails = () => {
    const errorDetails = `
خطأ في التطبيق - SmartStartAI
معرف الخطأ: ${this.state.errorId}
الوقت: ${new Date().toLocaleString('ar-SA')}
الرسالة: ${this.state.error?.message}
المتصفح: ${navigator.userAgent}
الصفحة: ${window.location.href}

تفاصيل تقنية:
${this.state.error?.stack}

معلومات المكون:
${this.state.errorInfo?.componentStack}
    `.trim();

    navigator.clipboard.writeText(errorDetails).then(() => {
      alert('تم نسخ تفاصيل الخطأ');
    }).catch(() => {
      // fallback للمتصفحات القديمة
      const textArea = document.createElement('textarea');
      textArea.value = errorDetails;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('تم نسخ تفاصيل الخطأ');
    });
  };

  private reportToSupport = () => {
    const subject = encodeURIComponent(`خطأ في التطبيق - ${this.state.errorId}`);
    const body = encodeURIComponent(`
مرحباً فريق الدعم،

حدث خطأ في التطبيق:

معرف الخطأ: ${this.state.errorId}
الوقت: ${new Date().toLocaleString('ar-SA')}
الصفحة: ${window.location.href}
الرسالة: ${this.state.error?.message}

يرجى المساعدة في حل هذه المشكلة.

شكراً لكم.
    `);

    window.open(`mailto:support@smartstart.sa?subject=${subject}&body=${body}`);
  };

  public render() {
    if (this.state.hasError) {
      // عرض fallback مخصص إذا تم توفيره
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-light-green flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-w-lg w-full">
            {/* أيقونة الخطأ */}
            <div className="w-20 h-20 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <AlertTriangle className="h-10 w-10 text-red-600" />
            </div>
            
            {/* العنوان والوصف */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-almarai font-bold text-gray-800 mb-4">
                عذراً، حدث خطأ غير متوقع
              </h2>
              
              <p className="text-gray-600 font-almarai mb-4 leading-relaxed">
                نعتذر عن هذا الإزعاج. فريقنا التقني تم إشعاره تلقائياً وسيعمل على حل المشكلة.
              </p>

              {/* معرف الخطأ */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm font-almarai text-gray-600">
                  معرف الخطأ: <span className="font-mono text-gray-800">{this.state.errorId}</span>
                </p>
              </div>
            </div>
            
            {/* أزرار الإجراءات */}
            <div className="space-y-3 mb-6">
              <button
                onClick={this.handleReload}
                className="w-full bg-gradient-to-r from-saudi-green to-saudi-gold text-white py-3 rounded-xl font-almarai font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-5 w-5" />
                إعادة تحميل الصفحة
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="w-full bg-white border-2 border-saudi-green text-saudi-green py-3 rounded-xl font-almarai font-bold hover:bg-light-green transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Home className="h-5 w-5" />
                العودة للرئيسية
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={this.copyErrorDetails}
                  className="bg-gray-100 text-gray-700 py-3 rounded-xl font-almarai font-bold hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  نسخ التفاصيل
                </button>

                <button
                  onClick={this.reportToSupport}
                  className="bg-tech-blue text-white py-3 rounded-xl font-almarai font-bold hover:bg-tech-blue/90 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Bug className="h-4 w-4" />
                  إبلاغ الدعم
                </button>
              </div>
            </div>
            
            {/* معلومات التواصل */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-almarai font-bold text-gray-800 mb-3 text-center">
                إذا استمرت المشكلة، تواصل معنا:
              </h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-saudi-green" />
                  <span className="font-almarai text-gray-700">920012345</span>
                </div>
                
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-saudi-green" />
                  <span className="font-almarai text-gray-700">support@smartstart.sa</span>
                </div>
              </div>
              
              <div className="mt-3 text-center">
                <p className="text-xs font-almarai text-gray-500">
                  🕐 دعم فني متاح 24/7 - نحن معك دائماً
                </p>
              </div>
            </div>

            {/* تفاصيل تقنية (للمطورين) */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-4">
                <summary className="cursor-pointer font-almarai font-bold text-gray-700 hover:text-gray-900">
                  تفاصيل تقنية (للمطورين)
                </summary>
                <div className="mt-2 p-3 bg-gray-100 rounded-lg text-left">
                  <pre className="text-xs text-gray-600 overflow-auto max-h-32">
                    {this.state.error.stack}
                  </pre>
                  {this.state.errorInfo && (
                    <pre className="text-xs text-gray-600 overflow-auto max-h-32 mt-2">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;