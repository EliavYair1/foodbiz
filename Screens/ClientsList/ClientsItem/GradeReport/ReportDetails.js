import { StyleSheet, Text, View } from "react-native";
import React from "react";
import GradeDetails from "./GradeDetails";
const ReportDetails = ({ lastReport, wrapperWidth }) => {
  // console.log("lastReport", lastReport);
  if (!lastReport) {
    return <View style={{ alignSelf: "center", width: wrapperWidth }}></View>;
  }
  return (
    <View style={{ alignSelf: "center", width: wrapperWidth }}>
      {lastReport.getData("haveGrade") && (
        <GradeDetails title="כללי" grade={lastReport.getData("grade")} />
      )}
      {lastReport.getData("haveSafetyGrade") && (
        <GradeDetails
          title="בטיחות מזון"
          grade={lastReport.getData("safetyGrade")}
        />
      )}
      {lastReport.getData("haveCulinaryGrade") && (
        <GradeDetails
          title="קולינארי"
          grade={lastReport.getData("culinaryGrade")}
        />
      )}
      {lastReport.getData("haveNutritionGrade") && (
        <GradeDetails
          title="תזונה"
          grade={lastReport.getData("nutritionGrade")}
        />
      )}
    </View>
  );
};

export default ReportDetails;
