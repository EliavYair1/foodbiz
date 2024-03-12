import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import Button from "../../../../../Components/ui/Button";
import uploadIcon1 from "../../../../../assets/imgs/plusIconDark.png";
import uploadIcon2 from "../../../../../assets/imgs/libraryIcon.png";
import uploadIcon3 from "../../../../../assets/imgs/CameraIcon.png";
import fonts from "../../../../../styles/fonts";
import colors from "../../../../../styles/colors";
import useMediaPicker from "../../../../../Hooks/useMediaPicker";
import { Camera } from "expo-camera";
import { Controller } from "react-hook-form";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { HelperText } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import Loader from "../../../../../utiles/Loader";
import { useSelector } from "react-redux";
import "@env";
import * as WebBrowser from "expo-web-browser";
const windowWidth = Dimensions.get("screen").width;
const ButtonGroup = ({
  control,
  headerText,
  handleFormChange,
  // errors,
  // imageCaptureErrMsg,
  // fileUploadErrMsg,
  imagePickedField,
  cameraPhotoField,
  fileField,
  errorMsg,
  onImagePickChange,
  handleFileUploadCallback,
  onPhotoCapture,
  existingFile,
}) => {
  const [CameraCaptureImageUrl, setCameraCaptureImageUrl] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [imagePicked, setImagePicked] = useState(false);
  const [fileSelected, setFileSelected] = useState(null);
  const [activeOption, setActiveOption] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFileToDisplay, setSelectedFileToDisplay] = useState(
    existingFile == "" ? null : existingFile
  );
  const cameraRef = useRef(null);

  const smallDevice = windowWidth < 820;

  useEffect(() => {
    const CameraPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== "granted") {
        console.error("Camera permission not granted.");
        return;
      }
      setHasPermission(status === "granted");
    };
    CameraPermission();
  }, []);

  const [media, pickMedia, mediaError, error] = useMediaPicker();

  const handleImagePick = async () => {
    setIsLoading(true);
    try {
      const pickedImage = await pickMedia("image");
      // console.log("pickedImage", pickedImage, BinaryMedia);
      if (pickedImage) {
        const { uri } = pickedImage;
        onImagePickChange(pickedImage);
        setSelectedFileToDisplay(pickedImage);
        setActiveOption("image");
        setImagePicked(true);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        console.error(`[Error] Media selection canceled due to: ${mediaError}`);
      }
    } catch (error) {
      console.log("you have an error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTakePhoto = async () => {
    if (hasPermission) {
      setIsLoading(true);
      try {
        const captureImg = await pickMedia("camera");
        if (captureImg) {
          // handleFormChange("imagePicker", BinaryMedia);
          setCameraCaptureImageUrl(true);
          onPhotoCapture(captureImg);
          setSelectedFileToDisplay(captureImg);
          setIsLoading(false);
          // setImagePicked(true);
          setActiveOption("photo");
        } else {
          setIsLoading(false);
          console.error(
            `[Error] Media selection canceled due to: ${mediaError}`
          );
        }
      } catch (error) {
        setIsLoading(false);
        console.error(`[Error] An error occurred: ${error}`);
      }
    }
  };
  // console.log(imagePickedField, media);
  const handleFileUpload = async () => {
    setIsLoading(true);
    try {
      const selectedFile = await pickMedia("file");
      // console.log("selectedFile", selectedFile);
      if (selectedFile) {
        // const { uri, name, type } = result;
        // console.log("Selected file:", { uri, name, type });
        handleFileUploadCallback(selectedFile);
        setSelectedFileToDisplay(selectedFile);
        setFileSelected(selectedFile);
        setActiveOption("file");
        setIsLoading(false);
      } else {
        setIsLoading(false);
        console.log("File selection canceled", error);
      }
    } catch (error) {
      console.error("Error selecting file:", error);
    } finally {
      setIsLoading(false);
    }
  };
  // console.log("existingFile", existingFile);
  useEffect(() => {
    try {
      if (selectedFileToDisplay !== null) {
        handleFormChange(fileField, existingFile);
      } else {
        // console.log("errr ");
        handleFormChange(fileField, false);
      }
    } catch (error) {
      console.log("errr", error);
    }
  }, [existingFile]);

  const handleDeleteLink = (field) => {
    handleFormChange(field, null);
    setImagePicked(false);
    setCameraCaptureImageUrl(null);
    setActiveOption(null);
    setSelectedFileToDisplay(false);
  };
  if (hasPermission === false) {
    return <Loader visible={isLoading} size={30} isSetting={false} />;
  }
  return (
    <View style={styles.uploadGroup}>
      <Text style={styles.uploadText}>{headerText}</Text>
      {isLoading ? (
        <Loader visible={isLoading} size={30} isSetting={false} />
      ) : selectedFileToDisplay != false ? (
        <>
          {/* bug to fix on existing file display */}
          <View>
            <TouchableOpacity
              onPress={() => {
                handleDeleteLink(fileField);
              }}
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginRight: 205,
              }}
            >
              <Icon name="delete-forever" size={30} color={colors.red} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                if (selectedFileToDisplay) {
                  let url = `${process.env.API_BASE_URL}${selectedFileToDisplay}`;
                  await WebBrowser.openBrowserAsync(url);
                } else {
                  console.log("error trying to display img");
                }
              }}
            >
              <Text
                style={{
                  color: colors.red,
                  fontSize: 18,
                  alignSelf: "center",
                  fontFamily: fonts.ABold,
                }}
              >
                {selectedFileToDisplay}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View style={styles.buttonGroupWrapper}>
            <Controller
              control={control}
              name={fileField}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => {
                // console.log("error", error);
                return (
                  <>
                    <View style={{ flexDirection: "column" }}>
                      <Button
                        buttonStyle={[
                          [
                            styles.button,
                            {
                              borderColor: !fileSelected ? "red" : "blue",
                            },
                          ],
                        ]}
                        icon={true}
                        buttonFunction={handleFileUpload}
                        iconPath={uploadIcon1}
                        iconStyle={styles.IconStyle}
                        buttonTextStyle={styles.buttonText}
                        buttonText={"בחירת קובץ"}
                        buttonWidth={
                          Platform.OS == "android"
                            ? 245
                            : smallDevice
                            ? 245
                            : 260
                        }
                        disableLogic={
                          activeOption === "photo" || activeOption === "image"
                        }
                        // errorMessage={
                        //   !fileSelected
                        //     ? errors.fileField && errors.fileField.message
                        //     : null
                        // }
                        // errorMessage={fileUploadErrMsg}
                      />
                      {error && error.message && (
                        <HelperText type="error">{error.message}</HelperText>
                      )}
                    </View>
                    <View style={{ flexDirection: "column" }}>
                      <Button
                        buttonStyle={[
                          [
                            styles.button,
                            {
                              color: !imagePicked
                                ? colors.redish
                                : colors.black,
                            },
                          ],
                        ]}
                        icon={true}
                        buttonFunction={handleImagePick}
                        iconPath={uploadIcon2}
                        iconStyle={styles.IconStyle}
                        buttonTextStyle={styles.buttonText}
                        disableLogic={
                          activeOption === "photo" || activeOption === "file"
                        }
                        buttonText={"מספריית התמונות"}
                        buttonWidth={
                          Platform.OS == "android"
                            ? 245
                            : smallDevice
                            ? 200
                            : 260
                        }
                        // errorMessage={
                        //   !imagePicked
                        //     ? errors.imagePickedField && errors.imagePickedField.message
                        //     : null
                        // }
                        // errorMessage={uploadImageErrorMsg}
                      />
                    </View>
                    <View style={{ flexDirection: "column" }}>
                      {/* <Camera
                      style={{
                        borderRadius: 8,
                        // backgroundColor: "transparent",
                        height: 46,
                      }}
                      type={Camera.Constants.Type.back}
                      // ref={cameraRef}
                      ref={(ref) => (camera = ref)}
                    > */}
                      <Button
                        buttonStyle={[
                          styles.button,
                          // {
                          //   backgroundColor: "white",
                          // },
                        ]}
                        icon={true}
                        buttonFunction={handleTakePhoto}
                        iconPath={uploadIcon3}
                        iconStyle={styles.IconStyle}
                        buttonTextStyle={styles.buttonText}
                        buttonText={"מצלמה"}
                        // buttonWidth={245}
                        disableLogic={
                          activeOption === "file" || activeOption === "image"
                        }
                        buttonWidth={
                          Platform.OS == "android"
                            ? 245
                            : smallDevice
                            ? 245
                            : 260
                        }
                        // errorMessage={
                        //   !CameraCaptureImageUrl
                        //     ? errors.cameraPhoto && errors.cameraPhoto.message
                        //     : null
                        // }
                        // errorMessage={imageCaptureErrMsg}
                      />
                      {/* </Camera> */}
                    </View>
                  </>
                );
              }}
            />
          </View>
        </>
      )}
      {/* {errorMsg && (
        <HelperText
          type="error"
          style={{ color: "red", fontSize: 16, fontFamily: fonts.ABold }}
        >
          {errorMsg}
        </HelperText>
      )} */}
    </View>
  );
};

