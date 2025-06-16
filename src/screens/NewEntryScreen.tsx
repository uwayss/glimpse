import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { AppTheme, useAppTheme } from "../context/ThemeContext";
import { useEntries } from "@/context/EntryContext";
import { EntryCategory } from "@/types";
import {
  TextInput,
  Chip,
  IconButton,
  Button,
  ActivityIndicator,
  Text,
  Portal,
  Dialog,
} from "react-native-paper";
import Header from "@/components/Header";

const ADD_CHIP_IDENTIFIER = "ADD_NEW_CATEGORY_CHIP";

const NewEntryScreen = () => {
  const navigation = useNavigation();
  const { addEntry, categories, addCategory } = useEntries();
  const theme = useAppTheme();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<EntryCategory>("Personal");
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleAddNewCategory = async () => {
    const trimmedName = newCategoryName.trim();
    if (trimmedName) {
      await addCategory(trimmedName);
      setSelectedCategory(trimmedName);
    }
    setNewCategoryName("");
    setDialogVisible(false);
  };

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

  const styles = stylesheet(theme);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="New Entry"
        leftIcon="close"
        leftAction={() => navigation.goBack()}
        rightText="Save"
        rightAction={handleSave}
        alignTitle="left"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text
          variant="labelLarge"
          style={[styles.categoryTitle, { color: theme.colors.tertiary }]}
        >
          CATEGORY
        </Text>
        <FlatList
          horizontal
          data={[...categories, ADD_CHIP_IDENTIFIER]}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
          renderItem={({ item }) => {
            if (item === ADD_CHIP_IDENTIFIER) {
              return (
                <Chip
                  icon="plus"
                  onPress={() => setDialogVisible(true)}
                  style={styles.categoryChip}
                >
                  New
                </Chip>
              );
            }
            return (
              <Chip
                selected={item === selectedCategory}
                onPress={() => setSelectedCategory(item)}
                style={styles.categoryChip}
              >
                {item}
              </Chip>
            );
          }}
        />

        {location && (
          <Chip
            icon="map-marker"
            onClose={() => setLocation(null)}
            style={styles.locationChip}
          >
            {location}
          </Chip>
        )}

        <View>
          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            style={styles.titleInput}
            contentStyle={styles.inputContent}
            mode="flat"
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            placeholderTextColor={theme.colors.tertiary}
          />
          <TextInput
            placeholder="What's on your mind?"
            value={content}
            onChangeText={setContent}
            multiline
            style={styles.contentInput}
            contentStyle={styles.inputContent}
            mode="flat"
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            placeholderTextColor={theme.colors.tertiary}
          />
        </View>
        {imageUri && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            <IconButton
              icon="close-circle"
              onPress={() => setImageUri(null)}
              style={styles.removeImageButton}
              iconColor="white"
              containerColor="rgba(0,0,0,0.5)"
            />
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <IconButton icon="camera-outline" size={24} onPress={handlePickImage} />
        {isFetchingLocation ? (
          <ActivityIndicator style={styles.locationLoader} />
        ) : (
          <IconButton
            icon="map-marker-outline"
            size={24}
            onPress={handlePickLocation}
          />
        )}
      </View>
      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
        >
          <Dialog.Title>Add New Category</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Category Name"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              autoFocus
              mode="outlined"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleAddNewCategory}>Add</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

function stylesheet(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingBottom: 20,
    },
    categoryTitle: {
      marginTop: 10,
      marginBottom: 10,
      paddingHorizontal: 16,
      textTransform: "uppercase",
    },
    categoryList: {
      paddingHorizontal: 16,
      paddingBottom: 10,
    },
    categoryChip: {
      marginRight: 8,
    },
    locationChip: {
      alignSelf: "flex-start",
      marginTop: 10,
      marginHorizontal: 16,
    },
    titleInput: {
      backgroundColor: "transparent",
      fontSize: 28,
      fontWeight: "bold",
    },
    contentInput: {
      backgroundColor: "transparent",
      minHeight: 100,
      fontSize: 18,
      textAlignVertical: "top",
      lineHeight: 26,
    },
    inputContent: {
      paddingHorizontal: 16,
    },
    imageContainer: {
      marginTop: 20,
      marginHorizontal: 16,
      alignItems: "center",
    },
    imagePreview: {
      width: "100%",
      height: 200,
      borderRadius: theme.roundness,
      resizeMode: "cover",
    },
    removeImageButton: {
      position: "absolute",
      top: 5,
      right: 5,
    },
    footer: {
      flexDirection: "row",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.outline,
    },
    locationLoader: {
      marginHorizontal: 12,
      marginVertical: 6,
    },
  });
}
export default NewEntryScreen;
