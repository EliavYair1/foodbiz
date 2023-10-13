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
const ClientsList = () => {
  // console.log("ClientsList");
  const clients = useSelector((state) => state.clients);
  const user = useSelector((state) => state.user);
  const { navigateToRoute } = useScreenNavigator();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { fetchData } = FetchDataService();
  // const [filteredClients, setFilteredClients] = useState(clients);
  const [filteredClients, setFilteredClients] = useState(
    clients && clients.length > 0 ? clients : null
  );
  const flatListRef = useRef(null);

  // useEffect(() => {
  //   if (clients && clients.length > 0) {
  //     setFilteredClients(clients);
  //   }
  // }, [clients]);

  useEffect(() => {
    const fetchingClientsData = async () => {
      if (clients) {
        console.log(`hello user: ${user}`);
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
    setFilteredClients(filteredClients);
  };
  const ClientCompanyFilterFunction = (item, text) => {
    const company = item.company;
    return company && company.includes(text);
  };

  //fetching memorized clients to spare uneccery randering.
  const memoizedClients = useMemo(() => clients, [clients]);

  const handleLastTabOpen = () => {
    // Scroll to the top of the screen
    flatListRef.current.scrollToOffset({ offset: 0, animated: true });
  };

  const handleRefresh = async () => {
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
        dispatch(setClients({ clients: clients }));
      }
    } catch (error) {
      setIsRefreshing(false);
      console.log("[handleRefresh]error", error);
    } finally {
      setIsRefreshing(false);
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
          data={memoizedClients}
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
              // contentContainerStyle={{ paddingBottom: 100 }}
              data={filteredClients}
              // initialNumToRender={11}
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
              keyExtractor={(item) => uuid()}
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
