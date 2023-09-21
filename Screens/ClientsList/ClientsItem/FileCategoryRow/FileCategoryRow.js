import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
} from "react-native";
import { List, Divider } from "react-native-paper";
import fonts from "../../../../styles/fonts";
import colors from "../../../../styles/colors";
import Tabs from "../../../../Components/ui/Tabs";
import Button from "../../../../Components/ui/Button";
import ClientTable from "../ClientTable/ClientTable";
import Category from "../../../../Components/modals/fileCategory";
import { FlatList } from "react-native-gesture-handler";
import * as WebBrowser from "expo-web-browser";
import plusIconBlack from "../../../../assets/imgs/plusIconblack.png";
import CameraIcon from "../../../../assets/imgs/CameraIcon.png";
import libraryIcon from "../../../../assets/imgs/libraryIcon.png";
import PopUp from "../../../../Components/ui/popUp";
import SelectMenu from "../../../../Components/ui/SelectMenu";
const FileCategoryRow = ({
  children,
  items,
  icon,
  tableHeadText,
  stations,
}) => {
  const heightAnim = useRef(new Animated.Value(0)).current;
  const [openId, setOpenId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const onCloseNewFileModal = () => {
    setModalVisible(!modalVisible);
  };
  const handleItemClick = (itemId) => {
    setOpenId(itemId === openId ? null : itemId);
  };
  useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: openId ? 320 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [openId, heightAnim]);

  const filesTable = [
    {
      id: 0,
      label: "תחנה",
      width: "20%",
      data: "station_name",
    },
    {
      id: 1,
      label: "שם הקובץ",
      width: "20%",
      data: "fileName",
    },
    {
      id: 2,
      label: "כותב",
      width: "20%",
      data: "authorName",
    },
    {
      id: 3,
      label: "תאריך",
      width: "20%",
      data: "date",
    },
    {
      id: 4,
      label: "פעולות",
      width: "20%",
      type: "actions",
      actions: [
        {
          id: 1,
          icon: require("../../../../assets/imgs/Eye_icon.png"),
          isActive: (file) => {
            return true;
          },

          action: async (file) => {
            console.log("eye", file.getData("url"));
            await WebBrowser.openBrowserAsync(file.getData("url"));
          },
        },
        {
          id: 2,
          icon: require("../../../../assets/imgs/Edit_icon.png"),
          isActive: (file) => {
            return true;
          },
          action: (file) => {
            console.log("Edit_icon", file.getData("url"));
          },
        },
        {
          id: 3,
          icon: require("../../../../assets/imgs/Trash_icon.png"),
          isActive: (file) => {
            return true;
          },
          action: (file) => {
            console.log("Trash_icon");
          },
        },
      ],
    },
  ];
  const renderItem = ({ item }) => {
    const isOpen = item.id === openId;
    const files = item.getFiles();
    // console.log(files);

    const handleEmptyFiles = () => {
      if (files.length === 0) {
        return null;
      } else if (isOpen) {
        return "v";
      } else {
        return "<";
      }
    };
    let arr = stations.map((element) => element);
    // console.log("arr:", arr);
    return (
      <>
        <TouchableOpacity
          onPress={() => (files.length === 0 ? null : handleItemClick(item.id))}
          key={item.id}
          style={styles.tablerowContainer}
        >
          <View style={styles.tableRowTextWrapper}>
            <Text style={styles.tableRowText}>
              <Text style={{ fontFamily: fonts.ABold, fontSize: 18 }}>
                {item.name}
              </Text>
              <Text style={{ fontFamily: fonts.ARegular, fontSize: 18 }}>
                ({files.length} {tableHeadText})
              </Text>
            </Text>
            <Image source={icon} style={styles.tableIcon} />
          </View>
          <View
            style={{
              flexDirection: "row-reverse",
              alignItems: "center",
              gap: 85,
            }}
          >
            <Text style={{ width: 10 }}>{handleEmptyFiles()}</Text>
            <View style={{ alignSelf: "center" }}>
              <Button
                buttonText={"קובץ חדש"}
                buttonStyle={styles.newReportButton}
                buttonTextStyle={styles.newReportButtonText}
                icon={true}
                iconPath={plusIconBlack}
                iconStyle={{ width: 16, height: 16 }}
                buttonWidth={113}
                buttonFunction={() => setModalVisible(!modalVisible)}
              />
            </View>
          </View>
        </TouchableOpacity>
        <Divider />
        {isOpen && (
          <View style={{ height: "100%" }}>
            <ClientTable rowsData={item.getFiles()} headers={filesTable} />
          </View>
        )}

        {modalVisible && (
          <PopUp
            isVisible={modalVisible}
            onCloseModal={onCloseNewFileModal}
            modalHeight={686}
            modalWidth={480}
            modalHeaderText={
              "הוספה / עריכה של קובץ בתיקיית אישורים\n עבור בנק הפועלים"
            }
            selectWidth={400}
            selectOptions={arr}
            animationType={"fade"}
            secondButtonFunction={() => {
              console.log("image picked");
            }}
            buttonText1={"מספריית התמונות"}
            buttonText2={"מצלמה"}
            icon1={libraryIcon}
            icon2={CameraIcon}
            buttonHeaderText="העלאת קובץ"
            selectHeader={"תחנה"}
            // inputData={arr}
            remarksInputText={"הערות"}
            submitText="שמירה"
            submitButtonFunction={() => {
              console.log("data saved");
            }}
            firstInputText={"שם הקובץ"}
            secondInputText={"שם הכותב"}
            thirdInputText={"תאריך"}
          />
        )}
      </>
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
  newReportButton: {
    borderRadius: 100,
    backgroundColor: colors.lightBlue,
    paddingHorizontal: 15,
    paddingVertical: 8,
    pointerEvents: "auto",
    zIndex: 10,
  },
  newReportButtonText: {
    color: colors.black,
  },
  tablerowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: "#EEF6FF",
  },
  tableRowTextWrapper: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
  },
  tableIcon: {
    width: 25,
    height: 25,
    alignSelf: "center",
    marginLeft: 10,
  },
  tableRowText: {},
});
export default FileCategoryRow;
