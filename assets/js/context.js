var menu = document.getElementById("menuMain");
var menuVisible = false;

var toggleMenu = function(command) {
  menu.style.display = command === "show" ? "block" : "none";
  menuVisible = !menuVisible;
};

var setPosition = function(origin) {
  menu.style.left = origin.left + "px";
  menu.style.top = origin.top + "px";
  toggleMenu("show");
};

window.addEventListener("click", function(e) {
  if (menuVisible) toggleMenu("hide");
});

var contextElem;
window.addEventListener("contextmenu", function(e) {
  console.log(e.target.closest("div").id);
  if (!e.target.closest("div").id.includes("menu")) {
    if (menuVisible) toggleMenu("hide");
    e.preventDefault();
    var origin = {
      left: e.pageX,
      top: e.pageY
    };
    if (getComponent(e.target)) {
      menu = document.getElementById("menuComponent");
      contextElem = e.target.closest(".component");
      if (contextElem.getElementsByClassName("label").length > 0) {
        document.getElementById("contextLabel").innerHTML = "Edit Label";
      } else {
        document.getElementById("contextLabel").innerHTML = "Add Label";
      }
    } else {
      menu = document.getElementById("menuMain");
    }
    setPosition(origin);
  } else {
    toggleMenu("hide");
  }
  return false;
});


function getComponent(target) {
  if (target.classList.contains("box") && target.classList.contains("component")) {
    return true;
  } else if (target.closest(".box") && target.closest(".component")) {
    return true;
  }
}



var options = document.querySelectorAll(".menu-option");
for (var i = 0; i < options.length; i++) {
  options[i].addEventListener("click", menuClick);
}

function menuClick(e) {
  switch (e.target.innerText) {
    case "Delete":
      contextElem.remove();
      break;
    case "Add Label":
      var inputPrompt = prompt("Please enter a label", "");
      if (inputPrompt !== "" && inputPrompt !== null) {
        addLabel(inputPrompt, contextElem, false);
      }
      break;
    case "Edit Label":
      var label = contextElem.getElementsByClassName("label")[0];
      var input = prompt("Edit the label", label.innerHTML);
      if (input !== "" && inputPrompt !== undefined) {
        label.innerHTML = input;
      }
      // TODO: custom prompt with option to delete label
      break;
    default:

  }
}
