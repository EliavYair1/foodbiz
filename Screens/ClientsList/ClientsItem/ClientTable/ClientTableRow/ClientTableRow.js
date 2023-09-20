import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import colors from "../../../../../styles/colors";
import fonts from "../../../../../styles/fonts";

const ClientTableRow = ({ rowData, headers }) => {
  return (
    <View style={styles.tableRowContainer}>
      {headers.map((header, idx) => {
        // console.log("rowData", rowData);
        if (header.type === "actions") {
          return (
            <View
              key={header.id}
              style={{
                ...styles.actionsContainer,
                flexBasis: header.width,
              }}
            >
              {header.actions.map((action) => {
                return (
                  <TouchableOpacity
                    onPress={() => action.action(rowData)}
                    key={action.id}
                    disabled={!action.isActive(rowData)}
                    style={{ opacity: action.isActive(rowData) ? 1 : 0.2 }}
                  >
                    <Image source={action.icon} style={styles.imgIcon} />
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        } else {
          const cellValue = rowData && rowData.getData(header.data);
          return (
            <View style={styles.tableRowContainer} key={header.id}>
              <Text
                style={{
                  ...styles.tableRow,
                  flexBasis: header.width,
                  backgroundColor:
                    header.backgroundColor && header.backgroundColor(cellValue),
                }}
              >
                {header.formatter ? header.formatter(cellValue) : cellValue}
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
  imgIcon: { width: 16, height: 18 },
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
