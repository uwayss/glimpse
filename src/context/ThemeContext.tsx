// src/context/ThemeContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  PropsWithChildren,
  useEffect,
} from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "@/constants/Colors"; // Your light mode colors

// Define your dark mode colors
const DarkColors = {
  primary: "#0A84FF",
  background: "#000000",
  text: "#FFFFFF",
  lightText: "#8E8E93",
  card: "#1C1C1E",
  border: "#38383A",
  tabIconDefault: "#8E8E93",
  tabIconSelected: "#0A84FF",
};

const THEME_STORAGE_KEY = "@glimpse_theme";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  colors: typeof Colors;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "system",
  isDark: false,
  colors: Colors,
  setTheme: () => {},
});

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const colorScheme = useColorScheme(); // 'light', 'dark', or null
  const [theme, setThemeState] = useState<Theme>("system");

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = (await AsyncStorage.getItem(
        THEME_STORAGE_KEY
      )) as Theme | null;
      if (storedTheme) {
        setThemeState(storedTheme);
      }
    };
    loadTheme();
  }, []);

  const isDark = theme === "system" ? colorScheme === "dark" : theme === "dark";
  const colors = isDark ? DarkColors : Colors;

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, colors, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
