import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  Platform,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import ScreenWrapper from "../../../../../utiles/ScreenWrapper";
import GoBackNavigator from "../../../../../utiles/GoBackNavigator";
import Header from "../../../../../Components/ui/Header";
import { LinearGradient } from "expo-linear-gradient";
import Drawer from "../../../../../Components/ui/Drawer";
import FileIcon from "../../../../../assets/icons/iconImgs/FileIcon.png";
import colors from "../../../../../styles/colors";
import fonts from "../../../../../styles/fonts";
import SummaryAndNote from "../innerComponents/SummaryAndNote";
import Button from "../../../../../Components/ui/Button";
import { FlatList } from "react-native-gesture-handler";
import ButtonGroup from "./ButtonGroupNew";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import ReportCard from "./ReportCard";
import { useSelector } from "react-redux";
import { HelperText } from "react-native-paper";
const windowWidth = Dimensions.get("window").width;
const SummeryScreen = () => {
  const currentReport = useSelector(
    (state) => state.currentReport.currentReport
  );
  const categoriesToPassSummeryScreen = useSelector((state) => state.summary);
  const foodSafety = categoriesToPassSummeryScreen[0];
  const nutritionGrade = categoriesToPassSummeryScreen[1];
  const culinaryGrade = categoriesToPassSummeryScreen[2];
  const reportGrade = categoriesToPassSummeryScreen[3];
  const file1 = currentReport.getData("file1");
  const file2 = currentReport.getData("file2");
  const positiveFeedback = currentReport.getData("positiveFeedback");
  // console.log("current Report:", file1, file2, positiveFeedback);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [summaryFormData, setsummaryFormData] = useState([]);
  const [isSchemaValid, setIsSchemaValid] = useState(false);

  const drawerRef = useRef();
  const schema = yup.object().shape({
    clientStationId: yup.string().required("station is required"),
    file1: yup.string().required("previous report is required"),
    file2: yup.string().required("accompany is required"),
    positiveFeedback: yup.string().required("positiveFeedback is required"),
    cameraPhoto: yup.string(),
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

  //   ? drawer logic
  // * Drawer
  const handleDrawerToggle = (isOpen) => {
    setIsDrawerOpen(isOpen);
  };

  const closeDrawer = () => {
    if (drawerRef.current) {
      drawerRef.current.closeDrawer();
      setIsDrawerOpen(false);
    }
  };
  // handling the form changes
  const handleFormChange = (name, value) => {
    // setFormData({ ...summaryFormData, [name]: value });
    setIsSchemaValid(true);
  };
  // todo list
  // * positive feedback coming from current report
  // * file1 and file2 current report to use expo document picker you have to choose only one choice or pick image or take pic ect...
  // * grades coming from the grades from edit report
  //*  send to manger button will send the form with all the info as a request
  // * summery and nots drawer its the same info coming from the edit report

  return (
    <ScreenWrapper edges={[]} wrapperStyle={{}}>
      <GoBackNavigator
        text={"חזרה לרשימת הלקוחות"}
        containerStyling={{ marginTop: 16 }}
      />
      <View>
        <Header
          HeaderText={"מסך סיכום"}
          containerStyling={{ marginTop: 27.5, marginBottom: 23.5 }}
          iconList={true}
          onCategoriesIconPress={() => console.log("categories pressed")}
        />
      </View>
      <View style={{ flex: 1 }}>
        <SummaryAndNote
          header={"פידבק חיובי"}
          height={160}
          verticalSpace={16}
          summaryAndNoteContent={
            <Controller
              control={control}
              name="positiveFeedback"
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <>
                  <Text>{positiveFeedback}</Text>
                  <HelperText type="error">{error?.message}</HelperText>
                </>
              )}
            ></Controller>
          }
        />

        <View style={{}}>
          <ButtonGroup
            headerText={"העלאת קבצים 1"}
            // firstButtonFunc={() => {
            //   console.log("button 2 pressed");
            // }}
            handleFormChange={handleFormChange}
            errors={errors}
          />
          <ButtonGroup
            headerText={"העלאת קבצים 2"}
            // firstButtonFunc={() => {
            //   console.log("button 4 pressed");
            // }}
            handleFormChange={handleFormChange}
            errors={errors}
          />
        </View>

        <SummaryAndNote
          header={"ציונים בדוח"}
          height={248}
          verticalSpace={16}
          summaryAndNoteContent={
            <ReportCard
              fsGrade={foodSafety}
              cGrade={culinaryGrade}
              nGrade={nutritionGrade}
              reportGrade={reportGrade}
            />
          }
        />
        <TouchableOpacity
          onPress={() => {
            console.log(" נשלח למנהל");
          }}
          style={styles.sendToManagerButton}
        >
          <LinearGradient
            colors={["#5368B4", "#2A3E8B"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientBackground}
          >
            <Text style={styles.sendToManagerButtonText}>שלח לאישור מנהל</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <SafeAreaView
        style={{
          // flex: 1,
          width: windowWidth,
          marginBottom: Platform.OS === "ios" ? 50 : 100,
          alignSelf: "center",
        }}
      >
        <Drawer
          ref={drawerRef}
          closeDrawer={closeDrawer}
          content={
            <LinearGradient
              colors={["#37549D", "#26489F"]}
              start={[0, 0]}
              end={[1, 0]}
              style={{
                width: "100%",
                padding: 16,
                height: 76,
                zIndex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                  textAlign: "center",
                  width: "40%",

                  gap: 12,
                }}
              >
                <Image source={FileIcon} style={{ width: 24, height: 24 }} />
                <Text
                  style={{
                    justifyContent: "center",
                    alignSelf: "center",
                    color: colors.white,
                    fontSize: 24,
                    fontFamily: fonts.ABold,
                  }}
                >
                  תמצית והערות
                </Text>
              </View>
            </LinearGradient>
          }
          height={0}
          onToggle={handleDrawerToggle}
          contentStyling={{ padding: 0 }}
        />
      </SafeAreaView>
    </ScreenWrapper>
  );
};

export default SummeryScreen;

const styles = StyleSheet.create({
  sendToManagerButton: {
    // height: 48,
    justifyContent: "center",
    alignItems: "center",

    alignSelf: "center",
    elevation: 5,
    shadowColor: "rgba(181, 195, 245, 0.91)",
    shadowOffset: { width: 0, height: 7 },
    shadowRadius: 8,
  },
  sendToManagerButtonText: {
    color: "white",
    fontFamily: fonts.ABold,
    fontSize: 24,
  },
  gradientBackground: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 8,
    width: 537,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});
