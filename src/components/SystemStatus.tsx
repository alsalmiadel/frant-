import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  WifiOff, 
  Server, 
  Database, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SystemStatus {
  online: boolean;
  apiStatus: 'healthy' | 'degraded' | 'down';
  databaseStatus: 'healthy' | 'degraded' | 'down';
  lastCheck: Date;
  responseTime: number;
}

const SystemStatus: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus>({
    online: navigator.onLine,
    apiStatus: 'healthy',
    databaseStatus: 'healthy',
    lastCheck: new Date(),
    responseTime: 0
  });
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setStatus(prev => ({ ...prev, online: true }));
      checkSystemHealth();
    };

    const handleOffline = () => {
      setStatus(prev => ({ 
        ...prev, 
        online: false,
        apiStatus: 'down',
        databaseStatus: 'down'
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // فحص دوري للنظام
    const healthCheckInterval = setInterval(checkSystemHealth, 60000); // كل دقيقة

    // فحص أولي
    checkSystemHealth();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(healthCheckInterval);
    };
  }, []);

  const checkSystemHealth = async () => {
    if (!navigator.onLine) return;

    try {
      const startTime = Date.now();
      
      // فحص API
      const API_BASE = import.meta.env.VITE_API_BASE || 'https://smartstartai-backend-production.up.railway.app';
      const apiResponse = await fetch(`${API_BASE}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });

      const responseTime = Date.now() - startTime;
      
      if (apiResponse.ok) {
        const healthData = await apiResponse.json();
        
        setStatus(prev => ({
          ...prev,
          apiStatus: healthData.status === 'healthy' ? 'healthy' : 'degraded',
          databaseStatus: healthData.components?.database ? 'healthy' : 'degraded',
          lastCheck: new Date(),
          responseTime
        }));
      } else {
        setStatus(prev => ({
          ...prev,
          apiStatus: 'degraded',
          databaseStatus: 'degraded',
          lastCheck: new Date(),
          responseTime
        }));
      }
    } catch (error) {
      console.warn('Health check failed:', error);
      setStatus(prev => ({
        ...prev,
        apiStatus: 'down',
        databaseStatus: 'down',
        lastCheck: new Date(),
        responseTime: 0
      }));
    }
  };

  const getStatusColor = (statusType: 'healthy' | 'degraded' | 'down') => {
    switch (statusType) {
      case 'healthy': return 'text-green-600';
      case 'degraded': return 'text-yellow-600';
      case 'down': return 'text-red-600';
    }
  };

  const getStatusIcon = (statusType: 'healthy' | 'degraded' | 'down') => {
    switch (statusType) {
      case 'healthy': return CheckCircle;
      case 'degraded': return AlertTriangle;
      case 'down': return AlertTriangle;
    }
  };

  const getOverallStatus = () => {
    if (!status.online || status.apiStatus === 'down' || status.databaseStatus === 'down') {
      return { status: 'down', color: 'text-red-600', icon: AlertTriangle };
    }
    if (status.apiStatus === 'degraded' || status.databaseStatus === 'degraded') {
      return { status: 'degraded', color: 'text-yellow-600', icon: AlertTriangle };
    }
    return { status: 'healthy', color: 'text-green-600', icon: CheckCircle };
  };

  const overall = getOverallStatus();
  const OverallIcon = overall.icon;

  return (
    <div className="fixed top-4 left-4 z-50">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3"
      >
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors"
          aria-expanded={showDetails}
          aria-label="عرض تفاصيل حالة النظام"
        >
          <OverallIcon className={`h-5 w-5 ${overall.color}`} />
          <span className="font-almarai font-bold text-gray-800 dark:text-gray-200 text-sm">
            حالة النظام
          </span>
        </button>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2"
            >
              {/* حالة الاتصال */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {status.online ? (
                    <Wifi className="h-4 w-4 text-green-600" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-red-600" />
                  )}
                  <span className="font-almarai text-sm text-gray-700 dark:text-gray-300">الاتصال</span>
                </div>
                <span className={`text-sm font-bold ${status.online ? 'text-green-600' : 'text-red-600'}`}>
                  {status.online ? 'متصل' : 'منقطع'}
                </span>
              </div>

              {/* حالة API */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className={`h-4 w-4 ${getStatusColor(status.apiStatus)}`} />
                  <span className="font-almarai text-sm text-gray-700 dark:text-gray-300">الخادم</span>
                </div>
                <span className={`text-sm font-bold ${getStatusColor(status.apiStatus)}`}>
                  {status.apiStatus === 'healthy' ? 'سليم' : 
                   status.apiStatus === 'degraded' ? 'بطيء' : 'معطل'}
                </span>
              </div>

              {/* حالة قاعدة البيانات */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className={`h-4 w-4 ${getStatusColor(status.databaseStatus)}`} />
                  <span className="font-almarai text-sm text-gray-700 dark:text-gray-300">قاعدة البيانات</span>
                </div>
                <span className={`text-sm font-bold ${getStatusColor(status.databaseStatus)}`}>
                  {status.databaseStatus === 'healthy' ? 'سليم' : 
                   status.databaseStatus === 'degraded' ? 'بطيء' : 'معطل'}
                </span>
              </div>

              {/* وقت الاستجابة */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-600" />
                  <span className="font-almarai text-sm text-gray-700 dark:text-gray-300">وقت الاستجابة</span>
                </div>
                <span className="text-sm font-bold text-blue-600">
                  {status.responseTime}ms
                </span>
              </div>

              {/* آخر فحص */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="font-almarai text-sm text-gray-700 dark:text-gray-300">آخر فحص</span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {status.lastCheck.toLocaleTimeString('ar-SA')}
                </span>
              </div>

              {/* زر إعادة الفحص */}
              <button
                onClick={checkSystemHealth}
                className="w-full bg-saudi-green text-white py-2 rounded-lg font-almarai text-sm hover:bg-saudi-green/90 transition-colors"
              >
                إعادة فحص النظام
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SystemStatus;