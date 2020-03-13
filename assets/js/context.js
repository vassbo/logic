
///// MAIN /////

var menu = document.getElementById("menuMain");
var menuVisible = false;

function toggleMenu(command) {
  menu.style.display = command === "show" ? "block" : "none";
  menuVisible = !menuVisible;
}

function setPosition(origin) {
  menu.style.left = origin.left + "px";
  menu.style.top = origin.top + "px";
  toggleMenu("show");
}

window.addEventListener("click", function(e) { if (menuVisible) toggleMenu("hide"); });

var contextElem;
window.addEventListener("contextmenu", function(e) {
  // console.log(e.target.closest("div").id);
  if (!e.target.closest("div").id.includes("menu")) {
    if (menuVisible) toggleMenu("hide");
    e.preventDefault();
    var origin = { left: e.pageX, top: e.pageY };

    if (getComponent(e.target) === true) { // target is a component
      menu = document.getElementById("menuComponent");
      contextElem = e.target.closest(".component");
      if (contextElem.getElementsByClassName("label").length > 0) document.getElementById("contextLabel").innerHTML = "Edit Label";
      else document.getElementById("contextLabel").innerHTML = "Add Label";
    } else if (getComponent(e.target) == 'drawer') { // target is a component inside the drawer
      menu = document.getElementById("menuDrawerComponent");
      contextElem = e.target.closest(".box");
    } else menu = document.getElementById("menuMain"); // default context menu

    setPosition(origin);
  } else toggleMenu("hide");
});

function getComponent(target) {
  if (target.classList.contains("box") && target.classList.contains("component") || target.closest(".box") && target.closest(".component")) return true;
  else if (target.classList.contains("box") || target.closest(".box")) return 'drawer';
  else return false;
}

///// CLICKED /////

var options = document.querySelectorAll(".menu-option");
for (var i = 0; i < options.length; i++) options[i].addEventListener("click", menuClick);
function menuClick(e) {
  var type = contextElem.firstChild.classList[0];
  var object = getObjectByType(type);

  switch (e.target.innerText) {
    case "Delete":
      contextElem.remove();
      break;
    case "Add Label":
      var inputPrompt = prompt("Please enter a label", "");
      if (inputPrompt !== "" && inputPrompt !== null) addLabel(inputPrompt, contextElem, false);
      break;
    case "Edit Label":
      var label = contextElem.getElementsByClassName("label")[0];
      var input = prompt("Edit the label", label.innerHTML);
      if (input !== "" && input !== null) label.innerHTML = input;
      else if (input == "") {
        if (confirm('Do you want to delete the label?')) {
          // TODO: custom prompt _with_ option to delete label!!!
          label.remove();
        }
      }
      break;
    case "Documentation":
      document.getElementById("dark").classList.remove("hidden");
      var info = document.getElementById("info");
      info.classList.remove("hidden");
      info.querySelector('h1').innerHTML = object.name;
      info.querySelector('p').innerHTML = object.documentation || 'No documentation!';
      break;
    default:
      alert(e.target.innerText);
  }
}
