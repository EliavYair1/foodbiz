import { useState, useCallback } from "react";

const useToggleSwitch = () => {
  const [switchStates, setSwitchStates] = useState({
    haveFine: false,
    haveAmountOfItems: false,
    haveSafetyGrade: true,
    haveCulinaryGrade: true,
    haveNutritionGrade: true,
    haveCategoriesNameForCriticalItems: false,
  });
  // ! to see why the formdata dosent update and dont access updateTogglesStatusOnPreviousReports in the WorkerNewReport.
  const handleSwitchStateChange = (
    selectedReport,
    updateTogglesStatusOnPreviousReports
  ) => {
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
