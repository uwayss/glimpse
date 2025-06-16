import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Entry, RootStackNavigationProp } from "../types";
import { useAppTheme } from "../context/ThemeContext";
import { Card, Text, Avatar } from "react-native-paper";

type EntryCardProps = {
  entry: Entry;
};

const EntryCard = ({ entry }: EntryCardProps) => {
  const theme = useAppTheme();
  const navigation = useNavigation<RootStackNavigationProp>();
  const styles = stylesheet(theme.colors);

  return (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate("ViewEntry", { entryId: entry.id })}
      mode="contained"
    >
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text variant="bodySmall" style={{ color: theme.colors.tertiary }}>
            {entry.time}
          </Text>
          <Text variant="titleMedium" style={styles.title} numberOfLines={1}>
            {entry.title}
          </Text>
          <Text variant="bodyMedium" numberOfLines={2}>
            {entry.content}
          </Text>
          {entry.location && (
            <View style={styles.metaRow}>
              <Ionicons
                name="location-sharp"
                size={14}
                color={theme.colors.tertiary}
              />
              <Text
                variant="labelSmall"
                style={[styles.metaText, { color: theme.colors.tertiary }]}
              >
                {entry.location}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.visualContainer}>
          {entry.imageUri ? (
            <Image source={{ uri: entry.imageUri }} style={styles.image} />
          ) : (
            <Avatar.Icon
              size={64}
              icon={entry.icon || "notebook"}
              style={{
                backgroundColor: entry.iconColor || theme.colors.primary,
              }}
              color="white"
            />
          )}
        </View>
      </View>
    </Card>
  );
};

const stylesheet = (colors: any) =>
  StyleSheet.create({
    card: {
      marginBottom: 12,
    },
    container: {
      flexDirection: "row",
      padding: 16,
      alignItems: "center",
    },
    textContainer: {
      flex: 1,
      marginRight: 12,
    },
    title: {
      fontWeight: "bold",
      marginBottom: 4,
    },
    metaRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
    },
    metaText: {
      marginLeft: 4,
    },
    visualContainer: {
      justifyContent: "center",
      alignItems: "center",
    },
    image: {
      width: 80,
      height: 80,
      borderRadius: 12,
      resizeMode: "cover",
    },
  });

export default EntryCard;
