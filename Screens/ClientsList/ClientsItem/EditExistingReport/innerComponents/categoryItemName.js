import React from "react";
import { View, Text, StyleSheet } from "react-native";

const CategoryItemName = ({ number, item }) => {
  return (
    <View style={styles.listItem}>
      <Text style={styles.number}>{number}</Text>
      <Text>{item}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  number: {
    marginRight: 8,
    fontWeight: "bold",
  },
});

export default CategoryItemName;
