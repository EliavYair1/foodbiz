import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Image,
  ScrollView,
  Switch,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useRef, useEffect, useMemo } from "react";
import useScreenNavigator from "../../Hooks/useScreenNavigator";
import ScreenWrapper from "../../utiles/ScreenWrapper";
import rightDirectionIcon from "../../assets/imgs/rightDirIcon.png";
import fonts from "../../styles/fonts";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../../styles/colors";
import Accordion from "../../Components/ui/Accordion";
import { FlatList } from "react-native-gesture-handler";
import SelectMenu from "../../Components/ui/SelectMenu";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import Input from "../../Components/ui/Input";
import ToggleSwitch from "../../Components/ui/ToggleSwitch";
import DatePicker from "../../Components/ui/datePicker";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";
// import { ColorPicker, fromHsv } from "react-native-color-picker";
import ColorPicker from "react-native-wheel-color-picker";

import Expander from "../../Components/ui/Expander";
import accordionCloseIcon from "../../assets/imgs/accordionCloseIndicator.png";
import accordionOpenIcon from "../../assets/imgs/accordionOpenIndicator.png";
import ClientItemArrow from "../../assets/imgs/ClientItemArrow.png";
import CategoryPrevIcon from "../../assets/imgs/rightDirIcon.png";
import ClientItemArrowOpen from "../../assets/imgs/accodionOpenIndicatorBlack.png";
import onDragIcon from "../../assets/imgs/onDragIcon.png";
import Checkbox from "../../Components/ui/Checkbox";
import { debounce, get, result } from "lodash";
import FetchDataService from "../../Services/FetchDataService";
import "@env";
import axios from "axios";
import { fetchCategories } from "../../store/redux/reducers/categoriesSlice";
import { fetchReportsTimes } from "../../store/redux/reducers/reportsTimesSlice";
import CheckboxItem from "./CheckboxItem/CheckboxItem";
import Loader from "../../utiles/Loader";
import { HelperText } from "react-native-paper";
import Drawer from "../../Components/ui/Drawer";
import FileIcon from "../../assets/icons/iconImgs/FileIcon.png";
import ImageText from "../ClientsList/ClientsItem/EditExistingReport/innerComponents/ImageText";
import routes from "../../Navigation/routes";
// import setCurrentCategoryItem from "../../store/redux/reducers/getCurrentCategory";
// import getCurrentStation from "../../store/redux/reducers/getCurrentStation";
import { getCurrentCategory } from "../../store/redux/reducers/getCurrentCategory";
import { getCurrentReport } from "../../store/redux/reducers/getCurrentReport";
const WorkerNewReport = () => {
  const richText = useRef();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [colorSelected, setColorSelected] = useState(false);
  const { navigateTogoBack, navigateToRoute } = useScreenNavigator();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const clients = useSelector((state) => state.clients);
  const categories = useSelector((state) => state.categories);
  const reportsTimes = useSelector((state) => state.reportsTimes);
  const [categoryPicked, setcategoryPicked] = useState(null);
  const currentClient = useSelector(
    (state) => state.currentClient.currentClient
  );
  const currentReport = useSelector(
    (state) => state.currentReport.currentReport
  );

  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [isSchemaValid, setIsSchemaValid] = useState(false);
  const [formData, setFormData] = useState({ clientId: currentClient?.id });
  const [checkboxStatus, setCheckboxStatus] = useState({
    foodSafetyReviewCbStatus: [],
    culinaryReviewCbStatus: [],
    nutritionReviewCbStatus: [],
  });
  const [selectedStation, setSelectedStation] = useState(null);
  const [currentReportTime, setCurrentReportTime] = useState(null);
  const [accompanySelected, setAccompanySelected] = useState(null);
  const [categoryAccordionHeight, setCategoryAccordionHeight] = useState(172);
  const [switchStates, setSwitchStates] = useState({
    haveFine: false,
    haveAmountOfItems: false,
    haveSafetyGrade: false,
    haveCulinaryGrade: false,
    haveNutritionGrade: false,
    haveCategoriesNameForCriticalItems: false,
  });
  const [currentReportDate, setCurrentReportDate] = useState(null);

  // console.log("date:", currentReportDate);
  // * categories checkboxes Texts
  const [foodSafetyReviewTexts, setFoodSafetyReviewTexts] = useState([]);
  const [culinaryReviewTexts, setCulinaryReviewTexts] = useState([]);
  const [nutritionReviewTexts, setNutritionReviewTexts] = useState([]);
  const schema = yup.object().shape({
    clientStationId: yup.string().required("station is required"),
    previousReports: yup.string().required("previous report is required"),
    accompany: yup.string().required("accompany is required"),
    timeOfReport: yup.string().required("date is required"),
    reportTime: yup.string(),
    categories: yup
      .array()
      .of(yup.number())
      .test("please choose at least one category", (value) => {
        const foodSafetyReviewSelected =
          Array.isArray(value) &&
          value.some(
            (id) =>
              Array.isArray(checkboxStatus.foodSafetyReviewCbStatus) &&
              checkboxStatus.foodSafetyReviewCbStatus.includes(id)
          );

        const culinaryReviewSelected =
          Array.isArray(value) &&
          value.some(
            (id) =>
              Array.isArray(checkboxStatus.culinaryReviewCbStatus) &&
              checkboxStatus.culinaryReviewCbStatus.includes(id)
          );

        const nutritionReviewSelected =
          Array.isArray(value) &&
          value.some(
            (id) =>
              Array.isArray(checkboxStatus.nutritionReviewCbStatus) &&
              checkboxStatus.nutritionReviewCbStatus.includes(id)
          );
        return (
          foodSafetyReviewSelected ||
          culinaryReviewSelected ||
          nutritionReviewSelected
        );
      }),
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
    schema
      .validate(formData)
      .then(() => setIsSchemaValid(true))
      .catch((err) => {
        // console.log("err:", err);
        setIsSchemaValid(false);
      });
    setValue("clientId", currentClient?.id);
  }, [formData, schema]);

  // * categories fetching start
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchReportsTimes());
  }, [dispatch]);

  const memoizedCategories = useMemo(() => categories, [categories]);
  // console.log(memoizedCategories);
  const findReportTimeName = (data) => {
    const reportTimeId = currentReport?.getReportTime();
    const reportTime = data.find((item) => item.id === reportTimeId);
    return reportTime ? reportTime.name : "";
  };

  useEffect(() => {
    const reportTimeName = findReportTimeName(reportsTimes);

    if (currentReport && currentReport.data) {
      const { data } = currentReport;

      setSwitchStates({
        haveFine: data.haveFine === "1",
        haveAmountOfItems: data.haveAmountOfItems === "1",
        haveSafetyGrade: data.haveSafetyGrade === "1",
        haveCulinaryGrade: data.haveCulinaryGrade === "1",
        haveNutritionGrade: data.haveNutritionGrade === "1",
        haveCategoriesNameForCriticalItems:
          data.haveCategoriesNameForCriticalItems === "1",
      });
      setSelectedStation(data.station_name);
      setAccompanySelected(data.accompany);
      setCurrentReportDate(data.timeOfReport);
      setCurrentReportTime(reportTimeName);
      handleContentChange(data.newGeneralCommentTopText);
      handleCheckboxStatusChange(
        parsedArrayOfStr(currentReport.getData("categorys"))
      );
    }
  }, [currentReport]);

  // console.log(currentReport);
  useEffect(() => {
    setFoodSafetyReviewTexts(
      memoizedCategories?.categories?.[1]?.categories ?? []
    );
    setCulinaryReviewTexts(
      memoizedCategories?.categories?.[2]?.categories ?? []
    );
    setNutritionReviewTexts(
      memoizedCategories?.categories?.[3]?.categories ?? []
    );
  }, [memoizedCategories, formData]);

  // * inner accordionCategoriesItem
  function accordionCategoriesItem(names, categoryName) {
    return names.map((item, index) => {
      // console.log("item id", item.id);
      const checkboxKey = `${categoryName}${index + 1}`;
      const categoryStatus = checkboxStatus[`${categoryName}Status`];
      // console.log("categoryStatus:", categoryStatus);
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
              handleChange={(checked) =>
                handleCategoriesCheckboxesToggle(
                  `${categoryName}Status`,
                  checked,
                  item.id
                )
              }
            />
          </View>
        ),
        boxItem: <Image style={{ width: 9, height: 14 }} source={onDragIcon} />,
      };
    });
  }

  // * checkbox counter
  const getCheckedCount = (category) => {
    const categoryStatus = checkboxStatus[`${category}Status`];
    return categoryStatus ? categoryStatus.length : 0;
  };

  // * redefine the Accordion height
  const changeCategoryAccordionHeight = (height, toggle) => {
    if (toggle) {
      setCategoryAccordionHeight((prev) => prev + height);
    } else {
      setCategoryAccordionHeight((prev) => prev - height);
    }
  };

  // * filtering the current client based on selected station
  const filteredStationsResult = currentClient
    .getReports()
    .filter((report) => report.getData("clientStationId") === selectedStation);

  // * newGeneralCommentTopText change handler
  const handleContentChange = debounce((content) => {
    // console.log(content);
    const strippedContent = content.replace(/<\/?div[^>]*>/g, "");
    richText.current?.setContentHTML(strippedContent);
    setValue("newGeneralCommentTopText", strippedContent);
    trigger("newGeneralCommentTopText");
    setFormData((prevFormData) => ({
      ...prevFormData,
      newGeneralCommentTopText: strippedContent,
    }));
  }, 300);

  // * setting the oldReportId from selected repor
  const handleReportIdAndWorkerId = (selectedReport) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      oldReportId: selectedReport.getData("id"),
      workerId: selectedReport.getData("workerId"),
    }));
    setValue("workerId", selectedReport.getData("workerId"));
    setValue("oldReportId", selectedReport.getData("id"));
    trigger("clientStationId");
    trigger("oldReportId");
  };
  const parsedArrayOfStr = (arr) => {
    const parsedSelectedReportCategory = new Set(
      arr
        .split("|")
        .map((str) => str.replace(";", ""))
        .filter(Boolean)
        .map((numStr) => parseInt(numStr, 10))
    );
    return parsedSelectedReportCategory;
  };
  // * parsing the report categories
  const handleSelectedReportCategory = (selectedReport) => {
    const selectedReportCategory = selectedReport.getData("categorys");

    const parsedSelectedReportCategory = parsedArrayOfStr(
      selectedReportCategory
    );
    return parsedSelectedReportCategory;
  };

  //  * 1. checking if the ids of the categories match to the selected report
  // *  2.  sorting them by type to their right location of the state
  const handleCheckboxStatusChange = (parsedSelectedReportCategory) => {
    const memoRizedCats = memoizedCategories?.categories;
    const globalStateCategories = memoRizedCats
      ? Object.values(memoRizedCats).flatMap((category) => category.categories)
      : null;
    let newCheckboxStatus = {
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
    }

    // Saving the categories checkbox status
    const categories = [
      ...newCheckboxStatus.foodSafetyReviewCbStatus,
      ...newCheckboxStatus.culinaryReviewCbStatus,
      ...newCheckboxStatus.nutritionReviewCbStatus,
    ];

    setFormData((prevFormData) => ({
      ...prevFormData,
      categories,
    }));
    setValue("categories", categories);
    trigger("categories");
    setCheckboxStatus(newCheckboxStatus);
  };

  // * get the array of categories from the report and updates the state
  const handleCategoriesCheckboxesToggle = (category, checked, label) => {
    // console.log("handleCategoriesCheckboxesToggle:", category, checked);

    setCheckboxStatus((prevStatus) => {
      const updatedCategoryStatus = [...prevStatus[category]];
      // find && parsing the index of the array
      const index = updatedCategoryStatus.indexOf(parseInt(label));

      //if checked and label is not found in the array add to the array
      if (checked && index === -1) {
        updatedCategoryStatus.push(parseInt(label));
        // if unchecked and label is found in the array remove to the array
      } else if (!checked && index !== -1) {
        updatedCategoryStatus.splice(index, 1);
      }
      handleFormChange(category, updatedCategoryStatus);
      return { ...prevStatus, [category]: updatedCategoryStatus };
    });
  };

  useEffect(() => {
    const categories = [
      ...checkboxStatus.foodSafetyReviewCbStatus,
      ...checkboxStatus.culinaryReviewCbStatus,
      ...checkboxStatus.nutritionReviewCbStatus,
    ];

    // console.log("categories:", categories);
    setFormData((prevFormData) => ({
      ...prevFormData,
      categories: categories,
    }));
    setValue("categories", categories);
    trigger("categories");
  }, [checkboxStatus]);

  // * checking if the report parameters match to their state true / false
  const handleSwitchStateChange = (selectedReport) => {
    const newSwitchStates = {
      haveFine: selectedReport.getData("haveFine") == 0 ? false : true,
      haveAmountOfItems:
        selectedReport.getData("haveAmountOfItems") == 0 ? false : true,
      haveSafetyGrade:
        selectedReport.getData("haveSafetyGrade") == 0 ? false : true,
      haveCulinaryGrade:
        selectedReport.getData("haveCulinaryGrade") == 0 ? false : true,
      haveNutritionGrade:
        selectedReport.getData("haveNutritionGrade") == 0 ? false : true,
      haveCategoriesNameForCriticalItems:
        selectedReport.getData("haveCategoriesNameForCriticalItems") == 0
          ? false
          : true,
    };
    setFormData((prevFormData) => ({
      ...prevFormData,
      ...Object.fromEntries(
        Object.entries(newSwitchStates).map(([key, value]) => [
          key,
          value ? 1 : 0,
        ])
      ),
    }));

    Object.entries(newSwitchStates).forEach(([key, value]) => {
      setValue(key, value ? 1 : 0);
    });

    setSwitchStates(newSwitchStates);
  };

  // * setting the accompany
  const handleAccompanyChange = (selectedReport) => {
    const accompanyName = selectedReport.getData("accompany");
    if (accompanyName == "ללא ליווי") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        accompany: "ללא ליווי",
      }));
      setValue("accompany", "ללא ליווי");
      trigger("accompany");
    } else {
      setAccompanySelected(accompanyName);
      setValue("accompany", accompanyName);
      trigger("accompany");
      setFormData((prevFormData) => ({
        ...prevFormData,
        accompany: accompanyName,
      }));
    }
  };
  //  * handling report time
  const handleReportTime = (selectedReport) => {
    const reportTimeDisplayed = selectedReport.getData("reportTime");
    setValue("reportTime", reportTimeDisplayed);
    trigger("reportTime");
  };

  // * general handle form change
  const handleFormChange = debounce((name, value) => {
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    setIsSchemaValid(true);

    if (name === "previousReports") {
      let newCheckboxStatus = {
        foodSafetyReviewCbStatus: [],
        culinaryReviewCbStatus: [],
        nutritionReviewCbStatus: [],
      };

      let newSwitchStates = {
        haveFine: false,
        haveAmountOfItems: false,
        haveSafetyGrade: false,
        haveCulinaryGrade: false,
        haveNutritionGrade: false,
        haveCategoriesNameForCriticalItems: false,
      };

      if (value === "דוח חדש") {
        setCheckboxStatus(newCheckboxStatus);
        setSwitchStates(newSwitchStates);
        setFormData((prevFormData) => ({
          ...prevFormData,
          oldReportId: "0",
        }));
        Object.entries(newSwitchStates).forEach(([key, value]) => {
          setValue(key, value ? 1 : 0);
        });
      } else {
        const selectedReport = filteredStationsResult.find(
          (report) => report.getData("timeOfReport") === value
        );
        if (selectedReport) {
          handleReportIdAndWorkerId(selectedReport);
          const parsedSelectedReportCategory =
            handleSelectedReportCategory(selectedReport);

          handleCheckboxStatusChange(parsedSelectedReportCategory);

          handleSwitchStateChange(selectedReport);
          handleAccompanyChange(selectedReport);
          handleReportTime(selectedReport);
        } else {
          setIsSchemaValid(true);
          setSwitchStates(newSwitchStates);
        }
      }
    }
  }, 300);

  // * toggle switch function
  const toggleSwitch = (id) => {
    setSwitchStates((prevState) => {
      const newState = {
        ...prevState,
        [id]: !prevState[id],
      };
      const value = newState[id] ? 1 : 0;
      handleFormChange(id, value); // Call handleFormChange with the new switch state
      return newState;
    });
  };

  // * submit the form
  const onSubmitForm = () => {
    // checking if scheme is valid
    console.log("on submit...");
    // const formValues = getValues();
    console.log("formData:", formData);
    if (isSchemaValid) {
      console.log("scheme is valid");
    }
  };
  // * Drawer

  const handleDrawerToggle = (isOpen) => {
    setIsDrawerOpen(isOpen);
  };

  const memoRizedCats = memoizedCategories?.categories;
  const globalCategories = memoRizedCats
    ? Object.values(memoRizedCats).flatMap((category) => category.categories)
    : null;

  // * comparing between the categories names to the ids in the forms to display it in the drawer
  const checkedCategoryNameById =
    globalCategories && formData.categories
      ? globalCategories.reduce((result, item) => {
          if (formData.categories.includes(parseInt(item.id, 10))) {
            result.push(item);
          }
          return result;
        }, [])
      : [];
  // console.log(checkedCategoryNameById[0].name);

  // const matchCategoryNameById = checkedCategoryNameById.map((item) => item.name);
  const imageTextsAndFunctionality = [
    {
      id: 0,
      text: "קבצים",
      source: require("../../assets/icons/iconImgs/folder.png"),
      iconPress: () => {
        console.log("folder");
      },
    },
    {
      id: 1,
      text: "מפרט",
      source: require("../../assets/icons/iconImgs/paperSheet.png"),
      iconPress: () => {
        console.log("paperSheet");
      },
    },
    {
      id: 2,
      text: "הגדרות",
      source: require("../../assets/icons/iconImgs/settings.png"),
      iconPress: () => {
        console.log("settings");
      },
    },
    {
      id: 3,
      text: "קטגוריות",
      source: require("../../assets/icons/iconImgs/categories.png"),
      iconPress: () => {
        console.log("categories");
        navigateToRoute(routes.ONBOARDING.EditExistingReport);
      },
    },
    {
      id: 4,
      text: "סיכום",

      source: require("../../assets/icons/iconImgs/notebook.png"),
      iconPress: () => {
        console.log("notebook");
      },
    },
    {
      id: 5,
      text: "צפייה",

      source: require("../../assets/icons/iconImgs/eye.png"),
      iconPress: () => {
        console.log("eye");
      },
    },
  ];
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

  // * paginations between categories names : Prev
  const handlePrevCategory = () => {
    setCurrentCategoryIndex((prevIndex) => {
      const newIndex = prevIndex > 0 ? prevIndex - 1 : prevIndex;
      const currentItem = checkedCategoryNameById[newIndex];
      // dispatch(setCurrentCategory(currentItem));
      return newIndex;
    });
  };
  // console.log(formData.categories[0]);

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
    dispatch(getCurrentReport(currentReport));
    dispatch(getCurrentCategory(formData.categories[0]));
    navigateToRoute(routes.ONBOARDING.EditExistingReport);
  };

  // console.log(checkedCategoryNameById);

  //  todo to check i have both function (handleCheckboxStatusChange , handleCategoriesCheckboxesToggle)
  // todo to change the way i save the checkboxes statuses in the state after i pick a report and make another change in one of the checkboxes
  // todo to send post request to the api : /api/duplicateReport.php

  /* {
oldReportId: 18503
clientId: 34
haveNewGeneralCommentsVersion: 1
clientStationId: 66
workerId: 23
accompany: ללא ליווי
haveFine: 0 
haveAmountOfItems: 0
haveSafetyGrade: 1
haveCulinaryGrade: 1
haveNutritionGrade: 1
haveCategoriesNameForCriticalItems: 0
reportTime: 2
newGeneralCommentTopText: ביקורת בתחנת פיליפס חיפה.
התנור בתחנה לא עבד עד השעה 10:30, דבר שיצר קצת לחץ בתחנה.
כמות סועדים קטנה ביחס לגודל של חדר האוכל, מה שנותן תחושה לא נעימה.
יש לחשוב על תחימת חלק מחדר האוכל לשיפור  ההרגשה.
קבלן ההסעדה לא מאשר למטבח מוצרים של IQF מה שיכול מאד לעזור לצוות לפי טענתו.

timeOfReport: 22/06/2023
categorys[]: 5
} */

  // * accordion FlatList array of Content
  const NewReportAccordionContent = [
    {
      key: "settings",
      headerText: "הגדרות הדוח",
      contentText: "world",
      contentHeight: 959,
      headerHeight: 48,
      headerTogglerStyling: styles.headerStyle,
      iconDisplay: true,
      boxHeight: 80.5,
      hasDivider: true,
      draggable: false,
      accordionCloseIndicator: accordionCloseIcon,
      accordionOpenIndicator: accordionOpenIcon,
      contentItemStyling: styles.contentBoxSetting,
      accordionContent: [
        {
          id: 0,
          text: <Text>תחנה</Text>,
          boxItem: (
            <SelectMenu
              control={control}
              selectWidth={240}
              optionsHeight={200}
              displayedValue={selectedStation}
              selectMenuStyling={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
              centeredViewStyling={{
                marginRight: 12,
                alignItems: "flex-end",
                marginTop: -530,
              }}
              selectOptions={currentClient.getStations()}
              name={"clientStationId"}
              errorMessage={
                errors.clientStationId && errors.clientStationId.message
              }
              onChange={(value) => {
                handleFormChange("clientStationId", value.id);
                setSelectedStation(value.company);
                setValue("clientStationId", value.id);
                trigger("clientStationId");
                console.log("value-station:", value);
              }}
              propertyName="company"
              returnObject={true}
            />
          ),
        },

        {
          id: 1,
          text: <Text> התבסס על דוח קודם</Text>,
          boxItem: (
            <SelectMenu
              control={control}
              selectWidth={240}
              optionsHeight={750}
              selectMenuStyling={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
              centeredViewStyling={{
                marginRight: 12,
                alignItems: "flex-end",
                marginTop: 180,
              }}
              selectOptions={[
                { timeOfReport: "דוח חדש", id: 0 },
                ...filteredStationsResult, //clientStationId
              ]}
              name={"previousReports"}
              errorMessage={
                errors.previousReports && errors.previousReports.message
              }
              onChange={(value) => {
                handleFormChange("previousReports", value);
                // setSelectedReport(value);
                setValue("previousReports", value);
                trigger("previousReports");
                console.log("value-previousReports:", value);
              }}
              propertyName="timeOfReport"
            />
          ),
        },
        {
          id: 2,
          text: <Text> יש קנסות</Text>,
          boxItem: (
            <ToggleSwitch
              id={"haveFine"}
              switchStates={switchStates}
              toggleSwitch={toggleSwitch}
              truthyText={"כן"}
              falsyText={"לא"}
            />
          ),
        },
        {
          id: 3,
          text: <Text> להציג כמות סעיפים</Text>,
          boxItem: (
            <ToggleSwitch
              id={"haveAmountOfItems"}
              switchStates={switchStates}
              toggleSwitch={toggleSwitch}
              truthyText={"כן"}
              falsyText={"לא"}
            />
          ),
        },
        {
          id: 4,
          text: <Text> "הצג ציון ביקורת בטיחות מזון"</Text>,
          boxItem: (
            <ToggleSwitch
              id={"haveSafetyGrade"}
              switchStates={switchStates}
              toggleSwitch={toggleSwitch}
              truthyText={"כן"}
              falsyText={"לא"}
            />
          ),
        },
        {
          id: 5,
          text: <Text> הצג ציון ביקורת קולינרית</Text>,
          boxItem: (
            <ToggleSwitch
              id={"haveCulinaryGrade"}
              switchStates={switchStates}
              toggleSwitch={toggleSwitch}
              truthyText={"כן"}
              falsyText={"לא"}
            />
          ),
        },
        {
          id: 6,
          text: <Text> הצג ציון תזונה</Text>,
          boxItem: (
            <ToggleSwitch
              id={"haveNutritionGrade"}
              switchStates={switchStates}
              toggleSwitch={toggleSwitch}
              truthyText={"כן"}
              falsyText={"לא"}
            />
          ),
        },
        {
          id: 7,
          text: <Text> הצג שמות קטגוריות בתמצית עבור ליקויים קריטיים</Text>,
          boxItem: (
            <ToggleSwitch
              id={"haveCategoriesNameForCriticalItems"}
              switchStates={switchStates}
              toggleSwitch={toggleSwitch}
              truthyText={"כן"}
              falsyText={"לא"}
            />
          ),
        },
        {
          id: 8,
          text: <Text> שם המלווה</Text>,
          boxItem: (
            <View style={{ justifyContent: "flex-end", alignSelf: "center" }}>
              <Input
                mode={"outlined"}
                control={control}
                name={"accompany"}
                inputStyle={{
                  backgroundColor: colors.white,
                  width: 240,
                  alignSelf: "center",
                }}
                activeOutlineColor={colors.blue}
                label={accompanySelected ? accompanySelected : "ללא  מלווה"}
                outlineColor={"rgba(12, 20, 48, 0.2)"}
                onChangeFunction={(value) => {
                  handleFormChange("accompany", value);
                }}
              />
            </View>
          ),
        },
        {
          id: 9,
          text: <Text> תאריך ביקורת</Text>,
          boxItem: (
            <DatePicker
              control={control}
              name={"timeOfReport"}
              errorMessage={errors.timeOfReport && errors.timeOfReport.message}
              onchange={(value) => {
                const date = new Date(value);
                const formattedDate = date.toLocaleDateString("en-GB");
                handleFormChange("timeOfReport", formattedDate);
                setValue("timeOfReport", formattedDate);
                trigger("timeOfReport");
              }}
              dateInputWidth={240}
              defaultDate={currentReport?.getData("timeOfReport")}
            />
          ),
        },
        {
          id: 10,
          text: <Text> זמן הביקורת</Text>,
          boxItem: (
            <SelectMenu
              control={control}
              selectWidth={240}
              optionsHeight={500}
              selectMenuStyling={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
              centeredViewStyling={{
                marginRight: 12,
                alignItems: "flex-end",
                marginTop: 300,
              }}
              selectOptions={reportsTimes}
              name={"reportTime"}
              errorMessage={errors.reportTime && errors.reportTime.message}
              onChange={(value) => {
                handleFormChange("reportTime", value.id);
                setCurrentReportTime(value.name);
                console.log("reportTime:", value.id);
              }}
              propertyName={"name"}
              defaultValue={currentReportTime}
              displayedValue={currentReportTime}
              returnObject={true}
            />
          ),
        },
      ],
    },
    {
      key: "categories",
      headerText: "קטגוריות",
      contentText: "world",
      contentHeight: categoryAccordionHeight,
      headerHeight: 48,
      headerTogglerStyling: styles.headerStyle,
      iconDisplay: true,
      boxHeight: 46,
      hasDivider: true,
      draggable: true,
      // toggleHandler: () => resetCategoryAccordionHeight,
      accordionCloseIndicator: accordionCloseIcon,
      accordionOpenIndicator: accordionOpenIcon,
      contentItemStyling: styles.contentBoxCategories,
      scrollEnabled: true,
      accordionContent: [
        {
          id: 0,
          boxItem: (
            <>
              {errors.categories && errors.categories.message && (
                <HelperText type="error" style={{ marginBottom: 10 }}>
                  {errors.categories.message}
                </HelperText>
              )}
            </>
          ),
        },
        {
          id: 1,
          boxItem: (
            <Accordion
              headerText={`${
                memoizedCategories &&
                memoizedCategories.categories &&
                memoizedCategories.categories[1].name
              } (נבחרו ${getCheckedCount("foodSafetyReviewCb")} דוחות)`}
              contentHeight={336}
              headerHeight={50}
              accordionCloseIndicator={ClientItemArrow}
              accordionOpenIndicator={ClientItemArrowOpen}
              toggleHandler={changeCategoryAccordionHeight}
              iconText={"בחר קטגוריות"}
              headerTogglerStyling={{
                backgroundColor: "#D3E0FF",
              }}
              iconDisplay={true}
              draggable={true}
              boxHeight={56}
              headerTextStyling={{
                color: colors.black,
                fontFamily: fonts.ABold,
              }}
              scrollEnabled={true}
              accordionContent={accordionCategoriesItem(
                foodSafetyReviewTexts,
                "foodSafetyReviewCb"
              )}
              onDragEndCb={(data) => {
                let originalData = [...foodSafetyReviewTexts];
                const movedData = originalData[data.from];
                originalData.splice(data.from, 1);
                const newData = [
                  ...originalData.slice(0, data.to),
                  movedData,
                  ...originalData.slice(data.to),
                ];
                setFoodSafetyReviewTexts(newData);
              }}
              contentItemStyling={{
                width: "100%",
                height: 56,
                alignItems: "center",
                paddingHorizontal: 16,
              }}
              hasDivider={true}
            />
          ),
        },
        {
          id: 2,
          boxItem: (
            <Accordion
              headerText={`${
                memoizedCategories &&
                memoizedCategories.categories &&
                memoizedCategories.categories[2].name
              } (נבחרו  ${getCheckedCount("culinaryReviewCb")} דוחות)`}
              contentHeight={336}
              headerHeight={50}
              draggable={true}
              accordionCloseIndicator={ClientItemArrow}
              accordionOpenIndicator={ClientItemArrowOpen}
              iconText={"בחר קטגוריות"}
              toggleHandler={changeCategoryAccordionHeight}
              headerTogglerStyling={{
                ...styles.headerStyle,
                backgroundColor: "#D3E0FF",
              }}
              iconDisplay={true}
              boxHeight={50}
              scrollEnabled={true}
              headerTextStyling={{
                color: colors.black,
                fontFamily: fonts.ABold,
              }}
              accordionContent={accordionCategoriesItem(
                culinaryReviewTexts,
                "culinaryReviewCb"
              )}
              onDragEndCb={(data) => {
                let originalData = [...culinaryReviewTexts];
                const movedData = originalData[data.from];
                originalData.splice(data.from, 1);
                const newData = [
                  ...originalData.slice(0, data.to),
                  movedData,
                  ...originalData.slice(data.to),
                ];
                setCulinaryReviewTexts(newData);
              }}
              contentItemStyling={{
                width: "100%",
                height: 56,
                alignItems: "center",
                paddingHorizontal: 16,
              }}
              hasDivider={true}
            />
          ),
        },
        {
          id: 3,
          boxItem: (
            <>
              <Accordion
                headerText={`${
                  memoizedCategories &&
                  memoizedCategories.categories &&
                  memoizedCategories.categories[3].name
                } (נבחרו  ${getCheckedCount("nutritionReviewCb")} דוחות)`}
                contentHeight={336}
                headerHeight={50}
                draggable={true}
                accordionCloseIndicator={ClientItemArrow}
                accordionOpenIndicator={ClientItemArrowOpen}
                iconText={"בחר קטגוריות"}
                toggleHandler={changeCategoryAccordionHeight}
                headerTogglerStyling={{
                  ...styles.headerStyle,
                  backgroundColor: "#D3E0FF",
                }}
                iconDisplay={true}
                scrollEnabled={true}
                boxHeight={50}
                headerTextStyling={{
                  color: colors.black,
                  fontFamily: fonts.ABold,
                }}
                accordionContent={accordionCategoriesItem(
                  nutritionReviewTexts,
                  "nutritionReviewCb"
                )}
                onDragEndCb={(data) => {
                  let originalData = [...nutritionReviewTexts];
                  const movedData = originalData[data.from];
                  originalData.splice(data.from, 1);
                  const newData = [
                    ...originalData.slice(0, data.to),
                    movedData,
                    ...originalData.slice(data.to),
                  ];
                  setNutritionReviewTexts(newData);
                }}
                contentItemStyling={{
                  width: "100%",
                  height: 56,
                  alignItems: "center",
                  paddingHorizontal: 16,
                }}
                hasDivider={true}
              />
            </>
          ),
        },
      ],
    },
    {
      key: "summary",
      headerText: "תמצית הדוח",
      contentText: "world",
      contentHeight: 300,
      headerHeight: 48,
      headerTogglerStyling: styles.headerStyle,
      iconDisplay: true,
      boxHeight: 80.5,
      draggable: false,
      contentItemStyling: styles.contentBoxSetting,
      hasDivider: false,

      accordionCloseIndicator: accordionCloseIcon,
      accordionOpenIndicator: accordionOpenIcon,
      accordionContent: [
        {
          id: 0,
          boxItem: (
            <View
              style={{
                flex: 1,
                width: "100%",
                marginTop: 20,
                height: "100%",
                direction: "rtl",
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
                  custom={() => {
                    setColorSelected(!colorSelected);
                    console.log("object");
                  }}
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
                    initialContentHTML="<div></div>"
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
          ),
        },
      ],
    },
  ];

  const renderAccordion = ({ item }) => (
    <Accordion
      headerText={item.headerText}
      contentText={item.contentText}
      contentHeight={item.contentHeight}
      headerHeight={item.headerHeight}
      headerTogglerStyling={styles.headerStyle}
      iconDisplay={true}
      boxHeight={item.boxHeight}
      accordionContent={item.accordionContent}
      contentItemStyling={item.contentItemStyling}
      hasDivider={item.hasDivider}
      headerTextStyling={item.headerTextStyling}
      accordionCloseIndicator={item.accordionCloseIndicator}
      accordionOpenIndicator={item.accordionOpenIndicator}
      scrollEnabled={item.scrollEnabled}
      toggleHandler={item.toggleHandler}
      draggable={item.draggable}
    />
  );

  const modifiedAccordionContent = currentReport
    ? NewReportAccordionContent.map((section) => {
        if (section.key === "settings") {
          const modifiedAccordionContent = section.accordionContent.filter(
            (item) => item.id !== 1
          );
          return { ...section, accordionContent: modifiedAccordionContent };
        }
        return section;
      })
    : NewReportAccordionContent;

  // console.log(formData.categories);

  return (
    <ScreenWrapper
      newReportBackGroundImg={true}
      isConnectedUser
      wrapperStyle={styles.container}
      edges={[]}
    >
      <View style={styles.headerWrapper}>
        <View style={styles.navigationWrapper}>
          <TouchableOpacity onPress={navigateTogoBack}>
            <Image source={rightDirectionIcon} style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.navigationText}>חזרה לרשימת הלקוחות</Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.header}>
            {currentReport
              ? `עריכת דוח עבור ${currentReport.data.station_name}`
              : `יצירת דוח חדש עבור ${currentClient.getCompany()}`}
          </Text>
          {currentReport && (
            <View style={styles.imageTextList}>
              <FlatList
                data={imageTextsAndFunctionality}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderImageTextItem}
                horizontal={true}
              />
            </View>
          )}
        </View>

        <FlatList
          data={modifiedAccordionContent}
          renderItem={renderAccordion}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      {currentReport ? (
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 50,
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
                  {/* <TouchableOpacity
                    onPress={handlePrevCategory}
                    style={{
                      alignSelf: "center",
                      // justifyContent: "flex-end",
                      // marginLeft: "auto",
                      flexDirection: "row",
                      gap: 5,
                      alignItems: "center",
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
                      הקטגוריה הקודמת:{" "}
                      {checkedCategoryNameById[currentCategoryIndex - 1]?.name}
                    </Text>
                  </TouchableOpacity> */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                      marginLeft:
                        formData &&
                        formData.categories &&
                        formData.categories[0]
                          ? "auto"
                          : 0,
                      marginRight:
                        formData &&
                        formData.categories &&
                        formData.categories[0]
                          ? -150
                          : 0,
                      gap: 12,
                    }}
                  >
                    <Image
                      source={FileIcon}
                      style={{ width: 24, height: 24 }}
                    />
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
                  {formData &&
                    formData.categories &&
                    formData.categories[0] && (
                      <TouchableOpacity
                        onPress={handleNextCategory}
                        style={{
                          alignSelf: "center",
                          // justifyContent: "flex-end",
                          flexDirection: "row",
                          gap: 5,
                          alignItems: "center",
                          marginLeft: "auto",
                        }}
                      >
                        <Text style={styles.categoryDirButton}>
                          הקטגוריה הבאה:{" "}
                          {/* {checkedCategoryNameById[currentCategoryIndex + 1]?.name} */}
                          {/* {formData.categories[0]} */}
                          {checkedCategoryNameById[currentCategoryIndex].name}
                        </Text>
                        <Image
                          source={accordionCloseIcon}
                          style={{ width: 20, height: 20 }}
                        />
                      </TouchableOpacity>
                    )}
                </View>
              </LinearGradient>
            }
            height={300}
            onToggle={handleDrawerToggle}
          />
        </View>
      ) : (
        <LinearGradient
          colors={["#37549D", "#26489F"]}
          start={[0, 0]}
          end={[1, 0]}
        >
          <TouchableOpacity
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={
              handleSubmit(onSubmitForm)
              // console.log("new report");
            }
          >
            <Text
              style={{
                alignSelf: "center",
                paddingVertical: 12,
                fontSize: 24,
                fontFamily: fonts.ABold,
                color: colors.white,
              }}
            >
              יצירת הדוח
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      )}
    </ScreenWrapper>
  );
};

export default WorkerNewReport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  headerWrapper: {
    flex: 1,
    flexDirection: "column",
    gap: 8,
    marginTop: 26,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  header: {
    alignSelf: "flex-start",
    fontFamily: fonts.ABold,
    fontSize: 24,
  },
  navigationWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  navigationText: {
    fontFamily: fonts.ARegular,
    fontSize: 16,
  },
  icon: {
    width: 20,
    height: 20,
  },
  headerStyle: {
    backgroundColor: "#6886D2",
  },
  contentBox: {
    flexDirection: "column",
  },
  contentBoxSetting: {
    alignItems: "center",
    height: 80.5,
    paddingHorizontal: 16,
  },
  contentBoxCategories: {
    alignItems: "center",
    // height: 200.5,
  },
  categoryDirButton: {
    color: colors.white,
    fontFamily: fonts.ARegular,
    fontSize: 16,
  },
});
