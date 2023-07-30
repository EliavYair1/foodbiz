import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Button,
  Dimensions,
} from "react-native";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import ScreenWrapper from "../../../../utiles/ScreenWrapper";
import useScreenNavigator from "../../../../Hooks/useScreenNavigator";
import fonts from "../../../../styles/fonts";
import colors from "../../../../styles/colors";
import ImageText from "./innerComponents/ImageText";
import { FlatList } from "react-native-gesture-handler";
import uuid from "uuid-random";
import Loader from "../../../../utiles/Loader";
import ReportGrade from "./innerComponents/ReportGrade";
import CategoryAccordion from "./innerComponents/CategoryAccordion";
import { Divider } from "react-native-paper";
import CheckboxItem from "../../../WorkerNewReport/CheckboxItem/CheckboxItem";
import Input from "../../../../Components/ui/Input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import SelectMenu from "../../../../Components/ui/SelectMenu";
import DatePicker from "../../../../Components/ui/datePicker";
import useMediaPicker from "../../../../Hooks/useMediaPicker";
import CategoryAccordionItem from "./innerComponents/CategoryAccordionItem";
import CategoryWeightsAccordionItem from "./innerComponents/CategoryWeightsAccordionItem";
import Drawer from "../../../../Components/ui/Drawer";
import { LinearGradient } from "expo-linear-gradient";
import accordionCloseIcon from "../../../../assets/imgs/accordionCloseIndicator.png";
import FileIcon from "../../../../assets/icons/iconImgs/FileIcon.png";
import { fetchCategories } from "../../../../store/redux/reducers/categoriesSlice";
import Category from "../../../../Components/modals/category";
import ModalUi from "../../../../Components/ui/ModalUi";
import CloseDrawerIcon from "../../../../assets/imgs/oncloseDrawerIcon.png";
const EditExistingReport = () => {
  // ! redux stpre fetching
  const dispatch = useDispatch();
  const currentStation = useSelector((state) => state.currentStation);
  const categories = useSelector((state) => state.categories);
  const currentCategoryId = useSelector((state) => state.currentCategory);
  const currentCategories = useSelector((state) => state.currentCategories);
  const currentClient = useSelector(
    (state) => state.currentClient.currentClient
  );
  const currentReport = useSelector(
    (state) => state.currentReport.currentReport
  );
  const memoizedCategories = useMemo(() => categories, [categories]);
  const memoRizedCats = memoizedCategories?.categories;
  const passedDownCategoryId = currentCategoryId.currentCategory;
  // ! redux stpre fetching end
  const drawerRef = useRef(null);
  const { navigateTogoBack } = useScreenNavigator();
  const [categoryGrade, setCategoryGrade] = useState(0);
  const [majorCategoryGrade, setMajorCategoryGrade] = useState(0);
  const [reportGrade, setReportGrade] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [relevantCheckboxItems, setRelevantCheckboxItems] = useState([]);
  const [ratingCheckboxItem, setRatingCheckboxItem] = useState([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [selectedModalCategory, setSelectedModalCategory] = useState([]);

  const [categoryNames, setCategoryNames] = useState({
    foodSafetyReviewNames: [],
    culinaryReviewNames: [],
    nutritionReviewNames: [],
  });
  const [checkboxStatus, setCheckboxStatus] = useState({
    foodSafetyReviewCbStatus: [],
    culinaryReviewCbStatus: [],
    nutritionReviewCbStatus: [],
  });
  // * category header
  const [categoryHeader, setCategoryHeader] = useState(false);
  // * category subheader
  const [categorySubHeader, setCategorySubHeader] = useState(false);
  // * categories items
  const [CategoriesItems, setCategoriesItems] = useState([]);
  const [currentReportItems, setCurrentReportItems] = useState([]);
  const [currentReportItemsForGrade, setCurrentReportItemsForGrade] = useState(
    []
  );
  const [categoryType, setCategoryType] = useState(null);

  const desiredCategory = () => {
    let parentCategory = false;
    let indexSubcategory = false;

    for (const [key, value] of Object.entries(categories.categories)) {
      value.categories.find((subcategory, index) => {
        if (subcategory.id == passedDownCategoryId) {
          indexSubcategory = index;
          parentCategory = key;
          return subcategory;
        }
      });
    }
    setCategoriesItems(
      categories.categories[parentCategory].categories[indexSubcategory].items
    );
    setCategorySubHeader(
      categories.categories[parentCategory].categories[indexSubcategory].name
    );
    setCategoryHeader(categories.categories[parentCategory].name);
    setCategoryType(
      categories.categories[parentCategory].categories[indexSubcategory].type
    );
  };

  useEffect(() => {
    desiredCategory();
  }, [desiredCategory]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const schema = yup.object().shape({
    remarks: yup.string().required("remarks is required"),
    executioner: yup.string().required("executioner is required"),
    violationType: yup.string().required("type of violation is required"),
    lastDate: yup.string().required("execution date is required"),
    fineNis: yup.string().required("defining a fine in NIS is required"),
    imagePick: yup.string().required("picking an image is required"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  //  * 1. checking if the ids of the categories match to the selected report
  // *  2.  sorting them by type to their right location of the state
  const handleCheckboxStatusChange = (passedCategories) => {
    const globalStateCategories = memoRizedCats
      ? Object.values(memoRizedCats).flatMap((category) => category.categories)
      : null;
    let newCheckboxStatus = {
      foodSafetyReviewCbStatus: [],
      culinaryReviewCbStatus: [],
      nutritionReviewCbStatus: [],
    };
    let newCategoryNames = {
      foodSafetyReviewNames: [],
      culinaryReviewNames: [],
      nutritionReviewNames: [],
    };
    if (globalStateCategories) {
      globalStateCategories.forEach((category) => {
        const categoryId = parseInt(category.id, 10);
        const categoryName = category.name;
        const categoryType = parseInt(category.type, 10);

        if (passedCategories.has(categoryId)) {
          if (categoryType === 1) {
            newCheckboxStatus.foodSafetyReviewCbStatus.push(categoryId);
            newCategoryNames.foodSafetyReviewNames.push(categoryName);
          } else if (categoryType === 2) {
            newCheckboxStatus.culinaryReviewCbStatus.push(categoryId);
            newCategoryNames.culinaryReviewNames.push(categoryName);
          } else if (categoryType === 3) {
            newCheckboxStatus.nutritionReviewCbStatus.push(categoryId);
            newCategoryNames.nutritionReviewNames.push(categoryName);
          }
        }
      });
    }
    setCategoryNames(newCategoryNames);
    setCheckboxStatus(newCheckboxStatus);
  };

  useEffect(() => {
    if (currentCategories) {
      const categoryIds = currentCategories.currentCategories;
      const categorySet = new Set(categoryIds);
      handleCheckboxStatusChange(categorySet);
    } else {
      console.log("currentCategories is not a valid Set or is empty.");
    }
  }, [currentCategories]);

  // * categories picker close function
  const handleModalClose = () => {
    setModalVisible(false);
  };

  // * modal pick handler
  const handleOptionClick = (option) => {
    setSelectedModalCategory((prevSelectedOptions) => [
      ...prevSelectedOptions,
      option,
    ]);
    if (selectedModalCategory) {
      console.log("modal option choice:", option);
      handleModalClose();
    }
  };

  // * form submit function
  const onSubmitForm = () => {
    // console.log("form values:", getValues());
    if (isFormSubmitted) {
      console.log("form submitted");
    }
  };
  const imageTextsAndFunctionality = [
    {
      id: 0,
      text: "קבצים",
      source: require("../../../../assets/icons/iconImgs/folder.png"),
      iconPress: () => {
        console.log("folder");
      },
    },
    {
      id: 1,
      text: "מפרט",
      source: require("../../../../assets/icons/iconImgs/paperSheet.png"),
      iconPress: () => {
        console.log("paperSheet");
      },
    },
    {
      id: 2,
      text: "הגדרות",
      source: require("../../../../assets/icons/iconImgs/settings.png"),
      iconPress: () => {
        console.log("settings");
      },
    },
    {
      id: 3,
      text: "קטגוריות",
      source: require("../../../../assets/icons/iconImgs/categories.png"),
      iconPress: () => {
        console.log("categories");
        setModalVisible(true);
      },
    },
    {
      id: 4,
      text: "סיכום",

      source: require("../../../../assets/icons/iconImgs/notebook.png"),
      iconPress: () => {
        console.log("notebook");
      },
    },
    {
      id: 5,
      text: "צפייה",

      source: require("../../../../assets/icons/iconImgs/eye.png"),
      iconPress: () => {
        console.log("eye");
      },
    },
  ];
  // useEffect(() => {
  //   setIsLoading(true);
  //   setTimeout(() => {
  //     setIsLoading(false);
  //   }, 0);
  // }, []);

  // * determain the color of the gradewrapper based on the grade value
  const gradeBackgroundColor = (grade) => {
    if (grade >= 90) {
      return colors.toggleColor1;
    } else if (grade < 90 && grade >= 85) {
      return colors.green;
    } else if (grade <= 84 && grade >= 79) {
      return colors.orange;
    } else if (grade < 79 && grade >= 70) {
      return colors.pink;
    } else {
      return colors.redish;
    }
  };
  const renderImageTextItem = ({ item }) => {
    return (
      <View style={{ marginRight: 10 }}>
        <ImageText
          imageSource={item.source}
          ImageText={item.text}
          id={item.id}
          onIconPress={item.iconPress}
        />
      </View>
    );
  };

  // * finding the current report data based on the category id from the report edit mode.
  const getRelevantData = (data) => {
    // * parsing the data
    const CategoriesArrayOfData = JSON.parse(data);

    const relevantData = CategoriesArrayOfData.find(
      (category) => category.id == passedDownCategoryId
    );
    if (relevantData) {
      setCurrentReportItemsForGrade(relevantData.items);
      setCurrentReportItems(relevantData.items);
      // ! setCategoryGrade(relevantData.grade);
    } else {
      console.log("Failed to find Relevant Data");
    }
  };
  //  * fetching the data from the current report
  const categoriesDataReport = currentReport.getCategoriesData();
  useEffect(() => {
    getRelevantData(categoriesDataReport);
  }, [ratingCheckboxItem]);

  // * handling changes in the report finding and replacing and returning the new report item
  const handleReportItemChange = useCallback((newReportItem) => {
    setCurrentReportItemsForGrade((prev) => {
      let temp = [...prev];
      temp.splice(
        temp.findIndex((element) => {
          return element.id == newReportItem.id;
        }),
        1
      );
      temp.push(newReportItem);
      return temp;
    });
  }, []);

  // * Major category grade calculation
  const calculateMajorCategoryGrade = () => {
    const parsedCategories = JSON.parse(categoriesDataReport);

    let currentSubcategories = false;
    // * chosing to calculate which current subcategories based on the type.
    if (categoryType == 1) {
      currentSubcategories = checkboxStatus.foodSafetyReviewCbStatus;
    } else if (categoryType == 2) {
      currentSubcategories = checkboxStatus.culinaryReviewCbStatus;
    } else {
      currentSubcategories = checkboxStatus.nutritionReviewCbStatus;
    }
    // * counting the amount of the currentSubcategories for calculation.
    let numberOfCurrentSubcategories = currentSubcategories.length;

    if (currentSubcategories) {
      // * matching the ids of the current categories to the ids of the categories report data.
      let currentPickedCategoriesElementsId = parsedCategories.filter(
        (element) => currentSubcategories.includes(parseInt(element.id, 10))
      );
      let totalGrade = 0;
      // * extracting the grades of the currentPickedCategoriesElementsId and sum the amount of the total grades
      currentPickedCategoriesElementsId.forEach((element) => {
        const grade = parseInt(element.grade, 10);
        totalGrade += grade;
      });

      // * calculating the avg of the totalGrade devided by numberOfCurrentSubcategories
      let avgValOfCurrentSubcategories = Math.round(
        totalGrade / numberOfCurrentSubcategories
      );

      setMajorCategoryGrade(avgValOfCurrentSubcategories);
    }
  };
  // console.log("before", categoryGrade);
  // * category grade calculation
  const calculateCategoryGrade = () => {
    let itemsTotal = 0;
    let itemsTotal1 = 0;
    let itemsTotal2 = 0;
    let itemsTotal3 = 0;
    // console.log("inside", categoryGrade);

    for (const item of currentReportItemsForGrade) {
      if (item.noRelevant == 1 || item.noCalculate == 1) {
        continue;
      }
      if (item.categoryReset == 1) {
        setCategoryGrade(0);
        break;
      }
      let categoryItem = CategoriesItems.find((el) => el.id == item.id);
      if (item.grade == 0 && categoryItem?.critical == 1) {
        setCategoryGrade(0);
        break;
      }
      itemsTotal++;
      if (item.grade == 1) {
        itemsTotal1++;
      } else if (item.grade == 2) {
        itemsTotal2++;
      } else if (item.grade == 3) {
        itemsTotal3++;
      }
    }
    if (itemsTotal == 0) {
      setCategoryGrade(100);
    } else {
      setCategoryGrade(
        parseInt(
          ((itemsTotal1 + itemsTotal2 * 2 + itemsTotal3 * 3) /
            (itemsTotal * 3)) *
            100
        )
      );
    }
  };
  // console.log("after", categoryGrade);
  /* todo list */
  /* end todo list */

  // * drawer handler
  const handleDrawerToggle = (isOpen) => {
    setIsDrawerOpen(isOpen);
  };
  // const onCloseDrawer = () => {
  //   setIsDrawerOpen(false);
  // };
  const closeDrawer = () => {
    if (drawerRef.current) {
      drawerRef.current.closeDrawer();
      setIsDrawerOpen(false);
    }
  };
  // * paginations between categories names : Prev
  const handlePrevCategory = () => {
    // setCurrentCategoryIndex((prevIndex) => {
    //   const newIndex = prevIndex > 0 ? prevIndex - 1 : prevIndex;
    //   const currentItem = checkedCategoryNameById[newIndex];
    //   // dispatch(setCurrentCategory(currentItem));
    //   return newIndex;
    // });
    console.log("prev");
  };

  // * paginations between categories names : Next
  const handleNextCategory = () => {
    // setCurrentCategoryIndex((prevIndex) => {
    //   const newIndex =
    //     prevIndex < checkedCategoryNameById.length - 1
    //       ? prevIndex + 1
    //       : prevIndex;
    //   const currentItem = checkedCategoryNameById[newIndex];
    //   // dispatch(setCurrentCategory(currentItem));
    //   // console.log(currentItem);
    //   return newIndex;
    // });
    console.log("next");
  };

  // * calculating the report Grade
  const calculateReportGrade = (value) => {
    let culinaryGrade = currentReport.getData("culinaryGrade");
    let nutritionGrade = currentReport.getData("nutritionGrade");
    let safetyGrade = currentReport.getData("safetyGrade");
    let reportGradeCalc = 0;
    if (categoryType == 1) {
      reportGradeCalc =
        value * 0.5 + culinaryGrade * 0.4 + nutritionGrade * 0.1;
    } else if (categoryType == 2) {
      reportGradeCalc = safetyGrade * 0.5 + value * 0.4 + nutritionGrade * 0.1;
    } else {
      reportGradeCalc = safetyGrade * 0.5 + culinaryGrade * 0.4 + value * 0.1;
    }
    setReportGrade(Math.round(reportGradeCalc));
  };

  useEffect(() => {
    calculateCategoryGrade();
    calculateMajorCategoryGrade();
    calculateReportGrade(majorCategoryGrade);
  }, [currentReportItemsForGrade]);

  // * mapping over CategoriesItems and displaying the items
  const AccordionCategoriesGeneralList = CategoriesItems.map((item) => {
    let reportItem = currentReportItems.find(
      (element) => element.id == item.id
    );
    const timeOfReport = currentReport.getData("timeOfReport");
    const haveFine = currentReport.getData("haveFine");

    return {
      id: item.id,
      component: (
        <CategoryAccordionItem
          reportItem={reportItem ?? false}
          item={item}
          haveFine={haveFine}
          control={control}
          setValue={setValue}
          trigger={trigger}
          errors={errors}
          dateSelected={timeOfReport}
          onReportChange={handleReportItemChange}
        />
      ),
    };
  });

  const AccordionCategoriesTemperatureList = [
    {
      id: 1,
      component: (
        <CategoryWeightsAccordionItem
          // handleCheckboxChange={handleCheckboxChange}
          // handleRatingCheckboxChange={handleRatingCheckboxChange}
          releventCheckboxItems={relevantCheckboxItems}
          ratingCheckboxItem={ratingCheckboxItem}
          control={control}
          setValue={setValue}
          dateSelected={"dsadsa"}
          trigger={trigger}
          errors={errors}
          selectedDates={[1, 2, 3, 4, 5, 6]}
          sectionText="טמפרטורת מזון חם בהגשה"
          // imagesArray={images}
        />
      ),
    },
    {
      id: 2,
      component: (
        <CategoryWeightsAccordionItem
          // handleCheckboxChange={handleCheckboxChange}
          // handleRatingCheckboxChange={handleRatingCheckboxChange}
          releventCheckboxItems={relevantCheckboxItems}
          ratingCheckboxItem={ratingCheckboxItem}
          control={control}
          setValue={setValue}
          trigger={trigger}
          errors={errors}
          selectedDates={[1, 2, 3, 4, 5, 6]}
          sectionText="טמפרטורת מזון חם בהגשה"
        />
      ),
    },
    {
      id: 3,
      component: (
        <CategoryWeightsAccordionItem
          // handleCheckboxChange={handleCheckboxChange}
          // handleRatingCheckboxChange={handleRatingCheckboxChange}
          releventCheckboxItems={relevantCheckboxItems}
          ratingCheckboxItem={ratingCheckboxItem}
          control={control}
          setValue={setValue}
          trigger={trigger}
          selectedDates={[1, 2, 3, 4, 5, 6]}
          errors={errors}
          sectionText="טמפרטורת מזון חם בהגשה"
        />
      ),
    },
  ];
  const categoriesModal = [
    {
      subheader: "ביקורת בטיחות מזון",
      options: categoryNames.foodSafetyReviewNames,
    },
    {
      subheader: "ביקורת קולנירית",
      options: categoryNames.culinaryReviewNames,
    },
    {
      subheader: "ביקורת תזונה",
      options: categoryNames.nutritionReviewNames,
    },
  ];

  return (
    <>
      <ScreenWrapper
        isConnectedUser
        wrapperStyle={{ backgroundColor: colors.white }}
      >
        <View style={styles.goBackWrapper}>
          <TouchableOpacity onPress={navigateTogoBack}>
            <Image
              source={require("../../../../assets/imgs/rightDirIcon.png")}
              style={styles.goBackIcon}
            />
          </TouchableOpacity>
          <Text style={styles.goBackText}>חזרה לרשימת הלקוחות</Text>
        </View>

        <View style={styles.headerWrapper}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>
              עריכת דוח עבור {currentClient.getCompany()} - {currentStation}
            </Text>

            <Text style={styles.subheader}>
              {categoryHeader}
              {" > "}
              {categorySubHeader}
            </Text>
          </View>
          <View style={styles.imageTextList}>
            <FlatList
              data={imageTextsAndFunctionality}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderImageTextItem}
              horizontal={true}
            />
          </View>
        </View>
        <View style={styles.categoryContainer}>
          <View style={styles.gradesContainer}>
            <ReportGrade
              reportGradeBoxColor={gradeBackgroundColor(categoryGrade)}
              reportGradeNumber={categoryGrade}
              reportGradeText={"ציון קטגוריה"}
            />
            <ReportGrade
              reportGradeBoxColor={gradeBackgroundColor(majorCategoryGrade)}
              reportGradeNumber={majorCategoryGrade}
              reportGradeText={"ציון ביקורת בטיחות מזון"}
            />
            <ReportGrade
              reportGradeBoxColor={gradeBackgroundColor(reportGrade)}
              reportGradeNumber={reportGrade}
              reportGradeText={"ציון לדוח"}
            />
          </View>
          {isLoading ? (
            <Loader visible={isLoading} />
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 16,
                borderWidth: 1,
                borderColor: "rgba(83, 104, 180, 0.30)",
              }}
            >
              <FlatList
                data={AccordionCategoriesGeneralList}
                renderItem={({ item }) => <CategoryAccordion item={item} />}
                keyExtractor={(item) => item.id.toString()}
              />
              {/* <FlatList
              data={AccordionCategoriesTemperatureList}
              renderItem={({ item }) => <CategoryAccordion item={item} />}
              keyExtractor={(item) => item.id.toString()}
            /> */}
            </View>
          )}
        </View>

        {modalVisible && (
          <View>
            <ModalUi
              header="קטגוריות"
              modalContent={categoriesModal}
              onClose={handleModalClose}
              handleOptionClick={handleOptionClick}
            />
          </View>
        )}
      </ScreenWrapper>
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "flex-end",
          marginBottom: 100,
          // bottom: 0,
        }}
      >
        <Drawer
          content={
            <LinearGradient
              colors={["#37549D", "#26489F"]}
              start={[0, 0]}
              end={[1, 0]}
              style={{ width: "100%", padding: 16, height: 76, zIndex: 1 }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                {isDrawerOpen && (
                  <TouchableOpacity onPress={closeDrawer}>
                    <Image
                      source={CloseDrawerIcon}
                      style={{ width: 20, height: 20 }}
                    />
                  </TouchableOpacity>
                )}
                {!isDrawerOpen && (
                  <TouchableOpacity
                    onPress={handlePrevCategory}
                    style={{
                      alignSelf: "center",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <Image
                      source={accordionCloseIcon}
                      style={{
                        width: 20,
                        height: 20,
                        transform: [{ rotate: "180deg" }],
                      }}
                    />
                    <Text style={styles.categoryDirButton}>
                      הקטגוריה הקודמת:
                      {/* {checkedCategoryNameById[currentCategoryIndex - 1]?.name} */}
                    </Text>
                  </TouchableOpacity>
                )}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    flex: 1,
                    // marginLeft:
                    //   formData && formData.categories && formData.categories[0]
                    //     ? "auto"
                    //     : 0,
                    // marginRight:
                    //   formData && formData.categories && formData.categories[0]
                    //     ? -150
                    // : 0,
                    gap: 12,
                  }}
                >
                  <Image source={FileIcon} style={{ width: 24, height: 24 }} />
                  <Text
                    style={{
                      justifyContent: "center",
                      alignSelf: "center",
                      color: colors.white,
                      fontSize: 24,
                      fontFamily: fonts.ABold,
                    }}
                  >
                    תמצית והערות
                  </Text>
                </View>
                {/* {formData && formData.categories && formData.categories[0] && ( */}
                {!isDrawerOpen && (
                  <TouchableOpacity
                    onPress={handleNextCategory}
                    style={{
                      alignSelf: "center",
                      flexDirection: "row",
                      gap: 5,
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.categoryDirButton}>
                      הקטגוריה הבאה:{" "}
                      {/* {checkedCategoryNameById[currentCategoryIndex + 1]?.name} */}
                      {/* {formData.categories[0]} */}
                      {/* {checkedCategoryNameById[currentCategoryIndex].name} */}
                    </Text>
                    <Image
                      source={accordionCloseIcon}
                      style={{ width: 20, height: 20 }}
                    />
                  </TouchableOpacity>
                )}

                {/* )} */}
              </View>
            </LinearGradient>
          }
          height={300}
          onToggle={handleDrawerToggle}
          ref={drawerRef}
        />
      </View>
    </>
  );
};

export default EditExistingReport;

const styles = StyleSheet.create({
  goBackWrapper: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
    marginTop: 16,
  },
  goBackText: {
    fontSize: 14,
    fontFamily: fonts.ARegular,
  },
  goBackIcon: { width: 20, height: 20 },
  headerWrapper: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 30,
  },
  headerContainer: {},
  header: {
    alignItems: "center",
    justifyContent: "flex-start",
    textAlign: "left",
    fontSize: 24,
    fontFamily: fonts.ABold,
  },
  subheader: {
    alignItems: "center",
    width: "100%",
    justifyContent: "flex-start",
    textAlign: "left",
  },
  imageTextList: {},
  categoryContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#5368B4",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,

    // maxHeight: 548,
    overflow: "hidden",
  },
  gradesContainer: {
    flexDirection: "row",
    gap: 16,
    backgroundColor: colors.accordionOpen,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryDirButton: {
    color: colors.white,
    fontFamily: fonts.ARegular,
    fontSize: 16,
  },
});
