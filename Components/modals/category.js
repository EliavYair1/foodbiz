export default class Category {
  constructor(categoryId, id, name, grades, critical, order, workerComment) {
    this.id = id;
    this.name = name;
    this.grades = grades;
    this.critical = critical;
    this.order = order;
    this.workerComment = workerComment;
    this.categoryId = categoryId;
  }
  getData(attr) {
    return this[attr];
  }
}
