import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import SearchBar from "./SearchBar";
const Tabs = ({
  tabs,
  activeTab,
  onTabPress,
  tablePadding,
  usersTab = false,
  data,
  onSearch,
  filterFunction,
}) => {
  const [searchText, setSearchText] = useState("");
  const handleSearchTextChange = (text) => {
    setSearchText(text);
    onSearch(filterData(text));
  };
  const handleSearch = () => {
    // console.log("Performing search for:", searchText);
    onSearch(filterData(searchText));
  };
  const filterData = (text) => {
    const filteredData = data.filter((item) => filterFunction(item, text));
    // console.log(filteredData);
    return filteredData;
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      backgroundColor: colors.lightBlue,
      paddingHorizontal: tablePadding,
      paddingVertical: 8,
    },
    tab: {
      // flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 8,
      // width: 72,
      marginRight: 72,
    },
    activeTab: {
      // backgroundColor: "#e0e0e0",
    },
    tabText: {
      fontSize: 16,
      color: colors.black,
      fontFamily: fonts.ARegular,
    },
    activeTabText: {
      color: "#000",
      fontFamily: fonts.ABold,
    },
    searchInput: {
      backgroundColor: "#D1E7FF",
      borderColor: "rgba(12, 20, 48, 0.2)",
      width: 218,
    },
  });

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, tab === activeTab ? styles.activeTab : null]}
          onPress={() => onTabPress(tab)}
        >
          <Text
            style={[
              styles.tabText,
              tab === activeTab ? styles.activeTabText : null,
            ]}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
      {usersTab && (
        <View style={{ alignSelf: "center", marginLeft: "auto" }}>
          <SearchBar
            placeholder={"חיפוש "}
            onChangeText={handleSearchTextChange}
            onSearch={handleSearch}
            searchBarStyling={styles.searchInput}
          />
        </View>
      )}
    </View>
  );
};

export default Tabs;
