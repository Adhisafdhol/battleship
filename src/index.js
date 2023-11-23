import "normalize.css";
import "./style.css";
import { setUpGameboardDom } from "./dom-ui/dom-ui";

function component() {
  const content = document.getElementById("content");
  const gameDom = document.createElement("div");
  gameDom.classList.add("game");
  const vsText = document.createElement("div");
  vsText.classList.add("vs-text");
  vsText.textContent = "VS";
  gameDom.appendChild(setUpGameboardDom());
  gameDom.appendChild(vsText);
  gameDom.appendChild(setUpGameboardDom());
  content.appendChild(gameDom);
}

component();
