// src/navigation/BottomTabNavigator.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, Feather } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";

import GlimpseScreen from "../screens/GlimpseScreen";
import PastEntriesScreen from "../screens/PastEntriesScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SearchScreen from "../screens/SearchScreen";
import Colors from "../constants/Colors";
import NewEntryScreen from "../screens/NewEntryScreen";
import { BottomTabParamList, RootStackParamList } from "../types";

// We DO NOT need the complex CompositeNavigationProp type. This is much cleaner.

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: Colors.background },
        tabBarActiveTintColor: Colors.tabIconSelected,
        tabBarInactiveTintColor: Colors.tabIconDefault,
      }}
    >
      <Tab.Screen
        name="GlimpseHome"
        component={GlimpseScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="PastEntries"
        component={PastEntriesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="NewEntryTab"
        component={NewEntryScreen} // Placeholder component
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="plus-square" color={color} size={size + 4} />
          ),
        }}
        // --- THIS IS THE FIX ---
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Prevent the default action (which is switching to this tab)
            e.preventDefault();

            // Get the parent navigator and tell it which type it is
            const parentNavigator =
              navigation.getParent<StackNavigationProp<RootStackParamList>>();

            // If the parent exists, tell it to navigate to the 'NewEntry' modal
            if (parentNavigator) {
              parentNavigator.navigate("NewEntry");
            }
          },
        })}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
