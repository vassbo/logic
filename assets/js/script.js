
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





var setting_lineType = "straight";

var setting_lineColor_idle = "#b00000";
var setting_lineColor_powered = "red";
// var setting_lineColor_idle = "white";
// var setting_lineColor_powered = "#008eff";

var setting_theme = "light";

var setting_background = "dotted";




// function addListeners() {
//   // toggle
//   var query = document.querySelectorAll(".button");
//   for (var i = 0; i < query.length; i++) {
//     query[i].addEventListener('click', toggle);
//     // query[i].addEventListener('drag', move);
//   }
// }

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
      child.getElementsByClassName("clock_input")[0].addEventListener('change', clock);
      clock(child.getElementsByClassName("clock_input")[0]);
      break;
  }
  elem.addEventListener('click', select);
}

function addLineListeners() {
  setTimeout(function () {
    var query = document.querySelectorAll(".line");
    // var query = document.querySelectorAll(".lineSVG");
    for (var i = 0; i < query.length; i++) {
      query[i].addEventListener('click', select);
    }
  }, 50);
}


var active = true;

function button(e) {
  if (e.type == "mousedown") {
    sendSignal(this, true);
  } else {
    sendSignal(this, false);
  }
}

function toggle() {
  if (active) {
    if (!this.children[0].classList.contains("on")) {
      this.children[0].classList.add("on");
    } else {
      this.children[0].classList.remove("on");
    }
    sendSignal(this, this.children[0].classList.contains("on"));
  }
}

var interval = 500, test;
var obj = {};
var clockInputs = 0;
function clock(elem) {
  if (this.classList !== undefined) {
    elem = this;
  }

  // TODO: synced clocks?? (button??)

  var number = elem.id.slice(elem.id.indexOf("#") + 1, elem.id.length);

  // supported values: ms, s, m, h
  var input = elem.value;

  var num = input.replace(/[a-zA-Z]+/g, ''); // [\d][\d.]* // \d*[\.]*\d
  var output = num.split('.');
  num = output.shift() + (output.length ? '.' + output.join('') : '');

  var end = "ms";
  if (input.match(/[a-zA-Z]+$/g) !== null) {
    end = input.match(/[a-zA-Z]+$/g)[0]; // \d // \D+$
  }

  // console.log(num);
  // console.log(end);

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

  // console.log(interval);

  var signal_light = elem.closest(".display").getElementsByClassName("signal-light")[0];

  clearInterval(obj[number]);
  obj[number] = setInterval(function(){
    signal_light.classList.toggle("on");
    sendSignal(elem, signal_light.classList.contains("on"));
  }, interval);

  if (num == "" || num == 0) {
    clearInterval(obj[number]);
  }
}




function sendSignal(elem, powered) {
  elem = elem.closest(".component");
  var id = elem.getElementsByClassName("connector")[0].id;
  var query = document.getElementById("SVGdiv").querySelectorAll(".line");
  for (var i = 0; i < query.length; i++) {
    var index = query[i].id.indexOf(":");
    var from = query[i].id.slice(0, index);
    var to = query[i].id.slice(index + 1, query[i].id.length);
    if (from == id || to == id) {
      if (from == id) {
        activate(to, powered);
      } else if (to == id) {
        activate(from, powered);
      }
      if (powered) {
        query[i].classList.add("powered");
      } else {
        query[i].classList.remove("powered");
      }
    }
  }
}


function activate(id, powered) {
  var elem = document.getElementById(id).closest(".component");
  var type = elem.classList[0];
  if (type == "box") {
    elem = elem.children[0];
    type = elem.classList[0];
  }

  switch (type) {
    case "light":
      if (powered) {
        elem.classList.remove("off");
      } else {
        elem.classList.add("off");
      }
      break;
  }
}





