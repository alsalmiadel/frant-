import * as yup from 'yup';

// مخططات التحقق من صحة البيانات
export const loginSchema = yup.object({
  email: yup
    .string()
    .email('بريد إلكتروني غير صحيح')
    .required('البريد الإلكتروني مطلوب'),
  password: yup
    .string()
    .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
    .required('كلمة المرور مطلوبة'),
});

export const registerSchema = yup.object({
  name: yup
    .string()
    .min(2, 'الاسم يجب أن يكون حرفين على الأقل')
    .max(50, 'الاسم طويل جداً')
    .matches(/^[\u0600-\u06FF\s\u0621-\u064A\u0660-\u0669a-zA-Z\s]+$/, 'الاسم يجب أن يحتوي على أحرف عربية أو إنجليزية فقط')
    .required('الاسم مطلوب'),
  email: yup
    .string()
    .email('بريد إلكتروني غير صحيح')
    .required('البريد الإلكتروني مطلوب'),
  phone: yup
    .string()
    .matches(/^05[0-9]{8}$/, 'رقم جوال سعودي غير صحيح (يجب أن يبدأ بـ 05)')
    .required('رقم الجوال مطلوب'),
  password: yup
    .string()
    .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم ورمز خاص'
    )
    .required('كلمة المرور مطلوبة'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'كلمات المرور غير متطابقة')
    .required('تأكيد كلمة المرور مطلوب'),
  city: yup
    .string()
    .oneOf([
      'الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام', 
      'الطائف', 'تبوك', 'بريدة', 'خميس مشيط', 'حائل', 'الجبيل', 'ينبع'
    ], 'يرجى اختيار مدينة صحيحة')
    .required('المدينة مطلوبة'),
  terms: yup
    .boolean()
    .oneOf([true], 'يجب الموافقة على الشروط والأحكام'),
});

export const projectSchema = yup.object({
  title: yup
    .string()
    .min(3, 'عنوان المشروع يجب أن يكون 3 أحرف على الأقل')
    .max(100, 'عنوان المشروع طويل جداً')
    .required('عنوان المشروع مطلوب'),
  description: yup
    .string()
    .min(10, 'وصف المشروع يجب أن يكون 10 أحرف على الأقل')
    .max(1000, 'وصف المشروع طويل جداً')
    .required('وصف المشروع مطلوب'),
  type: yup
    .string()
    .oneOf([
      'تجارة إلكترونية', 'مطاعم وأغذية', 'تقنية وبرمجة', 'خدمات مهنية',
      'صحة ولياقة', 'تعليم وتدريب', 'سياحة وضيافة', 'لوجستيات وتوصيل',
      'تقنية مالية', 'عقارات وإنشاءات', 'طاقة واستدامة', 'أخرى'
    ])
    .required('نوع المشروع مطلوب'),
  city: yup
    .string()
    .required('المدينة مطلوبة'),
  initialInvestment: yup
    .number()
    .min(10000, 'الاستثمار المبدئي يجب أن يكون 10,000 ريال على الأقل')
    .max(10000000, 'الاستثمار المبدئي كبير جداً')
    .required('الاستثمار المبدئي مطلوب'),
  targetMarket: yup
    .string()
    .min(10, 'وصف الجمهور المستهدف يجب أن يكون 10 أحرف على الأقل')
    .max(500, 'وصف الجمهور المستهدف طويل جداً')
    .required('الجمهور المستهدف مطلوب'),
});

export const passwordChangeSchema = yup.object({
  currentPassword: yup
    .string()
    .required('كلمة المرور الحالية مطلوبة'),
  newPassword: yup
    .string()
    .min(8, 'كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم ورمز خاص'
    )
    .required('كلمة المرور الجديدة مطلوبة'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'كلمات المرور غير متطابقة')
    .required('تأكيد كلمة المرور مطلوب'),
});

