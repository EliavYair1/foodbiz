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

const ButtonGroup = ({
  control,
  headerText,
  handleFormChange,
  errors,
  // uploadImageErrorMsg,
  imageCaptureErrMsg,
  fileUploadErrMsg,
  imagePickedField,
  fileField,
  cameraPhotoField,
  fileName,
  onImagePickChange,
}) => {
  const [CameraCaptureImageUrl, setCameraCaptureImageUrl] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [imagePicked, setImagePicked] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleTakePhoto = async () => {
    if (hasPermission) {
      const { uri } = await camera.takePictureAsync();
      // setCameraCaptureImageUrl(uri);
      console.log("image captured...");
      handleFormChange("cameraPhoto", uri);
    }
  };

  // console.log(CameraCaptureImageUrl);

  const [media, pickMedia, mediaError] = useMediaPicker(handleFormChange);

  const handleImagePick = async () => {
    try {
      // Use your media picker (in this case, pickMedia)
      const pickedImage = await pickMedia("image");
      if (pickedImage) {
        const { uri } = pickedImage;
        onImagePickChange(uri);
        setImagePicked(true);
      } else {
        console.log("Media selection canceled");
      }
    } catch (error) {
      console.error("Error selecting media:", error);
    }
  };
  console.log(imagePickedField, media);

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
      if (result.type === "success") {
        const { uri, name, type } = result;
        console.log("Selected file:", { uri, name, type });
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
            <>
              <Button
                buttonStyle={styles.button}
                icon={true}
                buttonFunction={handleFileUpload}
                iconPath={uploadIcon1}
                iconStyle={styles.IconStyle}
                buttonTextStyle={styles.buttonText}
                buttonText={"בחירת קובץ"}
                buttonWidth={260}
                // errorMessage={
                //   !imagePicked ? errors.url && errors.url.message : null
                // }
                errorMessage={fileUploadErrMsg}
              />
            </>
          )}
        />
        <Controller
          control={control}
          name={imagePickedField}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <>
              <Button
                buttonStyle={styles.button}
                icon={true}
                buttonFunction={handleImagePick}
                iconPath={uploadIcon2}
                iconStyle={styles.IconStyle}
                buttonTextStyle={styles.buttonText}
                buttonText={"מספריית התמונות"}
                buttonWidth={260}
                errorMessage={
                  !imagePicked
                    ? errors.fileName && errors.fileName.message
                    : null
                }
                // errorMessage={uploadImageErrorMsg}
              />
            </>
          )}
        />
        {imagePicked && (
          <View>
            <Image
              source={{ uri: media }}
              style={{ width: 100, height: 100 }}
            />
          </View>
        )}
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
              <>
                {/* {CameraCaptureImageUrl && (
            <Image
              source={{ uri: CameraCaptureImageUrl }}
              style={{ width: 100, height: 100, marginBottom: 10 }}
            />
          )} */}
                {/* <Camera
            style={{
              borderRadius: 8,
              backgroundColor: "transparent",
              height: 46,
            }}
            type={Camera.Constants.Type.back}
            ref={(ref) => (camera = ref)}
          > */}
                <Button
                  buttonStyle={styles.button}
                  icon={true}
                  buttonFunction={handleTakePhoto}
                  iconPath={uploadIcon3}
                  iconStyle={styles.IconStyle}
                  buttonTextStyle={styles.buttonText}
                  buttonText={"מצלמה"}
                  buttonWidth={260}
                  // errorMessage={
                  //   !CameraCaptureImageUrl
                  //     ? errors.cameraPhoto && errors.cameraPhoto.message
                  //     : null
                  // }
                  errorMessage={imageCaptureErrMsg}
                />
                {/* </Camera> */}
              </>
            )}
          />
        </View>
      </View>
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
