import { useState, useCallback } from "react";

const useToggleSwitch = (updateTogglesStatusOnPreviousReports) => {
  const [switchStates, setSwitchStates] = useState({
    haveFine: false,
    haveAmountOfItems: false,
    haveSafetyGrade: true,
    haveCulinaryGrade: true,
    haveNutritionGrade: true,
    haveCategoriesNameForCriticalItems: false,
  });

  const handleSwitchStateChange = (selectedReport) => {
    const newSwitchStates = {
      haveFine: selectedReport?.getData("haveFine") == 1,
      haveAmountOfItems: selectedReport?.getData("haveAmountOfItems") == 1,
      haveSafetyGrade: selectedReport?.getData("haveSafetyGrade") == 1,
      haveCulinaryGrade: selectedReport?.getData("haveCulinaryGrade") == 1,
      haveNutritionGrade: selectedReport?.getData("haveNutritionGrade") == 1,
      haveCategoriesNameForCriticalItems:
        selectedReport?.getData("haveCategoriesNameForCriticalItems") == 1,
    };
    updateTogglesStatusOnPreviousReports(newSwitchStates);
    setSwitchStates(newSwitchStates);
  };

  const toggleSwitch = (id) => {
    setSwitchStates((prevState) => {
      const newState = {
        ...prevState,
        [id]: !prevState[id],
      };
      updateTogglesStatusOnPreviousReports(newState);
      return newState;
    });
  };

  return {
    switchStates,
    toggleSwitch,
    handleSwitchStateChange,
    setSwitchStates,
  };
};

export default useToggleSwitch;
