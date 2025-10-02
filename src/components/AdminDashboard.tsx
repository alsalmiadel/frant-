import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BarChart3, 
  FileText, 
  Settings, 
  Shield, 
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Eye,
  Edit,
  Trash2,
  Download,
  Filter,
  Search,
  RefreshCw,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Target,
  Globe,
  Server,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  Lock,
  Key,
  Bell,
  MessageSquare,
  Code,
  Zap,
  Award,
  Star,
  Clock,
  MapPin,
  Building
} from 'lucide-react';
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
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editMode, setEditMode] = useState(false);
  const [editableData, setEditableData] = useState({
    totalUsers: 12847,
    activeUsers: 8934,
    totalProjects: 45623,
    completedAnalyses: 38291,
    revenue: 2847392,
    growth: 24.5
  });
  const { user } = useAuth();

  // بيانات وهمية للعرض التوضيحي
  const systemStats = {
    ...editableData,
    serverUptime: 99.8,
    apiResponseTime: 234
  };

  const recentUsers = [
    {
      id: '1',
      name: 'أحمد محمد العتيبي',
      email: 'ahmed.alotaibi@email.com',
      phone: '0501234567',
      city: 'الرياض',
      subscription: 'growth',
      status: 'active',
      joinDate: '2024-03-15',
      lastLogin: '2024-03-20',
      projectsCount: 5,
      totalSpent: 1200
    },
    {
      id: '2',
      name: 'فاطمة سالم الزهراني',
      email: 'fatima.alzahrani@email.com',
      phone: '0509876543',
      city: 'جدة',
      subscription: 'enterprise',
      status: 'active',
      joinDate: '2024-02-28',
      lastLogin: '2024-03-19',
      projectsCount: 12,
      totalSpent: 4500
    },
    {
      id: '3',
      name: 'محمد عبدالله القحطاني',
      email: 'mohammed.alqahtani@email.com',
      phone: '0551234567',
      city: 'الدمام',
      subscription: 'free',
      status: 'inactive',
      joinDate: '2024-03-10',
      lastLogin: '2024-03-12',
      projectsCount: 2,
      totalSpent: 0
    }
  ];

  const systemMetrics = [
    { name: 'يناير', users: 1200, projects: 3400, revenue: 145000 },
    { name: 'فبراير', users: 1890, projects: 4200, revenue: 189000 },
    { name: 'مارس', users: 2340, projects: 5100, revenue: 234000 },
    { name: 'أبريل', users: 2890, projects: 6200, revenue: 298000 },
    { name: 'مايو', users: 3450, projects: 7300, revenue: 356000 },
    { name: 'يونيو', users: 4120, projects: 8500, revenue: 423000 }
  ];

  const subscriptionData = [
    { name: 'مجاني', value: 65, color: '#6B7280' },
    { name: 'النمو', value: 28, color: '#006B3F' },
    { name: 'المؤسسات', value: 7, color: '#FFD700' }
  ];

  const tabs = [
    { id: 'overview', title: 'نظرة عامة', icon: BarChart3 },
    { id: 'users', title: 'إدارة المستخدمين', icon: Users },
    { id: 'projects', title: 'المشاريع', icon: FileText },
    { id: 'analytics', title: 'التحليلات', icon: TrendingUp },
    { id: 'system', title: 'النظام', icon: Server },
    { id: 'security', title: 'الأمان', icon: Shield },
    { id: 'settings', title: 'الإعدادات', icon: Settings }
  ];

  const quickActions = [
    { icon: UserPlus, title: 'إضافة مستخدم', action: () => console.log('Add user') },
    { icon: Mail, title: 'إرسال إشعار', action: () => console.log('Send notification') },
    { icon: Download, title: 'تصدير البيانات', action: () => console.log('Export data') },
    { icon: RefreshCw, title: 'تحديث النظام', action: () => console.log('Refresh system') }
  ];

  const systemHealth = [
    { name: 'الخادم الرئيسي', status: 'healthy', uptime: '99.9%', response: '120ms' },
    { name: 'قاعدة البيانات', status: 'healthy', uptime: '99.8%', response: '45ms' },
    { name: 'API Gateway', status: 'warning', uptime: '98.5%', response: '280ms' },
    { name: 'خدمة الملفات', status: 'healthy', uptime: '99.7%', response: '89ms' }
  ];

  const recentActivities = [
    { type: 'user_signup', message: 'مستخدم جديد: أحمد العتيبي', time: 'منذ 5 دقائق', severity: 'info' },
    { type: 'project_completed', message: 'تم إكمال دراسة جدوى لمشروع توصيل', time: 'منذ 12 دقيقة', severity: 'success' },
    { type: 'system_alert', message: 'استخدام الذاكرة وصل 85%', time: 'منذ 30 دقيقة', severity: 'warning' },
    { type: 'payment_received', message: 'دفعة جديدة: 300 ريال', time: 'منذ ساعة', severity: 'success' },
    { type: 'error_reported', message: 'خطأ في تحميل الملفات', time: 'منذ ساعتين', severity: 'error' }
  ];

  // التحقق من صلاحيات الأدمن
  const isAdmin = user?.subscription_type === 'enterprise' || 
                  user?.email?.includes('admin') || 
                  user?.email?.includes('support') ||
                  user?.email === 'admin@smartstart.sa' ||
                  user?.email === 'demo@smartstart.sa';

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-light-green flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-almarai font-bold text-gray-800 mb-2">
            غير مصرح لك
          </h2>
          <p className="text-gray-600 font-almarai mb-4">
            هذه الصفحة مخصصة للمشرفين فقط. للوصول، يجب أن يكون لديك:
          </p>
          <div className="text-sm font-almarai text-gray-500 space-y-1 mb-6">
            <p>• اشتراك مؤسسات</p>
            <p>• بريد إلكتروني يحتوي على "admin"</p>
            <p>• بريد إلكتروني يحتوي على "support"</p>
            <p>• admin@smartstart.sa</p>
            <p>• demo@smartstart.sa (للتجربة)</p>
          </div>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-4 mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-almarai font-bold text-gray-800">الإحصائيات الرئيسية</h3>
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className={`px-4 py-2 rounded-lg font-almarai text-sm transition-colors ${
                      editMode ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-saudi-green text-white hover:bg-saudi-green/90'
                    }`}
                  >
                    {editMode ? 'إنهاء التعديل' : 'تعديل البيانات'}
                  </button>
                </div>
              </div>
              
              {[
                { title: 'إجمالي المستخدمين', value: systemStats.totalUsers, key: 'totalUsers', icon: Users, color: 'from-saudi-green to-tech-blue', change: '+12%' },
                { title: 'المستخدمين النشطين', value: systemStats.activeUsers, key: 'activeUsers', icon: Activity, color: 'from-saudi-gold to-saudi-green', change: '+8%' },
                { title: 'إجمالي المشاريع', value: systemStats.totalProjects, key: 'totalProjects', icon: FileText, color: 'from-tech-blue to-saudi-gold', change: '+15%' },
                { title: 'الإيرادات (ريال)', value: systemStats.revenue, key: 'revenue', icon: DollarSign, color: 'from-green-500 to-emerald-600', change: '+24%' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
                      {stat.change}
                    </div>
                  </div>
                  <div className="text-right">
                    {editMode ? (
                      <input
                        type="number"
                        value={stat.value}
                        onChange={(e) => setEditableData(prev => ({
                          ...prev,
                          [stat.key]: parseInt(e.target.value) || 0
                        }))}
                        className="text-2xl font-bold text-gray-900 mb-1 bg-transparent border-b-2 border-saudi-green focus:outline-none text-right w-full"
                      />
                    ) : (
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value.toLocaleString()}</h3>
                    )}
                    <p className="text-gray-600 font-almarai">{stat.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* الرسوم البيانية */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-almarai font-bold text-gray-800 mb-4 text-right">
                  نمو المستخدمين والمشاريع
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={systemMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fontFamily: 'Almarai' }} />
                    <YAxis tick={{ fontSize: 12, fontFamily: 'Almarai' }} />
                    <Tooltip contentStyle={{ fontFamily: 'Almarai' }} />
                    <Line type="monotone" dataKey="users" stroke="#006B3F" strokeWidth={3} name="المستخدمين" />
                    <Line type="monotone" dataKey="projects" stroke="#FFD700" strokeWidth={3} name="المشاريع" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-almarai font-bold text-gray-800 mb-4 text-right">
                  توزيع الاشتراكات
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={subscriptionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {subscriptionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontFamily: 'Almarai' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {subscriptionData.map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-xs font-almarai">{item.name}</span>
                      </div>
                      <span className="text-sm font-bold">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* النشاط الأخير */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-almarai font-bold text-gray-800 mb-4 text-right">
                النشاط الأخير
              </h3>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.severity === 'success' ? 'bg-green-100 text-green-600' :
                        activity.severity === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                        activity.severity === 'error' ? 'bg-red-100 text-red-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {activity.severity === 'success' && <CheckCircle className="h-4 w-4" />}
                        {activity.severity === 'warning' && <AlertTriangle className="h-4 w-4" />}
                        {activity.severity === 'error' && <AlertTriangle className="h-4 w-4" />}
                        {activity.severity === 'info' && <Activity className="h-4 w-4" />}
                      </div>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                    <div className="text-right flex-1">
                      <p className="font-almarai text-gray-800">{activity.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6">
            {/* أدوات إدارة المستخدمين */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <h2 className="text-xl font-almarai font-bold text-gray-800">
                  إدارة المستخدمين ({recentUsers.length})
                </h2>
                
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="البحث في المستخدمين..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-4 pr-10 py-2 border border-gray-200 rounded-lg font-almarai text-right text-sm focus:border-saudi-green focus:outline-none"
                    />
                  </div>
                  
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 font-almarai text-right text-sm focus:border-saudi-green focus:outline-none"
                  >
                    <option value="all">جميع المستخدمين</option>
                    <option value="active">نشط</option>
                    <option value="inactive">غير نشط</option>
                    <option value="enterprise">مؤسسات</option>
                    <option value="growth">نمو</option>
                    <option value="free">مجاني</option>
                  </select>

                  <button className="bg-saudi-green text-white px-4 py-2 rounded-lg font-almarai text-sm hover:bg-saudi-green/90 transition-colors flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    إضافة مستخدم
                  </button>
                </div>
              </div>

              {/* جدول المستخدمين */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-right font-almarai font-bold text-gray-800">الإجراءات</th>
                      <th className="p-3 text-right font-almarai font-bold text-gray-800">المبلغ المدفوع</th>
                      <th className="p-3 text-right font-almarai font-bold text-gray-800">المشاريع</th>
                      <th className="p-3 text-right font-almarai font-bold text-gray-800">آخر دخول</th>
                      <th className="p-3 text-right font-almarai font-bold text-gray-800">الاشتراك</th>
                      <th className="p-3 text-right font-almarai font-bold text-gray-800">المدينة</th>
                      <th className="p-3 text-right font-almarai font-bold text-gray-800">الجوال</th>
                      <th className="p-3 text-right font-almarai font-bold text-gray-800">البريد</th>
                      <th className="p-3 text-right font-almarai font-bold text-gray-800">الاسم</th>
                      <th className="p-3 text-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-saudi-green border-gray-300 rounded focus:ring-saudi-green"
                        />
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentUsers.map((user, index) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex gap-2">
                            <button className="text-saudi-green hover:text-saudi-gold transition-colors">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-tech-blue hover:text-blue-700 transition-colors">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-500 hover:text-red-700 transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                        <td className="p-3 text-right font-almarai text-gray-700">
                          {user.totalSpent.toLocaleString()} ريال
                        </td>
                        <td className="p-3 text-right font-almarai text-gray-700">
                          {user.projectsCount}
                        </td>
                        <td className="p-3 text-right font-almarai text-gray-700 text-sm">
                          {new Date(user.lastLogin).toLocaleDateString('ar-SA')}
                        </td>
                        <td className="p-3 text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            user.subscription === 'enterprise' ? 'bg-saudi-gold/20 text-saudi-gold' :
                            user.subscription === 'growth' ? 'bg-saudi-green/20 text-saudi-green' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {user.subscription === 'enterprise' ? 'مؤسسات' :
                             user.subscription === 'growth' ? 'نمو' : 'مجاني'}
                          </span>
                        </td>
                        <td className="p-3 text-right font-almarai text-gray-700">
                          {user.city}
                        </td>
                        <td className="p-3 text-right font-almarai text-gray-700">
                          {user.phone}
                        </td>
                        <td className="p-3 text-right font-almarai text-gray-700">
                          {user.email}
                        </td>
                        <td className="p-3 text-right font-almarai font-bold text-gray-800">
                          {user.name}
                        </td>
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-saudi-green border-gray-300 rounded focus:ring-saudi-green"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'system':
        return (
          <div className="space-y-6">
            {/* صحة النظام */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-almarai font-bold text-gray-800 mb-4 text-right">
                صحة النظام
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {systemHealth.map((service, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-3 h-3 rounded-full ${
                        service.status === 'healthy' ? 'bg-green-500' :
                        service.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <h4 className="font-almarai font-bold text-gray-800 text-sm">
                        {service.name}
                      </h4>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">الاستجابة:</span>
                        <span className="font-bold">{service.response}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">وقت التشغيل:</span>
                        <span className="font-bold">{service.uptime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* مراقبة الموارد */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'استخدام المعالج', value: '45%', icon: Cpu, color: 'text-blue-600' },
                { title: 'استخدام الذاكرة', value: '67%', icon: HardDrive, color: 'text-green-600' },
                { title: 'مساحة القرص', value: '23%', icon: Database, color: 'text-yellow-600' },
                { title: 'الشبكة', value: '12 MB/s', icon: Wifi, color: 'text-purple-600' }
              ].map((metric, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
                  <metric.icon className={`h-8 w-8 ${metric.color} mx-auto mb-3`} />
                  <h4 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h4>
                  <p className="text-gray-600 font-almarai text-sm">{metric.title}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            {/* تقرير الأمان */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-almarai font-bold text-gray-800 mb-4 text-right">
                تقرير الأمان
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="text-2xl font-bold text-green-600 mb-1">99.9%</h4>
                  <p className="text-gray-600 font-almarai text-sm">مستوى الأمان</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <Lock className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="text-2xl font-bold text-blue-600 mb-1">256-bit</h4>
                  <p className="text-gray-600 font-almarai text-sm">تشفير SSL</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <Key className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h4 className="text-2xl font-bold text-yellow-600 mb-1">0</h4>
                  <p className="text-gray-600 font-almarai text-sm">تهديدات نشطة</p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-almarai font-bold text-green-800">النظام آمن</span>
                </div>
                <p className="text-green-700 font-almarai text-sm">
                  جميع الأنظمة تعمل بشكل طبيعي ولا توجد تهديدات أمنية
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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
                🛡️ لوحة تحكم الأدمن
              </h1>
              <p className="text-gray-600 font-almarai text-lg">
                مرحباً {user?.name}، إدارة شاملة لنظام SmartStartAI
              </p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-almarai text-gray-600">النظام يعمل بشكل طبيعي</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-saudi-green" />
                  <span className="text-sm font-almarai text-gray-600">
                    {systemStats.activeUsers.toLocaleString()} مستخدم نشط
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {quickActions.map((action, index) => (
                <motion.button
                  key={index}
                  onClick={action.action}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white border border-gray-200 text-gray-700 p-3 rounded-xl hover:shadow-md transition-all duration-300 flex items-center gap-2"
                  title={action.title}
                >
                  <action.icon className="h-5 w-5" />
                </motion.button>
              ))}
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
      </div>
    </div>
  );
};

export default AdminDashboard;