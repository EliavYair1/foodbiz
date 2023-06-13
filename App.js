import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import store from "./store/redux";
import { Provider } from "react-redux";
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
import { I18nManager, AppRegistry } from "react-native";

export default function App() {
  AppRegistry.registerComponent("main", () => App);
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
  let [fontsLoaded] = useFonts({
    Assistant_400Regular,
    Assistant_500Medium,
    Assistant_600SemiBold,
    Assistant_700Bold,
    Assistant_800ExtraBold,
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <>
      <StatusBar style="auto" />
      <Provider store={store}>
        <NavigationContainer>
          <PaperProvider>
            <FoodbizNavigator />
          </PaperProvider>
        </NavigationContainer>
      </Provider>
    </>
  );
}