// دوال التحقق المخصصة
export const validateSaudiPhone = (phone: string): boolean => {
  const phoneRegex = /^05[0-9]{8}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

export const validateSaudiID = (id: string): boolean => {
  const idRegex = /^[12][0-9]{9}$/;
  return idRegex.test(id);
};

export const validateBusinessName = (name: string): { isValid: boolean; error?: string } => {
  // التحقق من أن اسم المشروع لا يحتوي على كلمات محظورة
  const forbiddenWords = ['بنك', 'مصرف', 'تأمين', 'حكومة', 'وزارة', 'هيئة'];
  const lowerName = name.toLowerCase();
  
  for (const word of forbiddenWords) {
    if (lowerName.includes(word)) {
      return { isValid: false, error: `لا يمكن استخدام كلمة "${word}" في اسم المشروع` };
    }
  }
  
  if (name.length < 3) {
    return { isValid: false, error: 'اسم المشروع يجب أن يكون 3 أحرف على الأقل' };
  }
  
  if (name.length > 100) {
    return { isValid: false, error: 'اسم المشروع طويل جداً' };
  }
  
  return { isValid: true };
};

export const validateInvestmentAmount = (amount: number, projectType: string): string | null => {
  const minimumAmounts: Record<string, number> = {
    'تجارة إلكترونية': 50000,
    'مطاعم وأغذية': 100000,
    'تقنية وبرمجة': 75000,
    'خدمات مهنية': 25000,
    'صحة ولياقة': 150000,
    'تعليم وتدريب': 100000,
    'سياحة وضيافة': 200000,
    'لوجستيات وتوصيل': 75000,
    'تقنية مالية': 500000,
    'عقارات وإنشاءات': 1000000,
    'طاقة واستدامة': 500000,
    'أخرى': 25000
  };

  const minimum = minimumAmounts[projectType] || 25000;
  
  if (amount < minimum) {
    return `الحد الأدنى للاستثمار في مشاريع ${projectType} هو ${minimum.toLocaleString()} ريال`;
  }

  if (amount > 10000000) {
    return 'للمشاريع الكبيرة (أكثر من 10 مليون ريال)، يرجى التواصل معنا مباشرة';
  }

  return null;
};

// التحقق من صحة البيانات المالية
export const validateFinancialData = (data: any): string[] => {
  const errors: string[] = [];

  if (data.fixedCosts > data.initialInvestment) {
    errors.push('التكاليف الثابتة لا يمكن أن تكون أكبر من الاستثمار المبدئي');
  }

  if (data.variableCosts > data.revenueProjections?.[0]) {
    errors.push('التكاليف المتغيرة لا يمكن أن تكون أكبر من الإيرادات المتوقعة');
  }

  if (data.marketShare > 0.5) {
    errors.push('الحصة السوقية المستهدفة مرتفعة جداً (أكثر من 50%)');
  }

  if (data.marketShare < 0.001) {
    errors.push('الحصة السوقية المستهدفة منخفضة جداً (أقل من 0.1%)');
  }

  return errors;
};

// تنظيف وتعقيم البيانات
export const sanitizeProjectData = (data: any) => {
  return {
    ...data,
    title: data.title?.trim().substring(0, 100),
    description: data.description?.trim().substring(0, 1000),
    targetMarket: data.targetMarket?.trim().substring(0, 500),
    competitiveAdvantages: data.competitiveAdvantages?.map((adv: string) => 
      adv.trim().substring(0, 200)
    ).slice(0, 10),
    riskFactors: data.riskFactors?.map((risk: string) => 
      risk.trim().substring(0, 200)
    ).slice(0, 10)
  };
};

// التحقق من قوة كلمة المرور
export const getPasswordStrength = (password: string): {
  score: number;
  label: string;
  color: string;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  if (!password) {
    return { score: 0, label: '', color: 'gray', feedback: [] };
  }

  // طول كلمة المرور
  if (password.length >= 8) {
    score += 20;
  } else {
    feedback.push('يجب أن تكون 8 أحرف على الأقل');
  }

  if (password.length >= 12) {
    score += 10;
  }

  // أحرف صغيرة
  if (/[a-z]/.test(password)) {
    score += 20;
  } else {
    feedback.push('يجب أن تحتوي على حرف صغير');
  }

  // أحرف كبيرة
  if (/[A-Z]/.test(password)) {
    score += 20;
  } else {
    feedback.push('يجب أن تحتوي على حرف كبير');
  }

  // أرقام
  if (/\d/.test(password)) {
    score += 20;
  } else {
    feedback.push('يجب أن تحتوي على رقم');
  }

  // رموز خاصة
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 20;
  } else {
    feedback.push('يجب أن تحتوي على رمز خاص');
  }

  // فحص الكلمات الشائعة
  const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'user', 'login'];
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    score -= 30;
    feedback.push('تجنب الكلمات الشائعة');
  }

  // فحص التكرار
  if (/(.)\1{2,}/.test(password)) {
    score -= 10;
    feedback.push('تجنب تكرار الأحرف');
  }

  // تحديد التصنيف
  let label = '';
  let color = '';
  
  if (score <= 30) {
    label = 'ضعيفة جداً';
    color = 'red';
  } else if (score <= 50) {
    label = 'ضعيفة';
    color = 'red';
  } else if (score <= 70) {
    label = 'متوسطة';
    color = 'yellow';
  } else if (score <= 90) {
    label = 'جيدة';
    color = 'blue';
  } else {
    label = 'قوية جداً';
    color = 'green';
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    label,
    color,
    feedback
  };
};

