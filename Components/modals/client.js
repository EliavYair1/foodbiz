import LastFiveReports from "./LastFiveReport";
import LastReport from "./LastReport";
import FileCategory from "./fileCategory";
import Report from "./report";
import Station from "./station";
import User from "./user";
export default class Client {
  constructor(data) {
    this.id = data.id;
    this.company = data.company;
    this.hoursToRemindFirst = data.hoursToRemindFirst;
    this.hoursToRemindSecond = data.hoursToRemindSecond;
    this.active = data.active;
    this.order = data.order;
    this.logo = data.logo;

    this.reports = [];
    this.files_catgories = [];
    this.users = [];
    this.stations = data.stations;
    // this.stations = [];

    this.lastReport = data.last_report ? new Report(data.last_report) : null;
    this.last_five_reports = data.last_five_reports;
    this.createReportsModels(data.reports);
    this.createCategoriesModels(data.files_catgories);
    this.createUsersModels(data.users);
    // this.createStationsModels(data.stations);
  }
  createReportsModels(reports) {
    reports.forEach((element) => {
      this.reports.push(new Report(element));
    });
  }
  createCategoriesModels(catgories) {
    catgories.forEach((element) => {
      this.files_catgories.push(new FileCategory(element));
    });
  }

  createUsersModels(users) {
    users.forEach((element) => {
      this.users.push(new User(element));
    });
  }

  // createStationsModels(stations) {
  //   stations.forEach((element) => {
  //     this.stations.push(new Station(element));
  //   });
  // }
  getLastReportData() {
    return this.lastReport;
  }

  getStations() {
    return this.stations;
  }

  getLastFiveReportsData() {
    return this.last_five_reports;
  }
  getReports() {
    return this.reports;
  }
  getUsers() {
    return this.users;
  }
  getFilesCategory() {
    return this.files_catgories;
  }
  getCompany() {
    return this.company;
  }
  getData(attr) {
    return this[attr];
  }
}
