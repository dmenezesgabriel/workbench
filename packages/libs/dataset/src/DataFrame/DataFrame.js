class DataFrame {
  constructor(data) {
    this._data = data;
    this.columns = Object.keys(this._data[0]);
  }

  toArray() {
    return this._data;
  }

  asType(convertObject) {
    const convertedData = [];
    const convertMap = {};

    for (const [key, targetType] of Object.entries(convertObject)) {
      if (targetType === "string") {
        convertMap[key] = String;
      } else if (targetType === "number") {
        convertMap[key] = Number;
      } else if (targetType === "boolean") {
        convertMap[key] = Boolean;
      } else if (targetType.type === "Date") {
        const options = targetType.options || {};
        convertMap[key] = (value) => {
          const formattedDate = new Date(value);
          if (options.format) {
            return formattedDate.toLocaleString(undefined, options.format);
          } else {
            return formattedDate;
          }
        };
      }
    }

    for (const row of this._data) {
      const convertedRow = {};
      for (const [key, value] of Object.entries(row)) {
        if (convertMap[key]) {
          convertedRow[key] = convertMap[key](value);
        } else {
          convertedRow[key] = value;
        }
      }
      convertedData.push(convertedRow);
    }

    return new DataFrame(convertedData);
  }

  groupBy(properties) {
    return new GroupedDataFrame(this._data, properties);
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

    return new DataFrame(rolledData);
  }

  pivot(index, columns, values) {
    const result = {};
    const indexValues = new Set();
    const columnValues = new Set();

    // Collect unique values for index and columns
    this._data.forEach((row) => {
      indexValues.add(row[index]);
      columnValues.add(row[columns]);
    });

    // Initialize result object
    indexValues.forEach((iv) => {
      result[iv] = {};
      columnValues.forEach((cv) => {
        result[iv][cv] = 0;
      });
    });

    // Perform aggregation
    this._data.forEach((row) => {
      const indexValue = row[index];
      const columnValue = row[columns];
      result[indexValue][columnValue] += row[values];
    });

    // Convert result to array of objects
    const pivotTable = [];
    indexValues.forEach((iv) => {
      const rowData = { [index]: iv };
      columnValues.forEach((cv) => {
        rowData[cv] = result[iv][cv];
      });
      pivotTable.push(rowData);
    });

    return new DataFrame(pivotTable);
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

    return new DataFrame(selectedData);
  }

  *[Symbol.iterator]() {
    for (let i = 0; i < this._data.length; i++) {
      yield this._data[i];
    }
  }

  filter(condition) {
    const filteredData = [];
    for (const row of this) {
      if (condition(row)) {
        filteredData.push(row);
      }
    }
    return new DataFrame(filteredData);
  }

  sort(col, ascending = true) {
    const sortedData = this._data.slice().sort((a, b) => {
      if (a[col] < b[col]) return ascending ? -1 : 1;
      if (a[col] > b[col]) return ascending ? 1 : -1;
      return 0;
    });
    return new DataFrame(sortedData);
  }

  count() {
    return this._data.length;
  }

  head(numLines = 5) {
    const linesToShow = this._data.slice(0, numLines);
    console.table(linesToShow);
    return new DataFrame(linesToShow);
  }

  tail(numLines = 5) {
    const linesToShow = this._data.slice(-numLines);
    console.table(linesToShow);
  }

  unique(property) {
    const uniqueValues = new Set();
    for (let i = 0, len = this._data.length; i < len; i++) {
      const value = this._data[i][property];
      uniqueValues.add(value);
    }
    return Array.from(uniqueValues);
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

    return new DataFrame(renamedData);
  }
  merge(otherDataFrame, on, how = "inner") {
    const mergedData = [];
    const selfData = this._data;
    const otherData = otherDataFrame._data;

    const mergeColumns = Array.isArray(on) ? on : [on];

    for (let i = 0; i < selfData.length; i++) {
      const selfRow = selfData[i];

      for (let j = 0; j < otherData.length; j++) {
        const otherRow = otherData[j];

        let isMatched = true;
        for (let k = 0; k < mergeColumns.length; k++) {
          const mergeColumn = mergeColumns[k];
          if (selfRow[mergeColumn] !== otherRow[mergeColumn]) {
            isMatched = false;
            break;
          }
        }

        if (isMatched) {
          const mergedRow = { ...selfRow, ...otherRow };
          mergedData.push(mergedRow);
        }
      }
    }

    if (mergedData.length === 0) {
      return new DataFrame([{}]); // Return an empty DataFrame if no matches found
    }

    if (how === "left") {
      const leftData = selfData
        .map((selfRow) => {
          let matchedOtherRows = otherData.filter((otherRow) => {
            let isMatched = true;
            for (let k = 0; k < mergeColumns.length; k++) {
              const mergeColumn = mergeColumns[k];
              if (selfRow[mergeColumn] !== otherRow[mergeColumn]) {
                isMatched = false;
                break;
              }
            }
            return isMatched;
          });
          if (matchedOtherRows.length > 0) {
            return matchedOtherRows.map((otherRow) => {
              return { ...selfRow, ...otherRow };
            });
          } else {
            return selfRow;
          }
        })
        .flat();
      return new DataFrame(leftData);
    }

    if (how === "right") {
      const rightData = otherData
        .map((otherRow) => {
          let matchedSelfRows = selfData.filter((selfRow) => {
            let isMatched = true;
            for (let k = 0; k < mergeColumns.length; k++) {
              const mergeColumn = mergeColumns[k];
              if (selfRow[mergeColumn] !== otherRow[mergeColumn]) {
                isMatched = false;
                break;
              }
            }
            return isMatched;
          });
          if (matchedSelfRows.length > 0) {
            return matchedSelfRows.map((selfRow) => {
              return { ...selfRow, ...otherRow };
            });
          } else {
            return otherRow;
          }
        })
        .flat();
      return new DataFrame(rightData);
    }

    if (how === "outer") {
      const outerData = [];
      for (let i = 0; i < selfData.length; i++) {
        const selfRow = selfData[i];
        let matchedOtherRows = otherData.filter((otherRow) => {
          let isMatched = true;
          for (let k = 0; k < mergeColumns.length; k++) {
            const mergeColumn = mergeColumns[k];
            if (selfRow[mergeColumn] !== otherRow[mergeColumn]) {
              isMatched = false;
              break;
            }
          }
          return isMatched;
        });
        if (matchedOtherRows.length > 0) {
          matchedOtherRows.forEach((otherRow) => {
            outerData.push({ ...selfRow, ...otherRow });
          });
        } else {
          outerData.push(selfRow);
        }
      }
      for (let j = 0; j < otherData.length; j++) {
        const otherRow = otherData[j];
        let matchedSelfRows = selfData.filter((selfRow) => {
          let isMatched = true;
          for (let k = 0; k < mergeColumns.length; k++) {
            const mergeColumn = mergeColumns[k];
            if (selfRow[mergeColumn] !== otherRow[mergeColumn]) {
              isMatched = false;
              break;
            }
          }
          return isMatched;
        });
        if (matchedSelfRows.length === 0) {
          outerData.push(otherRow);
        }
      }
      return new DataFrame(outerData);
    }

    return new DataFrame(mergedData);
  }
}

