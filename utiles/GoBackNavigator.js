import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import useScreenNavigator from "../Hooks/useScreenNavigator";
import fonts from "../styles/fonts";
const GoBackNavigator = ({ text, containerStyling, onBackPress = false }) => {
  const { navigateTogoBack, navigateToRoute } = useScreenNavigator();
  const handleNavigation = () => {
    if (onBackPress) {
      onBackPress();
    }
    navigateTogoBack();
  };
  return (
    <View style={[styles.container, containerStyling ?? ""]}>
      <TouchableOpacity onPress={handleNavigation}>
        <Image
          source={require("../assets/imgs/rightDirIcon.png")}
          style={styles.goBackIcon}
        />
      </TouchableOpacity>
      <Text style={styles.goBackText}>{text}</Text>
    </View>
  );
};

export default GoBackNavigator;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
  },
  goBackText: {
    fontSize: 14,
    fontFamily: fonts.ARegular,
  },
  goBackIcon: { width: 20, height: 20 },
});
