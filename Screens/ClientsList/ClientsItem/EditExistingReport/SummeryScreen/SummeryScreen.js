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
import React, { useEffect, useState, useRef, useMemo } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { HelperText } from "react-native-paper";
import Input from "../../../../../Components/ui/Input";
import SummaryDrawer from "../innerComponents/SummeryDrawer";
import useScreenNavigator from "../../../../../Hooks/useScreenNavigator";
import useSaveReport from "../../../../../Hooks/useSaveReport";
import { setCurrentReport } from "../../../../../store/redux/reducers/getCurrentReport";
const windowWidth = Dimensions.get("window").width;
const SummeryScreen = () => {
  const { navigateTogoBack } = useScreenNavigator();

  const { dispatch } = useDispatch();
  const currentReport = useSelector(
    (state) => state.currentReport.currentReport
  );
  const categoriesToPassSummeryScreen = useSelector((state) => state.summary);
  const globalCategories = useSelector((state) => state.globalCategories);

  const foodSafety =
    categoriesToPassSummeryScreen && categoriesToPassSummeryScreen[0];
  const nutritionGrade =
    categoriesToPassSummeryScreen && categoriesToPassSummeryScreen[1];
  const culinaryGrade =
    categoriesToPassSummeryScreen && categoriesToPassSummeryScreen[2];
  const reportGrade =
    categoriesToPassSummeryScreen && categoriesToPassSummeryScreen[3];
  const file1 = currentReport.getData("file1");
  const file2 = currentReport.getData("file2");
  const positiveFeedback = currentReport.getData("positiveFeedback");
  // console.log("current Report:", file1, file2, positiveFeedback);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [SummeryForm, setSummeryForm] = useState({});
  const [isSchemaValid, setIsSchemaValid] = useState(false);
  const drawerRef = useRef();
  const inputRef = useRef();
  const [content, setContent] = useState("");
  const { saveReport, isLoading } = useSaveReport();
  const memoizedCategories = useMemo(
    () => globalCategories,
    [globalCategories]
  );
  const categoriesDataFromReport = currentReport.getCategoriesData();
  // console.log(currentReport.getData("status"));
  // console.log("categoriesToPassSummeryScreen:", categoriesToPassSummeryScreen);
  // console.log(categoriesToPassSummeryScreen);
  const schema = yup.object().shape({
    positiveFeedback: yup.string().required("positiveFeedback is required"),
    file1: yup.string().required("file1 is required"),
    file2: yup.string().required("file2 is required"),
    imagePicked: yup.string().required("imagePicked is required"),
    imagePicked2: yup.string().required("imagePicked2 is required"),
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
    // console.log("summaryFormData", SummeryForm);
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
  // console.log(currentReport.getData("data"));
  // console.log("categoriesDataFromReport", categoriesDataFromReport);

  const handleSaveReport = async () => {
    const bodyFormData = new FormData();
    bodyFormData.append("id", currentReport.getData("id"));
    bodyFormData.append("workerId", currentReport.getData("workerId"));
    bodyFormData.append("clientId", currentReport.getData("clientId"));
    bodyFormData.append("status", currentReport.getData("status"));
    bodyFormData.append("newCategorys", currentReport.getData("categorys"));
    bodyFormData.append("newGeneralCommentTopText", content);
    bodyFormData.append("data", categoriesDataFromReport);
    const reportSaved = await saveReport(bodyFormData);
    if (reportSaved) {
      currentReport.setData("status", 2);
      currentReport.setData("positiveFeedback", SummeryForm.positiveFeedback);
      currentReport.setData("file1", SummeryForm.file1);
      currentReport.setData("file2", SummeryForm.file2);
      dispatch(setCurrentReport(currentReport));
    }
  };
  const sendForManagerApproval = async () => {
    console.log(" נשלח למנהל");
    console.log("SummeryForm:", SummeryForm);
    console.log("isSchemaValid:", isSchemaValid);
    if (isSchemaValid) {
      console.log("scheme is valid");
      const res = await handleSaveReport();
      console.log("sendForManagerApproval", res);
    }
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
            fileField={"file1"}
            handleFileUploadCallback={(value) => {
              // console.log("here", value);
              handleFormChange("file1", value);
            }}
            imagePickedField={"imagePicked"}
            onImagePickChange={(value) => {
              handleFormChange("imagePicked", value);
            }}
            imageCaptureErrMsg={
              errors.cameraPhoto && errors.cameraPhoto.message
            }
            cameraPhotoField={"cameraPhoto"}
          />
          <ButtonGroup
            control={control}
            headerText={"העלאת קבצים 2"}
            handleFormChange={handleFormChange}
            imagePickedField={"imagePicked2"}
            onImagePickChange={(value) =>
              handleFormChange("imagePicked2", value)
            }
            errors={errors}
            handleFileUploadCallback={(value) => {
              // console.log("here", value);
              handleFormChange("file2", value);
            }}
            // fileUploadErrMsg={errors.file2 && errors.file2.message}
            // uploadImageErrorMsg={
            //   errors.imagePicked2 && errors.imagePicked2.message
            // }
            // fileName={"imagePicked2"}
            imageCaptureErrMsg={
              errors.cameraPhoto2 && errors.cameraPhoto2.message
            }
            fileField={"file2"}
            cameraPhotoField={"cameraPhoto2"}
          />
        </View>

        <SummaryAndNote
          header={"ציונים בדוח"}
          height={248}
          verticalSpace={16}
          summaryAndNoteContent={
            <ReportCard
              fsGrade={currentReport.getData('safetyGrade')}
              cGrade={currentReport.getData('culinaryGrade')}
              nGrade={currentReport.getData('nutritionGrade')}
              reportGrade={currentReport.getData('grade')}
            />
          }
        />
        <TouchableOpacity
          onPress={() => {
            handleSubmit(sendForManagerApproval());
          }}
          style={[
            styles.sendToManagerButton,
            !isSchemaValid && { opacity: 0.6 },
          ]}
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
        <SummaryDrawer
          onPrevCategory={navigateTogoBack}
          prevCategoryText={"לקטגוריה הקודמת"}
          onSetContent={(value) => setContent(value)}
          memoizedCategories={memoizedCategories}
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
