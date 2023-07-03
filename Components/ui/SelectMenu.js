import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import {
  Button,
  Menu,
  Divider,
  PaperProvider,
  HelperText,
} from "react-native-paper";
import { FlatList } from "react-native-gesture-handler";
import selectorIcon from "../../assets/imgs/selectorIcon.png";
import fonts from "../../styles/fonts";
import colors from "../../styles/colors";
import { useForm, Controller } from "react-hook-form";
import uuid from "uuid-random";
const SelectMenu = ({
  selectOptions,
  selectWidth,
  control,
  name,
  errorMessage,
  onChange,
  optionsHeight,
  optionsCenterView,
  centeredViewStyling,
  optionsLocation,
  propertyName = false,
  selectMenuStyling,
  returnObject = false,
}) => {
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const handleItemPick = (item) => {
    setSelectedItem(item);
    console.log("item selected:", item);
    onChange(item);
    closeMenu();
  };

  const styles = StyleSheet.create({
    container: {
      paddingTop: 50,
    },
    menuItemText: {
      fontFamily: fonts.AMedium,
      fontSize: 16,
      // color: errorMessage && !selectedItem ? "#b3261e" : colors.black,
    },
    button: {
      width: selectWidth,
      borderWidth: errorMessage && !selectedItem ? 2 : 1,
      padding: 10,
      borderRadius: 4,
      justifyContent: "space-between",
      flexDirection: "row-reverse",
      borderColor:
        errorMessage && !selectedItem ? "#b3261e" : "rgba(12, 20, 48, 0.2)",
      borderRadius: 8,
      paddingVertical: 12,
      alignItems: "center",
    },
    dropdownContainer: {
      alignItems: "center",
      justifyContent: "center",
    },
    menu: {
      marginTop: 10,
    },
    selectedItemText: {
      marginTop: 20,
      fontSize: 16,
    },
    menuItem: {
      width: selectWidth,
      justifyContent: "center",
      alignItems: "center",
      borderColor: "rgba(12, 20, 48, 0.2)",
      borderRadius: 8,
      backgroundColor: colors.white,
      paddingVertical: 12,
      zIndex: 20,
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: optionsCenterView,
      marginTop: optionsLocation,
      marginRight: 0,
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      // padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      height: optionsHeight,
    },
  });

  const renderMenuItem = ({ item, idx }) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.menuItem}
        onPress={() =>
          handleItemPick(
            returnObject
              ? item
              : item.getData
              ? item.getData(propertyName)
              : item[propertyName]
          )
        }
      >
        <Text style={styles.menuItemText}>
          {item.getData ? item.getData(propertyName) : item[propertyName]}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange } }) => (
          <View
            style={[
              {
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              },
              selectMenuStyling ?? "",
            ]}
          >
            <Menu
              visible={visible}
              onDismiss={closeMenu}
              contentStyle={{
                backgroundColor: "white",
              }}
              anchor={
                <TouchableOpacity onPress={openMenu}>
                  <View style={styles.button}>
                    <Image
                      source={selectorIcon}
                      style={{
                        width: 12.5,
                        height: 12.5,
                      }}
                    />
                    <Text style={styles.menuItemText}>
                      {selectedItem
                        ? returnObject
                          ? selectedItem.getData
                            ? selectedItem.getData(propertyName)
                            : selectedItem[propertyName]
                          : selectedItem
                        : "בחירה"}
                    </Text>
                  </View>
                </TouchableOpacity>
              }
            >
              <Modal
                animationType="fade"
                transparent={true}
                visible={visible}
                onRequestClose={closeMenu}
                style={{ alignItems: "flex-end", justifyContent: "flex-end" }}
              >
                <TouchableWithoutFeedback onPress={closeMenu}>
                  <View
                    style={[styles.centeredView, centeredViewStyling ?? ""]}
                  >
                    <View style={styles.modalView}>
                      <FlatList
                        data={selectOptions}
                        keyExtractor={(option) => uuid()}
                        renderItem={renderMenuItem}
                        ItemSeparatorComponent={Divider}
                      />
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            </Menu>
            {errorMessage && (
              <HelperText
                type="error"
                style={{
                  fontFamily: fonts.AMedium,
                }}
              >
                {selectedItem ? null : errorMessage}
              </HelperText>
            )}
          </View>
        )}
      />
    </>
  );
};

export default SelectMenu;
