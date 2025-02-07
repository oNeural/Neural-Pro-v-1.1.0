import { motion } from 'framer-motion';
import { X, Home, FileText, Settings, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MobileNavProps {
  onClose: () => void;
  onHelpClick: () => void;
}

export const MobileNav = ({ onClose, onHelpClick }: MobileNavProps) => {
  const menuItems = [
    { icon: Home, label: 'Home', to: '/' },
    { icon: FileText, label: 'New Project', to: '/editor' },
    { icon: HelpCircle, label: 'Help', onClick: onHelpClick },
    { icon: Settings, label: 'Settings', to: '/settings' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed inset-0 z-50 bg-gray-950/95 backdrop-blur-lg lg:hidden"
    >
      <div className="flex flex-col h-full p-6">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 mt-8">
          <ul className="space-y-4">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item.to ? (
                    <Link
                      to={item.to}
                      onClick={onClose}
                      className="flex items-center gap-4 p-4 text-lg font-medium text-gray-300 
                        hover:text-cyan-500 hover:bg-gray-800/50 rounded-lg transition-all"
                    >
                      <Icon className="w-6 h-6" />
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        item.onClick?.();
                        onClose();
                      }}
                      className="flex items-center gap-4 p-4 text-lg font-medium text-gray-300 
                        hover:text-cyan-500 hover:bg-gray-800/50 rounded-lg transition-all w-full"
                    >
                      <Icon className="w-6 h-6" />
                      {item.label}
                    </button>
                  )}
                </motion.li>
              );
            })}
          </ul>
        </nav>
      </div>
    </motion.div>
  );
};
