// App.tsx
import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import "react-native-gesture-handler";
import { EntryProvider } from "./src/context/EntryContext";
import { ProfileProvider } from "./src/context/ProfileContext";
import { ThemeProvider } from "./src/context/ThemeContext"; // Import ThemeProvider
import { StatusBar } from "expo-status-bar";

export default function App() {
  return (
    // Wrap everything with ThemeProvider
    <ThemeProvider>
      <ProfileProvider>
        <EntryProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </EntryProvider>
      </ProfileProvider>
    </ThemeProvider>
  );
}
