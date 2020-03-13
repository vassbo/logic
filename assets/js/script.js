
// TODO: ZOOM
// TODO: add components

// TODO: "legg på linje"

// TODO: Settings:
// TODO: dark theme
// TODO: langs??
// TODO: dotted/lines/blank "paper"
// TODO: straight lines, curved lines, 100% straight lines (90 degree turns)

// TODO: show "red" if nothing has connected......
// TODO: show many helpers......

// TODO: last moved has higher z-index...


// TODO: move sekected component(s) with arrow keys
// TODO: delete with context "delete"

// TODO: selection box


// TODO: simulation mode... (no drag / selection)



// TODO: "repeaters" with delay



// TODO: no context menu when settings menu++ is open..


// TODO: move all selected elements

// TODO: 'legg på linje'


// TODO: deleting an active line/element, will not deactivate connected lamp...
// TODO: move elems to top on move


// updateSignal | lineConnections | elementsIsideBox


/////////////////////
///// VARIABLES /////
/////////////////////

///// SETTINGS /////

var setting_lineType = "lined"; // straight / lined

var setting_lineColor_idle = "#b00000";
var setting_lineColor_powered = "red";
// var setting_lineColor_idle = "white";
// var setting_lineColor_powered = "#008eff";

var setting_theme = "light";

var setting_background = "dotted";

///// GLOBAL /////

var top_height = document.getElementById("top").offsetHeight;
var drawer_width = document.getElementById("drawer").offsetWidth;

var active = true;

/////////////////////
///// DRAGGABLE /////
/////////////////////

