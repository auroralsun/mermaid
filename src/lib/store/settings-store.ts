import { create } from 'zustand'

interface SettingsState {
  theme: 'light' | 'dark'
  mermaidTheme: 'default' | 'dark' | 'forest' | 'neutral'
  toggleTheme: () => void
  setMermaidTheme: (theme: 'default' | 'dark' | 'forest' | 'neutral') => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: 'dark',
  mermaidTheme: 'dark',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
  setMermaidTheme: (mermaidTheme) => set({ mermaidTheme }),
}))
