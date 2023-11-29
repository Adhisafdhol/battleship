import Ship from "../ship";
import Gameboard from "../gameboard";
import { Player, AIPlayer } from "../player";
import {
  randomIndex,
  randomOrientation,
  getAdjecentList,
  isPlacementValid,
} from "../placement-logic";

const setUpPlayerBoard = () => {
  const player = Player("player1");
  const board = Gameboard(10);
  return { player, board };
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

const setUpAIBoard = (name) => {
  const player = AIPlayer(name);
  const board = Gameboard(10);
  populateBoard(board);

  return { player, board };
};

const createGameboardDom = (player) => {
  const boardDom = document.createElement("div");
  boardDom.setAttribute("data-name", `${player.player.name}`);
  boardDom.classList.add("gameboard");

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

const setUpGameboardDom = (player) => createGameboardDom(player);

export {
  setUpGameboardDom,
  setUpPlayerBoard,
  setUpAIBoard,
  updateStatusDom,
  populateBoard,
};
