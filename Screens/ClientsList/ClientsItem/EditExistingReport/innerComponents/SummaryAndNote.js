import { StyleSheet, Text, View } from "react-native";
import React, { useRef, useState, useEffect } from "react";
import fonts from "../../../../../styles/fonts";
import colors from "../../../../../styles/colors";
const SummaryAndNote = ({
  header,
  summaryAndNoteContent = false,
  height,
  verticalSpace = false,
  headerStyling = false,
}) => {
  //   const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef(null);
  useEffect(() => {
    // if (contentRef.current) {
    //   contentRef.current.measure((x, y, width, height) => {
    //     setContentHeight(height);
    //   });
    // }
  }, [height]);
  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <Text style={[styles.headerStyle, headerStyling ?? ""]}>{header}</Text>
      </View>

      <View
        style={[
          styles.contentWrapper,
          { height: height, paddingTop: verticalSpace },
        ]}
        ref={contentRef}
      >
        {summaryAndNoteContent}
      </View>
    </View>
  );
};

export default SummaryAndNote;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
    width: "100%",
    justifyContent: "flex-start",
    marginBottom: 16,
    paddingBottom: 16,
  },
  headerWrapper: {
    backgroundColor: colors.royalBlue,
    padding: 16,
  },
  headerStyle: {
    fontSize: 18,
    fontFamily: fonts.ABold,
    color: colors.white,
    textAlign: "right",
    alignSelf: "flex-start",
  },
  contentWrapper: {
    borderWidth: 1,
    // borderColor: "rgba(69, 102, 185, 0.10)",
    // paddingVertical: 16,
    borderColor: colors.black,
  },
});
