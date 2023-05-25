document.addEventListener("DOMContentLoaded", function () {
  const tabList = document.getElementById("tabList");
  const tabContent = document.getElementById("tabContent");
  const editor = document.getElementById("editor");
  let currentTab = 0;
  let db;

  // Open IndexedDB database
  const request = indexedDB.open("notepadDB", 1);
  request.onerror = function (event) {
    console.log("IndexedDB error: " + event.target.errorCode);
  };
  request.onsuccess = function (event) {
    db = event.target.result;
    loadTabContent(currentTab);
  };
  request.onupgradeneeded = function (event) {
    db = event.target.result;
    const objectStore = db.createObjectStore("tabs", { keyPath: "id", autoIncrement: true });
    objectStore.createIndex("content", "content", { unique: false });
  };

  // Create a new tab
  function createNewTab() {
    const newTab = document.createElement("li");
    newTab.textContent = "Untitled";
    tabList.appendChild(newTab);
    const newEditor = editor.cloneNode(true);
    tabContent.appendChild(newEditor);
    const tabId = tabList.children.length - 1;
    newTab.addEventListener("click", function () {
      switchTab(tabId);
    });
    switchTab(tabId);
  }

  // Switch to a tab
  function switchTab(tabId) {
    const tabs = tabList.getElementsByTagName("li");
    const editors = tabContent.getElementsByTagName("textarea");
    tabs[currentTab].classList.remove("active");
    editors[currentTab].style.display = "none";
    currentTab = tabId;
    tabs[currentTab].classList.add("active");
    editors[currentTab].style.display = "block";
    loadTabContent(currentTab);
  }

  // Load tab content from IndexedDB
  function loadTabContent(tabId) {
    const transaction = db.transaction(["tabs"], "readonly");
    const objectStore = transaction.objectStore("tabs");
    const request = objectStore.get(tabId);
    request.onsuccess = function (event) {
      if (request.result) {
        editor.value = request.result.content;
      } else {
        editor.value = "";
      }
    };
  }

  // Save tab content to IndexedDB
  function saveTabContent(tabId) {
    const transaction = db.transaction(["tabs"], "readwrite");
    const objectStore = transaction.objectStore("tabs");
    const request = objectStore.put({ id: tabId, content: editor.value });
    request.onerror = function (event) {
      console.log("Error saving tab content: " + event.target.errorCode);
    };
    request.onsuccess = function (event) {
      console.log("Tab content saved.");
    };
  }

  // Delete a tab
  function deleteTab(tabId) {
    const transaction = db.transaction(["tabs"], "readwrite");
    const objectStore = transaction.objectStore("tabs");
    const request = objectStore.delete(tabId);
    request.onsuccess = function (event) {
      console.log("Tab deleted.");
    };
    // Remove the tab from UI
    const tabs = tabList.getElementsByTagName("li");
    tabs[tabId].remove();
    const editors = tabContent.getElementsByTagName("textarea");
    editors[tabId].remove();
    // Switch to the first tab if the deleted tab was active
    if (tabId === currentTab) {
      switchTab(0);
    }
  }

  // Event listeners
  editor.addEventListener("input", function () {
    saveTabContent(currentTab);
  });

  document.getElementById("tabContainer").addEventListener("contextmenu", function (event) {
    event.preventDefault();
    const contextMenu = document.createElement("div");
    contextMenu.classList.add("context-menu");
    const deleteOption = document.createElement("div");
    deleteOption.textContent = "Delete";
    deleteOption.classList.add("context-menu-option");
    deleteOption.addEventListener("click", function () {
      deleteTab(currentTab);
    });
    contextMenu.appendChild(deleteOption);
    contextMenu.style.top = event.clientY + "px";
    contextMenu.style.left = event.clientX + "px";
    document.body.appendChild(contextMenu);
    document.addEventListener(
      "click",
      function () {
        contextMenu.remove();
      },
      { once: true }
    );
  });

  // Initial setup
  createNewTab();
});
