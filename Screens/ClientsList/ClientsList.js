import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SectionList,
  Platform,
} from "react-native";
import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
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
import uuid from "uuid-random";
import FetchDataService from "../../Services/FetchDataService";
import Client from "../../Components/modals/client";
import { setClients } from "../../store/redux/reducers/clientSlice";
const windowWidth = Dimensions.get("screen").width;
const windowHeight = Dimensions.get("window").height;
const bigDevice = windowHeight > 1200;
const ClientsList = () => {
  const clientPerScreen = 10;
  const clients = useSelector((state) => state.clients);
  const user = useSelector((state) => state.user);
  const { navigateToRoute } = useScreenNavigator();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { fetchData } = FetchDataService();
  const flatListRef = useRef(null);
  const memoizedClients = useMemo(() => clients, [clients]);

  const [filteredClients, setFilteredClients] = useState(
    clients.slice(0, clientPerScreen)
  );
  // todo to see why the clients don't refresh well when the apply changes on edit
  console.log(
    "[ClientsList]clients",
    clients.map((item) => item.reports.map((item) => item.data))
  );
  console.log(
    "[ClientsList]filteredClients",
    filteredClients.map((item) => item.reports.map((item) => item.data))
  );
  const [searchActive, setSearchActive] = useState(false);
  // const [allClients, setAllClients] = useState([]);
  const [listOffset, setListOffset] = useState(clientPerScreen);
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

  // sign out button logic
  const handleSignOutUser = () => {
    removeData("user_id");
    dispatch(setUser(null));
    navigateToRoute(routes.ONBOARDING.Login);
  };

  // search bar filtering
  const handleSearch = (filteredClients) => {
    setFilteredClients(filteredClients.slice(0, clientPerScreen));
  };

  const ClientCompanyFilterFunction = (item, text) => {
    setSearchActive(text !== "");
    const company = item.company;
    return company && company.includes(text);
  };

  const handleRefreshClients = async () => {
    setIsRefreshing(true);

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

        // setAllClients(clients);
        setFilteredClients(clients.slice(0, clientPerScreen));
      }
    } catch (error) {
      setIsRefreshing(false);
      console.log("[handleRefreshClients]error", error);
    } finally {
      setIsRefreshing(false);
    }
  };
  // console.log("allClients", allClients);
  // console.log(allClients);
  const handleEndReached = () => {
    if (!isRefreshing && !searchActive) {
      setFilteredClients(clients.slice(0, listOffset + clientPerScreen));
      setListOffset(listOffset + clientPerScreen);
    }
  };
  // console.log("filteredClients", filteredClients);
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

const styles = StyleSheet.create({
  loader: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});
export default React.memo(ClientsList);
