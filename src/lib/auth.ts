import { supabase } from './supabase';
import { SecurityUtils, loginRateLimiter } from '../utils/security';
import toast from 'react-hot-toast';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  city?: string;
  subscription_type: 'free' | 'growth' | 'enterprise';
  avatar_url?: string;
  email_verified: boolean;
  phone_verified: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
  login_count: number;
  auth_provider?: 'email' | 'google' | 'apple';
  preferences: {
    language: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
      marketing: boolean;
    };
    privacy: {
      profile_visibility: 'public' | 'private';
      data_sharing: boolean;
      analytics: boolean;
    };
  };
}

export interface AuthSession {
  user: AuthUser;
  access_token: string;
  refresh_token: string;
  expires_at: number;
  token_type: string;
}

export class AuthService {
  private static instance: AuthService;
  private currentSession: AuthSession | null = null;
  private sessionCheckInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.initializeSessionMonitoring();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async signInWithGoogle(): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    try {
      // التحقق من إعدادات Supabase
      if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://demo.supabase.co') {
        return { success: false, error: 'يرجى إعداد Supabase أولاً للتسجيل عبر Google' };
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      if (error) {
        this.logSecurityEvent('google_signin_failed', undefined, { error: error.message });
        return { success: false, error: this.getLocalizedAuthError(error.message) };
      }

      this.logSecurityEvent('google_signin_initiated');
      return { success: true };
    } catch (error: any) {
      console.error('Google sign in error:', error);
      return { success: false, error: 'خطأ في تسجيل الدخول عبر Google' };
    }
  }

  async signInWithApple(): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    try {
      // التحقق من إعدادات Supabase
      if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://demo.supabase.co') {
        return { success: false, error: 'يرجى إعداد Supabase أولاً للتسجيل عبر Apple' };
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      if (error) {
        this.logSecurityEvent('apple_signin_failed', undefined, { error: error.message });
        return { success: false, error: this.getLocalizedAuthError(error.message) };
      }

      this.logSecurityEvent('apple_signin_initiated');
      return { success: true };
    } catch (error: any) {
      console.error('Apple sign in error:', error);
      return { success: false, error: 'خطأ في تسجيل الدخول عبر Apple' };
    }
  }

  async handleOAuthCallback(): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (session?.user) {
        // التحقق من وجود ملف المستخدم
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (!existingUser) {
          // إنشاء ملف مستخدم جديد للمستخدمين الجدد من OAuth
          const { error: profileError } = await supabase
            .from('users')
            .insert([{
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'مستخدم جديد',
              phone: session.user.user_metadata?.phone || '',
              city: 'الرياض',
              subscription_type: 'free',
              email_verified: session.user.email_confirmed_at ? true : false,
              phone_verified: false,
              login_count: 1,
              auth_provider: session.user.app_metadata?.provider || 'email',
              avatar_url: session.user.user_metadata?.avatar_url,
              preferences: {
                language: 'ar',
                notifications: {
                  email: true,
                  sms: false,
                  push: true,
                  marketing: false
                },
                privacy: {
                  profile_visibility: 'private',
                  data_sharing: false,
                  analytics: true
                }
              }
            }]);

          if (profileError) {
            console.error('Profile creation error:', profileError);
            return { success: false, error: 'خطأ في إنشاء الملف الشخصي' };
          }
        }

        // تحديث إحصائيات تسجيل الدخول
        await this.updateLoginStats(session.user.id);
        
        // جلب بيانات المستخدم الكاملة
        const userProfile = await this.fetchUserProfile(session.user.id);
        
        this.logSecurityEvent('oauth_signin_success', session.user.id, {
          provider: session.user.app_metadata?.provider
        });
        
        return { success: true, user: userProfile };
      }

      return { success: false, error: 'فشل في تسجيل الدخول' };
    } catch (error: any) {
      console.error('OAuth callback error:', error);
      return { success: false, error: 'خطأ في معالجة تسجيل الدخول' };
    }
  }
  private initializeSessionMonitoring() {
    // مراقبة انتهاء صلاحية الجلسة
    this.sessionCheckInterval = setInterval(async () => {
      if (this.currentSession) {
        const now = Date.now();
        const expiresAt = this.currentSession.expires_at * 1000;
        
        // تجديد الجلسة قبل انتهاء صلاحيتها بـ 5 دقائق
        if (expiresAt - now < 5 * 60 * 1000 && expiresAt > now) {
          await this.refreshSession();
        }
      }
    }, 60000); // فحص كل دقيقة
  }

  async signUp(email: string, password: string, userData: {
    name: string;
    phone: string;
    city: string;
  }): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    try {
      // التحقق من Rate Limiting
      if (!loginRateLimiter.isAllowed(email)) {
        const remainingTime = Math.ceil((loginRateLimiter.getResetTime(email) - Date.now()) / 60000);
        return {
          success: false,
          error: `تم تجاوز عدد المحاولات المسموح. حاول مرة أخرى خلال ${remainingTime} دقيقة`
        };
      }

      // التحقق من صحة البيانات
      const validationResult = this.validateSignUpData(email, password, userData);
      if (!validationResult.isValid) {
        return { success: false, error: validationResult.error };
      }

      // تنظيف البيانات
      const sanitizedData = {
        name: SecurityUtils.sanitizeInput(userData.name),
        phone: userData.phone.replace(/\D/g, ''),
        city: userData.city
      };

      // التسجيل مع Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: {
            name: sanitizedData.name,
            phone: sanitizedData.phone,
            city: sanitizedData.city
          }
        }
      });

      if (authError) {
        this.logSecurityEvent('signup_failed', { email, error: authError.message });
        return { success: false, error: this.getLocalizedAuthError(authError.message) };
      }

      if (authData.user) {
        // إنشاء ملف المستخدم في قاعدة البيانات
        const { error: profileError } = await supabase
          .from('users')
          .insert([{
            id: authData.user.id,
            email: email.toLowerCase().trim(),
            name: sanitizedData.name,
            phone: sanitizedData.phone,
            city: sanitizedData.city,
            subscription_type: 'free',
            email_verified: false,
            phone_verified: false,
            login_count: 0,
            auth_provider: 'email',
            preferences: {
              language: 'ar',
              notifications: {
                email: true,
                sms: false,
                push: true,
                marketing: false
              },
              privacy: {
                profile_visibility: 'private',
                data_sharing: false,
                analytics: true
              }
            }
          }]);

        if (profileError) {
          console.error('Profile creation error:', profileError);
          return { success: false, error: 'خطأ في إنشاء الملف الشخصي' };
        }

        this.logSecurityEvent('user_registered', authData.user.id);
        return { success: true };
      }

      return { success: false, error: 'فشل في إنشاء الحساب' };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message || 'حدث خطأ غير متوقع' };
    }
  }

  async signIn(email: string, password: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    try {
      // التحقق من Rate Limiting
      if (!loginRateLimiter.isAllowed(email)) {
        const remainingTime = Math.ceil((loginRateLimiter.getResetTime(email) - Date.now()) / 60000);
        this.logSecurityEvent('rate_limit_exceeded', { email });
        return {
          success: false,
          error: `تم تجاوز عدد المحاولات المسموح. حاول مرة أخرى خلال ${remainingTime} دقيقة`
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (error) {
        this.logSecurityEvent('login_failed', { email, error: error.message });
        return { success: false, error: this.getLocalizedAuthError(error.message) };
      }

      if (data.user) {
        // تحديث إحصائيات تسجيل الدخول
        await this.updateLoginStats(data.user.id);
        
        // جلب بيانات المستخدم الكاملة
        const userProfile = await this.fetchUserProfile(data.user.id);
        
        this.logSecurityEvent('user_signed_in', data.user.id);
        return { success: true, user: userProfile };
      }

      return { success: false, error: 'فشل في تسجيل الدخول' };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message || 'خطأ في تسجيل الدخول' };
    }
  }

  async signOut(): Promise<void> {
    try {
      const userId = this.currentSession?.user?.id;
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      this.currentSession = null;
      
      // تنظيف البيانات الحساسة
      SecurityUtils.clearSensitiveData(window);
      this.clearLocalStorage();
      
      this.logSecurityEvent('user_signed_out', userId);
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  async refreshSession(): Promise<{ success: boolean; session?: AuthSession }> {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      if (data.session) {
        const userProfile = await this.fetchUserProfile(data.session.user.id);
        this.currentSession = {
          user: userProfile,
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at || 0,
          token_type: data.session.token_type || 'bearer'
        };
        
        this.logSecurityEvent('session_refreshed', data.session.user.id);
        return { success: true, session: this.currentSession };
      }
      
      return { success: false };
    } catch (error) {
      console.error('Session refresh error:', error);
      await this.signOut();
      return { success: false };
    }
  }

  async updateProfile(updates: Partial<AuthUser>): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    try {
      if (!this.currentSession?.user) {
        return { success: false, error: 'لم يتم تسجيل الدخول' };
      }

      // تنظيف البيانات
      const sanitizedUpdates = {
        ...updates,
        name: updates.name ? SecurityUtils.sanitizeInput(updates.name) : undefined,
        phone: updates.phone ? updates.phone.replace(/\D/g, '') : undefined,
        updated_at: new Date().toISOString()
      };

      // التحقق من صحة البيانات
      if (sanitizedUpdates.phone && !SecurityUtils.validateSaudiPhone(sanitizedUpdates.phone)) {
        return { success: false, error: 'رقم جوال سعودي غير صحيح' };
      }

      const { data, error } = await supabase
        .from('users')
        .update(sanitizedUpdates)
        .eq('id', this.currentSession.user.id)
        .select()
        .single();

      if (error) throw error;

      // تحديث الجلسة المحلية
      this.currentSession.user = { ...this.currentSession.user, ...data };
      
      this.logSecurityEvent('profile_updated', this.currentSession.user.id);
      return { success: true, user: this.currentSession.user };
    } catch (error: any) {
      console.error('Update profile error:', error);
      return { success: false, error: 'خطأ في تحديث الملف الشخصي' };
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      // التحقق من قوة كلمة المرور الجديدة
      const passwordValidation = SecurityUtils.validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        return {
          success: false,
          error: `كلمة المرور الجديدة ضعيفة: ${passwordValidation.feedback.join(', ')}`
        };
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      this.logSecurityEvent('password_changed', this.currentSession?.user?.id);
      return { success: true };
    } catch (error: any) {
      console.error('Change password error:', error);
      return { success: false, error: 'خطأ في تغيير كلمة المرور' };
    }
  }

  async deleteAccount(): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.currentSession?.user) {
        return { success: false, error: 'لم يتم تسجيل الدخول' };
      }

      const userId = this.currentSession.user.id;

      // حذف بيانات المستخدم من الجداول المخصصة
      const { error: deleteUserError } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (deleteUserError) throw deleteUserError;

      this.logSecurityEvent('account_deleted', userId);
      
      // تنظيف البيانات المحلية
      await this.signOut();
      
      return { success: true };
    } catch (error: any) {
      console.error('Delete account error:', error);
      return { success: false, error: 'خطأ في حذف الحساب' };
    }
  }

  private async fetchUserProfile(userId: string): Promise<AuthUser> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  private async updateLoginStats(userId: string): Promise<void> {
    try {
      await supabase
        .from('users')
        .update({
          last_login: new Date().toISOString(),
          login_count: supabase.sql`login_count + 1`
        })
        .eq('id', userId);
    } catch (error) {
      console.warn('Failed to update login stats:', error);
    }
  }

  private validateSignUpData(email: string, password: string, userData: any): { isValid: boolean; error?: string } {
    if (!SecurityUtils.validateEmail(email)) {
      return { isValid: false, error: 'بريد إلكتروني غير صحيح' };
    }

    const passwordValidation = SecurityUtils.validatePassword(password);
    if (!passwordValidation.isValid) {
      return { isValid: false, error: `كلمة المرور ضعيفة: ${passwordValidation.feedback.join(', ')}` };
    }

    if (!SecurityUtils.validateSaudiPhone(userData.phone)) {
      return { isValid: false, error: 'رقم جوال سعودي غير صحيح' };
    }

    if (!userData.name || userData.name.trim().length < 2) {
      return { isValid: false, error: 'الاسم يجب أن يكون حرفين على الأقل' };
    }

    return { isValid: true };
  }

  private getLocalizedAuthError(errorMessage: string): string {
    const errorMap: Record<string, string> = {
      'Invalid login credentials': 'بيانات تسجيل الدخول غير صحيحة',
      'Email already registered': 'هذا البريد الإلكتروني مسجل مسبقاً',
      'Password should be at least 6 characters': 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
      'Invalid email': 'بريد إلكتروني غير صحيح',
      'Signup requires a valid password': 'كلمة المرور مطلوبة',
      'User not found': 'المستخدم غير موجود',
      'Invalid password': 'كلمة المرور غير صحيحة'
    };

    return errorMap[errorMessage] || errorMessage;
  }

  private async logSecurityEvent(event: string, userId?: string, details?: any): Promise<void> {
    try {
      await supabase
        .from('audit_logs')
        .insert([{
          user_id: userId || null,
          action: event,
          table_name: 'auth_events',
          new_data: {
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
            ip_address: 'client',
            event_type: event,
            details: details || {}
          }
        }]);
    } catch (error) {
      console.warn('Failed to log security event:', error);
    }
  }

  private clearLocalStorage(): void {
    const keysToKeep = ['theme', 'language'];
    const allKeys = Object.keys(localStorage);
    
    allKeys.forEach(key => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    
    sessionStorage.clear();
  }

  getCurrentSession(): AuthSession | null {
    return this.currentSession;
  }

  getCurrentUser(): AuthUser | null {
    return this.currentSession?.user || null;
  }

  isAuthenticated(): boolean {
    return !!this.currentSession?.user;
  }

  destroy(): void {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
    }
    this.currentSession = null;
  }
}

export const authService = AuthService.getInstance();