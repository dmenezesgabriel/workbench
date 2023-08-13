class Unique {
  constructor(data) {
    this._data = data;
  }
  unique(property) {
    const uniqueValues = new Set();
    for (let i = 0, len = this._data.length; i < len; i++) {
      const value = this._data[i][property];
      uniqueValues.add(value);
    }
    return Array.from(uniqueValues);
  }
}

export { Unique };
