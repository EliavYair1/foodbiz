import { StyleSheet, Text, View, Image } from "react-native";
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
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

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
        onPhotoCapture(selectedMedia);
        handleFormChange("cameraPhoto", selectedMedia);
        setActiveOption("photo");
      }
    }
  };

  const [media, pickMedia, mediaError] = useMediaPicker();

  const handleImagePick = () => {
    const pickedImage = pickMedia("image");
    if (pickedImage) {
      const { uri } = pickedImage;
      onImagePickChange(media);
      setActiveOption("image");
      setImagePicked(true);
    } else {
      console.error(`[Error] Media selection canceled due to: ${mediaError}`);
    }
  };
  // console.log(imagePickedField, media);
  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
      if (result.type === "success") {
        const { uri, name, type } = result;
        console.log("Selected file:", { uri, name, type });
        handleFileUploadCallback(uri);
        setFileSelected(uri);
        setActiveOption("file");
      } else {
        console.log("File selection canceled");
      }
    } catch (error) {
      console.error("Error selecting file:", error);
    }
  };

  return (
    <View style={styles.uploadGroup}>
      <Text style={styles.uploadText}>{headerText}</Text>
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
