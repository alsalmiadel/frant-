import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target, 
  BarChart3,
  FileText,
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
  Briefcase,
  Clock,
  PieChart,
  LineChart
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';
import toast from 'react-hot-toast';

interface EnhancedSectorPageProps {
  sectorName: string;
  onBack: () => void;
}

interface SectorData {
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  color: string;
  marketSize: string;
  growthRate: number;
  averageInvestment: number;
  paybackPeriod: number;
  profitMargin: number;
  riskLevel: 'low' | 'medium' | 'high';
  
  problems: {
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
  }[];
  
  solutions: {
    title: string;
    description: string;
    benefits: string[];
  }[];
  
  deliverables: {
    category: string;
    items: {
      name: string;
      description: string;
      timeline: string;
    }[];
  }[];
  
  sla: {
    responseTime: string;
    deliveryTime: string;
    revisions: number;
    support: string;
  };
  
  caseStudies: {
    title: string;
    client: string;
    challenge: string;
    solution: string;
    results: string[];
    roi: string;
  }[];
  
  marketInsights: {
    trends: { title: string; impact: string; }[];
    opportunities: { title: string; potential: string; }[];
    challenges: { title: string; mitigation: string; }[];
  };
  
  financialProjections: {
    timeframe: string;
    revenue: number;
    costs: number;
    profit: number;
  }[];
  
  competitorAnalysis: {
    name: string;
    marketShare: number;
    strengths: string[];
    weaknesses: string[];
  }[];
  
  regulations: {
    title: string;
    authority: string;
    requirement: string;
    timeline: string;
  }[];
}

