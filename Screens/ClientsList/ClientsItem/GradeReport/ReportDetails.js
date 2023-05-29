import { StyleSheet, Text, View } from "react-native";
import React from "react";
import GradeDetails from "./GradeDetails";
const ReportDetails = ({
  lastReport,
  haveGrade,
  haveNutritionGrade,
  haveSafetyGrade,
  haveCulinaryGrade,
}) => {
  return (
    <View style={{ alignSelf: "center", width: "15%" }}>
      {haveGrade && <GradeDetails title="כללי" grade={lastReport.data.grade} />}
      {haveNutritionGrade && (
        <GradeDetails
          title="בטיחות מזון"
          grade={lastReport.data.nutritionGrade}
        />
      )}
      {haveSafetyGrade && (
        <GradeDetails title="ציון בטיחות" grade={lastReport.data.safetyGrade} />
      )}
      {haveCulinaryGrade && (
        <GradeDetails title="קולינארי" grade={lastReport.data.culinaryGrade} />
      )}
    </View>
  );
};

export default ReportDetails;

const styles = StyleSheet.create({});
