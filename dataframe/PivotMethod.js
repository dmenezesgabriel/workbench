class DataFrame {
  constructor(data) {
    this.data = data;
  }

  pivot(index, columns, values) {
    const result = {};
    const indexValues = new Set();
    const columnValues = new Set();

    // Collect unique values for index and columns
    this.data.forEach((row) => {
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
    this.data.forEach((row) => {
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

    return pivotTable;
  }
}

// Example usage
const data = [
  { Country: "USA", Year: 2019, Sales: 1000 },
  { Country: "USA", Year: 2020, Sales: 1200 },
  { Country: "USA", Year: 2021, Sales: 1500 },
  { Country: "Canada", Year: 2019, Sales: 800 },
  { Country: "Canada", Year: 2020, Sales: 900 },
  { Country: "Canada", Year: 2021, Sales: 1100 },
];

const df = new DataFrame(data);
const pivotTable = df.pivot("Country", "Year", "Sales");
console.log(pivotTable);
