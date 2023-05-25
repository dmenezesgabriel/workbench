// Make windows draggable
var windows = document.getElementsByClassName("window");
var isDragging = false;
var dragWindow = null;

for (var i = 0; i < windows.length; i++) {
  windows[i].addEventListener("mousedown", function (e) {
    isDragging = true;
    dragWindow = this;
    this.style.zIndex = 2;
  });

  windows[i].addEventListener("mouseup", function (e) {
    isDragging = false;
  });

  windows[i].addEventListener("mousemove", function (e) {
    if (isDragging && dragWindow !== null) {
      var x = e.clientX - dragWindow.offsetWidth / 2;
      var y = e.clientY - dragWindow.offsetHeight / 2;
      dragWindow.style.left = x + "px";
      dragWindow.style.top = y + "px";
    }
  });
}

// Handle minimize, maximize, and close buttons
var minimizeButtons = document.getElementsByClassName("minimize-button");
var maximizeButtons = document.getElementsByClassName("maximize-button");
var closeButtons = document.getElementsByClassName("close-button");

for (var i = 0; i < minimizeButtons.length; i++) {
  minimizeButtons[i].addEventListener("click", function (e) {
    this.parentNode.parentNode.parentNode.style.display = "none";
  });
}

for (var i = 0; i < maximizeButtons.length; i++) {
  maximizeButtons[i].addEventListener("click", function (e) {
    if (this.parentNode.parentNode.parentNode.style.height === "100%") {
      this.parentNode.parentNode.parentNode.style.height = "300px";
      this.parentNode.parentNode.parentNode.style.width = "400px";
    } else {
      this.parentNode.parentNode.parentNode.style.height = "100%";
      this.parentNode.parentNode.parentNode.style.width = "100%";
    }
  });
}

for (var i = 0; i < closeButtons.length; i++) {
  closeButtons[i].addEventListener("click", function (e) {
    this.parentNode.parentNode.parentNode.style.display = "none";
  });
}
