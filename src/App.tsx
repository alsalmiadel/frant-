import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import AuthProvider from './components/AuthProvider';
import { Suspense, lazy } from 'react';
const Header = lazy(() => import('./components/Header'));
const HeroSection = lazy(() => import('./components/HeroSection'));
const FeaturesSection = lazy(() => import('./components/FeaturesSection'));
const HowItWorksSection = lazy(() => import('./components/HowItWorksSection'));
const VoiceInteractionSection = lazy(() => import('./components/VoiceInteractionSection'));
const SolutionsSection = lazy(() => import('./components/SolutionsSection'));
const SectorsSection = lazy(() => import('./components/SectorsSection'));
const TrustSection = lazy(() => import('./components/TrustSection'));
const VoiceButton = lazy(() => import('./components/VoiceButton'));
const ProjectFlow = lazy(() => import('./components/ProjectFlow'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const AnalysisResults = lazy(() => import('./components/AnalysisResults'));
const PricingPlans = lazy(() => import('./components/PricingPlans'));
const AuthModal = lazy(() => import('./components/AuthModal'));
const HelpCenter = lazy(() => import('./components/HelpCenter'));
const UserProfile = lazy(() => import('./components/UserProfile'));
const NotificationCenter = lazy(() => import('./components/NotificationCenter'));
const LoadingScreen = lazy(() => import('./components/LoadingScreen'));
const Footer = lazy(() => import('./components/Footer'));
const ErrorBoundary = lazy(() => import('./components/ErrorBoundary'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));
const AdminRoute = lazy(() => import('./components/AdminRoute'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const DataPrivacyModal = lazy(() => import('./components/DataPrivacyModal'));
const SecurityBadge = lazy(() => import('./components/SecurityBadge'));
const SystemStatus = lazy(() => import('./components/SystemStatus'));
const VoiceGreeting = lazy(() => import('./components/VoiceGreeting'));
const SectorPage = lazy(() => import('./components/SectorPage'));
const LocationAnalysisPage = lazy(() => import('./components/LocationAnalysisPage'));
const BlogIndex = lazy(() => import('./components/BlogIndex'));
const BlogPostPage = lazy(() => import('./components/BlogPostPage'));
import { useAuth } from './hooks/useAuth';
import { Project, Analysis } from './types';
import { motion, AnimatePresence } from 'framer-motion';

type ViewType = 'home' | 'flow' | 'dashboard' | 'results' | 'pricing' | 'help' | 'profile' | 'admin' | 'sector' | 'location-analysis' | 'blog' | 'post';

function AppContent() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedSector, setSelectedSector] = useState<string>('');
  const [selectedBlogPost, setSelectedBlogPost] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const { user, loading } = useAuth();
  
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      title: 'تطبيق توصيل طعام صحي',
      description: 'تطبيق لتوصيل الوجبات الصحية والعضوية للعائلات في الرياض',
      type: 'tech',
      city: 'الرياض',
      goal: 'development',
      status: 'completed',
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      title: 'متجر إلكتروني للمنتجات اليدوية',
      description: 'منصة لبيع المنتجات اليدوية السعودية التراثية',
      type: 'commercial',
      city: 'جدة',
      goal: 'funding',
      status: 'analyzing',
      createdAt: new Date('2024-01-20')
    },
    {
      id: '3',
      title: 'مركز تدريب مهني متخصص',
      description: 'مركز لتدريب الشباب على المهارات التقنية والمهنية',
      type: 'service',
      city: 'الدمام',
      goal: 'analysis',
      status: 'saved',
      createdAt: new Date('2024-02-01')
    }
  ]);

  const sampleAnalysis: Analysis = {
    feasibility: {
      swot: 'نقاط القوة: تزايد الطلب على الطعام الصحي بنسبة 25% سنوياً، دعم الحكومة للمشاريع التقنية، خبرة الفريق في التطوير. الفرص: السوق السعودي ينمو بقوة، إمكانية التوسع للخليج. نقاط الضعف: المنافسة الشديدة مع اللاعبين الكبار، التكاليف العالية للتسويق الأولي. التهديدات: تغيير سلوك المستهلكين، التحديات اللوجستية.',
      market: 'السوق السعودي لتوصيل الطعام يقدر بـ 2.8 مليار ريال وينمو بمعدل 15% سنوياً. الرياض تمثل 35% من السوق، تليها جدة بـ 25%. الجمهور المستهدف: العائلات الشابة (25-45 سنة) ذات الدخل المتوسط والعالي. حجم السوق المتاح: 1.2 مليون عائلة في المدن الرئيسية.',
      costs: 'التكلفة الإجمالية للبدء: 750,000 ريال موزعة كالتالي: تطوير التطبيق (300,000 ريال)، التسويق الأولي (200,000 ريال)، رأس المال التشغيلي (150,000 ريال)، المعدات واللوجستيات (100,000 ريال). التكاليف الشهرية: 85,000 ريال شاملة الرواتب والتشغيل.',
      profitability: 'العائد المتوقع: 22-28% خلال السنة الثانية. نقطة التعادل متوقعة خلال الشهر 16-18. الإيرادات المتوقعة: السنة الأولى 1.2 مليون ريال، السنة الثانية 2.8 مليون ريال، السنة الثالثة 4.5 مليون ريال. هامش الربح الإجمالي: 35-40%.'
    },
    marketing: {
      campaigns: 'استراتيجية تسويقية متعددة القنوات: (1) التسويق الرقمي عبر سناب شات وانستقرام بميزانية 50,000 ريال شهرياً، (2) شراكات مع المؤثرين الصحيين (20 مؤثر متوسط)، (3) حملات جوجل وفيسبوك مستهدفة، (4) فعاليات ترويجية في المجمعات التجارية، (5) برنامج إحالة العملاء مع مكافآت.',
      audience: 'الجمهور الأساسي: العائلات الشابة (25-45 سنة) في الرياض وجدة، دخل شهري 8,000+ ريال، يستخدمون التطبيقات بانتظام. الجمهور الثانوي: المهنيين المشغولين، كبار السن الذين يفضلون الطعام الصحي. خصائص ديموغرافية: 60% إناث، 40% ذكور، 70% متزوجون مع أطفال.',
      platforms: 'المنصات الرئيسية: سناب شات (الأولوية العليا للجمهور السعودي)، انستقرام (للمحتوى المرئي)، تيك توك (للجيل الجديد)، تويتر (للتفاعل المباشر). المنصات الثانوية: يوتيوب (للمحتوى التعليمي)، لينكد إن (للشراكات B2B)، واتساب بزنس (لخدمة العملاء).'
    },
    financial: {
      cashFlow: 'توقعات التدفق النقدي الشهري: الشهور 1-6: سالب 45,000 ريال (فترة البناء)، الشهور 7-12: موجب 15,000 ريال، السنة الثانية: موجب 85,000 ريال شهرياً. ذروة الاحتياج للسيولة: 400,000 ريال في الشهر الرابع. مصادر التمويل المقترحة: 40% رأس مال ذاتي، 35% تمويل بنكي، 25% مستثمرين.',
      breakeven: 'نقطة التعادل التشغيلي: 2,800 طلب شهرياً بمتوسط قيمة 45 ريال للطلب. نقطة التعادل المالي الكامل: الشهر 17 من بداية العمليات. العوامل المؤثرة: متوسط قيمة الطلب، تكلفة اكتساب العميل (85 ريال)، معدل الاحتفاظ بالعملاء (65% شهرياً).'
    },
    esg: {
      sustainability: 'المشروع يركز على الاستدامة البيئية من خلال: (1) استخدام التغليف القابل للتدوير 100%، (2) تقليل النفايات الغذائية بنسبة 40% من خلال التنبؤ الذكي، (3) شراكة مع المزارع المحلية لتقليل البصمة الكربونية، (4) استخدام المركبات الكهربائية للتوصيل تدريجياً، (5) برنامج إعادة تدوير العبوات مع نقاط مكافآت للعملاء.',
      social: 'المسؤولية الاجتماعية تشمل: (1) توظيف 70% من الشباب السعودي، (2) دعم المزارعين المحليين بشراء 80% من المنتجات محلياً، (3) برنامج وجبات مجانية للأسر المحتاجة (100 وجبة شهرياً)، (4) تدريب الشباب على مهارات التوصيل وخدمة العملاء، (5) دعم المشاريع الصغيرة للطهاة المنزليين.'
    }
  };

  // مراقبة حالة الاتصال
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // معالجة OAuth callback
  useEffect(() => {
    // معالجة التنقل من hash URL
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && hash !== currentView) {
        handleNavigate(hash);
      }
    };

    // فحص hash عند التحميل
    handleHashChange();
    
    // مراقبة تغيير hash
    window.addEventListener('hashchange', handleHashChange);

    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('access_token');
      const refreshToken = urlParams.get('refresh_token');
      
      if (accessToken) {
        try {
          const result = await authService.handleOAuthCallback();
          if (result.success) {
            toast.success('تم تسجيل الدخول بنجاح!');
            // إزالة المعاملات من URL
            window.history.replaceState({}, document.title, window.location.pathname);
            setCurrentView('dashboard');
          } else {
            toast.error(result.error || 'خطأ في تسجيل الدخول');
          }
        } catch (error) {
          console.error('OAuth callback error:', error);
          toast.error('خطأ في معالجة تسجيل الدخول');
        }
      }
    };

    handleOAuthCallback();
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);
  const handleVoiceInput = (text: string) => {
    setIsLoading(true);
    setLoadingProgress(0);
    
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsLoading(false);
          setCurrentView('flow');
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleStartVoice = () => {
    if (!user) {
      setAuthMode('register');
      setIsAuthModalOpen(true);
      return;
    }
    setCurrentView('flow');
  };

  const handleStartText = () => {
    if (!user) {
      setAuthMode('register');
      setIsAuthModalOpen(true);
      return;
    }
    setCurrentView('flow');
  };

  const handleProjectSelect = (project: Project) => {
    setCurrentView('results');
  };

  const handleNavigate = (view: string) => {
    // إغلاق القوائم المفتوحة
    setIsMenuOpen(false);
    setIsNotificationOpen(false);

    // تحديث hash URL للتنقل
    window.location.hash = view;

    switch (view) {
      case 'home':
        setCurrentView('home');
        break;
      case 'dashboard':
        if (!user) {
          setAuthMode('login');
          setIsAuthModalOpen(true);
          return;
        }
        setCurrentView('dashboard');
        break;
      case 'pricing':
        setCurrentView('pricing');
        break;
      case 'help':
        setCurrentView('help');
        break;
      case 'profile':
        if (!user) {
          setAuthMode('login');
          setIsAuthModalOpen(true);
          return;
        }
        setCurrentView('profile');
        break;
      case 'login':
        setAuthMode('login');
        setIsAuthModalOpen(true);
        break;
      case 'register':
        setAuthMode('register');
        setIsAuthModalOpen(true);
        break;
      case 'flow':
        if (!user) {
          setAuthMode('register');
          setIsAuthModalOpen(true);
          return;
        }
        setCurrentView('flow');
        break;
      case 'privacy':
        setIsPrivacyModalOpen(true);
        break;
      case 'admin':
        if (!user) {
          setAuthMode('login');
          setIsAuthModalOpen(true);
          return;
        }
        setCurrentView('admin');
        break;
      case 'results':
        setCurrentView('results');
        break;
      case 'sector':
        setCurrentView('sector');
        break;
      case 'location-analysis':
        if (!user) {
          setAuthMode('register');
          setIsAuthModalOpen(true);
          return;
        }
        setCurrentView('location-analysis');
        break;
      case 'blog':
        setCurrentView('blog');
        break;
      default:
        setCurrentView('home');
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    setCurrentView('flow');
  };

  const handleGreetingAction = (actionId: string) => {
    // توجيه المستخدم حسب الإجراء المختار
    switch (actionId) {
      case 'feasibility':
      case 'marketing':
      case 'naming':
        if (!user) {
          setAuthMode('register');
          setIsAuthModalOpen(true);
        } else {
          setCurrentView('flow');
        }
        break;
      default:
        setCurrentView('home');
    }
  };

  const handleSectorSelect = (sectorName: string) => {
    setSelectedSector(sectorName);
    setCurrentView('sector');
  };

  const handleBlogPostSelect = (slug: string) => {
    setSelectedBlogPost(slug);
    setCurrentView('post');
  };
  const renderCurrentView = () => {
    switch (currentView) {
      case 'flow':
        return (
          <ProtectedRoute>
            <ProjectFlow />
          </ProtectedRoute>
        );
      case 'dashboard':
        return (
          <ProtectedRoute>
            <Dashboard projects={projects} onProjectSelect={handleProjectSelect} />
          </ProtectedRoute>
        );
      case 'results':
        return (
          <ProtectedRoute>
            <AnalysisResults analysis={sampleAnalysis} projectTitle="تطبيق توصيل طعام صحي" />
          </ProtectedRoute>
        );
      case 'pricing':
        return <PricingPlans />;
      case 'help':
        return <HelpCenter />;
      case 'profile':
        return (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        );
      case 'admin':
        return (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        );
      default:
        return (
          <>
            <HeroSection 
              onStartVoice={handleStartVoice}
              onStartText={handleStartText}
            />
            <FeaturesSection />
            <VoiceInteractionSection />
            <HowItWorksSection />
            <SolutionsSection onSectorSelect={handleSectorSelect} />
            <SectorsSection onSectorSelect={handleSectorSelect} />
            <TrustSection />
          </>
        );
      case 'sector':
        return <SectorPage sectorName={selectedSector} onBack={() => setCurrentView('home')} />;
      case 'location-analysis':
        return (
          <ProtectedRoute>
            <LocationAnalysisPage onBack={() => setCurrentView('home')} />
          </ProtectedRoute>
        );
      case 'blog':
        return <BlogIndex onOpenPost={handleBlogPostSelect} />;
      case 'post':
        return <BlogPostPage slug={selectedBlogPost} onBack={() => setCurrentView('blog')} />;
    }
  };

  if (loading) {
    return <LoadingScreen message="جاري تحميل التطبيق..." showDetails={true} />;
  }

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">جار التحميل...</div>}>
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 font-almarai">
        {/* الترحيب الصوتي */}
        <VoiceGreeting onActionSelect={handleGreetingAction} />
        
        {/* مؤشر حالة الاتصال */}
        <AnimatePresence>
          {!isOnline && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-0 left-0 right-0 bg-red-500 text-white p-3 text-center z-50"
            >
              <p className="font-almarai font-bold">
                ⚠️ لا يوجد اتصال بالإنترنت - بعض الميزات قد لا تعمل
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* شاشة التحميل */}
        <AnimatePresence>
          {isLoading && (
            <LoadingScreen 
              message="جاري تحليل مشروعك..." 
              progress={loadingProgress}
              showDetails={true}
            />
          )}
        </AnimatePresence>

        <Header 
          onMenuClick={() => setIsMenuOpen(!isMenuOpen)} 
          onNavigate={handleNavigate}
          onNotificationClick={() => setIsNotificationOpen(true)}
          isLoggedIn={!!user}
        />
        
        {/* شريط التنقل الجانبي للموبايل */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden"
            >
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 w-80 h-full bg-white shadow-2xl"
              >
                <div className="p-6 border-b border-gray-200">
                  <div>
                    <h2 className="font-almarai font-bold text-gray-800 text-xl">SmartStartAI</h2>
                    <p className="text-gray-600 font-almarai text-sm">مستشارك الذكي</p>
                  </div>
                </div>
                
                <nav className="p-6 space-y-4">
                  {[
                    { id: 'home', label: 'الرئيسية', icon: '🏠' },
                    { id: 'flow', label: 'بدء مشروع جديد', icon: '🎤' },
                    { id: 'dashboard', label: 'مشاريعي', icon: '📊', requireAuth: true },
                    { id: 'pricing', label: 'الاشتراكات', icon: '💳' },
                    { id: 'help', label: 'المساعدة', icon: '❓' },
                    { id: 'profile', label: 'الملف الشخصي', icon: '👤', requireAuth: true },
                    { id: 'admin', label: 'لوحة الأدمن', icon: '🛡️', requireAuth: true, adminOnly: true },
                    { id: 'privacy', label: 'الخصوصية', icon: '🔒' }
                  ].map((item) => {
                    if (item.requireAuth && !user) return null;
                    if (item.adminOnly && (!user || (user.subscription_type !== 'enterprise' && !user.email?.includes('admin')))) return null;
                    
                    return (
                      <motion.button
                        key={item.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleNavigate(item.id)}
                        className="flex items-center gap-4 w-full p-4 text-right font-almarai text-lg hover:bg-light-green hover:text-saudi-green rounded-xl transition-all duration-300"
                      >
                        <span className="text-2xl">{item.icon}</span>
                        <span className="flex-1">{item.label}</span>
                      </motion.button>
                    );
                  })}
                  
                  <div className="border-t border-gray-200 pt-4 mt-6">
                    {!user ? (
                      <div className="space-y-3">
                        <button
                          onClick={() => handleNavigate('login')}
                          className="w-full bg-saudi-green text-white py-3 rounded-xl font-almarai font-bold"
                        >
                          تسجيل الدخول
                        </button>
                        <button
                          onClick={() => handleNavigate('register')}
                          className="w-full border-2 border-saudi-green text-saudi-green py-3 rounded-xl font-almarai font-bold"
                        >
                          إنشاء حساب
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="text-center p-3 bg-light-green rounded-xl">
                          <p className="font-almarai font-bold text-saudi-green">
                            مرحباً {user.name}
                          </p>
                          <p className="text-sm font-almarai text-gray-600">
                            باقة {user.subscription_type === 'free' ? 'مجانية' : 
                                  user.subscription_type === 'growth' ? 'النمو' : 'المؤسسات'}
                          </p>
                        </div>
                        <SecurityBadge />
                      </div>
                    )}
                  </div>
                </nav>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* المحتوى الرئيسي */}
        <main id="main">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderCurrentView()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* زر الميكروفون الثابت */}
        {(currentView === 'home' || currentView === 'flow') && (
          <VoiceButton onVoiceInput={handleVoiceInput} />
        )}

        {/* التذييل */}
        {currentView === 'home' && <Footer />}

        {/* مراقب حالة النظام */}
        <SystemStatus />

        {/* النوافذ المنبثقة */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          mode={authMode}
          onModeChange={setAuthMode}
          onSuccess={handleAuthSuccess}
        />

        <NotificationCenter
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
        />

        <DataPrivacyModal
          isOpen={isPrivacyModalOpen}
          onClose={() => setIsPrivacyModalOpen(false)}
        />

        {/* Toast notifications */}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: 'Almarai',
              direction: 'rtl',
              textAlign: 'right'
            },
            success: {
              style: {
                background: '#10B981',
                color: 'white',
              },
            },
            error: {
              style: {
                background: '#EF4444',
                color: 'white',
              },
            },
          }}
        />
      </div>
    </ErrorBoundary>
    </Suspense>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;