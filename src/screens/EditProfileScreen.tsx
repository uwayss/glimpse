import React, { useState, useCallback } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { AppTheme, useAppTheme } from "../context/ThemeContext";
import { useProfile } from "@/context/ProfileContext";
import { RootStackNavigationProp } from "@/types";
import { Avatar, Banner, Button, TextInput } from "react-native-paper";
import Header from "@/components/Header";

const EditProfileScreen = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { profile, updateProfile } = useProfile();
  const theme = useAppTheme();
  const [name, setName] = useState(profile?.name || "");
  const [imageUri, setImageUri] = useState(profile?.avatarUri || null);
  const [bannerVisible, setBannerVisible] = useState(true);

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

  const styles = stylesheet(theme);
  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Header
        title="Edit Profile"
        leftIcon="arrow-left"
        leftAction={() => navigation.goBack()}
        rightText="Save"
        rightAction={handleSave}
        alignTitle="left"
      />
      <Banner
        visible={bannerVisible}
        actions={[
          {
            label: "Got it",
            onPress: () => setBannerVisible(false),
          },
        ]}
        icon="lock-outline"
      >
        Your name and photo are stored only on your device.
      </Banner>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarContainer}>
          {imageUri ? (
            <Avatar.Image size={120} source={{ uri: imageUri }} />
          ) : (
            <Avatar.Icon size={120} icon="camera-outline" />
          )}
          <Button
            mode="text"
            onPress={pickImage}
            style={styles.changePhotoButton}
          >
            Change Photo
          </Button>
        </View>

        <TextInput
          label="Name"
          value={name}
          onChangeText={setName}
          placeholder="Your Name"
          mode="outlined"
          style={styles.input}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

function stylesheet(theme: AppTheme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    content: {
      alignItems: "center",
      padding: 20,
    },
    avatarContainer: {
      alignItems: "center",
      marginBottom: 30,
      marginTop: 20,
    },
    changePhotoButton: {
      marginTop: 10,
    },
    input: {
      width: "100%",
    },
  });
}
export default EditProfileScreen;
