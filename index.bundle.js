/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/ai-smart-turn.js":
/*!******************************!*\
  !*** ./src/ai-smart-turn.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _dom_ui_drag_and_drop__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom-ui/drag-and-drop */ "./src/dom-ui/drag-and-drop.js");
/* harmony import */ var _dom_ui_placement_dom_logic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom-ui/placement-dom-logic */ "./src/dom-ui/placement-dom-logic.js");
/* harmony import */ var _placement_logic__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./placement-logic */ "./src/placement-logic.js");



const getAIAdjecentList = coordinates => {
  const adjecentList = [[coordinates[0] - 1, coordinates[1]], [coordinates[0] + 1, coordinates[1]], [coordinates[0], coordinates[1] - 1], [coordinates[0], coordinates[1] + 1]];
  return adjecentList.filter(item => item[0] >= 0 && item[0] <= 9 && item[1] >= 0 && item[1] <= 9);
};
const tagDomOrientation = (dom1, dom2) => {
  const target1 = dom1;
  const target2 = dom2;
  const dom1Coordinates = (0,_dom_ui_drag_and_drop__WEBPACK_IMPORTED_MODULE_0__.getAttributeArr)(dom1, "data-coordinates");
  const dom2Coordinates = (0,_dom_ui_drag_and_drop__WEBPACK_IMPORTED_MODULE_0__.getAttributeArr)(dom2, "data-coordinates");
  if (dom1Coordinates[0] === dom2Coordinates[0]) {
    target1.classList.add("row");
    target2.classList.add("row");
  } else {
    target1.classList.add("column");
    target2.classList.add("column");
  }
};
const getAIRowAdjecentList = coordinates => {
  const rowAdjecentList = [[coordinates[0], coordinates[1] - 1], [coordinates[0], coordinates[1] + 1]];
  return rowAdjecentList.filter(item => item[0] >= 0 && item[0] <= 9 && item[1] >= 0 && item[1] <= 9);
};
const getAIColumnAdjecentList = coordinates => {
  const columnAdjecentList = [[coordinates[0] - 1, coordinates[1]], [coordinates[0] + 1, coordinates[1]]];
  return columnAdjecentList.filter(item => item[0] >= 0 && item[0] <= 9 && item[1] >= 0 && item[1] <= 9);
};
const getAIOrientationAdjecentList = (coordinates, orientation) => {
  if (orientation === "row") {
    return getAIRowAdjecentList(coordinates);
  }
  return getAIColumnAdjecentList(coordinates);
};
const getFreeAdjecentList = (adjecentList, opponentBoard) => {
  const domList = [];
  adjecentList.forEach(coordinates => {
    const dom = opponentBoard.querySelector(`[data-coordinates="${coordinates}"]`);
    const dataStatus = dom.getAttribute("data-status");
    if (dataStatus === "free") {
      domList.push((0,_dom_ui_drag_and_drop__WEBPACK_IMPORTED_MODULE_0__.getAttributeArr)(dom, "data-coordinates"));
    }
  });
  return domList;
};
const checkAdjecentListDom = (adjecentList, opponentBoard) => adjecentList.every(coordinates => {
  const dom = opponentBoard.querySelector(`[data-coordinates="${coordinates}"]`);
  return !(dom.classList.contains("taggedChecked") || dom.classList.contains("taggedUnchecked"));
});
const checkForTaggedDom = (targetDom, board, opponentBoard) => {
  const container = [];
  targetDom.forEach(dom => {
    const coordinates = (0,_dom_ui_drag_and_drop__WEBPACK_IMPORTED_MODULE_0__.getAttributeArr)(dom, "data-coordinates");
    const adjecentList = (0,_placement_logic__WEBPACK_IMPORTED_MODULE_2__.getAdjecentList)(coordinates, board).map(index => board[index].coordinates);
    if (checkAdjecentListDom(adjecentList, opponentBoard)) {
      container.push(coordinates);
    }
  });
  return container;
};
const getCalculatedSpaceMove = (board, opponentBoard) => {
  const freeDom = opponentBoard.querySelectorAll('[data-status="free"]');
  const container = checkForTaggedDom(freeDom, board, opponentBoard);
  const filteredAndSorted = (0,_dom_ui_placement_dom_logic__WEBPACK_IMPORTED_MODULE_1__.removeDuplicateArr)((0,_dom_ui_placement_dom_logic__WEBPACK_IMPORTED_MODULE_1__.filterAndSortArr)(container));
  return filteredAndSorted[(0,_placement_logic__WEBPACK_IMPORTED_MODULE_2__.randomIndex)(filteredAndSorted.length)];
};
const getFreeOrientationAdjecentList = (dom, orientation, opponentBoard) => {
  const coordinates = (0,_dom_ui_drag_and_drop__WEBPACK_IMPORTED_MODULE_0__.getAttributeArr)(dom, "data-coordinates");
  const rowAdjecentList = getAIOrientationAdjecentList(coordinates, orientation);
  return getFreeAdjecentList(rowAdjecentList, opponentBoard);
};
const makeCalculatedSpaceMove = (taggedDoms, coordinates, opponent, opponentBoard) => {
  const dom = taggedDoms[0];
  const taggedDomCoordinates = (0,_dom_ui_drag_and_drop__WEBPACK_IMPORTED_MODULE_0__.getAttributeArr)(dom, "data-coordinates");
  const adjecentList = getAIAdjecentList(taggedDomCoordinates);
  const adjecentDom = getFreeAdjecentList(adjecentList, opponentBoard);
  const freeAdjecentDom = checkForTaggedDom(adjecentDom.map(coord => opponentBoard.querySelector(`[data-coordinates="${coord}"]`)), opponent.board.board, opponentBoard);
  if (freeAdjecentDom.length === 0) {
    dom.classList.remove("tagged-unchecked");
    dom.classList.add("tagged-checked");
    return coordinates;
  }
  console.log({
    freeAdjecentDom
  });
  const calculatedCoordinates = freeAdjecentDom[(0,_placement_logic__WEBPACK_IMPORTED_MODULE_2__.randomIndex)(freeAdjecentDom.length)];
  const selectedDom = opponentBoard.querySelector(`[data-coordinates="${calculatedCoordinates}"`);
  if (selectedDom.classList.contains("ship")) {
    tagDomOrientation(dom, selectedDom);
    dom.classList.remove("tagged-unchecked");
    dom.classList.add("tagged-checked");
  }
  return calculatedCoordinates;
};
const makeCalculatedOrientationMove = (taggedDom, orientation, opponentBoard) => {
  if (taggedDom.length === 0) {
    return null;
  }
  const slicedTaggedDom = Array.from(taggedDom).slice(1);
  const freeOrientationAdjecentList = getFreeOrientationAdjecentList(taggedDom[0], orientation, opponentBoard);
  if (freeOrientationAdjecentList.length < 1) {
    taggedDom[0].classList.remove("tagged-unchecked");
    taggedDom[0].classList.add("tagged-checked");
    return makeCalculatedOrientationMove(slicedTaggedDom, orientation, opponentBoard);
  }
  if (freeOrientationAdjecentList.length <= 1) {
    taggedDom[0].classList.add(`${orientation}-checked`);
    taggedDom[0].classList.remove(`${orientation}`);
  }
  const orientationCoordinates = freeOrientationAdjecentList[(0,_placement_logic__WEBPACK_IMPORTED_MODULE_2__.randomIndex)(freeOrientationAdjecentList.length)];
  if (freeOrientationAdjecentList.length > 0 && taggedDom[0] !== null) {
    taggedDom[0].classList.remove("tagged-unchecked");
    taggedDom[0].classList.add("tagged-checked");
    const selectedDom = opponentBoard.querySelector(`[data-coordinates="${orientationCoordinates}"]`);
    if (selectedDom.classList.contains("ship")) {
      tagDomOrientation(taggedDom[0], selectedDom);
    }
  }
  console.log(orientationCoordinates);
  return orientationCoordinates;
};
const aiSmartMove = (taggedRowDom, taggedColumnDom, taggedDom, coordinates, opponentBoard, opponent) => {
  const rowCoordinates = makeCalculatedOrientationMove(taggedRowDom, "row", opponentBoard);
  const columnCoordinates = makeCalculatedOrientationMove(taggedColumnDom, "column", opponentBoard);
  if (rowCoordinates !== null) {
    return rowCoordinates;
  }
  if (columnCoordinates !== null) {
    return columnCoordinates;
  }
  if (taggedDom.length > 0) {
    return makeCalculatedSpaceMove(taggedDom, coordinates, opponent, opponentBoard);
  }
  return coordinates;
};
const aiMakeAMove = (boardDom, player, opponent) => {
  const opponentBoard = boardDom.querySelector(`[data-name="${opponent.player.name}"]`);
  const coordinates = getCalculatedSpaceMove(opponent.board.board, opponentBoard);
  const taggedDoms = opponentBoard.querySelectorAll(".tagged-unchecked");
  const taggedRowDom = opponentBoard.querySelectorAll(".row");
  const taggedColumnDom = opponentBoard.querySelectorAll(".column");
  if (taggedRowDom.length > 0 || taggedColumnDom > 0) {
    return aiSmartMove(taggedRowDom, taggedColumnDom, taggedDoms, coordinates, opponentBoard, opponent);
  }
  if (taggedDoms.length > 0) {
    return makeCalculatedSpaceMove(taggedDoms, coordinates, opponent, opponentBoard);
  }
  return coordinates;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (aiMakeAMove);

/***/ }),

/***/ "./src/dom-ui/color-changing.js":
/*!**************************************!*\
  !*** ./src/dom-ui/color-changing.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   setMultipleBorderColor: () => (/* binding */ setMultipleBorderColor),
/* harmony export */   setRandomColor: () => (/* binding */ setRandomColor)
/* harmony export */ });
/* harmony import */ var _placement_logic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../placement-logic */ "./src/placement-logic.js");

const setRandomColor = (colors, dom, style) => {
  const color = colors[(0,_placement_logic__WEBPACK_IMPORTED_MODULE_0__.randomIndex)(colors.length)];
  const target = dom;
  target.style[style] = `${color}`;
};
const setMultipleBorderColor = (colors, dom) => {
  setRandomColor(colors, dom, "border-right-color");
  setRandomColor(colors, dom, "border-top-color");
  setRandomColor(colors, dom, "border-bottom-color");
  setRandomColor(colors, dom, "border-left-color");
};


/***/ }),

/***/ "./src/dom-ui/dom-method.js":
/*!**********************************!*\
  !*** ./src/dom-ui/dom-method.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addAttributesToEl: () => (/* binding */ addAttributesToEl),
/* harmony export */   createElWithClassAndText: () => (/* binding */ createElWithClassAndText)
/* harmony export */ });
const createElWithClassAndText = function () {
  let type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "div";
  let className = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  let text = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
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


/***/ }),

/***/ "./src/dom-ui/dom-ui.js":
/*!******************************!*\
  !*** ./src/dom-ui/dom-ui.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   populateBoard: () => (/* binding */ populateBoard),
/* harmony export */   setUpAIBoard: () => (/* binding */ setUpAIBoard),
/* harmony export */   setUpGameboardDom: () => (/* binding */ setUpGameboardDom),
/* harmony export */   setUpPlayerBoard: () => (/* binding */ setUpPlayerBoard),
/* harmony export */   updateStatusDom: () => (/* binding */ updateStatusDom)
/* harmony export */ });
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../ship */ "./src/ship.js");
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../gameboard */ "./src/gameboard.js");
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../player */ "./src/player.js");
/* harmony import */ var _placement_logic__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../placement-logic */ "./src/placement-logic.js");
/* harmony import */ var _dom_method__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dom-method */ "./src/dom-ui/dom-method.js");





const setUpPlayerBoard = playerName => {
  const player = (0,_player__WEBPACK_IMPORTED_MODULE_2__.Player)(playerName);
  const board = (0,_gameboard__WEBPACK_IMPORTED_MODULE_1__["default"])(10);
  const type = "player";
  return {
    player,
    board,
    type
  };
};
const populateBoard = board => {
  const spec = {
    ship: [(0,_ship__WEBPACK_IMPORTED_MODULE_0__["default"])(5), (0,_ship__WEBPACK_IMPORTED_MODULE_0__["default"])(4), (0,_ship__WEBPACK_IMPORTED_MODULE_0__["default"])(3), (0,_ship__WEBPACK_IMPORTED_MODULE_0__["default"])(3), (0,_ship__WEBPACK_IMPORTED_MODULE_0__["default"])(3), (0,_ship__WEBPACK_IMPORTED_MODULE_0__["default"])(2), (0,_ship__WEBPACK_IMPORTED_MODULE_0__["default"])(2), (0,_ship__WEBPACK_IMPORTED_MODULE_0__["default"])(2), (0,_ship__WEBPACK_IMPORTED_MODULE_0__["default"])(1), (0,_ship__WEBPACK_IMPORTED_MODULE_0__["default"])(1)]
  };
  let successPlacement = 0;
  while (successPlacement < spec.ship.length) {
    const index = (0,_placement_logic__WEBPACK_IMPORTED_MODULE_3__.randomIndex)(board.board.length);
    const ship = spec.ship[successPlacement];
    const orientation = (0,_placement_logic__WEBPACK_IMPORTED_MODULE_3__.randomOrientation)();
    const coordinatesIndexList = board.findAllCoordinatesIndex(board.board[index].coordinates, ship, orientation);
    const adjecentList = (0,_placement_logic__WEBPACK_IMPORTED_MODULE_3__.getAdjecentList)(coordinatesIndexList, board.board);
    if ((0,_placement_logic__WEBPACK_IMPORTED_MODULE_3__.isPlacementValid)(coordinatesIndexList, adjecentList, board.board)) {
      board.placeShip(board.board[index].coordinates, ship, orientation);
      successPlacement += 1;
    }
  }
};
const setUpAIBoard = AIName => {
  const player = (0,_player__WEBPACK_IMPORTED_MODULE_2__.AIPlayer)(AIName);
  const board = (0,_gameboard__WEBPACK_IMPORTED_MODULE_1__["default"])(10);
  populateBoard(board);
  const type = "ai";
  return {
    player,
    board,
    type
  };
};
const createGameboardDom = player => {
  const boardDom = (0,_dom_method__WEBPACK_IMPORTED_MODULE_4__.createElWithClassAndText)("div", "gameboard");
  (0,_dom_method__WEBPACK_IMPORTED_MODULE_4__.addAttributesToEl)(boardDom, ["data-name", "data-player-type"], [`${player.player.name}`, player.type]);
  player.board.board.forEach((square, index) => {
    const squareDom = document.createElement("button");
    squareDom.setAttribute("data-coordinates", `${player.board.board[index].coordinates}`);
    squareDom.setAttribute("data-status", `${player.board.board[index].status}`);
    squareDom.classList.add("square");
    if (player.board.board[index].ship && player.type === "player") {
      squareDom.classList.add("ship");
    }
    boardDom.appendChild(squareDom);
  });
  return boardDom;
};
const updateStatusDom = (dom, status) => {
  dom.setAttribute("data-status", status);
};
const setUpGameboardDom = (player, type) => createGameboardDom(player, type);


/***/ }),

/***/ "./src/dom-ui/drag-and-drop.js":
/*!*************************************!*\
  !*** ./src/dom-ui/drag-and-drop.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addDataInfoAttr: () => (/* binding */ addDataInfoAttr),
/* harmony export */   dragoverHandler: () => (/* binding */ dragoverHandler),
/* harmony export */   dragstartHandler: () => (/* binding */ dragstartHandler),
/* harmony export */   dropHandler: () => (/* binding */ dropHandler),
/* harmony export */   getAttributeArr: () => (/* binding */ getAttributeArr),
/* harmony export */   getCoordinatesList: () => (/* binding */ getCoordinatesList),
/* harmony export */   isAdjecentDomFree: () => (/* binding */ isAdjecentDomFree),
/* harmony export */   isCoordinatesFree: () => (/* binding */ isCoordinatesFree),
/* harmony export */   isCoordinatesValid: () => (/* binding */ isCoordinatesValid),
/* harmony export */   removeDataInfoAttr: () => (/* binding */ removeDataInfoAttr)
/* harmony export */ });
/* harmony import */ var _placement_dom_logic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./placement-dom-logic */ "./src/dom-ui/placement-dom-logic.js");

let dragStartItem;
const getAttributeArr = (dom, attr) => dom.getAttribute(attr).split(",").map(item => Number(item));
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
  return (0,_placement_dom_logic__WEBPACK_IMPORTED_MODULE_0__.checkDomPlacementValidity)(coordinatesList);
};
const removeDataInfoAttr = (coordinates, orientation, length) => {
  const coordinatesList = getCoordinatesList(coordinates, orientation, length);
  coordinatesList.forEach(coord => {
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
const checkDiff = (data1, data2) => data1 > data2 ? data1 - data2 : data2 - data1;
const getCorrectDropCoordinates = (orientation, data1, data2, dropCoordinates) => {
  if (orientation === "row") {
    const newCoord = [dropCoordinates[0], dropCoordinates[1] - checkDiff(data1[1], data2[1])];
    return newCoord;
  }
  const newCoord = [dropCoordinates[0] - checkDiff(data1[0], data2[0]), dropCoordinates[1]];
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
  return coordinatesList.every(coord => {
    const dom = document.querySelector(`[data-coordinates="${coord}"]`);
    return dom.getAttribute("data-info") === "free";
  });
};
const addDataInfoAttr = (coordinates, orientation, length) => {
  const coordinatesList = getCoordinatesList(coordinates, orientation, length);
  coordinatesList.forEach(coord => {
    const dom = document.querySelector(`[data-coordinates="${coord}"]`);
    dom.setAttribute("data-info", "occupied");
  });
};
const checkPlacementDomValidity = (target, currentPoint, dropPoint, prevCoordinates, newCoordinates, orientation, length) => {
  if (!isCoordinatesValid(newCoordinates, orientation, length) && isCoordinatesFree(newCoordinates, orientation, length) && isAdjecentDomFree(newCoordinates, orientation, length)) {
    addDataInfoAttr(newCoordinates, orientation, length);
    dropPoint.appendChild(target);
    target.setAttribute("data-head", `${newCoordinates}`);
  } else {
    currentPoint.appendChild(target);
    addDataInfoAttr(prevCoordinates, orientation, length);
  }
};
const appendChildToTarget = (dropPoint, target, correctCoordinates, ship) => {
  const {
    coordinates
  } = ship;
  const currentPoint = document.querySelector(`[data-coordinates="${coordinates}"]`);
  const {
    orientation
  } = ship;
  const {
    length
  } = ship;
  checkPlacementDomValidity(target, currentPoint, dropPoint, coordinates, correctCoordinates, orientation, length);
};
const createShipObjData = (coordinates, orientation, length) => ({
  coordinates,
  orientation,
  length
});
const dropShipOnNewCoordinates = (dropCoordinates, droppedItem) => {
  const dragItemCoordinates = getAttributeArr(droppedItem, "data-head");
  const dragItemOrientation = droppedItem.getAttribute("data-orientation");
  const dragItemLength = Number(getAttributeArr(droppedItem, "data-length"));
  const ship = createShipObjData(dragItemCoordinates, dragItemOrientation, dragItemLength);
  const dragStartCoordinates = getAttributeArr(dragStartItem, "data-coordinates");
  const correctCoordinates = getCorrectDropCoordinates(dragItemOrientation, dragItemCoordinates, dragStartCoordinates, dropCoordinates);
  const dropPoint = document.querySelector(`[data-coordinates="${correctCoordinates}"]`);
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


/***/ }),

/***/ "./src/dom-ui/game-dom-ui.js":
/*!***********************************!*\
  !*** ./src/dom-ui/game-dom-ui.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Game: () => (/* binding */ Game),
/* harmony export */   aITakeATurn: () => (/* binding */ aITakeATurn),
/* harmony export */   playerTakeATurn: () => (/* binding */ playerTakeATurn),
/* harmony export */   registerAttack: () => (/* binding */ registerAttack)
/* harmony export */ });
/* harmony import */ var _dom_ui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom-ui */ "./src/dom-ui/dom-ui.js");
/* harmony import */ var _color_changing__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./color-changing */ "./src/dom-ui/color-changing.js");
/* harmony import */ var _dom_method__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dom-method */ "./src/dom-ui/dom-method.js");
/* harmony import */ var _ai_smart_turn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../ai-smart-turn */ "./src/ai-smart-turn.js");
/* harmony import */ var _restart_game__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./restart-game */ "./src/dom-ui/restart-game.js");





const colors = ["#65dc98", "#ff2a6d", "#05d9e8", "#defe47", "#d1f7ff", "#7700a6", "#1afe49"];
const announceWinner = (player1, player2) => {
  const content = document.getElementById("content");
  if (player1.board.haveAllShipsSunk()) {
    content.appendChild((0,_restart_game__WEBPACK_IMPORTED_MODULE_4__["default"])(player2.player.name));
  } else {
    content.appendChild((0,_restart_game__WEBPACK_IMPORTED_MODULE_4__["default"])(player1.player.name));
  }
};
const gameOver = (player1, player2) => player1.board.haveAllShipsSunk() || player2.board.haveAllShipsSunk();
const checkAllShips = (player1, player2) => {
  if (gameOver(player1, player2)) {
    announceWinner(player1, player2);
  }
};
const checkAIShipCoordinates = (dom, coordinates, player, opponent) => {
  const square = opponent.board.getCoordinates(coordinates);
  if (player.type === "player" && "ship" in square) {
    dom.classList.add("ship");
  }
};
const checkPlayerShipCoordinates = (dom, coordinates, player, opponent) => {
  const square = opponent.board.getCoordinates(coordinates);
  if (player.type === "ai" && "ship" in square) {
    dom.classList.add("tagged-unchecked");
  }
};
const attackOpponentBoard = (dom, coordinates, player, opponent) => {
  checkAIShipCoordinates(dom, coordinates, player, opponent);
  checkPlayerShipCoordinates(dom, coordinates, player, opponent);
  player.player.attack(coordinates, opponent.board, "receiveAttack");
  (0,_dom_ui__WEBPACK_IMPORTED_MODULE_0__.updateStatusDom)(dom, opponent.board.getCoordinates(coordinates).status);
  (0,_color_changing__WEBPACK_IMPORTED_MODULE_1__.setMultipleBorderColor)(colors, dom);
  checkAllShips(player, opponent);
};
const findDomChildrenByAttribute = (parentDom, attribute, key) => parentDom.querySelector(`[${attribute} = "${key}"]`);
const colorShip = (colorsArr, dom, coordinates, opponent) => {
  if ("ship" in opponent.board.getCoordinates(coordinates)) {
    (0,_color_changing__WEBPACK_IMPORTED_MODULE_1__.setRandomColor)(colorsArr, dom, "backgroundColor");
  }
};
const aITakeATurn = (parentDom, player, opponent) => {
  const coordinates = (0,_ai_smart_turn__WEBPACK_IMPORTED_MODULE_3__["default"])(parentDom, player, opponent);
  const dom = findDomChildrenByAttribute(parentDom, "data-coordinates", `${coordinates}`);
  if (!gameOver(player, opponent)) {
    attackOpponentBoard(dom, coordinates, player, opponent);
    colorShip(colors, dom, coordinates, opponent);
  }
};
const playerTakeATurn = (playerDom, opponentDom, coordinates, player, opponent) => {
  attackOpponentBoard(playerDom, coordinates, player, opponent);
  if (!gameOver(player, opponent)) {
    aITakeATurn(opponentDom.parentElement, opponent, player);
  }
};
const checkTurnValidity = (playerDom, opponentDom, coordinates, player, opponent, fn) => {
  if (playerDom.getAttribute("data-status") === "free" && !opponent.board.haveAllShipsSunk() && !player.board.haveAllShipsSunk()) {
    fn(playerDom, opponentDom, coordinates, player, opponent);
  }
};
const registerAttack = (playerDom, opponentDom, coordinates, player, opponent, fn) => {
  checkTurnValidity(playerDom, opponentDom, coordinates, player, opponent, fn);
};
const getDomCoordinates = dom => dom.getAttribute("data-coordinates").split(",").map(num => Number(num));
const Game = (player1, player2) => {
  const gameDom = (0,_dom_method__WEBPACK_IMPORTED_MODULE_2__.createElWithClassAndText)("div", "game");
  const vsText = (0,_dom_method__WEBPACK_IMPORTED_MODULE_2__.createElWithClassAndText)("div", "vs-text", "VS");
  const player1Dom = (0,_dom_ui__WEBPACK_IMPORTED_MODULE_0__.setUpGameboardDom)(player1);
  const player2Dom = (0,_dom_ui__WEBPACK_IMPORTED_MODULE_0__.setUpGameboardDom)(player2);
  player2Dom.childNodes.forEach(node => {
    node.addEventListener("click", registerAttack.bind(undefined, node, player2Dom, getDomCoordinates(node), player1, player2, playerTakeATurn));
  });
  gameDom.appendChild(player1Dom);
  gameDom.appendChild(vsText);
  gameDom.appendChild(player2Dom);
  return gameDom;
};


/***/ }),

/***/ "./src/dom-ui/lobby-ui.js":
/*!********************************!*\
  !*** ./src/dom-ui/lobby-ui.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _dom_method__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom-method */ "./src/dom-ui/dom-method.js");
/* harmony import */ var _dom_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom-ui */ "./src/dom-ui/dom-ui.js");
/* harmony import */ var _ship_placement_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ship-placement-ui */ "./src/dom-ui/ship-placement-ui.js");
/* harmony import */ var _drag_and_drop__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./drag-and-drop */ "./src/dom-ui/drag-and-drop.js");
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../ship */ "./src/ship.js");
/* harmony import */ var _game_dom_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./game-dom-ui */ "./src/dom-ui/game-dom-ui.js");






const createGreetingDom = () => {
  const greeting = (0,_dom_method__WEBPACK_IMPORTED_MODULE_0__.createElWithClassAndText)("h2", "greeting", "It's time to place your battleships Commander!");
  return greeting;
};
const getAllShipsData = () => {
  const ships = [];
  for (let i = 0; i < 10; i += 1) {
    const shipDom = document.getElementById(`${i}`);
    const coordinates = (0,_drag_and_drop__WEBPACK_IMPORTED_MODULE_3__.getAttributeArr)(shipDom, "data-head");
    const orientation = shipDom.getAttribute("data-orientation");
    const length = Number(shipDom.getAttribute("data-length"));
    ships.push({
      coordinates,
      orientation,
      length
    });
  }
  return ships;
};
const removeLobby = parentDom => {
  const lobby = document.querySelector(".harbor");
  if (lobby) {
    parentDom.removeChild(lobby);
  }
};
const appendGameDom = (parentDom, dom) => {
  const gameDom = document.querySelector(".game");
  if (gameDom) {
    parentDom.replaceChild(dom, gameDom);
  } else {
    parentDom.appendChild(dom);
  }
};
const startGame = () => {
  const content = document.getElementById("content");
  const player1 = (0,_dom_ui__WEBPACK_IMPORTED_MODULE_1__.setUpPlayerBoard)("player1");
  const {
    board
  } = player1;
  const ships = getAllShipsData();
  const player2 = (0,_dom_ui__WEBPACK_IMPORTED_MODULE_1__.setUpAIBoard)("player2");
  ships.forEach(ship => {
    board.placeShip(ship.coordinates, (0,_ship__WEBPACK_IMPORTED_MODULE_4__["default"])(ship.length), ship.orientation);
  });
  removeLobby(content);
  const gameDom = (0,_game_dom_ui__WEBPACK_IMPORTED_MODULE_5__.Game)(player1, player2);
  appendGameDom(content, gameDom);
};
const createStartGameBtn = () => (0,_dom_method__WEBPACK_IMPORTED_MODULE_0__.createElWithClassAndText)("button", "start-btn", "Start");
const createLobbyDom = () => {
  const lobby = (0,_dom_method__WEBPACK_IMPORTED_MODULE_0__.createElWithClassAndText)("div", "harbor");
  const player = (0,_dom_ui__WEBPACK_IMPORTED_MODULE_1__.setUpPlayerBoard)("player1");
  (0,_dom_ui__WEBPACK_IMPORTED_MODULE_1__.populateBoard)(player.board);
  const greeting = createGreetingDom();
  const lobbyContainer = (0,_dom_method__WEBPACK_IMPORTED_MODULE_0__.createElWithClassAndText)("div", "lobby-container");
  const mainLobbyContainer = (0,_dom_method__WEBPACK_IMPORTED_MODULE_0__.createElWithClassAndText)("div", "main-lobby-container");
  const gameboardContainer = (0,_dom_method__WEBPACK_IMPORTED_MODULE_0__.createElWithClassAndText)("div", "gameboard-container");
  const playerDom = (0,_ship_placement_ui__WEBPACK_IMPORTED_MODULE_2__.createGameboardTable)(player);
  (0,_ship_placement_ui__WEBPACK_IMPORTED_MODULE_2__.createShipDom)(player.board, playerDom);
  const startBtnContainer = (0,_dom_method__WEBPACK_IMPORTED_MODULE_0__.createElWithClassAndText)("div", "start-btn-container");
  const startGameBtn = createStartGameBtn();
  startGameBtn.addEventListener("click", startGame);
  startBtnContainer.appendChild(startGameBtn);
  mainLobbyContainer.appendChild(greeting);
  gameboardContainer.appendChild(playerDom);
  mainLobbyContainer.appendChild(gameboardContainer);
  mainLobbyContainer.appendChild(startBtnContainer);
  lobbyContainer.appendChild(mainLobbyContainer);
  lobby.appendChild(lobbyContainer);
  return lobby;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createLobbyDom);

/***/ }),

/***/ "./src/dom-ui/placement-dom-logic.js":
/*!*******************************************!*\
  !*** ./src/dom-ui/placement-dom-logic.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   checkDomPlacementValidity: () => (/* binding */ checkDomPlacementValidity),
/* harmony export */   filterAndSortArr: () => (/* binding */ filterAndSortArr),
/* harmony export */   removeDuplicateArr: () => (/* binding */ removeDuplicateArr)
/* harmony export */ });
const isSquareOnTheSameRow = (square1, square2) => square1[0] === square2[0];
const validateSquaresRow = (coordinates1, coordinates2) => isSquareOnTheSameRow(coordinates1, coordinates2) ? coordinates1 : -1;
const isArrExist = (arr, target) => arr.filter(item => item[0] === target[0] && item[1] === target[1]).length === 1;
const removeDuplicateArr = arr => {
  const filteredArr = [];
  arr.forEach(item => {
    if (!isArrExist(filteredArr, item)) {
      filteredArr.push(item);
    }
  });
  return filteredArr;
};
const filterAndSortArr = arr => arr.filter(item => item[0] >= 0 && item[0] <= 9 && item[1] >= 0 && item[1] <= 9).sort((a, b) => Number(a[0].toString() + a[1].toString()) - Number(b[0].toString() + b[1].toString()));
const getAdjecentList = coordinatesList => {
  const list = [];
  coordinatesList.forEach(coord => {
    const topCoord = [coord[0] - 1, coord[1]];
    const btmCoord = [coord[0] + 1, coord[1]];
    const lTopCoord = [topCoord[0], topCoord[1] - 1];
    const rTopCoord = [topCoord[0], topCoord[1] + 1];
    const lCoord = [coord[0], coord[1] - 1];
    const rCoord = [coord[0], coord[1] + 1];
    const lBtmCoord = [btmCoord[0], btmCoord[1] - 1];
    const rBtmCoord = [btmCoord[0], btmCoord[1] + 1];
    list.push(validateSquaresRow(lTopCoord, topCoord));
    list.push(topCoord);
    list.push(validateSquaresRow(rTopCoord, topCoord));
    list.push(validateSquaresRow(lCoord, coord));
    list.push(validateSquaresRow(rCoord, coord));
    list.push(validateSquaresRow(lBtmCoord, btmCoord));
    list.push(btmCoord);
    list.push(validateSquaresRow(rBtmCoord, btmCoord));
  });
  return removeDuplicateArr(filterAndSortArr(list));
};
const checkDomPlacementValidity = coordinatesList => {
  const adjecentList = getAdjecentList(coordinatesList);
  return adjecentList.every(coordinates => {
    const dom = document.querySelector(`[data-coordinates="${coordinates}"]`);
    const dataInfo = dom.getAttribute("data-info");
    return dataInfo === "free";
  });
};


/***/ }),

/***/ "./src/dom-ui/restart-game.js":
/*!************************************!*\
  !*** ./src/dom-ui/restart-game.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _dom_method__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom-method */ "./src/dom-ui/dom-method.js");
/* harmony import */ var _lobby_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lobby-ui */ "./src/dom-ui/lobby-ui.js");


const removeGameDom = parentDom => {
  const game = document.querySelector(".game");
  if (game) {
    parentDom.removeChild(game);
  }
};
const removePopUp = parentDom => {
  const popUp = document.querySelector(".winner-container");
  if (popUp) {
    parentDom.removeChild(popUp);
  }
};
const restartGame = () => {
  const content = document.getElementById("content");
  removeGameDom(content);
  removePopUp(content);
  content.appendChild((0,_lobby_ui__WEBPACK_IMPORTED_MODULE_1__["default"])());
};
const createWinnerDom = winner => {
  const winnerDomContainer = (0,_dom_method__WEBPACK_IMPORTED_MODULE_0__.createElWithClassAndText)("div", "winner-container");
  const winnerDom = (0,_dom_method__WEBPACK_IMPORTED_MODULE_0__.createElWithClassAndText)("div", "winner-dom", `${winner.toUpperCase()} WON!`);
  const restartBtn = (0,_dom_method__WEBPACK_IMPORTED_MODULE_0__.createElWithClassAndText)("button", "restart", "restart");
  restartBtn.addEventListener("click", restartGame);
  winnerDomContainer.appendChild(winnerDom);
  winnerDomContainer.appendChild(restartBtn);
  return winnerDomContainer;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createWinnerDom);

/***/ }),

/***/ "./src/dom-ui/ship-orientation-control.js":
/*!************************************************!*\
  !*** ./src/dom-ui/ship-orientation-control.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _drag_and_drop__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./drag-and-drop */ "./src/dom-ui/drag-and-drop.js");

const geOppositeOrientation = orientation => {
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
const changeOrientationDom = (target, coordinates, orientation, length) => {
  changeShipOrientationStyle(target, orientation, length);
  target.setAttribute("data-orientation", `${orientation}`);
  (0,_drag_and_drop__WEBPACK_IMPORTED_MODULE_0__.addDataInfoAttr)(coordinates, orientation, length);
};
const validateAdjecentDom = (target, coordinates, newOrientation, prevOrientation, length) => {
  if ((0,_drag_and_drop__WEBPACK_IMPORTED_MODULE_0__.isAdjecentDomFree)(coordinates, newOrientation, length)) {
    changeOrientationDom(target, coordinates, newOrientation, length);
  } else {
    (0,_drag_and_drop__WEBPACK_IMPORTED_MODULE_0__.addDataInfoAttr)(coordinates, prevOrientation, length);
  }
};
const validatePlacement = (target, coordinates, newOrientation, prevOrientation, length) => {
  if ((0,_drag_and_drop__WEBPACK_IMPORTED_MODULE_0__.isCoordinatesFree)(coordinates, newOrientation, length)) {
    validateAdjecentDom(target, coordinates, newOrientation, prevOrientation, length);
  } else {
    (0,_drag_and_drop__WEBPACK_IMPORTED_MODULE_0__.addDataInfoAttr)(coordinates, prevOrientation, length);
  }
};
const changeOrientation = ev => {
  const {
    target
  } = ev;
  const coordinates = (0,_drag_and_drop__WEBPACK_IMPORTED_MODULE_0__.getAttributeArr)(target, "data-head");
  const orientation = target.getAttribute("data-orientation");
  const newOrientation = geOppositeOrientation(orientation);
  const length = Number(target.getAttribute("data-length"));
  (0,_drag_and_drop__WEBPACK_IMPORTED_MODULE_0__.removeDataInfoAttr)(coordinates, orientation, length);
  if (!(0,_drag_and_drop__WEBPACK_IMPORTED_MODULE_0__.isCoordinatesValid)(coordinates, newOrientation, length)) {
    validatePlacement(target, coordinates, newOrientation, orientation, length);
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (changeOrientation);

/***/ }),

/***/ "./src/dom-ui/ship-placement-ui.js":
/*!*****************************************!*\
  !*** ./src/dom-ui/ship-placement-ui.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createGameboardTable: () => (/* binding */ createGameboardTable),
/* harmony export */   createShipDom: () => (/* binding */ createShipDom)
/* harmony export */ });
/* harmony import */ var _dom_method__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom-method */ "./src/dom-ui/dom-method.js");
/* harmony import */ var _drag_and_drop__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./drag-and-drop */ "./src/dom-ui/drag-and-drop.js");
/* harmony import */ var _ship_orientation_control__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ship-orientation-control */ "./src/dom-ui/ship-orientation-control.js");



