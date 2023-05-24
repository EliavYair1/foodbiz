import { StyleSheet, Text, View } from "react-native";
import React from "react";

const ClientTableHeader = ({ memorizedArray }) => {
  const styles = StyleSheet.create({
    tableHeadWrapper: {
      flexDirection: "row",
      // paddingHorizontal: tablePadding,
    },
    tableHeadStyle: {
      paddingVertical: 9,
      opacity: 0.6,
      alignSelf: "center",
      alignItems: "flex-start",
      paddingHorizontal: 12,
    },
  });

  return (
    <View style={styles.tableHeadWrapper}>
      {memorizedArray.map((item, idx) => {
        return (
          <View
            key={item.id}
            style={{
              ...styles.tableHeadStyle,
              flexBasis: item.width,
            }}
          >
            <Text>{item.label}</Text>
          </View>
        );
      })}
    </View>
  );
};

export default React.memo(ClientTableHeader);
