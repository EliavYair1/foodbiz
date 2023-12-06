import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import cbIcon from "../../assets/imgs/checkboxIcon.png";
const Checkbox = React.memo(
  ({ label, checkedColor, unCheckedColor, checked, onToggle }) => {
    const handleToggle = () => {
      // console.log(`Before toggle - ${label}: ${checked}`);
      const newState = !checked;
      // setIsChecked(newState);
      onToggle(newState);
      // console.log(`After toggle - ${label}: ${newState}`);
    };
    useEffect(() => {
      // console.log(`Checkbox render - ${label}: ${checked}`);
    }, [checked]);

    return (
      <TouchableOpacity onPress={handleToggle}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 4,
              borderWidth: 2,
              borderColor: checked ? checkedColor : unCheckedColor,
              marginRight: 8,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {checked && (
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  backgroundColor: "#D3E0FF",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={cbIcon}
                  style={{ ...styles.checkbox, tintColor: checkedColor }}
                />
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
);
const styles = StyleSheet.create({
  checkbox: { width: 9, height: 9 },
});

export default Checkbox;
