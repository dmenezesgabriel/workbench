class Data {
  constructor(data) {
    this.data = data;
    this.filteredData = data;
  }

  filter(property, value) {
    this.filteredData = this.filteredData.filter((item) => item[property] === value);
    return this;
  }

  getCascadedFilteredData() {
    return this.filteredData;
  }
}

// Example usage
const data = [
  { id: 1, category: "A", status: "active" },
  { id: 2, category: "B", status: "inactive" },
  { id: 3, category: "A", status: "active" },
  { id: 4, category: "C", status: "active" },
  { id: 5, category: "B", status: "inactive" },
];

const dataset = new Data(data);

const filteredData = dataset.filter("category", "A").filter("status", "active").getCascadedFilteredData();

console.log(filteredData);
