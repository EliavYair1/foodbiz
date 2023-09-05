import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Share,
  Image,
  Dimensions,
  Alert,
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
import ClientItemArrow from "../../../assets/imgs/ClientItemArrow.png";
import "@env";
import * as WebBrowser from "expo-web-browser";
import useScreenNavigator from "../../../Hooks/useScreenNavigator";
import routes from "../../../Navigation/routes";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentClient } from "../../../store/redux/reducers/currentClientSlice";
import { getCurrentStation } from "../../../store/redux/reducers/getCurrentStation";
import { getCurrentReport } from "../../../store/redux/reducers/getCurrentReport";
import axios from "axios";
import Loader from "../../../utiles/Loader";
const windowWidth = Dimensions.get("screen").width;
const ClientItem = ({ client, tablePadding, logo }) => {
  const contentRef = useRef();
  const [open, setOpen] = useState(false);
  const arrayOfTabs = ["דוחות", "קבצים", "בעלי גישה"];
  const [activeTab, setActiveTab] = useState(arrayOfTabs[0]);
  const heightAnim = useRef(new Animated.Value(0)).current;
  const { navigateToRoute } = useScreenNavigator();
  const users = client.getUsers();
  const [filteredData, setFilteredData] = useState(users);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user);
  // tabs handler
  const handleTabPress = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  // accodrion handler
  const handleAccordionOpening = () => {
    setOpen(!open);
  };

  // accordion animation
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
  // console.log(currentReport.getData("id"));
  // console.log(userId);
  // todo to apply delete post.
  const DeleteReport = async (userId, reportId) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${process.env.API_BASE_URL}api/deleteReport.php`,
        {
          userId: userId,
          reportId: reportId,
        }
      );

      if (response.status == 200 || response.status == 201) {
        setIsLoading(false);
        Alert.alert("Success", "Post deleted successfully");
      } else {
        setIsLoading(false);
        Alert.alert("Error", "Failed to delete post");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error deleting post:", error);
    }
  };

  const lastReport = client.getLastReportData();
  const lastFiveReport = client.getLastFiveReportsData();
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
      width: "10%",
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
      width: "7.5%",
      data: "grade",
    },
    {
      id: 6,
      label: "סטטוס",
      width: "10%",
      data: "reportStatuses",
      backgroundColor: (color) => statusBgColor(color),
    },
    {
      id: 7,
      label: "פעולות",
      width: "25%",
      type: "actions",
      actions: [
        {
          id: 0,
          icon: require("../../../assets/imgs/Icon_feather-share.png"),

          isActive: (report) => {
            return true;
          },
          action: async (report) => {
            let url = `${report.getData("viewUrl")}`;

            const result = await Share.share({
              message: `להלן דוח מפודביז מתחנה ${report.getData(
                "station_name"
              )} מתאריך ${report.getData("timeOfReport")}\n${url}`,
            });
          },
        },
        {
          id: 1,
          icon: require("../../../assets/imgs/Eye_icon.png"),

          isActive: (report) => {
            return true;
          },
          action: async (report) => {
            let url = `${report.getData("viewUrl")}`;
            await WebBrowser.openBrowserAsync(url);
            console.log("eye", url);
          },
        },
        {
          id: 2,
          icon: require("../../../assets/imgs/Edit_icon.png"),

          isActive: (report) => {
            return report.data.status < 5;
          },
          action: (report) => {
            // console.log(report.getSafetyGrade());
            console.log("Edit_icon");
            dispatch(getCurrentStation(report.getReportStationName()));
            navigateToRoute(routes.ONBOARDING.WorkerNewReport);
            dispatch(getCurrentClient(client));
            dispatch(getCurrentReport(report));
          },
        },
        {
          id: 3,
          icon: require("../../../assets/imgs/Trash_icon.png"),

          isActive: (report) => {
            return report.data.status == 1;
          },
          action: (report) => {
            console.log("Trash_icon");
            // console.log(report.getData("id"));
            // todo
            // DeleteReport(userId, report.getData("id"));
            navigateToRoute(routes.ONBOARDING.SummeryScreen);
          },
        },
        {
          id: 4,
          icon: require("../../../assets/imgs/workPageIcon.png"),

          isActive: (report) => {
            return true;
          },
          action: async (report) => {
            let url = `${report.getData("workUrl")}`;
            await WebBrowser.openBrowserAsync(url);
            console.log("workPage icon", url);
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
      data: "station",
    },
  ];

  // handling nested tables
  const handleDisplayedTab = useMemo(() => {
    if (activeTab === "דוחות") {
      const reports = client.getReports();
      return <ClientTable rowsData={reports} headers={reportsTable} />;
    } else if (activeTab === "קבצים") {
      const files = client.getFilesCategory();
      const stations = client.getStations();
      return (
        <FileCategoryRow
          stations={stations}
          items={files}
          icon={fileIcon}
          tableHeadText={"קבצים"}
        ></FileCategoryRow>
      );
    } else {
      return <ClientTable rowsData={filteredData} headers={usersTable} />;
    }
  }, [activeTab, client, filteredData]);

  // styling

  // navigating on new report button (temp name)
  const newReportNavigation = () => {
    navigateToRoute(routes.ONBOARDING.WorkerNewReport);
  };

  // handling users filter on search bar
  const handleSearch = (filteredUsers) => {
    setFilteredData(filteredUsers);
  };

  const usersFilterFunction = (item, text) => {
    const name = item.getData("name");
    return name && name.includes(text);
  };

  const memoizedUsers = useMemo(() => users, [users]);

  const handleNewReport = () => {
    dispatch(getCurrentReport(null));
    dispatch(getCurrentClient(client));
    navigateToRoute(routes.ONBOARDING.WorkerNewReport);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.itemContainer, { maxWidth: windowWidth - 20 }]}
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
            {client.getCompany()}
          </Text>
        </View>

        <View style={{ alignSelf: "center", width: "15%" }}>
          <Text style={styles.subHeaderText}>
            {lastReport.data.timeOfReport}
          </Text>
          <Text
            style={[
              styles.statusText,
              {
                backgroundColor: statusBgColor(lastReport.data.reportStatuses),
              },
            ]}
          >
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
              buttonFunction={handleNewReport}
            />
          </View>

          <View style={{ alignSelf: "center", width: 52 }}>
            <Text>
              {open ? (
                <Image
                  source={ClientItemArrow}
                  style={{
                    width: 20,
                    height: 20,
                    transform: [{ rotate: "-90deg" }],
                  }}
                />
              ) : (
                <Image
                  source={ClientItemArrow}
                  style={{ width: 20, height: 20 }}
                />
              )}
            </Text>
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
            usersTab={activeTab === "בעלי גישה"}
            data={memoizedUsers}
            onSearch={handleSearch}
            filterFunction={usersFilterFunction}
          />
          {isLoading ? <Loader visible={isLoading} /> : handleDisplayedTab}
        </View>
      </Animated.View>
    </>
  );
};
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
export default React.memo(ClientItem);