function updateSignal(id) {
  var index = id.indexOf(":");
  var from = id.slice(0, index);
  var to = id.slice(index + 1, id.length);
  if (index == -1) {
    from = id;
    to = id;
    id = "connecting";
  }

  var elem = [document.getElementById(from).closest(".component").children[0], document.getElementById(to).closest(".component").children[0]];

  for (var i = 0; i < elem.length; i++) {
    if (elem[i].classList.contains("toggle")) {
      if (elem[i].children[0].classList.contains("on")) {
        if (i == 0) { activate(to, true); } else { activate(from, true); }
        document.getElementById(id).classList.add("powered");
      }
    } else if (elem[i].classList.contains("constant")) {
      if (elem[i].children[0].innerText == "1") {
        if (i == 0) { activate(to, true); } else { activate(from, true); }
        document.getElementById(id).classList.add("powered");
      }
    }
  }
}



// -------------------------------
// appendElement("button");
// appendElement("toggle");
// appendElement("clock");
// appendElement("light");
// -------------------------------
function appendElement(type, id) { // TODO: THIS IS NEVER #MAIN!!!
  if (id == undefined) {
    id = "main";
  }
  var component = document.createElement("div");
  // component.classList.add(type);
  if (type == 'number_display') {
    component.classList.add("box");
    component.classList.add("shorter");
  } else if (type == 'light') {
    component.classList.add("box");
    component.classList.add("round");
  } else {
    component.classList.add("box");
  }

  switch (type) {
    case 'button':
      component.innerHTML = '<div class="' + type + '"></div>';
      break;
    case 'toggle':
      component.innerHTML = '<div class="' + type + '"><div class="btn-light"></div></div>';
      break;
    case 'clock':
      component.innerHTML = '<div class="' + type + '"><div class="display"><input class="clock_input" id="clockInput#' + clockInputs + '" tabindex="-1" value="500ms" type="text"><div class="signal-light"></div></div></div>';
      clockInputs++;
      break;
    case 'light':
      component.innerHTML = '<div class="' + type + ' off"></div>';
      break;
    case 'high_constant':
      component.innerHTML = '<div class="constant"><span>1</span></div>';
      break;
    case 'low_constant':
      component.innerHTML = '<div class="constant"><span>0</span></div>';
      break;
    case 'number_display':
      component.innerHTML = '<div class="' + type + '"><div id="number_1"></div><div id="number_2"></div><div id="number_3"></div><div id="number_4"></div><div id="number_5"></div><div id="number_6"></div><div id="number_7"></div></div>';
      break;
  }


  if (id == "main") {
    component.classList.add("component");
    addConnection(component, type);
    dragElement(component);
    addListener(component);
  } else {
    dragElement(component, true);
  }

  document.getElementById(id).appendChild(component);
  return component;
}
// position: absolute; transform: rotate(0deg); left: 99px; top: 118px;

// -------------------------------
// setTimeout(function () {
//   addLabel("+B1-S1", document.getElementsByClassName("box")[3]);
// }, 10);
// -------------------------------



function addLabel(name, component, drawer) {
  var label = document.createElement("div");
  label.classList.add("label");
  label.innerHTML = name;
  if (drawer === true) {
    label.classList.add("small");
  }
  component.appendChild(label);
}


var connections = 0;
function addConnection(component, type) {
  var connection = document.createElement("div");
  connection.classList.add("connection");
  if (type == "button" || type == "toggle") {
    connection.classList.add("right");
  } else if (type == "light") {
    connection.classList.add("left");
  } else {
    connection.classList.add("right");
  }
  connection.innerHTML = '<div class="connector" id="' + connections + '"></div>';
  component.appendChild(connection);
  connections++;
}





document.getElementById("main").addEventListener('click', function(e) {
  if (e.target.id == "main" || e.target.classList.contains("lineSVG")) {
    if (!e.ctrlKey) {
      removeSelection();
    }
  }
});

function select(e) {
  var elem = this;
  if (elem.classList.contains("line")) {
    elem = elem.closest(".lineSVG");
  }
  if (elem.classList.contains("component") || elem.classList.contains("lineSVG")) {
    if (!e.ctrlKey && !e.shiftKey) {
      removeSelection();
    }
    if (active) {
      if (elem.classList.contains("selected")) {
        if (e.ctrlKey || e.shiftKey) {
          elem.classList.remove("selected");
        }
      } else {
        elem.classList.add("selected");
      }
    }
  }
}

