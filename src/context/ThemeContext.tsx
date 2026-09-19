// Libraries
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

// ── Tipos ───────────────────────────────────────────────────
export type ThemeId = 'elegante' | 'organica' | 'streetwear';

export interface ThemeMeta {
  id: ThemeId;
  label: string;
  description: string;
  swatches: string[]; // colores para la preview (primario, fondo, acento)
}

export const THEMES: ThemeMeta[] = [
  {
    id: 'elegante',
    label: 'Alta Gama',
    description: 'Minimalista · Sofisticado',
    swatches: ['#121212', '#F8F9FA', '#E5D9C5'],
  },
  {
    id: 'organica',
    label: 'Orgánica',
    description: 'Natural · Sostenible',
    swatches: ['#2F3E46', '#F4F1EA', '#C86D51'],
  },
  {
    id: 'streetwear',
    label: 'Streetwear',
    description: 'Vigoroso · Juvenil',
    swatches: ['#0B132B', '#ffffff', '#FF5A5F'],
  },
];

// ── Context ─────────────────────────────────────────────────
interface ThemeCtx {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
}

const ThemeContext = createContext<ThemeCtx>({
  theme: 'elegante',
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

// ── Provider ─────────────────────────────────────────────────
const STORAGE_KEY = 'unholy-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    return saved && THEMES.some((t) => t.id === saved) ? saved : 'elegante';
  });

  // Aplica el atributo al <html> y persiste
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  function setTheme(t: ThemeId) {
    setThemeState(t);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
