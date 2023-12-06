import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState, useRef, useCallback } from "react";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import { FlatList } from "react-native-gesture-handler";
import { Divider } from "react-native-paper";
import uuid from "uuid-random";
import DraggableFlatList from "react-native-draggable-flatlist";

const Accordion = ({
  headerText,
  contentText,
  headerHeight,
  contentHeight,
  headerTogglerStyling,
  iconDisplay,
  boxHeight = false,
  accordionContent,
  boxItem,
  contentItemStyling,
  hasDivider,
  headerTextStyling = false,
  accordionOpenIndicator,
  accordionCloseIndicator,
  scrollEnabled = false,
  toggleHandler = false,
  iconText,
  draggable = false,
  onDragEndCb,
}) => {
  const [open, setOpen] = useState(false);

  const handleAccordionOpening = useCallback(() => {
    setOpen((prevOpen) => !prevOpen);
    if (toggleHandler) {
      toggleHandler(contentHeight, !open);
    }
  }, [open, toggleHandler, contentHeight]);
  const contentRef = useRef();
  const heightAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: open ? contentHeight : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [open, heightAnim, contentHeight]);

  const renderAccordionItem = useCallback(
    ({ item, index, drag, isActive }) => {
      return (
        <TouchableOpacity style={{}} onLongPress={drag}>
          <View
            style={[styles.contentBox, contentItemStyling ?? ""]}
            key={item.id}
          >
            {item.text && <View>{item.text}</View>}
            {item.boxItem}
          </View>
          {hasDivider && <Divider />}
        </TouchableOpacity>
      );
    },
    [contentItemStyling, hasDivider]
  );

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.headerTogglerStyle,
          headerTogglerStyling ?? "",
          { height: headerHeight },
        ]}
        onPress={handleAccordionOpening}
      >
        <Text style={[styles.headerText, headerTextStyling]}>{headerText}</Text>
        {iconDisplay && (
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
            }}
          >
            {iconText && (
              <Text
                style={{
                  fontFamily: fonts.ARegular,
                  fontSize: 16,
                  alignSelf: "center",
                }}
              >
                {iconText}
              </Text>
            )}
            <Image
              style={styles.icon}
              source={open ? accordionOpenIndicator : accordionCloseIndicator}
            />
          </View>
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
          {/* {draggable && Array.isArray(accordionContent) ? (
            <DraggableFlatList
              data={accordionContent}
              renderItem={renderAccordionItem}
              keyExtractor={(item, index) => `draggable-item${index}`}
              onDragEnd={onDragEndCb}
            />
          ) : (
            <FlatList
              scrollEnabled={scrollEnabled}
              key={() => uuid()}
              data={accordionContent}
              renderItem={renderAccordionItem}
            />
          )} */}
          {Array.isArray(accordionContent) && accordionContent.length > 0 ? (
            <DraggableFlatList
              data={accordionContent}
              renderItem={renderAccordionItem}
              keyExtractor={(item, index) => `draggable-item${index}`}
              onDragEnd={onDragEndCb}
            />
          ) : (
            <Text>No content available</Text>
          )}
        </View>
      </Animated.View>
    </View>
  );
};
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
    flex: 1,
    backgroundColor: colors.white,
    // height: "100%",
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
    // flex: 1,
  },
  contentText: {
    textAlign: "left",
  },
});
export default React.memo(Accordion);
