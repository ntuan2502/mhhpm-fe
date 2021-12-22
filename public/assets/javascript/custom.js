const parent = document.querySelector(".parent");
let mouseDown = false;
let startX, scrollLeft;
console.log(parent);

let startDragging = function (e) {
  mouseDown = true;
  startX = e.pageX - parent.offsetLeft;
  scrollLeft = parent.scrollLeft;
};
let stopDragging = function (event) {
  mouseDown = false;
};

parent.addEventListener("mousemove", (e) => {
  e.preventDefault();
  if (!mouseDown) {
    return;
  }
  const x = e.pageX - parent.offsetLeft;
  const scroll = x - startX;
  parent.scrollLeft = scrollLeft - scroll;
});

// Add the event listeners
parent.addEventListener("mousedown", startDragging, false);
parent.addEventListener("mouseup", stopDragging, false);
parent.addEventListener("mouseleave", stopDragging, false);
