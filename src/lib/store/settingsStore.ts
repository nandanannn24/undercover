"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { WordPair } from "@/data/wordBank";
import { sound } from "../audio";

interface SettingsStore {
  volume: number;
  isMuted: boolean;
  hapticsEnabled: boolean;
  customWordPairs: WordPair[];

  setVolume: (v: number) => void;
  toggleMute: () => void;
  toggleHaptics: () => void;
  addCustomWordPair: (pair: Omit<WordPair, "id">) => void;
  deleteCustomWordPair: (id: string) => void;
  importWordPairs: (pairs: WordPair[]) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      volume: 0.8,
      isMuted: false,
      hapticsEnabled: true,
      customWordPairs: [],

      setVolume: (v) => {
        sound.setVolume(v);
        set({ volume: v });
      },

      toggleMute: () => {
        const next = !get().isMuted;
        sound.setMuted(next);
        set({ isMuted: next });
      },

      toggleHaptics: () => {
        set({ hapticsEnabled: !get().hapticsEnabled });
      },

      addCustomWordPair: (pair) => {
        const newPair: WordPair = {
          ...pair,
          id: `custom_${Date.now()}`,
        };
        set({ customWordPairs: [newPair, ...get().customWordPairs] });
      },

      deleteCustomWordPair: (id) => {
        set({ customWordPairs: get().customWordPairs.filter((p) => p.id !== id) });
      },

      importWordPairs: (pairs) => {
        set({ customWordPairs: [...pairs, ...get().customWordPairs] });
      },
    }),
    {
      name: "undercover-settings-storage",
    }
  )
);