export default ButtonGroup;

const styles = StyleSheet.create({
  uploadGroup: {
    flexDirection: "column",
    marginBottom: 32,
  },

  buttonGroupWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  uploadText: {
    fontFamily: fonts.ABold,
    fontSize: 16,
    alignSelf: "flex-start",
    marginBottom: 12,
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
  buttonText: {
    fontFamily: fonts.ABold,
    fontSize: 16,
  },
  IconStyle: {
    width: 16,
    height: 16,
  },
});

// ! backup code

/* 
     <View style={styles.buttonGroupWrapper}>
            <Controller
              control={control}
              name={fileField}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => {
                // console.log("error", error);
                return (
                  <View style={{ flexDirection: "column" }}>
                    <Button
                      buttonStyle={[
                        [
                          styles.button,
                          {
                            borderColor: !fileSelected ? "red" : "blue",
                          },
                        ],
                      ]}
                      icon={true}
                      buttonFunction={handleFileUpload}
                      iconPath={uploadIcon1}
                      iconStyle={styles.IconStyle}
                      buttonTextStyle={styles.buttonText}
                      buttonText={"בחירת קובץ"}
                      buttonWidth={
                        Platform.OS == "android" ? 245 : smallDevice ? 245 : 260
                      }
                      disableLogic={
                        activeOption === "photo" || activeOption === "image"
                      }
                      // errorMessage={
                      //   !fileSelected
                      //     ? errors.fileField && errors.fileField.message
                      //     : null
                      // }
                      // errorMessage={fileUploadErrMsg}
                    />
                    {error && error.message && (
                      <HelperText type="error">{error.message}</HelperText>
                    )}
                  </View>
                );
              }}
            />
            <Controller
              control={control}
              name={imagePickedField}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <View style={{ flexDirection: "column" }}>
                  <Button
                    buttonStyle={[
                      [
                        styles.button,
                        {
                          color: !imagePicked ? colors.redish : colors.black,
                        },
                      ],
                    ]}
                    icon={true}
                    buttonFunction={handleImagePick}
                    iconPath={uploadIcon2}
                    iconStyle={styles.IconStyle}
                    buttonTextStyle={styles.buttonText}
                    disableLogic={
                      activeOption === "photo" || activeOption === "file"
                    }
                    buttonText={"מספריית התמונות"}
                    buttonWidth={
                      Platform.OS == "android" ? 245 : smallDevice ? 200 : 260
                    }
                    // errorMessage={
                    //   !imagePicked
                    //     ? errors.imagePickedField && errors.imagePickedField.message
                    //     : null
                    // }
                    // errorMessage={uploadImageErrorMsg}
                  />
                </View>
              )}
            />

            <View
              style={{
                flexDirection: "column",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <Controller
                control={control}
                name={cameraPhotoField}
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <View style={{ flexDirection: "column" }}>
                    {/* <Camera
                      style={{
                        borderRadius: 8,
                        // backgroundColor: "transparent",
                        height: 46,
                      }}
                      type={Camera.Constants.Type.back}
                      // ref={cameraRef}
                      ref={(ref) => (camera = ref)}
                    > 
                    <Button
                      buttonStyle={[
                        styles.button,
                        // {
                        //   backgroundColor: "white",
                        // },
                      ]}
                      icon={true}
                      buttonFunction={handleTakePhoto}
                      iconPath={uploadIcon3}
                      iconStyle={styles.IconStyle}
                      buttonTextStyle={styles.buttonText}
                      buttonText={"מצלמה"}
                      // buttonWidth={245}
                      disableLogic={
                        activeOption === "file" || activeOption === "image"
                      }
                      buttonWidth={
                        Platform.OS == "android" ? 245 : smallDevice ? 245 : 260
                      }
                      // errorMessage={
                      //   !CameraCaptureImageUrl
                      //     ? errors.cameraPhoto && errors.cameraPhoto.message
                      //     : null
                      // }
                      // errorMessage={imageCaptureErrMsg}
                    />
                  </View>
                )}
              />
            </View>
          </View>

*/
