// src/components/TimelineEntryCard.tsx
import React from "react";
import { View, Text, StyleSheet, Dimensions, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { Entry } from "../types";

const { width } = Dimensions.get("window");
// INCREASED a bit for a more prominent look
export const ITEM_WIDTH = width * 0.8;
// INCREASED height to match new width with a nice aspect ratio
export const ITEM_HEIGHT = ITEM_WIDTH * 1.3;

type TimelineEntryCardProps = {
  entry: Entry;
  index: number;
  scrollY: Animated.Value;
};

const TimelineEntryCard = ({
  entry,
  index,
  scrollY,
}: TimelineEntryCardProps) => {
  const inputRange = [
    (index - 1) * ITEM_HEIGHT,
    index * ITEM_HEIGHT,
    (index + 1) * ITEM_HEIGHT,
  ];

  // Make the non-focused cards slightly smaller for a more pronounced effect
  const scale = scrollY.interpolate({
    inputRange,
    outputRange: [0.8, 1, 0.8],
    extrapolate: "clamp",
  });
  if (entry.id === "spacer-start" || entry.id === "spacer-end") {
    return null;
  }
  return (
    <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
      <View
        style={[styles.iconContainer, { backgroundColor: entry.iconColor }]}
      >
        <Ionicons name={entry.icon} size={60} color="white" />
      </View>
      <Text style={styles.title}>{entry.title}</Text>
      <Text style={styles.time}>{entry.time}</Text>
      <Text style={styles.content} numberOfLines={4}>
        {entry.content}
      </Text>
    </Animated.View>
  );
};

// ... (styles remain the same)
const styles = StyleSheet.create({
  card: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 8,
  },
  time: {
    fontSize: 14,
    color: Colors.lightText,
    marginBottom: 15,
  },
  content: {
    fontSize: 16,
    color: Colors.text,
    textAlign: "center",
    lineHeight: 24,
  },
});

export default TimelineEntryCard;
