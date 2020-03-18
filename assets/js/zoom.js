// TODO: remove // DEBUG

// src: https://jsfiddle.net/MadLittleMods/QAnmN/

///// VARIABLES /////

var clickPosX = null;
var clickPosY = null;
var movePosX = null;
var movePosY = null;

var oldPosX = null;
var oldPosY = null;

var dragging = false;

var mapZoom = 1;

var mapSizePercentage = 0.02; // 200 / 10000

var backgroundCanBeDragged = true;

// var viewportWidth2 = window.innerWidth - getDrawerWidth();
// var viewportHeight2 = window.innerHeight - top_height;

if (getNumber(document.getElementById('main#' + active_tab).style.left) === "") {
  document.getElementById('main#' + active_tab).style.left = '-' + (document.getElementById('main#' + active_tab).offsetWidth / 2 - window.innerWidth / 2) + 'px';
}
if (getNumber(document.getElementById('main#' + active_tab).style.top) === "") {
  document.getElementById('main#' + active_tab).style.top = '-' + (document.getElementById('main#' + active_tab).offsetHeight / 2 - window.innerHeight / 2) + 'px';
}

window.addEventListener('resize', resize);
function resize() {
  updateMap(document.getElementById('main#' + active_tab), document.querySelector('.map_overlay'), true);
}

///// UPDATE MINIMAP /////

updateMap(document.getElementById('main#' + active_tab), document.querySelector('.map_overlay'), true);
function updateMap(basedFromElement, mapElement, firstRun) {
  // var elementWidth = basedFromElement.children[0].offsetWidth;
  // var elementHeight = basedFromElement.children[0].offsetHeight;
  // var viewportWidth = basedFromElement.offsetWidth;
  // var viewportHeight = basedFromElement.offsetHeight;

  // console.log(window.innerWidth - getDrawerWidth());
  // console.log(window.innerHeight - top_height);

  var borderSize = getNumber(window.getComputedStyle(document.querySelector('.map_outline'), null).getPropertyValue("border-width"));

  // mapElement.children[0].style.width = viewportWidth * mapSizePercentage / mapZoom / 10 + "px";
  // mapElement.children[0].style.height = viewportHeight * mapSizePercentage / mapZoom / 10 + "px";
  // console.log(viewportWidth + " " + mapSizePercentage + " " + mapZoom);

  mapElement.children[0].style.width = (window.innerWidth - getDrawerWidth()) * mapSizePercentage / mapZoom - borderSize * 1.8 + "px";
  mapElement.children[0].style.height = (window.innerHeight - top_height) * mapSizePercentage / mapZoom - borderSize * 2.2 + "px";

  mapElement.children[0].style.top = ((getNumber(basedFromElement.style.top) * -1)) * mapSizePercentage + "px";
  mapElement.children[0].style.left = ((getNumber(basedFromElement.style.left) * -1)) * mapSizePercentage + "px";

  // console.log(basedFromElement.style.top);
  // console.log(mapElement.children[0].style.top);
  // console.log(mapElement.children[0].style.left);
}


///// MAIN DRAG /////

document.getElementById('main#' + active_tab).addEventListener('mousedown', mainDrag);
function mainDrag(e) {
  if (e.target.id.includes('main#') && !e.ctrlKey) {
    clickPosX = e.pageX;
    clickPosY = e.pageY;
    document.querySelector('.clickPosX').innerHTML = clickPosX; // DEBUG
    document.querySelector('.clickPosY').innerHTML = clickPosY; // DEBUG

    oldPosX = e.pageX;
    oldPosY = e.pageY;

    if (e.target.closest(".component") == null) dragging = true;

    document.querySelector('.draggingIndicator').innerHTML = 'yes'; // DEBUG

    // e.preventDefault(); // prevents the browser from adding their own cursor
    this.classList.add('cursordrag'); // adds the custom grabbing hand cursor
    updateMap(document.getElementById('main#' + active_tab), document.querySelector('.map_overlay'), false); // update minimap
  }
}

