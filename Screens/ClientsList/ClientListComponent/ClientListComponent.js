import { Platform, StyleSheet, Text, View, Dimensions } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import colors from "../../../styles/colors";
import ClientItem from "../ClientsItem/ClientItem";
// import FetchDataService from "../../../Services/FetchDataService";
// import Client from "../../../Components/modals/client";
import Loader from "../../../utiles/Loader";
import { fetchAllClients } from "../../../Services/fetchClients";
const windowWidth = Dimensions.get("screen").width;
const windowHeight = Dimensions.get("window").height;
const bigDevice = windowHeight > 1200;
const ClientListComponent = ({
  clients,
  searchActive,
  filteredClients,
  clientFilterCallback,
  clientPerScreen,
  user,
  toggleLoading,
}) => {
  const flatListRef = useRef(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [listOffset, setListOffset] = useState(clientPerScreen);
  // const { fetchData } = FetchDataService();
  // const userId = useSelector((state) => state.user);
  const handleRefreshClients = async () => {
    setIsRefreshing(true);
    try {
      const clients = await fetchAllClients({
        user: user,
        errorCallback: (error) => {
          console.log("handleRefreshClients]:error:", error);
        },
      });

      // const responseClients = await fetchData(
      //   process.env.API_BASE_URL + "api/clients.php",
      //   { id: user }
      // );

      // if (responseClients.success) {
      if (clients) {
        // console.log("handleRefreshClients", clients);
        setIsRefreshing(false);
        // let clients = [];
        // responseClients.data.forEach((element) => {
        //   clients.push(new Client(element));
        // });

        clientFilterCallback(clients.slice(0, clientPerScreen));
      }
    } catch (error) {
      setIsRefreshing(false);
      console.log("[handleRefreshClients]error", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleEndReached = () => {
    if (!isRefreshing && !searchActive) {
      clientFilterCallback(clients.slice(0, listOffset + clientPerScreen));
      setListOffset(listOffset + clientPerScreen);
    }
  };

  return (
    <View
      style={{
        maxWidth: windowWidth,
        minHeight: windowHeight,
        paddingBottom: bigDevice ? 240 : 275,
      }}
    >
      <FlatList
        ref={flatListRef}
        style={{ flexGrow: 0 }}
        data={filteredClients}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefreshClients}
            colors={[colors.lightBlue]}
            progressBackgroundColor={
              Platform.OS === "android" ? colors.white : undefined
            }
          />
        }
        renderItem={({ item }) => {
          return (
            <ClientItem
              logo={item.getData("logo")}
              client={item}
              tablePadding={12}
              loadingCallback={(val) => {
                toggleLoading(val);
              }}
            />
          );
        }}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default ClientListComponent;

const styles = StyleSheet.create({});
