function AddTableARIA() {
  try {
    const allTables = document.querySelectorAll("table");
    for (let i = 0; i < allTables.length; i++) {
      allTables[i].setAttribute("role", "table");
    }
    const allCaptions = document.querySelectorAll("caption");
    for (let i = 0; i < allCaptions.length; i++) {
      allCaptions[i].setAttribute("role", "caption");
    }
    const allRowGroups = document.querySelectorAll("thead, tbody, tfoot");
    for (let i = 0; i < allRowGroups.length; i++) {
      allRowGroups[i].setAttribute("role", "rowgroup");
    }
    const allRows = document.querySelectorAll("tr");
    for (let i = 0; i < allRows.length; i++) {
      allRows[i].setAttribute("role", "row");
    }
    const allCells = document.querySelectorAll("td");
    for (let i = 0; i < allCells.length; i++) {
      allCells[i].setAttribute("role", "cell");
    }
    const allHeaders = document.querySelectorAll("th");
    for (let i = 0; i < allHeaders.length; i++) {
      allHeaders[i].setAttribute("role", "columnheader");
    }
    // this accounts for scoped row headers
    const allRowHeaders = document.querySelectorAll("th[scope=row]");
    for (let i = 0; i < allRowHeaders.length; i++) {
      allRowHeaders[i].setAttribute("role", "rowheader");
    }
  } catch (e) {
    console.log("AddTableARIA(): " + e);
  }
}

AddTableARIA();
