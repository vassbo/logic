
// TODO: add documentation
var components = {
  inputs: {
    name: 'Inputs',
    toggle: {
      name: 'Toggle Switch',
      classes: ['box'],
      children: '<div class="btn-light"></div>',
      connections: {
        0: {
          pos: 'right',
          // name: 'output' // ... (description) TODO: <--
        }
      }
    },
    button: {
      name: 'Push Button',
      documentation: 'Just a button, nothing special.',
      classes: ['box'],
      children: '',
      connections: {
        0: {
          pos: 'right',
        }
      }
    },
    clock: {
      name: 'Clock',
      documentation: 'The clock is a timer.....<br><br>ms = milli seconds<br>s = seconds<br>m = minutes<br>h = hours<br><br>e.g. 1s == 1000ms',
      classes: ['box'],
      children: '<div class="display"><input class="clock_input textInput" id="clockInput#0" tabindex="-1" value="500ms" type="text"><div class="signal-light"></div></div>',
      connections: {
        0: {
          pos: 'right',
        }
      }
    },
    high_constant: {
      name: 'High constant',
      classes: ['box'],
      innerClasses: ['constant', 'noselect'],
      children: '<span>1</span>',
      connections: {
        0: {
          pos: 'right',
        }
      }
    },
    low_constant: {
      name: 'Low constant',
      classes: ['box'],
      innerClasses: ['constant', 'noselect'],
      children: '<span>0</span>',
      connections: {
        0: {
          pos: 'right',
        }
      }
    }
  },
  outputs: {
    name: 'Outputs',
    light: {
      name: 'Light Bulb',
      classes: ['box', 'round'],
      innerClasses: ['off'],
      children: '',
      connections: {
        0: {
          pos: 'left',
        }
      }
    },
    number_display: {
      name: '4-Bit Digit',
      classes: ['box'],
      innerClasses: ['constant', 'noselect'],
      children: '<span>0</span>',
      connections: {
        0: {
          pos: 'left',
        },
        1: {
          pos: 'left',
        },
        2: {
          pos: 'left',
        },
        3: {
          pos: 'left',
        }
      }
    },
    seven_segment: {
      name: 'Seven Segment Display',
      classes: ['box', 'big'],
      children: '<div id="number_1"></div><div id="number_2"></div><div id="number_3"></div><div id="number_4"></div><div id="number_5"></div><div id="number_6"></div><div id="number_7"></div>',
      connections: {
        0: {
          pos: 'left',
        },
        1: {
          pos: 'left',
        },
        2: {
          pos: 'left',
        },
        3: {
          pos: 'left',
        },
        4: {
          pos: 'left',
        },
        5: {
          pos: 'left',
        },
        6: {
          pos: 'left',
        }
      }
    }
  },
  logic_gates: {
    name: 'Logic Gates',
    buffer: {
      name: 'Buffer',
      classes: ['box', 'bufferc'],
      innerClasses: ['gate'],
      children: '',
      connections: {
        0: {
          pos: 'left',
        },
        1: {
          pos: 'right'
        }
      }
    },
    not: {
      name: 'NOT Gate',
      classes: ['box', 'notc'],
      innerClasses: ['gate'],
      children: '',
      connections: {
        0: {
          pos: 'left',
        },
        1: {
          pos: 'right'
        }
      }
    },
    and: {
      name: 'AND Gate',
      classes: ['box', 'andc'],
      innerClasses: ['gate'],
      children: '<input class="gate_input textInput" value="2" tabindex="-1" type="number" min="2" max="999">', // id="gateInput#0"
      connections: {
        0: {
          pos: 'left',
        },
        1: {
          pos: 'left'
        },
        2: {
          pos: 'right'
        }
      }
    },
    nand: {
      name: 'NAND Gate',
      classes: ['box', 'andc'],
      innerClasses: ['gate'],
      children: '<input class="gate_input textInput" value="2" tabindex="-1" type="number" min="2" max="999">', // id="gateInput#0"
      connections: {
        0: {
          pos: 'left',
        },
        1: {
          pos: 'left'
        },
        2: {
          pos: 'right'
        }
      }
    },
    or: {
      name: 'OR Gate',
      classes: ['box', 'orc'],
      innerClasses: ['gate'],
      children: '<input class="gate_input textInput" value="2" tabindex="-1" type="number" min="2" max="999">',
      connections: {
        0: {
          pos: 'left',
        },
        1: {
          pos: 'left'
        },
        2: {
          pos: 'right'
        }
      }
    },
    nor: {
      name: 'NOR Gate',
      classes: ['box', 'orc'],
      innerClasses: ['gate'],
      children: '<input class="gate_input textInput" value="2" tabindex="-1" type="number" min="2" max="999">',
      connections: {
        0: {
          pos: 'left',
        },
        1: {
          pos: 'left'
        },
        2: {
          pos: 'right'
        }
      }
    },
    xor: {
      name: 'XOR Gate',
      classes: ['box', 'xorc'],
      innerClasses: ['gate'],
      children: '<input class="gate_input textInput" value="2" tabindex="-1" type="number" min="2" max="999">',
      connections: {
        0: {
          pos: 'left',
        },
        1: {
          pos: 'left'
        },
        2: {
          pos: 'right'
        }
      }
    },
    xnor: {
      name: 'XNOR Gate',
      classes: ['box', 'xorc'],
      innerClasses: ['gate'],
      children: '<input class="gate_input textInput" value="2" tabindex="-1" type="number" min="2" max="999">',
      connections: {
        0: {
          pos: 'left',
        },
        1: {
          pos: 'left'
        },
        2: {
          pos: 'right'
        }
      }
    },
  },
  flip_flops: {
    name: 'Flip-Flops'
  },
  other: {
    name: 'Other',
    transistor: {
      name: 'Transistor', // Tri-state
      classes: ['box'],
      innerClasses: ['gate'],
      children: '<div class="arrow"><span></span><span></span><span></span></div>',
      connections: {
        0: {
          pos: 'top',
        },
        1: {
          pos: 'left'
        },
        2: {
          pos: 'right'
        }
      }
    },
    transistor_inv: {
      name: 'Transistor Inverted',
      classes: ['box'],
      innerClasses: ['gate'],
      children: '<div class="arrow"><span></span><span></span><span></span><span></span></div>',
      connections: {
        0: {
          pos: 'top',
        },
        1: {
          pos: 'left'
        },
        2: {
          pos: 'right'
        }
      }
    },
    seven_segment_decoder: {
      name: 'Seven Segment Display Decoder',
      classes: ['box', 'big'],
      children: '',
      connections: {
        0: {
          pos: 'left',
          name: '8'
        },
        1: {
          pos: 'left',
          name: '4'
        },
        2: {
          pos: 'left',
          name: '2'
        },
        3: {
          pos: 'left',
          name: '1'
        },
        4: {
          pos: 'right',
        },
        5: {
          pos: 'right',
        },
        6: {
          pos: 'right',
        },
        7: {
          pos: 'right',
        },
        8: {
          pos: 'right',
        },
        9: {
          pos: 'right',
        },
        10: {
          pos: 'right',
        },
      }
    }
  },
  custom: {
    name: 'Custom'
  }
};

