import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  TrendingUp, 
  DollarSign, 
  Code, 
  Leaf, 
  Download, 
  Share2,
  Eye,
  Copy,
  Play,
  BarChart3,
  PieChart,
  Target,
  Users,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Zap,
  ExternalLink,
  Printer,
  Mail
} from 'lucide-react';
import { Analysis } from '../types';
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
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

interface AnalysisResultsProps {
  analysis: Analysis;
  projectTitle: string;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysis, projectTitle }) => {
  const [activeTab, setActiveTab] = useState('feasibility');
  const [codeExpanded, setCodeExpanded] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const tabs = [
    { id: 'feasibility', title: 'الجدوى التجارية', icon: TrendingUp, color: 'text-saudi-green' },
    { id: 'marketing', title: 'الخطة التسويقية', icon: Target, color: 'text-saudi-gold' },
    { id: 'financial', title: 'النموذج المالي', icon: DollarSign, color: 'text-tech-blue' },
    { id: 'code', title: 'الكود البرمجي', icon: Code, color: 'text-purple-600' },
    { id: 'esg', title: 'تقرير ESG', icon: Leaf, color: 'text-green-600' }
  ];

  // بيانات وهمية للرسوم البيانية
  const financialData = [
    { year: 'السنة 1', revenue: 120000, costs: 80000, profit: 40000 },
    { year: 'السنة 2', revenue: 280000, costs: 160000, profit: 120000 },
    { year: 'السنة 3', revenue: 450000, costs: 240000, profit: 210000 },
    { year: 'السنة 4', revenue: 680000, costs: 320000, profit: 360000 },
    { year: 'السنة 5', revenue: 920000, costs: 400000, profit: 520000 }
  ];

  const marketData = [
    { segment: 'العائلات الشابة', percentage: 45, color: '#006B3F' },
    { segment: 'المهنيين', percentage: 30, color: '#FFD700' },
    { segment: 'كبار السن', percentage: 15, color: '#003366' },
    { segment: 'الطلاب', percentage: 10, color: '#10B981' }
  ];

  const competitorData = [
    { name: 'منافس 1', marketShare: 35, strength: 85 },
    { name: 'منافس 2', marketShare: 25, strength: 70 },
    { name: 'منافس 3', marketShare: 20, strength: 60 },
    { name: 'مشروعك', marketShare: 20, strength: 90 }
  ];

  const handleDownloadFeasibilityZip = async () => {
    try {
      setIsGeneratingReport(true);
      
      // تتبع طلب دراسة الجدوى
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'download_feasibility_zip', {
          event_category: 'Download',
          event_label: 'User downloaded feasibility ZIP',
          custom_parameters: {
            project_name: projectTitle,
            file_format: 'zip'
          }
        });
      }
      
      // استدعاء API دراسة الجدوى الحقيقي
      const response = await fetch('/.netlify/functions/feasibility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project: projectTitle,
          capex: 120000,
          price_avg: 45,
          customers_m: 800,
          months: 60,
          growth_rate: 0.05,
          location: "الرياض",
          sector: "مطاعم وتوصيل",
          cogs_rate: 0.35,
          var_opex_rate: 0.05,
          tax_rate: 0.15,
          discount_rate: 0.18
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // تحميل ملف ZIP
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `feasibility_${projectTitle.replace(/\s+/g, '_')}_${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('تم تحميل دراسة الجدوى الكاملة (PDF + Excel + JSON)');
      
    } catch (error) {
      console.error('Download error:', error);
      toast.error('خطأ في تحميل دراسة الجدوى');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleShareReport = async (method: 'email' | 'link' | 'whatsapp') => {
    try {
      const shareUrl = `${window.location.origin}/shared-report/${Date.now()}`;
      
      switch (method) {
        case 'email':
          window.open(`mailto:?subject=دراسة جدوى: ${projectTitle}&body=مرحباً،%0A%0Aأرسل لك دراسة الجدوى لمشروع "${projectTitle}".%0A%0Aيمكنك مراجعة التقرير على الرابط التالي:%0A${shareUrl}`);
          break;
        case 'whatsapp':
          window.open(`https://wa.me/?text=دراسة جدوى مشروع "${projectTitle}"%0A${shareUrl}`);
          break;
        case 'link':
          await navigator.clipboard.writeText(shareUrl);
          toast.success('تم نسخ رابط التقرير');
          break;
      }
    } catch (error) {
      toast.error('خطأ في مشاركة التقرير');
    }
  };

  const copyCode = async () => {
    try {
      const codeContent = analysis.code || 'لا يوجد كود متاح';
      await navigator.clipboard.writeText(codeContent);
      toast.success('تم نسخ الكود بنجاح');
    } catch (error) {
      toast.error('خطأ في نسخ الكود');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'feasibility':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* تحليل SWOT */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <h3 className="text-lg font-almarai font-bold text-green-800">
                    نقاط القوة والفرص
                  </h3>
                </div>
                <p className="text-green-700 font-almarai text-right leading-relaxed">
                  {analysis.feasibility.swot}
                </p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-almarai font-bold text-blue-800">
                    تحليل السوق المستهدف
                  </h3>
                </div>
                <p className="text-blue-700 font-almarai text-right leading-relaxed mb-4">
                  {analysis.feasibility.market}
                </p>
                
                {/* رسم دائري للسوق */}
                <ResponsiveContainer width="100%" height={200}>
                  <RechartsPieChart>
                    <Pie
                      data={marketData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="percentage"
                    >
                      {marketData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontFamily: 'Almarai'
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* التكاليف والربحية */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="h-6 w-6 text-orange-600" />
                  <h3 className="text-lg font-almarai font-bold text-orange-800">
                    التكاليف المتوقعة
                  </h3>
                </div>
                <p className="text-orange-700 font-almarai text-right leading-relaxed">
                  {analysis.feasibility.costs}
                </p>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                  <h3 className="text-lg font-almarai font-bold text-purple-800">
                    الربحية المتوقعة
                  </h3>
                </div>
                <p className="text-purple-700 font-almarai text-right leading-relaxed">
                  {analysis.feasibility.profitability}
                </p>
              </div>
            </div>

            {/* رسم بياني للمنافسة */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-almarai font-bold text-gray-800 mb-4 text-right">
                تحليل المنافسة
              </h3>
              
              {/* عرض تحليل الموقع إذا كان متاحاً */}
              <div className="mb-6 bg-white rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-saudi-green">15</div>
                    <div className="text-sm font-almarai text-gray-600">منافس مباشر</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-saudi-gold">1.2 كم</div>
                    <div className="text-sm font-almarai text-gray-600">متوسط المسافة</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-tech-blue">متوسطة</div>
                    <div className="text-sm font-almarai text-gray-600">كثافة المنافسة</div>
                  </div>
                </div>
                
                <div className="bg-saudi-green/10 rounded-lg p-3">
                  <h4 className="font-almarai font-bold text-saudi-green mb-2">توصيات الموقع:</h4>
                  <ul className="space-y-1 text-sm font-almarai text-saudi-green text-right">
                    <li>• الموقع مناسب مع منافسة متوازنة</li>
                    <li>• ركز على التميز في الخدمة</li>
                    <li>• استغل قرب المنافسين لجذب العملاء</li>
                  </ul>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={competitorData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12, fontFamily: 'Almarai' }}
                    stroke="#6b7280"
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fontFamily: 'Almarai' }}
                    stroke="#6b7280"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontFamily: 'Almarai'
                    }}
                  />
                  <Bar dataKey="marketShare" fill="#006B3F" radius={[4, 4, 0, 0]} name="حصة السوق" />
                  <Bar dataKey="strength" fill="#FFD700" radius={[4, 4, 0, 0]} name="قوة المنافس" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        );
      
      case 'financial':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* الرسم البياني المالي */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-almarai font-bold text-gray-800 mb-4 text-right">
                الإسقاطات المالية (5 سنوات)
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={financialData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="year" 
                    tick={{ fontSize: 12, fontFamily: 'Almarai' }}
                    stroke="#6b7280"
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fontFamily: 'Almarai' }}
                    stroke="#6b7280"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontFamily: 'Almarai'
                    }}
                    formatter={(value) => [`${value.toLocaleString()} ريال`]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stackId="1"
                    stroke="#006B3F" 
                    fill="#006B3F"
                    fillOpacity={0.6}
                    name="الإيرادات"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="costs" 
                    stackId="2"
                    stroke="#FFD700" 
                    fill="#FFD700"
                    fillOpacity={0.6}
                    name="التكاليف"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="profit" 
                    stackId="3"
                    stroke="#003366" 
                    fill="#003366"
                    fillOpacity={0.6}
                    name="الأرباح"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* مؤشرات مالية رئيسية */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-saudi-green/10 border border-saudi-green/20 rounded-xl p-6 text-center">
                <DollarSign className="h-8 w-8 text-saudi-green mx-auto mb-3" />
                <h4 className="text-2xl font-bold text-saudi-green mb-1 font-poppins">
                  2.4M ريال
                </h4>
                <p className="font-almarai text-gray-700">إجمالي الإيرادات المتوقعة</p>
              </div>
              
              <div className="bg-saudi-gold/10 border border-saudi-gold/20 rounded-xl p-6 text-center">
                <TrendingUp className="h-8 w-8 text-saudi-gold mx-auto mb-3" />
                <h4 className="text-2xl font-bold text-saudi-gold mb-1 font-poppins">
                  18 شهر
                </h4>
                <p className="font-almarai text-gray-700">نقطة التعادل</p>
              </div>
              
              <div className="bg-tech-blue/10 border border-tech-blue/20 rounded-xl p-6 text-center">
                <Target className="h-8 w-8 text-tech-blue mx-auto mb-3" />
                <h4 className="text-2xl font-bold text-tech-blue mb-1 font-poppins">
                  25%
                </h4>
                <p className="font-almarai text-gray-700">هامش الربح المتوقع</p>
              </div>
            </div>

            {/* تفاصيل التدفق النقدي */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-almarai font-bold text-gray-800 mb-4 text-right">
                تحليل التدفق النقدي
              </h3>
              <p className="text-gray-700 font-almarai text-right leading-relaxed">
                {analysis.financial.cashFlow}
              </p>
            </div>

            {/* تحليل نقطة التعادل */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-almarai font-bold text-blue-800 mb-4 text-right">
                تحليل نقطة التعادل
              </h3>
              <p className="text-blue-700 font-almarai text-right leading-relaxed">
                {analysis.financial.breakeven}
              </p>
            </div>
          </motion.div>
        );
      
      case 'code':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gray-900 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-4 bg-gray-800">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  </div>
                  <span className="text-gray-300 font-almarai text-sm">
                    الكود المُولّد لمشروعك
                  </span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={copyCode}
                    className="bg-saudi-green text-white px-4 py-2 rounded-lg font-almarai text-sm hover:bg-saudi-green/90 transition-colors flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    نسخ
                  </button>
                  <button className="bg-tech-blue text-white px-4 py-2 rounded-lg font-almarai text-sm hover:bg-tech-blue/90 transition-colors flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    شرح
                  </button>
                  <button 
                    onClick={() => setCodeExpanded(!codeExpanded)}
                    className="bg-gray-700 text-white px-4 py-2 rounded-lg font-almarai text-sm hover:bg-gray-600 transition-colors flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    {codeExpanded ? 'تصغير' : 'توسيع'}
                  </button>
                </div>
              </div>
              
              <div className={`transition-all duration-300 ${codeExpanded ? 'max-h-none' : 'max-h-96 overflow-hidden'}`}>
                <pre className="text-green-400 font-mono text-sm p-6 bg-gray-900 overflow-x-auto">
                  <code>
{analysis.code || `// تطبيق توصيل الطعام الصحي - React Native
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

// شاشة المطاعم الرئيسية
const RestaurantsScreen = ({ navigation }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://api.healthyfood.sa/restaurants');
      
      if (!response.ok) {
        throw new Error('فشل في تحميل المطاعم');
      }
      
      const data = await response.json();
      setRestaurants(data);
    } catch (error) {
      console.error('خطأ في جلب المطاعم:', error);
      setError(error.message);
      Alert.alert('خطأ', 'فشل في تحميل المطاعم');
    } finally {
      setLoading(false);
    }
  };

  const renderRestaurant = ({ item }) => (
    <TouchableOpacity 
      style={styles.restaurantCard}
      onPress={() => navigation.navigate('Menu', { restaurant: item })}
      activeOpacity={0.7}
    >
      <View style={styles.restaurantHeader}>
        <Text style={styles.restaurantName}>{item.name}</Text>
        <View style={styles.ratingBadge}>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
        </View>
      </View>
      
      <Text style={styles.restaurantDesc}>{item.description}</Text>
      
      <View style={styles.restaurantFooter}>
        <Text style={styles.deliveryTime}>🚚 {item.deliveryTime} دقيقة</Text>
        <Text style={styles.minOrder}>الحد الأدنى: {item.minOrder} ريال</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>جاري تحميل المطاعم...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>خطأ: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchRestaurants}>
          <Text style={styles.retryText}>إعادة المحاولة</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>المطاعم الصحية في الرياض</Text>
      <FlatList
        data={restaurants}
        renderItem={renderRestaurant}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshing={loading}
        onRefresh={fetchRestaurants}
      />
    </View>
  );
};

// شاشة قائمة الطعام
const MenuScreen = ({ route, navigation }) => {
  const { restaurant } = route.params;
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart(prevCart => [...prevCart, { ...item, id: Date.now() }]);
    Alert.alert('تم الإضافة', \`تم إضافة \${item.name} إلى السلة\`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{restaurant.name}</Text>
      <Text style={styles.subHeader}>عدد العناصر في السلة: {cart.length}</Text>
      {/* قائمة الطعام هنا */}
    </View>
  );
};

// التطبيق الرئيسي
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Restaurants"
        screenOptions={{
          headerStyle: { 
            backgroundColor: '#006B3F',
            elevation: 0,
            shadowOpacity: 0
          },
          headerTintColor: '#fff',
          headerTitleStyle: { 
            fontFamily: 'Almarai',
            fontSize: 18,
            fontWeight: 'bold'
          },
          headerTitleAlign: 'center'
        }}
      >
        <Stack.Screen 
          name="Restaurants" 
          component={RestaurantsScreen}
          options={{ title: 'المطاعم الصحية' }}
        />
        <Stack.Screen 
          name="Menu" 
          component={MenuScreen}
          options={({ route }) => ({ 
            title: route.params?.restaurant?.name || 'القائمة'
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#006B3F',
    textAlign: 'right',
    marginBottom: 20,
    fontFamily: 'Almarai',
  },
  subHeader: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'right',
    marginBottom: 16,
    fontFamily: 'Almarai',
  },
  listContainer: {
    paddingBottom: 20,
  },
  restaurantCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    fontFamily: 'Almarai',
    flex: 1,
    textAlign: 'right',
  },
  ratingBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rating: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Almarai',
  },
  restaurantDesc: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'right',
    marginBottom: 12,
    fontFamily: 'Almarai',
    lineHeight: 20,
  },
  restaurantFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deliveryTime: {
    fontSize: 14,
    color: '#006B3F',
    fontFamily: 'Almarai',
    fontWeight: 'bold',
  },
  minOrder: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Almarai',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    fontFamily: 'Almarai',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    fontFamily: 'Almarai',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#006B3F',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontFamily: 'Almarai',
    fontWeight: 'bold',
  },
});

export default App;`}
                  </code>
                </pre>
              </div>
              
              {/* معلومات إضافية عن الكود */}
              <div className="bg-gray-800 p-4 border-t border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <span className="text-green-400 font-bold text-lg">React Native</span>
                    <p className="text-gray-400 font-almarai text-sm">تطبيق جوال أصلي</p>
                  </div>
                  <div>
                    <span className="text-blue-400 font-bold text-lg">TypeScript</span>
                    <p className="text-gray-400 font-almarai text-sm">كود آمن ومنظم</p>
                  </div>
                  <div>
                    <span className="text-yellow-400 font-bold text-lg">API Ready</span>
                    <p className="text-gray-400 font-almarai text-sm">جاهز للربط</p>
                  </div>
                  <div>
                    <span className="text-purple-400 font-bold text-lg">Production</span>
                    <p className="text-gray-400 font-almarai text-sm">جاهز للنشر</p>
                  </div>
                </div>
              </div>
            </div>

            {/* تفاصيل تقنية */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h4 className="font-almarai font-bold text-blue-800 mb-3 text-right">
                  التقنيات المستخدمة
                </h4>
                <ul className="space-y-2 text-right">
                  <li className="text-blue-700 font-almarai">• React Native للتطبيق الجوال</li>
                  <li className="text-blue-700 font-almarai">• Node.js للخادم الخلفي</li>
                  <li className="text-blue-700 font-almarai">• MongoDB لقاعدة البيانات</li>
                  <li className="text-blue-700 font-almarai">• Firebase للإشعارات</li>
                  <li className="text-blue-700 font-almarai">• Stripe للمدفوعات</li>
                </ul>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h4 className="font-almarai font-bold text-green-800 mb-3 text-right">
                  المميزات المطورة
                </h4>
                <ul className="space-y-2 text-right">
                  <li className="text-green-700 font-almarai">• نظام تسجيل دخول آمن</li>
                  <li className="text-green-700 font-almarai">• تتبع الطلبات المباشر</li>
                  <li className="text-green-700 font-almarai">• دفع إلكتروني متكامل</li>
                  <li className="text-green-700 font-almarai">• تقييمات ومراجعات</li>
                  <li className="text-green-700 font-almarai">• إشعارات ذكية</li>
                </ul>
              </div>
            </div>
          </motion.div>
        );

      case 'marketing':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-saudi-gold/10 border border-saudi-gold/20 rounded-xl p-6">
                <h3 className="text-lg font-almarai font-bold text-saudi-gold mb-3 text-right">
                  الحملات التسويقية
                </h3>
                <p className="text-gray-700 font-almarai text-right leading-relaxed">
                  {analysis.marketing.campaigns}
                </p>
              </div>
              
              <div className="bg-tech-blue/10 border border-tech-blue/20 rounded-xl p-6">
                <h3 className="text-lg font-almarai font-bold text-tech-blue mb-3 text-right">
                  الجمهور المستهدف
                </h3>
                <p className="text-gray-700 font-almarai text-right leading-relaxed">
                  {analysis.marketing.audience}
                </p>
              </div>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
              <h3 className="text-lg font-almarai font-bold text-purple-800 mb-3 text-right">
                المنصات المقترحة
              </h3>
              <p className="text-purple-700 font-almarai text-right leading-relaxed">
                {analysis.marketing.platforms}
              </p>
            </div>
          </motion.div>
        );

      case 'esg':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Leaf className="h-6 w-6 text-green-600" />
                  <h3 className="text-lg font-almarai font-bold text-green-800">
                    الاستدامة البيئية
                  </h3>
                </div>
                <p className="text-green-700 font-almarai text-right leading-relaxed">
                  {analysis.esg.sustainability}
                </p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-almarai font-bold text-blue-800">
                    المسؤولية الاجتماعية
                  </h3>
                </div>
                <p className="text-blue-700 font-almarai text-right leading-relaxed">
                  {analysis.esg.social}
                </p>
              </div>
            </div>

            {/* مؤشرات ESG */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-almarai font-bold text-gray-800 mb-6 text-right">
                مؤشرات الاستدامة
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: 'البيئة', score: 85, color: 'green', icon: '🌱' },
                  { name: 'المجتمع', score: 92, color: 'blue', icon: '👥' },
                  { name: 'الحوكمة', score: 78, color: 'purple', icon: '⚖️' }
                ].map((indicator, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className={`w-20 h-20 bg-${indicator.color}-100 rounded-full mx-auto mb-4 flex items-center justify-center`}>
                      <span className="text-2xl">{indicator.icon}</span>
                    </div>
                    <h4 className="font-almarai font-bold text-gray-800 mb-2">{indicator.name}</h4>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${indicator.score}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                        className={`bg-${indicator.color}-500 h-2 rounded-full`}
                      />
                    </div>
                    <span className={`text-${indicator.color}-600 font-bold`}>{indicator.score}%</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        );
      
      default:
        return (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-almarai">
              محتوى هذا القسم قيد الإنشاء...
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-light-green p-6">
      <div className="max-w-6xl mx-auto">
        {/* رأس صفحة التحليل */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="text-right">
              <h1 className="text-2xl md:text-3xl font-almarai font-bold text-gray-800 mb-2">
                تحليل شامل: {projectTitle}
              </h1>
              <div className="flex items-center justify-end gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  تم إنشاء التقرير: {new Date().toLocaleDateString('ar-SA')}
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold">
                  تحليل مكتمل ✓
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <button 
                  onClick={handleDownloadFeasibilityZip}
                  disabled={isGeneratingReport}
                  className="flex items-center gap-2 bg-saudi-green text-white px-4 py-2 rounded-lg font-almarai hover:bg-saudi-green/90 transition-colors"
                >
                  <Download className="h-5 w-5" />
                  {isGeneratingReport ? 'جاري الإنشاء...' : 'تحميل دراسة الجدوى ZIP'}
                </button>
              </div>

              <div className="relative">
                <button className="flex items-center gap-2 bg-tech-blue text-white px-4 py-2 rounded-lg font-almarai hover:bg-tech-blue/90 transition-colors">
                  <Share2 className="h-5 w-5" />
                  مشاركة
                </button>
              </div>

              <button className="flex items-center gap-2 bg-saudi-gold text-white px-4 py-2 rounded-lg font-almarai hover:bg-saudi-gold/90 transition-colors">
                <Printer className="h-5 w-5" />
                طباعة
              </button>
            </div>
          </div>

        </motion.div>

        {/* التبويبات */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-4 font-almarai whitespace-nowrap transition-all duration-300 ${
                    activeTab === tab.id
                      ? `border-b-3 border-saudi-green bg-light-green ${tab.color}`
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.title}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="w-2 h-2 bg-saudi-green rounded-full"
                    />
                  )}
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

        {/* تنبيه مهني */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6"
        >
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div className="text-right">
              <h4 className="font-almarai font-bold text-yellow-800 mb-2">
                تنبيه مهني مهم
              </h4>
              <p className="text-yellow-700 font-almarai leading-relaxed">
                جميع المخرجات والتحليلات المقدمة هي استرشادية ومبنية على البيانات المتاحة. 
                يُفضّل مراجعتها مع مستشار مالي أو قانوني مختص قبل الإيداع النهائي للجهات التمويلية.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalysisResults;