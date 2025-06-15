// navigation/BottomTabNavigator.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, Feather } from "@expo/vector-icons";

import GlimpseScreen from "../screens/GlimpseScreen";
import PastEntriesScreen from "../screens/PastEntriesScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SearchScreen from "../screens/SearchScreen";
import Colors from "../constants/Colors";
import NewEntryScreen from "../screens/NewEntryScreen";
import { BottomTabParamList, RootBottomTabNavigationProp } from "../types";

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
        component={NewEntryScreen} // This is just a placeholder, the real action is in the listener
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="plus-square" color={color} size={size + 4} />
          ),
        }}
        listeners={({
          navigation,
        }: {
          navigation: RootBottomTabNavigationProp;
        }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate("NewEntryTab");
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
