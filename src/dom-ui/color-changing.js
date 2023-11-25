import { randomIndex } from "../placement-logic";

const setRandomColor = (colors, dom, style) => {
  const color = colors[randomIndex(colors.length)];
  const target = dom;
  target.style[style] = `${color}`;
};

const setMultipleBorderColor = (colors, dom) => {
  setRandomColor(colors, dom, "border-right-color");
  setRandomColor(colors, dom, "border-top-color");
  setRandomColor(colors, dom, "border-bottom-color");
  setRandomColor(colors, dom, "border-left-color");
};

export { setRandomColor, setMultipleBorderColor };
