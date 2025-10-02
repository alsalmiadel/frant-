import React, { useState, useEffect } from 'react';
import { MessageSquare, Mic, Sparkles, TrendingUp, FileText, Phone, Play, Volume2, Zap, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { hoorAPI } from '../services/hoorAPI';
import AcceptedPayments from './AcceptedPayments';
import toast from 'react-hot-toast';

interface HeroSectionProps {
  onStartVoice: () => void;
  onStartText: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onStartVoice, onStartText }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStat, setCurrentStat] = useState(0);

  const stats = [
    { value: '10,000+', label: 'رائد أعمال يثق بنا', color: 'text-saudi-green' },
    { value: '95%', label: 'معدل نجاح المشاريع', color: 'text-saudi-gold' },
    { value: '24/7', label: 'دعم متواصل', color: 'text-tech-blue' },
    { value: '3 دقائق', label: 'متوسط وقت التحليل', color: 'text-saudi-green' }
  ];

  // تدوير الإحصائيات
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handlePlayDemo = async () => {
    try {
      setIsPlaying(true);
      const demoText = 'مرحباً، أنا حور، مستشارك الذكي من SmartStartAI. أخبرني عن فكرة مشروعك وسأساعدك في تحليلها وتطويرها بطريقة احترافية تناسب السوق السعودي.';
      
      await hoorAPI.speak(demoText);
      setIsPlaying(false);
      toast.success('يمكنك الآن بدء محادثة حقيقية مع حور!');
    } catch (error) {
      console.error('Demo play error:', error);
      setIsPlaying(false);
      toast.error('خطأ في تشغيل العرض التوضيحي');
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-white via-light-green/30 to-white py-20 px-4 overflow-hidden">
      {/* صورة خلفية احترافية */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
          alt="مصافحة رقمية بين إنسان وذكاء اصطناعي في بيئة تقنية متقدمة"
          className="w-full h-full object-cover opacity-15"
          loading="eager"
          decoding="async"
          width="1920"
          height="1080"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-saudi-green/5 to-white/90 z-10"></div>
      </div>
      
      <div className="max-w-7xl mx-auto text-center relative z-20">
        {/* العنوان المختصر والقوي */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6"
          >
            <picture>
              <source srcSet="/brand/logo-512.webp" type="image/webp" />
              <img
                src="/brand/logo-512.png"
                alt="SmartStartAI — شعار"
                width={256} height={256}
                className="mx-auto h-32 w-32 md:h-40 md:w-40 drop-shadow-lg"
                loading="eager" decoding="async"
              />
            </picture>
            <h1 className="text-5xl md:text-7xl font-almarai font-bold text-transparent bg-clip-text bg-gradient-to-l from-saudi-green to-saudi-gold mt-4">
              SmartStartAI
            </h1>
          </motion.div>
          
          <motion.p 
            className="text-2xl md:text-3xl text-gray-700 font-almarai font-medium mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            مستشارك الذكي بصوتٍ سعودي — من الفكرة إلى دراسة الجدوى في 3 دقائق
          </motion.p>
        </motion.div>

        {/* الأزرار الثلاثة المرتبة */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
        >
          {/* الزر الأساسي - أخضر */}
          <motion.button
            onClick={onStartVoice}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="bg-saudi-green text-white px-12 py-6 rounded-2xl font-almarai font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-4 min-w-[320px] group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-saudi-green to-saudi-green/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:animate-pulse">
              <Mic className="h-5 w-5" />
            </div>
            <span className="relative">🎤 تكلّم مع المستشار الآن</span>
          </motion.button>
          
          {/* زر تحليل الموقع - ذهبي */}
          <motion.button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.hash = 'location-analysis';
              }
            }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="bg-saudi-gold text-white px-12 py-6 rounded-2xl font-almarai font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-4 min-w-[320px] group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-saudi-gold to-saudi-gold/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:animate-pulse">
              <MapPin className="h-5 w-5" />
            </div>
            <span className="relative">🗺️ حلّل موقعي</span>
          </motion.button>
          
          {/* الزر الثانوي - ذهبي */}
          <motion.button
            onClick={onStartText}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="bg-tech-blue text-white px-12 py-6 rounded-2xl font-almarai font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-4 min-w-[320px] group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-tech-blue to-tech-blue/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:animate-pulse">
              <FileText className="h-5 w-5" />
            </div>
            <span className="relative">📄 اطلب دراسة جدوى</span>
          </motion.button>
        </motion.div>

        {/* الإحصائيات المتحركة */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/90 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              <div className={`text-3xl font-bold ${stat.color} mb-2 group-hover:scale-110 transition-transform duration-300`}>
                {stat.value}
              </div>
              <div className="text-gray-600 font-almarai text-sm">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* مؤشرات الثقة */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-wrap justify-center items-center gap-8 text-gray-500"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-saudi-green" />
            <span className="font-almarai">مدعوم بالذكاء الاصطناعي</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-saudi-gold" />
            <span className="font-almarai">نتائج فورية</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-tech-blue" />
            <span className="font-almarai">دقة عالية</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇸🇦</span>
            <span className="font-almarai">محلي 100%</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;