import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import store from "./store/redux";
import { Provider, useDispatch } from "react-redux";
import FoodbizNavigator from "./Navigation/FoodbizNavigator";
import { PaperProvider } from "react-native-paper";
import {
  useFonts,
  Assistant_400Regular,
  Assistant_500Medium,
  Assistant_600SemiBold,
  Assistant_700Bold,
  Assistant_800ExtraBold,
} from "@expo-google-fonts/assistant";
import { I18nManager } from "react-native";
import SplashScreenComponent from "./utiles/SplashScreenComponent";
import { retrieveData } from "./Services/StorageService";
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import FetchDataService from "./Services/FetchDataService";
import Client from "./Components/modals/client";

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userLoginStatus, setUserLoginStatus] = useState(false);
  const { fetchData } = FetchDataService();
  const dispatch = useDispatch();
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
  let [fontsLoaded] = useFonts({
    Assistant_400Regular,
    Assistant_500Medium,
    Assistant_600SemiBold,
    Assistant_700Bold,
    Assistant_800ExtraBold,
  });

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
      }
    }
    const checkLoginStatus = async () => {
      const isConnected = await retrieveData("user_id");
      setUserLoginStatus(isConnected);
      if (isConnected) {
        const responseClients = await fetchData(
          process.env.API_BASE_URL + "api/clients.php",
          { id: isConnected }
        );
        if (responseClients.success) {
          let clients = [];
          responseClients.data.forEach((element) => {
            clients.push(new Client(element));
          });
          dispatch(setClients(clients));
          // console.log("clients:", clients);
          navigateToRoute(routes.ONBOARDING.ClientsList);
        } else {
          console.log("error2:", responseClients.message);
        }
      }
    };

    checkLoginStatus();

    prepare();
  }, []);
  const onAppLoaded = async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
      setTimeout(async () => {
        setAppIsReady(true);
        setLoading(false);
      }, 1000);
    }
  };

  if (!fontsLoaded) {
    return null;
  }
  return (
    <>
      {!appIsReady && <SplashScreenComponent onLoaded={onAppLoaded} />}
      {appIsReady && (
        <NavigationContainer>
          <Provider store={store}>
            <PaperProvider>
              <FoodbizNavigator isConnected={userLoginStatus} />
            </PaperProvider>
          </Provider>
        </NavigationContainer>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
