import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import SelectMenu from "../../../Components/ui/SelectMenu";
import ToggleSwitch from "../../../Components/ui/ToggleSwitch";
import DatePicker from "../../../Components/ui/datePicker";
import Input from "../../../Components/ui/Input";
import colors from "../../../styles/colors";
import accordionOpenIcon from "../../../assets/imgs/accordionOpenIndicator.png";
import accordionCloseIcon from "../../../assets/imgs/accordionCloseIndicator.png";
import { debounce } from "lodash";
const getSettingsAccordionData = (props) => {
  const {
    handleFormChange,
    handleStationChange,
    handlePreviousReportsChange,
    handleReportTimeChange,
    previousReportsSelectOptions,
    // formData,
    currentReport,
    currentClient,
    reportsTimes,
    switchStates,
    toggleSwitch,
    control,
    getValues,
    errors,
    currentReportTime,
    selectedStation,
  } = props;
  // console.log("getSettingsAccordionData", selectedStation?.company);
  // console.log("getValues", getValues());

  return [
    {
      key: "settings",
      headerText: "הגדרות הדוח",
      contentText: "world",
      contentHeight: 940,
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
              optionsHeight={"auto"}
              defaultText={
                currentReport ? currentReport.getData("station_name") : "בחירה"
              }
              displayedValue={selectedStation?.company}
              // displayedValue={"בחירה"}
              selectMenuStyling={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
              centeredViewStyling={{}}
              selectOptions={currentClient.getStations()}
              name={"clientStationId"}
              errorMessage={
                errors.clientStationId && errors.clientStationId.message
              }
              onChange={handleStationChange}
              propertyName="company"
              // * if the returned value is an object then set to true.
              returnObject={true}
            />
          ),
        },

        {
          id: 1,
          text: <Text>התבסס על דוח קודם</Text>,
          boxItem: (
            <SelectMenu
              control={control}
              selectWidth={240}
              optionsHeight={"auto"}
              defaultText={"בחירה"}
              selectMenuStyling={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
              centeredViewStyling={{}}
              selectOptions={previousReportsSelectOptions}
              name={"previousReports"}
              errorMessage={
                errors.previousReports && errors.previousReports.message
              }
              onChange={handlePreviousReportsChange}
              propertyName="timeOfReport"
            />
          ),
        },
        {
          id: 2,
          text: <Text>יש קנסות</Text>,
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
          text: <Text>להציג כמות סעיפים</Text>,
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
          text: <Text>הצג ציון ביקורת בטיחות מזון</Text>,
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
          text: <Text>הצג ציון ביקורת קולינארית</Text>,
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
          text: <Text>הצג ציון תזונה</Text>,
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
          text: <Text>הצג שמות קטגוריות בתמצית עבור ליקויים קריטיים</Text>,
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
          text: <Text>שם המלווה</Text>,
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
                // label={accompanySelected ? accompanySelected : "ללא  מלווה"}
                // label={null}
                defaultValue={
                  // currentReport
                  //   ? currentReport.getData("accompany")
                  //   : formData.accompany
                  currentReport
                    ? currentReport.getData("accompany")
                    : getValues().accompany
                }
                // placeholder={" "}
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
          text: <Text>תאריך ביקורת</Text>,
          boxItem: (
            <DatePicker
              control={control}
              name={"timeOfReport"}
              errorMessage={errors.timeOfReport && errors.timeOfReport.message}
              onchange={(value) => {
                const date = new Date(value);
                const formattedDate = date.toLocaleDateString("en-GB");
                handleFormChange("timeOfReport", formattedDate);
              }}
              dateInputWidth={240}
              defaultDate={currentReport?.getData("timeOfReport")}
            />
          ),
        },
        {
          id: 10,
          text: <Text>זמן הביקורת</Text>,
          boxItem: (
            <SelectMenu
              control={control}
              selectWidth={240}
              optionsHeight={200}
              defaultText={currentReport ? currentReportTime : "בחירה"}
              displayedValue={currentReportTime}
              selectMenuStyling={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
              selectOptions={reportsTimes}
              name={"reportTime"}
              errorMessage={errors.reportTime && errors.reportTime.message}
              onChange={handleReportTimeChange}
              propertyName={"name"}
              returnObject={true}
            />
          ),
        },
      ],
    },
  ];
};
const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: "#6886D2",
  },
  contentBoxSetting: {
    alignItems: "center",
    height: 80.5,
    paddingHorizontal: 16,
    flex: 1,
    direction: "rtl",
  },
});
export default getSettingsAccordionData;
