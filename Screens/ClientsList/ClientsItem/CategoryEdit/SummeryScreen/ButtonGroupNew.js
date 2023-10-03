import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
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
const ButtonGroup = ({
  control,
  headerText,
  handleFormChange,
  errors,
  imageCaptureErrMsg,
  fileUploadErrMsg,
  imagePickedField,
  fileField,
  cameraPhotoField,
  onImagePickChange,
  handleFileUploadCallback,
  onPhotoCapture,
}) => {
  const [CameraCaptureImageUrl, setCameraCaptureImageUrl] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [imagePicked, setImagePicked] = useState(false);
  const [fileSelected, setFileSelected] = useState(null);
  const [activeOption, setActiveOption] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [Link, setLink] = useState(null);
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const [media, pickMedia, mediaError, BinaryMedia] = useMediaPicker();

  const handleImagePick = async () => {
    setIsLoading(true);
    try {
      const pickedImage = await pickMedia("image");
      if (pickedImage) {
        const { uri } = pickedImage;
        onImagePickChange(BinaryMedia);
        setLink(BinaryMedia);
        setActiveOption("image");
        setImagePicked(true);
        setIsLoading(false);
      } else {
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
          onPhotoCapture(BinaryMedia);
          setIsLoading(false);
          // setImagePicked(true);
          setLink(BinaryMedia);
          setActiveOption("photo");
        } else {
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
      const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
      if (result.type === "success") {
        const { uri, name, type } = result;
        console.log("Selected file:", { uri, name, type });
        handleFileUploadCallback(uri);
        setLink(name);
        setFileSelected(uri);
        setActiveOption("file");
        setIsLoading(false);
      } else {
        console.log("File selection canceled");
      }
    } catch (error) {
      console.error("Error selecting file:", error);
    } finally {
      setIsLoading(false);
    }
  };
  // console.log(isLoading);
  const handleDeleteLink = (field) => {
    // console.log("inside");
    handleFormChange(field, null);
    setImagePicked(false);
    setCameraCaptureImageUrl(null);
    setActiveOption(null);
    setLink(null);
  };
  return (
    <View style={styles.uploadGroup}>
      <Text style={styles.uploadText}>{headerText}</Text>
      {isLoading ? (
        <Loader visible={isLoading} size={30} isSetting={false} />
      ) : Link ? (
        <>
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
                let url = `${currentReport.getData("viewUrl")}`;
                await WebBrowser.openBrowserAsync(url);
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
                {Link}
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
              }) => (
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
                    buttonWidth={260}
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
                </View>
              )}
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
                    buttonWidth={260}
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
                        buttonStyle={[
                          styles.button,
                          {
                            backgroundColor: "white",
                          },
                        ]}
                        icon={true}
                        buttonFunction={handleTakePhoto}
                        iconPath={uploadIcon3}
                        iconStyle={styles.IconStyle}
                        buttonTextStyle={styles.buttonText}
                        disableLogic={
                          activeOption === "file" || activeOption === "image"
                        }
                        buttonText={"מצלמה"}
                        buttonWidth={260}
                        // errorMessage={
                        //   !CameraCaptureImageUrl
                        //     ? errors.cameraPhoto && errors.cameraPhoto.message
                        //     : null
                        // }
                        // errorMessage={imageCaptureErrMsg}
                      />
                    </Camera>
                  </View>
                )}
              />
            </View>
          </View>
        </>
      )}

      {errors.fileField && errors.fileField.message && (
        <HelperText type="error">
          {!CameraCaptureImageUrl && !imagePicked && !fileSelected
            ? errors.fileField && errors.fileField.message
            : null}
        </HelperText>
      )}
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

/*       {Link ? (
        <View>
          <TouchableOpacity
            onPress={() => {
              console.log("aaaaaa");
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
              let url = `${currentReport.getData("viewUrl")}`;
              await WebBrowser.openBrowserAsync(url);
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
              {Link}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.buttonGroupWrapper}>
          <Controller
            control={control}
            name={fileField}
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
                  buttonWidth={260}
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
              </View>
            )}
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
                  buttonWidth={260}
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
                      buttonStyle={[
                        styles.button,
                        {
                          backgroundColor: "white",
                        },
                      ]}
                      icon={true}
                      buttonFunction={handleTakePhoto}
                      iconPath={uploadIcon3}
                      iconStyle={styles.IconStyle}
                      buttonTextStyle={styles.buttonText}
                      disableLogic={
                        activeOption === "file" || activeOption === "image"
                      }
                      buttonText={"מצלמה"}
                      buttonWidth={260}
                      // errorMessage={
                      //   !CameraCaptureImageUrl
                      //     ? errors.cameraPhoto && errors.cameraPhoto.message
                      //     : null
                      // }
                      // errorMessage={imageCaptureErrMsg}
                    />
                  </Camera>
                </View>
              )}
            />
          </View>
        </View>
      )} */
