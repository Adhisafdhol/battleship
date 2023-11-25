const createElWithClassAndText = (type = "div", className = "", text = "") => {
  const el = document.createElement(type);
  el.textContent = text;

  if (className) {
    el.classList.add(className);
  }

  return el;
};

export default createElWithClassAndText;
