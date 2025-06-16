// src/screens/ViewEntryScreen.tsx
import React, { useLayoutEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEntries } from "@/context/EntryContext";
import { useTheme } from "@/context/ThemeContext";
import ThemedText from "@/components/ThemedText";
import { RootStackParamList, RootStackNavigationProp } from "@/types";
import { Ionicons } from "@expo/vector-icons";

type ViewEntryScreenRouteProp = RouteProp<RootStackParamList, "ViewEntry">;
const { width } = Dimensions.get("window");

const ViewEntryScreen = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const route = useRoute<ViewEntryScreenRouteProp>();
  const { entryId } = route.params;

  const { entries, deleteEntry } = useEntries();
  const { colors } = useTheme();

  const entry = entries.find((e) => e.id === entryId);

  const handleDelete = useCallback(() => {
    Alert.alert(
      "Delete Entry",
      "Are you sure you want to permanently delete this entry?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            if (entry) {
              deleteEntry(entry.id);
              navigation.goBack();
            }
          },
        },
      ]
    );
  }, [entry, deleteEntry, navigation]);

  useLayoutEffect(() => {
    if (entry) {
      navigation.setOptions({
        headerTitle: entry.title || "Entry",
        headerRight: () => (
          <TouchableOpacity onPress={handleDelete} style={{ marginRight: 15 }}>
            <Ionicons name="trash-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, entry, colors, handleDelete]);

  if (!entry) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.centered}>
          <ThemedText>Entry not found.</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {entry.imageUri && (
        <Image
          source={{ uri: entry.imageUri }}
          style={styles.image}
          resizeMode="contain"
        />
      )}
      <View style={styles.contentContainer}>
        <ThemedText style={styles.title}>{entry.title}</ThemedText>
        <View style={styles.metaContainer}>
          <ThemedText style={styles.metaText}>{entry.date}</ThemedText>
          <ThemedText style={styles.metaText}>•</ThemedText>
          <ThemedText style={styles.metaText}>{entry.time}</ThemedText>
        </View>

        {entry.location && (
          <View style={[styles.chip, { borderColor: colors.primary + "30" }]}>
            <Ionicons name="location-sharp" size={14} color={colors.primary} />
            <ThemedText style={[styles.chipText, { color: colors.primary }]}>
              {entry.location}
            </ThemedText>
          </View>
        )}

        <ThemedText style={styles.content}>{entry.content}</ThemedText>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: width,
    height: width,
    backgroundColor: "#000",
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    opacity: 0.6,
  },
  metaText: {
    fontSize: 14,
    marginRight: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 20,
  },
  chipText: {
    marginLeft: 5,
    fontSize: 12,
    fontWeight: "500",
  },
  content: {
    fontSize: 17,
    lineHeight: 28,
  },
});

export default ViewEntryScreen;
