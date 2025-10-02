import { useState, useEffect } from 'react';
import { performanceMonitor, PerformanceMetrics } from '../lib/performance';

export const usePerformance = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const updateMetrics = () => {
      const currentMetrics = performanceMonitor.getAverageMetrics();
      setMetrics(currentMetrics);
      setIsLoading(false);
    };

    // تحديث فوري
    updateMetrics();

    // تحديث دوري كل 30 ثانية
    const interval = setInterval(updateMetrics, 30000);

    return () => clearInterval(interval);
  }, []);

  const recordError = (error: Error, context?: string) => {
    performanceMonitor.recordError(error, context);
  };

  const getPerformanceReport = () => {
    return performanceMonitor.getPerformanceReport();
  };

  return {
    metrics,
    isLoading,
    recordError,
    getPerformanceReport
  };
};