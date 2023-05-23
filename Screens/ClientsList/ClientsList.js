import { View, Text, StyleSheet, ImageBackground } from "react-native";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import Dashboard from "../../Components/ui/Dashboard";
import { retrieveData } from "../../Services/StorageService";
import FetchDataService from "../../Services/FetchDataService";
import Client from "../../Components/modals/client";
import ScreenWrapper from "../../utiles/ScreenWrapper";
import { FlatList } from "react-native-gesture-handler";
import colors from "../../styles/colors";
import Loader from "../../utiles/Loader";
import { List, Divider, IconButton } from "react-native-paper";
import ClientItem from "./ClientsItem/ClientItem";
import { useDispatch, useSelector } from "react-redux";
import { setClient } from "../../store/redux/reducers/clientSlice";
const ClientsList = () => {
  const clients = useSelector((state) => state.clients);
  // const [clients, setClients] = useState([]);
  console.log("clients[client list]:", clients);
  const [loading, setLoading] = useState(true);
  // const { fetchData } = FetchDataService();
  // const BASE_URL = process.env.API_BASE_URL + "api/clients.php";
  useEffect(() => {
    //fetching the user id && the client data
    const fetchingClientsData = async () => {
      if (clients) {
        console.log("hello user");
        setLoading(false);
      } else {
        console.log("unabled to fetch data");
        setLoading(false);
      }
    };
    fetchingClientsData();
  }, []);

  //fetching memorized clients to spare uneccery randering.
  const memoizedClients = useMemo(() => clients, [clients]);

  return (
    <ScreenWrapper
      edges={[]}
      wrapperStyle={{ paddingHorizontal: 0 }}
      isConnectedUser={true}
    >
      <View style={{ flex: 1, alignItems: "center" }}>
        <Dashboard />
        <Loader size={"large"} color={colors.red} visible={loading} />
        <FlatList
          style={{ flexGrow: 0, width: "100%" }}
          data={memoizedClients}
          renderItem={({ item }) => {
            return <ClientItem title={item.getData("company")} item={item} />;
          }}
          keyExtractor={(item) => item.getData("id").toString()}
        />
      </View>
    </ScreenWrapper>
  );
};
const styles = StyleSheet.create({
  loader: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});
export default ClientsList;
