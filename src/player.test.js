import { Player, AIPlayer } from "./player";
import Gameboard from "./gameboard";
import Ship from "./ship";

const player1 = Player("player1");
const player2 = AIPlayer("player2");
const player1Board = Gameboard(10);
const player2Board = Gameboard(10);
const p1ShipOne = Ship(3);
const p2ShipOne = Ship(3);
player1Board.placeShip([1, 1], p1ShipOne, "row");
player2Board.placeShip([3, 1], p2ShipOne, "row");

test("attack opponent board at coordinates [3, 1] hits opponent ship by 1", () => {
  player1.attack([3, 1], player2Board, "receiveAttack");
  expect(player2Board.getCoordinates([3, 1]).ship.numberOfHits).toBe(1);
});

test("random number will be equal and greater than 0 and less than 100", () => {
  expect(player2.randomIndex(player1Board.board.length)).toBeGreaterThanOrEqual(
    0,
  );
  expect(player2.randomIndex(player1Board.board.length)).toBeLessThan(100);
});

test("findCoordinatesIndex([1,1]) will return 11", () => {
  expect(player2.findCoordinatesIndex([1, 1], player1Board.board)).toBe(11);
});

test("Cannot attack at the same board twice", () => {
  player2.attack([1, 1], player1Board, "receiveAttack");
  player2.attack([1, 1], player1Board, "receiveAttack");
  expect(player1Board.getCoordinates([1, 1]).ship.numberOfHits).toBe(1);
});

test("AI filtered board length will be 99 after one square was hit", () => {
  expect(player2.filterBoard(player1Board.board).length).toBe(99);
});

test("AI filtered board length will be 98 after two different squares was hit", () => {
  player2.attack([1, 2], player1Board, "receiveAttack");
  player2.attack([1, 2], player1Board, "receiveAttack");
  expect(player2.filterBoard(player1Board.board).length).toBe(98);
});
