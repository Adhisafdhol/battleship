import {
  getAttributeArr,
  removeDataInfoAttr,
  isCoordinatesFree,
  addDataInfoAttr,
  isCoordinatesValid,
  getCoordinatesList,
} from "./drag-and-drop";
import checkDomPlacementValidity from "./placement-dom-logic";

const geOppositeOrientation = (orientation) => {
  if (orientation === "row") {
    return "column";
  }

  return "row";
};

const changeShipOrientationStyle = (target, orientation, length) => {
  const dom = target;
  if (orientation === "row") {
    dom.style.width = `calc(${length * 100}% + ${length - 1}px)`;
    dom.style.removeProperty("height");
  } else {
    dom.style.height = `calc(${length * 100}% + ${length - 1}px)`;
    dom.style.removeProperty("width");
  }
};

const isAdjecentDomFree = (coordinates, orientation, length) => {
  const coordinatesList = getCoordinatesList(coordinates, orientation, length);
  return checkDomPlacementValidity(coordinatesList);
};

const changeOrientationDom = (target, coordinates, orientation, length) => {
  changeShipOrientationStyle(target, orientation, length);
  target.setAttribute("data-orientation", `${orientation}`);
  addDataInfoAttr(coordinates, orientation, length);
};

const validateAdjecentDom = (
  target,
  coordinates,
  newOrientation,
  prevOrientation,
  length,
) => {
  if (isAdjecentDomFree(coordinates, newOrientation, length)) {
    changeOrientationDom(target, coordinates, newOrientation, length);
  } else {
    addDataInfoAttr(coordinates, prevOrientation, length);
  }
};

const validatePlacement = (
  target,
  coordinates,
  newOrientation,
  prevOrientation,
  length,
) => {
  if (isCoordinatesFree(coordinates, newOrientation, length)) {
    validateAdjecentDom(
      target,
      coordinates,
      newOrientation,
      prevOrientation,
      length,
    );
  } else {
    addDataInfoAttr(coordinates, prevOrientation, length);
  }
};

const changeOrientation = (ev) => {
  const { target } = ev;
  const coordinates = getAttributeArr(target, "data-head");
  const orientation = target.getAttribute("data-orientation");
  const newOrientation = geOppositeOrientation(orientation);
  const length = Number(target.getAttribute("data-length"));
  removeDataInfoAttr(coordinates, orientation, length);
  if (!isCoordinatesValid(coordinates, newOrientation, length)) {
    validatePlacement(target, coordinates, newOrientation, orientation, length);
  }
};

export { changeOrientation, isAdjecentDomFree };
