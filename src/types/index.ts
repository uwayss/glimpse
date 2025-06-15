// src/types/index.ts

import { Ionicons } from "@expo/vector-icons";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NavigatorScreenParams } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

// --- Existing Types ---
export type Entry = {
  id: string;
  date?: string; // <-- ADD THIS LINE (format: 'YYYY-MM-DD')
  time?: string;
  title?: string;
  content?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
};
export type DayEntries = {
  title: string;
  data: Entry[];
};

export type SearchResult = {
  id: string;
  title: string;
  date: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
};

// --- NEW NAVIGATION TYPES ---

// Defines the routes and their parameters for the Bottom Tab Navigator
export type BottomTabParamList = {
  GlimpseHome: undefined; // undefined means no parameters are passed to the route
  PastEntries: undefined;
  NewEntryTab: undefined; // This is the placeholder for the plus button
  Search: undefined;
  Profile: undefined;
};
export type RootBottomTabNavigationProp =
  BottomTabNavigationProp<BottomTabParamList>;
// Defines the routes for the main Stack Navigator.
// It includes the 'Main' tab navigator and any other modal/full-screen pages.
export type RootStackParamList = {
  Main: NavigatorScreenParams<BottomTabParamList>; // This screen is the entire bottom tab navigator
  NewEntry: undefined;
  Settings: undefined;
};

// This is a helper type for use with the `useNavigation` hook in our screens
export type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;
