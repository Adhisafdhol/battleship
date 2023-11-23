import {
  randomIndex,
  getAdjecentList,
  isSquareOnTheSameRow,
  validateSquaresRow,
  isPlacementValid,
} from "./placement-logic";
import Gameboard from "./gameboard";
import Ship from "./ship";

const board1 = Gameboard(10);

test("Return random index that is greater or equal zero and less than its length", () => {
  expect(randomIndex(100)).toBeGreaterThanOrEqual(0);
  expect(randomIndex(100)).toBeLessThan(100);
});

test("isSquareOnTheSameRow(board1.board[9.]coordinates, board1.board[9].coordinates[10]) will return false", () => {
  expect(
    isSquareOnTheSameRow(
      board1.board[9].coordinates,
      board1.board[10].coordinates,
    ),
  ).toBe(false);
});

test("validateSquareRow(9, 10, board1.board) will return -1", () => {
  expect(validateSquaresRow(9, 11, board1.board)).toBe(-1);
});

test("validateSquareRow(-1, 0, board1.board) will return -1", () => {
  expect(validateSquaresRow(0, -1, board1.board)).toBe(-1);
});

test("validateSquareRow(10, 11, board1.board) will return 10", () => {
  expect(validateSquaresRow(10, 11, board1.board)).toBe(10);
});

test("getAdjecentList([11]).length will be 8", () => {
  expect(getAdjecentList([11], board1.board).length).toBe(8);
});

test("getAdjecentList([0], board1.board) will return [1, 10, 11]", () => {
  expect(getAdjecentList([0], board1.board)).toEqual([1, 10, 11]);
});

test("isPlacementValid will return false if it contains index that is less than zero", () => {
  expect(
    isPlacementValid(
      [-1, 0, 1],
      getAdjecentList([-1, 0, 1], board1.board),
      board1.board,
    ),
  ).toBeFalsy();
});

test("isPlacementValid will return false if it contains index that is greater than or equal to 100", () => {
  expect(
    isPlacementValid(
      [98, 99, 100],
      getAdjecentList([98, 99, 100], board1.board),
      board1.board,
    ),
  ).toBeFalsy();
});

test("isPlacementValid([0, 1], getAdjecentList([0, 1], board1.board), board1.board) will return true", () => {
  expect(
    isPlacementValid(
      [0, 1],
      getAdjecentList([0, 1], board1.board),
      board1.board,
    ),
  ).toBeTruthy();
});

test("isPlacementValid([11, 12], getAdjecentList([11, 12], board1.board), board1.board) will return false", () => {
  board1.placeShip([2, 1], Ship(3), "row");
  expect(
    isPlacementValid(
      [11, 12],
      getAdjecentList([11, 12], board1.board),
      board1.board,
    ),
  ).toBeFalsy();
});

test("isPlacementValid([24, 34], getAdjecentList([24, 34], board1.board), board1.board) will return false", () => {
  expect(
    isPlacementValid(
      [24, 34],
      getAdjecentList([24, 34], board1.board),
      board1.board,
    ),
  ).toBeFalsy();
});

test("isPlacementValid([40, 41, 42], getAdjecentList([40, 41, 42], board1.board), board1.board) will return true", () => {
  expect(
    isPlacementValid(
      [40, 41, 42],
      getAdjecentList([40, 41, 42], board1.board),
      board1.board,
    ),
  ).toBeTruthy();
});
