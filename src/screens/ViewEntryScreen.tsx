import React from "react";
import { View, StyleSheet, ScrollView, Image, Dimensions } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEntries } from "@/context/EntryContext";
import { useAppTheme } from "@/context/ThemeContext";
import { RootStackParamList, RootStackNavigationProp } from "@/types";
import { Appbar, Text, Chip, Portal, Dialog, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type ViewEntryScreenRouteProp = RouteProp<RootStackParamList, "ViewEntry">;
const { width } = Dimensions.get("window");

const ViewEntryScreen = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const route = useRoute<ViewEntryScreenRouteProp>();
  const { entryId } = route.params;
  const [dialogVisible, setDialogVisible] = React.useState(false);

  const { entries, deleteEntry } = useEntries();
  const theme = useAppTheme();
  const entry = entries.find((e) => e.id === entryId);

  const showDeleteDialog = () => setDialogVisible(true);
  const hideDeleteDialog = () => setDialogVisible(false);

  const handleDelete = () => {
    hideDeleteDialog();
    if (entry) {
      deleteEntry(entry.id);
      navigation.goBack();
    }
  };

  if (!entry) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Not Found" />
        </Appbar.Header>
        <View style={styles.centered}>
          <Text>Entry not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={["top"]}
      >
        <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title={entry.title || "Entry"} />
          <Appbar.Action icon="trash-can-outline" onPress={showDeleteDialog} />
        </Appbar.Header>
        <ScrollView>
          {entry.imageUri && (
            <Image source={{ uri: entry.imageUri }} style={styles.image} />
          )}
          <View style={styles.contentContainer}>
            <Text variant="headlineLarge" style={styles.title}>
              {entry.title}
            </Text>
            <View style={styles.metaContainer}>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.tertiary }}
              >
                {entry.date} • {entry.time}
              </Text>
            </View>

            {entry.location && (
              <Chip icon="map-marker" style={styles.chip}>
                {entry.location}
              </Chip>
            )}

            <Text variant="bodyLarge" style={styles.content}>
              {entry.content}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDeleteDialog}>
          <Dialog.Title>Delete Entry</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to permanently delete this entry?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDeleteDialog}>Cancel</Button>
            <Button onPress={handleDelete} textColor={theme.colors.error}>
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
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
    height: width * 0.75,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  metaContainer: {
    marginBottom: 20,
  },
  chip: {
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  content: {
    lineHeight: 28,
  },
});

export default ViewEntryScreen;
