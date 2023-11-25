import { updateStatusDom, setUpGameboardDom } from "./dom-ui";
import { setMultipleBorderColor, setRandomColor } from "./color-changing";
import createElWithClassAndText from "./dom-method";

const colors = [
  "#65dc98",
  "#ff2a6d",
  "#05d9e8",
  "#defe47",
  "#d1f7ff",
  "#7700a6",
  "#1afe49",
];

const announceWinner = (player1, player2) => {
  if (player1.board.haveAllShipsSunk()) {
    console.log(`${player2.player.name.toUpperCase()} WON!`);
  } else {
    console.log(`${player1.player.name.toUpperCase()} WON!`);
  }
};

const gameOver = (player1, player2) =>
  player1.board.haveAllShipsSunk() || player2.board.haveAllShipsSunk();

const checkAllShips = (player1, player2) => {
  if (gameOver(player1, player2)) {
    announceWinner(player1, player2);
  }
};

const waitForDomUpdate = (dom, keyName, key) =>
  new Promise((resolve, reject) => {
    if (dom.getAttribute(keyName) === key) {
      resolve(`${keyName} is ${key}`);
    } else {
      reject(new Error(`${keyName} is not ${key}`));
    }
  });

const attackOpponentBoard = (dom, coordinates, player, opponent) => {
  player.player.attack(coordinates, opponent.board, "receiveAttack");
  updateStatusDom(dom, opponent.board.getCoordinates(coordinates).status);
  setMultipleBorderColor(colors, dom);
  waitForDomUpdate(dom, "data-status", "targeted").then(() => {
    checkAllShips(player, opponent);
  });
};

const findDomChildrenByAttribute = (parentDom, attribute, key) =>
  parentDom.querySelector(`[${attribute} = "${key}"]`);

const colorShip = (colorsArr, dom, coordinates, opponent) => {
  if ("ship" in opponent.board.getCoordinates(coordinates)) {
    setRandomColor(colorsArr, dom, "backgroundColor");
  }
};

const aITakeATurn = (parentDom, player, opponent) => {
  const { coordinates } =
    opponent.board.board[player.player.randomMove(opponent.board.board)];
  const dom = findDomChildrenByAttribute(
    parentDom,
    "data-coordinates",
    `${coordinates}`,
  );

  attackOpponentBoard(dom, coordinates, player, opponent);
  colorShip(colors, dom, coordinates, opponent);
};

const playerTakeATurn = (
  playerDom,
  opponentDom,
  coordinates,
  player,
  opponent,
) => {
  attackOpponentBoard(playerDom, coordinates, player, opponent);
  if (!gameOver(player, opponent)) {
    aITakeATurn(opponentDom.parentElement, opponent, player);
  }
};

const checkTurnValidity = (
  playerDom,
  opponentDom,
  coordinates,
  player,
  opponent,
  fn,
) => {
  if (
    playerDom.getAttribute("data-status") === "free" &&
    !opponent.board.haveAllShipsSunk()
  ) {
    fn(playerDom, opponentDom, coordinates, player, opponent);
  }
};

const registerAttack = (
  playerDom,
  opponentDom,
  coordinates,
  player,
  opponent,
  fn,
) => {
  checkTurnValidity(playerDom, opponentDom, coordinates, player, opponent, fn);
};

const getDomCoordinates = (dom) =>
  dom
    .getAttribute("data-coordinates")
    .split(",")
    .map((num) => Number(num));

const Game = (player1, player2) => {
  const gameDom = createElWithClassAndText("div", "game");
  const vsText = createElWithClassAndText("div", "vs-text", "VS");
  const player1Dom = setUpGameboardDom(player1);
  const player2Dom = setUpGameboardDom(player2);
  player2Dom.childNodes.forEach((node) => {
    node.addEventListener(
      "click",
      registerAttack.bind(
        this,
        node,
        player2Dom,
        getDomCoordinates(node),
        player1,
        player2,
        playerTakeATurn,
      ),
    );
  });

  gameDom.appendChild(player1Dom);
  gameDom.appendChild(vsText);
  gameDom.appendChild(player2Dom);

  return gameDom;
};

export { Game, registerAttack, playerTakeATurn, aITakeATurn };
