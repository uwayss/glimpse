import { NavigatorScreenParams } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

export type EntryCategory = string;

export type Entry = {
  id: string;
  date?: string;
  time?: string;
  title?: string;
  content?: string;
  icon?: string;
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
  icon: string;
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
