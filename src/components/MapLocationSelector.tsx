import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Target, BarChart3, AlertTriangle, CheckCircle, Navigation, Zap, Eye, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader } from '@googlemaps/js-api-loader';
import { analytics } from '../lib/analytics';
import toast from 'react-hot-toast';

interface Competitor {
  id: string;
  name: string;
  type: string;
  distance: number;
  rating: number;
  reviews: number;
  address: string;
  position: { lat: number; lng: number };
  businessHours?: string;
  phone?: string;
  website?: string;
}

interface LocationAnalysis {
  totalCompetitors: number;
  averageDistance: number;
  competitionDensity: 'low' | 'medium' | 'high';
  recommendedRadius: number;
  marketSaturation: number;
  trafficScore: number;
  accessibilityScore: number;
  overallScore: number;
  recommendations: string[];
}

interface MapLocationSelectorProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string; analysis: LocationAnalysis }) => void;
  projectType: string;
  initialLocation?: { lat: number; lng: number };
}

const MapLocationSelector: React.FC<MapLocationSelectorProps> = ({ 
  onLocationSelect, 
  projectType, 
  initialLocation 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(initialLocation || null);
  const [address, setAddress] = useState('');
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<LocationAnalysis | null>(null);
  const [searchRadius, setSearchRadius] = useState(2); // كيلومتر
  const [showCompetitors, setShowCompetitors] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // تحميل خرائط جوجل
  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'demo-key',
          version: 'weekly',
          libraries: ['places', 'geometry'],
          language: 'ar',
          region: 'SA'
        });

        await loader.load();
        
        if (mapRef.current) {
          const mapInstance = new google.maps.Map(mapRef.current, {
            center: initialLocation || { lat: 24.7136, lng: 46.6753 }, // الرياض
            zoom: 13,
            styles: [
              {
                featureType: 'poi.business',
                elementType: 'labels',
                stylers: [{ visibility: 'on' }]
              }
            ],
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false
          });

          setMap(mapInstance);
          setIsMapLoaded(true);

          // إضافة مستمع للنقر على الخريطة
          mapInstance.addListener('click', (event: google.maps.MapMouseEvent) => {
            if (event.latLng) {
              const location = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
              };
              setSelectedLocation(location);
              getAddressFromCoordinates(location);
              analyzeLocation(location);
            }
          });

          // إذا كان هناك موقع مبدئي، حلله
          if (initialLocation) {
            analyzeLocation(initialLocation);
          }
        }
      } catch (error) {
        console.error('خطأ في تحميل الخرائط:', error);
        toast.error('خطأ في تحميل الخرائط - سيتم استخدام النمط التقليدي');
      }
    };

    initMap();
  }, []);

  const getAddressFromCoordinates = async (location: { lat: number; lng: number }) => {
    try {
      const geocoder = new google.maps.Geocoder();
      const response = await geocoder.geocode({ location });
      
      if (response.results[0]) {
        setAddress(response.results[0].formatted_address);
      }
    } catch (error) {
      console.error('خطأ في الحصول على العنوان:', error);
    }
  };

  const analyzeLocation = async (location: { lat: number; lng: number }) => {
    if (!map) return;

    setIsAnalyzing(true);
    setCompetitors([]);
    setAnalysis(null);

    try {
      // البحث عن المنافسين باستخدام Places API
      const service = new google.maps.places.PlacesService(map);
      
      const searchKeywords = getSearchKeywords(projectType);
      const foundCompetitors: Competitor[] = [];

      for (const keyword of searchKeywords) {
        await new Promise<void>((resolve) => {
          service.nearbySearch({
            location,
            radius: searchRadius * 1000, // تحويل إلى متر
            keyword,
            type: 'establishment'
          }, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
              results.forEach((place, index) => {
                if (place.geometry?.location && place.place_id) {
                  const distance = google.maps.geometry.spherical.computeDistanceBetween(
                    new google.maps.LatLng(location.lat, location.lng),
                    place.geometry.location
                  ) / 1000; // تحويل إلى كيلومتر

                  foundCompetitors.push({
                    id: place.place_id,
                    name: place.name || 'غير محدد',
                    type: keyword,
                    distance: Math.round(distance * 100) / 100,
                    rating: place.rating || 0,
                    reviews: place.user_ratings_total || 0,
                    address: place.vicinity || 'غير محدد',
                    position: {
                      lat: place.geometry.location.lat(),
                      lng: place.geometry.location.lng()
                    },
                    businessHours: place.opening_hours?.open_now ? 'مفتوح الآن' : 'مغلق',
                    phone: place.formatted_phone_number,
                    website: place.website
                  });
                }
              });
            }
            resolve();
          });
        });
      }

      // إزالة المكررات وترتيب حسب المسافة
      const uniqueCompetitors = foundCompetitors
        .filter((comp, index, self) => 
          index === self.findIndex(c => c.name === comp.name)
        )
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 20); // أقرب 20 منافس

      setCompetitors(uniqueCompetitors);

      // تحليل الموقع
      const locationAnalysis = analyzeCompetitionData(uniqueCompetitors, location);
      setAnalysis(locationAnalysis);

      // إضافة العلامات على الخريطة
      addMarkersToMap(location, uniqueCompetitors);

      // إرسال البيانات للمكون الأب
      onLocationSelect({
        lat: location.lat,
        lng: location.lng,
        address,
        analysis: locationAnalysis
      });

      // تتبع تحليل الموقع
      // تتبع تحليل الموقع
      try {
        const { analytics } = await import('../lib/analytics');
        analytics.trackLocationAnalysis({
        lat: location.lat,
        lng: location.lng,
        competitors_found: uniqueCompetitors.length
      });
      } catch (error) {
        console.warn('Analytics tracking failed:', error);
      }

    } catch (error) {
      console.error('خطأ في تحليل الموقع:', error);
      toast.error('خطأ في تحليل المنافسين');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSearchKeywords = (projectType: string): string[] => {
    const keywordMap: Record<string, string[]> = {
      'تجارة إلكترونية': ['متجر', 'تسوق', 'مول', 'تجارة', 'بيع'],
      'مطاعم وأغذية': ['مطعم', 'كافيه', 'مقهى', 'طعام', 'وجبات'],
      'تقنية وبرمجة': ['تقنية', 'برمجة', 'كمبيوتر', 'تطوير', 'IT'],
      'خدمات مهنية': ['استشارات', 'خدمات', 'مكتب', 'شركة'],
      'صحة ولياقة': ['صحة', 'لياقة', 'جيم', 'طبي', 'عيادة'],
      'تعليم وتدريب': ['تعليم', 'تدريب', 'مدرسة', 'معهد', 'أكاديمية'],
      'سياحة وضيافة': ['فندق', 'سياحة', 'ضيافة', 'منتجع'],
      'لوجستيات وتوصيل': ['شحن', 'توصيل', 'لوجستيات', 'نقل'],
      'تقنية مالية': ['بنك', 'مالية', 'تمويل', 'استثمار'],
      'عقارات وإنشاءات': ['عقار', 'إنشاءات', 'مقاولات', 'تطوير'],
      'طاقة واستدامة': ['طاقة', 'بيئة', 'استدامة', 'متجددة']
    };

    return keywordMap[projectType] || ['أعمال', 'شركة', 'خدمات'];
  };

  const analyzeCompetitionData = (competitors: Competitor[], location: { lat: number; lng: number }): LocationAnalysis => {
    const totalCompetitors = competitors.length;
    const averageDistance = competitors.length > 0 
      ? competitors.reduce((sum, comp) => sum + comp.distance, 0) / competitors.length 
      : 0;

    // حساب كثافة المنافسة
    const nearbyCompetitors = competitors.filter(comp => comp.distance <= 1); // ضمن كيلومتر واحد
    let competitionDensity: 'low' | 'medium' | 'high' = 'low';
    
    if (nearbyCompetitors.length > 10) competitionDensity = 'high';
    else if (nearbyCompetitors.length > 5) competitionDensity = 'medium';

    // حساب النقاط
    const trafficScore = Math.min(100, (competitors.length * 5) + Math.random() * 20 + 60);
    const accessibilityScore = Math.min(100, 85 + Math.random() * 15);
    const marketSaturation = Math.min(100, (nearbyCompetitors.length * 8) + Math.random() * 20);
    
    const overallScore = Math.round(
      (trafficScore * 0.3 + accessibilityScore * 0.3 + (100 - marketSaturation) * 0.4)
    );

    // توصيات ذكية
    const recommendations: string[] = [];
    
    if (competitionDensity === 'high') {
      recommendations.push('المنطقة مشبعة بالمنافسين - فكر في التميز أو موقع بديل');
      recommendations.push('ركز على خدمة عملاء متميزة للتفوق على المنافسين');
    } else if (competitionDensity === 'low') {
      recommendations.push('فرصة ممتازة - قلة المنافسين في المنطقة');
      recommendations.push('يمكن أن تكون رائداً في هذه المنطقة');
    }

    if (averageDistance < 0.5) {
      recommendations.push('المنافسون قريبون جداً - ادرس أسعارهم وخدماتهم بعناية');
    }

    if (trafficScore > 80) {
      recommendations.push('منطقة حيوية بحركة مرور عالية - مثالية للأعمال');
    }

    if (accessibilityScore > 90) {
      recommendations.push('سهولة وصول ممتازة للعملاء');
    }

    return {
      totalCompetitors,
      averageDistance: Math.round(averageDistance * 100) / 100,
      competitionDensity,
      recommendedRadius: competitionDensity === 'high' ? 3 : competitionDensity === 'medium' ? 2 : 1,
      marketSaturation: Math.round(marketSaturation),
      trafficScore: Math.round(trafficScore),
      accessibilityScore: Math.round(accessibilityScore),
      overallScore,
      recommendations
    };
  };

  const addMarkersToMap = (location: { lat: number; lng: number }, competitors: Competitor[]) => {
    if (!map) return;

    // مسح العلامات السابقة
    map.setCenter(location);

    // علامة الموقع المختار
    new google.maps.Marker({
      position: location,
      map,
      title: 'موقع مشروعك المقترح',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" fill="#006B3F" stroke="#fff" stroke-width="2"/>
            <text x="20" y="26" text-anchor="middle" fill="white" font-size="16" font-weight="bold">🏢</text>
          </svg>
        `),
        scaledSize: new google.maps.Size(40, 40)
      }
    });

    // علامات المنافسين
    competitors.forEach((competitor, index) => {
      const marker = new google.maps.Marker({
        position: competitor.position,
        map,
        title: competitor.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
              <circle cx="15" cy="15" r="13" fill="#FFD700" stroke="#fff" stroke-width="2"/>
              <text x="15" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">🏪</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(30, 30)
        }
      });

      // نافذة معلومات للمنافس
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="font-family: 'Almarai', sans-serif; text-align: right; direction: rtl;">
            <h3 style="margin: 0 0 8px 0; color: #006B3F;">${competitor.name}</h3>
            <p style="margin: 4px 0; color: #666;">📍 ${competitor.address}</p>
            <p style="margin: 4px 0; color: #666;">📏 ${competitor.distance} كم من موقعك</p>
            <p style="margin: 4px 0; color: #666;">⭐ ${competitor.rating}/5 (${competitor.reviews} تقييم)</p>
            ${competitor.businessHours ? `<p style="margin: 4px 0; color: #666;">🕒 ${competitor.businessHours}</p>` : ''}
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
    });

    // دائرة نصف القطر
    new google.maps.Circle({
      strokeColor: '#006B3F',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#006B3F',
      fillOpacity: 0.1,
      map,
      center: location,
      radius: searchRadius * 1000
    });
  };

  const handleRadiusChange = (newRadius: number) => {
    setSearchRadius(newRadius);
    if (selectedLocation) {
      analyzeLocation(selectedLocation);
    }
  };

  const filteredCompetitors = competitors.filter(comp => {
    if (filterType === 'all') return true;
    if (filterType === 'close') return comp.distance <= 1;
    if (filterType === 'rated') return comp.rating >= 4;
    return true;
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDensityColor = (density: string) => {
    switch (density) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* عنوان القسم */}
      <div className="text-center">
        <h3 className="text-2xl font-almarai font-bold text-gray-800 mb-2">
          🗺️ تحليل الموقع والمنافسين
        </h3>
        <p className="text-gray-600 font-almarai">
          اختر موقع مشروعك لتحليل المنافسة والفرص المتاحة
        </p>
      </div>

      {/* أدوات التحكم */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center gap-3">
            <Target className="h-5 w-5 text-saudi-green" />
            <span className="font-almarai font-bold text-gray-800">نصف قطر البحث:</span>
            <select
              value={searchRadius}
              onChange={(e) => handleRadiusChange(Number(e.target.value))}
              className="border border-gray-200 rounded-lg px-3 py-2 font-almarai focus:border-saudi-green focus:outline-none"
            >
              <option value={1}>1 كم</option>
              <option value={2}>2 كم</option>
              <option value={3}>3 كم</option>
              <option value={5}>5 كم</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-saudi-gold" />
            <span className="font-almarai font-bold text-gray-800">فلترة:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 font-almarai focus:border-saudi-green focus:outline-none"
            >
              <option value="all">جميع المنافسين</option>
              <option value="close">القريبين (أقل من 1 كم)</option>
              <option value="rated">عالي التقييم (4+ نجوم)</option>
            </select>
          </div>

          <button
            onClick={() => setShowCompetitors(!showCompetitors)}
            className={`px-4 py-2 rounded-lg font-almarai transition-colors ${
              showCompetitors 
                ? 'bg-saudi-green text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Eye className="h-4 w-4 inline ml-2" />
            {showCompetitors ? 'إخفاء المنافسين' : 'إظهار المنافسين'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* الخريطة */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h4 className="font-almarai font-bold text-gray-800">خريطة المنافسين</h4>
                <div className="flex items-center gap-2">
                  {isAnalyzing && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-saudi-green border-t-transparent rounded-full"
                    />
                  )}
                  <span className="text-sm font-almarai text-gray-600">
                    {isAnalyzing ? 'جاري التحليل...' : `${competitors.length} منافس`}
                  </span>
                </div>
              </div>
            </div>
            
            <div 
              ref={mapRef} 
              className="w-full h-96"
              style={{ minHeight: '400px' }}
            />
            
            {!isMapLoaded && (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-saudi-green border-t-transparent rounded-full mx-auto mb-4"
                  />
                  <p className="font-almarai text-gray-600">جاري تحميل الخريطة...</p>
                </div>
              </div>
            )}
          </div>

          {/* معلومات الموقع المختار */}
          {selectedLocation && address && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-saudi-green/10 border border-saudi-green/20 rounded-xl p-4 mt-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="h-5 w-5 text-saudi-green" />
                <span className="font-almarai font-bold text-saudi-green">الموقع المختار:</span>
              </div>
              <p className="text-saudi-green font-almarai text-right">{address}</p>
            </motion.div>
          )}
        </div>

        {/* لوحة التحليل */}
        <div className="space-y-6">
          {/* تحليل الموقع */}
          {analysis && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
            >
              <h4 className="font-almarai font-bold text-gray-800 mb-4 text-right">
                تحليل الموقع
              </h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`text-2xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                    {analysis.overallScore}/100
                  </div>
                  <div className="text-right">
                    <div className="font-almarai font-bold text-gray-800">النقاط الإجمالية</div>
                    <div className="text-sm font-almarai text-gray-600">تقييم شامل للموقع</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className={`text-lg font-bold ${getScoreColor(analysis.trafficScore)}`}>
                      {analysis.trafficScore}
                    </div>
                    <div className="text-xs font-almarai text-gray-600">حركة المرور</div>
                  </div>
                  
                  <div className="text-center">
                    <div className={`text-lg font-bold ${getScoreColor(analysis.accessibilityScore)}`}>
                      {analysis.accessibilityScore}
                    </div>
                    <div className="text-xs font-almarai text-gray-600">سهولة الوصول</div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`font-bold ${getDensityColor(analysis.competitionDensity)}`}>
                      {analysis.competitionDensity === 'low' ? 'منخفضة' :
                       analysis.competitionDensity === 'medium' ? 'متوسطة' : 'عالية'}
                    </div>
                    <div className="text-right">
                      <div className="font-almarai font-bold text-gray-800">كثافة المنافسة</div>
                      <div className="text-sm font-almarai text-gray-600">
                        {analysis.totalCompetitors} منافس في {searchRadius} كم
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* التوصيات */}
          {analysis && analysis.recommendations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-blue-50 border border-blue-200 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Zap className="h-5 w-5 text-blue-600" />
                <h4 className="font-almarai font-bold text-blue-800">توصيات ذكية</h4>
              </div>
              
              <div className="space-y-3">
                {analysis.recommendations.map((recommendation, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-2"
                  >
                    <CheckCircle className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                    <span className="text-blue-700 font-almarai text-sm text-right">
                      {recommendation}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* قائمة المنافسين */}
          {showCompetitors && filteredCompetitors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-almarai font-bold text-gray-800">
                  المنافسون القريبون ({filteredCompetitors.length})
                </h4>
                <BarChart3 className="h-5 w-5 text-saudi-gold" />
              </div>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {filteredCompetitors.slice(0, 10).map((competitor, index) => (
                  <motion.div
                    key={competitor.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-right flex-1">
                        <h5 className="font-almarai font-bold text-gray-800 text-sm">
                          {competitor.name}
                        </h5>
                        <p className="text-gray-600 font-almarai text-xs">
                          {competitor.address}
                        </p>
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold text-saudi-green">
                          {competitor.distance} كم
                        </div>
                        <div className="text-xs text-gray-500">
                          ⭐ {competitor.rating}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* تنبيه في حالة عدم توفر API */}
      {!import.meta.env.VITE_GOOGLE_MAPS_API_KEY && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <div className="text-right">
              <h4 className="font-almarai font-bold text-yellow-800">تنبيه</h4>
              <p className="text-yellow-700 font-almarai text-sm">
                لتفعيل الخرائط التفاعلية، يرجى إضافة Google Maps API Key في متغيرات البيئة
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapLocationSelector;