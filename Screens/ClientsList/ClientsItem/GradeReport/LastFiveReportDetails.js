import GradeDetails from "./GradeDetails";
import { StyleSheet, Text, View } from "react-native";
import React from "react";

const LastFiveReportDetails = ({ lastFiveReport }) => {
  return (
    <View style={{}}>
      <GradeDetails title="כללי" grade={lastFiveReport.grade} />
      <GradeDetails title="בטיחות מזון" grade={lastFiveReport.nutritionGrade} />
      <GradeDetails title="ציון בטיחות" grade={lastFiveReport.safetyGrade} />
      <GradeDetails title="קולינארי" grade={lastFiveReport.culinaryGrade} />
    </View>
  );
};

export default LastFiveReportDetails;

const styles = StyleSheet.create({});
