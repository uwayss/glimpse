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

const SearchScreen = () => {
  const { entries, isLoading } = useEntries();
  const [searchQuery, setSearchQuery] = useState("");
  const { colors } = useTheme();

  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) {
      // If search is empty, show the 10 most recent entries
      return entries.slice(0, 10);
    }
    // Otherwise, filter by title and content
    return entries.filter(
      (entry) =>
        entry.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, entries]);

  const styles = stylesheet(colors);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

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

      <ThemedText style={styles.recentTitle}>
        {searchQuery.trim() ? "Search Results" : "Recent Entries"}
      </ThemedText>

      <FlatList
        data={filteredEntries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.recentItem}>
            <View
              style={[styles.recentIcon, { backgroundColor: item.iconColor }]}
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

function stylesheet(colors: any) {
  const styles = StyleSheet.create({
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
    recentTitle: {
      fontSize: 22,
      fontWeight: "bold",
      marginVertical: 20,
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
    recentItemDate: { color: colors.lightText, marginTop: 5 },
    noResultsContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 50,
    },
    noResultsText: {
      fontSize: 16,
      color: colors.lightText,
    },
  });
  return styles;
}

export default SearchScreen;