const EnhancedSectorPage: React.FC<EnhancedSectorPageProps> = ({ sectorName, onBack }) => {
  const [sectorData, setSectorData] = useState<SectorData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [showCTAModal, setShowCTAModal] = useState(false);

  useEffect(() => {
    loadSectorData();
  }, [sectorName]);

  const loadSectorData = async () => {
    setIsLoading(true);
    try {
      // محاكاة تحميل بيانات القطاع
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: SectorData = {
        name: 'المطاعم والمقاهي',
        nameEn: 'Restaurants & Cafes',
        description: 'قطاع المطاعم والمقاهي يشهد نمواً مستمراً في المملكة، مدفوعاً برؤية 2030 والاهتمام المتزايد بتجربة الطعام وثقافة الضيافة.',
        icon: '🍽️',
        color: 'from-orange-500 to-red-500',
        marketSize: '45 مليار ريال',
        growthRate: 8.5,
        averageInvestment: 500000,
        paybackPeriod: 18,
        profitMargin: 25,
        riskLevel: 'medium',
        
        problems: [
          {
            title: 'صعوبة اختيار الموقع المناسب',
            description: 'تحديد الموقع الأمثل يتطلب تحليل دقيق للمنطقة والمنافسين والجمهور المستهدف',
            impact: 'high'
          },
          {
            title: 'تقدير التكاليف التشغيلية',
            description: 'حساب التكاليف الفعلية للإيجار والرواتب والمواد الخام والمرافق',
            impact: 'high'
          },
          {
            title: 'فهم المتطلبات التنظيمية',
            description: 'التراخيص المطلوبة من البلدية والصحة والدفاع المدني',
            impact: 'medium'
          }
        ],
        
        solutions: [
          {
            title: 'تحليل الموقع والمنافسين',
            description: 'نقدم تحليلاً شاملاً للموقع المقترح مع دراسة المنافسين في المنطقة',
            benefits: ['خرائط تفاعلية للمنافسين', 'تحليل كثافة المرور', 'تقييم الجمهور المستهدف']
          },
          {
            title: 'نموذج مالي متقدم',
            description: 'نموذج مالي شامل يغطي جميع جوانب المشروع مع سيناريوهات متعددة',
            benefits: ['توقعات مالية دقيقة', 'تحليل الحساسية', 'نقطة التعادل']
          },
          {
            title: 'دليل التراخيص والامتثال',
            description: 'دليل شامل للحصول على جميع التراخيص المطلوبة',
            benefits: ['قائمة مرجعية كاملة', 'جداول زمنية', 'جهات الاتصال']
          }
        ],
        
        deliverables: [
          {
            category: 'الدراسة الأساسية',
            items: [
              { name: 'دراسة السوق', description: 'تحليل شامل للسوق المحلي والفرص', timeline: '3-5 أيام' },
              { name: 'النموذج المالي', description: 'توقعات مالية تفصيلية لـ 5 سنوات', timeline: '2-3 أيام' },
              { name: 'تحليل المخاطر', description: 'تقييم المخاطر وخطط التخفيف', timeline: '1-2 أيام' }
            ]
          },
          {
            category: 'التحليل المتقدم',
            items: [
              { name: 'تحليل المنافسين', description: 'دراسة تفصيلية للمنافسين المباشرين', timeline: '2-3 أيام' },
              { name: 'تحليل الموقع', description: 'تقييم الموقع مع خرائط تفاعلية', timeline: '1-2 أيام' },
              { name: 'استراتيجية التسويق', description: 'خطة تسويقية شاملة للإطلاق', timeline: '2-3 أيام' }
            ]
          },
          {
            category: 'المخرجات النهائية',
            items: [
              { name: 'التقرير النهائي', description: 'تقرير شامل بتنسيق احترافي', timeline: '1-2 أيام' },
              { name: 'العرض التقديمي', description: 'عرض للمستثمرين والجهات التمويلية', timeline: '1 يوم' },
              { name: 'ملفات Excel', description: 'نماذج مالية قابلة للتعديل', timeline: '1 يوم' }
            ]
          }
        ],
        
        sla: {
          responseTime: '2 ساعة',
          deliveryTime: '7-10 أيام عمل',
          revisions: 3,
          support: '30 يوم'
        },
        
        caseStudies: [
          {
            title: 'مطعم الأصالة - الرياض',
            client: 'شركة الضيافة المتميزة',
            challenge: 'إطلاق مطعم تراثي في منطقة تنافسية عالية',
            solution: 'تحليل شامل للسوق مع تركيز على التميز والهوية التراثية',
            results: ['نمو الإيرادات 150% في السنة الأولى', 'استرداد رأس المال في 14 شهر', 'تقييم العملاء 4.8/5'],
            roi: '180%'
          },
          {
            title: 'مقهى النخبة - جدة',
            client: 'مستثمر فردي',
            challenge: 'دخول سوق المقاهي المتخصصة في منطقة راقية',
            solution: 'دراسة تفصيلية للجمهور المستهدف وتحليل المنافسين',
            results: ['وصول لنقطة التعادل في 8 أشهر', 'هامش ربح 32%', 'قاعدة عملاء مخلصين 500+'],
            roi: '145%'
          }
        ],
        
        marketInsights: {
          trends: [
            { title: 'نمو طلبات التوصيل', impact: 'ارتفاع بنسبة 40% سنوياً' },
            { title: 'الاهتمام بالطعام الصحي', impact: 'زيادة الطلب بنسبة 25%' },
            { title: 'التجارب التفاعلية', impact: 'تحسن رضا العملاء بنسبة 30%' }
          ],
          opportunities: [
            { title: 'الأحياء الجديدة', potential: 'نمو سكاني 15% سنوياً' },
            { title: 'خدمات الكيترينغ', potential: 'سوق بقيمة 2 مليار ريال' },
            { title: 'المفاهيم المتخصصة', potential: 'هوامش ربح أعلى بـ 40%' }
          ],
          challenges: [
            { title: 'ارتفاع تكاليف التشغيل', mitigation: 'تحسين الكفاءة التشغيلية' },
            { title: 'نقص العمالة المؤهلة', mitigation: 'برامج التدريب والتطوير' },
            { title: 'تغير أذواق المستهلكين', mitigation: 'المرونة في القائمة والخدمات' }
          ]
        },
        
        financialProjections: [
          { timeframe: 'السنة الأولى', revenue: 1200000, costs: 900000, profit: 300000 },
          { timeframe: 'السنة الثانية', revenue: 1440000, costs: 1020000, profit: 420000 },
          { timeframe: 'السنة الثالثة', revenue: 1728000, costs: 1140000, profit: 588000 },
          { timeframe: 'السنة الرابعة', revenue: 1900000, costs: 1235000, profit: 665000 },
          { timeframe: 'السنة الخامسة', revenue: 2090000, costs: 1340000, profit: 750000 }
        ],
        
        competitorAnalysis: [
          { name: 'المطاعم السريعة', marketShare: 35, strengths: ['سرعة الخدمة', 'أسعار منافسة'], weaknesses: ['جودة محدودة', 'تجربة أساسية'] },
          { name: 'المطاعم الفاخرة', marketShare: 25, strengths: ['جودة عالية', 'تجربة مميزة'], weaknesses: ['أسعار عالية', 'شريحة محدودة'] },
          { name: 'المطاعم العائلية', marketShare: 40, strengths: ['تنوع القائمة', 'أجواء عائلية'], weaknesses: ['تكاليف عالية', 'منافسة شديدة'] }
        ],
        
        regulations: [
          { title: 'ترخيص البلدية', authority: 'الأمانة/البلدية', requirement: 'ترخيص مزاولة النشاط', timeline: '2-4 أسابيع' },
          { title: 'ترخيص الصحة', authority: 'وزارة الصحة', requirement: 'شهادة صحية للمنشأة', timeline: '1-2 أسابيع' },
          { title: 'ترخيص الدفاع المدني', authority: 'الدفاع المدني', requirement: 'شهادة السلامة', timeline: '1-3 أسابيع' },
          { title: 'السجل التجاري', authority: 'وزارة التجارة', requirement: 'تسجيل النشاط التجاري', timeline: '1-2 أسابيع' }
        ]
      };
      
      setSectorData(mockData);
    } catch (error) {
      toast.error('خطأ في تحميل بيانات القطاع');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCTAClick = (action: string) => {
    toast.success(`تم النقر على: ${action}`);
    setShowCTAModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saudi-green mx-auto mb-4"></div>
          <p className="text-gray-600 font-almarai">جاري تحميل بيانات القطاع...</p>
        </div>
      </div>
    );
  }

  if (!sectorData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 font-almarai mb-2">القطاع غير متوفر</h2>
          <p className="text-gray-600 font-almarai mb-4">لم نتمكن من العثور على بيانات هذا القطاع</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-saudi-green text-white rounded-lg hover:bg-green-700 transition-colors font-almarai"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-light-green">
      {/* رأس الصفحة */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </button>
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${sectorData.color} flex items-center justify-center text-3xl`}>
                {sectorData.icon}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 font-almarai">
                  {sectorData.name}
                </h1>
                <p className="text-gray-600 font-almarai">
                  {sectorData.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* مؤشرات رئيسية */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-almarai">حجم السوق</p>
                <p className="text-lg font-bold text-gray-900 font-almarai">{sectorData.marketSize}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-almarai">معدل النمو</p>
                <p className="text-lg font-bold text-gray-900 font-almarai">{sectorData.growthRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-almarai">الاستثمار المتوسط</p>
                <p className="text-lg font-bold text-gray-900 font-almarai">{sectorData.averageInvestment.toLocaleString()} ر.س</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-almarai">فترة الاسترداد</p>
                <p className="text-lg font-bold text-gray-900 font-almarai">{sectorData.paybackPeriod} شهر</p>
              </div>
            </div>
          </div>
        </div>

        {/* التبويبات */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {[
                { id: 'overview', label: 'نظرة عامة', icon: Eye },
                { id: 'problems', label: 'التحديات', icon: AlertTriangle },
                { id: 'solutions', label: 'الحلول', icon: CheckCircle },
                { id: 'deliverables', label: 'المخرجات', icon: FileText },
                { id: 'insights', label: 'رؤى السوق', icon: TrendingUp },
                { id: 'cases', label: 'قصص نجاح', icon: Star }
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-almarai font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-saudi-green border-b-2 border-saudi-green'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'overview' && <OverviewTab data={sectorData} />}
            {activeTab === 'problems' && <ProblemsTab problems={sectorData.problems} />}
            {activeTab === 'solutions' && <SolutionsTab solutions={sectorData.solutions} />}
            {activeTab === 'deliverables' && <DeliverablesTab deliverables={sectorData.deliverables} sla={sectorData.sla} />}
            {activeTab === 'insights' && <InsightsTab insights={sectorData.marketInsights} projections={sectorData.financialProjections} />}
            {activeTab === 'cases' && <CaseStudiesTab cases={sectorData.caseStudies} />}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-saudi-green to-saudi-gold rounded-2xl shadow-xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold font-almarai mb-4">
            جاهز لبدء مشروعك في قطاع {sectorData.name}؟
          </h2>
          <p className="text-xl font-almarai mb-8 opacity-90">
            احصل على دراسة جدوى شاملة ومخصصة لمشروعك خلال 7-10 أيام عمل
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleCTAClick('طلب دراسة جدوى')}
              className="bg-white text-saudi-green px-8 py-4 rounded-xl font-almarai font-bold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-3"
            >
              <FileText className="h-6 w-6" />
              طلب دراسة جدوى
            </button>
            <button
              onClick={() => handleCTAClick('تحدث مع خبير')}
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-almarai font-bold text-lg hover:bg-white hover:text-saudi-green transition-colors flex items-center justify-center gap-3"
            >
              <Phone className="h-6 w-6" />
              تحدث مع خبير
            </button>
          </div>
        </div>
      </div>

      {/* نافذة CTA */}
      <AnimatePresence>
        {showCTAModal && (
          <CTAModal onClose={() => setShowCTAModal(false)} sectorName={sectorData.name} />
        )}
      </AnimatePresence>
    </div>
  );
};

// مكونات التبويبات
const OverviewTab: React.FC<{ data: SectorData }> = ({ data }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div>
      <h3 className="text-xl font-bold text-gray-900 font-almarai mb-4">الخصائص الرئيسية</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <span className="font-medium text-gray-700 font-almarai">هامش الربح المتوقع</span>
          <span className="font-bold text-saudi-green font-almarai">{data.profitMargin}%</span>
        </div>
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <span className="font-medium text-gray-700 font-almarai">مستوى المخاطر</span>
          <span className={`font-bold font-almarai ${
            data.riskLevel === 'low' ? 'text-green-600' :
            data.riskLevel === 'medium' ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {data.riskLevel === 'low' ? 'منخفض' : data.riskLevel === 'medium' ? 'متوسط' : 'عالي'}
          </span>
        </div>
      </div>
    </div>
    
    <div>
      <h3 className="text-xl font-bold text-gray-900 font-almarai mb-4">التوقعات المالية</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data.financialProjections.slice(0, 3)}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timeframe" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="profit" fill="#006B3F" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const ProblemsTab: React.FC<{ problems: SectorData['problems'] }> = ({ problems }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {problems.map((problem, index) => (
      <div key={index} className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            problem.impact === 'high' ? 'bg-red-100' :
            problem.impact === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
          }`}>
            <AlertTriangle className={`h-5 w-5 ${
              problem.impact === 'high' ? 'text-red-600' :
              problem.impact === 'medium' ? 'text-yellow-600' : 'text-green-600'
            }`} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 font-almarai">{problem.title}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${
              problem.impact === 'high' ? 'bg-red-100 text-red-800' :
              problem.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
            }`}>
              تأثير {problem.impact === 'high' ? 'عالي' : problem.impact === 'medium' ? 'متوسط' : 'منخفض'}
            </span>
          </div>
        </div>
        <p className="text-gray-700 font-almarai">{problem.description}</p>
      </div>
    ))}
  </div>
);

