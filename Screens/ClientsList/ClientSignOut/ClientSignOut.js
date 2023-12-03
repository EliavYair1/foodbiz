import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { removeData } from "../../../Services/StorageService";
import { useDispatch } from "react-redux";
import useScreenNavigator from "../../../Hooks/useScreenNavigator";
import { setUser } from "../../../store/redux/reducers/userSlice";
import fonts from "../../../styles/fonts";
import routes from "../../../Navigation/routes";
const ClientSignOut = () => {
  const dispatch = useDispatch();
  const { navigateToRoute } = useScreenNavigator();

  // sign out button logic
  const handleSignOutUser = () => {
    removeData("user_id");
    dispatch(setUser(null));
    navigateToRoute(routes.ONBOARDING.Login);
  };

  return (
    <View>
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
    </View>
  );
};

export default ClientSignOut;

const styles = StyleSheet.create({});
