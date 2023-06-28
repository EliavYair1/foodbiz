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
  const [formData, setFormData] = useState({});
  const [reportTimeOptions, setreportTimeOptions] = useState([
    "שעות הבוקר ועד תחילת הארוחה",
    "במהלך הארוחה ועד סופה",
    "מתחילת הארוחה ועד סופה",
    "ארוחת ערב",
    "ארוחת לילה",
    "שעות הבוקר",
    "למשך יום שלם",
    "במהלך הארוחה",
    "משעות הבוקר ועד ה 1/3 הראשון של הארוחה",
    "משעות הבוקר ועד אמצע הארוחה",
    "שעות הבוקר ובמהלך הארוחה",
    "שעות הצהריים",
    "מבדק סגירה (מחוץ לשעות הפעילות)",
    "דוח מרכז בטווח התאריכים שנרשמו",
    "דוח ריכוז מבדקים שבועי",
    "במהלך המשחק",
    "לפני ובמהלך המשחק",
  ]);
  const [checkboxStatus, setCheckboxStatus] = useState({
    foodSafetyReviewCbStatus: [],
    culinaryReviewCbStatus: [],

    nutritionReviewCbStatus: [],
  });
  const [selectedStation, setSelectedStation] = useState(null);
  const [accompanySelected, setAccompanySelected] = useState(null);
  const [categoryAccordionHeight, setCategoryAccordionHeight] = useState(172);
  const [switchStates, setSwitchStates] = useState({
    haveFineSwitch: false,
    haveAmountOfItemsSwitch: false,
    haveSafetyGradeSwitch: false,
    haveCulinaryGradeSwitch: false,
    haveNutritionGradeSwitch: false,
    haveCategoriesNameForCriticalItemsSwitch: false,
  });
  const selectOptions = reportTimeOptions.map((option, index) => ({
    label: option,
    value: index.toString(),
  }));
  const schema = yup.object().shape({
    station: yup.string().required("station is required"),
    previousReports: yup.string().required("previousReports is required"),
    accompany: yup.string().required("accompany is required"),
    date: yup.string().required("date is required"),
    reportTime: yup.string(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // * categories fetching start
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchReportsTimes());
  }, [dispatch]);

  const memoizedCategories = useMemo(() => categories, [categories]);
  // newGeneralCommentTopText change handler
  const handleContentChange = debounce((content) => {
    console.log(content);
  }, 300);

  // todo 4 : save all the changes in one place.

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

      //if checked and label is not found in the array add to the array
      if (checked && index === -1) {
        updatedCategoryStatus.push(parseInt(label));
        // if unchecked and label is found in the array remove to the array
      } else if (!checked && index !== -1) {
        updatedCategoryStatus.splice(index, 1);
      }

      return { ...prevStatus, [category]: updatedCategoryStatus };
    });
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
    setSwitchStates((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  // * report onchange handler function
  const handleFormChange = debounce((name, value) => {
    setIsLoading(true);
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
        haveAmountOfItemsSwitch: false,
        haveSafetyGradeSwitch: false,
        haveCulinaryGradeSwitch: false,
        haveNutritionGradeSwitch: false,
        haveCategoriesNameForCriticalItemsSwitch: false,
      };

      if (value === "דוח חדש") {
        setCheckboxStatus(newCheckboxStatus);
        setSwitchStates(newSwitchStates);
      } else {
        // * selected report filtered to the chosen station
        const selectedReport = filteredStationsResult.find(
          (report) => report.getData("timeOfReport") === value
        );
        if (selectedReport) {
          // * getting the report categories
          const selectedReportCategory = selectedReport.getData("categorys");
          // * parsing the string to array of numbers
          const parsedSelectedReportCategory = new Set(
            selectedReportCategory
              .split("|")
              .map((str) => str.replace(";", ""))
              .filter(Boolean)
              .map((numStr) => parseInt(numStr, 10))
          );
          // * getting the categories from the categories of the api
          const memoRizedCats = memoizedCategories?.categories;
          // * mapping the categories
          const categoriesData = Object.values(memoRizedCats).flatMap(
            (category) => category.categories
          );
          //  * checking if the ids of the categories match to the selected report and sorting them by type to their right location of the state
          newCheckboxStatus = categoriesData.reduce(
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
          // * checking if the report parameters match to their state true / false
          newSwitchStates = {
            haveFineSwitch:
              selectedReport.getData("haveFine") == 0 ? false : true,
            haveAmountOfItemsSwitch:
              selectedReport.getData("haveAmountOfItems") == 0 ? false : true,
            haveSafetyGradeSwitch:
              selectedReport.getData("haveSafetyGrade") == 0 ? false : true,
            haveCulinaryGradeSwitch:
              selectedReport.getData("haveCulinaryGrade") == 0 ? false : true,
            haveNutritionGradeSwitch:
              selectedReport.getData("haveNutritionGrade") == 0 ? false : true,
            haveCategoriesNameForCriticalItemsSwitch:
              selectedReport.getData("haveCategoriesNameForCriticalItems") == 0
                ? false
                : true,
          };

          setCheckboxStatus(newCheckboxStatus);
          setSwitchStates(newSwitchStates);
          setAccompanySelected(selectedReport.getData("accompany"));
        } else {
          setSwitchStates(newSwitchStates);
        }
      }
    }
    setIsLoading(false);
  }, 300);
  console.log("isLoading:", isLoading);
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
              selectOptions={currentClient.getStations()}
              name={"station"}
              errorMessage={errors.station && errors.station.message}
              onChange={(value) => {
                handleFormChange("station", value.id);
                setSelectedStation(value.id);
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
              id={"haveAmountOfItemsSwitch"}
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
              id={"haveSafetyGradeSwitch"}
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
              id={"haveCulinaryGradeSwitch"}
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
              id={"haveNutritionGradeSwitch"}
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
              id={"haveCategoriesNameForCriticalItemsSwitch"}
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
                label={accompanySelected ? accompanySelected : "מלווה"}
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
              name={"date"}
              errorMessage={errors.date && errors.date.message}
              onchange={(value) => {
                handleFormChange("date", value);
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
              selectOptions={reportsTimes}
              name={"reportTime"}
              errorMessage={errors.station && errors.station.message}
              onChange={(value) => {
                handleFormChange("reportTime", value);
                console.log("reportTime:", value);
              }}
              propertyName={"name"}
              returnObject={true}
              // selectMenuStyling={{ marginBottom: 16 }}
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
      // toggleHandler: () => resetCategoryAccordionHeight,
      accordionCloseIndicator: accordionCloseIcon,
      accordionOpenIndicator: accordionOpenIcon,
      contentItemStyling: styles.contentBoxCategories,
      scrollEnabled: true,

      accordionContentData: [
        {
          id: 0,
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
          id: 1,
          boxItem: (
            <Accordion
              headerText={`${
                memoizedCategories &&
                memoizedCategories.categories &&
                memoizedCategories.categories[2].name
              } (נבחרו  ${getCheckedCount("culinaryReviewCb")} דוחות)`}
              contentHeight={336}
              headerHeight={50}
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
                memoizedCategories.categories[3].name
              } (נבחרו  ${getCheckedCount("nutritionReviewCb")} דוחות)`}
              contentHeight={336}
              headerHeight={50}
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
                    placeholder="פה יכתב תמצית הדוח באופן אוטומטי או ידני או משולב בהתאם לבחירת הסוקר"
                    // customCSS={`body { direction: ltr; text-align: left; color: ${selectedColor}; }`}
                    editorInitializedCallback={() =>
                      console.log("Editor is initialized")
                    }
                    shouldStartLoadWithRequest={(request) =>
                      request.url.startsWith("https://www.example.com")
                    }
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
    />
  );
  // if (isLoading) {
  //   return <Loader visible={isLoading} />;
  // }

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
          onPress={() => {
            // setIsLoading(true);
            console.log("new report");
            // Simulate a delay with setTimeout
            // setTimeout(() => {
            //   setIsLoading(false);
            // }, 2000);
          }}
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
