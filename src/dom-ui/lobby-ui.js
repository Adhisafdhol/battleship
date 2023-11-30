import { createElWithClassAndText } from "./dom-method";
import { setUpPlayerBoard, setUpAIBoard, populateBoard } from "./dom-ui";
import { createGameboardTable, createShipDom } from "./ship-placement-ui";
import { getAttributeArr } from "./drag-and-drop";
import Ship from "../ship";
import { Game } from "./game-dom-ui";

const createGreetingDom = () => {
  const greeting = createElWithClassAndText(
    "h2",
    "greeting",
    "It's time to place your battleships Commander!",
  );

  return greeting;
};

const getAllShipsData = () => {
  const ships = [];
  for (let i = 0; i < 10; i += 1) {
    const shipDom = document.getElementById(`${i}`);
    const coordinates = getAttributeArr(shipDom, "data-head");
    const orientation = shipDom.getAttribute("data-orientation");
    const length = Number(shipDom.getAttribute("data-length"));
    ships.push({ coordinates, orientation, length });
  }

  return ships;
};

const removeLobby = (parentDom) => {
  const lobby = document.querySelector(".harbor");
  if (lobby) {
    parentDom.removeChild(lobby);
  }
};

const appendGameDom = (parentDom, dom) => {
  const gameDom = document.querySelector(".game");
  if (gameDom) {
    parentDom.replaceChild(dom, gameDom);
  } else {
    parentDom.appendChild(dom);
  }
};

const startGame = () => {
  const content = document.getElementById("content");
  const player1 = setUpPlayerBoard("player1");
  const { board } = player1;
  const ships = getAllShipsData();
  const player2 = setUpAIBoard("AI");

  ships.forEach((ship) => {
    board.placeShip(ship.coordinates, Ship(ship.length), ship.orientation);
  });

  removeLobby(content);
  const gameDom = Game(player1, player2);
  appendGameDom(content, gameDom);
};

const createStartGameBtn = () =>
  createElWithClassAndText("button", "start-btn", "Start");

const createLobbyDom = () => {
  const lobby = createElWithClassAndText("div", "harbor");
  const player = setUpPlayerBoard("player1");
  populateBoard(player.board);
  const greeting = createGreetingDom();
  const lobbyContainer = createElWithClassAndText("div", "lobby-container");
  const mainLobbyContainer = createElWithClassAndText(
    "div",
    "main-lobby-container",
  );
  const gameboardContainer = createElWithClassAndText(
    "div",
    "gameboard-container",
  );

  const playerDom = createGameboardTable(player);
  createShipDom(player.board, playerDom);

  const startBtnContainer = createElWithClassAndText(
    "div",
    "start-btn-container",
  );
  const startGameBtn = createStartGameBtn();
  startGameBtn.addEventListener("click", startGame);
  startBtnContainer.appendChild(startGameBtn);
  mainLobbyContainer.appendChild(greeting);
  gameboardContainer.appendChild(playerDom);
  mainLobbyContainer.appendChild(gameboardContainer);
  mainLobbyContainer.appendChild(startBtnContainer);
  lobbyContainer.appendChild(mainLobbyContainer);
  lobby.appendChild(lobbyContainer);

  return lobby;
};

export default createLobbyDom;
