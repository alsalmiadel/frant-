import React from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Shield, 
  Award, 
  ExternalLink,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  CheckCircle,
  Info
} from 'lucide-react';
import AcceptedPayments from './AcceptedPayments';

const Footer: React.FC = () => {
  const footerSections = [
    {
      title: 'الخدمات',
      links: [
        { name: 'المحادثة الصوتية', href: '#voice' },
        { name: 'دراسة الجدوى', href: '#feasibility' },
        { name: 'التحليل المالي', href: '#financial' },
        { name: 'الاستشارات', href: '#consulting' }
      ]
    },
    {
      title: 'القطاعات',
      links: [
        { name: 'التجارة الإلكترونية', href: '#ecommerce' },
        { name: 'المطاعم والتوصيل', href: '#food' },
        { name: 'التقنية والبرمجة', href: '#tech' },
        { name: 'الصحة واللياقة', href: '#health' }
      ]
    },
    {
      title: 'الشركة',
      links: [
        { name: 'من نحن', href: '#about' },
        { name: 'فريق العمل', href: '#team' },
        { name: 'المدونة', href: '#blog' },
        { name: 'الوظائف', href: '#careers' },
        { name: 'الأخبار', href: '#news' }
      ]
    },
    {
      title: 'الدعم',
      links: [
        { name: 'مركز المساعدة', href: '#help' },
        { name: 'تواصل معنا', href: '#contact' },
        { name: 'الأسئلة الشائعة', href: '#faq' },
        { name: 'حالة النظام', href: '#status' }
      ]
    }
  ];

  const socialLinks = [
    { name: 'تويتر', icon: Twitter, href: '#', color: 'hover:text-blue-400' },
    { name: 'لينكد إن', icon: Linkedin, href: '#', color: 'hover:text-blue-600' },
    { name: 'انستقرام', icon: Instagram, href: '#', color: 'hover:text-pink-500' },
    { name: 'يوتيوب', icon: Youtube, href: '#', color: 'hover:text-red-500' }
  ];

  const certifications = [
  ];

  return (
    <footer className="bg-gradient-to-r from-saudi-green to-tech-blue text-white">
      {/* القسم الرئيسي */}
      <div className="relative">
        {/* صورة خلفية أفق الرياض */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/2422488/pexels-photo-2422488.jpeg?auto=compress&cs=tinysrgb&w=1920&h=600&fit=crop"
            alt="أفق الرياض – مركز الملك عبدالله المالي عند الغروب"
            className="w-full h-full object-cover opacity-20"
            loading="lazy"
            decoding="async"
            width="1920"
            height="600"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-black/30"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* معلومات الشركة */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h3 className="text-3xl font-almarai font-bold mb-4">
                  SmartStartAI
                </h3>
                <p className="text-white/90 font-almarai leading-relaxed mb-6">
                  مستشارك الذكي بصوتٍ سعودي لبدء مشروعك بثقة. نقدم دراسات جدوى احترافية 
                  ومحادثة صوتية ذكية باللهجة السعودية لمساعدتك في تحقيق أحلامك التجارية.
                </p>
                
                {/* معلومات التواصل */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-saudi-gold" />
                    <span className="font-almarai">920012345</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-saudi-gold" />
                    <span className="font-almarai">info@smartstart.sa</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-saudi-gold" />
                    <span className="font-almarai">الرياض، المملكة العربية السعودية</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-saudi-gold" />
                    <span className="font-almarai">دعم فني 24/7</span>
                  </div>
                </div>
              </div>

              {/* وسائل التواصل الاجتماعي */}
              <div>
                <h4 className="font-almarai font-bold mb-4">تابعنا على:</h4>
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className={`w-12 h-12 bg-white/10 rounded-full flex items-center justify-center transition-all duration-300 ${social.color} hover:bg-white/20 hover:scale-110`}
                      aria-label={social.name}
                    >
                      <social.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* أقسام الروابط */}
            {footerSections.map((section, index) => (
              <div key={index}>
                <h4 className="font-almarai font-bold text-lg mb-6 text-right">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="text-white/80 hover:text-white font-almarai transition-colors duration-300 flex items-center justify-end gap-2 group"
                      >
                        <span>{link.name}</span>
                        <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* الشهادات والاعتمادات */}
          <div className="mt-16 pt-8 border-t border-white/20">
            <h4 className="font-almarai font-bold text-lg mb-6 text-center">
              الجودة والامتثال
            </h4>
            <div className="text-center">
              <div className="bg-white/10 rounded-xl p-6 max-w-2xl mx-auto">
                <Shield className="h-8 w-8 text-saudi-gold mx-auto mb-4" />
                <h5 className="font-almarai font-bold text-white mb-2">
                  ملتزمون بأعلى معايير الجودة والأمان
                </h5>
                <p className="text-white/80 font-almarai text-sm">
                  نطبق أفضل الممارسات في حماية البيانات وأمان المعلومات
                </p>
              </div>
            </div>
          </div>

          {/* معلومات إضافية */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <Award className="h-8 w-8 text-saudi-gold mx-auto mb-3" />
                <h5 className="font-almarai font-bold mb-2">جودة معتمدة</h5>
                <p className="text-white/80 font-almarai text-sm">
                  دراسات جدوى متوافقة مع معايير البنوك السعودية
                </p>
              </div>
              
              <div>
                <Shield className="h-8 w-8 text-saudi-gold mx-auto mb-3" />
                <h5 className="font-almarai font-bold mb-2">أمان متقدم</h5>
                <p className="text-white/80 font-almarai text-sm">
                  تشفير من الطرف إلى الطرف وامتثال كامل لـ PDPL
                </p>
              </div>
              
              <div>
                <CheckCircle className="h-8 w-8 text-saudi-gold mx-auto mb-3" />
                <h5 className="font-almarai font-bold mb-2">ضمان الجودة</h5>
                <p className="text-white/80 font-almarai text-sm">
                  ضمان استرداد المال خلال 30 يوم إذا لم تكن راضياً
                </p>
              </div>
            </div>

            {/* وسائل الدفع المقبولة */}
            <div className="mt-12 pt-8 border-t border-white/20">
              <AcceptedPayments 
                methods={["mada","visa","mastercard","amex","apple-pay","stc-pay","sadad","tamara","tabby"]}
                title="وسائل الدفع الآمنة المدعومة"
                className="text-white/80"
              />
            </div>
          </div>
        </div>
      </div>

      {/* الحقوق */}
      <div className="bg-black/20 border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-white/80 font-almarai text-sm">
              © 2025 SmartStartAI. جميع الحقوق محفوظة.
            </div>
            
            <div className="flex items-center gap-6">
              <button 
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.hash = 'privacy';
                  }
                }}
                className="text-white/80 hover:text-white font-almarai text-sm transition-colors"
              >
                سياسة الخصوصية
              </button>
              <button 
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.hash = 'terms';
                  }
                }}
                className="text-white/80 hover:text-white font-almarai text-sm transition-colors"
              >
                شروط الاستخدام
              </button>
              <button 
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.hash = 'cookies';
                  }
                }}
                className="text-white/80 hover:text-white font-almarai text-sm transition-colors"
              >
                سياسة الكوكيز
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;