import React, { useCallback, useState } from "react";
import { Image, View } from "react-native";
import CheckboxItem from "../CheckboxItem/CheckboxItem";
import onDragIcon from "../../../assets/imgs/onDragIcon.png";
import { FlatList } from "react-native-gesture-handler";
import { debounce } from "lodash";
// * get the array of categories from the report and updates the state
export const handleCategoriesCheckboxesToggle = (
  status,
  category,
  checked,
  label
) => {
  console.log("handleCategoriesCheckboxesToggle", {
    status,
    category,
    checked,
    label,
  });
  const updatedStatus = { ...status };
  const updatedCategoryStatus = [...updatedStatus[category]];
  const index = updatedCategoryStatus.indexOf(parseInt(label));

  let statusChanged = false;
  // * if checked then push to the obj and set the status to true else remove it from the obj
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

export const useAccordionCategoriesItem = () => {
  const globalCategories = useSelector((state) => state.globalCategories);

  const memoizedCategories = useMemo(
    () => globalCategories,
    [globalCategories]
  );

  // console.log("initialStatus", initialStatus);
  const [checkboxStatus, setCheckboxStatus] = useState({
    foodSafetyReviewCbStatus: [],
    culinaryReviewCbStatus: [],
    nutritionReviewCbStatus: [],
  });
  const debounceCheckboxStatus = debounce(setCheckboxStatus, 0);

  // * checkbox counter
  const getCheckedCount = (category) => {
    const categoryStatus = checkboxStatus[`${category}Status`];
    return categoryStatus ? categoryStatus.length : 0;
  };

  const accordionCategoriesItem = (names, categoryName) => {
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
          <View key={checkboxKey}>
            <CheckboxItem
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
                debounceCheckboxStatus(updatedStatus);
              }}
            />
          </View>
        ),
        boxItem: <Image style={{ width: 9, height: 14 }} source={onDragIcon} />,
      };
    });
  };

  return {
    accordionCategoriesItem,
    getCheckedCount,
    checkboxStatus,
    setCheckboxStatus,
  };
};
