/**
 * @param {string} html
 * @returns {HTMLElement}
 * @description
 * Creates an element from a string of HTML.
 * @example
 * const element = elementFromHtml('<div>hello</div>');
 * document.body.appendChild(element);
 *
 */
function elementFromHtml(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstChild;
}

export { elementFromHtml };
