import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Image,
  ScrollView,
  Switch,
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
import { ColorPicker } from "react-native-color-picker";
import Expander from "../../Components/ui/Expander";
import accordionCloseIcon from "../../assets/imgs/accordionCloseIndicator.png";
import accordionOpenIcon from "../../assets/imgs/accordionOpenIndicator.png";
import ClientItemArrow from "../../assets/imgs/ClientItemArrow.png";
import ClientItemArrowOpen from "../../assets/imgs/accodionOpenIndicatorBlack.png";
import onDragIcon from "../../assets/imgs/onDragIcon.png";
import Checkbox from "../../Components/ui/Checkbox";
import { debounce, get } from "lodash";
import FetchDataService from "../../Services/FetchDataService";
import "@env";
import axios from "axios";
import { fetchCategories } from "../../store/redux/reducers/categoriesSlice";
import CheckboxItem from "./CheckboxItem/CheckboxItem";
const WorkerNewReport = () => {
  const richText = useRef();
  const dispatch = useDispatch();

  const clients = useSelector((state) => state.clients);
  const categories = useSelector((state) => state.categories);
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
    foodSafetyReviewCbStatus: {
      foodSafetyReviewCb1: false,
      foodSafetyReviewCb2: false,
      foodSafetyReviewCb3: false,
      foodSafetyReviewCb4: false,
      foodSafetyReviewCb5: false,
      foodSafetyReviewCb6: false,
      foodSafetyReviewCb7: false,
      foodSafetyReviewCb8: false,
      foodSafetyReviewCb9: false,
      foodSafetyReviewCb10: false,
      foodSafetyReviewCb11: false,
    },
    culinaryReviewCbStatus: {
      culinaryReviewCb1: false,
      culinaryReviewCb2: false,
      culinaryReviewCb3: false,
      culinaryReviewCb4: false,
      culinaryReviewCb5: false,
      culinaryReviewCb6: false,
      culinaryReviewCb7: false,
      culinaryReviewCb8: false,
      culinaryReviewCb9: false,
      culinaryReviewCb10: false,
      culinaryReviewCb11: false,
      culinaryReviewCb12: false,
      culinaryReviewCb13: false,
      culinaryReviewCb14: false,
      culinaryReviewCb15: false,
    },
    nutritionReviewCbStatus: {
      nutritionReviewCb1: false,
      nutritionReviewCb2: false,
      nutritionReviewCb3: false,
      nutritionReviewCb4: false,
    },
  });

  const [selectedStation, setSelectedStation] = useState(null);
  const [accompanySelected, setAccompanySelected] = useState(null);
  const [categoryAccordionHeight, setCategoryAccordionHeight] = useState(172);
  const [switchStates, setSwitchStates] = useState({
    switch1: false,
    switch2: false,
    switch3: false,
    switch4: false,
    switch5: false,
    switch6: false,
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
  }, [dispatch]);

  const memoizedCategories = useMemo(() => categories, [categories]);
  // newGeneralCommentTopText change handler
  const handleContentChange = debounce((content) => {
    console.log(content);
  }, 300);

  //  ! to refactor the checkbox and make the changes react to the state .
  // todo 2 : make the checkboxs status change based on the report that being selected
  // todo 3 : relay on the selected report prop "catergorys" array,concidering the ids of the...
  // todo 3.1: ...categorys that in the selected report and display it in the accordion
  // todo 4 : save all the changes in one place.
  // ? categories checkboxes logic start

  // * categories checkboxes Texts
  const foodSafetyReviewTexts =
    memoizedCategories?.categories?.[1]?.categories ?? [];
  const culinaryReviewTexts =
    memoizedCategories?.categories?.[2]?.categories ?? [];
  const nutritionReviewTexts =
    memoizedCategories?.categories?.[3]?.categories ?? [];

  //  checkbox handler
  // * check if the number of the categories is include in the array
  const getUpdatedCategoryStatus = (categoryName, indices) => {
    let categoryStatus = {};

    // Determine the number of checkboxes based on the category name
    let numCheckboxes;
    switch (categoryName) {
      case "foodSafetyReview":
        numCheckboxes = 11;
        break;
      case "culinaryReview":
        numCheckboxes = 15;
        break;
      case "nutritionReview":
        numCheckboxes = 4;
        break;
      default:
        numCheckboxes = 0;
    }

    // Loop from 1 to the number of checkboxes for this category
    for (let i = 1; i <= numCheckboxes; i++) {
      categoryStatus[`${categoryName}Cb${i}`] = indices.includes(i);
    }

    return categoryStatus;
  };

  // * update the checkboxStatuses state based on the location of the array of categories
  const updateCheckboxStatus = (checkboxIndices) => {
    setCheckboxStatus({
      foodSafetyReviewCbStatus: getUpdatedCategoryStatus(
        "foodSafetyReview",
        checkboxIndices[0]
      ),
      culinaryReviewCbStatus: getUpdatedCategoryStatus(
        "culinaryReview",
        checkboxIndices[1]
      ),
      nutritionReviewCbStatus: getUpdatedCategoryStatus(
        "nutritionReview",
        checkboxIndices[2]
      ),
    });
  };
  // get the array of categories from the report and updates the state
  useEffect(() => {
    const categoriesReports = currentClient
      .getReports()
      .map((report) => report.getData("categorys"));

    const convertToArrayOfNumbers = categoriesReports.map((str) =>
      str
        .split("|")
        .filter(Boolean)
        .map((item) => parseInt(item.replace(";", ""), 10))
    );
    function convertStringsToNumbers(stringsArray) {
      return stringsArray.map(Number);
    }
    console.log(
      convertStringsToNumbers(foodSafetyReviewTexts.map((item) => item.id))
    );

    // todo to filter the foodSafetyReview categories ids to the current report categories ids
    // todo make the checkbox checked
    // todo 2 : to make sure the checkbox in the selected report make the checkbox change reactively

    updateCheckboxStatus(convertToArrayOfNumbers);
  }, [currentClient]);

  function compareArrays(array1, array2, action) {
    // Loop through the first array
    for (let i = 0; i < array1.length; i++) {
      // Check if the current item is in the second array
      if (array2.includes(array1[i])) {
        // If the item is in both arrays, execute the action function
        action(array1[i]);
      }
    }
  }

  const handleCheckboxToggle = (category, checked, label) => {
    setCheckboxStatus((prevStatus) => {
      const updatedCategoryStatus = { ...prevStatus[category] };
      updatedCategoryStatus[label] = checked;

      return { ...prevStatus, [category]: updatedCategoryStatus };
    });
  };
  // inner accordionCategoriesItem
  function accordionCategoriesItem(names, categoryName) {
    return names.map((item, index) => {
      const checkboxKey = `${categoryName}${index + 1}`;
      const categoryStatus = checkboxStatus[`${categoryName}Status`];
      const checkboxValue = categoryStatus
        ? categoryStatus[checkboxKey]
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
              handleCheckboxToggle(
                `${categoryName}Status`,
                checked,
                checkboxKey
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
    return Object.values(checkboxStatus[category]).filter(
      (value) => value === true
    ).length;
  };
  // ! categories checkboxes logic end

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

  // toggle switch function
  const toggleSwitch = (id) => {
    setSwitchStates((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  // * report onchange handler function
  const handleFormChange = debounce((name, value) => {
    setFormData({ ...formData, [name]: value });
    setIsSchemaValid(true);

    // Update switch states based on the selected option
    if (name === "previousReports") {
      if (value === "דוח חדש") {
        // Reset switch states if "דוח חדש" is selected
        setSwitchStates({
          switch1: false,
          switch2: false,
          switch3: false,
          switch4: false,
          switch5: false,
          switch6: false,
        });
      } else {
        const selectedReport = filteredStationsResult.find(
          (report) => report.getData("timeOfReport") === value
        );
        // console.log(selectedReport.getData("accompany"));
        if (selectedReport) {
          setSwitchStates({
            switch1: selectedReport.getData("haveFine") == 0 ? false : true,
            switch2:
              selectedReport.getData("haveAmountOfItems") == 0 ? false : true,
            switch3:
              selectedReport.getData("haveSafetyGrade") == 0 ? false : true,
            switch4:
              selectedReport.getData("haveCulinaryGrade") == 0 ? false : true,
            switch5:
              selectedReport.getData("haveNutritionGrade") == 0 ? false : true,
            switch6:
              selectedReport.getData("haveCategoriesNameForCriticalItems") == 0
                ? false
                : true,
          });
          setAccompanySelected(selectedReport.getData("accompany"));
        } else {
          // Reset switch states if no report is selected
          setSwitchStates({
            switch1: false,
            switch2: false,
            switch3: false,
            switch4: false,
            switch5: false,
            switch6: false,
          });
        }
      }
    }
  }, 300);

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
              id={"switch1"}
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
              id={"switch2"}
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
              id={"switch3"}
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
              id={"switch4"}
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
              id={"switch5"}
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
              id={"switch6"}
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
              selectOptions={selectOptions}
              name={"reportTime"}
              errorMessage={errors.station && errors.station.message}
              onChange={(value) => {
                handleFormChange("reportTime", value);
                console.log("reportTime:", value);
              }}
              propertyName={false}
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
              } (נבחרו ${getCheckedCount("foodSafetyReviewCbStatus")} דוחות)`}
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
              } (נבחרו ${getCheckedCount("culinaryReviewCbStatus")} דוחות)`}
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
              } (נבחרו ${getCheckedCount("nutritionReviewCbStatus")}  דוחות)`}
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
      contentHeight: 325,
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
              }}
            >
              <View
                style={{
                  backgroundColor: "#D3E0FF",
                  width: "100%",
                  alignItems: "flex-start",
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
                    "custom", // Add a custom action
                  ]}
                  // onPressAddImage={onPressAddImage}
                  // onAction={onAction}
                  // iconMap={{
                  //   custom: ({ selected }) => (
                  //     <ColorPicker
                  //       onColorSelected={(color) =>
                  //         richText.current?.setEditorStyle({ color })
                  //       }
                  //       style={{ width: 150, height: 150 }}
                  //     />
                  //   ),
                  // }}
                />
              </View>
              <RichEditor
                ref={richText}
                placeholder="פה יכתב תמצית הדוח באופן אוטומטי או ידני או משולב בהתאם לבחירת הסוקר"
                customCSS={"body { text-<Text>align: right;  direction: rtl; }"}
                editorInitializedCallback={() =>
                  console.log("Editor is initialized")
                }
                shouldStartLoadWithRequest={(request) => {
                  // Only allow navigating within this website
                  return request.url.startsWith("https://www.example.com");
                }}
                onChange={handleContentChange}
              />
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
            console.log("new report");
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
