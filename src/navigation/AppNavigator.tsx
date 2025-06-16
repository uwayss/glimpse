import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { useTheme } from "@/context/ThemeContext";
import { useProfile } from "@/context/ProfileContext";
import { RootStackParamList } from "../types";

import BottomTabNavigator from "./BottomTabNavigator";
import NewEntryScreen from "../screens/NewEntryScreen";
import SettingsScreen from "../screens/SettingsScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import ViewEntryScreen from "../screens/ViewEntryScreen";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { navigationTheme, theme } = useTheme();
  const { profile, isLoading } = useProfile();

  if (isLoading) {
    const styles = stylesheet(theme.colors);
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
        }}
      >
        {profile?.hasOnboarded ? (
          <>
            <Stack.Screen
              name="Main"
              component={BottomTabNavigator}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="NewEntry"
              component={NewEntryScreen}
              options={{
                presentation: "modal",
                headerShown: false,
              }}
            />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen
              name="EditProfile"
              component={EditProfileScreen}
              options={{
                title: "Edit Profile",
                presentation: "modal",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Notifications"
              component={NotificationsScreen}
              options={{
                title: "Notifications",
              }}
            />
            <Stack.Screen
              name="ViewEntry"
              component={ViewEntryScreen}
              options={{
                headerShown: false,
              }}
            />
          </>
        ) : (
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
            options={{
              headerShown: false,
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
function stylesheet(colors: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      backgroundColor: colors.background,
    },
  });
}
export default AppNavigator;
