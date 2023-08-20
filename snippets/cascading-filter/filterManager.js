class FilterManager {
  constructor(data, filters) {
    this.filters = filters;
    this.populateFilters(data);
    this.addEventListeners();
  }

  populateFilters(data) {
    const filterOptions = this.getFilterOptions(data);
    this.addOptionsToFilters(filterOptions);
  }

  getFilterOptions(data) {
    const filterOptions = [];

    for (let i = 1; i <= this.filters.length; i++) {
      const options = [...new Set(data.map((item) => item[`d${i}`]))];
      filterOptions.push(options);
    }

    return filterOptions;
  }

  addOptionsToFilters(filterOptions) {
    filterOptions.forEach((options, index) => {
      options.forEach((option) => {
        this.filters[index].addOption(option);
      });
    });
  }

  addEventListeners() {
    this.filters.forEach((filter) => {
      filter.element.addEventListener("change", () => {
        this.table.updateTable(this.data, this.filters);
        this.updateFiltersWithRelevantValues();
      });
    });

    document.getElementById("reset-filters").addEventListener("click", () => {
      this.resetFilters();
    });
  }

  setTable(table) {
    this.table = table;
  }

  setData(data) {
    this.data = data;
  }

  updateFiltersWithRelevantValues() {
    const selectedFilters = this.filters.map((filter) =>
      filter.getSelectedOptions()
    );

    this.filters.forEach((filter, index) => {
      const relevantValues = this.getRelevantValues(selectedFilters, index);
      this.updateFilterOptions(filter, relevantValues);
    });
  }

  getRelevantValues(selectedFilters, currentIndex) {
    return this.data
      .filter((item) =>
        selectedFilters.every((selectedOptions, index) => {
          return (
            index === currentIndex ||
            selectedOptions.length === 0 ||
            selectedOptions.includes(item[`d${index + 1}`])
          );
        })
      )
      .map((item) => item[`d${currentIndex + 1}`]);
  }

  updateFilterOptions(filter, relevantValues) {
    const allOptions = Array.from(filter.element.options);
    allOptions.forEach((option) => {
      option.disabled = !relevantValues.includes(option.value);
    });
  }

  resetFilters() {
    this.filters.forEach((filter) => {
      const allOptions = Array.from(filter.element.options);
      allOptions.forEach((option) => {
        option.disabled = false;
      });
    });
  }
}

export { FilterManager };
