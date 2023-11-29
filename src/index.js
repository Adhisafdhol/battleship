import "normalize.css";
import "./style.css";
import { setUpAIBoard } from "./dom-ui/dom-ui";
import { Game } from "./dom-ui/game-dom-ui";
import { createLobbyDom } from "./dom-ui/lobby-ui";

function component() {
  const content = document.getElementById("content");

  const player1 = setUpAIBoard("player1");
  const player2 = setUpAIBoard("player2");

  content.appendChild(createLobbyDom());
  content.appendChild(Game(player1, player2));
}

component();
