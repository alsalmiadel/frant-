import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  ArrowLeft,
  Building,
  MapPin,
  DollarSign,
  TrendingUp,
  Users,
  BarChart3,
  FileText,
  Download,
  Upload,
  Copy,
  Eye,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface SectorTemplate {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
  assumptions: {
    avgRevenue: number;
    avgCost: number;
    profitMargin: number;
    paybackMonths: number;
    riskLevel: 'low' | 'medium' | 'high';
    marketSize: string;
    competition: 'low' | 'medium' | 'high';
    regulations: string[];
    licenses: string[];
  };
  financialModel: {
    revenueStreams: string[];
    costStructure: string[];
    keyMetrics: string[];
    seasonality: number[]; // 12 months
  };
  marketInsights: {
    trends: string[];
    opportunities: string[];
    challenges: string[];
    targetAudience: string[];
  };
  createdAt: string;
  updatedAt: string;
}

interface CityData {
  id: string;
  name: string;
  nameEn: string;
  region: string;
  population: number;
  economicFactors: {
    gdpPerCapita: number;
    unemploymentRate: number;
    businessGrowthRate: number;
    costOfLiving: number;
  };
  businessEnvironment: {
    easeOfDoing: number; // 1-10 scale
    infrastructure: number;
    talent: number;
    regulations: number;
  };
  sectorMultipliers: Record<string, number>; // sector-specific adjustments
  isActive: boolean;
}

interface AdminTemplateManagerProps {
  onBack: () => void;
}

