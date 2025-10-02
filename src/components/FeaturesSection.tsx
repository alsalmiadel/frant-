import React, { useState, useEffect } from 'react';
import { Brain, Mic, FileCheck, BarChart3, MapPin, Shield, Zap, Globe, Sparkles, Play, CheckCircle, Star, Target, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FeaturesSection: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const mainFeatures = [
    {
      icon: Brain,
      title: 'ذكاء سعودي الهوية',
      description: 'مصمّم لواقع السوق السعودي ويفهم الثقافة المحلية',
      color: 'from-saudi-green to-tech-blue',
      flag: '🇸🇦',
      points: [
        'فهم عميق للثقافة السعودية',
        'تحليل مخصص للسوق المحلي',
        'امتثال للأنظمة واللوائح'
      ]
    },
    {
      icon: Mic,
      title: 'محادثة صوتية فورية',
      description: 'اضغط وتكلّم — واستلم إجابة صوتية مع ملخص مكتوب',
      color: 'from-saudi-gold to-saudi-green',
      flag: '🎤',
      points: [
        'تحويل صوت إلى نص متقدم',
        'فهم اللهجات السعودية',
        'ردود صوتية طبيعية'
      ]
    },
    {
      icon: FileCheck,
      title: 'دراسة جدوى احترافية',
      description: 'متوافقة مع متطلبات البنوك والجهات التمويلية المحليّة',
      color: 'from-tech-blue to-saudi-gold',
      flag: '📋',
      points: [
        'متوافقة مع معايير SAMA',
        'نماذج مالية تفاعلية',
        'عروض تقديمية جاهزة'
      ]
    },
    {
      icon: BarChart3,
      title: 'نتائج عملية مدعومة بالبيانات',
      description: 'توصيات واضحة وجداول مالية قابلة للتحرير',
      color: 'from-saudi-green to-saudi-gold',
      flag: '📊',
      points: [
        'تحليلات مالية دقيقة',
        'إسقاطات واقعية',
        'توصيات قابلة للتنفيذ'
      ]
    }
  ];

  const additionalFeatures = [
    { icon: MapPin, title: 'خرائط السوق المحلية', desc: 'تحليل المنافسة في مدينتك', color: 'text-saudi-green' },
    { icon: Shield, title: 'امتثال PDPL كامل', desc: 'حماية البيانات وفق القوانين السعودية', color: 'text-saudi-gold' },
    { icon: Zap, title: 'نتائج فورية', desc: 'تحليل شامل خلال 3 دقائق', color: 'text-tech-blue' },
    { icon: Globe, title: 'دعم متعدد اللغات', desc: 'عربي، إنجليزي، ولهجات محلية', color: 'text-green-600' }
  ];

  // تدوير المميزات تلقائياً
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % mainFeatures.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 px-4 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* العنوان */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-almarai font-bold text-gray-900 mb-6">
            لماذا SmartStartAI؟
          </h2>
          <p className="text-xl text-gray-600 font-almarai max-w-3xl mx-auto">
            أول مستشار ذكي يفهم السوق السعودي ويتحدث بلغتك
          </p>
        </motion.div>

        {/* المميزات الرئيسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {mainFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group"
            >
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-lg font-almarai font-bold text-gray-800">
                  {feature.title}
                </h3>
                <span className="text-xl">{feature.flag}</span>
              </div>
              
              <p className="text-gray-600 font-almarai mb-4 text-sm leading-relaxed">
                {feature.description}
              </p>
              
              <div className="space-y-2">
                {feature.points.map((point, pointIndex) => (
                  <div key={pointIndex} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-saudi-green" />
                    <span className="text-gray-700 font-almarai text-xs">{point}</span>
                  </div>
                ))}
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full mt-4 text-saudi-green font-almarai font-bold hover:text-saudi-gold transition-colors text-sm"
              >
                اعرف أكثر ←
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* المميزات الإضافية */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-saudi-green/5 to-saudi-gold/5 rounded-3xl p-8"
        >
          <h3 className="text-3xl font-almarai font-bold text-center text-gray-800 mb-12">
            مميزات إضافية تجعلنا الأفضل
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center group cursor-pointer"
              >
                <motion.div 
                  className="w-16 h-16 bg-white rounded-2xl shadow-lg mx-auto mb-4 flex items-center justify-center group-hover:shadow-xl transition-all duration-300"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <feature.icon className={`h-8 w-8 ${feature.color} group-hover:scale-110 transition-transform duration-300`} />
                </motion.div>
                <h4 className="text-lg font-almarai font-bold text-gray-800 mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600 font-almarai text-sm">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;