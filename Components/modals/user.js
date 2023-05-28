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
