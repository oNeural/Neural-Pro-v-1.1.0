import { motion } from 'framer-motion';
import { FileText, Mic, Brain, Wand2 } from 'lucide-react';
import { NeuralCard } from './NeuralCard';
import { NeuralGradient } from './NeuralGradient';
import { Link } from 'react-router-dom';

export const HomeView = () => {
  const features = [
    {
      icon: Brain,
      title: 'Smart AI Magic',
      description: "Our AI is like your personal transcription buddy, turning your audio into text with amazing accuracy."
    },
    {
      icon: Mic,
      title: 'Speaker Detection',
      description: "No more 'who said what?' - we'll automatically tag each speaker in your conversations."
    },
    {
      icon: Wand2,
      title: 'Auto-Formatting',
      description: "Sit back while we handle the formatting. Perfect punctuation and paragraphs, just like magic! ✨"
    },
    {
      icon: FileText,
      title: 'Easy Exports',
      description: "Get your transcripts exactly how you want them. Simple, clean, and ready to go!"
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section - Enhanced */}
      <section className="text-center mb-12 relative">
        {/* Animated background glow */}
        <div className="absolute inset-x-0 top-0 h-64 overflow-hidden -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/20 via-blue-500/5 to-transparent blur-3xl transform-gpu" />
        </div>

        {/* Title with animated gradient */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="text-3xl md:text-5xl font-bold mb-4"
            style={{ WebkitTextStroke: '1px rgba(6, 182, 212, 0.1)' }}
          >
            <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient">
              Speech into Text, Like Magic! ✨
            </span>
          </motion.h1>
          
          {/* Floating particles */}
          <div className="absolute inset-0 -z-10">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-cyan-500 rounded-full"
                style={{
                  left: `${30 + i * 20}%`,
                  top: `${20 + i * 15}%`,
                }}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.2, 0.5, 0.2],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.4,
                }}
              />
            ))}
          </div>
        </motion.div>
        
        <motion.p 
          className="text-lg text-gray-400 mb-6 max-w-xl mx-auto relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Hey there! 👋 Let our AI handle your transcriptions while you focus on what matters.
          <span className="block mt-1 text-cyan-500/80">Quick, accurate, and totally hassle-free!</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-xl -z-10" />
          <Link
            to="/editor"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-medium text-white hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 hover:-translate-y-0.5 relative overflow-hidden group"
          >
            <span className="relative z-10">Let's Get Started!</span>
            <motion.span
              className="relative z-10"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              →
            </motion.span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        </motion.div>
      </section>

      {/* Features Grid - Enhanced */}
      <section className="relative max-w-4xl mx-auto px-4 mb-16">
        {/* Neural Network Connection Lines - Enhanced */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full" style={{ minHeight: '320px' }}>
            {[...Array(5)].map((_, i) => (
              <motion.path
                key={i}
                d={`M${150 + i * 50},100 C${250 + i * 50},${150 + i * 10} ${450 - i * 50},${50 + i * 10} ${550 - i * 50},100`}
                stroke="url(#gradient)"
                strokeWidth="1.5"
                fill="none"
                className="opacity-20"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ 
                  duration: 2 + i * 0.2, 
                  repeat: Infinity, 
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              />
            ))}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgb(6, 182, 212)" />
                <stop offset="50%" stopColor="rgb(59, 130, 246)" />
                <stop offset="100%" stopColor="rgb(6, 182, 212)" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Features Grid - Enhanced hover effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -3, scale: 1.02 }}
                className="transform-gpu"
              >
                <NeuralCard
                  className="p-4 group backdrop-blur-lg hover:bg-gray-800/60 transition-colors duration-300"
                  glowIntensity="medium"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-cyan-500/20 blur-lg rounded-full group-hover:bg-cyan-500/30 transition-colors duration-300" />
                      <div className="relative p-2.5 rounded-lg bg-cyan-500/10 text-cyan-500 group-hover:bg-cyan-500/20 group-hover:scale-110 transition-all duration-300">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-200 mb-1 group-hover:text-cyan-400 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </NeuralCard>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Call to Action - Enhanced */}
      <section className="mt-16 mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-blue-500/5 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <NeuralGradient className="max-w-2xl mx-auto p-6 text-center backdrop-blur-lg hover:backdrop-blur-xl transition-all duration-300">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute w-full h-full">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 bg-cyan-500 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.1, 0.3, 0.1],
                      x: [0, Math.random() * 20 - 10, 0],
                      y: [0, Math.random() * 20 - 10, 0],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-xl font-bold mb-3 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                Ready to Make Your Life Easier? 🚀
              </h2>
              <p className="text-sm text-gray-400 mb-5">
                Join thousands of happy users who've discovered the joy of hassle-free transcription!
              </p>
            </motion.div>
            <Link
              to="/editor"
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg px-8 py-3 transition-colors duration-200 inline-block relative z-10"
            >
              Start Your First Project! 🎉 →
            </Link>
          </NeuralGradient>
        </motion.div>
      </section>
    </div>
  );
}; 