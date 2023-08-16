class Select {
  constructor(data) {
    this._data = data;
  }

  select(...cols) {
    const selectedData = [];
    for (let i = 0; i < this._data.length; i++) {
      const row = this._data[i];
      const selectedRow = {};
      for (let j = 0; j < cols.length; j++) {
        const col = cols[j];
        if (row.hasOwnProperty(col)) {
          selectedRow[col] = row[col];
        }
      }
      selectedData.push(selectedRow);
    }

    return selectedData;
  }
}

export { Select };
