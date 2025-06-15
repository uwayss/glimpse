// App.tsx
import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import "react-native-gesture-handler";
import { EntryProvider } from "./src/context/EntryContext";
import { ProfileProvider } from "./src/context/ProfileContext"; // Import the new provider

export default function App() {
  return (
    // Wrap with both providers
    <ProfileProvider>
      <EntryProvider>
        <AppNavigator />
      </EntryProvider>
    </ProfileProvider>
  );
}
