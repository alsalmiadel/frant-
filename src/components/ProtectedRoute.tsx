import React from 'react';
import { useAuth } from '../hooks/useAuth';
import LoadingScreen from './LoadingScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, fallback }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen message="جاري التحقق من الهوية..." />;
  }

  if (!user) {
    return fallback || (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-light-green flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-saudi-green/10 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">🔒</span>
          </div>
          <h2 className="text-xl font-almarai font-bold text-gray-800 mb-2">
            تسجيل الدخول مطلوب
          </h2>
          <p className="text-gray-600 font-almarai mb-6">
            يجب تسجيل الدخول للوصول لهذه الصفحة
          </p>
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.hash = 'home';
              }
            }}
            className="bg-gradient-to-r from-saudi-green to-saudi-gold text-white px-6 py-3 rounded-xl font-almarai font-bold"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;