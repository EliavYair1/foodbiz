import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import SearchBar from "./SearchBar";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
const Dashboard = ({ tablePadding, data, onSearch }) => {
  const [searchText, setSearchText] = useState("");

  const handleSearchTextChange = (text) => {
    setSearchText(text);
  };

  const handleSearch = () => {
    console.log("Performing search for:", searchText);
    onSearch(filterData(searchText));
  };
  const filterData = (text) => {
    const filteredData = data.filter((item) =>
      item.getData("company").includes(text)
    );
    return filteredData;
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
      paddingHorizontal: tablePadding,
    },

    subHeaderText: {
      fontFamily: fonts.ASemiBold,
      color: colors.white,
      fontSize: 15,
      textAlign: "left",
    },
  });

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
            textAlign: "left",
            width: "25%",
          }}
        >
          שם הלקוח
        </Text>
        <Text
          style={{
            fontFamily: fonts.ASemiBold,
            color: colors.white,
            fontSize: 15,
            textAlign: "left",
            width: "15%",
          }}
        >
          נתוני דוח אחרון
        </Text>
        <Text
          style={{
            fontFamily: fonts.ASemiBold,
            color: colors.white,
            fontSize: 15,
            textAlign: "left",
            width: "15%",
          }}
        >
          ציונים לדוח אחרון
        </Text>
        <Text
          style={{
            fontFamily: fonts.ASemiBold,
            color: colors.white,
            fontSize: 15,
            textAlign: "left",
            width: "45%",
          }}
        >
          ממוצע 5 דוחות אחרונים
        </Text>
      </View>
    </View>
  );
};

export default Dashboard;