// append elements to drawer
for (var i = 0; i < Object.keys(components).length; i++) {

  var os = Object.keys(components)[i]; // os = object section
  section(components[os].name);
  createGrid("d" + os); // d = drawer
  for (var j = 1; j < Object.keys(components[os]).length; j++) {
    var object = Object.keys(components[os])[j];
    var elem = components[os][object];
    addLabel(elem.name, appendElement(object, "d" + os), true);
  }
}

// create drawer section
function section(name) {
  var div = document.createElement("div");
  div.classList.add("section");
  div.innerHTML = name;
  document.getElementById("drawer").appendChild(div);
}

// create drawer grid
function createGrid(name) {
  var div = document.createElement("div");
  div.id = name;
  div.classList.add("grid");
  document.getElementById("drawer").appendChild(div);
}


///// GET LOCALSTORAGE /////

if (localStorage.lineType !== undefined) setting_lineType = localStorage.lineType;
if (localStorage.lineColor_idle !== undefined) setting_lineColor_idle = localStorage.lineColor_idle;
if (localStorage.lineColor_powered !== undefined) setting_lineColor_powered = localStorage.lineColor_powered;
if (localStorage.theme !== undefined) setting_theme = localStorage.theme;
if (localStorage.background !== undefined) setting_background = localStorage.background;

///// BUTTONS /////