var connectorPosX, connectorPosY, startingConnect;
var moved = false; // connection drag move
var clone;
function dragElement(elmnt, drawer) {
  var cursor = { movedX: 0, movedY: 0, x: 0, y: 0 };

  elmnt.onmousedown = dragMouseDown;
  function dragMouseDown(e) {
    e = e || window.event;
    if (!e.target.classList.contains("clock_input") || e.target.closest("#drawer") !== null) {
      e.preventDefault();

      // get the mouse cursor position at startup:
      cursor.x = e.clientX;
      cursor.y = e.clientY;
      if (!e.target.classList.contains("connector")) { // mvoe elem
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
      } else { // move line
        startingConnect = e.target;
        connectorPosX = getNumber(e.target.closest(".component").style.left);
        connectorPosY = getNumber(e.target.closest(".component").style.top);
        document.onmouseup = closeDragConnector;
        document.onmousemove = dragConnector;
      }
    }
  }

  var starting = {};
  function elementDrag(e) { // TODO: mapZoom (drag from drawer)
    e = e || window.event;
    e.preventDefault();

    var cloned = true;
    if (active) {
      starting.x = e.clientX;
      starting.y = e.clientY;
      cloned = false;
    }
    backgroundCanBeDragged = false;
    active = false;

    cursor.movedX = cursor.x - e.clientX;
    cursor.movedY = cursor.y - e.clientY;
    cursor.x = e.clientX;
    cursor.y = e.clientY;
    if (drawer) {
      if (!cloned) {
        clone = elmnt.cloneNode(true);
        clone.classList.add("component", "ghostElem");
        clone.querySelector(".label").remove();
        document.getElementById("main").appendChild(clone);

        clone.style.top = elmnt.offsetTop - getNumber(document.getElementById("main").style.top) + "px";
        clone.style.left = elmnt.offsetLeft - drawer_width - getNumber(document.getElementById("main").style.left) + "px";
        clone.style.opacity = "0.3";
        clone.style.zIndex = "11";
      }

      setStyle(clone, (clone.offsetLeft - cursor.movedX / mapZoom), (clone.offsetTop - cursor.movedY / mapZoom));

      if (e.clientX > drawer_width && e.clientY > top_height) clone.style.opacity = "0.7"; // elem clone inside main div
      else clone.style.opacity = "0.3";
    } else {
      setStyle(elmnt, (elmnt.offsetLeft - cursor.movedX / mapZoom), (elmnt.offsetTop - cursor.movedY / mapZoom));
      moveSVG(elmnt);
    }
  }

  function closeDragElement(e) {
    var amountMoved = Math.round(Math.sqrt(Math.pow(starting.y - event.pageY, 2) + Math.pow(starting.x - event.pageX, 2)));
    if (amountMoved < 10) active = true;
    moved = false;
    backgroundCanBeDragged = true;
    setTimeout(function() { active = true; }, 10);

    if (drawer) {
      if (e.pageX > drawer_width && e.pageY > top_height) {
        clone.style.opacity = null;
        clone.style.zIndex = null;
        clone.classList.remove('ghostElem');

        var type = clone.classList[0];
        if (type == "box") type = clone.children[0].classList[0];
        if (type == "clock") {
          clone.querySelector(".clock_input").id = "clockInput#" + clockInputs;
          clone.querySelector(".clock_input").removeAttribute('tabindex');
          clockInputs++;
        }

        addListener(clone);
        dragElement(clone);
        addConnection(clone, type);
        checkForNoConnections();
        clone = undefined;
      } else if (clone !== undefined) clone.remove();
    }

    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }

  var first = true;
  var svg = document.getElementById("SVGdiv");
  var originalSVG = document.getElementById("SVGdiv").innerHTML;
  var storePrevious = svg, allMatchingConnectors = [];
  function dragConnector(e) {
    moved = true;
    backgroundCanBeDragged = false;
    if (hasNoConnections(startingConnect.id) || !startingConnect.closest(".connection").classList.contains("left")) { // if it has no connection || has a connector thats not left
      var targetX = (e.pageX - document.getElementById("drawer").offsetWidth) / mapZoom - getNumber(document.getElementById("main").style.left);
      var targetY = (e.pageY - document.getElementById("top").offsetHeight) / mapZoom - getNumber(document.getElementById("main").style.top);
      var posFrom = getLinePos(startingConnect);

      // TODO: move like a robe....
      if (first) {
        first = false;
        originalSVG = document.getElementById("SVGdiv").innerHTML;
        svg.innerHTML = originalSVG + '<svg class="lineSVG"><path id="connecting" style="opacity:0.5;" d="' + getSVGPositions(posFrom.x, posFrom.y, targetX, targetY) + '" class="line" /></svg>';
        addLineBorders();
        updateSignal(startingConnect.id);
      } else {
        // svg.innerHTML = originalSVG + '<path id="connecting" style="opacity:0.5;" d="M ' + posFrom.x + ' ' + posFrom.y + ' C , ' + positions[0] + ' ' + positions[1] + ' ,' + positions[2] + ' ' + positions[3] + ' ' + targetX + ' ' + targetY + '" class="line" />';
        document.getElementById("connecting").setAttribute("d", getSVGPositions(posFrom.x, posFrom.y, targetX, targetY));
        addLineBorders();
      }

      if (storePrevious.classList.contains("connector") && storePrevious !== e.target) {
        var query = document.querySelectorAll(".connector");
        for (var i = 0; i < query.length; i++) {
          if (getMatchingConnector(query[i], startingConnect)) {
            var target = query[i];
            allMatchingConnectors.push(query[i]);
            target.style.background = 'var(--color-matched)';
          }
        }
      }
      storePrevious = e.target;
    }
  }

  function closeDragConnector(e) {
    if (!moved) { // connector clicked
      // TODO: drag connector, with clones
      alert(1);
    }
    var target = e.target;
    document.onmouseup = null;
    document.onmousemove = null;
    if (target.classList.contains("connector")) { // target is a connector
      if (startingConnect.closest(".connection").classList[1] !== target.closest(".connection").classList[1]) { // e.g. right !== right || left !== left
        if (hasNoConnections(target.id) || !target.closest(".connection").classList.contains("left")) { // has no connections || has not connector on left (left = output)
          if (startingConnect !== target) { // not the same start and end
            var id = startingConnect.id + ':' + target.id;
            if (noMatchingLines(id)) { // no lines with the exact same id (same connections)
              var posTo = getLinePos(target);
              var posFrom = getLinePos(startingConnect);
              svg.innerHTML = originalSVG + '<svg class="lineSVG"><path id="' + id + '" d="' + getSVGPositions(posFrom.x, posFrom.y, posTo.x, posTo.y) + '" class="line" /></svg>';
              addLineBorders();
              updateSignal(id);
              originalSVG = svg.innerHTML;
              addLineListeners();
              checkForNoConnections();
            } else if (moved) svg.innerHTML = originalSVG;
          }
        }
      }
    }
    if (moved) { // if pointer has activated dragConnector event
      // if it has no connection || has a connector thats not left
      if (hasNoConnections(startingConnect.id) || !startingConnect.closest(".connection").classList.contains("left")) svg.innerHTML = originalSVG;
    }
    // originalSVG = svg.innerHTML;

    for (var i = 0; i < allMatchingConnectors.length; i++) allMatchingConnectors[i].removeAttribute('style');

    moved = false;
    backgroundCanBeDragged = true;
    first = true;
  }
}

/////////////////////
///// LISTENERS /////
/////////////////////

// add element listeners
function addListener(elem) {
  child = elem.children[0];
  switch (child.classList[0]) {
    case "button":
      child.addEventListener('mousedown', button);
      child.addEventListener('mouseup', button);
      break;
    case "toggle":
      child.addEventListener('click', toggle);
      break;
    case "clock":
      child.querySelector(".clock_input").addEventListener('change', clock);
      clock(child.querySelector(".clock_input"));
      break;
  }
  elem.addEventListener('click', select);
}

