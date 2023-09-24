import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import ScreenWrapper from "./ScreenWrapper";

const Loader = ({
  visible,
  loaderWrapperStyle,
  color,
  size,
  loaderStyling,
  isSetting,
}) => {
  if (!visible) {
    return null;
  }

  return (
    <ScreenWrapper isConnectedUser={isSetting}>
      <View style={[styles.container, loaderWrapperStyle]}>
        <ActivityIndicator
          animating={true}
          color={color}
          size={size}
          style={loaderStyling}
        />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Loader;
