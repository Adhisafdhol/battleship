import { createElWithClassAndText } from "./dom-method";
import createLobbyDom from "./lobby-ui";

const removeGameDom = (parentDom) => {
  const game = document.querySelector(".game");
  if (game) {
    parentDom.removeChild(game);
  }
};

const removePopUp = (parentDom) => {
  const popUp = document.querySelector(".winner-container");
  if (popUp) {
    parentDom.removeChild(popUp);
  }
};

const restartGame = () => {
  const content = document.getElementById("content");
  removeGameDom(content);
  removePopUp(content);
  content.appendChild(createLobbyDom());
};

const createWinnerDom = (winner) => {
  const winnerDomContainer = createElWithClassAndText(
    "div",
    "winner-container",
  );
  const winnerDom = createElWithClassAndText(
    "div",
    "winner-dom",
    `${winner.toUpperCase()} WON!`,
  );

  const restartBtn = createElWithClassAndText("button", "restart", "restart");
  restartBtn.addEventListener("click", restartGame);
  winnerDomContainer.appendChild(winnerDom);
  winnerDomContainer.appendChild(restartBtn);
  return winnerDomContainer;
};

export default createWinnerDom;
