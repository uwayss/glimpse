// src/screens/ProfileScreen.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { RootStackNavigationProp } from "@/types";

const StatBox = ({ value, label }: { value: string; label: string }) => (
  <View style={styles.statBox}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const ProfileScreen = () => {
  const navigation = useNavigation<RootStackNavigationProp>();

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
        <Text style={styles.name}>Ethan Carter</Text>
        <Text style={styles.username}>@ethan.carter</Text>
        <Text style={styles.joinDate}>Joined 2023</Text>
      </View>

      <View style={styles.statsRow}>
        <StatBox value="123" label="Entries" />
        <StatBox value="45" label="Streak" />
        <StatBox value="67" label="Days" />
      </View>

      <View style={styles.statsSection}>
        <Text style={styles.statsTitle}>Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.largeStatBox}>
            <Text style={styles.largeStatLabel}>Average entries per day</Text>
            <Text style={styles.largeStatValue}>2.3</Text>
          </View>
          <View style={styles.largeStatBox}>
            <Text style={styles.largeStatLabel}>Most active day</Text>
            <Text style={styles.largeStatValue}>Monday</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
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
