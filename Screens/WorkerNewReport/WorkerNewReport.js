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
import ClientItemArrowOpen from "../../assets/imgs/accodionOpenIndicatorBlack.png";
import onDragIcon from "../../assets/imgs/onDragIcon.png";
import Checkbox from "../../Components/ui/Checkbox";
import { debounce, get, result } from "lodash";
import FetchDataService from "../../Services/FetchDataService";
import "@env";
import axios from "axios";
import { fetchCategories } from "../../store/redux/reducers/categoriesSlice";
import CheckboxItem from "./CheckboxItem/CheckboxItem";
import { fetchReportsTimes } from "../../store/redux/reducers/reportsTimesSlice";
import Loader from "../../utiles/Loader";
import { HelperText } from "react-native-paper";
const WorkerNewReport = () => {
  const richText = useRef();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [colorSelected, setColorSelected] = useState(false);
  const clients = useSelector((state) => state.clients);
  const categories = useSelector((state) => state.categories);
  const reportsTimes = useSelector((state) => state.reportsTimes);
  // console.log("reportsTimes:", reportsTimes);
  const { navigateTogoBack } = useScreenNavigator();
  // fetching the the current data from specific client
  const currentClient = useSelector(
    (state) => state.currentClient.currentClient
  );
  const [isSchemaValid, setIsSchemaValid] = useState(false);
  const [formData, setFormData] = useState({ clientId: currentClient.id });

  const [checkboxStatus, setCheckboxStatus] = useState({
    foodSafetyReviewCbStatus: [],
    culinaryReviewCbStatus: [],

    nutritionReviewCbStatus: [],
  });
  const [selectedStation, setSelectedStation] = useState(null);
  const [accompanySelected, setAccompanySelected] = useState(null);
  // console.log("accompanySelected:", accompanySelected);
  const [categoryAccordionHeight, setCategoryAccordionHeight] = useState(172);

  const [switchStates, setSwitchStates] = useState({
    haveFineSwitch: false,
    haveAmountOfItems: false,
    haveSafetyGrade: false,
    haveCulinaryGrade: false,
    haveNutritionGrade: false,
    haveCategoriesNameForCriticalItems: false,
  });

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
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
  });
  useEffect(() => {
    schema
      .validate(formData)
      .then(() => setIsSchemaValid(true))
      .catch((err) => {
        console.log("err:", err);
        setIsSchemaValid(false);
      });
    setValue("clientId", currentClient.id);
  }, [formData, schema]);

  // * categories fetching start
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchReportsTimes());
  }, [dispatch]);

  const memoizedCategories = useMemo(() => categories, [categories]);
  // newGeneralCommentTopText change handler
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

  // * categories checkboxes Texts
  const foodSafetyReviewTexts =
    memoizedCategories?.categories?.[1]?.categories ?? [];
  const culinaryReviewTexts =
    memoizedCategories?.categories?.[2]?.categories ?? [];
  const nutritionReviewTexts =
    memoizedCategories?.categories?.[3]?.categories ?? [];

  // get the array of categories from the report and updates the state

  const handleCategoriesCheckboxesToggle = (category, checked, label) => {
    setCheckboxStatus((prevStatus) => {
      const updatedCategoryStatus = [...prevStatus[category]];
      // find && parsing the index of the array
      const index = updatedCategoryStatus.indexOf(parseInt(label));
      // 07267
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
    const categories = [
      ...checkboxStatus.foodSafetyReviewCbStatus,
      ...checkboxStatus.culinaryReviewCbStatus,
      ...checkboxStatus.nutritionReviewCbStatus,
    ];
    setValue("categories", categories);
    trigger("categories");
  };

  // inner accordionCategoriesItem
  function accordionCategoriesItem(names, categoryName) {
    // console.log("names:", names);
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

  // * report onchange handler function
  // const handleFormChange = debounce((name, value) => {
  //   setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  //   setIsSchemaValid(true);

  //   if (name === "previousReports") {
  //     let newCheckboxStatus = {
  //       foodSafetyReviewCbStatus: [],
  //       culinaryReviewCbStatus: [],
  //       nutritionReviewCbStatus: [],
  //     };

  //     let newSwitchStates = {
  //       haveFineSwitch: false,
  //       haveAmountOfItems: false,
  //       haveSafetyGrade: false,
  //       haveCulinaryGrade: false,
  //       haveNutritionGrade: false,
  //       haveCategoriesNameForCriticalItems: false,
  //     };

  //     setFormData((prevFormData) => ({
  //       ...prevFormData,
  //       ...Object.fromEntries(
  //         Object.entries(newSwitchStates).map(([key, value]) => [
  //           key,
  //           value ? 1 : 0,
  //         ])
  //       ),
  //     }));
  //     const categories = newCheckboxStatus.culinaryReviewCbStatus
  //       .concat(newCheckboxStatus.foodSafetyReviewCbStatus)
  //       .concat(newCheckboxStatus.culinaryReviewCbStatus)
  //       .concat(newCheckboxStatus.nutritionReviewCbStatus);
  //     setFormData((prevFormData) => ({
  //       ...prevFormData,
  //       categories,
  //     }));

  //     setValue("categories", categories);
  //     trigger("categories");

  //     if (value === "דוח חדש") {
  //       setCheckboxStatus(newCheckboxStatus);
  //       setSwitchStates(newSwitchStates);
  //       setFormData((prevFormData) => ({
  //         ...prevFormData,
  //         oldReportId: "0",
  //       }));
  //     } else {
  //       // * selected report filtered to the chosen station
  //       const selectedReport = filteredStationsResult.find(
  //         (report) => report.getData("timeOfReport") === value
  //       );
  //       if (selectedReport) {
  //         // * setting the oldReportId from selected report
  //         setFormData((prevFormData) => ({
  //           ...prevFormData,
  //           oldReportId: selectedReport.getData("id"),
  //           workerId: selectedReport.getData("workerId"),
  //         }));

  //         // * getting the report categories
  //         const selectedReportCategory = selectedReport.getData("categorys");
  //         // * parsing the string to array of numbers
  //         const parsedSelectedReportCategory = new Set(
  //           selectedReportCategory
  //             .split("|")
  //             .map((str) => str.replace(";", ""))
  //             .filter(Boolean)
  //             .map((numStr) => parseInt(numStr, 10))
  //         );
  //         // * getting the categories from the categories of the api
  //         const memoRizedCats = memoizedCategories?.categories;
  //         // * mapping the categories
  //         const categoriesData = Object.values(memoRizedCats).flatMap(
  //           (category) => category.categories
  //         );
  //         //  * checking if the ids of the categories match to the selected report and sorting them by type to their right location of the state
  //         newCheckboxStatus = categoriesData.reduce(
  //           (status, category) => {
  //             const categoryId = parseInt(category.id, 10);
  //             const categoryType = parseInt(category.type, 10);
  //             if (parsedSelectedReportCategory.has(categoryId)) {
  //               if (categoryType === 1) {
  //                 status.foodSafetyReviewCbStatus.push(categoryId);
  //               } else if (categoryType === 2) {
  //                 status.culinaryReviewCbStatus.push(categoryId);
  //               } else if (categoryType === 3) {
  //                 status.nutritionReviewCbStatus.push(categoryId);
  //               }
  //             }
  //             return status;
  //           },
  //           {
  //             foodSafetyReviewCbStatus: [],
  //             culinaryReviewCbStatus: [],
  //             nutritionReviewCbStatus: [],
  //           }
  //         );
  //         // * checking if the report parameters match to their state true / false
  //         newSwitchStates = {
  //           haveFineSwitch:
  //             selectedReport.getData("haveFine") == 0 ? false : true,
  //           haveAmountOfItems:
  //             selectedReport.getData("haveAmountOfItems") == 0 ? false : true,
  //           haveSafetyGrade:
  //             selectedReport.getData("haveSafetyGrade") == 0 ? false : true,
  //           haveCulinaryGrade:
  //             selectedReport.getData("haveCulinaryGrade") == 0 ? false : true,
  //           haveNutritionGrade:
  //             selectedReport.getData("haveNutritionGrade") == 0 ? false : true,
  //           haveCategoriesNameForCriticalItems:
  //             selectedReport.getData("haveCategoriesNameForCriticalItems") == 0
  //               ? false
  //               : true,
  //         };
  //         // * saving their current status of the toggles based on the report selected
  // setFormData((prevFormData) => ({
  //   ...prevFormData,
  //   ...Object.fromEntries(
  //     Object.entries(newSwitchStates).map(([key, value]) => [
  //       key,
  //       value ? 1 : 0,
  //     ])
  //   ),
  // }));
  //         setSwitchStates(newSwitchStates);

  // * saving the categories checkbox status
  // const categories = newCheckboxStatus.culinaryReviewCbStatus
  //   .concat(newCheckboxStatus.foodSafetyReviewCbStatus)
  //   .concat(newCheckboxStatus.culinaryReviewCbStatus)
  //   .concat(newCheckboxStatus.nutritionReviewCbStatus);

  // setFormData((prevFormData) => ({
  //   ...prevFormData,
  //   categories,
  // }));
  // setValue("categories", categories);
  // trigger("categories");

  //         setCheckboxStatus(newCheckboxStatus);

  // * setting the accompany
  //         const accompanyName = selectedReport.getData("accompany");
  //         if (accompanyName == "ללא ליווי") {
  //           setFormData((prevFormData) => ({
  //             ...prevFormData,
  //             accompany: "ללא ליווי",
  //           }));
  //           setValue("accompany", "ללא ליווי");
  //           trigger("accompany");
  //         } else {
  //           setAccompanySelected(accompanyName);
  //           setValue("accompany", accompanyName);
  //           trigger("accompany");
  //           setFormData((prevFormData) => ({
  //             ...prevFormData,
  //             accompany: accompanyName,
  //           }));
  //         }
  //         const reportTimeDisplayed = selectedReport.getData("reportTime");
  //         setValue("reportTime", reportTimeDisplayed);
  //         trigger("reportTime");
  //       } else {
  //         // setIsSchemaValid(true);
  //         setSwitchStates(newSwitchStates);
  //       }
  //     }
  //   }
  // }, 300);

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

  // * getting the report categories
  const handleSelectedReportCategory = (selectedReport) => {
    const selectedReportCategory = selectedReport.getData("categorys");
    const parsedSelectedReportCategory = new Set(
      selectedReportCategory
        .split("|")
        .map((str) => str.replace(";", ""))
        .filter(Boolean)
        .map((numStr) => parseInt(numStr, 10))
    );
    return parsedSelectedReportCategory;
  };

  //  * checking if the ids of the categories match to the selected report and sorting them by type to their right location of the state
  const handleCheckboxStatusChange = (
    parsedSelectedReportCategory,
    categoriesData
  ) => {
    const newCheckboxStatus = categoriesData.reduce(
      (status, category) => {
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
      },
      {
        foodSafetyReviewCbStatus: [],
        culinaryReviewCbStatus: [],
        nutritionReviewCbStatus: [],
      }
    );
    // * saving the categories checkbox status
    const categories = newCheckboxStatus.culinaryReviewCbStatus
      .concat(newCheckboxStatus.foodSafetyReviewCbStatus)
      .concat(newCheckboxStatus.culinaryReviewCbStatus)
      .concat(newCheckboxStatus.nutritionReviewCbStatus);

    setFormData((prevFormData) => ({
      ...prevFormData,
      categories,
    }));
    setValue("categories", categories);
    trigger("categories");
    setCheckboxStatus(newCheckboxStatus);
  };

  // * checking if the report parameters match to their state true / false
  const handleSwitchStateChange = (selectedReport) => {
    const newSwitchStates = {
      haveFineSwitch: selectedReport.getData("haveFine") == 0 ? false : true,
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
        haveFineSwitch: false,
        haveAmountOfItems: false,
        haveSafetyGrade: false,
        haveCulinaryGrade: false,
        haveNutritionGrade: false,
        haveCategoriesNameForCriticalItems: false,
      };
      const memoRizedCats = memoizedCategories?.categories;
      const categoriesData = Object.values(memoRizedCats).flatMap(
        (category) => category.categories
      );

      if (value === "דוח חדש") {
        setCheckboxStatus(newCheckboxStatus);
        setSwitchStates(newSwitchStates);
        setFormData((prevFormData) => ({
          ...prevFormData,
          oldReportId: "0",
        }));
      } else {
        const selectedReport = filteredStationsResult.find(
          (report) => report.getData("timeOfReport") === value
        );
        if (selectedReport) {
          handleReportIdAndWorkerId(selectedReport);
          const parsedSelectedReportCategory =
            handleSelectedReportCategory(selectedReport);
          handleCheckboxStatusChange(
            parsedSelectedReportCategory,
            categoriesData
          );
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

  const onSubmitForm = () => {
    // checking if scheme is valid
    console.log("on submit...");
    const formValues = getValues();
    console.log("formValues:", formValues);
    if (isSchemaValid) {
      console.log("scheme is valid");
    }
  };

  // console.log("form data", formData);
  // console.log(`isSchemaValid: ${isSchemaValid}`);
  console.log(errors);

  /* {
// oldReportId: 18503
// clientId: 34
// haveNewGeneralCommentsVersion: 1
// clientStationId: 66
// workerId: 23
// accompany: ללא ליווי
// haveFine: 0 
// haveAmountOfItems: 0
// haveSafetyGrade: 1
// haveCulinaryGrade: 1
// haveNutritionGrade: 1
// haveCategoriesNameForCriticalItems: 0
// reportTime: 2
// newGeneralCommentTopText: ביקורת בתחנת פיליפס חיפה.
// התנור בתחנה לא עבד עד השעה 10:30, דבר שיצר קצת לחץ בתחנה.
// כמות סועדים קטנה ביחס לגודל של חדר האוכל, מה שנותן תחושה לא נעימה.
// יש לחשוב על תחימת חלק מחדר האוכל לשיפור  ההרגשה.
// קבלן ההסעדה לא מאשר למטבח מוצרים של IQF מה שיכול מאד לעזור לצוות לפי טענתו.

// timeOfReport: 22/06/2023
// categorys[]: 5
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
      // defaultList: true,
      draggable: false,
      accordionCloseIndicator: accordionCloseIcon,
      accordionOpenIndicator: accordionOpenIcon,
      contentItemStyling: styles.contentBoxSetting,
      accordionContentData: [
        {
          id: 0,
          text: <Text>תחנה</Text>,
          boxItem: (
            <SelectMenu
              control={control}
              selectWidth={240}
              optionsHeight={200}
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
                setSelectedStation(value.id);
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
              id={"haveFineSwitch"}
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
              errorMessage={errors.date && errors.date.message}
              onchange={(value) => {
                const date = new Date(value);
                const formattedDate = date.toLocaleDateString("en-GB");
                handleFormChange("timeOfReport", formattedDate);
                setValue("timeOfReport", formattedDate);
                trigger("timeOfReport");
              }}
              dateInputWidth={240}
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
                console.log("reportTime:", value.id);
              }}
              propertyName={"name"}
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
      accordionContentData: [
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
              accordionContentData={accordionCategoriesItem(
                foodSafetyReviewTexts,
                "foodSafetyReviewCb"
              )}
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
              accordionContentData={accordionCategoriesItem(
                culinaryReviewTexts,
                "culinaryReviewCb"
              )}
              // accordionContentData={accordionContentData}
              // setAccordionContentData={setAccordionContentData}
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
                accordionContentData={accordionCategoriesItem(
                  nutritionReviewTexts,
                  "nutritionReviewCb"
                )}
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
      // defaultList: true,
      draggable: false,
      contentItemStyling: styles.contentBoxSetting,
      hasDivider: false,

      accordionCloseIndicator: accordionCloseIcon,
      accordionOpenIndicator: accordionOpenIcon,
      accordionContentData: [
        {
          id: 0,
          boxItem: (
            <View
              style={{
                flex: 1,
                width: "100%",
                marginTop: 20,
                height: "100%",
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
                  direction: "ltr",
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
                    placeholder="פה יכתב תמצית הדוח באופן אוטומטי או ידני או משולב בהתאם לבחירת הסוקר"
                    shouldStartLoadWithRequest={(request) => {
                      return true;
                    }}
                    style={{
                      minHeight: 123,
                      direction: "ltr",
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
      accordionContentData={item.accordionContentData}
      contentItemStyling={item.contentItemStyling}
      hasDivider={item.hasDivider}
      headerTextStyling={item.headerTextStyling}
      accordionCloseIndicator={item.accordionCloseIndicator}
      accordionOpenIndicator={item.accordionOpenIndicator}
      scrollEnabled={item.scrollEnabled}
      toggleHandler={item.toggleHandler}
      draggable={item.draggable}
      // defaultList={item.defaultList}
    />
  );

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
        <Text style={styles.header}>
          יצירת דוח חדש עבור {currentClient.getCompany()}
        </Text>
        <FlatList
          data={NewReportAccordionContent}
          renderItem={renderAccordion}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
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
          // disabled={!isSchemaValid}
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
});
