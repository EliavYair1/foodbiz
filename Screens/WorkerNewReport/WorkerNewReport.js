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
import React, { useState, useRef, useEffect } from "react";
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
import { useSelector } from "react-redux";
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
const WorkerNewReport = () => {
  const richText = useRef();
  const handleContentChange = (content) => {
    console.log(content);
  };
  const clients = useSelector((state) => state.clients);
  const { navigateTogoBack } = useScreenNavigator();
  // fetching the the current data from spacific client
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
  const selectOptions = reportTimeOptions.map((option, index) => ({
    label: option,
    value: index.toString(),
  }));
  // checkbox on change handler
  const handleCheckboxToggle = (checked, label) => {
    console.log(`${label} checked: ${checked}`);
    // Perform any additional logic here based on the checkbox state
  };

  const [switchStates, setSwitchStates] = useState({
    switch1: false,
    switch2: false,
    switch3: false,
    switch4: false,
    switch5: false,
    switch6: false,
  });
  const [selectedStation, setSelectedStation] = useState(null);
  const [accompanySelected, setAccompanySelected] = useState(null);
  const [categoryAccordionHeight, setCategoryAccordionHeight] = useState(172);
  const changeCategoryAccordionHeight = (height, toggle) => {
    if (toggle) {
      setCategoryAccordionHeight((prev) => prev + height);
    } else {
      setCategoryAccordionHeight((prev) => prev - height);
    }
  };
  useEffect(() => {
    console.log(categoryAccordionHeight);
  }, [categoryAccordionHeight]);
  const filteredStationsResult = currentClient
    .getReports()
    .filter((report) => report.getData("clientStationId") === selectedStation);

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

  // input onchange function
  const handleFormChange = (name, value) => {
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
  };

  // toggle switch function
  const toggleSwitch = (id) => {
    setSwitchStates((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const accordionData = [
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
              headerText="ביקורת בטיחות מזון (נבחור 3 קטגוריות)"
              contentHeight={336}
              headerHeight={50}
              accordionCloseIndicator={ClientItemArrow}
              accordionOpenIndicator={ClientItemArrowOpen}
              toggleHandler={changeCategoryAccordionHeight}
              headerTogglerStyling={{
                backgroundColor: "#D3E0FF",
              }}
              iconDisplay={true}
              boxHeight={56}
              headerTextStyling={{
                color: colors.black,
                fontFamily: fonts.ABold,
              }}
              accordionContentData={[
                {
                  id: 0,
                  text: (
                    <View style={{ flexDirection: "row" }}>
                      <Checkbox
                        onToggle={(checked) =>
                          handleCheckboxToggle(checked, "foodSafetyReviewCb1")
                        }
                        label={"foodSafetyReviewCb1"}
                        checkedColor={colors.black}
                        unCheckedColor={colors.black}
                      />

                      <Text> ניקיון ותחזוקה</Text>
                    </View>
                  ),
                  boxItem: (
                    <Image
                      style={{ width: 9, height: 14 }}
                      source={onDragIcon}
                    />
                  ),
                },
                {
                  id: 1,
                  text: (
                    <View style={{ flexDirection: "row" }}>
                      <Checkbox
                        onToggle={(checked) =>
                          handleCheckboxToggle(checked, "foodSafetyReviewCb2")
                        }
                        label={"foodSafetyReviewCb2"}
                        checkedColor={colors.black}
                        unCheckedColor={colors.black}
                      />
                      <Text> עובדים</Text>
                    </View>
                  ),
                  boxItem: (
                    <Image
                      style={{ width: 9, height: 14 }}
                      source={onDragIcon}
                    />
                  ),
                },
                {
                  id: 2,
                  text: (
                    <View style={{ flexDirection: "row" }}>
                      <Checkbox
                        onToggle={(checked) =>
                          handleCheckboxToggle(checked, "foodSafetyReviewCb3")
                        }
                        label={"foodSafetyReviewCb3"}
                        checkedColor={colors.black}
                        unCheckedColor={colors.black}
                      />
                      <Text> מחסנים וקבלת סחורה</Text>
                    </View>
                  ),
                  boxItem: (
                    <Image
                      style={{ width: 9, height: 14 }}
                      source={onDragIcon}
                    />
                  ),
                },
                {
                  id: 3,
                  text: (
                    <View style={{ flexDirection: "row" }}>
                      <Checkbox
                        onToggle={(checked) =>
                          handleCheckboxToggle(checked, "foodSafetyReviewCb4")
                        }
                        label={"foodSafetyReviewCb4"}
                        checkedColor={colors.black}
                        unCheckedColor={colors.black}
                      />
                      <Text> מערכת קירור</Text>
                    </View>
                  ),
                  boxItem: (
                    <Image
                      style={{ width: 9, height: 14 }}
                      source={onDragIcon}
                    />
                  ),
                },
                {
                  id: 4,
                  text: (
                    <View style={{ flexDirection: "row" }}>
                      <Checkbox
                        onToggle={(checked) =>
                          handleCheckboxToggle(checked, "foodSafetyReviewCb5")
                        }
                        label={"foodSafetyReviewCb5"}
                        checkedColor={colors.black}
                        unCheckedColor={colors.black}
                      />
                      <Text> תהליכי ייצור עיבוד ירקות</Text>
                    </View>
                  ),
                  boxItem: (
                    <Image
                      style={{ width: 9, height: 14 }}
                      source={onDragIcon}
                    />
                  ),
                },
                {
                  id: 5,
                  text: (
                    <View style={{ flexDirection: "row" }}>
                      <Checkbox
                        onToggle={(checked) =>
                          handleCheckboxToggle(checked, "foodSafetyReviewCb6")
                        }
                        label={"foodSafetyReviewCb6"}
                        checkedColor={colors.black}
                        unCheckedColor={colors.black}
                      />
                      <Text> תהליכי ייצור עיבוד בשר</Text>
                    </View>
                  ),
                  boxItem: (
                    <Image
                      style={{ width: 9, height: 14 }}
                      source={onDragIcon}
                    />
                  ),
                },
              ]}
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
              headerText="ביקורת קולינרית (נבחרו 0 דוחות)"
              contentHeight={336}
              headerHeight={50}
              accordionCloseIndicator={ClientItemArrow}
              accordionOpenIndicator={ClientItemArrowOpen}
              toggleHandler={changeCategoryAccordionHeight}
              headerTogglerStyling={{
                ...styles.headerStyle,
                backgroundColor: "#D3E0FF",
              }}
              iconDisplay={true}
              boxHeight={50}
              headerTextStyling={{
                color: colors.black,
                fontFamily: fonts.ABold,
              }}
              accordionContentData={[
                {
                  id: 0,
                  text: (
                    <View style={{ flexDirection: "row" }}>
                      <Checkbox
                        onToggle={(checked) =>
                          handleCheckboxToggle(checked, "culinaryReviewCb1")
                        }
                        label={"culinaryReviewCb1"}
                        checkedColor={colors.black}
                        unCheckedColor={colors.black}
                      />

                      <Text> ניקיון ותחזוקה</Text>
                    </View>
                  ),
                  boxItem: (
                    <Image
                      style={{ width: 9, height: 14 }}
                      source={onDragIcon}
                    />
                  ),
                },
                {
                  id: 1,
                  text: (
                    <View style={{ flexDirection: "row" }}>
                      <Checkbox
                        onToggle={(checked) =>
                          handleCheckboxToggle(checked, "culinaryReviewCb2")
                        }
                        label={"culinaryReviewCb2"}
                        checkedColor={colors.black}
                        unCheckedColor={colors.black}
                      />
                      <Text> עובדים</Text>
                    </View>
                  ),
                  boxItem: (
                    <Image
                      style={{ width: 9, height: 14 }}
                      source={onDragIcon}
                    />
                  ),
                },
                {
                  id: 2,
                  text: (
                    <View style={{ flexDirection: "row" }}>
                      <Checkbox
                        onToggle={(checked) =>
                          handleCheckboxToggle(checked, "culinaryReviewCb3")
                        }
                        label={"culinaryReviewCb3"}
                        checkedColor={colors.black}
                        unCheckedColor={colors.black}
                      />
                      <Text> מחסנים וקבלת סחורה</Text>
                    </View>
                  ),
                  boxItem: (
                    <Image
                      style={{ width: 9, height: 14 }}
                      source={onDragIcon}
                    />
                  ),
                },
                {
                  id: 3,
                  text: (
                    <View style={{ flexDirection: "row" }}>
                      <Checkbox
                        onToggle={(checked) =>
                          handleCheckboxToggle(checked, "culinaryReviewCb4")
                        }
                        label={"culinaryReviewCb4"}
                        checkedColor={colors.black}
                        unCheckedColor={colors.black}
                      />
                      <Text> מערכת קירור</Text>
                    </View>
                  ),
                  boxItem: (
                    <Image
                      style={{ width: 9, height: 14 }}
                      source={onDragIcon}
                    />
                  ),
                },
                {
                  id: 4,
                  text: (
                    <View style={{ flexDirection: "row" }}>
                      <Checkbox
                        onToggle={(checked) =>
                          handleCheckboxToggle(checked, "culinaryReviewCb5")
                        }
                        label={"culinaryReviewCb5"}
                        checkedColor={colors.black}
                        unCheckedColor={colors.black}
                      />
                      <Text> תהליכי ייצור עיבוד ירקות</Text>
                    </View>
                  ),
                  boxItem: (
                    <Image
                      style={{ width: 9, height: 14 }}
                      source={onDragIcon}
                    />
                  ),
                },
                {
                  id: 5,
                  text: (
                    <View style={{ flexDirection: "row" }}>
                      <Checkbox
                        onToggle={(checked) =>
                          handleCheckboxToggle(checked, "culinaryReviewCb6")
                        }
                        label={"culinaryReviewCb6"}
                        checkedColor={colors.black}
                        unCheckedColor={colors.black}
                      />
                      <Text> תהליכי ייצור עיבוד בשר</Text>
                    </View>
                  ),
                  boxItem: (
                    <Image
                      style={{ width: 9, height: 14 }}
                      source={onDragIcon}
                    />
                  ),
                },
              ]}
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
              headerText="ביקורת תזונה (נבחרו 0 דוחות)"
              contentHeight={336}
              headerHeight={50}
              accordionCloseIndicator={ClientItemArrow}
              accordionOpenIndicator={ClientItemArrowOpen}
              toggleHandler={changeCategoryAccordionHeight}
              headerTogglerStyling={{
                ...styles.headerStyle,
                backgroundColor: "#D3E0FF",
              }}
              iconDisplay={true}
              boxHeight={50}
              headerTextStyling={{
                color: colors.black,
                fontFamily: fonts.ABold,
              }}
              accordionContentData={[
                {
                  id: 0,
                  text: (
                    <View style={{ flexDirection: "row" }}>
                      <Checkbox
                        onToggle={(checked) =>
                          handleCheckboxToggle(checked, "nutritionReviewCb1")
                        }
                        label={"nutritionReviewCb1"}
                        checkedColor={colors.black}
                        unCheckedColor={colors.black}
                      />

                      <Text> ניקיון ותחזוקה</Text>
                    </View>
                  ),
                  boxItem: (
                    <Image
                      style={{ width: 9, height: 14 }}
                      source={onDragIcon}
                    />
                  ),
                },
                {
                  id: 1,
                  text: (
                    <View style={{ flexDirection: "row" }}>
                      <Checkbox
                        onToggle={(checked) =>
                          handleCheckboxToggle(checked, "nutritionReviewCb2")
                        }
                        label={"nutritionReviewCb2"}
                        checkedColor={colors.black}
                        unCheckedColor={colors.black}
                      />
                      <Text> עובדים</Text>
                    </View>
                  ),
                  boxItem: (
                    <Image
                      style={{ width: 9, height: 14 }}
                      source={onDragIcon}
                    />
                  ),
                },
                {
                  id: 2,
                  text: (
                    <View style={{ flexDirection: "row" }}>
                      <Checkbox
                        onToggle={(checked) =>
                          handleCheckboxToggle(checked, "nutritionReviewCb3")
                        }
                        label={"nutritionReviewCb3"}
                        checkedColor={colors.black}
                        unCheckedColor={colors.black}
                      />
                      <Text> מחסנים וקבלת סחורה</Text>
                    </View>
                  ),
                  boxItem: (
                    <Image
                      style={{ width: 9, height: 14 }}
                      source={onDragIcon}
                    />
                  ),
                },
                {
                  id: 3,
                  text: (
                    <View style={{ flexDirection: "row" }}>
                      <Checkbox
                        onToggle={(checked) =>
                          handleCheckboxToggle(checked, "nutritionReviewCb4")
                        }
                        label={"nutritionReviewCb4"}
                        checkedColor={colors.black}
                        unCheckedColor={colors.black}
                      />
                      <Text> מערכת קירור</Text>
                    </View>
                  ),
                  boxItem: (
                    <Image
                      style={{ width: 9, height: 14 }}
                      source={onDragIcon}
                    />
                  ),
                },
                {
                  id: 4,
                  text: (
                    <View style={{ flexDirection: "row" }}>
                      <Checkbox
                        onToggle={(checked) =>
                          handleCheckboxToggle(checked, "nutritionReviewCb5")
                        }
                        label={"nutritionReviewCb5"}
                        checkedColor={colors.black}
                        unCheckedColor={colors.black}
                      />
                      <Text> תהליכי ייצור עיבוד ירקות</Text>
                    </View>
                  ),
                  boxItem: (
                    <Image
                      style={{ width: 9, height: 14 }}
                      source={onDragIcon}
                    />
                  ),
                },
                {
                  id: 5,
                  text: (
                    <View style={{ flexDirection: "row" }}>
                      <Checkbox
                        onToggle={(checked) =>
                          handleCheckboxToggle(checked, "nutritionReviewCb6")
                        }
                        label={"nutritionReviewCb6"}
                        checkedColor={colors.black}
                        unCheckedColor={colors.black}
                      />
                      <Text> תהליכי ייצור עיבוד בשר</Text>
                    </View>
                  ),
                  boxItem: (
                    <Image
                      style={{ width: 9, height: 14 }}
                      source={onDragIcon}
                    />
                  ),
                },
              ]}
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
          data={accordionData}
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
