// src/components/EntryCard.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Entry } from "../types";
import { useTheme } from "../context/ThemeContext";
import ThemedText from "./ThemedText";

type EntryCardProps = {
  entry: Entry;
};

const EntryCard = ({ entry }: EntryCardProps) => {
  const { colors } = useTheme();
  const styles = stylesheet(colors);
  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <View style={styles.textContainer}>
        <ThemedText style={styles.time}>{entry.time}</ThemedText>
        <ThemedText style={styles.title}>{entry.title}</ThemedText>
        <ThemedText style={styles.content}>{entry.content}</ThemedText>
      </View>
      <View
        style={[styles.iconContainer, { backgroundColor: entry.iconColor }]}
      >
        <Ionicons name={entry.icon} size={40} color="white" />
      </View>
    </View>
  );
};
const stylesheet = (colors: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: "#F8F8F8",
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
      color: colors.lightText,
      marginBottom: 5,
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 5,
    },
    content: {
      fontSize: 14,
      color: colors.text,
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
