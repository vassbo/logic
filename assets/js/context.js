
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

window.addEventListener("click", function(e) { if (menuVisible) {
  if (menu.querySelector('#inspect_context') !== null) menu.querySelector('#inspect_context').setAttribute('disabled', '');
  toggleMenu("hide");
}
});

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
      var classList = contextElem.querySelector('div').classList;
      if (classList.contains('gate') || classList.contains('seven_segment_decoder')) menu.querySelector('#inspect_context').removeAttribute('disabled');
      else menu.querySelector('#inspect_context').setAttribute('disabled', '');
    } else if (getComponent(e.target) == 'drawer') { // target is a component inside the drawer
      menu = document.getElementById("menuDrawerComponent");
      contextElem = e.target.closest(".box");
      var classList = contextElem.querySelector('div').classList;
      if (classList.contains('gate') || classList.contains('seven_segment_decoder')) menu.querySelector('#inspect_context').removeAttribute('disabled');
      else menu.querySelector('#inspect_context').setAttribute('disabled', '');
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

  if (!e.target.hasAttribute('disabled')) {

    switch (e.target.innerText) {
      case "Delete":
        contextElem.remove();
        break;
      case "Add Label":
        var val = "";
        if (type == 'clock') val = 'Clock #' + contextElem.querySelector('.textInput').id.slice(contextElem.querySelector('.textInput').id.indexOf("#") + 1, contextElem.querySelector('.textInput').id.length);
        var inputPrompt = prompt("Please enter a label", val);
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
      case "Inspect":
        // var t, t1, t2, l, tr, tr1, tr2, tr3, tr4, tr5, tr6, tr7;
        addTab(type + ' | Inspect').querySelector('span').classList.remove('unsaved');
        switch (type) {
          case 'buffer':
            var t = appendElem('toggle', {x: 4650, y: 4930}, 'Input');
            var l = appendElem('light', {x: 4970, y: 4930}, 'Output');
            cSVG({elem: t}, {elem: l});
            break;
          case 'not':
            var t = appendElem('toggle', {x: 4650, y: 4850}, 'Input');
            var c = appendElem('high_constant', {x: 4650, y: 5000});
            var tr = appendElem('transistor_inv', {x: 4810, y: 5000});
            var l = appendElem('light', {x: 4970, y: 5000}, 'Output');
            cSVG({elem: t}, {elem: tr, side: 'top'});
            cSVG({elem: c}, {elem: tr, side: 'left'});
            cSVG({elem: tr, side: 'right'}, {elem: l});
            break;
          case 'and':
            var c = appendElem('high_constant', {x: 4600, y: 5000});
            var tr1 = appendElem('transistor', {x: 4800, y: 5000});
            var tr2 = appendElem('transistor', {x: 5000, y: 5000});
            var t1 = appendElem('toggle', {x: 4700, y: 4800}, 'Input #1');
            var t2 = appendElem('toggle', {x: 4900, y: 4800}, 'Input #2');
            var l = appendElem('light', {x: 5200, y: 5000}, 'Output');
            cSVG({elem: c}, {elem: tr1, side: 'left'});
            cSVG({elem: tr1, side: 'right'}, {elem: tr2, side: 'left'});
            cSVG({elem: tr2, side: 'right'}, {elem: l});
            cSVG({elem: t1}, {elem: tr1, side: 'top'});
            cSVG({elem: t2}, {elem: tr2, side: 'top'});
            break;
          case 'nand':
            var c = appendElem('high_constant', {x: 4600, y: 5100});
            var tr1 = appendElem('transistor', {x: 4800, y: 5000});
            var tr2 = appendElem('transistor', {x: 5000, y: 5000});
            var tr3 = appendElem('transistor_inv', {x: 5150, y: 5100});
            var t1 = appendElem('toggle', {x: 4700, y: 4800}, 'Input #1');
            var t2 = appendElem('toggle', {x: 4900, y: 4800}, 'Input #2');
            var l = appendElem('light', {x: 5300, y: 5000}, 'Output');
            cSVG({elem: c}, {elem: tr1, side: 'left'});
            cSVG({elem: c}, {elem: tr3, side: 'left'});
            cSVG({elem: tr1, side: 'right'}, {elem: tr2, side: 'left'});
            cSVG({elem: tr2, side: 'right'}, {elem: tr3, side: 'top'});
            cSVG({elem: t1}, {elem: tr1, side: 'top'});
            cSVG({elem: t2}, {elem: tr2, side: 'top'});
            cSVG({elem: tr3, side: 'right'}, {elem: l});
            break;
          case 'or':
            var c = appendElem('high_constant', {x: 4500, y: 5000});
            var tr1 = appendElem('transistor', {x: 4800, y: 4942});
            var tr2 = appendElem('transistor', {x: 5000, y: 5000});
            var t1 = appendElem('toggle', {x: 4700, y: 4800}, 'Input #1');
            var t2 = appendElem('toggle', {x: 4900, y: 4800}, 'Input #2');
            var l = appendElem('light', {x: 5200, y: 5000}, 'Output');
            cSVG({elem: c}, {elem: tr1, side: 'left'});
            cSVG({elem: c}, {elem: tr2, side: 'left'});
            cSVG({elem: tr2, side: 'right'}, {elem: l});
            cSVG({elem: tr1, side: 'right'}, {elem: tr2, side: 'top'});
            cSVG({elem: t1}, {elem: tr1, side: 'top'});
            cSVG({elem: t2}, {elem: tr2, side: 'top'});
            break;
          case 'nor':
            var c = appendElem('high_constant', {x: 4500, y: 5000});
            var tr1 = appendElem('transistor', {x: 4800, y: 4942});
            var tr2 = appendElem('transistor_inv', {x: 5000, y: 5000});
            var t1 = appendElem('toggle', {x: 4700, y: 4800}, 'Input #1');
            var t2 = appendElem('toggle', {x: 4900, y: 4800}, 'Input #2');
            var l = appendElem('light', {x: 5200, y: 5000}, 'Output');
            cSVG({elem: c}, {elem: tr1, side: 'left'});
            cSVG({elem: c}, {elem: tr2, side: 'left'});
            cSVG({elem: tr2, side: 'right'}, {elem: l});
            cSVG({elem: tr1, side: 'right'}, {elem: tr2, side: 'top'});
            cSVG({elem: t1}, {elem: tr1, side: 'top'});
            cSVG({elem: t2}, {elem: tr2, side: 'top'});
            break;
          case 'xor':
            // var nand = appendElem('nand', {x: 4850, y: 4800});
            // var or = appendElem('or', {x: 4850, y: 5000});
            // var and = appendElem('and', {x: 5100, y: 4900});
            // var t1 = appendElem('toggle', {x: 4360, y: 4900}, 'Input #1');
            // var t2 = appendElem('toggle', {x: 4680, y: 4900}, 'Input #2');
            // var l = appendElem('light', {x: 5300, y: 4900}, 'Output');
            // cSVG({elem: t1}, {elem: nand, side: 'left'});
            // cSVG({elem: t1}, {elem: or, side: 'left', pos: 1});
            // cSVG({elem: t2}, {elem: nand, side: 'left', pos: 1});
            // cSVG({elem: t2}, {elem: or, side: 'left'});
            // cSVG({elem: nand, side: 'right'}, {elem: and, side: 'left'});
            // cSVG({elem: or, side: 'right'}, {elem: and, side: 'left', pos: 1});
            // cSVG({elem: and, side: 'right'}, {elem: l});

            var t1 = appendElem('toggle', {x: 4170, y: 4840}, 'Input #1');
            var t2 = appendElem('toggle', {x: 4590, y: 4840}, 'Input #2');
            var l = appendElem('light', {x: 5350, y: 5101}, 'Output');
            var c1 = appendElem('high_constant', {x: 4500, y: 4750});
            var c2 = appendElem('high_constant', {x: 4800, y: 4840});
            var c3 = appendElem('high_constant', {x: 4430, y: 5043});
            var tr1 = appendElem('transistor', {x: 4650, y: 4650});
            var tr2 = appendElem('transistor', {x: 4800, y: 4650});
            var tr3 = appendElem('transistor', {x: 5000, y: 4840}); // x: 5010
            var tr4 = appendElem('transistor', {x: 4590, y: 4985}); // y: 5000?
            var tr5 = appendElem('transistor', {x: 4800, y: 5043});
            var tr6 = appendElem('transistor', {x: 5180, y: 5101});
            var tr7 = appendElem('transistor_inv', {x: 4900, y: 4750}); // x: 4910
            cSVG({elem: t1}, {elem: tr1, side: 'top'});
            cSVG({elem: t1}, {elem: tr4, side: 'top'});
            cSVG({elem: t2}, {elem: tr2, side: 'top'});
            cSVG({elem: t2}, {elem: tr5, side: 'top'});
            cSVG({elem: tr1, side: 'right'}, {elem: tr2, side: 'left'});
            cSVG({elem: tr2, side: 'right'}, {elem: tr7, side: 'top'});
            cSVG({elem: tr3, side: 'right'}, {elem: tr6, side: 'left'});
            cSVG({elem: tr4, side: 'right'}, {elem: tr5, side: 'top'});
            cSVG({elem: tr5, side: 'right'}, {elem: tr6, side: 'top'});
            cSVG({elem: tr6, side: 'right'}, {elem: l});
            cSVG({elem: tr7, side: 'right'}, {elem: tr3, side: 'top'});
            cSVG({elem: c1}, {elem: tr1, side: 'left'});
            cSVG({elem: c1}, {elem: tr7, side: 'left'});
            cSVG({elem: c2}, {elem: tr3, side: 'left'});
            cSVG({elem: c3}, {elem: tr4, side: 'left'});
            cSVG({elem: c3}, {elem: tr5, side: 'left'});
            break;
          case 'xnor':
            var nand = appendElem('nand', {x: 4850, y: 4800});
            var or = appendElem('or', {x: 4850, y: 5000});
            var and = appendElem('and', {x: 5100, y: 4900});
            var t1 = appendElem('toggle', {x: 4360, y: 4900}, 'Input #1');
            var t2 = appendElem('toggle', {x: 4680, y: 4900}, 'Input #2');
            var c = appendElem('high_constant', {x: 5100, y: 5000});
            var tr = appendElem('transistor_inv', {x: 5250, y: 4958});
            var l = appendElem('light', {x: 5400, y: 4958}, 'Output');
            cSVG({elem: t1}, {elem: nand, side: 'left'});
            cSVG({elem: t1}, {elem: or, side: 'left', pos: 1});
            cSVG({elem: t2}, {elem: nand, side: 'left', pos: 1});
            cSVG({elem: t2}, {elem: or, side: 'left'});
            cSVG({elem: nand, side: 'right'}, {elem: and, side: 'left'});
            cSVG({elem: or, side: 'right'}, {elem: and, side: 'left', pos: 1});
            cSVG({elem: and, side: 'right'}, {elem: tr, side: 'top'});
            cSVG({elem: c}, {elem: tr, side: 'left'});
            cSVG({elem: tr, side: 'right'}, {elem: l});
            break;
          case 'seven_segment_decoder':
            var t1 = appendElem('toggle', {x: 4550, y: 4700}, '8');
            var t2 = appendElem('toggle', {x: 4700, y: 4700}, '4');
            var t3 = appendElem('toggle', {x: 4850, y: 4700}, '2');
            var t4 = appendElem('toggle', {x: 5000, y: 4700}, '1');
            // var n1 = appendElem('not', {x: 4434, y: 4850});
            var n2 = appendElem('not', {x: 4775, y: 4850});
            var n3 = appendElem('not', {x: 4925, y: 4850});
            var n4 = appendElem('not', {x: 5075, y: 4850});
            var and1 = appendElem('and', {x: 5760, y: 4726});
            var and2 = appendElem('and', {x: 5760, y: 4811});
            var and3 = appendElem('and', {x: 5760, y: 4945});
            var and4 = appendElem('and', {x: 5760, y: 5027});
            var and5 = appendElem('and', {x: 5760, y: 5268});
            var and6 = appendElem('and', {x: 5760, y: 5351});
            var and7 = appendElem('and', {x: 5760, y: 5442});
            var and8 = appendElem('and', {x: 5760, y: 5558});
            var and9 = appendElem('and', {x: 5760, y: 5666});
            var or1 = appendElem('or', {x: 6000, y: 4911}); // 4
            var or2 = appendElem('or', {x: 6000, y: 5048}); // 3
            var or3 = appendElem('or', {x: 5760, y: 5149}); // 3
            var or4 = appendElem('or', {x: 6000, y: 5262}); // 5
            var or5 = appendElem('or', {x: 6000, y: 5395}); // (2)
            var or6 = appendElem('or', {x: 6000, y: 5505}); // 4
            var or7 = appendElem('or', {x: 6000, y: 5636}); // 4
            // var ssd = appendElem('seven_segment', {x: 6354, y: 5167});
            var l1 = appendElem('light', {x: 6200, y: 4921}, 'Output #1');
            var l2 = appendElem('light', {x: 6200, y: 5053}, 'Output #2');
            var l3 = appendElem('light', {x: 6200, y: 5154}, 'Output #3');
            var l4 = appendElem('light', {x: 6200, y: 5277}, 'Output #4');
            var l5 = appendElem('light', {x: 6200, y: 5395}, 'Output #5');
            var l6 = appendElem('light', {x: 6200, y: 5515}, 'Output #6');
            var l7 = appendElem('light', {x: 6200, y: 5646}, 'Output #7');
            gate(or1.querySelector('.textInput'), 4);
            gate(or2.querySelector('.textInput'), 3);
            gate(or3.querySelector('.textInput'), 3);
            gate(or4.querySelector('.textInput'), 5);
            // gate(or5.querySelector('.textInput'), 2);
            gate(or6.querySelector('.textInput'), 4);
            gate(or7.querySelector('.textInput'), 4);
            // cSVG({elem: t1}, {elem: n1, side: 'left'});
            cSVG({elem: t2}, {elem: n2, side: 'left'});
            cSVG({elem: t3}, {elem: n3, side: 'left'});
            cSVG({elem: t4}, {elem: n4, side: 'left'});
            // cSVG({elem: or1, side: 'right'}, {elem: ssd});
            // cSVG({elem: or2, side: 'right'}, {elem: ssd, pos: 1});
            // cSVG({elem: or3, side: 'right'}, {elem: ssd, pos: 2});
            // cSVG({elem: or4, side: 'right'}, {elem: ssd, pos: 3});
            // cSVG({elem: or5, side: 'right'}, {elem: ssd, pos: 4});
            // cSVG({elem: or6, side: 'right'}, {elem: ssd, pos: 5});
            // cSVG({elem: or7, side: 'right'}, {elem: ssd, pos: 6});
            cSVG({elem: or1, side: 'right'}, {elem: l1});
            cSVG({elem: or2, side: 'right'}, {elem: l2});
            cSVG({elem: or3, side: 'right'}, {elem: l3});
            cSVG({elem: or4, side: 'right'}, {elem: l4});
            cSVG({elem: or5, side: 'right'}, {elem: l5});
            cSVG({elem: or6, side: 'right'}, {elem: l6});
            cSVG({elem: or7, side: 'right'}, {elem: l7});
            cSVG({elem: and1, side: 'right'}, {elem: or1, side: 'left'});
            cSVG({elem: and2, side: 'right'}, {elem: or1, side: 'left', pos: 1});
            cSVG({elem: and2, side: 'right'}, {elem: or4, side: 'left', pos: 1});
            cSVG({elem: and2, side: 'right'}, {elem: or5, side: 'left', pos: 1});
            cSVG({elem: and3, side: 'right'}, {elem: or2, side: 'left'});
            cSVG({elem: and4, side: 'right'}, {elem: or2, side: 'left', pos: 2});
            cSVG({elem: and4, side: 'right'}, {elem: or6, side: 'left'});
            cSVG({elem: and5, side: 'right'}, {elem: or4, side: 'left', pos: 2});
            cSVG({elem: and5, side: 'right'}, {elem: or5, side: 'left'});
            cSVG({elem: and5, side: 'right'}, {elem: or7, side: 'left'});
            cSVG({elem: and6, side: 'right'}, {elem: or4, side: 'left', pos: 3});
            cSVG({elem: and6, side: 'right'}, {elem: or7, side: 'left', pos: 3});
            cSVG({elem: and7, side: 'right'}, {elem: or4, side: 'left', pos: 4});
            cSVG({elem: and8, side: 'right'}, {elem: and7, side: 'left', pos: 1});
            cSVG({elem: and8, side: 'right'}, {elem: or6, side: 'left', pos: 2});
            cSVG({elem: and8, side: 'right'}, {elem: or7, side: 'left', pos: 1});
            cSVG({elem: and9, side: 'right'}, {elem: or6, side: 'left', pos: 1});
            cSVG({elem: t1}, {elem: or1, side: 'left', pos: 2});
            cSVG({elem: t1}, {elem: or4, side: 'left'});
            cSVG({elem: t1}, {elem: or6, side: 'left', pos: 3});
            cSVG({elem: t1}, {elem: or7, side: 'left', pos: 2});
            cSVG({elem: t2}, {elem: and1, side: 'left'});
            cSVG({elem: t2}, {elem: or3, side: 'left'});
            cSVG({elem: t2}, {elem: and8, side: 'left'});
            cSVG({elem: t2}, {elem: and9, side: 'left'});
            cSVG({elem: n2}, {elem: and2, side: 'left'});
            cSVG({elem: n2}, {elem: or2, side: 'left', pos: 1});
            cSVG({elem: n2}, {elem: and6, side: 'left'});
            cSVG({elem: t3}, {elem: or1, side: 'left', pos: 3});
            cSVG({elem: t3}, {elem: and3, side: 'left'});
            cSVG({elem: t3}, {elem: and5, side: 'left'});
            cSVG({elem: t3}, {elem: and6, side: 'left', pos: 1});
            cSVG({elem: n3}, {elem: and4, side: 'left'});
            cSVG({elem: n3}, {elem: or3, side: 'left', pos: 1});
            cSVG({elem: n3}, {elem: and8, side: 'left', pos: 1});
            cSVG({elem: t4}, {elem: and1, side: 'left', pos: 1});
            cSVG({elem: t4}, {elem: and3, side: 'left', pos: 1});
            cSVG({elem: t4}, {elem: or3, side: 'left', pos: 2});
            cSVG({elem: t4}, {elem: and7, side: 'left'});
            cSVG({elem: n4}, {elem: and2, side: 'left', pos: 1});
            cSVG({elem: n4}, {elem: and4, side: 'left', pos: 1});
            cSVG({elem: n4}, {elem: and5, side: 'left', pos: 1});
            cSVG({elem: n4}, {elem: and9, side: 'left', pos: 1});
            break;
          default:
            alert('Inspect: ' + type);
        }
        break;
      default:
        alert(e.target.innerText);
    }
  }
}
