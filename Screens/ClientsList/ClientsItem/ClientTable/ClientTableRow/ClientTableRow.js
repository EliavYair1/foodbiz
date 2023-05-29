import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import colors from "../../../../../styles/colors";
import fonts from "../../../../../styles/fonts";

const ClientTableRow = ({ data, memorizedTables }) => {
  // console.log("filesTable:", filesTable);
  return (
    <View style={styles.tableRowContainer}>
      {memorizedTables.map((item, idx) => {
        // console.log("data", data);

        if (item.type === "actions") {
          return (
            <View
              key={item.id}
              style={{ ...styles.actionsContainer, flexBasis: item.width }}
            >
              {item.actions.map((action) => {
                return (
                  <TouchableOpacity
                    onPress={() => action.action(data)}
                    key={action.id}
                    disabled={!action.isActive(data)}
                  >
                    <Image source={action.icon} style={styles.imgIcon} />
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        } else {
          const rowData = data && data.getData(item.data);
          return (
            <View style={styles.tableRowContainer} key={item.id}>
              <Text
                style={{
                  ...styles.tableRow,
                  flexBasis: item.width,
                  backgroundColor: item.statusBackground,
                }}
              >
                {rowData}
              </Text>
            </View>
          );
        }
      })}
    </View>
  );
};

export default React.memo(ClientTableRow);

const styles = StyleSheet.create({
  imgIcon: { width: 10, height: 12 },
  actionsContainer: { flexDirection: "row", flexBasis: 120, gap: 16 },
  tableRow: {
    fontSize: 16,
    color: colors.black,
    fontFamily: fonts.ARegular,
    textAlign: "left",
    alignSelf: "center",
    paddingHorizontal: 12,
  },
  tableRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
});
