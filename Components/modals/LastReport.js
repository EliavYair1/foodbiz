export default class LastReport {
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

  getLastReportData(attr) {
    return this.data[attr] ?? {};
  }
}
