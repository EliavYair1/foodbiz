import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  Platform,
  Dimensions,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import ScreenWrapper from "../../../../../utiles/ScreenWrapper";
import GoBackNavigator from "../../../../../utiles/GoBackNavigator";
import Header from "../../../../../Components/ui/Header";
import { LinearGradient } from "expo-linear-gradient";
import Drawer from "../../../../../Components/ui/Drawer";
import FileIcon from "../../../../../assets/icons/iconImgs/FileIcon.png";
import uploadIcon1 from "../../../../../assets/imgs/plusIconDark.png";
import uploadIcon2 from "../../../../../assets/imgs/libraryIcon.png";
import uploadIcon3 from "../../../../../assets/imgs/CameraIcon.png";
import colors from "../../../../../styles/colors";
import fonts from "../../../../../styles/fonts";
import SummaryAndNote from "../innerComponents/SummaryAndNote";
import Button from "../../../../../Components/ui/Button";
import { FlatList } from "react-native-gesture-handler";
import ButtonGroup from "./ButtonGroupNew";
const windowWidth = Dimensions.get("window").width;
const SummeryScreen = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerRef = useRef();

  //   ? drawer logic
  // * Drawer
  const handleDrawerToggle = (isOpen) => {
    setIsDrawerOpen(isOpen);
  };

  const closeDrawer = () => {
    if (drawerRef.current) {
      drawerRef.current.closeDrawer();
      setIsDrawerOpen(false);
    }
  };
  // handling the form changes
  const handleFormChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setIsSchemaValid(true);
  };
  return (
    <ScreenWrapper edges={[]} wrapperStyle={{}}>
      <GoBackNavigator
        text={"חזרה לרשימת הלקוחות"}
        containerStyling={{ marginTop: 16 }}
      />
      <View>
        <Header
          HeaderText={"מסך סיכום"}
          containerStyling={{ marginTop: 27.5, marginBottom: 23.5 }}
          iconList={true}
          onCategoriesIconPress={() => console.log("categories pressed")}
        />
      </View>

      <SummaryAndNote
        header={"פידבק חיובי"}
        height={160}
        verticalSpace={16}
        summaryAndNoteContent={<Text>hello</Text>}
      />

      <ButtonGroup
        headerText={"העלאת קבצים 1"}
        firstButtonFunc={() => {
          console.log("button 2 pressed");
        }}
        handleFormChange={handleFormChange}
      />
      <ButtonGroup
        headerText={"העלאת קבצים 2"}
        firstButtonFunc={() => {
          console.log("button 4 pressed");
        }}
        handleFormChange={handleFormChange}
      />
      <SummaryAndNote
        header={"ציונים בדוח"}
        height={160}
        verticalSpace={16}
        summaryAndNoteContent={<Text>hello</Text>}
      />

      <SafeAreaView
        style={{
          flex: 1,
          width: windowWidth,
          marginBottom: Platform.OS === "ios" ? 50 : 100,
          alignSelf: "center",
        }}
      >
        <Drawer
          ref={drawerRef}
          closeDrawer={closeDrawer}
          content={
            <LinearGradient
              colors={["#37549D", "#26489F"]}
              start={[0, 0]}
              end={[1, 0]}
              style={{
                width: "100%",
                padding: 16,
                height: 76,
                zIndex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                  textAlign: "center",
                  width: "40%",

                  gap: 12,
                }}
              >
                <Image source={FileIcon} style={{ width: 24, height: 24 }} />
                <Text
                  style={{
                    justifyContent: "center",
                    alignSelf: "center",
                    color: colors.white,
                    fontSize: 24,
                    fontFamily: fonts.ABold,
                  }}
                >
                  תמצית והערות
                </Text>
              </View>
            </LinearGradient>
          }
          height={0}
          onToggle={handleDrawerToggle}
          contentStyling={{ padding: 0 }}
        />
      </SafeAreaView>
    </ScreenWrapper>
  );
};

export default SummeryScreen;

const styles = StyleSheet.create({});