const createRowsFromBoard = (board, rowLength) => {
  const rows = [];
  for (let i = 0; i < board.length / rowLength; i += 1) {
    const row = [];
    for (let j = 0; j < board.length / rowLength; j += 1) {
      row.push(board[Number(i.toString() + j.toString())]);
    }
    rows.push(row);
  }
  return rows;
};
const createGameboardRowDom = (rowDom, rowArr) => {
  rowArr.forEach(square => {
    const squareDom = (0,_dom_method__WEBPACK_IMPORTED_MODULE_0__.createElWithClassAndText)("td", "square");
    (0,_dom_method__WEBPACK_IMPORTED_MODULE_0__.addAttributesToEl)(squareDom, ["data-coordinates", "data-info"], [`${square.coordinates}`, "free"]);
    squareDom.addEventListener("drop", _drag_and_drop__WEBPACK_IMPORTED_MODULE_1__.dropHandler);
    squareDom.addEventListener("dragover", _drag_and_drop__WEBPACK_IMPORTED_MODULE_1__.dragoverHandler);
    rowDom.appendChild(squareDom);
  });
};
const createRowDom = (rowDom, rowArr) => {
  rowArr.forEach(item => {
    const dom = (0,_dom_method__WEBPACK_IMPORTED_MODULE_0__.createElWithClassAndText)("th", "", item);
    dom.setAttribute("scope", "column");
    rowDom.appendChild(dom);
  });
};
const createColumnHeader = () => {
  const row = document.createElement("tr");
  row.appendChild((0,_dom_method__WEBPACK_IMPORTED_MODULE_0__.createElWithClassAndText)("td"));
  createRowDom(row, ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]);
  return row;
};
const createGameboardTable = player => {
  const boardDom = (0,_dom_method__WEBPACK_IMPORTED_MODULE_0__.createElWithClassAndText)("table", "gameboard");
  boardDom.setAttribute("data-name", `${player.player.name}`);
  boardDom.appendChild(createColumnHeader());
  const rows = createRowsFromBoard(player.board.board, 10);
  rows.forEach((row, index) => {
    const rowDom = document.createElement("tr");
    const rowHead = (0,_dom_method__WEBPACK_IMPORTED_MODULE_0__.createElWithClassAndText)("th", "", index + 1);
    rowHead.setAttribute("scope", "row");
    rowDom.appendChild(rowHead);
    createGameboardRowDom(rowDom, row);
    boardDom.appendChild(rowDom);
  });
  return boardDom;
};
const styleShipByItsLength = (dom, length, orientation) => {
  const el = dom;
  if (orientation === "row") {
    el.style.width = `calc(${length * 100}% + ${length - 1}px)`;
  } else {
    el.style.height = `calc(${length * 100}% + ${length - 1}px)`;
  }
};
const setDataInfoAttr = (ship, board, boardDom) => {
  const {
    coordinates
  } = ship;
  const {
    orientation
  } = ship;
  const coordinatesList = board.getAllCoordinatesListByIndex(coordinates, ship.ship, orientation);
  coordinatesList.forEach(coord => {
    const dom = boardDom.querySelector(`[data-coordinates="${coord}"]`);
    (0,_dom_method__WEBPACK_IMPORTED_MODULE_0__.addAttributesToEl)(dom, ["data-info"], ["occupied"]);
  });
};
const createDraggableItem = (index, orientation, length, head) => {
  const draggable = (0,_dom_method__WEBPACK_IMPORTED_MODULE_0__.createElWithClassAndText)("div", "draggable");
  (0,_dom_method__WEBPACK_IMPORTED_MODULE_0__.addAttributesToEl)(draggable, ["id", "draggable", "data-orientation", "data-length", "data-head"], [`${index}`, true, orientation, `${length}`, `${head}`]);
  styleShipByItsLength(draggable, length, orientation);
  draggable.addEventListener("dragstart", _drag_and_drop__WEBPACK_IMPORTED_MODULE_1__.dragstartHandler);
  draggable.addEventListener("dblclick", _ship_orientation_control__WEBPACK_IMPORTED_MODULE_2__["default"]);
  return draggable;
};
const createShipDom = (board, boardDom) => {
  board.ships.forEach((ship, index) => {
    const dom = boardDom.querySelector(`[data-coordinates="${ship.coordinates}"]`);
    setDataInfoAttr(ship, board, boardDom);
    dom.appendChild(createDraggableItem(index, ship.orientation, ship.ship.length, ship.coordinates));
  });
};


/***/ }),

/***/ "./src/gameboard.js":
/*!**************************!*\
  !*** ./src/gameboard.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const Gameboard = length => {
  const createBoard = () => {
    const board = [];
    for (let i = 0; i < length; i += 1) {
      for (let j = 0; j < length; j += 1) {
        board.push({
          coordinates: [i, j],
          status: "free"
        });
      }
    }
    return board;
  };
  const board = createBoard();
  const ships = [];
  const getCoordinates = coordinates => board.find(square => square.coordinates[0] === coordinates[0] && square.coordinates[1] === coordinates[1]);
  const getCoordinatesIndex = coordinates => board.findIndex(square => square.coordinates[0] === coordinates[0] && square.coordinates[1] === coordinates[1]);
  const getEndPoint = (coordinates, obj, orientation) => {
    if (orientation.toLowerCase() === "row") {
      return [coordinates[0], coordinates[1] + obj.length - 1];
    }
    if (orientation.toLowerCase() === "column") {
      return [coordinates[0] + obj.length - 1, coordinates[1]];
    }
  };
  const isEndPointValid = endPoint => getCoordinates(endPoint);
  const findAllCoordinatesIndex = (coordinates, obj, orientation) => {
    const coordinatesList = [];
    if (orientation.toLowerCase() === "row") {
      for (let i = 0; i < obj.length; i += 1) {
        coordinatesList.push(getCoordinatesIndex([coordinates[0], coordinates[1] + i]));
      }
    }
    if (orientation.toLowerCase() === "column") {
      for (let i = 0; i < obj.length; i += 1) {
        coordinatesList.push(getCoordinatesIndex([coordinates[0] + i, coordinates[1]]));
      }
    }
    return coordinatesList;
  };
  const getAllCoordinatesListByIndex = (coordinates, obj, orientation) => {
    const indexList = findAllCoordinatesIndex(coordinates, obj, orientation);
    return indexList.map(index => board[index].coordinates);
  };
  const checkAllSquare = (coordinatesList, key) => coordinatesList.every(coordinates => !(key in board[coordinates]));
  const addShipToArr = (ship, orientation, coordinates) => {
    ships.push({
      ship,
      orientation,
      coordinates
    });
  };
  const placeShipOnBoard = (coordinatesList, obj, orientation, coordinates) => {
    if (checkAllSquare(coordinatesList, "ship")) {
      addShipToArr(obj, orientation, coordinates);
      coordinatesList.forEach(index => {
        board[index].ship = obj;
      });
    }
  };
  const placeShip = (coordinates, obj, orientation) => {
    const endPoint = getEndPoint(coordinates, obj, orientation);
    if (isEndPointValid(endPoint)) {
      const coordinatesList = findAllCoordinatesIndex(coordinates, obj, orientation);
      placeShipOnBoard(coordinatesList, obj, orientation, coordinates);
    }
  };
  const receiveAttack = coordinates => {
    const currentSquare = getCoordinates(coordinates);
    if (currentSquare.status !== "targeted") {
      if ("ship" in currentSquare) {
        currentSquare.ship.hit();
      }
      currentSquare.status = "targeted";
    }
  };
  const haveAllShipsSunk = () => ships.every(obj => obj.ship.isSunk());
  return {
    get board() {
      return board;
    },
    get ships() {
      return ships;
    },
    placeShip,
    getCoordinates,
    getCoordinatesIndex,
    getEndPoint,
    findAllCoordinatesIndex,
    getAllCoordinatesListByIndex,
    receiveAttack,
    haveAllShipsSunk
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Gameboard);

/***/ }),

/***/ "./src/placement-logic.js":
/*!********************************!*\
  !*** ./src/placement-logic.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getAdjecentList: () => (/* binding */ getAdjecentList),
/* harmony export */   isPlacementValid: () => (/* binding */ isPlacementValid),
/* harmony export */   isSquareOnTheSameRow: () => (/* binding */ isSquareOnTheSameRow),
/* harmony export */   randomIndex: () => (/* binding */ randomIndex),
/* harmony export */   randomOrientation: () => (/* binding */ randomOrientation),
/* harmony export */   validateSquaresRow: () => (/* binding */ validateSquaresRow)
/* harmony export */ });
const randomIndex = length => Math.floor(Math.random() * length);
const randomOrientation = () => {
  const orientationList = ["row", "column"];
  const index = randomIndex(orientationList.length);
  return orientationList[index];
};
const isSquareOnTheSameRow = (square1, square2) => square1[0] === square2[0];
const isIndexValid = index => index >= 0 && index < 100;
const validateSquaresRow = (index1, index2, board) => {
  if (isIndexValid(index1) && isIndexValid(index2)) {
    return isSquareOnTheSameRow(board[index1].coordinates, board[index2].coordinates) ? index1 : -1;
  }
  return -1;
};
const getAdjecentList = (coordinatesIndexList, board) => {
  const list = [];
  coordinatesIndexList.forEach(index => {
    list.push(validateSquaresRow(index - 11, index - 10, board));
    list.push(index - 10);
    list.push(validateSquaresRow(index - 9, index - 10, board));
    list.push(validateSquaresRow(index - 1, index, board));
    list.push(validateSquaresRow(index + 1, index, board));
    list.push(validateSquaresRow(index + 9, index + 10, board));
    list.push(index + 10);
    list.push(validateSquaresRow(index + 11, index + 10, board));
  });
  return Array.from(new Set(list.filter(item => item >= 0 && item < 100).sort((a, b) => a - b)));
};
const checkPlacementValidity = (placementIndex, coordinatesIndexList, board) => {
  const shipPlacementValidity = placementIndex.every(index => !("ship" in board[index]));
  const adjecentListValidity = coordinatesIndexList.every(index => !("ship" in board[index]));
  return shipPlacementValidity && adjecentListValidity;
};
const isPlacementValid = (placementIndex, coordinatesIndexList, board) => {
  const placementIndexValidity = placementIndex.every(index => index >= 0 && index < 100);
  if (placementIndexValidity) {
    return checkPlacementValidity(placementIndex, coordinatesIndexList, board);
  }
  return false;
};


/***/ }),

/***/ "./src/player.js":
/*!***********************!*\
  !*** ./src/player.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AIPlayer: () => (/* binding */ AIPlayer),
/* harmony export */   Player: () => (/* binding */ Player)
/* harmony export */ });
const Player = name => {
  const attack = (coordinates, target, fn) => {
    target[fn](coordinates);
  };
  return {
    get name() {
      return name;
    },
    attack
  };
};
const AIPlayer = name => {
  const findCoordinatesIndex = (coordinates, board) => board.findIndex(square => square.coordinates[0] === coordinates[0] && square.coordinates[1] === coordinates[1]);
  const randomIndex = length => Math.floor(Math.random() * length);
  const filterBoard = board => board.filter(square => square.status === "free");
  const randomMove = board => {
    const activeSquares = filterBoard(board);
    const {
      coordinates
    } = activeSquares[randomIndex(activeSquares.length)];
    return findCoordinatesIndex(coordinates, board);
  };
  const {
    attack
  } = Player(name);
  return {
    get name() {
      return name;
    },
    attack,
    randomMove,
    randomIndex,
    filterBoard,
    findCoordinatesIndex
  };
};


/***/ }),

/***/ "./src/ship.js":
/*!*********************!*\
  !*** ./src/ship.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const Ship = function () {
  let length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  let numberOfHits = 0;
  const hit = () => {
    if (numberOfHits < length) {
      numberOfHits += 1;
    }
  };
  const isSunk = () => length === numberOfHits;
  return {
    get numberOfHits() {
      return numberOfHits;
    },
    get length() {
      return length;
    },
    hit,
    isSunk
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ship);

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/normalize.css/normalize.css":
/*!****************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/normalize.css/normalize.css ***!
  \****************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */

/* Document
   ========================================================================== */

/**
 * 1. Correct the line height in all browsers.
 * 2. Prevent adjustments of font size after orientation changes in iOS.
 */

html {
  line-height: 1.15; /* 1 */
  -webkit-text-size-adjust: 100%; /* 2 */
}

/* Sections
   ========================================================================== */

/**
 * Remove the margin in all browsers.
 */

body {
  margin: 0;
}

/**
 * Render the \`main\` element consistently in IE.
 */

main {
  display: block;
}

/**
 * Correct the font size and margin on \`h1\` elements within \`section\` and
 * \`article\` contexts in Chrome, Firefox, and Safari.
 */

h1 {
  font-size: 2em;
  margin: 0.67em 0;
}

/* Grouping content
   ========================================================================== */

/**
 * 1. Add the correct box sizing in Firefox.
 * 2. Show the overflow in Edge and IE.
 */

hr {
  box-sizing: content-box; /* 1 */
  height: 0; /* 1 */
  overflow: visible; /* 2 */
}

/**
 * 1. Correct the inheritance and scaling of font size in all browsers.
 * 2. Correct the odd \`em\` font sizing in all browsers.
 */

pre {
  font-family: monospace, monospace; /* 1 */
  font-size: 1em; /* 2 */
}

/* Text-level semantics
   ========================================================================== */

/**
 * Remove the gray background on active links in IE 10.
 */

a {
  background-color: transparent;
}

/**
 * 1. Remove the bottom border in Chrome 57-
 * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.
 */

abbr[title] {
  border-bottom: none; /* 1 */
  text-decoration: underline; /* 2 */
  text-decoration: underline dotted; /* 2 */
}

/**
 * Add the correct font weight in Chrome, Edge, and Safari.
 */

b,
strong {
  font-weight: bolder;
}

/**
 * 1. Correct the inheritance and scaling of font size in all browsers.
 * 2. Correct the odd \`em\` font sizing in all browsers.
 */

code,
kbd,
samp {
  font-family: monospace, monospace; /* 1 */
  font-size: 1em; /* 2 */
}

/**
 * Add the correct font size in all browsers.
 */

small {
  font-size: 80%;
}

/**
 * Prevent \`sub\` and \`sup\` elements from affecting the line height in
 * all browsers.
 */

sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}

/* Embedded content
   ========================================================================== */

/**
 * Remove the border on images inside links in IE 10.
 */

img {
  border-style: none;
}

/* Forms
   ========================================================================== */

/**
 * 1. Change the font styles in all browsers.
 * 2. Remove the margin in Firefox and Safari.
 */

button,
input,
optgroup,
select,
textarea {
  font-family: inherit; /* 1 */
  font-size: 100%; /* 1 */
  line-height: 1.15; /* 1 */
  margin: 0; /* 2 */
}

/**
 * Show the overflow in IE.
 * 1. Show the overflow in Edge.
 */

button,
input { /* 1 */
  overflow: visible;
}

/**
 * Remove the inheritance of text transform in Edge, Firefox, and IE.
 * 1. Remove the inheritance of text transform in Firefox.
 */

button,
select { /* 1 */
  text-transform: none;
}

/**
 * Correct the inability to style clickable types in iOS and Safari.
 */

button,
[type="button"],
[type="reset"],
[type="submit"] {
  -webkit-appearance: button;
}

/**
 * Remove the inner border and padding in Firefox.
 */

button::-moz-focus-inner,
[type="button"]::-moz-focus-inner,
[type="reset"]::-moz-focus-inner,
[type="submit"]::-moz-focus-inner {
  border-style: none;
  padding: 0;
}

/**
 * Restore the focus styles unset by the previous rule.
 */

button:-moz-focusring,
[type="button"]:-moz-focusring,
[type="reset"]:-moz-focusring,
[type="submit"]:-moz-focusring {
  outline: 1px dotted ButtonText;
}

/**
 * Correct the padding in Firefox.
 */

fieldset {
  padding: 0.35em 0.75em 0.625em;
}

/**
 * 1. Correct the text wrapping in Edge and IE.
 * 2. Correct the color inheritance from \`fieldset\` elements in IE.
 * 3. Remove the padding so developers are not caught out when they zero out
 *    \`fieldset\` elements in all browsers.
 */

legend {
  box-sizing: border-box; /* 1 */
  color: inherit; /* 2 */
  display: table; /* 1 */
  max-width: 100%; /* 1 */
  padding: 0; /* 3 */
  white-space: normal; /* 1 */
}

/**
 * Add the correct vertical alignment in Chrome, Firefox, and Opera.
 */

progress {
  vertical-align: baseline;
}

/**
 * Remove the default vertical scrollbar in IE 10+.
 */

textarea {
  overflow: auto;
}

/**
 * 1. Add the correct box sizing in IE 10.
 * 2. Remove the padding in IE 10.
 */

[type="checkbox"],
[type="radio"] {
  box-sizing: border-box; /* 1 */
  padding: 0; /* 2 */
}

/**
 * Correct the cursor style of increment and decrement buttons in Chrome.
 */

[type="number"]::-webkit-inner-spin-button,
[type="number"]::-webkit-outer-spin-button {
  height: auto;
}

/**
 * 1. Correct the odd appearance in Chrome and Safari.
 * 2. Correct the outline style in Safari.
 */

[type="search"] {
  -webkit-appearance: textfield; /* 1 */
  outline-offset: -2px; /* 2 */
}

/**
 * Remove the inner padding in Chrome and Safari on macOS.
 */

[type="search"]::-webkit-search-decoration {
  -webkit-appearance: none;
}

/**
 * 1. Correct the inability to style clickable types in iOS and Safari.
 * 2. Change font properties to \`inherit\` in Safari.
 */

::-webkit-file-upload-button {
  -webkit-appearance: button; /* 1 */
  font: inherit; /* 2 */
}

/* Interactive
   ========================================================================== */

/*
 * Add the correct display in Edge, IE 10+, and Firefox.
 */

details {
  display: block;
}

/*
 * Add the correct display in all browsers.
 */

summary {
  display: list-item;
}

/* Misc
   ========================================================================== */

/**
 * Add the correct display in IE 10+.
 */

template {
  display: none;
}

/**
 * Add the correct display in IE 10.
 */

[hidden] {
  display: none;
}
`, "",{"version":3,"sources":["webpack://./node_modules/normalize.css/normalize.css"],"names":[],"mappings":"AAAA,2EAA2E;;AAE3E;+EAC+E;;AAE/E;;;EAGE;;AAEF;EACE,iBAAiB,EAAE,MAAM;EACzB,8BAA8B,EAAE,MAAM;AACxC;;AAEA;+EAC+E;;AAE/E;;EAEE;;AAEF;EACE,SAAS;AACX;;AAEA;;EAEE;;AAEF;EACE,cAAc;AAChB;;AAEA;;;EAGE;;AAEF;EACE,cAAc;EACd,gBAAgB;AAClB;;AAEA;+EAC+E;;AAE/E;;;EAGE;;AAEF;EACE,uBAAuB,EAAE,MAAM;EAC/B,SAAS,EAAE,MAAM;EACjB,iBAAiB,EAAE,MAAM;AAC3B;;AAEA;;;EAGE;;AAEF;EACE,iCAAiC,EAAE,MAAM;EACzC,cAAc,EAAE,MAAM;AACxB;;AAEA;+EAC+E;;AAE/E;;EAEE;;AAEF;EACE,6BAA6B;AAC/B;;AAEA;;;EAGE;;AAEF;EACE,mBAAmB,EAAE,MAAM;EAC3B,0BAA0B,EAAE,MAAM;EAClC,iCAAiC,EAAE,MAAM;AAC3C;;AAEA;;EAEE;;AAEF;;EAEE,mBAAmB;AACrB;;AAEA;;;EAGE;;AAEF;;;EAGE,iCAAiC,EAAE,MAAM;EACzC,cAAc,EAAE,MAAM;AACxB;;AAEA;;EAEE;;AAEF;EACE,cAAc;AAChB;;AAEA;;;EAGE;;AAEF;;EAEE,cAAc;EACd,cAAc;EACd,kBAAkB;EAClB,wBAAwB;AAC1B;;AAEA;EACE,eAAe;AACjB;;AAEA;EACE,WAAW;AACb;;AAEA;+EAC+E;;AAE/E;;EAEE;;AAEF;EACE,kBAAkB;AACpB;;AAEA;+EAC+E;;AAE/E;;;EAGE;;AAEF;;;;;EAKE,oBAAoB,EAAE,MAAM;EAC5B,eAAe,EAAE,MAAM;EACvB,iBAAiB,EAAE,MAAM;EACzB,SAAS,EAAE,MAAM;AACnB;;AAEA;;;EAGE;;AAEF;QACQ,MAAM;EACZ,iBAAiB;AACnB;;AAEA;;;EAGE;;AAEF;SACS,MAAM;EACb,oBAAoB;AACtB;;AAEA;;EAEE;;AAEF;;;;EAIE,0BAA0B;AAC5B;;AAEA;;EAEE;;AAEF;;;;EAIE,kBAAkB;EAClB,UAAU;AACZ;;AAEA;;EAEE;;AAEF;;;;EAIE,8BAA8B;AAChC;;AAEA;;EAEE;;AAEF;EACE,8BAA8B;AAChC;;AAEA;;;;;EAKE;;AAEF;EACE,sBAAsB,EAAE,MAAM;EAC9B,cAAc,EAAE,MAAM;EACtB,cAAc,EAAE,MAAM;EACtB,eAAe,EAAE,MAAM;EACvB,UAAU,EAAE,MAAM;EAClB,mBAAmB,EAAE,MAAM;AAC7B;;AAEA;;EAEE;;AAEF;EACE,wBAAwB;AAC1B;;AAEA;;EAEE;;AAEF;EACE,cAAc;AAChB;;AAEA;;;EAGE;;AAEF;;EAEE,sBAAsB,EAAE,MAAM;EAC9B,UAAU,EAAE,MAAM;AACpB;;AAEA;;EAEE;;AAEF;;EAEE,YAAY;AACd;;AAEA;;;EAGE;;AAEF;EACE,6BAA6B,EAAE,MAAM;EACrC,oBAAoB,EAAE,MAAM;AAC9B;;AAEA;;EAEE;;AAEF;EACE,wBAAwB;AAC1B;;AAEA;;;EAGE;;AAEF;EACE,0BAA0B,EAAE,MAAM;EAClC,aAAa,EAAE,MAAM;AACvB;;AAEA;+EAC+E;;AAE/E;;EAEE;;AAEF;EACE,cAAc;AAChB;;AAEA;;EAEE;;AAEF;EACE,kBAAkB;AACpB;;AAEA;+EAC+E;;AAE/E;;EAEE;;AAEF;EACE,aAAa;AACf;;AAEA;;EAEE;;AAEF;EACE,aAAa;AACf","sourcesContent":["/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */\n\n/* Document\n   ========================================================================== */\n\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in iOS.\n */\n\nhtml {\n  line-height: 1.15; /* 1 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n}\n\n/* Sections\n   ========================================================================== */\n\n/**\n * Remove the margin in all browsers.\n */\n\nbody {\n  margin: 0;\n}\n\n/**\n * Render the `main` element consistently in IE.\n */\n\nmain {\n  display: block;\n}\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\n\n/* Grouping content\n   ========================================================================== */\n\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n\nhr {\n  box-sizing: content-box; /* 1 */\n  height: 0; /* 1 */\n  overflow: visible; /* 2 */\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\npre {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/* Text-level semantics\n   ========================================================================== */\n\n/**\n * Remove the gray background on active links in IE 10.\n */\n\na {\n  background-color: transparent;\n}\n\n/**\n * 1. Remove the bottom border in Chrome 57-\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n\nabbr[title] {\n  border-bottom: none; /* 1 */\n  text-decoration: underline; /* 2 */\n  text-decoration: underline dotted; /* 2 */\n}\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\ncode,\nkbd,\nsamp {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/**\n * Add the correct font size in all browsers.\n */\n\nsmall {\n  font-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/* Embedded content\n   ========================================================================== */\n\n/**\n * Remove the border on images inside links in IE 10.\n */\n\nimg {\n  border-style: none;\n}\n\n/* Forms\n   ========================================================================== */\n\n/**\n * 1. Change the font styles in all browsers.\n * 2. Remove the margin in Firefox and Safari.\n */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit; /* 1 */\n  font-size: 100%; /* 1 */\n  line-height: 1.15; /* 1 */\n  margin: 0; /* 2 */\n}\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n\nbutton,\ninput { /* 1 */\n  overflow: visible;\n}\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n\nbutton,\nselect { /* 1 */\n  text-transform: none;\n}\n\n/**\n * Correct the inability to style clickable types in iOS and Safari.\n */\n\nbutton,\n[type=\"button\"],\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button;\n}\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0;\n}\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText;\n}\n\n/**\n * Correct the padding in Firefox.\n */\n\nfieldset {\n  padding: 0.35em 0.75em 0.625em;\n}\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n\nlegend {\n  box-sizing: border-box; /* 1 */\n  color: inherit; /* 2 */\n  display: table; /* 1 */\n  max-width: 100%; /* 1 */\n  padding: 0; /* 3 */\n  white-space: normal; /* 1 */\n}\n\n/**\n * Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n\nprogress {\n  vertical-align: baseline;\n}\n\n/**\n * Remove the default vertical scrollbar in IE 10+.\n */\n\ntextarea {\n  overflow: auto;\n}\n\n/**\n * 1. Add the correct box sizing in IE 10.\n * 2. Remove the padding in IE 10.\n */\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  box-sizing: border-box; /* 1 */\n  padding: 0; /* 2 */\n}\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n\n[type=\"search\"] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/**\n * Remove the inner padding in Chrome and Safari on macOS.\n */\n\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/* Interactive\n   ========================================================================== */\n\n/*\n * Add the correct display in Edge, IE 10+, and Firefox.\n */\n\ndetails {\n  display: block;\n}\n\n/*\n * Add the correct display in all browsers.\n */\n\nsummary {\n  display: list-item;\n}\n\n/* Misc\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 10+.\n */\n\ntemplate {\n  display: none;\n}\n\n/**\n * Add the correct display in IE 10.\n */\n\n[hidden] {\n  display: none;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/style.css":
/*!*************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/style.css ***!
  \*************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! ./fonts/drius/driushalf-webfont.woff2 */ "./src/fonts/drius/driushalf-webfont.woff2"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_1___ = new URL(/* asset import */ __webpack_require__(/*! ./fonts/drius/driushalf-webfont.woff */ "./src/fonts/drius/driushalf-webfont.woff"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_2___ = new URL(/* asset import */ __webpack_require__(/*! ./fonts/drius/driusstraight-webfont.woff2 */ "./src/fonts/drius/driusstraight-webfont.woff2"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_3___ = new URL(/* asset import */ __webpack_require__(/*! ./fonts/drius/driusstraight-webfont.woff */ "./src/fonts/drius/driusstraight-webfont.woff"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_4___ = new URL(/* asset import */ __webpack_require__(/*! ./fonts/luxi-mono/luximr-webfont.woff2 */ "./src/fonts/luxi-mono/luximr-webfont.woff2"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_5___ = new URL(/* asset import */ __webpack_require__(/*! ./fonts/luxi-mono/luximr-webfont.woff */ "./src/fonts/luxi-mono/luximr-webfont.woff"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_1___);
var ___CSS_LOADER_URL_REPLACEMENT_2___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_2___);
var ___CSS_LOADER_URL_REPLACEMENT_3___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_3___);
var ___CSS_LOADER_URL_REPLACEMENT_4___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_4___);
var ___CSS_LOADER_URL_REPLACEMENT_5___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_5___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `@font-face {
  font-family: 'drius_halftoneregular';
  src: url(${___CSS_LOADER_URL_REPLACEMENT_0___}) format('woff2'),
    url(${___CSS_LOADER_URL_REPLACEMENT_1___}) format('woff');
  font-weight: normal;
  font-style: normal;

}

@font-face {
  font-family: 'drius_straightregular';
  src: url(${___CSS_LOADER_URL_REPLACEMENT_2___}) format('woff2'),
    url(${___CSS_LOADER_URL_REPLACEMENT_3___}) format('woff');
  font-weight: normal;
  font-style: normal;

}

@font-face {
  font-family: 'luxi_monoregular';
  src: url(${___CSS_LOADER_URL_REPLACEMENT_4___}) format('woff2'),
    url(${___CSS_LOADER_URL_REPLACEMENT_5___}) format('woff');
  font-weight: normal;
  font-style: normal;

}

:root {
  --dark-color-1: #000000;
  --dark-accent-color-1: #727272;
  --main-accent-color: #e71a1a;
  --secondary-accent-color: #ffffff;
  --medium-accent-color: #c5c5c5;
  --hover-accent-color-1: #4f0069;
  --hover-border-color-1: #e26ed2;
  --ship-color: #241e1e;
  --main-title-font-size: clamp(1.5rem, calc(1rem + calc(1.5vw + 1.5vh)), calc(5rem + calc(0.5vw + 0.5vw)));
  --secondary-header-font-size: clamp(1.25rem, calc(1vw + 1vh), calc(2rem + calc(1vw + 1vw)));
  --medium-font: clamp(1rem, calc(1.25rem + calc(0.5vw + 0.5vh)), calc(2rem + calc(1vw + 1vh)));
  --medium-small-font: clamp(0.75rem, calc(0.75rem + calc(0.25vw + 0.25vh)), calc(1.25rem + calc(0.5vw + 0.5vh)));
}

body {
  margin: 0;
}

#content {
  display: grid;
  background: linear-gradient(150deg, var(--dark-color-1) 50%, var(--main-accent-color) 50.15%);
  position: relative;
  min-height: 100dvh;
  justify-content: center;
  grid-template-rows: auto 1fr;
  grid-template-columns: 1fr;
  font-family: 'drius_straightregular', sans-serif;
  background-color: var(--dark-color-1);
  color: var(--main-accent-color);
}

.main-title {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--dark-color-1);
}

.main-title h1{
  margin: 0;
  margin-top: 0.25em;
  font-size: var(--main-title-font-size);
}

.game {
  display: flex;
  gap: calc(0.5rem + calc(1.5vw + 1.5vw));
  align-items: center;
  justify-content: center;
  padding: calc(var(--main-title-font-size) / 2);
}

/* lobby style */

.harbor {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  position: absolute;
  background: linear-gradient(150deg, var(--dark-color-1) 50%, var(--main-accent-color) 50.15%);
  width: 100%;
  height: 100dvh;
}

.lobby-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-lobby-container {
  display: flex;
  border-radius: 8px;
  box-shadow: 0 -6px 0 3px var(--secondary-accent-color);
  flex-direction: column;
  width: min-content;
  background-color: black;
}

.greeting {
  margin: 0;
  text-align: center;
  font-size: var(--secondary-header-font-size);
  color: var(--secondary-accent-color);
  padding: 1em;
}

.harbor .gameboard-container {
  color: var(--secondary-accent-color);
  padding: 2em 1.5em;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--main-accent-color);
}

.harbor .gameboard {
  width: min(85vw, calc(150px + calc(8vw + 8vh)));
  height: min(85vw, calc(150px + calc(8vw + 8vh)));
  background-color: var(--main-accent-color);
}

.gameboard>tr:first-child,
.gameboard th {
  background-color: var(--main-accent-color);
}

.gameboard tr {
  height: 100% / 11;
}

.gameboard td {
  position: relative;
  width: calc(100% / 11);
  font-size: var(--medium-small-font);
}

.draggable {
  position: absolute;
  left: 0;
  top: 0;
  margin: auto;
  background-color: var(--dark-color-1);
  width: 100%;
  height: 100%;
  z-index: 1;
}

.start-btn-container {
  display: flex;
  justify-content: center;
  background-color: var(--main-accent-color);
}

.start-btn {
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  background-color: var(--medium-accent-color);
  border: 3px solid var(--dark-color-1);
}

.start-btn:hover {
  color: var(--medium-accent-color);
  background-color: var(--dark-color-1);
  border: 3px solid var(--medium-accent-color);
}
/* main game board style */
.vs-text {
  font-size: clamp(2rem, 3vw, calc(3rem + 1vw));
  font-family: 'drius_halftoneregular', sans-serif;
  text-shadow: -3px 0 var(--medium-accent-color);
  box-shadow: -3px 0 var(--medium-accent-color);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: calc(0.75rem + calc(2vw + 2vh));
  height: calc(0.75rem + calc(2vw + 2vh));
  background-color: var(--dark-color-1);
  padding: 1em;
}

.gameboard {
  font-family: 'luxi-monoregular', sans-serif;
  border-collapse: collapse;
  width: min(85vw, calc(150px + calc(12.5vw + 5vh)));
  height: min(85vw, calc(150px + calc(12.5vw + 5vh)));
  background-color: var(--medium-accent-color);
}

.game > .gameboard {
  border: 3px solid var(--medium-accent-color);
  outline: 1px solid var(--main-accent-color);
  box-shadow: 6px 6px var(--dark-color-1);
}

div.gameboard {
  display: grid;
  grid-template-rows: repeat(10, 1fr);
  grid-template-columns: repeat(10, 1fr);
}

.gameboard .square {
  border: 1px solid var(--dark-accent-color-1);
  background-color: var(--medium-accent-color);
}

.gameboard[data-player-type="ai"] > .square:not([data-status="targeted"]):hover {
  border-color: var(--hover-border-color-1);
  background-color: var(--hover-accent-color-1);
}

.gameboard > .ship {
  border-color: var(--main-accent-color);
  background-color: var(--ship-color);
}

.gameboard[data-name = "player2"]>.ship {
  border-color: var(--dark-accent-color-1);
  background-color: var(--medium-accent-color);
}

.gameboard > .square[data-status="targeted"] {
  background-color: var(--dark-accent-color-1);
}

.gameboard> .ship[data-status="targeted"] {
  background-color: var(--ship-color);
}

/* winner announcement dom */

.winner-container {
  display: flex;
  flex-direction: column;
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
  color: var(--dark-color-1);
  font-size: clamp(1.25rem, calc(1.25rem + calc(0.25vw + 0.25vh)), calc(1.5rem + calc(0.5vw + 0.5vh)));
  border: 3px solid var(--medium-accent-color);
  background-color: var(--dark-color-1);
  background-color: var(--main-accent-color);
  width: min(85vw, calc(200px + calc(10vw + 10vh)));
  height: min(30vh, calc(200px + calc(5vw + 5vh)));
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  box-shadow: 0 10px 0 3px var(--dark-color-1);
}

button.restart {
  margin-top: 5%;
  font-size: var(--medium-small-font);
  background-color: var(--dark-color-1);
  border: none;
  padding: 0.25em 0.75em;
  color: var(--medium-accent-color);
}

