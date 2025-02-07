import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import React from 'react';
import { TimestampFormat } from '../types/types';

interface SettingsState {
  defaultPlaybackSpeed: number;
  defaultVolume: number;
  autoSaveInterval: number;
  timestampFormat: TimestampFormat;
  setDefaultPlaybackSpeed: (speed: number) => void;
  setDefaultVolume: (volume: number) => void;
  setAutoSaveInterval: (interval: number) => void;
  setTimestampFormat: (format: TimestampFormat) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      defaultPlaybackSpeed: 1,
      defaultVolume: 1,
      autoSaveInterval: 2000,
      timestampFormat: 'mm:ss',
      setDefaultPlaybackSpeed: (speed) => set({ defaultPlaybackSpeed: speed }),
      setDefaultVolume: (volume) => set({ defaultVolume: volume }),
      setAutoSaveInterval: (interval) => set({ autoSaveInterval: interval }),
      setTimestampFormat: (format) => set({ timestampFormat: format }),
    }),
    {
      name: 'settings-storage',
    }
  )
);
