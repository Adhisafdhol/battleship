const Gameboard = (length) => {
  const createBoard = () => {
    const board = [];
    for (let i = 0; i < length; i += 1) {
      for (let j = 0; j < length; j += 1) {
        board.push({ coordinates: [i, j], status: "free" });
      }
    }

    return board;
  };

  const board = createBoard();
  const ships = [];

  const getCoordinates = (coordinates) =>
    board.find(
      (square) =>
        square.coordinates[0] === coordinates[0] &&
        square.coordinates[1] === coordinates[1],
    );

  const getCoordinatesIndex = (coordinates) =>
    board.findIndex(
      (square) =>
        square.coordinates[0] === coordinates[0] &&
        square.coordinates[1] === coordinates[1],
    );

  const getEndPoint = (coordinates, obj, orientation) => {
    if (orientation.toLowerCase() === "row") {
      return [coordinates[0], coordinates[1] + obj.length - 1];
    }

    if (orientation.toLowerCase() === "column") {
      return [coordinates[0] + obj.length - 1, coordinates[1]];
    }
  };

  const isEndPointValid = (endPoint) => getCoordinates(endPoint);

  const findAllCoordinatesIndex = (coordinates, obj, orientation) => {
    const coordinatesList = [];

    if (orientation.toLowerCase() === "row") {
      for (let i = 0; i < obj.length; i += 1) {
        coordinatesList.push(
          getCoordinatesIndex([coordinates[0], coordinates[1] + i]),
        );
      }
    }

    if (orientation.toLowerCase() === "column") {
      for (let i = 0; i < obj.length; i += 1) {
        coordinatesList.push(
          getCoordinatesIndex([coordinates[0] + i, coordinates[1]]),
        );
      }
    }

    return coordinatesList;
  };

  const checkAllSquare = (coordinatesList, key) =>
    coordinatesList.every((coordinates) => !(key in board[coordinates]));

  const addShipToArr = (ship, orientation, coordinates) => {
    ships.push({ ship, orientation, coordinates });
  };

  const placeShipOnBoard = (coordinatesList, obj, orientation, coordinates) => {
    if (checkAllSquare(coordinatesList, "ship")) {
      addShipToArr(obj, orientation, coordinates);
      coordinatesList.forEach((index) => {
        board[index].ship = obj;
      });
    }
  };

  const placeShip = (coordinates, obj, orientation) => {
    const endPoint = getEndPoint(coordinates, obj, orientation);

    if (isEndPointValid(endPoint)) {
      const coordinatesList = findAllCoordinatesIndex(
        coordinates,
        obj,
        orientation,
      );
      placeShipOnBoard(coordinatesList, obj, orientation, coordinates);
    }
  };

  const receiveAttack = (coordinates) => {
    const currentSquare = getCoordinates(coordinates);
    if (currentSquare.status !== "targeted") {
      if ("ship" in currentSquare) {
        currentSquare.ship.hit();
      }

      currentSquare.status = "targeted";
    }
  };

  const haveAllShipsSunk = () => ships.every((obj) => obj.ship.isSunk());

  return {
    get board() {
      return board;
    },
    get ships() {
      return ships;
    },
    placeShip,
    getCoordinates,
    getCoordinatesIndex,
    getEndPoint,
    findAllCoordinatesIndex,
    receiveAttack,
    haveAllShipsSunk,
  };
};

export default Gameboard;