button.restart:hover {
  color: var(--dark-color-1);
  background-color: var(--medium-accent-color);
  box-shadow: 0 3px 0 2px var(--dark-color-1);
}
@media only screen and (max-width: 1024px) {
  .game {
    flex-direction: column;
  }
}`, "",{"version":3,"sources":["webpack://./src/style.css"],"names":[],"mappings":"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","sourcesContent":["@font-face {\r\n  font-family: 'drius_halftoneregular';\r\n  src: url('./fonts/drius/driushalf-webfont.woff2') format('woff2'),\r\n    url('./fonts/drius/driushalf-webfont.woff') format('woff');\r\n  font-weight: normal;\r\n  font-style: normal;\r\n\r\n}\r\n\r\n@font-face {\r\n  font-family: 'drius_straightregular';\r\n  src: url('./fonts/drius/driusstraight-webfont.woff2') format('woff2'),\r\n    url('./fonts/drius/driusstraight-webfont.woff') format('woff');\r\n  font-weight: normal;\r\n  font-style: normal;\r\n\r\n}\r\n\r\n@font-face {\r\n  font-family: 'luxi_monoregular';\r\n  src: url('./fonts/luxi-mono/luximr-webfont.woff2') format('woff2'),\r\n    url('./fonts/luxi-mono/luximr-webfont.woff') format('woff');\r\n  font-weight: normal;\r\n  font-style: normal;\r\n\r\n}\r\n\r\n:root {\r\n  --dark-color-1: #000000;\r\n  --dark-accent-color-1: #727272;\r\n  --main-accent-color: #e71a1a;\r\n  --secondary-accent-color: #ffffff;\r\n  --medium-accent-color: #c5c5c5;\r\n  --hover-accent-color-1: #4f0069;\r\n  --hover-border-color-1: #e26ed2;\r\n  --ship-color: #241e1e;\r\n  --main-title-font-size: clamp(1.5rem, calc(1rem + calc(1.5vw + 1.5vh)), calc(5rem + calc(0.5vw + 0.5vw)));\r\n  --secondary-header-font-size: clamp(1.25rem, calc(1vw + 1vh), calc(2rem + calc(1vw + 1vw)));\r\n  --medium-font: clamp(1rem, calc(1.25rem + calc(0.5vw + 0.5vh)), calc(2rem + calc(1vw + 1vh)));\r\n  --medium-small-font: clamp(0.75rem, calc(0.75rem + calc(0.25vw + 0.25vh)), calc(1.25rem + calc(0.5vw + 0.5vh)));\r\n}\r\n\r\nbody {\r\n  margin: 0;\r\n}\r\n\r\n#content {\r\n  display: grid;\r\n  background: linear-gradient(150deg, var(--dark-color-1) 50%, var(--main-accent-color) 50.15%);\r\n  position: relative;\r\n  min-height: 100dvh;\r\n  justify-content: center;\r\n  grid-template-rows: auto 1fr;\r\n  grid-template-columns: 1fr;\r\n  font-family: 'drius_straightregular', sans-serif;\r\n  background-color: var(--dark-color-1);\r\n  color: var(--main-accent-color);\r\n}\r\n\r\n.main-title {\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n  background-color: var(--dark-color-1);\r\n}\r\n\r\n.main-title h1{\r\n  margin: 0;\r\n  margin-top: 0.25em;\r\n  font-size: var(--main-title-font-size);\r\n}\r\n\r\n.game {\r\n  display: flex;\r\n  gap: calc(0.5rem + calc(1.5vw + 1.5vw));\r\n  align-items: center;\r\n  justify-content: center;\r\n  padding: calc(var(--main-title-font-size) / 2);\r\n}\r\n\r\n/* lobby style */\r\n\r\n.harbor {\r\n  display: grid;\r\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\r\n  position: absolute;\r\n  background: linear-gradient(150deg, var(--dark-color-1) 50%, var(--main-accent-color) 50.15%);\r\n  width: 100%;\r\n  height: 100dvh;\r\n}\r\n\r\n.lobby-container {\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n}\r\n\r\n.main-lobby-container {\r\n  display: flex;\r\n  border-radius: 8px;\r\n  box-shadow: 0 -6px 0 3px var(--secondary-accent-color);\r\n  flex-direction: column;\r\n  width: min-content;\r\n  background-color: black;\r\n}\r\n\r\n.greeting {\r\n  margin: 0;\r\n  text-align: center;\r\n  font-size: var(--secondary-header-font-size);\r\n  color: var(--secondary-accent-color);\r\n  padding: 1em;\r\n}\r\n\r\n.harbor .gameboard-container {\r\n  color: var(--secondary-accent-color);\r\n  padding: 2em 1.5em;\r\n  display: flex;\r\n  justify-content: center;\r\n  align-items: center;\r\n  background-color: var(--main-accent-color);\r\n}\r\n\r\n.harbor .gameboard {\r\n  width: min(85vw, calc(150px + calc(8vw + 8vh)));\r\n  height: min(85vw, calc(150px + calc(8vw + 8vh)));\r\n  background-color: var(--main-accent-color);\r\n}\r\n\r\n.gameboard>tr:first-child,\r\n.gameboard th {\r\n  background-color: var(--main-accent-color);\r\n}\r\n\r\n.gameboard tr {\r\n  height: 100% / 11;\r\n}\r\n\r\n.gameboard td {\r\n  position: relative;\r\n  width: calc(100% / 11);\r\n  font-size: var(--medium-small-font);\r\n}\r\n\r\n.draggable {\r\n  position: absolute;\r\n  left: 0;\r\n  top: 0;\r\n  margin: auto;\r\n  background-color: var(--dark-color-1);\r\n  width: 100%;\r\n  height: 100%;\r\n  z-index: 1;\r\n}\r\n\r\n.start-btn-container {\r\n  display: flex;\r\n  justify-content: center;\r\n  background-color: var(--main-accent-color);\r\n}\r\n\r\n.start-btn {\r\n  border-bottom-left-radius: 8px;\r\n  border-bottom-right-radius: 8px;\r\n  background-color: var(--medium-accent-color);\r\n  border: 3px solid var(--dark-color-1);\r\n}\r\n\r\n.start-btn:hover {\r\n  color: var(--medium-accent-color);\r\n  background-color: var(--dark-color-1);\r\n  border: 3px solid var(--medium-accent-color);\r\n}\r\n/* main game board style */\r\n.vs-text {\r\n  font-size: clamp(2rem, 3vw, calc(3rem + 1vw));\r\n  font-family: 'drius_halftoneregular', sans-serif;\r\n  text-shadow: -3px 0 var(--medium-accent-color);\r\n  box-shadow: -3px 0 var(--medium-accent-color);\r\n  display: flex;\r\n  justify-content: center;\r\n  align-items: center;\r\n  border-radius: 50%;\r\n  width: calc(0.75rem + calc(2vw + 2vh));\r\n  height: calc(0.75rem + calc(2vw + 2vh));\r\n  background-color: var(--dark-color-1);\r\n  padding: 1em;\r\n}\r\n\r\n.gameboard {\r\n  font-family: 'luxi-monoregular', sans-serif;\r\n  border-collapse: collapse;\r\n  width: min(85vw, calc(150px + calc(12.5vw + 5vh)));\r\n  height: min(85vw, calc(150px + calc(12.5vw + 5vh)));\r\n  background-color: var(--medium-accent-color);\r\n}\r\n\r\n.game > .gameboard {\r\n  border: 3px solid var(--medium-accent-color);\r\n  outline: 1px solid var(--main-accent-color);\r\n  box-shadow: 6px 6px var(--dark-color-1);\r\n}\r\n\r\ndiv.gameboard {\r\n  display: grid;\r\n  grid-template-rows: repeat(10, 1fr);\r\n  grid-template-columns: repeat(10, 1fr);\r\n}\r\n\r\n.gameboard .square {\r\n  border: 1px solid var(--dark-accent-color-1);\r\n  background-color: var(--medium-accent-color);\r\n}\r\n\r\n.gameboard[data-player-type=\"ai\"] > .square:not([data-status=\"targeted\"]):hover {\r\n  border-color: var(--hover-border-color-1);\r\n  background-color: var(--hover-accent-color-1);\r\n}\r\n\r\n.gameboard > .ship {\r\n  border-color: var(--main-accent-color);\r\n  background-color: var(--ship-color);\r\n}\r\n\r\n.gameboard[data-name = \"player2\"]>.ship {\r\n  border-color: var(--dark-accent-color-1);\r\n  background-color: var(--medium-accent-color);\r\n}\r\n\r\n.gameboard > .square[data-status=\"targeted\"] {\r\n  background-color: var(--dark-accent-color-1);\r\n}\r\n\r\n.gameboard> .ship[data-status=\"targeted\"] {\r\n  background-color: var(--ship-color);\r\n}\r\n\r\n/* winner announcement dom */\r\n\r\n.winner-container {\r\n  display: flex;\r\n  flex-direction: column;\r\n  position: absolute;\r\n  margin: auto;\r\n  left: 0;\r\n  right: 0;\r\n  top: 0;\r\n  bottom: 0;\r\n  justify-content: center;\r\n  align-items: center;\r\n  color: var(--dark-color-1);\r\n  font-size: clamp(1.25rem, calc(1.25rem + calc(0.25vw + 0.25vh)), calc(1.5rem + calc(0.5vw + 0.5vh)));\r\n  border: 3px solid var(--medium-accent-color);\r\n  background-color: var(--dark-color-1);\r\n  background-color: var(--main-accent-color);\r\n  width: min(85vw, calc(200px + calc(10vw + 10vh)));\r\n  height: min(30vh, calc(200px + calc(5vw + 5vh)));\r\n  border-bottom-left-radius: 8px;\r\n  border-bottom-right-radius: 8px;\r\n  box-shadow: 0 10px 0 3px var(--dark-color-1);\r\n}\r\n\r\nbutton.restart {\r\n  margin-top: 5%;\r\n  font-size: var(--medium-small-font);\r\n  background-color: var(--dark-color-1);\r\n  border: none;\r\n  padding: 0.25em 0.75em;\r\n  color: var(--medium-accent-color);\r\n}\r\n\r\nbutton.restart:hover {\r\n  color: var(--dark-color-1);\r\n  background-color: var(--medium-accent-color);\r\n  box-shadow: 0 3px 0 2px var(--dark-color-1);\r\n}\r\n@media only screen and (max-width: 1024px) {\r\n  .game {\r\n    flex-direction: column;\r\n  }\r\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/getUrl.js":
/*!********************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/getUrl.js ***!
  \********************************************************/
/***/ ((module) => {



module.exports = function (url, options) {
  if (!options) {
    options = {};
  }
  if (!url) {
    return url;
  }
  url = String(url.__esModule ? url.default : url);

  // If url is already wrapped in quotes, remove them
  if (/^['"].*['"]$/.test(url)) {
    url = url.slice(1, -1);
  }
  if (options.hash) {
    url += options.hash;
  }

  // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls
  if (/["'() \t\n]|(%20)/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }
  return url;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./node_modules/normalize.css/normalize.css":
/*!**************************************************!*\
  !*** ./node_modules/normalize.css/normalize.css ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _css_loader_dist_cjs_js_normalize_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../css-loader/dist/cjs.js!./normalize.css */ "./node_modules/css-loader/dist/cjs.js!./node_modules/normalize.css/normalize.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_css_loader_dist_cjs_js_normalize_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_css_loader_dist_cjs_js_normalize_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _css_loader_dist_cjs_js_normalize_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _css_loader_dist_cjs_js_normalize_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/style.css":
/*!***********************!*\
  !*** ./src/style.css ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./style.css */ "./node_modules/css-loader/dist/cjs.js!./src/style.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ "./src/fonts/drius/driushalf-webfont.woff":
/*!************************************************!*\
  !*** ./src/fonts/drius/driushalf-webfont.woff ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "9cb5ec066ba91e79d3dc.woff";

/***/ }),

/***/ "./src/fonts/drius/driushalf-webfont.woff2":
/*!*************************************************!*\
  !*** ./src/fonts/drius/driushalf-webfont.woff2 ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "cccb29aa723d7ecad7f4.woff2";

/***/ }),

/***/ "./src/fonts/drius/driusstraight-webfont.woff":
/*!****************************************************!*\
  !*** ./src/fonts/drius/driusstraight-webfont.woff ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "f0ebea0ef2fc3a7f5ddd.woff";

/***/ }),

/***/ "./src/fonts/drius/driusstraight-webfont.woff2":
/*!*****************************************************!*\
  !*** ./src/fonts/drius/driusstraight-webfont.woff2 ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "8a95d31b2fcadb68fd77.woff2";

/***/ }),

/***/ "./src/fonts/luxi-mono/luximr-webfont.woff":
/*!*************************************************!*\
  !*** ./src/fonts/luxi-mono/luximr-webfont.woff ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "a2f6a71ea6861b5b1a40.woff";

/***/ }),

/***/ "./src/fonts/luxi-mono/luximr-webfont.woff2":
/*!**************************************************!*\
  !*** ./src/fonts/luxi-mono/luximr-webfont.woff2 ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "aac93787c4e29a7a2f2f.woff2";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && !scriptUrl) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"index": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var normalize_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! normalize.css */ "./node_modules/normalize.css/normalize.css");
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.css */ "./src/style.css");
/* harmony import */ var _dom_ui_lobby_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dom-ui/lobby-ui */ "./src/dom-ui/lobby-ui.js");



function component() {
  const content = document.getElementById("content");
  content.appendChild((0,_dom_ui_lobby_ui__WEBPACK_IMPORTED_MODULE_2__["default"])());
}
component();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsT0FBTyxnRkFBZ0YsWUFBWSxNQUFNLE9BQU8sYUFBYSxjQUFjLE9BQU8sS0FBSyxZQUFZLE1BQU0sT0FBTyxhQUFhLGNBQWMsT0FBTyxLQUFLLFlBQVksTUFBTSxPQUFPLGFBQWEsY0FBYyxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsT0FBTyxLQUFLLFVBQVUsTUFBTSxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLGFBQWEsT0FBTyxhQUFhLE1BQU0sVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLGFBQWEsYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLE1BQU0sS0FBSyxZQUFZLGFBQWEsV0FBVyxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsT0FBTyxNQUFNLFlBQVksT0FBTyxLQUFLLFlBQVks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V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDbEJBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7Ozs7V0NyQkE7Ozs7Ozs7Ozs7Ozs7O0FDQXVCO0FBQ0Y7QUFDMEI7QUFFL0MsU0FBU3FPLFNBQVNBLENBQUEsRUFBRztFQUNuQixNQUFNbkosT0FBTyxHQUFHMUYsUUFBUSxDQUFDcUYsY0FBYyxDQUFDLFNBQVMsQ0FBQztFQUNsREssT0FBTyxDQUFDN0QsV0FBVyxDQUFDMkcsNERBQWMsQ0FBQyxDQUFDLENBQUM7QUFDdkM7QUFFQXFHLFNBQVMsQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2FpLXNtYXJ0LXR1cm4uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9kb20tdWkvY29sb3ItY2hhbmdpbmcuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9kb20tdWkvZG9tLW1ldGhvZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2RvbS11aS9kb20tdWkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9kb20tdWkvZHJhZy1hbmQtZHJvcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2RvbS11aS9nYW1lLWRvbS11aS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2RvbS11aS9sb2JieS11aS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2RvbS11aS9wbGFjZW1lbnQtZG9tLWxvZ2ljLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZG9tLXVpL3Jlc3RhcnQtZ2FtZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2RvbS11aS9zaGlwLW9yaWVudGF0aW9uLWNvbnRyb2wuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9kb20tdWkvc2hpcC1wbGFjZW1lbnQtdWkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9wbGFjZW1lbnQtbG9naWMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvbm9ybWFsaXplLmNzcy9ub3JtYWxpemUuY3NzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc3R5bGUuY3NzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvZ2V0VXJsLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL25vcm1hbGl6ZS5jc3Mvbm9ybWFsaXplLmNzcz8zNDJmIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc3R5bGUuY3NzPzcxNjMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL25vbmNlIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0QXR0cmlidXRlQXJyIH0gZnJvbSBcIi4vZG9tLXVpL2RyYWctYW5kLWRyb3BcIjtcclxuaW1wb3J0IHtcclxuICBmaWx0ZXJBbmRTb3J0QXJyLFxyXG4gIHJlbW92ZUR1cGxpY2F0ZUFycixcclxufSBmcm9tIFwiLi9kb20tdWkvcGxhY2VtZW50LWRvbS1sb2dpY1wiO1xyXG5pbXBvcnQgeyByYW5kb21JbmRleCwgZ2V0QWRqZWNlbnRMaXN0IH0gZnJvbSBcIi4vcGxhY2VtZW50LWxvZ2ljXCI7XHJcblxyXG5jb25zdCBnZXRBSUFkamVjZW50TGlzdCA9IChjb29yZGluYXRlcykgPT4ge1xyXG4gIGNvbnN0IGFkamVjZW50TGlzdCA9IFtcclxuICAgIFtjb29yZGluYXRlc1swXSAtIDEsIGNvb3JkaW5hdGVzWzFdXSxcclxuICAgIFtjb29yZGluYXRlc1swXSArIDEsIGNvb3JkaW5hdGVzWzFdXSxcclxuICAgIFtjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0gLSAxXSxcclxuICAgIFtjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0gKyAxXSxcclxuICBdO1xyXG5cclxuICByZXR1cm4gYWRqZWNlbnRMaXN0LmZpbHRlcihcclxuICAgIChpdGVtKSA9PiBpdGVtWzBdID49IDAgJiYgaXRlbVswXSA8PSA5ICYmIGl0ZW1bMV0gPj0gMCAmJiBpdGVtWzFdIDw9IDksXHJcbiAgKTtcclxufTtcclxuXHJcbmNvbnN0IHRhZ0RvbU9yaWVudGF0aW9uID0gKGRvbTEsIGRvbTIpID0+IHtcclxuICBjb25zdCB0YXJnZXQxID0gZG9tMTtcclxuICBjb25zdCB0YXJnZXQyID0gZG9tMjtcclxuICBjb25zdCBkb20xQ29vcmRpbmF0ZXMgPSBnZXRBdHRyaWJ1dGVBcnIoZG9tMSwgXCJkYXRhLWNvb3JkaW5hdGVzXCIpO1xyXG4gIGNvbnN0IGRvbTJDb29yZGluYXRlcyA9IGdldEF0dHJpYnV0ZUFycihkb20yLCBcImRhdGEtY29vcmRpbmF0ZXNcIik7XHJcbiAgaWYgKGRvbTFDb29yZGluYXRlc1swXSA9PT0gZG9tMkNvb3JkaW5hdGVzWzBdKSB7XHJcbiAgICB0YXJnZXQxLmNsYXNzTGlzdC5hZGQoXCJyb3dcIik7XHJcbiAgICB0YXJnZXQyLmNsYXNzTGlzdC5hZGQoXCJyb3dcIik7XHJcbiAgfSBlbHNlIHtcclxuICAgIHRhcmdldDEuY2xhc3NMaXN0LmFkZChcImNvbHVtblwiKTtcclxuICAgIHRhcmdldDIuY2xhc3NMaXN0LmFkZChcImNvbHVtblwiKTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBnZXRBSVJvd0FkamVjZW50TGlzdCA9IChjb29yZGluYXRlcykgPT4ge1xyXG4gIGNvbnN0IHJvd0FkamVjZW50TGlzdCA9IFtcclxuICAgIFtjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0gLSAxXSxcclxuICAgIFtjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0gKyAxXSxcclxuICBdO1xyXG5cclxuICByZXR1cm4gcm93QWRqZWNlbnRMaXN0LmZpbHRlcihcclxuICAgIChpdGVtKSA9PiBpdGVtWzBdID49IDAgJiYgaXRlbVswXSA8PSA5ICYmIGl0ZW1bMV0gPj0gMCAmJiBpdGVtWzFdIDw9IDksXHJcbiAgKTtcclxufTtcclxuXHJcbmNvbnN0IGdldEFJQ29sdW1uQWRqZWNlbnRMaXN0ID0gKGNvb3JkaW5hdGVzKSA9PiB7XHJcbiAgY29uc3QgY29sdW1uQWRqZWNlbnRMaXN0ID0gW1xyXG4gICAgW2Nvb3JkaW5hdGVzWzBdIC0gMSwgY29vcmRpbmF0ZXNbMV1dLFxyXG4gICAgW2Nvb3JkaW5hdGVzWzBdICsgMSwgY29vcmRpbmF0ZXNbMV1dLFxyXG4gIF07XHJcblxyXG4gIHJldHVybiBjb2x1bW5BZGplY2VudExpc3QuZmlsdGVyKFxyXG4gICAgKGl0ZW0pID0+IGl0ZW1bMF0gPj0gMCAmJiBpdGVtWzBdIDw9IDkgJiYgaXRlbVsxXSA+PSAwICYmIGl0ZW1bMV0gPD0gOSxcclxuICApO1xyXG59O1xyXG5cclxuY29uc3QgZ2V0QUlPcmllbnRhdGlvbkFkamVjZW50TGlzdCA9IChjb29yZGluYXRlcywgb3JpZW50YXRpb24pID0+IHtcclxuICBpZiAob3JpZW50YXRpb24gPT09IFwicm93XCIpIHtcclxuICAgIHJldHVybiBnZXRBSVJvd0FkamVjZW50TGlzdChjb29yZGluYXRlcyk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZ2V0QUlDb2x1bW5BZGplY2VudExpc3QoY29vcmRpbmF0ZXMpO1xyXG59O1xyXG5cclxuY29uc3QgZ2V0RnJlZUFkamVjZW50TGlzdCA9IChhZGplY2VudExpc3QsIG9wcG9uZW50Qm9hcmQpID0+IHtcclxuICBjb25zdCBkb21MaXN0ID0gW107XHJcbiAgYWRqZWNlbnRMaXN0LmZvckVhY2goKGNvb3JkaW5hdGVzKSA9PiB7XHJcbiAgICBjb25zdCBkb20gPSBvcHBvbmVudEJvYXJkLnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgIGBbZGF0YS1jb29yZGluYXRlcz1cIiR7Y29vcmRpbmF0ZXN9XCJdYCxcclxuICAgICk7XHJcbiAgICBjb25zdCBkYXRhU3RhdHVzID0gZG9tLmdldEF0dHJpYnV0ZShcImRhdGEtc3RhdHVzXCIpO1xyXG4gICAgaWYgKGRhdGFTdGF0dXMgPT09IFwiZnJlZVwiKSB7XHJcbiAgICAgIGRvbUxpc3QucHVzaChnZXRBdHRyaWJ1dGVBcnIoZG9tLCBcImRhdGEtY29vcmRpbmF0ZXNcIikpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gZG9tTGlzdDtcclxufTtcclxuXHJcbmNvbnN0IGNoZWNrQWRqZWNlbnRMaXN0RG9tID0gKGFkamVjZW50TGlzdCwgb3Bwb25lbnRCb2FyZCkgPT5cclxuICBhZGplY2VudExpc3QuZXZlcnkoKGNvb3JkaW5hdGVzKSA9PiB7XHJcbiAgICBjb25zdCBkb20gPSBvcHBvbmVudEJvYXJkLnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgIGBbZGF0YS1jb29yZGluYXRlcz1cIiR7Y29vcmRpbmF0ZXN9XCJdYCxcclxuICAgICk7XHJcbiAgICByZXR1cm4gIShcclxuICAgICAgZG9tLmNsYXNzTGlzdC5jb250YWlucyhcInRhZ2dlZENoZWNrZWRcIikgfHxcclxuICAgICAgZG9tLmNsYXNzTGlzdC5jb250YWlucyhcInRhZ2dlZFVuY2hlY2tlZFwiKVxyXG4gICAgKTtcclxuICB9KTtcclxuXHJcbmNvbnN0IGNoZWNrRm9yVGFnZ2VkRG9tID0gKHRhcmdldERvbSwgYm9hcmQsIG9wcG9uZW50Qm9hcmQpID0+IHtcclxuICBjb25zdCBjb250YWluZXIgPSBbXTtcclxuICB0YXJnZXREb20uZm9yRWFjaCgoZG9tKSA9PiB7XHJcbiAgICBjb25zdCBjb29yZGluYXRlcyA9IGdldEF0dHJpYnV0ZUFycihkb20sIFwiZGF0YS1jb29yZGluYXRlc1wiKTtcclxuICAgIGNvbnN0IGFkamVjZW50TGlzdCA9IGdldEFkamVjZW50TGlzdChjb29yZGluYXRlcywgYm9hcmQpLm1hcChcclxuICAgICAgKGluZGV4KSA9PiBib2FyZFtpbmRleF0uY29vcmRpbmF0ZXMsXHJcbiAgICApO1xyXG4gICAgaWYgKGNoZWNrQWRqZWNlbnRMaXN0RG9tKGFkamVjZW50TGlzdCwgb3Bwb25lbnRCb2FyZCkpIHtcclxuICAgICAgY29udGFpbmVyLnB1c2goY29vcmRpbmF0ZXMpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gY29udGFpbmVyO1xyXG59O1xyXG5cclxuY29uc3QgZ2V0Q2FsY3VsYXRlZFNwYWNlTW92ZSA9IChib2FyZCwgb3Bwb25lbnRCb2FyZCkgPT4ge1xyXG4gIGNvbnN0IGZyZWVEb20gPSBvcHBvbmVudEJvYXJkLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXN0YXR1cz1cImZyZWVcIl0nKTtcclxuICBjb25zdCBjb250YWluZXIgPSBjaGVja0ZvclRhZ2dlZERvbShmcmVlRG9tLCBib2FyZCwgb3Bwb25lbnRCb2FyZCk7XHJcbiAgY29uc3QgZmlsdGVyZWRBbmRTb3J0ZWQgPSByZW1vdmVEdXBsaWNhdGVBcnIoZmlsdGVyQW5kU29ydEFycihjb250YWluZXIpKTtcclxuICByZXR1cm4gZmlsdGVyZWRBbmRTb3J0ZWRbcmFuZG9tSW5kZXgoZmlsdGVyZWRBbmRTb3J0ZWQubGVuZ3RoKV07XHJcbn07XHJcblxyXG5jb25zdCBnZXRGcmVlT3JpZW50YXRpb25BZGplY2VudExpc3QgPSAoZG9tLCBvcmllbnRhdGlvbiwgb3Bwb25lbnRCb2FyZCkgPT4ge1xyXG4gIGNvbnN0IGNvb3JkaW5hdGVzID0gZ2V0QXR0cmlidXRlQXJyKGRvbSwgXCJkYXRhLWNvb3JkaW5hdGVzXCIpO1xyXG4gIGNvbnN0IHJvd0FkamVjZW50TGlzdCA9IGdldEFJT3JpZW50YXRpb25BZGplY2VudExpc3QoXHJcbiAgICBjb29yZGluYXRlcyxcclxuICAgIG9yaWVudGF0aW9uLFxyXG4gICk7XHJcbiAgcmV0dXJuIGdldEZyZWVBZGplY2VudExpc3Qocm93QWRqZWNlbnRMaXN0LCBvcHBvbmVudEJvYXJkKTtcclxufTtcclxuXHJcbmNvbnN0IG1ha2VDYWxjdWxhdGVkU3BhY2VNb3ZlID0gKFxyXG4gIHRhZ2dlZERvbXMsXHJcbiAgY29vcmRpbmF0ZXMsXHJcbiAgb3Bwb25lbnQsXHJcbiAgb3Bwb25lbnRCb2FyZCxcclxuKSA9PiB7XHJcbiAgY29uc3QgZG9tID0gdGFnZ2VkRG9tc1swXTtcclxuICBjb25zdCB0YWdnZWREb21Db29yZGluYXRlcyA9IGdldEF0dHJpYnV0ZUFycihkb20sIFwiZGF0YS1jb29yZGluYXRlc1wiKTtcclxuICBjb25zdCBhZGplY2VudExpc3QgPSBnZXRBSUFkamVjZW50TGlzdCh0YWdnZWREb21Db29yZGluYXRlcyk7XHJcbiAgY29uc3QgYWRqZWNlbnREb20gPSBnZXRGcmVlQWRqZWNlbnRMaXN0KGFkamVjZW50TGlzdCwgb3Bwb25lbnRCb2FyZCk7XHJcbiAgY29uc3QgZnJlZUFkamVjZW50RG9tID0gY2hlY2tGb3JUYWdnZWREb20oXHJcbiAgICBhZGplY2VudERvbS5tYXAoKGNvb3JkKSA9PlxyXG4gICAgICBvcHBvbmVudEJvYXJkLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWNvb3JkaW5hdGVzPVwiJHtjb29yZH1cIl1gKSxcclxuICAgICksXHJcbiAgICBvcHBvbmVudC5ib2FyZC5ib2FyZCxcclxuICAgIG9wcG9uZW50Qm9hcmQsXHJcbiAgKTtcclxuICBpZiAoZnJlZUFkamVjZW50RG9tLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgZG9tLmNsYXNzTGlzdC5yZW1vdmUoXCJ0YWdnZWQtdW5jaGVja2VkXCIpO1xyXG4gICAgZG9tLmNsYXNzTGlzdC5hZGQoXCJ0YWdnZWQtY2hlY2tlZFwiKTtcclxuICAgIHJldHVybiBjb29yZGluYXRlcztcclxuICB9XHJcblxyXG4gIGNvbnNvbGUubG9nKHsgZnJlZUFkamVjZW50RG9tIH0pO1xyXG4gIGNvbnN0IGNhbGN1bGF0ZWRDb29yZGluYXRlcyA9XHJcbiAgICBmcmVlQWRqZWNlbnREb21bcmFuZG9tSW5kZXgoZnJlZUFkamVjZW50RG9tLmxlbmd0aCldO1xyXG4gIGNvbnN0IHNlbGVjdGVkRG9tID0gb3Bwb25lbnRCb2FyZC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgYFtkYXRhLWNvb3JkaW5hdGVzPVwiJHtjYWxjdWxhdGVkQ29vcmRpbmF0ZXN9XCJgLFxyXG4gICk7XHJcblxyXG4gIGlmIChzZWxlY3RlZERvbS5jbGFzc0xpc3QuY29udGFpbnMoXCJzaGlwXCIpKSB7XHJcbiAgICB0YWdEb21PcmllbnRhdGlvbihkb20sIHNlbGVjdGVkRG9tKTtcclxuICAgIGRvbS5jbGFzc0xpc3QucmVtb3ZlKFwidGFnZ2VkLXVuY2hlY2tlZFwiKTtcclxuICAgIGRvbS5jbGFzc0xpc3QuYWRkKFwidGFnZ2VkLWNoZWNrZWRcIik7XHJcbiAgfVxyXG4gIHJldHVybiBjYWxjdWxhdGVkQ29vcmRpbmF0ZXM7XHJcbn07XHJcblxyXG5jb25zdCBtYWtlQ2FsY3VsYXRlZE9yaWVudGF0aW9uTW92ZSA9IChcclxuICB0YWdnZWREb20sXHJcbiAgb3JpZW50YXRpb24sXHJcbiAgb3Bwb25lbnRCb2FyZCxcclxuKSA9PiB7XHJcbiAgaWYgKHRhZ2dlZERvbS5sZW5ndGggPT09IDApIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuICBjb25zdCBzbGljZWRUYWdnZWREb20gPSBBcnJheS5mcm9tKHRhZ2dlZERvbSkuc2xpY2UoMSk7XHJcblxyXG4gIGNvbnN0IGZyZWVPcmllbnRhdGlvbkFkamVjZW50TGlzdCA9IGdldEZyZWVPcmllbnRhdGlvbkFkamVjZW50TGlzdChcclxuICAgIHRhZ2dlZERvbVswXSxcclxuICAgIG9yaWVudGF0aW9uLFxyXG4gICAgb3Bwb25lbnRCb2FyZCxcclxuICApO1xyXG5cclxuICBpZiAoZnJlZU9yaWVudGF0aW9uQWRqZWNlbnRMaXN0Lmxlbmd0aCA8IDEpIHtcclxuICAgIHRhZ2dlZERvbVswXS5jbGFzc0xpc3QucmVtb3ZlKFwidGFnZ2VkLXVuY2hlY2tlZFwiKTtcclxuICAgIHRhZ2dlZERvbVswXS5jbGFzc0xpc3QuYWRkKFwidGFnZ2VkLWNoZWNrZWRcIik7XHJcbiAgICByZXR1cm4gbWFrZUNhbGN1bGF0ZWRPcmllbnRhdGlvbk1vdmUoXHJcbiAgICAgIHNsaWNlZFRhZ2dlZERvbSxcclxuICAgICAgb3JpZW50YXRpb24sXHJcbiAgICAgIG9wcG9uZW50Qm9hcmQsXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgaWYgKGZyZWVPcmllbnRhdGlvbkFkamVjZW50TGlzdC5sZW5ndGggPD0gMSkge1xyXG4gICAgdGFnZ2VkRG9tWzBdLmNsYXNzTGlzdC5hZGQoYCR7b3JpZW50YXRpb259LWNoZWNrZWRgKTtcclxuICAgIHRhZ2dlZERvbVswXS5jbGFzc0xpc3QucmVtb3ZlKGAke29yaWVudGF0aW9ufWApO1xyXG4gIH1cclxuXHJcbiAgY29uc3Qgb3JpZW50YXRpb25Db29yZGluYXRlcyA9XHJcbiAgICBmcmVlT3JpZW50YXRpb25BZGplY2VudExpc3RbXHJcbiAgICAgIHJhbmRvbUluZGV4KGZyZWVPcmllbnRhdGlvbkFkamVjZW50TGlzdC5sZW5ndGgpXHJcbiAgICBdO1xyXG5cclxuICBpZiAoZnJlZU9yaWVudGF0aW9uQWRqZWNlbnRMaXN0Lmxlbmd0aCA+IDAgJiYgdGFnZ2VkRG9tWzBdICE9PSBudWxsKSB7XHJcbiAgICB0YWdnZWREb21bMF0uY2xhc3NMaXN0LnJlbW92ZShcInRhZ2dlZC11bmNoZWNrZWRcIik7XHJcbiAgICB0YWdnZWREb21bMF0uY2xhc3NMaXN0LmFkZChcInRhZ2dlZC1jaGVja2VkXCIpO1xyXG4gICAgY29uc3Qgc2VsZWN0ZWREb20gPSBvcHBvbmVudEJvYXJkLnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgIGBbZGF0YS1jb29yZGluYXRlcz1cIiR7b3JpZW50YXRpb25Db29yZGluYXRlc31cIl1gLFxyXG4gICAgKTtcclxuXHJcbiAgICBpZiAoc2VsZWN0ZWREb20uY2xhc3NMaXN0LmNvbnRhaW5zKFwic2hpcFwiKSkge1xyXG4gICAgICB0YWdEb21PcmllbnRhdGlvbih0YWdnZWREb21bMF0sIHNlbGVjdGVkRG9tKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbnNvbGUubG9nKG9yaWVudGF0aW9uQ29vcmRpbmF0ZXMpO1xyXG4gIHJldHVybiBvcmllbnRhdGlvbkNvb3JkaW5hdGVzO1xyXG59O1xyXG5cclxuY29uc3QgYWlTbWFydE1vdmUgPSAoXHJcbiAgdGFnZ2VkUm93RG9tLFxyXG4gIHRhZ2dlZENvbHVtbkRvbSxcclxuICB0YWdnZWREb20sXHJcbiAgY29vcmRpbmF0ZXMsXHJcbiAgb3Bwb25lbnRCb2FyZCxcclxuICBvcHBvbmVudCxcclxuKSA9PiB7XHJcbiAgY29uc3Qgcm93Q29vcmRpbmF0ZXMgPSBtYWtlQ2FsY3VsYXRlZE9yaWVudGF0aW9uTW92ZShcclxuICAgIHRhZ2dlZFJvd0RvbSxcclxuICAgIFwicm93XCIsXHJcbiAgICBvcHBvbmVudEJvYXJkLFxyXG4gICk7XHJcbiAgY29uc3QgY29sdW1uQ29vcmRpbmF0ZXMgPSBtYWtlQ2FsY3VsYXRlZE9yaWVudGF0aW9uTW92ZShcclxuICAgIHRhZ2dlZENvbHVtbkRvbSxcclxuICAgIFwiY29sdW1uXCIsXHJcbiAgICBvcHBvbmVudEJvYXJkLFxyXG4gICk7XHJcblxyXG4gIGlmIChyb3dDb29yZGluYXRlcyAhPT0gbnVsbCkge1xyXG4gICAgcmV0dXJuIHJvd0Nvb3JkaW5hdGVzO1xyXG4gIH1cclxuXHJcbiAgaWYgKGNvbHVtbkNvb3JkaW5hdGVzICE9PSBudWxsKSB7XHJcbiAgICByZXR1cm4gY29sdW1uQ29vcmRpbmF0ZXM7XHJcbiAgfVxyXG5cclxuICBpZiAodGFnZ2VkRG9tLmxlbmd0aCA+IDApIHtcclxuICAgIHJldHVybiBtYWtlQ2FsY3VsYXRlZFNwYWNlTW92ZShcclxuICAgICAgdGFnZ2VkRG9tLFxyXG4gICAgICBjb29yZGluYXRlcyxcclxuICAgICAgb3Bwb25lbnQsXHJcbiAgICAgIG9wcG9uZW50Qm9hcmQsXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGNvb3JkaW5hdGVzO1xyXG59O1xyXG5cclxuY29uc3QgYWlNYWtlQU1vdmUgPSAoYm9hcmREb20sIHBsYXllciwgb3Bwb25lbnQpID0+IHtcclxuICBjb25zdCBvcHBvbmVudEJvYXJkID0gYm9hcmREb20ucXVlcnlTZWxlY3RvcihcclxuICAgIGBbZGF0YS1uYW1lPVwiJHtvcHBvbmVudC5wbGF5ZXIubmFtZX1cIl1gLFxyXG4gICk7XHJcbiAgY29uc3QgY29vcmRpbmF0ZXMgPSBnZXRDYWxjdWxhdGVkU3BhY2VNb3ZlKFxyXG4gICAgb3Bwb25lbnQuYm9hcmQuYm9hcmQsXHJcbiAgICBvcHBvbmVudEJvYXJkLFxyXG4gICk7XHJcblxyXG4gIGNvbnN0IHRhZ2dlZERvbXMgPSBvcHBvbmVudEJvYXJkLnF1ZXJ5U2VsZWN0b3JBbGwoXCIudGFnZ2VkLXVuY2hlY2tlZFwiKTtcclxuICBjb25zdCB0YWdnZWRSb3dEb20gPSBvcHBvbmVudEJvYXJkLnF1ZXJ5U2VsZWN0b3JBbGwoXCIucm93XCIpO1xyXG4gIGNvbnN0IHRhZ2dlZENvbHVtbkRvbSA9IG9wcG9uZW50Qm9hcmQucXVlcnlTZWxlY3RvckFsbChcIi5jb2x1bW5cIik7XHJcbiAgaWYgKHRhZ2dlZFJvd0RvbS5sZW5ndGggPiAwIHx8IHRhZ2dlZENvbHVtbkRvbSA+IDApIHtcclxuICAgIHJldHVybiBhaVNtYXJ0TW92ZShcclxuICAgICAgdGFnZ2VkUm93RG9tLFxyXG4gICAgICB0YWdnZWRDb2x1bW5Eb20sXHJcbiAgICAgIHRhZ2dlZERvbXMsXHJcbiAgICAgIGNvb3JkaW5hdGVzLFxyXG4gICAgICBvcHBvbmVudEJvYXJkLFxyXG4gICAgICBvcHBvbmVudCxcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBpZiAodGFnZ2VkRG9tcy5sZW5ndGggPiAwKSB7XHJcbiAgICByZXR1cm4gbWFrZUNhbGN1bGF0ZWRTcGFjZU1vdmUoXHJcbiAgICAgIHRhZ2dlZERvbXMsXHJcbiAgICAgIGNvb3JkaW5hdGVzLFxyXG4gICAgICBvcHBvbmVudCxcclxuICAgICAgb3Bwb25lbnRCb2FyZCxcclxuICAgICk7XHJcbiAgfVxyXG4gIHJldHVybiBjb29yZGluYXRlcztcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFpTWFrZUFNb3ZlO1xyXG4iLCJpbXBvcnQgeyByYW5kb21JbmRleCB9IGZyb20gXCIuLi9wbGFjZW1lbnQtbG9naWNcIjtcclxuXHJcbmNvbnN0IHNldFJhbmRvbUNvbG9yID0gKGNvbG9ycywgZG9tLCBzdHlsZSkgPT4ge1xyXG4gIGNvbnN0IGNvbG9yID0gY29sb3JzW3JhbmRvbUluZGV4KGNvbG9ycy5sZW5ndGgpXTtcclxuICBjb25zdCB0YXJnZXQgPSBkb207XHJcbiAgdGFyZ2V0LnN0eWxlW3N0eWxlXSA9IGAke2NvbG9yfWA7XHJcbn07XHJcblxyXG5jb25zdCBzZXRNdWx0aXBsZUJvcmRlckNvbG9yID0gKGNvbG9ycywgZG9tKSA9PiB7XHJcbiAgc2V0UmFuZG9tQ29sb3IoY29sb3JzLCBkb20sIFwiYm9yZGVyLXJpZ2h0LWNvbG9yXCIpO1xyXG4gIHNldFJhbmRvbUNvbG9yKGNvbG9ycywgZG9tLCBcImJvcmRlci10b3AtY29sb3JcIik7XHJcbiAgc2V0UmFuZG9tQ29sb3IoY29sb3JzLCBkb20sIFwiYm9yZGVyLWJvdHRvbS1jb2xvclwiKTtcclxuICBzZXRSYW5kb21Db2xvcihjb2xvcnMsIGRvbSwgXCJib3JkZXItbGVmdC1jb2xvclwiKTtcclxufTtcclxuXHJcbmV4cG9ydCB7IHNldFJhbmRvbUNvbG9yLCBzZXRNdWx0aXBsZUJvcmRlckNvbG9yIH07XHJcbiIsImNvbnN0IGNyZWF0ZUVsV2l0aENsYXNzQW5kVGV4dCA9ICh0eXBlID0gXCJkaXZcIiwgY2xhc3NOYW1lID0gXCJcIiwgdGV4dCA9IFwiXCIpID0+IHtcclxuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodHlwZSk7XHJcbiAgaWYgKGNsYXNzTmFtZSkge1xyXG4gICAgZWwuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xyXG4gIH1cclxuXHJcbiAgZWwudGV4dENvbnRlbnQgPSB0ZXh0O1xyXG5cclxuICByZXR1cm4gZWw7XHJcbn07XHJcblxyXG5jb25zdCBhZGRBdHRyaWJ1dGVzVG9FbCA9IChkb20sIGF0ck5hbWVBcnIsIGF0cktleUFycikgPT4ge1xyXG4gIGF0ck5hbWVBcnIuZm9yRWFjaCgoYXRyTmFtZSwgaW5kZXgpID0+IHtcclxuICAgIGRvbS5zZXRBdHRyaWJ1dGUoYXRyTmFtZSwgYXRyS2V5QXJyW2luZGV4XSk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5leHBvcnQgeyBjcmVhdGVFbFdpdGhDbGFzc0FuZFRleHQsIGFkZEF0dHJpYnV0ZXNUb0VsIH07XHJcbiIsImltcG9ydCBTaGlwIGZyb20gXCIuLi9zaGlwXCI7XHJcbmltcG9ydCBHYW1lYm9hcmQgZnJvbSBcIi4uL2dhbWVib2FyZFwiO1xyXG5pbXBvcnQgeyBQbGF5ZXIsIEFJUGxheWVyIH0gZnJvbSBcIi4uL3BsYXllclwiO1xyXG5pbXBvcnQge1xyXG4gIHJhbmRvbUluZGV4LFxyXG4gIHJhbmRvbU9yaWVudGF0aW9uLFxyXG4gIGdldEFkamVjZW50TGlzdCxcclxuICBpc1BsYWNlbWVudFZhbGlkLFxyXG59IGZyb20gXCIuLi9wbGFjZW1lbnQtbG9naWNcIjtcclxuaW1wb3J0IHsgYWRkQXR0cmlidXRlc1RvRWwsIGNyZWF0ZUVsV2l0aENsYXNzQW5kVGV4dCB9IGZyb20gXCIuL2RvbS1tZXRob2RcIjtcclxuXHJcbmNvbnN0IHNldFVwUGxheWVyQm9hcmQgPSAocGxheWVyTmFtZSkgPT4ge1xyXG4gIGNvbnN0IHBsYXllciA9IFBsYXllcihwbGF5ZXJOYW1lKTtcclxuICBjb25zdCBib2FyZCA9IEdhbWVib2FyZCgxMCk7XHJcbiAgY29uc3QgdHlwZSA9IFwicGxheWVyXCI7XHJcbiAgcmV0dXJuIHsgcGxheWVyLCBib2FyZCwgdHlwZSB9O1xyXG59O1xyXG5cclxuY29uc3QgcG9wdWxhdGVCb2FyZCA9IChib2FyZCkgPT4ge1xyXG4gIGNvbnN0IHNwZWMgPSB7XHJcbiAgICBzaGlwOiBbXHJcbiAgICAgIFNoaXAoNSksXHJcbiAgICAgIFNoaXAoNCksXHJcbiAgICAgIFNoaXAoMyksXHJcbiAgICAgIFNoaXAoMyksXHJcbiAgICAgIFNoaXAoMyksXHJcbiAgICAgIFNoaXAoMiksXHJcbiAgICAgIFNoaXAoMiksXHJcbiAgICAgIFNoaXAoMiksXHJcbiAgICAgIFNoaXAoMSksXHJcbiAgICAgIFNoaXAoMSksXHJcbiAgICBdLFxyXG4gIH07XHJcblxyXG4gIGxldCBzdWNjZXNzUGxhY2VtZW50ID0gMDtcclxuICB3aGlsZSAoc3VjY2Vzc1BsYWNlbWVudCA8IHNwZWMuc2hpcC5sZW5ndGgpIHtcclxuICAgIGNvbnN0IGluZGV4ID0gcmFuZG9tSW5kZXgoYm9hcmQuYm9hcmQubGVuZ3RoKTtcclxuICAgIGNvbnN0IHNoaXAgPSBzcGVjLnNoaXBbc3VjY2Vzc1BsYWNlbWVudF07XHJcbiAgICBjb25zdCBvcmllbnRhdGlvbiA9IHJhbmRvbU9yaWVudGF0aW9uKCk7XHJcbiAgICBjb25zdCBjb29yZGluYXRlc0luZGV4TGlzdCA9IGJvYXJkLmZpbmRBbGxDb29yZGluYXRlc0luZGV4KFxyXG4gICAgICBib2FyZC5ib2FyZFtpbmRleF0uY29vcmRpbmF0ZXMsXHJcbiAgICAgIHNoaXAsXHJcbiAgICAgIG9yaWVudGF0aW9uLFxyXG4gICAgKTtcclxuICAgIGNvbnN0IGFkamVjZW50TGlzdCA9IGdldEFkamVjZW50TGlzdChjb29yZGluYXRlc0luZGV4TGlzdCwgYm9hcmQuYm9hcmQpO1xyXG5cclxuICAgIGlmIChpc1BsYWNlbWVudFZhbGlkKGNvb3JkaW5hdGVzSW5kZXhMaXN0LCBhZGplY2VudExpc3QsIGJvYXJkLmJvYXJkKSkge1xyXG4gICAgICBib2FyZC5wbGFjZVNoaXAoYm9hcmQuYm9hcmRbaW5kZXhdLmNvb3JkaW5hdGVzLCBzaGlwLCBvcmllbnRhdGlvbik7XHJcbiAgICAgIHN1Y2Nlc3NQbGFjZW1lbnQgKz0gMTtcclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBzZXRVcEFJQm9hcmQgPSAoQUlOYW1lKSA9PiB7XHJcbiAgY29uc3QgcGxheWVyID0gQUlQbGF5ZXIoQUlOYW1lKTtcclxuICBjb25zdCBib2FyZCA9IEdhbWVib2FyZCgxMCk7XHJcbiAgcG9wdWxhdGVCb2FyZChib2FyZCk7XHJcbiAgY29uc3QgdHlwZSA9IFwiYWlcIjtcclxuICByZXR1cm4geyBwbGF5ZXIsIGJvYXJkLCB0eXBlIH07XHJcbn07XHJcblxyXG5jb25zdCBjcmVhdGVHYW1lYm9hcmREb20gPSAocGxheWVyKSA9PiB7XHJcbiAgY29uc3QgYm9hcmREb20gPSBjcmVhdGVFbFdpdGhDbGFzc0FuZFRleHQoXCJkaXZcIiwgXCJnYW1lYm9hcmRcIik7XHJcbiAgYWRkQXR0cmlidXRlc1RvRWwoXHJcbiAgICBib2FyZERvbSxcclxuICAgIFtcImRhdGEtbmFtZVwiLCBcImRhdGEtcGxheWVyLXR5cGVcIl0sXHJcbiAgICBbYCR7cGxheWVyLnBsYXllci5uYW1lfWAsIHBsYXllci50eXBlXSxcclxuICApO1xyXG5cclxuICBwbGF5ZXIuYm9hcmQuYm9hcmQuZm9yRWFjaCgoc3F1YXJlLCBpbmRleCkgPT4ge1xyXG4gICAgY29uc3Qgc3F1YXJlRG9tID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgIHNxdWFyZURvbS5zZXRBdHRyaWJ1dGUoXHJcbiAgICAgIFwiZGF0YS1jb29yZGluYXRlc1wiLFxyXG4gICAgICBgJHtwbGF5ZXIuYm9hcmQuYm9hcmRbaW5kZXhdLmNvb3JkaW5hdGVzfWAsXHJcbiAgICApO1xyXG4gICAgc3F1YXJlRG9tLnNldEF0dHJpYnV0ZShcclxuICAgICAgXCJkYXRhLXN0YXR1c1wiLFxyXG4gICAgICBgJHtwbGF5ZXIuYm9hcmQuYm9hcmRbaW5kZXhdLnN0YXR1c31gLFxyXG4gICAgKTtcclxuXHJcbiAgICBzcXVhcmVEb20uY2xhc3NMaXN0LmFkZChcInNxdWFyZVwiKTtcclxuICAgIGlmIChwbGF5ZXIuYm9hcmQuYm9hcmRbaW5kZXhdLnNoaXAgJiYgcGxheWVyLnR5cGUgPT09IFwicGxheWVyXCIpIHtcclxuICAgICAgc3F1YXJlRG9tLmNsYXNzTGlzdC5hZGQoXCJzaGlwXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGJvYXJkRG9tLmFwcGVuZENoaWxkKHNxdWFyZURvbSk7XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBib2FyZERvbTtcclxufTtcclxuXHJcbmNvbnN0IHVwZGF0ZVN0YXR1c0RvbSA9IChkb20sIHN0YXR1cykgPT4ge1xyXG4gIGRvbS5zZXRBdHRyaWJ1dGUoXCJkYXRhLXN0YXR1c1wiLCBzdGF0dXMpO1xyXG59O1xyXG5cclxuY29uc3Qgc2V0VXBHYW1lYm9hcmREb20gPSAocGxheWVyLCB0eXBlKSA9PiBjcmVhdGVHYW1lYm9hcmREb20ocGxheWVyLCB0eXBlKTtcclxuXHJcbmV4cG9ydCB7XHJcbiAgc2V0VXBHYW1lYm9hcmREb20sXHJcbiAgc2V0VXBQbGF5ZXJCb2FyZCxcclxuICBzZXRVcEFJQm9hcmQsXHJcbiAgdXBkYXRlU3RhdHVzRG9tLFxyXG4gIHBvcHVsYXRlQm9hcmQsXHJcbn07XHJcbiIsImltcG9ydCB7IGNoZWNrRG9tUGxhY2VtZW50VmFsaWRpdHkgfSBmcm9tIFwiLi9wbGFjZW1lbnQtZG9tLWxvZ2ljXCI7XHJcblxyXG5sZXQgZHJhZ1N0YXJ0SXRlbTtcclxuXHJcbmNvbnN0IGdldEF0dHJpYnV0ZUFyciA9IChkb20sIGF0dHIpID0+XHJcbiAgZG9tXHJcbiAgICAuZ2V0QXR0cmlidXRlKGF0dHIpXHJcbiAgICAuc3BsaXQoXCIsXCIpXHJcbiAgICAubWFwKChpdGVtKSA9PiBOdW1iZXIoaXRlbSkpO1xyXG5cclxuY29uc3QgZ2V0Q29vcmRpbmF0ZXNMaXN0ID0gKGNvb3JkaW5hdGVzLCBvcmllbnRhdGlvbiwgbGVuZ3RoKSA9PiB7XHJcbiAgY29uc3QgY29vcmRpbmF0ZXNMaXN0ID0gW2Nvb3JkaW5hdGVzXTtcclxuICBpZiAob3JpZW50YXRpb24gPT09IFwicm93XCIpIHtcclxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgY29vcmRpbmF0ZXNMaXN0LnB1c2goW2Nvb3JkaW5hdGVzWzBdLCBjb29yZGluYXRlc1sxXSArIGldKTtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICBjb29yZGluYXRlc0xpc3QucHVzaChbY29vcmRpbmF0ZXNbMF0gKyBpLCBjb29yZGluYXRlc1sxXV0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGNvb3JkaW5hdGVzTGlzdDtcclxufTtcclxuXHJcbmNvbnN0IGlzQWRqZWNlbnREb21GcmVlID0gKGNvb3JkaW5hdGVzLCBvcmllbnRhdGlvbiwgbGVuZ3RoKSA9PiB7XHJcbiAgY29uc3QgY29vcmRpbmF0ZXNMaXN0ID0gZ2V0Q29vcmRpbmF0ZXNMaXN0KGNvb3JkaW5hdGVzLCBvcmllbnRhdGlvbiwgbGVuZ3RoKTtcclxuICByZXR1cm4gY2hlY2tEb21QbGFjZW1lbnRWYWxpZGl0eShjb29yZGluYXRlc0xpc3QpO1xyXG59O1xyXG5cclxuY29uc3QgcmVtb3ZlRGF0YUluZm9BdHRyID0gKGNvb3JkaW5hdGVzLCBvcmllbnRhdGlvbiwgbGVuZ3RoKSA9PiB7XHJcbiAgY29uc3QgY29vcmRpbmF0ZXNMaXN0ID0gZ2V0Q29vcmRpbmF0ZXNMaXN0KGNvb3JkaW5hdGVzLCBvcmllbnRhdGlvbiwgbGVuZ3RoKTtcclxuICBjb29yZGluYXRlc0xpc3QuZm9yRWFjaCgoY29vcmQpID0+IHtcclxuICAgIGNvbnN0IGRvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWNvb3JkaW5hdGVzPVwiJHtjb29yZH1cIl1gKTtcclxuICAgIGRvbS5zZXRBdHRyaWJ1dGUoXCJkYXRhLWluZm9cIiwgXCJmcmVlXCIpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuZnVuY3Rpb24gZHJhZ3N0YXJ0SGFuZGxlcihldikge1xyXG4gIGNvbnN0IGNoaWxkID0gZXYudGFyZ2V0O1xyXG4gIGNvbnN0IHBhcmVudCA9IGV2LnRhcmdldC5wYXJlbnRFbGVtZW50O1xyXG4gIGNvbnN0IGNvb3JkaW5hdGVzID0gZ2V0QXR0cmlidXRlQXJyKHBhcmVudCwgXCJkYXRhLWNvb3JkaW5hdGVzXCIpO1xyXG4gIGNvbnN0IG9yaWVudGF0aW9uID0gY2hpbGQuZ2V0QXR0cmlidXRlKFwiZGF0YS1vcmllbnRhdGlvblwiKTtcclxuICBjb25zdCBsZW5ndGggPSBOdW1iZXIoY2hpbGQuZ2V0QXR0cmlidXRlKFwiZGF0YS1sZW5ndGhcIikpO1xyXG4gIGV2LnRhcmdldC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKGNoaWxkKTtcclxuICBkcmFnU3RhcnRJdGVtID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChldi5jbGllbnRYLCBldi5jbGllbnRZKTtcclxuICBwYXJlbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xyXG4gIHJlbW92ZURhdGFJbmZvQXR0cihjb29yZGluYXRlcywgb3JpZW50YXRpb24sIGxlbmd0aCk7XHJcbiAgZXYuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJ0ZXh0L3BsYWluXCIsIGV2LnRhcmdldC5pZCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYWdvdmVySGFuZGxlcihldikge1xyXG4gIGNvbnN0IGVsID0gZXY7XHJcbiAgZWwucHJldmVudERlZmF1bHQoKTtcclxuICBlbC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibW92ZVwiO1xyXG59XHJcblxyXG5jb25zdCBjaGVja0RpZmYgPSAoZGF0YTEsIGRhdGEyKSA9PlxyXG4gIGRhdGExID4gZGF0YTIgPyBkYXRhMSAtIGRhdGEyIDogZGF0YTIgLSBkYXRhMTtcclxuXHJcbmNvbnN0IGdldENvcnJlY3REcm9wQ29vcmRpbmF0ZXMgPSAoXHJcbiAgb3JpZW50YXRpb24sXHJcbiAgZGF0YTEsXHJcbiAgZGF0YTIsXHJcbiAgZHJvcENvb3JkaW5hdGVzLFxyXG4pID0+IHtcclxuICBpZiAob3JpZW50YXRpb24gPT09IFwicm93XCIpIHtcclxuICAgIGNvbnN0IG5ld0Nvb3JkID0gW1xyXG4gICAgICBkcm9wQ29vcmRpbmF0ZXNbMF0sXHJcbiAgICAgIGRyb3BDb29yZGluYXRlc1sxXSAtIGNoZWNrRGlmZihkYXRhMVsxXSwgZGF0YTJbMV0pLFxyXG4gICAgXTtcclxuICAgIHJldHVybiBuZXdDb29yZDtcclxuICB9XHJcblxyXG4gIGNvbnN0IG5ld0Nvb3JkID0gW1xyXG4gICAgZHJvcENvb3JkaW5hdGVzWzBdIC0gY2hlY2tEaWZmKGRhdGExWzBdLCBkYXRhMlswXSksXHJcbiAgICBkcm9wQ29vcmRpbmF0ZXNbMV0sXHJcbiAgXTtcclxuXHJcbiAgcmV0dXJuIG5ld0Nvb3JkO1xyXG59O1xyXG5cclxuY29uc3QgaXNDb29yZGluYXRlc1ZhbGlkID0gKGNvb3JkaW5hdGVzLCBvcmllbnRhdGlvbiwgbGVuZ3RoKSA9PiB7XHJcbiAgY29uc3Qgcm93ID0gY29vcmRpbmF0ZXNbMF0gKyBsZW5ndGggLSAxO1xyXG4gIGNvbnN0IGNvbHVtbiA9IGNvb3JkaW5hdGVzWzFdICsgbGVuZ3RoIC0gMTtcclxuXHJcbiAgaWYgKG9yaWVudGF0aW9uID09PSBcInJvd1wiKSB7XHJcbiAgICByZXR1cm4gY29sdW1uID4gOTtcclxuICB9XHJcblxyXG4gIHJldHVybiByb3cgPiA5O1xyXG59O1xyXG5cclxuY29uc3QgaXNDb29yZGluYXRlc0ZyZWUgPSAoY29vcmRpbmF0ZXMsIG9yaWVudGF0aW9uLCBsZW5ndGgpID0+IHtcclxuICBjb25zdCBjb29yZGluYXRlc0xpc3QgPSBnZXRDb29yZGluYXRlc0xpc3QoY29vcmRpbmF0ZXMsIG9yaWVudGF0aW9uLCBsZW5ndGgpO1xyXG4gIHJldHVybiBjb29yZGluYXRlc0xpc3QuZXZlcnkoKGNvb3JkKSA9PiB7XHJcbiAgICBjb25zdCBkb20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1jb29yZGluYXRlcz1cIiR7Y29vcmR9XCJdYCk7XHJcbiAgICByZXR1cm4gZG9tLmdldEF0dHJpYnV0ZShcImRhdGEtaW5mb1wiKSA9PT0gXCJmcmVlXCI7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5jb25zdCBhZGREYXRhSW5mb0F0dHIgPSAoY29vcmRpbmF0ZXMsIG9yaWVudGF0aW9uLCBsZW5ndGgpID0+IHtcclxuICBjb25zdCBjb29yZGluYXRlc0xpc3QgPSBnZXRDb29yZGluYXRlc0xpc3QoY29vcmRpbmF0ZXMsIG9yaWVudGF0aW9uLCBsZW5ndGgpO1xyXG5cclxuICBjb29yZGluYXRlc0xpc3QuZm9yRWFjaCgoY29vcmQpID0+IHtcclxuICAgIGNvbnN0IGRvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWNvb3JkaW5hdGVzPVwiJHtjb29yZH1cIl1gKTtcclxuICAgIGRvbS5zZXRBdHRyaWJ1dGUoXCJkYXRhLWluZm9cIiwgXCJvY2N1cGllZFwiKTtcclxuICB9KTtcclxufTtcclxuXHJcbmNvbnN0IGNoZWNrUGxhY2VtZW50RG9tVmFsaWRpdHkgPSAoXHJcbiAgdGFyZ2V0LFxyXG4gIGN1cnJlbnRQb2ludCxcclxuICBkcm9wUG9pbnQsXHJcbiAgcHJldkNvb3JkaW5hdGVzLFxyXG4gIG5ld0Nvb3JkaW5hdGVzLFxyXG4gIG9yaWVudGF0aW9uLFxyXG4gIGxlbmd0aCxcclxuKSA9PiB7XHJcbiAgaWYgKFxyXG4gICAgIWlzQ29vcmRpbmF0ZXNWYWxpZChuZXdDb29yZGluYXRlcywgb3JpZW50YXRpb24sIGxlbmd0aCkgJiZcclxuICAgIGlzQ29vcmRpbmF0ZXNGcmVlKG5ld0Nvb3JkaW5hdGVzLCBvcmllbnRhdGlvbiwgbGVuZ3RoKSAmJlxyXG4gICAgaXNBZGplY2VudERvbUZyZWUobmV3Q29vcmRpbmF0ZXMsIG9yaWVudGF0aW9uLCBsZW5ndGgpXHJcbiAgKSB7XHJcbiAgICBhZGREYXRhSW5mb0F0dHIobmV3Q29vcmRpbmF0ZXMsIG9yaWVudGF0aW9uLCBsZW5ndGgpO1xyXG4gICAgZHJvcFBvaW50LmFwcGVuZENoaWxkKHRhcmdldCk7XHJcbiAgICB0YXJnZXQuc2V0QXR0cmlidXRlKFwiZGF0YS1oZWFkXCIsIGAke25ld0Nvb3JkaW5hdGVzfWApO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBjdXJyZW50UG9pbnQuYXBwZW5kQ2hpbGQodGFyZ2V0KTtcclxuICAgIGFkZERhdGFJbmZvQXR0cihwcmV2Q29vcmRpbmF0ZXMsIG9yaWVudGF0aW9uLCBsZW5ndGgpO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IGFwcGVuZENoaWxkVG9UYXJnZXQgPSAoZHJvcFBvaW50LCB0YXJnZXQsIGNvcnJlY3RDb29yZGluYXRlcywgc2hpcCkgPT4ge1xyXG4gIGNvbnN0IHsgY29vcmRpbmF0ZXMgfSA9IHNoaXA7XHJcbiAgY29uc3QgY3VycmVudFBvaW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcclxuICAgIGBbZGF0YS1jb29yZGluYXRlcz1cIiR7Y29vcmRpbmF0ZXN9XCJdYCxcclxuICApO1xyXG4gIGNvbnN0IHsgb3JpZW50YXRpb24gfSA9IHNoaXA7XHJcbiAgY29uc3QgeyBsZW5ndGggfSA9IHNoaXA7XHJcblxyXG4gIGNoZWNrUGxhY2VtZW50RG9tVmFsaWRpdHkoXHJcbiAgICB0YXJnZXQsXHJcbiAgICBjdXJyZW50UG9pbnQsXHJcbiAgICBkcm9wUG9pbnQsXHJcbiAgICBjb29yZGluYXRlcyxcclxuICAgIGNvcnJlY3RDb29yZGluYXRlcyxcclxuICAgIG9yaWVudGF0aW9uLFxyXG4gICAgbGVuZ3RoLFxyXG4gICk7XHJcbn07XHJcblxyXG5jb25zdCBjcmVhdGVTaGlwT2JqRGF0YSA9IChjb29yZGluYXRlcywgb3JpZW50YXRpb24sIGxlbmd0aCkgPT4gKHtcclxuICBjb29yZGluYXRlcyxcclxuICBvcmllbnRhdGlvbixcclxuICBsZW5ndGgsXHJcbn0pO1xyXG5cclxuY29uc3QgZHJvcFNoaXBPbk5ld0Nvb3JkaW5hdGVzID0gKGRyb3BDb29yZGluYXRlcywgZHJvcHBlZEl0ZW0pID0+IHtcclxuICBjb25zdCBkcmFnSXRlbUNvb3JkaW5hdGVzID0gZ2V0QXR0cmlidXRlQXJyKGRyb3BwZWRJdGVtLCBcImRhdGEtaGVhZFwiKTtcclxuICBjb25zdCBkcmFnSXRlbU9yaWVudGF0aW9uID0gZHJvcHBlZEl0ZW0uZ2V0QXR0cmlidXRlKFwiZGF0YS1vcmllbnRhdGlvblwiKTtcclxuICBjb25zdCBkcmFnSXRlbUxlbmd0aCA9IE51bWJlcihnZXRBdHRyaWJ1dGVBcnIoZHJvcHBlZEl0ZW0sIFwiZGF0YS1sZW5ndGhcIikpO1xyXG4gIGNvbnN0IHNoaXAgPSBjcmVhdGVTaGlwT2JqRGF0YShcclxuICAgIGRyYWdJdGVtQ29vcmRpbmF0ZXMsXHJcbiAgICBkcmFnSXRlbU9yaWVudGF0aW9uLFxyXG4gICAgZHJhZ0l0ZW1MZW5ndGgsXHJcbiAgKTtcclxuXHJcbiAgY29uc3QgZHJhZ1N0YXJ0Q29vcmRpbmF0ZXMgPSBnZXRBdHRyaWJ1dGVBcnIoXHJcbiAgICBkcmFnU3RhcnRJdGVtLFxyXG4gICAgXCJkYXRhLWNvb3JkaW5hdGVzXCIsXHJcbiAgKTtcclxuXHJcbiAgY29uc3QgY29ycmVjdENvb3JkaW5hdGVzID0gZ2V0Q29ycmVjdERyb3BDb29yZGluYXRlcyhcclxuICAgIGRyYWdJdGVtT3JpZW50YXRpb24sXHJcbiAgICBkcmFnSXRlbUNvb3JkaW5hdGVzLFxyXG4gICAgZHJhZ1N0YXJ0Q29vcmRpbmF0ZXMsXHJcbiAgICBkcm9wQ29vcmRpbmF0ZXMsXHJcbiAgKTtcclxuXHJcbiAgY29uc3QgZHJvcFBvaW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcclxuICAgIGBbZGF0YS1jb29yZGluYXRlcz1cIiR7Y29ycmVjdENvb3JkaW5hdGVzfVwiXWAsXHJcbiAgKTtcclxuXHJcbiAgYXBwZW5kQ2hpbGRUb1RhcmdldChkcm9wUG9pbnQsIGRyb3BwZWRJdGVtLCBjb3JyZWN0Q29vcmRpbmF0ZXMsIHNoaXApO1xyXG59O1xyXG5cclxuZnVuY3Rpb24gZHJvcEhhbmRsZXIoZXYpIHtcclxuICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIGNvbnN0IGRhdGEgPSBldi5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcInRleHQvcGxhaW5cIik7XHJcbiAgY29uc3QgZHJvcHBlZEl0ZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgJHtkYXRhfWApO1xyXG5cclxuICBpZiAoZXYudGFyZ2V0LmNsYXNzTmFtZSA9PT0gXCJkcmFnZ2FibGVcIikge1xyXG4gICAgaWYgKGV2LnRhcmdldC5pZCA9PT0gZGF0YSkge1xyXG4gICAgICBjb25zdCBjaGlsZCA9IGV2LnRhcmdldDtcclxuICAgICAgZXYudGFyZ2V0LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQoY2hpbGQpO1xyXG4gICAgICBjb25zdCB0YXJnZXQgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGV2LmNsaWVudFgsIGV2LmNsaWVudFkpO1xyXG4gICAgICBjb25zdCBkcm9wQ29vcmRpbmF0ZXMgPSBnZXRBdHRyaWJ1dGVBcnIodGFyZ2V0LCBcImRhdGEtY29vcmRpbmF0ZXNcIik7XHJcbiAgICAgIGRyb3BTaGlwT25OZXdDb29yZGluYXRlcyhkcm9wQ29vcmRpbmF0ZXMsIGRyb3BwZWRJdGVtKTtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgY29uc3QgZHJvcENvb3JkaW5hdGVzID0gZ2V0QXR0cmlidXRlQXJyKGV2LnRhcmdldCwgXCJkYXRhLWNvb3JkaW5hdGVzXCIpO1xyXG4gICAgZHJvcFNoaXBPbk5ld0Nvb3JkaW5hdGVzKGRyb3BDb29yZGluYXRlcywgZHJvcHBlZEl0ZW0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IHtcclxuICBkcmFnc3RhcnRIYW5kbGVyLFxyXG4gIGRyYWdvdmVySGFuZGxlcixcclxuICBkcm9wSGFuZGxlcixcclxuICBnZXRBdHRyaWJ1dGVBcnIsXHJcbiAgcmVtb3ZlRGF0YUluZm9BdHRyLFxyXG4gIGFkZERhdGFJbmZvQXR0cixcclxuICBpc0Nvb3JkaW5hdGVzVmFsaWQsXHJcbiAgaXNDb29yZGluYXRlc0ZyZWUsXHJcbiAgZ2V0Q29vcmRpbmF0ZXNMaXN0LFxyXG4gIGlzQWRqZWNlbnREb21GcmVlLFxyXG59O1xyXG4iLCJpbXBvcnQgeyB1cGRhdGVTdGF0dXNEb20sIHNldFVwR2FtZWJvYXJkRG9tIH0gZnJvbSBcIi4vZG9tLXVpXCI7XHJcbmltcG9ydCB7IHNldE11bHRpcGxlQm9yZGVyQ29sb3IsIHNldFJhbmRvbUNvbG9yIH0gZnJvbSBcIi4vY29sb3ItY2hhbmdpbmdcIjtcclxuaW1wb3J0IHsgY3JlYXRlRWxXaXRoQ2xhc3NBbmRUZXh0IH0gZnJvbSBcIi4vZG9tLW1ldGhvZFwiO1xyXG5pbXBvcnQgYWlNYWtlQU1vdmUgZnJvbSBcIi4uL2FpLXNtYXJ0LXR1cm5cIjtcclxuaW1wb3J0IGNyZWF0ZVdpbm5lckRvbSBmcm9tIFwiLi9yZXN0YXJ0LWdhbWVcIjtcclxuXHJcbmNvbnN0IGNvbG9ycyA9IFtcclxuICBcIiM2NWRjOThcIixcclxuICBcIiNmZjJhNmRcIixcclxuICBcIiMwNWQ5ZThcIixcclxuICBcIiNkZWZlNDdcIixcclxuICBcIiNkMWY3ZmZcIixcclxuICBcIiM3NzAwYTZcIixcclxuICBcIiMxYWZlNDlcIixcclxuXTtcclxuXHJcbmNvbnN0IGFubm91bmNlV2lubmVyID0gKHBsYXllcjEsIHBsYXllcjIpID0+IHtcclxuICBjb25zdCBjb250ZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250ZW50XCIpO1xyXG5cclxuICBpZiAocGxheWVyMS5ib2FyZC5oYXZlQWxsU2hpcHNTdW5rKCkpIHtcclxuICAgIGNvbnRlbnQuYXBwZW5kQ2hpbGQoY3JlYXRlV2lubmVyRG9tKHBsYXllcjIucGxheWVyLm5hbWUpKTtcclxuICB9IGVsc2Uge1xyXG4gICAgY29udGVudC5hcHBlbmRDaGlsZChjcmVhdGVXaW5uZXJEb20ocGxheWVyMS5wbGF5ZXIubmFtZSkpO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IGdhbWVPdmVyID0gKHBsYXllcjEsIHBsYXllcjIpID0+XHJcbiAgcGxheWVyMS5ib2FyZC5oYXZlQWxsU2hpcHNTdW5rKCkgfHwgcGxheWVyMi5ib2FyZC5oYXZlQWxsU2hpcHNTdW5rKCk7XHJcblxyXG5jb25zdCBjaGVja0FsbFNoaXBzID0gKHBsYXllcjEsIHBsYXllcjIpID0+IHtcclxuICBpZiAoZ2FtZU92ZXIocGxheWVyMSwgcGxheWVyMikpIHtcclxuICAgIGFubm91bmNlV2lubmVyKHBsYXllcjEsIHBsYXllcjIpO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IGNoZWNrQUlTaGlwQ29vcmRpbmF0ZXMgPSAoZG9tLCBjb29yZGluYXRlcywgcGxheWVyLCBvcHBvbmVudCkgPT4ge1xyXG4gIGNvbnN0IHNxdWFyZSA9IG9wcG9uZW50LmJvYXJkLmdldENvb3JkaW5hdGVzKGNvb3JkaW5hdGVzKTtcclxuICBpZiAocGxheWVyLnR5cGUgPT09IFwicGxheWVyXCIgJiYgXCJzaGlwXCIgaW4gc3F1YXJlKSB7XHJcbiAgICBkb20uY2xhc3NMaXN0LmFkZChcInNoaXBcIik7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgY2hlY2tQbGF5ZXJTaGlwQ29vcmRpbmF0ZXMgPSAoZG9tLCBjb29yZGluYXRlcywgcGxheWVyLCBvcHBvbmVudCkgPT4ge1xyXG4gIGNvbnN0IHNxdWFyZSA9IG9wcG9uZW50LmJvYXJkLmdldENvb3JkaW5hdGVzKGNvb3JkaW5hdGVzKTtcclxuICBpZiAocGxheWVyLnR5cGUgPT09IFwiYWlcIiAmJiBcInNoaXBcIiBpbiBzcXVhcmUpIHtcclxuICAgIGRvbS5jbGFzc0xpc3QuYWRkKFwidGFnZ2VkLXVuY2hlY2tlZFwiKTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBhdHRhY2tPcHBvbmVudEJvYXJkID0gKGRvbSwgY29vcmRpbmF0ZXMsIHBsYXllciwgb3Bwb25lbnQpID0+IHtcclxuICBjaGVja0FJU2hpcENvb3JkaW5hdGVzKGRvbSwgY29vcmRpbmF0ZXMsIHBsYXllciwgb3Bwb25lbnQpO1xyXG4gIGNoZWNrUGxheWVyU2hpcENvb3JkaW5hdGVzKGRvbSwgY29vcmRpbmF0ZXMsIHBsYXllciwgb3Bwb25lbnQpO1xyXG4gIHBsYXllci5wbGF5ZXIuYXR0YWNrKGNvb3JkaW5hdGVzLCBvcHBvbmVudC5ib2FyZCwgXCJyZWNlaXZlQXR0YWNrXCIpO1xyXG4gIHVwZGF0ZVN0YXR1c0RvbShkb20sIG9wcG9uZW50LmJvYXJkLmdldENvb3JkaW5hdGVzKGNvb3JkaW5hdGVzKS5zdGF0dXMpO1xyXG4gIHNldE11bHRpcGxlQm9yZGVyQ29sb3IoY29sb3JzLCBkb20pO1xyXG4gIGNoZWNrQWxsU2hpcHMocGxheWVyLCBvcHBvbmVudCk7XHJcbn07XHJcblxyXG5jb25zdCBmaW5kRG9tQ2hpbGRyZW5CeUF0dHJpYnV0ZSA9IChwYXJlbnREb20sIGF0dHJpYnV0ZSwga2V5KSA9PlxyXG4gIHBhcmVudERvbS5xdWVyeVNlbGVjdG9yKGBbJHthdHRyaWJ1dGV9ID0gXCIke2tleX1cIl1gKTtcclxuXHJcbmNvbnN0IGNvbG9yU2hpcCA9IChjb2xvcnNBcnIsIGRvbSwgY29vcmRpbmF0ZXMsIG9wcG9uZW50KSA9PiB7XHJcbiAgaWYgKFwic2hpcFwiIGluIG9wcG9uZW50LmJvYXJkLmdldENvb3JkaW5hdGVzKGNvb3JkaW5hdGVzKSkge1xyXG4gICAgc2V0UmFuZG9tQ29sb3IoY29sb3JzQXJyLCBkb20sIFwiYmFja2dyb3VuZENvbG9yXCIpO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IGFJVGFrZUFUdXJuID0gKHBhcmVudERvbSwgcGxheWVyLCBvcHBvbmVudCkgPT4ge1xyXG4gIGNvbnN0IGNvb3JkaW5hdGVzID0gYWlNYWtlQU1vdmUocGFyZW50RG9tLCBwbGF5ZXIsIG9wcG9uZW50KTtcclxuICBjb25zdCBkb20gPSBmaW5kRG9tQ2hpbGRyZW5CeUF0dHJpYnV0ZShcclxuICAgIHBhcmVudERvbSxcclxuICAgIFwiZGF0YS1jb29yZGluYXRlc1wiLFxyXG4gICAgYCR7Y29vcmRpbmF0ZXN9YCxcclxuICApO1xyXG5cclxuICBpZiAoIWdhbWVPdmVyKHBsYXllciwgb3Bwb25lbnQpKSB7XHJcbiAgICBhdHRhY2tPcHBvbmVudEJvYXJkKGRvbSwgY29vcmRpbmF0ZXMsIHBsYXllciwgb3Bwb25lbnQpO1xyXG4gICAgY29sb3JTaGlwKGNvbG9ycywgZG9tLCBjb29yZGluYXRlcywgb3Bwb25lbnQpO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IHBsYXllclRha2VBVHVybiA9IChcclxuICBwbGF5ZXJEb20sXHJcbiAgb3Bwb25lbnREb20sXHJcbiAgY29vcmRpbmF0ZXMsXHJcbiAgcGxheWVyLFxyXG4gIG9wcG9uZW50LFxyXG4pID0+IHtcclxuICBhdHRhY2tPcHBvbmVudEJvYXJkKHBsYXllckRvbSwgY29vcmRpbmF0ZXMsIHBsYXllciwgb3Bwb25lbnQpO1xyXG4gIGlmICghZ2FtZU92ZXIocGxheWVyLCBvcHBvbmVudCkpIHtcclxuICAgIGFJVGFrZUFUdXJuKG9wcG9uZW50RG9tLnBhcmVudEVsZW1lbnQsIG9wcG9uZW50LCBwbGF5ZXIpO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IGNoZWNrVHVyblZhbGlkaXR5ID0gKFxyXG4gIHBsYXllckRvbSxcclxuICBvcHBvbmVudERvbSxcclxuICBjb29yZGluYXRlcyxcclxuICBwbGF5ZXIsXHJcbiAgb3Bwb25lbnQsXHJcbiAgZm4sXHJcbikgPT4ge1xyXG4gIGlmIChcclxuICAgIHBsYXllckRvbS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXN0YXR1c1wiKSA9PT0gXCJmcmVlXCIgJiZcclxuICAgICFvcHBvbmVudC5ib2FyZC5oYXZlQWxsU2hpcHNTdW5rKCkgJiZcclxuICAgICFwbGF5ZXIuYm9hcmQuaGF2ZUFsbFNoaXBzU3VuaygpXHJcbiAgKSB7XHJcbiAgICBmbihwbGF5ZXJEb20sIG9wcG9uZW50RG9tLCBjb29yZGluYXRlcywgcGxheWVyLCBvcHBvbmVudCk7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgcmVnaXN0ZXJBdHRhY2sgPSAoXHJcbiAgcGxheWVyRG9tLFxyXG4gIG9wcG9uZW50RG9tLFxyXG4gIGNvb3JkaW5hdGVzLFxyXG4gIHBsYXllcixcclxuICBvcHBvbmVudCxcclxuICBmbixcclxuKSA9PiB7XHJcbiAgY2hlY2tUdXJuVmFsaWRpdHkocGxheWVyRG9tLCBvcHBvbmVudERvbSwgY29vcmRpbmF0ZXMsIHBsYXllciwgb3Bwb25lbnQsIGZuKTtcclxufTtcclxuXHJcbmNvbnN0IGdldERvbUNvb3JkaW5hdGVzID0gKGRvbSkgPT5cclxuICBkb21cclxuICAgIC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWNvb3JkaW5hdGVzXCIpXHJcbiAgICAuc3BsaXQoXCIsXCIpXHJcbiAgICAubWFwKChudW0pID0+IE51bWJlcihudW0pKTtcclxuXHJcbmNvbnN0IEdhbWUgPSAocGxheWVyMSwgcGxheWVyMikgPT4ge1xyXG4gIGNvbnN0IGdhbWVEb20gPSBjcmVhdGVFbFdpdGhDbGFzc0FuZFRleHQoXCJkaXZcIiwgXCJnYW1lXCIpO1xyXG4gIGNvbnN0IHZzVGV4dCA9IGNyZWF0ZUVsV2l0aENsYXNzQW5kVGV4dChcImRpdlwiLCBcInZzLXRleHRcIiwgXCJWU1wiKTtcclxuICBjb25zdCBwbGF5ZXIxRG9tID0gc2V0VXBHYW1lYm9hcmREb20ocGxheWVyMSk7XHJcbiAgY29uc3QgcGxheWVyMkRvbSA9IHNldFVwR2FtZWJvYXJkRG9tKHBsYXllcjIpO1xyXG4gIHBsYXllcjJEb20uY2hpbGROb2Rlcy5mb3JFYWNoKChub2RlKSA9PiB7XHJcbiAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoXHJcbiAgICAgIFwiY2xpY2tcIixcclxuICAgICAgcmVnaXN0ZXJBdHRhY2suYmluZChcclxuICAgICAgICB0aGlzLFxyXG4gICAgICAgIG5vZGUsXHJcbiAgICAgICAgcGxheWVyMkRvbSxcclxuICAgICAgICBnZXREb21Db29yZGluYXRlcyhub2RlKSxcclxuICAgICAgICBwbGF5ZXIxLFxyXG4gICAgICAgIHBsYXllcjIsXHJcbiAgICAgICAgcGxheWVyVGFrZUFUdXJuLFxyXG4gICAgICApLFxyXG4gICAgKTtcclxuICB9KTtcclxuXHJcbiAgZ2FtZURvbS5hcHBlbmRDaGlsZChwbGF5ZXIxRG9tKTtcclxuICBnYW1lRG9tLmFwcGVuZENoaWxkKHZzVGV4dCk7XHJcbiAgZ2FtZURvbS5hcHBlbmRDaGlsZChwbGF5ZXIyRG9tKTtcclxuXHJcbiAgcmV0dXJuIGdhbWVEb207XHJcbn07XHJcblxyXG5leHBvcnQgeyBHYW1lLCByZWdpc3RlckF0dGFjaywgcGxheWVyVGFrZUFUdXJuLCBhSVRha2VBVHVybiB9O1xyXG4iLCJpbXBvcnQgeyBjcmVhdGVFbFdpdGhDbGFzc0FuZFRleHQgfSBmcm9tIFwiLi9kb20tbWV0aG9kXCI7XHJcbmltcG9ydCB7IHNldFVwUGxheWVyQm9hcmQsIHNldFVwQUlCb2FyZCwgcG9wdWxhdGVCb2FyZCB9IGZyb20gXCIuL2RvbS11aVwiO1xyXG5pbXBvcnQgeyBjcmVhdGVHYW1lYm9hcmRUYWJsZSwgY3JlYXRlU2hpcERvbSB9IGZyb20gXCIuL3NoaXAtcGxhY2VtZW50LXVpXCI7XHJcbmltcG9ydCB7IGdldEF0dHJpYnV0ZUFyciB9IGZyb20gXCIuL2RyYWctYW5kLWRyb3BcIjtcclxuaW1wb3J0IFNoaXAgZnJvbSBcIi4uL3NoaXBcIjtcclxuaW1wb3J0IHsgR2FtZSB9IGZyb20gXCIuL2dhbWUtZG9tLXVpXCI7XHJcblxyXG5jb25zdCBjcmVhdGVHcmVldGluZ0RvbSA9ICgpID0+IHtcclxuICBjb25zdCBncmVldGluZyA9IGNyZWF0ZUVsV2l0aENsYXNzQW5kVGV4dChcclxuICAgIFwiaDJcIixcclxuICAgIFwiZ3JlZXRpbmdcIixcclxuICAgIFwiSXQncyB0aW1lIHRvIHBsYWNlIHlvdXIgYmF0dGxlc2hpcHMgQ29tbWFuZGVyIVwiLFxyXG4gICk7XHJcblxyXG4gIHJldHVybiBncmVldGluZztcclxufTtcclxuXHJcbmNvbnN0IGdldEFsbFNoaXBzRGF0YSA9ICgpID0+IHtcclxuICBjb25zdCBzaGlwcyA9IFtdO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkgKz0gMSkge1xyXG4gICAgY29uc3Qgc2hpcERvbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGAke2l9YCk7XHJcbiAgICBjb25zdCBjb29yZGluYXRlcyA9IGdldEF0dHJpYnV0ZUFycihzaGlwRG9tLCBcImRhdGEtaGVhZFwiKTtcclxuICAgIGNvbnN0IG9yaWVudGF0aW9uID0gc2hpcERvbS5nZXRBdHRyaWJ1dGUoXCJkYXRhLW9yaWVudGF0aW9uXCIpO1xyXG4gICAgY29uc3QgbGVuZ3RoID0gTnVtYmVyKHNoaXBEb20uZ2V0QXR0cmlidXRlKFwiZGF0YS1sZW5ndGhcIikpO1xyXG4gICAgc2hpcHMucHVzaCh7IGNvb3JkaW5hdGVzLCBvcmllbnRhdGlvbiwgbGVuZ3RoIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHNoaXBzO1xyXG59O1xyXG5cclxuY29uc3QgcmVtb3ZlTG9iYnkgPSAocGFyZW50RG9tKSA9PiB7XHJcbiAgY29uc3QgbG9iYnkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmhhcmJvclwiKTtcclxuICBpZiAobG9iYnkpIHtcclxuICAgIHBhcmVudERvbS5yZW1vdmVDaGlsZChsb2JieSk7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgYXBwZW5kR2FtZURvbSA9IChwYXJlbnREb20sIGRvbSkgPT4ge1xyXG4gIGNvbnN0IGdhbWVEb20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdhbWVcIik7XHJcbiAgaWYgKGdhbWVEb20pIHtcclxuICAgIHBhcmVudERvbS5yZXBsYWNlQ2hpbGQoZG9tLCBnYW1lRG9tKTtcclxuICB9IGVsc2Uge1xyXG4gICAgcGFyZW50RG9tLmFwcGVuZENoaWxkKGRvbSk7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3Qgc3RhcnRHYW1lID0gKCkgPT4ge1xyXG4gIGNvbnN0IGNvbnRlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRlbnRcIik7XHJcbiAgY29uc3QgcGxheWVyMSA9IHNldFVwUGxheWVyQm9hcmQoXCJwbGF5ZXIxXCIpO1xyXG4gIGNvbnN0IHsgYm9hcmQgfSA9IHBsYXllcjE7XHJcbiAgY29uc3Qgc2hpcHMgPSBnZXRBbGxTaGlwc0RhdGEoKTtcclxuICBjb25zdCBwbGF5ZXIyID0gc2V0VXBBSUJvYXJkKFwicGxheWVyMlwiKTtcclxuXHJcbiAgc2hpcHMuZm9yRWFjaCgoc2hpcCkgPT4ge1xyXG4gICAgYm9hcmQucGxhY2VTaGlwKHNoaXAuY29vcmRpbmF0ZXMsIFNoaXAoc2hpcC5sZW5ndGgpLCBzaGlwLm9yaWVudGF0aW9uKTtcclxuICB9KTtcclxuXHJcbiAgcmVtb3ZlTG9iYnkoY29udGVudCk7XHJcbiAgY29uc3QgZ2FtZURvbSA9IEdhbWUocGxheWVyMSwgcGxheWVyMik7XHJcbiAgYXBwZW5kR2FtZURvbShjb250ZW50LCBnYW1lRG9tKTtcclxufTtcclxuXHJcbmNvbnN0IGNyZWF0ZVN0YXJ0R2FtZUJ0biA9ICgpID0+XHJcbiAgY3JlYXRlRWxXaXRoQ2xhc3NBbmRUZXh0KFwiYnV0dG9uXCIsIFwic3RhcnQtYnRuXCIsIFwiU3RhcnRcIik7XHJcblxyXG5jb25zdCBjcmVhdGVMb2JieURvbSA9ICgpID0+IHtcclxuICBjb25zdCBsb2JieSA9IGNyZWF0ZUVsV2l0aENsYXNzQW5kVGV4dChcImRpdlwiLCBcImhhcmJvclwiKTtcclxuICBjb25zdCBwbGF5ZXIgPSBzZXRVcFBsYXllckJvYXJkKFwicGxheWVyMVwiKTtcclxuICBwb3B1bGF0ZUJvYXJkKHBsYXllci5ib2FyZCk7XHJcbiAgY29uc3QgZ3JlZXRpbmcgPSBjcmVhdGVHcmVldGluZ0RvbSgpO1xyXG4gIGNvbnN0IGxvYmJ5Q29udGFpbmVyID0gY3JlYXRlRWxXaXRoQ2xhc3NBbmRUZXh0KFwiZGl2XCIsIFwibG9iYnktY29udGFpbmVyXCIpO1xyXG4gIGNvbnN0IG1haW5Mb2JieUNvbnRhaW5lciA9IGNyZWF0ZUVsV2l0aENsYXNzQW5kVGV4dChcclxuICAgIFwiZGl2XCIsXHJcbiAgICBcIm1haW4tbG9iYnktY29udGFpbmVyXCIsXHJcbiAgKTtcclxuICBjb25zdCBnYW1lYm9hcmRDb250YWluZXIgPSBjcmVhdGVFbFdpdGhDbGFzc0FuZFRleHQoXHJcbiAgICBcImRpdlwiLFxyXG4gICAgXCJnYW1lYm9hcmQtY29udGFpbmVyXCIsXHJcbiAgKTtcclxuXHJcbiAgY29uc3QgcGxheWVyRG9tID0gY3JlYXRlR2FtZWJvYXJkVGFibGUocGxheWVyKTtcclxuICBjcmVhdGVTaGlwRG9tKHBsYXllci5ib2FyZCwgcGxheWVyRG9tKTtcclxuXHJcbiAgY29uc3Qgc3RhcnRCdG5Db250YWluZXIgPSBjcmVhdGVFbFdpdGhDbGFzc0FuZFRleHQoXHJcbiAgICBcImRpdlwiLFxyXG4gICAgXCJzdGFydC1idG4tY29udGFpbmVyXCIsXHJcbiAgKTtcclxuICBjb25zdCBzdGFydEdhbWVCdG4gPSBjcmVhdGVTdGFydEdhbWVCdG4oKTtcclxuICBzdGFydEdhbWVCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHN0YXJ0R2FtZSk7XHJcbiAgc3RhcnRCdG5Db250YWluZXIuYXBwZW5kQ2hpbGQoc3RhcnRHYW1lQnRuKTtcclxuICBtYWluTG9iYnlDb250YWluZXIuYXBwZW5kQ2hpbGQoZ3JlZXRpbmcpO1xyXG4gIGdhbWVib2FyZENvbnRhaW5lci5hcHBlbmRDaGlsZChwbGF5ZXJEb20pO1xyXG4gIG1haW5Mb2JieUNvbnRhaW5lci5hcHBlbmRDaGlsZChnYW1lYm9hcmRDb250YWluZXIpO1xyXG4gIG1haW5Mb2JieUNvbnRhaW5lci5hcHBlbmRDaGlsZChzdGFydEJ0bkNvbnRhaW5lcik7XHJcbiAgbG9iYnlDb250YWluZXIuYXBwZW5kQ2hpbGQobWFpbkxvYmJ5Q29udGFpbmVyKTtcclxuICBsb2JieS5hcHBlbmRDaGlsZChsb2JieUNvbnRhaW5lcik7XHJcblxyXG4gIHJldHVybiBsb2JieTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUxvYmJ5RG9tO1xyXG4iLCJjb25zdCBpc1NxdWFyZU9uVGhlU2FtZVJvdyA9IChzcXVhcmUxLCBzcXVhcmUyKSA9PiBzcXVhcmUxWzBdID09PSBzcXVhcmUyWzBdO1xyXG5jb25zdCB2YWxpZGF0ZVNxdWFyZXNSb3cgPSAoY29vcmRpbmF0ZXMxLCBjb29yZGluYXRlczIpID0+XHJcbiAgaXNTcXVhcmVPblRoZVNhbWVSb3coY29vcmRpbmF0ZXMxLCBjb29yZGluYXRlczIpID8gY29vcmRpbmF0ZXMxIDogLTE7XHJcblxyXG5jb25zdCBpc0FyckV4aXN0ID0gKGFyciwgdGFyZ2V0KSA9PlxyXG4gIGFyci5maWx0ZXIoKGl0ZW0pID0+IGl0ZW1bMF0gPT09IHRhcmdldFswXSAmJiBpdGVtWzFdID09PSB0YXJnZXRbMV0pXHJcbiAgICAubGVuZ3RoID09PSAxO1xyXG5cclxuY29uc3QgcmVtb3ZlRHVwbGljYXRlQXJyID0gKGFycikgPT4ge1xyXG4gIGNvbnN0IGZpbHRlcmVkQXJyID0gW107XHJcbiAgYXJyLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgIGlmICghaXNBcnJFeGlzdChmaWx0ZXJlZEFyciwgaXRlbSkpIHtcclxuICAgICAgZmlsdGVyZWRBcnIucHVzaChpdGVtKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIGZpbHRlcmVkQXJyO1xyXG59O1xyXG5cclxuY29uc3QgZmlsdGVyQW5kU29ydEFyciA9IChhcnIpID0+XHJcbiAgYXJyXHJcbiAgICAuZmlsdGVyKFxyXG4gICAgICAoaXRlbSkgPT4gaXRlbVswXSA+PSAwICYmIGl0ZW1bMF0gPD0gOSAmJiBpdGVtWzFdID49IDAgJiYgaXRlbVsxXSA8PSA5LFxyXG4gICAgKVxyXG4gICAgLnNvcnQoXHJcbiAgICAgIChhLCBiKSA9PlxyXG4gICAgICAgIE51bWJlcihhWzBdLnRvU3RyaW5nKCkgKyBhWzFdLnRvU3RyaW5nKCkpIC1cclxuICAgICAgICBOdW1iZXIoYlswXS50b1N0cmluZygpICsgYlsxXS50b1N0cmluZygpKSxcclxuICAgICk7XHJcblxyXG5jb25zdCBnZXRBZGplY2VudExpc3QgPSAoY29vcmRpbmF0ZXNMaXN0KSA9PiB7XHJcbiAgY29uc3QgbGlzdCA9IFtdO1xyXG4gIGNvb3JkaW5hdGVzTGlzdC5mb3JFYWNoKChjb29yZCkgPT4ge1xyXG4gICAgY29uc3QgdG9wQ29vcmQgPSBbY29vcmRbMF0gLSAxLCBjb29yZFsxXV07XHJcbiAgICBjb25zdCBidG1Db29yZCA9IFtjb29yZFswXSArIDEsIGNvb3JkWzFdXTtcclxuICAgIGNvbnN0IGxUb3BDb29yZCA9IFt0b3BDb29yZFswXSwgdG9wQ29vcmRbMV0gLSAxXTtcclxuICAgIGNvbnN0IHJUb3BDb29yZCA9IFt0b3BDb29yZFswXSwgdG9wQ29vcmRbMV0gKyAxXTtcclxuICAgIGNvbnN0IGxDb29yZCA9IFtjb29yZFswXSwgY29vcmRbMV0gLSAxXTtcclxuICAgIGNvbnN0IHJDb29yZCA9IFtjb29yZFswXSwgY29vcmRbMV0gKyAxXTtcclxuICAgIGNvbnN0IGxCdG1Db29yZCA9IFtidG1Db29yZFswXSwgYnRtQ29vcmRbMV0gLSAxXTtcclxuICAgIGNvbnN0IHJCdG1Db29yZCA9IFtidG1Db29yZFswXSwgYnRtQ29vcmRbMV0gKyAxXTtcclxuXHJcbiAgICBsaXN0LnB1c2godmFsaWRhdGVTcXVhcmVzUm93KGxUb3BDb29yZCwgdG9wQ29vcmQpKTtcclxuICAgIGxpc3QucHVzaCh0b3BDb29yZCk7XHJcbiAgICBsaXN0LnB1c2godmFsaWRhdGVTcXVhcmVzUm93KHJUb3BDb29yZCwgdG9wQ29vcmQpKTtcclxuICAgIGxpc3QucHVzaCh2YWxpZGF0ZVNxdWFyZXNSb3cobENvb3JkLCBjb29yZCkpO1xyXG4gICAgbGlzdC5wdXNoKHZhbGlkYXRlU3F1YXJlc1JvdyhyQ29vcmQsIGNvb3JkKSk7XHJcbiAgICBsaXN0LnB1c2godmFsaWRhdGVTcXVhcmVzUm93KGxCdG1Db29yZCwgYnRtQ29vcmQpKTtcclxuICAgIGxpc3QucHVzaChidG1Db29yZCk7XHJcbiAgICBsaXN0LnB1c2godmFsaWRhdGVTcXVhcmVzUm93KHJCdG1Db29yZCwgYnRtQ29vcmQpKTtcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIHJlbW92ZUR1cGxpY2F0ZUFycihmaWx0ZXJBbmRTb3J0QXJyKGxpc3QpKTtcclxufTtcclxuXHJcbmNvbnN0IGNoZWNrRG9tUGxhY2VtZW50VmFsaWRpdHkgPSAoY29vcmRpbmF0ZXNMaXN0KSA9PiB7XHJcbiAgY29uc3QgYWRqZWNlbnRMaXN0ID0gZ2V0QWRqZWNlbnRMaXN0KGNvb3JkaW5hdGVzTGlzdCk7XHJcbiAgcmV0dXJuIGFkamVjZW50TGlzdC5ldmVyeSgoY29vcmRpbmF0ZXMpID0+IHtcclxuICAgIGNvbnN0IGRvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWNvb3JkaW5hdGVzPVwiJHtjb29yZGluYXRlc31cIl1gKTtcclxuICAgIGNvbnN0IGRhdGFJbmZvID0gZG9tLmdldEF0dHJpYnV0ZShcImRhdGEtaW5mb1wiKTtcclxuICAgIHJldHVybiBkYXRhSW5mbyA9PT0gXCJmcmVlXCI7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5leHBvcnQgeyBjaGVja0RvbVBsYWNlbWVudFZhbGlkaXR5LCByZW1vdmVEdXBsaWNhdGVBcnIsIGZpbHRlckFuZFNvcnRBcnIgfTtcclxuIiwiaW1wb3J0IHsgY3JlYXRlRWxXaXRoQ2xhc3NBbmRUZXh0IH0gZnJvbSBcIi4vZG9tLW1ldGhvZFwiO1xyXG5pbXBvcnQgY3JlYXRlTG9iYnlEb20gZnJvbSBcIi4vbG9iYnktdWlcIjtcclxuXHJcbmNvbnN0IHJlbW92ZUdhbWVEb20gPSAocGFyZW50RG9tKSA9PiB7XHJcbiAgY29uc3QgZ2FtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZVwiKTtcclxuICBpZiAoZ2FtZSkge1xyXG4gICAgcGFyZW50RG9tLnJlbW92ZUNoaWxkKGdhbWUpO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IHJlbW92ZVBvcFVwID0gKHBhcmVudERvbSkgPT4ge1xyXG4gIGNvbnN0IHBvcFVwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53aW5uZXItY29udGFpbmVyXCIpO1xyXG4gIGlmIChwb3BVcCkge1xyXG4gICAgcGFyZW50RG9tLnJlbW92ZUNoaWxkKHBvcFVwKTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCByZXN0YXJ0R2FtZSA9ICgpID0+IHtcclxuICBjb25zdCBjb250ZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250ZW50XCIpO1xyXG4gIHJlbW92ZUdhbWVEb20oY29udGVudCk7XHJcbiAgcmVtb3ZlUG9wVXAoY29udGVudCk7XHJcbiAgY29udGVudC5hcHBlbmRDaGlsZChjcmVhdGVMb2JieURvbSgpKTtcclxufTtcclxuXHJcbmNvbnN0IGNyZWF0ZVdpbm5lckRvbSA9ICh3aW5uZXIpID0+IHtcclxuICBjb25zdCB3aW5uZXJEb21Db250YWluZXIgPSBjcmVhdGVFbFdpdGhDbGFzc0FuZFRleHQoXHJcbiAgICBcImRpdlwiLFxyXG4gICAgXCJ3aW5uZXItY29udGFpbmVyXCIsXHJcbiAgKTtcclxuICBjb25zdCB3aW5uZXJEb20gPSBjcmVhdGVFbFdpdGhDbGFzc0FuZFRleHQoXHJcbiAgICBcImRpdlwiLFxyXG4gICAgXCJ3aW5uZXItZG9tXCIsXHJcbiAgICBgJHt3aW5uZXIudG9VcHBlckNhc2UoKX0gV09OIWAsXHJcbiAgKTtcclxuXHJcbiAgY29uc3QgcmVzdGFydEJ0biA9IGNyZWF0ZUVsV2l0aENsYXNzQW5kVGV4dChcImJ1dHRvblwiLCBcInJlc3RhcnRcIiwgXCJyZXN0YXJ0XCIpO1xyXG4gIHJlc3RhcnRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHJlc3RhcnRHYW1lKTtcclxuICB3aW5uZXJEb21Db250YWluZXIuYXBwZW5kQ2hpbGQod2lubmVyRG9tKTtcclxuICB3aW5uZXJEb21Db250YWluZXIuYXBwZW5kQ2hpbGQocmVzdGFydEJ0bik7XHJcbiAgcmV0dXJuIHdpbm5lckRvbUNvbnRhaW5lcjtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVdpbm5lckRvbTtcclxuIiwiaW1wb3J0IHtcclxuICBnZXRBdHRyaWJ1dGVBcnIsXHJcbiAgcmVtb3ZlRGF0YUluZm9BdHRyLFxyXG4gIGlzQ29vcmRpbmF0ZXNGcmVlLFxyXG4gIGFkZERhdGFJbmZvQXR0cixcclxuICBpc0Nvb3JkaW5hdGVzVmFsaWQsXHJcbiAgaXNBZGplY2VudERvbUZyZWUsXHJcbn0gZnJvbSBcIi4vZHJhZy1hbmQtZHJvcFwiO1xyXG5cclxuY29uc3QgZ2VPcHBvc2l0ZU9yaWVudGF0aW9uID0gKG9yaWVudGF0aW9uKSA9PiB7XHJcbiAgaWYgKG9yaWVudGF0aW9uID09PSBcInJvd1wiKSB7XHJcbiAgICByZXR1cm4gXCJjb2x1bW5cIjtcclxuICB9XHJcblxyXG4gIHJldHVybiBcInJvd1wiO1xyXG59O1xyXG5cclxuY29uc3QgY2hhbmdlU2hpcE9yaWVudGF0aW9uU3R5bGUgPSAodGFyZ2V0LCBvcmllbnRhdGlvbiwgbGVuZ3RoKSA9PiB7XHJcbiAgY29uc3QgZG9tID0gdGFyZ2V0O1xyXG4gIGlmIChvcmllbnRhdGlvbiA9PT0gXCJyb3dcIikge1xyXG4gICAgZG9tLnN0eWxlLndpZHRoID0gYGNhbGMoJHtsZW5ndGggKiAxMDB9JSArICR7bGVuZ3RoIC0gMX1weClgO1xyXG4gICAgZG9tLnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiaGVpZ2h0XCIpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBkb20uc3R5bGUuaGVpZ2h0ID0gYGNhbGMoJHtsZW5ndGggKiAxMDB9JSArICR7bGVuZ3RoIC0gMX1weClgO1xyXG4gICAgZG9tLnN0eWxlLnJlbW92ZVByb3BlcnR5KFwid2lkdGhcIik7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgY2hhbmdlT3JpZW50YXRpb25Eb20gPSAodGFyZ2V0LCBjb29yZGluYXRlcywgb3JpZW50YXRpb24sIGxlbmd0aCkgPT4ge1xyXG4gIGNoYW5nZVNoaXBPcmllbnRhdGlvblN0eWxlKHRhcmdldCwgb3JpZW50YXRpb24sIGxlbmd0aCk7XHJcbiAgdGFyZ2V0LnNldEF0dHJpYnV0ZShcImRhdGEtb3JpZW50YXRpb25cIiwgYCR7b3JpZW50YXRpb259YCk7XHJcbiAgYWRkRGF0YUluZm9BdHRyKGNvb3JkaW5hdGVzLCBvcmllbnRhdGlvbiwgbGVuZ3RoKTtcclxufTtcclxuXHJcbmNvbnN0IHZhbGlkYXRlQWRqZWNlbnREb20gPSAoXHJcbiAgdGFyZ2V0LFxyXG4gIGNvb3JkaW5hdGVzLFxyXG4gIG5ld09yaWVudGF0aW9uLFxyXG4gIHByZXZPcmllbnRhdGlvbixcclxuICBsZW5ndGgsXHJcbikgPT4ge1xyXG4gIGlmIChpc0FkamVjZW50RG9tRnJlZShjb29yZGluYXRlcywgbmV3T3JpZW50YXRpb24sIGxlbmd0aCkpIHtcclxuICAgIGNoYW5nZU9yaWVudGF0aW9uRG9tKHRhcmdldCwgY29vcmRpbmF0ZXMsIG5ld09yaWVudGF0aW9uLCBsZW5ndGgpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBhZGREYXRhSW5mb0F0dHIoY29vcmRpbmF0ZXMsIHByZXZPcmllbnRhdGlvbiwgbGVuZ3RoKTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCB2YWxpZGF0ZVBsYWNlbWVudCA9IChcclxuICB0YXJnZXQsXHJcbiAgY29vcmRpbmF0ZXMsXHJcbiAgbmV3T3JpZW50YXRpb24sXHJcbiAgcHJldk9yaWVudGF0aW9uLFxyXG4gIGxlbmd0aCxcclxuKSA9PiB7XHJcbiAgaWYgKGlzQ29vcmRpbmF0ZXNGcmVlKGNvb3JkaW5hdGVzLCBuZXdPcmllbnRhdGlvbiwgbGVuZ3RoKSkge1xyXG4gICAgdmFsaWRhdGVBZGplY2VudERvbShcclxuICAgICAgdGFyZ2V0LFxyXG4gICAgICBjb29yZGluYXRlcyxcclxuICAgICAgbmV3T3JpZW50YXRpb24sXHJcbiAgICAgIHByZXZPcmllbnRhdGlvbixcclxuICAgICAgbGVuZ3RoLFxyXG4gICAgKTtcclxuICB9IGVsc2Uge1xyXG4gICAgYWRkRGF0YUluZm9BdHRyKGNvb3JkaW5hdGVzLCBwcmV2T3JpZW50YXRpb24sIGxlbmd0aCk7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgY2hhbmdlT3JpZW50YXRpb24gPSAoZXYpID0+IHtcclxuICBjb25zdCB7IHRhcmdldCB9ID0gZXY7XHJcbiAgY29uc3QgY29vcmRpbmF0ZXMgPSBnZXRBdHRyaWJ1dGVBcnIodGFyZ2V0LCBcImRhdGEtaGVhZFwiKTtcclxuICBjb25zdCBvcmllbnRhdGlvbiA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLW9yaWVudGF0aW9uXCIpO1xyXG4gIGNvbnN0IG5ld09yaWVudGF0aW9uID0gZ2VPcHBvc2l0ZU9yaWVudGF0aW9uKG9yaWVudGF0aW9uKTtcclxuICBjb25zdCBsZW5ndGggPSBOdW1iZXIodGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtbGVuZ3RoXCIpKTtcclxuICByZW1vdmVEYXRhSW5mb0F0dHIoY29vcmRpbmF0ZXMsIG9yaWVudGF0aW9uLCBsZW5ndGgpO1xyXG4gIGlmICghaXNDb29yZGluYXRlc1ZhbGlkKGNvb3JkaW5hdGVzLCBuZXdPcmllbnRhdGlvbiwgbGVuZ3RoKSkge1xyXG4gICAgdmFsaWRhdGVQbGFjZW1lbnQodGFyZ2V0LCBjb29yZGluYXRlcywgbmV3T3JpZW50YXRpb24sIG9yaWVudGF0aW9uLCBsZW5ndGgpO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNoYW5nZU9yaWVudGF0aW9uO1xyXG4iLCJpbXBvcnQgeyBhZGRBdHRyaWJ1dGVzVG9FbCwgY3JlYXRlRWxXaXRoQ2xhc3NBbmRUZXh0IH0gZnJvbSBcIi4vZG9tLW1ldGhvZFwiO1xyXG5pbXBvcnQge1xyXG4gIGRyYWdvdmVySGFuZGxlcixcclxuICBkcmFnc3RhcnRIYW5kbGVyLFxyXG4gIGRyb3BIYW5kbGVyLFxyXG59IGZyb20gXCIuL2RyYWctYW5kLWRyb3BcIjtcclxuaW1wb3J0IGNoYW5nZU9yaWVudGF0aW9uIGZyb20gXCIuL3NoaXAtb3JpZW50YXRpb24tY29udHJvbFwiO1xyXG5cclxuY29uc3QgY3JlYXRlUm93c0Zyb21Cb2FyZCA9IChib2FyZCwgcm93TGVuZ3RoKSA9PiB7XHJcbiAgY29uc3Qgcm93cyA9IFtdO1xyXG5cclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGJvYXJkLmxlbmd0aCAvIHJvd0xlbmd0aDsgaSArPSAxKSB7XHJcbiAgICBjb25zdCByb3cgPSBbXTtcclxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgYm9hcmQubGVuZ3RoIC8gcm93TGVuZ3RoOyBqICs9IDEpIHtcclxuICAgICAgcm93LnB1c2goYm9hcmRbTnVtYmVyKGkudG9TdHJpbmcoKSArIGoudG9TdHJpbmcoKSldKTtcclxuICAgIH1cclxuICAgIHJvd3MucHVzaChyb3cpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJvd3M7XHJcbn07XHJcblxyXG5jb25zdCBjcmVhdGVHYW1lYm9hcmRSb3dEb20gPSAocm93RG9tLCByb3dBcnIpID0+IHtcclxuICByb3dBcnIuZm9yRWFjaCgoc3F1YXJlKSA9PiB7XHJcbiAgICBjb25zdCBzcXVhcmVEb20gPSBjcmVhdGVFbFdpdGhDbGFzc0FuZFRleHQoXCJ0ZFwiLCBcInNxdWFyZVwiKTtcclxuICAgIGFkZEF0dHJpYnV0ZXNUb0VsKFxyXG4gICAgICBzcXVhcmVEb20sXHJcbiAgICAgIFtcImRhdGEtY29vcmRpbmF0ZXNcIiwgXCJkYXRhLWluZm9cIl0sXHJcbiAgICAgIFtgJHtzcXVhcmUuY29vcmRpbmF0ZXN9YCwgXCJmcmVlXCJdLFxyXG4gICAgKTtcclxuICAgIHNxdWFyZURvbS5hZGRFdmVudExpc3RlbmVyKFwiZHJvcFwiLCBkcm9wSGFuZGxlcik7XHJcbiAgICBzcXVhcmVEb20uYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsIGRyYWdvdmVySGFuZGxlcik7XHJcbiAgICByb3dEb20uYXBwZW5kQ2hpbGQoc3F1YXJlRG9tKTtcclxuICB9KTtcclxufTtcclxuXHJcbmNvbnN0IGNyZWF0ZVJvd0RvbSA9IChyb3dEb20sIHJvd0FycikgPT4ge1xyXG4gIHJvd0Fyci5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICBjb25zdCBkb20gPSBjcmVhdGVFbFdpdGhDbGFzc0FuZFRleHQoXCJ0aFwiLCBcIlwiLCBpdGVtKTtcclxuICAgIGRvbS5zZXRBdHRyaWJ1dGUoXCJzY29wZVwiLCBcImNvbHVtblwiKTtcclxuICAgIHJvd0RvbS5hcHBlbmRDaGlsZChkb20pO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuY29uc3QgY3JlYXRlQ29sdW1uSGVhZGVyID0gKCkgPT4ge1xyXG4gIGNvbnN0IHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0clwiKTtcclxuICByb3cuYXBwZW5kQ2hpbGQoY3JlYXRlRWxXaXRoQ2xhc3NBbmRUZXh0KFwidGRcIikpO1xyXG4gIGNyZWF0ZVJvd0RvbShyb3csIFtcImFcIiwgXCJiXCIsIFwiY1wiLCBcImRcIiwgXCJlXCIsIFwiZlwiLCBcImdcIiwgXCJoXCIsIFwiaVwiLCBcImpcIl0pO1xyXG5cclxuICByZXR1cm4gcm93O1xyXG59O1xyXG5cclxuY29uc3QgY3JlYXRlR2FtZWJvYXJkVGFibGUgPSAocGxheWVyKSA9PiB7XHJcbiAgY29uc3QgYm9hcmREb20gPSBjcmVhdGVFbFdpdGhDbGFzc0FuZFRleHQoXCJ0YWJsZVwiLCBcImdhbWVib2FyZFwiKTtcclxuICBib2FyZERvbS5zZXRBdHRyaWJ1dGUoXCJkYXRhLW5hbWVcIiwgYCR7cGxheWVyLnBsYXllci5uYW1lfWApO1xyXG4gIGJvYXJkRG9tLmFwcGVuZENoaWxkKGNyZWF0ZUNvbHVtbkhlYWRlcigpKTtcclxuICBjb25zdCByb3dzID0gY3JlYXRlUm93c0Zyb21Cb2FyZChwbGF5ZXIuYm9hcmQuYm9hcmQsIDEwKTtcclxuICByb3dzLmZvckVhY2goKHJvdywgaW5kZXgpID0+IHtcclxuICAgIGNvbnN0IHJvd0RvbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0clwiKTtcclxuICAgIGNvbnN0IHJvd0hlYWQgPSBjcmVhdGVFbFdpdGhDbGFzc0FuZFRleHQoXCJ0aFwiLCBcIlwiLCBpbmRleCArIDEpO1xyXG4gICAgcm93SGVhZC5zZXRBdHRyaWJ1dGUoXCJzY29wZVwiLCBcInJvd1wiKTtcclxuICAgIHJvd0RvbS5hcHBlbmRDaGlsZChyb3dIZWFkKTtcclxuICAgIGNyZWF0ZUdhbWVib2FyZFJvd0RvbShyb3dEb20sIHJvdyk7XHJcbiAgICBib2FyZERvbS5hcHBlbmRDaGlsZChyb3dEb20pO1xyXG4gIH0pO1xyXG4gIHJldHVybiBib2FyZERvbTtcclxufTtcclxuXHJcbmNvbnN0IHN0eWxlU2hpcEJ5SXRzTGVuZ3RoID0gKGRvbSwgbGVuZ3RoLCBvcmllbnRhdGlvbikgPT4ge1xyXG4gIGNvbnN0IGVsID0gZG9tO1xyXG5cclxuICBpZiAob3JpZW50YXRpb24gPT09IFwicm93XCIpIHtcclxuICAgIGVsLnN0eWxlLndpZHRoID0gYGNhbGMoJHtsZW5ndGggKiAxMDB9JSArICR7bGVuZ3RoIC0gMX1weClgO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBlbC5zdHlsZS5oZWlnaHQgPSBgY2FsYygke2xlbmd0aCAqIDEwMH0lICsgJHtsZW5ndGggLSAxfXB4KWA7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3Qgc2V0RGF0YUluZm9BdHRyID0gKHNoaXAsIGJvYXJkLCBib2FyZERvbSkgPT4ge1xyXG4gIGNvbnN0IHsgY29vcmRpbmF0ZXMgfSA9IHNoaXA7XHJcbiAgY29uc3QgeyBvcmllbnRhdGlvbiB9ID0gc2hpcDtcclxuICBjb25zdCBjb29yZGluYXRlc0xpc3QgPSBib2FyZC5nZXRBbGxDb29yZGluYXRlc0xpc3RCeUluZGV4KFxyXG4gICAgY29vcmRpbmF0ZXMsXHJcbiAgICBzaGlwLnNoaXAsXHJcbiAgICBvcmllbnRhdGlvbixcclxuICApO1xyXG5cclxuICBjb29yZGluYXRlc0xpc3QuZm9yRWFjaCgoY29vcmQpID0+IHtcclxuICAgIGNvbnN0IGRvbSA9IGJvYXJkRG9tLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWNvb3JkaW5hdGVzPVwiJHtjb29yZH1cIl1gKTtcclxuICAgIGFkZEF0dHJpYnV0ZXNUb0VsKGRvbSwgW1wiZGF0YS1pbmZvXCJdLCBbXCJvY2N1cGllZFwiXSk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5jb25zdCBjcmVhdGVEcmFnZ2FibGVJdGVtID0gKGluZGV4LCBvcmllbnRhdGlvbiwgbGVuZ3RoLCBoZWFkKSA9PiB7XHJcbiAgY29uc3QgZHJhZ2dhYmxlID0gY3JlYXRlRWxXaXRoQ2xhc3NBbmRUZXh0KFwiZGl2XCIsIFwiZHJhZ2dhYmxlXCIpO1xyXG4gIGFkZEF0dHJpYnV0ZXNUb0VsKFxyXG4gICAgZHJhZ2dhYmxlLFxyXG4gICAgW1wiaWRcIiwgXCJkcmFnZ2FibGVcIiwgXCJkYXRhLW9yaWVudGF0aW9uXCIsIFwiZGF0YS1sZW5ndGhcIiwgXCJkYXRhLWhlYWRcIl0sXHJcbiAgICBbYCR7aW5kZXh9YCwgdHJ1ZSwgb3JpZW50YXRpb24sIGAke2xlbmd0aH1gLCBgJHtoZWFkfWBdLFxyXG4gICk7XHJcblxyXG4gIHN0eWxlU2hpcEJ5SXRzTGVuZ3RoKGRyYWdnYWJsZSwgbGVuZ3RoLCBvcmllbnRhdGlvbik7XHJcbiAgZHJhZ2dhYmxlLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnc3RhcnRcIiwgZHJhZ3N0YXJ0SGFuZGxlcik7XHJcbiAgZHJhZ2dhYmxlLmFkZEV2ZW50TGlzdGVuZXIoXCJkYmxjbGlja1wiLCBjaGFuZ2VPcmllbnRhdGlvbik7XHJcblxyXG4gIHJldHVybiBkcmFnZ2FibGU7XHJcbn07XHJcblxyXG5jb25zdCBjcmVhdGVTaGlwRG9tID0gKGJvYXJkLCBib2FyZERvbSkgPT4ge1xyXG4gIGJvYXJkLnNoaXBzLmZvckVhY2goKHNoaXAsIGluZGV4KSA9PiB7XHJcbiAgICBjb25zdCBkb20gPSBib2FyZERvbS5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICBgW2RhdGEtY29vcmRpbmF0ZXM9XCIke3NoaXAuY29vcmRpbmF0ZXN9XCJdYCxcclxuICAgICk7XHJcbiAgICBzZXREYXRhSW5mb0F0dHIoc2hpcCwgYm9hcmQsIGJvYXJkRG9tKTtcclxuICAgIGRvbS5hcHBlbmRDaGlsZChcclxuICAgICAgY3JlYXRlRHJhZ2dhYmxlSXRlbShcclxuICAgICAgICBpbmRleCxcclxuICAgICAgICBzaGlwLm9yaWVudGF0aW9uLFxyXG4gICAgICAgIHNoaXAuc2hpcC5sZW5ndGgsXHJcbiAgICAgICAgc2hpcC5jb29yZGluYXRlcyxcclxuICAgICAgKSxcclxuICAgICk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5leHBvcnQgeyBjcmVhdGVHYW1lYm9hcmRUYWJsZSwgY3JlYXRlU2hpcERvbSB9O1xyXG4iLCJjb25zdCBHYW1lYm9hcmQgPSAobGVuZ3RoKSA9PiB7XHJcbiAgY29uc3QgY3JlYXRlQm9hcmQgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBib2FyZCA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGxlbmd0aDsgaiArPSAxKSB7XHJcbiAgICAgICAgYm9hcmQucHVzaCh7IGNvb3JkaW5hdGVzOiBbaSwgal0sIHN0YXR1czogXCJmcmVlXCIgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYm9hcmQ7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgYm9hcmQgPSBjcmVhdGVCb2FyZCgpO1xyXG4gIGNvbnN0IHNoaXBzID0gW107XHJcblxyXG4gIGNvbnN0IGdldENvb3JkaW5hdGVzID0gKGNvb3JkaW5hdGVzKSA9PlxyXG4gICAgYm9hcmQuZmluZChcclxuICAgICAgKHNxdWFyZSkgPT5cclxuICAgICAgICBzcXVhcmUuY29vcmRpbmF0ZXNbMF0gPT09IGNvb3JkaW5hdGVzWzBdICYmXHJcbiAgICAgICAgc3F1YXJlLmNvb3JkaW5hdGVzWzFdID09PSBjb29yZGluYXRlc1sxXSxcclxuICAgICk7XHJcblxyXG4gIGNvbnN0IGdldENvb3JkaW5hdGVzSW5kZXggPSAoY29vcmRpbmF0ZXMpID0+XHJcbiAgICBib2FyZC5maW5kSW5kZXgoXHJcbiAgICAgIChzcXVhcmUpID0+XHJcbiAgICAgICAgc3F1YXJlLmNvb3JkaW5hdGVzWzBdID09PSBjb29yZGluYXRlc1swXSAmJlxyXG4gICAgICAgIHNxdWFyZS5jb29yZGluYXRlc1sxXSA9PT0gY29vcmRpbmF0ZXNbMV0sXHJcbiAgICApO1xyXG5cclxuICBjb25zdCBnZXRFbmRQb2ludCA9IChjb29yZGluYXRlcywgb2JqLCBvcmllbnRhdGlvbikgPT4ge1xyXG4gICAgaWYgKG9yaWVudGF0aW9uLnRvTG93ZXJDYXNlKCkgPT09IFwicm93XCIpIHtcclxuICAgICAgcmV0dXJuIFtjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0gKyBvYmoubGVuZ3RoIC0gMV07XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG9yaWVudGF0aW9uLnRvTG93ZXJDYXNlKCkgPT09IFwiY29sdW1uXCIpIHtcclxuICAgICAgcmV0dXJuIFtjb29yZGluYXRlc1swXSArIG9iai5sZW5ndGggLSAxLCBjb29yZGluYXRlc1sxXV07XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgaXNFbmRQb2ludFZhbGlkID0gKGVuZFBvaW50KSA9PiBnZXRDb29yZGluYXRlcyhlbmRQb2ludCk7XHJcblxyXG4gIGNvbnN0IGZpbmRBbGxDb29yZGluYXRlc0luZGV4ID0gKGNvb3JkaW5hdGVzLCBvYmosIG9yaWVudGF0aW9uKSA9PiB7XHJcbiAgICBjb25zdCBjb29yZGluYXRlc0xpc3QgPSBbXTtcclxuXHJcbiAgICBpZiAob3JpZW50YXRpb24udG9Mb3dlckNhc2UoKSA9PT0gXCJyb3dcIikge1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9iai5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgIGNvb3JkaW5hdGVzTGlzdC5wdXNoKFxyXG4gICAgICAgICAgZ2V0Q29vcmRpbmF0ZXNJbmRleChbY29vcmRpbmF0ZXNbMF0sIGNvb3JkaW5hdGVzWzFdICsgaV0pLFxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAob3JpZW50YXRpb24udG9Mb3dlckNhc2UoKSA9PT0gXCJjb2x1bW5cIikge1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9iai5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgIGNvb3JkaW5hdGVzTGlzdC5wdXNoKFxyXG4gICAgICAgICAgZ2V0Q29vcmRpbmF0ZXNJbmRleChbY29vcmRpbmF0ZXNbMF0gKyBpLCBjb29yZGluYXRlc1sxXV0pLFxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY29vcmRpbmF0ZXNMaXN0O1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IGdldEFsbENvb3JkaW5hdGVzTGlzdEJ5SW5kZXggPSAoY29vcmRpbmF0ZXMsIG9iaiwgb3JpZW50YXRpb24pID0+IHtcclxuICAgIGNvbnN0IGluZGV4TGlzdCA9IGZpbmRBbGxDb29yZGluYXRlc0luZGV4KGNvb3JkaW5hdGVzLCBvYmosIG9yaWVudGF0aW9uKTtcclxuICAgIHJldHVybiBpbmRleExpc3QubWFwKChpbmRleCkgPT4gYm9hcmRbaW5kZXhdLmNvb3JkaW5hdGVzKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBjaGVja0FsbFNxdWFyZSA9IChjb29yZGluYXRlc0xpc3QsIGtleSkgPT5cclxuICAgIGNvb3JkaW5hdGVzTGlzdC5ldmVyeSgoY29vcmRpbmF0ZXMpID0+ICEoa2V5IGluIGJvYXJkW2Nvb3JkaW5hdGVzXSkpO1xyXG5cclxuICBjb25zdCBhZGRTaGlwVG9BcnIgPSAoc2hpcCwgb3JpZW50YXRpb24sIGNvb3JkaW5hdGVzKSA9PiB7XHJcbiAgICBzaGlwcy5wdXNoKHsgc2hpcCwgb3JpZW50YXRpb24sIGNvb3JkaW5hdGVzIH0pO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IHBsYWNlU2hpcE9uQm9hcmQgPSAoY29vcmRpbmF0ZXNMaXN0LCBvYmosIG9yaWVudGF0aW9uLCBjb29yZGluYXRlcykgPT4ge1xyXG4gICAgaWYgKGNoZWNrQWxsU3F1YXJlKGNvb3JkaW5hdGVzTGlzdCwgXCJzaGlwXCIpKSB7XHJcbiAgICAgIGFkZFNoaXBUb0FycihvYmosIG9yaWVudGF0aW9uLCBjb29yZGluYXRlcyk7XHJcbiAgICAgIGNvb3JkaW5hdGVzTGlzdC5mb3JFYWNoKChpbmRleCkgPT4ge1xyXG4gICAgICAgIGJvYXJkW2luZGV4XS5zaGlwID0gb2JqO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjb25zdCBwbGFjZVNoaXAgPSAoY29vcmRpbmF0ZXMsIG9iaiwgb3JpZW50YXRpb24pID0+IHtcclxuICAgIGNvbnN0IGVuZFBvaW50ID0gZ2V0RW5kUG9pbnQoY29vcmRpbmF0ZXMsIG9iaiwgb3JpZW50YXRpb24pO1xyXG5cclxuICAgIGlmIChpc0VuZFBvaW50VmFsaWQoZW5kUG9pbnQpKSB7XHJcbiAgICAgIGNvbnN0IGNvb3JkaW5hdGVzTGlzdCA9IGZpbmRBbGxDb29yZGluYXRlc0luZGV4KFxyXG4gICAgICAgIGNvb3JkaW5hdGVzLFxyXG4gICAgICAgIG9iaixcclxuICAgICAgICBvcmllbnRhdGlvbixcclxuICAgICAgKTtcclxuICAgICAgcGxhY2VTaGlwT25Cb2FyZChjb29yZGluYXRlc0xpc3QsIG9iaiwgb3JpZW50YXRpb24sIGNvb3JkaW5hdGVzKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjb25zdCByZWNlaXZlQXR0YWNrID0gKGNvb3JkaW5hdGVzKSA9PiB7XHJcbiAgICBjb25zdCBjdXJyZW50U3F1YXJlID0gZ2V0Q29vcmRpbmF0ZXMoY29vcmRpbmF0ZXMpO1xyXG4gICAgaWYgKGN1cnJlbnRTcXVhcmUuc3RhdHVzICE9PSBcInRhcmdldGVkXCIpIHtcclxuICAgICAgaWYgKFwic2hpcFwiIGluIGN1cnJlbnRTcXVhcmUpIHtcclxuICAgICAgICBjdXJyZW50U3F1YXJlLnNoaXAuaGl0KCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGN1cnJlbnRTcXVhcmUuc3RhdHVzID0gXCJ0YXJnZXRlZFwiO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IGhhdmVBbGxTaGlwc1N1bmsgPSAoKSA9PiBzaGlwcy5ldmVyeSgob2JqKSA9PiBvYmouc2hpcC5pc1N1bmsoKSk7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBnZXQgYm9hcmQoKSB7XHJcbiAgICAgIHJldHVybiBib2FyZDtcclxuICAgIH0sXHJcbiAgICBnZXQgc2hpcHMoKSB7XHJcbiAgICAgIHJldHVybiBzaGlwcztcclxuICAgIH0sXHJcbiAgICBwbGFjZVNoaXAsXHJcbiAgICBnZXRDb29yZGluYXRlcyxcclxuICAgIGdldENvb3JkaW5hdGVzSW5kZXgsXHJcbiAgICBnZXRFbmRQb2ludCxcclxuICAgIGZpbmRBbGxDb29yZGluYXRlc0luZGV4LFxyXG4gICAgZ2V0QWxsQ29vcmRpbmF0ZXNMaXN0QnlJbmRleCxcclxuICAgIHJlY2VpdmVBdHRhY2ssXHJcbiAgICBoYXZlQWxsU2hpcHNTdW5rLFxyXG4gIH07XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBHYW1lYm9hcmQ7XHJcbiIsImNvbnN0IHJhbmRvbUluZGV4ID0gKGxlbmd0aCkgPT4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbGVuZ3RoKTtcclxuXHJcbmNvbnN0IHJhbmRvbU9yaWVudGF0aW9uID0gKCkgPT4ge1xyXG4gIGNvbnN0IG9yaWVudGF0aW9uTGlzdCA9IFtcInJvd1wiLCBcImNvbHVtblwiXTtcclxuICBjb25zdCBpbmRleCA9IHJhbmRvbUluZGV4KG9yaWVudGF0aW9uTGlzdC5sZW5ndGgpO1xyXG4gIHJldHVybiBvcmllbnRhdGlvbkxpc3RbaW5kZXhdO1xyXG59O1xyXG5cclxuY29uc3QgaXNTcXVhcmVPblRoZVNhbWVSb3cgPSAoc3F1YXJlMSwgc3F1YXJlMikgPT4gc3F1YXJlMVswXSA9PT0gc3F1YXJlMlswXTtcclxuY29uc3QgaXNJbmRleFZhbGlkID0gKGluZGV4KSA9PiBpbmRleCA+PSAwICYmIGluZGV4IDwgMTAwO1xyXG5cclxuY29uc3QgdmFsaWRhdGVTcXVhcmVzUm93ID0gKGluZGV4MSwgaW5kZXgyLCBib2FyZCkgPT4ge1xyXG4gIGlmIChpc0luZGV4VmFsaWQoaW5kZXgxKSAmJiBpc0luZGV4VmFsaWQoaW5kZXgyKSkge1xyXG4gICAgcmV0dXJuIGlzU3F1YXJlT25UaGVTYW1lUm93KFxyXG4gICAgICBib2FyZFtpbmRleDFdLmNvb3JkaW5hdGVzLFxyXG4gICAgICBib2FyZFtpbmRleDJdLmNvb3JkaW5hdGVzLFxyXG4gICAgKVxyXG4gICAgICA/IGluZGV4MVxyXG4gICAgICA6IC0xO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIC0xO1xyXG59O1xyXG5cclxuY29uc3QgZ2V0QWRqZWNlbnRMaXN0ID0gKGNvb3JkaW5hdGVzSW5kZXhMaXN0LCBib2FyZCkgPT4ge1xyXG4gIGNvbnN0IGxpc3QgPSBbXTtcclxuICBjb29yZGluYXRlc0luZGV4TGlzdC5mb3JFYWNoKChpbmRleCkgPT4ge1xyXG4gICAgbGlzdC5wdXNoKHZhbGlkYXRlU3F1YXJlc1JvdyhpbmRleCAtIDExLCBpbmRleCAtIDEwLCBib2FyZCkpO1xyXG4gICAgbGlzdC5wdXNoKGluZGV4IC0gMTApO1xyXG4gICAgbGlzdC5wdXNoKHZhbGlkYXRlU3F1YXJlc1JvdyhpbmRleCAtIDksIGluZGV4IC0gMTAsIGJvYXJkKSk7XHJcbiAgICBsaXN0LnB1c2godmFsaWRhdGVTcXVhcmVzUm93KGluZGV4IC0gMSwgaW5kZXgsIGJvYXJkKSk7XHJcbiAgICBsaXN0LnB1c2godmFsaWRhdGVTcXVhcmVzUm93KGluZGV4ICsgMSwgaW5kZXgsIGJvYXJkKSk7XHJcbiAgICBsaXN0LnB1c2godmFsaWRhdGVTcXVhcmVzUm93KGluZGV4ICsgOSwgaW5kZXggKyAxMCwgYm9hcmQpKTtcclxuICAgIGxpc3QucHVzaChpbmRleCArIDEwKTtcclxuICAgIGxpc3QucHVzaCh2YWxpZGF0ZVNxdWFyZXNSb3coaW5kZXggKyAxMSwgaW5kZXggKyAxMCwgYm9hcmQpKTtcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIEFycmF5LmZyb20oXHJcbiAgICBuZXcgU2V0KFxyXG4gICAgICBsaXN0LmZpbHRlcigoaXRlbSkgPT4gaXRlbSA+PSAwICYmIGl0ZW0gPCAxMDApLnNvcnQoKGEsIGIpID0+IGEgLSBiKSxcclxuICAgICksXHJcbiAgKTtcclxufTtcclxuXHJcbmNvbnN0IGNoZWNrUGxhY2VtZW50VmFsaWRpdHkgPSAoXHJcbiAgcGxhY2VtZW50SW5kZXgsXHJcbiAgY29vcmRpbmF0ZXNJbmRleExpc3QsXHJcbiAgYm9hcmQsXHJcbikgPT4ge1xyXG4gIGNvbnN0IHNoaXBQbGFjZW1lbnRWYWxpZGl0eSA9IHBsYWNlbWVudEluZGV4LmV2ZXJ5KFxyXG4gICAgKGluZGV4KSA9PiAhKFwic2hpcFwiIGluIGJvYXJkW2luZGV4XSksXHJcbiAgKTtcclxuXHJcbiAgY29uc3QgYWRqZWNlbnRMaXN0VmFsaWRpdHkgPSBjb29yZGluYXRlc0luZGV4TGlzdC5ldmVyeShcclxuICAgIChpbmRleCkgPT4gIShcInNoaXBcIiBpbiBib2FyZFtpbmRleF0pLFxyXG4gICk7XHJcblxyXG4gIHJldHVybiBzaGlwUGxhY2VtZW50VmFsaWRpdHkgJiYgYWRqZWNlbnRMaXN0VmFsaWRpdHk7XHJcbn07XHJcblxyXG5jb25zdCBpc1BsYWNlbWVudFZhbGlkID0gKHBsYWNlbWVudEluZGV4LCBjb29yZGluYXRlc0luZGV4TGlzdCwgYm9hcmQpID0+IHtcclxuICBjb25zdCBwbGFjZW1lbnRJbmRleFZhbGlkaXR5ID0gcGxhY2VtZW50SW5kZXguZXZlcnkoXHJcbiAgICAoaW5kZXgpID0+IGluZGV4ID49IDAgJiYgaW5kZXggPCAxMDAsXHJcbiAgKTtcclxuXHJcbiAgaWYgKHBsYWNlbWVudEluZGV4VmFsaWRpdHkpIHtcclxuICAgIHJldHVybiBjaGVja1BsYWNlbWVudFZhbGlkaXR5KHBsYWNlbWVudEluZGV4LCBjb29yZGluYXRlc0luZGV4TGlzdCwgYm9hcmQpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxuZXhwb3J0IHtcclxuICByYW5kb21JbmRleCxcclxuICByYW5kb21PcmllbnRhdGlvbixcclxuICBnZXRBZGplY2VudExpc3QsXHJcbiAgaXNTcXVhcmVPblRoZVNhbWVSb3csXHJcbiAgdmFsaWRhdGVTcXVhcmVzUm93LFxyXG4gIGlzUGxhY2VtZW50VmFsaWQsXHJcbn07XHJcbiIsImNvbnN0IFBsYXllciA9IChuYW1lKSA9PiB7XHJcbiAgY29uc3QgYXR0YWNrID0gKGNvb3JkaW5hdGVzLCB0YXJnZXQsIGZuKSA9PiB7XHJcbiAgICB0YXJnZXRbZm5dKGNvb3JkaW5hdGVzKTtcclxuICB9O1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgZ2V0IG5hbWUoKSB7XHJcbiAgICAgIHJldHVybiBuYW1lO1xyXG4gICAgfSxcclxuICAgIGF0dGFjayxcclxuICB9O1xyXG59O1xyXG5cclxuY29uc3QgQUlQbGF5ZXIgPSAobmFtZSkgPT4ge1xyXG4gIGNvbnN0IGZpbmRDb29yZGluYXRlc0luZGV4ID0gKGNvb3JkaW5hdGVzLCBib2FyZCkgPT5cclxuICAgIGJvYXJkLmZpbmRJbmRleChcclxuICAgICAgKHNxdWFyZSkgPT5cclxuICAgICAgICBzcXVhcmUuY29vcmRpbmF0ZXNbMF0gPT09IGNvb3JkaW5hdGVzWzBdICYmXHJcbiAgICAgICAgc3F1YXJlLmNvb3JkaW5hdGVzWzFdID09PSBjb29yZGluYXRlc1sxXSxcclxuICAgICk7XHJcblxyXG4gIGNvbnN0IHJhbmRvbUluZGV4ID0gKGxlbmd0aCkgPT4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbGVuZ3RoKTtcclxuXHJcbiAgY29uc3QgZmlsdGVyQm9hcmQgPSAoYm9hcmQpID0+XHJcbiAgICBib2FyZC5maWx0ZXIoKHNxdWFyZSkgPT4gc3F1YXJlLnN0YXR1cyA9PT0gXCJmcmVlXCIpO1xyXG5cclxuICBjb25zdCByYW5kb21Nb3ZlID0gKGJvYXJkKSA9PiB7XHJcbiAgICBjb25zdCBhY3RpdmVTcXVhcmVzID0gZmlsdGVyQm9hcmQoYm9hcmQpO1xyXG4gICAgY29uc3QgeyBjb29yZGluYXRlcyB9ID0gYWN0aXZlU3F1YXJlc1tyYW5kb21JbmRleChhY3RpdmVTcXVhcmVzLmxlbmd0aCldO1xyXG4gICAgcmV0dXJuIGZpbmRDb29yZGluYXRlc0luZGV4KGNvb3JkaW5hdGVzLCBib2FyZCk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgeyBhdHRhY2sgfSA9IFBsYXllcihuYW1lKTtcclxuICByZXR1cm4ge1xyXG4gICAgZ2V0IG5hbWUoKSB7XHJcbiAgICAgIHJldHVybiBuYW1lO1xyXG4gICAgfSxcclxuICAgIGF0dGFjayxcclxuICAgIHJhbmRvbU1vdmUsXHJcbiAgICByYW5kb21JbmRleCxcclxuICAgIGZpbHRlckJvYXJkLFxyXG4gICAgZmluZENvb3JkaW5hdGVzSW5kZXgsXHJcbiAgfTtcclxufTtcclxuXHJcbmV4cG9ydCB7IFBsYXllciwgQUlQbGF5ZXIgfTtcclxuIiwiY29uc3QgU2hpcCA9IChsZW5ndGggPSAxKSA9PiB7XHJcbiAgbGV0IG51bWJlck9mSGl0cyA9IDA7XHJcblxyXG4gIGNvbnN0IGhpdCA9ICgpID0+IHtcclxuICAgIGlmIChudW1iZXJPZkhpdHMgPCBsZW5ndGgpIHtcclxuICAgICAgbnVtYmVyT2ZIaXRzICs9IDE7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgaXNTdW5rID0gKCkgPT4gbGVuZ3RoID09PSBudW1iZXJPZkhpdHM7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBnZXQgbnVtYmVyT2ZIaXRzKCkge1xyXG4gICAgICByZXR1cm4gbnVtYmVyT2ZIaXRzO1xyXG4gICAgfSxcclxuICAgIGdldCBsZW5ndGgoKSB7XHJcbiAgICAgIHJldHVybiBsZW5ndGg7XHJcbiAgICB9LFxyXG4gICAgaGl0LFxyXG4gICAgaXNTdW5rLFxyXG4gIH07XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTaGlwO1xyXG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYC8qISBub3JtYWxpemUuY3NzIHY4LjAuMSB8IE1JVCBMaWNlbnNlIHwgZ2l0aHViLmNvbS9uZWNvbGFzL25vcm1hbGl6ZS5jc3MgKi9cblxuLyogRG9jdW1lbnRcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgbGluZSBoZWlnaHQgaW4gYWxsIGJyb3dzZXJzLlxuICogMi4gUHJldmVudCBhZGp1c3RtZW50cyBvZiBmb250IHNpemUgYWZ0ZXIgb3JpZW50YXRpb24gY2hhbmdlcyBpbiBpT1MuXG4gKi9cblxuaHRtbCB7XG4gIGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXG4gIC13ZWJraXQtdGV4dC1zaXplLWFkanVzdDogMTAwJTsgLyogMiAqL1xufVxuXG4vKiBTZWN0aW9uc1xuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuYm9keSB7XG4gIG1hcmdpbjogMDtcbn1cblxuLyoqXG4gKiBSZW5kZXIgdGhlIFxcYG1haW5cXGAgZWxlbWVudCBjb25zaXN0ZW50bHkgaW4gSUUuXG4gKi9cblxubWFpbiB7XG4gIGRpc3BsYXk6IGJsb2NrO1xufVxuXG4vKipcbiAqIENvcnJlY3QgdGhlIGZvbnQgc2l6ZSBhbmQgbWFyZ2luIG9uIFxcYGgxXFxgIGVsZW1lbnRzIHdpdGhpbiBcXGBzZWN0aW9uXFxgIGFuZFxuICogXFxgYXJ0aWNsZVxcYCBjb250ZXh0cyBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBTYWZhcmkuXG4gKi9cblxuaDEge1xuICBmb250LXNpemU6IDJlbTtcbiAgbWFyZ2luOiAwLjY3ZW0gMDtcbn1cblxuLyogR3JvdXBpbmcgY29udGVudFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBGaXJlZm94LlxuICogMi4gU2hvdyB0aGUgb3ZlcmZsb3cgaW4gRWRnZSBhbmQgSUUuXG4gKi9cblxuaHIge1xuICBib3gtc2l6aW5nOiBjb250ZW50LWJveDsgLyogMSAqL1xuICBoZWlnaHQ6IDA7IC8qIDEgKi9cbiAgb3ZlcmZsb3c6IHZpc2libGU7IC8qIDIgKi9cbn1cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxuICogMi4gQ29ycmVjdCB0aGUgb2RkIFxcYGVtXFxgIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG5wcmUge1xuICBmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7IC8qIDEgKi9cbiAgZm9udC1zaXplOiAxZW07IC8qIDIgKi9cbn1cblxuLyogVGV4dC1sZXZlbCBzZW1hbnRpY3NcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogUmVtb3ZlIHRoZSBncmF5IGJhY2tncm91bmQgb24gYWN0aXZlIGxpbmtzIGluIElFIDEwLlxuICovXG5cbmEge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbn1cblxuLyoqXG4gKiAxLiBSZW1vdmUgdGhlIGJvdHRvbSBib3JkZXIgaW4gQ2hyb21lIDU3LVxuICogMi4gQWRkIHRoZSBjb3JyZWN0IHRleHQgZGVjb3JhdGlvbiBpbiBDaHJvbWUsIEVkZ2UsIElFLCBPcGVyYSwgYW5kIFNhZmFyaS5cbiAqL1xuXG5hYmJyW3RpdGxlXSB7XG4gIGJvcmRlci1ib3R0b206IG5vbmU7IC8qIDEgKi9cbiAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7IC8qIDIgKi9cbiAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmUgZG90dGVkOyAvKiAyICovXG59XG5cbi8qKlxuICogQWRkIHRoZSBjb3JyZWN0IGZvbnQgd2VpZ2h0IGluIENocm9tZSwgRWRnZSwgYW5kIFNhZmFyaS5cbiAqL1xuXG5iLFxuc3Ryb25nIHtcbiAgZm9udC13ZWlnaHQ6IGJvbGRlcjtcbn1cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxuICogMi4gQ29ycmVjdCB0aGUgb2RkIFxcYGVtXFxgIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG5jb2RlLFxua2JkLFxuc2FtcCB7XG4gIGZvbnQtZmFtaWx5OiBtb25vc3BhY2UsIG1vbm9zcGFjZTsgLyogMSAqL1xuICBmb250LXNpemU6IDFlbTsgLyogMiAqL1xufVxuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxuICovXG5cbnNtYWxsIHtcbiAgZm9udC1zaXplOiA4MCU7XG59XG5cbi8qKlxuICogUHJldmVudCBcXGBzdWJcXGAgYW5kIFxcYHN1cFxcYCBlbGVtZW50cyBmcm9tIGFmZmVjdGluZyB0aGUgbGluZSBoZWlnaHQgaW5cbiAqIGFsbCBicm93c2Vycy5cbiAqL1xuXG5zdWIsXG5zdXAge1xuICBmb250LXNpemU6IDc1JTtcbiAgbGluZS1oZWlnaHQ6IDA7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xufVxuXG5zdWIge1xuICBib3R0b206IC0wLjI1ZW07XG59XG5cbnN1cCB7XG4gIHRvcDogLTAuNWVtO1xufVxuXG4vKiBFbWJlZGRlZCBjb250ZW50XG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgYm9yZGVyIG9uIGltYWdlcyBpbnNpZGUgbGlua3MgaW4gSUUgMTAuXG4gKi9cblxuaW1nIHtcbiAgYm9yZGVyLXN0eWxlOiBub25lO1xufVxuXG4vKiBGb3Jtc1xuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiAxLiBDaGFuZ2UgdGhlIGZvbnQgc3R5bGVzIGluIGFsbCBicm93c2Vycy5cbiAqIDIuIFJlbW92ZSB0aGUgbWFyZ2luIGluIEZpcmVmb3ggYW5kIFNhZmFyaS5cbiAqL1xuXG5idXR0b24sXG5pbnB1dCxcbm9wdGdyb3VwLFxuc2VsZWN0LFxudGV4dGFyZWEge1xuICBmb250LWZhbWlseTogaW5oZXJpdDsgLyogMSAqL1xuICBmb250LXNpemU6IDEwMCU7IC8qIDEgKi9cbiAgbGluZS1oZWlnaHQ6IDEuMTU7IC8qIDEgKi9cbiAgbWFyZ2luOiAwOyAvKiAyICovXG59XG5cbi8qKlxuICogU2hvdyB0aGUgb3ZlcmZsb3cgaW4gSUUuXG4gKiAxLiBTaG93IHRoZSBvdmVyZmxvdyBpbiBFZGdlLlxuICovXG5cbmJ1dHRvbixcbmlucHV0IHsgLyogMSAqL1xuICBvdmVyZmxvdzogdmlzaWJsZTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEVkZ2UsIEZpcmVmb3gsIGFuZCBJRS5cbiAqIDEuIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRmlyZWZveC5cbiAqL1xuXG5idXR0b24sXG5zZWxlY3QgeyAvKiAxICovXG4gIHRleHQtdHJhbnNmb3JtOiBub25lO1xufVxuXG4vKipcbiAqIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXG4gKi9cblxuYnV0dG9uLFxuW3R5cGU9XCJidXR0b25cIl0sXG5bdHlwZT1cInJlc2V0XCJdLFxuW3R5cGU9XCJzdWJtaXRcIl0ge1xuICAtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGlubmVyIGJvcmRlciBhbmQgcGFkZGluZyBpbiBGaXJlZm94LlxuICovXG5cbmJ1dHRvbjo6LW1vei1mb2N1cy1pbm5lcixcblt0eXBlPVwiYnV0dG9uXCJdOjotbW96LWZvY3VzLWlubmVyLFxuW3R5cGU9XCJyZXNldFwiXTo6LW1vei1mb2N1cy1pbm5lcixcblt0eXBlPVwic3VibWl0XCJdOjotbW96LWZvY3VzLWlubmVyIHtcbiAgYm9yZGVyLXN0eWxlOiBub25lO1xuICBwYWRkaW5nOiAwO1xufVxuXG4vKipcbiAqIFJlc3RvcmUgdGhlIGZvY3VzIHN0eWxlcyB1bnNldCBieSB0aGUgcHJldmlvdXMgcnVsZS5cbiAqL1xuXG5idXR0b246LW1vei1mb2N1c3JpbmcsXG5bdHlwZT1cImJ1dHRvblwiXTotbW96LWZvY3VzcmluZyxcblt0eXBlPVwicmVzZXRcIl06LW1vei1mb2N1c3JpbmcsXG5bdHlwZT1cInN1Ym1pdFwiXTotbW96LWZvY3VzcmluZyB7XG4gIG91dGxpbmU6IDFweCBkb3R0ZWQgQnV0dG9uVGV4dDtcbn1cblxuLyoqXG4gKiBDb3JyZWN0IHRoZSBwYWRkaW5nIGluIEZpcmVmb3guXG4gKi9cblxuZmllbGRzZXQge1xuICBwYWRkaW5nOiAwLjM1ZW0gMC43NWVtIDAuNjI1ZW07XG59XG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgdGV4dCB3cmFwcGluZyBpbiBFZGdlIGFuZCBJRS5cbiAqIDIuIENvcnJlY3QgdGhlIGNvbG9yIGluaGVyaXRhbmNlIGZyb20gXFxgZmllbGRzZXRcXGAgZWxlbWVudHMgaW4gSUUuXG4gKiAzLiBSZW1vdmUgdGhlIHBhZGRpbmcgc28gZGV2ZWxvcGVycyBhcmUgbm90IGNhdWdodCBvdXQgd2hlbiB0aGV5IHplcm8gb3V0XG4gKiAgICBcXGBmaWVsZHNldFxcYCBlbGVtZW50cyBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxubGVnZW5kIHtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDsgLyogMSAqL1xuICBjb2xvcjogaW5oZXJpdDsgLyogMiAqL1xuICBkaXNwbGF5OiB0YWJsZTsgLyogMSAqL1xuICBtYXgtd2lkdGg6IDEwMCU7IC8qIDEgKi9cbiAgcGFkZGluZzogMDsgLyogMyAqL1xuICB3aGl0ZS1zcGFjZTogbm9ybWFsOyAvKiAxICovXG59XG5cbi8qKlxuICogQWRkIHRoZSBjb3JyZWN0IHZlcnRpY2FsIGFsaWdubWVudCBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBPcGVyYS5cbiAqL1xuXG5wcm9ncmVzcyB7XG4gIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGRlZmF1bHQgdmVydGljYWwgc2Nyb2xsYmFyIGluIElFIDEwKy5cbiAqL1xuXG50ZXh0YXJlYSB7XG4gIG92ZXJmbG93OiBhdXRvO1xufVxuXG4vKipcbiAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIElFIDEwLlxuICogMi4gUmVtb3ZlIHRoZSBwYWRkaW5nIGluIElFIDEwLlxuICovXG5cblt0eXBlPVwiY2hlY2tib3hcIl0sXG5bdHlwZT1cInJhZGlvXCJdIHtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDsgLyogMSAqL1xuICBwYWRkaW5nOiAwOyAvKiAyICovXG59XG5cbi8qKlxuICogQ29ycmVjdCB0aGUgY3Vyc29yIHN0eWxlIG9mIGluY3JlbWVudCBhbmQgZGVjcmVtZW50IGJ1dHRvbnMgaW4gQ2hyb21lLlxuICovXG5cblt0eXBlPVwibnVtYmVyXCJdOjotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uLFxuW3R5cGU9XCJudW1iZXJcIl06Oi13ZWJraXQtb3V0ZXItc3Bpbi1idXR0b24ge1xuICBoZWlnaHQ6IGF1dG87XG59XG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgb2RkIGFwcGVhcmFuY2UgaW4gQ2hyb21lIGFuZCBTYWZhcmkuXG4gKiAyLiBDb3JyZWN0IHRoZSBvdXRsaW5lIHN0eWxlIGluIFNhZmFyaS5cbiAqL1xuXG5bdHlwZT1cInNlYXJjaFwiXSB7XG4gIC13ZWJraXQtYXBwZWFyYW5jZTogdGV4dGZpZWxkOyAvKiAxICovXG4gIG91dGxpbmUtb2Zmc2V0OiAtMnB4OyAvKiAyICovXG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBpbm5lciBwYWRkaW5nIGluIENocm9tZSBhbmQgU2FmYXJpIG9uIG1hY09TLlxuICovXG5cblt0eXBlPVwic2VhcmNoXCJdOjotd2Via2l0LXNlYXJjaC1kZWNvcmF0aW9uIHtcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xufVxuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXG4gKiAyLiBDaGFuZ2UgZm9udCBwcm9wZXJ0aWVzIHRvIFxcYGluaGVyaXRcXGAgaW4gU2FmYXJpLlxuICovXG5cbjo6LXdlYmtpdC1maWxlLXVwbG9hZC1idXR0b24ge1xuICAtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjsgLyogMSAqL1xuICBmb250OiBpbmhlcml0OyAvKiAyICovXG59XG5cbi8qIEludGVyYWN0aXZlXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKlxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gRWRnZSwgSUUgMTArLCBhbmQgRmlyZWZveC5cbiAqL1xuXG5kZXRhaWxzIHtcbiAgZGlzcGxheTogYmxvY2s7XG59XG5cbi8qXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuc3VtbWFyeSB7XG4gIGRpc3BsYXk6IGxpc3QtaXRlbTtcbn1cblxuLyogTWlzY1xuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSAxMCsuXG4gKi9cblxudGVtcGxhdGUge1xuICBkaXNwbGF5OiBub25lO1xufVxuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwLlxuICovXG5cbltoaWRkZW5dIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cbmAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vbm9kZV9tb2R1bGVzL25vcm1hbGl6ZS5jc3Mvbm9ybWFsaXplLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQSwyRUFBMkU7O0FBRTNFOytFQUMrRTs7QUFFL0U7OztFQUdFOztBQUVGO0VBQ0UsaUJBQWlCLEVBQUUsTUFBTTtFQUN6Qiw4QkFBOEIsRUFBRSxNQUFNO0FBQ3hDOztBQUVBOytFQUMrRTs7QUFFL0U7O0VBRUU7O0FBRUY7RUFDRSxTQUFTO0FBQ1g7O0FBRUE7O0VBRUU7O0FBRUY7RUFDRSxjQUFjO0FBQ2hCOztBQUVBOzs7RUFHRTs7QUFFRjtFQUNFLGNBQWM7RUFDZCxnQkFBZ0I7QUFDbEI7O0FBRUE7K0VBQytFOztBQUUvRTs7O0VBR0U7O0FBRUY7RUFDRSx1QkFBdUIsRUFBRSxNQUFNO0VBQy9CLFNBQVMsRUFBRSxNQUFNO0VBQ2pCLGlCQUFpQixFQUFFLE1BQU07QUFDM0I7O0FBRUE7OztFQUdFOztBQUVGO0VBQ0UsaUNBQWlDLEVBQUUsTUFBTTtFQUN6QyxjQUFjLEVBQUUsTUFBTTtBQUN4Qjs7QUFFQTsrRUFDK0U7O0FBRS9FOztFQUVFOztBQUVGO0VBQ0UsNkJBQTZCO0FBQy9COztBQUVBOzs7RUFHRTs7QUFFRjtFQUNFLG1CQUFtQixFQUFFLE1BQU07RUFDM0IsMEJBQTBCLEVBQUUsTUFBTTtFQUNsQyxpQ0FBaUMsRUFBRSxNQUFNO0FBQzNDOztBQUVBOztFQUVFOztBQUVGOztFQUVFLG1CQUFtQjtBQUNyQjs7QUFFQTs7O0VBR0U7O0FBRUY7OztFQUdFLGlDQUFpQyxFQUFFLE1BQU07RUFDekMsY0FBYyxFQUFFLE1BQU07QUFDeEI7O0FBRUE7O0VBRUU7O0FBRUY7RUFDRSxjQUFjO0FBQ2hCOztBQUVBOzs7RUFHRTs7QUFFRjs7RUFFRSxjQUFjO0VBQ2QsY0FBYztFQUNkLGtCQUFrQjtFQUNsQix3QkFBd0I7QUFDMUI7O0FBRUE7RUFDRSxlQUFlO0FBQ2pCOztBQUVBO0VBQ0UsV0FBVztBQUNiOztBQUVBOytFQUMrRTs7QUFFL0U7O0VBRUU7O0FBRUY7RUFDRSxrQkFBa0I7QUFDcEI7O0FBRUE7K0VBQytFOztBQUUvRTs7O0VBR0U7O0FBRUY7Ozs7O0VBS0Usb0JBQW9CLEVBQUUsTUFBTTtFQUM1QixlQUFlLEVBQUUsTUFBTTtFQUN2QixpQkFBaUIsRUFBRSxNQUFNO0VBQ3pCLFNBQVMsRUFBRSxNQUFNO0FBQ25COztBQUVBOzs7RUFHRTs7QUFFRjtRQUNRLE1BQU07RUFDWixpQkFBaUI7QUFDbkI7O0FBRUE7OztFQUdFOztBQUVGO1NBQ1MsTUFBTTtFQUNiLG9CQUFvQjtBQUN0Qjs7QUFFQTs7RUFFRTs7QUFFRjs7OztFQUlFLDBCQUEwQjtBQUM1Qjs7QUFFQTs7RUFFRTs7QUFFRjs7OztFQUlFLGtCQUFrQjtFQUNsQixVQUFVO0FBQ1o7O0FBRUE7O0VBRUU7O0FBRUY7Ozs7RUFJRSw4QkFBOEI7QUFDaEM7O0FBRUE7O0VBRUU7O0FBRUY7RUFDRSw4QkFBOEI7QUFDaEM7O0FBRUE7Ozs7O0VBS0U7O0FBRUY7RUFDRSxzQkFBc0IsRUFBRSxNQUFNO0VBQzlCLGNBQWMsRUFBRSxNQUFNO0VBQ3RCLGNBQWMsRUFBRSxNQUFNO0VBQ3RCLGVBQWUsRUFBRSxNQUFNO0VBQ3ZCLFVBQVUsRUFBRSxNQUFNO0VBQ2xCLG1CQUFtQixFQUFFLE1BQU07QUFDN0I7O0FBRUE7O0VBRUU7O0FBRUY7RUFDRSx3QkFBd0I7QUFDMUI7O0FBRUE7O0VBRUU7O0FBRUY7RUFDRSxjQUFjO0FBQ2hCOztBQUVBOzs7RUFHRTs7QUFFRjs7RUFFRSxzQkFBc0IsRUFBRSxNQUFNO0VBQzlCLFVBQVUsRUFBRSxNQUFNO0FBQ3BCOztBQUVBOztFQUVFOztBQUVGOztFQUVFLFlBQVk7QUFDZDs7QUFFQTs7O0VBR0U7O0FBRUY7RUFDRSw2QkFBNkIsRUFBRSxNQUFNO0VBQ3JDLG9CQUFvQixFQUFFLE1BQU07QUFDOUI7O0FBRUE7O0VBRUU7O0FBRUY7RUFDRSx3QkFBd0I7QUFDMUI7O0FBRUE7OztFQUdFOztBQUVGO0VBQ0UsMEJBQTBCLEVBQUUsTUFBTTtFQUNsQyxhQUFhLEVBQUUsTUFBTTtBQUN2Qjs7QUFFQTsrRUFDK0U7O0FBRS9FOztFQUVFOztBQUVGO0VBQ0UsY0FBYztBQUNoQjs7QUFFQTs7RUFFRTs7QUFFRjtFQUNFLGtCQUFrQjtBQUNwQjs7QUFFQTsrRUFDK0U7O0FBRS9FOztFQUVFOztBQUVGO0VBQ0UsYUFBYTtBQUNmOztBQUVBOztFQUVFOztBQUVGO0VBQ0UsYUFBYTtBQUNmXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi8qISBub3JtYWxpemUuY3NzIHY4LjAuMSB8IE1JVCBMaWNlbnNlIHwgZ2l0aHViLmNvbS9uZWNvbGFzL25vcm1hbGl6ZS5jc3MgKi9cXG5cXG4vKiBEb2N1bWVudFxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgbGluZSBoZWlnaHQgaW4gYWxsIGJyb3dzZXJzLlxcbiAqIDIuIFByZXZlbnQgYWRqdXN0bWVudHMgb2YgZm9udCBzaXplIGFmdGVyIG9yaWVudGF0aW9uIGNoYW5nZXMgaW4gaU9TLlxcbiAqL1xcblxcbmh0bWwge1xcbiAgbGluZS1oZWlnaHQ6IDEuMTU7IC8qIDEgKi9cXG4gIC13ZWJraXQtdGV4dC1zaXplLWFkanVzdDogMTAwJTsgLyogMiAqL1xcbn1cXG5cXG4vKiBTZWN0aW9uc1xcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBtYXJnaW4gaW4gYWxsIGJyb3dzZXJzLlxcbiAqL1xcblxcbmJvZHkge1xcbiAgbWFyZ2luOiAwO1xcbn1cXG5cXG4vKipcXG4gKiBSZW5kZXIgdGhlIGBtYWluYCBlbGVtZW50IGNvbnNpc3RlbnRseSBpbiBJRS5cXG4gKi9cXG5cXG5tYWluIHtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbn1cXG5cXG4vKipcXG4gKiBDb3JyZWN0IHRoZSBmb250IHNpemUgYW5kIG1hcmdpbiBvbiBgaDFgIGVsZW1lbnRzIHdpdGhpbiBgc2VjdGlvbmAgYW5kXFxuICogYGFydGljbGVgIGNvbnRleHRzIGluIENocm9tZSwgRmlyZWZveCwgYW5kIFNhZmFyaS5cXG4gKi9cXG5cXG5oMSB7XFxuICBmb250LXNpemU6IDJlbTtcXG4gIG1hcmdpbjogMC42N2VtIDA7XFxufVxcblxcbi8qIEdyb3VwaW5nIGNvbnRlbnRcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIEZpcmVmb3guXFxuICogMi4gU2hvdyB0aGUgb3ZlcmZsb3cgaW4gRWRnZSBhbmQgSUUuXFxuICovXFxuXFxuaHIge1xcbiAgYm94LXNpemluZzogY29udGVudC1ib3g7IC8qIDEgKi9cXG4gIGhlaWdodDogMDsgLyogMSAqL1xcbiAgb3ZlcmZsb3c6IHZpc2libGU7IC8qIDIgKi9cXG59XFxuXFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cXG4gKiAyLiBDb3JyZWN0IHRoZSBvZGQgYGVtYCBmb250IHNpemluZyBpbiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxucHJlIHtcXG4gIGZvbnQtZmFtaWx5OiBtb25vc3BhY2UsIG1vbm9zcGFjZTsgLyogMSAqL1xcbiAgZm9udC1zaXplOiAxZW07IC8qIDIgKi9cXG59XFxuXFxuLyogVGV4dC1sZXZlbCBzZW1hbnRpY3NcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIFJlbW92ZSB0aGUgZ3JheSBiYWNrZ3JvdW5kIG9uIGFjdGl2ZSBsaW5rcyBpbiBJRSAxMC5cXG4gKi9cXG5cXG5hIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbn1cXG5cXG4vKipcXG4gKiAxLiBSZW1vdmUgdGhlIGJvdHRvbSBib3JkZXIgaW4gQ2hyb21lIDU3LVxcbiAqIDIuIEFkZCB0aGUgY29ycmVjdCB0ZXh0IGRlY29yYXRpb24gaW4gQ2hyb21lLCBFZGdlLCBJRSwgT3BlcmEsIGFuZCBTYWZhcmkuXFxuICovXFxuXFxuYWJiclt0aXRsZV0ge1xcbiAgYm9yZGVyLWJvdHRvbTogbm9uZTsgLyogMSAqL1xcbiAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7IC8qIDIgKi9cXG4gIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lIGRvdHRlZDsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZm9udCB3ZWlnaHQgaW4gQ2hyb21lLCBFZGdlLCBhbmQgU2FmYXJpLlxcbiAqL1xcblxcbmIsXFxuc3Ryb25nIHtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkZXI7XFxufVxcblxcbi8qKlxcbiAqIDEuIENvcnJlY3QgdGhlIGluaGVyaXRhbmNlIGFuZCBzY2FsaW5nIG9mIGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXFxuICogMi4gQ29ycmVjdCB0aGUgb2RkIGBlbWAgZm9udCBzaXppbmcgaW4gYWxsIGJyb3dzZXJzLlxcbiAqL1xcblxcbmNvZGUsXFxua2JkLFxcbnNhbXAge1xcbiAgZm9udC1mYW1pbHk6IG1vbm9zcGFjZSwgbW9ub3NwYWNlOyAvKiAxICovXFxuICBmb250LXNpemU6IDFlbTsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cXG4gKi9cXG5cXG5zbWFsbCB7XFxuICBmb250LXNpemU6IDgwJTtcXG59XFxuXFxuLyoqXFxuICogUHJldmVudCBgc3ViYCBhbmQgYHN1cGAgZWxlbWVudHMgZnJvbSBhZmZlY3RpbmcgdGhlIGxpbmUgaGVpZ2h0IGluXFxuICogYWxsIGJyb3dzZXJzLlxcbiAqL1xcblxcbnN1YixcXG5zdXAge1xcbiAgZm9udC1zaXplOiA3NSU7XFxuICBsaW5lLWhlaWdodDogMDtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcXG59XFxuXFxuc3ViIHtcXG4gIGJvdHRvbTogLTAuMjVlbTtcXG59XFxuXFxuc3VwIHtcXG4gIHRvcDogLTAuNWVtO1xcbn1cXG5cXG4vKiBFbWJlZGRlZCBjb250ZW50XFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKipcXG4gKiBSZW1vdmUgdGhlIGJvcmRlciBvbiBpbWFnZXMgaW5zaWRlIGxpbmtzIGluIElFIDEwLlxcbiAqL1xcblxcbmltZyB7XFxuICBib3JkZXItc3R5bGU6IG5vbmU7XFxufVxcblxcbi8qIEZvcm1zXFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKipcXG4gKiAxLiBDaGFuZ2UgdGhlIGZvbnQgc3R5bGVzIGluIGFsbCBicm93c2Vycy5cXG4gKiAyLiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBGaXJlZm94IGFuZCBTYWZhcmkuXFxuICovXFxuXFxuYnV0dG9uLFxcbmlucHV0LFxcbm9wdGdyb3VwLFxcbnNlbGVjdCxcXG50ZXh0YXJlYSB7XFxuICBmb250LWZhbWlseTogaW5oZXJpdDsgLyogMSAqL1xcbiAgZm9udC1zaXplOiAxMDAlOyAvKiAxICovXFxuICBsaW5lLWhlaWdodDogMS4xNTsgLyogMSAqL1xcbiAgbWFyZ2luOiAwOyAvKiAyICovXFxufVxcblxcbi8qKlxcbiAqIFNob3cgdGhlIG92ZXJmbG93IGluIElFLlxcbiAqIDEuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UuXFxuICovXFxuXFxuYnV0dG9uLFxcbmlucHV0IHsgLyogMSAqL1xcbiAgb3ZlcmZsb3c6IHZpc2libGU7XFxufVxcblxcbi8qKlxcbiAqIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRWRnZSwgRmlyZWZveCwgYW5kIElFLlxcbiAqIDEuIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRmlyZWZveC5cXG4gKi9cXG5cXG5idXR0b24sXFxuc2VsZWN0IHsgLyogMSAqL1xcbiAgdGV4dC10cmFuc2Zvcm06IG5vbmU7XFxufVxcblxcbi8qKlxcbiAqIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXFxuICovXFxuXFxuYnV0dG9uLFxcblt0eXBlPVxcXCJidXR0b25cXFwiXSxcXG5bdHlwZT1cXFwicmVzZXRcXFwiXSxcXG5bdHlwZT1cXFwic3VibWl0XFxcIl0ge1xcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBidXR0b247XFxufVxcblxcbi8qKlxcbiAqIFJlbW92ZSB0aGUgaW5uZXIgYm9yZGVyIGFuZCBwYWRkaW5nIGluIEZpcmVmb3guXFxuICovXFxuXFxuYnV0dG9uOjotbW96LWZvY3VzLWlubmVyLFxcblt0eXBlPVxcXCJidXR0b25cXFwiXTo6LW1vei1mb2N1cy1pbm5lcixcXG5bdHlwZT1cXFwicmVzZXRcXFwiXTo6LW1vei1mb2N1cy1pbm5lcixcXG5bdHlwZT1cXFwic3VibWl0XFxcIl06Oi1tb3otZm9jdXMtaW5uZXIge1xcbiAgYm9yZGVyLXN0eWxlOiBub25lO1xcbiAgcGFkZGluZzogMDtcXG59XFxuXFxuLyoqXFxuICogUmVzdG9yZSB0aGUgZm9jdXMgc3R5bGVzIHVuc2V0IGJ5IHRoZSBwcmV2aW91cyBydWxlLlxcbiAqL1xcblxcbmJ1dHRvbjotbW96LWZvY3VzcmluZyxcXG5bdHlwZT1cXFwiYnV0dG9uXFxcIl06LW1vei1mb2N1c3JpbmcsXFxuW3R5cGU9XFxcInJlc2V0XFxcIl06LW1vei1mb2N1c3JpbmcsXFxuW3R5cGU9XFxcInN1Ym1pdFxcXCJdOi1tb3otZm9jdXNyaW5nIHtcXG4gIG91dGxpbmU6IDFweCBkb3R0ZWQgQnV0dG9uVGV4dDtcXG59XFxuXFxuLyoqXFxuICogQ29ycmVjdCB0aGUgcGFkZGluZyBpbiBGaXJlZm94LlxcbiAqL1xcblxcbmZpZWxkc2V0IHtcXG4gIHBhZGRpbmc6IDAuMzVlbSAwLjc1ZW0gMC42MjVlbTtcXG59XFxuXFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgdGV4dCB3cmFwcGluZyBpbiBFZGdlIGFuZCBJRS5cXG4gKiAyLiBDb3JyZWN0IHRoZSBjb2xvciBpbmhlcml0YW5jZSBmcm9tIGBmaWVsZHNldGAgZWxlbWVudHMgaW4gSUUuXFxuICogMy4gUmVtb3ZlIHRoZSBwYWRkaW5nIHNvIGRldmVsb3BlcnMgYXJlIG5vdCBjYXVnaHQgb3V0IHdoZW4gdGhleSB6ZXJvIG91dFxcbiAqICAgIGBmaWVsZHNldGAgZWxlbWVudHMgaW4gYWxsIGJyb3dzZXJzLlxcbiAqL1xcblxcbmxlZ2VuZCB7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXFxuICBjb2xvcjogaW5oZXJpdDsgLyogMiAqL1xcbiAgZGlzcGxheTogdGFibGU7IC8qIDEgKi9cXG4gIG1heC13aWR0aDogMTAwJTsgLyogMSAqL1xcbiAgcGFkZGluZzogMDsgLyogMyAqL1xcbiAgd2hpdGUtc3BhY2U6IG5vcm1hbDsgLyogMSAqL1xcbn1cXG5cXG4vKipcXG4gKiBBZGQgdGhlIGNvcnJlY3QgdmVydGljYWwgYWxpZ25tZW50IGluIENocm9tZSwgRmlyZWZveCwgYW5kIE9wZXJhLlxcbiAqL1xcblxcbnByb2dyZXNzIHtcXG4gIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcXG59XFxuXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBkZWZhdWx0IHZlcnRpY2FsIHNjcm9sbGJhciBpbiBJRSAxMCsuXFxuICovXFxuXFxudGV4dGFyZWEge1xcbiAgb3ZlcmZsb3c6IGF1dG87XFxufVxcblxcbi8qKlxcbiAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIElFIDEwLlxcbiAqIDIuIFJlbW92ZSB0aGUgcGFkZGluZyBpbiBJRSAxMC5cXG4gKi9cXG5cXG5bdHlwZT1cXFwiY2hlY2tib3hcXFwiXSxcXG5bdHlwZT1cXFwicmFkaW9cXFwiXSB7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXFxuICBwYWRkaW5nOiAwOyAvKiAyICovXFxufVxcblxcbi8qKlxcbiAqIENvcnJlY3QgdGhlIGN1cnNvciBzdHlsZSBvZiBpbmNyZW1lbnQgYW5kIGRlY3JlbWVudCBidXR0b25zIGluIENocm9tZS5cXG4gKi9cXG5cXG5bdHlwZT1cXFwibnVtYmVyXFxcIl06Oi13ZWJraXQtaW5uZXItc3Bpbi1idXR0b24sXFxuW3R5cGU9XFxcIm51bWJlclxcXCJdOjotd2Via2l0LW91dGVyLXNwaW4tYnV0dG9uIHtcXG4gIGhlaWdodDogYXV0bztcXG59XFxuXFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgb2RkIGFwcGVhcmFuY2UgaW4gQ2hyb21lIGFuZCBTYWZhcmkuXFxuICogMi4gQ29ycmVjdCB0aGUgb3V0bGluZSBzdHlsZSBpbiBTYWZhcmkuXFxuICovXFxuXFxuW3R5cGU9XFxcInNlYXJjaFxcXCJdIHtcXG4gIC13ZWJraXQtYXBwZWFyYW5jZTogdGV4dGZpZWxkOyAvKiAxICovXFxuICBvdXRsaW5lLW9mZnNldDogLTJweDsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG4gKiBSZW1vdmUgdGhlIGlubmVyIHBhZGRpbmcgaW4gQ2hyb21lIGFuZCBTYWZhcmkgb24gbWFjT1MuXFxuICovXFxuXFxuW3R5cGU9XFxcInNlYXJjaFxcXCJdOjotd2Via2l0LXNlYXJjaC1kZWNvcmF0aW9uIHtcXG4gIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcXG59XFxuXFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cXG4gKiAyLiBDaGFuZ2UgZm9udCBwcm9wZXJ0aWVzIHRvIGBpbmhlcml0YCBpbiBTYWZhcmkuXFxuICovXFxuXFxuOjotd2Via2l0LWZpbGUtdXBsb2FkLWJ1dHRvbiB7XFxuICAtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjsgLyogMSAqL1xcbiAgZm9udDogaW5oZXJpdDsgLyogMiAqL1xcbn1cXG5cXG4vKiBJbnRlcmFjdGl2ZVxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLypcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBFZGdlLCBJRSAxMCssIGFuZCBGaXJlZm94LlxcbiAqL1xcblxcbmRldGFpbHMge1xcbiAgZGlzcGxheTogYmxvY2s7XFxufVxcblxcbi8qXFxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gYWxsIGJyb3dzZXJzLlxcbiAqL1xcblxcbnN1bW1hcnkge1xcbiAgZGlzcGxheTogbGlzdC1pdGVtO1xcbn1cXG5cXG4vKiBNaXNjXFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKipcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSAxMCsuXFxuICovXFxuXFxudGVtcGxhdGUge1xcbiAgZGlzcGxheTogbm9uZTtcXG59XFxuXFxuLyoqXFxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgMTAuXFxuICovXFxuXFxuW2hpZGRlbl0ge1xcbiAgZGlzcGxheTogbm9uZTtcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9nZXRVcmwuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMF9fXyA9IG5ldyBVUkwoXCIuL2ZvbnRzL2RyaXVzL2RyaXVzaGFsZi13ZWJmb250LndvZmYyXCIsIGltcG9ydC5tZXRhLnVybCk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzFfX18gPSBuZXcgVVJMKFwiLi9mb250cy9kcml1cy9kcml1c2hhbGYtd2ViZm9udC53b2ZmXCIsIGltcG9ydC5tZXRhLnVybCk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzJfX18gPSBuZXcgVVJMKFwiLi9mb250cy9kcml1cy9kcml1c3N0cmFpZ2h0LXdlYmZvbnQud29mZjJcIiwgaW1wb3J0Lm1ldGEudXJsKTtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfM19fXyA9IG5ldyBVUkwoXCIuL2ZvbnRzL2RyaXVzL2RyaXVzc3RyYWlnaHQtd2ViZm9udC53b2ZmXCIsIGltcG9ydC5tZXRhLnVybCk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzRfX18gPSBuZXcgVVJMKFwiLi9mb250cy9sdXhpLW1vbm8vbHV4aW1yLXdlYmZvbnQud29mZjJcIiwgaW1wb3J0Lm1ldGEudXJsKTtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfNV9fXyA9IG5ldyBVUkwoXCIuL2ZvbnRzL2x1eGktbW9uby9sdXhpbXItd2ViZm9udC53b2ZmXCIsIGltcG9ydC5tZXRhLnVybCk7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMF9fXyA9IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzBfX18pO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzFfX18gPSBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8xX19fKTtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8yX19fID0gX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMl9fXyk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfM19fXyA9IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzNfX18pO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzRfX18gPSBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF80X19fKTtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF81X19fID0gX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfNV9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYEBmb250LWZhY2Uge1xyXG4gIGZvbnQtZmFtaWx5OiAnZHJpdXNfaGFsZnRvbmVyZWd1bGFyJztcclxuICBzcmM6IHVybCgke19fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzBfX199KSBmb3JtYXQoJ3dvZmYyJyksXHJcbiAgICB1cmwoJHtfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8xX19ffSkgZm9ybWF0KCd3b2ZmJyk7XHJcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcclxuICBmb250LXN0eWxlOiBub3JtYWw7XHJcblxyXG59XHJcblxyXG5AZm9udC1mYWNlIHtcclxuICBmb250LWZhbWlseTogJ2RyaXVzX3N0cmFpZ2h0cmVndWxhcic7XHJcbiAgc3JjOiB1cmwoJHtfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8yX19ffSkgZm9ybWF0KCd3b2ZmMicpLFxyXG4gICAgdXJsKCR7X19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfM19fX30pIGZvcm1hdCgnd29mZicpO1xyXG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XHJcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xyXG5cclxufVxyXG5cclxuQGZvbnQtZmFjZSB7XHJcbiAgZm9udC1mYW1pbHk6ICdsdXhpX21vbm9yZWd1bGFyJztcclxuICBzcmM6IHVybCgke19fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzRfX199KSBmb3JtYXQoJ3dvZmYyJyksXHJcbiAgICB1cmwoJHtfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF81X19ffSkgZm9ybWF0KCd3b2ZmJyk7XHJcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcclxuICBmb250LXN0eWxlOiBub3JtYWw7XHJcblxyXG59XHJcblxyXG46cm9vdCB7XHJcbiAgLS1kYXJrLWNvbG9yLTE6ICMwMDAwMDA7XHJcbiAgLS1kYXJrLWFjY2VudC1jb2xvci0xOiAjNzI3MjcyO1xyXG4gIC0tbWFpbi1hY2NlbnQtY29sb3I6ICNlNzFhMWE7XHJcbiAgLS1zZWNvbmRhcnktYWNjZW50LWNvbG9yOiAjZmZmZmZmO1xyXG4gIC0tbWVkaXVtLWFjY2VudC1jb2xvcjogI2M1YzVjNTtcclxuICAtLWhvdmVyLWFjY2VudC1jb2xvci0xOiAjNGYwMDY5O1xyXG4gIC0taG92ZXItYm9yZGVyLWNvbG9yLTE6ICNlMjZlZDI7XHJcbiAgLS1zaGlwLWNvbG9yOiAjMjQxZTFlO1xyXG4gIC0tbWFpbi10aXRsZS1mb250LXNpemU6IGNsYW1wKDEuNXJlbSwgY2FsYygxcmVtICsgY2FsYygxLjV2dyArIDEuNXZoKSksIGNhbGMoNXJlbSArIGNhbGMoMC41dncgKyAwLjV2dykpKTtcclxuICAtLXNlY29uZGFyeS1oZWFkZXItZm9udC1zaXplOiBjbGFtcCgxLjI1cmVtLCBjYWxjKDF2dyArIDF2aCksIGNhbGMoMnJlbSArIGNhbGMoMXZ3ICsgMXZ3KSkpO1xyXG4gIC0tbWVkaXVtLWZvbnQ6IGNsYW1wKDFyZW0sIGNhbGMoMS4yNXJlbSArIGNhbGMoMC41dncgKyAwLjV2aCkpLCBjYWxjKDJyZW0gKyBjYWxjKDF2dyArIDF2aCkpKTtcclxuICAtLW1lZGl1bS1zbWFsbC1mb250OiBjbGFtcCgwLjc1cmVtLCBjYWxjKDAuNzVyZW0gKyBjYWxjKDAuMjV2dyArIDAuMjV2aCkpLCBjYWxjKDEuMjVyZW0gKyBjYWxjKDAuNXZ3ICsgMC41dmgpKSk7XHJcbn1cclxuXHJcbmJvZHkge1xyXG4gIG1hcmdpbjogMDtcclxufVxyXG5cclxuI2NvbnRlbnQge1xyXG4gIGRpc3BsYXk6IGdyaWQ7XHJcbiAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDE1MGRlZywgdmFyKC0tZGFyay1jb2xvci0xKSA1MCUsIHZhcigtLW1haW4tYWNjZW50LWNvbG9yKSA1MC4xNSUpO1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICBtaW4taGVpZ2h0OiAxMDBkdmg7XHJcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiBhdXRvIDFmcjtcclxuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmcjtcclxuICBmb250LWZhbWlseTogJ2RyaXVzX3N0cmFpZ2h0cmVndWxhcicsIHNhbnMtc2VyaWY7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZGFyay1jb2xvci0xKTtcclxuICBjb2xvcjogdmFyKC0tbWFpbi1hY2NlbnQtY29sb3IpO1xyXG59XHJcblxyXG4ubWFpbi10aXRsZSB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWRhcmstY29sb3ItMSk7XHJcbn1cclxuXHJcbi5tYWluLXRpdGxlIGgxe1xyXG4gIG1hcmdpbjogMDtcclxuICBtYXJnaW4tdG9wOiAwLjI1ZW07XHJcbiAgZm9udC1zaXplOiB2YXIoLS1tYWluLXRpdGxlLWZvbnQtc2l6ZSk7XHJcbn1cclxuXHJcbi5nYW1lIHtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGdhcDogY2FsYygwLjVyZW0gKyBjYWxjKDEuNXZ3ICsgMS41dncpKTtcclxuICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gIHBhZGRpbmc6IGNhbGModmFyKC0tbWFpbi10aXRsZS1mb250LXNpemUpIC8gMik7XHJcbn1cclxuXHJcbi8qIGxvYmJ5IHN0eWxlICovXHJcblxyXG4uaGFyYm9yIHtcclxuICBkaXNwbGF5OiBncmlkO1xyXG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KGF1dG8tZml0LCBtaW5tYXgoMzAwcHgsIDFmcikpO1xyXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTUwZGVnLCB2YXIoLS1kYXJrLWNvbG9yLTEpIDUwJSwgdmFyKC0tbWFpbi1hY2NlbnQtY29sb3IpIDUwLjE1JSk7XHJcbiAgd2lkdGg6IDEwMCU7XHJcbiAgaGVpZ2h0OiAxMDBkdmg7XHJcbn1cclxuXHJcbi5sb2JieS1jb250YWluZXIge1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxufVxyXG5cclxuLm1haW4tbG9iYnktY29udGFpbmVyIHtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGJvcmRlci1yYWRpdXM6IDhweDtcclxuICBib3gtc2hhZG93OiAwIC02cHggMCAzcHggdmFyKC0tc2Vjb25kYXJ5LWFjY2VudC1jb2xvcik7XHJcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICB3aWR0aDogbWluLWNvbnRlbnQ7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XHJcbn1cclxuXHJcbi5ncmVldGluZyB7XHJcbiAgbWFyZ2luOiAwO1xyXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICBmb250LXNpemU6IHZhcigtLXNlY29uZGFyeS1oZWFkZXItZm9udC1zaXplKTtcclxuICBjb2xvcjogdmFyKC0tc2Vjb25kYXJ5LWFjY2VudC1jb2xvcik7XHJcbiAgcGFkZGluZzogMWVtO1xyXG59XHJcblxyXG4uaGFyYm9yIC5nYW1lYm9hcmQtY29udGFpbmVyIHtcclxuICBjb2xvcjogdmFyKC0tc2Vjb25kYXJ5LWFjY2VudC1jb2xvcik7XHJcbiAgcGFkZGluZzogMmVtIDEuNWVtO1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1tYWluLWFjY2VudC1jb2xvcik7XHJcbn1cclxuXHJcbi5oYXJib3IgLmdhbWVib2FyZCB7XHJcbiAgd2lkdGg6IG1pbig4NXZ3LCBjYWxjKDE1MHB4ICsgY2FsYyg4dncgKyA4dmgpKSk7XHJcbiAgaGVpZ2h0OiBtaW4oODV2dywgY2FsYygxNTBweCArIGNhbGMoOHZ3ICsgOHZoKSkpO1xyXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW1haW4tYWNjZW50LWNvbG9yKTtcclxufVxyXG5cclxuLmdhbWVib2FyZD50cjpmaXJzdC1jaGlsZCxcclxuLmdhbWVib2FyZCB0aCB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbWFpbi1hY2NlbnQtY29sb3IpO1xyXG59XHJcblxyXG4uZ2FtZWJvYXJkIHRyIHtcclxuICBoZWlnaHQ6IDEwMCUgLyAxMTtcclxufVxyXG5cclxuLmdhbWVib2FyZCB0ZCB7XHJcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gIHdpZHRoOiBjYWxjKDEwMCUgLyAxMSk7XHJcbiAgZm9udC1zaXplOiB2YXIoLS1tZWRpdW0tc21hbGwtZm9udCk7XHJcbn1cclxuXHJcbi5kcmFnZ2FibGUge1xyXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICBsZWZ0OiAwO1xyXG4gIHRvcDogMDtcclxuICBtYXJnaW46IGF1dG87XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZGFyay1jb2xvci0xKTtcclxuICB3aWR0aDogMTAwJTtcclxuICBoZWlnaHQ6IDEwMCU7XHJcbiAgei1pbmRleDogMTtcclxufVxyXG5cclxuLnN0YXJ0LWJ0bi1jb250YWluZXIge1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbWFpbi1hY2NlbnQtY29sb3IpO1xyXG59XHJcblxyXG4uc3RhcnQtYnRuIHtcclxuICBib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiA4cHg7XHJcbiAgYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IDhweDtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1tZWRpdW0tYWNjZW50LWNvbG9yKTtcclxuICBib3JkZXI6IDNweCBzb2xpZCB2YXIoLS1kYXJrLWNvbG9yLTEpO1xyXG59XHJcblxyXG4uc3RhcnQtYnRuOmhvdmVyIHtcclxuICBjb2xvcjogdmFyKC0tbWVkaXVtLWFjY2VudC1jb2xvcik7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZGFyay1jb2xvci0xKTtcclxuICBib3JkZXI6IDNweCBzb2xpZCB2YXIoLS1tZWRpdW0tYWNjZW50LWNvbG9yKTtcclxufVxyXG4vKiBtYWluIGdhbWUgYm9hcmQgc3R5bGUgKi9cclxuLnZzLXRleHQge1xyXG4gIGZvbnQtc2l6ZTogY2xhbXAoMnJlbSwgM3Z3LCBjYWxjKDNyZW0gKyAxdncpKTtcclxuICBmb250LWZhbWlseTogJ2RyaXVzX2hhbGZ0b25lcmVndWxhcicsIHNhbnMtc2VyaWY7XHJcbiAgdGV4dC1zaGFkb3c6IC0zcHggMCB2YXIoLS1tZWRpdW0tYWNjZW50LWNvbG9yKTtcclxuICBib3gtc2hhZG93OiAtM3B4IDAgdmFyKC0tbWVkaXVtLWFjY2VudC1jb2xvcik7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcclxuICB3aWR0aDogY2FsYygwLjc1cmVtICsgY2FsYygydncgKyAydmgpKTtcclxuICBoZWlnaHQ6IGNhbGMoMC43NXJlbSArIGNhbGMoMnZ3ICsgMnZoKSk7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZGFyay1jb2xvci0xKTtcclxuICBwYWRkaW5nOiAxZW07XHJcbn1cclxuXHJcbi5nYW1lYm9hcmQge1xyXG4gIGZvbnQtZmFtaWx5OiAnbHV4aS1tb25vcmVndWxhcicsIHNhbnMtc2VyaWY7XHJcbiAgYm9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTtcclxuICB3aWR0aDogbWluKDg1dncsIGNhbGMoMTUwcHggKyBjYWxjKDEyLjV2dyArIDV2aCkpKTtcclxuICBoZWlnaHQ6IG1pbig4NXZ3LCBjYWxjKDE1MHB4ICsgY2FsYygxMi41dncgKyA1dmgpKSk7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbWVkaXVtLWFjY2VudC1jb2xvcik7XHJcbn1cclxuXHJcbi5nYW1lID4gLmdhbWVib2FyZCB7XHJcbiAgYm9yZGVyOiAzcHggc29saWQgdmFyKC0tbWVkaXVtLWFjY2VudC1jb2xvcik7XHJcbiAgb3V0bGluZTogMXB4IHNvbGlkIHZhcigtLW1haW4tYWNjZW50LWNvbG9yKTtcclxuICBib3gtc2hhZG93OiA2cHggNnB4IHZhcigtLWRhcmstY29sb3ItMSk7XHJcbn1cclxuXHJcbmRpdi5nYW1lYm9hcmQge1xyXG4gIGRpc3BsYXk6IGdyaWQ7XHJcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiByZXBlYXQoMTAsIDFmcik7XHJcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMTAsIDFmcik7XHJcbn1cclxuXHJcbi5nYW1lYm9hcmQgLnNxdWFyZSB7XHJcbiAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tZGFyay1hY2NlbnQtY29sb3ItMSk7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbWVkaXVtLWFjY2VudC1jb2xvcik7XHJcbn1cclxuXHJcbi5nYW1lYm9hcmRbZGF0YS1wbGF5ZXItdHlwZT1cImFpXCJdID4gLnNxdWFyZTpub3QoW2RhdGEtc3RhdHVzPVwidGFyZ2V0ZWRcIl0pOmhvdmVyIHtcclxuICBib3JkZXItY29sb3I6IHZhcigtLWhvdmVyLWJvcmRlci1jb2xvci0xKTtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1ob3Zlci1hY2NlbnQtY29sb3ItMSk7XHJcbn1cclxuXHJcbi5nYW1lYm9hcmQgPiAuc2hpcCB7XHJcbiAgYm9yZGVyLWNvbG9yOiB2YXIoLS1tYWluLWFjY2VudC1jb2xvcik7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc2hpcC1jb2xvcik7XHJcbn1cclxuXHJcbi5nYW1lYm9hcmRbZGF0YS1uYW1lID0gXCJwbGF5ZXIyXCJdPi5zaGlwIHtcclxuICBib3JkZXItY29sb3I6IHZhcigtLWRhcmstYWNjZW50LWNvbG9yLTEpO1xyXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW1lZGl1bS1hY2NlbnQtY29sb3IpO1xyXG59XHJcblxyXG4uZ2FtZWJvYXJkID4gLnNxdWFyZVtkYXRhLXN0YXR1cz1cInRhcmdldGVkXCJdIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1kYXJrLWFjY2VudC1jb2xvci0xKTtcclxufVxyXG5cclxuLmdhbWVib2FyZD4gLnNoaXBbZGF0YS1zdGF0dXM9XCJ0YXJnZXRlZFwiXSB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc2hpcC1jb2xvcik7XHJcbn1cclxuXHJcbi8qIHdpbm5lciBhbm5vdW5jZW1lbnQgZG9tICovXHJcblxyXG4ud2lubmVyLWNvbnRhaW5lciB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICBtYXJnaW46IGF1dG87XHJcbiAgbGVmdDogMDtcclxuICByaWdodDogMDtcclxuICB0b3A6IDA7XHJcbiAgYm90dG9tOiAwO1xyXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgY29sb3I6IHZhcigtLWRhcmstY29sb3ItMSk7XHJcbiAgZm9udC1zaXplOiBjbGFtcCgxLjI1cmVtLCBjYWxjKDEuMjVyZW0gKyBjYWxjKDAuMjV2dyArIDAuMjV2aCkpLCBjYWxjKDEuNXJlbSArIGNhbGMoMC41dncgKyAwLjV2aCkpKTtcclxuICBib3JkZXI6IDNweCBzb2xpZCB2YXIoLS1tZWRpdW0tYWNjZW50LWNvbG9yKTtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1kYXJrLWNvbG9yLTEpO1xyXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW1haW4tYWNjZW50LWNvbG9yKTtcclxuICB3aWR0aDogbWluKDg1dncsIGNhbGMoMjAwcHggKyBjYWxjKDEwdncgKyAxMHZoKSkpO1xyXG4gIGhlaWdodDogbWluKDMwdmgsIGNhbGMoMjAwcHggKyBjYWxjKDV2dyArIDV2aCkpKTtcclxuICBib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiA4cHg7XHJcbiAgYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IDhweDtcclxuICBib3gtc2hhZG93OiAwIDEwcHggMCAzcHggdmFyKC0tZGFyay1jb2xvci0xKTtcclxufVxyXG5cclxuYnV0dG9uLnJlc3RhcnQge1xyXG4gIG1hcmdpbi10b3A6IDUlO1xyXG4gIGZvbnQtc2l6ZTogdmFyKC0tbWVkaXVtLXNtYWxsLWZvbnQpO1xyXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWRhcmstY29sb3ItMSk7XHJcbiAgYm9yZGVyOiBub25lO1xyXG4gIHBhZGRpbmc6IDAuMjVlbSAwLjc1ZW07XHJcbiAgY29sb3I6IHZhcigtLW1lZGl1bS1hY2NlbnQtY29sb3IpO1xyXG59XHJcblxyXG5idXR0b24ucmVzdGFydDpob3ZlciB7XHJcbiAgY29sb3I6IHZhcigtLWRhcmstY29sb3ItMSk7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbWVkaXVtLWFjY2VudC1jb2xvcik7XHJcbiAgYm94LXNoYWRvdzogMCAzcHggMCAycHggdmFyKC0tZGFyay1jb2xvci0xKTtcclxufVxyXG5AbWVkaWEgb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDEwMjRweCkge1xyXG4gIC5nYW1lIHtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgfVxyXG59YCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGUuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0Usb0NBQW9DO0VBQ3BDOzBEQUM0RDtFQUM1RCxtQkFBbUI7RUFDbkIsa0JBQWtCOztBQUVwQjs7QUFFQTtFQUNFLG9DQUFvQztFQUNwQzswREFDZ0U7RUFDaEUsbUJBQW1CO0VBQ25CLGtCQUFrQjs7QUFFcEI7O0FBRUE7RUFD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QztBQUNyQzs7QUFFQTtFQUNFLHdDQUF3QztFQUN4Qyw0Q0FBNEM7QUFDOUM7O0FBRUE7RUFDRSw0Q0FBNEM7QUFDOUM7O0FBRUE7RUFDRSxtQ0FBbUM7QUFDckM7O0FBRUEsNEJBQTRCOztBQUU1QjtFQUNFLGFBQWE7RUFDYixzQkFBc0I7RUFDdEIsa0JBQWtCO0VBQ2xCLFlBQVk7RUFDWixPQUFPO0VBQ1AsUUFBUTtFQUNSLE1BQU07RUFDTixTQUFTO0VBQ1QsdUJBQXVCO0VBQ3ZCLG1CQUFtQjtFQUNuQiwwQkFBMEI7RUFDMUIsb0dBQW9HO0VBQ3BHLDRDQUE0QztFQUM1QyxxQ0FBcUM7RUFDckMsMENBQTBDO0VBQzFDLGlEQUFpRDtFQUNqRCxnREFBZ0Q7RUFDaEQsOEJBQThCO0VBQzlCLCtCQUErQjtFQUMvQiw0Q0FBNEM7QUFDOUM7O0FBRUE7RUFDRSxjQUFjO0VBQ2QsbUNBQW1DO0VBQ25DLHFDQUFxQztFQUNyQyxZQUFZO0VBQ1osc0JBQXNCO0VBQ3RCLGlDQUFpQztBQUNuQzs7QUFFQTtFQUNFLDBCQUEwQjtFQUMxQiw0Q0FBNEM7RUFDNUMsMkNBQTJDO0FBQzdDO0FBQ0E7RUFDRTtJQUNFLHNCQUFzQjtFQUN4QjtBQUNGXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIkBmb250LWZhY2Uge1xcclxcbiAgZm9udC1mYW1pbHk6ICdkcml1c19oYWxmdG9uZXJlZ3VsYXInO1xcclxcbiAgc3JjOiB1cmwoJy4vZm9udHMvZHJpdXMvZHJpdXNoYWxmLXdlYmZvbnQud29mZjInKSBmb3JtYXQoJ3dvZmYyJyksXFxyXFxuICAgIHVybCgnLi9mb250cy9kcml1cy9kcml1c2hhbGYtd2ViZm9udC53b2ZmJykgZm9ybWF0KCd3b2ZmJyk7XFxyXFxuICBmb250LXdlaWdodDogbm9ybWFsO1xcclxcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xcclxcblxcclxcbn1cXHJcXG5cXHJcXG5AZm9udC1mYWNlIHtcXHJcXG4gIGZvbnQtZmFtaWx5OiAnZHJpdXNfc3RyYWlnaHRyZWd1bGFyJztcXHJcXG4gIHNyYzogdXJsKCcuL2ZvbnRzL2RyaXVzL2RyaXVzc3RyYWlnaHQtd2ViZm9udC53b2ZmMicpIGZvcm1hdCgnd29mZjInKSxcXHJcXG4gICAgdXJsKCcuL2ZvbnRzL2RyaXVzL2RyaXVzc3RyYWlnaHQtd2ViZm9udC53b2ZmJykgZm9ybWF0KCd3b2ZmJyk7XFxyXFxuICBmb250LXdlaWdodDogbm9ybWFsO1xcclxcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xcclxcblxcclxcbn1cXHJcXG5cXHJcXG5AZm9udC1mYWNlIHtcXHJcXG4gIGZvbnQtZmFtaWx5OiAnbHV4aV9tb25vcmVndWxhcic7XFxyXFxuICBzcmM6IHVybCgnLi9mb250cy9sdXhpLW1vbm8vbHV4aW1yLXdlYmZvbnQud29mZjInKSBmb3JtYXQoJ3dvZmYyJyksXFxyXFxuICAgIHVybCgnLi9mb250cy9sdXhpLW1vbm8vbHV4aW1yLXdlYmZvbnQud29mZicpIGZvcm1hdCgnd29mZicpO1xcclxcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcXHJcXG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcXHJcXG5cXHJcXG59XFxyXFxuXFxyXFxuOnJvb3Qge1xcclxcbiAgLS1kYXJrLWNvbG9yLTE6ICMwMDAwMDA7XFxyXFxuICAtLWRhcmstYWNjZW50LWNvbG9yLTE6ICM3MjcyNzI7XFxyXFxuICAtLW1haW4tYWNjZW50LWNvbG9yOiAjZTcxYTFhO1xcclxcbiAgLS1zZWNvbmRhcnktYWNjZW50LWNvbG9yOiAjZmZmZmZmO1xcclxcbiAgLS1tZWRpdW0tYWNjZW50LWNvbG9yOiAjYzVjNWM1O1xcclxcbiAgLS1ob3Zlci1hY2NlbnQtY29sb3ItMTogIzRmMDA2OTtcXHJcXG4gIC0taG92ZXItYm9yZGVyLWNvbG9yLTE6ICNlMjZlZDI7XFxyXFxuICAtLXNoaXAtY29sb3I6ICMyNDFlMWU7XFxyXFxuICAtLW1haW4tdGl0bGUtZm9udC1zaXplOiBjbGFtcCgxLjVyZW0sIGNhbGMoMXJlbSArIGNhbGMoMS41dncgKyAxLjV2aCkpLCBjYWxjKDVyZW0gKyBjYWxjKDAuNXZ3ICsgMC41dncpKSk7XFxyXFxuICAtLXNlY29uZGFyeS1oZWFkZXItZm9udC1zaXplOiBjbGFtcCgxLjI1cmVtLCBjYWxjKDF2dyArIDF2aCksIGNhbGMoMnJlbSArIGNhbGMoMXZ3ICsgMXZ3KSkpO1xcclxcbiAgLS1tZWRpdW0tZm9udDogY2xhbXAoMXJlbSwgY2FsYygxLjI1cmVtICsgY2FsYygwLjV2dyArIDAuNXZoKSksIGNhbGMoMnJlbSArIGNhbGMoMXZ3ICsgMXZoKSkpO1xcclxcbiAgLS1tZWRpdW0tc21hbGwtZm9udDogY2xhbXAoMC43NXJlbSwgY2FsYygwLjc1cmVtICsgY2FsYygwLjI1dncgKyAwLjI1dmgpKSwgY2FsYygxLjI1cmVtICsgY2FsYygwLjV2dyArIDAuNXZoKSkpO1xcclxcbn1cXHJcXG5cXHJcXG5ib2R5IHtcXHJcXG4gIG1hcmdpbjogMDtcXHJcXG59XFxyXFxuXFxyXFxuI2NvbnRlbnQge1xcclxcbiAgZGlzcGxheTogZ3JpZDtcXHJcXG4gIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxNTBkZWcsIHZhcigtLWRhcmstY29sb3ItMSkgNTAlLCB2YXIoLS1tYWluLWFjY2VudC1jb2xvcikgNTAuMTUlKTtcXHJcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXHJcXG4gIG1pbi1oZWlnaHQ6IDEwMGR2aDtcXHJcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcclxcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiBhdXRvIDFmcjtcXHJcXG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyO1xcclxcbiAgZm9udC1mYW1pbHk6ICdkcml1c19zdHJhaWdodHJlZ3VsYXInLCBzYW5zLXNlcmlmO1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZGFyay1jb2xvci0xKTtcXHJcXG4gIGNvbG9yOiB2YXIoLS1tYWluLWFjY2VudC1jb2xvcik7XFxyXFxufVxcclxcblxcclxcbi5tYWluLXRpdGxlIHtcXHJcXG4gIGRpc3BsYXk6IGZsZXg7XFxyXFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1kYXJrLWNvbG9yLTEpO1xcclxcbn1cXHJcXG5cXHJcXG4ubWFpbi10aXRsZSBoMXtcXHJcXG4gIG1hcmdpbjogMDtcXHJcXG4gIG1hcmdpbi10b3A6IDAuMjVlbTtcXHJcXG4gIGZvbnQtc2l6ZTogdmFyKC0tbWFpbi10aXRsZS1mb250LXNpemUpO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZSB7XFxyXFxuICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgZ2FwOiBjYWxjKDAuNXJlbSArIGNhbGMoMS41dncgKyAxLjV2dykpO1xcclxcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcclxcbiAgcGFkZGluZzogY2FsYyh2YXIoLS1tYWluLXRpdGxlLWZvbnQtc2l6ZSkgLyAyKTtcXHJcXG59XFxyXFxuXFxyXFxuLyogbG9iYnkgc3R5bGUgKi9cXHJcXG5cXHJcXG4uaGFyYm9yIHtcXHJcXG4gIGRpc3BsYXk6IGdyaWQ7XFxyXFxuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdChhdXRvLWZpdCwgbWlubWF4KDMwMHB4LCAxZnIpKTtcXHJcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXHJcXG4gIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxNTBkZWcsIHZhcigtLWRhcmstY29sb3ItMSkgNTAlLCB2YXIoLS1tYWluLWFjY2VudC1jb2xvcikgNTAuMTUlKTtcXHJcXG4gIHdpZHRoOiAxMDAlO1xcclxcbiAgaGVpZ2h0OiAxMDBkdmg7XFxyXFxufVxcclxcblxcclxcbi5sb2JieS1jb250YWluZXIge1xcclxcbiAgZGlzcGxheTogZmxleDtcXHJcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG59XFxyXFxuXFxyXFxuLm1haW4tbG9iYnktY29udGFpbmVyIHtcXHJcXG4gIGRpc3BsYXk6IGZsZXg7XFxyXFxuICBib3JkZXItcmFkaXVzOiA4cHg7XFxyXFxuICBib3gtc2hhZG93OiAwIC02cHggMCAzcHggdmFyKC0tc2Vjb25kYXJ5LWFjY2VudC1jb2xvcik7XFxyXFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgd2lkdGg6IG1pbi1jb250ZW50O1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XFxyXFxufVxcclxcblxcclxcbi5ncmVldGluZyB7XFxyXFxuICBtYXJnaW46IDA7XFxyXFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxyXFxuICBmb250LXNpemU6IHZhcigtLXNlY29uZGFyeS1oZWFkZXItZm9udC1zaXplKTtcXHJcXG4gIGNvbG9yOiB2YXIoLS1zZWNvbmRhcnktYWNjZW50LWNvbG9yKTtcXHJcXG4gIHBhZGRpbmc6IDFlbTtcXHJcXG59XFxyXFxuXFxyXFxuLmhhcmJvciAuZ2FtZWJvYXJkLWNvbnRhaW5lciB7XFxyXFxuICBjb2xvcjogdmFyKC0tc2Vjb25kYXJ5LWFjY2VudC1jb2xvcik7XFxyXFxuICBwYWRkaW5nOiAyZW0gMS41ZW07XFxyXFxuICBkaXNwbGF5OiBmbGV4O1xcclxcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxyXFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbWFpbi1hY2NlbnQtY29sb3IpO1xcclxcbn1cXHJcXG5cXHJcXG4uaGFyYm9yIC5nYW1lYm9hcmQge1xcclxcbiAgd2lkdGg6IG1pbig4NXZ3LCBjYWxjKDE1MHB4ICsgY2FsYyg4dncgKyA4dmgpKSk7XFxyXFxuICBoZWlnaHQ6IG1pbig4NXZ3LCBjYWxjKDE1MHB4ICsgY2FsYyg4dncgKyA4dmgpKSk7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1tYWluLWFjY2VudC1jb2xvcik7XFxyXFxufVxcclxcblxcclxcbi5nYW1lYm9hcmQ+dHI6Zmlyc3QtY2hpbGQsXFxyXFxuLmdhbWVib2FyZCB0aCB7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1tYWluLWFjY2VudC1jb2xvcik7XFxyXFxufVxcclxcblxcclxcbi5nYW1lYm9hcmQgdHIge1xcclxcbiAgaGVpZ2h0OiAxMDAlIC8gMTE7XFxyXFxufVxcclxcblxcclxcbi5nYW1lYm9hcmQgdGQge1xcclxcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcclxcbiAgd2lkdGg6IGNhbGMoMTAwJSAvIDExKTtcXHJcXG4gIGZvbnQtc2l6ZTogdmFyKC0tbWVkaXVtLXNtYWxsLWZvbnQpO1xcclxcbn1cXHJcXG5cXHJcXG4uZHJhZ2dhYmxlIHtcXHJcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXHJcXG4gIGxlZnQ6IDA7XFxyXFxuICB0b3A6IDA7XFxyXFxuICBtYXJnaW46IGF1dG87XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1kYXJrLWNvbG9yLTEpO1xcclxcbiAgd2lkdGg6IDEwMCU7XFxyXFxuICBoZWlnaHQ6IDEwMCU7XFxyXFxuICB6LWluZGV4OiAxO1xcclxcbn1cXHJcXG5cXHJcXG4uc3RhcnQtYnRuLWNvbnRhaW5lciB7XFxyXFxuICBkaXNwbGF5OiBmbGV4O1xcclxcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1tYWluLWFjY2VudC1jb2xvcik7XFxyXFxufVxcclxcblxcclxcbi5zdGFydC1idG4ge1xcclxcbiAgYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czogOHB4O1xcclxcbiAgYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IDhweDtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW1lZGl1bS1hY2NlbnQtY29sb3IpO1xcclxcbiAgYm9yZGVyOiAzcHggc29saWQgdmFyKC0tZGFyay1jb2xvci0xKTtcXHJcXG59XFxyXFxuXFxyXFxuLnN0YXJ0LWJ0bjpob3ZlciB7XFxyXFxuICBjb2xvcjogdmFyKC0tbWVkaXVtLWFjY2VudC1jb2xvcik7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1kYXJrLWNvbG9yLTEpO1xcclxcbiAgYm9yZGVyOiAzcHggc29saWQgdmFyKC0tbWVkaXVtLWFjY2VudC1jb2xvcik7XFxyXFxufVxcclxcbi8qIG1haW4gZ2FtZSBib2FyZCBzdHlsZSAqL1xcclxcbi52cy10ZXh0IHtcXHJcXG4gIGZvbnQtc2l6ZTogY2xhbXAoMnJlbSwgM3Z3LCBjYWxjKDNyZW0gKyAxdncpKTtcXHJcXG4gIGZvbnQtZmFtaWx5OiAnZHJpdXNfaGFsZnRvbmVyZWd1bGFyJywgc2Fucy1zZXJpZjtcXHJcXG4gIHRleHQtc2hhZG93OiAtM3B4IDAgdmFyKC0tbWVkaXVtLWFjY2VudC1jb2xvcik7XFxyXFxuICBib3gtc2hhZG93OiAtM3B4IDAgdmFyKC0tbWVkaXVtLWFjY2VudC1jb2xvcik7XFxyXFxuICBkaXNwbGF5OiBmbGV4O1xcclxcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxyXFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xcclxcbiAgd2lkdGg6IGNhbGMoMC43NXJlbSArIGNhbGMoMnZ3ICsgMnZoKSk7XFxyXFxuICBoZWlnaHQ6IGNhbGMoMC43NXJlbSArIGNhbGMoMnZ3ICsgMnZoKSk7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1kYXJrLWNvbG9yLTEpO1xcclxcbiAgcGFkZGluZzogMWVtO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZWJvYXJkIHtcXHJcXG4gIGZvbnQtZmFtaWx5OiAnbHV4aS1tb25vcmVndWxhcicsIHNhbnMtc2VyaWY7XFxyXFxuICBib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlO1xcclxcbiAgd2lkdGg6IG1pbig4NXZ3LCBjYWxjKDE1MHB4ICsgY2FsYygxMi41dncgKyA1dmgpKSk7XFxyXFxuICBoZWlnaHQ6IG1pbig4NXZ3LCBjYWxjKDE1MHB4ICsgY2FsYygxMi41dncgKyA1dmgpKSk7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1tZWRpdW0tYWNjZW50LWNvbG9yKTtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWUgPiAuZ2FtZWJvYXJkIHtcXHJcXG4gIGJvcmRlcjogM3B4IHNvbGlkIHZhcigtLW1lZGl1bS1hY2NlbnQtY29sb3IpO1xcclxcbiAgb3V0bGluZTogMXB4IHNvbGlkIHZhcigtLW1haW4tYWNjZW50LWNvbG9yKTtcXHJcXG4gIGJveC1zaGFkb3c6IDZweCA2cHggdmFyKC0tZGFyay1jb2xvci0xKTtcXHJcXG59XFxyXFxuXFxyXFxuZGl2LmdhbWVib2FyZCB7XFxyXFxuICBkaXNwbGF5OiBncmlkO1xcclxcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiByZXBlYXQoMTAsIDFmcik7XFxyXFxuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgxMCwgMWZyKTtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVib2FyZCAuc3F1YXJlIHtcXHJcXG4gIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWRhcmstYWNjZW50LWNvbG9yLTEpO1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbWVkaXVtLWFjY2VudC1jb2xvcik7XFxyXFxufVxcclxcblxcclxcbi5nYW1lYm9hcmRbZGF0YS1wbGF5ZXItdHlwZT1cXFwiYWlcXFwiXSA+IC5zcXVhcmU6bm90KFtkYXRhLXN0YXR1cz1cXFwidGFyZ2V0ZWRcXFwiXSk6aG92ZXIge1xcclxcbiAgYm9yZGVyLWNvbG9yOiB2YXIoLS1ob3Zlci1ib3JkZXItY29sb3ItMSk7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1ob3Zlci1hY2NlbnQtY29sb3ItMSk7XFxyXFxufVxcclxcblxcclxcbi5nYW1lYm9hcmQgPiAuc2hpcCB7XFxyXFxuICBib3JkZXItY29sb3I6IHZhcigtLW1haW4tYWNjZW50LWNvbG9yKTtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXNoaXAtY29sb3IpO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZWJvYXJkW2RhdGEtbmFtZSA9IFxcXCJwbGF5ZXIyXFxcIl0+LnNoaXAge1xcclxcbiAgYm9yZGVyLWNvbG9yOiB2YXIoLS1kYXJrLWFjY2VudC1jb2xvci0xKTtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW1lZGl1bS1hY2NlbnQtY29sb3IpO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZWJvYXJkID4gLnNxdWFyZVtkYXRhLXN0YXR1cz1cXFwidGFyZ2V0ZWRcXFwiXSB7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1kYXJrLWFjY2VudC1jb2xvci0xKTtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWVib2FyZD4gLnNoaXBbZGF0YS1zdGF0dXM9XFxcInRhcmdldGVkXFxcIl0ge1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc2hpcC1jb2xvcik7XFxyXFxufVxcclxcblxcclxcbi8qIHdpbm5lciBhbm5vdW5jZW1lbnQgZG9tICovXFxyXFxuXFxyXFxuLndpbm5lci1jb250YWluZXIge1xcclxcbiAgZGlzcGxheTogZmxleDtcXHJcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxyXFxuICBtYXJnaW46IGF1dG87XFxyXFxuICBsZWZ0OiAwO1xcclxcbiAgcmlnaHQ6IDA7XFxyXFxuICB0b3A6IDA7XFxyXFxuICBib3R0b206IDA7XFxyXFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICBjb2xvcjogdmFyKC0tZGFyay1jb2xvci0xKTtcXHJcXG4gIGZvbnQtc2l6ZTogY2xhbXAoMS4yNXJlbSwgY2FsYygxLjI1cmVtICsgY2FsYygwLjI1dncgKyAwLjI1dmgpKSwgY2FsYygxLjVyZW0gKyBjYWxjKDAuNXZ3ICsgMC41dmgpKSk7XFxyXFxuICBib3JkZXI6IDNweCBzb2xpZCB2YXIoLS1tZWRpdW0tYWNjZW50LWNvbG9yKTtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWRhcmstY29sb3ItMSk7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1tYWluLWFjY2VudC1jb2xvcik7XFxyXFxuICB3aWR0aDogbWluKDg1dncsIGNhbGMoMjAwcHggKyBjYWxjKDEwdncgKyAxMHZoKSkpO1xcclxcbiAgaGVpZ2h0OiBtaW4oMzB2aCwgY2FsYygyMDBweCArIGNhbGMoNXZ3ICsgNXZoKSkpO1xcclxcbiAgYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czogOHB4O1xcclxcbiAgYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IDhweDtcXHJcXG4gIGJveC1zaGFkb3c6IDAgMTBweCAwIDNweCB2YXIoLS1kYXJrLWNvbG9yLTEpO1xcclxcbn1cXHJcXG5cXHJcXG5idXR0b24ucmVzdGFydCB7XFxyXFxuICBtYXJnaW4tdG9wOiA1JTtcXHJcXG4gIGZvbnQtc2l6ZTogdmFyKC0tbWVkaXVtLXNtYWxsLWZvbnQpO1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZGFyay1jb2xvci0xKTtcXHJcXG4gIGJvcmRlcjogbm9uZTtcXHJcXG4gIHBhZGRpbmc6IDAuMjVlbSAwLjc1ZW07XFxyXFxuICBjb2xvcjogdmFyKC0tbWVkaXVtLWFjY2VudC1jb2xvcik7XFxyXFxufVxcclxcblxcclxcbmJ1dHRvbi5yZXN0YXJ0OmhvdmVyIHtcXHJcXG4gIGNvbG9yOiB2YXIoLS1kYXJrLWNvbG9yLTEpO1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbWVkaXVtLWFjY2VudC1jb2xvcik7XFxyXFxuICBib3gtc2hhZG93OiAwIDNweCAwIDJweCB2YXIoLS1kYXJrLWNvbG9yLTEpO1xcclxcbn1cXHJcXG5AbWVkaWEgb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDEwMjRweCkge1xcclxcbiAgLmdhbWUge1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgfVxcclxcbn1cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XG4gIHZhciBsaXN0ID0gW107XG5cbiAgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IFwiXCI7XG4gICAgICB2YXIgbmVlZExheWVyID0gdHlwZW9mIGl0ZW1bNV0gIT09IFwidW5kZWZpbmVkXCI7XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07XG5cbiAgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcbiAgbGlzdC5pID0gZnVuY3Rpb24gaShtb2R1bGVzLCBtZWRpYSwgZGVkdXBlLCBzdXBwb3J0cywgbGF5ZXIpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIHVuZGVmaW5lZF1dO1xuICAgIH1cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2tdKTtcbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgbGF5ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtWzVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodXJsLCBvcHRpb25zKSB7XG4gIGlmICghb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuICBpZiAoIXVybCkge1xuICAgIHJldHVybiB1cmw7XG4gIH1cbiAgdXJsID0gU3RyaW5nKHVybC5fX2VzTW9kdWxlID8gdXJsLmRlZmF1bHQgOiB1cmwpO1xuXG4gIC8vIElmIHVybCBpcyBhbHJlYWR5IHdyYXBwZWQgaW4gcXVvdGVzLCByZW1vdmUgdGhlbVxuICBpZiAoL15bJ1wiXS4qWydcIl0kLy50ZXN0KHVybCkpIHtcbiAgICB1cmwgPSB1cmwuc2xpY2UoMSwgLTEpO1xuICB9XG4gIGlmIChvcHRpb25zLmhhc2gpIHtcbiAgICB1cmwgKz0gb3B0aW9ucy5oYXNoO1xuICB9XG5cbiAgLy8gU2hvdWxkIHVybCBiZSB3cmFwcGVkP1xuICAvLyBTZWUgaHR0cHM6Ly9kcmFmdHMuY3Nzd2cub3JnL2Nzcy12YWx1ZXMtMy8jdXJsc1xuICBpZiAoL1tcIicoKSBcXHRcXG5dfCglMjApLy50ZXN0KHVybCkgfHwgb3B0aW9ucy5uZWVkUXVvdGVzKSB7XG4gICAgcmV0dXJuIFwiXFxcIlwiLmNvbmNhdCh1cmwucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpLnJlcGxhY2UoL1xcbi9nLCBcIlxcXFxuXCIpLCBcIlxcXCJcIik7XG4gIH1cbiAgcmV0dXJuIHVybDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9ub3JtYWxpemUuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL25vcm1hbGl6ZS5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gdXBkYXRlcjtcbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcblxuICAgIC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuICBjc3MgKz0gb2JqLmNzcztcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfVxuXG4gIC8vIEZvciBvbGQgSUVcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHt9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgIH07XG4gIH1cbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJ2YXIgc2NyaXB0VXJsO1xuaWYgKF9fd2VicGFja19yZXF1aXJlX18uZy5pbXBvcnRTY3JpcHRzKSBzY3JpcHRVcmwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcubG9jYXRpb24gKyBcIlwiO1xudmFyIGRvY3VtZW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmRvY3VtZW50O1xuaWYgKCFzY3JpcHRVcmwgJiYgZG9jdW1lbnQpIHtcblx0aWYgKGRvY3VtZW50LmN1cnJlbnRTY3JpcHQpXG5cdFx0c2NyaXB0VXJsID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5zcmM7XG5cdGlmICghc2NyaXB0VXJsKSB7XG5cdFx0dmFyIHNjcmlwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKTtcblx0XHRpZihzY3JpcHRzLmxlbmd0aCkge1xuXHRcdFx0dmFyIGkgPSBzY3JpcHRzLmxlbmd0aCAtIDE7XG5cdFx0XHR3aGlsZSAoaSA+IC0xICYmICFzY3JpcHRVcmwpIHNjcmlwdFVybCA9IHNjcmlwdHNbaS0tXS5zcmM7XG5cdFx0fVxuXHR9XG59XG4vLyBXaGVuIHN1cHBvcnRpbmcgYnJvd3NlcnMgd2hlcmUgYW4gYXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCB5b3UgbXVzdCBzcGVjaWZ5IGFuIG91dHB1dC5wdWJsaWNQYXRoIG1hbnVhbGx5IHZpYSBjb25maWd1cmF0aW9uXG4vLyBvciBwYXNzIGFuIGVtcHR5IHN0cmluZyAoXCJcIikgYW5kIHNldCB0aGUgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gdmFyaWFibGUgZnJvbSB5b3VyIGNvZGUgdG8gdXNlIHlvdXIgb3duIGxvZ2ljLlxuaWYgKCFzY3JpcHRVcmwpIHRocm93IG5ldyBFcnJvcihcIkF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyXCIpO1xuc2NyaXB0VXJsID0gc2NyaXB0VXJsLnJlcGxhY2UoLyMuKiQvLCBcIlwiKS5yZXBsYWNlKC9cXD8uKiQvLCBcIlwiKS5yZXBsYWNlKC9cXC9bXlxcL10rJC8sIFwiL1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18ucCA9IHNjcmlwdFVybDsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmIgPSBkb2N1bWVudC5iYXNlVVJJIHx8IHNlbGYubG9jYXRpb24uaHJlZjtcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcImluZGV4XCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbi8vIG5vIG9uIGNodW5rcyBsb2FkZWRcblxuLy8gbm8ganNvbnAgZnVuY3Rpb24iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsImltcG9ydCBcIm5vcm1hbGl6ZS5jc3NcIjtcclxuaW1wb3J0IFwiLi9zdHlsZS5jc3NcIjtcclxuaW1wb3J0IGNyZWF0ZUxvYmJ5RG9tIGZyb20gXCIuL2RvbS11aS9sb2JieS11aVwiO1xyXG5cclxuZnVuY3Rpb24gY29tcG9uZW50KCkge1xyXG4gIGNvbnN0IGNvbnRlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRlbnRcIik7XHJcbiAgY29udGVudC5hcHBlbmRDaGlsZChjcmVhdGVMb2JieURvbSgpKTtcclxufVxyXG5cclxuY29tcG9uZW50KCk7XHJcbiJdLCJuYW1lcyI6WyJnZXRBdHRyaWJ1dGVBcnIiLCJmaWx0ZXJBbmRTb3J0QXJyIiwicmVtb3ZlRHVwbGljYXRlQXJyIiwicmFuZG9tSW5kZXgiLCJnZXRBZGplY2VudExpc3QiLCJnZXRBSUFkamVjZW50TGlzdCIsImNvb3JkaW5hdGVzIiwiYWRqZWNlbnRMaXN0IiwiZmlsdGVyIiwiaXRlbSIsInRhZ0RvbU9yaWVudGF0aW9uIiwiZG9tMSIsImRvbTIiLCJ0YXJnZXQxIiwidGFyZ2V0MiIsImRvbTFDb29yZGluYXRlcyIsImRvbTJDb29yZGluYXRlcyIsImNsYXNzTGlzdCIsImFkZCIsImdldEFJUm93QWRqZWNlbnRMaXN0Iiwicm93QWRqZWNlbnRMaXN0IiwiZ2V0QUlDb2x1bW5BZGplY2VudExpc3QiLCJjb2x1bW5BZGplY2VudExpc3QiLCJnZXRBSU9yaWVudGF0aW9uQWRqZWNlbnRMaXN0Iiwib3JpZW50YXRpb24iLCJnZXRGcmVlQWRqZWNlbnRMaXN0Iiwib3Bwb25lbnRCb2FyZCIsImRvbUxpc3QiLCJmb3JFYWNoIiwiZG9tIiwicXVlcnlTZWxlY3RvciIsImRhdGFTdGF0dXMiLCJnZXRBdHRyaWJ1dGUiLCJwdXNoIiwiY2hlY2tBZGplY2VudExpc3REb20iLCJldmVyeSIsImNvbnRhaW5zIiwiY2hlY2tGb3JUYWdnZWREb20iLCJ0YXJnZXREb20iLCJib2FyZCIsImNvbnRhaW5lciIsIm1hcCIsImluZGV4IiwiZ2V0Q2FsY3VsYXRlZFNwYWNlTW92ZSIsImZyZWVEb20iLCJxdWVyeVNlbGVjdG9yQWxsIiwiZmlsdGVyZWRBbmRTb3J0ZWQiLCJsZW5ndGgiLCJnZXRGcmVlT3JpZW50YXRpb25BZGplY2VudExpc3QiLCJtYWtlQ2FsY3VsYXRlZFNwYWNlTW92ZSIsInRhZ2dlZERvbXMiLCJvcHBvbmVudCIsInRhZ2dlZERvbUNvb3JkaW5hdGVzIiwiYWRqZWNlbnREb20iLCJmcmVlQWRqZWNlbnREb20iLCJjb29yZCIsInJlbW92ZSIsImNvbnNvbGUiLCJsb2ciLCJjYWxjdWxhdGVkQ29vcmRpbmF0ZXMiLCJzZWxlY3RlZERvbSIsIm1ha2VDYWxjdWxhdGVkT3JpZW50YXRpb25Nb3ZlIiwidGFnZ2VkRG9tIiwic2xpY2VkVGFnZ2VkRG9tIiwiQXJyYXkiLCJmcm9tIiwic2xpY2UiLCJmcmVlT3JpZW50YXRpb25BZGplY2VudExpc3QiLCJvcmllbnRhdGlvbkNvb3JkaW5hdGVzIiwiYWlTbWFydE1vdmUiLCJ0YWdnZWRSb3dEb20iLCJ0YWdnZWRDb2x1bW5Eb20iLCJyb3dDb29yZGluYXRlcyIsImNvbHVtbkNvb3JkaW5hdGVzIiwiYWlNYWtlQU1vdmUiLCJib2FyZERvbSIsInBsYXllciIsIm5hbWUiLCJzZXRSYW5kb21Db2xvciIsImNvbG9ycyIsInN0eWxlIiwiY29sb3IiLCJ0YXJnZXQiLCJzZXRNdWx0aXBsZUJvcmRlckNvbG9yIiwiY3JlYXRlRWxXaXRoQ2xhc3NBbmRUZXh0IiwidHlwZSIsImFyZ3VtZW50cyIsInVuZGVmaW5lZCIsImNsYXNzTmFtZSIsInRleHQiLCJlbCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInRleHRDb250ZW50IiwiYWRkQXR0cmlidXRlc1RvRWwiLCJhdHJOYW1lQXJyIiwiYXRyS2V5QXJyIiwiYXRyTmFtZSIsInNldEF0dHJpYnV0ZSIsIlNoaXAiLCJHYW1lYm9hcmQiLCJQbGF5ZXIiLCJBSVBsYXllciIsInJhbmRvbU9yaWVudGF0aW9uIiwiaXNQbGFjZW1lbnRWYWxpZCIsInNldFVwUGxheWVyQm9hcmQiLCJwbGF5ZXJOYW1lIiwicG9wdWxhdGVCb2FyZCIsInNwZWMiLCJzaGlwIiwic3VjY2Vzc1BsYWNlbWVudCIsImNvb3JkaW5hdGVzSW5kZXhMaXN0IiwiZmluZEFsbENvb3JkaW5hdGVzSW5kZXgiLCJwbGFjZVNoaXAiLCJzZXRVcEFJQm9hcmQiLCJBSU5hbWUiLCJjcmVhdGVHYW1lYm9hcmREb20iLCJzcXVhcmUiLCJzcXVhcmVEb20iLCJzdGF0dXMiLCJhcHBlbmRDaGlsZCIsInVwZGF0ZVN0YXR1c0RvbSIsInNldFVwR2FtZWJvYXJkRG9tIiwiY2hlY2tEb21QbGFjZW1lbnRWYWxpZGl0eSIsImRyYWdTdGFydEl0ZW0iLCJhdHRyIiwic3BsaXQiLCJOdW1iZXIiLCJnZXRDb29yZGluYXRlc0xpc3QiLCJjb29yZGluYXRlc0xpc3QiLCJpIiwiaXNBZGplY2VudERvbUZyZWUiLCJyZW1vdmVEYXRhSW5mb0F0dHIiLCJkcmFnc3RhcnRIYW5kbGVyIiwiZXYiLCJjaGlsZCIsInBhcmVudCIsInBhcmVudEVsZW1lbnQiLCJyZW1vdmVDaGlsZCIsImVsZW1lbnRGcm9tUG9pbnQiLCJjbGllbnRYIiwiY2xpZW50WSIsImRhdGFUcmFuc2ZlciIsInNldERhdGEiLCJpZCIsImRyYWdvdmVySGFuZGxlciIsInByZXZlbnREZWZhdWx0IiwiZHJvcEVmZmVjdCIsImNoZWNrRGlmZiIsImRhdGExIiwiZGF0YTIiLCJnZXRDb3JyZWN0RHJvcENvb3JkaW5hdGVzIiwiZHJvcENvb3JkaW5hdGVzIiwibmV3Q29vcmQiLCJpc0Nvb3JkaW5hdGVzVmFsaWQiLCJyb3ciLCJjb2x1bW4iLCJpc0Nvb3JkaW5hdGVzRnJlZSIsImFkZERhdGFJbmZvQXR0ciIsImNoZWNrUGxhY2VtZW50RG9tVmFsaWRpdHkiLCJjdXJyZW50UG9pbnQiLCJkcm9wUG9pbnQiLCJwcmV2Q29vcmRpbmF0ZXMiLCJuZXdDb29yZGluYXRlcyIsImFwcGVuZENoaWxkVG9UYXJnZXQiLCJjb3JyZWN0Q29vcmRpbmF0ZXMiLCJjcmVhdGVTaGlwT2JqRGF0YSIsImRyb3BTaGlwT25OZXdDb29yZGluYXRlcyIsImRyb3BwZWRJdGVtIiwiZHJhZ0l0ZW1Db29yZGluYXRlcyIsImRyYWdJdGVtT3JpZW50YXRpb24iLCJkcmFnSXRlbUxlbmd0aCIsImRyYWdTdGFydENvb3JkaW5hdGVzIiwiZHJvcEhhbmRsZXIiLCJkYXRhIiwiZ2V0RGF0YSIsImdldEVsZW1lbnRCeUlkIiwiY3JlYXRlV2lubmVyRG9tIiwiYW5ub3VuY2VXaW5uZXIiLCJwbGF5ZXIxIiwicGxheWVyMiIsImNvbnRlbnQiLCJoYXZlQWxsU2hpcHNTdW5rIiwiZ2FtZU92ZXIiLCJjaGVja0FsbFNoaXBzIiwiY2hlY2tBSVNoaXBDb29yZGluYXRlcyIsImdldENvb3JkaW5hdGVzIiwiY2hlY2tQbGF5ZXJTaGlwQ29vcmRpbmF0ZXMiLCJhdHRhY2tPcHBvbmVudEJvYXJkIiwiYXR0YWNrIiwiZmluZERvbUNoaWxkcmVuQnlBdHRyaWJ1dGUiLCJwYXJlbnREb20iLCJhdHRyaWJ1dGUiLCJrZXkiLCJjb2xvclNoaXAiLCJjb2xvcnNBcnIiLCJhSVRha2VBVHVybiIsInBsYXllclRha2VBVHVybiIsInBsYXllckRvbSIsIm9wcG9uZW50RG9tIiwiY2hlY2tUdXJuVmFsaWRpdHkiLCJmbiIsInJlZ2lzdGVyQXR0YWNrIiwiZ2V0RG9tQ29vcmRpbmF0ZXMiLCJudW0iLCJHYW1lIiwiZ2FtZURvbSIsInZzVGV4dCIsInBsYXllcjFEb20iLCJwbGF5ZXIyRG9tIiwiY2hpbGROb2RlcyIsIm5vZGUiLCJhZGRFdmVudExpc3RlbmVyIiwiYmluZCIsImNyZWF0ZUdhbWVib2FyZFRhYmxlIiwiY3JlYXRlU2hpcERvbSIsImNyZWF0ZUdyZWV0aW5nRG9tIiwiZ3JlZXRpbmciLCJnZXRBbGxTaGlwc0RhdGEiLCJzaGlwcyIsInNoaXBEb20iLCJyZW1vdmVMb2JieSIsImxvYmJ5IiwiYXBwZW5kR2FtZURvbSIsInJlcGxhY2VDaGlsZCIsInN0YXJ0R2FtZSIsImNyZWF0ZVN0YXJ0R2FtZUJ0biIsImNyZWF0ZUxvYmJ5RG9tIiwibG9iYnlDb250YWluZXIiLCJtYWluTG9iYnlDb250YWluZXIiLCJnYW1lYm9hcmRDb250YWluZXIiLCJzdGFydEJ0bkNvbnRhaW5lciIsInN0YXJ0R2FtZUJ0biIsImlzU3F1YXJlT25UaGVTYW1lUm93Iiwic3F1YXJlMSIsInNxdWFyZTIiLCJ2YWxpZGF0ZVNxdWFyZXNSb3ciLCJjb29yZGluYXRlczEiLCJjb29yZGluYXRlczIiLCJpc0FyckV4aXN0IiwiYXJyIiwiZmlsdGVyZWRBcnIiLCJzb3J0IiwiYSIsImIiLCJ0b1N0cmluZyIsImxpc3QiLCJ0b3BDb29yZCIsImJ0bUNvb3JkIiwibFRvcENvb3JkIiwiclRvcENvb3JkIiwibENvb3JkIiwickNvb3JkIiwibEJ0bUNvb3JkIiwickJ0bUNvb3JkIiwiZGF0YUluZm8iLCJyZW1vdmVHYW1lRG9tIiwiZ2FtZSIsInJlbW92ZVBvcFVwIiwicG9wVXAiLCJyZXN0YXJ0R2FtZSIsIndpbm5lciIsIndpbm5lckRvbUNvbnRhaW5lciIsIndpbm5lckRvbSIsInRvVXBwZXJDYXNlIiwicmVzdGFydEJ0biIsImdlT3Bwb3NpdGVPcmllbnRhdGlvbiIsImNoYW5nZVNoaXBPcmllbnRhdGlvblN0eWxlIiwid2lkdGgiLCJyZW1vdmVQcm9wZXJ0eSIsImhlaWdodCIsImNoYW5nZU9yaWVudGF0aW9uRG9tIiwidmFsaWRhdGVBZGplY2VudERvbSIsIm5ld09yaWVudGF0aW9uIiwicHJldk9yaWVudGF0aW9uIiwidmFsaWRhdGVQbGFjZW1lbnQiLCJjaGFuZ2VPcmllbnRhdGlvbiIsImNyZWF0ZVJvd3NGcm9tQm9hcmQiLCJyb3dMZW5ndGgiLCJyb3dzIiwiaiIsImNyZWF0ZUdhbWVib2FyZFJvd0RvbSIsInJvd0RvbSIsInJvd0FyciIsImNyZWF0ZVJvd0RvbSIsImNyZWF0ZUNvbHVtbkhlYWRlciIsInJvd0hlYWQiLCJzdHlsZVNoaXBCeUl0c0xlbmd0aCIsInNldERhdGFJbmZvQXR0ciIsImdldEFsbENvb3JkaW5hdGVzTGlzdEJ5SW5kZXgiLCJjcmVhdGVEcmFnZ2FibGVJdGVtIiwiaGVhZCIsImRyYWdnYWJsZSIsImNyZWF0ZUJvYXJkIiwiZmluZCIsImdldENvb3JkaW5hdGVzSW5kZXgiLCJmaW5kSW5kZXgiLCJnZXRFbmRQb2ludCIsIm9iaiIsInRvTG93ZXJDYXNlIiwiaXNFbmRQb2ludFZhbGlkIiwiZW5kUG9pbnQiLCJpbmRleExpc3QiLCJjaGVja0FsbFNxdWFyZSIsImFkZFNoaXBUb0FyciIsInBsYWNlU2hpcE9uQm9hcmQiLCJyZWNlaXZlQXR0YWNrIiwiY3VycmVudFNxdWFyZSIsImhpdCIsImlzU3VuayIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsIm9yaWVudGF0aW9uTGlzdCIsImlzSW5kZXhWYWxpZCIsImluZGV4MSIsImluZGV4MiIsIlNldCIsImNoZWNrUGxhY2VtZW50VmFsaWRpdHkiLCJwbGFjZW1lbnRJbmRleCIsInNoaXBQbGFjZW1lbnRWYWxpZGl0eSIsImFkamVjZW50TGlzdFZhbGlkaXR5IiwicGxhY2VtZW50SW5kZXhWYWxpZGl0eSIsImZpbmRDb29yZGluYXRlc0luZGV4IiwiZmlsdGVyQm9hcmQiLCJyYW5kb21Nb3ZlIiwiYWN0aXZlU3F1YXJlcyIsIm51bWJlck9mSGl0cyIsImNvbXBvbmVudCJdLCJzb3VyY2VSb290IjoiIn0=