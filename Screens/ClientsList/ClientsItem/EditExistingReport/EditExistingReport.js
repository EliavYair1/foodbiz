import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ScreenWrapper from "../../../../utiles/ScreenWrapper";
const EditExistingReport = () => {
  const dispatch = useDispatch();
  const currentClient = useSelector(
    (state) => state.currentClient.currentClient
  );
  //   console.log("EditExistingReport currentClient", currentClient);
  return (
    <ScreenWrapper isConnectedUser>
      <Text style={{ textAlign: "center" }}>{currentClient.getCompany()}</Text>
    </ScreenWrapper>
  );
};

export default EditExistingReport;

const styles = StyleSheet.create({});
