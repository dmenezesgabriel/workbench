class Series {
  constructor(data) {
    this._data = data;
  }

  map(callback) {
    const newData = this._data.map(callback);
    return new Series(newData);
  }

  filter(callback) {
    const newData = this._data.filter(callback);
    return new Series(newData);
  }

  unique() {
    const uniqueValues = [...new Set(this._data)];
    return new Series(uniqueValues);
  }

  head(n = 5) {
    const slicedData = this._data.slice(0, n);
    return new Series(slicedData);
  }

  tail(n = 5) {
    const slicedData = this._data.slice(-n);
    return new Series(slicedData);
  }
}
export { Series };
