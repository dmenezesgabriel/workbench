class Filter {
  constructor(data) {
    this._data = data;
  }

  filter(condition) {
    const filteredData = [];
    for (const row of this._data) {
      if (condition(row)) {
        filteredData.push(row);
      }
    }
    return filteredData;
  }
}

export { Filter };