// add line listeners
function addLineListeners() {
  setTimeout(function () {
    var query = document.querySelectorAll(".line");
    for (var i = 0; i < query.length; i++) query[i].addEventListener('click', select);
  }, 50);
}

// shortcut (keydown event)
document.addEventListener("keydown", function(e) {
  if (e.key == "Escape") {
    document.activeElement.blur();
    removeSelection();
    // close opened menus
    if (!document.getElementById("dark").classList.contains("hidden")) {
      document.getElementById("dark").classList.add("hidden");
      var query = document.querySelectorAll('.card');
      for (var i = 0; i < query.length; i++) query[i].classList.add('hidden');
    }
    // hide context menu
    var contexts = document.querySelectorAll('.menu');
    for (var j = 0; j < contexts.length; j++) if (contexts[j].style.display == 'block') contexts[j].style.display = 'none';
    // remove ghost elements
    var ghostElems = document.querySelectorAll('.ghostElem');
    for (var k = 0; k < ghostElems.length; k++) ghostElems[k].remove();
  } else if (e.key == "Backspace" || e.key == "Delete") {
    if (!document.activeElement.classList.contains("clock_input")) deleteSelected();
  }
});

// remove selection on main click
document.getElementById("main").addEventListener('click', function(e) {
  if (e.target.id == "main" || e.target.classList.contains("lineSVG")) if (!e.ctrlKey) removeSelection();
});

// highlight connectors on hover
var found = false, foundTarget;
document.addEventListener('mousemove', function(e) {
  var target = e.target;
  if (target.classList.contains("connector")) // target is a connector
    if (!moved || startingConnect.closest(".connection").classList[1] !== target.closest(".connection").classList[1]) // e.g. right !== right || left !== left
    if (hasNoConnections(target.id) || !target.closest(".connection").classList.contains("left")) // if it has no connection || has a connector thats not left
    if (!moved || startingConnect !== target) // not the same start and end
    if (!moved || noMatchingLines(startingConnect.id + ':' + target.id)) { // no lines with the exact same id (same connections)
      target.classList.add('hover');
      found = true;
      foundTarget = target;
    }

  var elems = document.querySelectorAll('.connector');
  for (var i = 0; i < elems.length; i++) if (elems[i].classList.contains('hover') && elems[i] !== target) elems[i].classList.remove('hover');
  if (found && foundTarget !== target) found = false;
});

// add / update / remove blue selection box
var created = false, boxLeft = 0, boxTop = 0, mouseDown = false;
document.addEventListener('mousemove', function(e) {
  var selectionBox = document.getElementById("selectionBox");
  if (mouseDown && e.ctrlKey) {
    if (!created) {
      selectionBox.style.opacity = "1";
      boxLeft = e.pageX;
      boxTop = e.pageY;
      created = true;
    }

    var left = boxLeft - drawer_width,
        top = boxTop - top_height,
        width = e.pageX - boxLeft,
        height = e.pageY - boxTop;

    if (e.pageX - boxLeft < 0) {
      left = e.pageX - drawer_width;
      width = boxLeft - e.pageX;
    }
    if (e.pageY - boxTop < 0) {
      top = e.pageY - top_height;
      height = boxTop - e.pageY;
    }

    left -= getNumber(document.getElementById("main").style.left);
    top -= getNumber(document.getElementById("main").style.top);
    setStyle(selectionBox, left, top, width, height);

    elementsIsideBox(left, top, width, height, e.shiftKey);
    selectionBox.classList.remove("hidden");
  } else if (!selectionBox.classList.contains("hidden") && created) {
    selectionBox.style.opacity = "0";
    setTimeout(function () {
      selectionBox.classList.add("hidden");
      selectionBox.removeAttribute("style");
    }, 152);
    created = false;
  }
});
document.getElementById("main").addEventListener("mousedown", function() { mouseDown = true; });
document.addEventListener("mouseup", function() { mouseDown = false; });

/////////////////////
///// FUNCTIONS /////
/////////////////////

///// ELEMENTS /////
// create/update clock intervals
// TODO: synced clocks?? (sync button??)
var clockInputs = 0;
var interval = 500, obj = {};
function clock(elem) {
  if (this.classList !== undefined) elem = this;

  var number = elem.id.slice(elem.id.indexOf("#") + 1, elem.id.length);
  var input = elem.value;

  var num = input.replace(/[a-zA-Z]+/g, ''); // [\d][\d.]* // \d*[\.]*\d
  var output = num.split('.');
  num = output.shift() + (output.length ? '.' + output.join('') : '');

  var end = "ms";
  if (input.match(/[a-zA-Z]+$/g) !== null) end = input.match(/[a-zA-Z]+$/g)[0]; // \d // \D+$

  switch (end) {
    case 's': // seconds
      interval = num * 1000;
      break;
    case 'm': // minutes
      interval = num * 1000 * 60;
      break;
    case 'h': // hours
      interval = num * 1000 * 60 * 60;
      break;
    default: // milli seconds
      interval = num;
  }

  var signal_light = elem.closest(".display").querySelector(".signal-light");

  clearInterval(obj[number]);
  obj[number] = setInterval(function() {
    signal_light.classList.toggle("on");
    sendSignal(elem, signal_light.classList.contains("on"));
  }, interval);

  if (num == "" || num == 0) clearInterval(obj[number]);
}

