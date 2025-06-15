// src/screens/NewEntryScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { useEntries } from "@/context/EntryContext"; // Import our new hook

const NewEntryScreen = () => {
  const navigation = useNavigation();
  const { addEntry } = useEntries(); // Get the addEntry function from context

  // State to hold the user's input
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSave = () => {
    if (!content.trim()) {
      // Don't save if content is empty
      alert("Please write something for your entry.");
      return;
    }

    addEntry({
      title: title.trim() || "Untitled Entry", // Use a default title if none is provided
      content: content.trim(),
    });

    navigation.goBack(); // Close the modal after saving
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={30} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Entry</Text>
          <View style={{ width: 30 }} />
        </View>

        {/* We now have two inputs */}
        <TextInput
          style={styles.titleInput}
          placeholder="Title (optional)"
          placeholderTextColor={Colors.lightText}
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.contentInput}
          multiline
          placeholder="What's on your mind?"
          placeholderTextColor={Colors.lightText}
          value={content}
          onChangeText={setContent}
        />

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="camera-outline" size={24} color={Colors.text} />
            <Text style={styles.actionText}>Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="videocam-outline" size={24} color={Colors.text} />
            <Text style={styles.actionText}>Video</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="location-outline" size={24} color={Colors.text} />
            <Text style={styles.actionText}>Location</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  titleInput: {
    paddingHorizontal: 20,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  contentInput: {
    flex: 1,
    padding: 20,
    fontSize: 16,
    textAlignVertical: "top",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  actionButton: {
    alignItems: "center",
  },
  actionText: {
    marginTop: 5,
    color: Colors.text,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    padding: 15,
    margin: 20,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default NewEntryScreen;
