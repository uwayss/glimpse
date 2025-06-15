// src/screens/SettingsScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { useProfile } from "@/context/ProfileContext";

const SettingsItem = ({
  icon,
  name,
  isNav = true,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  name: string;
  isNav?: boolean;
}) => (
  <TouchableOpacity style={styles.item}>
    <View style={styles.itemLeft}>
      <View style={styles.iconBg}>
        <Ionicons name={icon} size={20} color={Colors.primary} />
      </View>
      <Text style={styles.itemText}>{name}</Text>
    </View>
    {isNav && (
      <Ionicons
        name="chevron-forward-outline"
        size={24}
        color={Colors.lightText}
      />
    )}
  </TouchableOpacity>
);

const SettingsScreen = () => {
  const { profile, isLoading } = useProfile();

  if (isLoading || !profile) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.userItem}>
              {profile.avatarUri ? (
                <Image
                  source={{ uri: profile.avatarUri }}
                  style={styles.userAvatar}
                />
              ) : (
                <View style={[styles.userAvatar, styles.avatarPlaceholder]}>
                  <Ionicons
                    name="person-outline"
                    size={24}
                    color={Colors.text}
                  />
                </View>
              )}
              <View>
                <Text style={styles.userName}>{profile.name}</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.divider} />
            <SettingsItem icon="person-outline" name="Manage Account" />
            <View style={styles.divider} />
            <SettingsItem icon="shield-checkmark-outline" name="Privacy" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.card}>
            <SettingsItem icon="notifications-outline" name="Notifications" />
            <View style={styles.divider} />
            <SettingsItem icon="sunny-outline" name="Display" />
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F7" },
  section: { marginBottom: 20, paddingHorizontal: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.lightText,
    marginLeft: 16,
    marginBottom: 8,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    overflow: "hidden",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.background,
  },
  itemLeft: { flexDirection: "row", alignItems: "center" },
  iconBg: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E8E8FF",
  },
  itemText: { marginLeft: 15, fontSize: 16 },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: Colors.background,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  avatarPlaceholder: {
    backgroundColor: Colors.card,
    justifyContent: "center",
    alignItems: "center",
  },
  userName: { fontSize: 18, fontWeight: "500" },
  userEmail: { color: Colors.lightText, fontSize: 13 },
  divider: { height: 1, backgroundColor: Colors.border, marginLeft: 60 },
  logoutButton: {
    margin: 20,
    padding: 15,
    alignItems: "center",
    backgroundColor: Colors.background,
    borderRadius: 10,
  },
  logoutText: { color: "red", fontSize: 16 },
});

export default SettingsScreen;
