import { create } from 'zustand'

interface UIState {
  isDarkMode: boolean
  toggleDarkMode: () => void
  setDarkMode: (isDark: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  isDarkMode: localStorage.getItem('theme') === 'dark',
  toggleDarkMode: () => set((state) => {
    const newDark = !state.isDarkMode
    localStorage.setItem('theme', newDark ? 'dark' : 'light')
    if (newDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    return { isDarkMode: newDark }
  }),
  setDarkMode: (isDark) => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    set({ isDarkMode: isDark })
  }
}))
