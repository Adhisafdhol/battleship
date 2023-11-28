let dragStartItem;

function dragstartHandler(ev) {
  // Add the target element's id to the data transfer object
  const child = ev.target;
  const parent = ev.target.parentElement;
  ev.target.parentElement.removeChild(child);
  dragStartItem = document.elementFromPoint(ev.clientX, ev.clientY);
  parent.appendChild(child);
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
      Number(dropCoordinates[0]),
      Number(dropCoordinates[1]) - checkDiff(data1[1], data2[1]),
    ];
    return newCoord;
  }

  const newCoord = [
    Number(dropCoordinates[0]) - checkDiff(data1[0], data2[0]),
    Number(dropCoordinates[1]),
  ];

  return newCoord;
};

const isCoordinatesValid = (coordinates, orientation, length) => {
  const row = Number(coordinates[0]) + Number(length) - 1;
  const column = Number(coordinates[1]) + Number(length) - 1;

  if (orientation === "row") {
    return column > 9;
  }

  return row > 9;
};

const appendChildToTarget = (dropPoint, child, correctCoordinates, ship) => {
  const { coordinates } = ship;
  const currentPoint = document.querySelector(
    `[data-coordinates="${coordinates}"]`,
  );
  const { orientation } = ship;
  const { length } = ship;

  if (!isCoordinatesValid(correctCoordinates, orientation, length)) {
    dropPoint.appendChild(child);
    child.setAttribute("data-head", `${correctCoordinates}`);
  } else {
    currentPoint.appendChild(child);
  }
};

const getAttributeArr = (dom, attr) => dom.getAttribute(attr).split(",");

const createShipObjData = (coordinates, orientation, length) => ({
  coordinates,
  orientation,
  length,
});

const dropShipOnNewCoordinates = (dropCoordinates, droppedItem) => {
  const dragItemCoordinates = getAttributeArr(droppedItem, "data-head");
  const dragItemOrientation = droppedItem.getAttribute("data-orientation");
  const dragItemLength = getAttributeArr(droppedItem, "data-length");
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
  // Get the id of the target and add the moved element to the target's DOM
  const data = ev.dataTransfer.getData("text/plain");
  const droppedItem = document.getElementById(`${data}`);

  if (ev.target.className === "draggable") {
    const child = ev.target;
    ev.target.parentElement.removeChild(child);
    const target = document.elementFromPoint(ev.clientX, ev.clientY);
    const dropCoordinates = getAttributeArr(target, "data-coordinates");
    dropShipOnNewCoordinates(dropCoordinates, droppedItem);
  } else {
    const dropCoordinates = getAttributeArr(ev.target, "data-coordinates");
    dropShipOnNewCoordinates(dropCoordinates, droppedItem);
  }
}

export { dragstartHandler, dragoverHandler, dropHandler };