document.addEventListener('mousemove', function(e) {
  if (dragging && !e.ctrlKey) {
    if (backgroundCanBeDragged == true && e.ctrlKey == false) {
      mainMoved = true;
      backgroundIsDragged = true;
      elem = document.getElementById("main#" + active_tab);
      // console.log(getNumber(elem.style.top) + movePosY);
      movePosX = e.pageX;
      movePosY = e.pageY;
      // TODO: WIP:
      // movePosX = e.pageX / mapZoom;
      // movePosY = e.pageY / mapZoom;
      document.querySelector('.moveClickPosX').innerHTML = movePosX; // DEBUG
      document.querySelector('.moveClickPosY').innerHTML = movePosY; // DEBUG

      // console.log(oldPosX);
      // console.log(movePosX);

      if (dragging) {
        // // if (getNumber(elem.style.top) + (oldPosY-movePosY) * -1 <= 0 && getNumber(elem.style.top) - window.innerHeight + top_height >= -10000) {
        // if (getNumber(elem.style.top) + (oldPosY-movePosY) * -1 <= 0) {
        //   elem.style.top = getNumber(elem.style.top) + (oldPosY-movePosY) * -1 + "px";
        // // } else if (getNumber(elem.style.top) - window.innerHeight + top_height <= -10000) {
        // //   elem.style.top = -10000 + window.innerHeight - top_height + "px";
        // } else elem.style.top = "0px";
        // // if (getNumber(elem.style.left) + (oldPosX-movePosX) * -1 <= 0 && getNumber(elem.style.left) - window.innerWidth + getDrawerWidth() >= -10000) {
        // if (getNumber(elem.style.left) + (oldPosX-movePosX) * -1 <= 0) {
        //   elem.style.left = getNumber(elem.style.left) + (oldPosX-movePosX) * -1 + "px";
        // // } else if (getNumber(elem.style.left) - window.innerWidth + getDrawerWidth() <= -10000) {
        // //   elem.style.left = -10000 + (window.innerWidth - getDrawerWidth()) + "px";
        // } else elem.style.left = "0px";

        elem.style.top = getNumber(elem.style.top) + (oldPosY-movePosY) * -1 + "px";
        elem.style.left = getNumber(elem.style.left) + (oldPosX-movePosX) * -1 + "px";

        elem.style.marginLeft = getDrawerWidth() / mapZoom + "px";
        elem.style.marginTop = top_height / mapZoom + "px";

        console.log("---------");
        console.log(elem.style.top);
        console.log(elem.style.left);

        // console.log(0 / mapZoom);
        // console.log(0 / mapZoom);

        oldPosX = movePosX;
        oldPosY = movePosY;

        checkMainPos();
      }

      updateMap(document.getElementById('main#' + active_tab), document.querySelector('.map_overlay'), false); // update minimap
    }
  } else document.getElementById("main#" + active_tab).classList.remove('cursordrag');
});

document.addEventListener('mouseup', function(e) {
  elem = document.getElementById("main#" + active_tab);
  dragging = false;
  setTimeout(function () { mainMoved = false; }, 10);
  document.querySelector('.draggingIndicator').innerHTML = 'no'; // DEBUG

  elem.classList.remove('cursordrag'); // returns the cursor to default
});


///// ZOOMING /////

var minZoom = 20, // %
    maxZoom = 300; // %
