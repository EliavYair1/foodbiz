import GradeDetails from "./GradeDetails";
import { StyleSheet, Text, View } from "react-native";
import React from "react";

const LastFiveReportDetails = ({ lastFiveReport }) => {
  return (
    <View style={{}}>
      {lastFiveReport.grade > 0 && (
        <GradeDetails
          title="כללי"
          grade={Number(lastFiveReport.grade).toFixed(2)}
        />
      )}
      {lastFiveReport.grade > 0 && (
        <GradeDetails
          title="בטיחות מזון"
          grade={Number(lastFiveReport.safetyGrade).toFixed(2)}
        />
      )}
      {lastFiveReport.grade > 0 && (
        <GradeDetails
          title="קולינארי"
          grade={Number(lastFiveReport.culinaryGrade).toFixed(2)}
        />
      )}
      {lastFiveReport.grade > 0 && (
        <GradeDetails
          title="תזונה"
          grade={Number(lastFiveReport.nutritionGrade).toFixed(2)}
        />
      )}
    </View>
  );
};

export default LastFiveReportDetails;

const styles = StyleSheet.create({});
