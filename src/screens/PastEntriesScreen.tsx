// screens/PastEntriesScreen.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "react-native-calendars";
import Colors from "../constants/Colors";

const PastEntriesScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Past Entries</Text>
      <Calendar
        current={"2024-01-05"}
        theme={{
          backgroundColor: Colors.background,
          calendarBackground: Colors.background,
          textSectionTitleColor: Colors.lightText,
          selectedDayBackgroundColor: Colors.primary,
          selectedDayTextColor: "#ffffff",
          todayTextColor: Colors.primary,
          dayTextColor: Colors.text,
          textDisabledColor: Colors.border,
          arrowColor: Colors.primary,
          monthTextColor: Colors.text,
          indicatorColor: "blue",
          textDayFontFamily: "monospace",
          textMonthFontFamily: "monospace",
          textDayHeaderFontFamily: "monospace",
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 14,
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.text,
    padding: 20,
  },
});

export default PastEntriesScreen;
