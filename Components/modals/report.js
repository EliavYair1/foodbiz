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

  getReportStatuses() {
    return this.data.reportStatuses;
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

  getData(attr) {
    return this.data[attr];
  }
}

// report data to be fetch
/* 
1.safetyGrade
2.grade
3.culinaryGrade
4.status
5.timeOfReport
6.nutritionGrade
7.reportStatuses
*/
