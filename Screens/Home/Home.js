import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { retrieveData } from "../../Services/StorageService";
import { useDispatch } from "react-redux";
import useScreenNavigator from "../../Hooks/useScreenNavigator";
import Client from "../../Components/modals/client";
import routes from "../../Navigation/routes";
import * as SplashScreen from "expo-splash-screen";
import SplashScreenComponent from "../../utiles/SplashScreenComponent";
import { setClients } from "../../store/redux/reducers/clientSlice";
import Loader from "../../utiles/Loader";
import colors from "../../styles/colors";
import ScreenWrapper from "../../utiles/ScreenWrapper";
import { setUser } from "../../store/redux/reducers/userSlice";
import axios from "axios";
import { setReportsTimes } from "../../store/redux/reducers/reportsTimesSlice";
import { setGlobalCategories } from "../../store/redux/reducers/globalCategories";
import { fetchAllClients } from "../../Services/fetchClients";
const Home = () => {
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
      try {
        const user_id = await retrieveData("user_id");
        if (user_id) {
          console.log(1);
          const [responseClients, responseCategories] = await Promise.all([
            fetchAllClients({
              user: user_id,
              errorCallback: (error) => console.log("Clients error11:", error),
            }),
            axios.get(process.env.API_BASE_URL + "api/categories.php"),
          ]);
          // const responseClients  = await fetchClients(user_id);

          if (responseClients) {
            const clients = responseClients;
            console.log(1.5);
            dispatch(setClients({ clients: clients }));
            dispatch(setUser(user_id));
            console.log(2);
            dispatch(setGlobalCategories(responseCategories.data.categories));
            dispatch(setReportsTimes(responseCategories.data.reports_times));
            console.log(3);
            navigateToRoute(routes.ONBOARDING.ClientsList);
            // navigateToRoute(routes.ONBOARDING.WorkerNewReport);
          } else {
            console.log("Clients error:", responseClients);
          }
        } else {
          navigateToRoute(routes.ONBOARDING.Login);
        }
      } catch (error) {
        console.log("Login error:", error);
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
    return (
      <SplashScreenComponent onLoaded={onAppLoaded} loading={appIsReady} />
    );
  }

  return (
    <>
      {appIsReady && (
        <ScreenWrapper
          isConnectedUser={true}
          wrapperStyle={{ paddingHorizontal: 0 }}
        >
          <Loader visible={appIsReady} color={colors.blue} isSetting={true} />
        </ScreenWrapper>
      )}
    </>
  );
};

export default React.memo(Home);
const styles = StyleSheet.create({});
