// src/context/EntryContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  PropsWithChildren,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Entry, EntryCategory } from "@/types";
import { Ionicons } from "@expo/vector-icons";

// We import the static colors here to avoid a dependency cycle with ThemeContext
const LightColors = {
  primary: "#007AFF",
};

const STORAGE_KEY = "@glimpse_entries";

interface AddEntryPayload {
  title: string;
  content: string;
  imageUri?: string | null;
  location?: string | null;
  category?: EntryCategory;
}

interface EntryContextType {
  entries: Entry[];
  addEntry: (payload: AddEntryPayload) => void;
  deleteEntry: (id: string) => void;
  clearAllEntries: () => void;
  isLoading: boolean;
}

const EntryContext = createContext<EntryContextType>({
  entries: [],
  addEntry: () => {},
  deleteEntry: () => {},
  clearAllEntries: () => {},
  isLoading: true,
});

export const EntryProvider = ({ children }: PropsWithChildren) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const addEntry = async (payload: AddEntryPayload) => {
    const category = payload.category || "Personal";

    const newEntry: Entry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      title: payload.title,
      content: payload.content,
      imageUri: payload.imageUri || null,
      location: payload.location || null,
      category: category,
      icon: getIconForCategory(category),
      iconColor: LightColors.primary,
    };

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    await saveEntriesToStorage(updatedEntries);
  };

  const getIconForCategory = (
    category: EntryCategory
  ): keyof typeof Ionicons.glyphMap => {
    switch (category) {
      case "Travel":
        return "airplane-outline";
      case "Food":
        return "restaurant-outline";
      case "Work":
        return "briefcase-outline";
      default:
        return "book-outline";
    }
  };

  const deleteEntry = async (id: string) => {
    const updatedEntries = entries.filter((entry) => entry.id !== id);
    setEntries(updatedEntries);
    await saveEntriesToStorage(updatedEntries);
  };

  const clearAllEntries = async () => {
    try {
      setEntries([]);
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear entries from storage", e);
    }
  };

  return (
    <EntryContext.Provider
      value={{ entries, addEntry, deleteEntry, clearAllEntries, isLoading }}
    >
      {children}
    </EntryContext.Provider>
  );
};

export const useEntries = () => {
  return useContext(EntryContext);
};
