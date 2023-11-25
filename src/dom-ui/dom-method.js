const createElWithClassAndText = (type = "div", className = "", text = "") => {
  const el = document.createElement(type);
  if (className) {
    el.classList.add(className);
  }

  el.textContent = text;

  return el;
};

const addAttributesToEl = (dom, atrNameArr, atrKeyArr) => {
  atrNameArr.forEach((atrName, index) => {
    dom.setAttribute(atrName, atrKeyArr[index]);
  });
};

export { createElWithClassAndText, addAttributesToEl };
