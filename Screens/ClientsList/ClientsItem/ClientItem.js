import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from "react-native";
import React, { useState, useRef, useEffect, useMemo } from "react";
import colors from "../../../styles/colors";
import fonts from "../../../styles/fonts";
import Accordion from "../../../Components/ui/Accordion";
import Button from "../../../Components/ui/Button";
import { Avatar, List } from "react-native-paper";
import Tabs from "../../../Components/ui/Tabs";
import ClientUsersTable from "./ClientUsersTable/ClientUsersTable";
import ClientFilesTable from "./ClientFilesTable/ClientFilesTable";
import ClientTable from "./ClientTable/ClientTable";
const ClientItem = ({ title, item }) => {
  const contentRef = useRef();
  const [open, setOpen] = useState(false);
  const arrayOfTabs = ["דוחות", "קבצים", "בעלי גישה"];
  const [activeTab, setActiveTab] = useState(arrayOfTabs[0]);
  const heightAnim = useRef(new Animated.Value(0)).current;

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };
  const handleClick = () => {
    setOpen(!open);
  };

  useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: open ? 320 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [open, heightAnim]);

  const lastReport = item.getLastReportData();
  const lastFiveReport = item.getLastFiveReportsData();

  const { haveCulinaryGrade, haveGrade, haveNutritionGrade, haveSafetyGrade } =
    lastReport.data;

  const reportsTable = useMemo(() => {
    return [
      {
        id: 0,
        label: "תחנה",
        width: "12.5%",
        data: "station_name",
      },
      {
        id: 1,
        label: "סוקר",
        width: "12.5%",
        data: "name",
      },
      {
        id: 2,
        label: "מלווה",
        width: "12.5%",
        data: "accompany",
      },
      {
        id: 3,
        label: "ת. סקירה",
        width: "12.5%",
        data: "timeOfReport",
      },
      {
        id: 4,
        label: "ת. עדכון",
        width: "12.5%",
        data: "timeLastSave",
      },
      {
        id: 5,
        label: "ציון",
        width: "5%",
        data: "grade",
      },
      {
        id: 6,
        label: "סטטוס",
        width: "12.5%",
        data: "reportStatuses",
      },
      {
        id: 7,
        label: "פעולות",
        width: "17.5%",
        type: "actions",
        actions: [
          {
            id: 0,
            icon: require("../../../assets/imgs/Icon_feather-share.png"),

            action: () => {
              console.log("share");
            },
          },
          {
            id: 1,
            icon: require("../../../assets/imgs/Eye_icon.png"),

            action: () => {
              console.log("eye");
            },
          },
          {
            id: 2,
            icon: require("../../../assets/imgs/Edit_icon.png"),

            action: () => {
              console.log("Edit_icon");
            },
          },
          {
            id: 3,
            icon: require("../../../assets/imgs/Trash_icon.png"),

            action: () => {
              console.log("Trash_icon");
            },
          },
        ],
      },
    ];
  });
  const filesTable = useMemo(() => {
    return [
      {
        id: 0,
        label: "תחנה",
        width: "12.5%",
        data: "station_name",
      },
      {
        id: 1,
        label: "סוקר",
        width: "12.5%",
        data: "name",
      },
      {
        id: 2,
        label: "מלווה",
        width: "12.5%",
        data: "accompany",
      },
      {
        id: 3,
        label: "ת. סקירה",
        width: "12.5%",
        data: "timeOfReport",
      },
      {
        id: 4,
        label: "ת. עדכון",
        width: "12.5%",
        data: "timeLastSave",
      },
      {
        id: 5,
        label: "ציון",
        width: "15%",
        data: "grade",
      },

      {
        id: 6,
        label: "פעולות",
        width: "20%",
        type: "actions",
        actions: [
          {
            id: 0,
            icon: require("../../../assets/imgs/Icon_feather-share.png"),

            action: () => {
              console.log("share");
            },
          },
          {
            id: 1,
            icon: require("../../../assets/imgs/Eye_icon.png"),

            action: () => {
              console.log("eye");
            },
          },
          {
            id: 2,
            icon: require("../../../assets/imgs/Edit_icon.png"),

            action: () => {
              console.log("Edit_icon");
            },
          },
          {
            id: 3,
            icon: require("../../../assets/imgs/Trash_icon.png"),

            action: () => {
              console.log("Trash_icon");
            },
          },
        ],
      },
    ];
  });
  const usersTable = useMemo(() => {
    return [
      {
        id: 0,
        label: "תחנה",
        width: "12.5%",
        data: "station_name",
      },
      {
        id: 1,
        label: "סוקר",
        width: "12.5%",
        data: "name",
      },
      {
        id: 2,
        label: "מלווה",
        width: "12.5%",
        data: "accompany",
      },
      {
        id: 3,
        label: "ת. סקירה",
        width: "12.5%",
        data: "timeOfReport",
      },
      {
        id: 4,
        label: "ת. עדכון",
        width: "12.5%",
        data: "timeLastSave",
      },
      {
        id: 5,
        label: "ציון",
        width: "5%",
        data: "grade",
      },
      {
        id: 6,
        label: "סטטוס",
        width: "12.5%",
        data: "reportStatuses",
      },
      {
        id: 7,
        label: "פעולות",
        width: "17.5%",
        type: "actions",
        actions: [
          {
            id: 0,
            icon: require("../../../assets/imgs/Icon_feather-share.png"),

            action: () => {
              console.log("share");
            },
          },
          {
            id: 1,
            icon: require("../../../assets/imgs/Eye_icon.png"),

            action: () => {
              console.log("eye");
            },
          },
          {
            id: 2,
            icon: require("../../../assets/imgs/Edit_icon.png"),

            action: () => {
              console.log("Edit_icon");
            },
          },
          {
            id: 3,
            icon: require("../../../assets/imgs/Trash_icon.png"),

            action: () => {
              console.log("Trash_icon");
            },
          },
        ],
      },
    ];
  });

  const handleDisplayedTab = () => {
    if (activeTab === "דוחות") {
      return <ClientTable item={item} tableHeaders={reportsTable} />;
    } else if (activeTab === "קבצים") {
      return <ClientTable item={item} tableHeaders={filesTable} />;
    } else {
      return <ClientTable item={item} tableHeaders={usersTable} />;
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.itemContainer} onPress={handleClick}>
        <Text
          style={{
            fontFamily: fonts.ASemiBold,
            color: colors.black,
            fontSize: 15,
            alignSelf: "center",
            textAlign: "left",
            minWidth: 100,
            marginRight: 100,
          }}
        >
          {title}
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignSelf: "center",
            flex: 1,
            gap: 52,
          }}
        >
          <View style={{ alignSelf: "center" }}>
            <Text style={styles.subHeaderText}>
              {lastReport.data.timeOfReport}
            </Text>
            <Text style={styles.subHeaderText}>
              {lastReport.data.reportStatuses}
            </Text>
          </View>
          <View>
            <Text style={styles.subHeaderText}>
              כללי :
              <Text style={{ fontFamily: fonts.ABold }}>
                {haveGrade ? lastReport.data.grade : null}
              </Text>
            </Text>
            <Text style={styles.subHeaderText}>
              בטיחות מזון:
              <Text style={{ fontFamily: fonts.ABold }}>
                {haveNutritionGrade ? lastReport.data.nutritionGrade : null}
              </Text>
            </Text>
            <Text style={styles.subHeaderText}>
              ציון בטיחות:
              <Text style={{ fontFamily: fonts.ABold }}>
                {haveSafetyGrade ? lastReport.data.safetyGrade : null}
              </Text>
            </Text>
            <Text style={styles.subHeaderText}>
              קולינארי:
              <Text style={{ fontFamily: fonts.ABold }}>
                {haveCulinaryGrade ? lastReport.data.culinaryGrade : null}
              </Text>
            </Text>
          </View>

          <View>
            <Text style={styles.subHeaderText}>
              כללי :
              <Text style={{ fontFamily: fonts.ABold }}>
                {lastFiveReport.grade}
              </Text>
            </Text>
            <Text style={styles.subHeaderText}>
              בטיחות מזון:
              <Text style={{ fontFamily: fonts.ABold }}>
                {lastFiveReport.nutritionGrade}
              </Text>
            </Text>
            <Text style={styles.subHeaderText}>
              ציון בטיחות:
              <Text style={{ fontFamily: fonts.ABold }}>
                {lastFiveReport.safetyGrade}
              </Text>
            </Text>
            <Text style={styles.subHeaderText}>
              קולינארי:
              <Text style={{ fontFamily: fonts.ABold }}>
                {lastFiveReport.culinaryGrade}
              </Text>
            </Text>
          </View>
        </View>
        <View style={{ alignSelf: "center" }}>
          <Button
            buttonText={"דוח חדש"}
            buttonStyle={styles.newReportButton}
            buttonTextStyle={styles.newReportButtonText}
            icon={true}
            IconColor={colors.white}
            iconSize={20}
            iconName={"plus"}
            buttonWidth={113}
            buttonFunction={() => console.log("new report")}
          />
        </View>
        <View style={{ alignSelf: "center", width: 52 }}>
          <Text>{open ? "v" : "^"}</Text>
        </View>
      </TouchableOpacity>

      <Animated.View
        ref={contentRef}
        style={[
          {
            overflow: "hidden",
            transitionProperty: "max-height",
            transitionDuration: "0.3s",
          },
          { height: heightAnim },
        ]}
      >
        <View style={{ height: 320, backgroundColor: colors.white }}>
          <Tabs
            tabs={arrayOfTabs}
            activeTab={activeTab}
            onTabPress={handleTabPress}
          />
          {handleDisplayedTab()}
        </View>
      </Animated.View>
    </>
  );
};

export default React.memo(ClientItem);

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: colors.white,
    padding: 20,
    marginVertical: 1,
    flexDirection: "row",
    height: 98,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 16,
    paddingHorizontal: 16,
    textAlign: "left",
    paddingVertical: 16,
    color: colors.white,
    fontFamily: fonts.ABold,
  },
  subHeaderText: {
    alignSelf: "flex-start",
    textAlign: "left",
    fontFamily: fonts.ARegular,
  },
  newReportButton: {
    borderRadius: 100,
    backgroundColor: colors.blue,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  newReportButtonText: {
    color: colors.white,
  },
});
