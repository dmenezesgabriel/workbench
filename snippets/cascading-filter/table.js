class Table {
  constructor() {
    this.tbody = document.querySelector("tbody");
  }

  updateTable(data, filters, dimensionNames) {
    const selectedFilters = filters.map((filter) =>
      filter.getSelectedOptions()
    );

    const filteredData = this.filterData(data, selectedFilters, dimensionNames);

    this.renderTable(filteredData);
  }

  filterData(data, selectedFilters, dimensionNames) {
    return data.filter((item) =>
      selectedFilters.every((selectedOptions, index) => {
        return (
          selectedOptions.length === 0 ||
          selectedOptions.includes(item[dimensionNames[index]])
        );
      })
    );
  }

  renderTable(data) {
    this.tbody.innerHTML = "";

    data.forEach(function (item) {
      const row = document.createElement("tr");
      row.innerHTML = `
                  <td>${item.d1}</td>
                  <td>${item.d2}</td>
                  <td>${item.d3}</td>
                  <td>${item.d4}</td>
                  <td>${item.budget1}</td>
                  <td>${item.budget2}</td>
                `;
      this.tbody.appendChild(row);
    }, this);
  }
}

export { Table };
