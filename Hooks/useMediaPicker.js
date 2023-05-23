import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import * as VideoPicker from "expo-image-picker";

const useMediaPicker = () => {
  const [media, setMedia] = useState(null);
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
      } else {
        throw new Error(`Invalid media type: ${mediaType}`);
      }

      if (!result.cancelled) {
        setMedia(result.uri);
      }
    } catch (error) {
      console.error(error);
      setError("Failed to pick media.");
    }
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

  return [media, pickMedia, error];
};
export default useMediaPicker;