var query = document.querySelectorAll("i");
for (var i = 0; i < query.length; i++) query[i].addEventListener('click', btnClick);
function btnClick() {
  if (this.getAttribute('disabled') == null) {
    var id = this.innerText;
    switch (id) {
      // top
      case 'save':
        save();
        break;
      case 'cloud_download':
        save(undefined, true);
        break;
      case 'folder_open':
        importFile();
        break;
      case 'access_time':
        this.classList.toggle('active');
        document.getElementById('timers').classList.toggle('hidden');
        if (document.getElementById('timers').classList.contains('hidden')) document.getElementById('bottomActions').style.right = null;
        else document.getElementById('bottomActions').style.right = document.querySelector('.right_menu').offsetWidth + 20 + 'px';
        break;

      // top right
      case "widgets":
        document.getElementById("dark").classList.remove("hidden");
        document.getElementById("modes").classList.remove("hidden");
        break;
      case "settings_gear":
        document.getElementById("dark").classList.remove("hidden");
        document.getElementById("settings").classList.remove("hidden");
        break;

      // general
      case "close":
        if (!this.classList.contains('tabber')) {
          document.getElementById("dark").classList.add("hidden");
          this.closest('.card').classList.add('hidden');
        }
        break;

      // bottom
      case 'stop':
        var play = getIcon('pause');
        if (play !== undefined) {
          play.innerHTML = 'play_arrow';
          play.title = 'Resume Simulation';
        }
        enable(['fast_forward', 'fast_rewind'], true);
        break;
      case 'pause':
        this.innerHTML = 'play_arrow';
        this.title = 'Resume Simulation';
        enable(['fast_forward', 'fast_rewind'], true);
        break;
      case 'play_arrow':
        this.innerHTML = 'pause';
        this.title = 'Pause Simulation';
        enable(['fast_forward', 'fast_rewind'], false);
        break;
      case 'home':
        home();
        break;
      case 'add':
        if (this.classList.contains('tabber')) {
          var count = document.getElementById('tabber').querySelectorAll('.tab').length;
          addTab('unnamed_' + count);
        }
        else {
          document.getElementById('zoomSlider').value = Number(document.getElementById('zoomSlider').value) + 20;
          sliderChange();
        }
        break;
      case 'remove':
        document.getElementById('zoomSlider').value = Number(document.getElementById('zoomSlider').value) - 20;
        sliderChange();
        break;
      default:
        alert(id);
    }
  }
}

// enable or disable a button
function enable(nameQuery, enable) {
  var query = document.querySelectorAll('.material-icons');
  for (var i = 0; i < query.length; i++)
    for (var j = 0; j < nameQuery.length; j++)
      if (query[i].innerText == nameQuery[j]) {
        if (enable) query[i].removeAttribute('disabled');
        else query[i].setAttribute('disabled', '');
      }
}

// get material icon element by name
function getIcon(name) {
  var query = document.querySelectorAll('.material-icons');
  for (var i = 0; i < query.length; i++)
    if (query[i].innerText == name) return query[i];
}

///// SETTINGS /////

