import "normalize.css";
import "./style.css";
import {
  setUpGameboardDom,
  setUpPlayerBoard,
  setUpAIBoard,
} from "./dom-ui/dom-ui";

function component() {
  const content = document.getElementById("content");
  const gameDom = document.createElement("div");
  gameDom.classList.add("game");
  const vsText = document.createElement("div");
  vsText.classList.add("vs-text");
  vsText.textContent = "VS";

  const player1 = setUpAIBoard("player1");
  const player2 = setUpAIBoard("player2");

  gameDom.appendChild(setUpGameboardDom(player1));
  gameDom.appendChild(vsText);
  gameDom.appendChild(setUpGameboardDom(player2));
  content.appendChild(gameDom);
}

component();
