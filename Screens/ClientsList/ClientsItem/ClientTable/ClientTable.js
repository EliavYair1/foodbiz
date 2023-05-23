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
const ClientTable = ({ item, tableHeaders }) => {
  const [reportsData, setReportsData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchReportsData = async () => {
      const data = await item.getReports();
      setReportsData(data);
    };
    setLoading(false);
    fetchReportsData();
  }, [item]);

  const memoizedReportsData = useMemo(() => reportsData, [reportsData]);
  const memorizedTables = useMemo(() => {
    return tableHeaders;
  }, [tableHeaders]);

  // table rows
  const TableRow = React.memo(({ data }) => {
    return (
      <View style={styles.tableRowContainer}>
        {memorizedTables.map((item, idx) => {
          if (item.type === "actions") {
            return (
              <View
                key={item.id}
                style={{ ...styles.actionsContainer, flexBasis: item.width }}
              >
                {item.actions.map((action) => {
                  return (
                    <TouchableOpacity onPress={action.action} key={action.id}>
                      <Image source={action.icon} style={styles.imgIcon} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            );
          } else {
            return (
              <View style={styles.tableRowContainer} key={item.id}>
                <Text style={{ ...styles.tableRow, flexBasis: item.width }}>
                  {data[item.data]}
                </Text>
              </View>
            );
          }
        })}
      </View>
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.tableHeadWrapper}>
        {memorizedTables.map((item, idx) => {
          return (
            <View
              key={item.id}
              style={{
                ...styles.tableHeadStyle,
                flexBasis: item.width,
              }}
            >
              <Text>{item.label}</Text>
            </View>
          );
        })}
      </View>
      <View style={styles.hr}></View>
      {loading ? (
        <Loader />
      ) : (
        <FlatList
          data={memoizedReportsData}
          initialNumToRender={4}
          windowSize={4}
          keyExtractor={(item) => item.data.id.toString()}
          renderItem={({ item, index }) => <TableRow data={item.data} />}
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
