import { createStackNavigator } from "@react-navigation/stack";
import Login from "../Screens/Login/login";
import ClientsList from "../Screens/ClientsList/ClientsList";
import Home from "../Screens/Home/Home";
import WorkerNewReport from "../Screens/WorkerNewReport/WorkerNewReport";
import EditExistingReport from "../Screens/ClientsList/ClientsItem/EditExistingReport/EditExistingReport";
import React from "react";
import SummeryScreen from "../Screens/ClientsList/ClientsItem/EditExistingReport/SummeryScreen/SummeryScreen";
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
        options={{ headerShown: false, gestureEnabled: false }}
        component={Login}
      />
      <Stack.Screen
        name="ClientsList"
        options={{ headerShown: false }}
        component={ClientsList}
      />
      <Stack.Screen
        name="WorkerNewReport"
        options={{ headerShown: false }}
        component={WorkerNewReport}
      />
      <Stack.Screen
        name="EditExistingReport"
        options={{ headerShown: false }}
        component={EditExistingReport}
      />
      <Stack.Screen
        name="SummeryScreen"
        options={{ headerShown: false }}
        component={SummeryScreen}
      />
    </Stack.Navigator>
  );
};

export default FoodbizNavigator;
