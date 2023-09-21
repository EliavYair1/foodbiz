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
      toValue: open ? 100 : 0,
      duration: 250,
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
  container: {},
});

export default CategoryAccordion;
