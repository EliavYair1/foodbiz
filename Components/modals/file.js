export default class File {
  constructor(data) {
    this.data = data;
  }

  getData(attr) {
    return this.data[attr];
  }
}