// toggle toggle
function toggle() {
  if (active) {
    if (!this.children[0].classList.contains("on")) this.children[0].classList.add("on");
    else this.children[0].classList.remove("on");
    sendSignal(this, this.children[0].classList.contains("on"));
  }
}

// toggle button
function button(e) {
  if (e.type == "mousedown") sendSignal(this, true);
  else sendSignal(this, false);
}

///// ...SIGNAL | COMPONENT ACTIONS /////

// power/depower elements
function activate(id, powered) {
  var elem = document.getElementById(id).closest(".component");
  var connectors = elem.querySelectorAll('.connector');
  if (elem.classList[0] == "box") elem = elem.children[0];
  var type = elem.classList[0];

  switch (type) {
    case "light":
      if (powered) elem.classList.remove("off");
      else elem.classList.add("off");
      break;
    case "number_display":
      setTimeout(function () {
        var activated = [];
        for (var i = 0; i < connectors.length; i++) {
          var left = connectors[i].closest('.connection').classList.contains('left');
          if (left && hasSignal(connectors[i].id)) activated[i] = true;
        }
        if (activated[0] && activated[1] && activated[2] && activated[3]) elem.querySelector('span').innerHTML = 'F';
        else if (activated[0] && activated[1] && activated[2]) elem.querySelector('span').innerHTML = '7';
        else if (activated[0] && activated[1] && activated[3]) elem.querySelector('span').innerHTML = 'B';
        else if (activated[0] && activated[2] && activated[3]) elem.querySelector('span').innerHTML = 'D';
        else if (activated[1] && activated[2] && activated[3]) elem.querySelector('span').innerHTML = 'E';
        else if (activated[0] && activated[1]) elem.querySelector('span').innerHTML = '3';
        else if (activated[0] && activated[2]) elem.querySelector('span').innerHTML = '5';
        else if (activated[0] && activated[3]) elem.querySelector('span').innerHTML = '9';
        else if (activated[1] && activated[2]) elem.querySelector('span').innerHTML = '6';
        else if (activated[1] && activated[3]) elem.querySelector('span').innerHTML = 'A';
        else if (activated[2] && activated[3]) elem.querySelector('span').innerHTML = 'C';
        else if (activated[0]) elem.querySelector('span').innerHTML = '1';
        else if (activated[1]) elem.querySelector('span').innerHTML = '2';
        else if (activated[2]) elem.querySelector('span').innerHTML = '4';
        else if (activated[3]) elem.querySelector('span').innerHTML = '8';
        else elem.querySelector('span').innerHTML = '0';
      }, 10);
      break;
    case "seven_segment":
      setTimeout(function () {
        var activated = [];
        for (var i = 0; i < connectors.length; i++) {
          var left = connectors[i].closest('.connection').classList.contains('left');
          if (left && hasSignal(connectors[i].id)) activated[i] = true; // notConnected
          else activated[i] = false;
        }
        for (var j = 0; j < activated.length; j++) {
          if (activated[j]) {
            elem.querySelector('#number_' + (j + 1)).style.background = 'var(--light-active)';
            elem.querySelector('#number_' + (j + 1)).style.boxShadow = '0px 0px 20px 6px var(--light-active--shadow)';
          } else {
            elem.querySelector('#number_' + (j + 1)).style.background = null;
            elem.querySelector('#number_' + (j + 1)).style.boxShadow = null;
          }
        }
      }, 10);
      break;
    case "and":
      setTimeout(function () {
        var activated = false;
        for (var i = 0; i < connectors.length; i++) {
          var left = connectors[i].closest('.connection').classList.contains('left');
          if (left && hasSignal(connectors[i].id)) activated = true;
          else if (left) {
            activated = false;
            break;
          }
        }
        // if (activated) elem.classList.add("on");
        // else elem.classList.remove("on");
        sendSignal(elem, activated);
      }, 10);
      break;
    case "or":
      setTimeout(function () {
        var activated = false;
        for (var i = 0; i < connectors.length; i++) {
          var left = connectors[i].closest('.connection').classList.contains('left');
          if (left && hasSignal(connectors[i].id)) {
            activated = true;
            break;
          }
        }
        // if (activated) elem.classList.add("on");
        // else elem.classList.remove("on");
        sendSignal(elem, activated);
      }, 10);
      break;
    case "xor":
      setTimeout(function () {
        var activated = 0;
        for (var i = 0; i < connectors.length; i++) {
          var left = connectors[i].closest('.connection').classList.contains('left');
          if (left && hasSignal(connectors[i].id)) activated++;
        }
        if (activated == 1) activated = true;
        else activated = false;
        // if (activated) elem.classList.add("on");
        // else elem.classList.remove("on");
        sendSignal(elem, activated);
      }, 10);
      break;
  }
}
// TODO: updateSignal vs activate

