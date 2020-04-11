
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
  if (origin.top + menu.offsetHeight > window.innerHeight) origin.top -= menu.offsetHeight;
  if (origin.left + menu.offsetWidth > window.innerWidth) origin.left -= menu.offsetWidth;
  menu.style.left = origin.left + "px";
  menu.style.top = origin.top + "px";
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
      if (classList.contains('inspect')) menu.querySelector('#inspect_context').removeAttribute('disabled');
      else menu.querySelector('#inspect_context').setAttribute('disabled', '');
    } else if (getComponent(e.target) == 'drawer') { // target is a component inside the drawer
      menu = document.getElementById("menuDrawerComponent");
      contextElem = e.target.closest(".box");
      var classList = contextElem.querySelector('div').classList;
      if (classList.contains('inspect')) menu.querySelector('#inspect_context').removeAttribute('disabled');
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

          case 'gated_latch':
            var t1 = appendElem('toggle', {x: 4330, y: 4825}, 'Data in');
            var t2 = appendElem('toggle', {x: 4330, y: 5003}, 'Write enable');
            var l = appendElem('light', {x: 5410, y: 4900}, 'Data out');
            var and1 = appendElem('and', {x: 4739, y: 4839});
            var and2 = appendElem('and', {x: 5246, y: 4900});
            var and3 = appendElem('and', {x: 4800, y: 4990});
            var or = appendElem('or', {x: 5000, y: 4826});
            var not1 = appendElem('not', {x: 4628, y: 4940});
            var not2 = appendElem('not', {x: 5000, y: 4990});
            cSVG({elem: t1}, {elem: and1, side: 'left'});
            cSVG({elem: t1}, {elem: not1, side: 'left'});
            cSVG({elem: t2}, {elem: and1, side: 'left', pos: 1});
            cSVG({elem: t2}, {elem: and3, side: 'left', pos: 1});
            cSVG({elem: not1, side: 'right'}, {elem: and3, side: 'left'});
            cSVG({elem: and1, side: 'right'}, {elem: or, side: 'left', pos: 1});
            cSVG({elem: and3, side: 'right'}, {elem: not2, side: 'left'});
            cSVG({elem: not2, side: 'right'}, {elem: and2, side: 'left', pos: 1});
            cSVG({elem: or, side: 'right'}, {elem: and2, side: 'left'});
            cSVG({elem: and2, side: 'right'}, {elem: or, side: 'left'});
            cSVG({elem: and2, side: 'right'}, {elem: l});
            break;
          case 'gated_latch_grid':
            var g1 = appendElem('gated_latch', {x: 4921, y: 4847});
            var tr1 = appendElem('transistor', {x: 5223, y: 4881});
            var and1 = appendElem('and', {x: 4939, y: 5105});
            var and2 = appendElem('and', {x: 4541, y: 5091});
            var and3 = appendElem('and', {x: 4693, y: 4910});
            var l1 = appendElem('light', {x: 5395, y: 4881}, 'Data out'); // Data in/out
            var t1 = appendElem('toggle', {x: 4481, y: 4774}, 'Data in');
            var t2 = appendElem('toggle', {x: 4482, y: 4896}, 'Write enable');
            var t3 = appendElem('toggle', {x: 4679, y: 5169}, 'Read enable');
            var t4 = appendElem('toggle', {x: 4320, y: 5027}, 'Row');
            var t5 = appendElem('toggle', {x: 4318, y: 5143}, 'Column');
            cSVG({elem: t1}, {elem: g1, side: 'left'});
            cSVG({elem: t2}, {elem: and3, side: 'left'});
            cSVG({elem: t3}, {elem: and1, side: 'left', pos: 1});
            cSVG({elem: t4}, {elem: and2, side: 'left'});
            cSVG({elem: t5}, {elem: and2, side: 'left', pos: 1});
            cSVG({elem: and1, side: 'right'}, {elem: tr1, side: 'top'});
            cSVG({elem: and3, side: 'right'}, {elem: g1, side: 'left', pos: 1});
            cSVG({elem: and2, side: 'right'}, {elem: and3, side: 'left', pos: 1});
            cSVG({elem: and2, side: 'right'}, {elem: and1, side: 'left'});
            cSVG({elem: g1, side: 'right'}, {elem: tr1, side: 'left'});
            cSVG({elem: tr1, side: 'right'}, {elem: l1});
            break;

            case '256_bit':
              var lg = appendElem('latch_grid', {x: 5111, y: 5000});
              var ca = appendElem('multiplexer', {x: 4863, y: 4748}, 'Column address');
              var ra = appendElem('multiplexer', {x: 4392, y: 4901}, 'Row address');
              var di = appendElem('toggle', {x: 4500, y: 5105}, 'Data in');
              var we = appendElem('toggle', {x: 4500, y: 5248}, 'Write enable');
              var re = appendElem('toggle', {x: 4500, y: 5395}, 'Read enable');
              var out = appendElem('light', {x: 5625, y: 5160}, 'Data out');

              var t1 = appendElem('toggle', {x: 4687, y: 4585}, 'Col 4-bit #1');
              var t2 = appendElem('toggle', {x: 4590, y: 4643}, 'Col 4-bit #2');
              var t3 = appendElem('toggle', {x: 4501, y: 4702}, 'Col 4-bit #3');
              var t4 = appendElem('toggle', {x: 4409, y: 4772}, 'Col 4-bit #4');
              var t5 = appendElem('toggle', {x: 4227, y: 4758}, 'Row 4-bit #1');
              var t6 = appendElem('toggle', {x: 4126, y: 4813}, 'Row 4-bit #2');
              var t7 = appendElem('toggle', {x: 4032, y: 4869}, 'Row 4-bit #3');
              var t8 = appendElem('toggle', {x: 3941, y: 4925}, 'Row 4-bit #4');
              cSVG({elem: t1, side: 'right'}, {elem: ca, side: 'left'});
              cSVG({elem: t2, side: 'right'}, {elem: ca, side: 'left', pos: 1});
              cSVG({elem: t3, side: 'right'}, {elem: ca, side: 'left', pos: 2});
              cSVG({elem: t4, side: 'right'}, {elem: ca, side: 'left', pos: 3});
              cSVG({elem: t5, side: 'right'}, {elem: ra, side: 'left'});
              cSVG({elem: t6, side: 'right'}, {elem: ra, side: 'left', pos: 1});
              cSVG({elem: t7, side: 'right'}, {elem: ra, side: 'left', pos: 2});
              cSVG({elem: t8, side: 'right'}, {elem: ra, side: 'left', pos: 3});

              cSVG({elem: di}, {elem: lg, side: 'left', pos: 16});
              cSVG({elem: we}, {elem: lg, side: 'left', pos: 17});
              cSVG({elem: re}, {elem: lg, side: 'left', pos: 18});
              cSVG({elem: lg, side: 'right'}, {elem: out});

              for (var i = 0; i < 16; i++) {
                cSVG({elem: ca, side: 'bottom', pos: i}, {elem: lg, side: 'top', pos: i});
                cSVG({elem: ra, side: 'bottom', pos: i}, {elem: lg, side: 'left', pos: i});
              }

              // TODO: add 8 toggles
              break;
            case '256_byte':
              // var bit1 = appendElem('256_bit', {x: 5050, y: 5841});
              // var bit2 = appendElem('256_bit', {x: 5050, y: 5631});
              // var bit3 = appendElem('256_bit', {x: 5050, y: 5421});
              // var bit4 = appendElem('256_bit', {x: 5050, y: 5211});
              // var bit5 = appendElem('256_bit', {x: 5050, y: 5000});
              // var bit6 = appendElem('256_bit', {x: 5050, y: 4785});
              // var bit7 = appendElem('256_bit', {x: 5050, y: 4571});
              // var bit8 = appendElem('256_bit', {x: 5050, y: 4363});

              var we = appendElem('toggle', {x: 4500, y: 5248}, 'Write enable');
              var re = appendElem('toggle', {x: 4500, y: 5395}, 'Read enable');

              // var d1 = appendElem('toggle', {x: 4687, y: 4585});
              // var d2 = appendElem('toggle', {x: 4590, y: 4643});
              // var d3 = appendElem('toggle', {x: 4501, y: 4702});
              // var d4 = appendElem('toggle', {x: 4409, y: 4772});
              // var d5 = appendElem('toggle', {x: 4227, y: 4758});
              // var d6 = appendElem('toggle', {x: 4126, y: 4813});
              // var d7 = appendElem('toggle', {x: 4032, y: 4869});
              // var d8 = appendElem('toggle', {x: 3941, y: 4925});

              var t1 = appendElem('toggle', {x: 4687, y: 4485}, 'Col 4-bit #1');
              var t2 = appendElem('toggle', {x: 4590, y: 4543}, 'Col 4-bit #2');
              var t3 = appendElem('toggle', {x: 4501, y: 4602}, 'Col 4-bit #3');
              var t4 = appendElem('toggle', {x: 4409, y: 4672}, 'Col 4-bit #4');
              var t5 = appendElem('toggle', {x: 4227, y: 4758}, 'Row 4-bit #1');
              var t6 = appendElem('toggle', {x: 4126, y: 4813}, 'Row 4-bit #2');
              var t7 = appendElem('toggle', {x: 4032, y: 4869}, 'Row 4-bit #3');
              var t8 = appendElem('toggle', {x: 3941, y: 4925}, 'Row 4-bit #4');

              // cSVG({elem: t1, side: 'right'}, {elem: ca, side: 'left'});
              // cSVG({elem: t2, side: 'right'}, {elem: ca, side: 'left', pos: 1});
              // cSVG({elem: t3, side: 'right'}, {elem: ca, side: 'left', pos: 2});
              // cSVG({elem: t4, side: 'right'}, {elem: ca, side: 'left', pos: 3});
              // cSVG({elem: t5, side: 'right'}, {elem: ra, side: 'left'});
              // cSVG({elem: t6, side: 'right'}, {elem: ra, side: 'left', pos: 1});
              // cSVG({elem: t7, side: 'right'}, {elem: ra, side: 'left', pos: 2});
              // cSVG({elem: t8, side: 'right'}, {elem: ra, side: 'left', pos: 3});
              //
              // cSVG({elem: di}, {elem: lg, side: 'left', pos: 16});
              // cSVG({elem: we}, {elem: lg, side: 'left', pos: 17});
              // cSVG({elem: re}, {elem: lg, side: 'left', pos: 18});
              // cSVG({elem: lg, side: 'right'}, {elem: out});

              var bits = createGrid({rows: 8, cols: 1}, '256_bit', {width: 160, height: 160}, {x: 5050, y: 4363}, 'b');
              var inputs = createGrid({rows: 8, cols: 1}, 'toggle', {width: 160, height: 160}, {x: 4850, y: 4473}, 'i', true);

              for (var i = 0; i < 8; i++) {
                var bit = bits['b' + '00' + ('0' + i).slice(-2)];
                // console.log('b' + '00' + ('0' + row).slice(-2));
                console.log(bit);
                cSVG({elem: t1}, {elem: bit, side: 'left'});
                cSVG({elem: t2}, {elem: bit, side: 'left', pos: 1});
                cSVG({elem: t3}, {elem: bit, side: 'left', pos: 2});
                cSVG({elem: t4}, {elem: bit, side: 'left', pos: 3});
                cSVG({elem: t5}, {elem: bit, side: 'left', pos: 4});
                cSVG({elem: t6}, {elem: bit, side: 'left', pos: 5});
                cSVG({elem: t7}, {elem: bit, side: 'left', pos: 6});
                cSVG({elem: t8}, {elem: bit, side: 'left', pos: 7});

                cSVG({elem: inputs['i' + '00' + ('0' + i).slice(-2)]}, {elem: bit, side: 'left', pos: 8});
                cSVG({elem: we}, {elem: bit, side: 'left', pos: 9});
                cSVG({elem: re}, {elem: bit, side: 'left', pos: 10});
              }

              // cSVG({elem: t11, side: 'right'}, {elem: bit1, side: 'left'});
              // cSVG({elem: t12, side: 'right'}, {elem: bit1, side: 'left', pos: 1});
              // cSVG({elem: t13, side: 'right'}, {elem: bit1, side: 'left', pos: 2});
              // cSVG({elem: t14, side: 'right'}, {elem: bit1, side: 'left', pos: 3});
              // cSVG({elem: t11, side: 'right'}, {elem: bit2, side: 'left'});
              // cSVG({elem: t12, side: 'right'}, {elem: bit2, side: 'left', pos: 1});
              // cSVG({elem: t13, side: 'right'}, {elem: bit2, side: 'left', pos: 2});
              // cSVG({elem: t14, side: 'right'}, {elem: bit2, side: 'left', pos: 3});
              // cSVG({elem: t3, side: 'right'}, {elem: bit1, side: 'left', pos: 8});
              // cSVG({elem: t5, side: 'right'}, {elem: bit2, side: 'left', pos: 8});
              // cSVG({elem: t4, side: 'right'}, {elem: 26, side: 'left', pos: 8});
              // cSVG({elem: t6, side: 'right'}, {elem: 25, side: 'left', pos: 8});
              break;

            case 'latch_grid':
              // TODO: wokingg???
              if (confirm('WARNING! This will take a long time (up to 30 minutes) and cause much lag. Do you want to procceed?')) {
                var latches = createGrid({rows: 16, cols: 16}, 'gated_latch_grid', {width: 180, height: 120}, {x: 5114, y: 4887}, 'g');
                var toggleColumn = createGrid({rows: 1, cols: 16}, 'toggle', {width: 180, height: 80}, {x: 5114, y: 4787}, 't', true);
                var toggleRow = createGrid({rows: 16, cols: 1}, 'toggle', {width: 80, height: 120}, {x: 5014, y: 4887}, 't', true);
                console.log(toggleColumn);

                var di = appendElem('toggle', {x: 4700, y: 5105}, 'Data in');
                var we = appendElem('toggle', {x: 4700, y: 5248}, 'Write enable');
                var re = appendElem('toggle', {x: 4700, y: 5395}, 'Read enable');
                var out = appendElem('light', {x: 9780, y: 6400}, 'Data out');

                for (var col = 0; col < 16; col++) {
                  for (var row = 0; row < 16; row++) {
                    var elem = latches['g' + ('0' + col).slice(-2) + ('0' + row).slice(-2)];
                    cSVG({elem: di}, {elem: elem, side: 'left'});
                    cSVG({elem: we}, {elem: elem, side: 'left', pos: 1});
                    cSVG({elem: re}, {elem: elem, side: 'left', pos: 2});
                    cSVG({elem: elem, side: 'right'}, {elem: out});
                  }
                }
                for (var i = 0; i < 16; i++) {
                  cSVG({elem: toggleColumn['t' + ('0' + i).slice(-2) + '00']}, {elem: elem, side: 'left', pos: 4});
                  cSVG({elem: toggleRow['t' + '00' + ('0' + i).slice(-2)]}, {elem: elem, side: 'left', pos: 3});
                }
              }
              break;

          case '2_4':
            var t1 = appendElem('toggle', {x: 4353, y: 4729}, '1');
            var t2 = appendElem('toggle', {x: 4353, y: 4841}, '2');
            var t3 = appendElem('toggle', {x: 4353, y: 4947}, 'E');
            var not1 = appendElem('not', {x: 4732, y: 4729});
            var not2 = appendElem('not', {x: 4732, y: 4841});
            var and1 = appendElem('and', {x: 4935, y: 4734});
            var and2 = appendElem('and', {x: 4935, y: 4841});
            var and3 = appendElem('and', {x: 4935, y: 4948});
            var and4 = appendElem('and', {x: 4935, y: 5056});
            var l1 = appendElem('light', {x: 5161, y: 4739}, 'Output #1');
            var l2 = appendElem('light', {x: 5161, y: 4846}, 'Output #2');
            var l3 = appendElem('light', {x: 5161, y: 4953}, 'Output #3');
            var l4 = appendElem('light', {x: 5161, y: 5061}, 'Output #4');

            gate(and1.querySelector('.textInput'), 3);
            gate(and2.querySelector('.textInput'), 3);
            gate(and3.querySelector('.textInput'), 3);
            gate(and4.querySelector('.textInput'), 3);

            cSVG({elem: t1}, {elem: and2, side: 'left'});
            cSVG({elem: t1}, {elem: and4, side: 'left', pos: 1});
            cSVG({elem: t1}, {elem: not1, side: 'left'});
            cSVG({elem: t2}, {elem: and3, side: 'left'});
            cSVG({elem: t2}, {elem: and4, side: 'left'});
            cSVG({elem: t2}, {elem: not2, side: 'left'});
            cSVG({elem: t3}, {elem: and1, side: 'left', pos: 2});
            cSVG({elem: t3}, {elem: and2, side: 'left', pos: 2});
            cSVG({elem: t3}, {elem: and3, side: 'left', pos: 2});
            cSVG({elem: t3}, {elem: and4, side: 'left', pos: 2});
            cSVG({elem: not1, side: 'right'}, {elem: and1, side: 'left'});
            cSVG({elem: not1, side: 'right'}, {elem: and3, side: 'left', pos: 1});
            cSVG({elem: not2, side: 'right'}, {elem: and1, side: 'left', pos: 1});
            cSVG({elem: not2, side: 'right'}, {elem: and2, side: 'left', pos: 1});
            cSVG({elem: and1, side: 'right'}, {elem: l1});
            cSVG({elem: and2, side: 'right'}, {elem: l2});
            cSVG({elem: and3, side: 'right'}, {elem: l3});
            cSVG({elem: and4, side: 'right'}, {elem: l4});
            break;

          case 'multiplexer': // 4_16
            var dec1 = appendElem('2_4', {x: 4593, y: 4939});
            var dec2 = appendElem('2_4', {x: 4937, y: 4765});
            var dec3 = appendElem('2_4', {x: 4937, y: 4865});
            var dec4 = appendElem('2_4', {x: 4945, y: 4966});
            var dec5 = appendElem('2_4', {x: 4949, y: 5073});
            var t1 = appendElem('toggle', {x: 4290, y: 4737}, '2');
            var t2 = appendElem('toggle', {x: 4290, y: 4832}, '1');
            var t3 = appendElem('toggle', {x: 4290, y: 4927}, '8');
            var t4 = appendElem('toggle', {x: 4290, y: 5025}, '4');
            var h1 = appendElem('high_constant', {x: 4291, y: 5150});

            var l1 = appendElem('light', {x: 5250, y: 4386});
            var l2 = appendElem('light', {x: 5250, y: 4469});
            var l3 = appendElem('light', {x: 5250, y: 4552});
            var l4 = appendElem('light', {x: 5250, y: 4636});
            var l5 = appendElem('light', {x: 5250, y: 4720});
            var l6 = appendElem('light', {x: 5250, y: 4804});
            var l7 = appendElem('light', {x: 5250, y: 4890});
            var l8 = appendElem('light', {x: 5250, y: 4974});
            var l9 = appendElem('light', {x: 5250, y: 5057});
            var l10 = appendElem('light', {x: 5250, y: 5140});
            var l11 = appendElem('light', {x: 5250, y: 5227});
            var l12 = appendElem('light', {x: 5250, y: 5315});
            var l13 = appendElem('light', {x: 5250, y: 5400});
            var l14 = appendElem('light', {x: 5250, y: 5484});
            var l15 = appendElem('light', {x: 5250, y: 5570});
            var l16 = appendElem('light', {x: 5250, y: 5656});

            cSVG({elem: t3, side: 'right'}, {elem: dec1, side: 'left'});
            cSVG({elem: t4, side: 'right'}, {elem: dec1, side: 'left', pos: 1});
            cSVG({elem: t1, side: 'right'}, {elem: dec2, side: 'left'});
            cSVG({elem: t1, side: 'right'}, {elem: dec3, side: 'left'});
            cSVG({elem: t1, side: 'right'}, {elem: dec4, side: 'left'});
            cSVG({elem: t1, side: 'right'}, {elem: dec5, side: 'left'});
            cSVG({elem: t2, side: 'right'}, {elem: dec2, side: 'left', pos: 1});
            cSVG({elem: t2, side: 'right'}, {elem: dec3, side: 'left', pos: 1});
            cSVG({elem: t2, side: 'right'}, {elem: dec4, side: 'left', pos: 1});
            cSVG({elem: t2, side: 'right'}, {elem: dec5, side: 'left', pos: 1});

            cSVG({elem: h1}, {elem: dec1, side: 'left', pos: 2});
            cSVG({elem: dec1, side: 'right'}, {elem: dec2, side: 'left', pos: 2});
            cSVG({elem: dec1, side: 'right', pos: 1}, {elem: dec3, side: 'left', pos: 2});
            cSVG({elem: dec1, side: 'right', pos: 2}, {elem: dec4, side: 'left', pos: 2});
            cSVG({elem: dec1, side: 'right', pos: 3}, {elem: dec5, side: 'left', pos: 2});

            cSVG({elem: dec2, side: 'right'}, {elem: l1, side: 'left'});
            cSVG({elem: dec2, side: 'right', pos: 1}, {elem: l2, side: 'left'});
            cSVG({elem: dec2, side: 'right', pos: 2}, {elem: l3, side: 'left'});
            cSVG({elem: dec2, side: 'right', pos: 3}, {elem: l4, side: 'left'});
            cSVG({elem: dec3, side: 'right'}, {elem: l5, side: 'left'});
            cSVG({elem: dec3, side: 'right', pos: 1}, {elem: l6, side: 'left'});
            cSVG({elem: dec3, side: 'right', pos: 2}, {elem: l7, side: 'left'});
            cSVG({elem: dec3, side: 'right', pos: 3}, {elem: l8, side: 'left'});
            cSVG({elem: dec4, side: 'right'}, {elem: l9, side: 'left'});
            cSVG({elem: dec4, side: 'right', pos: 1}, {elem: l10, side: 'left'});
            cSVG({elem: dec4, side: 'right', pos: 2}, {elem: l11, side: 'left'});
            cSVG({elem: dec4, side: 'right', pos: 3}, {elem: l12, side: 'left'});
            cSVG({elem: dec5, side: 'right'}, {elem: l13, side: 'left'});
            cSVG({elem: dec5, side: 'right', pos: 1}, {elem: l14, side: 'left'});
            cSVG({elem: dec5, side: 'right', pos: 2}, {elem: l15, side: 'left'});
            cSVG({elem: dec5, side: 'right', pos: 3}, {elem: l16, side: 'left'});
            break;

          case 'register':
            var latches = createGrid({rows: 1, cols: 8}, 'gated_latch', {width: 180, height: 120}, {x: 4584, y: 4780}, 'g');
            var inputs = createGrid({rows: 1, cols: 8}, 'toggle', {width: 180, height: 120}, {x: 4386, y: 4680}, 't', true);
            var outputs = createGrid({rows: 1, cols: 8}, 'light', {width: 180, height: 120}, {x: 4886, y: 4980}, 'l', true);
            var t2 = appendElem('toggle', {x: 4388, y: 5009}, 'Write enable');

            for (var i = 0; i < 8; i++) {
              var input = inputs['t' + ('0' + i).slice(-2) + '00'];
              var latch = latches['g' + ('0' + i).slice(-2) + '00'];
              var output = outputs['l' + ('0' + i).slice(-2) + '00'];
              cSVG({elem: input}, {elem: latch, side: 'left'});
              cSVG({elem: t2}, {elem: latch, side: 'left', pos: 1});
              cSVG({elem: latch, side: 'right'}, {elem: output});
            }
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



function createGrid(grid, type, typeStyle, startPos, idLetter, doLabel) {
  var objects = {};
  var countLabel = 0;
  for (var col = 0; col < grid.cols; col++) {
    for (var row = 0; row < grid.rows; row++) {
      var label = undefined;
      if (doLabel === true) label = countLabel;
      console.log('LABEL: ' + label);
      countLabel++;
      var elem = appendElem(type, {x: startPos.x + ((typeStyle.width + typeStyle.width / 2) * (col + 1)), y: startPos.y + ((typeStyle.height + typeStyle.height / 2) * (row + 1))}, label);
      objects[idLetter + ('0' + col).slice(-2) + ('0' + row).slice(-2)] = elem;
    }
  }
  return objects;
}
