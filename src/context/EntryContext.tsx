import React, {
  createContext,
  useState,
  useContext,
  PropsWithChildren,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Entry, EntryCategory } from "@/types";

const LightColors = {
  primary: "#007AFF",
};

const ENTRIES_STORAGE_KEY = "@glimpse_entries";
const CATEGORIES_STORAGE_KEY = "@glimpse_categories";

const DEFAULT_CATEGORIES: EntryCategory[] = [
  "Personal",
  "Travel",
  "Food",
  "Work",
];

interface AddEntryPayload {
  title: string;
  content: string;
  imageUri?: string | null;
  location?: string | null;
  category?: EntryCategory;
}

interface EntryContextType {
  entries: Entry[];
  categories: EntryCategory[];
  addEntry: (payload: AddEntryPayload) => void;
  deleteEntry: (id: string) => void;
  clearAllEntries: () => void;
  addCategory: (categoryName: string) => Promise<void>;
  isLoading: boolean;
}

const EntryContext = createContext<EntryContextType>({
  entries: [],
  categories: [],
  addEntry: () => {},
  deleteEntry: () => {},
  clearAllEntries: () => {},
  addCategory: async () => {},
  isLoading: true,
});

export const EntryProvider = ({ children }: PropsWithChildren) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [categories, setCategories] = useState<EntryCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const saveEntriesToStorage = async (updatedEntries: Entry[]) => {
    try {
      const jsonValue = JSON.stringify(updatedEntries);
      await AsyncStorage.setItem(ENTRIES_STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error("Failed to save entries to storage", e);
    }
  };

  const saveCategoriesToStorage = async (
    updatedCategories: EntryCategory[]
  ) => {
    try {
      const jsonValue = JSON.stringify(updatedCategories);
      await AsyncStorage.setItem(CATEGORIES_STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error("Failed to save categories to storage", e);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedEntries = await AsyncStorage.getItem(ENTRIES_STORAGE_KEY);
        if (storedEntries) {
          setEntries(JSON.parse(storedEntries));
        }

        const storedCategories = await AsyncStorage.getItem(
          CATEGORIES_STORAGE_KEY
        );
        if (storedCategories) {
          setCategories(JSON.parse(storedCategories));
        } else {
          setCategories(DEFAULT_CATEGORIES);
          await saveCategoriesToStorage(DEFAULT_CATEGORIES);
        }
      } catch (e) {
        console.error("Failed to load data from storage", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const addCategory = async (categoryName: string) => {
    const trimmedName = categoryName.trim();
    if (!trimmedName) {
      return;
    }
    const lowerCaseCategories = categories.map((c) => c.toLowerCase());
    if (lowerCaseCategories.includes(trimmedName.toLowerCase())) {
      return;
    }

    const updatedCategories = [...categories, trimmedName];
    setCategories(updatedCategories);
    await saveCategoriesToStorage(updatedCategories);
  };

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

  const getIconForCategory = (category: EntryCategory): string => {
    switch (category.toLowerCase()) {
      case "travel":
        return "airplane";
      case "food":
        return "silverware-fork-knife";
      case "work":
        return "briefcase-outline";
      default:
        return "notebook-outline";
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
      await AsyncStorage.removeItem(ENTRIES_STORAGE_KEY);
      setCategories(DEFAULT_CATEGORIES);
      await saveCategoriesToStorage(DEFAULT_CATEGORIES);
    } catch (e) {
      console.error("Failed to clear entries from storage", e);
    }
  };

  return (
    <EntryContext.Provider
      value={{
        entries,
        categories,
        addEntry,
        addCategory,
        deleteEntry,
        clearAllEntries,
        isLoading,
      }}
    >
      {children}
    </EntryContext.Provider>
  );
};

export const useEntries = () => {
  return useContext(EntryContext);
};
