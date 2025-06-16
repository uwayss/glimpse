// src/screens/SettingsScreen.tsx
import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useProfile } from "@/context/ProfileContext";
import { useEntries } from "@/context/EntryContext";
import { RootStackNavigationProp } from "@/types";
import { useTheme } from "@/context/ThemeContext";
import ThemedText from "@/components/ThemedText";

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
        <ThemedText style={styles.itemText}>{name}</ThemedText>
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
  // --- CHANGE 1: Get clearProfileData from the hook ---
  const {
    profile,
    isLoading: isLoadingProfile,
    clearProfileData,
  } = useProfile();
  const { clearAllEntries } = useEntries();
  const { colors, setTheme } = useTheme();

  const handleLogout = () => {
    Alert.alert(
      "Log Out & Reset",
      "This will erase all your entries and profile data from this device. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Erase Everything",
          style: "destructive",
          onPress: async () => {
            // --- CHANGE 2: Call the new context functions ---
            await clearAllEntries();
            await clearProfileData(); // This sets hasOnboarded to false

            // --- CHANGE 3: Pop to the top of the stack ---
            // This will automatically land on the Onboarding screen
            // because AppNavigator will re-evaluate and see hasOnboarded is false.
            navigation.popToTop();
          },
        },
      ]
    );
  };

  const handlePrivacy = () => {
    Linking.openURL("https://www.google.com/policies/privacy/");
  };

  const handleDisplay = () => {
    Alert.alert("Display Mode", "Choose your preferred theme.", [
      { text: "Light", onPress: () => setTheme("light") },
      { text: "Dark", onPress: () => setTheme("dark") },
      { text: "System", onPress: () => setTheme("system"), style: "cancel" },
    ]);
  };

  if (isLoadingProfile || !profile) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.card }]}>
      <SafeAreaView>
        <View style={styles.section}>
          <ThemedText
            style={[styles.sectionTitle, { color: colors.lightText }]}
          >
            Account
          </ThemedText>
          <View style={[styles.card, { backgroundColor: colors.background }]}>
            <TouchableOpacity
              style={styles.userItem}
              onPress={() => navigation.navigate("EditProfile")}
            >
              {profile.avatarUri ? (
                <Image
                  source={{ uri: profile.avatarUri }}
                  style={styles.userAvatar}
                />
              ) : (
                <View
                  style={[
                    styles.userAvatar,
                    styles.avatarPlaceholder,
                    { backgroundColor: colors.card },
                  ]}
                >
                  <Ionicons
                    name="person-outline"
                    size={24}
                    color={colors.text}
                  />
                </View>
              )}
              <View>
                <ThemedText style={styles.userName}>{profile.name}</ThemedText>
              </View>
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
          <ThemedText
            style={[styles.sectionTitle, { color: colors.lightText }]}
          >
            Preferences
          </ThemedText>
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
          <ThemedText style={styles.logoutText}>Log Out & Reset App</ThemedText>
        </TouchableOpacity>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  section: { marginBottom: 20, paddingHorizontal: 15 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "400",
    marginLeft: 16,
    marginBottom: 8,
    textTransform: "uppercase",
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
    marginHorizontal: 15,
    marginTop: 20,
    padding: 15,
    alignItems: "center",
    borderRadius: 10,
  },
  logoutText: { color: "red", fontSize: 16, fontWeight: "500" },
});

export default SettingsScreen;
