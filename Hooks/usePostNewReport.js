import { useState } from "react";
import axios from "axios";
import Client from "../Components/modals/client";
import { setClients } from "../store/redux/reducers/clientSlice";
import { useDispatch, useSelector } from "react-redux";
import useScreenNavigator from "./useScreenNavigator";
import routes from "../Navigation/routes";
import { Alert } from "react-native";
import FetchDataService from "../Services/FetchDataService";
import "@env";
const usePostNewReport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { navigateToRoute } = useScreenNavigator();
  const { fetchData } = FetchDataService();
  const userId = useSelector((state) => state.user);

  const postNewReport = async (formData, IsRearrangement) => {
    try {
      setIsLoading(true);
      console.log("[postNewReport]:formData", formData);
      // console.log("[postNewReport]:stationId", stationId);
      const response = await axios.post(
        process.env.API_BASE_URL + "api/duplicateReport.php",
        { ...formData, rearrangement: IsRearrangement }
      );
      console.log("[postNewReport]:duplicateReport:", response);
      if (response.status === 200 || response.status === 201) {
        console.log("responseDuplicateReport in", response.status);
        const responseClients = await fetchData(
          process.env.API_BASE_URL + "api/clients.php",
          { id: userId }
        );

        if (responseClients.success) {
          let clients = [];
          responseClients.data.forEach((element) => {
            clients.push(new Client(element));
          });
          dispatch(setClients({ clients: clients }));
          setIsLoading(false);
          Alert.alert(
            "Success",
            "Data posted successfully!",
            [
              {
                text: "ok",
                onPress: () => {
                  navigateToRoute(routes.ONBOARDING.ClientsList);
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
        }
      }

      return response.data;
    } catch (error) {
      setIsLoading(false);
      console.error("(postNewReport)Error posting data:", error);
      throw error;
    }
  };

  return { postNewReport, isLoading };
};

export default usePostNewReport;
