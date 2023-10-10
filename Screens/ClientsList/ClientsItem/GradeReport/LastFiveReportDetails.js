import GradeDetails from "./GradeDetails";
import { StyleSheet, Text, View } from "react-native";
import React from "react";

const LastFiveReportDetails = ({ lastFiveReport }) => {
  return (
    <View style={{}}>
      <GradeDetails
        title="כללי"
        grade={Math.round(lastFiveReport?.grade * 10) / 10}
      />
      <GradeDetails
        title="בטיחות מזון"
        grade={Math.round(lastFiveReport?.safetyGrade * 10) / 10}
      />
      <GradeDetails
        title="קולינארי"
        grade={Math.round(lastFiveReport?.culinaryGrade * 10) / 10}
      />
      <GradeDetails
        title="תזונה"
        grade={Math.round(lastFiveReport?.nutritionGrade * 10) / 10}
      />
    </View>
  );
};

export default LastFiveReportDetails;

const styles = StyleSheet.create({});
