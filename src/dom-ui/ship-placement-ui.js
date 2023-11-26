import { addAttributesToEl, createElWithClassAndText } from "./dom-method";
import { setUpPlayerBoard } from "./dom-ui";

const createRowsFromBoard = (board, rowLength) => {
  const rows = [];

  for (let i = 0; i < board.length / rowLength; i += 1) {
    const row = [];
    for (let j = 0; j < board.length / rowLength; j += 1) {
      row.push(board[Number(i.toString() + j.toString())]);
    }
    rows.push(row);
  }

  return rows;
};

const createGameboardRowDom = (rowDom, rowArr) => {
  rowArr.forEach((square) => {
    const squareDom = createElWithClassAndText("td", "square");
    addAttributesToEl(
      squareDom,
      ["data-coordinates", "data-status"],
      [`${square.coordinates}`, `${square.status}`],
    );
    rowDom.appendChild(squareDom);
  });
};

const createRowDom = (rowDom, rowArr) => {
  rowArr.forEach((item) => {
    const dom = createElWithClassAndText("td", "", item);
    rowDom.appendChild(dom);
  });
};

const createColumnHeader = () => {
  const th = document.createElement("tr");
  th.appendChild(createElWithClassAndText("td"));
  createRowDom(th, ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]);

  return th;
};

const createGameboardTable = (player) => {
  const boardDom = createElWithClassAndText("table", "gameboard");
  boardDom.setAttribute("data-name", `${player.player.name}`);
  boardDom.appendChild(createColumnHeader());
  const rows = createRowsFromBoard(player.board.board, 10);
  rows.forEach((row, index) => {
    const rowDom = document.createElement("tr");
    const rowHead = createElWithClassAndText("td", "", index + 1);

    rowDom.appendChild(rowHead);
    createGameboardRowDom(rowDom, row);
    boardDom.appendChild(rowDom);
  });
  return boardDom;
};

const shipPlacementDom = () => {
  const lobby = createElWithClassAndText("div", "harbor");
  const player = setUpPlayerBoard("player1");
  const playerDom = createGameboardTable(player);
  lobby.appendChild(playerDom);
  return lobby;
};

export { shipPlacementDom };
