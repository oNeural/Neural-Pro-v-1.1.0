import { Clock } from 'lucide-react';
import { TimestampFormat } from '../types/types';
import { timestampFormatOptions } from '../utils/formatTime';
import { useSettingsStore } from '../store/settingsStore';

interface TimestampFormatSelectProps {
  className?: string;
}

export const TimestampFormatSelect = ({ className = '' }: TimestampFormatSelectProps) => {
  const { timestampFormat, setTimestampFormat } = useSettingsStore();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Clock className="w-4 h-4 text-cyan-500" />
      <select
        value={timestampFormat}
        onChange={(e) => setTimestampFormat(e.target.value as TimestampFormat)}
        className="input-primary text-sm"
      >
        {timestampFormatOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label} ({option.example})
          </option>
        ))}
      </select>
    </div>
  );
};