class GroupedDataFrame {
  constructor(data, properties) {
    this._data = data;
    this.properties = properties;
  }

  agg(aggregations) {
    const groupedData = groupData(this._data, this.properties);
    const aggregatedData = aggregateData(groupedData, aggregations);
    return new DataFrame(aggregatedData);
  }
}

// Helper function to group data based on specified properties
function groupData(data, properties) {
  return data.reduce((groups, row) => {
    const groupKey = properties.map((property) => row[property]).join("-");
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(row);
    return groups;
  }, {});
}

// Helper function to aggregate grouped data
function aggregateData(groupedData, aggregations) {
  return Object.entries(groupedData).map(([groupKey, groupData]) => {
    const aggregatedRow = { ...groupData[0] };
    Object.entries(aggregations).forEach(([property, aggregator]) => {
      if (aggregator === "sum") {
        aggregatedRow[property] = groupData.reduce(
          (sum, row) => sum + row[property],
          0
        );
      } else if (aggregator === "avg") {
        const sum = groupData.reduce((sum, row) => sum + row[property], 0);
        aggregatedRow[property] = sum / groupData.length;
      } else if (aggregator === "quartile") {
        const values = groupData
          .map((row) => row[property])
          .sort((a, b) => a - b);
        const q1 = calculateQuartile(values, 0.25);
        const q2 = calculateQuartile(values, 0.5);
        const q3 = calculateQuartile(values, 0.75);
        aggregatedRow[`${property}_q1`] = q1;
        aggregatedRow[`${property}_q2`] = q2;
        aggregatedRow[`${property}_q3`] = q3;
      }
    });
    return aggregatedRow;
  });
}

function calculateQuartile(values, percentile) {
  const index = (values.length - 1) * percentile;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const interpolation = index % 1;
  const lowerValue = values[lower];
  const upperValue = values[upper];
  return lowerValue + (upperValue - lowerValue) * interpolation;
}

export { DataFrame };
