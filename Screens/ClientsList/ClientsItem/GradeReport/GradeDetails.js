import { StyleSheet, Text, View } from "react-native";
import React from "react";
import fonts from "../../../../styles/fonts";

const GradeDetails = ({ title, grade }) => {
  return (
    <Text style={styles.subHeaderText}>
      {title}: <Text style={{ fontFamily: fonts.ABold }}>{grade}</Text>
    </Text>
  );
};

export default GradeDetails;

const styles = StyleSheet.create({
  subHeaderText: {
    alignSelf: "flex-start",
    textAlign: "left",
    fontFamily: fonts.ARegular,
  },
});
