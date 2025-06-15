// src/components/ThemedText.tsx
import React from "react";
import { Text, TextProps } from "react-native";
import { useTheme } from "@/context/ThemeContext";

const ThemedText = ({ style, ...rest }: TextProps) => {
  const { colors } = useTheme();
  const textStyle = [{ color: colors.text }, style];
  return <Text style={textStyle} {...rest} />;
};

export default ThemedText;
