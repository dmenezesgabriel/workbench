import { Tag } from "./tag.js";

function createSelectContainer() {
  const element = document.createElement("div");
  element.classList.add("select-container");
  element.style.display = "flex";
  element.style.flexDirection = "column";
  element.style.border = "1px solid #ccc";
  return element;
}

function createSearchContainer() {
  const element = document.createElement("div");
  element.classList.add("search-container");
  element.style.display = "flex";
  return element;
}

function createTagContainer() {
  const element = document.createElement("div");
  element.classList.add("tag-container");
  element.style.display = "flex";
  element.style.flexDirection = "column";
  element.style.width = "100%";
  return element;
}

function createSearchInput() {
  const element = document.createElement("input");
  element.classList.add("search-input");
  element.style.border = "none";
  element.placeholder = "Search...";
  return element;
}

function createDropdown() {
  const element = document.createElement("div");
  element.classList.add("dropdown");
  element.style.display = "none";
  return element;
}

function createToggle() {
  const element = document.createElement("button");
  element.classList.add("toggle");
  element.style.background = "none";
  element.style.border = "none";
  element.style.cursor = "pointer";
  element.innerHTML = "&#9660;";
  return element;
}

class Select {
  constructor(selectElement) {
    this.selectElement = selectElement;
    this.options = [];
    this.tags = [];
    this.updateSelectStyles();
    this.setup();
    this.addEventListeners();
    this.observeSelectElement();
    this.addOption.bind(this);
    this.getOptions.bind(this);
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
    this.selectElement.border = "none";
  }

  setup() {
    this.selectContainer = createSelectContainer();
    this.toggle = createToggle();
    this.searchContainer = createSearchContainer();
    this.tagContainer = createTagContainer();
    this.searchInput = createSearchInput();
    this.dropdown = createDropdown();

    this.searchContainer.appendChild(this.tagContainer);
    this.tagContainer.appendChild(this.searchInput);

    this.selectContainer.appendChild(this.searchContainer);
    this.searchContainer.appendChild(this.toggle);

    this.selectElement.parentNode.insertBefore(
      this.selectContainer,
      this.selectElement
    );
    this.dropdown.appendChild(this.selectElement);
    this.selectContainer.appendChild(this.dropdown);
  }

  addTag(name) {
    if (this.isTagUnique(name)) {
      const tag = new Tag(name);
      this.tags.push(tag);
      this.addTagDisposeEventListener(tag);
      this.renderTags();
    }
  }

  removeTag(name) {
    this.tags = this.tags.filter((tag) => tag.name !== name);
  }

  isTagUnique(name) {
    return this.tags.filter((tag) => tag.name === name).length === 0;
  }

  addTagDisposeEventListener(tag) {
    tag.element.addEventListener("dispose", (event) => {
      this.removeTag(event.detail.name);
      this.renderTags();
      this.disableOption(event.detail.name);
    });
  }

  disableOption(name) {
    this.getOptions().forEach((option) => {
      if (option.textContent.toLowerCase() === name.toLowerCase()) {
        this.setOptionDisabled(option, false);
      }
    });
  }

  renderTags() {
    for (const tag of this.tags) {
      this.tagContainer.insertBefore(tag.element, this.searchInput);
    }
  }

  addEventListeners() {
    this.searchInput.addEventListener("input", () => {
      const searchValue = this.searchInput.value.toLowerCase();
      Array.from(this.selectElement.options).forEach((option) => {
        const optionText = option.textContent.toLowerCase();
        if (optionText.includes(searchValue)) {
          this.dropdown.style.display = "block";
          option.style.display = "block";
        } else {
          option.style.display = "none";
        }
      });
      if (searchValue === "") {
        this.dropdown.style.display = "none";
      }
    });

    this.toggle.addEventListener("click", (event) => {
      event.preventDefault();
      if (this.dropdown.style.display === "none") {
        this.dropdown.style.display = "block";
      } else {
        this.dropdown.style.display = "none";
      }
    });

    document.addEventListener("click", (event) => {
      if (
        !this.dropdown.contains(event.target) &&
        !this.toggle.contains(event.target)
      ) {
        this.dropdown.style.display = "none";
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
    } else {
      this.renderTags();
    }
    this.selectElement.dispatchEvent(new Event("change"));
  }
}

export { Select };
