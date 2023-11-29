import checkDomPlacementValidity from "./placement-dom-logic";

let dragStartItem;

const getAttributeArr = (dom, attr) =>
  dom
    .getAttribute(attr)
    .split(",")
    .map((item) => Number(item));

const getCoordinatesList = (coordinates, orientation, length) => {
  const coordinatesList = [coordinates];
  if (orientation === "row") {
    for (let i = 1; i < length; i += 1) {
      coordinatesList.push([coordinates[0], coordinates[1] + i]);
    }
  } else {
    for (let i = 1; i < length; i += 1) {
      coordinatesList.push([coordinates[0] + i, coordinates[1]]);
    }
  }

  return coordinatesList;
};

const isAdjecentDomFree = (coordinates, orientation, length) => {
  const coordinatesList = getCoordinatesList(coordinates, orientation, length);
  return checkDomPlacementValidity(coordinatesList);
};

const removeDataInfoAttr = (coordinates, orientation, length) => {
  const coordinatesList = getCoordinatesList(coordinates, orientation, length);
  coordinatesList.forEach((coord) => {
    const dom = document.querySelector(`[data-coordinates="${coord}"]`);
    dom.setAttribute("data-info", "free");
  });
};

function dragstartHandler(ev) {
  const child = ev.target;
  const parent = ev.target.parentElement;
  const coordinates = getAttributeArr(parent, "data-coordinates");
  const orientation = child.getAttribute("data-orientation");
  const length = Number(child.getAttribute("data-length"));
  ev.target.parentElement.removeChild(child);
  dragStartItem = document.elementFromPoint(ev.clientX, ev.clientY);
  parent.appendChild(child);
  removeDataInfoAttr(coordinates, orientation, length);
  ev.dataTransfer.setData("text/plain", ev.target.id);
}

function dragoverHandler(ev) {
  const el = ev;
  el.preventDefault();
  el.dataTransfer.dropEffect = "move";
}

const checkDiff = (data1, data2) =>
  data1 > data2 ? data1 - data2 : data2 - data1;

const getCorrectDropCoordinates = (
  orientation,
  data1,
  data2,
  dropCoordinates,
) => {
  if (orientation === "row") {
    const newCoord = [
      dropCoordinates[0],
      dropCoordinates[1] - checkDiff(data1[1], data2[1]),
    ];
    return newCoord;
  }

  const newCoord = [
    dropCoordinates[0] - checkDiff(data1[0], data2[0]),
    dropCoordinates[1],
  ];

  return newCoord;
};

const isCoordinatesValid = (coordinates, orientation, length) => {
  const row = coordinates[0] + length - 1;
  const column = coordinates[1] + length - 1;

  if (orientation === "row") {
    return column > 9;
  }

  return row > 9;
};

const isCoordinatesFree = (coordinates, orientation, length) => {
  const coordinatesList = getCoordinatesList(coordinates, orientation, length);
  return coordinatesList.every((coord) => {
    const dom = document.querySelector(`[data-coordinates="${coord}"]`);
    return dom.getAttribute("data-info") === "free";
  });
};

const addDataInfoAttr = (coordinates, orientation, length) => {
  const coordinatesList = getCoordinatesList(coordinates, orientation, length);

  coordinatesList.forEach((coord) => {
    const dom = document.querySelector(`[data-coordinates="${coord}"]`);
    dom.setAttribute("data-info", "occupied");
  });
};

const checkPlacementDomValidity = (
  target,
  currentPoint,
  dropPoint,
  prevCoordinates,
  newCoordinates,
  orientation,
  length,
) => {
  if (
    !isCoordinatesValid(newCoordinates, orientation, length) &&
    isCoordinatesFree(newCoordinates, orientation, length) &&
    isAdjecentDomFree(newCoordinates, orientation, length)
  ) {
    addDataInfoAttr(newCoordinates, orientation, length);
    dropPoint.appendChild(target);
    target.setAttribute("data-head", `${newCoordinates}`);
  } else {
    currentPoint.appendChild(target);
    addDataInfoAttr(prevCoordinates, orientation, length);
  }
};

const appendChildToTarget = (dropPoint, target, correctCoordinates, ship) => {
  const { coordinates } = ship;
  const currentPoint = document.querySelector(
    `[data-coordinates="${coordinates}"]`,
  );
  const { orientation } = ship;
  const { length } = ship;

  checkPlacementDomValidity(
    target,
    currentPoint,
    dropPoint,
    coordinates,
    correctCoordinates,
    orientation,
    length,
  );
};

const createShipObjData = (coordinates, orientation, length) => ({
  coordinates,
  orientation,
  length,
});

const dropShipOnNewCoordinates = (dropCoordinates, droppedItem) => {
  const dragItemCoordinates = getAttributeArr(droppedItem, "data-head");
  const dragItemOrientation = droppedItem.getAttribute("data-orientation");
  const dragItemLength = Number(getAttributeArr(droppedItem, "data-length"));
  const ship = createShipObjData(
    dragItemCoordinates,
    dragItemOrientation,
    dragItemLength,
  );

  const dragStartCoordinates = getAttributeArr(
    dragStartItem,
    "data-coordinates",
  );

  const correctCoordinates = getCorrectDropCoordinates(
    dragItemOrientation,
    dragItemCoordinates,
    dragStartCoordinates,
    dropCoordinates,
  );

  const dropPoint = document.querySelector(
    `[data-coordinates="${correctCoordinates}"]`,
  );

  appendChildToTarget(dropPoint, droppedItem, correctCoordinates, ship);
};

function dropHandler(ev) {
  ev.preventDefault();
  const data = ev.dataTransfer.getData("text/plain");
  const droppedItem = document.getElementById(`${data}`);

  if (ev.target.className === "draggable") {
    if (ev.target.id === data) {
      const child = ev.target;
      ev.target.parentElement.removeChild(child);
      const target = document.elementFromPoint(ev.clientX, ev.clientY);
      const dropCoordinates = getAttributeArr(target, "data-coordinates");
      dropShipOnNewCoordinates(dropCoordinates, droppedItem);
    }
  } else {
    const dropCoordinates = getAttributeArr(ev.target, "data-coordinates");
    dropShipOnNewCoordinates(dropCoordinates, droppedItem);
  }
}

export {
  dragstartHandler,
  dragoverHandler,
  dropHandler,
  getAttributeArr,
  removeDataInfoAttr,
  addDataInfoAttr,
  isCoordinatesValid,
  isCoordinatesFree,
  getCoordinatesList,
  isAdjecentDomFree
};
