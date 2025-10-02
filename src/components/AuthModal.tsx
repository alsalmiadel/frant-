import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, Eye, EyeOff, CheckCircle, AlertTriangle, Shield, Zap } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema, registerSchema } from '../utils/validation';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onModeChange: (mode: 'login' | 'register') => void;
  onSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onModeChange, onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp, signIn, signInWithGoogle, signInWithApple, loading } = useAuth();

  const schema = mode === 'login' ? loginSchema : registerSchema;
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
    trigger
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const cities = [
    'الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام', 
    'الطائف', 'تبوك', 'بريدة', 'خميس مشيط', 'حائل', 'الجبيل', 'ينبع'
  ];

  const benefits = [
    'محادثات صوتية غير محدودة',
    'دراسات جدوى احترافية',
    'تحليلات سوق متقدمة',
    'دعم فني متواصل',
    'تقارير ESG شاملة',
    'أكواد برمجية كاملة'
  ];

  const securityFeatures = [
    'تشفير SSL/TLS متقدم',
    'امتثال كامل لقانون PDPL',
    'خوادم محلية آمنة',
    'مراقبة أمنية 24/7'
  ];

  const watchedPassword = watch('password');

  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: '', color: 'gray' };
    
    let score = 0;
    if (password.length >= 8) score += 25;
    if (/[a-z]/.test(password)) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/\d/.test(password)) score += 25;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 25;
    
    if (score <= 25) return { score, label: 'ضعيفة', color: 'red' };
    if (score <= 50) return { score, label: 'متوسطة', color: 'yellow' };
    if (score <= 75) return { score, label: 'جيدة', color: 'blue' };
    return { score, label: 'قوية جداً', color: 'green' };
  };

  const passwordStrength = mode === 'register' ? getPasswordStrength(watchedPassword || '') : null;

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      let success = false;
      
      if (mode === 'login') {
        success = await signIn(data.email, data.password);
      } else {
        success = await signUp(data.email, data.password, {
          name: data.name,
          phone: data.phone,
          city: data.city
        });
      }

      if (success) {
        if (mode === 'register') {
          setStep(2);
        } else {
          onClose();
          if (onSuccess) onSuccess();
        }
        reset();
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden"
        >
          <div className="flex">
            {/* الجانب الأيسر - النموذج */}
            <div className="flex-1 p-8 overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-almarai font-bold text-gray-800">
                  {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
                </h2>
                <button
                  onClick={handleClose}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {step === 1 ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {mode === 'register' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <label className="block text-gray-700 font-almarai font-bold mb-2 text-right">
                        الاسم الكامل *
                      </label>
                      <div className="relative">
                        <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          id="fullName"
                          {...register('name')}
                          className={`w-full pr-10 pl-4 py-3 border-2 rounded-xl font-almarai text-right focus:outline-none transition-colors ${
                            errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-saudi-green'
                          }`}
                          placeholder="أدخل اسمك الكامل"
                          aria-required="true"
                          aria-describedby={errors.name ? "name-error" : undefined}
                        />
                      </div>
                      {errors.name && (
                        <motion.p
                          id="name-error"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm font-almarai mt-1 text-right"
                          role="alert"
                        >
                          {errors.name.message}
                        </motion.p>
                      )}
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-gray-700 font-almarai font-bold mb-2 text-right">
                      البريد الإلكتروني *
                    </label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="email"
                        {...register('email')}
                        type="email"
                        className={`w-full pr-10 pl-4 py-3 border-2 rounded-xl font-almarai text-right focus:outline-none transition-colors ${
                          errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-saudi-green'
                        }`}
                        placeholder="example@email.com"
                        aria-required="true"
                        aria-describedby={errors.email ? "email-error" : undefined}
                      />
                    </div>
                    {errors.email && (
                      <motion.p
                        id="email-error"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm font-almarai mt-1 text-right"
                        role="alert"
                      >
                        {errors.email.message}
                      </motion.p>
                    )}
                  </motion.div>

                  {mode === 'register' && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <label className="block text-gray-700 font-almarai font-bold mb-2 text-right">
                          رقم الجوال *
                        </label>
                        <div className="relative">
                          <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            id="phone"
                            {...register('phone')}
                            type="tel"
                            className={`w-full pr-10 pl-4 py-3 border-2 rounded-xl font-almarai text-right focus:outline-none transition-colors ${
                              errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-saudi-green'
                            }`}
                            placeholder="05xxxxxxxx"
                            aria-required="true"
                            aria-describedby={errors.phone ? "phone-error" : undefined}
                          />
                        </div>
                        {errors.phone && (
                          <motion.p
                            id="phone-error"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm font-almarai mt-1 text-right"
                            role="alert"
                          >
                            {errors.phone.message}
                          </motion.p>
                        )}
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <label className="block text-gray-700 font-almarai font-bold mb-2 text-right">
                          المدينة *
                        </label>
                        <select
                          id="city"
                          {...register('city')}
                          className={`w-full px-4 py-3 border-2 rounded-xl font-almarai text-right focus:outline-none transition-colors ${
                            errors.city ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-saudi-green'
                          }`}
                          aria-required="true"
                          aria-describedby={errors.city ? "city-error" : undefined}
                        >
                          <option value="">اختر المدينة</option>
                          {cities.map((city) => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                        {errors.city && (
                          <motion.p
                            id="city-error"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm font-almarai mt-1 text-right"
                            role="alert"
                          >
                            {errors.city.message}
                          </motion.p>
                        )}
                      </motion.div>
                    </>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: mode === 'register' ? 0.4 : 0.2 }}
                  >
                    <label className="block text-gray-700 font-almarai font-bold mb-2 text-right">
                      كلمة المرور *
                    </label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                      <input
                        id="password"
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                        className={`w-full pr-10 pl-10 py-3 border-2 rounded-xl font-almarai text-right focus:outline-none transition-colors ${
                          errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-saudi-green'
                        }`}
                        placeholder="كلمة مرور قوية"
                        aria-required="true"
                        aria-describedby={errors.password ? "password-error" : undefined}
                      />
                    </div>
                    
                    {/* مؤشر قوة كلمة المرور */}
                    {mode === 'register' && passwordStrength && watchedPassword && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <motion.div
                              className={`h-2 rounded-full bg-${passwordStrength.color}-500`}
                              initial={{ width: 0 }}
                              animate={{ width: `${passwordStrength.score}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                          <span className={`text-sm font-almarai font-bold text-${passwordStrength.color}-600`}>
                            {passwordStrength.label}
                          </span>
                        </div>
                      </motion.div>
                    )}
                    
                    {errors.password && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm font-almarai mt-1 text-right"
                      >
                        {errors.password.message}
                      </motion.p>
                    )}
                  </motion.div>

                  {mode === 'register' && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <label className="block text-gray-700 font-almarai font-bold mb-2 text-right">
                          تأكيد كلمة المرور *
                        </label>
                        <div className="relative">
                          <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                          <input
                            {...register('confirmPassword')}
                            type={showConfirmPassword ? 'text' : 'password'}
                            className={`w-full pr-10 pl-10 py-3 border-2 rounded-xl font-almarai text-right focus:outline-none transition-colors ${
                              errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-saudi-green'
                            }`}
                            placeholder="أعد كتابة كلمة المرور"
                          />
                        </div>
                        {errors.confirmPassword && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm font-almarai mt-1 text-right"
                          >
                            {errors.confirmPassword.message}
                          </motion.p>
                        )}
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex items-center gap-3"
                      >
                        <input
                          {...register('terms')}
                          type="checkbox"
                          className="w-5 h-5 text-saudi-green border-gray-300 rounded focus:ring-saudi-green"
                        />
                        <label className="text-gray-700 font-almarai text-sm text-right flex-1">
                          أوافق على 
                          <button 
                            onClick={() => {
                              if (typeof window !== 'undefined') {
                                window.location.hash = 'terms';
                              }
                            }}
                            className="text-saudi-green hover:text-saudi-gold mx-1 underline"
                          >
                            شروط الاستخدام
                          </button>
                          و
                          <button 
                            onClick={() => {
                              if (typeof window !== 'undefined') {
                                window.location.hash = 'privacy';
                              }
                            }}
                            className="text-saudi-green hover:text-saudi-gold mx-1 underline"
                          >
                            سياسة الخصوصية
                          </button>
                        </label>
                      </motion.div>
                      {errors.terms && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm font-almarai text-right"
                        >
                          {errors.terms.message}
                        </motion.p>
                      )}
                    </>
                  )}

                  {/* أزرار التسجيل الاجتماعي */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500 font-almarai">أو</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <motion.button
                        type="button"
                        onClick={signInWithGoogle}
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 border-2 border-gray-300 rounded-xl font-almarai font-bold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 disabled:opacity-50 shadow-sm hover:shadow-md"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        {mode === 'login' ? 'دخول عبر Google' : 'تسجيل عبر Google'}
                      </motion.button>

                      <motion.button
                        type="button"
                        onClick={signInWithApple}
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 border-2 border-gray-900 rounded-xl font-almarai font-bold text-white bg-gray-900 hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 shadow-sm hover:shadow-md"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09z"/>
                          <path d="M15.53 3.83c.893-1.09 1.479-2.58 1.309-4.08-1.297.049-2.87.8-3.8 1.78-.8.9-1.5 2.34-1.34 3.73 1.42.11 2.87-.72 3.83-1.43z"/>
                        </svg>
                        {mode === 'login' ? 'دخول عبر Apple' : 'تسجيل عبر Apple'}
                      </motion.button>
                    </div>
                  </motion.div>

                  <motion.button
                    type="submit"
                    disabled={loading || isSubmitting || !isValid}
                    whileHover={isValid ? { scale: 1.02 } : {}}
                    whileTap={isValid ? { scale: 0.98 } : {}}
                    className="w-full bg-gradient-to-r from-saudi-green to-saudi-gold text-white py-4 rounded-xl font-almarai font-bold text-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading || isSubmitting ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        {mode === 'login' ? 'جاري تسجيل الدخول...' : 'جاري إنشاء الحساب...'}
                      </div>
                    ) : (
                      mode === 'login' ? 'تسجيل الدخول بالبريد' : 'إنشاء حساب بالبريد'
                    )}
                  </motion.button>

                  <div className="text-center">
                    <p className="text-gray-600 font-almarai">
                      {mode === 'login' ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}
                      <button
                        type="button"
                        onClick={() => onModeChange(mode === 'login' ? 'register' : 'login')}
                        className="text-saudi-green font-bold mr-2 hover:text-saudi-gold transition-colors"
                      >
                        {mode === 'login' ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
                      </button>
                    </p>
                  </div>

                  {mode === 'register' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="bg-light-green rounded-xl p-4 mt-6"
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-saudi-green flex-shrink-0 mt-1" />
                        <p className="text-saudi-green font-almarai text-sm text-right">
                          بياناتك محمية بتشفير عالي المستوى ومتوافقة مع قانون حماية البيانات الشخصية (PDPL)
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* معلومات التسجيل الاجتماعي */}
                  {mode === 'register' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="bg-blue-50 rounded-xl p-4"
                    >
                      <div className="flex items-start gap-3">
                        <Zap className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                        <div className="text-right">
                          <h4 className="font-almarai font-bold text-blue-800 mb-1">التسجيل السريع</h4>
                          <p className="text-blue-700 font-almarai text-sm">
                            استخدم Google أو Apple للتسجيل السريع والآمن بنقرة واحدة
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </form>
              ) : (
                // خطوة التأكيد
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center"
                  >
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </motion.div>
                  <h3 className="text-2xl font-almarai font-bold text-gray-800 mb-4">
                    تم إنشاء حسابك بنجاح! 🎉
                  </h3>
                  <p className="text-gray-600 font-almarai mb-6">
                    مرحباً بك في SmartStartAI. يمكنك الآن الاستفادة من جميع الخدمات المتاحة.
                  </p>
                  
                  <div className="bg-saudi-green/5 rounded-xl p-4 mb-6">
                    <h4 className="font-almarai font-bold text-saudi-green mb-2">ما التالي؟</h4>
                    <ul className="space-y-2 text-sm font-almarai text-saudi-green text-right">
                      <li>• ابدأ أول محادثة صوتية</li>
                      <li>• أنشئ مشروعك الأول</li>
                      <li>• احصل على دراسة جدوى مجانية</li>
                    </ul>
                  </div>
                  
                  <motion.button
                    onClick={() => {
                      if (onSuccess) {
                        onSuccess();
                      }
                      handleClose();
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-saudi-green to-saudi-gold text-white px-8 py-3 rounded-xl font-almarai font-bold hover:shadow-lg transition-all duration-300"
                  >
                    ابدأ رحلتك الآن
                  </motion.button>
                </motion.div>
              )}
            </div>

            {/* الجانب الأيمن - المميزات */}
            <div className="hidden lg:block w-96 bg-gradient-to-br from-saudi-green to-tech-blue p-8 text-white">
              <div className="h-full flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-center mb-8"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center"
                  >
                    <span className="text-3xl">🚀</span>
                  </motion.div>
                  <h3 className="text-2xl font-almarai font-bold mb-4">
                    انضم لآلاف رواد الأعمال
                  </h3>
                  <p className="text-white/90 font-almarai">
                    الذين حققوا أحلامهم مع SmartStartAI
                  </p>
                </motion.div>

                <div className="space-y-4 mb-8">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle className="h-5 w-5 text-saudi-gold flex-shrink-0" />
                      <span className="font-almarai text-white/90">
                        {benefit}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* إحصائيات مذهلة */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-white/10 rounded-xl p-4 mb-6"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">🏆</span>
                    <span className="font-almarai font-bold">إحصائيات مذهلة</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <motion.div 
                        className="text-2xl font-bold text-saudi-gold"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        95%
                      </motion.div>
                      <div className="text-xs font-almarai text-white/80">معدل النجاح</div>
                    </div>
                    <div>
                      <motion.div 
                        className="text-2xl font-bold text-saudi-gold"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      >
                        10K+
                      </motion.div>
                      <div className="text-xs font-almarai text-white/80">مشروع ناجح</div>
                    </div>
                  </div>
                </motion.div>

                {/* شهادات الأمان */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="bg-white/10 rounded-xl p-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="h-5 w-5 text-saudi-gold" />
                    <span className="font-almarai font-bold text-sm">حماية البيانات</span>
                  </div>
                  <div className="space-y-2">
                    {securityFeatures.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2 + index * 0.1 }}
                        className="text-xs font-almarai text-white/80 flex items-center gap-2"
                      >
                        <CheckCircle className="h-3 w-3 text-saudi-gold" />
                        {feature}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;