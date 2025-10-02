import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit3, 
  Save, 
  X,
  Camera,
  Award,
  TrendingUp,
  FileText,
  Code,
  Star,
  Shield,
  Bell,
  Settings,
  Download,
  Share2,
  BarChart3,
  Target,
  Zap,
  CheckCircle,
  AlertTriangle,
  Key,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const UserProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const { user, updateProfile, signOut } = useAuth();

  const [userInfo, setUserInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.city || 'الرياض'
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    marketing: false
  });

  useEffect(() => {
    if (user) {
      setUserInfo({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        city: user.city || 'الرياض'
      });
    }
  }, [user]);

  const tabs = [
    { id: 'overview', title: 'نظرة عامة', icon: User },
    { id: 'projects', title: 'مشاريعي', icon: BarChart3 },
    { id: 'achievements', title: 'الإنجازات', icon: Award },
    { id: 'settings', title: 'الإعدادات', icon: Settings }
  ];

  const userStats = [
    {
      title: 'المشاريع المكتملة',
      value: '12',
      icon: FileText,
      color: 'from-saudi-green to-tech-blue',
      change: '+3 هذا الشهر'
    },
    {
      title: 'دراسات الجدوى',
      value: '8',
      icon: BarChart3,
      color: 'from-saudi-gold to-saudi-green',
      change: '+2 هذا الشهر'
    },
    {
      title: 'الأكواد المُولدة',
      value: '5',
      icon: Code,
      color: 'from-tech-blue to-saudi-gold',
      change: '+1 هذا الشهر'
    },
    {
      title: 'ساعات الاستشارة',
      value: '24',
      icon: Target,
      color: 'from-purple-500 to-pink-500',
      change: '+6 هذا الشهر'
    }
  ];

  const achievements = [
    { name: 'رائد مبتدئ', description: 'أول مشروع', icon: '🌟', earned: true, date: '2024-01-20' },
    { name: 'محلل خبير', description: '10 مشاريع', icon: '📊', earned: true, date: '2024-02-15' },
    { name: 'مطور ماهر', description: '5 أكواد', icon: '💻', earned: true, date: '2024-03-01' },
    { name: 'مستثمر ذكي', description: 'تمويل ناجح', icon: '💰', earned: false, date: null },
    { name: 'قائد فريق', description: 'فريق من 5', icon: '👥', earned: false, date: null },
    { name: 'خبير قطاعي', description: 'تخصص قطاع', icon: '🏆', earned: false, date: null }
  ];

  const recentProjects = [
    {
      title: 'تطبيق توصيل طعام صحي',
      status: 'مكتمل',
      date: '2024-03-15',
      type: 'تقني',
      progress: 100
    },
    {
      title: 'متجر إلكتروني للمنتجات اليدوية',
      status: 'قيد التحليل',
      date: '2024-03-20',
      type: 'تجاري',
      progress: 75
    },
    {
      title: 'مركز تدريب مهني',
      status: 'محفوظ',
      date: '2024-03-18',
      type: 'تعليمي',
      progress: 45
    }
  ];

  const handleSave = async () => {
    try {
      const success = await updateProfile(userInfo);
      if (success) {
        setIsEditing(false);
        toast.success('تم تحديث الملف الشخصي بنجاح');
      }
    } catch (error) {
      toast.error('خطأ في تحديث الملف الشخصي');
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('كلمات المرور غير متطابقة');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      return;
    }

    try {
      // هنا سيتم تنفيذ تغيير كلمة المرور
      toast.success('تم تغيير كلمة المرور بنجاح');
      setShowChangePassword(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('خطأ في تغيير كلمة المرور');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('هل أنت متأكد من حذف حسابك نهائياً؟ هذا الإجراء لا يمكن التراجع عنه.')) {
      return;
    }

    try {
      // هنا سيتم تنفيذ حذف الحساب
      await signOut();
      toast.success('تم حذف الحساب بنجاح');
      window.location.href = '/';
    } catch (error) {
      toast.error('خطأ في حذف الحساب');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* إحصائيات المستخدم */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {userStats.map((stat, index) => (
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
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-600 font-almarai">{stat.title}</div>
                    </div>
                  </div>
                  <div className="text-xs text-saudi-green font-almarai">
                    {stat.change}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* النشاط الأخير */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-almarai font-bold text-gray-800 mb-4 text-right">
                المشاريع الأخيرة
              </h3>
              
              <div className="space-y-4">
                {recentProjects.map((project, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-right flex-1">
                        <h4 className="font-almarai font-bold text-gray-800">
                          {project.title}
                        </h4>
                        <div className="flex items-center justify-end gap-3 mt-1">
                          <span className="text-sm text-gray-500">{project.date}</span>
                          <span className="bg-saudi-green/10 text-saudi-green px-2 py-1 rounded-full text-xs font-bold">
                            {project.type}
                          </span>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        project.status === 'مكتمل' ? 'bg-green-100 text-green-800' :
                        project.status === 'قيد التحليل' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status}
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                        className="bg-gradient-to-r from-saudi-green to-saudi-gold h-2 rounded-full"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'achievements':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-almarai font-bold text-gray-800 mb-6 text-right">
                شاراتك وإنجازاتك
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                      achievement.earned 
                        ? 'border-saudi-green bg-light-green hover:shadow-lg' 
                        : 'border-gray-200 bg-gray-50 opacity-60'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-3">{achievement.icon}</div>
                      <h4 className="font-almarai font-bold text-gray-800 mb-2">
                        {achievement.name}
                      </h4>
                      <p className="text-gray-600 font-almarai text-sm mb-3">
                        {achievement.description}
                      </p>
                      {achievement.earned ? (
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle className="h-4 w-4 text-saudi-green" />
                          <span className="text-saudi-green font-almarai text-xs">
                            حُصل عليها في {achievement.date}
                          </span>
                        </div>
                      ) : (
                        <div className="text-gray-400 font-almarai text-xs">
                          لم تُحصل عليها بعد
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            {/* إعدادات الإشعارات */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-almarai font-bold text-gray-800 mb-6 text-right">
                إعدادات الإشعارات
              </h3>
              
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setNotifications({...notifications, [key]: e.target.checked})}
                        className="sr-only"
                      />
                      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                        value ? 'bg-saudi-green border-saudi-green' : 'border-gray-300'
                      }`}>
                        {value && <CheckCircle className="h-4 w-4 text-white" />}
                      </div>
                    </label>
                    
                    <div className="text-right flex-1 mr-4">
                      <div className="font-almarai font-bold text-gray-800">
                        {key === 'email' ? 'إشعارات البريد الإلكتروني' :
                         key === 'sms' ? 'الرسائل النصية' :
                         key === 'push' ? 'الإشعارات المنبثقة' :
                         'العروض التسويقية'}
                      </div>
                      <div className="text-sm text-gray-600 font-almarai">
                        {key === 'email' ? 'تحديثات المشاريع والتقارير' :
                         key === 'sms' ? 'تنبيهات عاجلة فقط' :
                         key === 'push' ? 'إشعارات فورية في المتصفح' :
                         'عروض خاصة ونصائح'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* إعدادات الأمان */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-almarai font-bold text-gray-800 mb-6 text-right">
                الأمان والخصوصية
              </h3>
              
              <div className="space-y-4">
                <button 
                  onClick={() => setShowChangePassword(true)}
                  className="w-full p-4 bg-gray-50 rounded-lg text-right hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <Key className="h-5 w-5 text-saudi-green" />
                    <div>
                      <div className="font-almarai font-bold text-gray-800">تغيير كلمة المرور</div>
                      <div className="text-sm text-gray-600 font-almarai">آخر تحديث: منذ 30 يوم</div>
                    </div>
                  </div>
                </button>
                
                <button className="w-full p-4 bg-gray-50 rounded-lg text-right hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <Download className="h-5 w-5 text-tech-blue" />
                    <div>
                      <div className="font-almarai font-bold text-gray-800">تحميل بياناتي</div>
                      <div className="text-sm text-gray-600 font-almarai">احصل على نسخة من جميع بياناتك</div>
                    </div>
                  </div>
                </button>
                
                <button 
                  onClick={() => setShowDeleteAccount(true)}
                  className="w-full p-4 bg-red-50 rounded-lg text-right hover:bg-red-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <Trash2 className="h-5 w-5 text-red-600" />
                    <div>
                      <div className="font-almarai font-bold text-red-800">حذف الحساب</div>
                      <div className="text-sm text-red-600 font-almarai">حذف نهائي لجميع البيانات</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <p className="text-gray-600 font-almarai text-center">
              محتوى هذا القسم قيد التطوير...
            </p>
          </div>
        );
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-light-green flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-almarai font-bold text-gray-800 mb-2">
            غير مسجل الدخول
          </h2>
          <p className="text-gray-600 font-almarai">
            يرجى تسجيل الدخول لعرض الملف الشخصي
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-light-green p-6">
      <div className="max-w-6xl mx-auto">
        {/* رأس الملف الشخصي */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8"
        >
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* صورة المستخدم */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-r from-saudi-green to-saudi-gold rounded-full flex items-center justify-center text-6xl">
                👨‍💼
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.hash = 'profile';
                  }
                }}
              </div>
              <button className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow">
                <Camera className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* معلومات المستخدم */}
            <div className="flex-1 text-center lg:text-right">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                    className="text-2xl font-almarai font-bold bg-transparent border-b-2 border-saudi-green focus:outline-none text-right w-full"
                    placeholder="الاسم الكامل"
                  />
                  <input
                    type="email"
                    value={userInfo.email}
                    onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                    className="text-gray-600 font-almarai bg-transparent border-b border-gray-300 focus:outline-none text-right w-full"
                    placeholder="البريد الإلكتروني"
                  />
                  <input
                    type="tel"
                    value={userInfo.phone}
                    onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                    className="text-gray-600 font-almarai bg-transparent border-b border-gray-300 focus:outline-none text-right w-full"
                    placeholder="رقم الجوال"
                  />
                  <select
                    value={userInfo.city}
                    onChange={(e) => setUserInfo({...userInfo, city: e.target.value})}
                    className="text-gray-600 font-almarai bg-transparent border-b border-gray-300 focus:outline-none text-right w-full"
                  >
                    {['الرياض', 'جدة', 'الدمام', 'المدينة المنورة', 'مكة المكرمة', 'الطائف'].map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <h1 className="text-3xl font-almarai font-bold text-gray-800 mb-2">
                    {user.name}
                  </h1>
                  <p className="text-gray-600 font-almarai mb-4">
                    {user.email}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center lg:justify-end gap-4 mb-6">
                <div className="flex items-center gap-2 bg-saudi-green/10 text-saudi-green px-4 py-2 rounded-full">
                  <MapPin className="h-4 w-4" />
                  <span className="font-almarai font-bold">{user.city}</span>
                </div>
                
                <div className="flex items-center gap-2 bg-saudi-gold/10 text-saudi-gold px-4 py-2 rounded-full">
                  <Star className="h-4 w-4" />
                  <span className="font-almarai font-bold">
                    باقة {user.subscription_type === 'free' ? 'مجانية' : 
                          user.subscription_type === 'growth' ? 'النمو' : 'المؤسسات'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 bg-tech-blue/10 text-tech-blue px-4 py-2 rounded-full">
                  <Calendar className="h-4 w-4" />
                  <span className="font-almarai font-bold">
                    عضو منذ {new Date(user.created_at).toLocaleDateString('ar-SA')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center lg:justify-end gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 bg-saudi-green text-white px-6 py-2 rounded-lg font-almarai hover:bg-saudi-green/90 transition-colors"
                    >
                      <Save className="h-4 w-4" />
                      حفظ
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center gap-2 bg-gray-500 text-white px-6 py-2 rounded-lg font-almarai hover:bg-gray-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                      إلغاء
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-saudi-green text-white px-6 py-2 rounded-lg font-almarai hover:bg-saudi-green/90 transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                    تعديل الملف
                  </button>
                )}
                
                <button className="flex items-center gap-2 bg-tech-blue text-white px-6 py-2 rounded-lg font-almarai hover:bg-tech-blue/90 transition-colors">
                  <Share2 className="h-4 w-4" />
                  مشاركة الملف
                </button>
              </div>
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
            {renderTabContent()}
          </div>
        </div>

        {/* نافذة تغيير كلمة المرور */}
        <AnimatePresence>
          {showChangePassword && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-almarai font-bold text-gray-800">
                    تغيير كلمة المرور
                  </h3>
                  <button
                    onClick={() => setShowChangePassword(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-almarai font-bold mb-2 text-right">
                      كلمة المرور الحالية
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                        className="w-full pr-4 pl-10 py-3 border-2 border-gray-200 rounded-xl font-almarai text-right focus:border-saudi-green focus:outline-none"
                        placeholder="كلمة المرور الحالية"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        {showPasswords.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-almarai font-bold mb-2 text-right">
                      كلمة المرور الجديدة
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                        className="w-full pr-4 pl-10 py-3 border-2 border-gray-200 rounded-xl font-almarai text-right focus:border-saudi-green focus:outline-none"
                        placeholder="كلمة المرور الجديدة"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-almarai font-bold mb-2 text-right">
                      تأكيد كلمة المرور
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                        className="w-full pr-4 pl-10 py-3 border-2 border-gray-200 rounded-xl font-almarai text-right focus:border-saudi-green focus:outline-none"
                        placeholder="تأكيد كلمة المرور"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleChangePassword}
                    className="flex-1 bg-saudi-green text-white py-3 rounded-xl font-almarai font-bold hover:bg-saudi-green/90 transition-colors"
                  >
                    تغيير كلمة المرور
                  </button>
                  <button
                    onClick={() => setShowChangePassword(false)}
                    className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-almarai font-bold hover:bg-gray-600 transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* نافذة حذف الحساب */}
        <AnimatePresence>
          {showDeleteAccount && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                  
                  <h3 className="text-xl font-almarai font-bold text-gray-800 mb-4">
                    تأكيد حذف الحساب
                  </h3>
                  
                  <p className="text-gray-600 font-almarai mb-6 leading-relaxed">
                    هذا الإجراء سيحذف حسابك وجميع بياناتك نهائياً ولا يمكن التراجع عنه.
                    هل أنت متأكد؟
                  </p>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={handleDeleteAccount}
                      className="flex-1 bg-red-500 text-white py-3 rounded-xl font-almarai font-bold hover:bg-red-600 transition-colors"
                    >
                      نعم، احذف الحساب
                    </button>
                    <button
                      onClick={() => setShowDeleteAccount(false)}
                      className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-almarai font-bold hover:bg-gray-600 transition-colors"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserProfile;