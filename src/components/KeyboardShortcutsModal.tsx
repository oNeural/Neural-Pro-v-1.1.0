import { useState, useEffect, useCallback } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Settings as CogIcon } from 'lucide-react';
import { useShortcutsStore } from '../store/shortcutsStore';
import { KeyboardShortcut } from '../types/types';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
}

export const KeyboardShortcutsModal = ({ isOpen, onClose, onOpenSettings }: KeyboardShortcutsModalProps) => {
  const shortcuts = useShortcutsStore(state => state.shortcuts);
  const updateShortcut = useShortcutsStore(state => state.updateShortcut);
  const resetToDefault = useShortcutsStore(state => state.resetToDefault);
  const resetAllToDefault = useShortcutsStore(state => state.resetAllToDefault);
  
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [selectedShortcut, setSelectedShortcut] = useState<KeyboardShortcut | null>(null);
  const [isRecordingKey, setIsRecordingKey] = useState(false);

  // Handle key recording
  useEffect(() => {
    if (!isRecordingKey || !selectedShortcut) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();

      // Build the key combination string
      const keys: string[] = [];
      if (e.ctrlKey) keys.push('Control');
      if (e.altKey) keys.push('Alt');
      if (e.shiftKey) keys.push('Shift');
      if (e.key !== 'Control' && e.key !== 'Alt' && e.key !== 'Shift') {
        keys.push(e.key.length === 1 ? e.key.toUpperCase() : e.key);
      }

      const newShortcut = keys.join('+');
      
      // Update the shortcut
      updateShortcut(selectedShortcut.id, newShortcut);
      setIsRecordingKey(false);
      setSelectedShortcut(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRecordingKey, selectedShortcut, updateShortcut]);

  const handleShortcutClick = (shortcut: KeyboardShortcut) => {
    if (!isCustomizing) return;
    setSelectedShortcut(shortcut);
    setIsRecordingKey(true);
  };

  const handleResetAll = () => {
    if (window.confirm('Are you sure you want to reset all shortcuts to their defaults?')) {
      resetAllToDefault();
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full bg-gray-900 rounded-xl shadow-2xl">
          <div className="p-6 border-b border-gray-800">
            <div className="flex justify-between items-center">
              <Dialog.Title className="text-xl font-semibold text-gray-200">
                Keyboard Shortcuts
              </Dialog.Title>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCustomizing(!isCustomizing)}
                  className={`p-2 rounded-lg transition-colors ${
                    isCustomizing 
                      ? 'bg-indigo-500 text-white' 
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                  }`}
                  title={isCustomizing ? 'Exit customization mode' : 'Customize shortcuts'}
                >
                  <CogIcon className="w-5 h-5" />
                </button>
                {isCustomizing && (
                  <button
                    onClick={handleResetAll}
                    className="px-3 py-1.5 text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    Reset All
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {isCustomizing && (
              <div className="mb-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                <p className="text-sm text-indigo-400">
                  Click on any shortcut to customize it. Press your desired key combination to set the new shortcut.
                </p>
              </div>
            )}

            {shortcuts.map((shortcut) => (
              <div
                key={shortcut.id}
                className={`flex justify-between items-center py-2 border-b border-gray-800 last:border-0 ${
                  isCustomizing ? 'cursor-pointer hover:bg-gray-800/50 rounded-lg px-2' : ''
                } ${selectedShortcut?.id === shortcut.id ? 'bg-gray-800/50' : ''}`}
                onClick={() => handleShortcutClick(shortcut)}
              >
                <div className="flex flex-col gap-1">
                  <span className="text-gray-300">{shortcut.description}</span>
                  {isCustomizing && shortcut.currentKey !== shortcut.defaultKey && (
                    <span className="text-xs text-gray-500">
                      Default: {shortcut.defaultKey}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          resetToDefault(shortcut.id);
                        }}
                        className="ml-2 text-indigo-400 hover:text-indigo-300"
                      >
                        Reset
                      </button>
                    </span>
                  )}
                </div>
                <kbd 
                  className={`px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg font-mono text-sm ${
                    selectedShortcut?.id === shortcut.id ? 'bg-indigo-500/20 text-indigo-400' : ''
                  }`}
                >
                  {selectedShortcut?.id === shortcut.id ? 'Press keys...' : shortcut.currentKey}
                </kbd>
              </div>
            ))}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
