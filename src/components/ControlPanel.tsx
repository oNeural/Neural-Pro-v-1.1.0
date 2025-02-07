import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface ControlPanelProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  fileName: string;
  isTranscribing: boolean;
  transcriptionProgress: number;
  currentTime: number;
  duration: number;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  isPlaying,
  onPlayPause,
  onReset,
  fileName,
  isTranscribing,
  transcriptionProgress,
  currentTime,
  duration
}) => {
  // Format time as HH:MM:SS
  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onPlayPause}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
        <div className="text-sm text-gray-400">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
        <button
          onClick={onReset}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          title="Reset"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <span className="text-sm text-gray-400 truncate max-w-md" title={fileName}>
          {fileName}
        </span>
      </div>

      {isTranscribing && (
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-32 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-500 transition-all duration-300"
              style={{ width: `${transcriptionProgress}%` }}
            />
          </div>
          <span className="text-sm text-gray-400">{Math.round(transcriptionProgress)}%</span>
        </div>
      )}
    </div>
  );
};
