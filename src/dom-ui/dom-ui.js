import Ship from "../ship";
import Gameboard from "../gameboard";
import { Player, AIPlayer } from "../player";
import {
  randomIndex,
  randomOrientation,
  getAdjecentList,
  isPlacementValid,
} from "../placement-logic";
import { addAttributesToEl, createElWithClassAndText } from "./dom-method";

const setUpPlayerBoard = (playerName) => {
  const player = Player(playerName);
  const board = Gameboard(10);
  const type = "player";
  return { player, board, type };
};

const populateBoard = (board) => {
  const spec = {
    ship: [
      Ship(4),
      Ship(4),
      Ship(3),
      Ship(3),
      Ship(3),
      Ship(2),
      Ship(2),
      Ship(1),
      Ship(1),
      Ship(1),
    ],
  };

  let successPlacement = 0;
  while (successPlacement < spec.ship.length) {
    const index = randomIndex(board.board.length);
    const ship = spec.ship[successPlacement];
    const orientation = randomOrientation();
    const coordinatesIndexList = board.findAllCoordinatesIndex(
      board.board[index].coordinates,
      ship,
      orientation,
    );
    const adjecentList = getAdjecentList(coordinatesIndexList, board.board);

    if (isPlacementValid(coordinatesIndexList, adjecentList, board.board)) {
      board.placeShip(board.board[index].coordinates, ship, orientation);
      successPlacement += 1;
    }
  }
};

const setUpAIBoard = (AIName) => {
  const player = AIPlayer(AIName);
  const board = Gameboard(10);
  populateBoard(board);
  const type = "ai";
  return { player, board, type };
};

const createGameboardDom = (player) => {
  const boardDom = createElWithClassAndText("div", "gameboard");
  addAttributesToEl(
    boardDom,
    ["data-name", "data-player-type"],
    [`${player.player.name}`, player.type],
  );

  player.board.board.forEach((square, index) => {
    const squareDom = document.createElement("button");
    squareDom.setAttribute(
      "data-coordinates",
      `${player.board.board[index].coordinates}`,
    );
    squareDom.setAttribute(
      "data-status",
      `${player.board.board[index].status}`,
    );

    squareDom.classList.add("square");
    if (player.board.board[index].ship) {
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

export {
  setUpGameboardDom,
  setUpPlayerBoard,
  setUpAIBoard,
  updateStatusDom,
  populateBoard,
};
