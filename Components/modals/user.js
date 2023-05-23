export default class User {
  constructor(data) {
    // this.accessId = data.accessId;
    // this.active_user = data.active_user;
    // this.clientUserId = data.clientUserId;
    // this.email = data.email;
    // this.id = data.id;
    // this.name = data.name;
    // this.phone = data.phone;
    // this.receivingReminders = data.receivingReminders;
    // this.role = data.role;
    // this.station_name = data.station_name;
    // this.type = data.type;
    this.data = data;
  }

  getUserData(attr) {
    return this.data[attr];
  }
  getUserData(attr) {
    return this[attr];
  }
}
{
  /* <TouchableOpacity style={styles.itemContainer} onPress={handleClick}>
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
    <Text style={styles.subHeaderText}>{lastReportDate}</Text>
    <Text style={styles.subHeaderText}>{lastReportStatus}</Text>
  </View>
  <View>
    <Text style={styles.subHeaderText}>
      כללי :{lastReport.getGrade()}
    </Text>
    <Text style={styles.subHeaderText}>
      בטיחות מזון: {lastReport.getNutritionGrade()}
    </Text>
    <Text style={styles.subHeaderText}>
      ציון בטיחות: {lastReport.getSafetyGrade()}
    </Text>
    <Text style={styles.subHeaderText}>
      קולינארי: {lastReport.getCulinaryGrade()}
    </Text>
  </View>
  <View>
    <Text style={styles.subHeaderText}>
      כללי :{lastFiveReports.getGrade()}
    </Text>
    <Text style={styles.subHeaderText}>
      בטיחות מזון:{lastFiveReports.getNutritionGrade()}
    </Text>
    <Text style={styles.subHeaderText}>
      ציון בטיחות:{lastFiveReports.getSafetyGrade()}
    </Text>
    <Text style={styles.subHeaderText}>
      קולינארי: {lastFiveReports.getCulinaryGrade()}
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
</TouchableOpacity> */
}
