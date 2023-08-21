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

class Select {
  constructor(selectElement) {
    this.selectElement = selectElement;
    this.options = [];
    this.tags = [];
    this.updateSelectStyles();
    this.createSearchInput();
    this.createDropdown();
    this.createToggle();
    this.addEventListeners();
    this.observeSelectElement();
    this.addOption.bind(this);
    this.getOptions.bind(this);
    this.addPlaceholder.bind(this);
  }

  addOption(optionElement) {
    this.options.push(optionElement);
  }

  getOptions() {
    return this.options;
  }

  setOptionDisabled(optionElement, disabled) {
    optionElement.disabled = disabled;
  }

  updateSelectStyles() {
    this.selectElement.style.width = "100%";
  }

  createSearchInput() {
    this.searchContainer = document.createElement("div");
    this.searchContainer.style.display = "flex";
    this.searchInput = document.createElement("div");
    this.searchInput.style.width = "100%";
    this.searchInput.style.border = "1px solid #ccc";
    this.searchInput.contentEditable = true;
    this.searchInput.classList.add("search-input");
    this.searchContainer.appendChild(this.searchInput);
    this.selectElement.parentNode.insertBefore(
      this.searchContainer,
      this.selectElement
    );
    this.addPlaceholder();
  }

  createDropdown() {
    this.dropdown = document.createElement("div");
    this.dropdown.classList.add("dropdown");
    this.selectElement.style.display = "none";
    this.selectElement.parentNode.insertBefore(
      this.dropdown,
      this.selectElement
    );
    this.dropdown.appendChild(this.selectElement);
  }

  createToggle() {
    this.toggle = document.createElement("button");
    this.toggle.classList.add("toggle");
    this.toggle.innerHTML = "&#9660;";
    this.toggle.style.marginLeft = "5px";
    this.searchContainer.appendChild(this.toggle);
  }

  addPlaceholder() {
    this.searchInput.textContent = "Search...";
  }

  addTag(name) {
    if (this.isTagUnique(name)) {
      const tag = this.createTag(name);
      this.addTagToTags(tag);
      this.addDisposeEventListener(tag);
      this.renderTags();
      this.enableOption(name);
    }
  }

  isTagUnique(name) {
    return this.tags.filter((tag) => tag.name === name).length === 0;
  }

  createTag(name) {
    return new Tag(name);
  }

  addTagToTags(tag) {
    this.tags.push(tag);
  }

  addDisposeEventListener(tag) {
    tag.element.addEventListener("dispose", (event) => {
      this.removeTag(event.detail.name);
      this.renderTags();
      this.enableOption(event.detail.name);
    });
  }

  enableOption(name) {
    this.getOptions().forEach((option) => {
      if (option.textContent.toLowerCase() === name.toLowerCase()) {
        this.setOptionDisabled(option, false);
      }
    });
  }

  removeTag(name) {
    this.tags = this.tags.filter((tag) => tag.name !== name);
  }

  renderTags() {
    this.searchInput.textContent = "";
    for (const tag of this.tags) {
      this.searchInput.appendChild(tag.element);
    }
  }

  addEventListeners() {
    this.searchInput.addEventListener("input", () => {
      const searchValue = this.searchInput.textContent.toLowerCase();
      Array.from(this.selectElement.options).forEach((option) => {
        const optionText = option.textContent.toLowerCase();
        if (optionText.includes(searchValue)) {
          this.selectElement.style.display = "block";
          option.style.display = "block";
        } else {
          option.style.display = "none";
        }
      });
      if (searchValue === "") {
        this.selectElement.style.display = "none";
      }
    });

    this.toggle.addEventListener("click", (event) => {
      event.preventDefault();
      if (this.selectElement.style.display === "none") {
        this.selectElement.style.display = "block";
      } else {
        this.selectElement.style.display = "none";
      }
    });

    this.searchInput.addEventListener("focusin", (event) => {
      if (this.searchInput.textContent === "Search...")
        this.searchInput.textContent = "";
    });

    this.searchInput.addEventListener("focusout", (event) => {
      if (this.searchInput.textContent === "") {
        this.addPlaceholder();
      }
    });

    document.addEventListener("click", (event) => {
      if (
        !this.dropdown.contains(event.target) &&
        !this.toggle.contains(event.target)
      ) {
        this.selectElement.style.display = "none";
      }
    });
  }

  observeSelectElement() {
    const observer = new MutationObserver(this.handleMutation.bind(this));
    observer.observe(this.selectElement, { childList: true });
  }

  handleMutation(mutationsList) {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        const addedNodes = Array.from(mutation.addedNodes);
        const addedOptions = addedNodes.filter(
          (node) => node.nodeName === "OPTION"
        );
        if (addedOptions.length > 0) {
          this.addOption(addedOptions[0]);
          addedOptions[0].addEventListener(
            "mousedown",
            this.handleOptionClick.bind(this, addedOptions[0])
          );
        }
      }
    }
  }

  handleOptionClick(option, event) {
    event.preventDefault();
    option.selected = !option.selected;

    if (option.selected) {
      this.addTag(option.textContent);
    } else {
      this.removeTag(option.textContent);
    }

    if (this.tags.length === 0) {
      this.addPlaceholder();
    } else {
      this.renderTags();
    }
    this.selectElement.dispatchEvent(new Event("change"));
  }
}

export { Select };
