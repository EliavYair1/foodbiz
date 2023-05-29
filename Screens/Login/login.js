import { StyleSheet, Text, View, ImageBackground } from "react-native";
import ScreenWrapper from "../../utiles/ScreenWrapper";
import LoginBox from "./LoginBox/LoginBox";

const Login = () => {
  return (
    <ScreenWrapper
      edges={[]}
      wrapperStyle={{ paddingHorizontal: 0 }}
      isConnectedUser={false}
    >
      <ImageBackground
        style={{
          flex: 1,
          resizeMode: "cover",
        }}
        source={require("../../assets/imgs/loginBackgroundImg.jpg")}
      >
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <LoginBox />
        </View>
      </ImageBackground>
    </ScreenWrapper>
  );
};

export default Login;
