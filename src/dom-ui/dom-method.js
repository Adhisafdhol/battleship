const createElWithClassAndText = (type = "div", className = "", text = "") => {
  const el = document.createElement(type);
  el.classList.add(className);
  el.textContent = text;

  return el;
};

export default createElWithClassAndText;
