import { useEffect } from 'react';

interface HotkeyHandlers {
  onPlayPause: () => void;
  onSeekBackward5: () => void;
  onSeekForward5: () => void;
  onCyclePlaybackSpeed: () => void;
  onInsertTimestamp: (e: KeyboardEvent) => void;
  onExport: () => void;
  onSeekBackward1: () => void;
}

export const useHotkeys = (handlers: HotkeyHandlers) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input or contentEditable
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        // Allow function keys (F1-F8) and ESC even in editable areas
        if (
          e.key.startsWith('F') || // Allow all function keys
          e.key === 'Escape' // Allow ESC
        ) {
          // Continue processing
        } else {
          return;
        }
      }

      // ESC for play/pause and 1-second seek back
      if (e.key === 'Escape' && !e.ctrlKey && !e.altKey && !e.shiftKey) {
        e.preventDefault();
        handlers.onPlayPause();
        handlers.onSeekBackward1();
      }

      // F1 for backward 5s
      if (e.key === 'F1') {
        e.preventDefault();
        handlers.onSeekBackward5();
      }

      // F2 for forward 5s
      if (e.key === 'F2') {
        e.preventDefault();
        handlers.onSeekForward5();
      }

      // F3 for cycling playback speed
      if (e.key === 'F3' && !e.ctrlKey && !e.altKey && !e.shiftKey) {
        e.preventDefault();
        handlers.onCyclePlaybackSpeed();
      }

      // F4 for export
      if (e.key === 'F4') {
        e.preventDefault();
        handlers.onExport();
      }

      // F8 for timestamp insertion
      if (e.key === 'F8') {
        e.preventDefault();
        handlers.onInsertTimestamp(e);
      }

      // Space for play/pause (as backup)
      if (e.code === 'Space' && !e.ctrlKey && !e.altKey && !e.shiftKey) {
        e.preventDefault();
        handlers.onPlayPause();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
};
