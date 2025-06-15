// src/screens/PastEntriesScreen.tsx
import React, { useState, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar, DateData } from "react-native-calendars";
import Colors from "../constants/Colors";
import { Entry } from "../types";
import TimelineEntryCard, {
  SNAP_INTERVAL,
} from "../components/TimelineEntryCard";
import EntryCard from "../components/EntryCard";
import { useEntries } from "@/context/EntryContext";

const PastEntriesScreen = () => {
  const { entries, isLoading } = useEntries();
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
        acc[entry.date] = { marked: true, dotColor: Colors.primary };
      }
      return acc;
    }, {} as { [key: string]: { marked: boolean; dotColor: string; selected?: boolean; selectedColor?: string } });

    if (marks[selectedDate]) {
      marks[selectedDate].selected = true;
      marks[selectedDate].selectedColor = Colors.primary;
    } else {
      marks[selectedDate] = { selected: true, selectedColor: Colors.primary };
    }

    return marks;
  }, [selectedDate, entries]);

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
        <Text style={[styles.switcherText, isActive && styles.activeText]}>
          {text}
        </Text>
      </TouchableOpacity>
    );
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
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
                backgroundColor: Colors.background,
                calendarBackground: Colors.background,
                textSectionTitleColor: Colors.lightText,
                todayTextColor: Colors.primary,
                dayTextColor: Colors.text,
                textDisabledColor: Colors.border,
                arrowColor: Colors.primary,
                monthTextColor: Colors.text,
                textDayFontWeight: "300",
                textMonthFontWeight: "bold",
                textDayHeaderFontWeight: "300",
                textDayFontSize: 16,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 14,
              }}
            />
            <View style={styles.entriesListContainer}>
              <Text style={styles.entriesListTitle}>
                Entries for {selectedDate}
              </Text>
              {entriesForSelectedDate.length > 0 ? (
                entriesForSelectedDate.map((item: Entry) => (
                  <EntryCard key={item.id} entry={item} />
                ))
              ) : (
                <View style={styles.noEntriesContainer}>
                  <Text style={styles.noEntriesText}>
                    No entries for this day.
                  </Text>
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Past Entries</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    color: Colors.text,
  },
  switcherContainer: {
    flexDirection: "row",
    margin: 20,
    backgroundColor: Colors.card,
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
    backgroundColor: Colors.background,
  },
  switcherText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.lightText,
  },
  activeText: {
    color: Colors.primary,
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
    color: Colors.lightText,
  },
});

export default PastEntriesScreen;
