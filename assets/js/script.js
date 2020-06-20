
// TODO: add components

// TODO: store state (on/off/timer....) + (input values: clock/gate inputs)

// TODO: delete saves + integrated circuits/components from lcal storage in settings

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

// TODO: Thruth table of each component + text?
// TODO: moving a component with compoents selected should not deselct them

// TODO: box selecting elements will not enable buttons properly

// TODO: moving an element in very zoomed out mode makes it undefined on place (can find e.target)


// show alert box upon exit with unchanged things...


// TODO: start in center
// menu y scroll...
// test on different browsers


// updateSignal | lineConnections | elementsIsideBox | main# -> var(--


/////////////////////
///// VARIABLES /////
/////////////////////

///// SETTINGS /////

var settings = { // TODO: saves.settings...
  lineType: 'lined', // straight / lined

  lineColor_idle: '#b00000', // white
  lineColor_powered: 'red', // #008eff

  theme: 'light',
  background: 'dotted',
  language: 'en'
};

///// GLOBAL /////

var top_height = document.getElementById("top").offsetHeight + document.getElementById('tabber').offsetHeight;
// var top_height = document.getElementById("top").offsetHeight;
// var drawer_width = document.getElementById("drawer").offsetWidth;
function getDrawerWidth() {
  return document.getElementById("drawer").offsetWidth;
}

var active = true;
var mainMoved = false;

var active_tab = 0;

var historyLog = [], historyRedo = [];

// var speakerAudio = [];
var elemStorage = [];

/////////////////////
///// DRAGGABLE /////
/////////////////////

var connectorPosX, connectorPosY, startingConnect;
var moved = false; // connection drag move
var clone;
function dragElement(elmnt, drawer) {
  var cursor = {movedX: 0, movedY: 0, x: 0, y: 0};

  elmnt.onmousedown = dragMouseDown;
  function dragMouseDown(e) {
    e = e || window.event;
    if (e.target.nodeName !== 'INPUT') {
      if (!e.target.classList.contains("textInput") || e.target.closest("#drawer") !== null) {
        console.log('prevent1');
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
        activeMain().appendChild(clone);

        var scrollTop = document.getElementById('drawer').scrollTop;
        // TODO: map zoom...
        // clone.style.top = elmnt.offsetTop / mapZoom - getNumber(document.getElementById("main").style.top) - scrollTop / mapZoom + "px";
        // clone.style.left = elmnt.offsetLeft * mapZoom - getNumber(document.getElementById("main").style.left) - getDrawerWidth() + "px";
        clone.style.top = elmnt.offsetTop - getNumber(activeMain().style.top) - 32 - scrollTop / mapZoom + "px";
        clone.style.left = elmnt.offsetLeft - getNumber(activeMain().style.left) - getDrawerWidth() + "px";
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
      if (e.pageX > getDrawerWidth() && e.pageX < window.innerWidth && e.pageY > top_height && e.pageY < window.innerHeight) {
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
        addConnectors(clone, type);
        checkForNoConnections();
        historyAdd('componentAdd', {elem: clone, type: type, x: clone.style.left, y: clone.style.top, zIndex: clone.style.zIndex}); // history
        clone = undefined;

        // TODO: this
        var component = e.target.closest('.component');
        var object = checkSaved(component);
        object.object.type = component.children[0].classList[0];
        object.object.x = getNumber(component.style.left);
        object.object.y = getNumber(component.style.top);
        object.object.component = component;
        if (component.querySelector('label') > 0) object.object.label = component.querySelector('label').innerHTML;
        // output amount + labels | on / off
      } else if (clone !== undefined) clone.remove();
    }

    if (!drawer) {
      var component = e.target.closest('.component');
      // TODO: Add label VVVV
      historyAdd('componentMove', {elem: component, type: component.children[0].classList[0], x: component.style.left, y: component.style.top, zIndex: component.style.zIndex, label: undefined}); // history

      var object = checkSaved(component);
      object.object.type = component.children[0].classList[0];
      object.object.x = getNumber(component.style.left);
      object.object.y = getNumber(component.style.top);
      object.object.component = component;
      if (component.querySelector('label') > 0) object.object.label = component.querySelector('label').innerHTML;
      // output amount + labels | on / off
    }

    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }

  var first = true;
  // TODO: WIP activeMain
  var svg = document.getElementById('main#' + active_tab).querySelector('.SVGdiv');
  var originalSVG = document.getElementById('main#' + active_tab).querySelector('.SVGdiv').innerHTML;
  var storePrevious = svg, allMatchingConnectors = [];
  function dragConnector(e) {
    // TODO: activeMain
    // originalSVG = activeMain().querySelector('.SVGdiv').innerHTML;
    // svg = activeMain().querySelector('.SVGdiv');
    // storePrevious = svg;

    moved = true;
    backgroundCanBeDragged = false;
    if (hasNoConnections(startingConnect.id) || !startingConnect.closest(".connection").classList.contains("left")) { // if it has no connection || has a connector thats not left
      var targetX = (e.pageX - document.getElementById("drawer").offsetWidth) / mapZoom - getNumber(activeMain().style.left);
      var targetY = (e.pageY - document.getElementById("top").offsetHeight - document.getElementById('tabber').offsetHeight) / mapZoom - getNumber(activeMain().style.top);
      var posFrom = getLinePos(startingConnect);

      // TODO: move like a robe....
      if (first) {
        first = false;
        originalSVG = activeMain().querySelector('.SVGdiv').innerHTML;
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
            // constant start/end (WIP? (minimize))
            if (!startingConnect.closest('.connection').classList.contains('right') && !startingConnect.closest('.connection').classList.contains('bottom') && !startingConnect.closest('.connection').classList.contains('required')) {
              let placeholder = target;
              target = startingConnect;
              startingConnect = placeholder;
            }
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

              historyAdd('connectorAdd', {id: id, svg: svg}); // history
              // save to localStorage
              var startElem = startingConnect.closest('.component');
              var endElem = target.closest('.component');

              // TODO: WHAT'S THIS(VVV) FOR???
              // var tabObj = tabObject();
              // for (var i = 0; i < Object.keys(tabObj.components).length; i++) {
              //   var name = Object.keys(tabObj.components)[i];
              //   if (startElem == tabObj.components[name].component) startElem = name;
              //   if (endElem == tabObj.components[name].component) endElem = name;
              // }
              // get right/bottom
              var object = checkSaved(startElem);
              if (object.object.connection == undefined) object.object.connection = {};
              if (object.object.connection.connections == undefined) object.object.connection.connections = [];
              var connObj = {id: checkSaved(endElem).pos};

              // assign additional values
              var map = getSignalMap(target);
              for (var j = 0; j < map.global.ids.length; j++) {
                if (map.global.ids[j] == target.id) {
                  if (map.global.sides[j] !== 'left') connObj.side = map.global.sides[j];
                  for (var k = 0; k < map[map.global.sides[j]].ids.length; k++) {
                    if (map[map.global.sides[j]].ids[k] == target.id) {
                      if (k > 0) connObj.pos = k;
                    }
                  }
                }
              }
              var fromMap = getSignalMap(startingConnect);
              console.log(fromMap);
              for (var j = 0; j < fromMap.global.ids.length; j++) {
                if (fromMap.global.ids[j] == startingConnect.id) {
                  if (fromMap.global.sides[j] !== 'right') connObj.fromSide = fromMap.global.sides[j];
                  for (var k = 0; k < fromMap[fromMap.global.sides[j]].ids.length; k++) {
                    if (fromMap[fromMap.global.sides[j]].ids[k] == startingConnect.id) {
                      if (k > 0) connObj.fromPos = k;
                    }
                  }
                }
              }

              object.object.connection.connections.push(connObj);
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
    case "speaker":
      // move this?
      // soundtype
      elemStorage.push({elem: elem, audio: null, curve: 1, pitch: 0, octave: 4});
      let btns = elem.querySelectorAll('span');
      btns.forEach(btn => {
        btn.addEventListener('click', function() {
          let input = this.closest('.component').querySelector('.' + this.classList[0] + 'Input');
          let getStorage = storageGet(this)[this.classList[0]];
          let newVal = null;
          switch (this.classList[0]) {
            case 'curve':
              let curves = ["square", "sine", "triangle", "sawtooth"];
              if (this.innerHTML == 'add') newVal = ++getStorage;
              else newVal = --getStorage;
              if (newVal >= curves.length) newVal = curves.length - 1;
              else if (newVal < 0) newVal = 0;
              input.value = curves[newVal];
              break;
            case 'pitch':
              let frequencies = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];
              if (this.innerHTML == 'add') newVal = ++getStorage;
              else newVal = --getStorage;
              if (newVal >= frequencies.length) newVal = frequencies.length - 1;
              else if (newVal < 0) newVal = 0;
              input.value = frequencies[newVal];
              // add octave...
              break;
            case 'octave':
              let octave = [0, 1, 2, 3, 4, 5, 6, 7, 8];
              if (this.innerHTML == 'add') newVal = ++getStorage;
              else newVal = --getStorage;
              if (newVal >= octave.length) newVal = octave.length - 1;
              else if (newVal < 0) newVal = 0;
              input.value = octave[newVal];
              break;
          
            default:
              alert(this.classList[0]);
              break;
          }
          if (newVal !== null) {
            storagePush(this, this.classList[0], newVal);
            if (storageGet(this).audio !== null) playAudio(elem);
          }
        });
      });
      break;
    case '256_bit':
      // move / rename function...
      elemStorage.push({elem: elem, storage: {}});
      break;
  }
  if (child.classList[1] == 'gate' && child.querySelector(".gate_input") !== null) child.querySelector(".gate_input").addEventListener('change', gate);
  elem.addEventListener('click', select);
}

// move these!!!VVV
function storageGet(elem) {
  elem = elem.closest('.component');
  for (var i = 0; i < elemStorage.length; i++) {
    if (elemStorage[i].elem === elem) break;
  }
  return elemStorage[i];
}
function storagePush(elem, key, value) {
  elem = elem.closest('.component');
  for (var i = 0; i < elemStorage.length; i++) {
    if (elemStorage[i].elem === elem) {
      console.log(elemStorage[i], 'STORE', value, key);
      elemStorage[i][key] = value;
      break;
    }
  }
  // return i;
}

// zoom slider
document.getElementById('zoomSlider').addEventListener('input', sliderChange);
function sliderChange() {

  var percent = document.getElementById('zoomSlider').value;

  // zoom main
  var elem = activeMain();

  var zoomFactor = minZoom / 100;

  elem.style.zoom = percent / 100;
  mapZoom = elem.style.zoom;

  elem.style.marginLeft = getDrawerWidth() / mapZoom + "px";
  elem.style.marginTop = top_height / mapZoom + "px";

  document.querySelector('.zoomIndicator').innerHTML = Math.round(mapZoom * 100) + '%'; // DEBUG

  // update
  checkMainPos();
  updateMap(activeMain(), document.querySelector('.map_overlay'), false); // update minimap

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
    activeMain().style.marginLeft = e.clientX + 'px';
    document.querySelector('.map_overlay').style.left = e.clientX + 5 + 'px';
    document.getElementById('tabber').style.left = e.clientX + 5 + 'px';
    document.getElementById('tabber').style.width = 'calc(100vw - ' + (e.clientX + 5) + 'px)';
    document.getElementById('tabber').querySelector('div').style.maxWidth = 'calc(100vw - ' + (e.clientX + 5) + 'px - 44px)';
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
    activeMain().style.marginLeft = pos + 'px';
    document.querySelector('.map_overlay').style.left = pos + 5 + 'px';
    document.getElementById('tabber').style.left = pos + 5 + 'px';
    document.getElementById('tabber').style.width = 'calc(100vw - ' + (pos + 5) + 'px)';
    document.getElementById('tabber').querySelector('div').style.maxWidth = 'calc(100vw - ' + (pos + 5) + 'px - 44px)';
  }
});

