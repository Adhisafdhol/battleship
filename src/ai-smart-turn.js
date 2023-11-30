import { getAttributeArr } from "./dom-ui/drag-and-drop";
import {
  filterAndSortArr,
  removeDuplicateArr,
} from "./dom-ui/placement-dom-logic";
import { randomIndex, getAdjecentList } from "./placement-logic";

const getAIAdjecentList = (coordinates) => {
  const adjecentList = [
    [coordinates[0] - 1, coordinates[1]],
    [coordinates[0] + 1, coordinates[1]],
    [coordinates[0], coordinates[1] - 1],
    [coordinates[0], coordinates[1] + 1],
  ];

  return adjecentList.filter(
    (item) => item[0] >= 0 && item[0] <= 9 && item[1] >= 0 && item[1] <= 9,
  );
};

const tagDomOrientation = (dom1, dom2) => {
  const target1 = dom1;
  const target2 = dom2;
  const dom1Coordinates = getAttributeArr(dom1, "data-coordinates");
  const dom2Coordinates = getAttributeArr(dom2, "data-coordinates");
  if (dom1Coordinates[0] === dom2Coordinates[0]) {
    target1.classList.add("row");
    target2.classList.add("row");
  } else {
    target1.classList.add("column");
    target2.classList.add("column");
  }
};

const getAIRowAdjecentList = (coordinates) => {
  const rowAdjecentList = [
    [coordinates[0], coordinates[1] - 1],
    [coordinates[0], coordinates[1] + 1],
  ];

  return rowAdjecentList.filter(
    (item) => item[0] >= 0 && item[0] <= 9 && item[1] >= 0 && item[1] <= 9,
  );
};

const getAIColumnAdjecentList = (coordinates) => {
  const columnAdjecentList = [
    [coordinates[0] - 1, coordinates[1]],
    [coordinates[0] + 1, coordinates[1]],
  ];

  return columnAdjecentList.filter(
    (item) => item[0] >= 0 && item[0] <= 9 && item[1] >= 0 && item[1] <= 9,
  );
};

const getAIOrientationAdjecentList = (coordinates, orientation) => {
  if (orientation === "row") {
    return getAIRowAdjecentList(coordinates);
  }

  return getAIColumnAdjecentList(coordinates);
};

const getFreeAdjecentList = (adjecentList, opponentBoard) => {
  const domList = [];
  adjecentList.forEach((coordinates) => {
    const dom = opponentBoard.querySelector(
      `[data-coordinates="${coordinates}"]`,
    );
    const dataStatus = dom.getAttribute("data-status");
    if (dataStatus === "free") {
      domList.push(getAttributeArr(dom, "data-coordinates"));
    }
  });

  return domList;
};

const checkAdjecentListDom = (adjecentList, opponentBoard) =>
  adjecentList.every((coordinates) => {
    const dom = opponentBoard.querySelector(
      `[data-coordinates="${coordinates}"]`,
    );
    return !(
      dom.classList.contains("taggedChecked") ||
      dom.classList.contains("taggedUnchecked")
    );
  });

const checkForTaggedDom = (targetDom, board, opponentBoard) => {
  const container = [];
  targetDom.forEach((dom) => {
    const coordinates = getAttributeArr(dom, "data-coordinates");
    const adjecentList = getAdjecentList(coordinates, board).map(
      (index) => board[index].coordinates,
    );
    if (checkAdjecentListDom(adjecentList, opponentBoard)) {
      container.push(coordinates);
    }
  });

  return container;
};

const getCalculatedSpaceMove = (board, opponentBoard) => {
  const freeDom = opponentBoard.querySelectorAll('[data-status="free"]');
  const container = checkForTaggedDom(freeDom, board, opponentBoard);
  const filteredAndSorted = removeDuplicateArr(filterAndSortArr(container));
  return filteredAndSorted[randomIndex(filteredAndSorted.length)];
};

const getFreeOrientationAdjecentList = (dom, orientation, opponentBoard) => {
  const coordinates = getAttributeArr(dom, "data-coordinates");
  const rowAdjecentList = getAIOrientationAdjecentList(
    coordinates,
    orientation,
  );
  return getFreeAdjecentList(rowAdjecentList, opponentBoard);
};

