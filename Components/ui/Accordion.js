import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { List, Divider } from "react-native-paper";
import fonts from "../../styles/fonts";

const Accordion = ({ items, expandedItems, onToggleItem }) => {
  const renderFAQItems = () => {
    return items.map((item, index) => (
      <View key={index}>
        <List.Accordion
          title={item.question}
          expanded={expandedItems.includes(index)}
          onPress={() => onToggleItem(index)}
        >
          <List.Item title={item.answer} />
        </List.Accordion>
        <Divider />
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Frequently Asked Questions</Text>
      <List.Section>{renderFAQItems()}</List.Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: fonts.ABold,
    marginBottom: 16,
  },
});

export default Accordion;
