// إعدادات مسبقة للقطاعات المختلفة
export interface SectorPreset {
  id: string;
  name: string;
  defaults: {
    initialInvestment: number;
    cogsRate: number;
    fixedCosts: number;
    variableOpexRate: number;
    marketGrowthRate: number;
    competitionLevel: 'low' | 'medium' | 'high';
    seasonality: number[];
    keyMetrics: string[];
    commonChallenges: string[];
    opportunities: string[];
  };
}

export const sectorPresets: SectorPreset[] = [
  {
    id: 'ecommerce',
    name: 'تجارة إلكترونية',
    defaults: {
      initialInvestment: 150000,
      cogsRate: 0.45,
      fixedCosts: 25000,
      variableOpexRate: 0.15,
      marketGrowthRate: 0.25,
      competitionLevel: 'high',
      seasonality: [1.0, 1.0, 1.1, 1.1, 1.2, 1.0, 0.9, 0.9, 1.1, 1.2, 1.4, 1.5], // رمضان وموسم العودة للمدارس
      keyMetrics: ['CAC', 'LTV', 'Conversion Rate', 'AOV', 'Return Rate'],
      commonChallenges: [
        'منافسة شديدة من اللاعبين الكبار',
        'تكاليف التسويق الرقمي المرتفعة',
        'تحديات اللوجستيات والتوصيل',
        'بناء الثقة مع العملاء الجدد'
      ],
      opportunities: [
        'نمو التجارة الإلكترونية بنسبة 25% سنوياً',
        'زيادة استخدام الهواتف الذكية 97%',
        'دعم حكومي للتحول الرقمي',
        'تحسن في خدمات الدفع الإلكتروني'
      ]
    }
  },
  {
    id: 'food',
    name: 'مطاعم وأغذية',
    defaults: {
      initialInvestment: 200000,
      cogsRate: 0.35,
      fixedCosts: 35000,
      variableOpexRate: 0.08,
      marketGrowthRate: 0.12,
      competitionLevel: 'high',
      seasonality: [0.9, 0.9, 1.0, 1.0, 1.3, 1.1, 1.0, 1.0, 1.1, 1.0, 1.2, 1.4], // رمضان وإجازات
      keyMetrics: ['Average Order Value', 'Table Turnover', 'Food Cost %', 'Customer Satisfaction'],
      commonChallenges: [
        'ارتفاع تكاليف المواد الخام',
        'صعوبة الحصول على مواقع مميزة',
        'تحديات سلسلة التبريد',
        'المنافسة على العمالة المدربة'
      ],
      opportunities: [
        'تزايد الطلب على الطعام الصحي',
        'نمو خدمات التوصيل',
        'دعم المنتجات المحلية',
        'السياحة الداخلية المتنامية'
      ]
    }
  },
  {
    id: 'tech',
    name: 'تقنية وبرمجة',
    defaults: {
      initialInvestment: 120000,
      cogsRate: 0.25,
      fixedCosts: 40000,
      variableOpexRate: 0.12,
      marketGrowthRate: 0.35,
      competitionLevel: 'medium',
      seasonality: [1.0, 1.0, 1.1, 1.1, 1.0, 1.0, 0.9, 0.9, 1.2, 1.2, 1.1, 1.0],
      keyMetrics: ['MRR', 'Churn Rate', 'CAC Payback', 'Feature Adoption'],
      commonChallenges: [
        'نقص المواهب التقنية المتخصصة',
        'سرعة التطور التقني',
        'تحديات الأمن السيبراني',
        'المنافسة العالمية'
      ],
      opportunities: [
        'التحول الرقمي الحكومي',
        'نمو قطاع الفنتك',
        'الاستثمار في الذكاء الاصطناعي',
        'برامج دعم الشركات الناشئة'
      ]
    }
  },
  {
    id: 'health',
    name: 'صحة ولياقة',
    defaults: {
      initialInvestment: 300000,
      cogsRate: 0.30,
      fixedCosts: 45000,
      variableOpexRate: 0.10,
      marketGrowthRate: 0.18,
      competitionLevel: 'medium',
      seasonality: [1.2, 1.3, 1.1, 1.0, 0.9, 0.8, 0.8, 0.9, 1.1, 1.0, 1.0, 1.1], // ذروة في بداية السنة
      keyMetrics: ['Member Retention', 'Utilization Rate', 'Revenue per Member', 'Class Attendance'],
      commonChallenges: [
        'تكاليف المعدات المرتفعة',
        'الحصول على التراخيص الطبية',
        'المنافسة مع المراكز الكبيرة',
        'تدريب الكوادر المتخصصة'
      ],
      opportunities: [
        'زيادة الوعي الصحي',
        'برامج جودة الحياة',
        'نمو السياحة العلاجية',
        'التقنيات الصحية الذكية'
      ]
    }
  },
  {
    id: 'education',
    name: 'تعليم وتدريب',
    defaults: {
      initialInvestment: 180000,
      cogsRate: 0.40,
      fixedCosts: 30000,
      variableOpexRate: 0.08,
      marketGrowthRate: 0.20,
      competitionLevel: 'medium',
      seasonality: [1.0, 1.1, 1.0, 1.0, 0.8, 0.7, 0.8, 1.2, 1.3, 1.2, 1.0, 0.9], // موسم دراسي
      keyMetrics: ['Student Retention', 'Course Completion', 'Job Placement Rate', 'Student Satisfaction'],
      commonChallenges: [
        'المنافسة مع المنصات العالمية',
        'تطوير المحتوى المحلي',
        'اعتماد الشهادات',
        'جذب المدربين المؤهلين'
      ],
      opportunities: [
        'التعليم الإلكتروني المتنامي',
        'برامج التدريب المهني',
        'الشراكات مع الجامعات',
        'التعلم المدمج والهجين'
      ]
    }
  },
  {
    id: 'fintech',
    name: 'تقنية مالية',
    defaults: {
      initialInvestment: 800000,
      cogsRate: 0.20,
      fixedCosts: 80000,
      variableOpexRate: 0.15,
      marketGrowthRate: 0.40,
      competitionLevel: 'high',
      seasonality: [1.0, 1.0, 1.1, 1.0, 1.2, 1.0, 1.0, 1.0, 1.1, 1.0, 1.3, 1.2], // نهاية السنة المالية
      keyMetrics: ['Transaction Volume', 'Take Rate', 'User Acquisition', 'Regulatory Compliance'],
      commonChallenges: [
        'اللوائح الصارمة من SAMA',
        'متطلبات الأمان العالية',
        'بناء الثقة مع العملاء',
        'رؤوس الأموال الكبيرة المطلوبة'
      ],
      opportunities: [
        'التحول للمدفوعات الرقمية',
        'الشمول المالي',
        'تقنيات البلوك تشين',
        'الذكاء الاصطناعي في التمويل'
      ]
    }
  }
];

export const getSectorPreset = (sectorId: string): SectorPreset | null => {
  return sectorPresets.find(preset => preset.id === sectorId) || null;
};

export const getSectorDefaults = (sectorName: string): SectorPreset['defaults'] | null => {
  const sectorMap: Record<string, string> = {
    'تجارة إلكترونية': 'ecommerce',
    'مطاعم وأغذية': 'food',
    'تقنية وبرمجة': 'tech',
    'صحة ولياقة': 'health',
    'تعليم وتدريب': 'education',
    'تقنية مالية': 'fintech'
  };
  
  const sectorId = sectorMap[sectorName];
  const preset = getSectorPreset(sectorId);
  return preset?.defaults || null;
};