// update signal (toggle & constant)
function updateSignal(id) {
  var index = id.indexOf(":");
  var from = id.slice(0, index), to = id.slice(index + 1, id.length);
  if (index == -1) {
    from = id;
    to = id;
    id = "connecting";
  }

  var elem = [document.getElementById(from).closest(".component").children[0], document.getElementById(to).closest(".component").children[0]];

  for (var i = 0; i < elem.length; i++) {
    if (elem[i].classList.contains("toggle"))
      if (elem[i].children[0].classList.contains("on")) power(i);

    else if (elem[i].classList.contains("constant"))
      if (elem[i].children[0].innerText == "1") power(i);
  }

  function power(i) {
    if (i == 0) activate(to, true); else activate(from, true);
    document.getElementById(id).classList.add("powered");
  }
}

// send/remove signal from elem to cennected elements
function sendSignal(elem, powered) {
  elem = elem.closest(".component");
  var id = elem.querySelector(".connector").id;
  var query = document.getElementById("SVGdiv").querySelectorAll(".line");
  for (var i = 0; i < query.length; i++) {
    var lc = getLineConnectors(query[i]);
    if (lc.from == id || lc.to == id) {
      if (lc.from == id) activate(lc.to, powered);
      else if (lc.to == id) activate(lc.from, powered);
      if (powered) query[i].classList.add("powered");
      else query[i].classList.remove("powered");
    }
  }
}

// append element (used for drawer elements)
function appendElement(type, parentId) {
  // if (parentId == undefined) parentId = "main";
  var component = document.createElement("div");
  var object = getObjectByType(type);

  for (var k = 0; k < object.classes.length; k++) component.classList.add(object.classes[k]);

  var classList = type;
  if (object.innerClasses !== undefined)
    for (var l = 0; l < object.innerClasses.length; l++) classList += ' ' + object.innerClasses[l];

  component.innerHTML = '<div class="' + classList + '">' + object.children + '</div>';

  // TODO: THIS IS NEVER #MAIN!!!
  // if (parentId == "main") {
  //   component.classList.add("component");
  //   addConnection(component, type);
  //   dragElement(component);
  //   addListener(component);
  // } else
  dragElement(component, true);

  document.getElementById(parentId).appendChild(component);

  if (type == 'clock') {
    document.getElementById('clockInput#temp').id = 'clockInput#' + clockInputs;
    clockInputs++;
  }

  return component;
}

///// SVG /////

// move / update svg lines
function moveSVG(parent) {
  var lines = parent.querySelectorAll('.connector');
  for (var j = 0; j < lines.length; j++) {
    var pos = getLinePos(lines[j]);
    var matching = checkForLine(parent.querySelectorAll(".connector")[j].id);
    for (var i = 0; i < matching.length; i++) {
      var line = document.getElementsByClassName("line")[matching[i].replace(/\D+/g, '')];
      var svgPos = getSVGCoords(line);
      if (matching[i].includes("from")) line.setAttribute("d", getSVGPositions(pos.x, pos.y, svgPos.x2, svgPos.y2));
      else if (matching[i].includes("to")) line.setAttribute("d", getSVGPositions(svgPos.x1, svgPos.y1, pos.x, pos.y));
      addLineListeners();
      addLineBorders();
    }
  }
}

