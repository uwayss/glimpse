import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/context/ThemeContext";
import { useProfile } from "@/context/ProfileContext";
import { Text, TextInput, Button } from "react-native-paper";

const OnboardingScreen = () => {
  const theme = useAppTheme();
  const { updateProfile } = useProfile();
  const [name, setName] = useState("");

  const handleContinue = () => {
    if (name.trim().length > 0) {
      updateProfile({ name: name.trim(), hasOnboarded: true });
    } else {
      updateProfile({ hasOnboarded: true });
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <Ionicons
              name="sparkles-outline"
              size={80}
              color={theme.colors.primary}
            />
            <Text variant="headlineLarge" style={styles.title}>
              Welcome to Glimpse
            </Text>
            <Text
              variant="bodyLarge"
              style={[styles.subtitle, { color: theme.colors.tertiary }]}
            >
              Let&apos;s start by getting your name. This is stored only on your
              device.
            </Text>
            <TextInput
              label="What should we call you?"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.input}
            />
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleContinue}
            contentStyle={styles.button}
          >
            Continue
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginTop: 10,
    marginBottom: 40,
    maxWidth: "85%",
  },
  input: {
    width: "100%",
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  button: {
    paddingVertical: 8,
  },
});

export default OnboardingScreen;
