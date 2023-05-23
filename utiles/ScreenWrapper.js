import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { LinearGradient } from "expo-linear-gradient";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import React from "react";
const ScreenWrapper = ({
  children,
  isForm = false,
  edges = ["top", "right", "bottom", "left"],
  wrapperStyle,
  isConnectedUser = false,
}) => {
  const renderBackground = () => {
    if (isConnectedUser) {
      return (
        <ImageBackground
          style={styles.backgroundImage}
          source={require("../assets/imgs/background.png")}
        >
          {children}
        </ImageBackground>
      );
    }

    return children;
  };
  const WrapperComponent = isForm ? KeyboardAwareScrollView : View;

  return (
    <>
      <SafeAreaView edges={edges} style={styles.container}>
        <WrapperComponent style={[styles.contentWrapper, wrapperStyle]}>
          {renderBackground()}
        </WrapperComponent>
      </SafeAreaView>
    </>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
