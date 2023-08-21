class Tag {
  constructor(name) {
    this.name = name;
    this.element = this.createElement();
    this.dispose.bind(this);
  }

  dispose() {
    this.element.dispatchEvent(
      new CustomEvent("dispose", { detail: { name: this.name } })
    );
    this.element.remove();
  }

  createElement() {
    this.element = document.createElement("span");
    this.element.textContent = this.name;
    this.element.appendChild(this.createDisposeButton());
    return this.element;
  }

  createDisposeButton() {
    const element = document.createElement("button");
    element.style.background = "none";
    element.style.border = "none";
    element.style.cursor = "pointer";
    element.textContent = "x";
    element.addEventListener("click", (event) => {
      event.preventDefault();
      this.dispose();
    });
    return element;
  }
}

export { Tag };
