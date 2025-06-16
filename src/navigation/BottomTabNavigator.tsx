import React, { useState } from "react";
import { BottomNavigation } from "react-native-paper";
import { useTheme } from "@/context/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/types";

import GlimpseScreen from "../screens/GlimpseScreen";
import PastEntriesScreen from "../screens/PastEntriesScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SearchScreen from "../screens/SearchScreen";

const BottomTabNavigator = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [index, setIndex] = useState(0);
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [routes] = useState([
    {
      key: "GlimpseHome",
      title: "Home",
      focusedIcon: "home",
      unfocusedIcon: "home-outline",
    },
    {
      key: "PastEntries",
      title: "Calendar",
      focusedIcon: "calendar-blank",
      unfocusedIcon: "calendar-blank-outline",
    },
    {
      key: "NewEntryTab",
      title: "Add",
      focusedIcon: "plus-box",
      unfocusedIcon: "plus-box-outline",
    },
    {
      key: "Search",
      title: "Search",
      focusedIcon: "magnify",
    },
    {
      key: "Profile",
      title: "Profile",
      focusedIcon: "account-circle",
      unfocusedIcon: "account-circle-outline",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    GlimpseHome: GlimpseScreen,
    PastEntries: PastEntriesScreen,
    NewEntryTab: () => null,
    Search: SearchScreen,
    Profile: ProfileScreen,
  });

  const handleIndexChange = (newIndex: number) => {
    if (routes[newIndex].key === "NewEntryTab") {
      navigation.navigate("NewEntry");
    } else {
      setIndex(newIndex);
    }
  };

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={handleIndexChange}
      renderScene={renderScene}
      shifting={false}
      activeColor={theme.colors.primary}
      inactiveColor={theme.colors.tertiary}
      barStyle={{ backgroundColor: theme.colors.surface }}
      theme={theme}
      safeAreaInsets={{ bottom: insets.bottom }}
    />
  );
};

export default BottomTabNavigator;
