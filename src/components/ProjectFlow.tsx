import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Check, Mic, FileText, Save, Loader, AlertCircle, CheckCircle, Info, Target, DollarSign } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { projectSchema } from '../utils/validation';
import MapLocationSelector from './MapLocationSelector';
import toast from 'react-hot-toast';

interface FlowStep {
  id: number;
  title: string;
  question: string;
  type: 'text' | 'select' | 'multiselect' | 'number' | 'voice' | 'range';
  options?: string[];
  required?: boolean;
  validation?: (value: any) => string | null;
  helpText?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

const ProjectFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<number, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const { user } = useAuth();

  // بيانات الخريطة والموقع
  const [locationData, setLocationData] = useState<any>(null);
  const [showMap, setShowMap] = useState(false);

  const steps: FlowStep[] = [
    {
      id: 1,
      title: 'فكرة المشروع',
      question: 'ما هي فكرة مشروعك؟ (يمكنك التحدث أو الكتابة)',
      type: 'voice',
      required: true,
      helpText: 'اشرح فكرتك بالتفصيل - كلما كانت أوضح، كان التحليل أدق',
      placeholder: 'مثال: تطبيق توصيل طعام صحي يستهدف العائلات في الرياض...',
      validation: (value) => {
        if (!value || value.trim().length < 10) {
          return 'يجب أن يكون وصف المشروع 10 أحرف على الأقل';
        }
        if (value.trim().length > 1000) {
          return 'الوصف طويل جداً (الحد الأقصى 1000 حرف)';
        }
        return null;
      }
    },
    {
      id: 2,
      title: 'نوع المشروع',
      question: 'ما نوع المشروع؟',
      type: 'select',
      options: [
        'تجارة إلكترونية', 'مطاعم وأغذية', 'تقنية وبرمجة', 'خدمات مهنية', 
        'صحة ولياقة', 'تعليم وتدريب', 'سياحة وضيافة', 'لوجستيات وتوصيل',
        'تقنية مالية', 'عقارات وإنشاءات', 'طاقة واستدامة', 'أخرى'
      ],
      required: true,
      helpText: 'اختر النوع الأقرب لمشروعك - سيساعدنا في تخصيص التحليل'
    },
    {
      id: 3,
      title: 'الموقع الجغرافي',
      question: 'في أي مدينة تريد بدء المشروع؟',
      type: 'select',
      options: [
        'الرياض', 'جدة', 'الدمام', 'المدينة المنورة', 'مكة المكرمة', 
        'الطائف', 'أبها', 'تبوك', 'بريدة', 'خميس مشيط', 'حائل', 'الجبيل'
      ],
      required: true,
      helpText: 'المدينة تؤثر على تحليل السوق والتكاليف والمنافسة'
    },
    {
      id: 3.5,
      title: 'تحليل الموقع والمنافسين',
      question: 'هل تريد تحليل موقع محدد ومنافسيه على الخريطة؟',
      type: 'select',
      options: ['نعم، أريد تحليل موقع محدد', 'لا، تحليل عام للمدينة'],
      required: false,
      helpText: 'التحليل الجغرافي يساعد في فهم المنافسة والفرص بدقة أكبر'
    },
    {
      id: 4,
      title: 'رأس المال',
      question: 'ما هو رأس المال المتوقع للمشروع؟',
      type: 'range',
      min: 10000,
      max: 10000000,
      step: 5000,
      unit: 'ريال سعودي',
      required: true,
      helpText: 'شمل جميع التكاليف: التأسيس، المعدات، رأس المال التشغيلي',
      validation: (value) => {
        const num = parseFloat(value);
        if (isNaN(num) || num < 10000) {
          return 'يجب أن يكون رأس المال 10,000 ريال على الأقل';
        }
        if (num > 10000000) {
          return 'للمشاريع الكبيرة، يرجى التواصل معنا مباشرة';
        }
        return null;
      }
    },
    {
      id: 5,
      title: 'الجمهور المستهدف',
      question: 'من هو جمهورك المستهدف؟',
      type: 'text',
      required: true,
      placeholder: 'مثال: العائلات الشابة (25-40 سنة) في الرياض ذات الدخل المتوسط والعالي...',
      helpText: 'كن محدداً: العمر، الجنس، الدخل، المنطقة، الاهتمامات',
      validation: (value) => {
        if (!value || value.trim().length < 10) {
          return 'يجب وصف الجمهور المستهدف بوضوح (10 أحرف على الأقل)';
        }
        if (value.trim().length > 500) {
          return 'الوصف طويل جداً (الحد الأقصى 500 حرف)';
        }
        return null;
      }
    },
    {
      id: 6,
      title: 'أهداف التحليل',
      question: 'ما هدفك من هذا التحليل؟',
      type: 'multiselect',
      options: [
        'الحصول على تمويل بنكي', 
        'تطوير تطبيق أو موقع', 
        'تحليل السوق والمنافسة', 
        'خطة تسويقية شاملة', 
        'دراسة جدوى كاملة',
        'عرض تقديمي للمستثمرين',
        'تقييم المخاطر',
        'خطة عمل تفصيلية'
      ],
      required: true,
      helpText: 'يمكنك اختيار أكثر من هدف - سنخصص التحليل وفقاً لاختياراتك',
      validation: (value) => {
        if (!Array.isArray(value) || value.length === 0) {
          return 'يجب اختيار هدف واحد على الأقل';
        }
        if (value.length > 5) {
          return 'لا يمكن اختيار أكثر من 5 أهداف';
        }
        return null;
      }
    },
    {
      id: 7,
      title: 'المنافسون',
      question: 'من هم منافسوك الرئيسيون؟ (اختياري)',
      type: 'text',
      required: false,
      placeholder: 'مثال: تطبيق هنقرستيشن، كريم ناو، تطبيقات محلية أخرى...',
      helpText: 'معرفة المنافسين تساعد في تحليل أدق للسوق والفرص',
      validation: (value) => {
        if (value && value.trim().length > 300) {
          return 'الوصف طويل جداً (الحد الأقصى 300 حرف)';
        }
        return null;
      }
    },
    {
      id: 8,
      title: 'المزايا التنافسية',
      question: 'ما الذي يميز مشروعك عن المنافسين؟',
      type: 'text',
      required: true,
      placeholder: 'مثال: تقنية ذكية، خدمة عملاء متميزة، أسعار تنافسية...',
      helpText: 'اذكر 2-3 مزايا واضحة تجعل مشروعك مختلفاً',
      validation: (value) => {
        if (!value || value.trim().length < 15) {
          return 'يجب ذكر المزايا التنافسية بوضوح (15 حرف على الأقل)';
        }
        if (value.trim().length > 400) {
          return 'الوصف طويل جداً (الحد الأقصى 400 حرف)';
        }
        return null;
      }
    }
  ];

