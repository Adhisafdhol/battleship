import "normalize.css";
import "./style.css";
import { setUpAIBoard } from "./dom-ui/dom-ui";
import { Game } from "./dom-ui/game-dom-ui";
import { shipPlacementDom } from "./dom-ui/ship-placement-ui";

function component() {
  const content = document.getElementById("content");

  const player1 = setUpAIBoard("player1");
  const player2 = setUpAIBoard("player2");

  content.appendChild(shipPlacementDom());
  content.appendChild(Game(player1, player2));
}

component();
