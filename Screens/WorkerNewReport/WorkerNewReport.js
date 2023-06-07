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
const WorkerNewReport = () => {
  const clients = useSelector((state) => state.clients);
  const { navigateTogoBack } = useScreenNavigator();
  const [isSchemaValid, setIsSchemaValid] = useState(false);
  const [formData, setFormData] = useState({});
  const [switchStates, setSwitchStates] = useState({
    switch1: false,
    switch2: false,
    switch3: false,
    switch4: false,
    switch5: false,
    switch6: false,
  });

  const schema = yup.object().shape({
    station: yup.string().required("station is required"),
    reportLocation: yup.string().required("station is required"),
    accompany: yup.string().required("accompany is required"),
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
              selectOptions={[1, 2, 3, 4, 5, 6, 7]}
              name={"station"}
              errorMessage={errors.station && errors.station.message}
              onChange={(value) => {
                // handleFormChange("station", value);
                console.log(value);
              }}
              // propertyName="company"
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
              selectOptions={[1, 2, 3, 4, 5, 6, 7]}
              name={"reportLocation"}
              errorMessage={
                errors.reportLocation && errors.reportLocation.message
              }
              onChange={(value) => {
                // handleFormChange("station", value);
                console.log(value);
              }}
              // propertyName="company"
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
            <View style={{ justifyContent: "flex-end" }}>
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
        { id: 9, text: "תאריך ביקורת", boxItem: <Text>off</Text> },
        { id: 10, text: "זמן הביקורת", boxItem: <Text>off</Text> },
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
        <Text style={styles.header}>יצירת דוח חדש עבור בנק הפועלים</Text>
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
