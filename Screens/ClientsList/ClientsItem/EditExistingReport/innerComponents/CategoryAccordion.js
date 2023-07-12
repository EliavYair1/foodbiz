import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  LayoutAnimation,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import colors from "../../../../../styles/colors";

const CategoryAccordion = ({ item }) => {
  const [open, setOpen] = useState(false);
  const heightAnim = useRef(new Animated.Value(0)).current;
  const [accordionBg, setAccordionBg] = useState(colors.white);

  const handleAccordionOpening = () => {
    setOpen((prevOpen) => !prevOpen);
    if (!open) {
      setAccordionBg(colors.accordionOpen);
    } else {
      setAccordionBg(colors.white);
    }
  };

  useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: open ? 350 : 0, // Adjust the expanded height as desired
      duration: 250, // Adjust the duration as desired
      useNativeDriver: false,
    }).start();
  }, [open, heightAnim]);

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handleAccordionOpening}>
        {item.component ? (
          item.component
        ) : (
          <View>
            {item.header}
            <Animated.View
              style={{
                overflow: "hidden",
                height: heightAnim,
                transitionProperty: "height",
                transitionDuration: "0.3s",
              }}
            >
              <View>{item.content}</View>
            </Animated.View>
          </View>
        )}
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // width: 762,
    // padding: 16,
    // borderWidth: 1,
    // borderRadius: 4,
    // borderColor: "rgba(83, 104, 180, 0.30)",
    // backgroundColor: accordionBg,
  },
});

export default CategoryAccordion;
