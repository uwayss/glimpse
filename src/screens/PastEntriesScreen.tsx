// src/screens/PastEntriesScreen.tsx
import React, { useState, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
  Dimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar, DateData } from "react-native-calendars";
import Colors from "../constants/Colors";
import { DayEntries, Entry } from "../types";
import TimelineEntryCard, {
  ITEM_HEIGHT,
} from "../components/TimelineEntryCard";
import EntryCard from "../components/EntryCard";

// Dummy data remains the same
const DUMMY_ENTRIES: DayEntries[] = [
  {
    title: "2024-01-05",
    data: [
      {
        id: "1",
        date: "2024-01-05",
        time: "10:00 AM",
        title: "Morning walk",
        content:
          "Enjoyed a peaceful walk in the park, feeling refreshed and energized.",
        icon: "walk-outline",
        iconColor: "#AEEA7C",
      },
      {
        id: "2",
        date: "2024-01-05",
        time: "1:00 PM",
        title: "Lunch with friends",
        content:
          "Had a great time catching up with friends over lunch at a cozy cafe.",
        icon: "restaurant-outline",
        iconColor: "#FFD166",
      },
    ],
  },
  {
    title: "2024-01-04",
    data: [
      {
        id: "4",
        date: "2024-01-04",
        time: "9:00 AM",
        title: "Coffee at home",
        content:
          "Started the day with a quiet moment enjoying a cup of coffee at home.",
        icon: "cafe-outline",
        iconColor: "#C9A98F",
      },
      {
        id: "5",
        date: "2024-01-04",
        time: "2:00 PM",
        title: "Work meeting",
        content:
          "Productive meeting with the team to discuss project updates and next steps.",
        icon: "people-outline",
        iconColor: "#B19CD9",
      },
    ],
  },
];

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const FLATTENED_DATA = DUMMY_ENTRIES.flatMap((day) => day.data);

// --- POINT 1: SPACER VIEW for correct centering ---
const SPACER_ITEM_SIZE = (SCREEN_HEIGHT - ITEM_HEIGHT) / 2;

// Add spacer items to the beginning and end of our data array
const TIMELINE_WITH_SPACERS = [
  { id: "spacer-start" }, // Start spacer
  ...FLATTENED_DATA,
  { id: "spacer-end" }, // End spacer
];

const PastEntriesScreen = () => {
  const [activeView, setActiveView] = useState<"calendar" | "timeline">(
    "calendar"
  );
  const [selectedDate, setSelectedDate] = useState("2024-01-05");
  const scrollY = useRef(new Animated.Value(0)).current;

  const entriesForSelectedDate = useMemo(() => {
    return FLATTENED_DATA.filter((entry) => entry.date === selectedDate);
  }, [selectedDate]);

  const markedDates = useMemo(() => {
    return {
      [selectedDate]: { selected: true, selectedColor: Colors.primary },
    };
  }, [selectedDate]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Past Entries</Text>
      </View>

      <View style={styles.switcherContainer}>
        <TouchableOpacity
          style={[
            styles.switcherButton,
            activeView === "calendar" && styles.activeButton,
          ]}
          onPress={() => setActiveView("calendar")}
        >
          <Text
            style={[
              styles.switcherText,
              activeView === "calendar" && styles.activeText,
            ]}
          >
            Calendar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.switcherButton,
            activeView === "timeline" && styles.activeButton,
          ]}
          onPress={() => setActiveView("timeline")}
        >
          <Text
            style={[
              styles.switcherText,
              activeView === "timeline" && styles.activeText,
            ]}
          >
            Timeline
          </Text>
        </TouchableOpacity>
      </View>

      {activeView === "calendar" ? (
        // --- POINT 2: Your updated scrollable layout for Calendar view ---
        <View style={styles.contentContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Calendar
              current={selectedDate}
              onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
              markedDates={markedDates}
              theme={calendarTheme}
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
      ) : (
        <Animated.FlatList
          data={TIMELINE_WITH_SPACERS} // Use the data with spacers
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          renderItem={({ item, index }) => {
            // Render the spacers as empty views and the cards normally
            if (!("title" in item)) {
              return <View style={{ height: SPACER_ITEM_SIZE }} />;
            }
            // We subtract 1 from the index because of the start spacer
            return (
              <TimelineEntryCard
                entry={item}
                index={index - 1}
                scrollY={scrollY}
              />
            );
          }}
        />
      )}
    </SafeAreaView>
  );
};

const calendarTheme = {
  // ... (calendar theme styles remain the same)
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    flex: 1,
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
  },
  activeButton: {
    backgroundColor: Colors.background,
    margin: 3,
  },
  // --- POINT 3: Fixed switcher text styles ---
  switcherText: {
    fontSize: 16,
    fontWeight: "500", // Use a consistent font weight for both states
    color: Colors.lightText,
  },
  activeText: {
    color: Colors.primary, // Only the color changes
  },
  // Timeline styles
  // No longer need contentContainerStyle for the FlatList

  // Styles for the list below the calendar
  entriesListContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    paddingBottom: 20, // Add some padding at the bottom
  },
  entriesListTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  noEntriesContainer: {
    height: 100, // Give it a fixed height
    justifyContent: "center",
    alignItems: "center",
  },
  noEntriesText: {
    fontSize: 16,
    color: Colors.lightText,
  },
});

export default PastEntriesScreen;
