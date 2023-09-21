import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import fonts from "../../styles/fonts";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../../styles/colors";
import { HelperText } from "react-native-paper";
export default function Button({
  buttonFunction,
  buttonStyle,
  disableLogic,
  buttonTextStyle,
  buttonText,
  icon = false,
  buttonWidth,
  iconStyle,
  iconPath,
  errorMessage = false,
  isCameraButton = false,
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
      borderColor: errorMessage ? "#b3261e" : null,
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
    <>
      <View style={{ flexDirection: "column" }}>
        <TouchableOpacity
          style={[buttonStyle, styles.button]}
          onPress={() => buttonFunction()}
          disabled={disableLogic}
        >
          {icon && <Image style={iconStyle ?? ""} source={iconPath} />}

          <Text style={[buttonTextStyle, styles.text]}>{buttonText}</Text>
        </TouchableOpacity>
        {errorMessage && (
          <HelperText
            type="error"
            style={{
              fontFamily: fonts.AMedium,
              backgroundColor: "white",
              borderColor: "transparent",
            }}
          >
            {errorMessage}
          </HelperText>
        )}
      </View>
    </>
  );
}
