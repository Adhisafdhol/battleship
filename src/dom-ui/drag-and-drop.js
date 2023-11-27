function dragstartHandler(ev) {
  // Add the target element's id to the data transfer object
  ev.dataTransfer.setData("text/plain", ev.target.id);
}

function dragoverHandler(ev) {
  const el = ev;
  el.preventDefault();
  el.dataTransfer.dropEffect = "move";
}

function dropHandler(ev) {
  ev.preventDefault();
  // Get the id of the target and add the moved element to the target's DOM
  const data = ev.dataTransfer.getData("text/plain");
  console.log(ev.target);
  console.log({ data });
  ev.target.appendChild(document.getElementById(data));
}
export { dragstartHandler, dragoverHandler, dropHandler };
