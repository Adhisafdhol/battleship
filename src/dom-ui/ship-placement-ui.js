import { addAttributesToEl, createElWithClassAndText } from "./dom-method";
import { setUpPlayerBoard } from "./dom-ui";
import {
  dragoverHandler,
  dragstartHandler,
  dropHandler,
} from "./drag-and-drop";
import Ship from "../ship";

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
  rowArr.forEach((square) => {
    const squareDom = createElWithClassAndText("td", "square");
    addAttributesToEl(
      squareDom,
      ["data-coordinates", "data-status"],
      [`${square.coordinates}`, `${square.status}`],
    );
    squareDom.addEventListener("drop", dropHandler);
    squareDom.addEventListener("dragover", dragoverHandler);
    rowDom.appendChild(squareDom);
  });
};

const createRowDom = (rowDom, rowArr) => {
  rowArr.forEach((item) => {
    const dom = createElWithClassAndText("th", "", item);
    dom.setAttribute("scope", "column");
    rowDom.appendChild(dom);
  });
};

const createColumnHeader = () => {
  const row = document.createElement("tr");
  row.appendChild(createElWithClassAndText("td"));
  createRowDom(row, ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]);

  return row;
};

const createGameboardTable = (player) => {
  const boardDom = createElWithClassAndText("table", "gameboard");
  boardDom.setAttribute("data-name", `${player.player.name}`);
  boardDom.appendChild(createColumnHeader());
  const rows = createRowsFromBoard(player.board.board, 10);
  rows.forEach((row, index) => {
    const rowDom = document.createElement("tr");
    const rowHead = createElWithClassAndText("th", "", index + 1);
    rowHead.setAttribute("scope", "row");
    rowDom.appendChild(rowHead);
    createGameboardRowDom(rowDom, row);
    boardDom.appendChild(rowDom);
  });
  return boardDom;
};

const createGreetingDom = () => {
  const greeting = createElWithClassAndText(
    "h2",
    "greeting",
    "It's time to place your battleships Commander!",
  );

  return greeting;
};

const styleShipByItsLength = (dom, length, orientation) => {
  const el = dom;
  if (orientation === "row") {
    el.style.width = `calc(${length * 100}% + ${length - 1}px)`;
  } else {
    el.style.height = `calc(${length * 100}% + ${length - 1}px)`;
  }
};

const createDraggableItem = (index, orientation, length, head) => {
  const draggable = createElWithClassAndText("div", "draggable");
  addAttributesToEl(
    draggable,
    ["id", "draggable", "data-orientation", "data-length", "data-head"],
    [`${index}`, true, orientation, `${length}`, `${head}`],
  );

  styleShipByItsLength(draggable, length, orientation);
  draggable.addEventListener("dragstart", dragstartHandler);

  return draggable;
};

const createShipDom = (board, boardDom) => {
  board.ships.forEach((ship, index) => {
    const dom = boardDom.querySelector(
      `[data-coordinates="${ship.coordinates}"]`,
    );
    dom.appendChild(
      createDraggableItem(
        index,
        ship.orientation,
        ship.ship.length,
        ship.coordinates,
      ),
    );
  });
};

const shipPlacementDom = () => {
  const lobby = createElWithClassAndText("div", "harbor");
  const player = setUpPlayerBoard("player1");
  player.board.placeShip([1, 2], Ship(3), "row");
  player.board.placeShip([6, 8], Ship(4), "column");
  const greeting = createGreetingDom();
  const lobbyContainer = createElWithClassAndText("div", "lobby-container");
  const mainLobbyContainer = createElWithClassAndText(
    "div",
    "main-lobby-container",
  );
  const gameboardContainer = createElWithClassAndText(
    "div",
    "gameboard-container",
  );

  const playerDom = createGameboardTable(player);
  createShipDom(player.board, playerDom);
  mainLobbyContainer.appendChild(greeting);
  gameboardContainer.appendChild(playerDom);
  mainLobbyContainer.appendChild(gameboardContainer);
  lobbyContainer.appendChild(mainLobbyContainer);
  lobby.appendChild(lobbyContainer);

  return lobby;
};

export { shipPlacementDom };
