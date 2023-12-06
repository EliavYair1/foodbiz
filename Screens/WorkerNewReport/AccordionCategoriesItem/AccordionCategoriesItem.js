import React from "react";
import { Image, View } from "react-native";
import CheckboxItem from "../CheckboxItem/CheckboxItem";
import onDragIcon from "../../../assets/imgs/onDragIcon.png";
import { FlatList } from "react-native-gesture-handler";
// * get the array of categories from the report and updates the state
const handleCategoriesCheckboxesToggle = (status, category, checked, label) => {
  const updatedStatus = { ...status };
  const updatedCategoryStatus = [...updatedStatus[category]];
  const index = updatedCategoryStatus.indexOf(parseInt(label));

  let statusChanged = false;

  if (checked && index === -1) {
    updatedCategoryStatus.push(parseInt(label));
    statusChanged = true;
  } else if (!checked && index !== -1) {
    updatedCategoryStatus.splice(index, 1);
    statusChanged = true;
  }

  if (statusChanged) {
    updatedStatus[category] = updatedCategoryStatus;
  }

  return statusChanged ? updatedStatus : status;
};

export function accordionCategoriesItem(
  names,
  categoryName,
  checkboxStatus,
  handleToggle
) {
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
const CheckboxList = ({ data, categoryName, checkboxStatus, handleToggle }) => {
  const handleCategoriesCheckboxesToggle = (
    status,
    category,
    checked,
    label
  ) => {
    const updatedStatus = { ...status };
    const updatedCategoryStatus = [...updatedStatus[category]];
    const index = updatedCategoryStatus.indexOf(parseInt(label));

    let statusChanged = false;

    if (checked && index === -1) {
      updatedCategoryStatus.push(parseInt(label));
      statusChanged = true;
    } else if (!checked && index !== -1) {
      updatedCategoryStatus.splice(index, 1);
      statusChanged = true;
    }

    if (statusChanged) {
      updatedStatus[category] = updatedCategoryStatus;
    }

    return statusChanged ? updatedStatus : status;
  };

  const renderItem = ({ item, index }) => {
    const { id, name } = item;
    const checkboxKey = `${categoryName}${index + 1}`;

    const categoryStatus = checkboxStatus[`${categoryName}Status`];
    const checkboxValue =
      categoryStatus && Array.isArray(categoryStatus)
        ? categoryStatus.includes(parseInt(id))
        : false;

    return (
      <View key={checkboxKey + checkboxValue}>
        <CheckboxItem
          label={checkboxKey}
          checkboxItemText={name}
          checked={checkboxValue}
          handleChange={(checked) => {
            const updatedStatus = handleCategoriesCheckboxesToggle(
              checkboxStatus,
              `${categoryName}Status`,
              checked,
              id
            );
            handleToggle(updatedStatus);
          }}
        />
        <Image style={{ width: 9, height: 14 }} source={onDragIcon} />
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

export default CheckboxList;
