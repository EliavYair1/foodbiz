import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import fonts from "../../styles/fonts";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../../styles/colors";
export default function Button({
  buttonFunction,
  buttonStyle,
  disableLogic,
  buttonTextStyle,
  buttonText,
  icon = false,
  iconName,
  iconSize,
  IconColor,
  buttonWidth,
}) {
  const styles = StyleSheet.create({
    button: {
      width: buttonWidth,
      opacity: disableLogic ? 0.4 : 1,
      justifyContent: "center",
      alignSelf: "center",
      alignItems: "center",
      flexDirection: "row",
      gap: 8,
    },
    text: {
      textAlign: "center",
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
      fontFamily: fonts.AMedium,
    },
  });
  return (
    <TouchableOpacity
      style={[buttonStyle, styles.button]}
      onPress={() => buttonFunction()}
      disabled={disableLogic}
    >
      {icon && <Icon name={iconName} color={IconColor} size={iconSize} />}

      <Text style={[buttonTextStyle, styles.text]}>{buttonText}</Text>
    </TouchableOpacity>
  );
}
