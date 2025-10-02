import { supabase } from './supabase';
import { SecurityUtils } from '../utils/security';
import { Project, Analysis } from '../types';

export interface DatabaseError {
  code: string;
  message: string;
  details?: any;
}

export class DatabaseService {
  private static instance: DatabaseService;

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // ==================== Projects ====================
  async createProject(projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; data?: Project; error?: string }> {
    try {
      // تنظيف البيانات
      const sanitizedData = {
        ...projectData,
        title: SecurityUtils.sanitizeInput(projectData.title),
        description: SecurityUtils.sanitizeInput(projectData.description),
        data: this.sanitizeJsonData(projectData.data)
      };

      const { data, error } = await supabase
        .from('projects')
        .insert([sanitizedData])
        .select()
        .single();

      if (error) {
        console.error('Create project error:', error);
        return { success: false, error: this.getLocalizedDatabaseError(error) };
      }

      return { success: true, data };
    } catch (error: any) {
      console.error('Create project error:', error);
      return { success: false, error: 'خطأ في إنشاء المشروع' };
    }
  }

  async getUserProjects(userId: string, filters?: {
    status?: string;
    type?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ success: boolean; data?: Project[]; error?: string; total?: number }> {
    try {
      let query = supabase
        .from('projects')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, (filters.offset + (filters.limit || 10)) - 1);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error('Get projects error:', error);
        return { success: false, error: this.getLocalizedDatabaseError(error) };
      }

      return { success: true, data: data || [], total: count || 0 };
    } catch (error: any) {
      console.error('Get projects error:', error);
      return { success: false, error: 'خطأ في جلب المشاريع' };
    }
  }

  async updateProject(projectId: string, updates: Partial<Project>): Promise<{ success: boolean; data?: Project; error?: string }> {
    try {
      const sanitizedUpdates = {
        ...updates,
        title: updates.title ? SecurityUtils.sanitizeInput(updates.title) : undefined,
        description: updates.description ? SecurityUtils.sanitizeInput(updates.description) : undefined,
        data: updates.data ? this.sanitizeJsonData(updates.data) : undefined,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('projects')
        .update(sanitizedUpdates)
        .eq('id', projectId)
        .select()
        .single();

      if (error) {
        console.error('Update project error:', error);
        return { success: false, error: this.getLocalizedDatabaseError(error) };
      }

      return { success: true, data };
    } catch (error: any) {
      console.error('Update project error:', error);
      return { success: false, error: 'خطأ في تحديث المشروع' };
    }
  }

  async deleteProject(projectId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) {
        console.error('Delete project error:', error);
        return { success: false, error: this.getLocalizedDatabaseError(error) };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Delete project error:', error);
      return { success: false, error: 'خطأ في حذف المشروع' };
    }
  }

  async bulkDeleteProjects(projectIds: string[]): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .in('id', projectIds);

      if (error) {
        console.error('Bulk delete projects error:', error);
        return { success: false, error: this.getLocalizedDatabaseError(error) };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Bulk delete projects error:', error);
      return { success: false, error: 'خطأ في حذف المشاريع' };
    }
  }

  // ==================== Analyses ====================
  async createAnalysis(analysisData: Omit<Analysis, 'id' | 'created_at'>): Promise<{ success: boolean; data?: Analysis; error?: string }> {
    try {
      const sanitizedData = {
        ...analysisData,
        feasibility: this.sanitizeJsonData(analysisData.feasibility),
        marketing: this.sanitizeJsonData(analysisData.marketing),
        financial: this.sanitizeJsonData(analysisData.financial),
        esg: this.sanitizeJsonData(analysisData.esg),
        code: analysisData.code ? SecurityUtils.sanitizeInput(analysisData.code) : undefined
      };

      const { data, error } = await supabase
        .from('analyses')
        .insert([sanitizedData])
        .select()
        .single();

      if (error) {
        console.error('Create analysis error:', error);
        return { success: false, error: this.getLocalizedDatabaseError(error) };
      }

      return { success: true, data };
    } catch (error: any) {
      console.error('Create analysis error:', error);
      return { success: false, error: 'خطأ في إنشاء التحليل' };
    }
  }

  async getProjectAnalyses(projectId: string): Promise<{ success: boolean; data?: Analysis[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Get analyses error:', error);
        return { success: false, error: this.getLocalizedDatabaseError(error) };
      }

      return { success: true, data: data || [] };
    } catch (error: any) {
      console.error('Get analyses error:', error);
      return { success: false, error: 'خطأ في جلب التحليلات' };
    }
  }

  // ==================== Search & Analytics ====================
  async searchProjects(userId: string, query: string, filters?: {
    type?: string;
    status?: string;
    city?: string;
  }): Promise<{ success: boolean; data?: Project[]; error?: string }> {
    try {
      const sanitizedQuery = SecurityUtils.sanitizeInput(query);
      
      let dbQuery = supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .or(`title.ilike.%${sanitizedQuery}%,description.ilike.%${sanitizedQuery}%`);

      if (filters?.type) {
        dbQuery = dbQuery.eq('type', filters.type);
      }

      if (filters?.status) {
        dbQuery = dbQuery.eq('status', filters.status);
      }

      if (filters?.city) {
        dbQuery = dbQuery.eq('city', filters.city);
      }

      const { data, error } = await dbQuery
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Search projects error:', error);
        return { success: false, error: this.getLocalizedDatabaseError(error) };
      }

      return { success: true, data: data || [] };
    } catch (error: any) {
      console.error('Search projects error:', error);
      return { success: false, error: 'خطأ في البحث' };
    }
  }

  async getUserAnalytics(userId: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      // إحصائيات المشاريع
      const { data: projectStats, error: projectError } = await supabase
        .from('projects')
        .select('status, type, created_at')
        .eq('user_id', userId);

      if (projectError) throw projectError;

      // إحصائيات التحليلات
      const { data: analysisStats, error: analysisError } = await supabase
        .from('analyses')
        .select('created_at')
        .eq('user_id', userId);

      if (analysisError) throw analysisError;

      // حساب الإحصائيات
      const analytics = {
        projects: {
          total: projectStats?.length || 0,
          completed: projectStats?.filter(p => p.status === 'completed').length || 0,
          analyzing: projectStats?.filter(p => p.status === 'analyzing').length || 0,
          saved: projectStats?.filter(p => p.status === 'saved').length || 0,
          by_type: this.groupBy(projectStats || [], 'type'),
          monthly_trend: this.getMonthlyTrend(projectStats || [])
        },
        analyses: {
          total: analysisStats?.length || 0,
          monthly_trend: this.getMonthlyTrend(analysisStats || [])
        },
        activity: {
          last_project: projectStats?.[0]?.created_at,
          last_analysis: analysisStats?.[0]?.created_at
        }
      };

      return { success: true, data: analytics };
    } catch (error: any) {
      console.error('Get analytics error:', error);
      return { success: false, error: 'خطأ في جلب الإحصائيات' };
    }
  }

  // ==================== Utility Methods ====================
  private sanitizeJsonData(data: any): any {
    if (typeof data === 'string') {
      return SecurityUtils.sanitizeInput(data);
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeJsonData(item));
    }
    
    if (typeof data === 'object' && data !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        sanitized[SecurityUtils.sanitizeInput(key)] = this.sanitizeJsonData(value);
      }
      return sanitized;
    }
    
    return data;
  }

  private getLocalizedDatabaseError(error: any): string {
    const errorMap: Record<string, string> = {
      '23505': 'البيانات موجودة مسبقاً',
      '23503': 'مرجع غير صحيح',
      '42501': 'ليس لديك صلاحية لهذا الإجراء',
      'PGRST116': 'لم يتم العثور على البيانات'
    };

    return errorMap[error.code] || error.message || 'خطأ في قاعدة البيانات';
  }

  private groupBy(array: any[], key: string): Record<string, number> {
    return array.reduce((result, item) => {
      const group = item[key] || 'غير محدد';
      result[group] = (result[group] || 0) + 1;
      return result;
    }, {});
  }

  private getMonthlyTrend(data: any[]): Array<{ month: string; count: number }> {
    const monthlyData: Record<string, number> = {};
    
    data.forEach(item => {
      const date = new Date(item.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6) // آخر 6 أشهر
      .map(([month, count]) => ({
        month: new Date(month + '-01').toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' }),
        count
      }));
  }
}

export const databaseService = DatabaseService.getInstance();