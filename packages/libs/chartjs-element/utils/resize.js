function getElementSize(element) {
  const computedStyle = getComputedStyle(element);
  const paddingLeft = parseFloat(computedStyle.paddingLeft);
  const paddingRight = parseFloat(computedStyle.paddingRight);
  const paddingTop = parseFloat(computedStyle.paddingTop);
  const paddingBottom = parseFloat(computedStyle.paddingBottom);
  const elementWidth = element.clientWidth - paddingLeft - paddingRight;
  const elementHeight = element.clientHeight - paddingTop - paddingBottom;
  return {
    width: Math.round(elementWidth),
    height: Math.round(elementHeight),
  };
}

export { getElementSize };
