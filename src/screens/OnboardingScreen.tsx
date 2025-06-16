// src/screens/OnboardingScreen.tsx
import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { useProfile } from "@/context/ProfileContext";
import ThemedText from "@/components/ThemedText";

const OnboardingScreen = () => {
  const { colors } = useTheme();
  const { updateProfile } = useProfile();
  const [name, setName] = useState("");

  const handleContinue = () => {
    if (name.trim().length > 0) {
      updateProfile({ name: name.trim(), hasOnboarded: true });
    } else {
      // Even if they don't enter a name, we mark onboarding as complete
      // and they can edit it later.
      updateProfile({ hasOnboarded: true });
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
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
              color={colors.primary}
            />
            <ThemedText style={styles.title}>Welcome to Glimpse</ThemedText>
            <ThemedText style={styles.subtitle}>
              Let&apos;s start by getting your name. This is stored only on your
              device.
            </ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.card,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              placeholder="What should we call you?"
              placeholderTextColor={colors.lightText}
              value={name}
              onChangeText={setName}
            />
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleContinue}
          >
            <ThemedText style={styles.buttonText}>Continue</ThemedText>
          </TouchableOpacity>
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
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 40,
    color: "#8E8E93",
    maxWidth: "85%",
  },
  input: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 40, // Extra padding for home bar
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OnboardingScreen;
