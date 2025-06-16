import React, { useState, useMemo } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppTheme, useAppTheme } from "../context/ThemeContext";
import { useEntries } from "@/context/EntryContext";
import { EntryCategory, RootStackNavigationProp } from "@/types";
import { useNavigation } from "@react-navigation/native";
import {
  Searchbar,
  Chip,
  List,
  Text,
  ActivityIndicator,
} from "react-native-paper";

type Filter = "All" | EntryCategory;

const FILTERS: Filter[] = ["All", "Travel", "Food", "Work"];

const SearchScreen = () => {
  const { entries, isLoading } = useEntries();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const theme = useAppTheme();
  const navigation = useNavigation<RootStackNavigationProp>();

  const filteredEntries = useMemo(() => {
    let results = entries;

    if (activeFilter !== "All") {
      results = results.filter((entry) => entry.category === activeFilter);
    }

    if (searchQuery.trim()) {
      results = results.filter(
        (entry) =>
          entry.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.content?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return results;
  }, [searchQuery, entries, activeFilter]);

  const styles = stylesheet(theme);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Searchbar
        placeholder="Search"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <View style={styles.filterContainer}>
        {FILTERS.map((filter) => (
          <Chip
            key={filter}
            mode="flat"
            selected={activeFilter === filter}
            onPress={() => setActiveFilter(filter)}
            style={styles.chip}
          >
            {filter}
          </Chip>
        ))}
      </View>

      <Text variant="titleLarge" style={styles.resultsTitle}>
        {searchQuery.trim() || activeFilter !== "All"
          ? "Results"
          : "Recent Entries"}
      </Text>

      <FlatList
        data={filteredEntries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={item.title}
            description={item.date}
            onPress={() =>
              navigation.navigate("ViewEntry", { entryId: item.id })
            }
            left={(props) => (
              <List.Icon
                {...props}
                icon={item.icon || "notebook"}
                color="white"
                style={[
                  styles.listIcon,
                  { backgroundColor: item.iconColor || theme.colors.primary },
                ]}
              />
            )}
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.noResultsContainer}>
            <Text style={{ color: theme.colors.tertiary }}>
              No entries found.
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};
function stylesheet(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 16,
    },
    loadingContainer: { justifyContent: "center", alignItems: "center" },
    searchBar: {
      marginTop: 10,
    },
    filterContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 20,
    },
    chip: {
      minHeight: 32,
    },
    resultsTitle: {
      fontWeight: "bold",
      marginVertical: 20,
    },
    listIcon: {
      borderRadius: 8,
      width: 40,
      height: 40,
      marginLeft: 0,
      marginRight: 16,
    },
    noResultsContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 50,
    },
  });
}
export default SearchScreen;
