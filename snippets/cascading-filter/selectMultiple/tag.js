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
    this.element = document.createElement("div");
    this.element.textContent = this.name;
    this.element.appendChild(this.createDisposeButton());
    return this.element;
  }

  createDisposeButton() {
    const disposeButton = document.createElement("button");
    disposeButton.textContent = "x";
    disposeButton.addEventListener("click", (event) => {
      event.preventDefault();
      this.dispose();
    });
    return disposeButton;
  }
}

export { Tag };
