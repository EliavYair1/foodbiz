import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import cbIcon from "../../assets/imgs/checkboxIcon.png";
import colors from "../../styles/colors";
const Radio = ({
  options,
  optionGap = 0,
  optionText = false,
  onChange,
  selectedOption,
  disabled = false,
}) => {
  return (
    <View
      style={{
        flexDirection: "row-reverse",
        gap: optionGap,
        justifyContent: "flex-end",
      }}
    >
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          onPress={() => !disabled && onChange(option.value)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            opacity: disabled ? 0.5 : 1,
          }}
          disabled={disabled}
        >
          <View
            style={{
              height: 25,
              width: 25,
              borderRadius: 5,
              borderWidth: 2,
              borderColor: disabled
                ? "grey"
                : selectedOption == option.value
                ? colors.black
                : colors.black,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: disabled ? "#ECECEC" : "transparent",
            }}
          >
            {selectedOption == option.value && (
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  backgroundColor: disabled ? "#ECECEC" : "#D3E0FF",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={cbIcon}
                  style={{
                    ...styles.checkbox,
                    tintColor: disabled ? "grey" : colors.black,
                  }}
                />
              </View>
            )}
          </View>
          <Text style={{ marginLeft: 8 }}>{option.label}</Text>
        </TouchableOpacity>
      ))}
      {optionText && (
        <Text style={{ alignItems: "center", alignSelf: "center" }}>
          {optionText}
        </Text>
      )}
    </View>
  );
};
const styles = StyleSheet.create({ checkbox: { width: 9, height: 9 } });
export default Radio;
