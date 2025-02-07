import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Neural Pro+ logo SVG component
const NeuralLogo = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* Background Circle */}
    <circle cx="50" cy="50" r="45" fill="#111827"/>
    
    {/* Neural Network Lines */}
    <g stroke="#60A5FA" strokeOpacity="0.5" strokeWidth="2">
      <path d="M30 30 L50 50 L70 30"/>
      <path d="M30 50 L50 50 L70 50"/>
      <path d="M30 70 L50 50 L70 70"/>
    </g>

    {/* Neural Network Nodes */}
    <g>
      <circle cx="30" cy="30" r="4" fill="#60A5FA"/>
      <circle cx="30" cy="50" r="4" fill="#60A5FA"/>
      <circle cx="30" cy="70" r="4" fill="#60A5FA"/>
      <circle cx="50" cy="50" r="6" fill="#3B82F6"/>
      <circle cx="70" cy="30" r="4" fill="#60A5FA"/>
      <circle cx="70" cy="50" r="4" fill="#60A5FA"/>
      <circle cx="70" cy="70" r="4" fill="#60A5FA"/>
    </g>

    {/* Outer Ring */}
    <circle cx="50" cy="50" r="45" stroke="#60A5FA" strokeWidth="2" fill="none"/>
  </svg>
);

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      }
    };
    checkInstalled();

    // Listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // Listen for installation
    const installHandler = () => {
      setIsInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', installHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installHandler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsInstalled(true);
        console.log('PWA installed successfully');
      } else {
        console.log('PWA installation declined');
      }
    } catch (error) {
      console.error('Error installing PWA:', error);
    }
  };

  // Show prompt if not installed and installation is available
  const shouldShowPrompt = !isInstalled && deferredPrompt !== null;

  return (
    <AnimatePresence>
      {shouldShowPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-20 right-4 z-50"
        >
          <motion.div
            className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-4 max-w-sm"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <NeuralLogo />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-200">Install Neural Pro+</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Install our app for a better experience with quick access and offline features
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={handleInstall}
                    className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    Install Now
                  </button>
                  <button
                    onClick={() => setDeferredPrompt(null)}
                    className="px-3 py-1.5 text-xs text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallPrompt; 