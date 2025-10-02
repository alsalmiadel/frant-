import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { SecurityUtils, apiRateLimiter } from '../utils/security';

export interface VoiceChatRequest {
  audioFile: File;
  sessionId?: string;
}

export interface TextChatRequest {
  message: string;
  sessionId?: string;
  context?: any;
}

export interface BusinessPlanRequest {
  projectName: string;
  industry: string;
  description: string;
  location: string;
  targetMarket: string;
  initialInvestment: number;
  fixedCosts: number;
  variableCosts: number;
  revenueProjections: number[];
  marketSize: number;
  marketGrowthRate: number;
  targetMarketShare: number;
  teamSize: number;
  competitiveAdvantages: string[];
  riskFactors: string[];
  fundingRequirements: number;
}

class APIService {
  private baseURL = import.meta.env.VITE_API_BASE || 'https://smartstartai-backend-production.up.railway.app';
  private requestQueue: Map<string, Promise<any>> = new Map();

  private async makeRequest(url: string, options: RequestInit = {}) {
    // التحقق من Rate Limiting
    const clientId = await this.getClientId();
    if (!apiRateLimiter.isAllowed(clientId)) {
      throw new Error('تم تجاوز الحد المسموح من الطلبات. يرجى المحاولة لاحقاً.');
    }

    // إضافة headers الأمان
    const headers = {
      'Content-Type': 'application/json',
      'X-Client-Version': '1.0.0',
      'X-Request-ID': SecurityUtils.generateSessionToken(),
      ...options.headers
    };

    // إضافة token المصادقة
    const authToken = await this.getAuthToken();
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${this.baseURL}${url}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  private async getClientId(): Promise<string> {
    // استخدام معرف فريد للعميل للـ rate limiting
    let clientId = localStorage.getItem('client_id');
    if (!clientId) {
      clientId = SecurityUtils.generateSessionToken();
      localStorage.setItem('client_id', clientId);
    }
    return clientId;
  }

  async voiceChat(request: VoiceChatRequest) {
    try {
      // التحقق من حجم الملف
      if (request.audioFile.size > 10 * 1024 * 1024) { // 10MB
        throw new Error('حجم الملف الصوتي كبير جداً');
      }

      // التحقق من نوع الملف
      const allowedTypes = ['audio/webm', 'audio/webm;codecs=opus', 'audio/wav', 'audio/mp3', 'audio/m4a'];
      if (!allowedTypes.includes(request.audioFile.type)) {
        throw new Error('نوع الملف الصوتي غير مدعوم');
      }

      // إرسال الملف الصوتي إلى Netlify Functions
      const formData = new FormData();
      formData.append('audioFile', request.audioFile);
      if (request.sessionId) {
        formData.append('session_id', request.sessionId);
      }

      const authToken = await this.getAuthToken();
      const headers: Record<string, string> = {
        'X-Client-Version': '1.0.0',
        'X-Request-ID': SecurityUtils.generateSessionToken(),
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response = await fetch(`${this.baseURL}/stt`, {
        method: 'POST',
        headers,
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // تسجيل النشاط
      this.logActivity('voice_chat', { sessionId: request.sessionId });
      
      return {
        success: true,
        user_text: result.text || '',
        assistant_text: 'تم تحويل الصوت بنجاح',
        session_id: request.sessionId || 'default',
        model_used: 'whisper',
        processing_time: 0
      };
    } catch (error) {
      console.error('Voice chat error:', error);
      toast.error('خطأ في المحادثة الصوتية');
      throw error;
    }
  }

  async textChat(request: TextChatRequest) {
    try {
      // تنظيف النص من المحتوى الضار
      const sanitizedMessage = SecurityUtils.sanitizeInput(request.message);
      
      // إرسال الرسالة إلى Netlify Functions
      const response = await fetch(`${this.baseURL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Version': '1.0.0',
        },
        body: JSON.stringify({
          text: sanitizedMessage
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      
      const result = {
        success: true,
        response: responseData.text || 'عذراً، لم أتمكن من فهم طلبك',
        session_id: request.sessionId || 'default',
        model_used: 'hoor',
        processing_time: 0
      };

      // تسجيل النشاط
      this.logActivity('text_chat', { sessionId: request.sessionId });
      
      return result;
    } catch (error) {
      console.error('Text chat error:', error);
      toast.error('خطأ في المحادثة النصية');
      throw error;
    }
  }

  async generateBusinessPlan(request: BusinessPlanRequest) {
    try {
      // التحقق من صحة البيانات
      this.validateBusinessPlanRequest(request);

      // استخدام العقل المركزي الجديد
      const response = await fetch('/api/brain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: `أريد دراسة جدوى لمشروع ${request.projectName} في قطاع ${request.industry}`,
          context: {
            sector: request.industry,
            city: request.location,
            capex: request.initialInvestment,
            price_avg: request.revenueProjections[0] / 12 / (request.initialInvestment * 0.1), // تقدير
            customers_month: Math.round(request.revenueProjections[0] / 12 / 50), // تقدير
            cogs_ratio: request.variableCosts / request.revenueProjections[0],
            opex_monthly: request.fixedCosts / 12,
            months: 60,
            projectName: request.projectName
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // تسجيل النشاط
      this.logActivity('business_plan_generated', { projectName: request.projectName });
      
      return {
        success: true,
        plan_id: `plan_${Date.now()}`,
        files: result.files,
        generated_at: result.timestamp,
        summary: result.summary,
        analysis: result.analysis,
        financials: result.financials,
        bankability: result.bankability
      };
    } catch (error) {
      console.error('Business plan generation error:', error);
      toast.error('خطأ في إنتاج دراسة الجدوى');
      throw error;
    }
  }

  private validateBusinessPlanRequest(request: BusinessPlanRequest) {
    const errors: string[] = [];

    if (!request.projectName || request.projectName.trim().length < 3) {
      errors.push('اسم المشروع يجب أن يكون 3 أحرف على الأقل');
    }

    if (!request.industry) {
      errors.push('نوع المشروع مطلوب');
    }

    if (!request.description || request.description.trim().length < 10) {
      errors.push('وصف المشروع يجب أن يكون 10 أحرف على الأقل');
    }

    if (request.initialInvestment < 10000) {
      errors.push('الاستثمار المبدئي يجب أن يكون 10,000 ريال على الأقل');
    }

    if (request.initialInvestment > 100000000) {
      errors.push('الاستثمار المبدئي كبير جداً');
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
  }

  async downloadFile(planId: string, fileType: string) {
    try {
      const response = await fetch(`${this.baseURL}/download/${planId}/${fileType}`, {
        headers: {
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${planId}_${fileType}.${fileType === 'excel' ? 'xlsx' : 'pdf'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('تم تحميل الملف بنجاح');
      
      // تسجيل النشاط
      this.logActivity('file_downloaded', { planId, fileType });
      
    } catch (error) {
      console.error('Download error:', error);
      toast.error('خطأ في تحميل الملف');
      throw error;
    }
  }

  async getStats() {
    try {
      const response = await fetch(`${this.baseURL}/stats`);
      return await response.json();
    } catch (error) {
      console.error('Stats error:', error);
      return null;
    }
  }

  async getModelsStatus() {
    try {
      const response = await fetch(`${this.baseURL}/models/status`);
      return await response.json();
    } catch (error) {
      console.error('Models status error:', error);
      return null;
    }
  }

  private async getAuthToken(): Promise<string> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || '';
  }

  // Project management مع تحسينات أمنية
  async saveProject(projectData: any) {
    try {
      // تنظيف البيانات
      const sanitizedData = {
        ...projectData,
        title: SecurityUtils.sanitizeInput(projectData.title),
        description: SecurityUtils.sanitizeInput(projectData.description)
      };

      const { data, error } = await supabase
        .from('projects')
        .insert([sanitizedData])
        .select()
        .single();

      if (error) throw error;
      
      toast.success('تم حفظ المشروع بنجاح');
      
      // تسجيل النشاط
      this.logActivity('project_saved', { projectId: data.id });
      
      return data;
    } catch (error) {
      console.error('Save project error:', error);
      toast.error('خطأ في حفظ المشروع');
      throw error;
    }
  }

  async getUserProjects(userId: string) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get projects error:', error);
      return [];
    }
  }

  async updateProject(projectId: string, updates: any) {
    try {
      // تنظيف البيانات
      const sanitizedUpdates = {
        ...updates,
        title: updates.title ? SecurityUtils.sanitizeInput(updates.title) : undefined,
        description: updates.description ? SecurityUtils.sanitizeInput(updates.description) : undefined,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('projects')
        .update(sanitizedUpdates)
        .eq('id', projectId)
        .select()
        .single();

      if (error) throw error;
      
      toast.success('تم تحديث المشروع بنجاح');
      
      // تسجيل النشاط
      this.logActivity('project_updated', { projectId });
      
      return data;
    } catch (error) {
      console.error('Update project error:', error);
      toast.error('خطأ في تحديث المشروع');
      throw error;
    }
  }

  async deleteProject(projectId: string) {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
      
      toast.success('تم حذف المشروع بنجاح');
      
      // تسجيل النشاط
      this.logActivity('project_deleted', { projectId });
      
    } catch (error) {
      console.error('Delete project error:', error);
      toast.error('خطأ في حذف المشروع');
      throw error;
    }
  }

  // تسجيل الأنشطة للمراقبة
  private async logActivity(action: string, details: any) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase
          .from('audit_logs')
          .insert([{
            user_id: user.id,
            action,
            table_name: 'user_activity',
            new_data: {
              ...details,
              timestamp: new Date().toISOString(),
              user_agent: navigator.userAgent
            }
          }]);
      }
    } catch (error) {
      // فشل تسجيل النشاط لا يجب أن يؤثر على العملية الأساسية
      console.warn('Failed to log activity:', error);
    }
  }

  // إدارة الجلسات الآمنة
  async refreshSession() {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      return data.session;
    } catch (error) {
      console.error('Session refresh error:', error);
      return null;
    }
  }

  // تنظيف البيانات الحساسة
  clearSensitiveData() {
    // مسح البيانات الحساسة من الذاكرة
    SecurityUtils.clearSensitiveData(this);
    
    // مسح التخزين المحلي للبيانات الحساسة
    const sensitiveKeys = ['auth_token', 'session_data', 'user_cache'];
    sensitiveKeys.forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  }

  // مراقبة صحة الاتصال
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(3000) // 3 second timeout
      });
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'unhealthy' };
    }
  }

  // إدارة الأخطاء المتقدمة
  private handleError(error: any, context: string) {
    // تسجيل الخطأ مع السياق
    console.error(`API Error in ${context}:`, error);
    
    // إرسال تقرير خطأ (في الإنتاج)
    if (import.meta.env.PROD) {
      this.reportError(error, context);
    }
    
    // عرض رسالة خطأ مناسبة للمستخدم
    if (error.message.includes('network')) {
      toast.error('مشكلة في الاتصال بالإنترنت');
    } else if (error.message.includes('unauthorized')) {
      toast.error('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى');
    } else {
      toast.error('حدث خطأ غير متوقع');
    }
  }

  private async reportError(error: any, context: string) {
    try {
      // إرسال تقرير الخطأ للخادم للمراقبة
      await this.makeRequest('/errors/report', {
        method: 'POST',
        body: JSON.stringify({
          error: error.message,
          context,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      });
    } catch (reportError) {
      console.warn('Failed to report error:', reportError);
    }
  }
}

export const apiService = new APIService();

// تنظيف البيانات عند إغلاق النافذة
window.addEventListener('beforeunload', () => {
  apiService.clearSensitiveData();
});