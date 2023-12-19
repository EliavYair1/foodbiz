import { StyleSheet, Text, View, Switch } from "react-native";
import React, { useState, useEffect } from "react";
import fonts from "../../styles/fonts";

const ToggleSwitch = ({
  id,
  label,
  switchStates,
  toggleSwitch,
  truthyText,
  falsyText,
}) => {
  const [isChecked, setIsChecked] = useState(switchStates[id]);
  useEffect(() => {
    setIsChecked(switchStates[id]);
  }, [switchStates]);
  const handleToggle = () => {
    const newState = !isChecked;
    setIsChecked(newState);
    toggleSwitch(id);
  };

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 11.5,
        }}
      >
        <Text
          style={{
            fontFamily: isChecked == 0 ? fonts.ARegular : fonts.ABold,
          }}
        >
          {truthyText}
        </Text>
        <Switch
          trackColor={{
            false: "rgba(83, 104, 180, 0.2)",
            true: "#6886D2",
          }}
          thumbColor={"#fff"}
          onValueChange={handleToggle}
          value={isChecked || 0}
        />
        <Text
          style={{
            fontFamily: isChecked == 1 ? fonts.ARegular : fonts.ABold,
          }}
        >
          {falsyText}
        </Text>
      </View>
    </>
  );
};
export default ToggleSwitch;

const styles = StyleSheet.create({});
