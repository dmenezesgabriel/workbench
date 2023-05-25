// Get DOM elements
const inputData = document.getElementById("input-data");
const rowsInput = document.getElementById("rows");
const colsInput = document.getElementById("cols");
const generateButton = document.getElementById("generate-button");
const output = document.getElementById("output");

// Generate the Markdown table
function generateTable() {
  const data = inputData.value.trim().split("\n");
  const rows = parseInt(rowsInput.value);
  const cols = parseInt(colsInput.value);

  if (data.length !== rows * cols) {
    output.textContent = "Invalid data input!";
    return;
  }

  let markdownTable = "";

  for (let i = 0; i < rows; i++) {
    markdownTable += "| ";

    for (let j = 0; j < cols; j++) {
      const dataIndex = i * cols + j;
      markdownTable += data[dataIndex] + " | ";
    }

    markdownTable += "\n";

    if (i === 0) {
      markdownTable += "| ";

      for (let j = 0; j < cols; j++) {
        markdownTable += "--- | ";
      }

      markdownTable += "\n";
    }
  }

  output.textContent = markdownTable;
}

// Event listener
generateButton.addEventListener("click", generateTable);
