export default class Station {
  constructor(data) {
    this.data = data;
  }
  getData(attr) {
    return this[attr];
  }
}
