import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import accordionCloseIndicator from "../../assets/imgs/accordionCloseIndicator.png";
import accordionOpenIndicator from "../../assets/imgs/accordionOpenIndicator.png";
// const Expander = ({ header, content }) => {
//   const [open, setOpen] = useState(false);
//   const contentRef = useRef();
//   const heightAnim = useRef(new Animated.Value(0)).current;
//   const handleAccordionOpening = () => {
//     setOpen(!open);
//   };

//   // accordion animation
//   useEffect(() => {
//     Animated.timing(heightAnim, {
//       toValue: open ? 300 : 0,
//       duration: 250,
//       useNativeDriver: false,
//     }).start();
//   }, [open, heightAnim]);

//   return (
//     <View>
//       <TouchableOpacity
//         style={[styles.headerTogglerStyle]}
//         onPress={handleAccordionOpening}
//       >
//         {header}
//       </TouchableOpacity>
//       <Animated.View
//         ref={contentRef}
//         style={[
//           {
//             overflow: "hidden",
//             transitionProperty: "max-height",
//             transitionDuration: "0.3s",
//           },
//           { height: heightAnim },
//         ]}
//       >
//         <View style={[styles.contentWrapper]}>{content}</View>
//       </Animated.View>
//     </View>
//   );
// };

const Expander = ({ header, content }) => {
  const [expanded, setExpanded] = useState(false);
  const contentHeight = useRef(new Animated.Value(0)).current;

  const toggleAccordion = () => {
    if (expanded) {
      Animated.timing(contentHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(contentHeight, {
        toValue: 1, // Set the desired expanded height scale factor (e.g., 1 for full height)
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
    setExpanded(!expanded);
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleAccordion}>
        <Text>{header}</Text>
      </TouchableOpacity>
      <Animated.View
        style={{
          overflow: "hidden",
          height: contentHeight.interpolate({
            inputRange: [0, 1],
            outputRange: ["0%", "100%"],
          }),
        }}
      >
        {content}
      </Animated.View>
    </View>
  );
};

export default Expander;

const styles = StyleSheet.create({
  headerTogglerStyle: {
    backgroundColor: colors.white,
    // padding: 20,
    marginVertical: 1,
    flexDirection: "row",
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "space-between",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  headerText: {
    alignItems: "center",
    color: colors.white,
    fontFamily: fonts.ABold,
    fontSize: 18,
  },
  contentWrapper: {
    backgroundColor: colors.white,
    height: "100%",
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  icon: {
    width: 20,
    height: 20,
  },
  contentBox: {
    flexDirection: "row",
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "space-between",
  },
  contentText: {
    textAlign: "left",
  },
});
