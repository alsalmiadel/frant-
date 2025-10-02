import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  FileText, 
  Code, 
  TrendingUp, 
  Calendar, 
  Download,
  Eye,
  Share2,
  Filter,
  Search,
  Plus,
  Target,
  DollarSign,
  Users,
  Clock,
  Award,
  Zap,
  CheckCircle,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Edit,
  Trash2,
  RefreshCw,
  Loader,
  Star,
  Activity
} from 'lucide-react';
import { Project } from '../types';
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
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface DashboardProps {
  projects: Project[];
  onProjectSelect: (project: Project) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ projects: initialProjects, onProjectSelect }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState(initialProjects);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'status'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const { user } = useAuth();

  // تحديث المشاريع عند تغيير المستخدم
  useEffect(() => {
    if (user) {
      loadUserProjects();
    }
  }, [user]);

  const loadUserProjects = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      // محاكاة تحميل المشاريع
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProjects(initialProjects);
    } catch (error) {
      toast.error('خطأ في تحميل المشاريع');
    } finally {
      setIsLoading(false);
    }
  };

  // بيانات الرسوم البيانية
  const monthlyData = [
    { month: 'يناير', projects: 12, revenue: 45000, users: 150 },
    { month: 'فبراير', projects: 19, revenue: 67000, users: 280 },
    { month: 'مارس', projects: 25, revenue: 89000, users: 420 },
    { month: 'أبريل', projects: 31, revenue: 112000, users: 580 },
    { month: 'مايو', projects: 42, revenue: 145000, users: 750 },
    { month: 'يونيو', projects: 38, revenue: 134000, users: 690 }
  ];

  const sectorData = [
    { name: 'تجارة إلكترونية', value: 35, color: '#006B3F' },
    { name: 'مطاعم وتوصيل', value: 25, color: '#FFD700' },
    { name: 'تقنية', value: 20, color: '#003366' },
    { name: 'خدمات', value: 12, color: '#10B981' },
    { name: 'أخرى', value: 8, color: '#6B7280' }
  ];

  const performanceData = [
    { metric: 'معدل النجاح', value: 94, target: 90, trend: 'up' },
    { metric: 'رضا العملاء', value: 4.8, target: 4.5, trend: 'up' },
    { metric: 'سرعة التحليل', value: 2.3, target: 3.0, trend: 'up' },
    { metric: 'دقة التوقعات', value: 87, target: 85, trend: 'up' }
  ];

  const recentActivity = [
    { type: 'analysis', title: 'تم تحليل مشروع تطبيق توصيل', time: 'منذ 5 دقائق', status: 'completed' },
    { type: 'report', title: 'تم إنشاء دراسة جدوى لمتجر إلكتروني', time: 'منذ 15 دقيقة', status: 'completed' },
    { type: 'code', title: 'تم توليد كود لتطبيق حجوزات', time: 'منذ 30 دقيقة', status: 'completed' },
    { type: 'user', title: 'مستخدم جديد انضم للمنصة', time: 'منذ ساعة', status: 'new' }
  ];

  const quickStats = [
    {
      title: 'إجمالي المشاريع',
      value: projects.length.toString(),
      change: '+12%',
      trend: 'up',
      icon: BarChart3,
      color: 'from-saudi-green to-tech-blue',
      description: 'مشروع تم تحليله'
    },
    {
      title: 'التقارير المُنشأة',
      value: projects.filter(p => p.status === 'completed').length.toString(),
      change: '+8%',
      trend: 'up',
      icon: FileText,
      color: 'from-saudi-gold to-saudi-green',
      description: 'دراسة جدوى احترافية'
    },
    {
      title: 'قيد التحليل',
      value: projects.filter(p => p.status === 'analyzing').length.toString(),
      change: '+15%',
      trend: 'up',
      icon: Code,
      color: 'from-tech-blue to-saudi-gold',
      description: 'مشروع قيد المعالجة'
    },
    {
      title: 'المسودات',
      value: projects.filter(p => p.status === 'saved').length.toString(),
      change: '+23%',
      trend: 'up',
      icon: Users,
      color: 'from-saudi-green to-saudi-gold',
      description: 'مسودة محفوظة'
    }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesFilter = activeFilter === 'all' || project.status === activeFilter;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.title.localeCompare(b.title);
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المشروع؟')) return;
    
    try {
      await apiService.deleteProject(projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
      setSelectedProjects(prev => prev.filter(id => id !== projectId));
      toast.success('تم حذف المشروع بنجاح');
    } catch (error) {
      toast.error('خطأ في حذف المشروع');
    }
  };

  const handleBulkAction = async (action: 'delete' | 'export') => {
    if (selectedProjects.length === 0) {
      toast.error('يرجى اختيار مشاريع أولاً');
      return;
    }

    if (action === 'delete') {
      if (!confirm(`هل أنت متأكد من حذف ${selectedProjects.length} مشروع؟`)) return;
      
      try {
        await Promise.all(selectedProjects.map(id => apiService.deleteProject(id)));
        setProjects(prev => prev.filter(p => !selectedProjects.includes(p.id)));
        setSelectedProjects([]);
        toast.success('تم حذف المشاريع المحددة');
      } catch (error) {
        toast.error('خطأ في حذف المشاريع');
      }
    } else if (action === 'export') {
      // تصدير المشاريع المحددة
      const selectedProjectsData = projects.filter(p => selectedProjects.includes(p.id));
      const dataStr = JSON.stringify(selectedProjectsData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `مشاريعي_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('تم تصدير المشاريع بنجاح');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-light-green p-6">
      <div className="max-w-7xl mx-auto">
        {/* رأس لوحة التحكم */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-almarai font-bold text-gray-900 mb-2">
                لوحة التحكم الذكية
              </h1>
              <p className="text-gray-600 font-almarai text-lg">
                مرحباً {user?.name}، إليك نظرة على مشاريعك وإنجازاتك
              </p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-almarai text-gray-600">متصل</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-saudi-green" />
                  <span className="text-sm font-almarai text-gray-600">آخر نشاط: الآن</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <motion.button 
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.hash = 'flow';
                  }
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-saudi-green to-saudi-gold text-white px-6 py-3 rounded-xl font-almarai font-bold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                مشروع جديد
              </motion.button>
              <button 
                onClick={loadUserProjects}
                disabled={isLoading}
                className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-almarai font-bold hover:shadow-md transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                تحديث
              </button>
            </div>
          </div>
        </motion.div>

        {/* الإحصائيات السريعة */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-7 w-7 text-white" />
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
                  stat.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {stat.trend === 'up' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                  {stat.change}
                </div>
              </div>
              
              <div className="text-right">
                <motion.h3 
                  className="text-2xl font-bold text-gray-900 mb-1 font-poppins"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  {stat.value}
                </motion.h3>
                <p className="text-gray-800 font-almarai font-bold mb-1">
                  {stat.title}
                </p>
                <p className="text-gray-600 font-almarai text-sm">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* الرسوم البيانية */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* رسم بياني للمشاريع الشهرية */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-almarai font-bold text-gray-800">
                نمو المشاريع الشهري
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="font-almarai">+24% هذا الشهر</span>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#006B3F" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#006B3F" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
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
                    borderRadius: '12px',
                    fontFamily: 'Almarai'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="projects" 
                  stroke="#006B3F" 
                  fill="url(#colorGradient)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* رسم دائري للقطاعات */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-almarai font-bold text-gray-800">
                توزيع المشاريع حسب القطاع
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Target className="h-4 w-4 text-saudi-gold" />
                <span className="font-almarai">{sectorData.length} قطاعات</span>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={sectorData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    fontFamily: 'Almarai'
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
            
            <div className="grid grid-cols-2 gap-3 mt-4">
              {sectorData.map((sector, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: sector.color }}
                  />
                  <span className="text-sm font-almarai text-gray-700">
                    {sector.name} ({sector.value}%)
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* النشاط الأخير والمشاريع */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* النشاط الأخير */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-almarai font-bold text-gray-800">
                النشاط الأخير
              </h3>
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'analysis' ? 'bg-saudi-green/10 text-saudi-green' :
                    activity.type === 'report' ? 'bg-saudi-gold/10 text-saudi-gold' :
                    activity.type === 'code' ? 'bg-tech-blue/10 text-tech-blue' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {activity.type === 'analysis' && <BarChart3 className="h-4 w-4" />}
                    {activity.type === 'report' && <FileText className="h-4 w-4" />}
                    {activity.type === 'code' && <Code className="h-4 w-4" />}
                    {activity.type === 'user' && <Users className="h-4 w-4" />}
                  </div>
                  
                  <div className="flex-1 text-right">
                    <p className="font-almarai font-medium text-gray-800 text-sm">
                      {activity.title}
                    </p>
                    <p className="text-gray-500 font-almarai text-xs">
                      {activity.time}
                    </p>
                  </div>
                  
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'completed' ? 'bg-green-500' :
                    activity.status === 'new' ? 'bg-blue-500' : 'bg-yellow-500'
                  }`} />
                </motion.div>
              ))}
            </div>
            
            <button className="w-full mt-4 text-saudi-green font-almarai font-bold hover:bg-light-green py-2 rounded-lg transition-colors">
              عرض جميع الأنشطة
            </button>
          </motion.div>

          {/* قائمة المشاريع */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <h2 className="text-xl font-almarai font-bold text-gray-800">
                  مشاريعي ({filteredProjects.length})
                </h2>
                
                <div className="flex items-center gap-4">
                  {/* البحث */}
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="ابحث في المشاريع..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-4 pr-10 py-2 border border-gray-200 rounded-lg font-almarai text-right focus:border-saudi-green focus:outline-none"
                    />
                  </div>
                  
                  {/* الفلترة */}
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-gray-400" />
                    <select
                      value={activeFilter}
                      onChange={(e) => setActiveFilter(e.target.value)}
                      className="border border-gray-200 rounded-lg px-3 py-2 font-almarai text-right focus:border-saudi-green focus:outline-none"
                    >
                      <option value="all">جميع المشاريع</option>
                      <option value="completed">مكتملة</option>
                      <option value="analyzing">قيد التحليل</option>
                      <option value="saved">محفوظة</option>
                    </select>
                  </div>

                  {/* الترتيب */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="border border-gray-200 rounded-lg px-3 py-2 font-almarai text-right focus:border-saudi-green focus:outline-none"
                  >
                    <option value="date">الأحدث</option>
                    <option value="name">الاسم</option>
                    <option value="status">الحالة</option>
                  </select>
                </div>
              </div>

              {/* أدوات الإجراءات المجمعة */}
              <AnimatePresence>
                {selectedProjects.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-4 bg-saudi-green/5 rounded-lg border border-saudi-green/20"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-almarai text-saudi-green font-bold">
                        {selectedProjects.length} مشروع محدد
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleBulkAction('export')}
                          className="bg-tech-blue text-white px-4 py-2 rounded-lg font-almarai text-sm hover:bg-tech-blue/90 transition-colors"
                        >
                          تصدير
                        </button>
                        <button
                          onClick={() => handleBulkAction('delete')}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg font-almarai text-sm hover:bg-red-600 transition-colors"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {isLoading ? (
                  <div className="p-12 text-center">
                    <Loader className="h-8 w-8 text-saudi-green mx-auto mb-4 animate-spin" />
                    <p className="font-almarai text-gray-600">جاري تحميل المشاريع...</p>
                  </div>
                ) : filteredProjects.length > 0 ? filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-6 hover:bg-gray-50 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedProjects.includes(project.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProjects(prev => [...prev, project.id]);
                            } else {
                              setSelectedProjects(prev => prev.filter(id => id !== project.id));
                            }
                          }}
                          className="w-4 h-4 text-saudi-green border-gray-300 rounded focus:ring-saudi-green"
                        />
                        
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-gray-400 hover:text-saudi-green transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-saudi-gold transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-tech-blue transition-colors">
                            <Share2 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProject(project.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex-1 text-right" onClick={() => onProjectSelect(project)}>
                        <div className="flex items-center justify-end gap-3 mb-2">
                          <h3 className="font-almarai font-bold text-gray-800">
                            {project.title}
                          </h3>
                          <div className={`w-3 h-3 rounded-full ${
                            project.status === 'completed' ? 'bg-green-500' :
                            project.status === 'analyzing' ? 'bg-yellow-500 animate-pulse' : 'bg-gray-400'
                          }`} />
                        </div>
                        
                        <p className="text-gray-600 font-almarai text-sm mb-3 line-clamp-2">
                          {project.description}
                        </p>
                        
                        <div className="flex items-center justify-end gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(project.createdAt).toLocaleDateString('ar-SA')}
                          </span>
                          <span className="bg-saudi-green/10 text-saudi-green px-3 py-1 rounded-full text-xs font-bold">
                            {project.city}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            project.status === 'completed' ? 'bg-green-100 text-green-800' :
                            project.status === 'analyzing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {project.status === 'completed' ? 'مكتمل' :
                             project.status === 'analyzing' ? 'قيد التحليل' : 'محفوظ'}
                          </span>
                        </div>
                      </div>
                      
                      <motion.button 
                        onClick={() => onProjectSelect(project)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-saudi-green text-white rounded-lg font-almarai text-sm hover:bg-saudi-green/90 transition-colors"
                      >
                        عرض التقرير
                      </motion.button>
                    </div>
                  </motion.div>
                )) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-12 text-center"
                  >
                    <div className="w-20 h-20 bg-gradient-to-r from-saudi-green/10 to-saudi-gold/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <BarChart3 className="h-10 w-10 text-saudi-green" />
                    </div>
                    <h3 className="text-lg font-almarai font-bold text-gray-800 mb-2">
                      {searchTerm ? 'لا توجد نتائج للبحث' : 'لا توجد مشاريع بعد'}
                    </h3>
                    <p className="text-gray-600 font-almarai mb-6">
                      {searchTerm ? 'جرب كلمات بحث أخرى' : 'ابدأ بإنشاء مشروعك الأول للحصول على تحليل شامل'}
                    </p>
                    <motion.button 
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          window.location.hash = 'flow';
                        }
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-saudi-green to-saudi-gold text-white px-6 py-3 rounded-xl font-almarai font-bold hover:shadow-lg transition-all duration-300"
                    >
                      إنشاء مشروع جديد
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;