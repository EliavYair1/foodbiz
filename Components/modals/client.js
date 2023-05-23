import LastFiveReports from "./LastFiveReport";
import LastReport from "./LastReport";
import Category from "./category";
import Report from "./report";
import User from "./user";
export default class Client {
  constructor(data) {
    this.id = data.id;
    this.company = data.company;
    this.hoursToRemindFirst = data.hoursToRemindFirst;
    this.hoursToRemindSecond = data.hoursToRemindSecond;
    this.active = data.active;
    this.order = data.order;

    this.reports = [];
    this.files_catgories = [];
    this.users = [];

    this.lastReport = data.last_report ? new Report(data.last_report) : null;
    this.last_five_reports = data.last_five_reports;
    this.createReportsModels(data.reports);
    this.createCategoriesModels(data.files_catgories);
    this.createUsersModels(data.users);
  }

  // createLastReportModal(last_report) {
  //   this.lastReport = new Report(last_report);
  // }

  createReportsModels(reports) {
    reports.forEach((element) => {
      this.reports.push(new Report(element));
    });
  }
  createCategoriesModels(catgories) {
    catgories.forEach((element) => {
      this.files_catgories.push(new Category(element));
    });
  }

  createUsersModels(users) {
    users.forEach((element) => {
      this.users.push(new User(element));
    });
  }
  getLastReportData() {
    return this.lastReport;
  }
  getLastFiveReportsData() {
    return this.last_five_reports;
  }
  getReports() {
    return this.reports;
  }

  getData(attr) {
    return this[attr];
  }
}
