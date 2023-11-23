import Ship from "../ship";
import Gameboard from "../gameboard";
import { Player, AIPlayer } from "../player";

function setUpPlayerBoard() {
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

  return {
    player,
    board,
  };
}

function setUpGameboardDom() {
  const player1 = setUpPlayerBoard();
  const p1BoardDom = document.createElement("div");
  p1BoardDom.classList.add("gameboard");
  player1.board.board.forEach((square, index) => {
    const squareDom = document.createElement("button");
    squareDom.classList.add("square");
    if (player1.board.board[index].ship) {
      squareDom.classList.add("ship");
    }
    p1BoardDom.appendChild(squareDom);
  });

  return p1BoardDom;
}

export { setUpGameboardDom };