// التحقق من صحة البريد الإلكتروني المتقدم
export const validateEmailAdvanced = (email: string): { isValid: boolean; error?: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'تنسيق البريد الإلكتروني غير صحيح' };
  }
  
  // فحص النطاقات المشبوهة
  const suspiciousDomains = [
    'tempmail', '10minutemail', 'guerrillamail', 'mailinator', 
    'throwaway', 'temp-mail', 'fake', 'spam'
  ];
  
  const domain = email.split('@')[1]?.toLowerCase();
  const isSuspicious = suspiciousDomains.some(suspicious => domain?.includes(suspicious));
  
  if (isSuspicious) {
    return { isValid: false, error: 'يرجى استخدام بريد إلكتروني حقيقي' };
  }
  
  // فحص طول النطاق
  if (domain && domain.length < 4) {
    return { isValid: false, error: 'نطاق البريد الإلكتروني قصير جداً' };
  }
  
  return { isValid: true };
};

// التحقق من رقم الجوال السعودي المتقدم
export const validateSaudiPhoneAdvanced = (phone: string): { isValid: boolean; error?: string; formatted?: string } => {
  // إزالة المسافات والرموز
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // التحقق من الصيغة السعودية
  const phoneRegex = /^(05|5)[0-9]{8}$/;
  
  if (!phoneRegex.test(cleanPhone)) {
    return { isValid: false, error: 'رقم جوال سعودي غير صحيح (يجب أن يبدأ بـ 05)' };
  }
  
  // تنسيق الرقم
  const formatted = cleanPhone.startsWith('5') ? '0' + cleanPhone : cleanPhone;
  
  // فحص الأرقام المحجوزة أو غير الصحيحة
  const invalidPrefixes = ['0500000', '0511111', '0522222'];
  if (invalidPrefixes.some(prefix => formatted.startsWith(prefix))) {
    return { isValid: false, error: 'رقم جوال غير صحيح' };
  }
  
  return { isValid: true, formatted };
};

