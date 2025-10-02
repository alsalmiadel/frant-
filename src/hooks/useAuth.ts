import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { AuthUser, authService } from '../lib/auth';
import { SecurityUtils, loginRateLimiter } from '../utils/security';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
  signInWithApple: () => Promise<boolean>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthProvider = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (event === 'SIGNED_IN' && session?.user) {
            await fetchUserProfile(session.user.id);
            logSecurityEvent('user_signed_in', session.user.id);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            logSecurityEvent('user_signed_out');
            // تنظيف البيانات الحساسة
            SecurityUtils.clearSensitiveData(window);
          } else if (event === 'TOKEN_REFRESHED') {
            logSecurityEvent('token_refreshed', session?.user?.id);
          }
        } catch (error) {
          console.error('Auth state change error:', error);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUser(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('خطأ في تحميل بيانات المستخدم');
    }
  };

  const signUp = async (email: string, password: string, userData: any): Promise<boolean> => {
    try {
      setLoading(true);
      const result = await authService.signUp(email, password, userData);
      
      if (result.success) {
        toast.success('تم إنشاء حسابك بنجاح!');
        return true;
      } else {
        toast.error(result.error || 'خطأ في إنشاء الحساب');
        return false;
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(error.message || 'حدث خطأ في إنشاء الحساب');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const result = await authService.signIn(email, password);
      
      if (result.success) {
        toast.success('تم تسجيل الدخول بنجاح!');
        return true;
      } else {
        toast.error(result.error || 'خطأ في تسجيل الدخول');
        return false;
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'خطأ في تسجيل الدخول');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async (): Promise<boolean> => {
    try {
      setLoading(true);
      const result = await authService.signInWithGoogle();
      
      if (result.success) {
        toast.success('جاري تسجيل الدخول عبر Google...');
        return true;
      } else {
        toast.error(result.error || 'خطأ في تسجيل الدخول عبر Google');
        return false;
      }
    } catch (error: any) {
      console.error('Google sign in error:', error);
      toast.error(error.message || 'خطأ في تسجيل الدخول عبر Google');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signInWithApple = async (): Promise<boolean> => {
    try {
      setLoading(true);
      const result = await authService.signInWithApple();
      
      if (result.success) {
        toast.success('جاري تسجيل الدخول عبر Apple...');
        return true;
      } else {
        toast.error(result.error || 'خطأ في تسجيل الدخول عبر Apple');
        return false;
      }
    } catch (error: any) {
      console.error('Apple sign in error:', error);
      toast.error(error.message || 'خطأ في تسجيل الدخول عبر Apple');
      return false;
    } finally {
      setLoading(false);
    }
  };
  const signOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      toast.success('تم تسجيل الخروج بنجاح');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error('خطأ في تسجيل الخروج');
    }
  };

  const updateProfile = async (data: Partial<AuthUser>): Promise<boolean> => {
    try {
      const result = await authService.updateProfile(data);
      
      if (result.success && result.user) {
        setUser(result.user);
        toast.success('تم تحديث الملف الشخصي');
        return true;
      } else {
        toast.error(result.error || 'خطأ في تحديث الملف الشخصي');
        return false;
      }
    } catch (error: any) {
      console.error('Update profile error:', error);
      toast.error('خطأ في تحديث الملف الشخصي');
      return false;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const result = await authService.changePassword(currentPassword, newPassword);
      
      if (result.success) {
        toast.success('تم تغيير كلمة المرور بنجاح');
        return true;
      } else {
        toast.error(result.error || 'خطأ في تغيير كلمة المرور');
        return false;
      }
    } catch (error: any) {
      console.error('Change password error:', error);
      toast.error('خطأ في تغيير كلمة المرور');
      return false;
    }
  };

  const deleteAccount = async (): Promise<boolean> => {
    try {
      const result = await authService.deleteAccount();
      
      if (result.success) {
        setUser(null);
        toast.success('تم حذف الحساب بنجاح');
        return true;
      } else {
        toast.error(result.error || 'خطأ في حذف الحساب');
        return false;
      }
    } catch (error: any) {
      console.error('Delete account error:', error);
      toast.error('خطأ في حذف الحساب');
      return false;
    }
  };

  const refreshSession = async () => {
    try {
      const result = await authService.refreshSession();
      if (result.success && result.session) {
        setUser(result.session.user);
      }
    } catch (error) {
      console.error('Session refresh error:', error);
      await signOut();
    }
  };

  // تسجيل الأحداث الأمنية
  const logSecurityEvent = async (event: string, userId?: string) => {
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
            event_type: event
          }
        }]);
    } catch (error) {
      console.warn('Failed to log security event:', error);
    }
  };

  // مراقبة انتهاء صلاحية الجلسة
  useEffect(() => {
    const checkSessionExpiry = setInterval(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session && user) {
        const expiresAt = new Date(session.expires_at! * 1000);
        const now = new Date();
        const timeUntilExpiry = expiresAt.getTime() - now.getTime();
        
        // تحديث الجلسة قبل انتهاء صلاحيتها بـ 5 دقائق
        if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
          await refreshSession();
        }
      }
    }, 60000); // فحص كل دقيقة

    return () => clearInterval(checkSessionExpiry);
  }, [user]);

  return {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithApple,
    signOut,
    updateProfile,
    changePassword,
    deleteAccount,
    refreshSession,
  };
};

export { AuthContext };