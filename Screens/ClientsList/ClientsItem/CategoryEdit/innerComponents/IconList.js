import React from "react";
import { View, Text } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import ImageText from "./ImageText";
import routes from "../../../../../Navigation/routes";
import useScreenNavigator from "../../../../../Hooks/useScreenNavigator";
import * as WebBrowser from "expo-web-browser";
import { useSelector } from "react-redux";
const IconList = ({
  onCategoriesIconPress,
  onSummeryIconPress = false,
  onSettingsIconPress = false,
}) => {
  // todo icon list
  // todo watch icon work same as watch report in the client list
  // todo categories opens a popup and navigate same as edit existing report
  // todo summary navigates to sammury screen
  // todo settings navigate to to current workernewReport on edit mode
  // todo files icon to erase.
  // todo notes icon to leave for last
  const { navigateToRoute } = useScreenNavigator();
  const currentReport = useSelector(
    (state) => state.currentReport.currentReport
  );
  const imageTextsAndFunctionality = [
    // {
    //   id: 0,
    //   text: "קבצים",
    //   source: require("../../../../../assets/icons/iconImgs/folder.png"),
    //   iconPress: () => {
    //     console.log("folder");
    //   },
    // },
    {
      id: 1,
      text: "מפרט",
      source: require("../../../../../assets/icons/iconImgs/paperSheet.png"),
      iconPress: () => {
        console.log("paperSheet");
      },
    },
    {
      id: 2,
      text: "הגדרות",
      source: require("../../../../../assets/icons/iconImgs/settings.png"),
      iconPress: () => {
        onSettingsIconPress();
        navigateToRoute(routes.ONBOARDING.WorkerNewReport);
        console.log("settings");
      },
    },
    {
      id: 3,
      text: "קטגוריות",
      source: require("../../../../../assets/icons/iconImgs/categories.png"),
      iconPress: () => {
        console.log("categories");
        onCategoriesIconPress();
      },
    },
    {
      id: 4,
      text: "סיכום",
      source: require("../../../../../assets/icons/iconImgs/notebook.png"),
      iconPress: async () => {
        await onSummeryIconPress();
        navigateToRoute(routes.ONBOARDING.SummeryScreen);
        console.log("summery icon pressed");
      },
    },
    {
      id: 5,
      text: "צפייה",
      source: require("../../../../../assets/icons/iconImgs/eye.png"),
      iconPress: async () => {
        let url = `${currentReport.getData("viewUrl")}`;
        await WebBrowser.openBrowserAsync(url);
        console.log("eye");
      },
    },
  ];

  const renderImageTextItem = ({ item }) => {
    return (
      <View style={{ marginRight: 10 }}>
        <ImageText
          imageSource={item.source}
          ImageText={item.text}
          id={item.id}
          onIconPress={item.iconPress}
        />
      </View>
    );
  };

  return (
    <FlatList
      data={imageTextsAndFunctionality}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderImageTextItem}
      horizontal={true}
    />
  );
};

export default IconList;
