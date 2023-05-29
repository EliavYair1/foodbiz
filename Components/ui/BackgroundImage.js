import { StyleSheet, Text, View, ImageBackground } from "react-native";
import React from "react";

const BackgroundImageWrapper = ({ backgroundImagePath, children, styling }) => {
  return (
    <ImageBackground style={styling} source={backgroundImagePath}>
      {children}
    </ImageBackground>
  );
};

export default BackgroundImageWrapper;

const styles = StyleSheet.create({});
