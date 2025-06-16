// src/screens/NewEntryScreen.tsx
import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  Image,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useEntries } from "@/context/EntryContext";
import ThemedText from "@/components/ThemedText";
import { EntryCategory } from "@/types";

const CATEGORIES: EntryCategory[] = ["Personal", "Travel", "Food", "Work"];

const NewEntryScreen = () => {
  const navigation = useNavigation();
  const { addEntry } = useEntries();
  const { colors } = useTheme();

  const topElementsAnim = useRef(new Animated.Value(0)).current;
  const bottomBarAnim = useRef(new Animated.Value(0)).current;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<EntryCategory>("Personal");
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

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
      quality: 0.5,
    });
    if (!pickerResult.canceled) {
      setImageUri(pickerResult.assets[0].uri);
    }
  };

  const handlePickLocation = async () => {
    setIsFetchingLocation(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "Permission to access location was denied"
      );
      setIsFetchingLocation(false);
      return;
    }
    try {
      let locationData = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      let addressArray = await Location.reverseGeocodeAsync(
        locationData.coords
      );
      if (addressArray[0]) {
        const { city, region, country } = addressArray[0];
        const locationString = [city, region, country]
          .filter(Boolean)
          .join(", ");
        setLocation(locationString);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not fetch location. Please try again.");
    } finally {
      setIsFetchingLocation(false);
    }
  };

  const handleSave = () => {
    if (!content.trim() && !imageUri && !location && !title.trim()) {
      Alert.alert(
        "Empty Entry",
        "Please write something or add a photo/location."
      );
      return;
    }
    addEntry({
      title: title.trim() || "Untitled Entry",
      content: content.trim(),
      imageUri,
      location,
      category: selectedCategory,
    });
    navigation.goBack();
  };

  const styles = stylesheet(colors);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={{ flex: 1 }}>
        <Animated.View style={{ transform: [{ translateY: topElementsAnim }] }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="close" size={30} color={colors.text} />
            </TouchableOpacity>
            <ThemedText style={styles.headerTitle}>New Entry</ThemedText>
            <View style={{ width: 30 }} />
          </View>
          <ThemedText style={styles.categoryTitle}>CATEGORY</ThemedText>
          <FlatList
            horizontal
            data={CATEGORIES}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
            renderItem={({ item }) => {
              const isActive = item === selectedCategory;
              return (
                <TouchableOpacity
                  style={[
                    styles.categoryChip,
                    isActive
                      ? { backgroundColor: colors.primary }
                      : { backgroundColor: colors.card },
                  ]}
                  onPress={() => setSelectedCategory(item)}
                >
                  <ThemedText
                    style={[
                      styles.categoryText,
                      isActive && { color: "white" },
                    ]}
                  >
                    {item}
                  </ThemedText>
                </TouchableOpacity>
              );
            }}
          />
        </Animated.View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {location && (
            <View style={styles.locationChipContainer}>
              <View style={[styles.metaChip, { backgroundColor: colors.card }]}>
                <Ionicons
                  name="location-sharp"
                  size={14}
                  color={colors.primary}
                />
                <ThemedText style={styles.metaText}>{location}</ThemedText>
                <TouchableOpacity onPress={() => setLocation(null)}>
                  <Ionicons name="close" size={16} color={colors.lightText} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.titleInput, { color: colors.text }]}
              placeholder="Title"
              placeholderTextColor={colors.lightText}
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={[styles.contentInput, { color: colors.text }]}
              multiline
              placeholder="What's on your mind?"
              placeholderTextColor={colors.lightText}
              value={content}
              onChangeText={setContent}
            />
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
        </ScrollView>

        <Animated.View
          style={[
            styles.footer,
            { transform: [{ translateY: bottomBarAnim }] },
          ]}
        >
          <View
            style={[styles.actionsContainer, { borderTopColor: colors.border }]}
          >
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handlePickImage}
            >
              <Ionicons name="camera-outline" size={24} color={colors.text} />
              <ThemedText style={styles.actionText}>Photo</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handlePickLocation}
            >
              {isFetchingLocation ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <Ionicons
                  name="location-outline"
                  size={24}
                  color={colors.text}
                />
              )}
              <ThemedText style={styles.actionText}>Location</ThemedText>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleSave}
          >
            <ThemedText style={styles.saveButtonText}>Save</ThemedText>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

function stylesheet(colors: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 15,
      paddingTop: 15,
      paddingBottom: 5,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "bold",
    },
    inputWrapper: {
      paddingHorizontal: 20,
      flex: 1,
    },
    titleInput: {
      fontSize: 28,
      fontWeight: "bold",
      paddingTop: 10,
    },
    contentInput: {
      paddingTop: 10,
      fontSize: 18,
      textAlignVertical: "top",
      lineHeight: 26,
    },
    locationChipContainer: {
      paddingHorizontal: 20,
      marginTop: 10,
      flexDirection: "row",
    },
    metaChip: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 20,
    },
    metaText: {
      marginLeft: 5,
      marginRight: 5,
      fontSize: 12,
    },
    imagePreviewContainer: {
      marginHorizontal: 20,
      marginTop: 35,
      alignItems: "center",
    },
    imagePreview: {
      width: "100%",
      height: 200,
      borderRadius: 10,
      resizeMode: "cover",
    },
    removeImageButton: {
      position: "absolute",
      top: 10,
      right: 10,
      backgroundColor: "rgba(0,0,0,0.5)",
      borderRadius: 12,
    },
    categoryTitle: {
      fontSize: 12,
      fontWeight: "600",
      paddingHorizontal: 20,
      marginTop: 5,
      marginBottom: 10,
      color: colors.lightText,
      textTransform: "uppercase",
    },
    categoryList: {
      paddingHorizontal: 20,
      paddingBottom: 10,
    },
    categoryChip: {
      paddingVertical: 6,
      paddingHorizontal: 14,
      borderRadius: 20,
      marginRight: 10,
    },
    categoryText: {
      fontWeight: "600",
    },
    footer: {
      // Wrapper for bottom content
    },
    actionsContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingTop: 15,
      paddingBottom: 10,
      borderTopWidth: 1,
    },
    actionButton: {
      alignItems: "center",
      minWidth: 60,
    },
    actionText: {
      marginTop: 3,
      fontSize: 12,
    },
    saveButton: {
      borderRadius: 25,
      padding: 15,
      marginHorizontal: 20,
      marginBottom: Platform.OS === "ios" ? 0 : 20,
      marginTop: 5,
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
