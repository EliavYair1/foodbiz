import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  Image,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import FileIcon from "../../assets/icons/iconImgs/FileIcon.png";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
const Drawer = ({ content, height, onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const animatedHeight = useSharedValue(0);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
    animatedHeight.value = withSpring(isOpen ? 0 : height, {
      damping: 15,
      stiffness: 150,
    });
    onToggle(!isOpen);
  };

  const closeDrawer = () => {
    setIsOpen(false);
    animatedHeight.value = withSpring(0, {
      damping: 15,
      stiffness: 150,
    });
    onToggle(false);
  };

  const drawerStyle = useAnimatedStyle(() => {
    return {
      height: animatedHeight.value,
    };
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      //   height: height,
    },
    overlay: {
      height: 76,
      //   flex: !isOpen ? 1 : 0,
      //   backgroundColor: "rgba(0, 0, 0, 0.5)",
      //   marginTop: 350,
    },
    drawer: {
      //   backgroundColor: "white",
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      //   padding: 16,
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

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={toggleDrawer}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <Animated.View style={[styles.drawer, drawerStyle]}>
        {content}
        <TouchableOpacity style={styles.closeButton} onPress={closeDrawer}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default Drawer;
