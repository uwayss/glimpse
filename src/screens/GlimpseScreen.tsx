import React, { useMemo } from "react";
import { View, StyleSheet, SectionList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AppTheme, useAppTheme } from "../context/ThemeContext";
import EntryCard from "../components/EntryCard";
import { DayEntries, RootStackNavigationProp, Entry } from "../types";
import { useEntries } from "@/context/EntryContext";
import { Appbar, Text, FAB, ActivityIndicator } from "react-native-paper";

const groupEntriesByDate = (entries: Entry[]): DayEntries[] => {
  if (!entries.length) return [];

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const todayStr = today.toISOString().split("T")[0];
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const grouped = entries.reduce((acc, entry) => {
    const entryDate = entry.date || "Unknown";
    if (!acc[entryDate]) {
      acc[entryDate] = [];
    }
    acc[entryDate].push(entry);
    return acc;
  }, {} as Record<string, Entry[]>);

  return Object.keys(grouped)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    .map((date) => {
      let title = date;
      if (date === todayStr) title = "Today";
      if (date === yesterdayStr) title = "Yesterday";
      return { title, data: grouped[date] };
    });
};

const GlimpseScreen = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { entries, isLoading } = useEntries();
  const theme = useAppTheme();
  const sectionedData = useMemo(() => groupEntriesByDate(entries), [entries]);

  const styles = stylesheet(theme);

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" />
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
            <Text variant="headlineSmall" style={styles.sectionHeader}>
              {title}
            </Text>
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text variant="titleLarge" style={styles.emptyText}>
          No entries yet.
        </Text>
        <Text
          variant="bodyMedium"
          style={[styles.emptySubText, { color: theme.colors.tertiary }]}
        >
          Tap the + to add your first glimpse!
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Appbar.Header
        mode="large"
        style={{ backgroundColor: theme.colors.background }}
      >
        <Appbar.Content title="Glimpse" />
      </Appbar.Header>
      {renderContent()}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate("NewEntry")}
      />
    </View>
  );
};

function stylesheet(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    listContainer: {
      paddingHorizontal: 16,
      paddingBottom: 80,
    },
    sectionHeader: {
      fontWeight: "bold",
      marginTop: 20,
      marginBottom: 10,
      paddingHorizontal: 4,
      backgroundColor: theme.colors.background,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyText: {
      fontWeight: "bold",
    },
    emptySubText: {
      marginTop: 10,
    },
    fab: {
      position: "absolute",
      margin: 16,
      right: 0,
      bottom: 0,
    },
  });
}

export default GlimpseScreen;