function removeSelection() {
  var query = document.querySelectorAll(".selected");
  var length = query.length;
  for (var i = 0; i < length; i++) {
    query[i].classList.remove("selected");
  }
}



function deleteSelected() {
  var query = document.querySelectorAll(".selected");
  var length = query.length;
  for (var i = 0; i < length; i++) {
    removeComponent(query[i]);
  }
}








// document.onmousemove = test;
document.addEventListener('mousemove', hover);
var found = false;
var foundTarget;
function hover(e) {
  var target = e.target;
  if (target.classList.contains("connector")) { // target is a connector
    if (!moved || startingConnect.closest(".connection").classList[1] !== target.closest(".connection").classList[1]) { // e.g. right !== right || left !== left
      if (hasNoConnections(target.id) || !target.closest(".connection").classList.contains("left")) { // if it has no connection || has a connector thats not left
        if (!moved || startingConnect !== target) { // not the same start and end
          if (!moved || noMatchingLines(startingConnect.id + ':' + target.id)) { // no lines with the exact same id (same connections)
            target.style.background = "#ff651b";
            target.style.cursor = "pointer";
            target.style.height = "16px";
            target.style.width = "16px";
            found = true;
            foundTarget = target;
          }
        }
      }
    }
  }
  if (found && foundTarget !== target) {
    // foundTarget.style.background = null;
    // foundTarget.style.cursor = null;
    // foundTarget.style.height = null;
    // foundTarget.style.width = null;
    foundTarget.removeAttribute("style");
    found = false;
  }
}




function getMatchingConnector(elem, startingConnect) {
  var matched = false;
  var target = elem;
  console.log(elem);
  console.log(startingConnect);
  if (target.classList.contains("connector")) { // target is a connector
    if (!moved || startingConnect.closest(".connection").classList[1] !== target.closest(".connection").classList[1]) { // e.g. right !== right || left !== left
      if (hasNoConnections(target.id) || !target.closest(".connection").classList.contains("left")) { // if it has no connection || has a connector thats not left
        if (!moved || startingConnect !== target) { // not the same start and end
          if (!moved || noMatchingLines(startingConnect.id + ':' + target.id)) { // no lines with the exact same id (same connections)
            matched = true;
          }
        }
      }
    }
  }
  return matched;
}




//////////////// DRAGGABLE ////////////////

//Make the DIV element draggagle:
// setTimeout(function () {
//   dragElement(document.getElementsByClassName("box")[1]);
// }, 10);

var top_height = document.getElementById("top").offsetHeight;
var drawer_width = document.getElementById("drawer").offsetWidth;

var connectorPosX, connectorPosY, startingConnect;
var moved = false; // connection drag move
// var moved2 = false;

