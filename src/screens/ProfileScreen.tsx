import React, { useMemo } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackNavigationProp } from "@/types";
import { useEntries } from "@/context/EntryContext";
import { useProfile } from "@/context/ProfileContext";
import { AppTheme, useAppTheme } from "@/context/ThemeContext";
import {
  ActivityIndicator,
  Appbar,
  Avatar,
  Card,
  Text,
} from "react-native-paper";

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

  if (Object.keys(dayCounts).length === 0) return "N/A";

  const mostActiveDayIndex = Object.keys(dayCounts).reduce(
    (a, b) => (dayCounts[parseInt(a, 10)] > dayCounts[parseInt(b, 10)] ? a : b),
    Object.keys(dayCounts)[0]
  );
  return dayNames[parseInt(mostActiveDayIndex, 10)];
};

const StatCard = ({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) => {
  const styles = stylesheet(useAppTheme());
  return (
    <Card style={styles.statBox}>
      <Card.Content>
        <Text variant="headlineMedium" style={styles.statValue}>
          {value}
        </Text>
        <Text variant="labelLarge" style={styles.statLabel}>
          {label}
        </Text>
      </Card.Content>
    </Card>
  );
};

const ProfileScreen = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { entries, isLoading: isLoadingEntries } = useEntries();
  const { profile, isLoading: isLoadingProfile } = useProfile();
  const theme = useAppTheme();

  const stats = useMemo(() => {
    const allDates = entries.map((e) => e.date).filter((d): d is string => !!d);
    const uniqueDaysCount = new Set(allDates).size;
    const totalEntries = entries.length;
    const avgEntriesPerDay =
      uniqueDaysCount > 0 ? totalEntries / uniqueDaysCount : 0;

    return {
      totalEntries: totalEntries,
      streak: getStreak(allDates),
      mostActiveDay: getMostActiveDay(allDates),
      uniqueDays: uniqueDaysCount,
      avgEntriesPerDay,
    };
  }, [entries]);

  const isLoading = isLoadingEntries || isLoadingProfile;
  const styles = stylesheet(theme);

  if (isLoading || !profile) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
        <Appbar.Content title="Profile" />
        <Appbar.Action
          icon="pencil-outline"
          onPress={() => navigation.navigate("EditProfile")}
        />
        <Appbar.Action
          icon="cog-outline"
          onPress={() => navigation.navigate("Settings")}
        />
      </Appbar.Header>
      <ScrollView>
        <View style={styles.profileInfo}>
          {profile.avatarUri ? (
            <Avatar.Image size={120} source={{ uri: profile.avatarUri }} />
          ) : (
            <Avatar.Icon size={120} icon="account" />
          )}
          <Text variant="headlineMedium" style={styles.name}>
            {profile.name}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <StatCard value={stats.totalEntries} label="Entries" />
          <StatCard value={stats.streak} label="Streak" />
          <StatCard value={stats.uniqueDays} label="Days" />
        </View>

        <View style={styles.statsSection}>
          <Text variant="titleLarge" style={styles.statsTitle}>
            More Stats
          </Text>
          <View style={styles.statsGrid}>
            <Card style={styles.largeStatBox}>
              <Card.Content>
                <Text variant="labelMedium">Avg entries / day</Text>
                <Text variant="headlineSmall" style={styles.largeStatValue}>
                  {stats.avgEntriesPerDay.toFixed(2)}
                </Text>
              </Card.Content>
            </Card>
            <Card style={styles.largeStatBox}>
              <Card.Content>
                <Text variant="labelMedium">Most active day</Text>
                <Text variant="headlineSmall" style={styles.largeStatValue}>
                  {stats.mostActiveDay}
                </Text>
              </Card.Content>
            </Card>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
function stylesheet(theme: AppTheme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    loadingContainer: { justifyContent: "center", alignItems: "center" },
    profileInfo: { alignItems: "center", marginVertical: 20 },
    name: { marginTop: 20, fontWeight: "bold" },
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingHorizontal: 10,
    },
    statBox: {
      alignItems: "center",
      width: "31%",
    },
    statValue: { textAlign: "center", fontWeight: "bold" },
    statLabel: {
      textAlign: "center",
      marginTop: 5,
      color: theme.colors.tertiary,
    },
    statsSection: { padding: 20, marginTop: 10 },
    statsTitle: { fontWeight: "bold", marginBottom: 15 },
    statsGrid: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 10,
    },
    largeStatBox: {
      flex: 1,
      height: 120,
      justifyContent: "center",
    },
    largeStatValue: { fontWeight: "bold", marginTop: 10 },
  });
}
export default ProfileScreen;
