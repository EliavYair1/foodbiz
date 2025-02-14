import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
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
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
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
import { useAccordionCategoriesItem } from "./AccordionCategoriesItem/AccordionCategoriesItem";
import CategoriesPickerModal from "./CategoriesPickerModal/CategoriesPickerModal";
import useFilteredStations from "../../Hooks/useFilteredStations";
import useToggleSwitch from "../../Hooks/useToggleSwitch";
import { FlatList } from "react-native-gesture-handler";
import SummaryAccordion from "./SummaryAccordion/SummaryAccordion";
import getSettingsAccordionData from "./SettingsAccordionContent/SettingsAccordionContent";

const windowWidth = Dimensions.get("window").width;
const WorkerNewReport = () => {
  const dispatch = useDispatch();
  // ? global state management
  const currentClient = useSelector(
    (state) => state.currentClient.currentClient
  );
  const currentReport = useSelector(
    (state) => state.currentReport.currentReport
  );

  const reportsTimes = useSelector((state) => state.reportsTimes.reportsTimes);

  const globalCategories = useSelector((state) => state.globalCategories);

  const memoizedCategories = useMemo(
    () => globalCategories,
    [globalCategories]
  );

  // * local state management
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [IsRearrangement, setIsRearrangement] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [accompanySelected, setAccompanySelected] = useState(null);

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
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // * custom hooks
  const { navigateToRoute } = useScreenNavigator();
  const saveEditedReport = useSaveEditedReport();
  const { postNewReport } = usePostNewReport();
  const { filteredStationsResult, selectedStation, setSelectedStation } =
    useFilteredStations();

  // * general handle form change
  const handleFormChange = (name, value) => {
    setValue(name, value);
  };

  const updateCategories = (name, data) => {
    handleFormChange(name, data);
    trigger(name);
  };

  const {
    accordionCategoriesItem,
    checkboxStatus,
    setCheckboxStatus,
    getCheckedCount,
    handleCheckboxStatusChange,
    itemCounts,
  } = useAccordionCategoriesItem(updateCategories);

  // * when chosing an existing previous report it update's the previous seleted toggle switches .
  const updateTogglesStatusOnPreviousReports = (data) => {
    Object.entries(data).forEach(([key, value]) => {
      setValue(key, value ? 1 : 0);
    });
  };

  const {
    switchStates,
    handleSwitchStateChange,
    toggleSwitch,
    setSwitchStates,
  } = useToggleSwitch(updateTogglesStatusOnPreviousReports);

  const [majorCategoryHeadersToPass, setMajorCategoryHeadersToPass] = useState(
    []
  );
  const [sortedCategories, setSortedCategories] = useState({});
  // const [currentReportTime, setCurrentReportTime] = useState(null);

  //  * edit mode existing current report initialization
  useEffect(() => {
    if (currentReport) {
      handleCheckboxStatusChange(
        parsedArrayOfStr(currentReport.getData("categorys")),
        memoizedCategories
      );
    }
  }, [currentReport]);

  // * initiate neccesry form data
  useEffect(() => {
    handleFormChange("clientId", currentClient?.id);
    handleFormChange("haveNewGeneralCommentsVersion", 1);
    handleFormChange("rearrangement", IsRearrangement);
    handleFormChange("accompany", getValues()?.accompany ?? "");
    handleFormChange("haveFine", switchStates.haveFine);
    handleFormChange("haveAmountOfItems", switchStates.haveAmountOfItems);
    handleFormChange("haveSafetyGrade", switchStates.haveSafetyGrade);
    handleFormChange("haveCulinaryGrade", switchStates.haveCulinaryGrade);
    handleFormChange("haveNutritionGrade", switchStates.haveNutritionGrade);
    handleFormChange(
      "haveCategoriesNameForCriticalItems",
      switchStates.haveCategoriesNameForCriticalItems
    );
    handleFormChange(
      "newGeneralCommentTopText",
      getValues().newGeneralCommentTopText ?? ""
    );
  }, [getValues(), IsRearrangement]);

  // * redefine the Accordion height
  const changeCategoryAccordionHeight = (contentHeight, isOpen) => {
    return isOpen ? 172 + contentHeight : 172;
  };

  // * setting the oldReportId from selected report
  const handleReportId = (selectedReport) => {
    handleFormChange("oldReportId", selectedReport.getData("id"));
    // trigger("clientStationId");
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

  // * when chosing an existing previous report it update's the previous seleted categories .
  const updateCategoriesStatusOnPreviousReports = (data) => {
    handleFormChange(
      "categorys",
      data.length > 0 || Object.keys(data).length > 0
        ? data
        : parsedSelectedReportCategory
    );
  };

  //  * handling report time
  const handleReportTime = (selectedReport) => {
    const reportTimeDisplayed = selectedReport.getData("reportTime");

    const reportTime = reportsTimes.find(
      (item) => item.id === reportTimeDisplayed
    );

    handleFormChange("reportTime", reportTime?.id);
    trigger("reportTime");
  };

  // * setting the accompany
  const handleAccompanyChange = (selectedReport) => {
    const accompanyName = selectedReport.getData("accompany");
    if (accompanyName == "ללא ליווי") {
      handleFormChange("accompany", "ללא ליווי");
    } else {
      handleFormChange("accompany", accompanyName);
      // trigger("accompany");
    }
  };

  const memoRizedCats = memoizedCategories?.categories;
  const globalCategoriesObj = memoRizedCats
    ? Object.values(memoRizedCats).flatMap((category) => category.categories)
    : null;

  // * comparing between the categories names to the ids in the forms to display it in the drawer
  const categoryIdToNameMap = {};
  globalCategoriesObj && getValues()?.categorys
    ? globalCategoriesObj?.forEach((item) => {
        categoryIdToNameMap[item.id] = item.name;
      })
    : [];

  const checkedCategories =
    getValues() && getValues()?.categorys?.map((id) => categoryIdToNameMap[id]);

  // * submit the form
  const onSubmitForm = async () => {
    // const isValid = await trigger();
    // console.log("isValid", isValid);
    const formErrors = {};
    try {
      await schema.validate(getValues(), { abortEarly: false });
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
        await postNewReport(getValues(), IsRearrangement);
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
        const response = await saveEditedReport(getValues());
        console.log("edit post response:", response);
        dispatch(setIndex(0));
        dispatch(getCurrentCategory(getValues().categorys[0]));
        setIsLoading(false);
        navigateToRoute(routes.ONBOARDING.CategoryEdit);
      } catch (error) {
        console.error("Error posting data:", error);
      }
    }
  };

  const previousReportsSelectOptions = useMemo(
    () => [
      { timeOfReport: "דוח חדש", id: 0 },
      ...(filteredStationsResult ?? []), // clientStationId
    ],
    [filteredStationsResult]
  );

  const findSelectedReport = (value) => {
    return filteredStationsResult.find(
      (report) => report.getData("timeOfReport") === value
    );
  };

  // todo to update the state from the setFormData to handleFormChange .
  const updateFormForNewReport = (checkboxStatus, switchStates) => {
    handleFormChange("previousReports", "דוח חדש");
    handleFormChange("oldReportId", "0");
    handleFormChange("accompany", "");
    handleFormChange("reportTime", "");
    // handleFormChange("categorys", []);
    setCheckboxStatus(checkboxStatus);
    setSwitchStates(switchStates);
    Object.entries(switchStates).forEach(([key, value]) => {
      setValue(key, value ? 1 : 0);
    });
  };

  const handleNewReport = async () => {
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
    await updateFormForNewReport(newCheckboxStatus, newSwitchStates);
  };

  // todo to update the state from the setFormData to setValue of useform everywhere in the code.
  const handlePreviousReportsChange = debounce(async (value) => {
    try {
      // * when new report is chosen in the previous report field.
      if (value === "דוח חדש") {
        await handleNewReport();
      } else {
        // * when old report is chosen in the previous report field.
        const selectedReport = findSelectedReport(value);
        handleFormChange("previousReports", value);
        if (selectedReport) {
          handleReportId(selectedReport);
          const parsedSelectedReportCategory =
            handleSelectedReportCategory(selectedReport);
          handleCheckboxStatusChange(
            parsedSelectedReportCategory,
            memoizedCategories,
            updateCategoriesStatusOnPreviousReports
          );
          handleSwitchStateChange(selectedReport);
          handleAccompanyChange(selectedReport);
          handleReportTime(selectedReport);
        } else {
          true;
          setSwitchStates(newSwitchStates);
        }
      }
    } catch (error) {
      console.log("handlePreviousReportsChange[Error]", error);
    }
  }, 300);

  // * accordion FlatList array of Content
  const settingsAccordion = getSettingsAccordionData({
    handleFormChange,
    handlePreviousReportsChange,
    previousReportsSelectOptions,
    currentReport,
    currentClient,
    switchStates,
    toggleSwitch,
    control,
    errors,
    getValues,
    setSelectedStation,
    setSwitchStates,
  });

  const categoriesAccordion = [
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
              } (נבחרו ${itemCounts.foodSafetyReviewCbStatus} דוחות)`}
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
                getValues() && getValues().categorys
                  ? [...foodSafetyReviewTexts].sort((a, b) => {
                      const aIdx = getValues().categorys.indexOf(Number(a.id));
                      const bIdx = getValues().categorys.indexOf(Number(b.id));

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
                checkboxStatus.culinaryReviewCbStatus
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
                getValues() && getValues().categorys
                  ? [...culinaryReviewTexts].sort((a, b) => {
                      const aIdx = getValues().categorys.indexOf(Number(a.id));
                      const bIdx = getValues().categorys.indexOf(Number(b.id));

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
                  checkboxStatus.nutritionReviewCbStatus
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
                  getValues() && getValues().categorys
                    ? [...nutritionReviewTexts].sort((a, b) => {
                        const aIdx = getValues().categorys.indexOf(
                          Number(a.id)
                        );
                        const bIdx = getValues().categorys.indexOf(
                          Number(b.id)
                        );

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
  ];

  const summaryAccordion = [
    {
      key: "summary",
      headerText: "תמצית הדוח",
      contentText: "world",
      contentHeight: 300,
      headerHeight: 48,
      headerTogglerStyling: styles.headerStyle,
      iconDisplay: true,
      // boxHeight: 80.5,
      draggable: false,
      contentItemStyling: styles.contentBoxSettingSummery,
      hasDivider: false,
      accordionCloseIndicator: accordionCloseIcon,
      accordionOpenIndicator: accordionOpenIcon,
      accordionContent: [
        {
          id: 0,
          boxItem: (
            <SummaryAccordion
              currentReport={currentReport}
              // handleContentChange={handleContentChange}
              handleFormChange={handleFormChange}
            />
          ),
        },
      ],
    },
  ];
  // * filtering out timeofReport when on edit mode.
  const modifiedSettingsAccordion = currentReport
    ? settingsAccordion.map((section) => {
        if (section.key === "settings") {
          const modifiedSettingsAccordion = section.accordionContent.filter(
            (item) => item.id !== 1
          );
          return { ...section, accordionContent: modifiedSettingsAccordion };
        }
        return section;
      })
    : settingsAccordion;
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
                const res = await saveEditedReport(getValues());
                setIsLoading(false);
                // console.log("edit on back press button successfully", res);
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
                  ? `עריכת דוח עבור ${currentReport.getData("station_name")}`
                  : `יצירת דוח חדש עבור ${currentClient.getCompany()}`
              }
              iconList={currentReport}
              onCategoriesIconPress={() => {
                setModalVisible(true);
              }}
              onSummeryIconPress={async () => {
                setIsLoading(true);
                try {
                  await saveEditedReport(getValues());
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
            <Loader visible={isLoading} isSetting={false} />
          ) : (
            <FlatList
              data={[
                ...modifiedSettingsAccordion,
                ...categoriesAccordion,
                ...summaryAccordion,
              ]}
              renderItem={({ item }) => <AccordionContentList data={[item]} />}
              keyExtractor={(item) => item.key}
            />
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
                    {getValues() &&
                      getValues().categorys &&
                      getValues().categorys[0] && (
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
              onPress={handleSubmit(onSubmitForm)}
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
            formData={getValues()}
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