const AdminTemplateManager: React.FC<AdminTemplateManagerProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'sectors' | 'cities' | 'settings'>('sectors');
  const [sectors, setSectors] = useState<SectorTemplate[]>([]);
  const [cities, setCities] = useState<CityData[]>([]);
  const [selectedSector, setSelectedSector] = useState<SectorTemplate | null>(null);
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // تحميل البيانات الأولية
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      // محاكاة تحميل البيانات
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockSectors: SectorTemplate[] = [
        {
          id: '1',
          name: 'المطاعم والمقاهي',
          nameEn: 'Restaurants & Cafes',
          description: 'قطاع المطاعم والمقاهي والخدمات الغذائية',
          icon: '🍽️',
          color: 'from-orange-500 to-red-500',
          isActive: true,
          assumptions: {
            avgRevenue: 50000,
            avgCost: 35000,
            profitMargin: 0.3,
            paybackMonths: 18,
            riskLevel: 'medium',
            marketSize: '45 مليار ريال',
            competition: 'high',
            regulations: ['ترخيص البلدية', 'ترخيص الصحة'],
            licenses: ['سجل تجاري', 'رخصة مزاولة']
          },
          financialModel: {
            revenueStreams: ['مبيعات الطعام', 'المشروبات', 'خدمة التوصيل'],
            costStructure: ['تكلفة الطعام', 'الإيجار', 'الرواتب', 'المرافق'],
            keyMetrics: ['متوسط الفاتورة', 'عدد العملاء', 'معدل الدوران'],
            seasonality: [0.9, 0.95, 1.0, 1.05, 1.1, 1.15, 1.2, 1.15, 1.0, 0.95, 0.9, 1.3]
          },
          marketInsights: {
            trends: ['نمو طلبات التوصيل', 'الاهتمام بالطعام الصحي'],
            opportunities: ['التوسع في الأحياء الجديدة', 'خدمات الكيترينغ'],
            challenges: ['المنافسة الشديدة', 'ارتفاع تكاليف التشغيل'],
            targetAudience: ['الشباب', 'العائلات', 'الموظفين']
          },
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          name: 'التجارة الإلكترونية',
          nameEn: 'E-commerce',
          description: 'منصات البيع الإلكتروني والتسوق عبر الإنترنت',
          icon: '🛒',
          color: 'from-blue-500 to-purple-500',
          isActive: true,
          assumptions: {
            avgRevenue: 80000,
            avgCost: 48000,
            profitMargin: 0.4,
            paybackMonths: 12,
            riskLevel: 'medium',
            marketSize: '28 مليار ريال',
            competition: 'high',
            regulations: ['ترخيص التجارة الإلكترونية'],
            licenses: ['سجل تجاري', 'شهادة مطابقة']
          },
          financialModel: {
            revenueStreams: ['مبيعات المنتجات', 'رسوم الشحن', 'الإعلانات'],
            costStructure: ['تكلفة المنتجات', 'التسويق', 'الشحن', 'التقنية'],
            keyMetrics: ['معدل التحويل', 'متوسط الطلب', 'تكلفة الاكتساب'],
            seasonality: [0.8, 0.85, 0.9, 0.95, 1.0, 1.05, 1.1, 1.05, 1.0, 1.1, 1.4, 1.6]
          },
          marketInsights: {
            trends: ['نمو التسوق عبر الجوال', 'الذكاء الاصطناعي'],
            opportunities: ['التخصص في فئات معينة', 'التوسع الإقليمي'],
            challenges: ['المنافسة مع العمالقة', 'تحديات اللوجستيات'],
            targetAudience: ['جيل الألفية', 'النساء العاملات', 'الشباب']
          },
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-10T15:20:00Z'
        }
      ];

      const mockCities: CityData[] = [
        {
          id: '1',
          name: 'الرياض',
          nameEn: 'Riyadh',
          region: 'الرياض',
          population: 7500000,
          economicFactors: {
            gdpPerCapita: 85000,
            unemploymentRate: 8.5,
            businessGrowthRate: 12.5,
            costOfLiving: 100
          },
          businessEnvironment: {
            easeOfDoing: 8.5,
            infrastructure: 9.0,
            talent: 8.8,
            regulations: 8.2
          },
          sectorMultipliers: {
            'restaurants': 1.2,
            'ecommerce': 1.3,
            'retail': 1.1,
            'services': 1.25
          },
          isActive: true
        },
        {
          id: '2',
          name: 'جدة',
          nameEn: 'Jeddah',
          region: 'مكة المكرمة',
          population: 4300000,
          economicFactors: {
            gdpPerCapita: 78000,
            unemploymentRate: 9.2,
            businessGrowthRate: 10.8,
            costOfLiving: 95
          },
          businessEnvironment: {
            easeOfDoing: 8.0,
            infrastructure: 8.5,
            talent: 8.3,
            regulations: 7.9
          },
          sectorMultipliers: {
            'restaurants': 1.1,
            'ecommerce': 1.15,
            'retail': 1.2,
            'services': 1.0
          },
          isActive: true
        }
      ];

      setSectors(mockSectors);
      setCities(mockCities);
    } catch (error) {
      toast.error('خطأ في تحميل البيانات');
    } finally {
      setIsLoading(false);
    }
  };

  const saveSector = (sector: SectorTemplate) => {
    if (sectors.find(s => s.id === sector.id)) {
      setSectors(prev => prev.map(s => s.id === sector.id ? { ...sector, updatedAt: new Date().toISOString() } : s));
      toast.success('تم تحديث القطاع بنجاح');
    } else {
      setSectors(prev => [...prev, { ...sector, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]);
      toast.success('تم إنشاء القطاع بنجاح');
    }
    setSelectedSector(null);
    setIsEditing(false);
  };

  const saveCity = (city: CityData) => {
    if (cities.find(c => c.id === city.id)) {
      setCities(prev => prev.map(c => c.id === city.id ? city : c));
      toast.success('تم تحديث المدينة بنجاح');
    } else {
      setCities(prev => [...prev, { ...city, id: Date.now().toString() }]);
      toast.success('تم إنشاء المدينة بنجاح');
    }
    setSelectedCity(null);
    setIsEditing(false);
  };

  const deleteSector = (sectorId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا القطاع؟')) {
      setSectors(prev => prev.filter(s => s.id !== sectorId));
      toast.success('تم حذف القطاع');
    }
  };

  const deleteCity = (cityId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المدينة؟')) {
      setCities(prev => prev.filter(c => c.id !== cityId));
      toast.success('تم حذف المدينة');
    }
  };

  const exportData = () => {
    const data = {
      sectors: sectors,
      cities: cities,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `hoor_templates_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    toast.success('تم تصدير البيانات بنجاح');
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.sectors) setSectors(data.sectors);
        if (data.cities) setCities(data.cities);
        toast.success('تم استيراد البيانات بنجاح');
      } catch (error) {
        toast.error('خطأ في تنسيق الملف');
      }
    };
    reader.readAsText(file);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saudi-green mx-auto mb-4"></div>
          <p className="text-gray-600 font-almarai">جاري تحميل القوالب...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* رأس الصفحة */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 font-almarai">
                  إدارة القوالب والقطاعات
                </h1>
                <p className="text-gray-600 font-almarai">
                  إدارة قوالب القطاعات وبيانات المدن
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
                id="import-file"
              />
              <label
                htmlFor="import-file"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-almarai cursor-pointer"
              >
                <Upload className="h-4 w-4" />
                استيراد
              </label>
              <button
                onClick={exportData}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-almarai"
              >
                <Download className="h-4 w-4" />
                تصدير
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* التبويبات */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { id: 'sectors', label: 'القطاعات', icon: Building },
                { id: 'cities', label: 'المدن', icon: MapPin },
                { id: 'settings', label: 'الإعدادات', icon: Settings }
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-4 font-almarai font-medium transition-colors ${
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

          <div className="p-6">
            {activeTab === 'sectors' && (
              <SectorsTab
                sectors={sectors}
                onEdit={(sector) => {
                  setSelectedSector(sector);
                  setIsEditing(true);
                }}
                onDelete={deleteSector}
                onAdd={() => {
                  setSelectedSector({
                    id: '',
                    name: '',
                    nameEn: '',
                    description: '',
                    icon: '🏢',
                    color: 'from-gray-500 to-gray-700',
                    isActive: true,
                    assumptions: {
                      avgRevenue: 50000,
                      avgCost: 35000,
                      profitMargin: 0.3,
                      paybackMonths: 18,
                      riskLevel: 'medium',
                      marketSize: '',
                      competition: 'medium',
                      regulations: [],
                      licenses: []
                    },
                    financialModel: {
                      revenueStreams: [],
                      costStructure: [],
                      keyMetrics: [],
                      seasonality: Array(12).fill(1)
                    },
                    marketInsights: {
                      trends: [],
                      opportunities: [],
                      challenges: [],
                      targetAudience: []
                    },
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                  });
                  setIsEditing(true);
                }}
              />
            )}

            {activeTab === 'cities' && (
              <CitiesTab
                cities={cities}
                onEdit={(city) => {
                  setSelectedCity(city);
                  setIsEditing(true);
                }}
                onDelete={deleteCity}
                onAdd={() => {
                  setSelectedCity({
                    id: '',
                    name: '',
                    nameEn: '',
                    region: '',
                    population: 0,
                    economicFactors: {
                      gdpPerCapita: 0,
                      unemploymentRate: 0,
                      businessGrowthRate: 0,
                      costOfLiving: 100
                    },
                    businessEnvironment: {
                      easeOfDoing: 5,
                      infrastructure: 5,
                      talent: 5,
                      regulations: 5
                    },
                    sectorMultipliers: {},
                    isActive: true
                  });
                  setIsEditing(true);
                }}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsTab />
            )}
          </div>
        </div>
      </div>

      {/* محرر القطاع */}
      <AnimatePresence>
        {selectedSector && isEditing && (
          <SectorEditor
            sector={selectedSector}
            onSave={saveSector}
            onCancel={() => {
              setSelectedSector(null);
              setIsEditing(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* محرر المدينة */}
      <AnimatePresence>
        {selectedCity && isEditing && (
          <CityEditor
            city={selectedCity}
            onSave={saveCity}
            onCancel={() => {
              setSelectedCity(null);
              setIsEditing(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// مكون تبويب القطاعات
const SectorsTab: React.FC<{
  sectors: SectorTemplate[];
  onEdit: (sector: SectorTemplate) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}> = ({ sectors, onEdit, onDelete, onAdd }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 font-almarai">قوالب القطاعات</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-saudi-green text-white rounded-lg hover:bg-green-700 transition-colors font-almarai"
        >
          <Plus className="h-4 w-4" />
          قطاع جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sectors.map((sector) => (
          <div key={sector.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${sector.color} flex items-center justify-center text-2xl`}>
                  {sector.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 font-almarai">{sector.name}</h3>
                  <p className="text-sm text-gray-600 font-almarai">{sector.nameEn}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {sector.isActive ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                )}
              </div>
            </div>

            <p className="text-gray-700 font-almarai text-sm mb-4">{sector.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-almarai">متوسط الإيرادات:</span>
                <span className="font-medium font-almarai">{sector.assumptions.avgRevenue.toLocaleString()} ر.س</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-almarai">هامش الربح:</span>
                <span className="font-medium font-almarai">{(sector.assumptions.profitMargin * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-almarai">فترة الاسترداد:</span>
                <span className="font-medium font-almarai">{sector.assumptions.paybackMonths} شهر</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(sector)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-almarai text-sm"
              >
                <Edit className="h-4 w-4" />
                تحرير
              </button>
              <button
                onClick={() => onDelete(sector.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// مكون تبويب المدن
const CitiesTab: React.FC<{
  cities: CityData[];
  onEdit: (city: CityData) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}> = ({ cities, onEdit, onDelete, onAdd }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 font-almarai">بيانات المدن</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-saudi-green text-white rounded-lg hover:bg-green-700 transition-colors font-almarai"
        >
          <Plus className="h-4 w-4" />
          مدينة جديدة
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-700 font-almarai">المدينة</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-700 font-almarai">المنطقة</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-700 font-almarai">السكان</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-700 font-almarai">نصيب الفرد من الناتج</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-700 font-almarai">سهولة الأعمال</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-700 font-almarai">الحالة</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-700 font-almarai">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {cities.map((city) => (
              <tr key={city.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900 font-almarai">{city.name}</div>
                    <div className="text-sm text-gray-600 font-almarai">{city.nameEn}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-700 font-almarai">{city.region}</td>
                <td className="px-6 py-4 text-gray-700 font-almarai">{city.population.toLocaleString()}</td>
                <td className="px-6 py-4 text-gray-700 font-almarai">{city.economicFactors.gdpPerCapita.toLocaleString()} ر.س</td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-saudi-green h-2 rounded-full" 
                        style={{ width: `${(city.businessEnvironment.easeOfDoing / 10) * 100}%` }}
                      ></div>
                    </div>
                    <span className="mr-2 text-sm font-almarai">{city.businessEnvironment.easeOfDoing}/10</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {city.isActive ? (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-almarai">نشط</span>
                  ) : (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-almarai">غير نشط</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(city)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(city.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// مكون تبويب الإعدادات
const SettingsTab: React.FC = () => {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 font-almarai mb-6">إعدادات النظام</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-bold text-gray-900 font-almarai mb-4">إعدادات عامة</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 font-almarai mb-2">
                العملة الافتراضية
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saudi-green focus:border-transparent font-almarai">
                <option value="SAR">ريال سعودي (SAR)</option>
                <option value="USD">دولار أمريكي (USD)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 font-almarai mb-2">
                معدل الضريبة الافتراضي
              </label>
              <input
                type="number"
                defaultValue={15}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saudi-green focus:border-transparent font-almarai"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-bold text-gray-900 font-almarai mb-4">إعدادات التحليل</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 font-almarai mb-2">
                معدل الخصم الافتراضي
              </label>
              <input
                type="number"
                defaultValue={18}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saudi-green focus:border-transparent font-almarai"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 font-almarai mb-2">
                فترة التحليل الافتراضية (شهر)
              </label>
              <input
                type="number"
                defaultValue={60}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saudi-green focus:border-transparent font-almarai"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button className="px-6 py-3 bg-saudi-green text-white rounded-lg hover:bg-green-700 transition-colors font-almarai">
          حفظ الإعدادات
        </button>
      </div>
    </div>
  );
};

// محرر القطاع (مبسط للمساحة)
const SectorEditor: React.FC<{
  sector: SectorTemplate;
  onSave: (sector: SectorTemplate) => void;
  onCancel: () => void;
}> = ({ sector, onSave, onCancel }) => {
  const [editedSector, setEditedSector] = useState(sector);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 font-almarai">
              {sector.id ? 'تحرير القطاع' : 'قطاع جديد'}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSave(editedSector)}
                className="flex items-center gap-2 px-4 py-2 bg-saudi-green text-white rounded-lg hover:bg-green-700 transition-colors font-almarai"
              >
                <Save className="h-4 w-4" />
                حفظ
              </button>
              <button
                onClick={onCancel}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* معلومات أساسية */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 font-almarai mb-2">
                اسم القطاع
              </label>
              <input
                type="text"
                value={editedSector.name}
                onChange={(e) => setEditedSector({ ...editedSector, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saudi-green focus:border-transparent font-almarai"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 font-almarai mb-2">
                الاسم بالإنجليزية
              </label>
              <input
                type="text"
                value={editedSector.nameEn}
                onChange={(e) => setEditedSector({ ...editedSector, nameEn: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saudi-green focus:border-transparent font-almarai"
              />
            </div>
          </div>

          {/* المزيد من الحقول يمكن إضافتها هنا */}
          <div>
            <label className="block text-sm font-medium text-gray-700 font-almarai mb-2">
              الوصف
            </label>
            <textarea
              value={editedSector.description}
              onChange={(e) => setEditedSector({ ...editedSector, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saudi-green focus:border-transparent font-almarai h-24 resize-none"
            />
          </div>

          {/* الافتراضات المالية */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 font-almarai mb-2">
                متوسط الإيرادات
              </label>
              <input
                type="number"
                value={editedSector.assumptions.avgRevenue}
                onChange={(e) => setEditedSector({
                  ...editedSector,
                  assumptions: { ...editedSector.assumptions, avgRevenue: Number(e.target.value) }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saudi-green focus:border-transparent font-almarai"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 font-almarai mb-2">
                متوسط التكاليف
              </label>
              <input
                type="number"
                value={editedSector.assumptions.avgCost}
                onChange={(e) => setEditedSector({
                  ...editedSector,
                  assumptions: { ...editedSector.assumptions, avgCost: Number(e.target.value) }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saudi-green focus:border-transparent font-almarai"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 font-almarai mb-2">
                فترة الاسترداد (شهر)
              </label>
              <input
                type="number"
                value={editedSector.assumptions.paybackMonths}
                onChange={(e) => setEditedSector({
                  ...editedSector,
                  assumptions: { ...editedSector.assumptions, paybackMonths: Number(e.target.value) }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saudi-green focus:border-transparent font-almarai"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// محرر المدينة (مبسط للمساحة)
const CityEditor: React.FC<{
  city: CityData;
  onSave: (city: CityData) => void;
  onCancel: () => void;
}> = ({ city, onSave, onCancel }) => {
  const [editedCity, setEditedCity] = useState(city);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 font-almarai">
              {city.id ? 'تحرير المدينة' : 'مدينة جديدة'}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSave(editedCity)}
                className="flex items-center gap-2 px-4 py-2 bg-saudi-green text-white rounded-lg hover:bg-green-700 transition-colors font-almarai"
              >
                <Save className="h-4 w-4" />
                حفظ
              </button>
              <button
                onClick={onCancel}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 font-almarai mb-2">
                اسم المدينة
              </label>
              <input
                type="text"
                value={editedCity.name}
                onChange={(e) => setEditedCity({ ...editedCity, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saudi-green focus:border-transparent font-almarai"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 font-almarai mb-2">
                الاسم بالإنجليزية
              </label>
              <input
                type="text"
                value={editedCity.nameEn}
                onChange={(e) => setEditedCity({ ...editedCity, nameEn: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saudi-green focus:border-transparent font-almarai"
              />
            </div>
          </div>

          {/* المزيد من الحقول */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 font-almarai mb-2">
                المنطقة
              </label>
              <input
                type="text"
                value={editedCity.region}
                onChange={(e) => setEditedCity({ ...editedCity, region: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saudi-green focus:border-transparent font-almarai"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 font-almarai mb-2">
                عدد السكان
              </label>
              <input
                type="number"
                value={editedCity.population}
                onChange={(e) => setEditedCity({ ...editedCity, population: Number(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saudi-green focus:border-transparent font-almarai"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminTemplateManager;
