import { AppTheme, useAppTheme } from "@/context/ThemeContext";
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text, Icon } from "react-native-paper";

/**
 * A fixed Header component for React Native applications.
 * It supports left actions (icon/text), a centered title,
 * and multiple right actions (icons/text).
 */
const Header = ({
  title,
  leftIcon,
  leftText,
  leftAction,
  rightIcons,
  rightTexts,
  rightActions,
  alignTitle = "center",
  bordered = false,
}: {
  title?: string;
  leftIcon?: string;
  leftText?: string;
  leftAction?: () => void;
  rightIcons?: string[];
  rightTexts?: string[];
  rightActions?: (() => void)[];
  alignTitle?: "left" | "center" | "right";
  bordered?: boolean;
}) => {
  const theme = useAppTheme();
  const styles = stylesheet(theme, alignTitle);

  const renderRightElements = () => {
    const elements: React.ReactNode[] = [];

    if (rightTexts && rightActions) {
      rightTexts.forEach((text, index) => {
        elements.push(
          <TouchableOpacity
            key={`right-text-${index}`}
            onPress={rightActions[index]}
            style={styles.button}
          >
            <Text style={styles.buttonText} variant="labelLarge">
              {text}
            </Text>
          </TouchableOpacity>
        );
      });
    }

    if (rightIcons && rightActions) {
      rightIcons.forEach((icon, index) => {
        if (rightActions[rightTexts ? rightTexts.length + index : index]) {
          elements.push(
            <TouchableOpacity
              key={`right-icon-${index}`}
              onPress={
                rightActions[rightTexts ? rightTexts.length + index : index]
              }
            >
              <Icon source={icon} size={24} color={theme.colors.onSurface} />
            </TouchableOpacity>
          );
        }
      });
    }
    return elements;
  };

  return (
    <View
      style={[
        styles.headerContainer,
        bordered ? styles.borderedHeaderContainer : undefined,
      ]}
    >
      {leftIcon || leftText ? (
        <View style={styles.leftContainer}>
          {leftText && (
            <TouchableOpacity onPress={leftAction} style={styles.button}>
              <Text style={styles.buttonText} variant="labelLarge">
                {leftText}
              </Text>
            </TouchableOpacity>
          )}
          {leftIcon && (
            <TouchableOpacity onPress={leftAction}>
              <Icon
                source={leftIcon}
                size={24}
                color={theme.colors.onSurface}
              />
            </TouchableOpacity>
          )}
        </View>
      ) : null}

      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.rightContainer}>{renderRightElements()}</View>
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

  const styles = StyleSheet.create({
    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
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
    },
    titleContainer: {
      flex: 2,
      justifyContent: "center",
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
  return styles;
}

export default Header;
