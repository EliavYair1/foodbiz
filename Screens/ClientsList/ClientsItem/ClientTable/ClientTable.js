import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState, useMemo } from "react";
import colors from "../../../../styles/colors";
import { FlatList } from "react-native-gesture-handler";
import fonts from "../../../../styles/fonts";
import Loader from "../../../../utiles/Loader";
import ClientTableRow from "./ClientTableRow/ClientTableRow";
import ClientTableHeader from "./ClientTableHeader/ClientTableHeader";
const ClientTable = ({ getData, tableHeaders, reports, users }) => {
  const [reportsData, setReportsData] = useState([]);
  const [usersData, setusersData] = useState([]);
  const [filesData, setFilesData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [getData]);
  const fetchData = async () => {
    const fetchedreports = await getData.getReports();
    setReportsData(fetchedreports);

    const fetchedUsers = await getData.getUsers();
    setusersData(fetchedUsers);

    const fetchedFiles = await getData.getFiles();
    setFilesData(fetchedFiles);
    setLoading(false);
  };

  const memoizedReportsData = useMemo(() => reportsData, [reportsData]);
  const memoizedUsersData = useMemo(() => usersData, [usersData]);
  const memoizedFilesData = useMemo(() => filesData, [filesData]);
  const dataToDisplay = () => {
    if (reports) {
      return memoizedReportsData;
    } else if (users) {
      return memoizedUsersData;
    } else {
      return memoizedFilesData;
    }
  };
  const memorizedTables = useMemo(() => {
    return tableHeaders;
  }, [tableHeaders]);

  return (
    <View style={styles.container}>
      <ClientTableHeader memorizedArray={memorizedTables} />
      <View style={styles.hr}></View>
      {loading ? (
        <Loader />
      ) : (
        <FlatList
          data={dataToDisplay()}
          initialNumToRender={4}
          windowSize={4}
          keyExtractor={(item) => item.data?.id?.toString()}
          renderItem={({ item, index }) => (
            <ClientTableRow
              data={item.data}
              memorizedTables={memorizedTables}
            />
          )}
        />
      )}
    </View>
  );
};

export default React.memo(ClientTable);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
  tableHeadWrapper: {
    flexDirection: "row",
  },
  tableHeadStyle: {
    paddingVertical: 9,
    opacity: 0.6,
    alignSelf: "center",
    alignItems: "flex-start",
    paddingHorizontal: 12,
  },
  tableRow: {
    fontSize: 16,
    color: colors.black,
    fontFamily: fonts.ARegular,
    textAlign: "left",
    alignSelf: "center",
    paddingHorizontal: 12,
  },
  tableRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  hr: {
    borderBottomColor: "rgba(12, 20, 48, 0.1)",
    borderBottomWidth: 1,
    // marginVertical: 10,
    opacity: 0.6,
    marginHorizontal: 16,
  },

  evenTableRow: {
    backgroundColor: colors.lightGray,
  },
  oddTableRow: {
    backgroundColor: colors.white,
  },
  imgIcon: { width: 10, height: 12 },
  actionsContainer: { flexDirection: "row", flexBasis: 120, gap: 16 },
});
