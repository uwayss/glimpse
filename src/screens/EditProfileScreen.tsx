// src/screens/EditProfileScreen.tsx
import React, { useState, useLayoutEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useProfile } from "@/context/ProfileContext";
import { RootStackNavigationProp } from "@/types";
import { Colors } from "react-native/Libraries/NewAppScreen";

const EditProfileScreen = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { profile, updateProfile } = useProfile();
  const { colors } = useTheme();
  const [name, setName] = useState(profile?.name || "");
  const [imageUri, setImageUri] = useState(profile?.avatarUri || null);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission Required",
        "Permission to access the camera roll is required to choose a profile picture."
      );
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!pickerResult.canceled) {
      setImageUri(pickerResult.assets[0].uri);
    }
  };

  const handleSave = useCallback(() => {
    updateProfile({ name: name.trim(), avatarUri: imageUri });
    navigation.goBack();
  }, [name, imageUri, updateProfile, navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleSave} style={{ marginRight: 15 }}>
          <Text
            style={{ color: colors.primary, fontSize: 17, fontWeight: "600" }}
          >
            Save
          </Text>
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 15 }}
        >
          <Text style={{ color: colors.primary, fontSize: 17 }}>Cancel</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, name, imageUri, handleSave, colors]);

  const styles = stylesheet(colors);
  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <View style={styles.privacyContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={14}
            color={colors.lightText}
          />
          <Text style={styles.privacyText}>
            Your name and photo are stored only on your device.
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <TouchableOpacity onPress={pickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Ionicons name="camera-outline" size={40} color={colors.text} />
              </View>
            )}
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your Name"
              placeholderTextColor={colors.lightText}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

function stylesheet(colors: any) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    flex: { flex: 1 },
    privacyContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.card,
      paddingVertical: 12,
    },
    privacyText: {
      marginLeft: 8,
      color: colors.lightText,
      fontSize: 13,
    },
    content: {
      flex: 1,
      alignItems: "center",
      paddingTop: 40,
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
    },
    avatarPlaceholder: {
      backgroundColor: Colors.card,
      justifyContent: "center",
      alignItems: "center",
    },
    changePhotoText: {
      color: Colors.primary,
      marginTop: 10,
      fontSize: 16,
      fontWeight: "600",
      textAlign: "center",
    },
    inputContainer: {
      width: "90%",
      marginTop: 40,
    },
    inputLabel: {
      color: Colors.lightText,
      fontSize: 14,
      marginBottom: 5,
    },
    input: {
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
      paddingVertical: 10,
      fontSize: 18,
      color: Colors.text,
    },
  });
}
export default EditProfileScreen;
