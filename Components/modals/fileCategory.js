import File from "./file";

export default class FileCategory {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.order = data.order;
    this.files = [];

    if (data.files && data.files.length > 0) {
      this.createFilesModels(data.files);
    }
  }

  createFilesModels(files) {
    files.forEach((element) => {
      this.files.push(new File(element));
    });
  }

  getFiles() {
    return this.files;
  }

  getCategoryData(attr) {
    return this[attr];
  }
}
