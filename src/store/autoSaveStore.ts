import { create } from 'zustand';
import React from 'react';

interface AutoSaveState {
  lastSaved: Date | null;
  setLastSaved: (date: Date) => void;
}

export const useAutoSaveStore = create<AutoSaveState>((set) => ({
  lastSaved: null,
  setLastSaved: (date) => set({ lastSaved: date }),
}));
