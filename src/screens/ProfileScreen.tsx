// src/screens/ProfileScreen.tsx
import React, { useMemo } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { RootStackNavigationProp } from "@/types";
import { useEntries } from "@/context/EntryContext";
import { useProfile } from "@/context/ProfileContext";
import ThemedText from "@/components/ThemedText";

// --- NO CHANGES TO HELPER FUNCTIONS ---
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
}) => {
  const { colors } = useTheme();
  const styles = stylesheet(colors);
  return (
    <View style={styles.statBox}>
      <ThemedText style={styles.statValue}>{value}</ThemedText>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
    </View>
  );
};

const ProfileScreen = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { entries, isLoading: isLoadingEntries } = useEntries();
  const { profile, isLoading: isLoadingProfile } = useProfile();
  const { colors } = useTheme();

  const stats = useMemo(() => {
    const allDates = entries.map((e) => e.date).filter((d): d is string => !!d);
    const uniqueDaysCount = new Set(allDates).size;
    return {
      totalEntries: entries.length,
      streak: getStreak(allDates),
      mostActiveDay: getMostActiveDay(allDates),
      uniqueDays: uniqueDaysCount,
    };
  }, [entries]);

  const isLoading = isLoadingEntries || isLoadingProfile;

  const styles = stylesheet(colors);
  if (isLoading || !profile) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>Profile</ThemedText>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              onPress={() => navigation.navigate("EditProfile")}
              style={styles.headerButton}
            >
              <Ionicons name="create-outline" size={26} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("Settings")}
              style={styles.headerButton}
            >
              <Ionicons name="settings-outline" size={26} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.profileInfo}>
          {profile.avatarUri ? (
            <Image
              source={{ uri: profile.avatarUri }}
              style={styles.avatarImage}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person-outline" size={60} color={colors.text} />
            </View>
          )}
          <ThemedText style={styles.name}>{profile.name}</ThemedText>
        </View>

        <View style={styles.statsRow}>
          <StatBox value={stats.totalEntries} label="Entries" />
          <StatBox value={stats.streak} label="Streak" />
          <StatBox value={stats.uniqueDays} label="Days" />
        </View>

        <View style={styles.statsSection}>
          <ThemedText style={styles.statsTitle}>Stats</ThemedText>
          <View style={styles.statsGrid}>
            <View style={styles.largeStatBox}>
              <ThemedText style={styles.largeStatLabel}>
                Avg entries / day
              </ThemedText>
              <ThemedText style={styles.largeStatValue}>
                {stats.totalEntries / stats.streak}
              </ThemedText>
            </View>
            <View style={styles.largeStatBox}>
              <ThemedText style={styles.largeStatLabel}>
                Most active day
              </ThemedText>
              <ThemedText style={styles.largeStatValue}>
                {stats.mostActiveDay}
              </ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
function stylesheet(colors: any) {
  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    loadingContainer: { justifyContent: "center", alignItems: "center" },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 10,
      marginTop: 10,
    },
    headerTitle: { fontSize: 34, fontWeight: "bold" },
    headerButtons: {
      flexDirection: "row",
    },
    headerButton: {
      marginLeft: 20,
    },
    profileInfo: { alignItems: "center", marginTop: 20 },
    avatarImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      marginBottom: 20,
    },
    avatarPlaceholder: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.card,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
    },
    name: { fontSize: 28, fontWeight: "bold" },
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: 30,
      paddingHorizontal: 20,
    },
    statBox: {
      alignItems: "center",
      backgroundColor: colors.card,
      paddingVertical: 15,
      borderRadius: 10,
      width: "30%",
    },
    statValue: { fontSize: 22, fontWeight: "bold" },
    statLabel: { fontSize: 14, color: colors.lightText, marginTop: 5 },
    statsSection: { padding: 20, marginTop: 20 },
    statsTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
    statsGrid: { flexDirection: "row", justifyContent: "space-between" },
    largeStatBox: {
      backgroundColor: colors.card,
      padding: 20,
      borderRadius: 15,
      width: "48%",
      alignItems: "center",
      height: 120,
      justifyContent: "center",
    },
    largeStatLabel: {
      fontSize: 14,
      color: colors.lightText,
      textAlign: "center",
    },
    largeStatValue: { fontSize: 28, fontWeight: "bold", marginTop: 10 },
  });
  return styles;
}
export default ProfileScreen;
