// App.tsx
import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import "react-native-gesture-handler";
import { EntryProvider } from "./src/context/EntryContext"; // Import the provider

export default function App() {
  return (
    // Wrap the navigator with the provider
    <EntryProvider>
      <AppNavigator />
    </EntryProvider>
  );
}