document.getElementById('main#' + active_tab).addEventListener('wheel', wheel);
document.getElementsByClassName("map_overlay")[0].addEventListener('wheel', wheel);
function wheel(e) {
  if (e.ctrlKey) {
    var elem = document.getElementById('main#' + active_tab);
    var delta = Math.sign(e.deltaY) * -1;

    // Zoom
    var zoomFactor = delta * (minZoom / 100);

    console.log(Number(elem.style.zoom) + zoomFactor);
    console.log(delta);
    if (delta == -1 && Number(elem.style.zoom) + zoomFactor < (minZoom / 100)) {
      elem.style.zoom = (minZoom / 100);
      mapZoom = (minZoom / 100);
    } else if (delta == 1 && Number(elem.style.zoom) + zoomFactor > (maxZoom / 100)) {
      elem.style.zoom = (maxZoom / 100);
      mapZoom = (maxZoom / 100);
    } else {
      elem.style.zoom = Number(elem.style.zoom) + zoomFactor;
      mapZoom = elem.style.zoom;
    }
    // console.log(mapZoom);
    document.querySelector('.zoomIndicator').innerHTML = Math.round(mapZoom * 100) + '%'; // DEBUG

    var percent = Math.round(mapZoom * 100);
    document.getElementById('zoomSlider').value = percent;
    if (percent.toString().length <= 2) percent = '&nbsp;&nbsp;' + percent;
    document.getElementById('zoomValue').innerHTML = percent + '%';

    console.log(movePosY);
    console.log(movePosX);

    // Offset main to corner
    // elem.style.top = (getNumber(elem.style.top) + window.innerHeight) / mapZoom + "px";
    // elem.style.left = (getNumber(elem.style.left) + window.innerWidth) / mapZoom + "px";
    /*$(elem).animate({
      style.top:$(elem).style.top() + movePosY,
      style.left: $(elem).style.left() + movePosX
    }, 1000);*/

    // if (getNumber(elem.style.top) <= top_height) {
    //   elem.style.top = (getNumber(elem.style.top)) / mapZoom + "px";
    // } else {
    //   elem.style.top = top_height / mapZoom + "px";
    // }
    // if (getNumber(elem.style.left) <= getDrawerWidth()) {
    //   elem.style.left = (getNumber(elem.style.left)) / mapZoom + "px";
    // } else {
    //   elem.style.left = getDrawerWidth() / mapZoom + "px";
    // }

    // TODO: ZOOM FROM CENTER / CURSOR POSITION
    // var rect = e.currentTarget.getBoundingClientRect(),
    // offsetX = e.clientX - rect.left,
    // offsetY = e.clientY - rect.top;

    // console.log(getNumber(elem.style.top));
    // console.log(window.innerHeight / 2);
    // elem.style.top = getNumber(elem.style.top) - (window.innerHeight / 2) + "px";
    // elem.style.left = getNumber(elem.style.left) - (window.innerWidth / 2) + "px";

    elem.style.marginLeft = getDrawerWidth() / mapZoom + "px";
    elem.style.marginTop = top_height / mapZoom + "px";


    // Move back to the original position
    // elem.style.top = getNumber(elem.style.top) - movePosY;
    // elem.style.left = getNumber(elem.style.left) - movePosX;
    /*$(elem).animate({
      style.top:$(elem).style.top() - movePosY,
      style.left: $(elem).style.left() - movePosX
    }, 1000);*/

    checkMainPos();

  } else {

    // TODO: Smoother scroll!?
    if (e.shiftKey) { // scroll right
      if (Math.sign(e.deltaY) == -1) document.getElementById('main#' + active_tab).style.left = getNumber(document.getElementById('main#' + active_tab).style.left) + 110 + 'px'; // up
      else if (Math.sign(e.deltaY) == 1) document.getElementById('main#' + active_tab).style.left = getNumber(document.getElementById('main#' + active_tab).style.left) - 110 + 'px'; // down
    } else { // scroll down
      if (Math.sign(e.deltaY) == -1) document.getElementById('main#' + active_tab).style.top = getNumber(document.getElementById('main#' + active_tab).style.top) + 110 + 'px'; // up
      else if (Math.sign(e.deltaY) == 1) document.getElementById('main#' + active_tab).style.top = getNumber(document.getElementById('main#' + active_tab).style.top) - 110 + 'px'; // down
    }

    checkMainPos();
  }

  updateMap(document.getElementById('main#' + active_tab), document.querySelector('.map_overlay'), false); // update minimap
  e.preventDefault();
}


