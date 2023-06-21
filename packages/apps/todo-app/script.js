// Constants
const todoInput = document.getElementById("todo-input");
const addButton = document.getElementById("add-button");
const previewList = document.getElementById("preview-list");
const editModal = document.getElementById("edit-modal");
const editInput = document.getElementById("edit-input");
const saveButton = document.getElementById("save-button");
const closeButton = document.getElementsByClassName("close")[0];
const themeToggle = document.getElementById("theme-toggle");
const body = document.getElementsByTagName("body")[0];

// Database initialization
let db;
const DB_NAME = "todo_db";
const DB_VERSION = 1;
const TODO_STORE_NAME = "todos";

// Open database connection
const request = indexedDB.open(DB_NAME, DB_VERSION);

// Event handler for successful database opening
request.onsuccess = function (event) {
  db = event.target.result;
  displayTodos();
};

// Event handler for database upgrade
request.onupgradeneeded = function (event) {
  const db = event.target.result;

  // Create object store for todos
  const store = db.createObjectStore(TODO_STORE_NAME, { keyPath: "id", autoIncrement: true });

  // Create index for searching todos
  store.createIndex("text", "text", { unique: false });
};

// Add new todo to the database
function addTodo() {
  const todoText = todoInput.value.trim();

  if (todoText) {
    const transaction = db.transaction([TODO_STORE_NAME], "readwrite");
    const store = transaction.objectStore(TODO_STORE_NAME);

    const todo = { text: todoText };
    store.add(todo);

    transaction.oncomplete = function () {
      todoInput.value = "";
      displayTodos();
    };
  }
}

// Display todos in the preview list
function displayTodos() {
  previewList.innerHTML = "";

  const transaction = db.transaction([TODO_STORE_NAME], "readonly");
  const store = transaction.objectStore(TODO_STORE_NAME);

  store.openCursor().onsuccess = function (event) {
    const cursor = event.target.result;

    if (cursor) {
      const todo = cursor.value;
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${todo.text}</span>
        <div class="actions">
          <button class="edit-button">Edit</button>
          <button class="delete-button">Delete</button>
        </div>
      `;

      const deleteButton = li.getElementsByClassName("delete-button")[0];
      deleteButton.addEventListener("click", function () {
        deleteTodo(todo.id);
      });

      const editButton = li.getElementsByClassName("edit-button")[0];
      editButton.addEventListener("click", function () {
        openEditModal(todo);
      });

      previewList.appendChild(li);

      cursor.continue();
    }
  };
}

// Delete a todo from the database
function deleteTodo(todoId) {
  const transaction = db.transaction([TODO_STORE_NAME], "readwrite");
  const store = transaction.objectStore(TODO_STORE_NAME);

  store.delete(todoId);
  transaction.oncomplete = displayTodos;
}

// Open the edit modal with the todo data
function openEditModal(todo) {
  editInput.value = todo.text;
  editModal.style.display = "block";

  saveButton.onclick = function () {
    editTodoText(todo.id);
  };

  closeButton.onclick = function () {
    editModal.style.display = "none";
  };
}

// Edit the text of a todo in the database
function editTodoText(todoId) {
  const transaction = db.transaction([TODO_STORE_NAME], "readwrite");
  const store = transaction.objectStore(TODO_STORE_NAME);

  const updatedTodo = { id: todoId, text: editInput.value };
  store.put(updatedTodo);

  transaction.oncomplete = function () {
    editModal.style.display = "none";
    displayTodos();
  };
}

// Toggle between different themes
themeToggle.addEventListener("click", function () {
  body.classList.toggle("dracula-theme");
  body.classList.toggle("solarized-theme");
  body.classList.toggle("monokai-theme");
});

// Initial theme
body.classList.add("dracula-theme");

// Event listener for add button
addButton.addEventListener("click", addTodo);