var clone;
function dragElement(elmnt, drawer) {
  // if (elmnt === false && clone !== undefined) {
  //   console.log(2);
  //   clone.remove();
  //   // document.removeEventListener("mousemove", elementDrag);
  //   // document.removeEventListener("mouseup", closeDragElement);
  //   // document.onmouseup = null;
  //   // document.onmousemove = null;
  //   // elementDrag(clone);
  //   // clone = undefined;
  //   // return false;
  // }
  // console.log(moved2);
  // if (moved2) {
  //   // dragMouseDown(drawer);
  //   elmnt.onmousemove = elementDrag;
  // }

  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  // if (document.getElementById(elmnt.id + "header")) {
  //   /* if present, the header is where you move the DIV from:*/
  //   document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  // } else {
  //   /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  // }

  function dragMouseDown(e) {
    e = e || window.event;
    if (!e.target.classList.contains("clock_input") || e.target.closest("#drawer") !== null) {
      e.preventDefault();

      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      if (!e.target.classList.contains("connector")) {
        console.log(5);
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
      } else {
        startingConnect = e.target;
        connectorPosX = Number(e.target.closest(".component").style.left.replace(/\D+/g, ''));
        connectorPosY = Number(e.target.closest(".component").style.top.replace(/\D+/g, ''));
        document.onmouseup = closeDragConnector;
        document.onmousemove = dragConnector;
      }
    }
  }

  // var test1 = 0, test2 = 0;
  var startingX, startingY;
  function elementDrag(e) { // TODO: mapZoom (drag from drawer)
    var cloned = true;
    if (active) {
      startingX = e.clientX;
      startingY = e.clientY;
      cloned = false;
    }
    backgroundCanBeDragged = false;
    active = false;

    // if (!cloned && moved2) {
    //   test2 = e.clientX - elmnt.offsetLeft;
    //   test1 = e.clientY - elmnt.offsetTop - top_height;
    //   console.log(test1);
    //   console.log(test2);
    // }

    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    if (drawer) {
      if (!cloned) {
        clone = elmnt.cloneNode(true);
        clone.classList.add("component");
        clone.getElementsByClassName("label")[0].remove();
        document.getElementById("main").appendChild(clone);

        // if (moved2) {
        //   clone.style.left = e.clientX - drawer_width - test2 + "px";
        //   clone.style.top = e.clientY - top_height - test1 + "px";
        //   // clone.onmousemove = elementDrag;
        // } else {
          clone.style.top = elmnt.offsetTop - getNumber(document.getElementById("main").style.top) + "px";
          clone.style.left = elmnt.offsetLeft - drawer_width - getNumber(document.getElementById("main").style.left) + "px";
        // }

        clone.style.opacity = "0.3";
        clone.style.zIndex = "11";
      }

      // if (moved2) {
      //   clone.style.left = e.clientX - drawer_width - test2 + "px";
      //   clone.style.top = e.clientY - top_height - test1 + "px";
      // } else {
        clone.style.top = (clone.offsetTop - pos2 / mapZoom) + "px";
        clone.style.left = (clone.offsetLeft - pos1 / mapZoom) + "px";
      // }

      if (e.clientX > drawer_width && e.clientY > top_height) {
        clone.style.opacity = "0.7";
      } else {
        clone.style.opacity = "0.3";
      }

      // console.log(e.clientX + ", " + e.clientY);
    } else {
      elmnt.style.top = (elmnt.offsetTop - pos2 / mapZoom) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1 / mapZoom) + "px";

      // move svg line
      var pos = getLinePos(elmnt);
      var matching = checkForLine(elmnt.getElementsByClassName("connector")[0].id);
      for (var i = 0; i < matching.length; i++) {
        var line = document.getElementsByClassName("line")[matching[i].replace(/\D+/g, '')];
        var attr = line.getAttribute("d").split(" ");
        var x1 = attr[1];
        var y1 = attr[2];
        var x2 = attr[8];
        var y2 = attr[9];
        var positions;
        if (matching[i].includes("from")) {
          positions = getSVGPositions(pos[0], pos[1], Number(x2), Number(y2));
          console.log(positions);
          // line.setAttribute("x1", pos[0]);
          // line.setAttribute("y1", pos[1]);
          line.setAttribute("d", positions);
        } else if (matching[i].includes("to")) {
          positions = getSVGPositions(Number(x1), Number(y1), pos[0], pos[1]);
          // line.setAttribute("x2", pos[0]);
          // line.setAttribute("y2", pos[1]);
          line.setAttribute("d", positions);
        }
        // line.addEventListener('click', select);
        addLineListeners();
        addLineBorders();
      }
    }
  }

  function closeDragElement(e) {
    var amountMoved = Math.round(Math.sqrt(Math.pow(startingY - event.clientY, 2) + Math.pow(startingX - event.clientX, 2)));
    if (amountMoved < 20) {
      active = true;
    }
    // if moved == false, then start elementDrag with another closedrag (only esc)
    // if (!moved) {
    //   // document.onmouseup = closeDragElement;
    //   // console.log("onmousemove");
    //   // document.onmousemove = elementDrag;
    //   // console.log(document.onmouseup);
    //   // console.log();
    //   // console.log(8);
    //   // document.addEventListener("mousemove", elementDrag);
    //   // document.addEventListener("mouseup", closeDragElement);
    //   // moved2 = 1;
    //   // document.onmouseup =
    //   moved2 = true;
    //   elementDrag(e);
    //   elmnt.onmousemove = elementDrag;
    //   // dragElement(elmnt, false);
    //   // moved2++;
    // }
    // // moved2 = false;
    moved = false;
    backgroundCanBeDragged = true;
    setTimeout(function () {
      active = true;
    }, 10);

    if (drawer) {
      if (e.clientX > drawer_width && e.clientY > top_height) {
        clone.style.opacity = null;
        clone.style.zIndex = null;
        var type = clone.classList[0];
        if (type == "box") {
          type = clone.children[0].classList[0];
        }

        if (type == "clock") {
          clone.getElementsByClassName("clock_input")[0].id = "clockInput#" + clockInputs;
          clone.getElementsByClassName("clock_input")[0].removeAttribute('tabindex');
          console.log(clone);
          clockInputs++;
        }

        addListener(clone);
        dragElement(clone);
        addConnection(clone, type);
        checkForNoConnections();
        clone = undefined;
      } else {
        if (clone !== undefined) {
          clone.remove();
        }
      }
    }

    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }




  var first = true;
  var svg = document.getElementById("SVGdiv");
  var originalSVG = document.getElementById("SVGdiv").innerHTML;
  var storePrevious = svg, allMatchingConnectors = [];
  function dragConnector(e) {
    console.log(1);
    // console.log(originalSVG);
    moved = true;
    backgroundCanBeDragged = false;
    if (hasNoConnections(startingConnect.id) || !startingConnect.closest(".connection").classList.contains("left")) { // if it has no connection || has a connector thats not left
      var targetX = (e.clientX - document.getElementById("drawer").offsetWidth) / mapZoom - getNumber(document.getElementById("main").style.left);
      var targetY = (e.clientY - document.getElementById("top").offsetHeight) / mapZoom - getNumber(document.getElementById("main").style.top);

      var posFrom = getLinePos(startingConnect);

      var positions;
      if (first) {
        first = false;
        originalSVG = document.getElementById("SVGdiv").innerHTML;

        // TODO: move like a robe....

        // svg.innerHTML = originalSVG + '<line id="connecting" style="opacity:0.4;" x1="' + posFrom[0] + '" y1="' + posFrom[1] + '" x2="' + targetX + '" y2="' + targetY + '" class="line" />';
        positions = getSVGPositions(posFrom[0], posFrom[1], targetX, targetY);
        svg.innerHTML = originalSVG + '<svg class="lineSVG"><path id="connecting" style="opacity:0.5;" d="' + positions + '" class="line" /></svg>';
        // <path id="0:1" d="M 194 119 C 214 139, 414 169, 534 151" stroke="black" stroke-width="6" fill="none"></path>
        // 194 : 534 (214)
        // 194 : 534 = 0.36
        // 194 * 0.36
        // 214 : 194 = 1.1
        // 194 * 1.1 = "214"
        //
        // (x2 - x1) * 0.1 = 10%
        //
        // 534 - 194 * 0.1 = 34
        // 194 + 34 = 228

        addLineBorders();

        console.log(svg.innerHTML);
        updateSignal(startingConnect.id);
      } else {
        positions = getSVGPositions(posFrom[0], posFrom[1], targetX, targetY);
        // svg.innerHTML = originalSVG + '<path id="connecting" style="opacity:0.5;" d="M ' + posFrom[0] + ' ' + posFrom[1] + ' C , ' + positions[0] + ' ' + positions[1] + ' ,' + positions[2] + ' ' + positions[3] + ' ' + targetX + ' ' + targetY + '" class="line" />';
        document.getElementById("connecting").setAttribute("d", positions);
        addLineBorders();
        // var line = document.getElementById("connecting");
        // line.setAttribute("x1", posFrom[0]);
        // line.setAttribute("y1", posFrom[1]);
        // line.setAttribute("x2", targetX);
        // line.setAttribute("y2", targetY);
      }

      if (storePrevious.classList.contains("connector") && storePrevious !== e.target) {
        var query = document.querySelectorAll(".connector");
        for (var i = 0; i < query.length; i++) {
          if (getMatchingConnector(query[i], startingConnect)) {
            var target = query[i];
            allMatchingConnectors.push(query[i]);
            target.style.background = "#ff651b";
          }
        }
      }
      storePrevious = e.target;
    }
  }


  function closeDragConnector(e) {
    if (!moved) {
      alert(1);
    }
    var target = e.target;
    document.onmouseup = null; // stop mouseup event
    document.onmousemove = null; // stop mousemove event
    if (target.classList.contains("connector")) { // target is a connector
      if (startingConnect.closest(".connection").classList[1] !== target.closest(".connection").classList[1]) { // e.g. right !== right || left !== left
        if (hasNoConnections(target.id) || !target.closest(".connection").classList.contains("left")) { // has no connections || has not connector on left (left = output)
          if (startingConnect !== target) { // not the same start and end
            var id = startingConnect.id + ':' + target.id;
            if (noMatchingLines(id)) { // no lines with the exact same id (same connections)
              // TODO: better connections (smooth curves)

              var posTo = getLinePos(target);
              var posFrom = getLinePos(startingConnect);
              // svg.innerHTML = originalSVG + '<line id="' + id + '" x1="' + posFrom[0] + '" y1="' + posFrom[1] + '" x2="' + posTo[0] + '" y2="' + posTo[1] + '" class="line" />';
              var positions = getSVGPositions(posFrom[0], posFrom[1], posTo[0], posTo[1]);
              svg.innerHTML = originalSVG + '<svg class="lineSVG"><path id="' + id + '" d="' + positions + '" class="line" /></svg>';
              addLineBorders();
              updateSignal(id);
              originalSVG = svg.innerHTML;
              addLineListeners();
              checkForNoConnections();
            } else if (moved) {
              svg.innerHTML = originalSVG;
            }
          }
        }
      }
    }
    if (moved) { // if pointer has activated dragConnector event
      if (hasNoConnections(startingConnect.id) || !startingConnect.closest(".connection").classList.contains("left")) { // if it has no connection || has a connector thats not left
        svg.innerHTML = originalSVG;
      }
    }
    // originalSVG = svg.innerHTML;

    for (var i = 0; i < allMatchingConnectors.length; i++) {
      allMatchingConnectors[i].removeAttribute('style');
    }

    moved = false;
    backgroundCanBeDragged = true;
    first = true;
    // startingConnect = undefined;
  }
}



