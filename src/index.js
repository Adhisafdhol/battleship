import "normalize.css";
import "./style.css";
import { createLobbyDom } from "./dom-ui/lobby-ui";

function component() {
  const content = document.getElementById("content");
  content.appendChild(createLobbyDom());
}

component();
