import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface TranscriptionLoaderProps {
  isVisible: boolean;
  progress: number;
  status: string;
}

// Fun loading messages
const uploadingMessages = [
  "Teaching AI to understand your accent... 🎭",
  "Warming up the neural networks... 🧠",
  "Feeding audio to hungry algorithms... 🍽️",
  "Converting sound waves to brain waves... 🌊",
  "Did you know? The human brain processes audio 10x faster than text! 🎧",
  "Preparing the AI ensemble... 🎵",
  "Fun fact: Your voice contains 100+ measurable qualities! 🗣️",
  "Quantum-entangling your audio bits... ⚛️",
  "Training pigeons to transcribe... just kidding! 🐦",
  "Making AI do push-ups for better performance... 💪",
  "Uploading to the cloud, hope it doesn't rain! ☔",
  "Converting your voice into binary... 01001000 01101001 👾",
  "Did you know? Sound travels 4x faster in water! 🌊",
  "Preparing the AI choir for your audio... 🎶",
  "Fun fact: The first audio recording was in 1860! 📜",
  "Loading personality module for AI... 🤓",
  "Summoning the transcription wizards... 🧙‍♂️",
  "Tuning our virtual ears... 👂",
  "Charging up the flux capacitor... ⚡",
  "Consulting with AI elders... 🧓"
];

const transcribingMessages = [
  "Converting coffee to code... ☕",
  "Fun fact: You just created ~1MB of audio per minute! 📊",
  "Neurons are firing at maximum capacity... 🔥",
  "Did you know? AI can detect 20+ human emotions in speech! 🎭",
  "Teaching robots to appreciate your tone... 🤖",
  "Translating human sounds into robot poetry... 📝",
  "Calculating the meaning of life... and your audio! 42🎯",
  "Making sure AI had its breakfast... 🍳",
  "Turning coffee into transcriptions... ☕",
  "Breaking sound barriers, one word at a time... 🚀",
  "Did you know? Your brain processes speech in 0.05 seconds! ⚡",
  "Teaching AI the art of active listening... 👂",
  "Decoding your audio with quantum accuracy... 🎯",
  "Fun fact: Humans can distinguish 400,000 sounds! 🔊",
  "Analyzing audio at the speed of light... well, almost! 💨",
  "Converting soundwaves into brain waves... 🧠",
  "Feeding your audio to our pet algorithms... 🐾",
  "Sprinkling some AI magic dust... ✨",
  "Running on caffeine and binary code... 💻",
  "Making the robots work overtime... 🦾"
];

// Neural Pro+ logo SVG component optimized for animation
const AnimatedNeuralLogo = () => (
  <svg width="120" height="120" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* Background Circle with Pulse */}
    <motion.circle
      cx="50"
      cy="50"
      r="45"
      fill="#111827"
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
    />
    
    {/* Neural Network Lines with Flow Animation */}
    <motion.g
      stroke="#60A5FA"
      strokeOpacity="0.5"
      strokeWidth="2"
      initial={{ opacity: 0.3 }}
      animate={{ opacity: 0.8 }}
      transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
    >
      <motion.path
        d="M30 30 L50 50 L70 30"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.path
        d="M30 50 L50 50 L70 50"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
      />
      <motion.path
        d="M30 70 L50 50 L70 70"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 1, repeat: Infinity }}
      />
    </motion.g>

    {/* Neural Network Nodes with Pulse */}
    <motion.g
      initial={{ scale: 0.8 }}
      animate={{ scale: 1.1 }}
      transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
    >
      <circle cx="30" cy="30" r="4" fill="#60A5FA"/>
      <circle cx="30" cy="50" r="4" fill="#60A5FA"/>
      <circle cx="30" cy="70" r="4" fill="#60A5FA"/>
      <motion.circle
        cx="50"
        cy="50"
        r="6"
        fill="#3B82F6"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1.2 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
      />
      <circle cx="70" cy="30" r="4" fill="#60A5FA"/>
      <circle cx="70" cy="50" r="4" fill="#60A5FA"/>
      <circle cx="70" cy="70" r="4" fill="#60A5FA"/>
    </motion.g>

    {/* Rotating Outer Ring */}
    <motion.circle
      cx="50"
      cy="50"
      r="45"
      stroke="#60A5FA"
      strokeWidth="2"
      fill="none"
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
    />
  </svg>
);

export const TranscriptionLoader = ({ isVisible, progress, status }: TranscriptionLoaderProps) => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Change message every 6 seconds
    const messages = status === 'uploading' ? uploadingMessages : transcribingMessages;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * messages.length);
      setMessage(messages[randomIndex]);
    }, 6000);

    // Set initial message
    setMessage(messages[Math.floor(Math.random() * messages.length)]);

    return () => clearInterval(interval);
  }, [status]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Blurred Background */}
      <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-md" />
      
      {/* Content */}
      <div className="relative flex flex-col items-center">
        {/* Animated Logo */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <AnimatedNeuralLogo />
        </motion.div>

        {/* Status Text */}
        <div className="mt-8 text-center max-w-md px-4">
          <motion.h3 
            key={message}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              duration: 0.4,
              ease: "easeOut"
            }}
            className="text-xl font-medium text-gray-200"
          >
            {message}
          </motion.h3>
          <motion.p 
            className="mt-2 text-sm text-gray-400"
            animate={{ opacity: [0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          >
            {progress > 0 ? `${Math.round(progress)}% complete` : 'Brewing AI magic...'}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}; 