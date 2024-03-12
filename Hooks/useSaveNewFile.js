import { useState } from "react";
import axios from "axios";
import "@env";
import { Alert } from "react-native";
import routes from "../Navigation/routes";
import useScreenNavigator from "./useScreenNavigator";
import { setClients } from "../store/redux/reducers/clientSlice";
import { useDispatch, useSelector } from "react-redux";
import FetchDataService from "../Services/FetchDataService";
import Client from "../Components/modals/client";
const useSaveNewFile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { navigateToRoute } = useScreenNavigator();
  const { dispatch } = useDispatch();
  const { fetchData } = FetchDataService();
  const userId = useSelector((state) => state.user);

  const saveNewFile = async (reportData) => {
    try {
      setIsLoading(true);
      // todo to debug the create file and edit req
      const apiUrl = process.env.API_BASE_URL + "api/newfilejson.php";
      // const response = await axios.post(apiUrl, reportData);
      // console.log("reportData", reportData._parts["id"]);
      // console.log("reportData for 'id':", reportData.get("id"));
      console.log("reportData", reportData);

      const response = await fetchData(apiUrl, reportData);
      console.log("[saveNewFile]response", response);
      if (response.success == true) {
        // if (response.status == 200 || response.status == 201) {
        setIsLoading(false);

        Alert.alert(
          "Success",
          "new file is successfully posted!",
          [
            {
              text: "ok",
              onPress: () => {
                // cb();
                // navigateToRoute(routes.ONBOARDING.ClientsList);
                // onCloseModal();
                // {"authorName": "Sddf", "categoryId": "4", "clientId": "34", "comments": "Dfsdf", "createTime": "1695724119", "date": "2023-09-26", "fileName": "Dads", "id": "554", "stationId": "66", "station_name": "תחנה להדגמה", "url": "http://system.foodbiz.co.il/uploads/1695724114.jpg"}
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