function updateSettings() {
  document.documentElement.removeAttribute("style");

  // THEME
  if (setting_theme == "theme_light") {
  } else if (setting_theme == "theme_dark") {
    document.documentElement.style.setProperty('--main-color', "#242424");
    document.documentElement.style.setProperty('--main-color-inverted', "white");
    document.documentElement.style.setProperty('--main-background', "#585858");
    document.documentElement.style.setProperty('--transparent--10', "rgba(255, 255, 255, 0.1)");
    document.documentElement.style.setProperty('--transparent--20', "rgba(255, 255, 255, 0.2)");
    document.documentElement.style.setProperty('--transparent--50', "rgba(255, 255, 255, 0.5)");
  } else if (setting_theme == "theme_night") {
    document.documentElement.removeAttribute("style");
    document.documentElement.style.setProperty('--main-color', "black");
    document.documentElement.style.setProperty('--main-color-inverted', "#bebebe");
    document.documentElement.style.setProperty('--main-background', "black");
    document.documentElement.style.setProperty('--transparent--10', "rgba(255, 255, 255, 0.1)");
    document.documentElement.style.setProperty('--transparent--20', "rgba(255, 255, 255, 0.2)");
    document.documentElement.style.setProperty('--transparent--50', "rgba(255, 255, 255, 0.5)");
    document.documentElement.style.setProperty('--transparent--50', "rgba(255, 255, 255, 0.5)");
    document.documentElement.style.setProperty('--light-off', "#696969");
    document.documentElement.style.setProperty('--component-back', "#5e3100");
    document.documentElement.style.setProperty('--component-action', "#600000");
    document.documentElement.style.setProperty('--component-action--hover', "#7c0000");
    document.documentElement.style.setProperty('--toolbar-iconcolor', "#267ba3");
  } else if (setting_theme == "theme_neon") {
    // TODO: NEON THEME
    document.documentElement.style.setProperty('--main-color', "#1b1b1b");
    document.documentElement.style.setProperty('--main-color--second', "#1b1b1b");
    document.documentElement.style.setProperty('--main-color-inverted', "white");
    document.documentElement.style.setProperty('--main-background', "#000000");
    document.documentElement.style.setProperty('--transparent--10', "rgba(255, 255, 255, 0.1)");
    document.documentElement.style.setProperty('--transparent--20', "rgba(255, 255, 255, 0.2)");
    document.documentElement.style.setProperty('--transparent--50', "rgba(255, 255, 255, 0.5)");
    document.documentElement.style.setProperty('--light-off', "rgba(0, 0, 0, 0.6)");
    document.documentElement.style.setProperty('--component-back', "#ff00e7");
    document.documentElement.style.setProperty('--component-action', "#8505fb");
    document.documentElement.style.setProperty('--component-action--hover', "#a13bff");
    document.documentElement.style.setProperty('--light-active', "#ff30ac");
    document.documentElement.style.setProperty('--light-active--shadow', "rgba(224, 18, 141, 0.82)");
    document.documentElement.style.setProperty('--toolbar-iconcolor', "#08f5fb");
  }

  // LINE COLOR
  document.documentElement.style.setProperty('--line-idle', setting_lineColor_idle);
  document.documentElement.style.setProperty('--line-powered', setting_lineColor_powered);

  // BACKGROUND STYLE
  if (setting_background == "dotted") document.getElementById("main#" + active_tab).style.backgroundImage = "radial-gradient(circle, var(--transparent--20) 1px, rgba(0, 0, 0, 0) 1px)";
  else if (setting_background == "lines") document.getElementById("main#" + active_tab).style.backgroundImage = "linear-gradient(to right, var(--transparent--10) 1px, transparent 1px), linear-gradient(to bottom, var(--transparent--10) 1px, transparent 1px)";
  else if (setting_background == "blank") document.getElementById("main#" + active_tab).style.backgroundImage = "none";

  // LINE TYPE
  if (localStorage.lineType !== setting_lineType) {
    localStorage.lineType = setting_lineType;
    moveSVG(document.getElementById('main#' + active_tab));
  }
}

var query = document.querySelectorAll(".settings");
for (var i = 0; i < query.length; i++) query[i].addEventListener("click", settingsClick);
function settingsClick() {
  var id = this.classList[0];
  switch (id) {
    case "theme_light":
    case "theme_dark":
    case "theme_night":
    case "theme_neon":
      changeSelect("theme", id);
      setting_theme = id;
      break;
    case "curved":
    case "straight":
    case "lined":
      changeSelect("line_type", id);
      setting_lineType = id;
      break;
    case "dotted":
    case "lines":
    case "blank":
      changeSelect("background", id);
      setting_background = id;
      break;
    default:
      alert(id);
  }
  updateSettings();
}

function changeSelect(id, new_id) {
  document.getElementById(id).getElementsByClassName("active")[0].classList.remove("active");
  document.getElementById(id).getElementsByClassName(new_id)[0].classList.add("active");
}




// var saves = {
//   activeTab: 'main',
//   main: {
//     zoom: 1,
//     top: 0,
//     left: 0,
//     comp_0: {
//       type: 'toggle',
//       x: 5100,
//       y: 5200,
//       label: 'ayy'
//     },
//     comp_1: {
//       type: 'light',
//       x: 5400,
//       y: 5200
//     },
//     conn_0: {
//       from: {elem: 'comp_0'}, // side: 'left', pos: 1
//       to: {elem: 'comp_1'}
//     }
//   }
// };

var saves = {};
if (localStorage.saves !== "undefined") {
  saves = JSON.parse(localStorage.saves);
  active_tab = saves.activeTab;
}