  // حساب نسبة الإكمال
  useEffect(() => {
    const completedSteps = Object.keys(answers).length;
    const totalSteps = steps.length;
    setCompletionPercentage(Math.round((completedSteps / totalSteps) * 100));
  }, [answers]);

  const validateStep = (stepIndex: number, value: any): boolean => {
    const step = steps[stepIndex];
    
    // التحقق من الحقول المطلوبة
    if (step.required && (!value || value === '' || (Array.isArray(value) && value.length === 0))) {
      setValidationErrors(prev => ({ ...prev, [stepIndex]: 'هذا الحقل مطلوب' }));
      return false;
    }
    
    // التحقق المخصص
    const error = step.validation ? step.validation(value) : null;
    
    if (error) {
      setValidationErrors(prev => ({ ...prev, [stepIndex]: error }));
      return false;
    } else {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[stepIndex];
        return newErrors;
      });
      return true;
    }
  };

  const handleAnswer = (value: any) => {
    setAnswers(prev => ({ ...prev, [currentStep]: value }));
    validateStep(currentStep, value);
  };

  const handleVoiceInput = (text: string) => {
    handleAnswer(text);
    setShowVoiceRecorder(false);
    toast.success('تم تحويل الصوت بنجاح');
  };

  const nextStep = () => {
    const currentValue = answers[currentStep];
    
    if (!validateStep(currentStep, currentValue)) {
      toast.error('يرجى تصحيح الأخطاء قبل المتابعة');
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const saveAsDraft = async () => {
    if (!user) {
      toast.error('يجب تسجيل الدخول لحفظ المسودة');
      return;
    }

    try {
      setIsSaving(true);
      
      const draftData = {
        user_id: user.id,
        title: answers[0] || 'مسودة مشروع',
        description: answers[0] || '',
        type: answers[1] || 'عام',
        city: answers[2] || 'الرياض',
        goal: Array.isArray(answers[5]) ? answers[5].join(', ') : 'مسودة',
        status: 'saved',
        data: {
          answers,
          currentStep,
          completionPercentage,
          savedAt: new Date().toISOString()
        }
      };

      await apiService.saveProject(draftData);
      toast.success('تم حفظ المشروع كمسودة');
      
    } catch (error) {
      toast.error('خطأ في حفظ المسودة');
      console.error('Save draft error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsProcessing(true);
      
      // التحقق من جميع الإجابات المطلوبة
      const missingSteps = steps.filter((step, index) => 
        step.required && (!answers[index] || !validateStep(index, answers[index]))
      );

      if (missingSteps.length > 0) {
        toast.error(`يرجى إكمال ${missingSteps.length} حقل مطلوب`);
        setCurrentStep(steps.findIndex(step => missingSteps.includes(step)));
        setIsProcessing(false);
        return;
      }
      
      // تحضير البيانات للإرسال
      const projectData = {
        projectName: answers[0] || 'مشروع جديد',
        industry: answers[1] || 'عام',
        description: answers[0] || '',
        location: answers[2] || 'الرياض',
        locationAnalysis: locationData || null,
        targetMarket: answers[4] || 'عام',
        initialInvestment: parseFloat(answers[3]) || 100000,
        fixedCosts: parseFloat(answers[3]) * 0.3 || 30000,
        variableCosts: parseFloat(answers[3]) * 0.2 || 20000,
        revenueProjections: [
          parseFloat(answers[3]) * 1.5 || 150000,
          parseFloat(answers[3]) * 2.2 || 220000,
          parseFloat(answers[3]) * 3.1 || 310000,
          parseFloat(answers[3]) * 4.2 || 420000,
          parseFloat(answers[3]) * 5.5 || 550000
        ],
        marketSize: 10000000,
        marketGrowthRate: 0.15,
        targetMarketShare: 0.02,
        teamSize: 5,
        competitiveAdvantages: answers[7] ? [answers[7]] : ['ميزة تنافسية فريدة'],
        riskFactors: ['مخاطر السوق', 'المنافسة', 'التحديات التقنية'],
        fundingRequirements: parseFloat(answers[3]) || 100000,
        competitors: answers[6] || '',
        goals: Array.isArray(answers[5]) ? answers[5] : []
      };

      // حفظ المشروع في قاعدة البيانات
      if (user) {
        await apiService.saveProject({
          user_id: user.id,
          title: projectData.projectName,
          description: projectData.description,
          type: projectData.industry,
          city: projectData.location,
          goal: projectData.goals.join(', '),
          status: 'analyzing',
          data: projectData
        });
      }

      // محاكاة إنتاج دراسة الجدوى مع تقدم
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress >= 100) {
          progress = 100;
          clearInterval(progressInterval);
          setTimeout(() => {
            toast.success('تم إنتاج دراسة الجدوى بنجاح!');
            if (typeof window !== 'undefined') {
              window.location.hash = 'results';
            }
          }, 500);
        }
      }, 300);
      
    } catch (error) {
      toast.error('حدث خطأ في معالجة المشروع');
      console.error('Project submission error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const currentValue = answers[currentStep];
  const hasValidationError = validationErrors[currentStep];
  const canProceed = currentValue !== undefined && currentValue !== '' && !hasValidationError;

  // شاشة المعالجة المحسنة
  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-light-green flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-saudi-green to-saudi-gold rounded-full mx-auto mb-6 flex items-center justify-center relative">
            <Loader className="h-10 w-10 text-white animate-spin" />
            <div className="absolute inset-0 border-4 border-saudi-green/20 rounded-full animate-ping"></div>
          </div>
          
          <h2 className="text-xl font-almarai font-bold text-gray-800 mb-4">
            جاري تحليل مشروعك بالذكاء الاصطناعي...
          </h2>
          
          <div className="space-y-3 mb-6">
            {[
              'تحليل فكرة المشروع',
              'دراسة السوق المحلي',
              'حساب التوقعات المالية',
              'إنشاء النموذج التشغيلي',
              'تجهيز التقرير النهائي'
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.5 }}
                className="flex items-center gap-3 text-right"
              >
                <CheckCircle className="h-5 w-5 text-saudi-green" />
                <span className="font-almarai text-gray-700">{step}</span>
              </motion.div>
            ))}
          </div>
          
          <div className="text-sm text-gray-500 font-almarai">
            هذا قد يستغرق بضع دقائق...
          </div>
        </motion.div>
      </div>
    );
  }

  const renderStepInput = () => {
    switch (currentStepData.type) {
      case 'text':
        return (
          <div className="space-y-4">
            <textarea
              className={`w-full p-4 border-2 rounded-xl font-almarai text-right resize-none focus:outline-none transition-colors ${
                hasValidationError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-saudi-green'
              }`}
              rows={4}
              placeholder={currentStepData.placeholder}
              value={currentValue || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              maxLength={currentStepData.id === 5 ? 500 : 1000}
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{(currentValue || '').length} / {currentStepData.id === 5 ? 500 : 1000}</span>
              {hasValidationError && (
                <span className="text-red-500 font-almarai">
                  {hasValidationError}
                </span>
              )}
            </div>
          </div>
        );

      case 'number':
      case 'range':
        const numValue = parseFloat(currentValue) || currentStepData.min || 0;
        return (
          <div className="space-y-6">
            <div className="relative">
              <input
                type="range"
                min={currentStepData.min}
                max={currentStepData.max}
                step={currentStepData.step}
                value={numValue}
                onChange={(e) => handleAnswer(e.target.value)}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #006B3F 0%, #006B3F ${((numValue - (currentStepData.min || 0)) / ((currentStepData.max || 100) - (currentStepData.min || 0))) * 100}%, #e5e7eb ${((numValue - (currentStepData.min || 0)) / ((currentStepData.max || 100) - (currentStepData.min || 0))) * 100}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>{(currentStepData.min || 0).toLocaleString()}</span>
                <span>{(currentStepData.max || 100).toLocaleString()}</span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-saudi-green mb-2 font-poppins">
                {numValue.toLocaleString()} {currentStepData.unit}
              </div>
              
              {/* مساعد التسعير */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-almarai font-bold text-blue-800 mb-3 text-right">
                  مرجع تقديري حسب نوع المشروع:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="font-bold text-green-600">10K - 100K</div>
                    <div className="text-gray-600 font-almarai">مشاريع صغيرة</div>
                    <div className="text-xs text-gray-500 font-almarai">خدمات، تجارة بسيطة</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="font-bold text-yellow-600">100K - 1M</div>
                    <div className="text-gray-600 font-almarai">مشاريع متوسطة</div>
                    <div className="text-xs text-gray-500 font-almarai">مطاعم، تطبيقات</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="font-bold text-red-600">1M+</div>
                    <div className="text-gray-600 font-almarai">مشاريع كبيرة</div>
                    <div className="text-xs text-gray-500 font-almarai">مصانع، منصات كبيرة</div>
                  </div>
                </div>
              </div>
            </div>
            
            {hasValidationError && (
              <p className="text-red-500 text-sm font-almarai text-center">
                {hasValidationError}
              </p>
            )}
          </div>
        );

      case 'voice':
        return (
          <div className="space-y-6">
            <div>
              <textarea
                className={`w-full p-4 border-2 rounded-xl font-almarai text-right resize-none focus:outline-none transition-colors ${
                  hasValidationError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-saudi-green'
                }`}
                rows={4}
                placeholder={currentStepData.placeholder}
                value={currentValue || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                maxLength={1000}
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>{(currentValue || '').length} / 1000</span>
                {hasValidationError && (
                  <span className="text-red-500 font-almarai">
                    {hasValidationError}
                  </span>
                )}
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-gray-500 font-almarai mb-4">أو</p>
              <motion.div 
                className="bg-gradient-to-r from-saudi-green/5 to-saudi-gold/5 rounded-xl p-6"
                whileHover={{ scale: 1.02 }}
              >
                <Mic className="h-12 w-12 text-saudi-green mx-auto mb-3" />
                <p className="text-gray-600 font-almarai mb-4">
                  استخدم الزر الثابت في أسفل الشاشة للتسجيل الصوتي
                </p>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-sm text-gray-600 font-almarai space-y-1">
                    <p>💡 <strong>نصائح للتسجيل الأمثل:</strong></p>
                    <p>• تحدث بوضوح واذكر تفاصيل مشروعك</p>
                    <p>• اذكر نوع المشروع والمدينة المستهدفة</p>
                    <p>• وضح الجمهور المستهدف ورأس المال المتوقع</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        );

      case 'select':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {currentStepData.options?.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(option)}
                  className={`p-4 rounded-xl border-2 font-almarai transition-all relative overflow-hidden ${
                    currentValue === option
                      ? 'border-saudi-green bg-light-green text-saudi-green shadow-lg'
                      : 'border-gray-200 hover:border-saudi-green/50 hover:bg-gray-50'
                  }`}
                >
                  <span className="relative z-10">{option}</span>
                  {currentValue === option && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2"
                    >
                      <Check className="h-5 w-5" />
                    </motion.div>
                  )}
                  {currentValue === option && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 0.1 }}
                      className="absolute inset-0 bg-saudi-green rounded-xl"
                    />
                  )}
                </motion.button>
              ))}
            </div>
            
            {/* إظهار الخريطة إذا اختار المستخدم التحليل المحدد */}
            {currentStepData.id === 3.5 && currentValue === 'نعم، أريد تحليل موقع محدد' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6"
              >
                <MapLocationSelector
                  onLocationSelect={(data) => {
                    setLocationData(data);
                    toast.success('تم تحليل الموقع بنجاح');
                  }}
                  projectType={answers[1] || 'عام'}
                />
              </motion.div>
            )}
            
            {hasValidationError && (
              <p className="text-red-500 text-sm font-almarai text-right">
                {hasValidationError}
              </p>
            )}
          </div>
        );

      case 'multiselect':
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              {currentStepData.options?.map((option, index) => {
                const selectedOptions = (currentValue as string[]) || [];
                const isSelected = selectedOptions.includes(option);
                
                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      const current = (currentValue as string[]) || [];
                      const updated = isSelected
                        ? current.filter(item => item !== option)
                        : [...current, option];
                      handleAnswer(updated);
                    }}
                    className={`w-full p-4 rounded-xl border-2 font-almarai transition-all flex items-center justify-between relative overflow-hidden ${
                      isSelected
                        ? 'border-saudi-green bg-light-green text-saudi-green'
                        : 'border-gray-200 hover:border-saudi-green/50 hover:bg-gray-50'
                    }`}
                  >
                    <span className="relative z-10">{option}</span>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: isSelected ? 1 : 0 }}
                      className="relative z-10"
                    >
                      <Check className="h-5 w-5" />
                    </motion.div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.1 }}
                        className="absolute inset-0 bg-saudi-green rounded-xl"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
            
            <div className="text-center">
              <span className="text-sm font-almarai text-gray-600">
                {((currentValue as string[]) || []).length} من {currentStepData.options?.length} محدد
              </span>
            </div>
            
            {hasValidationError && (
              <p className="text-red-500 text-sm font-almarai text-right">
                {hasValidationError}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-light-green p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* شريط التقدم المحسن */}
          <div className="bg-gradient-to-r from-saudi-green to-saudi-gold p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="text-right">
                <span className="text-sm font-almarai opacity-90">
                  الخطوة {currentStep + 1} من {steps.length}
                </span>
                <div className="text-xs font-almarai opacity-75 mt-1">
                  {completionPercentage}% من البيانات مكتملة
                </div>
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold">{Math.round(((currentStep + 1) / steps.length) * 100)}%</div>
                <div className="text-xs opacity-75">مكتمل</div>
              </div>
            </div>
            
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-white h-3 rounded-full relative"
              >
                <motion.div
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
              </motion.div>
            </div>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* رأس الخطوة */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-16 h-16 bg-gradient-to-r from-saudi-green to-saudi-gold rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl"
                  >
                    {currentStep + 1}
                  </motion.div>
                  
                  <h2 className="text-2xl font-almarai font-bold text-gray-800 mb-2">
                    {currentStepData.title}
                  </h2>
                  
                  <p className="text-lg font-almarai text-gray-600 mb-4">
                    {currentStepData.question}
                    {currentStepData.required && <span className="text-red-500 mr-1">*</span>}
                  </p>
                  
                  {currentStepData.helpText && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="h-4 w-4 text-blue-600" />
                        <span className="font-almarai font-bold text-blue-800 text-sm">نصيحة:</span>
                      </div>
                      <p className="text-blue-700 font-almarai text-sm text-right">
                        {currentStepData.helpText}
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* حقول الإدخال */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {renderStepInput()}
                </motion.div>
              </motion.div>
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200"
            >
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-6 py-3 text-gray-600 font-almarai hover:text-saudi-green transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="h-5 w-5" />
                السابق
              </button>

              <div className="flex items-center gap-4">
                {user && (
                  <motion.button
                    onClick={saveAsDraft}
                    disabled={isSaving}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-almarai hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader className="h-5 w-5 animate-spin" />
                    ) : (
                      <Save className="h-5 w-5" />
                    )}
                    {isSaving ? 'جاري الحفظ...' : 'حفظ كمسودة'}
                  </motion.button>
                )}

                <motion.button
                  onClick={nextStep}
                  disabled={!canProceed}
                  whileHover={canProceed ? { scale: 1.02 } : {}}
                  whileTap={canProceed ? { scale: 0.98 } : {}}
                  className="flex items-center gap-2 bg-gradient-to-r from-saudi-green to-saudi-gold text-white px-8 py-3 rounded-xl font-almarai font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLastStep ? (
                    <>
                      <FileText className="h-5 w-5" />
                      إنتاج دراسة الجدوى
                    </>
                  ) : (
                    <>
                      التالي
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* معاينة البيانات المحسنة */}
        <AnimatePresence>
          {Object.keys(answers).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-almarai font-bold text-gray-800">
                  ملخص البيانات المدخلة
                </h3>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-saudi-green rounded-full"></div>
                  <span className="text-sm font-almarai text-gray-600">
                    {completionPercentage}% مكتمل
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(answers).map(([stepIndex, answer]) => {
                  const step = steps[parseInt(stepIndex)];
                  const hasError = validationErrors[parseInt(stepIndex)];
                  
                  return (
                    <motion.div 
                      key={stepIndex}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: parseInt(stepIndex) * 0.05 }}
                      className={`rounded-lg p-3 border transition-all ${
                        hasError ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="text-sm font-almarai font-bold text-gray-800 mb-1 flex items-center gap-2">
                        {step?.title}
                        {!hasError && answer && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        {hasError && (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div className="text-sm font-almarai text-gray-600">
                        {Array.isArray(answer) ? answer.join(', ') : 
                         typeof answer === 'number' ? `${answer.toLocaleString()} ريال` : 
                         answer}
                      </div>
                      
                      {/* عرض تحليل الموقع إذا كان متاحاً */}
                      {step?.id === 3.5 && locationData && (
                        <div className="mt-2 text-xs font-almarai text-saudi-green">
                          📍 تم تحليل {locationData.analysis.totalCompetitors} منافس
                          • كثافة المنافسة: {locationData.analysis.competitionDensity === 'low' ? 'منخفضة' : 
                                              locationData.analysis.competitionDensity === 'medium' ? 'متوسطة' : 'عالية'}
                        </div>
                      )}
                      
                      {hasError && (
                        <div className="text-xs font-almarai text-red-600 mt-1">
                          {hasError}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
              
              {/* إحصائيات سريعة */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-saudi-green">
                      {Object.keys(answers).length}
                    </div>
                    <div className="text-xs font-almarai text-gray-600">
                      خطوات مكتملة
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-red-500">
                      {Object.keys(validationErrors).length}
                    </div>
                    <div className="text-xs font-almarai text-gray-600">
                      أخطاء للتصحيح
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-tech-blue">
                      {completionPercentage}%
                    </div>
                    <div className="text-xs font-almarai text-gray-600">
                      نسبة الإكمال
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProjectFlow;