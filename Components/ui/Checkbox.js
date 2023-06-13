import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import cbIcon from "../../assets/imgs/checkboxIcon.png";
const Checkbox = ({ label, checkedColor, unCheckedColor, onToggle }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    const newState = !isChecked;
    setIsChecked(newState);
    onToggle(newState);
    // console.log(`${label} checked: ${!isChecked}`);
  };

  return (
    <TouchableOpacity onPress={handleToggle}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: 4,
            borderWidth: 2,
            borderColor: isChecked ? checkedColor : unCheckedColor,
            marginRight: 8,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isChecked && (
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
              <Image source={cbIcon} style={styles.checkbox} />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  checkbox: { color: "#0C1430", width: 9, height: 9 },
});

export default Checkbox;
