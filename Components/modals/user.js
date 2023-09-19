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

  getStationName() {
    if (this.getData("type") == 1) {
      return "כל התחנות";
    } else {
      return this.getData("station_name");
    }
  }

  getReceivingReminders() {
    return this.data.receivingReminders ==1 ? "כן" : "לא"
  }

  getData(attr) {
    if (attr == "station") {
      return this.getStationName();
    }
    if (attr == "receivingReminders") {
      return this.getReceivingReminders();
    }
    return this.data[attr];
  }
}
