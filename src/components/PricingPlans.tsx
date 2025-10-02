import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Crown, Shield } from 'lucide-react';

const PricingPlans: React.FC = () => {
  const plans = [
    {
      name: 'الانطلاق',
      nameEn: 'Starter',
      price: 'مجانًا',
      period: 'للأبد',
      icon: Star,
      color: 'from-gray-600 to-gray-800',
      features: [
        'تحليل سوق أساسي',
        'نموذج مالي مبسّط',
        'محادثة صوتية (5 دقائق)',
        'تحميل تقرير PDF'
      ],
      popular: false,
      buttonText: 'ابدأ الآن',
      buttonStyle: 'bg-gray-600 hover:bg-gray-700 text-white'
    },
    {
      name: 'النمو',
      nameEn: 'Growth',
      price: '300',
      period: 'ريال/شهر',
      icon: Zap,
      color: 'from-saudi-green to-tech-blue',
      features: [
        'دراسة جدوى متقدمة',
        'عرض تقديمي للمستثمرين',
        'محادثة صوتية غير محدودة',
        'تحليلات متقدمة',
        'تحليل المنافسين والموقع',
        'مشاريع غير محدودة'
      ],
      popular: true,
      buttonText: 'جرب مجاناً 7 أيام',
      buttonStyle: 'bg-gradient-to-r from-saudi-green to-saudi-gold hover:shadow-lg text-white'
    },
    {
      name: 'المحترف',
      nameEn: 'Pro',
      price: '800',
      period: 'ريال/شهر',
      icon: Crown,
      color: 'from-saudi-gold to-saudi-green',
      features: [
        'دراسة جدوى احترافية معتمدة ⭐',
        'مراجعة صوتية مع خبير سعودي',
        'نماذج مالية تفاعلية (Excel)',
        'تقارير ESG شاملة',
        'كود كامل احترافي جاهز للنشر',
        'تحليل مخاطر متقدم',
        'استشارة مباشرة (ساعة شهرياً)',
        'أولوية في الدعم الفني'
      ],
      popular: false,
      buttonText: 'ابدأ الباقة الاحترافية',
      buttonStyle: 'bg-gradient-to-r from-saudi-gold to-saudi-green hover:shadow-lg text-white'
    },
    {
      name: 'المؤسسات',
      nameEn: 'Enterprise',
      price: 'حسب الطلب',
      period: 'اتصل بنا',
      icon: Shield,
      color: 'from-purple-600 to-indigo-600',
      features: [
        'تخصيص قطاعي كامل',
        'ورش تدريبية للفرق',
        'API مفتوح للتكامل',
        'تقارير مخصصة للإدارة',
        'إدارة فرق متعددة',
        'استشارات مخصصة غير محدودة',
        'مدير حساب مخصص',
        'SLA مضمون 99.9%'
      ],
      popular: false,
      buttonText: 'اتصل للاستفسار',
      buttonStyle: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg text-white'
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* العنوان */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-almarai font-bold text-gray-900 mb-6">
            اختر الباقة المناسبة لك
          </h2>
          <p className="text-xl text-gray-600 font-almarai max-w-3xl mx-auto">
            ابدأ مجاناً واترقى عندما تحتاج لمزيد من الميزات المتقدمة
          </p>
        </div>

        {/* الباقات */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`bg-white rounded-3xl shadow-xl border-2 transition-all duration-500 hover:shadow-2xl ${
                plan.popular ? 'border-saudi-green scale-105 relative' : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-saudi-green to-saudi-gold text-white px-6 py-2 rounded-full font-almarai font-bold text-sm">
                    الأكثر شعبية ⭐
                  </div>
                </div>
              )}
              
              <div className="p-6">
                {/* رأس الباقة */}
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${plan.color} flex items-center justify-center`}>
                    <plan.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-almarai font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-500 font-poppins text-sm">
                    {plan.nameEn}
                  </p>
                </div>

                {/* السعر */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {plan.price !== 'مجانًا' && plan.price !== 'حسب الطلب' && (
                      <span className="text-sm text-gray-600 font-almarai">ريال</span>
                    )}
                    <span className="text-3xl font-bold text-gray-900 font-poppins">
                      {plan.price}
                    </span>
                  </div>
                  <p className="text-gray-600 font-almarai">
                    {plan.period}
                  </p>
                </div>

                {/* الميزات */}
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-saudi-green flex-shrink-0" />
                      <span className="font-almarai text-gray-700 text-right flex-1 text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* زر الاشتراك */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 rounded-xl font-almarai font-bold transition-all text-sm ${plan.buttonStyle}`}
                >
                  {plan.buttonText}
                </motion.button>
              </div>
          </motion.div>
          ))}
        </div>

        {/* ضمانات */}
        <div className="text-center bg-saudi-green/5 rounded-3xl p-8">
          <h3 className="text-2xl font-almarai font-bold text-gray-800 mb-6">
            ضماناتنا لك
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              'ضمان استرداد المال خلال 30 يوم',
              'إمكانية الإلغاء في أي وقت',
              'دعم فني مجاني',
              'تحديثات مستمرة'
            ].map((guarantee, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-center gap-2"
              >
                <Check className="h-5 w-5 text-saudi-green" />
                <span className="font-almarai text-gray-700 text-sm">
                  {guarantee}
                </span>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 bg-white rounded-2xl p-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-saudi-green" />
              <h4 className="font-almarai font-bold text-gray-800">لماذا باقة المحترف؟</h4>
            </div>
            <p className="text-gray-600 font-almarai text-right leading-relaxed">
              مصممة خصيصاً لرواد الأعمال الجادين الذين يحتاجون دراسة جدوى معتمدة للبنوك والمستثمرين، 
              مع مراجعة من خبراء سعوديين ونماذج مالية تفاعلية احترافية.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;