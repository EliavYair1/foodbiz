import { useState } from "react";
import axios from "axios";
import "@env";
import { Alert } from "react-native";

const useDeleteFile = ({ onCloseModal }) => {
  const [isLoading, setIsLoading] = useState(false);
  const DeleteFile = async (reportData) => {
    try {
      setIsLoading(true);
      const apiUrl = process.env.API_BASE_URL + "api/newfile.php";
      const response = await axios.post(apiUrl, reportData);
      if (response.status == 200 || response.status == 201) {
        setIsLoading(false);

        Alert.alert(
          "Success",
          "new file is successfully posted!",
          [
            {
              text: "ok",
              onPress: () => {
                // navigateToRoute(routes.ONBOARDING.ClientsList);
                onCloseModal();
              },
            },
            {
              text: "Cancel",
              onPress: () => {},
              style: "cancel",
            },
          ],
          { cancelable: false }
        );
        return response.data;
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error making new file request:", error);
      return false;
    }
  };

  return { DeleteFile, isLoading };
};

export default useDeleteFile;
