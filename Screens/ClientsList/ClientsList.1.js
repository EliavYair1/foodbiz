import { View, Text, TouchableOpacity, Platform } from "react-native";
import React, { useEffect, useState, useMemo, useRef } from "react";
import Dashboard from "../../Components/ui/Dashboard";
import ScreenWrapper from "../../utiles/ScreenWrapper";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import colors from "../../styles/colors";
import Loader from "../../utiles/Loader";
import ClientItem from "./ClientsItem/ClientItem";
import { useDispatch, useSelector } from "react-redux";
import fonts from "../../styles/fonts";
import useScreenNavigator from "../../Hooks/useScreenNavigator";
import { removeData } from "../../Services/StorageService";
import routes from "../../Navigation/routes";
import { setUser } from "../../store/redux/reducers/userSlice";
import FetchDataService from "../../Services/FetchDataService";
import Client from "../../Components/modals/client";
import { windowWidth, windowHeight } from "./ClientsList";

export const ClientsList = () => {
  const clients = useSelector((state) => state.clients);
  const user = useSelector((state) => state.user);
  const { navigateToRoute } = useScreenNavigator();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { fetchData } = FetchDataService();
  const flatListRef = useRef(null);
  const [filteredClients, setFilteredClients] = useState(clients);
  const [currentClient, setCurrentClient] = useState(1);
  const [allClients, setAllClients] = useState([]);
  const memoizedClients = useMemo(() => clients, [clients]);
  useEffect(() => {
    const fetchingClientsData = async () => {
      if (clients) {
        console.log(`hello user: ${user}`);
        setLoading(false);
      } else {
        console.log("unable to fetch data");
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
    setFilteredClients(filteredClients);
  };
  const ClientCompanyFilterFunction = (item, text) => {
    const company = item.company;
    return company && company.includes(text);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setCurrentClient(1);

    try {
      const responseClients = await fetchData(
        process.env.API_BASE_URL + "api/clients.php",
        { id: user }
      );

      if (responseClients.success) {
        setIsRefreshing(false);
        let clients = [];
        responseClients.data.forEach((element) => {
          clients.push(new Client(element));
        });
        setAllClients(clients);
        setFilteredClients(clients.slice(0, clientPerScreen));
      }
    } catch (error) {
      setIsRefreshing(false);
      console.log("[handleRefresh]error", error);
    } finally {
      setIsRefreshing(false);
    }
  };
  // console.log("allClients", allClients);
  // console.log(allClients);
  const handleEndReached = () => {
    if (!isRefreshing) {
      const clientPerScreen = 11;
      const totalItems = allClients.length;
      const totalClients = Math.ceil(totalItems / clientPerScreen);

      if (currentClient < totalClients) {
        setCurrentClient(currentClient + 1);
        const startIndex = (currentClient - 1) * clientPerScreen;
        const endIndex = currentClient * clientPerScreen;

        setFilteredClients(allClients.slice(0, endIndex));
      }
    }
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
          <View
            style={{
              maxWidth: windowWidth,
              minHeight: windowHeight,
              paddingBottom: 270,
            }}
          >
            <FlatList
              ref={flatListRef}
              style={{ flexGrow: 0 }}
              data={filteredClients}
              // onEndReached={handleEndReached}
              // onEndReachedThreshold={0.1}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
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
                  />
                );
              }}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>
        )}
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
