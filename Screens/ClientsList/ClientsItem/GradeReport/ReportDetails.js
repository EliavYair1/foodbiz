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
      <GradeDetails
        title="כללי"
        grade={haveGrade ? lastReport.data.grade : null}
      />
      <GradeDetails
        title="בטיחות מזון"
        grade={haveNutritionGrade ? lastReport.data.nutritionGrade : null}
      />
      <GradeDetails
        title="ציון בטיחות"
        grade={haveSafetyGrade ? lastReport.data.safetyGrade : null}
      />
      <GradeDetails
        title="קולינארי"
        grade={haveCulinaryGrade ? lastReport.data.culinaryGrade : null}
      />
    </View>
  );
};

export default ReportDetails;

const styles = StyleSheet.create({});
