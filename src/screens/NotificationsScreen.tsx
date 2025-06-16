import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppTheme } from "@/context/ThemeContext";
import { List, Switch, Text } from "react-native-paper";

const NOTIFICATIONS_ENABLED_KEY = "@glimpse_notifications_enabled";

const NotificationsScreen = () => {
  const theme = useAppTheme();
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
        { backgroundColor: theme.colors.surfaceVariant },
      ]}
    >
      <List.Section style={styles.section}>
        <List.Item
          title="Push Notifications"
          style={{ backgroundColor: theme.colors.surface }}
          right={() => (
            <Switch value={isEnabled} onValueChange={toggleSwitch} />
          )}
        />
      </List.Section>
      <Text
        variant="bodySmall"
        style={[styles.description, { color: theme.colors.tertiary }]}
      >
        Enable push notifications to get reminders and summaries of your
        journey.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginTop: 30,
  },
  description: {
    paddingHorizontal: 30,
    marginTop: 10,
    lineHeight: 18,
  },
});

export default NotificationsScreen;
