// src/screens/PastEntriesScreen.tsx
import React, { useState, useMemo, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar, DateData } from "react-native-calendars";
import { useTheme } from "../context/ThemeContext";
import { Entry } from "../types";
import TimelineEntryCard, {
  SNAP_INTERVAL,
} from "../components/TimelineEntryCard";
import EntryCard from "../components/EntryCard";
import { useEntries } from "@/context/EntryContext";
import ThemedText from "@/components/ThemedText";

const PastEntriesScreen = () => {
  const { entries, isLoading } = useEntries();
  const { colors } = useTheme();
  const [activeView, setActiveView] = useState<"calendar" | "timeline">(
    "calendar"
  );

  const [selectedDate, setSelectedDate] = useState<string>(
    entries[0]?.date || new Date().toISOString().split("T")[0]
  );
  const scrollY = useRef(new Animated.Value(0)).current;

  const entriesForSelectedDate = useMemo(() => {
    return entries.filter((entry) => entry.date === selectedDate);
  }, [selectedDate, entries]);

  const markedDates = useMemo(() => {
    const marks: {
      [key: string]: {
        marked?: boolean;
        dotColor?: string;
        selected?: boolean;
        selectedColor?: string;
      };
    } = entries.reduce((acc, entry: Entry) => {
      if (entry.date) {
        acc[entry.date] = { marked: true, dotColor: colors.primary };
      }
      return acc;
    }, {} as { [key: string]: { marked: boolean; dotColor: string; selected?: boolean; selectedColor?: string } });

    if (marks[selectedDate]) {
      marks[selectedDate].selected = true;
      marks[selectedDate].selectedColor = colors.primary;
    } else {
      marks[selectedDate] = { selected: true, selectedColor: colors.primary };
    }

    return marks;
  }, [selectedDate, entries, colors.primary]);

  function SwitcherButton({
    text,
    onPress,
    isActive,
  }: {
    text: string;
    onPress: () => void;
    isActive: boolean;
  }) {
    return (
      <TouchableOpacity
        style={[styles.switcherButton, isActive && styles.activeButton]}
        onPress={onPress}
      >
        <ThemedText
          style={[styles.switcherText, isActive && styles.activeText]}
        >
          {text}
        </ThemedText>
      </TouchableOpacity>
    );
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (activeView === "calendar") {
      return (
        <View style={styles.contentContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Calendar
              current={selectedDate}
              onDayPress={(day: DateData) =>
                setSelectedDate(day.dateString as string)
              }
              markedDates={markedDates}
              theme={{
                backgroundColor: colors.background,
                calendarBackground: colors.background,
                textSectionTitleColor: colors.lightText,
                todayTextColor: colors.primary,
                dayTextColor: colors.text,
                textDisabledColor: colors.border,
                arrowColor: colors.primary,
                monthTextColor: colors.text,
                textDayFontWeight: "300",
                textMonthFontWeight: "bold",
                textDayHeaderFontWeight: "300",
                textDayFontSize: 16,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 14,
              }}
            />
            <View style={styles.entriesListContainer}>
              <ThemedText style={styles.entriesListTitle}>
                Entries for {selectedDate}
              </ThemedText>
              {entriesForSelectedDate.length > 0 ? (
                entriesForSelectedDate.map((item: Entry) => (
                  <EntryCard key={item.id} entry={item} />
                ))
              ) : (
                <View style={styles.noEntriesContainer}>
                  <ThemedText style={styles.noEntriesText}>
                    No entries for this day.
                  </ThemedText>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      );
    }

    return (
      <Animated.FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        snapToInterval={SNAP_INTERVAL}
        contentContainerStyle={{
          alignItems: "center",
        }}
        decelerationRate="fast"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        renderItem={({ item, index }) => {
          return (
            <TimelineEntryCard entry={item} index={index} scrollY={scrollY} />
          );
        }}
      />
    );
  };

  const styles = stylesheet(colors);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Past Entries</ThemedText>
      </View>
      <View style={styles.switcherContainer}>
        <SwitcherButton
          text="Calendar"
          onPress={() => setActiveView("calendar")}
          isActive={activeView === "calendar"}
        />
        <SwitcherButton
          text="Timeline"
          onPress={() => setActiveView("timeline")}
          isActive={activeView === "timeline"}
        />
      </View>
      {renderContent()}
    </SafeAreaView>
  );
};
function stylesheet(colors: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    contentContainer: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 10,
    },
    headerTitle: {
      fontSize: 34,
      fontWeight: "bold",
      color: colors.text,
    },
    switcherContainer: {
      flexDirection: "row",
      margin: 20,
      backgroundColor: colors.card,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#E0E0E0",
    },
    switcherButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
      margin: 3,
    },
    activeButton: {
      backgroundColor: colors.background,
    },
    switcherText: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.lightText,
    },
    activeText: {
      color: colors.primary,
    },
    entriesListContainer: {
      paddingHorizontal: 20,
      marginTop: 20,
      paddingBottom: 20,
    },
    entriesListTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 15,
    },
    noEntriesContainer: {
      height: 100,
      justifyContent: "center",
      alignItems: "center",
    },
    noEntriesText: {
      fontSize: 16,
      color: colors.lightText,
    },
  });
}
export default PastEntriesScreen;
