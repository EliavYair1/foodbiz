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
  return (
    <View style={{ alignSelf: "center", width: wrapperWidth }}>
      {haveGrade && <GradeDetails title="כללי" grade={lastReport.data.grade} />}
      {haveSafetyGrade && (
        <GradeDetails title="בטיחות מזון" grade={lastReport.data.safetyGrade} />
      )}
      {haveCulinaryGrade && (
        <GradeDetails title="קולינארי" grade={lastReport.data.culinaryGrade} />
      )}
      {haveNutritionGrade && (
        <GradeDetails title="תזונה" grade={lastReport.data.nutritionGrade} />
      )}
    </View>
  );
};

export default ReportDetails;

const styles = StyleSheet.create({});
