import React, { useCallback, useState } from "react";
import { Image, View } from "react-native";
import CheckboxItem from "../CheckboxItem/CheckboxItem";
import onDragIcon from "../../../assets/imgs/onDragIcon.png";

// import { FlatList } from "react-native-gesture-handler";
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

// export function accordionCategoriesItem(
//   names,
//   categoryName,
//   checkboxStatus,
//   handleToggle
// ) {
//   return names.map((item, index) => {
//     // console.log("categoryName", categoryName);
//     // console.log("checkboxStatus", checkboxStatus);
//     const checkboxKey = `${categoryName}${index + 1}`;
//     // console.log("checkboxKey", checkboxKey);

//     const categoryStatus = checkboxStatus[`${categoryName}Status`];
//     // console.log("categoryStatus", categoryStatus);

//     const checkboxValue =
//       categoryStatus && Array.isArray(categoryStatus)
//         ? categoryStatus.includes(parseInt(item.id))
//         : false;
//     // console.log("checkboxValue", checkboxValue);

//     // console.log("item", item.name);

//     return {
//       id: item.id,
//       text: (
//         <View>
//           <CheckboxItem
//             key={checkboxKey + checkboxValue}
//             label={checkboxKey}
//             checkboxItemText={item.name}
//             checked={checkboxValue}
//             handleChange={(checked) => {
//               const updatedStatus = handleCategoriesCheckboxesToggle(
//                 checkboxStatus,
//                 `${categoryName}Status`,
//                 checked,
//                 item.id
//               );
//               handleToggle(updatedStatus);
//             }}
//           />
//         </View>
//       ),
//       boxItem: <Image style={{ width: 9, height: 14 }} source={onDragIcon} />,
//     };
//   });
// }
export const useAccordionCategoriesItem = () => {
  // console.log("initialStatus", initialStatus);
  const [checkboxStatus, setCheckboxStatus] = useState({
    foodSafetyReviewCbStatus: [],
    culinaryReviewCbStatus: [],
    nutritionReviewCbStatus: [],
  });

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
                setCheckboxStatus(updatedStatus);
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
