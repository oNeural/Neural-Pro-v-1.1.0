import { motion } from 'framer-motion';

interface NeuralGradientProps {
  children: React.ReactNode;
  className?: string;
}

export const NeuralGradient = ({ children, className = '' }: NeuralGradientProps) => {
  return (
    <div className={`relative ${className}`}>
      {/* Neural network gradient background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-gray-900/20 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Neural network dot pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute w-2 h-2 bg-cyan-500 rounded-full top-2 left-2" />
        <div className="absolute w-2 h-2 bg-cyan-500 rounded-full top-2 right-2" />
        <div className="absolute w-2 h-2 bg-cyan-500 rounded-full bottom-2 left-2" />
        <div className="absolute w-2 h-2 bg-cyan-500 rounded-full bottom-2 right-2" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}; 