const template = document.createElement("template");
template.innerHTML = `
  <style>
    ul {
      list-style-type: none;
      padding-left: 0;
    }

    li {
      margin-left: 15px;
    }
  </style>
  <ul></ul>
`;

class ExpandableList extends HTMLUListElement {
  constructor() {
    super();
    this.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ["data"];
  }

  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (attributeName === "data" && oldValue !== newValue) {
      const ul = this.querySelector("ul");
      ul.innerHTML = "";
      const data = JSON.parse(newValue);
      this.renderTree(data, ul, 0);
    }
  }

  connectedCallback() {
    const data = JSON.parse(this.getAttribute("data"));
    const ul = this.querySelector("ul");
    this.renderTree(data, ul, 0);
  }

  renderTree(treeData, parentNode, level) {
    Object.entries(treeData).forEach(([name, value]) => {
      let li = parentNode.querySelector(`li[data-name="${name}"]`);

      if (!li) {
        li = document.createElement("li");
        li.setAttribute("data-name", name);

        if (typeof value === "object") {
          const details = document.createElement("details");
          const summary = document.createElement("summary");
          summary.textContent = name;

          details.appendChild(summary);
          li.appendChild(details);
          parentNode.appendChild(li);
          this.renderTree(value, details, level + 1);
        } else {
          li.textContent = name;
          parentNode.appendChild(li);
        }
      }
    });
  }
}

customElements.define("expandable-list", ExpandableList, { extends: "ul" });
