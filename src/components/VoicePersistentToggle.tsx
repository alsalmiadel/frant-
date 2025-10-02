import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

const VOICE_PREFERENCE_KEY = "ssai_voice_enabled";

const VoicePersistentToggle: React.FC = () => {
  const [voiceEnabled, setVoiceEnabled] = useState(() => 
    localStorage.getItem(VOICE_PREFERENCE_KEY) !== 'false'
  );

  const toggleVoice = () => {
    const newPreference = !voiceEnabled;
    setVoiceEnabled(newPreference);
    localStorage.setItem(VOICE_PREFERENCE_KEY, newPreference.toString());
    
    // إيقاف أي صوت يشتغل حالياً
    if (!newPreference) {
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
    }
  };

  return (
    <motion.button
      onClick={toggleVoice}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label={voiceEnabled ? 'إيقاف الصوت' : 'تفعيل الصوت'}
      title={voiceEnabled ? 'إيقاف الصوت' : 'تفعيل الصوت'}
    >
      <motion.div
        initial={false}
        animate={{ rotate: voiceEnabled ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        {voiceEnabled ? (
          <Volume2 className="h-5 w-5" />
        ) : (
          <VolumeX className="h-5 w-5" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default VoicePersistentToggle;