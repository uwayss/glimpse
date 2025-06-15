// screens/NewEntryScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";

const NewEntryScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={30} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Entry</Text>
        <View style={{ width: 30 }} />
      </View>

      <TextInput
        style={styles.textInput}
        multiline
        placeholder="What's on your mind?"
        placeholderTextColor={Colors.lightText}
      />

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="camera-outline" size={24} color={Colors.text} />
          <Text style={styles.actionText}>Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="videocam-outline" size={24} color={Colors.text} />
          <Text style={styles.actionText}>Video</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="location-outline" size={24} color={Colors.text} />
          <Text style={styles.actionText}>Location</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  textInput: {
    flex: 1,
    padding: 20,
    fontSize: 16,
    textAlignVertical: "top",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  actionButton: {
    alignItems: "center",
  },
  actionText: {
    marginTop: 5,
    color: Colors.text,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    padding: 15,
    margin: 20,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default NewEntryScreen;
