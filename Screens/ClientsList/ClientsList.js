import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import Dashboard from "../../Components/ui/Dashboard";
import ScreenWrapper from "../../utiles/ScreenWrapper";
import { FlatList } from "react-native-gesture-handler";
import colors from "../../styles/colors";
import Loader from "../../utiles/Loader";
import { List, Divider, IconButton } from "react-native-paper";
import ClientItem from "./ClientsItem/ClientItem";
import { useSelector } from "react-redux";
const ClientsList = () => {
  const clients = useSelector((state) => state.clients);
  // console.log("clients[client list]:", clients);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  const tableHeadWidth = 100;
  const tablePadding = 12;

  return (
    <ScreenWrapper
      edges={[]}
      wrapperStyle={{ paddingHorizontal: 0 }}
      isConnectedUser={true}
    >
      <View style={{ flex: 1, alignItems: "center" }}>
        <Dashboard tableStyling={tableHeadWidth} tablePadding={tablePadding} />
        <Loader size={"large"} color={colors.red} visible={loading} />
        <FlatList
          style={{ flexGrow: 0, width: "100%" }}
          data={memoizedClients}
          renderItem={({ item }) => {
            return (
              <ClientItem
                title={item.getData("company")}
                logo={item.getData("logo")}
                data={item}
                tableStyling={tableHeadWidth}
                tablePadding={tablePadding}
              />
            );
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
export default React.memo(ClientsList);
