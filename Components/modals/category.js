export default class Category {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.order = data.order;
    this.files = [];
  }
  getFiles() {
    return this.files;
  }

  getCategoryData(attr) {
    return this[attr];
  }
}
