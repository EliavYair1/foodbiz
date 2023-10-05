import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../../../../../styles/colors";
import fonts from "../../../../../styles/fonts";
const ReportCard = ({
  onChangeGrade = false,
  fsGrade,
  cGrade,
  nGrade,
  reportGrade,
  gradesCondition,
}) => {
  console.log(gradesCondition);
  return (
    <View style={styles.reportGradeBox}>
      <View style={styles.reportGradesWrapper}>
        {gradesCondition.map((header, index) => {
          if (header == "ביקורת בטיחות מזון") {
            return fsGrade > 0 ? (
              <View key={index}>
                <Text style={styles.gradeHeader}>ציון ביקורת בטיחות מזון</Text>
                <View style={styles.grade}>
                  <Text style={styles.gradeScore}>{fsGrade}</Text>
                </View>
              </View>
            ) : null;
          } else if (header == "ביקורת קולינארית") {
            return cGrade > 0 ? (
              <View key={index}>
                <Text style={styles.gradeHeader}>
                  ציון ביקורת בטיחות קולינארית
                </Text>
                <View style={styles.grade}>
                  <Text style={styles.gradeScore}>{cGrade}</Text>
                </View>
              </View>
            ) : null;
          } else if (header == "ביקורת תזונה") {
            return nGrade > 0 ? (
              <View key={index}>
                <Text style={styles.gradeHeader}>ציון ביקורת תזונה</Text>
                <View style={styles.grade}>
                  <Text style={styles.gradeScore}>{nGrade}</Text>
                </View>
              </View>
            ) : null;
          } else {
            return null;
          }
        })}
      </View>
      <View style={styles.reportGradeWrapper}>
        <Text style={styles.gradeHeader}>ציון לדוח</Text>
        <View style={styles.reportGrade}>
          <Text style={styles.gradeScore}>{reportGrade}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  reportGradeBox: {
    flexDirection: "column",
    width: "100%",
    paddingHorizontal: 16,
  },
  reportGradesWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  gradeHeader: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    textAlign: "center",
    fontSize: 18,
    fontFamily: fonts.ABold,
  },
  grade: {
    marginBottom: 16,
    width: 203,
    backgroundColor: "#D3E0FF",
    paddingHorizontal: 20,
    paddingVertical: 13,
  },
  reportGradeWrapper: {
    alignItems: "center",
  },
  reportGrade: {
    justifyContent: "center",
    alignSelf: "center",
    width: 722,
    backgroundColor: "#D3E0FF",
    paddingHorizontal: 20,
    paddingVertical: 13,
  },
  gradeScore: {
    color: colors.black,
    textAlign: "center",
    fontFamily: fonts.ABold,
    fontSize: 24,
  },
});

export default ReportCard;
