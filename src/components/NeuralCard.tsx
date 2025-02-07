import { motion } from 'framer-motion';

interface NeuralCardProps {
  children: React.ReactNode;
  className?: string;
  glowIntensity?: 'low' | 'medium' | 'high';
}

export const NeuralCard = ({ 
  children, 
  className = '',
  glowIntensity = 'medium'
}: NeuralCardProps) => {
  const glowStyles = {
    low: 'shadow-lg shadow-cyan-500/10',
    medium: 'shadow-xl shadow-cyan-500/20',
    high: 'shadow-2xl shadow-cyan-500/30'
  };

  return (
    <motion.div
      className={`
        relative overflow-hidden
        bg-gray-800/50 backdrop-blur-sm
        border border-cyan-500/20
        rounded-xl
        ${glowStyles[glowIntensity]}
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Neural network connection lines */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
        <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-transparent via-cyan-500 to-transparent" />
        <div className="absolute top-0 right-0 w-0.5 h-full bg-gradient-to-b from-transparent via-cyan-500 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-500" />
      </div>
    </motion.div>
  );
}; 