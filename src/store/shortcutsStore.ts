import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { KeyboardShortcut } from '../types/types';

interface ShortcutsState {
  shortcuts: KeyboardShortcut[];
  updateShortcut: (id: string, newKeys: string) => void;
  resetToDefault: (id: string) => void;
  resetAllToDefault: () => void;
}

const defaultShortcuts: KeyboardShortcut[] = [
  { id: 'playPause', description: 'Play/Pause/Seek 1s', defaultKey: 'Escape', currentKey: 'Escape' },
  { id: 'seekBackward5', description: 'Seek backward 5 seconds', defaultKey: 'F1', currentKey: 'F1' },
  { id: 'seekForward5', description: 'Seek forward 5 seconds', defaultKey: 'F2', currentKey: 'F2' },
  { id: 'cycleSpeed', description: 'Change playback speed', defaultKey: 'F3', currentKey: 'F3' },
  { id: 'export', description: 'Export options', defaultKey: 'F4', currentKey: 'F4' },
  { id: 'insertTimestamp', description: 'Insert timestamp', defaultKey: 'F8', currentKey: 'F8' },
];

export const useShortcutsStore = create<ShortcutsState>()(
  persist(
    (set) => ({
      shortcuts: defaultShortcuts,
      updateShortcut: (id, newKeys) =>
        set((state) => ({
          shortcuts: state.shortcuts.map((s) =>
            s.id === id ? { ...s, currentKey: newKeys } : s
          ),
        })),
      resetToDefault: (id) =>
        set((state) => ({
          shortcuts: state.shortcuts.map((s) =>
            s.id === id ? { ...s, currentKey: s.defaultKey } : s
          ),
        })),
      resetAllToDefault: () =>
        set({
          shortcuts: defaultShortcuts,
        }),
    }),
    {
      name: 'shortcuts-storage',
    }
  )
);
