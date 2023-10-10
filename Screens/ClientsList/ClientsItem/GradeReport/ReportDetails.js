import { StyleSheet, Text, View } from "react-native";
import React from "react";
import GradeDetails from "./GradeDetails";
const ReportDetails = ({
  lastReport,
  haveGrade,
  haveNutritionGrade,
  haveSafetyGrade,
  haveCulinaryGrade,
  wrapperWidth,
}) => {
  // console.log("lastReport", lastReport);
  return (
    <View style={{ alignSelf: "center", width: wrapperWidth }}>
      {lastReport?.data.haveGrade && (
        <GradeDetails title="כללי" grade={lastReport?.data.grade} />
      )}
      {lastReport?.data.haveSafetyGrade && (
        <GradeDetails
          title="בטיחות מזון"
          grade={lastReport?.data.safetyGrade}
        />
      )}
      {lastReport?.data.haveCulinaryGrade && (
        <GradeDetails title="קולינארי" grade={lastReport?.data.culinaryGrade} />
      )}
      {lastReport?.data.haveNutritionGrade && (
        <GradeDetails title="תזונה" grade={lastReport?.data.nutritionGrade} />
      )}
    </View>
  );
};

export default ReportDetails;

const styles = StyleSheet.create({});
