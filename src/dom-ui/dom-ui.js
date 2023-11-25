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
  board.placeShip([0, 0], Ship(4), "row");
  board.placeShip([2, 0], Ship(4), "column");
  board.placeShip([1, 7], Ship(3), "column");
  board.placeShip([2, 2], Ship(3), "row");
  board.placeShip([6, 3], Ship(2), "column");
  board.placeShip([5, 5], Ship(2), "row");
  board.placeShip([7, 8], Ship(1), "row");
  board.placeShip([7, 8], Ship(1), "row");

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

const creatGameboardDom = (player) => {
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

const setUpGameboardDom = (player) => creatGameboardDom(player);

export { setUpGameboardDom, setUpPlayerBoard, setUpAIBoard, updateStatusDom };