const SolutionsTab: React.FC<{ solutions: SectorData['solutions'] }> = ({ solutions }) => (
  <div className="space-y-8">
    {solutions.map((solution, index) => (
      <div key={index} className="bg-green-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 font-almarai mb-2">{solution.title}</h3>
            <p className="text-gray-700 font-almarai mb-4">{solution.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {solution.benefits.map((benefit, benefitIndex) => (
                <div key={benefitIndex} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700 font-almarai">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const DeliverablesTab: React.FC<{ deliverables: SectorData['deliverables']; sla: SectorData['sla'] }> = ({ deliverables, sla }) => (
  <div className="space-y-8">
    {deliverables.map((category, index) => (
      <div key={index} className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 font-almarai mb-4">{category.category}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {category.items.map((item, itemIndex) => (
            <div key={itemIndex} className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-bold text-gray-900 font-almarai mb-2">{item.name}</h4>
              <p className="text-sm text-gray-600 font-almarai mb-2">{item.description}</p>
              <div className="flex items-center gap-2 text-xs text-blue-600">
                <Clock className="h-3 w-3" />
                <span className="font-almarai">{item.timeline}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
    
    {/* SLA */}
    <div className="bg-saudi-green bg-opacity-10 border border-saudi-green rounded-xl p-6">
      <h3 className="text-xl font-bold text-gray-900 font-almarai mb-4">اتفاقية مستوى الخدمة (SLA)</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-saudi-green rounded-full flex items-center justify-center mx-auto mb-2">
            <Clock className="h-8 w-8 text-white" />
          </div>
          <p className="font-bold text-gray-900 font-almarai">{sla.responseTime}</p>
          <p className="text-sm text-gray-600 font-almarai">وقت الاستجابة</p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 bg-saudi-green rounded-full flex items-center justify-center mx-auto mb-2">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <p className="font-bold text-gray-900 font-almarai">{sla.deliveryTime}</p>
          <p className="text-sm text-gray-600 font-almarai">وقت التسليم</p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 bg-saudi-green rounded-full flex items-center justify-center mx-auto mb-2">
            <Edit className="h-8 w-8 text-white" />
          </div>
          <p className="font-bold text-gray-900 font-almarai">{sla.revisions}</p>
          <p className="text-sm text-gray-600 font-almarai">تعديلات مجانية</p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 bg-saudi-green rounded-full flex items-center justify-center mx-auto mb-2">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <p className="font-bold text-gray-900 font-almarai">{sla.support}</p>
          <p className="text-sm text-gray-600 font-almarai">دعم مجاني</p>
        </div>
      </div>
    </div>
  </div>
);

const InsightsTab: React.FC<{ insights: SectorData['marketInsights']; projections: SectorData['financialProjections'] }> = ({ insights, projections }) => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="font-bold text-blue-900 font-almarai mb-4">الاتجاهات</h3>
        <div className="space-y-3">
          {insights.trends.map((trend, index) => (
            <div key={index} className="bg-white rounded-lg p-3">
              <h4 className="font-medium text-gray-900 font-almarai text-sm">{trend.title}</h4>
              <p className="text-xs text-blue-600 font-almarai">{trend.impact}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-green-50 rounded-xl p-6">
        <h3 className="font-bold text-green-900 font-almarai mb-4">الفرص</h3>
        <div className="space-y-3">
          {insights.opportunities.map((opportunity, index) => (
            <div key={index} className="bg-white rounded-lg p-3">
              <h4 className="font-medium text-gray-900 font-almarai text-sm">{opportunity.title}</h4>
              <p className="text-xs text-green-600 font-almarai">{opportunity.potential}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-yellow-50 rounded-xl p-6">
        <h3 className="font-bold text-yellow-900 font-almarai mb-4">التحديات</h3>
        <div className="space-y-3">
          {insights.challenges.map((challenge, index) => (
            <div key={index} className="bg-white rounded-lg p-3">
              <h4 className="font-medium text-gray-900 font-almarai text-sm">{challenge.title}</h4>
              <p className="text-xs text-yellow-600 font-almarai">{challenge.mitigation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 font-almarai mb-4">التوقعات المالية (5 سنوات)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsLineChart data={projections}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timeframe" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#006B3F" strokeWidth={3} name="الإيرادات" />
          <Line type="monotone" dataKey="profit" stroke="#FFB800" strokeWidth={3} name="الأرباح" />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const CaseStudiesTab: React.FC<{ cases: SectorData['caseStudies'] }> = ({ cases }) => (
  <div className="space-y-8">
    {cases.map((caseStudy, index) => (
      <div key={index} className="bg-gradient-to-r from-saudi-green to-saudi-gold rounded-xl p-8 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Star className="h-8 w-8" />
              <div>
                <h3 className="text-2xl font-bold font-almarai">{caseStudy.title}</h3>
                <p className="opacity-90 font-almarai">{caseStudy.client}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-bold font-almarai mb-2">التحدي:</h4>
                <p className="opacity-90 font-almarai">{caseStudy.challenge}</p>
              </div>
              <div>
                <h4 className="font-bold font-almarai mb-2">الحل:</h4>
                <p className="opacity-90 font-almarai">{caseStudy.solution}</p>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white bg-opacity-20 rounded-xl p-6">
              <h4 className="font-bold font-almarai mb-4">النتائج المحققة:</h4>
              <div className="space-y-2 mb-4">
                {caseStudy.results.map((result, resultIndex) => (
                  <div key={resultIndex} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 flex-shrink-0" />
                    <span className="font-almarai">{result}</span>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <p className="text-sm opacity-75 font-almarai">عائد الاستثمار</p>
                <p className="text-4xl font-bold font-almarai">{caseStudy.roi}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// نافذة CTA
const CTAModal: React.FC<{ onClose: () => void; sectorName: string }> = ({ onClose, sectorName }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: sectorName,
    budget: '',
    timeline: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('تم إرسال طلبك بنجاح! سنتواصل معك خلال 24 ساعة.');
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 font-almarai">
              طلب دراسة جدوى
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 font-almarai mb-2">
              الاسم الكامل *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saudi-green focus:border-transparent font-almarai"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 font-almarai mb-2">
              البريد الإلكتروني *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saudi-green focus:border-transparent font-almarai"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 font-almarai mb-2">
              رقم الهاتف *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saudi-green focus:border-transparent font-almarai"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 font-almarai mb-2">
              الميزانية المتوقعة
            </label>
            <select
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saudi-green focus:border-transparent font-almarai"
            >
              <option value="">اختر الميزانية</option>
              <option value="less-100k">أقل من 100,000 ر.س</option>
              <option value="100k-500k">100,000 - 500,000 ر.س</option>
              <option value="500k-1m">500,000 - 1,000,000 ر.س</option>
              <option value="more-1m">أكثر من 1,000,000 ر.س</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 font-almarai mb-2">
              تفاصيل إضافية
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saudi-green focus:border-transparent font-almarai h-24 resize-none"
              placeholder="أخبرنا المزيد عن مشروعك..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-saudi-green text-white py-4 rounded-lg font-almarai font-bold text-lg hover:bg-green-700 transition-colors"
          >
            إرسال الطلب
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EnhancedSectorPage;
