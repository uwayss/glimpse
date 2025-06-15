// src/screens/GlimpseScreen.tsx
import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import EntryCard from "../components/EntryCard";
import { DayEntries, RootStackNavigationProp, Entry } from "../types";
import { useEntries } from "@/context/EntryContext";

// A helper function to group entries by date
const groupEntriesByDate = (entries: Entry[]): DayEntries[] => {
  if (!entries.length) return [];

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const todayStr = today.toISOString().split("T")[0];
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const grouped = entries.reduce((acc, entry) => {
    const entryDate = entry.date || "Unknown";
    // Initialize the array if it doesn't exist
    if (!acc[entryDate]) {
      acc[entryDate] = [];
    }
    acc[entryDate].push(entry);
    return acc;
  }, {} as Record<string, Entry[]>);

  // Convert the grouped object into an array for SectionList
  return Object.keys(grouped)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime()) // Sort by most recent date first
    .map((date) => {
      let title = date; // Default title is the date string
      if (date === todayStr) title = "Today";
      if (date === yesterdayStr) title = "Yesterday";
      return { title, data: grouped[date] };
    });
};

const GlimpseScreen = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  // Get live data and the loading state from our context
  const { entries, isLoading } = useEntries();

  // Memoize the grouped data so it only recalculates when entries change
  const sectionedData = useMemo(() => groupEntriesByDate(entries), [entries]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      );
    }

    if (sectionedData.length > 0) {
      return (
        <SectionList
          sections={sectionedData}
          keyExtractor={(item, index) => item.id + index}
          renderItem={({ item }) => <EntryCard entry={item} />}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No entries yet.</Text>
        <Text style={styles.emptySubText}>
          Tap the &apos;+&apos; to add your first glimpse!
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Glimpse</Text>
        <TouchableOpacity onPress={() => navigation.navigate("NewEntry")}>
          <Ionicons name="add" size={32} color={Colors.text} />
        </TouchableOpacity>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "bold",
    color: Colors.text,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.text,
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: Colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
  },
  emptySubText: {
    fontSize: 16,
    color: Colors.lightText,
    marginTop: 10,
  },
});

export default GlimpseScreen;
