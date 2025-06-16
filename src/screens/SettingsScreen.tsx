import React from "react";
import { View, StyleSheet, ScrollView, Alert, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useProfile } from "@/context/ProfileContext";
import { useEntries } from "@/context/EntryContext";
import { RootStackNavigationProp } from "@/types";
import { useAppTheme, useTheme } from "@/context/ThemeContext";
import {
  List,
  Avatar,
  Text,
  Button,
  ActivityIndicator,
  Dialog,
  Portal,
  RadioButton,
  Divider,
} from "react-native-paper";

const SettingsItem = ({
  icon,
  name,
  onPress,
}: {
  icon: string;
  name: string;
  onPress: () => void;
}) => {
  const theme = useAppTheme();
  return (
    <List.Item
      title={name}
      titleStyle={styles.itemText}
      onPress={onPress}
      left={() => (
        <Avatar.Icon
          size={32}
          icon={icon}
          color={theme.colors.primary}
          style={{ backgroundColor: `${theme.colors.primary}20` }}
        />
      )}
      right={() => (
        <List.Icon icon="chevron-right" color={theme.colors.tertiary} />
      )}
      style={styles.item}
    />
  );
};

const SettingsScreen = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const {
    profile,
    isLoading: isLoadingProfile,
    clearProfileData,
  } = useProfile();
  const { clearAllEntries } = useEntries();
  const theme = useAppTheme();
  const { themeMode, setTheme } = useTheme();
  const [dialogVisible, setDialogVisible] = React.useState(false);

  const handleLogout = () => {
    Alert.alert(
      "Log Out & Reset",
      "This will erase all your entries and profile data from this device. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Erase Everything",
          style: "destructive",
          onPress: () => {
            clearAllEntries();
            clearProfileData();
            navigation.popToTop();
          },
        },
      ]
    );
  };

  const handlePrivacy = () => {
    Linking.openURL("https://www.google.com/policies/privacy/");
  };

  if (isLoadingProfile || !profile) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <ScrollView
        style={[
          styles.container,
          { backgroundColor: theme.colors.surfaceVariant },
        ]}
      >
        <SafeAreaView edges={["bottom"]}>
          <View style={styles.section}>
            <Text
              variant="labelLarge"
              style={[styles.sectionTitle, { color: theme.colors.tertiary }]}
            >
              Account
            </Text>
            <View
              style={[styles.card, { backgroundColor: theme.colors.surface }]}
            >
              <List.Item
                style={styles.userItem}
                onPress={() => navigation.navigate("EditProfile")}
                title={profile.name}
                titleStyle={styles.userName}
                left={() =>
                  profile.avatarUri ? (
                    <Avatar.Image
                      size={50}
                      source={{ uri: profile.avatarUri }}
                    />
                  ) : (
                    <Avatar.Icon size={50} icon="account" />
                  )
                }
              />
              <Divider style={styles.divider} />
              <SettingsItem
                icon="account-edit-outline"
                name="Manage Account"
                onPress={() => navigation.navigate("EditProfile")}
              />
              <Divider style={styles.divider} />
              <SettingsItem
                icon="shield-lock-outline"
                name="Privacy"
                onPress={handlePrivacy}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text
              variant="labelLarge"
              style={[styles.sectionTitle, { color: theme.colors.tertiary }]}
            >
              Preferences
            </Text>
            <View
              style={[styles.card, { backgroundColor: theme.colors.surface }]}
            >
              <SettingsItem
                icon="bell-outline"
                name="Notifications"
                onPress={() => navigation.navigate("Notifications")}
              />
              <Divider style={styles.divider} />
              <SettingsItem
                icon="weather-night"
                name="Display"
                onPress={() => setDialogVisible(true)}
              />
            </View>
          </View>

          <View style={[styles.card, styles.logoutCard]}>
            <List.Item
              title="Log Out & Reset App"
              titleStyle={styles.logoutText}
              onPress={handleLogout}
            />
          </View>
        </SafeAreaView>
      </ScrollView>

      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
        >
          <Dialog.Title>Display Mode</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group
              onValueChange={(v) => setTheme(v as any)}
              value={themeMode}
            >
              <View style={styles.radioItem}>
                <RadioButton value="light" />
                <Text>Light</Text>
              </View>
              <View style={styles.radioItem}>
                <RadioButton value="dark" />
                <Text>Dark</Text>
              </View>
              <View style={styles.radioItem}>
                <RadioButton value="system" />
                <Text>System Default</Text>
              </View>
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
  },
  section: {
    marginBottom: 20,
    padding: 15,
  },
  sectionTitle: {
    marginLeft: 16,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  card: {
    borderRadius: 10,
    overflow: "hidden",
  },
  itemText: {
    fontSize: 16,
    marginLeft: 10,
  },
  userItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: "500",
  },
  divider: {
    marginStart: 70,
  },
  logoutCard: {
    marginHorizontal: 15,
    marginTop: 20,
  },
  logoutText: {
    color: "red",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  item: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

export default SettingsScreen;
