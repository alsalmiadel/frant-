import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, MessageSquare, Loader, AlertCircle, Zap, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '../services/api';
import { voiceRateLimiter } from '../utils/security';
import toast from 'react-hot-toast';

interface VoiceButtonProps {
  onVoiceInput: (text: string) => void;
  isListening?: boolean;
}

type VoiceState = 'ready' | 'recording' | 'processing' | 'playing' | 'completed';

const VoiceButton: React.FC<VoiceButtonProps> = ({ onVoiceInput, isListening = false }) => {
  const [voiceState, setVoiceState] = useState<VoiceState>('ready');
  const [audioLevel, setAudioLevel] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioQueue, setAudioQueue] = useState<string[]>([]);
  const [isPlayingQueue, setIsPlayingQueue] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Barge-in: إيقاف التشغيل عند بدء تسجيل جديد
  const handleBargeIn = async () => {
    // إيقاف أي صوت يشتغل
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    
    // إيقاف أي audio elements
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    
    setIsPlayingQueue(false);
    setAudioQueue([]);
    
    // تتبع إيقاف الصوت
    try {
      const { analytics } = await import('../lib/analytics');
      analytics.trackUserEngagement('voice_barge_in', {
        action: 'User interrupted audio playback'
      });
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  };

  const startRecording = async () => {
    try {
      // Barge-in: إيقاف أي صوت حالي
      handleBargeIn();
      
      // التحقق من Rate Limiting
      if (!voiceRateLimiter.isAllowed('voice_recording')) {
        const remainingTime = Math.ceil((voiceRateLimiter.getResetTime('voice_recording') - Date.now()) / 60000);
        toast.error(`تم تجاوز عدد المحاولات. حاول مرة أخرى خلال ${remainingTime} دقيقة`);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
          channelCount: 1
        } 
      });
      
      streamRef.current = stream;
      audioChunksRef.current = [];
      
      // إعداد محلل الصوت
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
          ? 'audio/webm;codecs=opus' 
          : 'audio/webm'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { 
          type: mediaRecorder.mimeType 
        });
        await processAudio(audioBlob);
      };
      
      mediaRecorder.start(100);
      setVoiceState('recording');
      setRecordingTime(0);
      
      // بدء مراقبة مستوى الصوت
      updateAudioLevel();
      
      // مؤقت التسجيل
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 300) { // 5 دقائق حد أقصى
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
      
    } catch (error: any) {
      console.error('Error accessing microphone:', error);
      let errorMessage = 'لا يمكن الوصول للميكروفون';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'يرجى السماح بالوصول للميكروفون من إعدادات المتصفح';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'لم يتم العثور على ميكروفون';
      }
      
      toast.error(errorMessage);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && voiceState === 'recording') {
      mediaRecorderRef.current.stop();
      setVoiceState('processing');
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
  };

  const updateAudioLevel = () => {
    if (!analyserRef.current || voiceState !== 'recording') return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    setAudioLevel(Math.min(average * 2, 100));
    
    animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      setVoiceState('processing');
      
      if (audioBlob.size > 10 * 1024 * 1024) {
        throw new Error('حجم التسجيل كبير جداً');
      }
      
      if (audioBlob.size < 1000) {
        throw new Error('التسجيل قصير جداً، يرجى المحاولة مرة أخرى');
      }
      
      // محاكاة معالجة الصوت
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockText = 'أريد إنشاء تطبيق توصيل طعام صحي في الرياض يستهدف العائلات الشابة';
      setTranscript(mockText);
      setVoiceState('playing');
      
      // محاكاة تشغيل الرد
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setVoiceState('completed');
      onVoiceInput(mockText);
      toast.success('تم تحويل الصوت بنجاح');
      
    } catch (error: any) {
      console.error('Voice processing error:', error);
      toast.error(error.message || 'خطأ في معالجة الصوت');
      setVoiceState('ready');
    }
  };

  const handleVoiceClick = () => {
    // Barge-in: إيقاف أي صوت حالي عند بدء تسجيل جديد
    if (voiceState === 'ready') {
      handleBargeIn();
    }
    
    switch (voiceState) {
      case 'ready':
        startRecording();
        break;
      case 'recording':
        stopRecording();
        break;
      case 'completed':
        setVoiceState('ready');
        setTranscript('');
        setRecordingTime(0);
        break;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getButtonState = () => {
    switch (voiceState) {
      case 'ready':
        return { 
          color: 'bg-saudi-green', 
          icon: Mic, 
          text: '🎤 تحدث معي',
          pulse: false 
        };
      case 'recording':
        return { 
          color: 'bg-red-500', 
          icon: MicOff, 
          text: `🔴 ${formatTime(recordingTime)} - اضغط للإيقاف`,
          pulse: true 
        };
      case 'processing':
        return { 
          color: 'bg-yellow-500', 
          icon: Loader, 
          text: '⚙️ جاري المعالجة...',
          pulse: false 
        };
      case 'playing':
        return { 
          color: 'bg-blue-500', 
          icon: Volume2, 
          text: '🔊 يشغل الرد...',
          pulse: true 
        };
      case 'completed':
        return { 
          color: 'bg-green-500', 
          icon: CheckCircle, 
          text: '✅ انتهى - اضغط للبدء مرة أخرى',
          pulse: false 
        };
    }
  };

  const buttonState = getButtonState();
  const ButtonIcon = buttonState.icon;

  // تنظيف الموارد عند إلغاء المكون
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* زر الميكروفون الثابت */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-8 left-8 z-50"
      >
        <div className="relative">
          {/* موجات صوتية */}
          <AnimatePresence>
            {voiceState === 'recording' && (
              <>
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 border-4 border-saudi-green/30 rounded-full"
                    initial={{ scale: 1, opacity: 0.7 }}
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
          </AnimatePresence>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleVoiceClick}
            className={`w-20 h-20 rounded-full shadow-2xl transition-all duration-300 relative overflow-hidden cursor-pointer ${buttonState.color} ${buttonState.pulse ? 'animate-pulse' : ''}`}
            aria-pressed={voiceState === 'recording'}
            aria-live="polite"
            aria-label={buttonState.text}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={voiceState}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.3 }}
              >
                <ButtonIcon className={`h-8 w-8 text-white mx-auto ${voiceState === 'processing' ? 'animate-spin' : ''}`} />
              </motion.div>
            </AnimatePresence>
            
            {/* مؤشر مستوى الصوت */}
            {voiceState === 'recording' && (
              <motion.div 
                className="absolute bottom-0 left-0 right-0 bg-white/20 transition-all duration-100"
                style={{ height: `${Math.min(audioLevel, 100)}%` }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            )}
          </motion.button>
        </div>

        {/* تسمية الزر */}
        <motion.div 
          className="text-center mt-2"
          animate={voiceState === 'recording' ? { y: [0, -2, 0] } : {}}
          transition={{ duration: 1, repeat: voiceState === 'recording' ? Infinity : 0 }}
        >
          <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-almarai font-bold text-gray-700 shadow-lg">
            {buttonState.text}
          </span>
        </motion.div>

        {/* موجات CSS للتسجيل */}
        {voiceState === 'recording' && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-1" aria-live="polite">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="wave w-1 bg-saudi-green rounded-full"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  height: `${Math.max(8, audioLevel / 5)}px`
                }}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* نافذة المحادثة الصوتية */}
      <AnimatePresence>
        {(voiceState === 'recording' || voiceState === 'processing' || voiceState === 'playing') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-lg w-full mx-4 shadow-2xl"
            >
              <div className="text-center">
                {/* أيقونة المحادثة */}
                <div className={`w-24 h-24 ${buttonState.color} rounded-full mx-auto mb-6 flex items-center justify-center relative`}>
                  <ButtonIcon className={`h-12 w-12 text-white ${voiceState === 'processing' ? 'animate-spin' : ''}`} />
                  
                  {/* موجات صوتية دائرية */}
                  {voiceState === 'recording' && (
                    <>
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute inset-0 border-4 border-white/30 rounded-full"
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
                </div>

                <motion.h3 
                  className="text-2xl font-almarai font-bold text-gray-800 mb-3"
                  animate={voiceState === 'recording' ? { scale: [1, 1.02, 1] } : {}}
                  transition={{ duration: 2, repeat: voiceState === 'recording' ? Infinity : 0 }}
                >
                  {voiceState === 'recording' && 'أتحدث الآن... أنا أسمعك 👂'}
                  {voiceState === 'processing' && 'جاري معالجة الصوت...'}
                  {voiceState === 'playing' && 'يشغل رد المستشار...'}
                </motion.h3>
                
                <p className="text-gray-600 font-almarai mb-6">
                  {voiceState === 'recording' && 'تحدث بوضوح عن فكرة مشروعك، أهدافك، والسوق المستهدف'}
                  {voiceState === 'processing' && 'يرجى الانتظار بينما نحول صوتك إلى نص ونحلل المحتوى'}
                  {voiceState === 'playing' && 'استمع لرد المستشار الذكي'}
                </p>

                {/* مؤقت التسجيل */}
                {voiceState === 'recording' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="font-almarai font-bold text-red-700">
                        {formatTime(recordingTime)}
                      </span>
                      <span className="font-almarai text-red-600 text-sm">
                        / 5:00
                      </span>
                    </div>
                  </motion.div>
                )}
                
                {/* مؤشر مستوى الصوت */}
                {voiceState === 'recording' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-center gap-1 mb-6"
                  >
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-saudi-green rounded-full transition-all duration-100"
                        style={{
                          height: `${audioLevel > (i * 5) ? Math.random() * 40 + 10 : 5}px`
                        }}
                        animate={{
                          opacity: audioLevel > (i * 5) ? [0.5, 1, 0.5] : 0.3
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    ))}
                  </motion.div>
                )}
                
                {/* النص المُحوّل */}
                <AnimatePresence>
                  {transcript && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-light-green rounded-2xl p-4 mb-6 text-right"
                    >
                      <div className="flex items-center justify-end gap-2 mb-2">
                        <span className="font-almarai font-bold text-saudi-green">
                          ما تقوله الآن:
                        </span>
                        <MessageSquare className="h-5 w-5 text-saudi-green" />
                      </div>
                      <p className="text-saudi-green font-almarai text-lg">
                        "{transcript}"
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* أزرار التحكم */}
                {voiceState === 'recording' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center gap-4"
                  >
                    <motion.button
                      onClick={stopRecording}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-red-500 text-white px-6 py-3 rounded-xl font-almarai font-bold hover:bg-red-600 transition-colors flex items-center gap-2"
                    >
                      <MicOff className="h-5 w-5" />
                      إيقاف التسجيل
                    </motion.button>
                  </motion.div>
                )}

                {/* نصائح سريعة */}
                {voiceState === 'recording' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-6 bg-gray-50 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-saudi-green" />
                      <span className="font-almarai font-bold text-saudi-green text-sm">نصائح للحصول على أفضل النتائج:</span>
                    </div>
                    <div className="space-y-1 text-xs font-almarai text-gray-600 text-right">
                      <p>• تحدث بوضوح واذكر نوع المشروع</p>
                      <p>• اذكر المدينة المستهدفة ورأس المال المتوقع</p>
                      <p>• وضح الجمهور المستهدف والمنافسين</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS للموجات */}
      <style jsx>{`
        .wave {
          animation: wave-animation 1s infinite ease-in-out;
        }
        .wave:nth-child(2) { animation-delay: 0.2s; }
        .wave:nth-child(3) { animation-delay: 0.4s; }
        .wave:nth-child(4) { animation-delay: 0.6s; }
        .wave:nth-child(5) { animation-delay: 0.8s; }
        
        @keyframes wave-animation {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(1.3); }
        }
      `}</style>
    </>
  );
};

export default VoiceButton;