const makeCalculatedSpaceMove = (
  taggedDoms,
  coordinates,
  opponent,
  opponentBoard,
) => {
  const dom = taggedDoms[0];
  const taggedDomCoordinates = getAttributeArr(dom, "data-coordinates");
  const adjecentList = getAIAdjecentList(taggedDomCoordinates);
  const adjecentDom = getFreeAdjecentList(adjecentList, opponentBoard);
  const freeAdjecentDom = checkForTaggedDom(
    adjecentDom.map((coord) =>
      opponentBoard.querySelector(`[data-coordinates="${coord}"]`),
    ),
    opponent.board.board,
    opponentBoard,
  );
  if (freeAdjecentDom.length === 0) {
    dom.classList.remove("tagged-unchecked");
    dom.classList.add("tagged-checked");
    return coordinates;
  }

  console.log({ freeAdjecentDom });
  const calculatedCoordinates =
    freeAdjecentDom[randomIndex(freeAdjecentDom.length)];
  const selectedDom = opponentBoard.querySelector(
    `[data-coordinates="${calculatedCoordinates}"`,
  );

  if (selectedDom.classList.contains("ship")) {
    tagDomOrientation(dom, selectedDom);
    dom.classList.remove("tagged-unchecked");
    dom.classList.add("tagged-checked");
  }
  return calculatedCoordinates;
};

const makeCalculatedOrientationMove = (
  taggedDom,
  orientation,
  opponentBoard,
) => {
  if (taggedDom.length === 0) {
    return null;
  }
  const slicedTaggedDom = Array.from(taggedDom).slice(1);

  const freeOrientationAdjecentList = getFreeOrientationAdjecentList(
    taggedDom[0],
    orientation,
    opponentBoard,
  );

  if (freeOrientationAdjecentList.length < 1) {
    taggedDom[0].classList.remove("tagged-unchecked");
    taggedDom[0].classList.add("tagged-checked");
    return makeCalculatedOrientationMove(
      slicedTaggedDom,
      orientation,
      opponentBoard,
    );
  }

  if (freeOrientationAdjecentList.length <= 1) {
    taggedDom[0].classList.add(`${orientation}-checked`);
    taggedDom[0].classList.remove(`${orientation}`);
  }

  if (freeOrientationAdjecentList.length > 0 && taggedDom[0] !== null) {
    taggedDom[0].classList.remove("tagged-unchecked");
    taggedDom[0].classList.add("tagged-checked");
    const orientationCoordinates =
      freeOrientationAdjecentList[
        randomIndex(freeOrientationAdjecentList.length)
      ];
    const selectedDom = opponentBoard.querySelector(
      `[data-coordinates="${orientationCoordinates}"]`,
    );

    if (selectedDom.classList.contains("ship")) {
      tagDomOrientation(taggedDom[0], selectedDom);
    }
    return orientationCoordinates;
  }
};

const aiSmartMove = (
  taggedOrientationDom,
  taggedDom,
  coordinates,
  orientation,
  opponentBoard,
  opponent,
) => {
  console.log(taggedOrientationDom);
  if (taggedOrientationDom.length > 0) {
    const orientationCoordinates = makeCalculatedOrientationMove(
      taggedOrientationDom,
      orientation,
      opponentBoard,
    );

    if (orientationCoordinates !== null) {
      return orientationCoordinates;
    }

    if (taggedDom.length > 0) {
      return makeCalculatedSpaceMove(
        taggedDom,
        coordinates,
        opponent,
        opponentBoard,
      );
    }

    return coordinates;
  }

  return coordinates;
};

const aiMakeAMove = (boardDom, player, opponent) => {
  const opponentBoard = boardDom.querySelector(
    `[data-name="${opponent.player.name}"]`,
  );
  const coordinates = getCalculatedSpaceMove(
    opponent.board.board,
    opponentBoard,
  );

  const taggedDoms = opponentBoard.querySelectorAll(".tagged-unchecked");
  const taggedRowDom = opponentBoard.querySelectorAll(".row");
  const taggedColumnDom = opponentBoard.querySelectorAll(".column");
  if (taggedRowDom.length > 0) {
    return aiSmartMove(
      taggedRowDom,
      taggedDoms,
      coordinates,
      "row",
      opponentBoard,
      opponent,
    );
  }
  if (taggedColumnDom.length > 0) {
    return aiSmartMove(
      taggedColumnDom,
      taggedDoms,
      coordinates,
      "column",
      opponentBoard,
      opponent,
    );
  }

  if (taggedDoms.length > 0) {
    return makeCalculatedSpaceMove(
      taggedDoms,
      coordinates,
      opponent,
      opponentBoard,
    );
  }
  return coordinates;
};

export default aiMakeAMove;