// function to create svg paths
// TODO: center svg with connection ... ?
// TODO: make lines connected to the same elements turn the same direction
function getSVGPositions(x1, y1, x2, y2) {
  var storeInput = {
    x1: x1,
    y1: y1,
    x2: x2,
    y2: y2
  };
  // TODO: WIP
  var oppositeX = false;
  if (x2 < x1) {
    oppositeX = true;
    x1 = x2;
    x2 = storeInput.x1;
  }
  var oppositeY = false;
  if (y2 < y1) {
    oppositeY = true;
    y1 = y2;
    y2 = storeInput.y1;
  }
  var array = [];
  var differenceX = x1 - x2;
  if (x1 < x2) {
    differenceX = x2 - x1;
  }
  var differenceY = y1 - y2;
  if (y1 < y2) {
    differenceY = y2 - y1;
  }
  // console.log(oppositeX);
  // console.log(oppositeY);
  if (oppositeX && oppositeY) { // top left
    array[0] = differenceX * 0.9 + x1; // 90%
    array[1] = differenceY * 0.5 + y1; // 50%
    array[2] = differenceX * 0.5 + x1; // 50%
    array[3] = differenceY * -1.2 + y1; // -120%
  } else if (oppositeX) { // bottom left
    array[0] = differenceX * 0.9 + x1; // 90%
    array[1] = differenceY * 0.5 + y1; // 50%
    array[2] = differenceX * 0.5 + x1; // 50%
    array[3] = differenceY * 2 + y1; // 200%
  } else if (oppositeY) { // top right
    array[0] = differenceX * 0.15 + x1; // 15%
    array[1] = differenceY * 0.5 + y1; // 50%
    array[2] = differenceX * 0.65 + x1; // 65%
    array[3] = differenceY * -1.2 + y1; // -120%
  } else { // bottom right
    array[0] = differenceX * 0.15 + x1; // 15%
    array[1] = differenceY * 0.5 + y1; // 50%
    array[2] = differenceX * 0.65 + x1; // 65%
    array[3] = differenceY * 2 + y1; // 200%
  }
  var output = 'M ' + storeInput.x1 + ' ' + storeInput.y1 + ' C ' + array[0] + ' ' + array[1] + ', ' + array[2] + ' ' + array[3] + ', ' + storeInput.x2 + ' ' + storeInput.y2;
  // output = 'M ' + storeInput.x1 + ' ' + storeInput.y1 + ' C ' + storeInput.x1 + ' ' + storeInput.y1 * 1.5 + ', ' + storeInput.x2 + ' ' + storeInput.y2 + ', ' + storeInput.x2 + ' ' + storeInput.y2;
  if (setting_lineType == "straight") {
    output = 'M ' + storeInput.x1 + ' ' + storeInput.y1 + ' C ' + storeInput.x1 + ' ' + storeInput.y1 + ', ' + storeInput.x2 + ' ' + storeInput.y2 + ', ' + storeInput.x2 + ' ' + storeInput.y2;
  } else if (setting_lineType == 'lined') {
    // x1,y1 -> (x2-x1)/2 -> y1 -> y2 -> x2
    var center = (Math.abs(storeInput.x2 - storeInput.x1) / 2) + Math.min(storeInput.x1, storeInput.x2);
    console.log(storeInput.x1 + ', ' + storeInput.x2);
    output = 'M ' + storeInput.x1 + ' ' + storeInput.y1 + ' L ' + center + ' ' + storeInput.y1 + ', ' + center + ' ' + storeInput.y2 + ', ' + storeInput.x2 + ' ' + storeInput.y2;
  }
  return output;
}

// get svg elem coordinates
// TODO: y is not highest / lowest value... (first pos is not always highest/lowest)
function getSVGCoords(svgElem) {
  var attr = svgElem.getAttribute("d").split(" ");
  var coords = {
    x1: Number(attr[1]),
    y1: Number(attr[2]),
    // y1: getBestValue().min,
    x2: Number(attr[8]),
    y2: Number(attr[9])
    // y2: getBestValue().max
  };
  return coords;

  // M 593 235 C 571.1 194.5, 483.5 56.8, 374 154
  // function getBestValue() {
  //   var y = [];
  //   for (var i = 0; i < attr.length; i++) {
  //     if (i == 2 || i == 5 || i == 7 || i == 9) {
  //       attr[i] = attr[i].replace(',', '');
  //       attr[i] = attr[i].replace('-', '');
  //       y.push(attr[i]);
  //     }
  //   }
  //   console.log(y);
  //   return {max: Math.max.apply(null, y), min: Math.min.apply(null, y)};
  // }
}

///// CONNECTION /////

// add connections to element
var connections = 0;
function addConnection(component, type) {
  var object = getObjectByType(type);

  // get connection amount
  var leftCount = 0, rightCount = 0;
  for (var i = 0; i < Object.keys(object.connections).length; i++) {
    var connectionObject = object.connections[Object.keys(object.connections)[i]];
    if (connectionObject.pos == 'right') rightCount++;
    else if (connectionObject.pos == 'left') leftCount++;
  }

  // create connections
  var slicesRight = component.offsetHeight / (rightCount + 1),
      slicesLeft = component.offsetHeight / (leftCount + 1);
  for (var j = 0; j < rightCount; j++) appendConnection(slicesRight * (j + 1), 'right');
  for (var k = 0; k < leftCount; k++) appendConnection(slicesLeft * (k + 1), 'left');

  // append connections
  function appendConnection(top, direction) {
    var connection = document.createElement("div");
    connection.style.top = top + 'px';
    connection.classList.add("connection", direction);
    connection.innerHTML = '<div class="connector" id="conn_' + connections + '"></div>';
    component.appendChild(connection);
    connections++;
  }
}

// check if connector has power
function hasSignal(id) {
  var query = document.getElementById("SVGdiv").querySelectorAll(".line");
  for (var i = 0; i < query.length; i++) {
    var lc = getLineConnectors(query[i]);
    if (lc.from == id || lc.to == id)
      if (query[i].classList.contains('powered')) return true;
  }
  return false;
}

