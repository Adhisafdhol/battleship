import Gameboard from "./gameboard";
import Ship from "./ship";

const currentBoard = Gameboard(10);
const shipOne = Ship(3);
const shipTwo = Ship(2);

test("Gameboard of length of 10 will have 100 squares", () =>
  expect(currentBoard.board.length).toBe(100));

test(`getCoordinatesIndex([1, 2]) will return 11`, () => {
  expect(currentBoard.getCoordinatesIndex([1, 2])).toBe(12);
});

test("findCoordinatesIndex([0, 5] will return 5)", () => {
  expect(currentBoard.getCoordinatesIndex([0, 5])).toBe(5);
});

test(`getEndPoint([1, 2], shipOne, "row") will return [1, 4]`, () => {
  expect(currentBoard.getEndPoint([1, 2], shipOne, "row")).toStrictEqual([
    1, 4,
  ]);
});

test('findAllCoordinatesIndex([1, 2], shipOne, "row") will return [12, 13, 14]', () => {
  expect(
    currentBoard.findAllCoordinatesIndex([1, 2], shipOne, "row"),
  ).toStrictEqual([12, 13, 14]);
});

test('findAllCoordinatesIndex([0, 5], shipTwo, "row") will return [5, 15]', () => {
  expect(
    currentBoard.findAllCoordinatesIndex([0, 5], shipTwo, "column"),
  ).toStrictEqual([5, 15]);
});

test("place the ship with length of 3 in coordinates [1, 2] with its orientation set to row. The ship will starts at coordinates [1, 2] and ends at [1, 4]", () => {
  currentBoard.placeShip([1, 2], shipOne, "row");
  expect(currentBoard.getCoordinates([1, 2]).ship).toEqual(shipOne);
  expect(currentBoard.getCoordinates([1, 3]).ship).toEqual(shipOne);
  expect(currentBoard.getCoordinates([1, 4]).ship).toEqual(shipOne);
});

test("place the ship with length of 2 in coordinates [0, 5] with its orientation set to column. The ship will starts at coordinates [0, 5] and ends at [1, 6]", () => {
  currentBoard.placeShip([0, 5], shipTwo, "column");
  expect(currentBoard.getCoordinates([0, 5]).ship).toEqual(shipTwo);
  expect(currentBoard.getCoordinates([1, 5]).ship).toEqual(shipTwo);
});

test("the ships array contains two item", () => {
  expect(currentBoard.ships.length).toBe(2);
});

test("placing the ship over another ship placement will fail", () => {
  currentBoard.placeShip([0, 3], shipTwo, "column");
  expect(currentBoard.getCoordinates([1, 3]).ship).toEqual(shipOne);
});

test("receiveAttack([1, 3]) will hit a ship and activate the ship hit function", () => {
  currentBoard.receiveAttack([1, 3]);
  expect(currentBoard.getCoordinates([1, 3]).ship.numberOfHits).toBe(1);
});

test("attacking at the same spot will do nothing", () => {
  currentBoard.receiveAttack([1, 3]);
  expect(currentBoard.getCoordinates([1, 3]).ship.numberOfHits).toBe(1);
});

test("receiveAttack([1, 8]) will miss mark the coordinates as targeted", () => {
  currentBoard.receiveAttack([1, 8]);
  expect(currentBoard.getCoordinates([1, 8]).status).toBe("targeted");
});

test("ship One has sunk", () => {
  currentBoard.receiveAttack([1, 2]);
  currentBoard.receiveAttack([1, 4]);
  expect(currentBoard.getCoordinates([1, 2]).ship.isSunk()).toBeTruthy();
});

test("isAllShipsSunk will return false", () => {
  expect(currentBoard.isAllShipsSunk()).toBeFalsy();
});

test("ship Two has sunk", () => {
  currentBoard.receiveAttack([0, 5]);
  currentBoard.receiveAttack([1, 5]);
  expect(currentBoard.getCoordinates([0, 5]).ship.isSunk()).toBeTruthy();
});

test("isAllShipsSunk will return true", () => {
  expect(currentBoard.isAllShipsSunk()).toBeTruthy();
});
