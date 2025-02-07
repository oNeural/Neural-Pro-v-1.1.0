import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo = ({ className = '', size = 32 }: LogoProps) => {
  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Background Circle with Gradient */}
        <circle
          cx="50"
          cy="50"
          r="45"
          className="fill-current text-gray-800"
        />
        
        {/* Neural Network Lines */}
        <g className="stroke-current text-cyan-500/50">
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            d="M30 30 L50 50 L70 30"
            strokeWidth="2"
          />
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
            d="M30 50 L50 50 L70 50"
            strokeWidth="2"
          />
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.4, ease: "easeInOut" }}
            d="M30 70 L50 50 L70 70"
            strokeWidth="2"
          />
        </g>

        {/* Neural Network Nodes */}
        <g>
          <motion.circle
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            cx="30"
            cy="30"
            r="4"
            className="fill-current text-cyan-500"
          />
          <motion.circle
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            cx="30"
            cy="50"
            r="4"
            className="fill-current text-cyan-500"
          />
          <motion.circle
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            cx="30"
            cy="70"
            r="4"
            className="fill-current text-cyan-500"
          />
          <motion.circle
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            cx="50"
            cy="50"
            r="6"
            className="fill-current text-blue-500"
          />
          <motion.circle
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            cx="70"
            cy="30"
            r="4"
            className="fill-current text-cyan-500"
          />
          <motion.circle
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            cx="70"
            cy="50"
            r="4"
            className="fill-current text-cyan-500"
          />
          <motion.circle
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            cx="70"
            cy="70"
            r="4"
            className="fill-current text-cyan-500"
          />
        </g>

        {/* Outer Ring with Gradient */}
        <motion.circle
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          cx="50"
          cy="50"
          r="45"
          strokeWidth="2"
          className="stroke-current text-cyan-500"
          fill="none"
        />
      </svg>
    </motion.div>
  );
}; 