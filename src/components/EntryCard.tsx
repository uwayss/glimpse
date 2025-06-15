// src/components/EntryCard.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { Entry } from "../types";

type EntryCardProps = {
  entry: Entry;
};

const EntryCard = ({ entry }: EntryCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.textContainer}>
        <Text style={styles.time}>{entry.time}</Text>
        <Text style={styles.title}>{entry.title}</Text>
        <Text style={styles.content}>{entry.content}</Text>
      </View>
      <View
        style={[styles.iconContainer, { backgroundColor: entry.iconColor }]}
      >
        <Ionicons name={entry.icon} size={40} color="white" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F8F8F8", // A slightly different card color for depth
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  textContainer: {
    flex: 1,
  },
  time: {
    fontSize: 12,
    color: Colors.lightText,
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 5,
  },
  content: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginLeft: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EntryCard;
