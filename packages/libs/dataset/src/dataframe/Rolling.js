class Rolling {
  constructor(data) {
    this._data = data;
  }

  rollingSum(partitionBy, orderBy, valueColumn, windowSize) {
    const sortedData = this._data.slice().sort((a, b) => {
      for (let i = 0; i < orderBy.length; i++) {
        const orderProp = orderBy[i];
        if (a[orderProp] < b[orderProp]) {
          return -1;
        }
        if (a[orderProp] > b[orderProp]) {
          return 1;
        }
      }
      return 0;
    });

    const rolledData = sortedData.map((row, index) => {
      const startIdx = Math.max(0, index - windowSize + 1);
      const endIdx = index + 1;
      const partitionData = sortedData.slice(startIdx, endIdx).filter((r) => {
        for (let i = 0; i < partitionBy.length; i++) {
          const prop = partitionBy[i];
          if (r[prop] !== row[prop]) {
            return false;
          }
        }
        return true;
      });

      const sum = partitionData.reduce((acc, r) => acc + r[valueColumn], 0);
      return { ...row, [`${valueColumn}_rollingSum`]: sum };
    });

    return rolledData;
  }
}

export { Rolling };
