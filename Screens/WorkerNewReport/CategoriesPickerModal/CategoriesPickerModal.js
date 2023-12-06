import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCurrentCategories } from "../../../store/redux/reducers/getCurrentCategories";
import useScreenNavigator from "../../../Hooks/useScreenNavigator";
import { setIndex } from "../../../store/redux/reducers/indexSlice";
import useSaveEditedReport from "../../../Hooks/useSaveEditedReport";
import ModalUi from "../../../Components/ui/ModalUi";
import routes from "../../../Navigation/routes";
const CategoriesPickerModal = ({
  formData,
  setLoading,
  globalCategoriesObj,
  isLoading,
  setModalVisible,
  setMajorCategoryHeadersToPass,
  setSortedCategories,
}) => {
  const saveEditedReport = useSaveEditedReport();
  const { navigateToRoute } = useScreenNavigator();
  const dispatch = useDispatch();

  // * modal major category reorder by type
  function sortSubCategoriesByType(data, ids) {
    const type1Ids = [];
    const type2Ids = [];
    const type3Ids = [];
    if (ids) {
      for (const item of data) {
        if (ids.includes(parseInt(item.id))) {
          switch (item.type) {
            case "1":
              type1Ids.push({ id: item.id, name: item.name });
              break;
            case "2":
              type2Ids.push({ id: item.id, name: item.name });
              break;
            case "3":
              type3Ids.push({ id: item.id, name: item.name });
              break;
            default:
              break;
          }
        }
      }
    }

    const result = {
      1: type1Ids,
      2: type2Ids,
      3: type3Ids,
    };

    return result;
  }
  let categoriesModal = [];
  const sortedCategories = sortSubCategoriesByType(
    globalCategoriesObj,
    formData?.categorys
  );
  if (Array.isArray(formData?.categorys) && sortedCategories[1].length > 0) {
    sortedCategories[1] = formData?.categorys
      .map((id) => sortedCategories[1].find((category) => category.id == id))
      .filter((category) => category !== undefined);
    categoriesModal.push({
      subheader: "ביקורת בטיחות מזון",
      options: sortedCategories[1],
    });
  }
  if (Array.isArray(formData?.categorys) && sortedCategories[2].length > 0) {
    sortedCategories[2] = formData?.categorys
      .map((id) => sortedCategories[2].find((category) => category.id == id))
      .filter((category) => category !== undefined);
    categoriesModal.push({
      subheader: "ביקורת קולינארית",
      options: sortedCategories[2],
    });
  }
  if (Array.isArray(formData?.categorys) && sortedCategories[3].length > 0) {
    sortedCategories[3] = formData?.categorys
      .map((id) => sortedCategories[3].find((category) => category.id == id))
      .filter((category) => category !== undefined);
    categoriesModal.push({
      subheader: "ביקורת תזונה",
      options: sortedCategories[3],
    });
  }

  useEffect(() => {
    setMajorCategoryHeadersToPass(
      categoriesModal.map((category) => category.subheader)
    );
    setSortedCategories(sortedCategories);
  }, []);

  //
  // * categories picker close function
  const handleModalClose = () => {
    setModalVisible(false);
    setLoading(false);
  };

  // * modal pick handler
  const handleOptionClick = async (option) => {
    setLoading(true);
    const indexOfCategory = formData?.categorys.findIndex(
      (category) => category == option
    );
    dispatch(setIndex(indexOfCategory));
    await saveEditedReport(formData);
    dispatch(setCurrentCategories(formData?.categorys));
    setLoading(false);
    navigateToRoute(routes.ONBOARDING.CategoryEdit);
    handleModalClose();
  };

  return (
    <View>
      <ModalUi
        isLoading={isLoading}
        categoryEdit={false}
        header="קטגוריות"
        modalContent={categoriesModal}
        onClose={handleModalClose}
        handleOptionClick={handleOptionClick}
      />
    </View>
  );
};

export default CategoriesPickerModal;

const styles = StyleSheet.create({});
