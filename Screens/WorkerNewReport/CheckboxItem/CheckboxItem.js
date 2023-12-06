import React from "react";
import { View, Text } from "react-native";
import Checkbox from "../../../Components/ui/Checkbox";
import colors from "../../../styles/colors";
const CheckboxItem = React.memo(
  ({ label, checkboxItemText, handleChange, checked }) => {
    const handleCheckboxToggle = (checked, label) => {
      handleChange(checked ? 1 : 0, label);
      console.log(`${label} is ${checked}`);
    };

    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Checkbox
          onToggle={(checked) => handleCheckboxToggle(checked, label)}
          label={label}
          checkedColor={colors.black}
          unCheckedColor={colors.black}
          checked={checked}
        />
        <Text>{checkboxItemText}</Text>
      </View>
    );
  }
);

export default CheckboxItem;
