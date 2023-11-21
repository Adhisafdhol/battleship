import Ship from "./ship";

test("The number of hits will be incremented by 1 when hit is called ", () => {
  const currentShip = Ship(3);
  currentShip.hit();
  expect(currentShip.numberOfHits).toBe(1);
});

test("The number of hits will not be incremented if it is the same as ship length", () => {
  const currentShip = Ship();
  currentShip.hit();
  currentShip.hit();
  expect(currentShip.numberOfHits).toBe(1);
});

test("isSunk will return false if the number of hits is less than ship length", () => {
  const currentShip = Ship(1);
  expect(currentShip.isSunk()).toBeFalsy();
});

test("isSunk will return true if the number of hits is equal to ship length", () => {
  const currentShip = Ship(1);
  currentShip.hit();
  expect(currentShip.isSunk()).toBeTruthy();
});
