import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  SafeAreaView,
  Dimensions,
  Platform,
} from "react-native";
import React, { useState, useRef, useEffect, useMemo } from "react";
import useScreenNavigator from "../../Hooks/useScreenNavigator";
import ScreenWrapper from "../../utiles/ScreenWrapper";
import fonts from "../../styles/fonts";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../../styles/colors";
import Accordion from "../../Components/ui/Accordion";
import SelectMenu from "../../Components/ui/SelectMenu";
import { useForm } from "react-hook-form";
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
import ColorPicker from "react-native-wheel-color-picker";
import accordionCloseIcon from "../../assets/imgs/accordionCloseIndicator.png";
import accordionOpenIcon from "../../assets/imgs/accordionOpenIndicator.png";
import ClientItemArrow from "../../assets/imgs/ClientItemArrow.png";
import ClientItemArrowOpen from "../../assets/imgs/accodionOpenIndicatorBlack.png";
import { debounce } from "lodash";
import "@env";
import Loader from "../../utiles/Loader";
import { HelperText } from "react-native-paper";
import Drawer from "../../Components/ui/Drawer";
import routes from "../../Navigation/routes";
import { getCurrentCategory } from "../../store/redux/reducers/getCurrentCategory";
import Header from "../../Components/ui/Header";
import GoBackNavigator from "../../utiles/GoBackNavigator";
import { setIndex } from "../../store/redux/reducers/indexSlice";
import {
  setCategoryNamesSubHeaders,
  setMajorCategoryHeaders,
} from "../../store/redux/reducers/summerySlice";
import useSaveEditedReport from "../../Hooks/useSaveEditedReport";
import usePostNewReport from "../../Hooks/usePostNewReport";
import AccordionContentList from "./AccordionContent/AccordionContentList";
import {
  useAccordionCategoriesItem,
  accordionCategoriesItem,
} from "./AccordionCategoriesItem/AccordionCategoriesItem";
import CategoriesPickerModal from "./CategoriesPickerModal/CategoriesPickerModal";
const windowWidth = Dimensions.get("window").width;
const WorkerNewReport = () => {
  const richText = useRef();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { navigateToRoute } = useScreenNavigator();
  const saveEditedReport = useSaveEditedReport();
  const { postNewReport } = usePostNewReport();
  const {
    accordionCategoriesItem,
    checkboxStatus,
    setCheckboxStatus,
    getCheckedCount,
  } = useAccordionCategoriesItem();

  const [colorSelected, setColorSelected] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const currentClient = useSelector(
    (state) => state.currentClient.currentClient
  );
  const currentReport = useSelector(
    (state) => state.currentReport.currentReport
  );
  const userId = useSelector((state) => state.user);
  const reportsTimes = useSelector((state) => state.reportsTimes.reportsTimes);
  const globalCategories = useSelector((state) => state.globalCategories);

  const memoizedCategories = useMemo(
    () => globalCategories,
    [globalCategories]
  );

  const [isSchemaValid, setIsSchemaValid] = useState(false);
  const [IsRearrangement, setIsRearrangement] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    clientId: currentClient?.id,
    id: userId,
    haveNewGeneralCommentsVersion: 1,
    haveFine: false,
    haveAmountOfItems: false,
    haveSafetyGrade: true,
    haveCulinaryGrade: true,
    haveNutritionGrade: true,
    haveCategoriesNameForCriticalItems: false,
    rearrangement: IsRearrangement,
  });

  const [selectedStation, setSelectedStation] = useState(null);
  const [currentReportTime, setCurrentReportTime] = useState(null);
  const [accompanySelected, setAccompanySelected] = useState(null);
  const [switchStates, setSwitchStates] = useState({
    haveFine: false,
    haveAmountOfItems: false,
    haveSafetyGrade: true,
    haveCulinaryGrade: true,
    haveNutritionGrade: true,
    haveCategoriesNameForCriticalItems: false,
  });
  const [currentReportDate, setCurrentReportDate] = useState(null);
  // const [richTextHeight, setRichTextHeight] = useState(0);
  // * categories checkboxes Texts
  const [foodSafetyReviewTexts, setFoodSafetyReviewTexts] = useState(
    memoizedCategories?.categories?.[1]?.categories ?? []
  );
  const [culinaryReviewTexts, setCulinaryReviewTexts] = useState(
    memoizedCategories?.categories?.[2]?.categories ?? []
  );
  const [nutritionReviewTexts, setNutritionReviewTexts] = useState(
    memoizedCategories?.categories?.[3]?.categories ?? []
  );
  const [filteredStationsResult, setFilteredStationsResult] = useState([]);
  const [majorCategoryHeadersToPass, setMajorCategoryHeadersToPass] = useState(
    []
  );
  const [sortedCategories, setSortedCategories] = useState({});
  const schema = yup.object().shape({
    clientStationId: yup.string().required("station is required"),
    previousReports: yup.string().required("previous report is required"),
    accompany: yup.string().required("accompany is required"),
    timeOfReport: yup.string().required("date is required"),
    newGeneralCommentTopText: yup.string(),
    reportTime: yup.string(),
    categorys: yup
      .array()
      .of(yup.number())
      .test("please choose at least one category", (value) => {
        const foodSafetyReviewSelected =
          Array.isArray(value) &&
          value.some(
            (id) =>
              Array.isArray(checkboxStatus?.foodSafetyReviewCbStatus) &&
              checkboxStatus?.foodSafetyReviewCbStatus.includes(id)
          );

        const culinaryReviewSelected =
          Array.isArray(value) &&
          value.some(
            (id) =>
              Array.isArray(checkboxStatus?.culinaryReviewCbStatus) &&
              checkboxStatus?.culinaryReviewCbStatus.includes(id)
          );

        const nutritionReviewSelected =
          Array.isArray(value) &&
          value.some(
            (id) =>
              Array.isArray(checkboxStatus?.nutritionReviewCbStatus) &&
              checkboxStatus?.nutritionReviewCbStatus.includes(id)
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
        setIsSchemaValid(false);
        // console.log("err:", err);
      });
    setValue("clientId", currentClient?.id);
  }, [formData, schema]);

  const findReportTimeName = (data) => {
    const reportTimeId = currentReport?.getReportTime();

    const reportTime = data.find((item) => item.id === reportTimeId);
    return reportTime ? reportTime.name : "";
  };

  //  * edit mode existing current report initialization
  useEffect(() => {
    const reportTimeName = findReportTimeName(reportsTimes);
    if (currentReport) {
      setSwitchStates({
        haveFine: currentReport.getData("haveFine") == "1",
        haveAmountOfItems: currentReport.getData("haveAmountOfItems") == "1",
        haveSafetyGrade: currentReport.getData("haveSafetyGrade") == "1",
        haveCulinaryGrade: currentReport.getData("haveCulinaryGrade") == "1",
        haveNutritionGrade: currentReport.getData("haveNutritionGrade") == "1",
        haveCategoriesNameForCriticalItems:
          currentReport.getData("haveCategoriesNameForCriticalItems") == "1",
      });
      setSelectedStation(currentReport.getData("station_name"));
      setAccompanySelected(currentReport.getData("accompany"));
      setCurrentReportDate(currentReport.getData("timeOfReport"));
      setCurrentReportTime(reportTimeName);
      handleContentChange(currentReport.getData("newGeneralCommentTopText"));
      handleCheckboxStatusChange(
        parsedArrayOfStr(currentReport.getData("categorys"))
      );
    }
  }, [currentReport]);

  // * redefine the Accordion height
  const changeCategoryAccordionHeight = (contentHeight, isOpen) => {
    return isOpen ? 172 + contentHeight : 172;
  };

  // * filtering the current client based on selected station
  // const filteredStationsResult = currentClient
  //   .fetchReports()
  //   .filter((report) => report.getData("clientStationId") === selectedStation);

  // * filtering the current client based on selected station
  // todo refactor this.
  useEffect(() => {
    async function getReports() {
      try {
        const reports = await currentClient.fetchReports();
        if (selectedStation) {
          const filteredReports = reports.filter(
            (report) => report.getData("clientStationId") === selectedStation
          );
          // console.log("[worker]filteredStationsResult", filteredReports);
          setFilteredStationsResult(filteredReports);
        }
      } catch (error) {
        console.error("Error fetching or filtering reports:", error);
      }
    }
    getReports();
  }, [currentClient, selectedStation]);

  // * newGeneralCommentTopText change handler
  const handleContentChange = debounce((content) => {
    setValue("newGeneralCommentTopText", content);
    trigger("newGeneralCommentTopText");
    setFormData((prevFormData) => ({
      ...prevFormData,
      newGeneralCommentTopText: content,
    }));
  }, 300);

  // * setting the oldReportId from selected report
  const handleReportIdAndWorkerId = (selectedReport) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      oldReportId: selectedReport.getData("id"),
      // workerId: selectedReport.getData("workerId"),
    }));
    // setValue("workerId", selectedReport.getData("workerId"));
    setValue("oldReportId", selectedReport.getData("id"));
    trigger("clientStationId");
    trigger("oldReportId");
  };

  // * parsing the data coming from the current report
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

  // * parsing the categories coming from the report
  const handleSelectedReportCategory = (selectedReport) => {
    const selectedReportCategory = selectedReport.getData("categorys");

    const parsedSelectedReportCategory = parsedArrayOfStr(
      selectedReportCategory
    );

    return parsedSelectedReportCategory;
  };

  //  * 1. checking if the ids of the categories match to the selected report
  // *  2.  sorting them by type to their right location of major category
  const handleCheckboxStatusChange = (parsedSelectedReportCategory) => {
    // console.log("innn", 1);
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
    // todo to change the way the categories change according to the onDragCb function logic

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
    // console.log(typeof categories);
    setFormData((prevFormData) => ({
      ...prevFormData,
      categorys:
        categories.length > 0 || Object.keys(categories).length > 0
          ? categories
          : parsedSelectedReportCategory,
    }));

    setValue("categorys", categories);
    trigger("categorys");
    setCheckboxStatus(newOrderedCategories);
  };

  useEffect(() => {
    if (checkboxStatus !== undefined) {
      const categories = [
        ...checkboxStatus?.foodSafetyReviewCbStatus,
        ...checkboxStatus?.culinaryReviewCbStatus,
        ...checkboxStatus?.nutritionReviewCbStatus,
      ];
      setFormData((prevFormData) => ({
        ...prevFormData,
        categorys: categories,
      }));

      setValue("categorys", categories);
      trigger("categorys");
    }
  }, [checkboxStatus]);

  // * checking if the report parameters match to their state true / false
  const handleSwitchStateChange = (selectedReport) => {
    const newSwitchStates = {
      haveFine: selectedReport.getData("haveFine") == 1,
      haveAmountOfItems: selectedReport.getData("haveAmountOfItems") == 1,
      haveSafetyGrade: selectedReport.getData("haveSafetyGrade") == 1,
      haveCulinaryGrade: selectedReport.getData("haveCulinaryGrade") == 1,
      haveNutritionGrade: selectedReport.getData("haveNutritionGrade") == 1,
      haveCategoriesNameForCriticalItems:
        selectedReport.getData("haveCategoriesNameForCriticalItems") == 1,
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
    const reportTime = reportsTimes.find(
      (item) => item.id === reportTimeDisplayed
    );

    setValue("reportTime", reportTime.name);
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
        haveSafetyGrade: true,
        haveCulinaryGrade: true,
        haveNutritionGrade: true,
        haveCategoriesNameForCriticalItems: false,
      };

      if (value === "דוח חדש") {
        // console.log("Setting newSwitchStates and formData");
        setCheckboxStatus(newCheckboxStatus);
        setSwitchStates(newSwitchStates);
        setValue("reportTime", "בחירה");
        setFormData((prevFormData) => ({
          ...prevFormData,
          oldReportId: "0",
          accompany: "",
          reportTime: "",
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
          true;
          setSwitchStates(newSwitchStates);
        }
      }
    }
  }, 300);

  // todo to return error for date picker
  // * toggle switch function
  const toggleSwitch = (id) => {
    setSwitchStates((prevState) => {
      const newState = {
        ...prevState,
        [id]: !prevState[id],
      };
      const value = newState[id] ? 1 : 0;
      handleFormChange(id, value);
      return newState;
    });
  };

  const memoRizedCats = memoizedCategories?.categories;
  const globalCategoriesObj = memoRizedCats
    ? Object.values(memoRizedCats).flatMap((category) => category.categories)
    : null;
  // * comparing between the categories names to the ids in the forms to display it in the drawer
  const categoryIdToNameMap = {};
  globalCategoriesObj && formData.categorys
    ? globalCategoriesObj?.forEach((item) => {
        categoryIdToNameMap[item.id] = item.name;
      })
    : [];
  const checkedCategories =
    formData && formData.categorys?.map((id) => categoryIdToNameMap[id]);

  // * submit the form
  const onSubmitForm = async () => {
    const formErrors = {};
    try {
      await schema.validate(formData, { abortEarly: false });
    } catch (err) {
      err.inner.forEach((validationError) => {
        formErrors[validationError.path] = validationError.message;
      });
    }
    if (Object.keys(formErrors).length > 0) {
      Alert.alert("Error", JSON.stringify(formErrors));
    } else {
      console.log("schema is valid");

      setIsLoading(true);
      try {
        await postNewReport(formData, IsRearrangement);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error posting data:", error);
      }
    }
  };

  // * Drawer
  const handleDrawerToggle = (isOpen) => {
    setIsDrawerOpen(isOpen);
  };

  // * pagination between categories names : Next
  const saveEditEdReportAndNavigate = async () => {
    if (currentReport) {
      try {
        setIsLoading(true);
        const response = await saveEditedReport(formData);
        console.log("edit post response:", response);
        dispatch(setIndex(0));
        dispatch(getCurrentCategory(formData.categorys[0]));
        setIsLoading(false);
        navigateToRoute(routes.ONBOARDING.CategoryEdit);
      } catch (error) {
        console.error("Error posting data:", error);
      }
    }
  };

  // * accordion FlatList array of Content
  const NewReportAccordionContent = [
    // {
    //   key: "settings",
    //   headerText: "הגדרות הדוח",
    //   contentText: "world",
    //   contentHeight: 959,
    //   headerHeight: 48,
    //   headerTogglerStyling: styles.headerStyle,
    //   iconDisplay: true,
    //   boxHeight: 80.5,
    //   hasDivider: true,
    //   draggable: false,
    //   accordionCloseIndicator: accordionCloseIcon,
    //   accordionOpenIndicator: accordionOpenIcon,
    //   contentItemStyling: styles.contentBoxSetting,
    //   accordionContent: [
    //     {
    //       id: 0,
    //       text: <Text>תחנה</Text>,
    //       boxItem: (
    //         <SelectMenu
    //           control={control}
    //           selectWidth={240}
    //           optionsHeight={200}
    //           defaultText={
    //             currentReport ? currentReport.getData("station_name") : "בחירה"
    //           }
    //           displayedValue={getValues().clientStationId}
    //           selectMenuStyling={{
    //             flexDirection: "column",
    //             justifyContent: "center",
    //             alignItems: "flex-start",
    //           }}
    //           centeredViewStyling={
    //             {
    //               // marginRight: 12,
    //               // alignItems: "flex-end",
    //               // marginTop: -530,
    //             }
    //           }
    //           selectOptions={currentClient.getStations()}
    //           name={"clientStationId"}
    //           errorMessage={
    //             errors.clientStationId && errors.clientStationId.message
    //           }
    //           onChange={(value) => {
    //             handleFormChange("clientStationId", value.id);
    //             setSelectedStation(value.id);
    //             setValue("clientStationId", value.company);
    //             trigger("clientStationId");
    //             console.log("value-station:", value);
    //           }}
    //           propertyName="company"
    //           returnObject={true}
    //         />
    //       ),
    //     },

    //     {
    //       id: 1,
    //       text: <Text>התבסס על דוח קודם</Text>,
    //       boxItem: (
    //         <SelectMenu
    //           control={control}
    //           selectWidth={240}
    //           optionsHeight={750}
    //           defaultText={"בחירה"}
    //           // displayedValue={getValues().previousReports}
    //           selectMenuStyling={{
    //             flexDirection: "column",
    //             justifyContent: "center",
    //             alignItems: "flex-start",
    //           }}
    //           centeredViewStyling={
    //             {
    //               // marginRight: 12,
    //               // alignItems: "flex-end",
    //               // marginTop: 180,
    //             }
    //           }
    //           selectOptions={[
    //             { timeOfReport: "דוח חדש", id: 0 },
    //             ...filteredStationsResult, //clientStationId
    //           ]}
    //           name={"previousReports"}
    //           errorMessage={
    //             errors.previousReports && errors.previousReports.message
    //           }
    //           onChange={(value) => {
    //             handleFormChange("previousReports", value);
    //             // setSelectedReport(value);
    //             setValue("previousReports", value);
    //             trigger("previousReports");
    //             console.log("previousReports:", value);
    //           }}
    //           propertyName="timeOfReport"
    //         />
    //       ),
    //     },
    //     {
    //       id: 2,
    //       text: <Text>יש קנסות</Text>,
    //       boxItem: (
    //         <ToggleSwitch
    //           id={"haveFine"}
    //           switchStates={switchStates}
    //           toggleSwitch={toggleSwitch}
    //           truthyText={"כן"}
    //           falsyText={"לא"}
    //         />
    //       ),
    //     },
    //     {
    //       id: 3,
    //       text: <Text>להציג כמות סעיפים</Text>,
    //       boxItem: (
    //         <ToggleSwitch
    //           id={"haveAmountOfItems"}
    //           switchStates={switchStates}
    //           toggleSwitch={toggleSwitch}
    //           truthyText={"כן"}
    //           falsyText={"לא"}
    //         />
    //       ),
    //     },
    //     {
    //       id: 4,
    //       text: <Text>הצג ציון ביקורת בטיחות מזון</Text>,
    //       boxItem: (
    //         <ToggleSwitch
    //           id={"haveSafetyGrade"}
    //           switchStates={switchStates}
    //           toggleSwitch={toggleSwitch}
    //           truthyText={"כן"}
    //           falsyText={"לא"}
    //         />
    //       ),
    //     },
    //     {
    //       id: 5,
    //       text: <Text>הצג ציון ביקורת קולינארית</Text>,
    //       boxItem: (
    //         <ToggleSwitch
    //           id={"haveCulinaryGrade"}
    //           switchStates={switchStates}
    //           toggleSwitch={toggleSwitch}
    //           truthyText={"כן"}
    //           falsyText={"לא"}
    //         />
    //       ),
    //     },
    //     {
    //       id: 6,
    //       text: <Text>הצג ציון תזונה</Text>,
    //       boxItem: (
    //         <ToggleSwitch
    //           id={"haveNutritionGrade"}
    //           switchStates={switchStates}
    //           toggleSwitch={toggleSwitch}
    //           truthyText={"כן"}
    //           falsyText={"לא"}
    //         />
    //       ),
    //     },
    //     {
    //       id: 7,
    //       text: <Text>הצג שמות קטגוריות בתמצית עבור ליקויים קריטיים</Text>,
    //       boxItem: (
    //         <ToggleSwitch
    //           id={"haveCategoriesNameForCriticalItems"}
    //           switchStates={switchStates}
    //           toggleSwitch={toggleSwitch}
    //           truthyText={"כן"}
    //           falsyText={"לא"}
    //         />
    //       ),
    //     },
    //     {
    //       id: 8,
    //       text: <Text>שם המלווה</Text>,
    //       boxItem: (
    //         <View style={{ justifyContent: "flex-end", alignSelf: "center" }}>
    //           <Input
    //             mode={"outlined"}
    //             control={control}
    //             name={"accompany"}
    //             inputStyle={{
    //               backgroundColor: colors.white,
    //               width: 240,
    //               alignSelf: "center",
    //             }}
    //             activeOutlineColor={colors.blue}
    //             // label={accompanySelected ? accompanySelected : "ללא  מלווה"}
    //             // label={null}
    //             defaultValue={
    //               currentReport
    //                 ? currentReport.getData("accompany")
    //                 : formData.accompany
    //             }
    //             // placeholder={" "}
    //             outlineColor={"rgba(12, 20, 48, 0.2)"}
    //             onChangeFunction={(value) => {
    //               handleFormChange("accompany", value);
    //             }}
    //           />
    //         </View>
    //       ),
    //     },
    //     {
    //       id: 9,
    //       text: <Text>תאריך ביקורת</Text>,
    //       boxItem: (
    //         <DatePicker
    //           control={control}
    //           name={"timeOfReport"}
    //           errorMessage={errors.timeOfReport && errors.timeOfReport.message}
    //           onchange={(value) => {
    //             const date = new Date(value);
    //             const formattedDate = date.toLocaleDateString("en-GB");
    //             handleFormChange("timeOfReport", formattedDate);
    //             setValue("timeOfReport", formattedDate);
    //             trigger("timeOfReport");
    //           }}
    //           dateInputWidth={240}
    //           defaultDate={currentReport?.getData("timeOfReport")}
    //         />
    //       ),
    //     },
    //     {
    //       id: 10,
    //       text: <Text>זמן הביקורת</Text>,
    //       boxItem: (
    //         <SelectMenu
    //           control={control}
    //           selectWidth={240}
    //           optionsHeight={200}
    //           defaultText={currentReport ? currentReportTime : "בחירה"}
    //           displayedValue={currentReportTime}
    //           selectMenuStyling={{
    //             flexDirection: "column",
    //             justifyContent: "center",
    //             alignItems: "flex-start",
    //           }}
    //           selectOptions={reportsTimes}
    //           name={"reportTime"}
    //           errorMessage={errors.reportTime && errors.reportTime.message}
    //           onChange={(value) => {
    //             setCurrentReportTime(value.id);
    //             handleFormChange("reportTime", value.id);
    //             setValue("reportTime");
    //             trigger("reportTime");
    //             console.log("reportTime:", value);
    //           }}
    //           propertyName={"name"}
    //           returnObject={true}
    //         />
    //       ),
    //     },
    //   ],
    // },
    {
      key: "categories",
      headerText: "קטגוריות",
      contentText: "world",
      contentHeight: 336,
      headerHeight: 48,
      headerTogglerStyling: styles.headerStyle,
      iconDisplay: true,
      boxHeight: 46,
      hasDivider: true,
      draggable: true,
      accordionCloseIndicator: accordionCloseIcon,
      accordionOpenIndicator: accordionOpenIcon,
      contentItemStyling: styles.contentBoxCategories,
      scrollEnabled: true,
      accordionContent: [
        {
          id: 0,
          boxItem: (
            <>
              {errors.categorys && errors.categorys.message && (
                <HelperText type="error" style={{ marginBottom: 10 }}>
                  {errors.categorys.message}
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
              } (נבחרו ${getCheckedCount(
                checkboxStatus,
                "foodSafetyReviewCb"
              )} דוחות)`}
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
                formData && formData.categorys
                  ? [...foodSafetyReviewTexts].sort((a, b) => {
                      const aIdx = formData.categorys.indexOf(Number(a.id));
                      const bIdx = formData.categorys.indexOf(Number(b.id));

                      if (aIdx >= 0 && bIdx >= 0) {
                        return aIdx - bIdx;
                      } else if (aIdx >= 0) {
                        return -1;
                      } else if (bIdx >= 0) {
                        return 1;
                      } else {
                        return 0;
                      }
                    })
                  : [],
                "foodSafetyReviewCb",
                checkboxStatus,
                setCheckboxStatus
              )}
              onDragEndCb={(data) => {
                const { from, to } = data;
                // deepcopy the current checkboxStatus?.foodSafetyReviewCbStatus array
                const newCheckboxStatus = [
                  ...checkboxStatus?.foodSafetyReviewCbStatus,
                ];
                // reordering the checkbox statuses to match the new item order
                newCheckboxStatus?.splice(
                  to,
                  0,
                  newCheckboxStatus?.splice(from, 1)[0]
                );
                // updateing the checkboxStatus state
                setCheckboxStatus({
                  ...checkboxStatus,
                  foodSafetyReviewCbStatus: newCheckboxStatus,
                });
                // reorder the items in foodSafetyReviewTexts to match the new order
                const newData = [...foodSafetyReviewTexts];
                newData.splice(to, 0, newData.splice(from, 1)[0]);
                // update the newData state
                setFoodSafetyReviewTexts(newData);
                setIsRearrangement(true);
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
              } (נבחרו  ${getCheckedCount(
                checkboxStatus,
                "culinaryReviewCb"
              )} דוחות)`}
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
                formData && formData.categorys
                  ? [...culinaryReviewTexts].sort((a, b) => {
                      const aIdx = formData.categorys.indexOf(Number(a.id));
                      const bIdx = formData.categorys.indexOf(Number(b.id));

                      if (aIdx >= 0 && bIdx >= 0) {
                        return aIdx - bIdx;
                      } else if (aIdx >= 0) {
                        return -1;
                      } else if (bIdx >= 0) {
                        return 1;
                      } else {
                        return 0;
                      }
                    })
                  : [],
                "culinaryReviewCb",
                checkboxStatus,
                setCheckboxStatus
              )}
              onDragEndCb={(data) => {
                const { from, to } = data;

                // deepcopy the current checkboxStatus?.culinaryReviewCbStatus array
                const newCheckboxStatus = [
                  ...checkboxStatus?.culinaryReviewCbStatus,
                ];

                // reordering the checkbox statuses to match the new item order
                newCheckboxStatus?.splice(
                  to,
                  0,
                  newCheckboxStatus?.splice(from, 1)[0]
                );

                // updateing the checkboxStatus state
                setCheckboxStatus({
                  ...checkboxStatus,
                  culinaryReviewCbStatus: newCheckboxStatus,
                });

                // reorder the items in culinaryReviewTexts to match the new order
                const newData = [...culinaryReviewTexts];
                newData.splice(to, 0, newData.splice(from, 1)[0]);

                // update the newData state
                setCulinaryReviewTexts(newData);

                setIsRearrangement(true);
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
                } (נבחרו  ${getCheckedCount(
                  checkboxStatus,
                  "nutritionReviewCb"
                )} דוחות)`}
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
                  formData && formData.categorys
                    ? [...nutritionReviewTexts].sort((a, b) => {
                        const aIdx = formData.categorys.indexOf(Number(a.id));
                        const bIdx = formData.categorys.indexOf(Number(b.id));

                        if (aIdx >= 0 && bIdx >= 0) {
                          return aIdx - bIdx;
                        } else if (aIdx >= 0) {
                          return -1;
                        } else if (bIdx >= 0) {
                          return 1;
                        } else {
                          return 0;
                        }
                      })
                    : [],
                  "nutritionReviewCb",
                  checkboxStatus,
                  setCheckboxStatus
                )}
                onDragEndCb={(data) => {
                  const { from, to } = data;

                  // deepcopy the current checkboxStatus?.nutritionReviewCbStatus array
                  const newCheckboxStatus = [
                    ...checkboxStatus?.nutritionReviewCbStatus,
                  ];

                  // reordering the checkbox statuses to match the new item order
                  newCheckboxStatus?.splice(
                    to,
                    0,
                    newCheckboxStatus?.splice(from, 1)[0]
                  );

                  // updateing the checkboxStatus state
                  setCheckboxStatus({
                    ...checkboxStatus,
                    nutritionReviewCbStatus: newCheckboxStatus,
                  });

                  // reorder the items in nutritionReviewTexts to match the new order
                  const newData = [...nutritionReviewTexts];
                  newData.splice(to, 0, newData.splice(from, 1)[0]);

                  // update the newData state
                  setNutritionReviewTexts(newData);

                  setIsRearrangement(true);
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
    // {
    //   key: "summary",
    //   headerText: "תמצית הדוח",
    //   contentText: "world",
    //   contentHeight: 300,
    //   headerHeight: 48,
    //   headerTogglerStyling: styles.headerStyle,
    //   iconDisplay: true,
    //   // boxHeight: 80.5,
    //   draggable: false,
    //   contentItemStyling: styles.contentBoxSettingSummery,
    //   hasDivider: false,
    //   accordionCloseIndicator: accordionCloseIcon,
    //   accordionOpenIndicator: accordionOpenIcon,
    //   accordionContent: [
    //     {
    //       id: 0,
    //       boxItem: (
    //         <View
    //           style={{
    //             flex: 1,
    //             width: "100%",
    //             marginTop: 20,
    //             height: "100%",
    //             direction: "rtl",
    //             // backgroundColor: "red",
    //           }}
    //         >
    //           <View
    //             style={{
    //               backgroundColor: "#D3E0FF",
    //               width: "100%",
    //               alignItems: "flex-start",
    //               // marginBottom: 200,
    //               position: "relative",
    //               zIndex: 3,
    //             }}
    //           >
    //             <RichToolbar
    //               editor={richText}
    //               selectedButtonStyle={{ backgroundColor: "#baceff" }}
    //               unselectedButtonStyle={{ backgroundColor: "#D3E0FF" }}
    //               iconTint="#000000"
    //               selectedIconTint="#000000"
    //               actions={[
    //                 actions.insertOrderedList,
    //                 actions.insertBulletsList,
    //                 actions.setUnderline,
    //                 actions.setItalic,
    //                 actions.setBold,
    //                 "custom",
    //               ]}
    //               // onPressAddImage={onPressAddImage}
    //               // onAction={onAction} // Add the onAction prop for custom actions
    //               iconMap={{
    //                 ["custom"]: ({}) => <Text>C</Text>,
    //               }}
    //               custom={() => {
    //                 setColorSelected(!colorSelected);
    //                 console.log("object");
    //               }}
    //             />
    //           </View>
    //           {colorSelected && (
    //             <View
    //               style={{
    //                 direction: "ltr",
    //                 width: 200,
    //                 position: "absolute",
    //                 top: 20,
    //                 zIndex: 3,
    //               }}
    //             >
    //               <ColorPicker
    //                 onColorChange={(color) => {
    //                   console.log(color);
    //                   richText.current?.setForeColor(color);
    //                 }}
    //                 sliderSize={20}
    //                 thumbSize={60}
    //                 gapSize={5}
    //                 // noSnap={true}
    //                 color="#000000"
    //                 palette={[
    //                   "#000000",
    //                   "#ffff00",
    //                   "#0000ff",
    //                   "#ff0000",
    //                   "#00ff00",
    //                 ]}
    //                 swatches={true}
    //               />
    //             </View>
    //           )}
    //           <ScrollView
    //             onLayout={(event) => {
    //               // const { height, width } = event.nativeEvent.layout;
    //               // setRichTextHeight(height);
    //             }}
    //             style={{
    //               flex: 1,
    //               overflow: "visible",
    //               // height: 200,
    //               minHeight: Platform.OS == "ios" ? 200 : 200,
    //               direction: "rtl",
    //               borderWidth: 1,
    //               // borderColor: "#000",
    //               borderColor: "#eee",
    //               zIndex: 2,
    //             }}
    //           >
    //             <KeyboardAvoidingView
    //               behavior={Platform.OS == "ios" ? "height" : "height"}
    //               style={{ flex: 1, direction: "rtl" }}
    //             >
    //               <RichEditor
    //                 ref={richText}
    //                 onChange={handleContentChange}
    //                 initialContentHTML={
    //                   currentReport
    //                     ? currentReport.getData("newGeneralCommentTopText")
    //                     : ""
    //                 }
    //                 styleWithCSS={true}
    //                 useContainer={false}
    //                 style={{
    //                   direction: "rtl",
    //                   // borderWidth: 1,
    //                   // borderColor: "#000",
    //                   height: 200,
    //                 }}
    //               />
    //             </KeyboardAvoidingView>
    //           </ScrollView>
    //         </View>
    //       ),
    //     },
    //   ],
    // },
  ];

  // * filtering out timeofReport when on edit mode.
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

  return (
    <>
      <ScreenWrapper
        newReportBackGroundImg={true}
        isConnectedUser
        wrapperStyle={[styles.container, {}]}
        edges={[]}
      >
        <View style={styles.headerWrapper}>
          <GoBackNavigator
            text={"חזרה לרשימת הלקוחות"}
            onBackPress={async () => {
              setIsLoading(true);
              if (currentReport) {
                const res = await saveEditedReport(formData);
                setIsLoading(false);
                console.log("edit on back press button successfully", res);
              } else {
                setIsLoading(false);
                console.log("unable o save on back press..");
              }
            }}
          />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Header
              HeaderText={
                currentReport
                  ? `עריכת דוח עבור ${currentReport.data.station_name}`
                  : `יצירת דוח חדש עבור ${currentClient.getCompany()}`
              }
              iconList={currentReport}
              onCategoriesIconPress={() => {
                setModalVisible(true);
              }}
              onSummeryIconPress={async () => {
                setIsLoading(true);
                try {
                  await saveEditedReport(formData);
                  dispatch(setMajorCategoryHeaders(majorCategoryHeadersToPass));
                  dispatch(setCategoryNamesSubHeaders(sortedCategories));
                  setIsLoading(false);
                } catch (error) {
                  console.log("WorkerNewReport[err]", error);
                } finally {
                  setIsLoading(false);
                }
              }}
            />
          </View>
          {isLoading ? (
            <Loader visible={isLoading} isSetting={true} />
          ) : (
            <AccordionContentList data={modifiedAccordionContent} />
          )}
        </View>
        {currentReport ? (
          <SafeAreaView
            style={{
              width: "100%",
              marginBottom: Platform.OS === "ios" ? 50 : 100,
            }}
          >
            <Drawer
              content={
                <LinearGradient
                  colors={["#37549D", "#26489F"]}
                  start={[0, 0]}
                  end={[1, 0]}
                  style={{
                    padding: 16,
                    height: 76,
                    zIndex: 1,
                  }}
                >
                  <View
                    style={{
                      maxWidthwidth: windowWidth,
                      justifyContent: "space-evenly",
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    {formData &&
                      formData.categorys &&
                      formData.categorys[0] && (
                        <TouchableOpacity
                          onPress={saveEditEdReportAndNavigate}
                          style={{
                            alignSelf: "center",
                            justifyContent: "center",
                            flexDirection: "row",
                            gap: 5,
                            alignItems: "center",
                          }}
                        >
                          <Text style={styles.categoryDirButton}>
                            הקטגוריה הבאה:{" "}
                            {/* {
                                checkedCategoryNameById[currentCategoryIndex]
                                  .name
                              } */}
                            {checkedCategories[0]}
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
              height={0}
              onToggle={handleDrawerToggle}
              contentStyling={{ padding: 0 }}
            />
          </SafeAreaView>
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
        {modalVisible && (
          <CategoriesPickerModal
            formData={formData}
            setLoading={setIsLoading}
            globalCategoriesObj={globalCategoriesObj}
            isLoading={isLoading}
            setModalVisible={setModalVisible}
            setMajorCategoryHeadersToPass={setMajorCategoryHeadersToPass}
            setSortedCategories={setSortedCategories}
          />
        )}
      </ScreenWrapper>
    </>
  );
};

export default React.memo(WorkerNewReport);

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
    flex: 1,
    direction: "rtl",
  },
  contentBoxSettingSummery: {
    alignItems: "center",
    // height: 80.5,
    paddingHorizontal: 16,
    flex: 1,
    direction: "rtl",
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
