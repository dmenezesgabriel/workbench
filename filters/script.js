// Sample data
const data = [
  { country: "USA", state: "New York", city: "New York City" },
  { country: "USA", state: "California", city: "Los Angeles" },
  { country: "USA", state: "California", city: "San Francisco" },
  { country: "Canada", state: "Ontario", city: "Toronto" },
  { country: "Canada", state: "Quebec", city: "Montreal" },
];

// Populate the multi-selects with unique values from the data
function populateMultiSelects() {
  const countries = [...new Set(data.map((item) => item.country))];
  const states = [...new Set(data.map((item) => item.state))];
  const cities = [...new Set(data.map((item) => item.city))];

  const countrySelect = document.getElementById("country");
  const stateSelect = document.getElementById("state");
  const citySelect = document.getElementById("city");

  countries.forEach((country) => {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    countrySelect.appendChild(option);
  });

  states.forEach((state) => {
    const option = document.createElement("option");
    option.value = state;
    option.textContent = state;
    stateSelect.appendChild(option);
  });

  cities.forEach((city) => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    citySelect.appendChild(option);
  });
}

// Filter the data based on selected filters and update the table
function filterData() {
  const countrySelect = document.getElementById("country");
  const stateSelect = document.getElementById("state");
  const citySelect = document.getElementById("city");

  const selectedCountries = Array.from(countrySelect.selectedOptions).map((option) => option.value);
  const selectedStates = Array.from(stateSelect.selectedOptions).map((option) => option.value);
  const selectedCities = Array.from(citySelect.selectedOptions).map((option) => option.value);

  const filteredData = data.filter(
    (item) =>
      (selectedCountries.length === 0 || selectedCountries.includes(item.country)) &&
      (selectedStates.length === 0 || selectedStates.includes(item.state)) &&
      (selectedCities.length === 0 || selectedCities.includes(item.city))
  );

  const tableBody = document.querySelector("#table tbody");
  tableBody.innerHTML = "";

  filteredData.forEach((item) => {
    const row = document.createElement("tr");
    const countryCell = document.createElement("td");
    const stateCell = document.createElement("td");
    const cityCell = document.createElement("td");

    countryCell.textContent = item.country;
    stateCell.textContent = item.state;
    cityCell.textContent = item.city;

    row.appendChild(countryCell);
    row.appendChild(stateCell);
    row.appendChild(cityCell);

    tableBody.appendChild(row);
  });
}

// Clear all selected filters
function clearFilters() {
  const countrySelect = document.getElementById("country");
  const stateSelect = document.getElementById("state");
  const citySelect = document.getElementById("city");

  countrySelect.selectedIndex = -1;
  stateSelect.selectedIndex = -1;
  citySelect.selectedIndex = -1;

  filterData();
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  populateMultiSelects();
  filterData();

  const countrySelect = document.getElementById("country");
  const stateSelect = document.getElementById("state");
  const citySelect = document.getElementById("city");
  const clearFiltersBtn = document.getElementById("clearFilters");

  countrySelect.addEventListener("change", filterData);
  stateSelect.addEventListener("change", filterData);
  citySelect.addEventListener("change", filterData);
  clearFiltersBtn.addEventListener("click", clearFilters);
});
