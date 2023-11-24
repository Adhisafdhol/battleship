const Player = (name) => {
  const attack = (coordinates, target, fn) => {
    target[fn](coordinates);
  };

  return {
    get name() {
      return name;
    },
    attack,
  };
};

const AIPlayer = (name) => {
  const findCoordinatesIndex = (coordinates, board) =>
    board.findIndex(
      (square) =>
        square.coordinates[0] === coordinates[0] &&
        square.coordinates[1] === coordinates[1],
    );

  const randomIndex = (length) => Math.floor(Math.random() * length);

  const filterBoard = (board) =>
    board.filter((square) => square.status === "free");

  const randomMove = (board) => {
    const activeSquares = filterBoard(board);
    const { coordinates } = activeSquares[randomIndex(activeSquares.length)];
    return findCoordinatesIndex(coordinates, board);
  };

  const { attack } = Player(name);
  return {
    get name() {
      return name;
    },
    attack,
    randomMove,
    randomIndex,
    filterBoard,
    findCoordinatesIndex,
  };
};

export { Player, AIPlayer };
