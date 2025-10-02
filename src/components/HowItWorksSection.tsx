import React from 'react';
import { Mic, FileText, Download, CheckCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: 1,
      title: 'تحدث بصوتك',
      description: 'عرّف مشروعك وهدفك بصوتك الطبيعي',
      icon: Mic,
      visual: '🎤',
      details: 'تحدث بلهجتك المحلية عن فكرة مشروعك والسوق المستهدف'
    },
    {
      number: 2,
      title: 'استلم التصوّر الأولي',
      description: 'ملخص صوتي + نقاط تنفيذ + قائمة بيانات',
      icon: FileText,
      visual: '📋',
      details: 'نحلل كلامك ونعطيك تصور أولي مع البيانات المطلوبة'
    },
    {
      number: 3,
      title: 'أكمل البيانات',
      description: 'إدخال التكاليف والأسعار وعدد العملاء',
      icon: CheckCircle,
      visual: '📊',
      details: 'نماذج ذكية تساعدك في إدخال البيانات المالية بسهولة'
    },
    {
      number: 4,
      title: 'استلم الدراسة الجاهزة',
      description: 'PDF + Excel + عرض تقديمي للتقديم',
      icon: Download,
      visual: '📁',
      details: 'دراسة جدوى كاملة ونموذج مالي وعرض احترافي'
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-light-green">
      <div className="max-w-7xl mx-auto">
        {/* العنوان */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-almarai font-bold text-gray-900 mb-6">
            كيف يعمل SmartStartAI؟
          </h2>
          <p className="text-xl text-gray-600 font-almarai max-w-3xl mx-auto">
            أربع خطوات بسيطة من الفكرة إلى دراسة الجدوى الاحترافية
          </p>
        </div>

        {/* الخطوات */}
        <div className="relative">
          {/* خط الربط */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-saudi-green via-saudi-gold to-tech-blue transform -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="text-center group"
              >
                {/* رقم الخطوة */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-white rounded-full shadow-lg mx-auto flex items-center justify-center border-4 border-saudi-green group-hover:border-saudi-gold transition-all duration-300">
                    <span className="text-3xl font-bold text-saudi-green group-hover:text-saudi-gold transition-colors duration-300">
                      {step.number}
                    </span>
                  </div>
                  <div className="absolute -top-2 -right-2 text-3xl">
                    {step.visual}
                  </div>
                </div>

                {/* محتوى الخطوة */}
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-saudi-green to-saudi-gold rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <step.icon className="h-6 w-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-almarai font-bold text-gray-800 mb-3">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 font-almarai mb-4 leading-relaxed">
                    {step.description}
                  </p>
                  
                  <div className="bg-light-green rounded-lg p-3">
                    <p className="text-saudi-green font-almarai text-sm">
                      {step.details}
                    </p>
                  </div>
                </div>

                {/* سهم الانتقال */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 left-full transform -translate-y-1/2 translate-x-4 z-20">
                    <ArrowLeft className="h-8 w-8 text-saudi-green" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* زر البدء */}
        <div className="text-center mt-16">
          <motion.button 
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.hash = 'flow';
              }
            }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-saudi-green to-saudi-gold text-white px-12 py-4 rounded-2xl font-almarai font-bold text-xl hover:shadow-2xl transition-all duration-300"
          >
            ابدأ رحلتك الآن مجاناً
          </motion.button>
          <p className="text-gray-500 font-almarai mt-4">
            لا حاجة للتسجيل • جرب الخدمة فوراً
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;