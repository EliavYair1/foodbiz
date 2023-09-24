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
const useSaveNewFile = ({ onCloseModal }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { navigateToRoute } = useScreenNavigator();
  const { dispatch } = useDispatch();
  const { fetchData } = FetchDataService();
  const userId = useSelector((state) => state.user);
  const saveNewFile = async (reportData) => {
    try {
      setIsLoading(true);
      const apiUrl = process.env.API_BASE_URL + "api/newfile.php";
      const response = await axios.post(apiUrl, reportData);
      if (response.status == 200 || response.status == 201) {
        setIsLoading(false);
        console.log("[useSaveNewFile] Response.data", response.data);
        // todo to debug the update of the clients
        // if (userId) {
        //   const responseClients = await fetchData(
        //     process.env.API_BASE_URL + "api/clients.php",
        //     { id: userId }
        //   );
        //   if (responseClients.success) {
        //     let clients = [];
        //     responseClients.data.forEach((element) => {
        //       clients.push(new Client(element));
        //     });
        //     dispatch(setClients({ clients: clients }));
        //     console.log("responseClients", responseClients.data);
        //   }
        // }

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

  return { saveNewFile, isLoading };
};

export default useSaveNewFile;
