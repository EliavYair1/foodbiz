import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  Platform,
  Dimensions,
  TouchableOpacity,
  Alert,
  TextInput,
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
import Loader from "../../../../../utiles/Loader";
import ModalUi from "../../../../../Components/ui/ModalUi";
import { setIndex } from "../../../../../store/redux/reducers/indexSlice";
import routes from "../../../../../Navigation/routes";
import * as WebBrowser from "expo-web-browser";
import Icon from "react-native-vector-icons/MaterialIcons";
const windowWidth = Dimensions.get("window").width;
const SummeryScreen = () => {
  const { navigateTogoBack, navigateToRoute } = useScreenNavigator();
  // todo and a loading till end of the upload , in addition clicking the link will open the file as image view(same as the eye icon).
  const dispatch = useDispatch();
  const currentReport = useSelector(
    (state) => state.currentReport.currentReport
  );

  const categoriesToPassSummeryScreen = useSelector((state) => state.summary);
  const globalCategories = useSelector((state) => state.globalCategories);
  const userId = useSelector((state) => state.user);
  const positiveFeedback = currentReport.getData("positiveFeedback");
  // const categoryNames = categoriesToPassSummeryScreen[1]?.categoryNames || null;
  console.log("SummeryScreen im here......");
  const categoryNames = useSelector(
    (state) => state.summary.categoryNamesSubHeaders
  );
  const majorCategoryHeaders = useSelector(
    (state) => state.summary.majorCategoryHeaders
  );

  // console.log("categoryNames", categoryNames[1]);
  // console.log(categoriesToPassSummeryScreen);
  const currentCategories = useSelector((state) => state.currentCategories);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [SummeryForm, setSummeryForm] = useState({});
  const [isSchemaValid, setIsSchemaValid] = useState(false);
  const drawerRef = useRef();
  const inputRef = useRef();
  const [content, setContent] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const { saveReport, isLoading } = useSaveReport();
  const memoizedCategories = useMemo(
    () => globalCategories,
    [globalCategories]
  );

  const schema = yup.object().shape({
    positiveFeedback: yup.string().required("Positive feedback is required"),
    file1: yup.string().required("File 1 is required"),
    file2: yup.string().required("File 2 is required"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  useEffect(() => {
    schema
      .validate(SummeryForm)
      .then(() => setIsSchemaValid(true))
      .catch((err) => {
        console.log("err:", err);
        setIsSchemaValid(false);
      });
  }, [SummeryForm, schema]);

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

  const handleSaveReport = async () => {
    const bodyFormData = new FormData();
    bodyFormData.append("id", currentReport.getData("id"));
    bodyFormData.append("workerId", currentReport.getData("workerId"));
    bodyFormData.append("clientId", currentReport.getData("clientId"));
    bodyFormData.append("status", 2);
    bodyFormData.append(
      "newGeneralCommentTopText",
      SummeryForm.newGeneralCommentTopText
    );
    bodyFormData.append("newCategorys", currentReport.getData("categorys"));
    bodyFormData.append("positiveFeedback", SummeryForm.positiveFeedback);
    bodyFormData.append("file1", SummeryForm.file1);
    bodyFormData.append("file2", SummeryForm.file2);
    bodyFormData.append("data", []);

    const reportSaved = await saveReport(bodyFormData);
    if (reportSaved) {
      currentReport.setData("status", 2);
      currentReport.setData("positiveFeedback", SummeryForm.positiveFeedback);
      currentReport.setData("file1", SummeryForm.file1);
      currentReport.setData("file2", SummeryForm.file2);
      dispatch(setCurrentReport(currentReport));
      // console.log("[SummeryScreen]response:", reportSaved);
      console.log("summery sent successfully...");
    }
  };
  // * categories picker close function
  const handleModalClose = () => {
    setModalVisible(false);
  };
  let categoriesModal = [];

  if (categoryNames[1].length > 0) {
    categoriesModal.push({
      subheader: "ביקורת בטיחות מזון",
      options: categoryNames[1],
    });
  }
  if (categoryNames[2].length > 0) {
    categoriesModal.push({
      subheader: "ביקורת קולינארית",
      options: categoryNames[2],
    });
  }
  if (categoryNames[3].length > 0) {
    categoriesModal.push({
      subheader: "ביקורת תזונה",
      options: categoryNames[3],
    });
  }
  // * modal pick handler
  const handleOptionClick = (option) => {
    const indexOfCategory = currentCategories.categories.findIndex(
      (category) => category == option
    );
    dispatch(setIndex(indexOfCategory));
    handleModalClose();
    navigateToRoute(routes.ONBOARDING.CategoryEdit);
  };

  const sendForManagerApproval = async () => {
    console.log("isSchemaValid:", isSchemaValid);
    if (isSchemaValid) {
      console.log("SummeryForm:", SummeryForm);
      console.log("scheme is valid");
      try {
        await handleSaveReport();
        console.log("success sending information for manager approval");
      } catch (error) {
        console.error("Error sending for manager approval:", error);
      }
    }
  };
  // console.log("errors", errors);
  // console.log("fileName1", fileName1);
  // console.log("fileName2", fileName2);
  // console.log("errors", errors);
  return (
    <ScreenWrapper edges={[]} wrapperStyle={{}}>
      <GoBackNavigator
        text={"חזרה לרשימת הלקוחות"}
        containerStyling={{ marginTop: 16 }}
        onBackPress={async () => {
          // await handleSaveReport();
          console.log("backkk up");
        }}
      />
      <View>
        <Header
          HeaderText={"מסך סיכום"}
          containerStyling={{ marginTop: 27.5, marginBottom: 23.5 }}
          iconList={true}
          onCategoriesIconPress={() => setModalVisible(true)}
          onSummeryIconPress={() => {
            console.log("you are currently in the summary screen");
          }}
        />
      </View>
      {isLoading ? (
        <Loader visible={isLoading} isSetting={false} />
      ) : (
        <View style={{ flex: 1 }}>
          <SummaryAndNote
            header={"פידבק חיובי"}
            height={160}
            verticalSpace={0}
            summaryAndNoteContent={
              <>
                <Input
                  proxyRef={inputRef}
                  name={"positiveFeedback"}
                  control={control}
                  activeOutlineColor={"grey"}
                  outlineColor={"grey"}
                  mode={"outlined"}
                  rules={{
                    required: "positiveFeedback is required",
                  }}
                  inputStyle={{
                    backgroundColor: "transparent",
                    height: 150,
                  }}
                  onChangeFunction={(value) => {
                    handleFormChange("positiveFeedback", value);
                  }}
                  defaultValue={positiveFeedback ?? ""}
                  // label={positiveFeedback}
                  errMsg={
                    errors.positiveFeedback && errors.positiveFeedback.message
                  }
                />
              </>
            }
          />
          {errors.positiveFeedback && (
            <HelperText type="error">
              {errors.positiveFeedback.message}
            </HelperText>
          )}
          <View style={{}}>
            <ButtonGroup
              control={control}
              headerText={"העלאת קבצים 1"}
              handleFormChange={handleFormChange}
              errors={errors}
              fileField={"file1"}
              // loading={isLoading}
              handleFileUploadCallback={(value) => {
                // console.log("here", value);
                handleFormChange("file1", value);
              }}
              imagePickedField={"imagePicked"}
              onImagePickChange={(value) => {
                handleFormChange("file1", value);
              }}
              onPhotoCapture={(value) => {
                // console.log(value);
                handleFormChange("file1", value);
              }}
              cameraPhotoField={"cameraPhoto"}
              existingFile={currentReport.getData("file1")}
            />

            <ButtonGroup
              control={control}
              headerText={"העלאת קבצים 2"}
              handleFormChange={handleFormChange}
              imagePickedField={"imagePicked2"}
              errors={errors}
              onImagePickChange={(value) => handleFormChange("file2", value)}
              handleFileUploadCallback={(value) => {
                // console.log("here", value);
                handleFormChange("file2", value);
              }}
              onPhotoCapture={(value) => {
                // console.log(value);
                handleFormChange("file2", value);
              }}
              imageCaptureErrMsg={
                errors.cameraPhoto2 && errors.cameraPhoto2.message
              }
              fileField={"file2"}
              cameraPhotoField={"cameraPhoto2"}
              existingFile={currentReport.getData("file2")}
            />
          </View>

          <SummaryAndNote
            header={"ציונים בדוח"}
            height={248}
            verticalSpace={16}
            summaryAndNoteContent={
              <ReportCard
                fsGrade={currentReport.getData("safetyGrade")}
                cGrade={currentReport.getData("culinaryGrade")}
                nGrade={currentReport.getData("nutritionGrade")}
                reportGrade={currentReport.getData("grade")}
                gradesCondition={majorCategoryHeaders}
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
              <Text style={styles.sendToManagerButtonText}>
                שלח לאישור מנהל
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* test */}
        </View>
      )}
      {modalVisible && (
        <View>
          <ModalUi
            categoryEdit={true}
            header="קטגוריות"
            modalContent={categoriesModal}
            onClose={handleModalClose}
            handleOptionClick={handleOptionClick}
          />
        </View>
      )}
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
          onSetContent={(value) => {
            handleFormChange("newGeneralCommentTopText", value);
            setContent(value);
          }}
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
