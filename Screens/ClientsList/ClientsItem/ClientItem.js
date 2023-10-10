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
  Linking,
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
import { setReportsTimes } from "../../../store/redux/reducers/reportsTimesSlice";
import { setCurrentCategories } from "../../../store/redux/reducers/getCurrentCategories";
import Client from "../../../Components/modals/client";
import { setClients } from "../../../store/redux/reducers/clientSlice";
import FetchDataService from "../../../Services/FetchDataService";
const windowWidth = Dimensions.get("screen").width;
const ClientItem = ({ client, tablePadding, logo }) => {
  // console.log("ClientItem", client.getCompany());
  const contentRef = useRef();
  const { fetchData } = FetchDataService();
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
  const [tabHeight, setTabHeight] = useState(0);
  // tabs handler
  const handleTabPress = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  // accodrion handler
  const handleAccordionOpening = () => {
    setOpen(!open);
  };
  useEffect(() => {
    if (activeTab === "דוחות") {
      setTabHeight(800);
    } else if (activeTab === "קבצים") {
      setTabHeight(450);
    } else {
      // Set a default height for other tabs
      setTabHeight(500); // Replace DEFAULT_HEIGHT with your desired default height
    }
  }, [activeTab]);
  // accordion animation
  useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: open ? tabHeight : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [open, heightAnim, tabHeight]);

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
        const responseClients = await fetchData(
          process.env.API_BASE_URL + "api/clients.php",
          { id: userId }
        );
        if (responseClients.success) {
          let clients = [];
          responseClients.data.forEach((element) => {
            clients.push(new Client(element));
          });
          dispatch(setClients({ clients: clients }));
        }
        setIsLoading(false);
        Alert.alert("הצלחה", "הדוח נמחק בהצלחה");
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
  let haveCulinaryGrade = false;
  let haveGrade = false;
  let haveNutritionGrade = false;
  let haveSafetyGrade = false;
  if (lastReport && lastReport.data) {
    haveCulinaryGrade = lastReport.data.haveCulinaryGrade;
    haveGrade = lastReport.data.haveGrade;
    haveNutritionGrade = lastReport.data.haveNutritionGrade;
    haveSafetyGrade = lastReport.data.haveSafetyGrade;
  } else {
  }
  const lastFiveReport = client.getLastFiveReportsData();

  const reportsTable = [
    {
      id: 0,
      label: "תחנה",
      width: "10%",
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
      width: "15%",
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
            // return report.data.status < 5;
            return report.data.status == 1;
          },
          action: (report) => {
            // console.log(report.getSafetyGrade());
            console.log("Edit_icon", {
              id: userId,
              reportId: report.getData("id"),
            });
            fetchData(process.env.API_BASE_URL + "api/getReportData.php", {
              id: userId,
              reportId: report.getData("id"),
            }).then((reportData) => {
              report.setData("data", reportData.data);
              dispatch(getCurrentStation(report.getReportStationName()));
              dispatch(getCurrentClient(client));
              dispatch(getCurrentReport(report));
              navigateToRoute(routes.ONBOARDING.WorkerNewReport);
            });
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
            Alert.alert(
              "מחיקת דוח",
              "האם אתה בטוח שברצונך למחוק את הדוח?",
              [
                {
                  text: "כן",
                  style: "destructive",
                  onPress: () => {
                    DeleteReport(userId, report.getData("id"));
                  },
                },
                {
                  text: "לא",
                  onPress: () => {},
                  style: "cancel",
                },
              ],
              { cancelable: false }
            );
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
      formatter: (value) => {
        return (
          <TouchableOpacity
            onPress={() => Linking.openURL("mailto:" + value.trim())}
            style={{ fontSize: 10 }}
          >
            <Text selectable={true}>{value}</Text>
          </TouchableOpacity>
        );
      },
    },
    {
      id: 3,
      label: "טלפון",
      width: "16.6666667%",
      data: "phone",
      formatter: (value) => {
        return (
          <TouchableOpacity
            onPress={() => Linking.openURL("tel:" + value.trim())}
            style={{ fontSize: 10 }}
          >
            <Text selectable={true}>{value}</Text>
          </TouchableOpacity>
        );
      },
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
  // console.log(client);
  // handling nested tables
  const handleDisplayedTab = useMemo(() => {
    if (activeTab === "דוחות") {
      const reports = client.getReports();
      return <ClientTable rowsData={reports} headers={reportsTable} />;
    } else if (activeTab === "קבצים") {
      const files = client.getFilesCategory();
      const stations = client.getStations();
      const company = client.getCompany();
      // console.log(stations[]);
      return (
        <FileCategoryRow
          stations={stations}
          items={files}
          icon={fileIcon}
          tableHeadText={"קבצים"}
          company={company}
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
        style={[styles.itemContainer, { maxWidth: windowWidth }]}
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
          {logo ? (
            <Image
              source={{ uri: process.env.API_BASE_URL + logo }}
              style={{
                height: 20,
                width: 100,
                resizeMode: "contain",
              }}
            />
          ) : (
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
          )}
        </View>

        <View style={{ alignSelf: "center", width: "15%" }}>
          {lastReport && (
            <>
              <Text style={styles.subHeaderText}>
                {lastReport.getTimeOfReport()}
              </Text>
              <Text
                style={[
                  styles.statusText,
                  {
                    backgroundColor: statusBgColor(
                      lastReport.data.reportStatuses
                    ),
                  },
                ]}
              >
                {lastReport.data.reportStatuses}
              </Text>
            </>
          )}
        </View>

        <ReportDetails
          wrapperWidth={"14.5%"}
          lastReport={lastReport}
          haveGrade={haveGrade}
          haveNutritionGrade={haveNutritionGrade}
          haveSafetyGrade={haveSafetyGrade}
          haveCulinaryGrade={haveCulinaryGrade}
        />

        <View
          style={{
            width: "45.5%",
            flexDirection: "row",
            alignSelf: "center",
            flex: 1,
            gap: 52,
            justifyContent: "space-around",
          }}
        >
          <LastFiveReportDetails lastFiveReport={lastFiveReport} />
          <View
            style={{
              alignSelf: "center",
            }}
          >
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

          <View style={{ alignSelf: "center" }}>
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
                  style={{ width: 20, height: 20, resizeMode: "contain" }}
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
