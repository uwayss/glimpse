// src/context/EntryContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  PropsWithChildren,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Entry } from "@/types";
import Colors from "@/constants/Colors"; // Import Colors for the default icon

// The key we'll use to save our data on the device
const STORAGE_KEY = "@glimpse_entries";

interface EntryContextType {
  entries: Entry[];
  addEntry: (entry: Omit<Entry, "id" | "date" | "time">) => void;
  isLoading: boolean; // We'll add a loading state for a better user experience
}

const EntryContext = createContext<EntryContextType>({
  entries: [],
  addEntry: () => {},
  isLoading: true,
});

export const EntryProvider = ({ children }: PropsWithChildren) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // This useEffect hook runs only once when the app starts
  useEffect(() => {
    const loadEntries = async () => {
      try {
        const storedEntries = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedEntries) {
          setEntries(JSON.parse(storedEntries));
        }
      } catch (e) {
        console.error("Failed to load entries from storage", e);
      } finally {
        setIsLoading(false); // We're done loading, whether it succeeded or not
      }
    };

    loadEntries();
  }, []);

  const addEntry = async (
    newEntryData: Omit<Entry, "id" | "date" | "time">
  ) => {
    const newEntry: Entry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      ...newEntryData,
      icon: newEntryData.icon || "book-outline",
      iconColor: newEntryData.iconColor || Colors.primary,
    };

    try {
      const updatedEntries = [newEntry, ...entries];
      setEntries(updatedEntries); // Update the state in memory

      // Save the new, full list to the device
      const jsonValue = JSON.stringify(updatedEntries);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error("Failed to save entry to storage", e);
    }
  };

  return (
    <EntryContext.Provider value={{ entries, addEntry, isLoading }}>
      {children}
    </EntryContext.Provider>
  );
};

export const useEntries = () => {
  return useContext(EntryContext);
};
