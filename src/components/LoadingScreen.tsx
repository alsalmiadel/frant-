import React, { useState, useEffect } from 'react';
import { Brain, Zap, Shield, CheckCircle, Activity, Target, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  message?: string;
  progress?: number;
  showDetails?: boolean;
  type?: 'analysis' | 'auth' | 'general';
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'جاري التحليل...', 
  progress = 0,
  showDetails = false,
  type = 'general'
}) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  const loadingMessages = {
    analysis: [
      'تحليل فكرة مشروعك بالذكاء الاصطناعي...',
      'دراسة السوق المحلي والمنافسين...',
      'حساب التوقعات المالية والربحية...',
      'إنشاء النموذج التشغيلي المتكامل...',
      'مراجعة المتطلبات القانونية والتنظيمية...',
      'تجهيز التقرير النهائي والملفات...'
    ],
    auth: [
      'التحقق من بيانات الاعتماد...',
      'تشفير البيانات الشخصية...',
      'إعداد الجلسة الآمنة...',
      'تحميل الملف الشخصي...'
    ],
    general: [
      'جاري التحميل...',
      'معالجة البيانات...',
      'تحضير المحتوى...',
      'اللمسات الأخيرة...'
    ]
  };

  const processingSteps = {
    analysis: [
      { icon: Brain, title: 'تحليل البيانات', desc: 'معالجة المعلومات بالذكاء الاصطناعي', color: 'text-saudi-green' },
      { icon: BarChart3, title: 'دراسة السوق', desc: 'تحليل المنافسة والفرص المتاحة', color: 'text-saudi-gold' },
      { icon: Target, title: 'النموذج المالي', desc: 'حساب التوقعات والإسقاطات', color: 'text-tech-blue' },
      { icon: CheckCircle, title: 'المراجعة النهائية', desc: 'التأكد من جودة المخرجات', color: 'text-green-600' }
    ],
    auth: [
      { icon: Shield, title: 'التحقق الأمني', desc: 'فحص البيانات وضمان الخصوصية', color: 'text-saudi-green' },
      { icon: Zap, title: 'تشفير البيانات', desc: 'حماية المعلومات الشخصية', color: 'text-saudi-gold' },
      { icon: Activity, title: 'إعداد الجلسة', desc: 'تحضير بيئة العمل الآمنة', color: 'text-tech-blue' },
      { icon: CheckCircle, title: 'اكتمال التسجيل', desc: 'تفعيل الحساب والخدمات', color: 'text-green-600' }
    ],
    general: [
      { icon: Activity, title: 'التحميل', desc: 'جاري تحميل المحتوى', color: 'text-saudi-green' },
      { icon: Zap, title: 'المعالجة', desc: 'تحضير البيانات', color: 'text-saudi-gold' },
      { icon: CheckCircle, title: 'الإكمال', desc: 'اللمسات الأخيرة', color: 'text-tech-blue' }
    ]
  };

  const currentMessages = loadingMessages[type];
  const currentSteps = processingSteps[type];

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % currentMessages.length);
    }, 2000);

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % currentSteps.length);
    }, 3000);

    return () => {
      clearInterval(messageInterval);
      clearInterval(stepInterval);
    };
  }, [currentMessages.length, currentSteps.length]);

  // تحريك شريط التقدم
  useEffect(() => {
    if (progress > animatedProgress) {
      const increment = (progress - animatedProgress) / 20;
      const timer = setInterval(() => {
        setAnimatedProgress(prev => {
          const next = prev + increment;
          if (next >= progress) {
            clearInterval(timer);
            return progress;
          }
          return next;
        });
      }, 50);
      return () => clearInterval(timer);
    }
  }, [progress, animatedProgress]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div className="text-center max-w-md mx-auto p-8">
        {/* الشعار المتحرك */}
        <div className="relative mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 bg-gradient-to-r from-saudi-green to-saudi-gold rounded-full mx-auto flex items-center justify-center relative"
          >
            <Brain className="h-12 w-12 text-white" />
          </motion.div>
          
          {/* دوائر متحركة */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 border-4 border-saudi-green/20 rounded-full"
              animate={{
                scale: [1, 1.5, 2],
                opacity: [0.7, 0.3, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.5
              }}
            />
          ))}
        </div>

        {/* العنوان */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-almarai font-bold text-gray-800 mb-4"
        >
          SmartStartAI يعمل من أجلك
        </motion.h2>

        {/* الرسالة المتغيرة */}
        <div className="h-8 mb-6 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentMessage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-lg font-almarai text-gray-600"
            >
              {currentMessages[currentMessage]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* شريط التقدم */}
        {progress > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-saudi-green to-saudi-gold h-3 rounded-full relative"
                style={{ width: `${animatedProgress}%` }}
              >
                <motion.div
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
              </motion.div>
            </div>
            <p className="text-saudi-green font-almarai font-bold">
              {Math.round(animatedProgress)}% مكتمل
            </p>
          </motion.div>
        )}

        {/* خطوات المعالجة */}
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <h3 className="font-almarai font-bold text-gray-800 mb-4">مراحل المعالجة:</h3>
            <div className="space-y-3">
              {currentSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0.3 }}
                  animate={{ 
                    opacity: index === currentStep ? 1 : 0.3,
                    scale: index === currentStep ? 1.05 : 1,
                    x: index === currentStep ? [0, 5, 0] : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    index === currentStep ? 'bg-saudi-green/10 border border-saudi-green/20' : 'bg-gray-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index === currentStep ? 'bg-saudi-green text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    <step.icon className="h-4 w-4" />
                  </div>
                  <div className="text-right flex-1">
                    <div className="font-almarai font-bold text-sm text-gray-800">
                      {step.title}
                    </div>
                    <div className="font-almarai text-xs text-gray-600">
                      {step.desc}
                    </div>
                  </div>
                  {index === currentStep && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-saudi-green border-t-transparent rounded-full"
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* نقاط متحركة */}
        <div className="flex justify-center gap-2 mb-6">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-saudi-green rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.1
              }}
            />
          ))}
        </div>

        {/* نصائح أثناء الانتظار */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-saudi-green/5 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-5 w-5 text-saudi-green" />
            <span className="font-almarai font-bold text-saudi-green">نصيحة سريعة</span>
          </div>
          <p className="text-saudi-green font-almarai text-sm text-right">
            {type === 'analysis' 
              ? '💡 نصيحة: كلما كانت بياناتك أدق، كان التحليل أفضل وأكثر فائدة لمشروعك'
              : type === 'auth'
              ? '🔒 بياناتك محمية بأعلى معايير الأمان والتشفير المتقدم'
              : '⚡ نعمل بذكاء لتحضير أفضل النتائج لك'
            }
          </p>
        </motion.div>

        {/* مؤشر الأمان */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500"
        >
          <Shield className="h-4 w-4 text-green-500" />
          <span className="font-almarai">معالجة آمنة ومشفرة</span>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-green-500 rounded-full"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;