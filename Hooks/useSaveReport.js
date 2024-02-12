import { useState } from "react";
import axios from "axios";
import "@env";
import { Alert } from "react-native";
import { setClients } from "../store/redux/reducers/clientSlice";
import { useDispatch, useSelector } from "react-redux";
// import FetchDataService from "../Services/FetchDataService";
// import Client from "../Components/modals/client";
import { fetchAllClients } from "../Services/fetchClients";

const useSaveCurrentScreenData = () => {
  const [PostLoading, setPostLoading] = useState(false);
  const dispatch = useDispatch();
  // const { fetchData } = FetchDataService();
  const userId = useSelector((state) => state.user);

  const handleRefreshClients = async () => {
    setPostLoading(true);

    try {
      // const responseClients = await fetchData(
      //   process.env.API_BASE_URL + "api/clients.php",
      //   { id: userId }
      // );

      const clients = await fetchAllClients({
        user: userId,
        errorCallback: (error) => {
          console.log("handleRefreshClients]:error:", error);
        },
      });

      // if (responseClients.success) {
      if (clients) {
        console.log("[handleRefreshClients]clients", clients);
        setPostLoading(false);
        // let clients = [];
        // responseClients.data.forEach((element) => {
        //   clients.push(new Client(element));
        // });
        dispatch(setClients({ clients: clients }));
      }
      console.log("clients refreshed...");
    } catch (error) {
      setPostLoading(false);
      console.error("[handleRefreshClients]error", error);
    } finally {
      setPostLoading(false);
    }
  };

  const saveCurrentScreenData = async (reportData, route, alertMsg = false) => {
    try {
      setPostLoading(true);
      const apiUrl = process.env.API_BASE_URL + route;
      const response = await axios.post(apiUrl, reportData);
      if (response.status == 200 || response.status == 201) {
        setPostLoading(false);
        // console.log("[usesaveCurrentScreenData] Response.data", response.data);
        handleRefreshClients();
        {
          alertMsg &&
            Alert.alert(
              "Success",
              "Data posted successfully!",
              [
                {
                  text: "ok",
                  onPress: () => {
                    console.log("success");
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

        return response.data;
      }
    } catch (error) {
      setPostLoading(false);
      console.error("[saveCurrentScreenData]Error making POST request:", error);
      return false;
    }
  };

  return { saveCurrentScreenData, PostLoading };
};

export default useSaveCurrentScreenData;
