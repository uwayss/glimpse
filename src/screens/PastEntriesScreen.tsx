import React, { useState, useMemo, useRef } from "react";
import { View, StyleSheet, Animated, ScrollView } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { AppTheme, useAppTheme } from "../context/ThemeContext";
import { Entry } from "../types";
import TimelineEntryCard, {
  SNAP_INTERVAL,
} from "../components/TimelineEntryCard";
import EntryCard from "../components/EntryCard";
import { useEntries } from "@/context/EntryContext";
import {
  Appbar,
  SegmentedButtons,
  Text,
  ActivityIndicator,
} from "react-native-paper";

const PastEntriesScreen = () => {
  const { entries, isLoading } = useEntries();
  const theme = useAppTheme();
  const [activeView, setActiveView] = useState<"calendar" | "timeline">(
    "calendar"
  );

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
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
        activeOpacity?: number;
      };
    } = entries.reduce((acc, entry: Entry) => {
      if (entry.date) {
        acc[entry.date] = {
          marked: true,
          dotColor: theme.colors.primary,
        };
      }
      return acc;
    }, {} as { [key: string]: { marked?: boolean; dotColor?: string } });

    if (marks[selectedDate]) {
      marks[selectedDate].selected = true;
    } else {
      marks[selectedDate] = { selected: true };
    }
    marks[selectedDate].selectedColor = theme.colors.primary;

    return marks;
  }, [selectedDate, entries, theme.colors.primary]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    if (activeView === "calendar") {
      return (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Calendar
            current={selectedDate}
            onDayPress={(day: DateData) =>
              setSelectedDate(day.dateString as string)
            }
            markedDates={markedDates}
            theme={{
              backgroundColor: theme.colors.background,
              calendarBackground: theme.colors.background,
              textSectionTitleColor: theme.colors.tertiary,
              todayTextColor: theme.colors.primary,
              dayTextColor: theme.colors.onBackground,
              textDisabledColor: theme.colors.outline,
              arrowColor: theme.colors.primary,
              monthTextColor: theme.colors.onBackground,
              textDayFontWeight: "300",
              textMonthFontWeight: "bold",
              textDayHeaderFontWeight: "300",
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 14,
            }}
          />
          <View style={styles.entriesListContainer}>
            <Text variant="titleLarge" style={styles.entriesListTitle}>
              Entries for {selectedDate}
            </Text>
            {entriesForSelectedDate.length > 0 ? (
              entriesForSelectedDate.map((item: Entry) => (
                <EntryCard key={item.id} entry={item} />
              ))
            ) : (
              <View style={styles.noEntriesContainer}>
                <Text style={{ color: theme.colors.tertiary }}>
                  No entries for this day.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      );
    }

    return (
      <Animated.FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        snapToInterval={SNAP_INTERVAL}
        contentContainerStyle={{ alignItems: "center", paddingTop: 10 }}
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

  const styles = stylesheet(theme);

  return (
    <View style={styles.container}>
      <Appbar.Header
        mode="medium"
        style={{ backgroundColor: theme.colors.background }}
      >
        <Appbar.Content title="Past Entries" />
      </Appbar.Header>
      <View style={styles.switcherContainer}>
        <SegmentedButtons
          value={activeView}
          onValueChange={setActiveView}
          buttons={[
            { value: "calendar", label: "Calendar" },
            { value: "timeline", label: "Timeline" },
          ]}
        />
      </View>
      <View style={styles.contentContainer}>{renderContent()}</View>
    </View>
  );
};
function stylesheet(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    switcherContainer: {
      paddingHorizontal: 20,
      paddingBottom: 10,
    },
    entriesListContainer: {
      paddingHorizontal: 20,
      marginTop: 20,
      paddingBottom: 20,
    },
    entriesListTitle: {
      fontWeight: "bold",
      marginBottom: 15,
    },
    noEntriesContainer: {
      height: 100,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: theme.roundness,
    },
  });
}
export default PastEntriesScreen;
