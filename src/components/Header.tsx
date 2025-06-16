import { AppTheme, useAppTheme } from "@/context/ThemeContext";
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text, Icon } from "react-native-paper";

type ActionItem = string | string[];
type ActionHandler = (() => void) | (() => void)[];

interface HeaderProps {
  title?: string;
  leftIcon?: ActionItem;
  leftText?: ActionItem;
  leftAction?: ActionHandler;
  rightIcon?: ActionItem;
  rightText?: ActionItem;
  rightAction?: ActionHandler;
  alignTitle?: "left" | "center" | "right";
  bordered?: boolean;
  isHeadline?: boolean;
  isBold?: boolean;
}

/**
 * A fixed Header component for React Native applications.
 * It supports multiple left/right actions (icon/text) and a centered title.
 */
function Header({
  title,
  leftIcon,
  leftText,
  leftAction,
  rightIcon,
  rightText,
  rightAction,
  alignTitle = "center",
  bordered = false,
  isHeadline = false,
  isBold = false,
}: HeaderProps) {
  const theme = useAppTheme();
  const styles = stylesheet(theme, alignTitle);

  const hasLeftElements = leftIcon || leftText;
  const hasRightElements = rightIcon || rightText;
  return (
    <View
      style={[
        styles.headerContainer,
        bordered ? styles.borderedHeaderContainer : undefined,
        isHeadline ? { marginTop: 70, marginBottom: 15 } : undefined,
      ]}
    >
      {hasLeftElements && (
        <View style={styles.leftContainer}>
          <ActionElements
            icons={leftIcon}
            texts={leftText}
            actions={leftAction}
            styles={styles}
            theme={theme}
          />
        </View>
      )}

      <View style={styles.titleContainer}>
        <Text
          style={[styles.title, { fontWeight: isBold ? "bold" : "normal" }]}
          numberOfLines={1}
          variant={isHeadline ? "headlineSmall" : "titleLarge"}
        >
          {title}
        </Text>
      </View>

      {hasRightElements && (
        <View style={styles.rightContainer}>
          <ActionElements
            icons={rightIcon}
            texts={rightText}
            actions={rightAction}
            styles={styles}
            theme={theme}
          />
        </View>
      )}
    </View>
  );
}

interface ActionElementsProps {
  icons?: ActionItem;
  texts?: ActionItem;
  actions?: ActionHandler;
  styles: ReturnType<typeof stylesheet>;
  theme: AppTheme;
}

function ActionElements({
  icons,
  texts,
  actions,
  styles,
  theme,
}: ActionElementsProps) {
  const elements: React.ReactNode[] = [];

  const normalizedTexts = texts ? (Array.isArray(texts) ? texts : [texts]) : [];
  const normalizedIcons = icons ? (Array.isArray(icons) ? icons : [icons]) : [];
  const normalizedActions = actions
    ? Array.isArray(actions)
      ? actions
      : [actions]
    : [];

  let actionIndex = 0;

  normalizedTexts.forEach((text, index) => {
    elements.push(
      <TouchableOpacity
        key={`text-${text}-${index}`}
        onPress={normalizedActions[actionIndex]}
        style={styles.button}
      >
        <Text style={styles.buttonText} variant="labelLarge">
          {text}
        </Text>
      </TouchableOpacity>
    );
    actionIndex++;
  });

  normalizedIcons.forEach((icon, index) => {
    elements.push(
      <TouchableOpacity
        key={`icon-${icon}-${index}`}
        onPress={normalizedActions[actionIndex]}
      >
        <Icon source={icon} size={24} color={theme.colors.onSurface} />
      </TouchableOpacity>
    );
    actionIndex++;
  });

  return <>{elements}</>;
}

function stylesheet(theme: AppTheme, alignTitle: "left" | "center" | "right") {
  const titleAlign: { [key: string]: "left" | "center" | "right" } = {
    left: "left",
    center: "center",
    right: "right",
  };

  return StyleSheet.create({
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 15,
      height: 60,
      backgroundColor: theme.colors.background,
    },
    borderedHeaderContainer: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outline,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 1.5,
      elevation: 3,
    },
    leftContainer: {
      marginRight: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      gap: 10,
    },
    titleContainer: {
      flex: 2,
      justifyContent: "center",
      marginHorizontal: 5,
    },
    rightContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      gap: 10,
    },
    title: {
      color: theme.colors.onSurface,
      textAlign: titleAlign[alignTitle],
    },
    button: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 5,
      backgroundColor: theme.colors.primary,
    },
    buttonText: {
      color: theme.colors.onPrimary,
    },
  });
}

export default Header;
