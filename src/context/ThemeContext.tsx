import React, {
  createContext,
  useState,
  useContext,
  PropsWithChildren,
  useEffect,
} from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  MD3LightTheme,
  MD3DarkTheme,
  adaptNavigationTheme,
  PaperProvider,
  useTheme as usePaperTheme,
} from "react-native-paper";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";

const CustomLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#007AFF",
    background: "#FFFFFF",
    surface: "#FFFFFF",
    surfaceVariant: "#F2F2F7",
    onSurface: "#1C1C1E",
    onSurfaceVariant: "#1C1C1E",
    outline: "#D1D1D6",
    primaryContainer: "#007AFF",
    onPrimaryContainer: "#FFFFFF",
    secondaryContainer: "#F2F2F7",
    onSecondaryContainer: "#1C1C1E",
    tertiary: "#8E8E93",
    surfaceDisabled: "rgba(28, 28, 30, 0.12)",
    onSurfaceDisabled: "rgba(28, 28, 30, 0.38)",
    backdrop: "rgba(47, 48, 51, 0.4)",
  },
};

const CustomDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#0A84FF",
    background: "#000000",
    surface: "#1C1C1E",
    surfaceVariant: "#1C1C1E",
    onSurface: "#FFFFFF",
    onSurfaceVariant: "#FFFFFF",
    outline: "#38383A",
    primaryContainer: "#0A84FF",
    onPrimaryContainer: "#FFFFFF",
    secondaryContainer: "#1C1C1E",
    onSecondaryContainer: "#FFFFFF",
    tertiary: "#8E8E93",
    surfaceDisabled: "rgba(224, 224, 225, 0.12)",
    onSurfaceDisabled: "rgba(224, 225, 0.38)",
    backdrop: "rgba(78, 79, 83, 0.4)",
  },
};

const { LightTheme: NavLightThemeBase, DarkTheme: NavDarkThemeBase } =
  adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });

const NavLightTheme = {
  ...NavLightThemeBase,
  fonts: {
    regular: {
      ...CustomLightTheme.fonts.bodyMedium,
      fontWeight: CustomLightTheme.fonts.bodyMedium.fontWeight ?? "normal",
    },
    medium: {
      ...CustomLightTheme.fonts.bodyLarge,
      fontWeight: CustomLightTheme.fonts.bodyLarge.fontWeight ?? "500",
    },
    bold: {
      ...CustomLightTheme.fonts.bodyLarge,
      fontWeight: "bold" as const,
    },
    heavy: {
      ...CustomLightTheme.fonts.headlineSmall,
      fontWeight: "900" as const,
    },
  },
};

const NavDarkTheme = {
  ...NavDarkThemeBase,
  fonts: {
    regular: {
      ...CustomDarkTheme.fonts.bodyMedium,
      fontWeight: CustomDarkTheme.fonts.bodyMedium.fontWeight ?? "normal",
    },
    medium: {
      ...CustomDarkTheme.fonts.bodyLarge,
      fontWeight: CustomDarkTheme.fonts.bodyLarge.fontWeight ?? "500",
    },
    bold: {
      ...CustomDarkTheme.fonts.bodyLarge,
      fontWeight: "bold" as const,
    },
    heavy: {
      ...CustomDarkTheme.fonts.headlineSmall,
      fontWeight: "900" as const,
    },
  },
};

const THEME_STORAGE_KEY = "@glimpse_theme";

type ThemeMode = "light" | "dark" | "system";
export type AppTheme = typeof CustomLightTheme;

interface ThemeContextType {
  themeMode: ThemeMode;
  isDark: boolean;
  theme: AppTheme;
  navigationTheme: typeof NavLightTheme;
  setTheme: (themeMode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  themeMode: "system",
  isDark: false,
  theme: CustomLightTheme,
  navigationTheme: NavLightTheme,
  setTheme: () => {},
});

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const colorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = (await AsyncStorage.getItem(
        THEME_STORAGE_KEY
      )) as ThemeMode | null;
      if (storedTheme) {
        setThemeModeState(storedTheme);
      }
    };
    loadTheme();
  }, []);

  const isDark =
    themeMode === "system" ? colorScheme === "dark" : themeMode === "dark";
  const theme = isDark ? CustomDarkTheme : CustomLightTheme;
  const navigationTheme = isDark ? NavDarkTheme : NavLightTheme;

  const setTheme = async (newThemeMode: ThemeMode) => {
    setThemeModeState(newThemeMode);
    await AsyncStorage.setItem(THEME_STORAGE_KEY, newThemeMode);
  };

  return (
    <ThemeContext.Provider
      value={{ themeMode, isDark, theme, navigationTheme, setTheme }}
    >
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const useAppTheme = () => usePaperTheme<AppTheme>();
