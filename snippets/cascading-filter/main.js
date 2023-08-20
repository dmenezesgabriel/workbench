import { Table } from "./table.js";
import { FilterManager } from "./filterManager.js";
import { Filter } from "./filter.js";

const companyData = [
  {
    d1: "HR",
    d2: "Recruitment",
    d3: "Sourcing",
    d4: "Team A",
    budget1: 120000,
    budget2: 60000,
  },
  {
    d1: "HR",
    d2: "Recruitment",
    d3: "Sourcing",
    d4: "Team B",
    budget1: 100000,
    budget2: 55000,
  },
  {
    d1: "HR",
    d2: "Recruitment",
    d3: "Interviewing",
    d4: "Team A",
    budget1: 130000,
    budget2: 65000,
  },
  {
    d1: "HR",
    d2: "Recruitment",
    d3: "Interviewing",
    d4: "Team B",
    budget1: 110000,
    budget2: 60000,
  },
  {
    d1: "HR",
    d2: "Employee Relations",
    d3: "Conflict Resolution",
    d4: "Team A",
    budget1: 95000,
    budget2: 50000,
  },
  {
    d1: "HR",
    d2: "Employee Relations",
    d3: "Conflict Resolution",
    d4: "Team B",
    budget1: 90000,
    budget2: 48000,
  },
];

const filters = [
  new Filter("filter-d1"),
  new Filter("filter-d2"),
  new Filter("filter-d3"),
  new Filter("filter-d4"),
];

const dimensionNames = ["d1", "d2", "d3", "d4"];

const table = new Table();
const filterManager = new FilterManager(companyData, filters, dimensionNames);
filterManager.setTable(table);
filterManager.setData(companyData);
table.updateTable(companyData, filterManager.filters);
