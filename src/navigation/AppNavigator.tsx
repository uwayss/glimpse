// src/navigation/AppNavigator.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import BottomTabNavigator from "./BottomTabNavigator";
import NewEntryScreen from "../screens/NewEntryScreen";
import SettingsScreen from "../screens/SettingsScreen";
import Colors from "../constants/Colors";
import { RootStackParamList } from "../types"; // Import the new type

// Apply the type here
const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.background,
            shadowOpacity: 0,
            elevation: 0,
          },
          headerTintColor: Colors.text,
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
