import { StyleSheet, Text, View, Dimensions, Platform } from "react-native";
import React from "react";
import colors from "../../../../../styles/colors";
import fonts from "../../../../../styles/fonts";
const windowWidth = Dimensions.get("screen").width;
const smallDevice = windowWidth < 800;
const ReportGrade = ({
  reportGradeText,
  reportGradeBoxColor,
  reportGradeNumber,
}) => {
  // console.log(Platform.OS, windowWidth);
  const styles = StyleSheet.create({
    gradeContainer: {
      flexDirection: "column",
    },
    gradeText: {
      textAlign: "center",
      marginBottom: 4,
    },
    gradeBox: {
      width: smallDevice ? 215 : 235,
      backgroundColor: reportGradeBoxColor,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 8,
    },
    gradeBoxText: {
      fontSize: 24,
      fontFamily: fonts.ABold,
      color: colors.white,
    },

    grade: {},
  });
  return (
    <View style={styles.gradeContainer}>
      <Text style={styles.gradeText}>{reportGradeText}</Text>
      <View style={styles.gradeBox}>
        <Text style={styles.gradeBoxText}>{reportGradeNumber}</Text>
      </View>
    </View>
  );
};

export default ReportGrade;
