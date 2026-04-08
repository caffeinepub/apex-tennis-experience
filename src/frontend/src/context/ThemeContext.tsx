import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type Theme = "blue" | "pink";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  accentColor: string;
  accentColorSecondary: string;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("blue");

  const accentColor = theme === "blue" ? "#00F5FF" : "#FF007F";
  const accentColorSecondary = theme === "blue" ? "#9D00FF" : "#9D00FF";

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.setProperty("--accent-primary", accentColor);
  }, [theme, accentColor]);

  const toggleTheme = () => setTheme((t) => (t === "blue" ? "pink" : "blue"));

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, accentColor, accentColorSecondary }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
