import { useState } from "react";
import "@env";
import { Alert } from "react-native";
import useScreenNavigator from "./useScreenNavigator";
import { useDispatch, useSelector } from "react-redux";
import FetchDataService from "../Services/FetchDataService";
const useSaveNewFile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { navigateToRoute } = useScreenNavigator();
  const { dispatch } = useDispatch();
  const { fetchData } = FetchDataService();
  const userId = useSelector((state) => state.user);

  const saveNewFile = async (reportData, cb) => {
    try {
      setIsLoading(true);
      const apiUrl = process.env.API_BASE_URL + "api/newfilejson.php";
      const response = await fetchData(apiUrl, reportData);
      console.log("[saveNewFile]response", response);
      if (response.success == true) {
        setIsLoading(false);

        Alert.alert(
          "Success",
          "new file is successfully posted!",
          [
            {
              text: "ok",
              onPress: () => {
                cb();
                // navigateToRoute(routes.ONBOARDING.ClientsList);
                // onCloseModal();
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
      if (response.error) {
        console.log("[useSaveNewFile]error:", response.error);
      }
    }
  };

  return { saveNewFile, isLoading };
};

export default useSaveNewFile;
