import { observable } from "mobx";

export default class FileStore {
  @observable fileName = null;
  @observable isDirty = false;

  constructor(fileName) {
    if (fileName) {
      this.fileName = fileName;
    }
  }

  setFileName(fileName) {
    this.fileName = fileName;
  }

  setIsDirty(isDirty) {
    this.isDirty = isDirty;
  }
}
