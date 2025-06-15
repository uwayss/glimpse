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
import Colors from "@/constants/Colors";

const STORAGE_KEY = "@glimpse_entries";

interface EntryContextType {
  entries: Entry[];
  addEntry: (entry: Omit<Entry, "id" | "date" | "time">) => void;
  deleteEntry: (id: string) => void; // <-- ADD DELETE FUNCTION
  isLoading: boolean;
}

const EntryContext = createContext<EntryContextType>({
  entries: [],
  addEntry: () => {},
  deleteEntry: () => {}, // <-- ADD DEFAULT
  isLoading: true,
});

export const EntryProvider = ({ children }: PropsWithChildren) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // This function saves the current entries array to AsyncStorage
  const saveEntriesToStorage = async (updatedEntries: Entry[]) => {
    try {
      const jsonValue = JSON.stringify(updatedEntries);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error("Failed to save entries to storage", e);
    }
  };

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
        setIsLoading(false);
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

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    await saveEntriesToStorage(updatedEntries);
  };

  // --- NEW DELETE FUNCTION ---
  const deleteEntry = async (id: string) => {
    const updatedEntries = entries.filter((entry) => entry.id !== id);
    setEntries(updatedEntries);
    await saveEntriesToStorage(updatedEntries);
  };

  return (
    <EntryContext.Provider
      value={{ entries, addEntry, deleteEntry, isLoading }}
    >
      {children}
    </EntryContext.Provider>
  );
};

export const useEntries = () => {
  return useContext(EntryContext);
};
