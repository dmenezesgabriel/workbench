const cellsSection = document.querySelector(".cells-section");
const newCellButton = document.getElementById("new-cell-button");
const executeAllButton = document.getElementById("execute-all-button");

let cellCount = 0;
let db;

// Open the database
const request = indexedDB.open("cellDatabase", 1);

request.onupgradeneeded = function (event) {
  db = event.target.result;
  db.createObjectStore("cells", { keyPath: "id" });
};

request.onsuccess = function (event) {
  db = event.target.result;
  loadCellsFromDB(); // Load cells from IndexedDB on window load
};

request.onerror = function (event) {
  console.error("Error opening IndexedDB database:", event.target.error);
};

newCellButton.addEventListener("click", function () {
  createCell();
});

executeAllButton.addEventListener("click", function () {
  executeAllCells();
});

function createCell() {
  const cell = document.createElement("div");
  cell.className = "cell";
  cell.id = "cell-" + cellCount;

  const cellToolbar = document.createElement("div");
  cellToolbar.className = "cell-toolbar";

  // Options select
  const optionsSelect = document.createElement("select");
  const option1 = document.createElement("option");
  option1.value = "ES6";
  option1.textContent = "ES6";
  const option2 = document.createElement("option");
  option2.value = "Typescript";
  option2.textContent = "Typescript";
  optionsSelect.appendChild(option1);
  optionsSelect.appendChild(option2);
  optionsSelect.addEventListener("change", function () {
    saveCellState(cell.id, cellInput.value, optionsSelect.value);
  });

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", function () {
    deleteCell(cell.id);
  });

  const executeButton = document.createElement("button");
  executeButton.textContent = "Execute";
  executeButton.addEventListener("click", function () {
    executeCell(cell.id, optionsSelect.value);
  });

  cellToolbar.appendChild(optionsSelect);
  cellToolbar.appendChild(deleteButton);
  cellToolbar.appendChild(executeButton);

  const cellInput = document.createElement("textarea");
  cellInput.className = "cell-input";
  cellInput.placeholder = "Enter JavaScript code...";
  cellInput.addEventListener("input", function () {
    saveCellState(cell.id, cellInput.value, optionsSelect.value);
  });

  const cellOutput = document.createElement("div");
  cellOutput.className = "cell-output";

  cell.appendChild(cellToolbar);
  cell.appendChild(cellInput);
  cell.appendChild(cellOutput);

  cellsSection.appendChild(cell);

  cellCount++;

  // Save cell state to IndexedDB
  saveCellState(cell.id, cellInput.value, optionsSelect.value);
}

function deleteCell(cellId) {
  const cell = document.getElementById(cellId);
  cell.parentNode.removeChild(cell);

  // Delete cell state from IndexedDB
  const transaction = db.transaction("cells", "readwrite");
  const store = transaction.objectStore("cells");
  store.delete(cellId);
}

function executeCell(cellId, language) {
  const cell = document.getElementById(cellId);
  const cellInput = cell.querySelector(".cell-input");
  const cellOutput = cell.querySelector(".cell-output");

  const code = cellInput.value;
  cellOutput.textContent = "";

  // Override console.log to capture its output
  const originalConsoleLog = console.log;
  let consoleOutput = "";
  console.log = function (message) {
    consoleOutput += message + "\n";
    originalConsoleLog.apply(console, arguments);
  };

  try {
    let transpiledCode = code;

    if (language === "Typescript") {
      // Transpile from Typescript to JavaScript using TypeScript library
      const transpileOptions = { target: ts.ScriptTarget.ES2017, module: ts.ModuleKind.CommonJS };
      transpiledCode = ts.transpileModule(code, { compilerOptions: transpileOptions }).outputText;
    } else if (language === "ES6") {
      // Transpile from Typescript to JavaScript using Babel library
      const transpileOptions = { presets: ["es2015"] };
      transpiledCode = Babel.transform(code, transpileOptions).code;
    }

    const output = eval(transpiledCode);
    cellOutput.textContent = consoleOutput + output;
  } catch (error) {
    console.error(error);
    cellOutput.textContent = "Error: " + error.message;
  }

  // Restore console.log to its original function
  console.log = originalConsoleLog;

  // Update cell state in IndexedDB
  saveCellState(cellId, cellInput.value, language);
}

function executeAllCells() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach(function (cell) {
    const cellId = cell.id;
    executeCell(cellId);
  });
}

function saveCellState(cellId, content, language) {
  const transaction = db.transaction("cells", "readwrite");
  const store = transaction.objectStore("cells");
  const cellData = { id: cellId, content: content, language: language };
  store.put(cellData);
}

function loadCellsFromDB() {
  const transaction = db.transaction("cells", "readonly");
  const store = transaction.objectStore("cells");
  const request = store.getAll();

  request.onsuccess = function () {
    const cellsData = request.result;
    cellsData.forEach(function (cellData) {
      createCellFromDB(cellData);
    });
    console.log("Cells loaded from IndexedDB");
  };

  request.onerror = function () {
    console.error("Error loading cells from IndexedDB:", request.error);
  };
}

function createCellFromDB(cellData) {
  const cell = document.createElement("div");
  cell.className = "cell";
  cell.id = cellData.id;

  const cellToolbar = document.createElement("div");
  cellToolbar.className = "cell-toolbar";

  // Options select
  const optionsSelect = document.createElement("select");
  const option1 = document.createElement("option");
  option1.value = "ES6";
  option1.textContent = "ES6";
  const option2 = document.createElement("option");
  option2.value = "Typescript";
  option2.textContent = "Typescript";
  optionsSelect.appendChild(option1);
  optionsSelect.appendChild(option2);
  optionsSelect.value = cellData.language; // Set saved option value
  optionsSelect.addEventListener("change", function () {
    saveCellState(cell.id, cellInput.value, optionsSelect.value);
  });

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", function () {
    deleteCell(cell.id);
  });

  const executeButton = document.createElement("button");
  executeButton.textContent = "Execute";
  executeButton.addEventListener("click", function () {
    executeCell(cell.id, optionsSelect.value);
  });

  cellToolbar.appendChild(optionsSelect);
  cellToolbar.appendChild(deleteButton);
  cellToolbar.appendChild(executeButton);

  const cellInput = document.createElement("textarea");
  cellInput.className = "cell-input";
  cellInput.placeholder = "Enter JavaScript code...";
  cellInput.addEventListener("input", function () {
    saveCellState(cell.id, cellInput.value, optionsSelect.value);
  });
  cellInput.value = cellData.content; // Set saved cell content

  const cellOutput = document.createElement("div");
  cellOutput.className = "cell-output";

  cell.appendChild(cellToolbar);
  cell.appendChild(cellInput);
  cell.appendChild(cellOutput);

  cellsSection.appendChild(cell);

  // Save cell state to IndexedDB
  saveCellState(cell.id, cellInput.value, optionsSelect.value);
}
