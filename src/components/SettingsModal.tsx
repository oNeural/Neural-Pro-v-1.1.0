import { Dialog } from '@headlessui/react';
import { X, Volume2, Clock, HelpCircle } from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';
import { TimestampFormatSelect } from './TimestampFormatSelect';
import { PlaybackSettings, SettingsModalProps } from '../types/types';

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose,
  playbackSettings,
  onPlaybackSettingsChange
}) => {
  const { 
    defaultPlaybackSpeed, 
    defaultVolume, 
    autoSaveInterval,
    setDefaultPlaybackSpeed,
    setDefaultVolume,
    setAutoSaveInterval,
  } = useSettingsStore();

  const handleSpeedChange = (speed: number) => {
    setDefaultPlaybackSpeed(speed);
    onPlaybackSettingsChange({ ...playbackSettings, speed });
  };

  const handleVolumeChange = (volume: number) => {
    setDefaultVolume(volume);
    onPlaybackSettingsChange({ ...playbackSettings, volume });
  };

  const resetTutorial = () => {
    localStorage.removeItem('hasSeenTour');
    window.location.reload();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full bg-gray-900 rounded-xl shadow-2xl max-h-[80vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-800">
            <div className="flex justify-between items-center">
              <Dialog.Title className="text-xl font-semibold text-gray-200">
                Settings
              </Dialog.Title>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Timestamp Format */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-200">Timestamp Format</h3>
              <TimestampFormatSelect />
            </div>

            {/* Playback Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-200">Playback</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Default Speed</label>
                  <select
                    value={playbackSettings.speed}
                    onChange={(e) => handleSpeedChange(Number(e.target.value))}
                    className="input-primary w-full"
                  >
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                      <option key={speed} value={speed}>{speed}x</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Default Volume</label>
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-5 h-5 text-cyan-500" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={playbackSettings.volume}
                      onChange={(e) => handleVolumeChange(Number(e.target.value))}
                      className="flex-1 accent-cyan-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Auto-save Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-200">Auto-save</h3>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Interval (milliseconds)</label>
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  value={autoSaveInterval}
                  onChange={(e) => setAutoSaveInterval(Number(e.target.value))}
                  className="input-primary w-full"
                />
              </div>
            </div>

            {/* Reset Tutorial */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-200">Tutorial</h3>
              <button
                onClick={resetTutorial}
                className="btn-secondary flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4" />
                Reset Tutorial
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