// get connectors that can be connected to
function getMatchingConnector(elem, startingConnect) {
  var matched = false;
  var target = elem;
  if (target.classList.contains("connector")) // target is a connector
    if (!moved || startingConnect.closest(".connection").classList[1] !== target.closest(".connection").classList[1]) // e.g. right !== right || left !== left
    if (hasNoConnections(target.id) || !target.closest(".connection").classList.contains("left")) // if it has no connection || has a connector thats not left
    if (!moved || startingConnect !== target) // not the same start and end
    if (!moved || noMatchingLines(startingConnect.id + ':' + target.id)) // no lines with the exact same id (same connections)
    matched = true;
  return matched;
}

///// ... /////

// highlight elem if it is inside box selector
function elementsIsideBox(left, top, width, height, shift) {
  var right = left + width;
  var bottom = top + height;

  var query = document.querySelectorAll(".component");
  for (var i = 0; i < query.length; i++) {
    var c = getElemStyles(query[i]);
    if (c.left >= left && c.top >= top && c.left <= right && c.top <= bottom || c.right >= left && c.bottom >= top && c.left <= right && c.top <= bottom)
      query[i].classList.add("selected");
    else if (!shift) query[i].classList.remove("selected");
  }

  var lines = document.querySelectorAll(".lineSVG");
  for (var j = 0; j < lines.length; j++) {
    // TODO: Improve selection: only select when on lines, not entire box
    var svgPos = getSVGCoords(lines[j].lastChild);
    if (svgPos.x1 < svgPos.x2) {
      svgPos.x1 = svgPos.x2;
      svgPos.x2 = getSVGCoords(lines[j].lastChild).x1;
    }
    if (svgPos.y1 < svgPos.y2) {
      svgPos.y1 = svgPos.y2;
      svgPos.y2 = getSVGCoords(lines[j].lastChild).y1;
    }
    var svgwidth = svgPos.x2 - svgPos.x1; // lines[j].getBBox().width
    var svgheight = svgPos.y2 - svgPos.y1; // lines[j].getBBox().height
    if (svgPos.x1 >= left && svgPos.y1 >= top && svgPos.x2 <= right && svgPos.y2 <= bottom || svgPos.x1 + svgwidth >= left && svgPos.y1 + svgheight >= top && svgPos.x2 <= right && svgPos.y2 <= bottom)
      lines[j].classList.add("selected");
    else if (!shift) lines[j].classList.remove("selected");
  }
}

// get element object by its type
function getObjectByType(type) {
  var object;
  for (var i = 0; i < Object.keys(components).length; i++) {
    var key = Object.keys(components)[i];
    for (var j = 1; j < Object.keys(components[key]).length; j++) {
      var elem = components[key][Object.keys(components[key])[j]];
      if (Object.keys(components[key])[j] == type) {
        object = elem;
        break;
      }
    }
  }
  return object;
}

// append label to element
function addLabel(name, component, drawer) {
  var label = document.createElement("div");
  label.classList.add("label");
  label.innerHTML = name;
  if (drawer === true) label.classList.add("small");
  component.appendChild(label);
}

// select elements (TODO: NOT IN USE)
function select(e) {
  var elem = this;
  if (elem.classList.contains("line")) elem = elem.closest(".lineSVG");
  if (elem.classList.contains("component") || elem.classList.contains("lineSVG")) {
    if (!e.ctrlKey && !e.shiftKey) removeSelection();
    if (active) {
      elem.classList.add("selected");
      if (e.ctrlKey || e.shiftKey) elem.classList.remove("selected");
    }
  }
}

// TODO: COMBINE... VVVVV

// remove selected elements
function deleteSelected() {
  var query = document.querySelectorAll(".selected");
  var length = query.length;
  for (var i = 0; i < length; i++) {
    if (query[i].classList.contains('lineSVG')) { // line
      var lc = getLineConnectors(query[i].lastChild);
      // activate(lc.from, false);
      activate(lc.to, false);
    }
    removeComponent(query[i]);
  }
}
// remove every selected element
function removeSelection() {
  var query = document.querySelectorAll(".selected");
  var length = query.length;
  for (var i = 0; i < length; i++) query[i].classList.remove("selected");
}
// remove component (and connections to/from component)
function removeComponent(elem) {
  if (elem.classList.contains("lineSVG")) {
    updateSignal(elem.lastChild.id);
    setTimeout(function () {
      checkForNoConnections();
    }, 1);
  } else {
    var id = elem.querySelector(".connector").id;
    var query = document.getElementById("SVGdiv").querySelectorAll(".lineSVG");
    for (var i = 0; i < query.length; i++) {
      var lc = getLineConnectors(query[i].lastChild);
      if (lc.from == id || lc.to == id) {
        query[i].remove();
      }
    }
  }
  elem.remove();
}

