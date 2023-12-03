import { View, StyleSheet } from "react-native";
import React, { useEffect, useState, useMemo } from "react";
import Dashboard from "../../Components/ui/Dashboard";
import ScreenWrapper from "../../utiles/ScreenWrapper";
// import { FlatList, RefreshControl } from "react-native-gesture-handler";
import colors from "../../styles/colors";
import Loader from "../../utiles/Loader";
import { useSelector } from "react-redux";
import Client from "../../Components/modals/client";
import ClientListComponent from "./ClientListComponent/ClientListComponent";
import ClientSignOut from "./ClientSignOut/ClientSignOut";

const ClientsList = () => {
  const clientPerScreen = 10;
  const clients = useSelector((state) => state.clients);
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const memoizedClients = useMemo(() => clients, [clients]);
  const [filteredClients, setFilteredClients] = useState(
    clients.slice(0, clientPerScreen)
  );
  const [searchActive, setSearchActive] = useState(false);

  useEffect(() => {
    const fetchingClientsData = async () => {
      setLoading(true);
      if (memoizedClients) {
        console.log(`hello user: ${user}`);
        setFilteredClients(clients.slice(0, clientPerScreen));
        setLoading(false);
      } else {
        console.log("unable to fetch data");
        setLoading(false);
      }
    };
    fetchingClientsData();
  }, [clients, user]);

  // search bar filtering
  const handleSearch = (filteredClients) => {
    setFilteredClients(filteredClients.slice(0, clientPerScreen));
  };

  const ClientCompanyFilterFunction = (item, text) => {
    setSearchActive(text !== "");
    const company = item.company;
    return company && company.includes(text);
  };

  const toggleLoading = (status) => {
    // console.log("[ClientsList]loading...", status);
    setLoading(status);
  };

  return (
    <ScreenWrapper
      edges={[]}
      wrapperStyle={{ paddingHorizontal: 0 }}
      isConnectedUser={true}
    >
      <View style={{ flex: 1, alignItems: "center" }}>
        <Dashboard
          tablePadding={12}
          data={clients}
          onSearch={handleSearch}
          filterFunction={ClientCompanyFilterFunction}
        />
        {loading ? (
          <Loader
            size={"large"}
            color={colors.toggleColor1}
            visible={loading}
          />
        ) : (
          <>
            <ClientListComponent
              clients={clients}
              filteredClients={filteredClients}
              clientFilterCallback={setFilteredClients}
              searchActive={searchActive}
              clientPerScreen={clientPerScreen}
              user={user}
              toggleLoading={toggleLoading}
            />
          </>
        )}
      </View>
      <ClientSignOut />
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
