import React from "react";
import { View } from "react-native";
import CheckboxItem from "../CheckboxItem/CheckboxItem";

const handleCategoriesCheckboxesToggle = (status, category, checked, label) => {
  const updatedStatus = { ...status };
  const updatedCategoryStatus = [...updatedStatus[category]];
  const index = updatedCategoryStatus.indexOf(parseInt(label));

  if (checked && index === -1) {
    updatedCategoryStatus.push(parseInt(label));
  } else if (!checked && index !== -1) {
    updatedCategoryStatus.splice(index, 1);
  }

  updatedStatus[category] = updatedCategoryStatus;
  return updatedStatus;
};

export function accordionCategoriesItem(
  names,
  categoryName,
  checkboxStatus,
  handleToggle
) {
  console.log("accordionCategoriesItem", names, categoryName, checkboxStatus);
  return names.map((item, index) => {
    const checkboxKey = `${categoryName}${index + 1}`;
    const categoryStatus = checkboxStatus[`${categoryName}Status`];
    const checkboxValue =
      categoryStatus && Array.isArray(categoryStatus)
        ? categoryStatus.includes(parseInt(item.id))
        : false;
    return {
      id: item.id,
      text: (
        <View>
          <CheckboxItem
            key={checkboxKey + checkboxValue}
            label={checkboxKey}
            checkboxItemText={item.name}
            checked={checkboxValue}
            handleChange={(checked) => {
              const updatedStatus = handleCategoriesCheckboxesToggle(
                checkboxStatus,
                `${categoryName}Status`,
                checked,
                item.id
              );
              handleToggle(updatedStatus);
            }}
          />
        </View>
      ),
      boxItem: <Image style={{ width: 9, height: 14 }} source={onDragIcon} />,
    };
  });
}
