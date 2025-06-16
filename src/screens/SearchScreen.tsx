// src/screens/SearchScreen.tsx
import React, { useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useEntries } from "@/context/EntryContext";
import ThemedText from "@/components/ThemedText";
import { EntryCategory } from "@/types";

type Filter = "All" | EntryCategory;

const SearchScreen = () => {
  const { entries, isLoading } = useEntries();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const { colors } = useTheme();

  const filteredEntries = useMemo(() => {
    let results = entries;

    // 1. Filter by category
    if (activeFilter !== "All") {
      results = results.filter((entry) => entry.category === activeFilter);
    }

    // 2. Filter by search query
    if (searchQuery.trim()) {
      results = results.filter(
        (entry) =>
          entry.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.content?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return results;
  }, [searchQuery, entries, activeFilter]);

  const styles = stylesheet(colors);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  const FilterButton = ({ filter }: { filter: Filter }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        activeFilter === filter && styles.activeFilter,
      ]}
      onPress={() => setActiveFilter(filter)}
    >
      <ThemedText
        style={
          activeFilter === filter ? styles.activeFilterText : styles.filterText
        }
      >
        {filter}
      </ThemedText>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={colors.lightText}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search"
          style={styles.searchInput}
          placeholderTextColor={colors.lightText}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filterContainer}>
        <FilterButton filter="All" />
        <FilterButton filter="Travel" />
        <FilterButton filter="Food" />
        <FilterButton filter="Work" />
      </View>

      <ThemedText style={styles.recentTitle}>
        {searchQuery.trim() || activeFilter !== "All"
          ? "Results"
          : "Recent Entries"}
      </ThemedText>

      <FlatList
        data={filteredEntries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.recentItem}>
            <View
              style={[
                styles.recentIcon,
                { backgroundColor: item.iconColor || colors.primary },
              ]}
            >
              <Ionicons
                name={item.icon || "book-outline"}
                size={24}
                color="white"
              />
            </View>
            <View>
              <ThemedText style={styles.recentItemTitle}>
                {item.title}
              </ThemedText>
              <ThemedText style={styles.recentItemDate}>{item.date}</ThemedText>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.noResultsContainer}>
            <ThemedText style={styles.noResultsText}>
              No entries found.
            </ThemedText>
          </View>
        )}
      />
    </SafeAreaView>
  );
};
// Stylesheet needs to be updated with filter button styles
function stylesheet(colors: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 20,
      paddingTop: 10,
    },
    loadingContainer: { justifyContent: "center", alignItems: "center" },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 10,
      paddingHorizontal: 10,
    },
    searchIcon: { marginRight: 10 },
    searchInput: {
      flex: 1,
      paddingVertical: 12,
      fontSize: 16,
      color: colors.text,
    },
    filterContainer: {
      flexDirection: "row",
      justifyContent: "flex-start",
      gap: 10,
      marginTop: 20,
    },
    filterButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      backgroundColor: colors.card,
    },
    activeFilter: { backgroundColor: colors.primary },
    filterText: {},
    activeFilterText: { color: "white" },
    recentTitle: {
      fontSize: 22,
      fontWeight: "bold",
      marginVertical: 20,
      color: colors.text,
    },
    recentItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 15,
    },
    recentIcon: {
      width: 50,
      height: 50,
      borderRadius: 10,
      marginRight: 15,
      justifyContent: "center",
      alignItems: "center",
    },
    recentItemTitle: { fontSize: 16, fontWeight: "500" },
    recentItemDate: { marginTop: 5 },
    noResultsContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 50,
    },
    noResultsText: { fontSize: 16, color: colors.lightText },
  });
}
export default SearchScreen;
