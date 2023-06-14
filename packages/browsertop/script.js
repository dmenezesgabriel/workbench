var taskbar = document.getElementById("taskbar");
var taskbarButtons = [];

class DesktopIcon extends HTMLElement {
  constructor() {
    super();

    // Create shadow DOM
    this.attachShadow({ mode: "open" });

    // Get icon name and image from attributes
    this.name = this.getAttribute("name");
    this.image = this.getAttribute("image");
    this.path = this.getAttribute("path");
  }

  connectedCallback() {
    this.render();
    this.addEventListener("click", createWindow);
  }

  render() {
    const iconTemplate = `
      <style>
        .desktop-icon {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          color: white;
        }
        .desktop-icon img {
          width: 80px;
          height: 80px;
        }
      </style>
      <div class="desktop-icon">
        <img src="${this.image}" alt="${this.name}" />
        <span>${this.name}</span>
      </div>
    `;

    this.shadowRoot.innerHTML = iconTemplate;
  }
}

customElements.define("desktop-icon", DesktopIcon);

function createWindow() {
  var iconName = this.name;
  var windowId = "window-" + Date.now();

  var window = document.createElement("div");
  window.className = "window";
  window.id = windowId;

  var titleBar = document.createElement("div");
  titleBar.className = "title-bar";
  titleBar.innerText = iconName;
  var buttons = document.createElement("div");
  buttons.className = "buttons";
  var minimizeButton = createWindowButton("minimize");
  var maximizeButton = createWindowButton("maximize");
  var closeButton = createWindowButton("close");
  buttons.appendChild(minimizeButton);
  buttons.appendChild(maximizeButton);
  buttons.appendChild(closeButton);
  titleBar.appendChild(buttons);
  window.appendChild(titleBar);

  var content = document.createElement("div");
  content.className = "content";
  var iframe = document.createElement("iframe");
  iframe.className = "content-iframe";
  iframe.src = this.path;

  content.appendChild(iframe);

  window.appendChild(content);

  document.body.appendChild(window);

  dragElement(window);

  minimizeButton.addEventListener("click", minimizeWindow);
  maximizeButton.addEventListener("click", maximizeWindow);
  closeButton.addEventListener("click", closeWindow);

  function createWindowButton(type) {
    var button = document.createElement("button");
    button.className = type;
    return button;
  }
}

// Make the windows draggable
function dragElement(element) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  var titleBar = element.getElementsByClassName("title-bar")[0];

  if (titleBar) {
    titleBar.onmousedown = dragMouseDown;
  } else {
    element.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    element.style.top = element.offsetTop - pos2 + "px";
    element.style.left = element.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function minimizeWindow() {
  var window = this.parentNode.parentNode.parentNode;
  window.style.display = "none";

  var windowId = window.id;
  var taskbarButton = createTaskbarButton(windowId);
  taskbar.appendChild(taskbarButton);
  taskbarButtons.push(taskbarButton);
}

function maximizeWindow() {
  var window = this.parentNode.parentNode.parentNode;

  if (window.style.width === "100%" && window.style.height === "100%") {
    window.style.width = "300px";
    window.style.height = "200px";
    window.style.top = "100px";
    window.style.left = "100px";
  } else {
    window.style.width = "100%";
    window.style.height = "100%";
    window.style.top = "0";
    window.style.left = "0";
  }
}

function closeWindow() {
  var window = this.parentNode.parentNode.parentNode;
  window.parentNode.removeChild(window);
}

function createTaskbarButton(windowId) {
  var button = document.createElement("div");
  button.className = "taskbar-button";
  button.innerText = windowId;
  button.addEventListener("click", restoreWindow.bind(null, windowId));
  return button;
}

function restoreWindow(windowId) {
  var window = document.getElementById(windowId);
  window.style.display = "block";
  taskbarButtons = taskbarButtons.filter(function (button) {
    if (button.innerText === windowId) {
      button.parentNode.removeChild(button);
      return false;
    }
    return true;
  });
}
