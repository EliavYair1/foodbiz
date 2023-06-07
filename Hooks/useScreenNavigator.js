import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

const useScreenNavigator = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const navigateToRoute = (routeName) => {
      navigation.navigate(routeName);
    };
    const navigateTogoBack = () => {
      navigation.goBack();
    };
    // Clean up the effect
    return () => {
      // You can perform any cleanup operations here if needed
    };
  }, [navigation]);

  return {
    navigateToRoute: (routeName) => navigation.navigate(routeName),
    navigateTogoBack: () => navigation.goBack(),
  };
};

export default useScreenNavigator;
