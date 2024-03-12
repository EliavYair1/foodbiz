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
} from "react-native";
import React, { useEffect, useState, useRef, useMemo } from "react";
import ScreenWrapper from "../../../../../utiles/ScreenWrapper";
import GoBackNavigator from "../../../../../utiles/GoBackNavigator";
import Header from "../../../../../Components/ui/Header";
import { LinearGradient } from "expo-linear-gradient";
import fonts from "../../../../../styles/fonts";
import SummaryAndNote from "../innerComponents/SummaryAndNote";
import ButtonGroup from "./ButtonGroup";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import ReportCard from "./ReportCard";
import { useDispatch, useSelector } from "react-redux";
import { HelperText } from "react-native-paper";
import Input from "../../../../../Components/ui/Input";
import SummaryDrawer from "../innerComponents/SummeryDrawer";
import useScreenNavigator from "../../../../../Hooks/useScreenNavigator";
import { setCurrentReport } from "../../../../../store/redux/reducers/getCurrentReport";
import Loader from "../../../../../utiles/Loader";
import ModalUi from "../../../../../Components/ui/ModalUi";
import { setIndex } from "../../../../../store/redux/reducers/indexSlice";
import routes from "../../../../../Navigation/routes";
import useSaveCurrentScreenData from "../../../../../Hooks/useSaveReport";
import FetchDataService from "../../../../../Services/FetchDataService";
const windowWidth = Dimensions.get("window").width;
const SummeryScreen = () => {
  const { navigateToRoute } = useScreenNavigator();
  const dispatch = useDispatch();
  const { fetchData } = FetchDataService();
  const currentReport = useSelector(
    (state) => state.currentReport.currentReport
  );
  const globalCategories = useSelector((state) => state.globalCategories);
  const positiveFeedback = currentReport.getData("positiveFeedback");

  const categoryNames = useSelector(
    (state) => state.summary.categoryNamesSubHeaders
  );

  const majorCategoryHeaders = useSelector(
    (state) => state.summary.majorCategoryHeaders
  );

  const currentCategories = useSelector((state) => state.currentCategories);

  const [SummeryForm, setSummeryForm] = useState({
    positiveFeedback: null,
    file1: null,
    file2: null,
    newGeneralCommentTopText: null,
  });
  console.log("SummeryForm", SummeryForm);

  const [isSchemaValid, setIsSchemaValid] = useState(false);
  const drawerRef = useRef();
  const inputRef = useRef();
  const [content, setContent] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const { saveCurrentScreenData, PostLoading, setPostLoading } =
    useSaveCurrentScreenData();
  const memoizedCategories = useMemo(
    () => globalCategories,
    [globalCategories]
  );

  const schema = yup.object().shape({
    positiveFeedback: yup.string().required("Positive feedback is required"),
    file1: yup.string().required("File 1 is required"),
    file2: yup.string().required("File 2 is required"),
    newGeneralCommentTopText: yup.string(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // handling the form changes
  const handleFormChange = (name, value) => {
    console.log("handleFormChange:", name, value);
    setSummeryForm((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (currentReport) {
      handleFormChange(
        "newGeneralCommentTopText",
        currentReport.getData("newGeneralCommentTopText")
      );
      handleFormChange(
        "positiveFeedback",
        currentReport.getData("positiveFeedback")
      );
      handleFormChange("file1", currentReport.getData("file1"));
      handleFormChange("file2", currentReport.getData("file2"));
    }
  }, []);

  const handleSaveReport = async (navigationRoute, status) => {
    try {
      setPostLoading(true);
      const apiUrl = process.env.API_BASE_URL + "ajax/saveReport.php";

      const bodyFormData = new FormData();
      bodyFormData.append("id", currentReport.getData("id"));
      bodyFormData.append("workerId", currentReport.getData("workerId"));
      bodyFormData.append("clientId", currentReport.getData("clientId"));
      bodyFormData.append("status", status);
      bodyFormData.append(
        "newGeneralCommentTopText",
        SummeryForm.newGeneralCommentTopText
      );
      bodyFormData.append("newCategorys", currentReport.getData("categorys"));
      bodyFormData.append("positiveFeedback", SummeryForm.positiveFeedback);
      bodyFormData.append("file1", SummeryForm.file1);
      bodyFormData.append("file2", SummeryForm.file2);
      bodyFormData.append("data", []);

      const response = await fetchData(apiUrl, bodyFormData);

      // console.log("response", response);

      // const reportSaved = await saveCurrentScreenData(
      //   bodyFormData,
      //   "ajax/saveReport.php",
      //   false,
      //   navigationRoute
      // );
      // console.log("reportSaved", reportSaved);

      if (response.success) {
        setPostLoading(false);
        saveCurrentScreenData(true);
        // if (reportSaved) {
        currentReport.setData("status", status);
        currentReport.setData("positiveFeedback", SummeryForm.positiveFeedback);
        currentReport.setData("file1", SummeryForm.file1);
        currentReport.setData("file2", SummeryForm.file2);
        dispatch(setCurrentReport(currentReport));
        navigateToRoute(navigationRoute);
        console.log("summery sent successfully...");
        return response.data;
      }
    } catch (error) {
      setPostLoading(false);
      console.error("[saveCurrentScreenData]Error making POST request:", error);
    }
  };

  useEffect(() => {
    schema
      .validate(SummeryForm)
      .then((res) => {
        // console.log("[SummeryScreen]validation response:", res);
        setIsSchemaValid(true);
      })
      .catch((err) => {
        console.log("err:", err);
        setIsSchemaValid(false);
      });
  }, [SummeryForm, schema]);

  // todo display error msg's

  // * categories picker close function
  const handleModalClose = () => {
    setModalVisible(false);
  };

  let categoriesModal = [];

  if (categoryNames[1]?.length > 0) {
    categoriesModal.push({
      subheader: "ביקורת בטיחות מזון",
      options: categoryNames[1],
    });
  }
  if (categoryNames[2]?.length > 0) {
    categoriesModal.push({
      subheader: "ביקורת קולינארית",
      options: categoryNames[2],
    });
  }
  if (categoryNames[3]?.length > 0) {
    categoriesModal.push({
      subheader: "ביקורת תזונה",
      options: categoryNames[3],
    });
  }

  // * modal pick handler
  const handleOptionClick = async (option) => {
    const indexOfCategory = currentCategories.categories.findIndex(
      (category) => category == option
    );

    dispatch(setIndex(indexOfCategory));
    await handleSaveReport(
      routes.ONBOARDING.CategoryEdit,
      currentReport.getData("status")
    );
    handleModalClose();
    navigateToRoute(routes.ONBOARDING.CategoryEdit);
  };

  const formatErrors = (formErrors) => {
    const errorFields = Object.keys(formErrors);
    if (errorFields.length === 0) {
      return "No errors found.";
    }

    const errorMessages = errorFields.map((field) => formErrors[field]);
    return `${errorMessages.join(" and ")}`;
  };

  const sendForManagerApproval = async () => {
    const formErrors = {};
    try {
      await schema.validate(SummeryForm, { abortEarly: false });
      console.log("schema is valid");
      await handleSaveReport(routes.ONBOARDING.ClientsList, 1);
      return;
      // Proceed with form submission
      await handleSaveReport(routes.ONBOARDING.ClientsList, 2);
      // navigateToRoute(routes.ONBOARDING.ClientsList);
      // console.log("object");
    } catch (error) {
      if (error.name === "ValidationError") {
        error.inner.forEach((validationError) => {
          formErrors[validationError.path] = validationError.message;
        });

        const formattedErrors = formatErrors(formErrors);

        Alert.alert(
          "Error",
          formattedErrors,
          [
            {
              text: "OK",
              style: "cancel",
            },
          ],
          { cancelable: true }
        );
      } else {
        console.error("Error posting data:", error);
      }
    }
  };

  return (
    <ScreenWrapper edges={[]} wrapperStyle={{}}>
      <GoBackNavigator
        text={"חזרה לרשימת הלקוחות"}
        containerStyling={{ marginTop: 26 }}
        onBackPress={async () => {
          await handleSaveReport(
            routes.ONBOARDING.ClientsList,
            currentReport.getData("status")
          );
          // console.log("backkk up");
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
          onSettingsIconPress={async () => {
            await handleSaveReport(
              routes.ONBOARDING.WorkerNewReport,
              currentReport.getData("status")
            );
          }}
        />
      </View>
      {PostLoading ? (
        <Loader visible={PostLoading} isSetting={false} />
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
                  // rules={{
                  //   required: "positiveFeedback is required",
                  // }}
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
          {/* todo bug in android crush in this component  */}
          <View style={{}}>
            <ButtonGroup
              control={control}
              headerText={"העלאת קבצים 1"}
              handleFormChange={handleFormChange}
              // errors={errors}
              fileField={"file1"}
              handleFileUploadCallback={(value) => {
                // console.log("here", value);
                handleFormChange("file1", value);
              }}
              onImagePickChange={(value) => {
                handleFormChange("file1", value);
              }}
              onPhotoCapture={(value) => {
                // console.log(value);
                handleFormChange("file1", value);
              }}
              existingFile={currentReport.getData("file1")}
              // existingFile={false}

              errorMsg={errors.file1 && errors.file1.message}
            />

            {errors.file1 && (
              <HelperText type="error">{errors.file1.message}</HelperText>
            )}

            <ButtonGroup
              control={control}
              headerText={"העלאת קבצים 2"}
              handleFormChange={handleFormChange}
              // errors={errors}
              onImagePickChange={(value) => handleFormChange("file2", value)}
              handleFileUploadCallback={(value) => {
                // console.log("here", value);
                handleFormChange("file2", value);
              }}
              onPhotoCapture={(value) => {
                // console.log(value);
                handleFormChange("file2", value);
              }}
              fileField={"file2"}
              existingFile={currentReport.getData("file2")}
              errorMsg={errors.file2 && errors.file2.message}
            />

            {errors.file2 && (
              <HelperText type="error">{errors.file2.message}</HelperText>
            )}
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
          onPrevCategory={async () => {
            // console.log(categoryNames);
            const lastIndexOfCategory = currentCategories.categories.length - 1;
            await handleSaveReport(
              routes.ONBOARDING.CategoryEdit,
              currentReport.getData("status")
            );
            dispatch(setIndex(lastIndexOfCategory));
            navigateToRoute(routes.ONBOARDING.CategoryEdit);
          }}
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
