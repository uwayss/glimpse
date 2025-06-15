// src/types/index.ts
import { Ionicons } from "@expo/vector-icons";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NavigatorScreenParams } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

// --- Types ---
export type Entry = {
  id: string;
  date?: string;
  time?: string;
  title?: string;
  content?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  imageUri?: string | null; // <-- ADD THIS
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

// --- NAVIGATION TYPES ---

export type BottomTabParamList = {
  GlimpseHome: undefined;
  PastEntries: undefined;
  NewEntryTab: undefined;
  Search: undefined;
  Profile: undefined;
};

export type RootBottomTabNavigationProp =
  BottomTabNavigationProp<BottomTabParamList>;

export type RootStackParamList = {
  Main: NavigatorScreenParams<BottomTabParamList>;
  NewEntry: undefined;
  Settings: undefined;
  EditProfile: undefined;
  Notifications: undefined;
};

export type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;
