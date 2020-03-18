
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


// TODO: top bar resize, conn names, ssdd inspect
// TODO: move main on top of svg's


// updateSignal | lineConnections | elementsIsideBox | main# -> var(--


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
// var drawer_width = document.getElementById("drawer").offsetWidth;
function getDrawerWidth() {
  return document.getElementById("drawer").offsetWidth;
}

var active = true;
var mainMoved = false;

var active_tab = 0;

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
    if (!e.target.classList.contains("textInput") || e.target.closest("#drawer") !== null) {
      e.preventDefault();

      // get the mouse cursor position at startup:
      cursor.x = e.clientX;
      cursor.y = e.clientY;
      if (!e.target.classList.contains("connector")) { // move elem
        moveToTop(e.target);
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
      starting.x = e.clientX; //  / mapZoom
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
        document.getElementById("main#" + active_tab).appendChild(clone);

        var scrollTop = document.getElementById('drawer').scrollTop;
        // TODO: map zoom...
        // clone.style.top = elmnt.offsetTop / mapZoom - getNumber(document.getElementById("main").style.top) - scrollTop / mapZoom + "px";
        // clone.style.left = elmnt.offsetLeft * mapZoom - getNumber(document.getElementById("main").style.left) - getDrawerWidth() + "px";
        clone.style.top = elmnt.offsetTop - getNumber(document.getElementById("main#" + active_tab).style.top) - scrollTop / mapZoom + "px";
        clone.style.left = elmnt.offsetLeft - getNumber(document.getElementById("main#" + active_tab).style.left) - getDrawerWidth() + "px";
        clone.style.opacity = "0.3";
        clone.style.zIndex = "9999919";
      }

      setStyle(clone, (clone.offsetLeft - cursor.movedX / mapZoom), (clone.offsetTop - cursor.movedY / mapZoom));

      if (e.clientX > getDrawerWidth() && e.clientY > top_height) clone.style.opacity = "0.7"; // elem clone inside main div
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
      if (e.pageX > getDrawerWidth() && e.pageY > top_height) {
        clone.style.opacity = null;
        clone.style.zIndex = document.querySelectorAll('.component').length - 1;
        clone.classList.remove('ghostElem');

        var type = clone.classList[0];
        if (type == "box") type = clone.children[0].classList[0];
        if (type == "clock") {
          var clockInput = 0;
          while (document.getElementById('clockInput#' + clockInput) !== null) clockInput++;
          clone.querySelector(".clock_input").id = "clockInput#" + clockInput;
        }
        if (clone.querySelector(".textInput") !== null) clone.querySelector(".textInput").removeAttribute('tabindex');

        addListener(clone);
        dragElement(clone);
        addConnection(clone, type);
        checkForNoConnections();
        document.getElementById('tab#' + active_tab).querySelector('span').classList.add('unsaved');
        clone = undefined;

        // TODO: this
        var component = e.target.closest('.component');
        var object = checkSaved('comp_', component);
        object.type = component.children[0].classList[0];
        object.x = getNumber(component.style.left);
        object.y = getNumber(component.style.top);
        object.component = component;
        if (component.querySelector('label') > 0) object.label = component.querySelector('label').innerHTML;
        // output amount + labels | on / off
      } else if (clone !== undefined) clone.remove();
    }

    if (!drawer) {
      document.getElementById('tab#' + active_tab).querySelector('span').classList.add('unsaved');

      var component = e.target.closest('.component');
      var object = checkSaved('comp_', component);
      object.type = component.children[0].classList[0];
      object.x = getNumber(component.style.left);
      object.y = getNumber(component.style.top);
      object.component = component;
      if (component.querySelector('label') > 0) object.label = component.querySelector('label').innerHTML;
      // output amount + labels | on / off
    }

    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }

  var first = true;
  var svg = document.getElementById("main#" + active_tab).querySelector('.SVGdiv');
  var originalSVG = document.getElementById("main#" + active_tab).querySelector('.SVGdiv').innerHTML;
  var storePrevious = svg, allMatchingConnectors = [];
  function dragConnector(e) {
    moved = true;
    backgroundCanBeDragged = false;
    if (hasNoConnections(startingConnect.id) || !startingConnect.closest(".connection").classList.contains("left")) { // if it has no connection || has a connector thats not left
      var targetX = (e.pageX - document.getElementById("drawer").offsetWidth) / mapZoom - getNumber(document.getElementById("main#" + active_tab).style.left);
      var targetY = (e.pageY - document.getElementById("top").offsetHeight) / mapZoom - getNumber(document.getElementById("main#" + active_tab).style.top);
      var posFrom = getLinePos(startingConnect);

      // TODO: move like a robe....
      if (first) {
        first = false;
        originalSVG = document.getElementById("main#" + active_tab).querySelector('.SVGdiv').innerHTML;
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

              document.getElementById('tab#' + active_tab).querySelector('span').classList.add('unsaved');
              // save to localStorage
              var startElem = startingConnect.closest('.component');
              var endElem = target.closest('.component');
              var tabName = document.getElementById('tab#' + active_tab).querySelector('span').innerHTML;
              for (var i = 0; i < Object.keys(saves[tabName]).length; i++) {
                var name = Object.keys(saves[tabName])[i];
                if (startElem == saves[tabName][name].component) startElem = name;
                if (endElem == saves[tabName][name].component) endElem = name;
              }
              var object = checkSaved('conn_');
              object.from = {elem: startElem};
              object.to = {elem: endElem};
              // side, pos
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
      createClockSection(child.querySelector('.clock_input'));
      clock(child.querySelector(".clock_input"));
      break;
  }
  if (child.classList[1] == 'gate' && child.querySelector(".gate_input") !== null) child.querySelector(".gate_input").addEventListener('change', gate);
  elem.addEventListener('click', select);
}

// zoom slider
document.getElementById('zoomSlider').addEventListener('input', sliderChange);
function sliderChange() {

  var percent = document.getElementById('zoomSlider').value;

  // zoom main
  var elem = document.getElementById('main#' + active_tab);

  var zoomFactor = minZoom / 100;

  elem.style.zoom = percent / 100;
  mapZoom = elem.style.zoom;

  elem.style.marginLeft = getDrawerWidth() / mapZoom + "px";
  elem.style.marginTop = top_height / mapZoom + "px";

  document.querySelector('.zoomIndicator').innerHTML = Math.round(mapZoom * 100) + '%'; // DEBUG

  // update
  checkMainPos();
  updateMap(document.getElementById('main#' + active_tab), document.querySelector('.map_overlay'), false); // update minimap

  if (percent.length <= 2) percent = '&nbsp;&nbsp;' + percent;
  document.getElementById('zoomValue').innerHTML = percent + '%';
}

// drawer resizer (dragger)
var draggerDown = false, dragger = document.getElementById('dragger'), draggerMoved = false;
document.addEventListener('mousemove', function(e) {
  if (draggerDown) {
    draggerMoved = true;
    dragger.style.left = e.clientX + 'px';
    var drawer = document.getElementById('drawer');
    drawer.style.width = e.clientX + 'px';
    document.getElementById('main#' + active_tab).style.marginLeft = e.clientX + 'px';
    document.querySelector('.map_overlay').style.left = e.clientX + 5 + 'px';
    if (e.clientX <= 220) updateGrid(1);
    else if (e.clientX <= 350) updateGrid(2);
    else if (e.clientX <= 450) updateGrid(3);
    else if (e.clientX <= 600) updateGrid(4);
    else if (e.clientX <= 800) updateGrid(5);
    else if (e.clientX <= 1000) updateGrid(6);
    else if (e.clientX <= 1200) updateGrid(7);
    else if (e.clientX <= 1500) updateGrid(8);
    resize(); // update minimap
  }
});
dragger.addEventListener('mousedown', function() { draggerDown = true; });
dragger.addEventListener('click', function() {
  if (!draggerMoved) {
    var drawer = document.getElementById('drawer');
    var pos = 0;
    if (drawer.style.width == '0px') pos = 250;
    dragger.style.left = pos + 'px';
    drawer.style.width = pos + 'px';
    updateGrid(2);
    document.getElementById('main#' + active_tab).style.marginLeft = pos + 'px';
    document.querySelector('.map_overlay').style.left = pos + 5 + 'px';
  }
});

// add line listeners
function addLineListeners() {
  setTimeout(function () {
    var query = document.getElementById("main#" + active_tab).querySelectorAll(".line");
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
    if (!document.activeElement.classList.contains("textInput")) deleteSelected();
  } else if (e.key == 's' && e.ctrlKey) {
    save(e);
  } else if (e.key == 'e' && e.ctrlKey) {
    save(e, true);
  } else if (e.key == 'o' && e.ctrlKey) {
    e.preventDefault();
    importFile();
  } else if (e.key == 'w') { //  && e.ctrlKey
    console.log(active_tab);
    if (Number(active_tab) !== 0) {
      closeTab(e, document.getElementById('tab#' + active_tab));
    }
  } else if (e.key == 't') {
    console.log('ayy');
    e.preventDefault();
    var count = document.getElementById('tabber').querySelectorAll('.tab').length;
    addTab('unnamed_' + count);
  }
});

// remove selection on main click
document.getElementById("main#" + active_tab).addEventListener('click', mainClick);
function mainClick(e) {
  if (e.target.id.includes("main#") || e.target.classList.contains("lineSVG")) if (!e.ctrlKey && !mainMoved) removeSelection();
}

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
// TODO: mapZoom
var created = false, boxLeft = 0, boxTop = 0, mouseDown = false;
document.addEventListener('mousemove', function(e) {
  var selectionBox = document.getElementById('main#' + active_tab).querySelector('.selectionBox');
  if (mouseDown && e.ctrlKey) {
    if (!created) {
      selectionBox.style.opacity = "1";
      boxLeft = e.pageX;
      boxTop = e.pageY;
      created = true;
    }

    var left = boxLeft - getDrawerWidth(),
        top = boxTop - top_height,
        width = e.pageX - boxLeft,
        height = e.pageY - boxTop;

    if (e.pageX - boxLeft < 0) {
      left = e.pageX - getDrawerWidth();
      width = boxLeft - e.pageX;
    }
    if (e.pageY - boxTop < 0) {
      top = e.pageY - top_height;
      height = boxTop - e.pageY;
    }

    left -= getNumber(document.getElementById("main#" + active_tab).style.left);
    top -= getNumber(document.getElementById("main#" + active_tab).style.top);
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
document.getElementById("main#" + active_tab).addEventListener("mousedown", function() { mouseDown = true; });

// mouseup
document.addEventListener("mouseup", function() {
  mouseDown = false;
  draggerDown = false;
  setTimeout(function () { draggerMoved = false; }, 10);
});

/////////////////////
///// FUNCTIONS /////
/////////////////////

///// ELEMENTS /////
// create/update clock intervals
// TODO: synced clocks?? (sync button??)
var obj = {};
function clock(elem) {
  if (this.classList !== undefined) elem = this;

  var number = elem.id.slice(elem.id.indexOf("#") + 1, elem.id.length);
  var input = elem.value;

  var clockElem = document.getElementById('clockInput#' + number).closest('.component');

  var num = getNumAdvanced(input);
  var interval = getInterval(input, num);

  if (elem.classList.contains('textInput')) document.getElementById('clockViewInput#' + number).value = input;
  else document.getElementById('clockInput#' + number).value = input;

  var signal_light = clockElem.querySelector(".signal-light");

  clearInterval(obj[number]);
  obj[number] = setInterval(function() {
    signal_light.classList.toggle("on");
    sendSignal(clockElem, signal_light.classList.contains("on"));
    // document.getElementById('clockProgress#' + number).style.width = (100 / interval) + '%';
    var title = document.getElementById('clockProgress#' + number).closest('.clockSection').querySelector('h1');
    if (getLabel(clockElem) == "") title.innerHTML = 'Clock #' + number;
    else if (getLabel(clockElem) !== title.innerHTML) title.innerHTML = getLabel(clockElem);
    var input = document.getElementById('clockInput#' + number);
    var progress = document.getElementById('clockProgress#' + number);
    if (input == null) {
      clearInterval(obj[number]);
      progress.closest('.clockSection').remove();
      if (document.querySelector('.clockSection') == null) document.getElementById('timers').querySelector('h2').classList.remove('hidden');
    } else {
      var num = getNumAdvanced(input.value);
      progress.style.transition = 'all ' + getInterval(input.value, num) + 'ms linear';
      if (signal_light.classList.contains("on")) progress.style.width = '0%';
      else progress.style.width = '100%';
    }
  }, interval);

  if (num == "" || num == 0) clearInterval(obj[number]);
}
function createClockSection(elem) {
  var number = elem.id.slice(elem.id.indexOf("#") + 1, elem.id.length);
  var section = document.createElement('div');
  section.classList.add('clockSection');
  section.innerHTML = '<h1>Clock #' + number + '</h1>' +
  '<input id="clockViewInput#' + number + '" type="text" value="' + elem.value + '">' +
  '<div class="progress">' +
    '<div id="clockProgress#' + number + '" class="fill" style="width: 100%; transition: all 500ms linear 0s;"></div>' +
  '</div>';
  if (!document.getElementById('timers').querySelector('h2').classList.contains('hidden')) document.getElementById('timers').querySelector('h2').classList.add('hidden');
  document.getElementById('timers').appendChild(section);
  document.getElementById('clockViewInput#' + number).addEventListener('change', clock);
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

// change gate input amounts
// TODO: fix changing numbers might not always connect lines back (and gat)
function gate(input, value) {
  if (input.target !== undefined) input = input.target;
  var amount = value || Number(input.value);
  if (amount >= 2 && amount <= 999) {
    // alert(amount);
    var component = input.closest('.component');
    // var query = component.querySelectorAll('.connection');
    // for (var i = 0; i < query.length; i++) query[i].remove();
    addConnection(component, component.querySelector('div').classList[0], amount);
    checkForNoConnections();
    if (value !== undefined) input.value = amount;
  } else {
    amount = 0;
    var connections = input.closest('.component').querySelectorAll('.connection');
    for (var j = 0; j < connections.length; j++) if (connections[j].classList.contains('left')) amount++;
    input.value = amount;
  }
}

///// ...SIGNAL | COMPONENT ACTIONS /////

// power/depower elements
function activate(id, powered) {
  var elem = document.getElementById(id).closest(".component");
  var connectors = elem.querySelectorAll('.connector');
  if (elem.classList[0] == "box") elem = elem.children[0];
  var type = elem.classList[0];

  var activated = false;

  setTimeout(function () {
    var signal = getSignalMap(elem);
    switch (type) {
      case "light":
        if (powered) elem.classList.remove("off");
        else elem.classList.add("off");
        break;
      case "number_display":
        activated = signal.left.bools;
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
        break;
      case "seven_segment":
        for (var j = 0; j < signal.left.count; j++) {
          if (signal.left.bools[j]) {
            elem.querySelector('#number_' + (j + 1)).style.background = 'var(--light-active)';
            elem.querySelector('#number_' + (j + 1)).style.boxShadow = '0px 0px 20px 6px var(--light-active--shadow)';
          } else {
            elem.querySelector('#number_' + (j + 1)).style.background = null;
            elem.querySelector('#number_' + (j + 1)).style.boxShadow = null;
          }
        }
        break;
      case "seven_segment_decoder":
        activated = signal.left.bools;
        if (activated[0] && activated[1] && activated[2] && activated[3]) eo(elem, {true: [0, 4, 5, 6], false: [1, 2, 3]});
        else if (activated[0] && activated[1] && activated[2]) eo(elem, {true: [0, 1, 3, 4, 5, 6], false: [2]});
        else if (activated[0] && activated[1] && activated[3]) eo(elem, {true: [1, 2, 3, 4, 6], false: [0, 5]});
        else if (activated[0] && activated[2] && activated[3]) eo(elem, {true: [2, 3, 4, 5, 6], false: [0, 1]});
        else if (activated[1] && activated[2] && activated[3]) eo(elem, {true: [0, 1, 2], false: [3, 4, 5, 6]});
        else if (activated[0] && activated[1]) eo(elem, {true: [0, 3, 4, 5], false: [1, 2, 6]});
        else if (activated[0] && activated[2]) eo(elem, {true: [0, 1, 2, 4, 5, 6], false: [3]});
        else if (activated[0] && activated[3]) eo(elem, {true: [0, 1, 2, 3, 5, 6], false: [4]});
        else if (activated[1] && activated[2]) eo(elem, {true: [0, 2, 3, 4, 5, 6], false: [1]});
        else if (activated[1] && activated[3]) eo(elem, {true: [0, 2, 3, 5, 6], false: [1, 4]});
        else if (activated[2] && activated[3]) eo(elem, {true: [0, 1, 2, 3, 6], false: [4, 5]});
        else if (activated[0]) eo(elem, {true: [0, 1, 2, 3, 4, 5, 6]});
        else if (activated[1]) eo(elem, {true: [1, 2, 5, 6], false: [0, 3, 4]});
        else if (activated[2]) eo(elem, {true: [0, 1, 3, 4, 6], false: [2, 5]});
        else if (activated[3]) eo(elem, {true: [1, 2], false: [0, 3, 4, 5, 6]});
        else eo(elem, {true: [0, 1, 2, 3, 4, 5], false: [6]});
        break;
      // logic gates
      case "buffer":
        // TODO: output is not active upon connection drag
        if (signal.left.trues == 1) activated = true;
        sendSignal(elem, activated);
        enableOutput(elem, activated);
        break;
      case "not":
        if (signal.left.trues == 0) activated = true;
        sendSignal(elem, activated);
        enableOutput(elem, activated);
        break;
      case "and":
        if (signal.left.trues == signal.left.count) activated = true;
        sendSignal(elem, activated);
        enableOutput(elem, activated);
        break;
      case "nand":
        if (signal.left.trues !== signal.left.count) activated = true;
        sendSignal(elem, activated);
        enableOutput(elem, activated);
        break;
      case "or":
        if (signal.left.trues > 0) activated = true;
        sendSignal(elem, activated);
        enableOutput(elem, activated);
        break;
      case "nor":
        if (signal.left.trues == 0) activated = true;
        sendSignal(elem, activated);
        enableOutput(elem, activated);
        break;
      case "xor":
        if (signal.left.trues == 1) activated = true;
        sendSignal(elem, activated);
        enableOutput(elem, activated);
        break;
      case "xnor":
        if (signal.left.trues !== 1) activated = true;
        sendSignal(elem, activated);
        enableOutput(elem, activated);
        break;

      case 'transistor':
        if (signal.top.trues > 0) setStyleQuery(elem.querySelector('.arrow').querySelectorAll('span'), {background: 'var(--light-active)', boxShadow: '0px 0px 20px 6px var(--light-active--shadow)'});
        else setStyleQuery(elem.querySelector('.arrow').querySelectorAll('span'), {background: null, boxShadow: null});

        if (signal.top.trues > 0 && signal.left.trues > 0) activated = true;
        sendSignal(elem, activated);
        enableOutput(elem, activated);
        break;
      case 'transistor_inv':
        if (signal.top.trues == 0) setStyleQuery(elem.querySelector('.arrow').querySelectorAll('span'), {background: 'var(--light-active)', boxShadow: '0px 0px 20px 6px var(--light-active--shadow)'});
        // if (signal.top.trues == 0) setStyleQuery(elem.querySelector('.arrow').querySelectorAll('span'), {background: 'var(--light-active-inverted)', boxShadow: '0px 0px 20px 6px var(--light-active-inverted--shadow)'});
        else setStyleQuery(elem.querySelector('.arrow').querySelectorAll('span'), {background: null, boxShadow: null});

        if (signal.top.trues == 0 && signal.left.trues > 0) activated = true;
        sendSignal(elem, activated);
        enableOutput(elem, activated);
        break;
    }
  }, 10);
}

function eo(elem, object) {
  enableOutput(elem, true, object.true || []);
  enableOutput(elem, false, object.false || []);

  for (var i = 0; i < object.true.length; i++) {
    sendSignal(elem, true, object.true[i]);
  }
  var obFalse = object.false || [];
  for (var j = 0; j < obFalse.length; j++) {
    sendSignal(elem, false, object.false[j]);
  }
}
// enable / disable specific output connector
function enableOutput(elem, enable, output) {
  output = output || [0];
  for (var i = 0; i < output.length; i++) {
    elem = elem.closest('.component').querySelectorAll('.connector')[output[i]];
    console.log(elem);
    console.log(enable);
    if (enable) elem.classList.add("on");
    else elem.classList.remove("on");
  }
}

// TODO: updateSignal vs activate

// update signal (toggle & constant & not gate)
function updateSignal(id) {
  var index = id.indexOf(":");
  var from = id.slice(0, index), to = id.slice(index + 1, id.length);
  if (index == -1) {
    from = id;
    to = id;
    id = "connecting";
  }
  console.log('ID: ' + id);

  var elem = [
    document.getElementById(from).closest(".component").children[0],
    document.getElementById(to).closest(".component").children[0]
  ];

  for (var i = 0; i < elem.length; i++) {
    // console.log(elem[i].classList[0]);
    // console.log(getSignalMap(elem[i]));
    if (elem[i].classList.contains("toggle")) {
      if (elem[i].children[0].classList.contains("on")) power(i);
    } else if (elem[i].classList.contains("constant")) {
      if (elem[i].children[0].innerText == "1") power(i);
    // } else if (elem[i].classList.contains("not")) {
    //   if (getSignalMap(elem[i]).left.trues == 0) power(i);
    } else if (elem[i].classList.contains("gate")) {
      // if (elem[i].closest('.component').querySelector('.connector').classList.contains("on")) {
      if (getSignalMap(elem[i]).right.trues > 0) {
        var conns = elem[i].closest('.component').querySelectorAll('.connector');
        var connId = to;
        if (i == 0) connId = from;
        // console.log('ID: ' + connId);
        for (var j = 0; j < conns.length; j++) {
          // console.log('ind id: ' + conns[j].id);
          if (conns[j].id == connId && conns[j].closest('.connection').classList.contains('right')) power(i);
        }
      }
    //   // if (getSignalMap(elem[i]).right.trues > 0 && getSignalMap(elem[i]).right.ids.includes(elem[i].closest('.component').querySelector('.connector').id)) power(i);
    //   // TODO: connectin lever to not gate will activate powerline in between
    //   if (getSignalMap(elem[i]).right.trues > 0) power(i);
    //   // if (getSignalMap(elem[i]).right.trues > 0) {
    //   //   if (i == 0) activate(to, true); else activate(from, true);
    //   //   document.getElementById(id).classList.add("powered");
      // }
    } else if (elem[i].classList.contains("seven_segment_decoder")) {
      if (getSignalMap(elem[i]).left.trues == 0) {
        var conns = elem[i].closest('.component').querySelectorAll('.connector');
        var connId = to;
        if (i == 0) connId = from;
        for (var j = 0; j < conns.length; j++) {
          if (conns[j].id == connId && conns[j].classList.contains('on') && conns[j].closest('.connection').classList.contains('right')) power(i);
        }
      }
    }
  }

  function power(i) {
    console.log(i);
    console.log(from);
    console.log(to);
    console.log(id);
    if (i == 0) activate(to, true); else activate(from, true);
    document.getElementById(id).classList.add("powered");
  }
}

// get element connector signals
function getSignalMap(elem) {
  elem = elem.closest('.component');
  var output = { // count = amount of connectors, trues = number of true, bools = [true, false], ids = [conn_1]
    left: { count: 0, trues: 0, bools: [], ids: [] },
    right: { count: 0, trues: 0, bools: [], ids: [] },
    top: { count: 0, trues: 0, bools: [], ids: [] },
    global: { count: 0, trues: 0, bools: [], ids: [] }
  };
  var connections = elem.querySelectorAll('.connection');
  for (var i = 0; i < connections.length; i++) {
    var left = connections[i].classList.contains('left');
    var right = connections[i].classList.contains('right');
    var top = connections[i].classList.contains('top');
    var id = connections[i].querySelector('.connector').id;
    var signal = hasSignal(id) || connections[i].querySelector('.connector').classList.contains('on');
    if (left) {
      output.left.bools.push(signal);
      output.left.ids.push(id);
      if (signal) output.left.trues++;
      output.left.count++;
    } else if (right) {
      output.right.bools.push(signal);
      output.right.ids.push(id);
      if (signal) output.right.trues++;
      output.right.count++;
    } else if (top) {
      output.top.bools.push(signal);
      output.top.ids.push(id);
      if (signal) output.top.trues++;
      output.top.count++;
    }
    output.global.bools.push(signal);
    output.global.ids.push(id);
    if (signal) output.global.trues++;
    output.global.count++;
  }
  return output;
}

// send/remove signal from elem to connected elements
function sendSignal(elem, powered, output) {
  elem = elem.closest(".component");
  var id = elem.querySelectorAll(".connector")[output || 0].id;
  var query = document.getElementById("main#" + active_tab).querySelector('.SVGdiv').querySelectorAll(".line");
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

// easily append element from object
function appendElem(type, coords, label) {
  var object = getObjectByType(type);
  var div = document.createElement("div");
  var component = appendElement(type, "main#" + active_tab);
  component.style.top = coords.y + 'px';
  component.style.left = coords.x + 'px';
  // component.zIndex = ...
  if (label !== undefined) addLabel(label, component);
  addListener(component);
  return component;
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

  document.getElementById(parentId).appendChild(component);

  // TODO: THIS IS NEVER #MAIN!!!
  if (parentId.includes("main#")) {
    component.classList.add("component");
    addConnection(component, type);
    dragElement(component);
    addListener(component);
    checkForNoConnections();
  } else {
    dragElement(component, true);
  }

  return component;
}

///// SVG /////

// createsvg helper for easier understanding
function cSVG(from, to) {
  createSVG(getSignalMap(from.elem)[from.side || 'global'].ids[from.pos || 0], getSignalMap(to.elem)[to.side || 'global'].ids[to.pos || 0]);
}
// create svg with start and end id
function createSVG(connStart, connEnd) {
  var id = connStart + ':' + connEnd;
  if (noMatchingLines(id)) { // no lines with the exact same id (same connections)
    var posTo = getLinePos(document.getElementById(connEnd));
    var posFrom = getLinePos(document.getElementById(connStart));
    var svg = document.getElementById("main#" + active_tab).querySelector('.SVGdiv');
    var originalSVG = document.getElementById("main#" + active_tab).querySelector('.SVGdiv').innerHTML;
    svg.innerHTML = originalSVG + '<svg class="lineSVG"><path id="' + id + '" d="' + getSVGPositions(posFrom.x, posFrom.y, posTo.x, posTo.y) + '" class="line" /></svg>';
    addLineBorders();
    updateSignal(id);
    // originalSVG = svg.innerHTML;
    addLineListeners();
    checkForNoConnections();
  }
}

// move / update svg lines
function moveSVG(parent) {
  var lines = parent.querySelectorAll('.connector');
  for (var j = 0; j < lines.length; j++) {
    var pos = getLinePos(lines[j]);
    var matching = checkForLine(parent.querySelectorAll(".connector")[j].id);
    for (var i = 0; i < matching.length; i++) {
      var line = document.getElementById("main#" + active_tab).getElementsByClassName("line")[matching[i].replace(/\D+/g, '')];
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
// var connections = 0;
function addConnection(component, type, amount) {
  var object = getObjectByType(type);
  var connectionId = 0;

  // get connection amount
  var leftCount = 0, rightCount = 0, topCount = 0, names = {right: [], left: [], top: []};
  for (var i = 0; i < Object.keys(object.connections).length; i++) {
    var connectionObject = object.connections[Object.keys(object.connections)[i]];
    if (connectionObject.pos == 'right') {
      console.log(connectionObject.name);
      if (connectionObject.name !== undefined) names[connectionObject.pos][rightCount] = connectionObject.name;
      rightCount++;
    } else if (connectionObject.pos == 'left') {
      if (connectionObject.name !== undefined) names[connectionObject.pos][leftCount] = connectionObject.name;
      leftCount++;
    } else if (connectionObject.pos == 'top') {
      if (connectionObject.name !== undefined) names[connectionObject.pos][topCount] = connectionObject.name;
      topCount++;
    }
  }

  if (amount !== undefined) {
    leftCount = amount;
    component.style.height = 80 + (amount - 2) * 10 + 'px';
    component.querySelector('.gate_input').style.marginTop = '50%';
    component.querySelector('.gate_input').style.marginTop = component.offsetHeight / 2 + 'px';

    var query = component.querySelectorAll('.connection');
    for (var l = 0; l < query.length; l++) {
      var id = query[l].querySelector('.connector').id;
      if (rightCount + l > amount + 1) removeConnected(id);
      query[l].remove();
    }
  }

  // create connections
  var slicesRight = component.offsetHeight / (rightCount + 1),
      slicesLeft = component.offsetHeight / (leftCount + 1);
      slicesTop = component.offsetWidth / (topCount + 1);
  for (var j = 0; j < rightCount; j++) appendConnection(slicesRight * (j + 1), 'right', names.right[j] || null);
  for (var k = 0; k < leftCount; k++) appendConnection(slicesLeft * (k + 1), 'left', names.left[k] || null);
  for (var m = 0; m < topCount; m++) appendConnection(slicesTop * (m + 1), 'top', names.top[m] || null);

  // append connections
  function appendConnection(offset, direction, name) {
    var connection = document.createElement("div");
    if (direction == 'right' || direction == 'left') connection.style.top = offset + 'px';
    else connection.style.left = offset + 'px';
    connection.classList.add("connection", direction);
    while (document.getElementById('conn_' + connectionId) !== null) connectionId++;
    connection.innerHTML = '<div class="connector" id="conn_' + connectionId + '"></div>';
    if (name !== null) {
      var offsetStyle = 'Y';
      if (direction == 'top') offsetStyle = 'X';
      connection.innerHTML += '<div class="conn_label" style="transform: translate' + offsetStyle + '(-50%); ' + direction + ': 16px;">' + name + '</div>';
    }
    component.appendChild(connection);
    // connections++;
  }

  moveSVG(component);
  activate('conn_' + connectionId);
}

// check if connector has power
function hasSignal(id) {
  var query = document.getElementById("main#" + active_tab).querySelector('.SVGdiv').querySelectorAll(".line");
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

  var lines = document.getElementById("main#" + active_tab).querySelectorAll(".lineSVG");
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

// get label from element
function getLabel(elem) {
  var label = "";
  if (elem.querySelector('.label') !== null) label = elem.querySelector('.label').innerHTML;
  return label;
}

// select elements
function select(e) {
  var elem = this;
  if (elem.classList.contains("line")) elem = elem.closest(".lineSVG");
  if (elem.classList.contains("component") || elem.classList.contains("lineSVG")) {
    if (!e.ctrlKey && !e.shiftKey && !mainMoved) removeSelection();
    if (active) {
      if (elem.classList.contains("selected")) {
        if (e.ctrlKey || e.shiftKey) elem.classList.remove("selected");
      } else elem.classList.add("selected");
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
// remove component (and connections to/from component)
function removeComponent(elem) {
  if (elem.classList.contains("lineSVG")) {
    updateSignal(elem.lastChild.id);
    setTimeout(function () {
      checkForNoConnections();
    }, 1);
  } else {
    // var id = elem.querySelector(".connector").id;
    var query = document.getElementById("main#" + active_tab).querySelector('.SVGdiv').querySelectorAll(".lineSVG");
    for (var i = 0; i < query.length; i++) {
      var lc = getLineConnectors(query[i].lastChild);
      var ids = getSignalMap(elem).global.ids;
      for (var j = 0; j < ids.length; j++) if (lc.from == ids[j] || lc.to == ids[j]) query[i].remove();
      // TODO: update signal
    }
  }
  elem.remove();
}
// remove every selected element
function removeSelection() {
  var query = document.querySelectorAll(".selected");
  var length = query.length;
  for (var i = 0; i < length; i++) query[i].classList.remove("selected");
}

///// LINE | CONNECTIONS /////

// check if any lines is connected to the connector id
function hasNoConnections(id) {
  var hasNoConnections = true;
  var query = document.getElementById("main#" + active_tab).querySelector('.SVGdiv').querySelectorAll(".line");
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
  var query = document.getElementById("main#" + active_tab).querySelector('.SVGdiv').querySelectorAll(".line");
  for (var i = 0; i < query.length; i++) {
    var lc = getLineConnectors(query[i]);
    if (lc.from == id) out.push("from" + i);
    else if (lc.to == id) out.push("to" + i);
  }
  return out;
}
// remove all lines connected to a connector
function removeConnected(id) {
  var query = document.getElementById("main#" + active_tab).querySelector('.SVGdiv').querySelectorAll(".line");
  for (var i = 0; i < query.length; i++) {
    var lc = getLineConnectors(query[i]);
    if (lc.from == id || lc.to == id) query[i].closest('.lineSVG').remove();
  }
}
// check if connectors has no connections
function checkForNoConnections() {
  var query = document.getElementById("main#" + active_tab).querySelectorAll(".connector");
  for (var i = 0; i < query.length; i++) {
    if (query[i].closest(".connection").classList.contains("left") && hasNoConnections(query[i].id)) query[i].classList.add("notConnected");
    else if (query[i].classList.contains("notConnected")) query[i].classList.remove("notConnected");
  }
}
// add black borders around svg line connections
function addLineBorders() {
  var query = document.getElementById("main#" + active_tab).querySelectorAll(".lineSVG");
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
    y += parseInt(connection.style.top, 10); // elmnt.offsetHeight / 2;
  } else if (connection.classList.contains("left")) {
    x += 0 - connection.offsetWidth - (connector.offsetWidth / 2);
    y += parseInt(connection.style.top, 10);
  } else if (connection.classList.contains('top')) {
    y += 0 - connection.offsetHeight - (connector.offsetHeight / 2);
    x += parseInt(connection.style.left, 10);
  }

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
  var query = document.getElementById("main#" + active_tab).querySelector('.SVGdiv').querySelectorAll(".line");
  for (var i = 0; i < query.length; i++) {
    if (query[i].id == id) {
      noMatching = false;
      break;
    }
  }
  return noMatching;
}

///// TABS /////
document.getElementById('tabber').querySelector('.tab').addEventListener('click', openTab);
// create new page and tab
var tabsId = 1;
function addTab(name) {
  // TODO: reorder tabs
  // TODO: contaxt tab bar: new, delete
  // var count = document.getElementById('tabber').querySelectorAll('.tab').length;

  var newTab = document.createElement('div');
  newTab.classList.add('tab');
  newTab.id = 'tab#' + tabsId;
  newTab.innerHTML = '<span class="unsaved">' + name + '</span><div id="close"><i class="material-icons tabber" title="Close">close</i></div>';
  document.getElementById('tabber').querySelector('div').appendChild(newTab);
  newTab.addEventListener('click', openTab);
  newTab.querySelector('#close').addEventListener('click', closeTab);

  var newMain = document.createElement('div');
  newMain.id = 'main#' + tabsId;
  newMain.classList.add('main', 'hidden');
  newMain.style.zoom = '1';
  // center V
  newMain.style.top = '0';
  newMain.style.left = '0';
  newMain.innerHTML = '<div class="selectionBox" class="hidden"></div><div class="SVGdiv"></div>';
  document.body.appendChild(newMain);

  newMain.addEventListener('click', mainClick);
  newMain.addEventListener("mousedown", function() { mouseDown = true; });
  newMain.addEventListener('mousedown', mainDrag);
  newMain.addEventListener('wheel', wheel);

  active_tab = tabsId;
  tabsId++;
  newTab.click();

  home();

  return newTab;
}

// open a tab
function openTab(e) {
  if (!e.target.classList.contains('material-icons')) {
    active_tab = this.id.slice(4, this.id.length);
    var newMain = document.getElementById('main#' + active_tab);
    var main = document.querySelectorAll('.main');
    for (var i = 0; i < main.length; i++) {
      if (main[i].id == 'main#' + active_tab) main[i].classList.remove('hidden');
      else main[i].classList.add('hidden');
    }
    var tabs = document.getElementById('tabber').querySelectorAll('.tab');
    for (var j = 0; j < tabs.length; j++) {
      if (tabs[j] === this) this.classList.add('active');
      else tabs[j].classList.remove('active');
    }

    document.getElementById('zoomSlider').value = newMain.style.zoom * 100;
    sliderChange();
    updateMap(document.getElementById('main#' + active_tab), document.querySelector('.map_overlay'), true);
  }
}
function home() {
  document.getElementById('main#' + active_tab).style.left = '-' + (document.getElementById('main#' + active_tab).offsetWidth / 2 - window.innerWidth / 2) + 'px';
  document.getElementById('main#' + active_tab).style.top = '-' + (document.getElementById('main#' + active_tab).offsetHeight / 2 - window.innerHeight / 2) + 'px';
  document.getElementById('zoomSlider').value = 100;
  sliderChange();
  updateMap(document.getElementById('main#' + active_tab), document.querySelector('.map_overlay'), true);
}

// remove page and tab
function closeTab(e, elem) {
  if (elem == undefined) elem = this.closest('.tab');
  console.log(elem);
  // TODO: remove clock intervals... ++
  if (confirm('Are you sure you want to delete this tab and remove all of its content?')) {
    var tabId = elem.id.slice(4, elem.id.length);
    document.getElementById('main#' + tabId).remove();
    if (elem.classList.contains('active')) {
      var id = 0;
      var tabs = document.getElementById('tabber').querySelectorAll('.tab');
      for (var i = 0; i < tabs.length; i++) {
        if (tabs[i] === elem) {
          id = i + 1;
          break;
        }
      }
      if (tabs[id] == undefined) id -= 2;
      console.log(active_tab);
      console.log(id);
      active_tab = tabs[id].id.slice(4, tabs[id].id.length);
      document.getElementById('tab#' + active_tab).click();
    }
    elem.remove();
  }
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

// set multiple styles on a query of elements
function setStyleQuery(elemQuery, styleObject) {
  for (var i = 0; i < elemQuery.length; i++) {
    for (var j = 0; j < Object.keys(styleObject).length; j++) {
      var key = Object.keys(styleObject)[j];
      elemQuery[i].style[key] = styleObject[key];
    }
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

// move element to bottom of parent div
function moveToTop(elem) {

  elem = elem.closest('.box'); // component
  var elems = document.querySelectorAll('.component');
  var selectedZ = Number(elem.style.zIndex);
  if (elem.style.zIndex == "") selectedZ = elems.length - 1;

  for (var i = 0; i < elems.length; i++) {
    var currentZ = Number(elems[i].style.zIndex);
    if (elems[i] === elem) elems[i].style.zIndex = (elems.length - 1);
    else if (currentZ > selectedZ) elems[i].style.zIndex = currentZ - 1;
  }
}

// update grid upon drawer resize
function updateGrid(amount) {
  var auto = 'auto';
  for (var j = 1; j < amount; j++) auto += ' auto';
  var grid = document.querySelectorAll('.grid');
  for (var i = 0; i < grid.length; i++) grid[i].style.gridTemplateColumns = auto;
}

// return value in ms from input (1s = 1000)
function getInterval(text, num) {
  var end = "ms", interval = 500;
  if (text.match(/[a-zA-Z]+$/g) !== null) end = text.match(/[a-zA-Z]+$/g)[0]; // \d // \D+$

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
  return interval;
}

// return number with one dot (.) ...
function getNumAdvanced(input) {
  var num = input.replace(/[a-zA-Z]+/g, '').split('.'); // [\d][\d.]* // \d*[\.]*\d
  return num.shift() + (num.length ? '.' + num.join('') : '');
}