function checkForLine(id) {
  var out = [];
  var query = document.getElementById("SVGdiv").querySelectorAll(".line");
  for (var i = 0; i < query.length; i++) {
    var index = query[i].id.indexOf(":");
    var from = query[i].id.slice(0, index);
    var to = query[i].id.slice(index + 1, query[i].id.length);
    if (from == id) {
      out.push("from" + i);
    } else if (to == id) {
      out.push("to" + i);
    }
  }
  return out;
}



function getLinePos(elmnt) {
  if (!elmnt.classList.contains("component")) {
    elmnt = elmnt.closest(".component");
  }

  var x = Number(elmnt.style.left.replace(/[\D-]+$/g, '')); // remove "px"
  var y = Number(elmnt.style.top.replace(/[\D-]+$/g, '')); // remove "px"

  var connection = elmnt.getElementsByClassName("connection")[0];
  var connector = elmnt.getElementsByClassName("connector")[0];
  if (connection.classList.contains("right")) {
    x += elmnt.offsetWidth + connection.offsetWidth + (connector.offsetWidth / 2);
    y += elmnt.offsetHeight / 2;
  } else if (connection.classList.contains("left")) {
    x += 0 - connection.offsetWidth - (connector.offsetWidth / 2);
    y += elmnt.offsetHeight / 2;
  }

  return [x, y];
}




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





