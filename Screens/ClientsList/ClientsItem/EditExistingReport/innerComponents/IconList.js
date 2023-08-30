import React from "react";
import { View, Text } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import ImageText from "./ImageText";
const IconList = ({ onCategoriesIconPress }) => {
  console.log("IconList rendered");
  const imageTextsAndFunctionality = [
    {
      id: 0,
      text: "קבצים",
      source: require("../../../../../assets/icons/iconImgs/folder.png"),
      iconPress: () => {
        console.log("folder");
      },
    },
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
      iconPress: () => {
        console.log("notebook");
      },
    },
    {
      id: 5,
      text: "צפייה",
      source: require("../../../../../assets/icons/iconImgs/eye.png"),
      iconPress: () => {
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