// التحقق من البيانات المالية المتقدم
export const validateFinancialDataAdvanced = (data: {
  initialInvestment: number;
  fixedCosts: number;
  variableCosts: number;
  revenueProjections: number[];
  marketSize: number;
  targetMarketShare: number;
}): { isValid: boolean; errors: string[]; warnings: string[] } => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // التحقق من المنطقية المالية
  if (data.fixedCosts > data.initialInvestment) {
    errors.push('التكاليف الثابتة لا يمكن أن تكون أكبر من الاستثمار المبدئي');
  }

  if (data.variableCosts > data.revenueProjections[0]) {
    errors.push('التكاليف المتغيرة لا يمكن أن تكون أكبر من الإيرادات المتوقعة');
  }

  // التحقق من الحصة السوقية
  if (data.targetMarketShare > 0.5) {
    errors.push('الحصة السوقية المستهدفة مرتفعة جداً (أكثر من 50%)');
  }

  if (data.targetMarketShare < 0.001) {
    warnings.push('الحصة السوقية المستهدفة منخفضة جداً (أقل من 0.1%)');
  }

  // التحقق من نمو الإيرادات
  for (let i = 1; i < data.revenueProjections.length; i++) {
    const growth = (data.revenueProjections[i] - data.revenueProjections[i-1]) / data.revenueProjections[i-1];
    if (growth > 2) { // نمو أكثر من 200%
      warnings.push(`نمو الإيرادات في السنة ${i+1} مرتفع جداً (${(growth*100).toFixed(0)}%)`);
    }
    if (growth < -0.1) { // انخفاض أكثر من 10%
      warnings.push(`انخفاض الإيرادات في السنة ${i+1} غير منطقي`);
    }
  }

  // التحقق من نسبة الربح
  const firstYearProfit = data.revenueProjections[0] - data.fixedCosts - data.variableCosts;
  const profitMargin = firstYearProfit / data.revenueProjections[0];
  
  if (profitMargin < 0) {
    errors.push('المشروع غير مربح في السنة الأولى');
  } else if (profitMargin < 0.05) {
    warnings.push('هامش الربح منخفض جداً (أقل من 5%)');
  } else if (profitMargin > 0.8) {
    warnings.push('هامش الربح مرتفع جداً (أكثر من 80%) - قد يكون غير واقعي');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// تنظيف وتعقيم البيانات المتقدم
export const sanitizeProjectDataAdvanced = (data: any) => {
  const sanitizeText = (text: string, maxLength: number = 1000): string => {
    if (!text) return '';
    return text
      .trim()
      .replace(/[<>]/g, '') // إزالة HTML tags
      .replace(/javascript:/gi, '') // إزالة JavaScript URLs
      .replace(/on\w+=/gi, '') // إزالة event handlers
      .substring(0, maxLength);
  };

  const sanitizeArray = (arr: any[], maxItems: number = 10, maxLength: number = 200): string[] => {
    if (!Array.isArray(arr)) return [];
    return arr
      .map(item => sanitizeText(String(item), maxLength))
      .filter(item => item.length > 0)
      .slice(0, maxItems);
  };

  return {
    ...data,
    title: sanitizeText(data.title, 100),
    description: sanitizeText(data.description, 1000),
    targetMarket: sanitizeText(data.targetMarket, 500),
    competitiveAdvantages: sanitizeArray(data.competitiveAdvantages, 10, 200),
    riskFactors: sanitizeArray(data.riskFactors, 10, 200),
    competitors: sanitizeText(data.competitors, 300),
    // تنظيف البيانات الرقمية
    initialInvestment: Math.max(0, Math.min(10000000, Number(data.initialInvestment) || 0)),
    fixedCosts: Math.max(0, Number(data.fixedCosts) || 0),
    variableCosts: Math.max(0, Number(data.variableCosts) || 0),
    marketSize: Math.max(0, Number(data.marketSize) || 0),
    targetMarketShare: Math.max(0, Math.min(1, Number(data.targetMarketShare) || 0))
  };
};

// التحقق من صحة ملف الصوت
export const validateAudioFile = (file: File): { isValid: boolean; error?: string } => {
  const allowedTypes = ['audio/webm', 'audio/wav', 'audio/mp3', 'audio/m4a', 'audio/ogg'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  const minSize = 1000; // 1KB

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'نوع الملف الصوتي غير مدعوم' };
  }

  if (file.size > maxSize) {
    return { isValid: false, error: 'حجم الملف الصوتي كبير جداً (الحد الأقصى 10MB)' };
  }

  if (file.size < minSize) {
    return { isValid: false, error: 'حجم الملف الصوتي صغير جداً' };
  }

  return { isValid: true };
};

// دوال مساعدة للتحقق السريع
export const quickValidation = {
  email: (email: string) => validateEmailAdvanced(email).isValid,
  phone: (phone: string) => validateSaudiPhoneAdvanced(phone).isValid,
  password: (password: string) => getPasswordStrength(password).score >= 70,
  businessName: (name: string) => validateBusinessName(name).isValid,
  investment: (amount: number, type: string) => validateInvestmentAmount(amount, type) === null
};