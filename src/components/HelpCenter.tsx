import React, { useState } from 'react';
import { 
  Search, 
  MessageCircle, 
  Phone, 
  Mail, 
  ChevronDown, 
  ChevronUp,
  Book,
  Video,
  FileText,
  Headphones,
  Clock,
  CheckCircle,
  Star,
  ArrowRight
} from 'lucide-react';

const HelpCenter: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'جميع الأسئلة', icon: Book },
    { id: 'voice', name: 'المحادثة الصوتية', icon: Headphones },
    { id: 'analysis', name: 'التحليل والدراسات', icon: FileText },
    { id: 'pricing', name: 'التسعير والاشتراكات', icon: Star },
    { id: 'technical', name: 'المساعدة التقنية', icon: Video }
  ];

  const faqs = [
    {
      category: 'voice',
      question: 'كيف تعمل المحادثة الصوتية؟',
      answer: 'المحادثة الصوتية تستخدم تقنيات الذكاء الاصطناعي المتقدمة لفهم صوتك وتحويله إلى نص، ثم تحليل المحتوى وتقديم استشارات مخصصة. النظام يدعم اللهجات السعودية المختلفة ويمكنه التفاعل بطريقة طبيعية.'
    },
    {
      category: 'analysis',
      question: 'ما مدى دقة دراسات الجدوى المُنتجة؟',
      answer: 'دراسات الجدوى مبنية على بيانات السوق السعودي الحقيقية ومعايير الجهات التمويلية المحلية. النظام يحلل أكثر من 50 متغير سوقي ومالي لضمان دقة التوقعات. ومع ذلك، ننصح بمراجعة الدراسة مع مستشار مالي قبل التقديم النهائي.'
    },
    {
      category: 'pricing',
      question: 'هل يمكنني تجربة الخدمة مجاناً؟',
      answer: 'نعم! باقة "الانطلاق" مجانية تماماً وتتضمن تحليل سوق أساسي ونموذج مالي مبسط. كما نقدم تجربة مجانية لمدة 7 أيام لباقة "النمو" التي تشمل جميع المميزات المتقدمة.'
    },
    {
      category: 'technical',
      question: 'ما المتصفحات المدعومة للمحادثة الصوتية؟',
      answer: 'المحادثة الصوتية تعمل على جميع المتصفحات الحديثة: Chrome، Safari، Firefox، وEdge. للحصول على أفضل تجربة، ننصح باستخدام Chrome أو Safari على الأجهزة المحمولة.'
    },
    {
      category: 'analysis',
      question: 'كم من الوقت يستغرق إنتاج دراسة الجدوى؟',
      answer: 'التحليل الأساسي يستغرق 2-3 دقائق، بينما دراسة الجدوى الكاملة تحتاج 5-10 دقائق حسب تعقيد المشروع. النتائج تظهر تدريجياً أثناء المعالجة.'
    },
    {
      category: 'voice',
      question: 'هل يمكن حفظ المحادثات الصوتية؟',
      answer: 'نعم، جميع محادثاتك محفوظة في حسابك ويمكن الوصول إليها في أي وقت. يمكنك أيضاً تحميل التسجيلات الصوتية والملخصات المكتوبة.'
    },
    {
      category: 'pricing',
      question: 'ما الفرق بين الباقات المختلفة؟',
      answer: 'باقة "الانطلاق" مجانية وتشمل الأساسيات. باقة "النمو" تضيف المراجعة الصوتية مع الخبراء والتحليلات المتقدمة. باقة "المؤسسات" مخصصة للشركات الكبيرة مع تخصيص كامل.'
    },
    {
      category: 'technical',
      question: 'هل بياناتي آمنة ومحمية؟',
      answer: 'نعم، نحن ملتزمون بقانون حماية البيانات الشخصية السعودي (PDPL) ومعايير ISO 27001. جميع البيانات مشفرة ومحفوظة في خوادم محلية آمنة.'
    }
  ];

  const supportChannels = [
    {
      icon: MessageCircle,
      title: 'الدردشة المباشرة',
      description: 'تحدث مع فريق الدعم فوراً',
      availability: 'متاح 24/7',
      color: 'from-saudi-green to-tech-blue',
      action: 'ابدأ المحادثة'
    },
    {
      icon: Phone,
      title: 'المكالمة الهاتفية',
      description: 'تحدث مع مستشار متخصص',
      availability: 'الأحد - الخميس، 9ص - 6م',
      color: 'from-saudi-gold to-saudi-green',
      action: 'اتصل الآن: 920012345'
    },
    {
      icon: Mail,
      title: 'البريد الإلكتروني',
      description: 'أرسل استفسارك التفصيلي',
      availability: 'رد خلال 2-4 ساعات',
      color: 'from-tech-blue to-saudi-gold',
      action: 'أرسل رسالة'
    },
    {
      icon: Video,
      title: 'جلسة فيديو',
      description: 'شرح مرئي مع الخبراء',
      availability: 'بموعد مسبق',
      color: 'from-purple-500 to-pink-500',
      action: 'احجز جلسة'
    }
  ];

  const tutorials = [
    {
      title: 'كيفية بدء محادثة صوتية',
      duration: '3 دقائق',
      views: '12.5K',
      thumbnail: '🎤',
      level: 'مبتدئ'
    },
    {
      title: 'فهم دراسة الجدوى المُنتجة',
      duration: '8 دقائق',
      views: '8.2K',
      thumbnail: '📊',
      level: 'متوسط'
    },
    {
      title: 'تخصيص التحليل لقطاعك',
      duration: '5 دقائق',
      views: '6.1K',
      thumbnail: '🎯',
      level: 'متقدم'
    },
    {
      title: 'استخدام النموذج المالي',
      duration: '12 دقيقة',
      views: '9.8K',
      thumbnail: '💰',
      level: 'متقدم'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-light-green p-6">
      <div className="max-w-7xl mx-auto">
        {/* رأس مركز المساعدة */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-almarai font-bold text-gray-900 mb-6">
            مركز المساعدة والدعم
          </h1>
          <p className="text-xl text-gray-600 font-almarai max-w-3xl mx-auto mb-8">
            نحن هنا لمساعدتك في كل خطوة من رحلة مشروعك
          </p>

          {/* شريط البحث */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث عن إجابة لسؤالك..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-6 py-4 border-2 border-gray-200 rounded-2xl font-almarai text-right text-lg focus:border-saudi-green focus:outline-none transition-colors shadow-lg"
            />
          </div>
        </div>

        {/* قنوات الدعم */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {supportChannels.map((channel, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${channel.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <channel.icon className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-lg font-almarai font-bold text-gray-800 mb-2 text-right">
                {channel.title}
              </h3>
              
              <p className="text-gray-600 font-almarai mb-3 text-right">
                {channel.description}
              </p>
              
              <div className="flex items-center justify-end gap-2 mb-4">
                <span className="text-sm font-almarai text-gray-500">
                  {channel.availability}
                </span>
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
              
              <button className="w-full bg-gradient-to-r from-saudi-green/10 to-saudi-gold/10 text-saudi-green border border-saudi-green/20 py-3 rounded-xl font-almarai font-bold hover:bg-gradient-to-r hover:from-saudi-green hover:to-saudi-gold hover:text-white transition-all duration-300">
                {channel.action}
              </button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* الأسئلة الشائعة */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-2xl font-almarai font-bold text-gray-800 mb-6 text-right">
                الأسئلة الشائعة
              </h2>

              {/* فلترة الفئات */}
              <div className="flex flex-wrap gap-3 mb-6">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-almarai transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'bg-saudi-green text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-saudi-green/10'
                    }`}
                  >
                    <category.icon className="h-4 w-4" />
                    {category.name}
                  </button>
                ))}
              </div>

              {/* قائمة الأسئلة */}
              <div className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full p-4 text-right hover:bg-gray-50 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        {expandedFaq === index ? (
                          <ChevronUp className="h-5 w-5 text-saudi-green" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <h3 className="font-almarai font-bold text-gray-800 flex-1">
                        {faq.question}
                      </h3>
                    </button>
                    
                    {expandedFaq === index && (
                      <div className="p-4 bg-light-green border-t border-gray-200">
                        <p className="text-saudi-green font-almarai text-right leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {filteredFaqs.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Search className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-almarai font-bold text-gray-800 mb-2">
                    لم نجد نتائج
                  </h3>
                  <p className="text-gray-600 font-almarai">
                    جرب كلمات بحث أخرى أو تواصل معنا مباشرة
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* الشريط الجانبي */}
          <div className="space-y-6">
            {/* الفيديوهات التعليمية */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-almarai font-bold text-gray-800 mb-4 text-right">
                فيديوهات تعليمية
              </h3>
              
              <div className="space-y-4">
                {tutorials.map((tutorial, index) => (
                  <div key={index} className="group cursor-pointer">
                    <div className="bg-gray-50 rounded-xl p-4 hover:bg-saudi-green/5 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-r from-saudi-green to-saudi-gold rounded-lg flex items-center justify-center text-2xl">
                          {tutorial.thumbnail}
                        </div>
                        <div className="flex-1 text-right">
                          <h4 className="font-almarai font-bold text-gray-800 text-sm">
                            {tutorial.title}
                          </h4>
                          <div className="flex items-center justify-end gap-3 text-xs text-gray-500 mt-1">
                            <span>{tutorial.views} مشاهدة</span>
                            <span>{tutorial.duration}</span>
                            <span className={`px-2 py-1 rounded-full ${
                              tutorial.level === 'مبتدئ' ? 'bg-green-100 text-green-800' :
                              tutorial.level === 'متوسط' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {tutorial.level}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.hash = 'help';
                  }
                }}
                className="w-full mt-4 text-saudi-green font-almarai font-bold hover:bg-light-green py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                عرض جميع الفيديوهات
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* إحصائيات الدعم */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-almarai font-bold text-gray-800 mb-4 text-right">
                إحصائيات الدعم
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-saudi-green">2.3 دقيقة</div>
                    <div className="text-sm font-almarai text-gray-600">متوسط وقت الرد</div>
                  </div>
                  <Clock className="h-8 w-8 text-saudi-green" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-saudi-gold">98.5%</div>
                    <div className="text-sm font-almarai text-gray-600">معدل حل المشاكل</div>
                  </div>
                  <CheckCircle className="h-8 w-8 text-saudi-gold" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-tech-blue">4.9/5</div>
                    <div className="text-sm font-almarai text-gray-600">تقييم الدعم</div>
                  </div>
                  <Star className="h-8 w-8 text-tech-blue" />
                </div>
              </div>
            </div>

            {/* نصائح سريعة */}
            <div className="bg-gradient-to-r from-saudi-green/5 to-saudi-gold/5 rounded-2xl p-6">
              <h3 className="text-lg font-almarai font-bold text-gray-800 mb-4 text-right">
                💡 نصائح سريعة
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-saudi-green flex-shrink-0 mt-1" />
                  <p className="text-gray-700 font-almarai text-sm text-right">
                    تحدث بوضوح أثناء التسجيل الصوتي للحصول على أفضل النتائج
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-saudi-green flex-shrink-0 mt-1" />
                  <p className="text-gray-700 font-almarai text-sm text-right">
                    احفظ مشاريعك في لوحة التحكم للرجوع إليها لاحقاً
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-saudi-green flex-shrink-0 mt-1" />
                  <p className="text-gray-700 font-almarai text-sm text-right">
                    راجع دراسة الجدوى مع مستشار مالي قبل التقديم
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;