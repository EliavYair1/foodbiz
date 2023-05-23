import { createStackNavigator } from "@react-navigation/stack";
import Login from "../Screens/Login/login";
import ClientsList from "../Screens/ClientsList/ClientsList";
import { useEffect } from "react";
import useScreenNavigator from "../Hooks/useScreenNavigator";
import routes from "./routes";
const Stack = createStackNavigator();
const FoodbizNavigator = ({ isConnected }) => {
  const { navigateToRoute } = useScreenNavigator();
  useEffect(() => {
    // Navigate to the appropriate screen based on the user's login status
    if (isConnected) {
      navigateToRoute(routes.ONBOARDING.ClientsList);
    } else {
      navigateToRoute(routes.ONBOARDING.Login);
    }
  }, [isConnected]);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        options={{ headerShown: false }}
        component={Login}
      />
      <Stack.Screen
        name="ClientsList"
        options={{ headerShown: false }}
        component={ClientsList}
      />
    </Stack.Navigator>
  );
};

export default FoodbizNavigator;
