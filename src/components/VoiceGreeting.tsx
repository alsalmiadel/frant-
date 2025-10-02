import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Play, Pause, Mic, Sparkles, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const GREETING_KEY = "ssai_greeted_v1";
const VOICE_PREFERENCE_KEY = "ssai_voice_enabled";

const GULF_GREETING_TEXT = "يا هلا والله! معك سمارت ستارت أي آي — مستشارك الذكي باللهجة الخليجية. وش تبينا نساعدك فيه اليوم؟ مشروع جديد؟ دراسة جدوى؟ ولا تسويق؟";

const QUICK_ACTIONS = [
  { id: 'feasibility', text: 'أبي أبدأ دراسة جدوى', emoji: '📊' },
  { id: 'marketing', text: 'أبي خطة تسويق أولية', emoji: '🎯' },
  { id: 'naming', text: 'أبي اقتراح اسم وهوية', emoji: '✨' }
];

interface VoiceGreetingProps {
  onActionSelect?: (actionId: string) => void;
}

const VoiceGreeting: React.FC<VoiceGreetingProps> = ({ onActionSelect }) => {
  const [isOpen, setIsOpen] = useState(() => !localStorage.getItem(GREETING_KEY));
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioMethod, setAudioMethod] = useState<'file' | 'webspeech' | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(() => 
    localStorage.getItem(VOICE_PREFERENCE_KEY) !== 'false'
  );
  const [showQuickActions, setShowQuickActions] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // تحضير ملف الصوت
    audioRef.current = new Audio("/sample-voice-ar.mp3");
    audioRef.current.preload = "auto";
    
    // تحضير Web Speech API
    if ('speechSynthesis' in window) {
      synthRef.current = new SpeechSynthesisUtterance(GULF_GREETING_TEXT);
      
      const setupVoice = () => {
        const voices = speechSynthesis.getVoices();
        // البحث عن أصوات خليجية/سعودية
        const preferredVoices = ["ar-SA", "ar-KW", "ar-QA", "ar-BH", "ar-OM", "ar-AE", "ar"];
        
        const selectedVoice = voices.find(voice => 
          preferredVoices.some(lang => voice.lang.startsWith(lang))
        );
        
        if (selectedVoice && synthRef.current) {
          synthRef.current.voice = selectedVoice;
          synthRef.current.rate = 0.9; // أبطأ قليلاً للوضوح
          synthRef.current.pitch = 1.0;
          synthRef.current.volume = 1.0;
        }
      };
      
      setupVoice();
      speechSynthesis.onvoiceschanged = setupVoice;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (synthRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const playWithAudioFile = async (): Promise<boolean> => {
    if (!audioRef.current) return false;
    
    try {
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setShowQuickActions(true);
      };
      
      audioRef.current.onerror = () => {
        setIsPlaying(false);
        return false;
      };
      
      setIsPlaying(true);
      setAudioMethod('file');
      return true;
    } catch (error) {
      console.warn('Audio file playback failed:', error);
      return false;
    }
  };

  const playWithWebSpeech = async (): Promise<boolean> => {
    if (!synthRef.current || !('speechSynthesis' in window)) return false;
    
    try {
      speechSynthesis.cancel(); // إيقاف أي تشغيل سابق
      
      synthRef.current.onend = () => {
        setIsPlaying(false);
        setShowQuickActions(true);
      };
      
      synthRef.current.onerror = () => {
        setIsPlaying(false);
        toast.error('خطأ في تشغيل الصوت');
      };
      
      speechSynthesis.speak(synthRef.current);
      setIsPlaying(true);
      setAudioMethod('webspeech');
      return true;
    } catch (error) {
      console.warn('Web Speech API failed:', error);
      return false;
    }
  };

  const handleStartGreeting = async () => {
    if (!voiceEnabled) {
      // إذا كان الصوت معطل، اعرض الإجراءات مباشرة
      setShowQuickActions(true);
      return;
    }

    // جرب ملف الصوت أولاً، ثم Web Speech API
    const audioFileSuccess = await playWithAudioFile();
    
    if (!audioFileSuccess) {
      const webSpeechSuccess = await playWithWebSpeech();
      
      if (!webSpeechSuccess) {
        toast.error('لا يمكن تشغيل الصوت، سنعرض الخيارات مباشرة');
        setShowQuickActions(true);
      }
    }
    
    // حفظ أن المستخدم شاهد الترحيب
    localStorage.setItem(GREETING_KEY, "1");
  };

  const handleStopAudio = () => {
    if (audioMethod === 'file' && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    } else if (audioMethod === 'webspeech') {
      speechSynthesis.cancel();
    }
    
    setIsPlaying(false);
    setShowQuickActions(true);
  };

  const handleSkip = () => {
    handleStopAudio();
    localStorage.setItem(GREETING_KEY, "1");
    setIsOpen(false);
  };

  const handleActionSelect = (actionId: string) => {
    localStorage.setItem(GREETING_KEY, "1");
    setIsOpen(false);
    
    if (onActionSelect) {
      onActionSelect(actionId);
    }
    
    // توجيه مباشر حسب الإجراء
    switch (actionId) {
      case 'feasibility':
        if (typeof window !== 'undefined') {
          window.location.hash = 'flow';
        }
        break;
      case 'marketing':
        if (typeof window !== 'undefined') {
          window.location.hash = 'flow';
        }
        break;
      case 'naming':
        if (typeof window !== 'undefined') {
          window.location.hash = 'flow';
        }
        break;
    }
  };

  const toggleVoicePreference = () => {
    const newPreference = !voiceEnabled;
    setVoiceEnabled(newPreference);
    localStorage.setItem(VOICE_PREFERENCE_KEY, newPreference.toString());
    
    if (!newPreference && isPlaying) {
      handleStopAudio();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* رأس النافذة */}
          <div className="bg-gradient-to-r from-saudi-green to-saudi-gold p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-saudi-green/90 to-saudi-gold/90"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="text-right">
                  <h2 className="text-2xl font-almarai font-bold">
                    أهلاً وسهلاً! 🇸🇦
                  </h2>
                  <p className="text-white/90 font-almarai">
                    مرحباً بك في SmartStartAI
                  </p>
                </div>
                
                <button
                  onClick={handleSkip}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="تخطي الترحيب"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* أيقونة الميكروفون المتحركة */}
              <div className="text-center">
                <motion.div
                  className="w-20 h-20 bg-white/20 rounded-full mx-auto flex items-center justify-center relative"
                  animate={isPlaying ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 1, repeat: isPlaying ? Infinity : 0 }}
                >
                  <Mic className="h-10 w-10 text-white" />
                  
                  {/* موجات صوتية */}
                  {isPlaying && (
                    <>
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute inset-0 border-2 border-white/30 rounded-full"
                          animate={{
                            scale: [1, 1.5, 2],
                            opacity: [0.7, 0.3, 0]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.5
                          }}
                        />
                      ))}
                    </>
                  )}
                </motion.div>
              </div>
            </div>
          </div>

          {/* محتوى النافذة */}
          <div className="p-6">
            {!showQuickActions ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <p className="text-gray-700 dark:text-gray-300 font-almarai mb-6 leading-relaxed">
                  {voiceEnabled 
                    ? 'اضغط للاستماع إلى ترحيب صوتي باللهجة الخليجية الأصيلة'
                    : 'مرحباً بك في مستشارك الذكي للأعمال والمشاريع'
                  }
                </p>

                <div className="space-y-4">
                  {voiceEnabled && (
                    <motion.button
                      onClick={isPlaying ? handleStopAudio : handleStartGreeting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-4 rounded-xl font-almarai font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                        isPlaying 
                          ? 'bg-red-500 hover:bg-red-600 text-white' 
                          : 'bg-gradient-to-r from-saudi-green to-saudi-gold hover:shadow-lg text-white'
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="h-6 w-6" />
                          إيقاف الترحيب
                        </>
                      ) : (
                        <>
                          <Play className="h-6 w-6" />
                          🎤 ابدأ الترحيب الصوتي
                        </>
                      )}
                    </motion.button>
                  )}

                  <button
                    onClick={() => setShowQuickActions(true)}
                    className="w-full bg-white border-2 border-saudi-green text-saudi-green py-3 rounded-xl font-almarai font-bold hover:bg-light-green transition-all duration-300"
                  >
                    تخطي إلى الخيارات السريعة
                  </button>
                </div>

                {/* تفضيلات الصوت */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={toggleVoicePreference}
                    className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:text-saudi-green transition-colors mx-auto"
                  >
                    {voiceEnabled ? (
                      <Volume2 className="h-4 w-4" />
                    ) : (
                      <VolumeX className="h-4 w-4" />
                    )}
                    <span className="font-almarai text-sm">
                      {voiceEnabled ? 'إيقاف الصوت' : 'تفعيل الصوت'}
                    </span>
                  </button>
                </div>

                {/* معلومات إضافية */}
                <div className="mt-4 bg-saudi-green/5 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-saudi-green" />
                    <span className="font-almarai font-bold text-saudi-green text-sm">
                      لماذا الترحيب الصوتي؟
                    </span>
                  </div>
                  <p className="text-saudi-green font-almarai text-xs text-right">
                    نريد نعطيك تجربة شخصية وودودة من أول لحظة، ونوضح لك كيف نفهم اللهجة الخليجية بطبيعية
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-saudi-green to-saudi-gold rounded-full mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-xl font-almarai font-bold text-gray-800 dark:text-gray-200 mb-4">
                  وش تبي نساعدك فيه؟
                </h3>
                
                <div className="space-y-3 mb-6">
                  {QUICK_ACTIONS.map((action, index) => (
                    <motion.button
                      key={action.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleActionSelect(action.id)}
                      whileHover={{ scale: 1.02, x: -5 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gray-50 dark:bg-gray-800 hover:bg-saudi-green/10 dark:hover:bg-saudi-green/20 border border-gray-200 dark:border-gray-700 hover:border-saudi-green/30 py-4 px-6 rounded-xl font-almarai transition-all duration-300 flex items-center justify-between group"
                    >
                      <div className="text-right flex-1">
                        <span className="text-gray-800 dark:text-gray-200 group-hover:text-saudi-green">
                          {action.text}
                        </span>
                      </div>
                      <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                        {action.emoji}
                      </span>
                    </motion.button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    localStorage.setItem(GREETING_KEY, "1");
                    setIsOpen(false);
                  }}
                  className="text-gray-500 dark:text-gray-400 font-almarai hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  أدخل للموقع مباشرة
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VoiceGreeting;