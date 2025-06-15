// src/components/TimelineEntryCard.tsx
import React from "react";
import { View, Text, StyleSheet, Dimensions, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { Entry } from "../types";

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

  return (
    <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
      <View
        style={[styles.iconContainer, { backgroundColor: entry.iconColor }]}
      >
        <Ionicons name={entry.icon} size={40} color="white" />
      </View>
      <Text style={styles.title}>{entry.title}</Text>
      <Text style={styles.time}>{entry.time}</Text>
      <Text style={styles.content}>{entry.content}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    backgroundColor: Colors.background,
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
    color: Colors.text,
    marginBottom: 25,
    textAlign: "center",
  },
  time: {
    fontSize: 16,
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
