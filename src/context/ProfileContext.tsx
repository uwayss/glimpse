// src/context/ProfileContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  PropsWithChildren,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// The key we'll use to save the profile data on the device
const PROFILE_STORAGE_KEY = "@glimpse_profile";

interface Profile {
  name: string;
  username: string;
  joinDate: string;
  avatarColor: string;
  avatarIconColor: string;
}

interface ProfileContextType {
  profile: Profile | null;
  updateProfile: (newProfileData: Partial<Profile>) => void;
  isLoading: boolean;
}

// A default profile for the first time the app is launched
const defaultProfile: Profile = {
  name: "Ethan Carter",
  username: "@ethan.carter",
  joinDate: "Joined 2024",
  avatarColor: "#DDBDF1",
  avatarIconColor: "#5E2D8C",
};

const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  updateProfile: () => {},
  isLoading: true,
});

export const ProfileProvider = ({ children }: PropsWithChildren) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
        if (storedProfile) {
          setProfile(JSON.parse(storedProfile));
        } else {
          // If no profile is stored, save and set the default one
          setProfile(defaultProfile);
          await AsyncStorage.setItem(
            PROFILE_STORAGE_KEY,
            JSON.stringify(defaultProfile)
          );
        }
      } catch (e) {
        console.error("Failed to load profile from storage", e);
        // Fallback to default profile on error
        setProfile(defaultProfile);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const updateProfile = async (newProfileData: Partial<Profile>) => {
    if (!profile) return;
    try {
      const updatedProfile = { ...profile, ...newProfileData };
      setProfile(updatedProfile);
      const jsonValue = JSON.stringify(updatedProfile);
      await AsyncStorage.setItem(PROFILE_STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error("Failed to save profile to storage", e);
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, isLoading }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  return useContext(ProfileContext);
};
