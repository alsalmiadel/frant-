import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle, TrendingUp, Zap } from 'lucide-react';
import { usePerformance } from '../hooks/usePerformance';
import { motion } from 'framer-motion';

const PerformanceMonitor: React.FC = () => {
  const { metrics, getPerformanceReport } = usePerformance();
  const [showDetails, setShowDetails] = useState(false);
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    if (metrics) {
      setReport(getPerformanceReport());
    }
  }, [metrics, getPerformanceReport]);

  if (!metrics || !report) return null;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return CheckCircle;
    if (score >= 70) return AlertTriangle;
    return AlertTriangle;
  };

  const ScoreIcon = getScoreIcon(report.score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 z-40"
    >
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-saudi-green" />
            <span className="font-almarai font-bold text-gray-800">أداء الموقع</span>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <TrendingUp className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <ScoreIcon className={`h-6 w-6 ${getScoreColor(report.score)}`} />
          <div>
            <div className={`text-2xl font-bold ${getScoreColor(report.score)}`}>
              {report.score}
            </div>
            <div className="text-xs font-almarai text-gray-600">نقاط الأداء</div>
          </div>
        </div>

        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-2 text-xs"
          >
            <div className="flex justify-between">
              <span className="font-almarai text-gray-600">سرعة التحميل:</span>
              <span className="font-bold">{(metrics.loadTime / 1000).toFixed(2)}s</span>
            </div>
            <div className="flex justify-between">
              <span className="font-almarai text-gray-600">استجابة API:</span>
              <span className="font-bold">{(metrics.apiResponseTime / 1000).toFixed(2)}s</span>
            </div>
            <div className="flex justify-between">
              <span className="font-almarai text-gray-600">استخدام الذاكرة:</span>
              <span className="font-bold">{(metrics.memoryUsage * 100).toFixed(1)}%</span>
            </div>
            
            {report.recommendations.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="font-almarai font-bold text-gray-800 mb-2">توصيات:</div>
                {report.recommendations.map((rec: string, index: number) => (
                  <div key={index} className="text-gray-600 font-almarai">
                    • {rec}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default PerformanceMonitor;