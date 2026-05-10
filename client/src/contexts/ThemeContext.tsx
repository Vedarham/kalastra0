import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  applyThemeFromUser: (userTheme?: string) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const applyDomTheme = (theme: Theme) => {
  const root = document.documentElement;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (theme === "dark" || (theme === "system" && prefersDark)) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");

  // Listen to OS-level preference changes when theme is 'system'
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") applyDomTheme("system");
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    applyDomTheme(newTheme);
    // Persist to localStorage for pre-auth visits
    localStorage.setItem("kalastra-theme", newTheme);
  }, []);

  // Called by AuthContext after the user loads from DB
  const applyThemeFromUser = useCallback(
    (userTheme?: string) => {
      const t = (userTheme as Theme) || "system";
      setThemeState(t);
      applyDomTheme(t);
    },
    []
  );

  // On mount: apply from localStorage first (before auth completes)
  useEffect(() => {
    const stored = localStorage.getItem("kalastra-theme") as Theme | null;
    if (stored) {
      setThemeState(stored);
      applyDomTheme(stored);
    } else {
      applyDomTheme("system");
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, applyThemeFromUser }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
