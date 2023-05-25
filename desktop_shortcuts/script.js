// Function to make a DOM element draggable
function makeDraggable(element) {
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  element.addEventListener("mousedown", dragMouseDown);

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.addEventListener("mouseup", closeDragElement);
    document.addEventListener("mousemove", elementDrag);
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
    document.removeEventListener("mouseup", closeDragElement);
    document.removeEventListener("mousemove", elementDrag);
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  const shortcuts = document.querySelectorAll(".shortcut");
  const programWindow = document.getElementById("programWindow");

  shortcuts.forEach((shortcut) => {
    shortcut.addEventListener("click", () => {
      programWindow.style.display = "block";
    });
    makeDraggable(shortcut);
  });
});
