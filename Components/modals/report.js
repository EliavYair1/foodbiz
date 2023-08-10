export default class Report {
  constructor(data) {
    this.data = data;
  }
  getSafetyGrade() {
    return this.data.safetyGrade;
  }
  getGrade() {
    return this.data.grade;
  }
  getCulinaryGrade() {
    return this.data.culinaryGrade;
  }
  getNutritionGrade() {
    return this.data.nutritionGrade;
  }
  getTimeOfReport() {
    return this.data.timeOfReport;
  }
  getCategoriesData() {
    return this.data.data;
  }
  getReportStatuses() {
    return this.data.reportStatuses;
  }

  getReportTime() {
    return this.data.reportTime;
  }
  getStatus() {
    return this.data.status;
  }
  getReportStationName() {
    return this.data.station_name;
  }
  getName() {
    return this.data.name;
  }
  getTimeLastSave() {
    return this.data.timeLastSave;
  }
  getAccompany() {
    return this.data.accompany;
  }
  setData(attr, data) {
    this.data[attr] = data;
  }

  getData(attr) {
    return this.data[attr];
  }
}
