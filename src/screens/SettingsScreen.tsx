// src/screens/SettingsScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useProfile } from "@/context/ProfileContext";
import { RootStackNavigationProp } from "@/types";
import { useTheme } from "@/context/ThemeContext"; // Use theme

const SettingsItem = ({
  icon,
  name,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  name: string;
  onPress: () => void;
}) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.itemLeft}>
        <View
          style={[styles.iconBg, { backgroundColor: colors.primary + "20" }]}
        >
          <Ionicons name={icon} size={20} color={colors.primary} />
        </View>
        <Text style={[styles.itemText, { color: colors.text }]}>{name}</Text>
      </View>
      <Ionicons
        name="chevron-forward-outline"
        size={24}
        color={colors.lightText}
      />
    </TouchableOpacity>
  );
};

const SettingsScreen = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { profile, isLoading: isLoadingProfile } = useProfile();
  const { colors, setTheme } = useTheme();

  const handleLogout = () => {
    /* ... (remains the same) ... */
  };

  const handlePrivacy = () => {
    // Replace with your own privacy policy URL
    Linking.openURL("https://www.w3.org/TR/PNG/");
  };

  const handleDisplay = () => {
    Alert.alert("Display Mode", "Choose your preferred theme.", [
      { text: "Light", onPress: () => setTheme("light") },
      { text: "Dark", onPress: () => setTheme("dark") },
      { text: "System", onPress: () => setTheme("system"), style: "cancel" },
    ]);
  };

  if (isLoadingProfile || !profile) {
    return <ActivityIndicator style={{ flex: 1 }} color={colors.primary} />;
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.card }]}>
      <SafeAreaView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={[styles.card, { backgroundColor: colors.background }]}>
            <TouchableOpacity
              style={styles.userItem}
              onPress={() => navigation.navigate("EditProfile")}
            >
              {/* ... (user avatar logic is the same) ... */}
            </TouchableOpacity>
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <SettingsItem
              icon="person-outline"
              name="Manage Account"
              onPress={() => navigation.navigate("EditProfile")}
            />
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <SettingsItem
              icon="shield-checkmark-outline"
              name="Privacy"
              onPress={handlePrivacy}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={[styles.card, { backgroundColor: colors.background }]}>
            <SettingsItem
              icon="notifications-outline"
              name="Notifications"
              onPress={() => navigation.navigate("Notifications")}
            />
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <SettingsItem
              icon="sunny-outline"
              name="Display"
              onPress={handleDisplay}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.background }]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Log Out & Reset App</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ScrollView>
  );
};

// --- UPDATE STYLES TO BE DYNAMIC ---
const styles = StyleSheet.create({
  container: { flex: 1 },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6e6e72",
    marginLeft: 16,
    marginBottom: 8,
  },
  card: { borderRadius: 10, overflow: "hidden" },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  itemLeft: { flexDirection: "row", alignItems: "center" },
  iconBg: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  itemText: { marginLeft: 15, fontSize: 16 },
  userItem: { flexDirection: "row", alignItems: "center", padding: 12 },
  userAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  avatarPlaceholder: { justifyContent: "center", alignItems: "center" },
  userName: { fontSize: 18, fontWeight: "500" },
  divider: { height: StyleSheet.hairlineWidth, marginLeft: 60 },
  logoutButton: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 15,
    alignItems: "center",
    borderRadius: 10,
  },
  logoutText: { color: "red", fontSize: 16, fontWeight: "500" },
});

export default SettingsScreen;
