// src/screens/NotificationsScreen.tsx
import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Switch, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@/context/ThemeContext";
import ThemedText from "@/components/ThemedText";

const NOTIFICATIONS_ENABLED_KEY = "@glimpse_notifications_enabled";

const SettingsRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.row, { borderBottomColor: colors.border }]}>
      <ThemedText style={[styles.label, { color: colors.text }]}>
        {label}
      </ThemedText>
      {children}
    </View>
  );
};

const NotificationsScreen = () => {
  const { colors, isDark } = useTheme();
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const storedValue = await AsyncStorage.getItem(NOTIFICATIONS_ENABLED_KEY);
      setIsEnabled(storedValue === "true");
    };
    loadSettings();
  }, []);

  const toggleSwitch = async (value: boolean) => {
    setIsEnabled(value);
    await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, String(value));
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? colors.background : colors.card },
      ]}
    >
      <View style={[styles.section, { backgroundColor: colors.background }]}>
        <SettingsRow label="Push Notifications">
          <Switch
            trackColor={{ false: "#767577", true: colors.primary }}
            thumbColor={
              Platform.OS === "android" ? colors.primary : colors.background
            }
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </SettingsRow>
      </View>
      <ThemedText style={[styles.description, { color: colors.lightText }]}>
        Enable push notifications to get reminders and summaries of your
        journey.
      </ThemedText>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginTop: 30,
    marginHorizontal: 15,
    borderRadius: 10,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontSize: 16,
  },
  description: {
    fontSize: 13,
    paddingHorizontal: 30,
    marginTop: 10,
    lineHeight: 18,
  },
});

export default NotificationsScreen;
