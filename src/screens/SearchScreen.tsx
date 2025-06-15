// src/screens/SearchScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { SearchResult } from "../types";

const RECENT_SEARCHES: SearchResult[] = [
  {
    id: "1",
    title: "New Year's Eve Celebration",
    date: "2024-01-01",
    icon: "sparkles-outline",
    iconColor: "#FFD700",
  },
  {
    id: "2",
    title: "Christmas Dinner",
    date: "2023-12-25",
    icon: "snow-outline",
    iconColor: "#ADD8E6",
  },
  {
    id: "3",
    title: "Weekend Getaway",
    date: "2023-12-15",
    icon: "airplane-outline",
    iconColor: "#87CEEB",
  },
  {
    id: "4",
    title: "Thanksgiving Feast",
    date: "2023-11-28",
    icon: "leaf-outline",
    iconColor: "#DEB887",
  },
];

const SearchScreen = () => {
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
        />
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity style={[styles.filterButton, styles.activeFilter]}>
          <Text style={styles.activeFilterText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Travel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Food</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Work</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.recentTitle}>Recent</Text>

      <FlatList
        data={RECENT_SEARCHES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.recentItem}>
            <View
              style={[styles.recentIcon, { backgroundColor: item.iconColor }]}
            >
              <Ionicons name={item.icon} size={24} color="white" />
            </View>
            <View>
              <Text style={styles.recentItemTitle}>{item.title}</Text>
              <Text style={styles.recentItemDate}>{item.date}</Text>
            </View>
          </TouchableOpacity>
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
  filterContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 10,
    marginVertical: 20,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: Colors.card,
  },
  activeFilter: { backgroundColor: Colors.primary },
  filterText: { color: Colors.text },
  activeFilterText: { color: "white" },
  recentTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
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
});

export default SearchScreen;
