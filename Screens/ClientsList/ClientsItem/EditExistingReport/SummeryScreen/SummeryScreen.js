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
import Input from "../../../../../Components/ui/Input";
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
  const [SummeryForm, setSummeryForm] = useState({});
  const [isSchemaValid, setIsSchemaValid] = useState(false);
  const drawerRef = useRef();
  const inputRef = useRef();

  const schema = yup.object().shape({
    positiveFeedback: yup.string().required("positiveFeedback is required"),
    // file1: yup.string().required("file1 is required"),
    // file2: yup.string().required("file2 is required"),
    imagePicked: yup.string(),
    imagePicked2: yup.string(),
    cameraPhoto: yup.string(),
    cameraPhoto2: yup.string(),
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
    setSummeryForm((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    console.log("summaryFormData", SummeryForm);
    setIsSchemaValid(true);
    console.log("isschemaValid", isSchemaValid);
  };

  useEffect(() => {
    schema
      .validate(SummeryForm)
      .then(() => setIsSchemaValid(true))
      .catch((err) => {
        console.log("err:", err);
        setIsSchemaValid(false);
      });
  }, [SummeryForm, schema]);

  const sendForManagerApproval = () => {
    console.log(" נשלח למנהל");
    console.log("SummeryForm:", SummeryForm);
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
            <>
              <Input
                name="positiveFeedback"
                control={control}
                proxyRef={inputRef}
                activeOutlineColor={"grey"}
                outlineColor={"grey"}
                mode={"outlined"}
                inputStyle={{
                  backgroundColor: "transparent",
                  // height: 160,
                  // bor: 0,
                }}
                onChangeFunction={(value) => {
                  handleFormChange("positiveFeedback", value);
                }}
                defaultValue={positiveFeedback == "" ? "hello" : "bye"} // test
              />
              {/* <HelperText type="error">
                {errors.positiveFeedback && errors.positiveFeedback.message}
              </HelperText> */}
            </>
          }
        />

        <View style={{}}>
          <ButtonGroup
            control={control}
            headerText={"העלאת קבצים 1"}
            handleFormChange={handleFormChange}
            errors={errors}
            onImagePickChange={(value) =>
              handleFormChange("imagePicked", value)
            }
            fileUploadErrMsg={errors.file1 && errors.file1.message}
            // uploadImageErrorMsg={
            //   errors.imagePicked && errors.imagePicked.message
            // }
            fileName={"imagePicked"}
            imageCaptureErrMsg={
              errors.cameraPhoto && errors.cameraPhoto.message
            }
            fileField={"file1"}
            imagePickedField={"imagePicked"}
            cameraPhotoField={"cameraPhoto"}
          />
          <ButtonGroup
            control={control}
            headerText={"העלאת קבצים 2"}
            handleFormChange={handleFormChange}
            onImagePickChange={(value) =>
              handleFormChange("imagePicked2", value)
            }
            errors={errors}
            fileUploadErrMsg={errors.file2 && errors.file2.message}
            // uploadImageErrorMsg={
            //   errors.imagePicked2 && errors.imagePicked2.message
            // }
            fileName={"imagePicked2"}
            imageCaptureErrMsg={
              errors.cameraPhoto2 && errors.cameraPhoto2.message
            }
            fileField={"file2"}
            imagePickedField={"imagePicked2"}
            cameraPhotoField={"cameraPhoto2"}
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
            handleSubmit(sendForManagerApproval());
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
