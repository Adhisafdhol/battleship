const randomIndex = (length) => Math.floor(Math.random() * length);

const randomOrientation = () => {
  const orientationList = ["row", "column"];
  const index = randomIndex(orientationList.length);
  return orientationList[index];
};

const isSquareOnTheSameRow = (square1, square2) => square1[0] === square2[0];
const isIndexValid = (index) => index >= 0 && index < 100;

const validateSquaresRow = (index1, index2, board) => {
  if (isIndexValid(index1) && isIndexValid(index2)) {
    return isSquareOnTheSameRow(
      board[index1].coordinates,
      board[index2].coordinates,
    )
      ? index1
      : -1;
  }

  return -1;
};

const getAdjecentList = (coordinatesIndexList, board) => {
  const list = [];
  coordinatesIndexList.forEach((index) => {
    list.push(validateSquaresRow(index - 11, index - 10, board));
    list.push(index - 10);
    list.push(validateSquaresRow(index - 9, index - 10, board));
    list.push(validateSquaresRow(index - 1, index, board));
    list.push(validateSquaresRow(index + 1, index, board));
    list.push(validateSquaresRow(index + 9, index + 10, board));
    list.push(index + 10);
    list.push(validateSquaresRow(index + 11, index + 10, board));
  });

  return Array.from(
    new Set(
      list.filter((item) => item >= 0 && item < 100).sort((a, b) => a - b),
    ),
  );
};

const checkPlacementValidity = (
  placementIndex,
  coordinatesIndexList,
  board,
) => {
  const shipPlacementValidity = placementIndex.every(
    (index) => !("ship" in board[index]),
  );

  const adjecentListValidity = coordinatesIndexList.every(
    (index) => !("ship" in board[index]),
  );

  return shipPlacementValidity && adjecentListValidity;
};

const isPlacementValid = (placementIndex, coordinatesIndexList, board) => {
  const placementIndexValidity = placementIndex.every(
    (index) => index >= 0 && index < 100,
  );

  if (placementIndexValidity) {
    return checkPlacementValidity(placementIndex, coordinatesIndexList, board);
  }

  return false;
};

export {
  randomIndex,
  randomOrientation,
  getAdjecentList,
  isSquareOnTheSameRow,
  validateSquaresRow,
  isPlacementValid,
};
