import { AppTheme, useAppTheme } from "@/context/ThemeContext";
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text, Icon } from "react-native-paper";

type ActionItem = string | string[];
type ActionHandler = (() => void) | (() => void)[];

/**
 * A fixed Header component for React Native applications.
 * It supports multiple left/right actions (icon/text) and a centered title.
 */
const Header = ({
  title,
  leftIcon,
  leftText,
  leftAction,
  rightIcon,
  rightText,
  rightAction,
  alignTitle = "center",
  bordered = false,
}: {
  title?: string;
  leftIcon?: ActionItem;
  leftText?: ActionItem;
  leftAction?: ActionHandler;
  rightIcon?: ActionItem;
  rightText?: ActionItem;
  rightAction?: ActionHandler;
  alignTitle?: "left" | "center" | "right";
  bordered?: boolean;
}) => {
  const theme = useAppTheme();
  const styles = stylesheet(theme, alignTitle);

  const hasLeftElements = leftIcon || leftText;
  const hasRightElements = rightIcon || rightText;

  /**
   * Renders action elements (icons and texts) for one side of the header.
   */
  const renderActionElements = (
    icons?: ActionItem,
    texts?: ActionItem,
    actions?: ActionHandler
  ) => {
    const elements: React.ReactNode[] = [];

    const normalizedTexts = texts
      ? Array.isArray(texts)
        ? texts
        : [texts]
      : [];
    const normalizedIcons = icons
      ? Array.isArray(icons)
        ? icons
        : [icons]
      : [];
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

    return elements;
  };

  return (
    <View
      style={[
        styles.headerContainer,
        bordered ? styles.borderedHeaderContainer : undefined,
      ]}
    >
      {hasLeftElements ? (
        <View style={styles.leftContainer}>
          {renderActionElements(leftIcon, leftText, leftAction)}
        </View>
      ) : null}

      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>

      {hasRightElements ? (
        <View style={styles.rightContainer}>
          {renderActionElements(rightIcon, rightText, rightAction)}
        </View>
      ) : null}
    </View>
  );
};

// Pass alignTitle to stylesheet function
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
      flex: 1,
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
      fontSize: 18,
      fontWeight: "bold",
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
