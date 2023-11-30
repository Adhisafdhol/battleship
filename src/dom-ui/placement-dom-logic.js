const isSquareOnTheSameRow = (square1, square2) => square1[0] === square2[0];
const validateSquaresRow = (coordinates1, coordinates2) =>
  isSquareOnTheSameRow(coordinates1, coordinates2) ? coordinates1 : -1;

const isArrExist = (arr, target) =>
  arr.filter((item) => item[0] === target[0] && item[1] === target[1])
    .length === 1;

const removeDuplicateArr = (arr) => {
  const filteredArr = [];
  arr.forEach((item) => {
    if (!isArrExist(filteredArr, item)) {
      filteredArr.push(item);
    }
  });

  return filteredArr;
};

const filterAndSortArr = (arr) =>
  arr
    .filter(
      (item) => item[0] >= 0 && item[0] <= 9 && item[1] >= 0 && item[1] <= 9,
    )
    .sort(
      (a, b) =>
        Number(a[0].toString() + a[1].toString()) -
        Number(b[0].toString() + b[1].toString()),
    );

const getAdjecentList = (coordinatesList) => {
  const list = [];
  coordinatesList.forEach((coord) => {
    const topCoord = [coord[0] - 1, coord[1]];
    const btmCoord = [coord[0] + 1, coord[1]];
    const lTopCoord = [topCoord[0], topCoord[1] - 1];
    const rTopCoord = [topCoord[0], topCoord[1] + 1];
    const lCoord = [coord[0], coord[1] - 1];
    const rCoord = [coord[0], coord[1] + 1];
    const lBtmCoord = [btmCoord[0], btmCoord[1] - 1];
    const rBtmCoord = [btmCoord[0], btmCoord[1] + 1];

    list.push(validateSquaresRow(lTopCoord, topCoord));
    list.push(topCoord);
    list.push(validateSquaresRow(rTopCoord, topCoord));
    list.push(validateSquaresRow(lCoord, coord));
    list.push(validateSquaresRow(rCoord, coord));
    list.push(validateSquaresRow(lBtmCoord, btmCoord));
    list.push(btmCoord);
    list.push(validateSquaresRow(rBtmCoord, btmCoord));
  });

  return removeDuplicateArr(filterAndSortArr(list));
};

const checkDomPlacementValidity = (coordinatesList) => {
  const adjecentList = getAdjecentList(coordinatesList);
  return adjecentList.every((coordinates) => {
    const dom = document.querySelector(`[data-coordinates="${coordinates}"]`);
    const dataInfo = dom.getAttribute("data-info");
    return dataInfo === "free";
  });
};

export { checkDomPlacementValidity, removeDuplicateArr, filterAndSortArr };
