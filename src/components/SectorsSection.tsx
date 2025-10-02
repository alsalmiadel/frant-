import React from 'react';
import { ShoppingCart, Utensils, Truck, GraduationCap, Heart, CreditCard, Plane, Building, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

interface SectorsSectionProps {
  onSectorSelect: (sectorName: string) => void;
}

const SectorsSection: React.FC<SectorsSectionProps> = ({ onSectorSelect }) => {
  const sectors = [
    {
      icon: ShoppingCart,
      name: 'تجارة إلكترونية',
      description: 'متاجر رقمية ومنصات بيع',
      features: ['قوالب جاهزة ✓', 'بيانات سوق محلية ✓', 'أمثلة واقعية ✓'],
      color: 'from-saudi-green to-tech-blue',
      emoji: '🛒',
      image: 'https://images.pexels.com/photos/4968391/pexels-photo-4968391.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    },
    {
      icon: Utensils,
      name: 'مطاعم وتجزئة',
      description: 'مطاعم، كافيهات، ومتاجر تجزئة',
      features: ['تحليل المواقع ✓', 'دراسة المنافسة ✓', 'خطط تسويقية ✓'],
      color: 'from-saudi-gold to-saudi-green',
      emoji: '🍽️',
      image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    },
    {
      icon: Truck,
      name: 'لوجستيات وتوصيل',
      description: 'خدمات الشحن والتوصيل',
      features: ['تحليل الطرق ✓', 'حساب التكاليف ✓', 'نماذج تشغيل ✓'],
      color: 'from-tech-blue to-saudi-gold',
      emoji: '🚚',
      image: 'https://images.pexels.com/photos/4391470/pexels-photo-4391470.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    },
    {
      icon: GraduationCap,
      name: 'تعليم وتدريب',
      description: 'منصات تعليمية ومراكز تدريب',
      features: ['مناهج محلية ✓', 'تقنيات حديثة ✓', 'شراكات تعليمية ✓'],
      color: 'from-saudi-green to-saudi-gold',
      emoji: '📚',
      image: 'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    },
    {
      icon: Heart,
      name: 'صحة ولياقة',
      description: 'تطبيقات صحية ومراكز لياقة',
      features: ['معايير صحية ✓', 'تراخيص طبية ✓', 'برامج تأهيل ✓'],
      color: 'from-red-500 to-pink-500',
      emoji: '💪',
      image: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    },
    {
      icon: CreditCard,
      name: 'فنتك ومالية',
      description: 'حلول مالية وتقنية مصرفية',
      features: ['امتثال SAMA ✓', 'أمان عالي ✓', 'تكامل بنكي ✓'],
      color: 'from-tech-blue to-saudi-green',
      emoji: '💳',
      image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    },
    {
      icon: Plane,
      name: 'سياحة وضيافة',
      description: 'فنادق، مطاعم، وخدمات سياحية',
      features: ['رؤية 2030 ✓', 'مواسم سياحية ✓', 'تجارب فريدة ✓'],
      color: 'from-purple-500 to-blue-500',
      emoji: '🏨',
      image: 'https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    },
    {
      icon: Building,
      name: 'عقار وإنشاءات',
      description: 'تطوير عقاري ومقاولات',
      features: ['تحليل مواقع ✓', 'دراسات جدوى ✓', 'تمويل عقاري ✓'],
      color: 'from-gray-600 to-gray-800',
      emoji: '🏗️',
      image: 'https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    },
    {
      icon: Leaf,
      name: 'طاقة واستدامة',
      description: 'طاقة متجددة وحلول بيئية',
      features: ['رؤية خضراء ✓', 'تقنيات نظيفة ✓', 'استدامة ✓'],
      color: 'from-green-500 to-emerald-600',
      emoji: '🌱',
      image: 'https://images.pexels.com/photos/9800029/pexels-photo-9800029.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* العنوان */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-almarai font-bold text-gray-900 mb-6">
            القطاعات المدعومة
          </h2>
          <p className="text-xl text-gray-600 font-almarai max-w-3xl mx-auto">
            خبرة متخصصة في جميع القطاعات الاقتصادية الرئيسية في المملكة
          </p>
        </div>

        {/* شبكة القطاعات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sectors.map((sector, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full">
                {/* صورة القطاع */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={
                      index === 0 ? "https://images.pexels.com/photos/4968391/pexels-photo-4968391.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" :
                      index === 1 ? "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" :
                      index === 2 ? "https://images.pexels.com/photos/4391470/pexels-photo-4391470.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" :
                      index === 3 ? "https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" :
                      index === 4 ? "https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" :
                      index === 5 ? "https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" :
                      index === 6 ? "https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" :
                      index === 7 ? "https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" :
                      "https://images.pexels.com/photos/9800029/pexels-photo-9800029.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
                    }
                    alt={`${sector.name} - ${sector.description}`}
                    loading="lazy"
                    decoding="async"
                    width="400"
                    height="300"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${sector.color}/60 to-transparent`}></div>
                  <div className="absolute top-4 right-4">
                    <span className="text-3xl">{sector.emoji}</span>
                  </div>
                </div>

                <div className="p-6">
                {/* رأس البطاقة */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${sector.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <sector.icon className="h-7 w-7 text-white" />
                  </div>
                </div>

                {/* محتوى البطاقة */}
                <h3 className="text-xl font-almarai font-bold text-gray-800 mb-2 text-right">
                  {sector.name}
                </h3>
                
                <p className="text-gray-600 font-almarai mb-4 text-right leading-relaxed">
                  {sector.description}
                </p>

                {/* المميزات */}
                <div className="space-y-2 mb-6">
                  {sector.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center justify-end gap-2">
                      <span className="text-saudi-green font-almarai text-sm">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* زر العمل */}
                <motion.button 
                  onClick={() => onSectorSelect(sector.name)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-saudi-green/10 to-saudi-gold/10 text-saudi-green border border-saudi-green/20 py-3 rounded-xl font-almarai font-bold hover:bg-gradient-to-r hover:from-saudi-green hover:to-saudi-gold hover:text-white transition-all duration-300"
                >
                  ابدأ الآن
                </motion.button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* قسم إضافي للقطاعات المخصصة */}
        <div className="mt-16 bg-gradient-to-r from-saudi-green/5 to-saudi-gold/5 rounded-3xl p-8 text-center">
          <h3 className="text-2xl font-almarai font-bold text-gray-800 mb-4">
            لا تجد قطاعك؟
          </h3>
          <p className="text-gray-600 font-almarai mb-6 max-w-2xl mx-auto">
            نحن نتعامل مع جميع أنواع المشاريع. تحدث معنا وسنقدم لك تحليلاً مخصصاً لقطاعك
          </p>
          <button 
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.hash = 'flow';
              }
            }}
            className="bg-gradient-to-r from-saudi-green to-saudi-gold text-white px-8 py-3 rounded-xl font-almarai font-bold hover:shadow-lg transition-all duration-300"
          >
            تحدث مع المستشار
          </button>
        </div>
      </div>
    </section>
  );
};

export default SectorsSection;