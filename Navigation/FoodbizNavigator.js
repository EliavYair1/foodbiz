import { createStackNavigator } from "@react-navigation/stack";
import Login from "../Screens/Login/login";
import ClientsList from "../Screens/ClientsList/ClientsList";
import Home from "../Screens/Home/Home";
const Stack = createStackNavigator();
const FoodbizNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        options={{ headerShown: false }}
        component={Home}
      />
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
