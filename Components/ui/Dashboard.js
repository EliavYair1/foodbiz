import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import SearchBar from "./SearchBar";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
// import { ClientAvatar } from "../../assets/icons";
const Dashboard = () => {
  const [searchText, setSearchText] = useState("");

  const handleSearchTextChange = (text) => {
    setSearchText(text);
  };

  const handleSearch = () => {
    console.log("Performing search for:", searchText);
    // Add your search logic here
  };

  return (
    <View style={styles.dashboardContainer}>
      <View style={styles.container}>
        <View>
          <Text style={styles.header}>רשימת לקוחות</Text>
        </View>
        <SearchBar
          placeholder={"חיפוש לפי שם לקוח"}
          onChangeText={handleSearchTextChange}
          onSearch={handleSearch}
        />
      </View>
      <View style={styles.subHeaderContainer}>
        <Text
          style={{
            fontFamily: fonts.ASemiBold,
            color: colors.white,
            fontSize: 15,
            minWidth: 100,
            textAlign: "left",
            marginRight: 116,
          }}
        >
          שם הלקוח
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignSelf: "center",
            flex: 1,
            gap: 30,
          }}
        >
          <Text style={styles.subHeaderText}>נתוני דוח אחרון</Text>
          <Text style={styles.subHeaderText}>ציונים לדוח אחרון</Text>
          <Text style={styles.subHeaderText}>ממוצע 5 דוחות אחרונים</Text>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  dashboardContainer: {
    flexDirection: "column",
    width: "100%",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 136,
    backgroundColor: colors.toggleColor1,
    width: "100%",
    paddingHorizontal: 24,
  },
  header: {
    fontFamily: fonts.ASemiBold,
    fontSize: 26,
    color: colors.white,
  },
  subHeaderContainer: {
    flexDirection: "row",
    backgroundColor: colors.toggleColor1,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },

  subHeaderText: {
    fontFamily: fonts.ASemiBold,
    color: colors.white,
    fontSize: 15,
  },
});

export default Dashboard;
