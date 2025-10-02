import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target, 
  BarChart3,
  FileText,
  Code,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  Star,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Download,
  Share2,
  Play,
  Zap,
  Shield,
  Award,
  Globe,
  Building,
  Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

interface SectorPageProps {
  sectorName: string;
  onBack: () => void;
}

const SectorPage: React.FC<SectorPageProps> = ({ sectorName, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // محاكاة تحميل البيانات
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [sectorName]);

  // بيانات متخصصة لكل قطاع
  const getSectorData = (sector: string) => {
    const sectorData: Record<string, any> = {
      'تجارة إلكترونية': {
        icon: '🛒',
        color: 'from-saudi-green to-tech-blue',
        marketSize: '15 مليار ريال',
        growth: '25%',
        competitors: ['أمازون السعودية', 'نون', 'سوق.كوم'],
        opportunities: [
          'نمو التجارة الإلكترونية بنسبة 25% سنوياً',
          'زيادة استخدام الهواتف الذكية 97%',
          'دعم حكومي للتحول الرقمي',
          'تحسن في خدمات الدفع الإلكتروني'
        ],
        challenges: [
          'منافسة شديدة من اللاعبين الكبار',
          'تكاليف التسويق الرقمي المرتفعة',
          'تحديات اللوجستيات والتوصيل',
          'بناء الثقة مع العملاء الجدد'
        ],
        requirements: {
          minInvestment: 50000,
          licenses: ['سجل تجاري', 'رخصة تجارة إلكترونية', 'شهادة CITC'],
          team: ['مطور ويب', 'مسوق رقمي', 'مدير عمليات', 'خدمة عملاء']
        },
        financialProjections: [
          { year: 'السنة 1', revenue: 200000, costs: 150000, profit: 50000 },
          { year: 'السنة 2', revenue: 500000, costs: 300000, profit: 200000 },
          { year: 'السنة 3', revenue: 1200000, costs: 600000, profit: 600000 }
        ]
      },
      'مطاعم وأغذية': {
        icon: '🍽️',
        color: 'from-saudi-gold to-saudi-green',
        marketSize: '45 مليار ريال',
        growth: '12%',
        competitors: ['ماكدونالدز', 'الطازج', 'هرفي'],
        opportunities: [
          'تزايد الطلب على الطعام الصحي',
          'نمو خدمات التوصيل',
          'دعم المنتجات المحلية',
          'السياحة الداخلية المتنامية'
        ],
        challenges: [
          'ارتفاع تكاليف المواد الخام',
          'صعوبة الحصول على مواقع مميزة',
          'تحديات سلسلة التبريد',
          'المنافسة على العمالة المدربة'
        ],
        requirements: {
          minInvestment: 100000,
          licenses: ['رخصة بلدية', 'شهادة سلامة غذائية', 'رخصة دفاع مدني'],
          team: ['طاهي رئيسي', 'مدير مطعم', 'خدمة عملاء', 'عامل توصيل']
        },
        financialProjections: [
          { year: 'السنة 1', revenue: 300000, costs: 250000, profit: 50000 },
          { year: 'السنة 2', revenue: 600000, costs: 450000, profit: 150000 },
          { year: 'السنة 3', revenue: 900000, costs: 600000, profit: 300000 }
        ]
      },
      'تقنية وبرمجة': {
        icon: '💻',
        color: 'from-tech-blue to-saudi-gold',
        marketSize: '8 مليار ريال',
        growth: '35%',
        competitors: ['STC Solutions', 'Elm', 'Tabadul'],
        opportunities: [
          'التحول الرقمي الحكومي',
          'نمو قطاع الفنتك',
          'الاستثمار في الذكاء الاصطناعي',
          'برامج دعم الشركات الناشئة'
        ],
        challenges: [
          'نقص المواهب التقنية المتخصصة',
          'سرعة التطور التقني',
          'تحديات الأمن السيبراني',
          'المنافسة العالمية'
        ],
        requirements: {
          minInvestment: 75000,
          licenses: ['سجل تجاري', 'رخصة CITC', 'شهادة ISO'],
          team: ['مطور أول', 'مهندس نظم', 'مصمم UX/UI', 'مدير منتج']
        },
        financialProjections: [
          { year: 'السنة 1', revenue: 400000, costs: 300000, profit: 100000 },
          { year: 'السنة 2', revenue: 800000, costs: 500000, profit: 300000 },
          { year: 'السنة 3', revenue: 1500000, costs: 800000, profit: 700000 }
        ]
      },
      'صحة ولياقة': {
        icon: '💪',
        color: 'from-red-500 to-pink-500',
        marketSize: '12 مليار ريال',
        growth: '18%',
        competitors: ['فيتنس تايم', 'جولد جيم', 'صحة'],
        opportunities: [
          'زيادة الوعي الصحي',
          'برامج جودة الحياة',
          'نمو السياحة العلاجية',
          'التقنيات الصحية الذكية'
        ],
        challenges: [
          'تكاليف المعدات المرتفعة',
          'الحصول على التراخيص الطبية',
          'المنافسة مع المراكز الكبيرة',
          'تدريب الكوادر المتخصصة'
        ],
        requirements: {
          minInvestment: 150000,
          licenses: ['رخصة وزارة الصحة', 'شهادة سلامة', 'تراخيص المعدات'],
          team: ['مدرب معتمد', 'أخصائي تغذية', 'مدير عمليات', 'استقبال']
        },
        financialProjections: [
          { year: 'السنة 1', revenue: 250000, costs: 200000, profit: 50000 },
          { year: 'السنة 2', revenue: 450000, costs: 300000, profit: 150000 },
          { year: 'السنة 3', revenue: 700000, costs: 400000, profit: 300000 }
        ]
      },
      'تعليم وتدريب': {
        icon: '📚',
        color: 'from-saudi-green to-saudi-gold',
        marketSize: '10 مليار ريال',
        growth: '20%',
        competitors: ['إدراك', 'نون أكاديمي', 'معارف'],
        opportunities: [
          'التعليم الإلكتروني المتنامي',
          'برامج التدريب المهني',
          'الشراكات مع الجامعات',
          'التعلم المدمج والهجين'
        ],
        challenges: [
          'المنافسة مع المنصات العالمية',
          'تطوير المحتوى المحلي',
          'اعتماد الشهادات',
          'جذب المدربين المؤهلين'
        ],
        requirements: {
          minInvestment: 100000,
          licenses: ['ترخيص تعليمي', 'اعتماد المناهج', 'شهادات المدربين'],
          team: ['مدير أكاديمي', 'مطور محتوى', 'مدرب متخصص', 'منسق تقني']
        },
        financialProjections: [
          { year: 'السنة 1', revenue: 180000, costs: 140000, profit: 40000 },
          { year: 'السنة 2', revenue: 350000, costs: 220000, profit: 130000 },
          { year: 'السنة 3', revenue: 600000, costs: 350000, profit: 250000 }
        ]
      },
      'تقنية مالية': {
        icon: '💳',
        color: 'from-tech-blue to-saudi-green',
        marketSize: '8 مليار ريال',
        growth: '40%',
        competitors: ['تمارا', 'تابي', 'سامبا'],
        opportunities: [
          'التحول للمدفوعات الرقمية',
          'الشمول المالي',
          'تقنيات البلوك تشين',
          'الذكاء الاصطناعي في التمويل'
        ],
        challenges: [
          'اللوائح الصارمة من SAMA',
          'متطلبات الأمان العالية',
          'بناء الثقة مع العملاء',
          'رؤوس الأموال الكبيرة المطلوبة'
        ],
        requirements: {
          minInvestment: 500000,
          licenses: ['ترخيص SAMA', 'شهادة PCI DSS', 'امتثال AML'],
          team: ['مطور بلوك تشين', 'خبير أمان', 'محلل مخاطر', 'مختص امتثال']
        },
        financialProjections: [
          { year: 'السنة 1', revenue: 600000, costs: 500000, profit: 100000 },
          { year: 'السنة 2', revenue: 1200000, costs: 800000, profit: 400000 },
          { year: 'السنة 3', revenue: 2500000, costs: 1500000, profit: 1000000 }
        ]
      }
    };

    return sectorData[sector] || sectorData['تجارة إلكترونية'];
  };

  const sectorData = getSectorData(sectorName);
  const tabs = [
    { id: 'overview', title: 'نظرة عامة', icon: BarChart3 },
    { id: 'market', title: 'تحليل السوق', icon: TrendingUp },
    { id: 'financial', title: 'النموذج المالي', icon: DollarSign },
    { id: 'requirements', title: 'المتطلبات', icon: CheckCircle },
    { id: 'guide', title: 'دليل البدء', icon: Lightbulb }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* إحصائيات القطاع */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
                <DollarSign className="h-8 w-8 text-saudi-green mx-auto mb-3" />
                <h4 className="text-2xl font-bold text-saudi-green mb-1">{sectorData.marketSize}</h4>
                <p className="font-almarai text-gray-600">حجم السوق</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
                <TrendingUp className="h-8 w-8 text-saudi-gold mx-auto mb-3" />
                <h4 className="text-2xl font-bold text-saudi-gold mb-1">{sectorData.growth}</h4>
                <p className="font-almarai text-gray-600">معدل النمو السنوي</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
                <Users className="h-8 w-8 text-tech-blue mx-auto mb-3" />
                <h4 className="text-2xl font-bold text-tech-blue mb-1">{sectorData.competitors.length}</h4>
                <p className="font-almarai text-gray-600">منافسين رئيسيين</p>
              </div>
            </div>

            {/* الفرص والتحديات */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <h3 className="text-lg font-almarai font-bold text-green-800">الفرص المتاحة</h3>
                </div>
                <ul className="space-y-3">
                  {sectorData.opportunities.map((opportunity: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-green-700 font-almarai text-sm">{opportunity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                  <h3 className="text-lg font-almarai font-bold text-yellow-800">التحديات</h3>
                </div>
                <ul className="space-y-3">
                  {sectorData.challenges.map((challenge: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-1 flex-shrink-0" />
                      <span className="text-yellow-700 font-almarai text-sm">{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );

      case 'market':
        return (
          <div className="space-y-8">
            {/* تحليل المنافسين */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-almarai font-bold text-gray-800 mb-4 text-right">
                المنافسون الرئيسيون
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sectorData.competitors.map((competitor: string, index: number) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                    <Building className="h-6 w-6 text-saudi-green mx-auto mb-2" />
                    <h4 className="font-almarai font-bold text-gray-800">{competitor}</h4>
                    <p className="text-sm text-gray-600 font-almarai">منافس قوي</p>
                  </div>
                ))}
              </div>
            </div>

            {/* اتجاهات السوق */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-almarai font-bold text-blue-800 mb-4 text-right">
                اتجاهات السوق الحالية
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <TrendingUp className="h-6 w-6 text-saudi-green mb-2" />
                  <h4 className="font-almarai font-bold text-gray-800 mb-2">النمو المتوقع</h4>
                  <p className="text-blue-700 font-almarai text-sm">
                    نمو قوي متوقع خلال السنوات القادمة مدفوع برؤية 2030
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <Target className="h-6 w-6 text-saudi-gold mb-2" />
                  <h4 className="font-almarai font-bold text-gray-800 mb-2">الفرص الناشئة</h4>
                  <p className="text-blue-700 font-almarai text-sm">
                    فرص جديدة في التقنيات المتقدمة والحلول المبتكرة
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'financial':
        return (
          <div className="space-y-8">
            {/* الرسم البياني المالي */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-almarai font-bold text-gray-800 mb-4 text-right">
                الإسقاطات المالية المتوقعة
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={sectorData.financialProjections}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" tick={{ fontSize: 12, fontFamily: 'Almarai' }} />
                  <YAxis tick={{ fontSize: 12, fontFamily: 'Almarai' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontFamily: 'Almarai'
                    }}
                    formatter={(value) => [`${value.toLocaleString()} ريال`]}
                  />
                  <Area type="monotone" dataKey="revenue" stackId="1" stroke="#006B3F" fill="#006B3F" fillOpacity={0.6} name="الإيرادات" />
                  <Area type="monotone" dataKey="costs" stackId="2" stroke="#FFD700" fill="#FFD700" fillOpacity={0.6} name="التكاليف" />
                  <Area type="monotone" dataKey="profit" stackId="3" stroke="#003366" fill="#003366" fillOpacity={0.6} name="الأرباح" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* مؤشرات مالية */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-saudi-green/10 border border-saudi-green/20 rounded-xl p-6 text-center">
                <h4 className="text-2xl font-bold text-saudi-green mb-1">
                  {sectorData.requirements.minInvestment.toLocaleString()} ريال
                </h4>
                <p className="font-almarai text-gray-700">الحد الأدنى للاستثمار</p>
              </div>
              
              <div className="bg-saudi-gold/10 border border-saudi-gold/20 rounded-xl p-6 text-center">
                <h4 className="text-2xl font-bold text-saudi-gold mb-1">18-24 شهر</h4>
                <p className="font-almarai text-gray-700">فترة الاسترداد المتوقعة</p>
              </div>
              
              <div className="bg-tech-blue/10 border border-tech-blue/20 rounded-xl p-6 text-center">
                <h4 className="text-2xl font-bold text-tech-blue mb-1">25-35%</h4>
                <p className="font-almarai text-gray-700">هامش الربح المتوقع</p>
              </div>
            </div>
          </div>
        );

      case 'requirements':
        return (
          <div className="space-y-8">
            {/* التراخيص المطلوبة */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-almarai font-bold text-gray-800 mb-4 text-right">
                التراخيص والتصاريح المطلوبة
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sectorData.requirements.licenses.map((license: string, index: number) => (
                  <div key={index} className="bg-saudi-green/10 border border-saudi-green/20 rounded-lg p-4 text-center">
                    <Shield className="h-6 w-6 text-saudi-green mx-auto mb-2" />
                    <h4 className="font-almarai font-bold text-gray-800">{license}</h4>
                  </div>
                ))}
              </div>
            </div>

            {/* الفريق المطلوب */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-almarai font-bold text-gray-800 mb-4 text-right">
                الفريق المطلوب
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sectorData.requirements.team.map((role: string, index: number) => (
                  <div key={index} className="bg-tech-blue/10 border border-tech-blue/20 rounded-lg p-4 flex items-center gap-3">
                    <Users className="h-5 w-5 text-tech-blue" />
                    <span className="font-almarai text-gray-800">{role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'guide':
        return (
          <div className="space-y-8">
            {/* خطوات البدء */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-almarai font-bold text-gray-800 mb-6 text-right">
                خطوات البدء في {sectorName}
              </h3>
              
              <div className="space-y-6">
                {[
                  { step: 1, title: 'دراسة السوق', desc: 'تحليل المنافسين والفرص المتاحة', icon: BarChart3 },
                  { step: 2, title: 'التخطيط المالي', desc: 'حساب التكاليف والإيرادات المتوقعة', icon: DollarSign },
                  { step: 3, title: 'الحصول على التراخيص', desc: 'استخراج التصاريح والتراخيص المطلوبة', icon: Shield },
                  { step: 4, title: 'بناء الفريق', desc: 'توظيف الكوادر المتخصصة', icon: Users },
                  { step: 5, title: 'الإطلاق والتسويق', desc: 'بدء العمليات وحملات التسويق', icon: Target }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-saudi-green/5 transition-colors"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-saudi-green to-saudi-gold rounded-full flex items-center justify-center text-white font-bold">
                      {item.step}
                    </div>
                    <item.icon className="h-6 w-6 text-saudi-green" />
                    <div className="flex-1 text-right">
                      <h4 className="font-almarai font-bold text-gray-800">{item.title}</h4>
                      <p className="text-gray-600 font-almarai text-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* نصائح متخصصة */}
            <div className="bg-saudi-green/5 border border-saudi-green/20 rounded-xl p-6">
              <h3 className="text-lg font-almarai font-bold text-saudi-green mb-4 text-right">
                نصائح متخصصة لقطاع {sectorName}
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-saudi-green mt-1" />
                  <p className="text-saudi-green font-almarai text-sm text-right">
                    ابدأ بدراسة شاملة للسوق المحلي وتحديد الفجوات الموجودة
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-saudi-green mt-1" />
                  <p className="text-saudi-green font-almarai text-sm text-right">
                    ركز على بناء علاقات قوية مع الموردين والشركاء المحليين
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-saudi-green mt-1" />
                  <p className="text-saudi-green font-almarai text-sm text-right">
                    استثمر في التقنيات الحديثة لتحسين الكفاءة والجودة
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-almarai font-bold text-gray-800 mb-2">
              قيد التطوير
            </h3>
            <p className="text-gray-600 font-almarai">
              محتوى هذا القسم قيد التطوير...
            </p>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-light-green flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-saudi-green border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="font-almarai text-gray-600">جاري تحميل بيانات {sectorName}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-light-green">
      {/* رأس الصفحة */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={onBack}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-gray-600 hover:text-saudi-green transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-almarai">العودة للرئيسية</span>
            </motion.button>

            <div className="text-right">
              <h1 className="text-2xl md:text-3xl font-almarai font-bold text-gray-800 flex items-center gap-3">
                <span className="text-3xl">{sectorData.icon}</span>
                {sectorName}
              </h1>
              <p className="text-gray-600 font-almarai">دليل شامل للبدء في هذا القطاع</p>
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* التبويبات */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-4 font-almarai whitespace-nowrap transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'border-b-3 border-saudi-green bg-light-green text-saudi-green'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.title}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* أزرار الإجراءات */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.hash = 'flow';
                }
              }}
              className="bg-gradient-to-r from-saudi-green to-saudi-gold text-white px-8 py-4 rounded-xl font-almarai font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <FileText className="h-5 w-5" />
              احصل على دراسة جدوى مخصصة
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.hash = 'help';
                }
              }}
              className="bg-white border-2 border-saudi-green text-saudi-green px-8 py-4 rounded-xl font-almarai font-bold hover:bg-light-green transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Phone className="h-5 w-5" />
              استشارة مجانية
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectorPage;