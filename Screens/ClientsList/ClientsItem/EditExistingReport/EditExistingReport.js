import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Button,
  ScrollView,
  Switch,
  KeyboardAvoidingView,
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
import CategoryTempAccordionItem from "./innerComponents/CategoryTempAccordionItem";
import Drawer from "../../../../Components/ui/Drawer";
import { LinearGradient } from "expo-linear-gradient";
import accordionCloseIcon from "../../../../assets/imgs/accordionCloseIndicator.png";
import FileIcon from "../../../../assets/icons/iconImgs/FileIcon.png";
import Category from "../../../../Components/modals/category";
import ModalUi from "../../../../Components/ui/ModalUi";
import CloseDrawerIcon from "../../../../assets/imgs/oncloseDrawerIcon.png";
import { debounce, get, result } from "lodash";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";
import ColorPicker from "react-native-wheel-color-picker";
import SummaryAndNote from "./innerComponents/SummaryAndNote";
import CategoryItemName from "./innerComponents/categoryItemName";
import "@env";

import axios from "axios";
import { getCurrentReport } from "../../../../store/redux/reducers/getCurrentReport";

import routes from "../../../../Navigation/routes";
import { getCurrentCategory } from "../../../../store/redux/reducers/getCurrentCategory";
import GradeCalculator from "./innerComponents/GradeCalculator";
import IconList from "./innerComponents/IconList";
import GoBackNavigator from "../../../../utiles/GoBackNavigator";
import Header from "../../../../Components/ui/Header";
import { setSummary } from "../../../../store/redux/reducers/summerySlice";

const EditExistingReport = () => {
  // console.log("EditExistingReport");
  const { navigateToRoute } = useScreenNavigator();
  // ! redux stpre fetching
  const dispatch = useDispatch();
  const currentStation = useSelector((state) => state.currentStation);
  // const categories = useSelector((state) => state.categories);

  const currentSubCategoryId = useSelector((state) => state.currentCategory);
  const currentCategories = useSelector((state) => state.currentCategories);
  const globalCategories = useSelector((state) => state.globalCategories);
  const currentClient = useSelector(
    (state) => state.currentClient.currentClient
  );
  const currentReport = useSelector(
    (state) => state.currentReport.currentReport
  );

  // const memoizedCategories = useMemo(() => categories, [categories]);

  const memoizedCategories = useMemo(
    () => globalCategories,
    [globalCategories]
  );

  const memoRizedCats = memoizedCategories?.categories;
  const globalStateCategories = memoRizedCats
    ? Object.values(memoRizedCats).flatMap((category) => category.categories)
    : null;
  // * looking for a categories names in the global state
  const matchedNames = currentCategories.categories.map(
    (obj) => globalStateCategories.find((obj2) => obj == obj2.id).name
  );

  // for drawer usage
  const lastIndexOfCategories =
    Object.keys(currentCategories.categories).length - 1;
  const passedDownCategoryId = currentSubCategoryId.currentCategory;
  // ! redux stpre fetching end
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
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
  // console.log(findParentAndChildCategories);
  const drawerRef = useRef(null);
  const richText = useRef();
  const [categoryGrade, setCategoryGrade] = useState(0);
  const [majorCategoryGrade, setMajorCategoryGrade] = useState(0);
  const [reportGrade, setReportGrade] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [relevantCheckboxItems, setRelevantCheckboxItems] = useState([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [selectedModalCategory, setSelectedModalCategory] = useState([]);
  const [colorSelected, setColorSelected] = useState(null);
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
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
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
  const categoriesDataFromReport = currentReport.getCategoriesData();
  const parsedCategoriesDataFromReport = JSON.parse(categoriesDataFromReport);

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const haveFine = currentReport.getData("haveFine");
  const haveSafetyGrade = currentReport.getData("haveSafetyGrade");
  const haveCulinaryGrade = currentReport.getData("haveCulinaryGrade");
  const haveNutritionGrade = currentReport.getData("haveNutritionGrade");
  const haveCategoriesNameForCriticalItems = currentReport.getData(
    "haveCategoriesNameForCriticalItems"
  );

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
  // todo bug issues when initiating the next/prev category :
  // todo 4 : when clickig on next/prev and getting to the temp/weights compts it skips and move to the next general category (check the findDataForFlatlist function logic).
  // todo 5 : not sure if the right CategoriesItems/currentReportItems relevent data is passed correctly (to check the categoryChange function).
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
            if (reportItem.TempFoodName) {
              console.log("item:", i, reportItem);
              handleReportItemChange(reportItem, i);
            }
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
              if (reportItem.WeightFoodName) {
                handleReportItemChange(reportItem);
              }
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

  // console.log("findDataForFlatlist", findDataForFlatlist);

  const categoriesModal = [
    {
      subheader: "ביקורת בטיחות מזון",
      options: categoryNames[1],
    },
    {
      subheader: "ביקורת קולנירית",
      options: categoryNames[2],
    },
    {
      subheader: "ביקורת תזונה",
      options: categoryNames[3],
    },
  ];

  // * Simulating your debounce function
  const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  };
  // * get the category type value from the categories
  const getCategory = (categoryId) => {
    for (const [key, value] of Object.entries(memoizedCategories.categories)) {
      let found = value.categories.find(
        (category) => category.id == categoryId
      );
      if (found) {
        // console.log("found", found);
        return found;
      }
    }
    return false;
  };

  // console.log(findParentAndChildCategories);
  // todo need to verify activity
  // * getting the desired category information to display
  const desiredCategory = () => {
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
    // setCategoriesItems(
    //   categories.categories[parentCategory].categories[indexSubcategory].items
    // );
    // setCategorySubHeader(
    //   categories.categories[parentCategory].categories[indexSubcategory].name
    // );
    // setCategoryHeader(categories.categories[parentCategory].name);
    // setCategoryType(
    //   categories.categories[parentCategory].categories[indexSubcategory].type
    // );
  };
  // useEffect(() => {
  //   desiredCategory();
  // }, [currentCategoryIndex]);

  // useEffect(() => {
  //   dispatch(fetchCategories());
  // }, [dispatch]);

  // console.log(findCategoriesNames);
  //  * 1. checking if the ids of the categories match to the selected report
  // *  2.  sorting them by type to their right location based on their parent category
  // todo need to verify activity
  const handleCheckboxStatusChange = () => {
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

        if (currentCategories.categories.has(categoryId)) {
          newCategoryNames[categoryType].push({
            id: categoryId,
            name: categoryName,
          });
        }
      });
    }
    setCategoryNames(newCategoryNames);
    // setCheckboxStatus(newCheckboxStatus);
  };

  // useEffect(() => {
  //   console.log("inside", currentCategories);
  //   if (currentCategories) {
  //     // const categoryIds = currentCategories.currentCategories;
  //     // const categorySet = new Set(categoryIds);
  //     handleCheckboxStatusChange();
  //   } else {
  //     console.log("currentCategories is not a valid Set or is empty.");
  //   }
  // }, [currentCategories]);

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

  // ? random functions

  // * form submit function
  const onSubmitForm = () => {
    // console.log("form values:", getValues());
    if (isFormSubmitted) {
      console.log("form submitted");
    }
  };
  // ! random function end

  // todo need to verify
  // * finding the current report data based on the category id from the report edit mode.
  const getRelevantReportData = (data) => {
    //  parsing the data.
    if (!data) {
      console.log("No data provided");
      return;
    }
    const CategoriesArrayOfData = JSON.parse(data);
    //  getting the relevent data of the categories based on the current sub Category.
    const relevantData = CategoriesArrayOfData.find(
      (category) =>
        category.id == currentCategories.categories[currentCategoryIndex]
    );
    // if the current sub category is true then set me his items else send a err msg.
    if (relevantData) {
      setCurrentReportItemsForGrade(relevantData.items);
      setCurrentReportItems(relevantData.items);
    } else {
      console.log("Failed to find Relevant Data");
    }
  };

  //  * passing the data from the current report and storing it in the state in the getRelevantReportData function.
  // useEffect(() => {
  //   getRelevantReportData(categoriesDataFromReport);
  // }, [currentCategoryIndex]);

  // ?  summeryAndNotesManager drawer logic
  // * drawer handler
  const handleDrawerToggle = (isOpen) => {
    setIsDrawerOpen(isOpen);
  };

  const closeDrawer = () => {
    if (drawerRef.current) {
      drawerRef.current.closeDrawer();
      setIsDrawerOpen(false);
    }
  };

  // * newGeneralCommentTopText drawer change handler
  const handleContentChange = debounce((content) => {
    // console.log("content:", content);
    const strippedContent = content.replace(/<\/?div[^>]*>/g, "");
    richText.current?.setContentHTML(strippedContent);
    setContent(content);
  }, 300);

  // * newGeneralCommentTopText color picker
  const handleCustomAction = () => {
    setColorSelected(!colorSelected);
    console.log("Custom action triggered");
  };
  useEffect(() => {
    if (content == "") {
      handleContentChange(currentReport.getData("newGeneralCommentTopText"));
    }
  }, []);

  // * summery and notes drawer logic
  const summeryAndNotesManager = (types, condition) => {
    let commentGroups = { critical: [], severe: [], normal: [] };
    // const parsedCategoriesDataFromReport = JSON.parse(categoriesDataFromReport);
    // * looping through the report categories data.
    parsedCategoriesDataFromReport.forEach((category) => {
      const items =
        category.id == currentCategories.categories[currentCategoryIndex]
          ? currentReportItemsForGrade
          : category.items;
      // * inner loop of the categories items.
      for (const currentReportItem of items) {
        for (let type of types) {
          // * looking for the major category base on the type so we can display its subcategories
          const relevantCategoryToFind = memoizedCategories.categories[
            type
          ].categories.find((el) => el.id == category.id);
          if (!relevantCategoryToFind) continue;
          // * looking the relevent category in the items based on their id's.
          const categoriesMatchReportId = relevantCategoryToFind.items.find(
            (categoryItem) => categoryItem.id == currentReportItem.id
          );

          // * checking if the conditions is true base on
          if (condition(category, currentReportItem)) {
            let comment = currentReportItem.comment;

            if (
              currentReportItem.image ||
              currentReportItem.image2 ||
              currentReportItem.image3
            ) {
              comment += " - מצורפת תמונה";
            }

            if (
              categoriesMatchReportId &&
              categoriesMatchReportId.critical == 1 &&
              currentReportItem.grade == 0
            ) {
              if (haveCategoriesNameForCriticalItems == 1) {
                comment = (
                  <Text style={{ color: "red" }}>
                    {comment}
                    <Text style={{ fontFamily: fonts.ABold }}>
                      {" "}
                      *הקטגוריה {getCategory(category.id).name} התאפסה
                    </Text>
                  </Text>
                );
              }

              commentGroups.critical.push(comment);
            } else if (
              categoriesMatchReportId &&
              categoriesMatchReportId.critical == 0 &&
              currentReportItem.grade == 0
            ) {
              commentGroups.severe.push(comment);
            } else {
              commentGroups.normal.push(comment);
            }
          }
        }
      }
    });

    return [
      ...commentGroups.critical,
      ...commentGroups.severe,
      ...commentGroups.normal,
    ];
  };

  // console.log("currentCategoryIndex:", currentCategoryIndex);
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
        dispatch(getCurrentReport(currentReport));
        setIsLoading(false);
        navigateToRoute(routes.ONBOARDING.SummeryScreen);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error making POST request:", error);
    }
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
        return;
      }
      setCurrentCategoryIndex((prevIndex) => prevIndex - 1);

      console.log("moving to the prev category");
    } catch (error) {
      console.error("Error in nextCategory:", error);
    }
  };

  // console.log("categorys",currentReport.getData("categorys"));
  // * pagination's between categories names : Next
  const nextCategory = async () => {
    debounce(saveReport(), 300);

    const categoriesToPassSummeryScreen = [
      foodSafety,
      nutrition,
      culinary,
      reportGrade,
    ];
    try {
      if (currentCategoryIndex === lastIndexOfCategories) {
        console.log(
          "categoriesToPassSummeryScreen",
          categoriesToPassSummeryScreen
        );
        console.log(
          "Reached the last category:",
          currentCategories.categories[currentCategoryIndex]
        );
        dispatch(setSummary(categoriesToPassSummeryScreen));
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

  // ? console log section
  // console.log(matchedNames[2], currentCategories.currentCategories);
  // useEffect(() => {
  //   console.log(
  //     "[EditExistingReport]currentReport:",
  //     currentReport,
  //     currentCategories.categories
  //   );
  // }, []);
  // ! console log end

  // ? arrays for flatList

  // todo optimize memorized performance
  // * define a function to select the appropriate array based on the category ID

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
        />
        <View style={styles.headerWrapper}>
          <Header
            HeaderText={`עריכת דוח עבור ${currentClient.getCompany()} - ${currentStation} `}
            subHeader={true}
            subHeaderText={`${categoryHeader} >${categorySubHeader}`}
            iconList={true}
            onCategoriesIconPress={() => setModalVisible(true)}
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
              setCategoryGrade(value);
            }}
            onMajorCategoryGradeChange={(value) => {
              // console.log("major category grade", value);
              // setCategoryGrade(value);
              // setMajorCategoryGrade(value);
              if (currentCategories.categories[currentCategoryIndex] == 5) {
                setFoodSafety(value);
              } else if (
                currentCategories.categories[currentCategoryIndex] == 1
              ) {
                setCulinary(value);
              } else {
                setNutrition(value);
              }
            }}
            onReportGradeChange={(value) => {
              // console.log("report  grade", value);
              // setCategoryGrade(value);
              setReportGrade(value);
            }}
          />

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
              <Loader visible={isLoading} />
            ) : (
              <FlatList
                data={dataForFlatListToDisplay}
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
          header={
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
                  <TouchableOpacity onPress={() => closeDrawer()}>
                    <Image
                      source={CloseDrawerIcon}
                      style={{ width: 20, height: 20 }}
                    />
                  </TouchableOpacity>
                )}

                {!isDrawerOpen && (
                  <TouchableOpacity
                    onPress={prevCategory}
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
                      {currentCategoryIndex == 0
                        ? ""
                        : matchedNames[currentCategoryIndex - 1]}
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
                    onPress={nextCategory}
                    style={{
                      alignSelf: "center",
                      flexDirection: "row",
                      gap: 5,
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.categoryDirButton}>
                      הקטגוריה הבאה:{" "}
                      {lastIndexOfCategories == currentCategoryIndex
                        ? "למסך סיכום"
                        : matchedNames[currentCategoryIndex + 1]}
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
          content={[
            <SummaryAndNote
              height={207}
              header={"תמצית הדוח"}
              summaryAndNoteContent={
                <View
                  style={{
                    flex: 1,
                    width: "100%",
                    marginTop: 20,
                    height: "100%",
                    direction: "rtl",
                    paddingHorizontal: 16,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#D3E0FF",
                      width: "100%",
                      alignItems: "flex-start",
                      // marginBottom: 200,
                      position: "relative",
                      zIndex: 3,
                    }}
                  >
                    <RichToolbar
                      editor={richText}
                      selectedButtonStyle={{ backgroundColor: "#baceff" }}
                      unselectedButtonStyle={{ backgroundColor: "#D3E0FF" }}
                      iconTint="#000000"
                      selectedIconTint="#000000"
                      actions={[
                        actions.insertOrderedList,
                        actions.insertBulletsList,
                        actions.setUnderline,
                        actions.setItalic,
                        actions.setBold,
                        "custom",
                      ]}
                      // onPressAddImage={onPressAddImage}
                      // onAction={onAction} // Add the onAction prop for custom actions
                      iconMap={{
                        ["custom"]: ({}) => <Text>C</Text>,
                      }}
                      custom={handleCustomAction}
                    />
                  </View>
                  {colorSelected && (
                    <View
                      style={{
                        direction: "ltr",
                        width: 200,
                        position: "absolute",
                        top: 20,
                        zIndex: 3,
                      }}
                    >
                      <ColorPicker
                        onColorChange={(color) => {
                          console.log(color);
                          richText.current?.setForeColor(color);
                        }}
                        sliderSize={20}
                        thumbSize={60}
                        gapSize={5}
                        // noSnap={true}
                        color="#000000"
                        palette={[
                          "#000000",
                          "#ffff00",
                          "#0000ff",
                          "#ff0000",
                          "#00ff00",
                        ]}
                        swatches={true}
                      />
                    </View>
                  )}
                  <ScrollView
                    style={{
                      // flex: Platform.OS === "ios" ? 1 : 0,
                      flex: 1,
                      // direction: "ltr",
                      // direction: "rtl",
                      overflow: "visible",
                      height: "100%",
                      minHeight: 250,
                    }}
                  >
                    <KeyboardAvoidingView
                      behavior={Platform.OS === "ios" ? "padding" : "height"}
                      style={{ flex: 1 }}
                    >
                      <RichEditor
                        ref={richText}
                        onChange={handleContentChange}
                        initialContentHTML={content}
                        placeholder={
                          "פה יכתב תמצית הדוח באופן אוטומטי או ידני או משולב בהתאם לבחירת הסוקר"
                        }
                        shouldStartLoadWithRequest={(request) => {
                          return true;
                        }}
                        style={{
                          minHeight: 123,
                          // direction: "ltr",
                          // direction: "rtl",
                          borderWidth: 1,
                          borderColor: "#eee",
                          zIndex: 2,
                          overflow: "visible",
                        }}
                      />
                    </KeyboardAvoidingView>
                  </ScrollView>
                </View>
              }
            />,
            <SummaryAndNote
              header={" הערות ביקורת בטיחות מזון"}
              height={160}
              verticalSpace={16}
              summaryAndNoteContent={
                <>
                  <FlatList
                    data={
                      haveSafetyGrade == 1
                        ? summeryAndNotesManager(
                            [1],
                            (category, item) =>
                              item.showOnComment == 1 &&
                              item.charge != "הלקוח" &&
                              item.charge != "מנהל המשק" &&
                              item.charge != "בית החולים"
                            // item &&
                            // getCategory(category.id).type == 1
                          )
                        : null
                    }
                    renderItem={({ item, index }) => {
                      // summeryAndNotesManager(item);
                      // console.log(`currentReportItems:`, currentReportItems);
                      return (
                        <CategoryItemName
                          key={item.id}
                          number={index + 1}
                          item={item}
                        />
                      );
                    }}
                    keyExtractor={(item, index) =>
                      item.id ? item.id.toString() : index.toString()
                    }
                  />
                </>
              }
            />,
            <SummaryAndNote
              header={"הערות ביקורת קולינארית"}
              height={160}
              verticalSpace={16}
              summaryAndNoteContent={
                <>
                  <FlatList
                    data={
                      haveCulinaryGrade == 1
                        ? summeryAndNotesManager(
                            [2],
                            (category, item) =>
                              item.showOnComment == 1 &&
                              item.charge != "הלקוח" &&
                              item.charge != "מנהל המשק" &&
                              item.charge != "בית החולים"
                            // item &&
                            // getCategory(category.id).type == 2
                          )
                        : null
                    }
                    // data={haveCulinaryGrade == 1 ? categoriesDataFromReport : null}
                    renderItem={({ item, index }) => (
                      <CategoryItemName
                        key={item.id}
                        number={index + 1}
                        item={item}
                      />
                    )}
                    keyExtractor={(item, index) =>
                      item.id ? item.id.toString() : index.toString()
                    }
                  />
                </>
              }
            />,
            <SummaryAndNote
              header={"הערות תזונה"}
              height={160}
              verticalSpace={16}
              summaryAndNoteContent={
                <>
                  <FlatList
                    data={
                      haveNutritionGrade == 1
                        ? summeryAndNotesManager(
                            [3],
                            (category, item) =>
                              item.showOnComment == 1 &&
                              item.charge != "הלקוח" &&
                              item.charge != "מנהל המשק" &&
                              item.charge != "בית החולים"
                            // item &&
                            // getCategory(category.id).type == 3
                          )
                        : null
                    }
                    // data={haveNutritionGrade == 1 ? categoriesDataFromReport : null}
                    renderItem={({ item, index }) => (
                      <CategoryItemName
                        key={item.id}
                        number={index + 1}
                        item={item}
                      />
                    )}
                    keyExtractor={(item, index) =>
                      item.id ? item.id.toString() : index.toString()
                    }
                  />
                </>
              }
            />,
            <SummaryAndNote
              header={"הערות באחריות לקוח"}
              height={160}
              verticalSpace={16}
              summaryAndNoteContent={
                <>
                  <FlatList
                    // data={haveSafetyGrade == 1 ? categoriesDataFromReport : null}
                    data={summeryAndNotesManager(
                      [1, 2, 3],
                      (category, item) =>
                        item.showOnComment == 1 &&
                        (item.charge == "הלקוח" || item.charge == "מנהל המשק")
                    )}
                    renderItem={({ item, index }) => (
                      <CategoryItemName
                        key={item.id}
                        number={index + 1}
                        item={item}
                      />
                    )}
                    keyExtractor={(item, index) =>
                      item.id ? item.id.toString() : index.toString()
                    }
                  />
                </>
              }
            />,
            <SummaryAndNote
              header={"הערות תשתית (באחריות בית החולים)"}
              height={160}
              verticalSpace={16}
              summaryAndNoteContent={
                <>
                  <FlatList
                    // data={haveSafetyGrade == 1 ? categoriesDataFromReport : null}
                    data={summeryAndNotesManager(
                      [1, 2, 3],
                      (category, item) =>
                        item.showOnComment == 1 && item.charge == "בית החולים"
                    )}
                    renderItem={({ item, index }) => (
                      <CategoryItemName
                        key={item.id}
                        number={index + 1}
                        item={item}
                      />
                    )}
                    keyExtractor={(item, index) =>
                      item.id ? item.id.toString() : index.toString()
                    }
                  />
                </>
              }
            />,
          ]}
          height={647}
          onToggle={handleDrawerToggle}
          ref={drawerRef}
          closeDrawer={closeDrawer}
          contentStyling={{ padding: 16 }}
        />
      </View>
    </>
  );
};

export default React.memo(EditExistingReport);

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
