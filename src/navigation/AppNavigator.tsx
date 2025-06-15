// src/navigation/AppNavigator.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import BottomTabNavigator from "./BottomTabNavigator";
import NewEntryScreen from "../screens/NewEntryScreen";
import SettingsScreen from "../screens/SettingsScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import { RootStackParamList } from "../types";
import { useTheme } from "../context/ThemeContext";

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { colors } = useTheme();
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
            shadowOpacity: 0,
            elevation: 0,
          },
          headerTintColor: colors.text,
        }}
      >
        <Stack.Screen
          name="Main"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NewEntry"
          component={NewEntryScreen}
          options={{ presentation: "modal", headerShown: false }}
        />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{
            title: "Edit Profile",
            presentation: "modal", // Opens as a modal like NewEntry
          }}
        />
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{
            title: "Notifications",
            presentation: "modal", // Opens as a modal like NewEntry
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
