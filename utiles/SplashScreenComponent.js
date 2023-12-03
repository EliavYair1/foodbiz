import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import React from "react";
import { View, StyleSheet, Dimensions, ImageBackground } from "react-native";
import colors from "../styles/colors";
import Loader from "./Loader";
const SplashScreenComponent = React.memo(({ onLoaded, loading }) => {
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  const onLoad = () => {
    onLoaded();
  };
  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.backgroundImage}
        source={require("../assets/imgs/maskBackground.png")}
        onLoad={onLoad}
      >
        <Loader visible={loading} color={colors.blue} isSetting={true} />
      </ImageBackground>
    </View>
  );
});
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
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
});

export default SplashScreenComponent;
