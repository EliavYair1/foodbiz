import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";

const Tabs = ({ tabs, activeTab, onTabPress, tablePadding }) => {
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
    </View>
  );
};

export default Tabs;
