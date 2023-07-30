import React from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { FlatList } from "react-native-gesture-handler";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";

const ModalUi = ({ header, onClose, handleOptionClick, modalContent }) => {
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.sectionHeader}>{item.subheader}</Text>
      <View style={styles.optionsContainer}>
        <ScrollView style={{ flex: 1 }}>
          {item.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.button}
              onPress={() => handleOptionClick(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  return (
    <Modal animationType="fade" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>{header}</Text>
          </View>

          <FlatList
            scrollEnabled={false}
            data={modalContent}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: 460,
    // maxHeight: "80%",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  optionsContainer: {
    height: 170, // Set a fixed height for the options container
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "left",
    backgroundColor: "#6886D2",
    color: colors.white,
    padding: 16,
    borderRadius: 4,
    fontFamily: fonts.ABold,
  },
  optionText: {
    fontSize: 14,
    marginBottom: 5,
    textAlign: "left",
    padding: 16,
    fontFamily: fonts.ARegular,
  },
};

export default ModalUi;