// check if main is outside screen
function checkMainPos() {
  var main = document.getElementById('main#' + active_tab);
  if (getNumber(main.style.top) <= ((main.offsetHeight * -1) + (window.innerHeight - top_height) / mapZoom)) {
    main.style.top = ((main.offsetHeight * -1) + (window.innerHeight - top_height) / mapZoom) + 'px';
  } else if (getNumber(main.style.top) > 0) main.style.top = '0px';

  if (getNumber(main.style.left) <= ((main.offsetWidth * -1) + (window.innerWidth - getDrawerWidth()) / mapZoom)) {
    main.style.left = ((main.offsetWidth * -1) + (window.innerWidth - getDrawerWidth()) / mapZoom) + 'px';
  } else if (getNumber(main.style.left) > 0) main.style.left = '0px';
}


///// MINIMAP MOVE /////

var mm_draggin = false;
document.querySelector(".map_overlay").addEventListener('mousedown', function(e) {
  mm_draggin = true;
  moveIndicator(e);
});
document.addEventListener('mouseup', function(e) { mm_draggin = false; });

document.addEventListener('mousemove', moveIndicator);
function moveIndicator(e) {
  mapElement = document.querySelector(".map_overlay");
  elem = mapElement.children[0]; // map_outline
  // mapElement.children[0].style.width = (window.innerWidth - getDrawerWidth()) * mapSizePercentage / mapZoom + "px";
  // mapElement.children[0].style.height = (window.innerHeight - top_height) * mapSizePercentage / mapZoom + "px";
  //
  // mapElement.children[0].style.top = ((getNumber(elem.style.top) * -1)) * mapSizePercentage + "px";
  // mapElement.children[0].style.left = ((getNumber(elem.style.left) * -1)) * mapSizePercentage + "px";


  if (e.type == "mousedown" || mm_draggin) {
    var rect = mapElement.getBoundingClientRect(), // map (.querySelector('.map_outline'))
    offsetX = e.clientX - rect.left,
    offsetY = e.clientY - rect.top;

    // var width = rect.width / 2;
    // var height = rect.height / 2;

    var boxWidth = getNumber(elem.style.width);
    var boxHeight = getNumber(elem.style.height);

    // console.log(e.currentTarget.classList[0]);

    var borderSize = getNumber(window.getComputedStyle(document.querySelector('.map_outline'), null).getPropertyValue("border-width"));

    elem.style.left = offsetX - boxWidth / 2 + "px";
    elem.style.top = offsetY - boxHeight / 2 + "px";

    if (getNumber(elem.style.left) <= 0) {
      elem.style.left = "0px";
    } else if (getNumber(elem.style.left) + boxWidth + borderSize * 1.8 >= 200) {
      elem.style.left = 200 - boxWidth - borderSize * 1.8 + "px";
    }
    if (getNumber(elem.style.top) <= 0) {
      elem.style.top = "0px";
    } else if (getNumber(elem.style.top) + boxHeight + borderSize * 2.2 >= 200) {
      elem.style.top = 200 - boxHeight - borderSize * 2.2 + "px";
    }


    console.log((offsetX * -1 / mapSizePercentage));
    console.log((offsetY * -1 / mapSizePercentage));

    // TODO: WIPWIPWIPWIPWIPWIPWIP
    document.getElementById('main#' + active_tab).style.left = (offsetX / 2) * -1 / mapSizePercentage * 2 + 'px';
    document.getElementById('main#' + active_tab).style.top = (offsetY / 2) * -1 / mapSizePercentage * 2 + 'px';

    // console.log(offsetX - width);
    // document.getElementById('main#' + active_tab).style.left = (offsetX - boxWidth / 2) * -1 / mapSizePercentage + 'px';

    // document.getElementById('main#' + active_tab).style.left = (offsetX * -1 / mapSizePercentage * 2) / 2 + 'px';
    // document.getElementById('main#' + active_tab).style.top = (offsetY * -1 / mapSizePercentage * 2) / 2 + 'px';

    checkMainPos();
  }
}
