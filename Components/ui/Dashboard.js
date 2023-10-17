import { View, Text, StyleSheet, Image } from "react-native";
import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import { LinearGradient } from "expo-linear-gradient";
import BackgroundImageWrapper from "./BackgroundImage";
import DashboardBg from "../../assets/imgs/dashboardBackground.png";
import DashboardAvatar from "../../assets/imgs/dashboardHeaderAvater.png";

const Dashboard = ({ tablePadding, data, onSearch, filterFunction }) => {
  const [searchText, setSearchText] = useState("");

  const handleSearchTextChange = (text) => {
    setSearchText(text);
    onSearch(filterData(text));
  };
  const handleSearch = () => {
    onSearch(filterData(searchText));
  };
  const filterData = (text) => {
    const filteredData = data.filter((item) => filterFunction(item, text));
    return filteredData;
  };

  return (
    <View style={styles.dashboardContainer}>
      <LinearGradient
        colors={["#37549D", "#26489F"]}
        start={[0, 0]}
        end={[1, 0]}
        style={styles.gradientBackground}
      >
        <View style={styles.container}>
          <View
            style={{
              flexDirection: "row-reverse",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Text style={styles.header}>רשימת לקוחות</Text>
            <Image source={DashboardAvatar} style={{ width: 32, height: 32 }} />
          </View>

          <SearchBar
            placeholder={"חיפוש לפי שם לקוח"}
            onChangeText={handleSearchTextChange}
            onSearch={handleSearch}
            inputStyle={styles.searchInput}
          />
          <BackgroundImageWrapper
            backgroundImagePath={DashboardBg}
            styling={{
              width: 191,
              height: 200,
              position: "absolute",
              right: 0,
            }}
          ></BackgroundImageWrapper>
        </View>
      </LinearGradient>

      <View
        style={[styles.subHeaderContainer, { paddingHorizontal: tablePadding }]}
      >
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
    // backgroundColor: colors.toggleColor1,
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
  },

  subHeaderText: {
    fontFamily: fonts.ASemiBold,
    color: colors.white,
    fontSize: 15,
    textAlign: "left",
  },
  searchInput: {},
});
export default Dashboard;
