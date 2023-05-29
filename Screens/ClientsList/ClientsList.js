import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import Dashboard from "../../Components/ui/Dashboard";
import ScreenWrapper from "../../utiles/ScreenWrapper";
import { FlatList } from "react-native-gesture-handler";
import colors from "../../styles/colors";
import Loader from "../../utiles/Loader";
import ClientItem from "./ClientsItem/ClientItem";
import { useDispatch, useSelector } from "react-redux";
import fonts from "../../styles/fonts";
import useScreenNavigator from "../../Hooks/useScreenNavigator";
import { removeData } from "../../Services/StorageService";
import routes from "../../Navigation/routes";
import { setUser } from "../../store/redux/reducers/userSlice";
const ClientsList = () => {
  const clients = useSelector((state) => state.clients);
  const user = useSelector((state) => state.user);
  const { navigateToRoute } = useScreenNavigator();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState(clients);
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

  // sign out button logic
  const handleSignOutUser = () => {
    removeData("user_id");
    dispatch(setUser(null));
    navigateToRoute(routes.ONBOARDING.Login);
  };
  // search bar filtering
  const handleSearch = (filteredClients) => {
    setFilteredData(filteredClients);
  };

  //fetching memorized clients to spare uneccery randering.
  const memoizedClients = useMemo(() => clients, [clients]);

  const tablePadding = 12;
  const arr = [];
  memoizedClients.forEach((item) => {
    arr.push(item.company);
  });
  return (
    <ScreenWrapper
      edges={[]}
      wrapperStyle={{ paddingHorizontal: 0 }}
      isConnectedUser={true}
    >
      <View style={{ flex: 1, alignItems: "center" }}>
        <Dashboard
          tablePadding={tablePadding}
          data={memoizedClients}
          onSearch={handleSearch}
        />
        <Loader size={"large"} color={colors.red} visible={loading} />
        <FlatList
          style={{ flexGrow: 0, width: "100%" }}
          data={filteredData}
          renderItem={({ item }) => {
            return (
              <ClientItem
                title={item.getData("company")}
                logo={item.getData("logo")}
                data={item}
                tablePadding={tablePadding}
              />
            );
          }}
          keyExtractor={(item) => item.getData("id").toString()}
        />
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: "#EBF5FF",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => {
          handleSignOutUser();
        }}
      >
        <Text
          style={{
            alignSelf: "center",
            textDecorationLine: "underline",
            paddingVertical: 12,
            fontSize: 16,
            fontFamily: fonts.ARegular,
          }}
        >
          התנתק
        </Text>
      </TouchableOpacity>
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
