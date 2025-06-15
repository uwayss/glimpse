// src/screens/ProfileScreen.tsx
import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { RootStackNavigationProp } from "@/types";
import { useEntries } from "@/context/EntryContext";
import { useProfile } from "@/context/ProfileContext";
// --- HELPER FUNCTIONS FOR STATS ---
const getStreak = (dates: string[]): number => {
  if (dates.length === 0) return 0;
  const uniqueDates = [...new Set(dates)].sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  let currentStreak = 0;
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (
    uniqueDates.some((d) => d === today.toISOString().split("T")[0]) ||
    uniqueDates.some((d) => d === yesterday.toISOString().split("T")[0])
  ) {
    currentStreak = 1;
    let lastDate = new Date(uniqueDates[0]);
    for (let i = 1; i < uniqueDates.length; i++) {
      const currentDate = new Date(uniqueDates[i]);
      const diffTime = lastDate.getTime() - currentDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak++;
        lastDate = currentDate;
      } else {
        break;
      }
    }
  }

  return currentStreak;
};

const getMostActiveDay = (dates: string[]): string => {
  if (dates.length === 0) return "N/A";
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayCounts = dates.reduce((acc, date) => {
    const dayIndex = new Date(date).getDay();
    acc[dayIndex] = (acc[dayIndex] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const mostActiveDayIndex = Object.keys(dayCounts).reduce(
    (a, b) => (dayCounts[parseInt(a, 10)] > dayCounts[parseInt(b, 10)] ? a : b),
    Object.keys(dayCounts)[0]
  );
  return dayNames[parseInt(mostActiveDayIndex, 10)];
};

const StatBox = ({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) => (
  <View style={styles.statBox}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const ProfileScreen = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { entries, isLoading: isLoadingEntries } = useEntries();
  const { profile, isLoading: isLoadingProfile } = useProfile();

  const stats = useMemo(() => {
    const allDates = entries.map((e) => e.date).filter((d): d is string => !!d);
    return {
      totalEntries: entries.length,
      streak: getStreak(allDates),
      mostActiveDay: getMostActiveDay(allDates),
    };
  }, [entries]);

  const isLoading = isLoadingEntries || isLoadingProfile;

  if (isLoading || !profile) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <Ionicons name="settings-outline" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.profileInfo}>
        <View style={styles.avatar}>
          <Ionicons name="person-outline" size={60} color={Colors.text} />
        </View>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.username}>{profile.username}</Text>
        <Text style={styles.joinDate}>{profile.joinDate}</Text>
      </View>

      <View style={styles.statsRow}>
        <StatBox value={stats.totalEntries} label="Entries" />
        <StatBox value={stats.streak} label="Streak" />
        <StatBox value={entries.length > 0 ? "🚀" : "0"} label="Days" />
      </View>

      <View style={styles.statsSection}>
        <Text style={styles.statsTitle}>Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.largeStatBox}>
            <Text style={styles.largeStatLabel}>Avg entries / day</Text>
            <Text style={styles.largeStatValue}>{stats.totalEntries}</Text>
          </View>
          <View style={styles.largeStatBox}>
            <Text style={styles.largeStatLabel}>Most active day</Text>
            <Text style={styles.largeStatValue}>{stats.mostActiveDay}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loadingContainer: { justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  headerTitle: { fontSize: 34, fontWeight: "bold" },
  profileInfo: { alignItems: "center", marginTop: 20 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.card,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  name: { fontSize: 24, fontWeight: "bold" },
  username: { fontSize: 16, color: Colors.lightText },
  joinDate: { fontSize: 14, color: Colors.lightText, marginTop: 5 },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 30,
    paddingHorizontal: 20,
  },
  statBox: {
    alignItems: "center",
    backgroundColor: Colors.card,
    paddingVertical: 15,
    borderRadius: 10,
    width: "30%",
  },
  statValue: { fontSize: 22, fontWeight: "bold" },
  statLabel: { fontSize: 14, color: Colors.lightText, marginTop: 5 },
  statsSection: { padding: 20, marginTop: 20 },
  statsTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  statsGrid: { flexDirection: "row", justifyContent: "space-between" },
  largeStatBox: {
    backgroundColor: Colors.card,
    padding: 20,
    borderRadius: 15,
    width: "48%",
    alignItems: "center",
    height: 120,
    justifyContent: "center",
  },
  largeStatLabel: {
    fontSize: 14,
    color: Colors.lightText,
    textAlign: "center",
  },
  largeStatValue: { fontSize: 28, fontWeight: "bold", marginTop: 10 },
});

export default ProfileScreen;
