import "./TableData.js";
// Define the custom element
class TableComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.data = [];
    this.rowsPerPage = 5;
    this.currentPage = 1;
    this.filters = {};
    this.filterThrottleTime = 300;
    this.filterTimeoutId = null;
    this.paginationEnabled = true;
    this.rowsPerPageEnabled = true;
    this.filtersEnabled = true;
  }

  static get observedAttributes() {
    return [
      "data",
      "rows-per-page",
      "pagination-enabled",
      "rows-per-page-enabled",
    ];
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === "data" && oldValue !== newValue) {
      this.data = JSON.parse(newValue);
      this.render();
    } else if (attrName === "rows-per-page" && oldValue !== newValue) {
      this.rowsPerPage = parseInt(newValue);
      this.render();
    } else if (attrName === "pagination-enabled" && oldValue !== newValue) {
      this.paginationEnabled = newValue === "true";
      this.render();
    } else if (attrName === "rows-per-page-enabled" && oldValue !== newValue) {
      this.rowsPerPageEnabled = newValue === "true";
      this.render();
    }
  }

  connectedCallback() {
    this.render();
  }

  getTableStyles() {
    return `
      <style>
        .pagination {
          margin-top: 16px;
        }
        .pagination button {
          margin-right: 4px;
        }
        .rows-per-page {
          margin-top: 8px;
        }
      </style>
    `;
  }

  render() {
    const data = this.data;

    if (Array.isArray(data)) {
      const filteredData = this.filterData(data);
      this.createTable(data, filteredData);

      if (this.paginationEnabled) {
        // Add pagination
        const paginationDiv = document.createElement("div");
        paginationDiv.classList.add("pagination");

        const totalPages = Math.ceil(filteredData.length / this.rowsPerPage);
        if (totalPages > 1) {
          const prevButton = document.createElement("button");
          prevButton.textContent = "Prev";
          prevButton.disabled = this.currentPage === 1;
          prevButton.addEventListener("click", () => {
            if (this.currentPage > 1) {
              this.currentPage--;
              this.render();
            }
          });
          paginationDiv.appendChild(prevButton);

          for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement("button");
            pageButton.textContent = i;
            pageButton.classList.toggle("active", i === this.currentPage);
            pageButton.addEventListener("click", () => {
              if (i !== this.currentPage) {
                this.currentPage = i;
                this.render();
              }
            });
            paginationDiv.appendChild(pageButton);
          }

          const nextButton = document.createElement("button");
          nextButton.textContent = "Next";
          nextButton.disabled = this.currentPage === totalPages;
          nextButton.addEventListener("click", () => {
            if (this.currentPage < totalPages) {
              this.currentPage++;
              this.render();
            }
          });
          paginationDiv.appendChild(nextButton);

          this.shadowRoot.appendChild(paginationDiv);
        }
      }

      if (this.rowsPerPageEnabled) {
        // Add rows per page select
        const rowsPerPageDiv = document.createElement("div");
        rowsPerPageDiv.classList.add("rows-per-page");

        const selectLabel = document.createElement("label");
        selectLabel.textContent = "Rows per Page: ";
        const select = document.createElement("select");
        select.value = this.rowsPerPage;
        select.addEventListener("change", (event) => {
          const selectedRowsPerPage = parseInt(event.target.value);
          if (selectedRowsPerPage !== this.rowsPerPage) {
            this.rowsPerPage = selectedRowsPerPage;
            this.currentPage = 1;
            this.setAttribute("rows-per-page", selectedRowsPerPage);
          }
        });

        const options = [5, 10, 20, 50];
        options.forEach((option) => {
          const optionElement = document.createElement("option");
          optionElement.value = option;
          optionElement.textContent = option;
          if (option === this.rowsPerPage) {
            optionElement.selected = true;
          }
          select.appendChild(optionElement);
        });

        rowsPerPageDiv.appendChild(selectLabel);
        rowsPerPageDiv.appendChild(select);

        this.shadowRoot.appendChild(rowsPerPageDiv);
      }
    }
  }

  createTable(data, filteredData) {
    const tableStyles = this.getTableStyles();
    const table = document.createElement("table");
    this.createHeaderRow(table, data);

    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = Math.min(
      startIndex + this.rowsPerPage,
      filteredData.length
    );

    for (let i = startIndex; i < endIndex; i++) {
      const item = filteredData[i];
      const row = document.createElement("tr");
      for (let key in item) {
        this.createTableData(item, key, row);
      }
      table.appendChild(row);
    }

    // Clear the shadow DOM and append the table, styles, pagination,
    // rows per page select, and filter inputs
    this.shadowRoot.innerHTML = "";
    this.shadowRoot.innerHTML = tableStyles;
    this.shadowRoot.appendChild(table);
  }

  createHeaderRow(table, data) {
    const headerRow = document.createElement("tr");
    const firstItem = data[0];
    for (let key in firstItem) {
      this.createTableHeader(headerRow, key);
    }
    table.appendChild(headerRow);
  }

  createTableHeader(row, key) {
    const headerCell = document.createElement("th");
    const headerCellText = document.createElement("div");
    headerCell.appendChild(headerCellText);
    headerCellText.textContent = key;
    row.appendChild(headerCell);
  }

  createTableData(data, key, row) {
    const cell = document.createElement("td");
    const cellData = document.createElement("table-data-component");
    cellData.setAttribute("value", data[key]);
    cellData.setAttribute("edition-enabled", true);
    cell.appendChild(cellData);
    row.appendChild(cell);
  }

  filterData(data) {
    return data.filter((item) => {
      for (let key in this.filters) {
        const filterValue = this.filters[key];
        if (
          filterValue &&
          !item[key].toString().toLowerCase().includes(filterValue)
        ) {
          return false;
        }
      }
      return true;
    });
  }
}

// Define the filter input custom element
class FilterInputComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.value = "";
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const input = document.createElement("input");
    input.type = "text";
    input.value = this.value;
    input.addEventListener("input", (event) => {
      this.value = event.target.value;
      this.dispatchEvent(
        new CustomEvent("filterChange", { detail: this.value })
      );
    });

    this.shadowRoot.innerHTML = "";
    this.shadowRoot.appendChild(input);
  }

  static get observedAttributes() {
    return ["value"];
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === "value" && oldValue !== newValue) {
      this.value = newValue;
      this.render();
    }
  }
}

// Define the custom elements
customElements.define("table-component", TableComponent);
customElements.define("filter-input-component", FilterInputComponent);
