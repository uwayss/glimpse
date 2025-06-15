// src/screens/GlimpseScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import EntryCard from "../components/EntryCard";
import { DayEntries, RootStackNavigationProp } from "../types"; // Import the helper type

// Updated dummy data with icons
const DUMMY_ENTRIES: DayEntries[] = [
  {
    title: "Today",
    data: [
      {
        id: "1",
        time: "10:00 AM",
        title: "Morning walk",
        content:
          "Enjoyed a peaceful walk in the park, feeling refreshed and energized.",
        icon: "walk-outline",
        iconColor: "#AEEA7C",
      },
      {
        id: "2",
        time: "1:00 PM",
        title: "Lunch with friends",
        content:
          "Had a great time catching up with friends over lunch at a cozy cafe.",
        icon: "restaurant-outline",
        iconColor: "#FFD166",
      },
      {
        id: "3",
        time: "6:00 PM",
        title: "Evening yoga",
        content:
          "Relaxing yoga session to unwind after a busy day, feeling calm and centered.",
        icon: "body-outline",
        iconColor: "#89CFF0",
      },
    ],
  },
  {
    title: "Yesterday",
    data: [
      {
        id: "4",
        time: "9:00 AM",
        title: "Coffee at home",
        content:
          "Started the day with a quiet moment enjoying a cup of coffee at home.",
        icon: "cafe-outline",
        iconColor: "#C9A98F",
      },
      {
        id: "5",
        time: "2:00 PM",
        title: "Work meeting",
        content:
          "Productive meeting with the team to discuss project updates and next steps.",
        icon: "people-outline",
        iconColor: "#B19CD9",
      },
      {
        id: "6",
        time: "7:00 PM",
        title: "Dinner with family",
        content:
          "Spent quality time with family over a delicious home-cooked dinner.",
        icon: "home-outline",
        iconColor: "#FFB3BA",
      },
    ],
  },
];

const GlimpseScreen = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Glimpse</Text>
        <TouchableOpacity onPress={() => navigation.navigate("NewEntry")}>
          <Ionicons name="add" size={32} color={Colors.text} />
        </TouchableOpacity>
      </View>
      <SectionList
        sections={DUMMY_ENTRIES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EntryCard entry={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

// Styles remain the same
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
  },
});

export default GlimpseScreen;