// add line listeners
function addLineListeners() {
  setTimeout(function () {
    var query = document.getElementById('main#' + active_tab).querySelectorAll(".line");
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
activeMain().addEventListener('click', mainClick);
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
var tabLeft = 0;
document.addEventListener('mousemove', function(e) {
  var selectionBox = activeMain().querySelector('.selectionBox');
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

    left -= getNumber(activeMain().style.left);
    top -= getNumber(activeMain().style.top);
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
  } else if (tabDown) { // dragTabMouseDown
    var scroller = document.querySelector('.scroller');
    // var left = e.pageX - tabLeft;
    // console.log(left);
    // console.log(tabElem);
    // console.log(tabStart);
    // tabElem.style.position = 'absolute';
    // TODO: snap in place && switch places
    var tabs = [];
    var query = document.querySelectorAll('.tab');
    var thisPos = 0;
    var count = 0;
    var placeholderPos = 0;
    for (var i = 0; i < query.length; i++) {
      var object = {};
      if (!query[i].classList.contains('placeholder')) {
        object.elem = query[i];
        // object.initialLeft = query[i].style.left || 0;
        // object.id = query[i].id;
        object.width = query[i].offsetWidth;
        if (query[i] === tabElem) {
          if (i == 0) thisPos = i;
          else thisPos = i - 1;
        }
        object.left = count;
        count += (object.width + 4);
        tabs.push(object);
      } else {
        // if (i == 0) thisPos = i;
        // else thisPos = i - 1;
        // thisPos = i - 1;
        placeholderPos = i;
      }
    }

    var clone = scroller.querySelector('.placeholder');
    if (clone == null) {
      clone = tabElem.cloneNode(true);
      console.log('INSERT');
      console.log(clone);
      console.log(scroller.querySelectorAll('.tab')[thisPos + 1]);
      if (scroller.querySelectorAll('.tab')[thisPos + 1] == undefined) scroller.insertBefore(clone, scroller.querySelectorAll('.tab')[thisPos]);
      else scroller.insertBefore(clone, scroller.querySelectorAll('.tab')[thisPos + 1]);
      clone.classList.add('placeholder');
      clone.removeAttribute('id');
      clone.style.visibility = 'hidden';
    }
    // console.log(clone);

    tabElem.style.transition = 'left 0s'; // TODO: transition
    tabElem.style.position = 'absolute';
    tabElem.classList.add('helper');

    // console.log(tabs);
    // console.log(tabs[thisPos].left);
    // var newPos = (e.pageX - getDrawerWidth() - 5) - (tabStart - getDrawerWidth() - 5);
    var newPos = tabs[thisPos].left + (e.pageX - getDrawerWidth() - 5) - (tabStart - getDrawerWidth() - 5);
    var changedNewPos = newPos;
    // var scrollerWidth = document.querySelector('.scroller').offsetWidth - tabElem.offsetWidth - 4; // - self - margin
    // if (newPos < 0 - tabs[thisPos].left) changedNewPos = 0 - tabs[thisPos].left;
    // else if (newPos > scrollerWidth - tabs[thisPos].left) changedNewPos = scrollerWidth - tabs[thisPos].left;
    var scrollerWidth = document.querySelector('.scroller').offsetWidth - scroller.querySelector('.placeholder').offsetWidth - 4; // - self - margin
    if (newPos < 0) changedNewPos = 0;
    else if (newPos > scrollerWidth) changedNewPos = scrollerWidth;

    var snapping = 20;
    // if (newPos >= tabs[thisPos].left + -20 && newPos <= tabs[thisPos].left + 20) changedNewPos = tabs[thisPos].left;

    if (placeholderPos > 0) {
      if (newPos >= tabs[placeholderPos - 1].left - snapping && newPos <= tabs[placeholderPos - 1].left + snapping) {
        moveChildren(placeholderPos, placeholderPos - 1);
      }
    } else if (thisPos > 0) {
      if (newPos >= tabs[thisPos - 1].left - snapping && newPos <= tabs[thisPos - 1].left + snapping) {
        // changedNewPos = tabs[thisPos - 1].left - tabs[thisPos].left;
        // tabs[thisPos - 1].elem.style.left = tabs[thisPos].width + 2 + 'px';

        // tabs = moveArray(tabs, thisPos, thisPos - 1);
        moveChildren(thisPos, thisPos - 1);
      // } else {
      //   // tabs[thisPos - 1].elem.style.left = tabs[thisPos - 1].initialLeft + 'px';
      //   tabs[thisPos - 1].elem.style.left = '0px';
      }
    }
    if (placeholderPos + 1 < tabs.length) {
      if (newPos >= tabs[placeholderPos + 1].left - snapping && newPos <= tabs[placeholderPos + 1].left + snapping) {
        moveChildren(placeholderPos, placeholderPos + 1);
      }
    } else if (thisPos + 1 < tabs.length) {
      // console.log(newPos);
      // console.log(tabs[thisPos + 1].left);
      if (newPos >= tabs[thisPos + 1].left - snapping && newPos <= tabs[thisPos + 1].left + snapping) {
        // changedNewPos = tabs[thisPos + 1].width + 4;
        // tabs[thisPos + 1].elem.style.left = 0 - tabs[thisPos].width - 2 + 'px'; // WIP <<<--- make snapping to right work, reoder array/children...

        // tabs = moveArray(tabs, thisPos, thisPos + 1);
        moveChildren(thisPos, thisPos + 1);
      // } else {
      //   tabs[thisPos + 1].elem.style.left = '0px';
      }
    }
    tabElem.style.left = changedNewPos + 'px';
    tabElem.style.zIndex = '99999';

    function moveChildren(oldPos, newPos) {
      var tabElems = document.querySelectorAll('.tab');
      console.log('CHILDREN: (' + oldPos + ' => ' + newPos + ')');
      console.log(tabElems);
      var newChildren = [], childValue = scroller.querySelector('.placeholder'); // childValue = tabElems[oldPos];
      for (var i = 0; i < tabElems.length; i++) {
        console.log(tabElems[i]);
        // if (tabElems[i + 1] !== tabElem) {
        var elem = tabElems[i];
        if (i < tabElems.length) { // i + 1 / i - 1
          if (newPos < oldPos) {
            // if (i == newPos) elem = childValue;
            // // else if (i - 1 == newPos && i + 2 == tabElems.length) elem = tabElems[i];
            // else if (i - 1 == newPos) elem = tabElems[i - 1];
            // else if (i > newPos) elem = tabElems[i + 1];

            if (i == newPos) elem = childValue;
            // else if (i - 1 == newPos && i + 2 == tabElems.length) elem = tabElems[i];
            else if (i - 1 == newPos) elem = tabElems[i];
            else if (i > newPos) elem = tabElems[i];
          } else {
            // if (i == newPos) elem = childValue;
            // else if (i == oldPos) elem = tabElems[i + 1]; // i + 2
            // else if (i - 2 == oldPos) elem = tabElems[i + 1];
            // else if (i > oldPos) elem = tabElems[i + 1];

            if (i == newPos) elem = childValue;
            else if (i == oldPos) elem = tabElems[i + 1]; // i + 2
            else if (i - 2 == oldPos) elem = tabElems[i];
            else if (i > oldPos) elem = tabElems[i];
          }
          if (!elem.classList.contains('helper')) newChildren.push(elem);
        }
        // }
        // console.log(i);
        // console.log(tabElems[i].id);
        // document.querySelectorAll('.tab')[i].innerHTML = newChildren[i].innerHTML;
        // document.querySelectorAll('.tab')[i].id = newChildren[i].id; // + class + style left
      }
      console.log(newChildren);
      var ph = false; // placeholder
      console.log('ORDER:');
      // TODO: reorder tabs (WIP)
      // TODO: reorder tabs (WIP)
      // TODO: reorder tabs (WIP) + save reordered tabs
      for (var i = 0; i < newChildren.length; i++) {
        console.log(newChildren[i]);
        var pos = i;
        // if (newChildren[pos].classList.contains('helper')) tabStart = tabs[i + 1].left;
        if (newChildren[pos].classList.contains('helper') || ph) {
          pos++;
          ph = true;
        }
        console.log('POS: ' + pos);
        if (i + 1 >= newChildren.length) scroller.appendChild(newChildren[i]);
        else scroller.insertBefore(newChildren[i], document.querySelectorAll('.tab')[pos]);
        // document.querySelectorAll('.tab')[i].innerHTML = newChildren[i].innerHTML;
        // document.querySelectorAll('.tab')[i].id = newChildren[i].id; // + class + style left
      }
      // tabStart = tabs[thisPos].left + e.pageX;
      tabStart = newPos + scroller.offsetWidth; // - 4;
    }

    // function moveArray(array, oldPos, newPos) {
    //   var newArray = [], value = array[oldPos];
    //   for (var i = 0; i < array.length; i++) {
    //     if (newPos < oldPos) {
    //       if (i == newPos) newArray.push(value);
    //       else if (i == newPos + 1) newArray.push(array[i - 1]);
    //       else newArray.push(array[i]);
    //     } else {
    //       if (i == newPos) newArray.push(value);
    //       else if (i - 1 == oldPos || i == oldPos) newArray.push(array[i + 1]);
    //       else newArray.push(array[i]);
    //     }
    //   }
    //
    //   var tabElems = document.querySelectorAll('.tab');
    //   var newChildren = [], childValue = tabElems[oldPos];
    //   for (var i = 0; i < tabElems.length; i++) {
    //     if (newPos < oldPos) {
    //       if (i == newPos) newChildren.push(childValue);
    //       else if (i == newPos + 1) newChildren.push(tabElems[i - 1]);
    //       else newChildren.push(tabElems[i]);
    //     } else {
    //       if (i == newPos) newChildren.push(childValue);
    //       else if (i - 1 == oldPos || i == oldPos) newChildren.push(tabElems[i + 1]);
    //       else newChildren.push(tabElems[i]);
    //     }
    //     // console.log(i);
    //     // console.log(tabElems[i].id);
    //     // document.querySelectorAll('.tab')[i].innerHTML = newChildren[i].innerHTML;
    //     // document.querySelectorAll('.tab')[i].id = newChildren[i].id; // + class + style left
    //   }
    //   console.log(newChildren);
    //   for (var i = 0; i < newChildren.length; i++) {
    //     document.querySelectorAll('.tab')[i].innerHTML = newChildren[i].innerHTML;
    //     document.querySelectorAll('.tab')[i].id = newChildren[i].id; // + class + style left
    //   }
    //   // console.log(tabElems);
    //   // console.log(newChildren);
    //   // var newHTML = '';
    //   // document.querySelector('.scroller').innerHTML = '';
    //   // for (var i = 0; i < newChildren.length; i++) {
    //   //   console.log(newChildren[i]);
    //   //   // document.querySelector('.scroller').innerHTML.appendChild(newChildren[i]);
    //   //   document.querySelector('.scroller').innerHTML += newChildren[i].toString();
    //   //   // newHTML += newChildren[i];
    //   // }
    //
    //   return newArray;
    // }
  }
});
activeMain().addEventListener("mousedown", function() { mouseDown = true; });

// mouseup
document.addEventListener("mouseup", function() {
  mouseDown = false;
  draggerDown = false;
  if (tabDown && document.querySelector('.scroller').querySelector('.helper') !== null) {
    // tabElem.style.transition = '';
    // tabElem.style.zIndex = '';
    // tabElem.style.position = '';
    tabElem.removeAttribute('style');
    tabElem.classList.remove('helper');
    var scroller = document.querySelector('.scroller');
    scroller.insertBefore(tabElem, scroller.querySelector('.placeholder'));
    scroller.querySelector('.placeholder').remove();
  }
  tabDown = false;
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

  store(clockElem, 'input', input);

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
    // store(this, {powered: true});
    store(this.closest('.component'), 'powered', this.children[0].classList.contains("on"));
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
    addConnectors(component, component.querySelector('div').classList[0], amount);
    checkForNoConnections();
    if (value !== undefined) input.value = amount;
    store(component, 'input', amount);
  } else {
    amount = 0;
    var connections = input.closest('.component').querySelectorAll('.connection');
    for (var j = 0; j < connections.length; j++) if (connections[j].classList.contains('left')) amount++;
    input.value = amount;
  }
}

///// ...SIGNAL | COMPONENT ACTIONS /////

// power/depower elements
function activate(id, powered, thruth) {
  var elem = document.getElementById(id).closest(".component");
  var connectors = elem.querySelectorAll('.connector');
  if (elem.classList[0] == "box") elem = elem.children[0];
  var type = elem.classList[0];

  var activated = false, activatedArray = [];

  setTimeout(function () {
    var signal = getSignalMap(elem);
    switch (type) {
      case "light":
        console.log('LIGHT');
        if (thruth !== true) {
          if (powered) elem.classList.remove("off");
          else elem.classList.add("off");
        }
        activatedArray.push({conn: elem, powered: powered});
        console.log(activatedArray);
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

      case 'pixel':
      console.log(signal.left);
        // if (signal.left.bools[0] == true) elem.querySelector('#red').classList.remove('off');
        // else if (signal.left.bools[0] == false) elem.querySelector('#red').classList.add('off');
        // if (signal.left.bools[1] == true) elem.querySelector('#green').classList.remove('off');
        // else if (signal.left.bools[1] == false) elem.querySelector('#green').classList.add('off');
        // if (signal.left.bools[2] == true) elem.querySelector('#blue').classList.remove('off');
        // else if (signal.left.bools[2] == false) elem.querySelector('#blue').classList.add('off');

        var color = false;

        if (signal.left.bools[0] && signal.left.bools[1] && signal.left.bools[2]) color = '255, 255, 255'; // white
        else if (signal.left.bools[0] && signal.left.bools[1]) color = '255, 255, 0'; // red + green = yellow
        else if (signal.left.bools[0] && signal.left.bools[2]) color = '255, 67, 255'; // red + blue = magenta
        else if (signal.left.bools[1] && signal.left.bools[2]) color = '0, 255, 255'; // green + blue = cyan
        else if (signal.left.bools[0]) color = '255, 0, 0'; // red
        else if (signal.left.bools[1]) color = '28, 182, 0'; // green
        else if (signal.left.bools[2]) color = '48, 54, 224'; // blue

        if (!color) elem.removeAttribute('style');
        else {
          elem.style.background = 'rgb(' + color + ')';
          elem.style.boxShadow = '0 0 8px rgba(' + color + ', 0.8)';
        }
        // sendSignal(elem, activated);
        // enableOutput(elem, activated);
        break;

      case 'speaker':
        if (signal.left.trues == 1) {
          playAudio(elem);
        } else {
          let soundElem = storageGet(elem);
          if (soundElem.audio !== null) {
            soundElem.gain.gain.exponentialRampToValueAtTime(0.00001, soundElem.context.currentTime + 1);
            // soundElem.audio.stop();
            storagePush(elem, 'audio', null);
            break;
          }
          // for (var i = 0; i < speakerAudio.length; i++) {
          //   if (speakerAudio[i].elem == elem) {
          //     speakerAudio[i].gain.gain.exponentialRampToValueAtTime(0.00001, speakerAudio[i].context.currentTime + 1);
          //     // speakerAudio[i].audio.stop();
          //     speakerAudio.splice(i, 1);
          //     break;
          //   }
          // }
        }
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
      case 'gated_latch':
        if (signal.global.labels.write_enable) {
          if (signal.global.labels.data_in) activated = true;
          sendSignal(elem, activated);
          enableOutput(elem, activated);
        }
        break;
      case 'gated_latch_grid':
        if (signal.global.labels.row && signal.global.labels.column) {
          if (signal.global.labels.write_enable) {
            if (signal.left.bools[0]) activated = true;
            // sendSignal(elem, activated);
            // enableOutput(elem, activated);
            elem.querySelector('.memory').innerHTML = activated;
          }
          if (signal.global.labels.read_enable) {
            if (elem.querySelector('.memory').innerHTML == 'true') activated = true;
            else activated = false;
            console.log('Memory read: ' + activated);
            sendSignal(elem, activated);
            enableOutput(elem, activated);
          } else {
            sendSignal(elem, false);
            enableOutput(elem, false);
          }
        }
        break;

      case '2_4':
        if (signal.global.labels.e) {
          var out = 0;
          if (signal.left.bools[0] && signal.left.bools[1]) out = 3;
          else if (signal.left.bools[0]) out = 1;
          else if (signal.left.bools[1]) out = 2;
          for (var i = 0; i <= 3; i++) {
            sendSignal(elem, false, i);
            enableOutput(elem, false, i);
          }
          sendSignal(elem, true, out);
          enableOutput(elem, true, out);
        } else {
          for (var k = 0; k <= 3; k++) {
            sendSignal(elem, false, k);
            enableOutput(elem, false, k);
          }
        }
        break;
      case 'multiplexer': // TODO: output 0 shoulg be enabled by default!
        for (var m = 4; m < 16 + 4; m++) { // function to make false
          sendSignal(elem, false, m);
          enableOutput(elem, false, m);
        }
        var binary = '';
        for (var l = 3; l >= 0; l -= 1) {
          if (signal.left.bools[l]) binary += '1';
          else binary += '0';
        }
        // var b = parseInt( a.split('').reverse().join(''), 2 );
        console.log(binary);
        var b = parseInt(binary, 2);
        console.log(b);
        sendSignal(elem, true, b + 4); // pos == botton
        enableOutput(elem, true, b + 4);
        break;
      case 'latch_grid':
        var activeInput = {column: 0, row: 0};
        for (var i = 0; i < 16; i++) {
          if (signal.top.bools[i]) activeInput.column = i;
          if (signal.left.bools[i]) activeInput.row = i;
        }
        if (signal.global.labels.write_enable) {
          if (signal.global.labels.data_in) activated = true;
          // resetMemory(type, elem);
          elem.getElementsByClassName(activeInput.column + '_' + activeInput.row)[0].innerHTML = activated;
        }
        if (signal.global.labels.read_enable) {
          if (elem.getElementsByClassName(activeInput.column + '_' + activeInput.row)[0].innerHTML == 'true') activated = true;
          else activated = false;
          console.log('Memory read: ' + activated);
          sendSignal(elem, activated);
          enableOutput(elem, activated);
        } else {
          sendSignal(elem, false);
          enableOutput(elem, false);
        }
        break;
      case '256_bit':
        let storage = storageGet(elem).storage;
        var activeInput = {column: '', row: ''};
        for (var n = 0; n <= 3; n++) {
          if (signal.left.bools[n]) activeInput.column += '1';
          else activeInput.column += '0';
          if (signal.left.bools[n + 4]) activeInput.row += '1';
          else activeInput.row += '0';
        }
        activeInput.column = parseInt(activeInput.column, 2);
        activeInput.row = parseInt(activeInput.row, 2);

        if (signal.global.labels.write_enable) {
          console.log(signal.global);
          if (signal.global.labels['data_(in)']) activated = true; // TODO: ['data_(in)'] = .data_in
          // elem.getElementsByClassName(activeInput.column + '_' + activeInput.row)[0].innerHTML = activated;
          storageGet(elem).storage[activeInput.column + '_' + activeInput.row] = activated;
        }
        if (signal.global.labels.read_enable) {
          // if (elem.getElementsByClassName(activeInput.column + '_' + activeInput.row)[0].innerHTML == 'true') activated = true;
          if (storage[activeInput.column + '_' + activeInput.row] === true) activated = true;
          else activated = false;
          console.log('Memory read: ' + activated);
          sendSignal(elem, activated);
          enableOutput(elem, activated);
        } else {
          sendSignal(elem, false);
          enableOutput(elem, false);
        }
        break;
      case '256_byte':
        // TODO: add storageGet() ...
        var activeInput = {column: '', row: ''};
        for (var n = 11; n >= 8; n -= 1) {
          if (signal.left.bools[n]) activeInput.column += '1';
          else activeInput.column += '0';
          if (signal.left.bools[n + 4]) activeInput.row += '1';
          else activeInput.row += '0';
        }
        console.log(activeInput);
        // 0_0 -> 7_255
        activeInput.column = parseInt(activeInput.column, 2);
        activeInput.row = parseInt(activeInput.row, 2);

        if (signal.global.labels.write_enable) {
          for (var i = 0; i < 8; i++) {
            if (signal.left.bools[i]) activated = true;
            else activated = false;
            console.log(activated);
            console.log(i + ':' + activeInput.column + '_' + activeInput.row);
            elem.getElementsByClassName(i + ':' + activeInput.column + '_' + activeInput.row)[0].innerHTML = activated;
            console.log(elem.getElementsByClassName(i + ':' + activeInput.column + '_' + activeInput.row)[0]);
            console.log(elem.getElementsByClassName(i + ':' + activeInput.column + '_' + activeInput.row)[0].innerHTML);
          }
        }
        if (signal.global.labels.read_enable) {
          readPrevActive = true;
          for (var i = 0; i < 8; i++) {
            console.log(i + ':' + activeInput.column + '_' + activeInput.row);
            console.log(elem.getElementsByClassName(i + ':' + activeInput.column + '_' + activeInput.row)[0]);
            if (elem.getElementsByClassName(i + ':' + activeInput.column + '_' + activeInput.row)[0].innerHTML == 'true') activated = true;
            else activated = false;
            console.log('Memory read: ' + activated);
            sendSignal(elem, activated, i);
            enableOutput(elem, activated, i);
          }
        } else if (readPrevActive) {
          readPrevActive = false;
          sendSignal(elem, false);
          enableOutput(elem, false);
        }
        break;
      case 'register':
        // var activeInput = {column: '', row: ''};
        // for (var n = 0; n <= 3; n++) {
        //   if (signal.left.bools[n]) activeInput.column += '1';
        //   else activeInput.column += '0';
        //   if (signal.left.bools[n + 4]) activeInput.row += '1';
        //   else activeInput.row += '0';
        // }
        // activeInput.column = parseInt(activeInput.column, 2);
        // activeInput.row = parseInt(activeInput.row, 2);

        if (signal.global.labels.write_enable) {
          for (var i = 0; i < 8; i++) {
            if (signal.left.bools[i]) activated = true;
            else activated = false;
            elem.getElementsByClassName(i + '_0')[0].innerHTML = activated;
          }
        }
        if (signal.global.labels.read_enable) {
          // if (elem.getElementsByClassName(activeInput.column + '_' + activeInput.row)[0].innerHTML == 'true') activated = true;
          // else activated = false;
          // console.log('Memory read: ' + activated);
          // sendSignal(elem, activated);
          // enableOutput(elem, activated);
          for (var i = 0; i < 8; i++) {
            if (elem.getElementsByClassName(i + '_0')[0].innerHTML == 'true') activated = true;
            else activated = false;
            // elem.getElementsByClassName(i + '_0')[0].innerHTML = activated;
            sendSignal(elem, activated, i);
            enableOutput(elem, activated, i);
          }
        } else {
          sendSignal(elem, false);
          enableOutput(elem, false);
        }
        break;
    }
    // console.log('return:');
    // console.log(activatedArray);
    // console.log(activatedArray[0]);
    // console.log(activatedArray[0].powered);
    return activatedArray;
  }, 10);
}
var readPrevActive = false; // TODO: this dont work with muliple components of same and different types

// function to reset all memory in a component (move me!!)
function resetMemory(type, elem) {
  var object = getObjectByType(type);
  for (var i = 0; i < object.memory.column; i++) {
    for (var j = 0; j < object.memory.row; j++) {
      document.getElementById(i + '_' + j).innerHTML = false;
    }
  }
}

// TODO: move this...
// TODO: stop audio on elem remove
function playAudio(elem) {
  let soundElem = storageGet(elem);

  // check for existing sound
  var context = new AudioContext();
  var o = context.createOscillator();
  var g = context.createGain();
  if (soundElem.audio !== null) {
    context = soundElem.context;
    o = soundElem.audio;
    g = soundElem.gain;
  }
  // o.type = "square";
  o.connect(g);
  g.connect(context.destination);
  if (soundElem.audio == null) o.start();

  let curves = ["square", "sine", "triangle", "sawtooth"];
  o.type = curves[soundElem.curve];

  // get type
  // var typeValue = elem.querySelector('#tone').value;
  // if (typeValue == 0) o.type = "square";
  // else if (typeValue == 1) o.type = "sine";
  // else if (typeValue == 2) o.type = "triangle";
  // else if (typeValue == 3) o.type = "sawtooth";

  // TODO: disable slider in drawer...

  
  let multiplier = [1, 2, 4, 8, 16, 32, 64, 128, 256];

  // octave 4
  // let frequencies = ['261.6', '277.2', '293.7', '311.1', '329.6', '349.2', '370.0', '392.0', '415.3', '440.0', '466.2', '493.9'];
  let frequencies = ['16.35', '17.32', '18.35', '19.45', '20.60', '21.83', '23.12', '24.50', '25.96', '27.50', '29.14', '30.87'];
  // var frequency = elem.querySelector('#soundtypeList').querySelectorAll('option')[elem.querySelector('#soundtype').value].value;
  var frequency = frequencies[soundElem.pitch] * multiplier[soundElem.octave];
  console.log(frequency);
  o.frequency.value = frequency;

  // TODO: lower volume
  // g.gain.setValueAtTime(0, 0.8);
  // TODO: remove sound/object on delettion / line removal

  // js audio create a sound
  // src: https://marcgg.com/blog/2016/11/01/javascript-audio/
  // https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Advanced_techniques

  // speakerAudio.push({elem: elem, audio: o, gain: g, context: context});
  storagePush(elem, 'audio', o);
  storagePush(elem, 'gain', g);
  storagePush(elem, 'context', context);
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
    bottom: { count: 0, trues: 0, bools: [], ids: [] },
    global: { count: 0, trues: 0, bools: [], ids: [], sides: [], labels: {}, required: [] }
  };
  var connections = elem.querySelectorAll('.connection');
  for (var i = 0; i < connections.length; i++) {
    var sides = ['left', 'right', 'top', 'bottom'], side = '';
    for (var j = 0; j < sides.length; j++) if (connections[i].classList.contains(sides[j])) side = sides[j];

    var id = connections[i].querySelector('.connector').id;
    var signal = hasSignal(id) || connections[i].querySelector('.connector').classList.contains('on');

    output[side].bools.push(signal);
    output[side].ids.push(id);
    if (signal) output[side].trues++;
    output[side].count++;

    output.global.sides.push(side);
    output.global.bools.push(signal);
    output.global.ids.push(id);
    if (signal) output.global.trues++;
    output.global.count++;
    if (connections[i].querySelector('.conn_label') !== null) {
      var label = connections[i].querySelector('.conn_label').innerHTML.toLowerCase().replace(' ', '_');
      output.global.labels[label] = false;
      if (signal) output.global.labels[label] = true;
    }
  }
  return output;
}

// send/remove signal from elem to connected elements
function sendSignal(elem, powered, output) { // TODO: , side
  elem = elem.closest(".component");
  var id = elem.querySelectorAll(".connector")[output || 0].id;
  var query = activeMain().querySelector('.SVGdiv').querySelectorAll(".line");
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
function appendElem(object, tabId, loaded, store) { // remove "loaded" // just send object?
  console.log(object);
  if (tabId == undefined) tabId = active_tab;
  // var object = getObjectByType(type);
  var div = document.createElement("div");
  var component = appendElement(object.type, "main#" + tabId, {input: object.input, powered: object.powered}, loaded);
  component.style.left = object.x + 'px';
  component.style.top = object.y + 'px';
  // component.zIndex = ...

  // TODO:
  if (store === true) {
    var sObject = checkSaved(component, active_tab);
    sObject.object.type = component.children[0].classList[0];
    sObject.object.x = getNumber(component.style.left);
    sObject.object.y = getNumber(component.style.top);
    sObject.object.component = component;
    if (component.querySelector('label') > 0) sObject.object.label = component.querySelector('label').innerHTML;
  }

  if (object.label !== undefined) addLabel(object.label, component);
  if (component.querySelector('.gate_input') !== null) gate(component.querySelector('.textInput'), object.input);
  // addListener(component); // <-- duplicate listener??? VV

  return component;
}

// append element (used for drawer elements)
function appendElement(type, parentId, state, loaded) {
  // if (parentId == undefined) parentId = "main";
  var component = document.createElement("div");
  var object = getObjectByType(type);

  for (var k = 0; k < object.classes.length; k++) component.classList.add(object.classes[k]);

  var classList = type;
  if (object.innerClasses !== undefined)
    for (var l = 0; l < object.innerClasses.length; l++) classList += ' ' + object.innerClasses[l];

  if (object.inspect !== undefined) classList += ' inspect';
  if (object.documentation !== undefined) classList += ' documentation';

  if (object.memory !== undefined) {
    for (var i = 0; i < object.memory.column; i++) {
      for (var j = 0; j < object.memory.row; j++) {
        var id = i + '_' + j;
        if (object.memory.repeat !== undefined) {
          for (var r = 0; r < object.memory.repeat; r++) {
            object.children += '<div class="' + r + ':' + id + ' memory hidden">false</div>';
          }
        } else {
          object.children += '<div class="' + id + ' memory hidden">false</div>';
        }
      }
    }
  }

  component.innerHTML = '<div class="' + classList + '">' + object.children + '</div>';

  if (state !== undefined) {
    console.log(state);
    if (state.input !== undefined) component.querySelector('.textInput').value = state.input;
    if (state.powered !== undefined) if (state.powered) component.classList.add('powered');
  }

  document.getElementById(parentId).appendChild(component);

  if (loaded === true) {
    if (type == "clock") {
      console.log(123);
      var clockInput = 0;
      while (document.getElementById('clockInput#' + clockInput) !== null) clockInput++;
      component.querySelector(".clock_input").id = "clockInput#" + clockInput;
    }
    if (component.querySelector(".textInput") !== null) component.querySelector(".textInput").removeAttribute('tabindex');
  }

  // TODO: THIS IS NEVER #MAIN!!!
  if (parentId.includes("main#")) {
    component.classList.add("component");
    document.getElementById(parentId).classList.remove('hidden');
    // console.log(component.offsetHeight);
    addConnectors(component, type);
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
function cSVG(from, to, tabId) {
  // console.log(tabId);
  // console.log(from);
  // console.log(to);
  createSVG(getSignalMap(from.elem)[from.side || 'global'].ids[from.pos || 0], getSignalMap(to.elem)[to.side || 'global'].ids[to.pos || 0], tabId);
}
// create svg with start and end id
function createSVG(connStart, connEnd, tabId) {
  if (tabId == undefined) tabId = active_tab;
  var id = connStart + ':' + connEnd;
  if (noMatchingLines(id)) { // no lines with the exact same id (same connections)
    var posTo = getLinePos(document.getElementById(connEnd));
    var posFrom = getLinePos(document.getElementById(connStart));
    var svg = document.getElementById('main#' + tabId).querySelector('.SVGdiv');
    var originalSVG = document.getElementById('main#' + tabId).querySelector('.SVGdiv').innerHTML;
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
    var matching = checkForLine(lines[j].id, parent.closest('.main'));
    for (var i = 0; i < matching.length; i++) {
      var line = parent.closest('.main').getElementsByClassName("line")[matching[i].replace(/\D+/g, '')]; // document.getElementById('main#' + active_tab)
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
  if (settings.lineType == "straight") {
    output = 'M ' + storeInput.x1 + ' ' + storeInput.y1 + ' C ' + storeInput.x1 + ' ' + storeInput.y1 + ', ' + storeInput.x2 + ' ' + storeInput.y2 + ', ' + storeInput.x2 + ' ' + storeInput.y2;
  } else if (settings.lineType == 'lined') {
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

// add connectors to element
// var connectors = 0;
function addConnectors(component, type, amount) {
  var object = getObjectByType(type);
  var connectionId = 0;

  // get connector amount
  var count = {left: 0, right: 0, top: 0, bottom: 0}, labels = {right: [], left: [], top: [], bottom: []}, required = {right: [], left: [], top: [], bottom: []};
  for (var i = 0; i < Object.keys(object.connectors).length; i++) {
    var key = Object.keys(object.connectors)[i];
    var connectorsObject = object.connectors[key];
    count[key] = connectorsObject.amount || 1;
    if (connectorsObject.label !== undefined) {
      // ['test', 'test2', 'test3', 'testings']
      // ['#$i+']
      // ['First', '$i']
      for (var n = 0; n < connectorsObject.label.length; n++) {
        var label = connectorsObject.label[n];
        if (label !== null) {
          if (label.includes('$i+')) {
            for (var j = 0; j < count[key]; j++)
            labels[key][j] = label.slice(0, label.indexOf('$i+')) + (j + 1) + label.slice(label.indexOf('$i+') + 3, label.length);
          } else if (label.includes('$i')) {
            for (var k = 0; k < count[key]; k++)
            labels[key][k] = label.slice(0, label.indexOf('$i')) + k + label.slice(label.indexOf('$i') + 2, label.length);
          } else if (label.includes('@')) labels[key][label.slice(1, label.indexOf(':')) - 1] = label.slice(label.indexOf(':') + 1, label.length);
          else if (label !== null) labels[key][n] = label;
        }
      }
    }
    if (connectorsObject.required !== undefined) {
      for (var r = 0; r < connectorsObject.required.length; r++) {
        if (connectorsObject.required[r] == null) required[key][r] = null;
        else if (connectorsObject.required[r] == false) required[key][r] = 'notRequired';
        else required[key][r] = 'required';
      }
    }
  }

  if (amount !== undefined) {
    count.left = amount;
    component.style.height = 80 + (amount - 2) * 10 + 'px';
    component.querySelector('.gate_input').style.marginTop = '50%';
    component.querySelector('.gate_input').style.marginTop = component.offsetHeight / 2 + 'px';

    var query = component.querySelectorAll('.connection');
    for (var l = 0; l < query.length; l++) {
      var id = query[l].querySelector('.connector').id;
      if (count.right + l > amount + 1) removeConnected(id);
      query[l].remove();
    }
  }

  // create connector
  console.log(component);
  console.log(component.offsetHeight);
  var slicesRight = component.offsetHeight / (count.right + 1),
      slicesLeft = component.offsetHeight / (count.left + 1),
      slicesTop = component.offsetWidth / (count.top + 1),
      slicesBottom = component.offsetWidth / (count.bottom + 1);
  for (var j = 0; j < count.right; j++) appendConnector(slicesRight * (j + 1), 'right', labels.right[j] || null, required.right[j] || null);
  for (var k = 0; k < count.left; k++) appendConnector(slicesLeft * (k + 1), 'left', labels.left[k] || null, required.left[k] || null);
  for (var m = 0; m < count.top; m++) appendConnector(slicesTop * (m + 1), 'top', labels.top[m] || null, required.top[m] || null);
  for (var n = 0; n < count.bottom; n++) appendConnector(slicesBottom * (n + 1), 'bottom', labels.bottom[n] || null, required.bottom[n] || null);

  // append connector
  function appendConnector(offset, side, label, required) {
    var connection = document.createElement("div");
    if (side == 'right' || side == 'left') connection.style.top = offset + 'px';
    else connection.style.left = offset + 'px';
    connection.classList.add("connection", side);
    if (required !== null) connection.classList.add(required);
    while (document.getElementById('conn_' + connectionId) !== null) connectionId++;
    connection.innerHTML = '<div class="connector" id="conn_' + connectionId + '"></div>';
    if (label !== null) {
      var offsetStyle = 'Y';
      if (side == 'top' || side == 'bottom') offsetStyle = 'X';
      connection.innerHTML += '<div class="conn_label" style="transform: translate' + offsetStyle + '(-50%); ' + side + ': 16px;">' + label + '</div>';
    }
    component.appendChild(connection);
    // connectors++;
  }

  moveSVG(component);
  activate('conn_' + connectionId);
}

// check if connector has power
function hasSignal(id) {
  var query = document.getElementById('main#' + active_tab).querySelector('.SVGdiv').querySelectorAll(".line");
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

  var query = activeMain().querySelectorAll(".component");
  for (var i = 0; i < query.length; i++) {
    var c = getElemStyles(query[i]);
    if (c.left >= left && c.top >= top && c.left <= right && c.top <= bottom || c.right >= left && c.bottom >= top && c.left <= right && c.top <= bottom)
      // query[i].classList.add("selected");
      addSelection(query[i]);
    else if (!shift) removeSelectionIcons(query[i]);
  }

  var lines = activeMain().querySelectorAll(".lineSVG");
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
    //   lines[j].classList.add("selected");
    // else if (!shift) lines[j].classList.remove("selected");
    addSelection(lines[j]);
    else if (!shift) removeSelectionIcons(lines[j]);
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
function addLabel(text, component, drawer) {
  var label = document.createElement("div");
  label.classList.add("label");
  label.innerHTML = text;
  if (drawer === true) label.classList.add("small");
  component.appendChild(label);
}

// get label from element
function getLabel(elem) {
  var label = "";
  if (elem.querySelector('.label') !== null) label = elem.querySelector('.label').innerHTML;
  return label;
}

///// SELECTION /////

// select elements
function select(e) {
  var elem = this;
  if (elem.classList.contains("line")) elem = elem.closest(".lineSVG");
  if (elem.classList.contains("component") || elem.classList.contains("lineSVG")) {
    if (!e.ctrlKey && !e.shiftKey && !mainMoved) removeSelection();
    if (active) {
      if (elem.classList.contains("selected")) {
        if (e.ctrlKey || e.shiftKey) removeSelectionIcons(elem); // elem.classList.remove("selected");
      } else addSelection(elem);
    }
  }
}
function addSelection(elem) {
  elem.classList.add("selected");
  getIcon('delete').removeAttribute('disabled');
  if (!elem.classList.contains("lineSVG")) {
    getIcon('filter_none').removeAttribute('disabled');
    getIcon('rotate_right').removeAttribute('disabled');
    getIcon('rotate_left').removeAttribute('disabled');
    getIcon('post_add').removeAttribute('disabled');
  }
}
function removeSelectionIcons(elem) {
  if (elem !== undefined) elem.classList.remove("selected");
  if (activeMain().querySelectorAll('.selected').length == 0 || elem == undefined) getIcon('delete').setAttribute('disabled', '');

  var components = activeMain().querySelectorAll('.components'), selectedComp = 0;
  for (var i = 0; i < components.length; i++) if (components[i].classList.contains('selected')) selectedComp++;
  if (selectedComp <= 0 || elem == undefined) {
    getIcon('filter_none').setAttribute('disabled', '');
    getIcon('rotate_right').setAttribute('disabled', '');
    getIcon('rotate_left').setAttribute('disabled', '');
    getIcon('post_add').setAttribute('disabled', '');
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
    }, 10);
    removeStoredConnections(store(document.getElementById(getLineConnectors(elem.lastChild).to).closest('.component')).key);
  } else {
    // var id = elem.querySelector(".connector").id;
    var query = activeMain().querySelector('.SVGdiv').querySelectorAll(".lineSVG");
    for (var i = 0; i < query.length; i++) {
      var lc = getLineConnectors(query[i].lastChild);
      var ids = getSignalMap(elem).global.ids;
      for (var j = 0; j < ids.length; j++) if (lc.from == ids[j] || lc.to == ids[j]) query[i].remove();
      // TODO: update signal
    }
    removeStoredConnections(store(elem).key);
  }
  store(elem, 'delete');
  elem.remove();
}
// remove every selected element
function removeSelection() {
  var query = activeMain().querySelectorAll(".selected");
  var length = query.length;
  for (var i = 0; i < length; i++) {
    // query[i].classList.remove("selected");
    removeSelectionIcons(query[i]);
  }
}

// select / deselect all, or return amount selected
function selector(action) {
  var selected = 0;
  var components = activeMain().querySelectorAll('.component');
  for (var i = 0; i < components.length; i++) {
    if (action == 'select') components[i].classList.add('selected');
    if (action == 'deselect') components[i].classList.remove('selected');
    if (components[i].classList.contains('selected')) selected++;
  }
  var lines = activeMain().querySelectorAll('.lineSVG');
  for (var j = 0; j < lines.length; j++) {
    if (action == 'select') lines[j].classList.add('selected');
    if (action == 'deselect') lines[j].classList.remove('selected');
    if (lines[j].classList.contains('selected')) selected++;
  }
  if (action == 'count') return selected >= components.length + lines.length && components.length + lines.length > 0;
}

///// LINE | CONNECTIONS /////

// check if any lines is connected to the connector id
function hasNoConnections(id) {
  var hasNoConnections = true;
  var divs = document.querySelectorAll('.SVGdiv');
  for (var d = 0; d < divs.length; d++) {
    var query = divs[d].querySelectorAll(".line");
    for (var i = 0; i < query.length; i++) {
      var lc = getLineConnectors(query[i]);
      if (lc.from == id || lc.to == id) {
        hasNoConnections = false;
        break;
      }
    }
  }
  return hasNoConnections;
}
// get all lines connected to connector
function checkForLine(id, main) {
  if (main == undefined) main = document.getElementById('main#' + active_tab);
  var out = [];
  var query = main.querySelector('.SVGdiv').querySelectorAll(".line");
  for (var i = 0; i < query.length; i++) {
    var lc = getLineConnectors(query[i]);
    if (lc.from == id) out.push("from" + i);
    else if (lc.to == id) out.push("to" + i);
  }
  return out;
}
// remove all lines connected to a connector
function removeConnected(id) {
  var query = activeMain().querySelector('.SVGdiv').querySelectorAll(".line");
  for (var i = 0; i < query.length; i++) {
    var lc = getLineConnectors(query[i]);
    if (lc.from == id || lc.to == id) query[i].closest('.lineSVG').remove();
  }
}
// check if connectors has no connections
function checkForNoConnections() {
  var query = document.querySelectorAll(".connector");
  for (var i = 0; i < query.length; i++) {
    // TODO: left / right / required
    // var objectThing = getObjectByType(query[i].closest('.component').children[0].classList[0]).connectors;
    // var required = getSignalMap(query[i]).required[i];
    var classList = query[i].closest(".connection").classList;
    if (classList.contains("left") || classList.contains("top") || classList.contains('required')) {
      if (hasNoConnections(query[i].id) && !classList.contains('notRequired')) query[i].classList.add("notConnected");
      else if (query[i].classList.contains("notConnected")) query[i].classList.remove("notConnected");
    } else if (query[i].classList.contains("notConnected")) query[i].classList.remove("notConnected");
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
    y += parseInt(connection.style.top, 10); // elmnt.offsetHeight / 2;
  } else if (connection.classList.contains("left")) {
    x += 0 - connection.offsetWidth - (connector.offsetWidth / 2);
    y += parseInt(connection.style.top, 10);
  } else if (connection.classList.contains('top')) {
    y += 0 - connection.offsetHeight - (connector.offsetHeight / 2);
    x += parseInt(connection.style.left, 10);
  } else if (connection.classList.contains('bottom')) {
    y += elmnt.offsetHeight + connection.offsetHeight + (connector.offsetHeight / 2);
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
  var query = document.getElementById('main#' + active_tab).querySelector('.SVGdiv').querySelectorAll(".line");
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
document.getElementById('tabber').querySelector('.tab').addEventListener('mousedown', dragTab);
document.getElementById('tabber').querySelector('.tab').querySelector('#close').addEventListener('click', closeTab);
// create new page and tab
var tabsId = 1;
function addTab(name, active) {
  // TODO: reorder tabs
  // TODO: contaxt tab bar: new, delete
  // var count = document.getElementById('tabber').querySelectorAll('.tab').length;

  var newTab = document.createElement('div');
  newTab.classList.add('tab');
  newTab.id = 'tab#' + tabsId;
  newTab.innerHTML = '<span class="unsaved">' + name + '</span><div id="close"><i class="material-icons tabber" title="Close">close</i></div>';
  document.getElementById('tabber').querySelector('div').appendChild(newTab);
  newTab.addEventListener('click', openTab);
  newTab.addEventListener('mousedown', dragTab);
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

  if (active !== false) {
    active_tab = tabsId;
    newTab.click();
    home();
  }
  tabsId++;

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

    var selectedElems = activeMain().querySelectorAll('.selected');
    removeSelectionIcons();
    for (var k = 0; k < selectedElems.length; k++) {
      addSelection(selectedElems[k]);
    }

    document.getElementById('zoomSlider').value = newMain.style.zoom * 100;
    sliderChange();
    updateMap(activeMain(), document.querySelector('.map_overlay'), true);

    // checkForNoConnections();
  }
}
function home() {
  activeMain().style.left = '-' + (activeMain().offsetWidth / 2 - window.innerWidth / 2) + 'px';
  activeMain().style.top = '-' + (activeMain().offsetHeight / 2 - window.innerHeight / 2) + 'px';
  document.getElementById('zoomSlider').value = 100;
  sliderChange();
  updateMap(activeMain(), document.querySelector('.map_overlay'), true);
}

// remove page and tab
function closeTab(e, elem) {
  if (elem == undefined) elem = this.closest('.tab');
  console.log(elem);
  // TODO: remove clock intervals... ++
  if (document.querySelectorAll('.tab').length < 2) alert("Can't delete. There needs to be one tab left.");
  else if (confirm('Are you sure you want to delete this tab and remove all of its content?')) {
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

// get the active tab object
// TODO: creating new tabs store name
function tabObject(id) {
  if (id == undefined) id = active_tab;
  else if (id.toString().includes('tab#')) id = id.slice(4, id.length);
  if (saves.tabs[id] == undefined) saves.tabs[id] = {};
  return saves.tabs[id];
}
// get the main of the active tab
function activeMain() {
  return document.getElementById('main#' + active_tab);
}

// TAB DRAG
var tabElem = '', tabDown = false, tabStart = 0;
function dragTab(e) {
  tabDown = true;
  tabElem = this.closest('.tab');
  tabStart = e.clientX - getNumber(tabElem.style.left) || 0;
  // tabStart = tabElem.offsetLeft;
}


///// history.. /////
function historyAdd(type, values) {
  document.getElementById('tab#' + active_tab).querySelector('span').classList.add('unsaved');
  console.log(historyLog);

  historyLog.push({type: type, values: values});
  if (historyLog.length > 0) getIcon('undo').removeAttribute('disabled');

  // clear redo

  console.log(historyLog);

  // componentAdd
  // componentMove
  // connectorAdd

  // elem: component, type, top, left, zIndex
  // id: id, svg: svg
}
// getIcon('undo').setAttribute('disabled', '');

///// saves...

// store a value inside its own object
function store(elem, id, value) {
  var object = {}, name = '';
  var tabObj = tabObject();
  // console.log(active_tab);
  // console.log(tabObj);
  if (tabObj.components !== undefined) {
    for (var i = 0; i < Object.keys(tabObj.components).length; i++) {
      console.log(tabObj.components.component);
      name = Object.keys(tabObj.components)[i];
      if (tabObj.components[name].component === elem) {
        if (id == 'delete') delete tabObj.components[name];
        else if (id !== undefined) tabObj.components[name][id] = value;
        object = tabObj.components[name];
        break;
      }
    }
  }
  return {object: object, key: name};
}

// remove all connections connected to an element
function removeStoredConnections(key) {
  var compObj = tabObject().components;
  var compKeys = Object.keys(compObj);
  console.log('KEY');
  console.log(key);
  for (var i = 0; i < compKeys.length; i++) {
    var conn = compObj[compKeys[i]].connection;
    if (conn !== undefined) {
      for (var j = 0; j < conn.connections.length; j++) {
        if (conn.connections[j].id == key) {
          conn.connections.splice(j, 1);
          j--;
        }
      }
      // for (var j = 0; j < Object.keys(conn).length; j++) {
      //   var connKey = Object.keys(conn)[j];
      //   var connObj = conn[connKey];
      //   if (connKey == key) delete conn[connKey];
      // }
    }
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
