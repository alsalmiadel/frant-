import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Target, BarChart3, Download, Filter, Search, Eye, Navigation, Zap, CheckCircle, AlertTriangle, TrendingUp, Users, DollarSign, Clock, Star, Building, Phone, Globe, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MapLocationSelector from './MapLocationSelector';
import toast from 'react-hot-toast';

interface LocationAnalysisPageProps {
  onBack: () => void;
}

interface CompetitorAnalysis {
  id: string;
  name: string;
  type: string;
  distance: number;
  rating: number;
  reviews: number;
  address: string;
  businessHours?: string;
  phone?: string;
  website?: string;
  priceLevel?: number;
  photos?: string[];
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
}

const LocationAnalysisPage: React.FC<LocationAnalysisPageProps> = ({ onBack }) => {
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [competitors, setCompetitors] = useState<CompetitorAnalysis[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('distance');
  const [showMap, setShowMap] = useState(true);
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(null);

  const handleLocationSelect = async (locationData: any) => {
    setSelectedLocation(locationData);
    setIsAnalyzing(true);
    
    try {
      // محاكاة تحليل المنافسين مع بيانات واقعية
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockCompetitors: CompetitorAnalysis[] = [
        {
          id: '1',
          name: 'مطعم الطازج',
          type: 'مطعم',
          distance: 0.3,
          rating: 4.2,
          reviews: 156,
          address: 'شارع الملك فهد، الرياض',
          businessHours: 'مفتوح حتى 11 مساءً',
          phone: '0112345678',
          priceLevel: 2,
          strengths: ['موقع ممتاز', 'خدمة سريعة', 'أسعار معقولة'],
          weaknesses: ['مساحة محدودة', 'لا يوجد توصيل'],
          opportunities: ['توسيع القائمة', 'إضافة خدمة التوصيل']
        },
        {
          id: '2',
          name: 'كافيه بين',
          type: 'مقهى',
          distance: 0.5,
          rating: 4.5,
          reviews: 89,
          address: 'حي العليا، الرياض',
          businessHours: 'مفتوح 24 ساعة',
          phone: '0119876543',
          website: 'www.beancafe.sa',
          priceLevel: 3,
          strengths: ['جودة عالية', 'أجواء مميزة', 'واي فاي سريع'],
          weaknesses: ['أسعار مرتفعة', 'مواقف محدودة'],
          opportunities: ['برنامج ولاء', 'فروع جديدة']
        },
        {
          id: '3',
          name: 'مخبز الأصالة',
          type: 'مخبز',
          distance: 0.8,
          rating: 3.9,
          reviews: 234,
          address: 'شارع العروبة، الرياض',
          businessHours: 'مغلق الآن - يفتح 6 صباحاً',
          phone: '0115555555',
          priceLevel: 1,
          strengths: ['أسعار منافسة', 'منتجات طازجة', 'خبرة طويلة'],
          weaknesses: ['تصميم قديم', 'خدمة بطيئة'],
          opportunities: ['تجديد المحل', 'منتجات صحية']
        }
      ];

      setCompetitors(mockCompetitors);
      
      // تحليل ذكي للموقع
      const smartAnalysis = {
        overallScore: 78,
        competitionDensity: 'medium',
        marketGaps: [
          'نقص في المطاعم الصحية',
          'لا توجد خدمة توصيل متخصصة',
          'فرصة للتميز في الجودة'
        ],
        recommendations: [
          'ركز على الطعام الصحي كميزة تنافسية',
          'استثمر في خدمة توصيل قوية',
          'استهدف شريحة الموظفين في المنطقة',
          'اعتمد على التسويق الرقمي المحلي'
        ],
        trafficAnalysis: {
          peakHours: '12-2 مساءً، 7-9 مساءً',
          weekdayTraffic: 85,
          weekendTraffic: 92,
          accessibility: 'ممتاز - قرب محطة مترو'
        }
      };
      
      setAnalysis(smartAnalysis);
      
    } catch (error) {
      toast.error('خطأ في تحليل الموقع');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const filteredCompetitors = competitors.filter(comp => {
    if (filterType === 'close') return comp.distance <= 1;
    if (filterType === 'rated') return comp.rating >= 4;
    if (filterType === 'direct') return comp.type === 'مطعم';
    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating': return b.rating - a.rating;
      case 'reviews': return b.reviews - a.reviews;
      case 'distance': 
      default: return a.distance - b.distance;
    }
  });

  const exportCompetitors = () => {
    const csvContent = [
      ['الاسم', 'النوع', 'المسافة (كم)', 'التقييم', 'عدد المراجعات', 'العنوان'],
      ...filteredCompetitors.map(comp => [
        comp.name, comp.type, comp.distance, comp.rating, comp.reviews, comp.address
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `منافسين_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success('تم تصدير قائمة المنافسين');
  };

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
                <span className="text-3xl">🗺️</span>
                تحليل الموقع والمنافسين
              </h1>
              <p className="text-gray-600 font-almarai">اختر موقع مشروعك لتحليل شامل للمنافسة والفرص</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* خطوات التحليل */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { step: 1, title: 'اختر الموقع', desc: 'انقر على الخريطة', icon: MapPin, active: !selectedLocation },
            { step: 2, title: 'تحليل المنافسين', desc: 'البحث عن المنافسين', icon: Search, active: selectedLocation && isAnalyzing },
            { step: 3, title: 'تقييم الفرص', desc: 'تحليل الفجوات', icon: Target, active: selectedLocation && !isAnalyzing && analysis },
            { step: 4, title: 'التوصيات', desc: 'خطة العمل', icon: CheckCircle, active: analysis }
          ].map((step, index) => (
            <div key={index} className={`bg-white rounded-xl p-4 border-2 transition-all ${
              step.active ? 'border-saudi-green bg-light-green' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.active ? 'bg-saudi-green text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.active ? step.step : <step.icon className="h-4 w-4" />}
                </div>
                <h3 className="font-almarai font-bold text-gray-800">{step.title}</h3>
              </div>
              <p className="text-sm font-almarai text-gray-600 text-right">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* الخريطة */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-almarai font-bold text-gray-800">خريطة تحليل المنافسين</h2>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowMap(!showMap)}
                      className={`px-4 py-2 rounded-lg font-almarai transition-colors ${
                        showMap ? 'bg-saudi-green text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      <Eye className="h-4 w-4 inline ml-2" />
                      {showMap ? 'إخفاء الخريطة' : 'إظهار الخريطة'}
                    </button>
                  </div>
                </div>
              </div>

              {showMap && (
                <div className="h-96">
                  <MapLocationSelector
                    onLocationSelect={handleLocationSelect}
                    projectType="مطاعم وأغذية"
                  />
                </div>
              )}
            </div>

            {/* نتائج التحليل */}
            {analysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mt-6"
              >
                <h3 className="text-xl font-almarai font-bold text-gray-800 mb-6 text-right">
                  تحليل شامل للموقع
                </h3>

                {/* مؤشرات رئيسية */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-saudi-green">{analysis.overallScore}/100</div>
                    <div className="text-sm font-almarai text-gray-600">تقييم الموقع</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-saudi-gold">{competitors.length}</div>
                    <div className="text-sm font-almarai text-gray-600">منافس مباشر</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-tech-blue">
                      {analysis.competitionDensity === 'low' ? 'منخفضة' : 
                       analysis.competitionDensity === 'medium' ? 'متوسطة' : 'عالية'}
                    </div>
                    <div className="text-sm font-almarai text-gray-600">كثافة المنافسة</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{analysis.marketGaps.length}</div>
                    <div className="text-sm font-almarai text-gray-600">فجوة سوقية</div>
                  </div>
                </div>

                {/* فجوات الفرص */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Target className="h-5 w-5 text-green-600" />
                    <h4 className="font-almarai font-bold text-green-800">فجوات الفرص المكتشفة</h4>
                  </div>
                  <div className="space-y-2">
                    {analysis.marketGaps.map((gap: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-green-700 font-almarai text-sm">{gap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* التوصيات الذكية */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="h-5 w-5 text-blue-600" />
                    <h4 className="font-almarai font-bold text-blue-800">توصيات حور الذكية</h4>
                  </div>
                  <div className="space-y-2">
                    {analysis.recommendations.map((rec: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <Star className="h-4 w-4 text-blue-600 mt-1" />
                        <span className="text-blue-700 font-almarai text-sm text-right">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* لوحة المنافسين */}
          <div className="space-y-6">
            {/* أدوات التحكم */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-almarai font-bold text-gray-800">المنافسون ({filteredCompetitors.length})</h3>
                  <button
                    onClick={exportCompetitors}
                    disabled={competitors.length === 0}
                    className="bg-saudi-green text-white px-4 py-2 rounded-lg font-almarai text-sm hover:bg-saudi-green/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    تصدير CSV
                  </button>
                </div>

                <div className="flex gap-3">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 font-almarai text-right focus:border-saudi-green focus:outline-none"
                  >
                    <option value="all">جميع المنافسين</option>
                    <option value="close">القريبين (أقل من 1 كم)</option>
                    <option value="rated">عالي التقييم (4+ نجوم)</option>
                    <option value="direct">منافسين مباشرين</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 font-almarai text-right focus:border-saudi-green focus:outline-none"
                  >
                    <option value="distance">الأقرب</option>
                    <option value="rating">الأعلى تقييماً</option>
                    <option value="reviews">الأكثر مراجعة</option>
                  </select>
                </div>
              </div>
            </div>

            {/* قائمة المنافسين */}
            {isAnalyzing ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-2 border-saudi-green border-t-transparent rounded-full mx-auto mb-4"
                />
                <p className="font-almarai text-gray-600">جاري تحليل المنافسين...</p>
              </div>
            ) : filteredCompetitors.length > 0 ? (
              <div className="space-y-4">
                {filteredCompetitors.map((competitor, index) => (
                  <motion.div
                    key={competitor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-right flex-1">
                        <h4 className="font-almarai font-bold text-gray-800 text-lg mb-1">
                          {competitor.name}
                        </h4>
                        <div className="flex items-center justify-end gap-3 mb-2">
                          <span className="bg-saudi-green/10 text-saudi-green px-2 py-1 rounded-full text-xs font-bold">
                            {competitor.type}
                          </span>
                          <span className="text-gray-500 font-almarai text-sm">
                            {competitor.distance} كم
                          </span>
                        </div>
                        <p className="text-gray-600 font-almarai text-sm mb-3">
                          📍 {competitor.address}
                        </p>
                      </div>

                      <div className="text-left">
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="h-4 w-4 text-saudi-gold fill-current" />
                          <span className="font-bold text-gray-800">{competitor.rating}</span>
                          <span className="text-gray-500 text-sm">({competitor.reviews})</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {competitor.businessHours}
                        </div>
                      </div>
                    </div>

                    {/* تحليل SWOT مختصر */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-green-50 rounded-lg p-3">
                        <h5 className="font-almarai font-bold text-green-800 text-sm mb-2">نقاط القوة</h5>
                        <div className="space-y-1">
                          {competitor.strengths.slice(0, 2).map((strength, i) => (
                            <div key={i} className="text-green-700 font-almarai text-xs flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              {strength}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-red-50 rounded-lg p-3">
                        <h5 className="font-almarai font-bold text-red-800 text-sm mb-2">نقاط الضعف</h5>
                        <div className="space-y-1">
                          {competitor.weaknesses.slice(0, 2).map((weakness, i) => (
                            <div key={i} className="text-red-700 font-almarai text-xs flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              {weakness}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-3">
                        <h5 className="font-almarai font-bold text-blue-800 text-sm mb-2">الفرص</h5>
                        <div className="space-y-1">
                          {competitor.opportunities.slice(0, 2).map((opp, i) => (
                            <div key={i} className="text-blue-700 font-almarai text-xs flex items-center gap-1">
                              <Target className="h-3 w-3" />
                              {opp}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* معلومات التواصل */}
                    <div className="flex items-center justify-end gap-4 text-sm">
                      {competitor.phone && (
                        <a href={`tel:${competitor.phone}`} className="text-saudi-green hover:text-saudi-gold transition-colors flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {competitor.phone}
                        </a>
                      )}
                      {competitor.website && (
                        <a href={competitor.website} target="_blank" rel="noopener noreferrer" className="text-tech-blue hover:text-blue-700 transition-colors flex items-center gap-1">
                          <Globe className="h-4 w-4" />
                          الموقع
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-almarai font-bold text-gray-800 mb-2">
                  اختر موقعاً للتحليل
                </h3>
                <p className="text-gray-600 font-almarai">
                  انقر على الخريطة لاختيار موقع مشروعك وبدء تحليل المنافسين
                </p>
              </div>
            )}
          </div>
        </div>

        {/* زر إنشاء دراسة جدوى */}
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                toast.success('جاري إنشاء دراسة جدوى مع تحليل الموقع...');
                setTimeout(() => {
                  if (typeof window !== 'undefined') {
                    window.location.hash = 'flow';
                  }
                }, 1000);
              }}
              className="bg-gradient-to-r from-saudi-green to-saudi-gold text-white px-8 py-4 rounded-xl font-almarai font-bold text-lg hover:shadow-lg transition-all duration-300 flex items-center gap-3"
            >
              <FileText className="h-6 w-6" />
              إنشاء دراسة جدوى مع تحليل الموقع
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LocationAnalysisPage;