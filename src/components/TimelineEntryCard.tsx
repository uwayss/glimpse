// src/components/TimelineEntryCard.tsx
import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Entry } from "../types";
import { useEntries } from "@/context/EntryContext";
import { useTheme } from "../context/ThemeContext";
import ThemedText from "./ThemedText";
const { width } = Dimensions.get("window");

export const ITEM_HEIGHT = 350;
export const ITEM_WIDTH = width * 0.9;
export const VERTICAL_MARGIN = 5;
export const SNAP_INTERVAL = ITEM_HEIGHT + VERTICAL_MARGIN;

type TimelineEntryCardProps = {
  entry: Entry;
  scrollY: Animated.Value;
  index: number;
};

const TimelineEntryCard = ({
  entry,
  scrollY,
  index,
}: TimelineEntryCardProps) => {
  const { deleteEntry } = useEntries();

  const inputRange = [
    (index - 1) * SNAP_INTERVAL,
    index * SNAP_INTERVAL,
    (index + 1) * SNAP_INTERVAL,
  ];

  const scale = scrollY.interpolate({
    inputRange,
    outputRange: [0.85, 1, 0.85],
    extrapolate: "clamp",
  });

  const deleteButtonOpacity = scrollY.interpolate({
    inputRange,
    outputRange: [0, 1, 0],
    extrapolate: "clamp",
  });

  const handleDelete = () => {
    Alert.alert("Delete Entry", "Are you sure you want to delete this entry?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteEntry(entry.id),
      },
    ]);
  };
  const { colors } = useTheme();
  const styles = stylesheet(colors);
  return (
    <Animated.View
      style={[
        styles.card,
        { backgroundColor: colors.background, transform: [{ scale }] },
      ]}
    >
      <Animated.View
        style={[styles.deleteButton, { opacity: deleteButtonOpacity }]}
      >
        <TouchableOpacity onPress={handleDelete}>
          <Ionicons name="trash-outline" size={24} color={colors.lightText} />
        </TouchableOpacity>
      </Animated.View>

      <View
        style={[styles.iconContainer, { backgroundColor: entry.iconColor }]}
      >
        <Ionicons name={entry.icon} size={40} color="white" />
      </View>
      <ThemedText style={styles.title}>{entry.title}</ThemedText>
      <ThemedText style={styles.time}>{entry.time}</ThemedText>
      <ThemedText style={styles.content}>{entry.content}</ThemedText>
    </Animated.View>
  );
};
function stylesheet(colors: any) {
  return StyleSheet.create({
    card: {
      width: ITEM_WIDTH,
      height: ITEM_HEIGHT,
      backgroundColor: colors.background,
      borderRadius: 20,
      padding: 20,
      marginVertical: VERTICAL_MARGIN,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 6,
    },
    deleteButton: {
      position: "absolute",
      top: 20,
      right: 20,
    },
    iconContainer: {
      width: 90,
      height: 90,
      borderRadius: 45,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 25,
      textAlign: "center",
    },
    time: {
      fontSize: 16,
      color: colors.lightText,
      marginBottom: 15,
    },
    content: {
      fontSize: 16,
      color: colors.text,
      textAlign: "center",
      lineHeight: 24,
    },
  });
}
export default TimelineEntryCard;
