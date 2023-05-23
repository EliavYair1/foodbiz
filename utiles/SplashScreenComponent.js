import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import React from "react";
import { View, StyleSheet, Image, Dimensions, Text } from "react-native";
import colors from "../styles/colors";
const SplashScreenComponent = ({ onLoaded }) => {
  useEffect(() => {
    SplashScreen.preventAutoHideAsync(); // prevent the splash screen from hiding automatically
  }, []);

  const onLoad = () => {
    onLoaded();
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/imgs/background.png")}
        style={styles.image}
        onLoad={onLoad}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  image: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default SplashScreenComponent;
