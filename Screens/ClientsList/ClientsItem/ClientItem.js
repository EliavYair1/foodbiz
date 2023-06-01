import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from "react-native";
import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import colors from "../../../styles/colors";
import fonts from "../../../styles/fonts";
import Button from "../../../Components/ui/Button";
import Tabs from "../../../Components/ui/Tabs";
import ClientTable from "./ClientTable/ClientTable";
import FileCategoryRow from "./FileCategoryRow/FileCategoryRow";
import LastFiveReportDetails from "./GradeReport/LastFiveReportDetails";
import ReportDetails from "./GradeReport/ReportDetails";
import fileIcon from "../../../assets/imgs/fileIcon.png";
import plusIconWhite from "../../../assets/imgs/plusIconWhite.png";

const ClientItem = ({ title, data, tablePadding, logo }) => {
  const contentRef = useRef();
  const [open, setOpen] = useState(false);
  const arrayOfTabs = ["דוחות", "קבצים", "בעלי גישה"];
  const [activeTab, setActiveTab] = useState(arrayOfTabs[0]);
  const heightAnim = useRef(new Animated.Value(0)).current;

  // tabs handler
  const handleTabPress = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  // accodrion handler
  const handleAccordionOpening = () => {
    setOpen(!open);
  };

  useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: open ? 800 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [open, heightAnim]);

  // defining the color of the last report status background color
  const statusBgColor = (status) => {
    if (status == "נשלח ללקוח") {
      return colors.statusSentToClient;
    } else if (status == "בתהליך כתיבה") {
      return colors.statusProcess;
    } else if (status == "סגור") {
      return colors.statusClose;
    } else if (status == "נשלח לאישור מנהל") {
      return colors.statusSentForApproval;
    } else {
      return colors.statusReturnWithRemarks;
    }
  };

  const lastReport = data.getLastReportData();
  const lastFiveReport = data.getLastFiveReportsData();
  const { haveCulinaryGrade, haveGrade, haveNutritionGrade, haveSafetyGrade } =
    lastReport.data;
  const reportsTable = [
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
      backgroundColor: (color) => statusBgColor(color),
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

          isActive: (report) => {
            return true;
          },
          action: () => {
            console.log("share");
          },
        },
        {
          id: 1,
          icon: require("../../../assets/imgs/Eye_icon.png"),

          isActive: (report) => {
            return true;
          },
          action: () => {
            console.log("eye");
          },
        },
        {
          id: 2,
          icon: require("../../../assets/imgs/Edit_icon.png"),

          isActive: (report) => {
            return true;
          },
          action: () => {
            console.log("Edit_icon");
          },
        },
        {
          id: 3,
          icon: require("../../../assets/imgs/Trash_icon.png"),

          isActive: (report) => {
            return report.grade == 87;
          },
          action: () => {
            console.log("Trash_icon");
          },
        },
      ],
    },
  ];
  const usersTable = [
    {
      id: 0,
      label: "שם מלא",
      width: "16.6666667%",
      data: "name",
    },
    {
      id: 1,
      label: "תפקיד",
      width: "16.6666667%",
      data: "role",
    },
    {
      id: 2,
      label: "דוא״ל",
      width: "16.6666667%",
      data: "email",
    },
    {
      id: 3,
      label: "טלפון",
      width: "16.6666667%",
      data: "phone",
    },
    {
      id: 4,
      label: "מקבל מייל",
      width: "16.6666667%",
      data: "receivingReminders",
    },
    {
      id: 5,
      label: "תחנה",
      width: "16.6666667%",
      data: "station_name",
    },
  ];

  // handling nested tables
  const handleDisplayedTab = useMemo(() => {
    if (activeTab === "דוחות") {
      const reports = data.getReports();
      return <ClientTable rowsData={reports} headers={reportsTable} />;
    } else if (activeTab === "קבצים") {
      const files = data.getFilesCategory();
      // console.log("files", files);
      return (
        <FileCategoryRow
          items={files}
          icon={fileIcon}
          tableHeadText={"קבצים"}
        ></FileCategoryRow>
      );
    } else {
      const users = data.getUsers();
      return <ClientTable rowsData={users} headers={usersTable} />;
    }
  }, [activeTab, data]);

  const styles = StyleSheet.create({
    itemContainer: {
      backgroundColor: colors.white,
      // padding: 20,
      marginVertical: 1,
      flexDirection: "row",
      height: 98,
      paddingHorizontal: 12,
    },
    title: {
      fontSize: 16,
      paddingHorizontal: 16,
      textAlign: "left",
      paddingVertical: 16,
      color: colors.white,
      fontFamily: fonts.ABold,
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
    subHeaderText: {
      alignSelf: "flex-start",
      textAlign: "left",
      fontFamily: fonts.ARegular,
    },
    statusText: {
      alignSelf: "flex-start",
      textAlign: "left",
      fontFamily: fonts.ARegular,
      backgroundColor: statusBgColor(lastReport.data.reportStatuses),
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    buttonIcon: {
      width: 20,
      height: 20,
    },
    tableContentHight: {
      height: 600,
    },
  });
  return (
    <>
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={handleAccordionOpening}
      >
        <View
          style={{
            width: "25%",
            alignSelf: "center",
            flexDirection: "row",
            justifyContent: "flex-start",
          }}
        >
          <Text
            style={{
              fontFamily: fonts.ASemiBold,
              color: colors.black,
              fontSize: 15,
              alignSelf: "center",
              textAlign: "left",
              // width: "25%",
            }}
          >
            {logo}
          </Text>
          <Text
            style={{
              fontFamily: fonts.ASemiBold,
              color: colors.black,
              fontSize: 15,

              textAlign: "left",
            }}
          >
            {title}
          </Text>
        </View>

        <View style={{ alignSelf: "center", width: "15%" }}>
          <Text style={styles.subHeaderText}>
            {lastReport.data.timeOfReport}
          </Text>
          <Text style={styles.statusText}>
            {lastReport.data.reportStatuses}
          </Text>
        </View>

        <ReportDetails
          lastReport={lastReport}
          haveGrade={haveGrade}
          haveNutritionGrade={haveNutritionGrade}
          haveSafetyGrade={haveSafetyGrade}
          haveCulinaryGrade={haveCulinaryGrade}
        />

        <View
          style={{
            flexDirection: "row",
            alignSelf: "center",
            flex: 1,
            gap: 52,
            width: "40%",
          }}
        >
          <LastFiveReportDetails lastFiveReport={lastFiveReport} />
          <View style={{ alignSelf: "center" }}>
            <Button
              buttonText={"דוח חדש"}
              buttonStyle={styles.newReportButton}
              buttonTextStyle={styles.newReportButtonText}
              icon={true}
              iconPath={plusIconWhite}
              iconStyle={styles.buttonIcon}
              buttonWidth={113}
              buttonFunction={() => console.log("new report")}
            />
          </View>

          <View style={{ alignSelf: "center", width: 52 }}>
            <Text>{open ? "v" : "^"}</Text>
          </View>
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
        <View style={[{ backgroundColor: colors.white, height: "100%" }]}>
          <Tabs
            tabs={arrayOfTabs}
            activeTab={activeTab}
            onTabPress={handleTabPress}
            tablePadding={tablePadding}
          />
          {handleDisplayedTab}
        </View>
      </Animated.View>
    </>
  );
};

export default React.memo(ClientItem);
