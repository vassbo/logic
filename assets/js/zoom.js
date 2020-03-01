// src: https://jsfiddle.net/MadLittleMods/QAnmN/

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

var viewportWidth2 = window.innerWidth - drawer_width;
var viewportHeight2 = window.innerHeight - top_height;

function updateMap(basedFromElement, mapElement, firstRun) {
    // var elementWidth = basedFromElement.children[0].offsetWidth;
    // var elementHeight = basedFromElement.children[0].offsetHeight;
    // var viewportWidth = basedFromElement.offsetWidth;
    // var viewportHeight = basedFromElement.offsetHeight;

    // console.log(viewportWidth2);
    // console.log(viewportHeight2);

    if(firstRun) {
      // mapElement.style.width = elementWidth * mapSizePercentage;
      // mapElement.style.height = elementHeight * mapSizePercentage;

      // mapElement.children[0].style.width = viewportWidth * mapSizePercentage / mapZoom / 10 + "px";
      // mapElement.children[0].style.height = viewportHeight * mapSizePercentage / mapZoom / 10 + "px";

      mapElement.children[0].style.width = viewportWidth2 * mapSizePercentage / mapZoom + "px";
      mapElement.children[0].style.height = viewportHeight2 * mapSizePercentage / mapZoom + "px";
    } else {
      // mapElement.children[0].style.width = viewportWidth * mapSizePercentage / mapZoom / 10 + "px";
      // mapElement.children[0].style.height = viewportHeight * mapSizePercentage / mapZoom / 10 + "px";
      // console.log(viewportWidth + " " + mapSizePercentage + " " + mapZoom);

      mapElement.children[0].style.width = viewportWidth2 * mapSizePercentage / mapZoom + "px";
      mapElement.children[0].style.height = viewportHeight2 * mapSizePercentage / mapZoom + "px";

      mapElement.children[0].style.top = ((getNumber(basedFromElement.style.top) * -1)) * mapSizePercentage + "px";
      mapElement.children[0].style.left = ((getNumber(basedFromElement.style.left) * -1)) * mapSizePercentage + "px";

      // console.log(basedFromElement.style.top);
      console.log(mapElement.children[0].style.top);
      console.log(mapElement.children[0].style.left);
    }
}
updateMap(document.querySelector('#main'), document.querySelector('.map_overlay'), true);

// Drag around
document.getElementById('main').addEventListener('mousedown', function(e) {
    clickPosX = e.pageX;
    clickPosY = e.pageY;
    document.querySelector('.clickPosX').innerHTML = clickPosX;
    document.querySelector('.clickPosY').innerHTML = clickPosY;

    oldPosX = e.pageX;
    oldPosY = e.pageY;

    if (e.target.closest(".component") == null) {
      dragging = true;
    }

    document.querySelector('.draggingIndicator').innerHTML = 'yes';

    // e.preventDefault(); // prevents the browser from adding their own cursor
    this.classList.add('cursordrag'); // Adds the custom grabbing hand cursor
    updateMap(document.querySelector('#main'), document.querySelector('.map_overlay'), false); // Update Map
});

document.addEventListener('mousemove', function(e) {
  if (dragging) {
    if (backgroundCanBeDragged == true && e.ctrlKey == false) {
      backgroundIsDragged = true;
      elem = document.getElementById("main");
      // console.log(getNumber(elem.style.top) + movePosY);
      movePosX = e.pageX;
      movePosY = e.pageY;
      // TODO: WIP:
      // movePosX = e.pageX / mapZoom;
      // movePosY = e.pageY / mapZoom;
      document.querySelector('.moveClickPosX').innerHTML = movePosX;
      document.querySelector('.moveClickPosY').innerHTML = movePosY;

      // console.log(oldPosX);
      // console.log(movePosX);

      if (dragging) {
        // if (getNumber(elem.style.top) + (oldPosY-movePosY) * -1 <= 0 && getNumber(elem.style.top) - window.innerHeight + top_height >= -10000) {
        if (getNumber(elem.style.top) + (oldPosY-movePosY) * -1 <= 0) {
          elem.style.top = getNumber(elem.style.top) + (oldPosY-movePosY) * -1 + "px";
        // } else if (getNumber(elem.style.top) - window.innerHeight + top_height <= -10000) {
        //   elem.style.top = -10000 + window.innerHeight - top_height + "px";
        } else {
          elem.style.top = "0px";
        }
        // if (getNumber(elem.style.left) + (oldPosX-movePosX) * -1 <= 0 && getNumber(elem.style.left) - window.innerWidth + drawer_width >= -10000) {
        if (getNumber(elem.style.left) + (oldPosX-movePosX) * -1 <= 0) {
          elem.style.left = getNumber(elem.style.left) + (oldPosX-movePosX) * -1 + "px";
        // } else if (getNumber(elem.style.left) - window.innerWidth + drawer_width <= -10000) {
        //   elem.style.left = -10000 + window.innerWidth - drawer_width + "px";
        } else {
          elem.style.left = "0px";
        }

        elem.style.marginLeft = 250 / mapZoom + "px";
        elem.style.marginTop = 40 / mapZoom + "px";

        console.log("---------");
        console.log(elem.style.top);
        console.log(elem.style.left);

        // console.log(0 / mapZoom);
        // console.log(0 / mapZoom);

        oldPosX = movePosX;
        oldPosY = movePosY;
      }

      updateMap(document.querySelector('#main'), document.querySelector('.map_overlay'), false); // Update Map
    }
  }
});

