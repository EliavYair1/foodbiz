import React, { useCallback, useState, useMemo, useEffect } from "react";
import { Image, View } from "react-native";
import CheckboxItem from "../CheckboxItem/CheckboxItem";
import onDragIcon from "../../../assets/imgs/onDragIcon.png";
import { debounce } from "lodash";
// * get the array of categories from the report and updates the state
export const handleCategoriesCheckboxesToggle = (
  status,
  category,
  checked,
  label
) => {
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

export const useAccordionCategoriesItem = (updateCategories) => {
  // ? categories hook
  const [checkboxStatus, setCheckboxStatus] = useState({
    foodSafetyReviewCbStatus: [],
    culinaryReviewCbStatus: [],
    nutritionReviewCbStatus: [],
  });
  const debounceCheckboxStatus = debounce(setCheckboxStatus, 0);
  console.log(object);
  useEffect(() => {
    if (checkboxStatus !== undefined) {
      const categories = [
        ...checkboxStatus?.foodSafetyReviewCbStatus,
        ...checkboxStatus?.culinaryReviewCbStatus,
        ...checkboxStatus?.nutritionReviewCbStatus,
      ];
      updateCategories("categorys", categories);
    }
  }, [checkboxStatus]);

  function countItemsInObjectArrays(obj) {
    const counts = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        counts[key] = obj[key].length;
      }
    }
    return counts;
  }
  const itemCounts = countItemsInObjectArrays(checkboxStatus);

  //  * 1. checking if the ids of the categories match to the selected report
  // *  2.  sorting them by type to their right location of major category
  const handleCheckboxStatusChange = (
    parsedSelectedReportCategory,
    memoizedCategories,
    updateFormData
  ) => {
    console.log("innn", 2);
    const memoRizedCats = memoizedCategories?.categories;
    const globalStateCategories = memoRizedCats
      ? Object.values(memoRizedCats).flatMap((category) => category.categories)
      : null;

    let newCheckboxStatus = {
      foodSafetyReviewCbStatus: [],
      culinaryReviewCbStatus: [],
      nutritionReviewCbStatus: [],
    };
    let newOrderedCategories = {
      foodSafetyReviewCbStatus: [],
      culinaryReviewCbStatus: [],
      nutritionReviewCbStatus: [],
    };

    if (globalStateCategories) {
      newCheckboxStatus = globalStateCategories.reduce((status, category) => {
        const categoryId = parseInt(category.id, 10);
        const categoryType = parseInt(category.type, 10);
        if (parsedSelectedReportCategory.has(categoryId)) {
          if (categoryType === 1) {
            status.foodSafetyReviewCbStatus.push(categoryId);
          } else if (categoryType === 2) {
            status.culinaryReviewCbStatus.push(categoryId);
          } else if (categoryType === 3) {
            status.nutritionReviewCbStatus.push(categoryId);
          }
        }
        return status;
      }, newCheckboxStatus);

      const myArray = Array.from(parsedSelectedReportCategory);
      myArray.map((element) => {
        let index = newCheckboxStatus?.foodSafetyReviewCbStatus.findIndex(
          (id) => id == element
        );

        if (index !== -1) {
          newOrderedCategories.foodSafetyReviewCbStatus.push(element);
          return element;
        }
        index = newCheckboxStatus?.culinaryReviewCbStatus.findIndex(
          (id) => id == element
        );
        if (index !== -1) {
          newOrderedCategories.culinaryReviewCbStatus.push(element);
          return element;
        }

        index = newCheckboxStatus?.nutritionReviewCbStatus.findIndex(
          (id) => id == element
        );
        if (index !== -1) {
          newOrderedCategories.nutritionReviewCbStatus.push(element);
          return element;
        }
      });
    }

    // Saving the categories checkbox status
    const categories = [
      ...newOrderedCategories.foodSafetyReviewCbStatus,
      ...newOrderedCategories.culinaryReviewCbStatus,
      ...newOrderedCategories.nutritionReviewCbStatus,
    ];
    updateFormData(categories);
    setCheckboxStatus(newOrderedCategories);
  };
  // console.log("debounceCheckboxStatus", checkboxStatus);

  // * checkbox counter
  const getCheckedCount = (categoryStatus) => {
    return categoryStatus ? categoryStatus.length : 0;
  };

  const accordionCategoriesItem = useMemo(() => {
    return (names, categoryName) => {
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
          boxItem: (
            <Image style={{ width: 9, height: 14 }} source={onDragIcon} />
          ),
        };
      });
    };
  }, [checkboxStatus]);

  return {
    accordionCategoriesItem,
    getCheckedCount,
    checkboxStatus,
    setCheckboxStatus,
    handleCheckboxStatusChange,
    itemCounts,
  };
};
