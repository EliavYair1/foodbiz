import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Alert,
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
import { useSelector } from "react-redux";
import axios from "axios";
import Loader from "../../../../utiles/Loader";
const FileCategoryRow = ({
  children,
  items,
  icon,
  tableHeadText,
  stations,
  company,
}) => {
  const heightAnim = useRef(new Animated.Value(0)).current;
  const userId = useSelector((state) => state.user);
  const [openId, setOpenId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditFile, setIsEditFile] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const [fileObj, setFileObj] = useState(null);
  const [selectedItemName, setSelectedItemName] = useState(null);
  useMemo(() => {
    if (categoryId) {
      const selectedItem = items.find(
        (item) => JSON.parse(item.id) == categoryId
      );
      setSelectedItemName(selectedItem ? selectedItem.name : null);
    }
  }, [categoryId]);
  const handleDeleteFile = async (userId, fileId) => {
    // console.log("userId /fileId", userId, fileId);
    try {
      const response = await axios.post(
        process.env.API_BASE_URL + "api/deleteFile.php",
        {
          userId: userId,
          fileId: fileId,
        }
      );

      if (response.status == 200 || response.status == 201) {
        Alert.alert("הצלחה", "הקובץ נמחק בהצלחה");
      } else {
        Alert.alert("Error", "Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  const onCloseNewFileModal = () => {
    setModalVisible(!modalVisible);
  };
  // console.log(isEditFile);
  const handleItemClick = (itemId) => {
    setOpenId(itemId === openId ? null : itemId);
    setCategoryId(itemId);
    const selectedItem = items.find((item) => JSON.parse(item.id) == itemId);
    setSelectedItemName(selectedItem ? selectedItem.name : null);
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
            console.log("file", file.data);
            setIsEditFile(true);
            setFileObj(file.data);
            setIsEditFile(true);
            setModalVisible(true);
          },
        },
        {
          id: 3,
          icon: require("../../../../assets/imgs/Trash_icon.png"),
          isActive: (file) => {
            return true;
          },
          action: (file) => {
            // console.log("trash file", userId, file.data.id);
            handleDeleteFile(userId, file.data.id);
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
    // console.log(item.id);
    const handleEmptyFiles = () => {
      if (files.length === 0) {
        return null;
      } else if (isOpen) {
        return "v";
      } else {
        return "<";
      }
    };
    // todo make the files names dynamic
    // console.log("name:", item.name);
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
                buttonFunction={() => {
                  setModalVisible(!modalVisible);
                  setIsEditFile(false);
                  setCategoryId(item.id);
                }}
              />
            </View>
          </View>
        </TouchableOpacity>
        <Divider />
        {isOpen && (
          <View style={{}}>
            <ClientTable rowsData={item.getFiles()} headers={filesTable} />
          </View>
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
      {modalVisible && (
        <PopUp
          onCloseModal={onCloseNewFileModal}
          modalHeight={686}
          modalWidth={480}
          editFileObject={isEditFile ? fileObj : null}
          modalHeaderText={
            isEditFile
              ? `עריכה של קובץ בתיקיית ${selectedItemName} \n עבור ${company}`
              : `הוספה של קובץ בתיקיית ${selectedItemName}\n עבור ${company}`
          }
          selectWidth={400}
          categoryId={categoryId}
          stations={stations}
          animationType={"fade"}
          icon1={libraryIcon}
          icon2={CameraIcon}
        />
      )}
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
