// src/screens/NewEntryScreen.tsx
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useEntries } from "@/context/EntryContext";
import ThemedText from "@/components/ThemedText";

const NewEntryScreen = () => {
  const navigation = useNavigation();
  const { addEntry } = useEntries();
  const { colors } = useTheme();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission Required",
        "Permission to access photos is required."
      );
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!pickerResult.canceled) {
      setImageUri(pickerResult.assets[0].uri);
    }
  };

  const showNotImplementedAlert = () => {
    Alert.alert("Under Development", "This feature is not yet implemented.");
  };

  const handleSave = () => {
    if (!content.trim() && !imageUri) {
      Alert.alert("Empty Entry", "Please write something or add a photo.");
      return;
    }

    addEntry(
      {
        title: title.trim() || "Untitled Entry",
        content: content.trim(),
      },
      imageUri
    );

    navigation.goBack();
  };

  const styles = stylesheet(colors);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={30} color={colors.text} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>New Entry</ThemedText>
          <View style={{ width: 30 }} />
        </View>

        {imageUri && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            <TouchableOpacity
              onPress={() => setImageUri(null)}
              style={styles.removeImageButton}
            >
              <Ionicons name="close-circle" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}

        <TextInput
          style={styles.titleInput}
          placeholder="Title (optional)"
          placeholderTextColor={colors.lightText}
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.contentInput}
          multiline
          placeholder="What's on your mind?"
          placeholderTextColor={colors.lightText}
          value={content}
          onChangeText={setContent}
        />

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handlePickImage}
          >
            <Ionicons name="camera-outline" size={24} color={colors.text} />
            <ThemedText style={styles.actionText}>Photo</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={showNotImplementedAlert}
          >
            <Ionicons name="videocam-outline" size={24} color={colors.text} />
            <ThemedText style={styles.actionText}>Video</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={showNotImplementedAlert}
          >
            <Ionicons name="location-outline" size={24} color={colors.text} />
            <ThemedText style={styles.actionText}>Location</ThemedText>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <ThemedText style={styles.saveButtonText}>Save</ThemedText>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

function stylesheet(colors: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
    imagePreviewContainer: {
      marginHorizontal: 20,
      marginBottom: 10,
      alignItems: "center",
    },
    imagePreview: {
      width: "100%",
      height: 200,
      borderRadius: 10,
    },
    removeImageButton: {
      position: "absolute",
      top: 10,
      right: 10,
      backgroundColor: "rgba(0,0,0,0.5)",
      borderRadius: 12,
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
      borderTopColor: colors.border,
    },
    actionButton: {
      alignItems: "center",
    },
    actionText: {
      marginTop: 5,
      color: colors.text,
    },
    saveButton: {
      backgroundColor: colors.primary,
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
}

export default NewEntryScreen;