function hasNoConnections(id) {
  var hasNoConnections = true;
  var query = document.getElementById("SVGdiv").querySelectorAll(".line");
  for (var i = 0; i < query.length; i++) {
    var index = query[i].id.indexOf(":");
    var from = query[i].id.slice(0, index);
    var to = query[i].id.slice(index + 1, query[i].id.length);
    if (from == id || to == id) {
      hasNoConnections = false;
      break;
    }
  }
  return hasNoConnections;
}



function checkForNoConnections() {
  var query = document.querySelectorAll(".connector");
  for (var i = 0; i < query.length; i++) {
    if (query[i].closest(".connection").classList.contains("left") && hasNoConnections(query[i].id)) {
      query[i].classList.add("notConnected");
    } else if (query[i].classList.contains("notConnected")) {
      query[i].classList.remove("notConnected");
    }
  }
}





function getSVGPositions(x1, y1, x2, y2) {
  var storeInput = [x1, y1, x2, y2];
  // TODO: WIP
  var store;
  var oppositeX = false;
  if (x2 < x1) {
    oppositeX = true;
    store = x1;
    x1 = x2;
    x2 = store;
  }
  var oppositeY = false;
  if (y2 < y1) {
    oppositeY = true;
    store = y1;
    y1 = y2;
    y2 = store;
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
  var output = 'M ' + storeInput[0] + ' ' + storeInput[1] + ' C ' + array[0] + ' ' + array[1] + ', ' + array[2] + ' ' + array[3] + ', ' + storeInput[2] + ' ' + storeInput[3];
  if (setting_lineType == "straight") {
    output = 'M ' + storeInput[0] + ' ' + storeInput[1] + ' C ' + storeInput[0] + ' ' + storeInput[1] + ', ' + storeInput[2] + ' ' + storeInput[3] + ', ' + storeInput[2] + ' ' + storeInput[3];
  }
  // console.log(array);
  return output;
}








document.addEventListener("keydown", keyPress);
function keyPress(e) {
  if (e.key == "Escape") {
    document.activeElement.blur();
    removeSelection();
    if (!document.getElementById("dark").classList.contains("hidden")) {
      document.getElementById("dark").classList.add("hidden");
      document.getElementById("settings").classList.add("hidden");
    }
    // if (moved2) {
    //   dragElement(false);
    //   moved2 = false;
    //
    //   // document.onmouseup = null;
    //   // document.onmousemove = null;
    // }
  } else if (e.key == "Backspace" || e.key == "Delete") {
    if (!document.activeElement.classList.contains("clock_input")) {
      deleteSelected();
    }
  }
}


var created = false, boxLeft = 0, boxTop = 0;
document.addEventListener('mousemove', function(e) {
  var selectionBox = document.getElementById("selectionBox");
  if (mouseDown && e.ctrlKey) {
    if (!created) {
      selectionBox.style.opacity = "1";
      boxLeft = e.clientX;
      boxTop = e.clientY;
      created = true;
    }

    var left, top, width, height;

    if (e.clientX - boxLeft < 0) {
      left = e.clientX - drawer_width;
      width = boxLeft - e.clientX;
    } else {
      left = boxLeft - drawer_width;
      width = e.clientX - boxLeft;
    }

    if (e.clientY - boxTop < 0) {
      top = e.clientY - top_height;
      height = boxTop - e.clientY;
    } else {
      top = boxTop - top_height;
      height = e.clientY - boxTop;
    }

    selectionBox.style.left = left - getNumber(document.getElementById("main").style.left) + "px";
    selectionBox.style.top = top - getNumber(document.getElementById("main").style.top) + "px";
    selectionBox.style.width = width + "px";
    selectionBox.style.height = height + "px";

    elementsIsideBox(left, top, width, height);
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

var mouseDown = false;
document.getElementById("main").addEventListener("mousedown", function() {
  mouseDown = true;
});
document.addEventListener("mouseup", function() {
  mouseDown = false;
});



function elementsIsideBox(left, top, width, height) {
  // console.log(left);
  // console.log(top);
  // console.log(width);
  // console.log(height);
// 154
// 69
// 336
// 195

// 134
// 240
// add component width + height
  var query = document.querySelectorAll(".component");
  for (var i = 0; i < query.length; i++) {
    // console.log(query[i].style.left);
    // console.log(left);
    // console.log(query[i].style.left.replace(/\D+/g, '') + ">=" + left);
    // console.log(query[i].style.top.replace(/\D+/g, '') + ">=" + top);
    // console.log(query[i].style.left.replace(/\D+/g, '') + "<=" + (left + width));
    // console.log(query[i].style.top.replace(/\D+/g, '') + "<=" + (top + height));
    //
    // console.log(Number(query[i].style.left.replace(/\D+/g, '')) + query[i].offsetWidth + ">=" + left);
    // console.log(Number(query[i].style.top.replace(/\D+/g, '')) + query[i].offsetHeight + ">=" + top);
    // console.log(query[i].style.left.replace(/\D+/g, '') + "<=" + (left + width));
    // console.log(query[i].style.top.replace(/\D+/g, '') + "<=" + (top + height));

    // console.log(query[i].offsetWidth);
    // console.log(query[i].offsetHeight);
    if (query[i].style.left.replace(/\D+/g, '') >= left && query[i].style.top.replace(/\D+/g, '') >= top && query[i].style.left.replace(/\D+/g, '') <= (left + width) && query[i].style.top.replace(/\D+/g, '') <= (top + height) || Number(query[i].style.left.replace(/\D+/g, '')) + query[i].offsetWidth >= left && Number(query[i].style.top.replace(/\D+/g, '')) + query[i].offsetHeight >= top && query[i].style.left.replace(/\D+/g, '') <= (left + width) && query[i].style.top.replace(/\D+/g, '') <= (top + height)) {
      query[i].classList.add("selected");
    } else {
      query[i].classList.remove("selected");
    }
  }

  var lines = document.querySelectorAll(".line");
  for (var j = 0; j < lines.length; j++) {
    // TODO: Improve selection: only select when on lines, not intire box
    var attr = lines[j].getAttribute("d").split(" ");
    var x1 = attr[1];
    var y1 = attr[2];
    var x2 = attr[8];
    var y2 = attr[9];
    // if (lines[j].getAttribute("x1") >= left && lines[j].getAttribute("y1") >= top && lines[j].getAttribute("x2") <= (left + width) && lines[j].getAttribute("y2") <= (top + height) || Number(lines[j].getAttribute("x1")) + lines[j].offsetWidth >= left && Number(lines[j].getAttribute("y1")) + lines[j].offsetHeight >= top && lines[j].getAttribute("x2") <= (left + width) && lines[j].getAttribute("y2") <= (top + height)) {
    if (x1 >= left && y1 >= top && x2 <= (left + width) && y2 <= (top + height) || Number(x1) + lines[j].offsetWidth >= left && Number(y1) + lines[j].offsetHeight >= top && x2 <= (left + width) && y2 <= (top + height)) {
      lines[j].closest(".lineSVG").classList.add("selected");
    } else {
      lines[j].closest(".lineSVG").classList.remove("selected");
    }
  }
}




function removeComponent(elem) {
  if (elem.classList.contains("lineSVG")) {
    updateSignal(elem.lastChild.id);
    setTimeout(function () {
      checkForNoConnections();
    }, 1);
  } else {
    var id = elem.getElementsByClassName("connector")[0].id;
    var query = document.getElementById("SVGdiv").querySelectorAll(".line");
    for (var i = 0; i < query.length; i++) {
      var index = query[i].id.indexOf(":");
      var from = query[i].id.slice(0, index);
      var to = query[i].id.slice(index + 1, query[i].id.length);
      if (from == id || to == id) {
        query[i].remove();
      }
    }
  }
  elem.remove();
}





function addLineBorders() {
  var query = document.querySelectorAll(".lineSVG");
  for (var i = 0; i < query.length; i++) {
    var path = query[i].lastChild.getAttribute("d");
    var style = query[i].lastChild.getAttribute("style");
    var id = query[i].lastChild.getAttribute("id");
    var classes = query[i].lastChild.getAttribute("class");
    // console.log(style);
    // console.log(query[i].lastChild);
    if (style == null) {
      query[i].innerHTML = '<path d="' + path + '" class="line border"></path><path id="' + id + '" d="' + path + '" class="' + classes + '"></path>';
    } else {
      query[i].innerHTML = '<path style="opacity:0.2;" d="' + path + '" class="line border"></path><path id="' + id + '" style="' + style + '" d="' + path + '" class="' + classes + '"></path>';
    }
    // <path id="connecting" style="opacity:0.4;" d="M 181 78 C 181 78, 181 80, 181 80" class="line"></path>
    // <path id="1:2" d="M 504 87 C 504 87, 308 228, 308 228" class="line powered" style="stroke-width: 5;stroke:black;"></path>
  }
}
