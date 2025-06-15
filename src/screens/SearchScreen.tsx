// src/screens/SearchScreen.tsx
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { useEntries } from "@/context/EntryContext";

const SearchScreen = () => {
  const { entries, isLoading } = useEntries();
  const [searchQuery, setSearchQuery] = useState("");

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

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={Colors.lightText}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search"
          style={styles.searchInput}
          placeholderTextColor={Colors.lightText}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <Text style={styles.recentTitle}>
        {searchQuery.trim() ? "Search Results" : "Recent Entries"}
      </Text>

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
              <Text style={styles.recentItemTitle}>{item.title}</Text>
              <Text style={styles.recentItemDate}>{item.date}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>No entries found.</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  loadingContainer: { justifyContent: "center", alignItems: "center" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  searchIcon: { marginRight: 10 },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
  },
  recentTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 20,
  },
  recentItem: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  recentIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  recentItemTitle: { fontSize: 16, fontWeight: "500" },
  recentItemDate: { color: Colors.lightText, marginTop: 5 },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  noResultsText: {
    fontSize: 16,
    color: Colors.lightText,
  },
});

export default SearchScreen;
