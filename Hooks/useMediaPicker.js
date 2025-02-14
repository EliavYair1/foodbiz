import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import * as VideoPicker from "expo-image-picker";
// import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import "@env";
import {
  getInfoAsync,
  makeDirectoryAsync,
  cacheDirectory,
  copyAsync,
  uploadAsync,
  FileSystemUploadType,
  FileSystemUploadOptions,
} from "expo-file-system";
import { Alert, Platform } from "react-native";
const createCacheFile = async (selectedMedia) => {
  if (!(await getInfoAsync(cacheDirectory + "uploads/")).exists) {
    await makeDirectoryAsync(cacheDirectory + "uploads/");
  }
  const cacheFilePath = cacheDirectory + "uploads/" + selectedMedia.name;
  await copyAsync({ from: selectedMedia.uri, to: cacheFilePath });
  return cacheFilePath;
};

const useMediaPicker = (handleInputChange = false) => {
  const [media, setMedia] = useState(null);
  const [BinaryMedia, setBinaryMedia] = useState(null);
  const [error, setError] = useState(null);

  const pickMedia = async (mediaType) => {
    try {
      let result;
      if (mediaType === "image") {
        result = await ImagePicker.launchImageLibraryAsync();
      } else if (mediaType === "video") {
        result = await VideoPicker.launchImageLibraryAsync({
          mediaTypes: VideoPicker.MediaTypeOptions.Videos,
        });
      } else if (mediaType === "camera") {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          aspect: [4, 3],
          quality: 1,
        });
      } else if (mediaType === "file") {
        // result = await DocumentPicker.getDocumentAsync({
        //   type: ["*/*"],
        // });
        result = await DocumentPicker.getDocumentAsync({
          copyToCacheDirectory: false,
        });
        // console.log(result.uri);
      } else {
        throw new Error(`Invalid media type: ${mediaType}`);
      }
      if (result.type === "success") {
        const selectedMedia = result;
        setMedia(selectedMedia);
        let fileName = selectedMedia.name.split(" ").join("");
        let fileSize = selectedMedia.size;
        // const fileToUpload = selectedMedia;

        const apiUrl =
          process.env.API_BASE_URL +
          "imageUpload.php?ax-file-path=uploads%2F&ax-allow-ext=jpg%7Cgif%7Cpng%7Cpdf&ax-file-name=" +
          fileName +
          "&ax-thumbHeight=0&ax-thumbWidth=0&ax-thumbPostfix=_thumb&ax-thumbPath=&ax-thumbFormat=&ax-maxFileSize=1001M&ax-fileSize=" +
          fileSize +
          "&ax-start-byte=0&isLast=true";

        const cacheFilePath = await createCacheFile(selectedMedia);
        const options = {
          httpMethod: "POST",
          uploadType: FileSystemUploadType.MULTIPART,
          fieldName: "file",
        };
        const response = await uploadAsync(apiUrl, cacheFilePath, options);

        if (response.status == 200) {
          let responseBody = JSON.parse(response.body);
          if (responseBody.status == "error") {
            setError("Failed to pick media.", responseBody.info);
            return false;
          }
          console.log("uploads/" + responseBody.name);

          setBinaryMedia("uploads/" + responseBody.name);
          return "uploads/" + responseBody.name;
        }
      }
      if (!result.canceled) {
        const selectedMedia = result.assets[0].uri;
        setMedia(selectedMedia);

        const selectedAssets = result.assets;
        // let fileName = selectedAssets[0].fileName;
        let fileName = selectedAssets[0].fileName ?? "camera.jpg";
        let fileSize = selectedAssets[0].fileSize;
        const fileToUpload = selectedAssets[0];
        const apiUrl =
          process.env.API_BASE_URL +
          "imageUpload.php?ax-file-path=uploads%2F&ax-allow-ext=jpg%7Cgif%7Cpng&ax-file-name=" +
          fileName +
          "&ax-thumbHeight=0&ax-thumbWidth=0&ax-thumbPostfix=_thumb&ax-thumbPath=&ax-thumbFormat=&ax-maxFileSize=1001M&ax-fileSize=" +
          fileSize +
          "&ax-start-byte=0&isLast=true";
        const response = await uploadAsync(apiUrl, fileToUpload.uri, {
          fieldName: "ax-file-name",
          httpMethod: "POST",
          uploadType: FileSystemUploadType.BINARY_CONTENT,
        });

        if (response.status == 200) {
          // console.log("res data:", response.body);
          let responseBody = JSON.parse(response.body);
          // console.log("res BODY:", responseBody.name);
          console.log("uploads/" + responseBody.name);

          setBinaryMedia("uploads/" + responseBody.name);
          return "uploads/" + responseBody.name;
        }
        /*  */
        // handleInputChange("url", selectedMedia);
        // console.log("result", result.assets);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to pick media.");
    }
    return false;
  };

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        setError("Permission to access media library denied.");
      }
    })();
  }, []);

  return [media, pickMedia, error, BinaryMedia];
};
export default useMediaPicker;
