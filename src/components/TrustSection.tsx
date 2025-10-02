import React from 'react';
import { Shield, Award, Users, Clock, CheckCircle, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const TrustSection: React.FC = () => {
  const trustElements = [
    {
      icon: Shield,
      title: 'حماية البيانات',
      description: 'أمان وخصوصية متقدمة للمعلومات',
      badge: 'آمن',
      color: 'from-saudi-green to-tech-blue'
    },
    {
      icon: Award,
      title: 'شفافية المنهجية',
      description: 'جميع الافتراضات والحسابات واضحة',
      badge: 'شفاف',
      color: 'from-saudi-gold to-saudi-green'
    },
    {
      icon: Users,
      title: 'فريق خبراء سعوديين',
      description: 'مستشارون محليون يفهمون السوق',
      badge: 'محلي',
      color: 'from-tech-blue to-saudi-gold'
    },
    {
      icon: Clock,
      title: 'دعم 24/7',
      description: 'فريق دعم متاح على مدار الساعة',
      badge: 'متواصل',
      color: 'from-saudi-green to-saudi-gold'
    }
  ];

  const testimonials = [
    {
      name: 'أحمد المالكي',
      role: 'مؤسس تطبيق توصيل',
      city: 'الرياض',
      text: 'SmartStartAI ساعدني في الحصول على تمويل بقيمة 2 مليون ريال',
      rating: 5,
      avatar: '👨‍💼'
    },
    {
      name: 'فاطمة الزهراني',
      role: 'صاحبة متجر إلكتروني',
      city: 'جدة',
      text: 'التحليل كان دقيق جداً وساعدني في فهم السوق بشكل أفضل',
      rating: 5,
      avatar: '👩‍💼'
    },
    {
      name: 'محمد العتيبي',
      role: 'مطور تطبيقات',
      city: 'الدمام',
      text: 'الكود المولد وفر علي شهور من العمل والدراسة كانت احترافية',
      rating: 5,
      avatar: '👨‍💻'
    }
  ];

  const trustIndicators = [
    { icon: '🛡️', text: 'حماية', desc: 'أمان البيانات' },
    { icon: '🔒', text: 'أمان', desc: 'تشفير متقدم' },
    { icon: '✨', text: 'شفافية', desc: 'منهجية واضحة' },
    { icon: '🇸🇦', text: 'سعودي', desc: 'صُنع في المملكة' }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* العنوان */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-almarai font-bold text-gray-900 mb-6">
            لماذا يثق بنا رواد الأعمال؟
          </h2>
          <p className="text-xl text-gray-600 font-almarai max-w-3xl mx-auto">
            الثقة والأمان والاحترافية هي أساس عملنا
          </p>
        </div>

        {/* عناصر الثقة */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {trustElements.map((element, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group text-center"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${element.color} rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <element.icon className="h-8 w-8 text-white" />
              </div>
              
              <div className="bg-saudi-green/10 text-saudi-green px-3 py-1 rounded-full text-sm font-almarai font-bold mb-3 inline-block">
                {element.badge}
              </div>
              
              <h3 className="text-lg font-almarai font-bold text-gray-800 mb-2">
                {element.title}
              </h3>
              
              <p className="text-gray-600 font-almarai text-sm leading-relaxed">
                {element.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* شهادات العملاء */}
        <div className="mb-16">
          <h3 className="text-3xl font-almarai font-bold text-center text-gray-800 mb-12">
            ماذا يقول عملاؤنا؟
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
              >
                {/* التقييم */}
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-saudi-gold fill-current" />
                  ))}
                </div>
                
                {/* النص */}
                <p className="text-gray-700 font-almarai text-center mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>
                
                {/* معلومات العميل */}
                <div className="text-center">
                  <div className="text-4xl mb-3">{testimonial.avatar}</div>
                  <h4 className="font-almarai font-bold text-gray-800">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-600 font-almarai text-sm">
                    {testimonial.role}
                  </p>
                  <p className="text-saudi-green font-almarai text-sm">
                    {testimonial.city}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* مؤشرات الثقة */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center bg-white rounded-full px-8 py-4 shadow-lg">
            <div className="flex items-center gap-8">
              {trustIndicators.map((indicator, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl mb-1">{indicator.icon}</div>
                  <div className="font-almarai font-bold text-gray-800 text-sm">{indicator.text}</div>
                  <div className="font-almarai text-gray-600 text-xs">{indicator.desc}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSection;