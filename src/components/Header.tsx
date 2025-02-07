import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, HelpCircle, FileText, Home, Settings, ChevronDown, Volume2, Clock, Monitor, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './Logo';
import { useSettingsStore } from '../store/settingsStore';

interface HeaderProps {
  onMobileMenuToggle: () => void;
  onHelpClick: () => void;
  onSettingsClick: () => void;
}

export const Header = ({ onMobileMenuToggle, onHelpClick, onSettingsClick }: HeaderProps) => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { defaultPlaybackSpeed, defaultVolume, setDefaultPlaybackSpeed, setDefaultVolume } = useSettingsStore();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/projects', label: 'Projects', icon: FileText },
  ];

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSettingsOpen(!isSettingsOpen);
  };

  // Close settings dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };

    if (isSettingsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isSettingsOpen]);

  const handleSettingsItemClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-200 ${
        isScrolled ? 'bg-gray-900/95 shadow-lg backdrop-blur-lg' : 'bg-gray-900/50 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <Logo size={32} />
            <motion.h1 
              className="text-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent hidden sm:block"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Neural Pro+
            </motion.h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'text-cyan-400 bg-cyan-500/10' 
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Settings Button with Dropdown */}
            <div className="relative" ref={settingsRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSettingsClick}
                className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-gray-100 bg-gray-800/80 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700/50 shadow-lg"
              >
                <Settings className="w-4 h-4 text-cyan-400" />
                Settings
                <ChevronDown className={`w-4 h-4 transition-transform ${isSettingsOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {isSettingsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-72 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden"
                    onClick={handleSettingsItemClick}
                  >
                    <div className="p-4 space-y-4">
                      {/* Playback Speed */}
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm text-gray-300">
                          <Clock className="w-4 h-4 text-cyan-400" />
                          Default Playback Speed
                        </label>
                        <select
                          value={defaultPlaybackSpeed}
                          onChange={(e) => setDefaultPlaybackSpeed(parseFloat(e.target.value))}
                          className="w-full bg-gray-700 text-gray-200 rounded-lg px-3 py-2 text-sm border border-gray-600"
                        >
                          <option value="0.5">0.5x</option>
                          <option value="1">1x</option>
                          <option value="1.5">1.5x</option>
                          <option value="2">2x</option>
                        </select>
                      </div>

                      {/* Volume */}
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm text-gray-300">
                          <Volume2 className="w-4 h-4 text-cyan-400" />
                          Default Volume
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={defaultVolume}
                          onChange={(e) => setDefaultVolume(parseFloat(e.target.value))}
                          className="w-full accent-cyan-500"
                        />
                        <div className="text-xs text-gray-400 text-right">
                          {Math.round(defaultVolume * 100)}%
                        </div>
                      </div>

                      {/* Theme Toggle */}
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm text-gray-300">
                          <Monitor className="w-4 h-4 text-cyan-400" />
                          Theme
                        </label>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsDarkMode(!isDarkMode);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 bg-gray-700 rounded-lg text-sm text-gray-200 hover:bg-gray-600 transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            {isDarkMode ? (
                              <Moon className="w-4 h-4 text-cyan-400" />
                            ) : (
                              <Sun className="w-4 h-4 text-yellow-400" />
                            )}
                            {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                          </span>
                          <div className={`w-8 h-4 rounded-full transition-colors ${isDarkMode ? 'bg-cyan-500' : 'bg-gray-500'} relative`}>
                            <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-4' : ''}`} />
                          </div>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Help Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onHelpClick}
              className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-gray-100 bg-gray-800/80 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700/50 shadow-lg"
            >
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              Help
            </motion.button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
              onClick={onMobileMenuToggle}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