document.addEventListener('mouseup', function(e) {
  elem = document.getElementById("main");
  dragging = false;
  document.querySelector('.draggingIndicator').innerHTML = 'no';

  elem.classList.remove('cursordrag'); // Returns the cursor to default
});

// Now we can zoom in and out
document.getElementById('main').addEventListener('wheel', wheel);
document.getElementsByClassName("map_overlay")[0].addEventListener('wheel', wheel);
function wheel(event) {
  var elem = document.getElementById('main');
  var delta = Math.sign(event.deltaY) * -1;


  // Zoom
  var zoomFactor = delta * 0.1;

  console.log(Number(elem.style.zoom) + zoomFactor);
  console.log(delta);
  if (delta == -1 && Number(elem.style.zoom) + zoomFactor < 0.1) {
    elem.style.zoom = 0.1;
    mapZoom = 0.1;
  } else if (delta == 1 && Number(elem.style.zoom) + zoomFactor > 3.0) {
    elem.style.zoom = 3.0;
    mapZoom = 3.0;
  } else {
    elem.style.zoom = Number(elem.style.zoom) + zoomFactor;
    mapZoom = elem.style.zoom;
  }
  // console.log(mapZoom);
  document.querySelector('.zoomIndicator').innerHTML = Math.round(mapZoom * 100) + '%';

  console.log(movePosY);
  console.log(movePosX);

  // Offset main to corner
  // elem.style.top = (getNumber(elem.style.top) + window.innerHeight) / mapZoom + "px";
  // elem.style.left = (getNumber(elem.style.left) + window.innerWidth) / mapZoom + "px";
  /*$(elem).animate({
    style.top:$(elem).style.top() + movePosY,
    style.left: $(elem).style.left() + movePosX
  }, 1000);*/

  // if (getNumber(elem.style.top) <= 40) {
  //   elem.style.top = (getNumber(elem.style.top)) / mapZoom + "px";
  // } else {
  //   elem.style.top = 40 / mapZoom + "px";
  // }
  // if (getNumber(elem.style.left) <= 250) {
  //   elem.style.left = (getNumber(elem.style.left)) / mapZoom + "px";
  // } else {
  //   elem.style.left = 250 / mapZoom + "px";
  // }

  // TODO: ZOOM FROM CENTER / CURSOR POSITION
  // var rect = event.currentTarget.getBoundingClientRect(),
  // offsetX = event.clientX - rect.left,
  // offsetY = event.clientY - rect.top;

  // console.log(getNumber(elem.style.top));
  // console.log(window.innerHeight / 2);
  // elem.style.top = getNumber(elem.style.top) - (window.innerHeight / 2) + "px";
  // elem.style.left = getNumber(elem.style.left) - (window.innerWidth / 2) + "px";

  elem.style.marginLeft = 250 / mapZoom + "px";
  elem.style.marginTop = 40 / mapZoom + "px";


  // Move back to the original position
  // elem.style.top = getNumber(elem.style.top) - movePosY;
  // elem.style.left = getNumber(elem.style.left) - movePosX;
  /*$(elem).animate({
    style.top:$(elem).style.top() - movePosY,
    style.left: $(elem).style.left() - movePosX
  }, 1000);*/

  updateMap(document.querySelector('#main'), document.querySelector('.map_overlay'), false); // Update Map
  event.preventDefault();
}



//// minimap move

var mm_draggin = false;
document.getElementsByClassName("map_overlay")[0].addEventListener('mousedown', function(e) {
  mm_draggin = true;
  moveIndicator(e);
});
document.addEventListener('mouseup', function(e) {
  mm_draggin = false;
});


document.getElementsByClassName("map_overlay")[0].addEventListener('mousemove', moveIndicator);
function moveIndicator(e) {
  // console.log(e);
  mapElement = document.getElementsByClassName("map_overlay")[0];
  elem = mapElement.children[0];
  // mapElement.children[0].style.width = viewportWidth2 * mapSizePercentage / mapZoom + "px";
  // mapElement.children[0].style.height = viewportHeight2 * mapSizePercentage / mapZoom + "px";
  //
  // mapElement.children[0].style.top = ((getNumber(elem.style.top) * -1)) * mapSizePercentage + "px";
  // mapElement.children[0].style.left = ((getNumber(elem.style.left) * -1)) * mapSizePercentage + "px";


  if (e.type == "mousedown" || mm_draggin) {
    var rect = e.currentTarget.getBoundingClientRect(),
    offsetX = e.clientX - rect.left,
    offsetY = e.clientY - rect.top;

    elem.style.top = offsetY - (getNumber(elem.style.height) / 2) + "px";
    elem.style.left = offsetX - (getNumber(elem.style.width) / 2) + "px";


    console.log((offsetY * -1 / mapSizePercentage));
    console.log((offsetX * -1 / mapSizePercentage));

    // TODO: WIPWIPWIPWIPWIPWIPWIP
    document.querySelector('#main').style.top = offsetY * -1 / mapSizePercentage * 2 + 'px';
    document.querySelector('#main').style.left = offsetX * -1 / mapSizePercentage * 2 + 'px';
    // document.querySelector('#main').style.top = (offsetY * -1 / mapSizePercentage * 2) / 2 + 'px';
    // document.querySelector('#main').style.left = (offsetX * -1 / mapSizePercentage * 2) / 2 + 'px';
  }
}




function getNumber(input) {
  return Number(input.replace(/[A-Za-z]/g, ''));
}
