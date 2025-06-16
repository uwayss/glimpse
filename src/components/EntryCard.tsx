// src/components/EntryCard.tsx
import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Entry, RootStackNavigationProp } from "../types";
import { useTheme } from "../context/ThemeContext";
import ThemedText from "./ThemedText";

type EntryCardProps = {
  entry: Entry;
};

const EntryCard = ({ entry }: EntryCardProps) => {
  const { colors } = useTheme();
  const navigation = useNavigation<RootStackNavigationProp>();
  const styles = stylesheet(colors);

  const displayImage = entry.imageUri;
  const displayIcon = !displayImage;

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("ViewEntry", { entryId: entry.id })}
    >
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.textContainer}>
          <ThemedText style={styles.time}>{entry.time}</ThemedText>
          <ThemedText style={styles.title} numberOfLines={1}>
            {entry.title}
          </ThemedText>
          <ThemedText style={styles.content} numberOfLines={2}>
            {entry.content}
          </ThemedText>
          {entry.location && (
            <View style={styles.metaRow}>
              <Ionicons
                name="location-sharp"
                size={14}
                color={colors.lightText}
              />
              <ThemedText style={styles.metaText}>{entry.location}</ThemedText>
            </View>
          )}
        </View>
        {displayIcon && (
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: entry.iconColor || colors.primary },
            ]}
          >
            <Ionicons
              name={entry.icon || "book-outline"}
              size={40}
              color="white"
            />
          </View>
        )}
        {displayImage && (
          <Image
            source={entry.imageUri ? { uri: entry.imageUri } : undefined}
            style={styles.image}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const stylesheet = (colors: any) =>
  StyleSheet.create({
    card: {
      borderRadius: 15,
      padding: 15,
      marginBottom: 15,
      flexDirection: "row",
      alignItems: "center",
    },
    textContainer: {
      flex: 1,
      marginRight: 10,
    },
    time: {
      fontSize: 12,
      color: colors.lightText,
      marginBottom: 5,
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 5,
    },
    content: {
      fontSize: 14,
      lineHeight: 20,
    },
    metaRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
      opacity: 0.8,
    },
    metaText: {
      marginLeft: 4,
      fontSize: 12,
      color: colors.lightText,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    image: {
      width: 80,
      height: 80,
      borderRadius: 10,
      resizeMode: "cover",
    },
  });

export default EntryCard;
