import { LinearGradient } from "expo-linear-gradient";
import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";

import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  Image,
  Animated,
  Platform,
  SafeAreaView,
} from "react-native";
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withSpring,
// } from "react-native-reanimated";
import FileIcon from "../../assets/icons/iconImgs/FileIcon.png";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import { FlatList } from "react-native-gesture-handler";

const Drawer = (
  { content, height, onToggle, onClose = false, header, contentStyling },
  ref
) => {
  const [isOpen, setIsOpen] = useState(false);
  const animatedHeight = new Animated.Value(0);

  useEffect(() => {
    if (isOpen) {
      Animated.spring(animatedHeight, {
        toValue: height,
        damping: 15,
        stiffness: 100,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.spring(animatedHeight, {
        toValue: 0,
        damping: 15,
        stiffness: 100,
        useNativeDriver: false,
      }).start(() => {
        onToggle(false);
      });
    }
  }, [isOpen, height]);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
    onToggle(!isOpen);
  };

  useImperativeHandle(ref, () => ({
    toggleDrawer
  }));

  const drawerStyle = {
    height: animatedHeight,
  };

  const renderItem = ({ item }) => {
    return <View>{item}</View>;
  };

  return (
    <>
      {Platform.OS === "ios" ? (
        <SafeAreaView style={styles.container}>
          <Animated.View style={[styles.drawer, drawerStyle]} ref={ref}>
            {header}
            <View style={[{ width: "100%" }, contentStyling ?? ""]}>
              {Array.isArray(content) ? (
                <FlatList
                  data={content}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => index.toString()}
                />
              ) : (
                content
              )}
            </View>
          </Animated.View>
        </SafeAreaView>
      ) : (
        <View style={styles.container}>
          <Animated.View style={[styles.drawer, drawerStyle]} ref={ref}>
            {header}
            <View style={[{ width: "100%" }, contentStyling ?? ""]}>
              {Array.isArray(content) ? (
                <FlatList
                  data={content}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => index.toString()}
                />
              ) : (
                content
              )}
            </View>
          </Animated.View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  drawer: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    alignItems: "center",
  },
  closeButton: {
    alignSelf: "center",
    justifyContent: "center",
    padding: 8,
  },
  closeButtonText: {
    fontSize: 16,
    color: "black",
  },
});

export default React.forwardRef(Drawer);
