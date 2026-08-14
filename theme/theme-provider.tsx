import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

import {
  colorsByScheme,
  fonts,
  radius,
  spacing,
  type ColorScheme,
  type ThemeColors,
} from '@/theme/tokens';

export type ThemeMode = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'rn-animations:theme-mode';

export type Theme = {
  /** ユーザーが選んだモード */
  mode: ThemeMode;
  /** 実際に適用されている配色 */
  scheme: ColorScheme;
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  fonts: typeof fonts;
  setMode: (mode: ThemeMode) => void;
  /** AsyncStorage からの復元が終わったか */
  hydrated: boolean;
};

const ThemeContext = createContext<Theme | null>(null);

function isThemeMode(value: unknown): value is ThemeMode {
  return value === 'system' || value === 'light' || value === 'dark';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useSystemColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (!cancelled && isThemeMode(stored)) setModeState(stored);
      })
      .catch(() => {
        // 読み込めなければ system のまま
      })
      .finally(() => {
        if (!cancelled) setHydrated(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {
      // 保存に失敗してもアプリの動作は続行する
    });
  }, []);

  const value = useMemo<Theme>(() => {
    const scheme: ColorScheme = mode === 'system' ? (systemScheme ?? 'light') : mode;
    return {
      mode,
      scheme,
      colors: colorsByScheme[scheme],
      spacing,
      radius,
      fonts,
      setMode,
      hydrated,
    };
  }, [mode, systemScheme, setMode, hydrated]);

  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useTheme(): Theme {
  const theme = use(ThemeContext);
  if (!theme) {
    throw new Error('useTheme は ThemeProvider の内側で呼び出してください');
  }
  return theme;
}

/** 配色だけ欲しいときのショートカット */
export function useColors(): ThemeColors {
  return useTheme().colors;
}
