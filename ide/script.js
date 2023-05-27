// Initialize IndexedDB
const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

// Create or open the database
const request = indexedDB.open("codePenDB", 1);
let db;

request.onerror = function () {
  console.log("IndexedDB error");
};

request.onsuccess = function () {
  db = request.result;
  // Load code from IndexedDB
  loadCodeFromDB();
};

request.onupgradeneeded = function (event) {
  db = event.target.result;
  const objectStore = db.createObjectStore("codeStore", { keyPath: "id" });
  objectStore.createIndex("html", "html", { unique: false });
  objectStore.createIndex("css", "css", { unique: false });
  objectStore.createIndex("js", "js", { unique: false });
};

// Get DOM elements
const htmlInput = CodeMirror(document.getElementById("html-input"), {
  mode: "xml",
  lineNumbers: true,
  placeholder: "Enter HTML code",
  theme: "dracula", // Set Dracula theme
});
const cssInput = CodeMirror(document.getElementById("css-input"), {
  mode: "css",
  lineNumbers: true,
  placeholder: "Enter CSS code",
  theme: "dracula", // Set Dracula theme
});
const jsInput = CodeMirror(document.getElementById("js-input"), {
  mode: "text/typescript",
  lineNumbers: true,
  placeholder: "Enter TypeScript code",
  theme: "dracula", // Set Dracula theme
});
const previewFrame = document.getElementById("preview-frame");

// Update preview
function updatePreview() {
  const htmlCode = htmlInput.getValue();
  const cssCode = cssInput.getValue();
  const tsCode = jsInput.getValue();

  const transpiledCode = ts.transpileModule(tsCode, {}).outputText;

  const previewContent = `
    <html>
      <head>
        <style>${cssCode}</style>
      </head>
      <body>
        ${htmlCode}
        <script>
          try {
            ${transpiledCode}
          } catch (error) {
            console.error(error);
          }
        </script>
      </body>
    </html>
  `;

  previewFrame.contentDocument.open();
  previewFrame.contentDocument.write(previewContent);
  previewFrame.contentDocument.close();

  // Save code to IndexedDB
  if (db) {
    saveCodeToDB(htmlCode, cssCode, tsCode);
  } else {
    console.log("IndexedDB is not available.");
  }
}

// Event listeners
htmlInput.on("change", updatePreview);
cssInput.on("change", updatePreview);
jsInput.on("change", updatePreview);

// Initial preview update
updatePreview();

// Load code from IndexedDB
function loadCodeFromDB() {
  if (db) {
    const transaction = db.transaction(["codeStore"], "readonly");
    const objectStore = transaction.objectStore("codeStore");

    const request = objectStore.get(1);

    request.onerror = function () {
      console.log("Error loading code from IndexedDB");
    };

    request.onsuccess = function () {
      const result = request.result;

      if (result) {
        htmlInput.setValue(result.html);
        cssInput.setValue(result.css);
        jsInput.setValue(result.js);
      }
    };
  } else {
    console.log("IndexedDB is not available.");
  }
}

// Save code to IndexedDB
function saveCodeToDB(htmlCode, cssCode, tsCode) {
  if (db) {
    const codeData = {
      id: 1,
      html: htmlCode,
      css: cssCode,
      js: tsCode,
    };

    const transaction = db.transaction(["codeStore"], "readwrite");
    const objectStore = transaction.objectStore("codeStore");

    const request = objectStore.put(codeData);

    request.onerror = function () {
      console.log("Error saving code to IndexedDB");
    };

    request.onsuccess = function () {
      console.log("Code saved to IndexedDB");
    };
  } else {
    console.log("IndexedDB is not available.");
  }
}

// Intercept console messages from the iframe and display them on the UI
previewFrame.contentWindow.console.log = function (message) {
  console.log("IFrame Log:", message);
};
previewFrame.contentWindow.console.error = function (message) {
  console.error("IFrame Error:", message);
};
previewFrame.contentWindow.console.warn = function (message) {
  console.warn("IFrame Warning:", message);
};
previewFrame.contentWindow.console.info = function (message) {
  console.info("IFrame Info:", message);
};
