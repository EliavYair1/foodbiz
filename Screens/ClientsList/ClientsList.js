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
// import { FlatList, RefreshControl } from "react-native-gesture-handler";
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
import ClientListComponent from "./ClientListComponent/ClientListComponent";

const ClientsList = () => {
  const clientPerScreen = 10;
  const clients = useSelector((state) => state.clients);
  const user = useSelector((state) => state.user);
  const { navigateToRoute } = useScreenNavigator();
  const dispatch = useDispatch();
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
            />
          </>
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
