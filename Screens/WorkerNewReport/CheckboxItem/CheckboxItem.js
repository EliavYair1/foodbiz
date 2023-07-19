import React, { useState } from "react";
import { View, Text, Image } from "react-native";
import onDragIcon from "../../../assets/imgs/onDragIcon.png"; // Replace with the path to your image
import Checkbox from "../../../Components/ui/Checkbox";
import colors from "../../../styles/colors";
const CheckboxItem = ({
  label,
  checkboxItemText,
  handleChange,
  checked,
  identifier = false,
}) => {
  const handleCheckboxToggle = (checked, label) => {
    handleChange(checked, label);
  };
  // const checkboxIdentifier = identifier ? `${label}_identifier` : label;
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Checkbox
        onToggle={(checked) => handleCheckboxToggle(checked, label)}
        label={label}
        checkedColor={colors.black}
        unCheckedColor={colors.black}
        checked={checked}
        // identifier={checkboxIdentifier}
      />
      <Text>{checkboxItemText}</Text>
    </View>
  );
};

export default CheckboxItem;