// TODO: delete elems from saves
var createdElems = {};
if (Object.keys(saves).length > 0) {
  for (var i = 0; i < Object.keys(saves).length; i++) {
    // TODO: create tab if not main
    var tab = Object.keys(saves)[i];
    var currentTab = document.getElementById('tab#' + active_tab).querySelector('span').innerHTML;
    if (tab == currentTab) {
      for (var j = 0; j < Object.keys(saves[tab]).length; j++) {
        loadObj(tab);
      }
    }
  }
}
function loadObj(tab) {
  var elem = Object.keys(saves[tab])[j];
  var val = saves[tab][elem];
  console.log(elem);
  var currentMain = document.getElementById('main#' + active_tab);
  console.log(saves[tab].top);
  if (elem == 'zoom') currentMain.style[elem] = val;
  else if (elem == 'top' || elem == 'left') currentMain.style[elem] = val + 'px';
  else if (elem.includes('comp')) {
    createdElems[elem] = appendElem(val.type, {x: val.x, y: val.y}, val.label || undefined);
    val.component = createdElems[elem];
  } else if (elem.includes('conn')) {
    var fromObj = {elem: createdElems[val.from.elem]};
    if (val.from.side) fromObj.side = val.from.side;
    if (val.from.pos) fromObj.pos = val.from.pos;
    var toObj = {elem: createdElems[val.to.elem]};
    if (val.to.side) toObj.side = val.to.side;
    if (val.to.pos) toObj.pos = val.to.pos;
    cSVG(fromObj, toObj);
  }
}

function checkSaved(type, component) {
  var tabName = document.getElementById('tab#' + active_tab).querySelector('span').innerHTML;
  var main = document.getElementById('main#' + active_tab);
  if (saves[tabName] == undefined) saves[tabName] = {};
  // TODO: update this upon zoom and move
  saves[tabName].zoom = main.style.zoom;
  saves[tabName].left = getNumber(main.style.left);
  saves[tabName].top = getNumber(main.style.top);

  if (type !== undefined) {
    var pos = 0;
    for (var i = 0; i < Object.keys(saves[tabName]).length; i++) {
      var name = Object.keys(saves[tabName])[i];
      if (component !== undefined) {
        if (saves[tabName][name].component !== undefined) {
          if (saves[tabName][name].component === component) {
            break;
          }
        }
      }
      if (name.includes(type)) pos++;
    }
    saves[tabName][type + pos] = {};
    return saves[tabName][type + pos];
  }
}

// update components
function save(e, exportFile) {
  // alert('save!');
  if (e !== undefined) e.preventDefault();
  document.getElementById('tab#' + active_tab).querySelector('span').classList.remove('unsaved');
  // save to local storage automatic??
  var tabName = document.getElementById('tab#' + active_tab).querySelector('span').innerHTML;
  var main = document.getElementById('main#' + active_tab);
  checkSaved();
  saves[tabName].zoom = main.style.zoom;
  saves[tabName].left = getNumber(main.style.left);
  saves[tabName].top = getNumber(main.style.top);
  saves.activeTab = active_tab;
  localStorage.saves = JSON.stringify(saves);

  if (exportFile === true) exportFile();
}
function exportFile() {
  var tabName = document.getElementById('tab#' + active_tab).querySelector('span').innerHTML;
  saves[tabName].name = tabName;
  exportToJsonFile(JSON.stringify(saves[tabName], null, 2));
}

function importFile() {
  var fileInput = document.createElement('input');
  fileInput.setAttribute('type', 'file');
  fileInput.setAttribute('accept', 'json'); // image/png, image/jpeg | logicx
  // fileInput.setAttribute('download', exportFileDefaultName);
  fileInput.click();

  fileInput.addEventListener('change', opened);
}

function opened() {
  // TODO: WIP - import
  var reader = new FileReader();
  reader.onload = onReaderLoad;
  reader.readAsText(event.target.files[0]);

  function onReaderLoad(event) {
    var obj = JSON.parse(event.target.result);
    // create tab
    var tabName = document.getElementById('tab#' + active_tab).querySelector('span').innerHTML;
    saves[tabName][obj.name] = obj;
    addTab(obj.name);
    loadObj(obj.name);
  }

  // setTimeout(function () {
  //   fileInput.remove();
  // }, 100);
}


function exportToJsonFile(jsonData) {
  var dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonData);

  var tabName = document.getElementById('tab#' + active_tab).querySelector('span').innerHTML;
  var exportFileDefaultName = tabName + '.json';
  // var exportFileDefaultName = tabName + '.logicx';

  var linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
  setTimeout(function () {
    linkElement.remove();
  }, 100);
}
