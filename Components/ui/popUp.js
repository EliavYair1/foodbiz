import {
  View,
  Text,
  Modal,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import CloseIcon from "../../assets/imgs/CloseModalIcon.png";
import SelectMenu from "./SelectMenu";
import { FlatList } from "react-native-gesture-handler";
import { HelperText, PaperProvider } from "react-native-paper";
import Input from "./Input";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import DatePicker from "./datePicker";
import Button from "../ui/Button";
import useMediaPicker from "../../Hooks/useMediaPicker";
import { Camera } from "expo-camera";
import Loader from "../../utiles/Loader";
import * as ImagePicker from "expo-image-picker";
import useSaveReport from "../../Hooks/useSaveReport";
import axios from "axios";
import useSaveNewFile from "../../Hooks/useSaveNewFile";
import { useSelector } from "react-redux";
import useScreenNavigator from "../../Hooks/useScreenNavigator";
import routes from "../../Navigation/routes";
const PopUp = ({
  animationType,
  modalHeaderText,
  onCloseModal = false,
  modalWidth,
  visible,
  icon1,
  icon2,
  selectWidth,
  stations,
  categoryId,
  editFileObject = false,
}) => {
  const [imagePicked, setImagePicked] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [CameraCaptureImageUrl, setCameraCaptureImageUrl] = useState(null);
  const [isSchemaValid, setIsSchemaValid] = useState(false);
  const [formData, setFormData] = useState({
    station: "",
    fileName: "",
    authorName: "",
    date: "",
    comments: "",
    imagePicker: "",
  });
  const [imageCapture, setImageCapture] = useState(null);
  const [clientId, setClientId] = useState(null);
  // const { saveReport, isLoading } = useSaveReport();
  const { navigateToRoute } = useScreenNavigator();

  const userId = useSelector((state) => state.user);
  const { saveNewFile, isLoading } = useSaveNewFile(onCloseModal);
  // console.log(editFileObject);
  const [activeOption, setActiveOption] = useState(null);
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);
  const schema = useMemo(() => {
    let schemaBuilder = yup.object().shape({
      comments: yup.string(),
      date: yup.string().required("date is required"),
      authorName: yup.string().required("author name is required"),
      fileName: yup.string().required("file name is required"),
      station: yup.string().required("station is required"),
    });

    if (!formData.imagePicker) {
      schemaBuilder = schemaBuilder.shape({
        imagePicker: yup
          .string()
          .required("pick a image or capture a photo is required"),
      });
    }
    return schemaBuilder;
  }, [formData]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  // validate the scheme on every change of the state
  useEffect(() => {
    schema
      .validate(formData)
      .then(() => setIsSchemaValid(true))
      .catch((err) => {
        console.log("err:", err);
        setIsSchemaValid(false);
      });
  }, [formData, schema]);

  const inputRef = useRef();
  const popUpInputInformation = [
    {
      id: 0,
      ref: useRef(),
      name: "station",
      label: "תחנה",
      styleInput: [{ writingDirection: "rtl", textAlign: "right" }],

      control: control,
      returnKeyType: "next",
      activeUnderlineColor: "#0C1430",
      underlineColor: "#0C1430",
      mode: "outline",
      contentStyle: styles.inputContentStyling,
      inputStyle: styles.inputStyling,
      onSubmitEditing: () => {
        popUpInputInformation[1].ref.current.focus();
      },
    },
    {
      id: 1,
      ref: useRef(),
      name: "fileName",
      // value: "fileName",
      label: "שם קובץ",

      control: control,
      returnKeyType: "next",
      // inputIcon: <TextInput.Icon icon="eye" onPress={handlepasswordToggle} />,
      // secureTextEntry: passwordShowToggle,
      activeUnderlineColor: "#0C1430",
      underlineColor: "#0C1430",
      mode: "outline",
      contentStyle: styles.inputContentStyling,
      inputStyle: styles.inputStyling,
      onSubmitEditing: () => {
        popUpInputInformation[2].ref.current.focus();
      },
    },
    {
      id: 2,
      ref: useRef(),
      name: "authorName",
      // value: "fileName",
      label: "כותב",

      control: control,
      returnKeyType: "next",
      // inputIcon: <TextInput.Icon icon="eye" onPress={handlepasswordToggle} />,
      // secureTextEntry: passwordShowToggle,
      activeUnderlineColor: "#0C1430",
      underlineColor: "#0C1430",
      mode: "outline",
      contentStyle: styles.inputContentStyling,
      inputStyle: styles.inputStyling,
      onSubmitEditing: () => {
        popUpInputInformation[3].ref.current.focus();
      },
    },
    {
      id: 3,
      ref: useRef(),
      name: "date",
      // value: "fileName",
      label: "תאריך",

      control: control,
      returnKeyType: "next",
      // inputIcon: <TextInput.Icon icon="eye" onPress={handlepasswordToggle} />,
      // secureTextEntry: passwordShowToggle,
      activeUnderlineColor: "#0C1430",
      underlineColor: "#0C1430",
      mode: "outline",
      contentStyle: styles.inputContentStyling,
      inputStyle: styles.inputStyling,
      onSubmitEditing: () => {
        popUpInputInformation[4].ref.current.focus();
      },
    },
    {
      id: 4,
      ref: useRef(),
      name: "fileName",
      // value: "fileName",
      label: "שם קובץ",

      control: control,
      returnKeyType: "done",
      // inputIcon: <TextInput.Icon icon="eye" onPress={handlepasswordToggle} />,
      // secureTextEntry: passwordShowToggle,
      activeUnderlineColor: "#0C1430",
      underlineColor: "#0C1430",
      mode: "outline",
      contentStyle: styles.inputContentStyling,
      inputStyle: styles.inputStyling,
    },
  ];
  // handling the form changes
  const handleFormChange = useCallback(
    (name, value) => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));

      setIsSchemaValid(true);
    },
    [formData]
  );
  // console.log(formData, isSchemaValid);
  // todo the imagepicker keep showing up even after picking an image
  const [media, pickMedia, mediaError, BinaryMedia] = useMediaPicker();
  // todo to condiftion the view of the image on edit file
  // handling image pick
  const handleImagePick = () => {
    const pickedImage = pickMedia("image");
    if (pickedImage) {
      // const { uri, type, name } = pickedImage;
      handleFormChange("imagePicker", BinaryMedia);
      // console.log("media", BinaryMedia);
      setImagePicked(true);
      setActiveOption("image");
    } else {
      console.error(`[Error] Media selection canceled due to: ${mediaError}`);
    }
  };
  const handleTakePhoto = async () => {
    if (hasPermission) {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        const selectedMedia = result.assets[0].uri;
        setCameraCaptureImageUrl(selectedMedia);
        handleFormChange("cameraPhoto", selectedMedia);
        setActiveOption("photo");
      }
    }
  };
  // console.log("categoryId", categoryId);
  // todo send post request for a new file info.
  const saveFileInfo = async () => {
    const bodyFormData = new FormData();
    bodyFormData.append("id", userId);
    bodyFormData.append("stationId", formData.station);
    bodyFormData.append("authorName", formData.authorName);
    bodyFormData.append("date", formData.date);
    bodyFormData.append("comments", formData.comments);
    bodyFormData.append("url", formData.imagePicker);
    bodyFormData.append("fileName", formData.fileName);
    bodyFormData.append("clientId", clientId);
    bodyFormData.append("categoryId", categoryId);
    if (editFileObject) {
      bodyFormData.append("id3", editFileObject.id);
    }
    console.log("bodyFormData", bodyFormData);
    const newFileSaved = await saveNewFile(bodyFormData);
    if (newFileSaved) {
      // console.log("newFileSaved", newFileSaved);
      console.log(
        editFileObject !== null ? "edited file save" : "new file saved"
      );
      onCloseModal();
      // navigateToRoute(routes.ONBOARDING.ClientsList);
    }
  };

  const onSubmitForm = async () => {
    // checking if scheme is valid

    if (isSchemaValid) {
      // console.log("(onSubmitForm)formData", formData);
      // console.log("scheme is valid");
      await saveFileInfo();
    }
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  // todo fix the capture img bug
  // todo to initiate a loader while uploading an image(on both actions) when image loads display it .
  // todo when finish loading display the image instead of the two buttons
  return (
    <Modal
      visible={visible}
      transparent
      animationType={animationType}
      presentationStyle="overFullScreen"
    >
      <PaperProvider>
        <BlurView style={{ flex: 1 }} intensity={100} tint="dark">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                // zIndex: 10,
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 10,
                  width: modalWidth,
                  paddingHorizontal: 40,
                  paddingVertical: 20,
                  zIndex: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    onCloseModal();
                  }}
                  style={{}}
                  underlayColor="transparent"
                >
                  <Image source={CloseIcon} style={styles.closeIconStyle} />
                </TouchableOpacity>

                {/* HEADER */}
                <Text style={styles.textStyle}>{modalHeaderText}</Text>
                {/* selector */}

                {/* inputs */}
                <View style={styles.inputWrapper}>
                  <Text style={styles.subtextStyle}>תחנה</Text>
                  <SelectMenu
                    control={control}
                    selectWidth={selectWidth}
                    selectOptions={stations}
                    selectMenuStyling={{
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "flex-start",
                      marginBottom: 0,
                    }}
                    defaultText={
                      editFileObject !== null
                        ? editFileObject.station_name
                        : "בחירה"
                    }
                    optionsHeight={250}
                    centeredViewStyling={
                      {
                        // marginRight: 0,
                        // alignItems: "center",
                        // marginTop: -150,
                      }
                    }
                    name={"station"}
                    errorMessage={errors.station && errors.station.message}
                    onChange={(value) => {
                      handleFormChange("station", value.id);
                      // console.log(value.clientId);
                      setClientId(value.clientId);
                    }}
                    propertyName="company"
                    returnObject={true}
                  />
                  <Text style={styles.subtextStyle}>שם הקובץ</Text>
                  <Input
                    proxyRef={inputRef}
                    name={"fileName"}
                    // label={firstInputText}
                    activeOutlineColor={"grey"}
                    outlineColor={"grey"}
                    defaultValue={
                      editFileObject !== null ? editFileObject.fileName : ""
                    }
                    control={control}
                    mode={"outlined"}
                    inputStyle={{ backgroundColor: "white" }}
                    onChangeFunction={(value) => {
                      handleFormChange("fileName", value);
                    }}
                  />
                  <Text style={styles.subtextStyle}>שם הכותב</Text>
                  <Input
                    proxyRef={inputRef}
                    name={"authorName"}
                    // label={secondInputText}
                    outlineColor={"grey"}
                    defaultValue={
                      editFileObject !== null ? editFileObject.authorName : ""
                    }
                    activeOutlineColor={"grey"}
                    control={control}
                    mode={"outlined"}
                    inputStyle={{ backgroundColor: "white" }}
                    onChangeFunction={(value) => {
                      // console.log("authorName:", value);
                      handleFormChange("authorName", value);
                    }}
                  />
                  <Text style={styles.subtextStyle}>תאריך</Text>
                  <DatePicker
                    label={"תאריך"}
                    control={control}
                    defaultDate={
                      editFileObject !== null
                        ? editFileObject.date
                        : "בחר תאריך"
                    }
                    name={"date"}
                    dateInputWidth={"100%"}
                    errorMessage={errors.date && errors.date.message}
                    onchange={(value) => {
                      const date = new Date(value);
                      const formattedDate = date.toLocaleDateString("en-GB");
                      console.log(formattedDate);

                      handleFormChange("date", formattedDate);
                    }}
                  />
                </View>
                {/* upload buttons */}
                <View>
                  <Text style={styles.subtextStyle}>העלאת קובץ</Text>
                  <View style={styles.buttonWrapper}>
                    {/* {imagePicked ? 
                        <Image
                          source={{ uri: media }}
                          style={{ width: 100, height: 100 }}
                        />
                        :
<Loader visible={isLoading}/>

                    } */}
                    <View style={{ flexDirection: "column", flexWrap: "wrap" }}>
                      <Button
                        buttonStyle={styles.button}
                        icon={true}
                        buttonFunction={handleImagePick}
                        iconPath={icon1}
                        iconStyle={styles.IconStyle}
                        buttonTextStyle={styles.buttonText}
                        buttonText={"מספריית התמונות"}
                        disableLogic={activeOption === "photo"}
                        buttonWidth={184}
                        // errorMessage={
                        //   !imagePicked
                        //     ? errors.imagePicker && errors.imagePicker.message
                        //     : null
                        // }
                      />
                    </View>

                    <View style={{ flexDirection: "column", flexWrap: "wrap" }}>
                      <Camera
                        style={{
                          borderRadius: 8,
                          // backgroundColor: "transparent",
                          height: 46,
                        }}
                        type={Camera.Constants.Type.back}
                        ref={(ref) => (camera = ref)}
                      >
                        <Button
                          buttonWidth={194}
                          buttonStyle={[
                            styles.button,
                            { backgroundColor: "white" },
                          ]}
                          buttonFunction={handleTakePhoto}
                          icon={true}
                          iconPath={icon2}
                          disableLogic={
                            activeOption === "image" || editFileObject?.url
                          }
                          iconStyle={styles.IconStyle}
                          buttonTextStyle={styles.buttonText}
                          buttonText={"מצלמה"}
                          // errorMessage={
                          //   !CameraCaptureImageUrl
                          //     ? errors.cameraPhoto && errors.cameraPhoto.message
                          //     : null
                          // }
                        />
                      </Camera>
                    </View>
                  </View>
                  <HelperText
                    type="error"
                    style={{
                      textAlign: "center",
                      marginVertical: 0,
                    }}
                  >
                    {!imagePicked && !CameraCaptureImageUrl
                      ? errors.imagePicker && errors.imagePicker.message
                      : null}
                  </HelperText>
                </View>
                {/* input remarks */}
                <View style={styles.remarksInputWrapper}>
                  <Text style={styles.subtextStyle}>הערות</Text>
                  <Input
                    control={control}
                    name={"comments"}
                    multiline
                    numberOfLines={4}
                    defaultValue={
                      editFileObject !== null ? editFileObject.comments : ""
                    }
                    maxLength={40}
                    mode="outlined"
                    onChangeFunction={(value) => {
                      handleFormChange("comments", value);
                    }}
                    activeOutlineColor="grey"
                    inputStyle={{
                      backgroundColor: colors.white,
                      width: 400,
                      height: 80,
                      borderRadius: 8,
                      borderColor: "rgba(12, 20, 48, 0.2)",
                    }}
                  />
                </View>
                {/* submit button */}
                {isSchemaValid ? (
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit(onSubmitForm)}
                  >
                    <Text style={styles.submitButtonText}>שמירה</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.disabled}>
                    <Text style={styles.submitButtonText}>שמירה</Text>
                  </View>
                )}
              </View>
            </View>
          </KeyboardAvoidingView>
        </BlurView>
      </PaperProvider>
    </Modal>
  );
};
const styles = StyleSheet.create({
  buttonWrapper: {
    flexDirection: "row",
    // gap: 16,
    justifyContent: "space-between",
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 13,
    // width: 194,
    gap: 8,
  },
  buttonText: {},
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: colors.black,
    textAlign: "center",
    fontFamily: fonts.ABold,
    fontSize: 20,
  },
  subtextStyle: {
    color: colors.black,
    textAlign: "left",
    fontFamily: fonts.ARegular,
    fontSize: 16,
    // marginBottom: 4,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  closeIconStyle: {
    width: 12.5,
    height: 12.5,
  },
  inputWrapper: {
    // flex: 1,
  },

  IconStyle: {
    width: 16,
    height: 16,
  },
  selectHeaderStyle: {},
  remarksInputWrapper: {},
  submitButton: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.blue,
    paddingVertical: 8,
    borderRadius: 8,
    opacity: 1,
  },
  submitButtonText: {
    color: colors.white,
  },
  inputContentStyling: { backgroundColor: "white" },
  inputStyling: { minWidth: "100%", backgroundColor: "white" },
  contentContainer: {},
  disabled: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.blue,
    paddingVertical: 8,
    borderRadius: 8,
    opacity: 0.6,
  },
});
export default React.memo(PopUp);
