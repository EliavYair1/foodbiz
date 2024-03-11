import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import SelectMenu from "../../../Components/ui/SelectMenu";
import ToggleSwitch from "../../../Components/ui/ToggleSwitch";
import DatePicker from "../../../Components/ui/datePicker";
import Input from "../../../Components/ui/Input";
import colors from "../../../styles/colors";
import accordionOpenIcon from "../../../assets/imgs/accordionOpenIndicator.png";
import accordionCloseIcon from "../../../assets/imgs/accordionCloseIndicator.png";
import { useSelector } from "react-redux";
const getSettingsAccordionData = (props) => {
  const {
    handleFormChange,
    handlePreviousReportsChange,
    previousReportsSelectOptions,
    currentReport,
    currentClient,
    switchStates,
    toggleSwitch,
    control,
    errors,
    setSelectedStation,
    setSwitchStates,
    getValues,
    selectedStation,
    accompanySelected,
    IsRearrangement,
  } = props;
  const reportsTimes = useSelector((state) => state.reportsTimes.reportsTimes);
  // const [currentReportTime, setCurrentReportTime] = useState(null);

  const findReportTimeName = (data) => {
    // console.log("data", data);
    let reportTimeId;
    if (currentReport) {
      reportTimeId = currentReport?.getReportTime();
    } else {
      reportTimeId = getValues().reportTime;
    }
    const reportTime = data.find((item) => {
      return item.id == reportTimeId;
    });
    return reportTime ? reportTime.name : "בחירה";
  };
  const reportTimeName = findReportTimeName(reportsTimes);

  useEffect(() => {
    // setCurrentReportTime(reportTimeName);

    if (currentReport) {
      const date = new Date(currentReport.getData("timeOfReport"));
      const formattedDate = date.toLocaleDateString("en-GB");
      setSelectedStation(currentReport.getData("station_name"));
      // setCurrentReportTime(reportTimeName);
      console.log("reportTime", currentReport.getData("reportTime"));

      setSwitchStates({
        haveFine: currentReport.getData("haveFine") == "1",
        haveAmountOfItems: currentReport.getData("haveAmountOfItems") == "1",
        haveSafetyGrade: currentReport.getData("haveSafetyGrade") == "1",
        haveCulinaryGrade: currentReport.getData("haveCulinaryGrade") == "1",
        haveNutritionGrade: currentReport.getData("haveNutritionGrade") == "1",
        haveCategoriesNameForCriticalItems:
          currentReport.getData("haveCategoriesNameForCriticalItems") == "1",
      });
      handleFormChange("accompany", currentReport.getData("accompany"));
      // handleFormChange("reportTime", currentReportTime.id);
      handleFormChange("reportTime", currentReport.getData("reportTime"));
      handleFormChange(
        "clientStationId",
        currentReport.getData("clientStationId")
      );
      handleFormChange("timeOfReport", formattedDate);
    }
  }, [currentReport]);
  // console.log("station", currentReport.getData("timeOfReport"));
  // console.log("get values", getValues());
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
              type={"company"}
              defaultText={
                currentReport ? currentReport.getData("station_name") : "בחירה"
                // currentReport ? currentReport.getData("station_name") : "בחירה"
              }
              // displayedValue={stationName}
              // displayedValue={getValues()?.clientStationId ?? "בחירה2"}
              // displayedValue={"yבחירה"}
              selectMenuStyling={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
              centeredViewStyling={{}}
              selectOptions={currentClient.getStations()}
              name={"station_name"}
              // name={"clientStationId"}
              errorMessage={
                errors.clientStationId && errors.clientStationId.message
              }
              // onChange={handleStationChange}
              onChange={(value) => {
                try {
                  console.log("station value:", value);
                  setSelectedStation(value);
                  handleFormChange("clientStationId", value.id);
                } catch (error) {
                  console.log("[handleStationChange]error:", error);
                }
              }}
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
                defaultValue={
                  currentReport ? currentReport.getData("accompany") : ""
                }
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
                console.log("[DatePicker]timeOfReport", formattedDate);
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
              type={"name"}
              // defaultText={
              //   currentReport ? currentReport.getData("reportTime") : "בחירה"
              // }
              defaultText={reportTimeName}
              // displayedValue={currentReportTime}
              // displayedValue={reportTimeName}
              selectMenuStyling={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
              selectOptions={reportsTimes}
              // name={"reportTime"}
              name={"name"}
              errorMessage={errors.reportTime && errors.reportTime.message}
              onChange={(value) => {
                console.log("report time pick:", value);
                // todo need to display the text but to send to post the id of the station
                handleFormChange("reportTime", value.id);
                // setCurrentReportTime(value);
                // console.log("reportTime 01123:", value);
              }}
              propertyName={"name"}
              // propertyName={"reportTime"}
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
