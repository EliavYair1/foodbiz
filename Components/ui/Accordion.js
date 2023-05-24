import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import { List, Divider } from "react-native-paper";
import fonts from "../../styles/fonts";
import colors from "../../styles/colors";
import Tabs from "./Tabs";

const Accordion = ({
  items,
  children,
  contentHeight,
  accordionSection,
  accordionSectionHeight,
  headerContent,
}) => {
  const [open, setOpen] = useState(false);
  const contentRef = useRef();
  const heightAnim = useRef(new Animated.Value(0)).current;
  const arrayOfTabs = ["דוחות", "קבצים", "בעלי גישה"];
  const [activeTab, setActiveTab] = useState(arrayOfTabs[0]);

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };
  useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: open ? 320 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [open, heightAnim]);

  const handleClick = () => {
    setOpen(!open);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    accordionContainer: {
      backgroundColor: colors.white,
      // padding: 20,
      marginVertical: 1,
      flexDirection: "row",
      alignItems: "center",
      height: accordionSectionHeight,
      // paddingHorizontal: tablePadding,
    },
    header: {
      fontSize: 24,
      fontWeight: fonts.ABold,
      marginBottom: 16,
    },
  });

  const AccordionHeader = () => {
    return (
      <View>
        {headerContent}
        <Divider />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.accordionContainer} onPress={handleClick}>
        <AccordionHeader />
        <View style={{ alignSelf: "center", width: 52 }}>
          <Text>{open ? "v" : "^"}</Text>
        </View>
      </TouchableOpacity>
      <Animated.View
        ref={contentRef}
        style={[
          {
            overflow: "hidden",
            transitionProperty: "max-height",
            transitionDuration: "0.3s",
          },
          { height: heightAnim },
        ]}
      >
        <View style={{ height: contentHeight, backgroundColor: colors.white }}>
          {children}
          <Divider />
        </View>
      </Animated.View>
    </View>
  );
};

export default Accordion;
