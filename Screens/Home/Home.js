import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { retrieveData } from "../../Services/StorageService";
import { useDispatch } from "react-redux";
import useScreenNavigator from "../../Hooks/useScreenNavigator";
import FetchDataService from "../../Services/FetchDataService";
import Client from "../../Components/modals/client";
import routes from "../../Navigation/routes";

import * as SplashScreen from "expo-splash-screen";
import { I18nManager } from "react-native";
import SplashScreenComponent from "../../utiles/SplashScreenComponent";
import { setClients } from "../../store/redux/reducers/clientSlice";
import Loader from "../../utiles/Loader";
import colors from "../../styles/colors";
import ScreenWrapper from "../../utiles/ScreenWrapper";
const Home = () => {
  const { fetchData } = FetchDataService();
  const { navigateToRoute } = useScreenNavigator();
  const dispatch = useDispatch();
  const [appIsReady, setAppIsReady] = useState(false);
  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
      }
    }
    const checkLoginStatus = async () => {
      const user_id = await retrieveData("user_id");

      if (user_id) {
        const responseClients = await fetchData(
          process.env.API_BASE_URL + "api/clients.php",
          { id: user_id }
        );
        if (responseClients.success) {
          let clients = [];
          responseClients.data.forEach((element) => {
            clients.push(new Client(element));
          });
          dispatch(setClients({ clients: clients }));
          // console.log("clients[Home]:", clients);
          navigateToRoute(routes.ONBOARDING.ClientsList);
          // navigateToRoute(routes.ONBOARDING.WorkerNewReport);
        } else {
          console.log("error2:", responseClients.message);
        }
      } else {
        navigateToRoute(routes.ONBOARDING.Login);
      }
    };
    checkLoginStatus();
    prepare();
  }, []);

  const onAppLoaded = async () => {
    await SplashScreen.hideAsync();
    setTimeout(async () => {
      setAppIsReady(true);
    }, 1000);
  };

  if (!appIsReady) {
    return <SplashScreenComponent onLoaded={onAppLoaded} />;
  }

  return (
    <>
      {appIsReady && (
        <ScreenWrapper isConnectedUser={true}>
          <View style={styles.container}>
            <Loader visible={appIsReady} color={colors.blue} />
          </View>
        </ScreenWrapper>
      )}
    </>
  );
};

export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