///// LINE | CONNECTIONS /////

// check if any lines is connected to the connector id
function hasNoConnections(id) {
  var hasNoConnections = true;
  var query = document.getElementById("SVGdiv").querySelectorAll(".line");
  for (var i = 0; i < query.length; i++) {
    var lc = getLineConnectors(query[i]);
    if (lc.from == id || lc.to == id) {
      hasNoConnections = false;
      break;
    }
  }
  return hasNoConnections;
}
// get all lines connected to connector
function checkForLine(id) {
  var out = [];
  var query = document.getElementById("SVGdiv").querySelectorAll(".line");
  for (var i = 0; i < query.length; i++) {
    var lc = getLineConnectors(query[i]);
    if (lc.from == id) out.push("from" + i);
    else if (lc.to == id) out.push("to" + i);
  }
  return out;
}
// check if connectors has no connections
function checkForNoConnections() {
  var query = document.querySelectorAll(".connector");
  for (var i = 0; i < query.length; i++) {
    if (query[i].closest(".connection").classList.contains("left") && hasNoConnections(query[i].id)) query[i].classList.add("notConnected");
    else if (query[i].classList.contains("notConnected")) query[i].classList.remove("notConnected");
  }
}
// add black borders around svg line connections
function addLineBorders() {
  var query = document.querySelectorAll(".lineSVG");
  for (var i = 0; i < query.length; i++) {
    var path = query[i].lastChild.getAttribute("d");
    var style = query[i].lastChild.getAttribute("style");
    var id = query[i].lastChild.getAttribute("id");
    var classes = query[i].lastChild.getAttribute("class");
    // console.log(style);
    // console.log(query[i].lastChild);
    if (style == null || style.length <= 1) {
      query[i].innerHTML = '<path d="' + path + '" class="line border"></path><path id="' + id + '" d="' + path + '" class="' + classes + '"></path>';
    } else {
      query[i].innerHTML = '<path style="opacity:0.4;" d="' + path + '" class="line border"></path><path id="' + id + '" style="' + style + '" d="' + path + '" class="' + classes + '"></path>';
    }
    // <path id="connecting" style="opacity:0.4;" d="M 181 78 C 181 78, 181 80, 181 80" class="line"></path>
    // <path id="1:2" d="M 504 87 C 504 87, 308 228, 308 228" class="line powered" style="stroke-width: 5;stroke:black;"></path>
  }
}
// get line position, for drawing lines
function getLinePos(elmnt) {
  var id = 'conn_0';
  if (elmnt.classList.contains('connector')) id = elmnt.id;
  if (!elmnt.classList.contains("component")) elmnt = elmnt.closest(".component");

  var x = getNumber(elmnt.style.left);
  var y = getNumber(elmnt.style.top);

  var connector = elmnt.querySelector('#' + id);
  var connection = connector.closest('.connection');
  if (connection.classList.contains("right")) {
    x += elmnt.offsetWidth + connection.offsetWidth + (connector.offsetWidth / 2);
  } else if (connection.classList.contains("left")) {
    x += 0 - connection.offsetWidth - (connector.offsetWidth / 2);
  }
  y += parseInt(connection.style.top, 10); // elmnt.offsetHeight / 2;

  return {x: x, y: y};
}
// get line connectors from line elem
function getLineConnectors(line) {
  var index = line.id.indexOf(":");
  var from = line.id.slice(0, index);
  var to = line.id.slice(index + 1, line.id.length);
  return {from: from, to: to, index: index};
}
// check if no lines have the same id (to prevent multiple connections to the same components)
function noMatchingLines(id) {
  var noMatching = true;
  var query = document.getElementById("SVGdiv").querySelectorAll(".line");
  for (var i = 0; i < query.length; i++) {
    if (query[i].id == id) {
      noMatching = false;
      break;
    }
  }
  return noMatching;
}

///////////////////
///// HELPERS /////
///////////////////

// get number (replace everything but numbers, -, .)
function getNumber(string) {
  return Number(string.replace(/[^\d-.]/g, ''));
  // return Number(input.replace(/[A-Za-z]/g, ''));
  // return Number(string.replace(/\D+/g, ''));
}

// set left, top, width & height of an element
function setStyle(elem, left, top, width, height) {
  elem.style.left = left + "px";
  elem.style.top = top + "px";
  if (width !== undefined) {
    elem.style.width = width + "px";
    elem.style.height = height + "px";
  }
}

// return an object with common styles for easy use (no 'px')
// TODO: offset or style?
function getElemStyles(elem) {
  var styles = {
    left: getNumber(elem.style.left),
    top: getNumber(elem.style.top),
    width: elem.offsetWidth,
    height: elem.offsetHeight,
  };
  styles.right = styles.left + styles.width;
  styles.bottom = styles.top + styles.height;
  return styles;
}
