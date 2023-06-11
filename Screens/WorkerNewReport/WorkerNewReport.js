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
import React, { useState } from "react";
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
const WorkerNewReport = () => {
  const clients = useSelector((state) => state.clients);
  const { navigateTogoBack } = useScreenNavigator();
  const [isSchemaValid, setIsSchemaValid] = useState(false);
  const [formData, setFormData] = useState({});
  // fetching the the current data from spacific client
  const currentClient = useSelector(
    (state) => state.currentClient.currentClient
  );
  const [switchStates, setSwitchStates] = useState({
    switch1: false,
    switch2: false,
    switch3: false,
    switch4: false,
    switch5: false,
    switch6: false,
  });
  const [selectedStation, setSelectedStation] = useState(null);
  const filteredStationsResult = currentClient
    .getReports()
    .filter((report) => report.getData("clientStationId") === selectedStation);
  // console.log("filteredStationsResult:", filteredStationsResult);
  // console.log("currentClient : ", currentClient.getData("id"));
  // console.log(filteredStationsResult);
  // currentClient.getReports().map((item) => console.log("item:", item));
  // const report = currentClient
  //   .getReports()
  //   .map((report) => report.getData("haveFine"));
  // console.log("report:", report);
  const schema = yup.object().shape({
    station: yup.string().required("station is required"),
    previousReports: yup.string().required("previousReports is required"),
    accompany: yup.string().required("accompany is required"),
    date: yup.string().required("date is required"),
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
      accordionContentData: [
        {
          id: 0,
          text: "תחנה",
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
          text: "התבסס על דוח קודם",
          boxItem: (
            <SelectMenu
              control={control}
              selectWidth={240}
              selectOptions={[
                // todo : 2. make every input reactive based on timeOfReport selector selected except reportTime &&  timeOfReport(date picker)
                // * list of toggle names by order to react to the timeOfReport selector
                /* 
                1.haveFine
                2.haveAmountOfItems
                3.haveSafetyGrade
                4.haveCulinaryGrade
                5.haveNutritionGrade
                6.haveCategoriesNameForCriticalItems
                */

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
          text: "יש קנסות",
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
          text: "להציג כמות סעיפים",
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
          text: "הצג ציון ביקורת בטיחות מזון",
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
          text: "הצג ציון ביקורת קולינרית",
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
          text: "הצג ציון תזונה",
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
          text: "הצג שמות קטגוריות בתמצית עבור ליקויים קריטיים",
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
          text: "שם המלווה",
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
                label={"מלווה"}
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
          text: "תאריך ביקורת",
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
          text: "זמן הביקורת",
          boxItem: (
            <SelectMenu
              control={control}
              selectWidth={240}
              selectOptions={[1, 2, 3, 4, 5, 6, 7]}
              name={"station"}
              errorMessage={errors.station && errors.station.message}
              onChange={(value) => {
                // handleFormChange("station", value);
                console.log(value);
              }}
              // propertyName="company"
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
      contentHeight: 172,
      headerHeight: 48,
      headerTogglerStyling: styles.headerStyle,
      iconDisplay: true,
      boxHeight: 40.5,
      accordionContentData: [
        { id: 0, text: "hello", boxItem: <Text>get</Text> },
        { id: 1, text: "bitch", boxItem: <Text>real</Text> },
        { id: 2, text: "better", boxItem: <Text>man</Text> },
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
      accordionContentData: [
        { id: 0, text: "hello", boxItem: <Text>get</Text> },
        { id: 1, text: "bitch", boxItem: <Text>real</Text> },
        { id: 2, text: "better", boxItem: <Text>dude</Text> },
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
});
