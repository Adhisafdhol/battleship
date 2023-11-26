import Ship from "../ship";
import Gameboard from "../gameboard";
import { Player, AIPlayer } from "../player";
import {
  randomIndex,
  randomOrientation,
  getAdjecentList,
  isPlacementValid,
} from "../placement-logic";

const specification = {
  numberOfShips: 9,
  length: 5,
};

const setUpPlayerBoard = () => {
  const player = Player("player1");
  const board = Gameboard(10);
  return { player, board };
};

const populateBoard = (board, spec) => {
  let successPlacement = 0;
  let { length } = spec;

  while (successPlacement < spec.numberOfShips) {
    const index = randomIndex(board.board.length);
    const ship = Ship(length);
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
      if (successPlacement % 2 === 0) {
        length -= 1;
      }
    }
  }
};

const setUpAIBoard = (name) => {
  const player = AIPlayer(name);
  const board = Gameboard(10);
  populateBoard(board, specification);

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

export { setUpGameboardDom, setUpPlayerBoard, setUpAIBoard, updateStatusDom };
