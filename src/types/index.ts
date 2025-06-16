// src/types/index.ts
import { Ionicons } from "@expo/vector-icons";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NavigatorScreenParams } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export type EntryCategory = "Personal" | "Travel" | "Food" | "Work";

export type Entry = {
  id: string;
  date?: string;
  time?: string;
  title?: string;
  content?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  imageUri?: string | null;
  location?: string | null;
  category?: EntryCategory;
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
  Onboarding: undefined;
  Main: NavigatorScreenParams<BottomTabParamList>;
  NewEntry: undefined;
  Settings: undefined;
  EditProfile: undefined;
  Notifications: undefined;
  ViewEntry: { entryId: string };
};

export type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;
