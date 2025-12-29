import { create } from "zustand";

const KEY = "b2c_theme_v1";

const useThemeStore = create((set) => ({
  theme: typeof window !== "undefined" && (localStorage.getItem(KEY) || "light"),
  init: () => {
    try {
      const saved = localStorage.getItem(KEY);
      const t = saved || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      set({ theme: t });
      apply(t);
    } catch { apply("light"); }
  },
  toggleTheme: () => set((s) => {
    const next = s.theme === "dark" ? "light" : "dark";
    localStorage.setItem(KEY, next);
    apply(next);
    return { theme: next };
  })
}));

function apply(theme) {
  if (typeof document === "undefined") return;
  if (theme === "dark") document.documentElement.classList.add("dark");
  else document.documentElement.classList.remove("dark");
}

export default useThemeStore;