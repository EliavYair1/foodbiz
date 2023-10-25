import { Platform, StyleSheet, View } from "react-native";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import ScreenWrapper from "../../../../utiles/ScreenWrapper";
import useScreenNavigator from "../../../../Hooks/useScreenNavigator";
import fonts from "../../../../styles/fonts";
import colors from "../../../../styles/colors";
import { FlatList } from "react-native-gesture-handler";
import Loader from "../../../../utiles/Loader";
import CategoryAccordion from "./innerComponents/CategoryAccordion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import SelectMenu from "../../../../Components/ui/SelectMenu";
import DatePicker from "../../../../Components/ui/datePicker";
import useMediaPicker from "../../../../Hooks/useMediaPicker";
import CategoryAccordionItem from "./innerComponents/CategoryAccordionItem";
import CategoryWeightsAccordionItem from "./innerComponents/CategoryWeightsAccordionItem";
import CategoryTempAccordionItem from "./innerComponents/CategoryTempAccordionItem";
import ModalUi from "../../../../Components/ui/ModalUi";
import "@env";

import axios from "axios";
import { getCurrentReport } from "../../../../store/redux/reducers/getCurrentReport";

import routes from "../../../../Navigation/routes";
import GradeCalculator from "./innerComponents/GradeCalculator";
import GoBackNavigator from "../../../../utiles/GoBackNavigator";
import Header from "../../../../Components/ui/Header";
import {
  setMajorCategoryHeaders,
  setCategoryNamesSubHeaders,
  setSummary,
} from "../../../../store/redux/reducers/summerySlice";
import SummaryDrawer from "./innerComponents/SummeryDrawer";
import { setCurrentCategories } from "../../../../store/redux/reducers/getCurrentCategories";
import useSaveCurrentScreenData from "../../../../Hooks/useSaveReport";
import FetchDataService from "../../../../Services/FetchDataService";
import { setClients } from "../../../../store/redux/reducers/clientSlice";
import Client from "../../../../Components/modals/client";
const CategoryEdit = () => {
  // console.log("EditExistingReport");
  const { navigateToRoute } = useScreenNavigator();
  // ! redux stpre fetching
  const dispatch = useDispatch();
  const currentStation = useSelector((state) => state.currentStation);
  // const categories = useSelector((state) => state.categories);
  const { fetchData } = FetchDataService();
  const currentSubCategoryId = useSelector((state) => state.currentCategory);
  const currentCategories = useSelector((state) => state.currentCategories);
  const globalCategories = useSelector((state) => state.globalCategories);
  const currentClient = useSelector(
    (state) => state.currentClient.currentClient
  );
  const currentReport = useSelector(
    (state) => state.currentReport.currentReport
  );
  const userId = useSelector((state) => state.user);
  const initialIndexOfSubCategory = useSelector((state) => state.categoryIndex);

  // console.log("to b", initialIndexOfSubCategory);

  const memoizedCategories = useMemo(
    () => globalCategories,
    [globalCategories]
  );
  const { saveCurrentScreenData } = useSaveCurrentScreenData();
  const memoRizedCats = memoizedCategories?.categories;
  const globalStateCategories = memoRizedCats
    ? Object.values(memoRizedCats).flatMap((category) => category.categories)
    : null;
  // * looking for a categories names in the global state
  const matchedNames = currentCategories.categories.map(
    (obj) => globalStateCategories.find((obj2) => obj == obj2.id).name
  );
  // console.log(currentCategories.categories);
  // for drawer usage
  const lastIndexOfCategories =
    Object.keys(currentCategories.categories).length - 1;
  const passedDownCategoryId = currentSubCategoryId.currentCategory;
  // ! redux stpre fetching end
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(
    initialIndexOfSubCategory
  );
  // console.log("currentCategoryIndex", currentCategoryIndex);

  useEffect(() => {
    setCurrentCategoryIndex(initialIndexOfSubCategory);
  }, [initialIndexOfSubCategory]);

  const findParentAndChildCategories = useMemo(() => {
    // console.log();
    let parentCategory = false;
    let indexSubcategory = false;

    for (const [key, value] of Object.entries(memoizedCategories.categories)) {
      value.categories.find((subcategory, index) => {
        if (
          subcategory.id == currentCategories.categories[currentCategoryIndex]
        ) {
          indexSubcategory = index;
          parentCategory = key;
          return subcategory;
        }
      });
    }
    return {
      parent: memoizedCategories.categories[parentCategory],
      child:
        memoizedCategories.categories[parentCategory].categories[
          indexSubcategory
        ],
    };
  }, [currentCategoryIndex]);
  // console.log(currentCategory);
  const [categoryGrade, setCategoryGrade] = useState(0);
  const [reportGrade, setReportGrade] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModalCategory, setSelectedModalCategory] = useState([]);
  const [foodSafety, setFoodSafety] = useState(0);
  const [culinary, setCulinary] = useState(0);
  const [nutrition, setNutrition] = useState(0);
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
    formState: { errors },
    setValue,
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const findCategoriesNames = useMemo(() => {
    // console.log("currentCategories 2 ", currentCategories);
    const globalStateCategories = memoRizedCats
      ? Object.values(memoRizedCats).flatMap((category) => category.categories)
      : null;
    let newCategoryNames = {
      1: [],
      2: [],
      3: [],
    };
    if (globalStateCategories) {
      globalStateCategories.forEach((category) => {
        const categoryId = parseInt(category.id, 10);
        const categoryName = category.name;
        const categoryType = parseInt(category.type, 10);

        if (currentCategories.categories.includes(categoryId)) {
          newCategoryNames[categoryType].push({
            id: categoryId,
            name: categoryName,
          });
        }
      });
    }
    return newCategoryNames;
  }, []);
  const [categoryNames, setCategoryNames] = useState(findCategoriesNames);
  // console.log("findCategoriesNames", findCategoriesNames);
  // * category header
  const [categoryHeader, setCategoryHeader] = useState(
    findParentAndChildCategories.parent.name
  );
  // * category subheader
  const [categorySubHeader, setCategorySubHeader] = useState(
    findParentAndChildCategories.child.name
  );

  // * categories items
  const [CategoriesItems, setCategoriesItems] = useState(
    findParentAndChildCategories.child.items
  );
  // ! bug issue it gets undefined becouse the starcture of the data is changed in the backend
  const categoriesDataFromReport = currentReport.getCategoriesData();
  // console.log("categoriesDataFromReport", categoriesDataFromReport);
  let parsedCategoriesDataFromReport = JSON.parse(categoriesDataFromReport);

  // ! bug issue

  const findRelevantReportData = useMemo(() => {
    //  getting the relevent data of the categories based on the current sub Category.
    const relevantData = parsedCategoriesDataFromReport.find(
      (category) =>
        category.id == currentCategories.categories[currentCategoryIndex]
    );
    return relevantData.items;
  }, [currentCategoryIndex]);
  // console.log("findRelevantReportData:", findRelevantReportData);
  const [currentReportItems, setCurrentReportItems] = useState(
    findRelevantReportData
  );
  const [currentReportItemsForGrade, setCurrentReportItemsForGrade] = useState(
    findRelevantReportData
  );

  const [categoryType, setCategoryType] = useState(
    findParentAndChildCategories.child.type
  );
  const [content, setContent] = useState("");

  const haveFine = currentReport.getData("haveFine");

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  useEffect(() => {
    if (!isFirstLoad) {
      const updatedCategories = findParentAndChildCategories;
      setCategoryHeader(updatedCategories.parent.name);
      setCategorySubHeader(updatedCategories.child.name);
      setCategoriesItems(updatedCategories.child.items); // 1
      setCategoryType(updatedCategories.child.type);
      setCurrentReportItems(findRelevantReportData);
      setCurrentReportItemsForGrade(findRelevantReportData);
      setCategoryNames(findCategoriesNames);
    } else {
      setIsFirstLoad(false);
    }
  }, [currentCategoryIndex]);

  useEffect(() => {
    if (!isFirstLoad) {
      setDataForFlatListToDisplay(findDataForFlatlist); // 2
    }
  }, [CategoriesItems]);

  // ? todo list
  // ! todo list end

  // * handling changes in the report finding , replacing and returning the new report item
  const handleReportItemChange = useCallback((newReportItem, idx = false) => {
    setCurrentReportItemsForGrade((prev) => {
      if (idx) {
        const updatedReportItems = prev.map((reportItem, currentIndex) => {
          if (currentIndex === idx) {
            return newReportItem;
          }
          return reportItem;
        });
        return updatedReportItems;
      } else {
        const temp = [...prev];
        temp.splice(
          temp.findIndex((element) => {
            return element.id === newReportItem.id;
          }),
          1
        );
        temp.push(newReportItem);
        return temp;
      }
    });
  }, []);

  // * mapping over CategoriesItems and displaying the items
  const AccordionCategoriesGeneralList = useMemo(() => {
    return CategoriesItems.map((item) => {
      let reportItem = currentReportItems.find(
        (element) => element.id == item.id
      );
      const timeOfReport = currentReport.getData("timeOfReport");
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
            accordionHeight={350}
          />
        ),
      };
    });
  }, [CategoriesItems]);

  const accordionTempItemsLength = 10;

  const AccordionCategoriesTemperatureList = useMemo(() => {
    return Array.from({
      length: accordionTempItemsLength,
    }).map((_, i) => ({
      id: i,
      component: (
        <CategoryTempAccordionItem
          reportItem={currentReportItems[i] ?? false}
          control={control}
          setValue={setValue}
          trigger={trigger}
          errors={errors}
          accordionHeight={140}
          onTempReportItem={(reportItem) => {
            // if (reportItem.TempFoodName) {
            //   console.log("item:", i, reportItem);
            // }
            console.log("reportItem", reportItem);
            handleReportItemChange(reportItem, i);
          }}
        />
      ),
    }));
  }, [currentReportItems]);

  const accordionWeightsItemsLength = 10;

  const AccordionCategoriesWeightsList = useMemo(() =>
    Array.from({
      length: accordionWeightsItemsLength,
    }).map(
      (_, i) => ({
        id: i,
        component: (
          <CategoryWeightsAccordionItem
            reportItem={currentReportItems[i] ?? false}
            control={control}
            id={i}
            setValue={setValue}
            trigger={trigger}
            errors={errors}
            onWeightReportItem={(reportItem) => {
              // if (reportItem.WeightFoodName) {
              // }
              handleReportItemChange(reportItem);
              console.log("reportItem", reportItem);
            }}
            accordionHeight={150}
          />
        ),
      }),
      [currentReportItems]
    )
  );

  // * checking if currentReportItems isnt empty then looking the right accordion compt to render based on the currentSubCategoryId
  const findDataForFlatlist = useMemo(() => {
    // if (currentReportItems.length > 0) {
    // console.log("current categories", currentCategories.currentCategories);
    if (currentCategories.categories[currentCategoryIndex] == 1) {
      return AccordionCategoriesTemperatureList;
    } else if (currentCategories.categories[currentCategoryIndex] == 2) {
      return AccordionCategoriesWeightsList;
    } else {
      return AccordionCategoriesGeneralList;
    }
    // }
    return [];
  }, [CategoriesItems]);

  const [dataForFlatListToDisplay, setDataForFlatListToDisplay] =
    useState(findDataForFlatlist);
  // console.log("dataForFlatListToDisplay", dataForFlatListToDisplay);
  // console.log("findDataForFlatlist", findDataForFlatlist);
  let categoriesModal = [];

  if (categoryNames[1].length > 0) {
    const categoryNames1 = [];
    currentCategories.categories.forEach((categoryId) => {
      const category = categoryNames[1].find((c) => c.id == categoryId);
      if (category) {
        categoryNames1.push(category);
      }
    });
    categoriesModal.push({
      subheader: "ביקורת בטיחות מזון",
      options: categoryNames1,
    });
  }
  if (categoryNames[2].length > 0) {
    const categoryNames2 = [];
    currentCategories.categories.forEach((categoryId) => {
      const category = categoryNames[2].find((c) => c.id == categoryId);
      if (category) {
        categoryNames2.push(category);
      }
    });
    categoriesModal.push({
      subheader: "ביקורת קולינארית",
      options: categoryNames2,
    });
  }
  if (categoryNames[3].length > 0) {
    const categoryNames3 = [];
    currentCategories.categories.forEach((categoryId) => {
      const category = categoryNames[3].find((c) => c.id == categoryId);
      if (category) {
        categoryNames3.push(category);
      }
    });
    categoriesModal.push({
      subheader: "ביקורת תזונה",
      options: categoryNames3,
    });
  }

  const majorCategoryHeadersToPass = categoriesModal.map(
    (category) => category.subheader
  );

  // const categoriesToPassSummeryScreen = [
  //   majorCategoryHeadersToPass,
  //   { categoryNames: categoryNames },
  // ];
  // console.log(categoriesToPassSummeryScreen[5]);
  // todo to initiate save current report/category status on every navigation.
  // * Simulating your debounce function
  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  }

  // * categories picker close function
  const handleModalClose = () => {
    setModalVisible(false);
  };

  // * modal pick handler
  const handleOptionClick = (option) => {
    const indexOfCategory = currentCategories.categories.findIndex(
      (category) => category == option
    );
    setCurrentCategoryIndex(indexOfCategory);
    handleModalClose();
    if (selectedModalCategory) {
      console.log("modal option choice:", option);
      // debounce(saveReport(), 300);
      saveReport();
    }
  };
  console.log("categoryEdit", content);
  // * post request on the changes of the report edit
  const saveReport = async () => {
    const targetId = currentCategories.categories[currentCategoryIndex];
    let foundCategory = null;
    // let parsedCategoriesDataFromReport = JSON.parse(categoriesDataFromReport);

    parsedCategoriesDataFromReport.forEach((category) => {
      if (category.id == targetId) {
        foundCategory = category;
        return;
      }
    });

    if (foundCategory) {
      foundCategory.items = [...currentReportItemsForGrade];
      foundCategory.grade = categoryGrade;
    } else {
      console.log("ID not found");
    }

    const bodyFormData = new FormData();
    bodyFormData.append("id", currentReport.getData("id"));
    bodyFormData.append("workerId", currentReport.getData("workerId"));
    bodyFormData.append("clientId", currentReport.getData("clientId"));
    bodyFormData.append("status", currentReport.getData("status"));
    bodyFormData.append("newCategorys", currentReport.getData("categorys"));
    bodyFormData.append("newGeneralCommentTopText", content);
    bodyFormData.append(
      "data",
      JSON.stringify([parsedCategoriesDataFromReport[currentCategoryIndex]])
    );
    try {
      setIsLoading(true);
      const apiUrl = process.env.API_BASE_URL + "ajax/saveReport.php";
      const response = await axios.post(apiUrl, bodyFormData);
      if (response.status == 200 || response.status == 201) {
        let updatedValues = JSON.stringify(parsedCategoriesDataFromReport);
        currentReport.setData("data", updatedValues);
        currentReport.setData("newGeneralCommentTopText", content);
        const responseClients = await fetchData(
          process.env.API_BASE_URL + "api/clients.php",
          { id: userId }
        );
        if (responseClients.success) {
          let clients = [];
          responseClients.data.forEach((element) => {
            clients.push(new Client(element));
          });
          dispatch(setClients({ clients: clients }));
          console.log("client refreshed");
        }
        dispatch(getCurrentReport(currentReport));

        setIsLoading(false);
        console.log("[CategoryEdit]success saving report");
        return response.data;
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error making POST request:", error);
    }
    // const reportSaved = await saveCurrentScreenData(
    //   bodyFormData,
    //   "ajax/saveReport.php"
    // );
    // if (reportSaved) {
    //   let updatedValues = JSON.stringify(parsedCategoriesDataFromReport);
    //   currentReport.setData("data", updatedValues);
    //   currentReport.setData("newGeneralCommentTopText", content);
    //   dispatch(getCurrentReport(currentReport));
    // }
  };

  // * pagination's between categories names : Prev
  const prevCategory = async () => {
    debounce(saveReport(), 300);

    try {
      if (currentCategoryIndex === 0) {
        console.log(
          "the first of categories:",
          currentCategories.categories[currentCategoryIndex]
        );

        navigateToRoute(routes.ONBOARDING.WorkerNewReport);
        return;
      }
      setCurrentCategoryIndex((prevIndex) => prevIndex - 1);

      console.log("moving to the prev category");
    } catch (error) {
      console.error("Error in nextCategory:", error);
    }
  };

  // * pagination's between categories names : Next
  const nextCategory = async () => {
    debounce(saveReport(), 300);
    // console.log("majorCategoryHeadersToPass", majorCategoryHeadersToPass);
    // console.log("categoryNames", categoryNames);
    try {
      if (currentCategoryIndex === lastIndexOfCategories) {
        console.log(
          "Reached the last category:",
          currentCategories.categories[currentCategoryIndex]
        );
        navigateToRoute(routes.ONBOARDING.SummeryScreen);
        dispatch(setCurrentCategories(currentCategories.categories));
        // dispatch(setSummary(categoriesToPassSummeryScreen));

        dispatch(setMajorCategoryHeaders(majorCategoryHeadersToPass));
        dispatch(setCategoryNamesSubHeaders(categoryNames));
        // todo to send foward these params : positiveFeedback, grades, summeryAndNotes, file1 , file2
        // navigateToRoute(routes.ONBOARDING.SummeryScreen);
        return;
      }

      setCurrentCategoryIndex((prevIndex) => prevIndex + 1);

      console.log("Moving to the next category");
    } catch (error) {
      console.error("Error in nextCategory:", error);
    }
  };

  // ! drawer logic end
  const renderItem = ({ item }) => {
    // console.log("Rendering item:", item.id);
    return <CategoryAccordion item={item} />;
  };

  return (
    <>
      <ScreenWrapper
        isConnectedUser
        wrapperStyle={{ backgroundColor: colors.white }}
      >
        <GoBackNavigator
          text={"חזרה לרשימת הלקוחות"}
          containerStyling={{
            marginBottom: 16,
            marginTop: 16,
          }}
          onBackPress={async () => {
            setIsLoading(true);
            try {
              setIsLoading(false);
              const res = await saveReport();
              console.log("response", res);
            } catch (error) {
              setIsLoading(false);
              console.log("err", error);
            }
          }}
        />
        <View style={styles.headerWrapper}>
          <Header
            HeaderText={`עריכת דוח עבור ${currentClient.getCompany()} - ${currentStation} `}
            subHeader={true}
            subHeaderText={`${categoryHeader} >${categorySubHeader}`}
            iconList={true}
            onCategoriesIconPress={() => setModalVisible(true)}
            onSettingsIconPress={async () => {
              await saveReport();
              navigateToRoute(routes.ONBOARDING.WorkerNewReport);
            }}
            onSummeryIconPress={async () => {
              // console.log("s");
              setIsLoading(true);
              try {
                await saveReport();
                dispatch(setMajorCategoryHeaders(majorCategoryHeadersToPass));
                dispatch(setCategoryNamesSubHeaders(categoryNames));
              } catch (error) {
                console.log("categoryEdit[err]", error);
              } finally {
                setIsLoading(false);
              }
            }}
          />
        </View>

        <View style={styles.categoryContainer}>
          <GradeCalculator
            categoryType={categoryType}
            categoryNames={categoryNames}
            parsedCategoriesDataFromReport={parsedCategoriesDataFromReport}
            currentReportItemsForGrade={currentReportItemsForGrade}
            majorCategory={categoryHeader}
            passedDownCategoryId={
              currentCategories.categories[currentCategoryIndex]
            }
            CategoriesItems={CategoriesItems}
            currentReport={currentReport}
            onCategoryGradeChange={(value) => {
              // console.log("grade", value);
              parsedCategoriesDataFromReport.find(
                (item) =>
                  item.id == currentCategories.categories[currentCategoryIndex]
              ).grade = categoryGrade;
              currentReport.setData(
                "data",
                JSON.stringify(parsedCategoriesDataFromReport)
              );
              setCategoryGrade(value);
            }}
            onMajorCategoryGradeChange={(value) => {
              if (categoryType == 2) {
                currentReport.setData("culinaryGrade", value);
              } else if (categoryType == 1) {
                currentReport.setData("safetyGrade", value);
              } else {
                currentReport.setData("nutritionGrade", value);
              }
            }}
            onReportGradeChange={(value) => {
              currentReport.setData("grade", value);
            }}
          />
          {/* todo bug on andriod here */}
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
            {isLoading ? (
              <Loader visible={isLoading} isSetting={false} />
            ) : (
              <FlatList
                data={dataForFlatListToDisplay}
                style={{ width: Platform.OS == "android" ? 742 : 762 }}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={
                  isLoading ? <Loader visible={true} /> : null
                }
              />
            )}
          </View>
        </View>

        {modalVisible && (
          <View>
            <ModalUi
              categoryEdit={true}
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
        <SummaryDrawer
          onPrevCategory={prevCategory}
          prevCategoryText={
            currentCategoryIndex == 0
              ? "למסך הגדרות"
              : "הקטגוריה הקודמת: " + matchedNames[currentCategoryIndex - 1]
          }
          onNextCategory={nextCategory}
          nextCategoryText={
            lastIndexOfCategories == currentCategoryIndex
              ? "למסך סיכום"
              : "הקטגוריה הבאה: " + matchedNames[currentCategoryIndex + 1]
          }
          onSetContent={(value) => setContent(value)}
          currentCategoryId={currentCategories.categories[currentCategoryIndex]}
          currentReportItemsForGrade={currentReportItemsForGrade}
          memoizedCategories={memoizedCategories}
        />
      </View>
    </>
  );
};

export default React.memo(CategoryEdit);

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
    width: "100%",
    justifyContent: "center",
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
});
