import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
// import accordionCloseIndicator from "../../assets/imgs/accordionCloseIndicator.png";
// import accordionOpenIndicator from "../../assets/imgs/accordionOpenIndicator.png";
import { FlatList } from "react-native-gesture-handler";
import { Divider } from "react-native-paper";
import uuid from "uuid-random";
const Accordion = ({
  headerText,
  contentText,
  headerHeight,
  contentHeight,
  headerTogglerStyling,
  iconDisplay,
  boxHeight = false,
  accordionContentData,
  boxItem,
  contentItemStyling,
  hasDivider,
  headerTextStyling = false,
  accordionOpenIndicator,
  accordionCloseIndicator,
  scrollEnabled = false,
  toggleHandler = false,
}) => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    console.log(contentHeight);
  }, []);
  const handleAccordionOpening = () => {
    setOpen(!open);
    if (toggleHandler) {
      toggleHandler(contentHeight, !open);
    }
  };
  const contentRef = useRef();
  const heightAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (open) {
      contentRef.current.measure((_, measuredHeight) => {
        Animated.timing(heightAnim, {
          toValue: contentHeight,
          duration: 250,
          useNativeDriver: false,
        }).start();
      });
    } else {
      Animated.timing(heightAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start();
    }
  }, [open, heightAnim, contentHeight]);
  const styles = StyleSheet.create({
    headerTogglerStyle: {
      backgroundColor: colors.white,
      // padding: 20,
      marginVertical: 1,
      flexDirection: "row",
      height: headerHeight,
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
      // height: boxHeight,
      // paddingHorizontal: 16,
      // alignItems: "center",
      justifyContent: "space-between",
    },
    contentText: {
      textAlign: "left",
    },
  });

  const renderAccordionItem = ({ item }) => {
    return (
      <>
        <View
          style={[styles.contentBox, contentItemStyling ?? ""]}
          key={item.id}
        >
          {item.text && <View>{item.text}</View>}
          {item.boxItem}
        </View>
        {hasDivider && <Divider />}
      </>
    );
  };

  return (
    <View>
      <TouchableOpacity
        style={[styles.headerTogglerStyle, headerTogglerStyling ?? ""]}
        onPress={handleAccordionOpening}
      >
        <Text style={[styles.headerText, headerTextStyling]}>{headerText}</Text>
        {iconDisplay && (
          <Image
            style={styles.icon}
            source={open ? accordionOpenIndicator : accordionCloseIndicator}
          />
        )}
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
        <View style={[styles.contentWrapper]}>
          <FlatList
            scrollEnabled={scrollEnabled}
            key={() => uuid()}
            data={accordionContentData}
            renderItem={renderAccordionItem}
          />
        </View>
      </Animated.View>
    </View>
  );
};

export default Accordion;
