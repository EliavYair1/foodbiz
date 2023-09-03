import { StyleSheet, Text, View } from "react-native";
import React from "react";
import fonts from "../../styles/fonts";
import IconList from "../../Screens/ClientsList/ClientsItem/EditExistingReport/innerComponents/IconList";
const Header = ({
  HeaderText,
  subHeader = false,
  subHeaderText,
  containerStyling,
  iconList = false,
  onCategoriesIconPress,
}) => {
  return (
    <View style={[styles.headerWrapper, containerStyling ?? ""]}>
      <View>
        <Text style={styles.header}>{HeaderText}</Text>
        {subHeader && <Text style={styles.subheader}>{subHeaderText}</Text>}
      </View>
      {iconList && (
        <View style={styles.imageTextList}>
          <IconList onCategoriesIconPress={onCategoriesIconPress} />
        </View>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerWrapper: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    // marginBottom: 30,
  },
  header: {
    alignItems: "center",
    justifyContent: "flex-start",
    textAlign: "left",
    fontSize: 24,
    fontFamily: fonts.ABold,
  },
  subheader: {
    alignItems: "center",
    width: "100%",
    justifyContent: "flex-start",
    textAlign: "left",
  },
  iconList: {},
});
