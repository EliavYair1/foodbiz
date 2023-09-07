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

const ButtonGroup = ({ headerText, handleFormChange, errors }) => {
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
  // handling image pick
  const handleImagePick = () => {
    console.log("image pick");
    pickMedia("image");
    setImagePicked(true);
  };

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
        />
        <Button
          buttonStyle={styles.button}
          icon={true}
          buttonFunction={handleImagePick}
          iconPath={uploadIcon2}
          iconStyle={styles.IconStyle}
          buttonTextStyle={styles.buttonText}
          buttonText={"מספריית התמונות"}
          buttonWidth={260}
          // errorMessage={
          //   !imagePicked ? errors.url && errors.url.message : null
          // }
        />
        <View
          style={{
            flexDirection: "column",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
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
            errorMessage={
              !CameraCaptureImageUrl
                ? errors.cameraPhoto && errors.cameraPhoto.message
                : null
            }
          />
          {/* </Camera> */}
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
