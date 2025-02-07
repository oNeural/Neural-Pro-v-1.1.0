import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ShortcutInputProps {
  value: string;
  onChange: (value: string) => void;
  onReset: () => void;
  defaultValue: string;
}

export const ShortcutInput = ({ value, onChange, onReset, defaultValue }: ShortcutInputProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isRecording) return;

      e.preventDefault();

      const keys: string[] = [];
      if (e.ctrlKey) keys.push('Control');
      if (e.shiftKey) keys.push('Shift');
      if (e.altKey) keys.push('Alt');
      if (e.metaKey) keys.push('Meta');

      // Add the main key if it's not a modifier
      const key = e.code === 'Space' ? 'Space' : e.key;
      if (!['Control', 'Shift', 'Alt', 'Meta'].includes(key)) {
        keys.push(key);
      }

      if (keys.length > 0) {
        onChange(keys.join('+'));
        setIsRecording(false);
      }
    };

    if (isRecording) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isRecording, onChange]);

  return (
    <div className="flex items-center gap-2">
      <input
        ref={inputRef}
        type="text"
        value={value}
        readOnly
        onClick={() => setIsRecording(true)}
        className={`input-primary flex-1 cursor-pointer ${
          isRecording ? 'border-cyan-500 bg-cyan-500/10' : ''
        }`}
        placeholder={isRecording ? 'Press keys...' : 'Click to record shortcut'}
      />
      {value !== defaultValue && (
        <button
          onClick={onReset}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-gray-200"
          title="Reset to default"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
