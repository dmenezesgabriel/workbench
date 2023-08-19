class Rename {
  constructor(data) {
    this._data = data;
  }

  rename(columns) {
    const renamedData = [];
    const columnKeys = Object.keys(columns);

    for (let i = 0; i < this._data.length; i++) {
      const row = this._data[i];
      const renamedRow = {};

      for (let j = 0; j < columnKeys.length; j++) {
        const prop = columnKeys[j];

        if (Object.prototype.hasOwnProperty.call(row, prop)) {
          renamedRow[columns[prop]] = row[prop];
        }
      }

      for (let prop in row) {
        if (!Object.prototype.hasOwnProperty.call(columns, prop)) {
          renamedRow[prop] = row[prop];
        }
      }

      renamedData.push(renamedRow);
    }

    return renamedData;
  }
}

export { Rename };
