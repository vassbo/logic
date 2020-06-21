

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
  div.addEventListener('click', sectionClick);
  document.getElementById("drawer").appendChild(div);
}
function sectionClick() {
  var drawer = document.getElementById('drawer');
  for (var i = 0; i < drawer.children.length; i++) {
    if (drawer.children[i] === this.closest('div')) {
      var section = drawer.children[i + 1];
      if (section.style.display !== 'none') {
        drawer.children[i].style.opacity = '0.6';
        // section.style.height = '100px';
        section.style.opacity = 0;
        section.style.gridGap = 0;
        setTimeout(function () {
          section.style.display = 'none';
        }, 200);
      } else {
        drawer.children[i].style.opacity = '';
        section.style.display = '';
        setTimeout(function () {
          section.style.opacity = '';
          section.style.gridGap = '25px 0';
        }, 10);
      }
    }
  }
}

// create drawer grid
function createGrid(name) {
  var div = document.createElement("div");
  div.id = name;
  div.classList.add("grid");
  document.getElementById("drawer").appendChild(div);
}


///// GET LOCALSTORAGE /////

if (localStorage.lineType !== undefined) settings.lineType = localStorage.lineType;
if (localStorage.lineColor_idle !== undefined) settings.lineColor_idle = localStorage.lineColor_idle;
if (localStorage.lineColor_powered !== undefined) settings.lineColor_powered = localStorage.lineColor_powered;
if (localStorage.theme !== undefined) settings.theme = localStorage.theme;
if (localStorage.background !== undefined) settings.background = localStorage.background;
if (localStorage.language !== undefined) settings.language = localStorage.language;

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

      case 'undo':
      // TODO: undo is not working properly (redo is!)
        if (historyLog.length > 1) {
          var h = historyLog[historyLog.length - 2];
          if (h.type == 'componentMove' || h.type == 'componentAdd') {
            var elem = h.values.elem;
            // if (elem !== undefined)
            elem.style.left = h.values.left;
            elem.style.top = h.values.top;
            elem.style.zIndex = h.values.zIndex;
            console.log(elem);
          }
        }
        var h2 = historyLog[historyLog.length - 1];
        if (h2.type == 'componentAdd') h2.values.elem.remove();
        historyRedo.push(h2);
        if (historyRedo.length > 0) getIcon('redo').removeAttribute('disabled');
        historyLog.pop();
        if (historyLog.length == 0) getIcon('undo').setAttribute('disabled', '');
        break;
      case 'redo':
        if (historyRedo.length > 0) {
          var r = historyRedo[historyRedo.length - 1];
          if (r.type == 'componentAdd') { // history
            var newElem = appendElem(r.values);
            for (var i = 0; i < historyLog.length; i++) {
              if (historyLog[i].values.elem === r.values.elem) historyLog[i].values.elem = newElem;
            }
            for (var j = 0; j < historyRedo.length; j++) {
              if (historyRedo[j].values.elem === r.values.elem) historyRedo[j].values.elem = newElem;
            }
          }
          if (r.type == 'componentMove' || r.type == 'componentAdd') {
            var elem = r.values.elem;
            // if (elem !== undefined)
            elem.style.left = r.values.left;
            elem.style.top = r.values.top;
            elem.style.zIndex = r.values.zIndex;
            console.log(elem);
          }
          historyLog.push(r);
          if (historyLog.length > 0) getIcon('undo').removeAttribute('disabled');
          historyRedo.pop();
          if (historyRedo.length == 0) getIcon('redo').setAttribute('disabled', '');
        }
        break;

      case 'delete':
        deleteSelected();
        break;
      case 'filter_none':
        // duplicate
        break;
      case 'rotate_right':
      case 'rotate_left':
        var selected = document.querySelectorAll('.selected');
        for (var i = 0; i < selected.length; i++) {
          var rotated = 0;
          if (selected[i].style.transform !== null) rotated = Number(selected[i].style.transform.replace(/[^0-9-]+/g,""));
          var rotate = rotated + 90;
          if (id == 'rotate_left') rotate -= 180;
          selected[i].style.transform = 'rotate(' + rotate + 'deg)';
        }
        break;
      case 'post_add':
        // integrated circuit
        // TODO: custom prompt
        var prompt = prompt('Insert a name:');
        if (prompt !== '' && prompt !== undefined) {
          var pos = Object.keys(compoents.custom).length;
          compoents.custom[pos] = {};
          compoents.custom[pos].name = prompt;
          compoents.custom[pos].classes = ['box', 'custom'];
          // compoents.custom[pos].label = prompt;

          // TODO: check if any elem on activemain is selected or get all elems!

          var inputs = document.querySelectorAll('.input'), inputLabels = [];
          for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].querySelector('.label') !== undefined) inputLabels.push(inputs[i].querySelector('.label').innerText);
            else inputLabels.push(null);
          }
          var output = document.querySelectorAll('.output'), outputLabels = [];
          for (var i = 0; i < output.length; i++) {
            if (output[i].querySelector('.label') !== undefined) outputLabels.push(output[i].querySelector('.label').innerText);
            else outputLabels.push(null);
          }

          compoents.custom[pos].connectors = {
            left: {amount: inputs.length, label: inputLabels},
            right: {amount: output.length, label: outputLabels}
          }
          compoents.custom[pos].inspect = ''; // TODO

          console.log(compoents.custom[pos]);

          if (saves.customs == undefined) saves.customs = {};
          saves.customs[pos] = compoents.custom[pos];

          // TODO: show custom in menu (+ hide on load)

          // register: {
            //   name: 'Register',
            //   classes: ['box', 'big'],
            //   innerClasses: [],
            //   children: '',
            //   memory: {column: 8, row: 1},
            //   connectors: {
              //     left: {amount: 10, label: ['In', null, null, null, null, null, null, null, 'Write enable', 'Read enable']},
              //     right: {amount: 8, label: ['Out']}
              //     // TODO: same output as input
              //   },
              //   inspect: {}
              // }
        }
        break;

      case 'receipt':
        console.log('------------');
        console.log('------------');
        // thruth table
        // generateThruthTable();
        var table = [];
        var components = activeMain().querySelectorAll('.component');
        var inputs = [], outputs = [];
        for (var i = 0; i < components.length; i++) {
          if (components[i].classList.contains('input')) inputs.push(components[i]);
          else if (components[i].classList.contains('output')) outputs.push(components[i]);
        }

        // TODO: named input/output
        // array: input, not, output
        // 1, 0, 0
        // 0, 1, 1

        // array: input, not, not, output
        // 1, 0, 1, 1
        // 0, 1, 0, 0

        // input, and, output
        // I1 I2 O1
        // 0 0 0
        // 1 0 0
        // 0 1 0
        // 1 1 1

        var lines = activeMain().querySelectorAll('.lineSVG');
        var lineArray = [];
        for (var i = 0; i < lines.length; i++) {
          var line = lines[i].children[1];
          var conns = getLineConnectors(line);
          var elemFrom = document.getElementById(conns.from).closest('.component');
          var elemTo = document.getElementById(conns.to).closest('.component');
          var typeFrom = elemFrom.children[0].classList[0];
          var typeTo = elemTo.children[0].classList[0];

          // TODO: create a function for this VVV
          var mapFrom = getSignalMap(elemFrom);
          for (var j = 0; j < mapFrom.global.ids.length; j++) if (mapFrom.global.ids[j] == conns.from) break;
          var sideFrom = mapFrom.global.sides[j];
          for (var j = 0; j < mapFrom[sideFrom].ids.length; j++) if (mapFrom[sideFrom].ids[j] == conns.from) break;
          var posFrom = j;

          var mapTo = getSignalMap(elemTo);
          for (var j = 0; j < mapTo.global.ids.length; j++) if (mapTo.global.ids[j] == conns.to) break;
          var sideTo = mapTo.global.sides[j];
          for (var j = 0; j < mapTo[sideTo].ids.length; j++) if (mapTo[sideTo].ids[j] == conns.to) break;
          var posTo = j;

          lineArray.push({from: {elem: elemFrom, type: typeFrom, side: sideFrom, pos: posFrom, input: elemFrom.classList.contains('input')}, to: {elem: elemTo, type: typeTo, side: sideTo, pos: posTo, output: elemTo.classList.contains('output')}});
        }

        // TODO: thruth table!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        console.log(lineArray);
        // sort array
        let added = 0;
        for (let i = lineArray.length - 1; i >= added; i--) {
            if (lineArray[i].from.input) {
              lineArray.unshift(lineArray[i]);
              lineArray.splice(i + 1, 1);
              added++;
            }
        }
        console.log(lineArray);
        var final = [], temp = {}, id = 0, where = [], debugging = 0;
        // while (lineArray.length && debugging < 50) {
          for (var i = 0; i < lineArray.length; i++) {
            // var search = searchForElem(lineArray[i].from.elem);
            // // console.log(search);
            // if (search !== null) {
            //   temp[search][id] = lineArray[i].to;
            //   where.push({elem: lineArray[i].to.elem, id: [search, id]}); // <----------
            //   id++;
            //   lineArray.splice(i, 1);
            // } else if (lineArray[i].from.input) {
            //   temp[id] = lineArray[i].from;
            //   where.push({elem: lineArray[i].from.elem, id: [id]}); // <----------
            //   id++;
            //   temp[id - 1][id] = lineArray[i].to;
            //   where.push({elem: lineArray[i].to.elem, id: [id - 1, id]}); // <----------------------
            //   id++;
            //   lineArray.splice(i, 1);
            // }
            // // console.log(lineArray[i].from);

            // lineArray = [{from: {
            //   elem: div.box.input.component,
            //   input: true
            //   pos: 0,
            //   side: "right",
            //   type: "toggle",
            // }, to: {output: false}}]

            let found = false;
            for (let j = 0; j < final.length; j++) {
              for (let k = 0; k < final[j].length; k++) {
                if (final[j][k].from.elem == lineArray[i].to.elem || final[j][k].to.elem == lineArray[i].from.elem) { // TODO: LEFT has to always be from, and RIGHT always to!!! (or custom from/to...)
                  // if (final[j][k].from.elem == lineArray[i].to.elem || !lineArray[i].from.input) {
                    final[j].push(lineArray[i]);
                    found = true;
                    break;
                  // }
                }
              }
            }
            if (!found) {
              // if (lineArray[i].to.output) {
                final.push([lineArray[i]]);
              // }
            }
          }
          console.log('FINAL:');
          console.log(final); // sort....... V?!
          debugging++;
        // }

        // sort...
        // let sortArray = [];
        // for (let i = 0; i < final.length; i++) {
        //   let inputFound = false;
        //   sortArray[i] = [];
        //   let inputs = [];
        //   for (let j = 0; j < final[i].length; j++) {
        //     if (final[i][j].from.input) {
        //       inputFound = true;
        //       sortArray[i].push(final[i][j]);
        //     }
        //   }
        //   if (!inputFound) break;
        //   else inputs = sortArray[i];
        //   // while
        //   // for (let s = 0; s < inputs.length; s++) {
        //   //   for (let j = 0; j < final[i].length; j++) {
        //   //     if (sortArray[i][sortArray.length - 1].to === final[i][j].from)
        //   //   }
        //   // }
        // }
        // // final = sortArray;
        for (let i = 0; i < final.length; i++) {
          for (let j = 0; j < final[i].length; j++) {
            if (final[i][j].to.output) {
              final[i].push(final[i][j]);
              final[i].splice(j, 1);
              break;
            }
          }
        }

        var test = [];
        for (let i = 0; i < final.length; i++) {
          let output = false, k;
          let arrayIndex = 0;
          for (k = 0; k < test.length; k++) {
            if (test[k].output === final[i][final[i].length - 1].to.elem) {
              output = true;
              arrayIndex = test[k].order.length;
              break;
            }
          }
          for (let j = 0; j < final[i].length; j++) {
          // for (let j = final[i].length - 1; j >= 0; j--) {
            let push = false;
            if (j == final[i].length - 1) push = true;
            if (!output) {
              let array = [final[i][j].from.type];
              if (push) array.push(final[i][j].to.type);
              test.push({order: [array], output: final[i][final[i].length - 1].to.elem});
              k = test.length - 1;
              output = true;
            }
            else {
              if (test[k].order[arrayIndex] == undefined) test[k].order[arrayIndex] = [];
              test[k].order[arrayIndex].push(final[i][j].from.type);
              if (push) test[k].order[arrayIndex].push(final[i][j].to.type);
            }
          }
        }
        console.log('TEST');
        console.log(test);

        let table2 = [];
        for (let i = 0; i < test.length; i++) { // outputs
          table2[i] = [];
          for (let j = 0; j < test[i].order.length; j++) { // inputs
            for (let a = 0; a < test[i].order[j].length; a++) {

              let text = [], count, match;
              for (let k = 0; k < Math.pow(2, test[i].order.length); k++) {
                count = {true: 0, false: 0};
                let base2 = k.toString(2);
                text.push(base2);
                for (let l = 0; l < base2.length; l++) {
                  if (base2[l] === '1') count.true++;
                  else if (base2[l] === '0') count.false++;
                }

                match = true;
                switch (test[i].order[j][a]) {
                  case 'and':
                    if (count.false == 0) text.push(true);
                    else text.push(false);
                    break;
                  case 'or':
                    if (count.true > 0) text.push(true);
                    else text.push(false);
                    break;
                  default:
                    match = false;
                    break;
                }
              }
              if (match) table2[i].push(text);


              // switch (test[i].order[j][a]) {
              //   case 'toggle':
              //   case 'button':
              //     // table2[i].push('I' + i + '#' + j);
              //     break;
              //   case 'and':
              //     let text = [];
              //     for (let k = 0; k < Math.pow(2, test[i].order.length); k++) {
              //       let base2 = k.toString(2);
              //       text.push(base2);
              //       if (base2 === (Math.pow(2, test[i].order.length) - 1).toString(2)) text.push(true);
              //       else text.push(false);
              //     }
              //     table2[i].push(text);

              //     // // if (count.true == orderLength) text.push(true);
              //     // if (count.false == 0) text.push(true);
              //     // else text.push(false);
              //     // table2[i].push(text);
              //     break;
              //   // case 'or':
              //   //   // if count === 1
              //   //   // let text2 = [];
              //   //   // for (let k = 0; k < Math.pow(2, test[i].order.length); k++) {
              //   //   //   let base2 = k.toString(2);
              //   //   //   text2.push(base2);
              //   //   //   // if (base2 === (Math.pow(2, test[i].order.length) - 1).toString(2)) text2.push(true);
              //   //   //   let trueCount = 0;
              //   //   //   for (let l = 0; l < base2.length; l++) {
              //   //   //     if (base2[l] === '1') trueCount++;
              //   //   //   }
              //   //   //   if (trueCount === 1) text2.push(true);
              //   //   //   else text2.push(false);
              //   //   // }
              //   //   if (count.true == 0) text.push(true);
              //   //   else text.push(false);
              //   //   table2[i].push(text);
              //   //   break;
              //   case 'light':
              //     // table2[i].push('O' + i);
              //     break;
              //   // default:
              //   //   alert(test[i].order[j]);
              //   //   break;
              // }
            }
          }
        }
        console.log('Table:');
        console.log(table2);
        // remove duplicates.........
        // for (let i = 0; i < table2.length; i++) {
        //   table2[i] = [...new Set(table2[i])]; // https://medium.com/dailyjs/how-to-remove-array-duplicates-in-es6-5daa8789641c
        // }
        // console.log(table2);

        let tableFinal = [];
        for (let i = 0; i < table2.length; i++) {
          if (table2[i].length == 0) {
            // tableFinal.push([['I' + i, '0', 'O' + i, false], ['I' + i, '1', 'O' + i, true]]);
            tableFinal.push([['0', false], ['1', true]]);
          } else {
            for (let j = 0; j < table2[i].length; j++) {
              let tempArray = [];
              for (let k = 0; k < table2[i][j].length; k += 2) {
                // const element = tableFinal[i][j][k];
                // tempArray.push([['I' + i, table2[i][j][k]], ['O' + i, table2[i][j][k + 1]]]); // 'I' + i + '#' + k / 2
                tempArray.push([table2[i][j][k], table2[i][j][k + 1]]);
              }
              tableFinal.push(tempArray);
              break; // TODO: WIP
            }
          }
        }
        console.log('Table FINAL:');
        console.log(tableFinal);
        
        var tableHtml = [];
        for (let i = 0; i < tableFinal.length; i++) {
          let tableHtml2 = '<table><tr>';
          for (let a = 0; a < tableFinal[i][tableFinal[i].length - 1][0].length; a++) {
            // tableHtml2 += '<td>I' + i + '#' + a + '</td>';
            tableHtml2 += '<td>I' + ((i + 1) + a) + '</td>'; // TODO: get actial index (+ remove duplicates...)
          }
          tableHtml2 += '<td>O' + (i + 1) + '</td></tr>';
          for (let j = 0; j < tableFinal[i].length; j++) { // length
            let state = tableFinal[i][j][0];
            while (state.length < tableFinal[i][tableFinal[i].length - 1][0].length) state = '0' + state;
            let output = tableFinal[i][j][1];
            tableHtml2 += '<tr>';
            for (let k = 0; k < state.length; k++) {
              tableHtml2 += '<td>' + state[k] + '</td>';
            }
            tableHtml2 += '<td>' + output + '</td></tr>';
          }
          tableHtml2 += '</table>';
          tableHtml.push(tableHtml2);
        }
        console.log(tableHtml);

        // console.log(lineArray);
        // console.log('TEMP');
        // console.log(temp);

        function searchForElem(elem) {
          // console.log('SERACH');
          // console.log(elem);
          var returned = null;
          // console.log(where);
          for (var i = 0; i < where.length; i++) {
            if (where[i].elem === elem) {
              returned = where[i].id;
            }
          }
          // console.log(returned);
          return returned;
        }

        // var lines = activeMain().querySelectorAll('.lineSVG');
        // // var lineArray = [];
        // var obj = {}, inputCount = 0;
        // for (var i = 0; i < lines.length; i++) {
        //   var line = lines[i].children[1];
        //   // lineArray.push(getLineConnectors(line));
        //   var comp = document.getElementById(getLineConnectors(line).from).closest('.component');
        //   var compTo = document.getElementById(getLineConnectors(line).to).closest('.component');
        //
        //   var pos = i;
        //
        //   // else pos = getObjElem(comp);
        //   var search = getObjElem(comp);
        //   if (search !== null) pos = search;
        //
        //   if (obj[pos] == undefined) obj[pos] = {};
        //   console.log(comp);
        //   console.log(obj[pos]);
        //   // if (comp.children[0].classList[0].contains('input')) {
        //   //   // obj[inputCount] = {};
        //   //   // inputCount++;
        //   //   obj[pos] = {};
        //   // } else {
        //   //   obj[pos] = {};
        //   // }
        //   obj[pos].connFrom = getLineConnectors(line).from;
        //   // obj[pos].connTo = getLineConnectors(line).to;
        //   obj[pos].elem = comp;
        //   obj[pos].elemTo = compTo;
        //   obj[pos].type = comp.children[0].classList[0];
        // }
        // console.log(obj);
        //
        // function getObjElem(elem) {
        //   // for (var i = 0; i < Object.keys(obj).length; i++) {
        //   //   var key = Object.keys(obj)[i];
        //   // }
        //   var returned = null;
        //   iter(obj, []);
        //   function iter(o, p) {
        //     var keys = Object.keys(o);
        //     // console.log(keys);
        //     console.log(p);
        //     console.log(o);
        //     if (keys.length) {
        //       return keys.forEach(function (k) {
        //         if (o[k].elemTo === elem) returned = k; // o[k] || p?
        //         // iter(o[k], p.concat(k));
        //       });
        //     }
        //   }
        //   return returned;
        // }

        // https://stackoverflow.com/questions/44759321/how-do-i-get-all-paths-to-tree-leafs-using-javascript
        var object = {1: {2: {4: {7: {}}}, 3: {6: {}, 5: {}}}};
        function getPath(object) {
          function iter(o, p)  {
            var keys = Object.keys(o);
            if (keys.length) {
              return keys.forEach(function (k) {
                iter(o[k], p.concat(k));
              });
            }
            result.push(p);
          }
          var result = [];
          iter(object, []);
          return result;
        }

        // TODO: direct input class search...
        var circuits = [];
        for (var i = 0; i < inputs.length; i++) {
          // var conns = inputs[i].querySelectorAll('.connector');
          var conn = inputs[i].querySelector('.connector');
          var otherSide = getLineByConn(conn.id); // id
          var arr = [{type: 'input', conn: conn.id, elem: inputs[i]}];
          var test = 0;
          otherSideF(otherSide, arr);
          function otherSideF(otherSide, arr) {
            for (var j = 0; j < otherSide.length; j++) { // (if j + 1 >= otherSide.length)
              // while (otherSide[j] !== undefined) {
                //   otherSide = getLineByConn(conn.id);
                // }
                if (j > 0) circuits.push(arr);
                arr.push({type: document.getElementById(otherSide[j]).closest('.component').children[0].classList[0], conn: document.getElementById(otherSide[j]).closest('.component').querySelector('.connector').id, elem: document.getElementById(otherSide[j]).closest('.component')}); // TODO: get right conn (and not the first)
                if (arr[arr.length - 1].type !== 'light' && arr[arr.length - 1].type !== 'number_display') {
                  test++;
                  otherSideF(getLineByConn(document.getElementById(otherSide[j]).closest('.component').querySelector('.connector').id), arr);
                } else {
                  // arr = ['input'];
                  // circuits.push(arr);
                  console.log(test);
                  console.log(otherSide);
                  console.log(arr);
                }
              }
          }
          // arr.push('output');
          circuits.push(arr);
        }
        console.log(circuits);

        // var connTemp = [];
        // for (var i = 0; i < inputs.length; i++) {
        //   var conns = inputs[i].querySelectorAll('.connector');
        //   for (var j = 0; j < conns.length; j++) {
        //     var connectedConnectors = getLineByConn(conns[j].id);
        //     for (var k = 0; k < connectedConnectors.length; k++) {
        //       var conn = connectedConnectors[k];
        //       // var component = conn.closest('.component');
        //       // var on = activate(conn, true, true);
        //       // var off = activate(conn, false, true);
        //       var on = activateThruth(conn, true);
        //       var off = activateThruth(conn, false);
        //       // setTimeout(function () {
        //         connTemp.push({conn: conn, on: on, off: off});
        //       // }, 10);
        //     }
        //   }
        // }
        // for (var i = 0; i < connTemp.length; i++) {
        //   var conn = connTemp[i].conn;
        //   var on = connTemp[i].on;
        //   var off = connTemp[i].off;
        //   console.log(on);
        //   console.log(off);
        //   if (on.length > 0) on = on[0].powered;
        //   if (off.length > 0) off = off[0].powered;
        //   console.log(conn);
        //   console.log('----');
        //   console.log('I' + (i + 1) + ': (on)');
        //   console.log('O' + (k + 1) + ': ' + on);
        //   console.log('I' + (i + 1) + ': (off)');
        //   console.log('O' + (k + 1) + ': ' + off);
        // }
        // console.log(table);

        function getLineByConn(id) {
          var lines = activeMain().querySelectorAll('.lineSVG');
          var linesReturn = [];
          for (var i = 0; i < lines.length; i++) {
            var line = lines[i].children[1];
            if (line.id.includes(id)) {
              var lineConns = getLineConnectors(line);
              if (lineConns.from == id) linesReturn.push(lineConns.to);
              else linesReturn.push(lineConns.from);
            }
          }
          return linesReturn;
        }

        function activateThruth(id, powered) {
          var elem = document.getElementById(id).closest(".component");
          var connectors = elem.querySelectorAll('.connector');
          if (elem.classList[0] == "box") elem = elem.children[0];
          var type = elem.classList[0];

          var activated = false, activatedArray = [];

          var signal = getSignalMap(elem);
          switch (type) {
            case "light":
              activatedArray.push({conn: elem, powered: powered});
              break;
            case "not":
              activatedArray.push({conn: elem, powered: !powered});
              break;
          }
          return activatedArray;
        }
        break;

      case 'bug_report':
        // outdated
        var query = activeMain().querySelectorAll('.component');
        var output = '';
        var counter = {};
        var lineHelper = {};
        for (var i = 0; i < query.length; i++) {
          var component = query[i];
          var type = component.children[0].classList[0];
          if (counter[type] == undefined) counter[type] = 0;
          counter[type]++;
          var varName = type;
          if (varName.length > 3) varName = type.charAt(0);
          var label = '';
          lineHelper[varName + counter[type]] = {};
          lineHelper[varName + counter[type]].component = component;
          if (component.querySelector('.label') !== null) label = ", '" + component.querySelector('.label').innerHTML + "'";
          output += 'var ' + varName + counter[type] + " = appendElem('" + type + "', {x: " + getNumber(component.style.left) + ", y: " + getNumber(component.style.top) + "}" + label + ");\n";
        }
        var lines = activeMain().querySelectorAll('.lineSVG');
        for (var j = 0; j < lines.length; j++) {
          var line = lines[j].children[1];
          var lineId = getLineConnectors(line);
          var to = '', from = '';

          var lineHelp = Object.keys(lineHelper);
          for (var k = 0; k < lineHelp.length; k++) {
            var typeId = lineHelp[k];
            var component = lineHelper[typeId].component;
            var connectors = component.querySelectorAll('.connector');
            var toFrom = false;

            for (var l = 0; l < connectors.length; l++) {
              if (connectors[l].id == lineId.from) {
                toFrom = 'from';
                break;
              } else if (connectors[l].id == lineId.to) {
                toFrom = 'to';
                break;
              }
            }
            if (toFrom !== false) {
              // var side = '';
              // if (getSignalMap(component).left.count == 0) side = ', side: ' + connectors[l].closest('.').classList[1];
              var side = ", side: '" + connectors[l].closest('.').classList[1] + "'";
              var pos = '';
              if (l - 1 > 0) pos = ", pos: " + (l - 1);
              if (toFrom == 'from') from = "{elem: " + typeId + side + pos + "}";
              else if (toFrom == 'to') to = "{elem: " + typeId + side + pos + "}";
            }
          }
          // TODO: transistor & toggle == t1
          output += "cSVG(" + from + ", " + to + ");\n";
        }
        console.log(output);
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
      case "info":
        document.getElementById("dark").classList.remove("hidden");
        document.getElementById("info").classList.remove("hidden");
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
  if (settings.theme == "theme_light") {
  } else if (settings.theme == "theme_dark") {
    document.documentElement.style.setProperty('--main-color', "#242424");
    document.documentElement.style.setProperty('--main-color-inverted', "white");
    document.documentElement.style.setProperty('--main-background', "#585858");
    document.documentElement.style.setProperty('--transparent--10', "rgba(255, 255, 255, 0.1)");
    document.documentElement.style.setProperty('--transparent--20', "rgba(255, 255, 255, 0.2)");
    document.documentElement.style.setProperty('--transparent--50', "rgba(255, 255, 255, 0.5)");
  } else if (settings.theme == "theme_night") {
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
  } else if (settings.theme == "theme_neon") {
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
  document.documentElement.style.setProperty('--line-idle', settings.lineColor_idle);
  document.documentElement.style.setProperty('--line-powered', settings.lineColor_powered);

  // BACKGROUND STYLE
  if (settings.background == "dotted") updateMains('background', "radial-gradient(circle, var(--transparent--20) 1px, rgba(0, 0, 0, 0) 1px)");
  else if (settings.background == "lines") updateMains('background', "linear-gradient(to right, var(--transparent--10) 1px, transparent 1px), linear-gradient(to bottom, var(--transparent--10) 1px, transparent 1px)");
  else if (settings.background == "blank") updateMains('background', "none");

  // LINE TYPE
  if (localStorage.lineType !== settings.lineType) {
    localStorage.lineType = settings.lineType;
    updateMains('svg');
  }
}

function updateMains(setting, style) {
  var array = document.querySelectorAll('.main');
  for (var i = 0; i < array.length; i++) {
    if (setting == 'background') array[i].style.backgroundImage = style;
    else if (setting == 'svg') moveSVG(array[i]); // TODO: not aligned properly on other mains that the active
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
      settings.theme = id;
      break;
    case "curved":
    case "straight":
    case "lined":
      changeSelect("line_type", id);
      settings.lineType = id;
      break;
    case "dotted":
    case "lines":
    case "blank":
      changeSelect("background", id);
      settings.background = id;
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




function changeLang(newLang) {
  settings.language = newLang;
  var langObj = lang[newLang];
  for (var i = 0; i < Object.keys(langObj).length; i++) {
    var key = Object.keys(langObj)[i];
    var elemClass = 'lang_';
    var attribute = '';
    if (key.includes('$')) {
      attribute = key.slice(key.indexOf('$') + 1, key.indexOf('_'));
      elemClass += key.slice(key.indexOf('_') + 1, key.length);
    } else elemClass += key;
    console.log(attribute);
    console.log(elemClass);
    var query = document.querySelectorAll('.' + elemClass);
    for (var j = 0; j < query.length; j++) {
      if (attribute !== '') query[j].setAttribute(attribute, langObj[key]);
      else query[j].innerHTML = langObj[key];
    }

    // TODO: do at startup... (no...)
    if (keys[elemClass.slice(5, elemClass.length)] !== undefined) {
      var langQuery = document.querySelectorAll('.key_' + elemClass.slice(5, elemClass.length));
      for (var k = 0; k < langQuery.length; k++) {
        langQuery[k].title += ' [' + keys[elemClass.slice(5, elemClass.length)] + ']';
        console.log(langQuery[k].title);
      }
    }
  }
}


// cusom select

var x, i, j, selElmnt, a, b, c;
/*look for any elements with the class "custom-select":*/
x = document.getElementsByClassName("custom-select");
for (i = 0; i < x.length; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  /*for each element, create a new DIV that will act as the selected item:*/
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  a.classList.add('lang_' + selElmnt.options[selElmnt.selectedIndex].value);
  x[i].appendChild(a);
  /*for each element, create a new DIV that will contain the option list:*/
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 0; j < selElmnt.length; j++) {
    /*for each option in the original select element,
    create a new DIV that will act as an option item:*/
    c = document.createElement("DIV");
    if (j == 0) c.classList.add('same-as-selected');
    c.classList.add('lang_' + selElmnt.options[j].value);
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.setAttribute('value', selElmnt.options[j].value);
    c.addEventListener("click", function(e) {
      console.log(this.innerHTML);
        /*when an item is clicked, update the original select box,
        and the selected item:*/
        var y, i, k, s, h;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        h = this.parentNode.previousSibling;
        for (i = 0; i < s.length; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            for (k = 0; k < y.length; k++) {
              h.classList.remove('lang_' + y[k].getAttribute('value'));
              // y[k].removeAttribute("class");
              y[k].classList.remove("same-as-selected");
            }
            h.classList.add('lang_' + this.getAttribute('value'));
            // this.setAttribute("class", "same-as-selected");
            this.classList.add("same-as-selected");
            changeLang(this.getAttribute('value'));
            break;
          }
        }
        h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function(e) {
    /*when the select box is clicked, close any other select boxes,
    and open/close the current select box:*/
    e.stopPropagation();
    closeAllSelect(this);
    this.nextSibling.classList.toggle("select-hide");
    this.classList.toggle("select-arrow-active");
  });
}

function closeAllSelect(elmnt) {
  /*a function that will close all select boxes in the document,
  except the current select box:*/
  var x, y, i, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  for (i = 0; i < y.length; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < x.length; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}
/*if the user clicks anywhere outside the select box,
then close all select boxes:*/
document.addEventListener("click", closeAllSelect);









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

// var saves = {
//   activeTab: 'main',
//   main: {
//     zoom: 1,
//     top: 0,
//     left: 0,
//     description: '', // <<-- ??????
//     components: {
//       0: {type: 'toggle', x: 5100, y: 5200, label: 'ayy', connections: {1: {}}},
//       1: {type: 'light', x: 5400, y: 5200}
//     }
//   }
// };

// var saves = {
//   activeTab: 'main',
//   tabs: [
//     {
//       name: 'main',
//       description: '', // <<-- ??????
//       zoom: 1,
//       top: 0,
//       left: 0,
//       components: {
//         0: {type: 'toggle', x: 5100, y: 5200, label: 'ayy', connections: {1: {}}},
//         1: {type: 'light', x: 5400, y: 5200}
//       }
//     }
//   ]
// };

var saves = {};
if (localStorage.saves !== "undefined" && localStorage.saves !== undefined) {
  saves = JSON.parse(localStorage.saves);
  // active_tab = saves.activeTab;
}

// TODO: delete elems from saves
var createdElems = {};
if (Object.keys(saves).length > 0) {
  // for (var i = 0; i < Object.keys(saves).length; i++) {
  //   // TODO: create tab if not main
  //   var tab = Object.keys(saves)[i];
  //   // var currentTab = document.getElementById('tab#' + active_tab).querySelector('span').innerHTML;
  //   // if (tab == currentTab) {
  //   if (tab == 'tabs') {
  //   }
  // }
  for (var j = 0; j < saves.tabs.length; j++) {
    var newTab = 'tab#0';
    if (j !== 0) newTab = addTab(saves.tabs[j].name, false).id;
    else document.getElementById(newTab).querySelector('span').innerText = saves.tabs[j].name;
    loadObj(saves.tabs[j], newTab.slice(4, newTab.length));
    document.getElementById(newTab).querySelector('span').classList.remove('unsaved');
  }
  active_tab = saves.activeTab;
  document.getElementById('tab#' + active_tab).click();
} else {
  saves.tabs = []; // ...
  home();
}

function loadObj(object, tabId) {
  document.getElementById('tab#' + tabId).click(); // TODO: something better than this

  if (tabId == undefined) tabId = active_tab;
  for (var i = 0; i < Object.keys(object).length; i++) {
    var elem = Object.keys(object)[i];
    var val = object[elem];
    console.log(elem);
    var currentMain = document.getElementById('main#' + tabId);
    console.log(object.top);
    if (elem == 'zoom') currentMain.style[elem] = val;
    else if (elem == 'top' || elem == 'left') currentMain.style[elem] = val + 'px';
    else if (elem == 'components') {
      var conns = {};
      // append elements
      for (var j = 0; j < Object.keys(val).length; j++) {
        var pos = Object.keys(val)[j];
        var cObject = val[pos];
        createdElems[pos] = appendElem(cObject, tabId, true);
        cObject.component = createdElems[pos];
        if (cObject.connection !== undefined) conns[pos] = cObject.connection;
      }
      // add connections
      console.log(conns);
      for (var j = 0; j < Object.keys(createdElems).length; j++) {
        var key = Object.keys(createdElems)[j];
        if (conns[key] !== undefined) {
          var side = conns[key].side || 'left';
          var pos = conns[key].pos || 0;
          var fromSide = conns[key].fromSide || 'right';
          var fromPos = conns[key].fromPos || 0;
          // for (var c = 0; c < Object.keys(conns[key]).length; c++) {
          //   var connKey = Object.keys(conns[key])[c];
          //   var conn = conns[key][connKey];
          //   if (!connKey.toLowerCase().includes('side') && !connKey.toLowerCase().includes('pos')) {
          //     cSVG({elem: createdElems[key], side: conn.fromSide || fromSide, pos: conn.fromPos || fromPos}, {elem: createdElems[connKey], side: conn.side || side, pos: conn.pos || pos});
          //   }
          // }
          for (var c = 0; c < conns[key].connections.length; c++) {
            var conn = conns[key].connections[c];
            console.log('!!!!!!!');
            console.log(createdElems[key]);
            console.log(createdElems[conn.id]);
            console.log(conn);
            // TODO: line created both in main and unnamed_3 ....
            cSVG({elem: createdElems[key], side: conn.fromSide || fromSide, pos: conn.fromPos || fromPos}, {elem: createdElems[conn.id], side: conn.side || side, pos: conn.pos || pos}, tabId);
          }
        }
      }
      // power powered
      var powered = activeMain().querySelectorAll('.powered');
      for (var j = 0; j < powered.length; j++) {
        if (!powered[j].classList.contains('line')) powered[j].children[0].click();
        // powered[j].classList.remove('powered');
      }
      selector('deselect');
    }
    // else if (elem.includes('comp')) {
    //   createdElems[elem] = appendElem(val, tabId, true);
    //   val.component = createdElems[elem];
    // } else if (elem.includes('conn')) {
    //   var fromObj = {elem: createdElems[val.from.elem]};
    //   if (val.from.side) fromObj.side = val.from.side;
    //   if (val.from.pos) fromObj.pos = val.from.pos;
    //   var toObj = {elem: createdElems[val.to.elem]};
    //   if (val.to.side) toObj.side = val.to.side;
    //   if (val.to.pos) toObj.pos = val.to.pos;
    //   cSVG(fromObj, toObj);
    // }
  }
}

function checkSaved(component, tabId) {
  if (tabId == undefined) tabId = active_tab;
  var main = document.getElementById('main#' + tabId);
  var tabObj = tabObject(tabId);
  if (tabObj.components == undefined) tabObj.components = {};
  // TODO: update this upon zoom and move
  tabObj.zoom = main.style.zoom;
  tabObj.left = getNumber(main.style.left);
  tabObj.top = getNumber(main.style.top);

  if (component !== null) {
    var pos = 0;
    for (var i = 0; i < Object.keys(tabObj.components).length; i++) {
      var name = Object.keys(tabObj.components)[i];
      if (component !== undefined) {
        // console.log('CHECK:');
        // console.log(component);
        // console.log('COMPONENT:');
        // console.log(tabObj.components[name].component);
        if (tabObj.components[name].component !== undefined) {
          if (tabObj.components[name].component === component) {
            // console.log('MATCH');
            break;
          }
        }
      }
      pos++;
    }
    if (tabObj.components[pos] == undefined) tabObj.components[pos] = {};
    return {object: tabObj.components[pos], pos: pos};
  }
}

// TODO: select multiple tabs, and export

// update components
function save(e, exportFile) {
  // alert('save!');
  if (e !== undefined) e.preventDefault();
  // save to local storage automatic??
  if (exportFile !== true) {
    var tabs = document.querySelectorAll('.tab');
    for (var i = 0; i < tabs.length; i++) {
      saveTabByName(tabs[i].id.slice(4, tabs[i].id.length));
    }
  } else saveTabByName(active_tab);

  function saveTabByName(tabId) {
    document.getElementById('tab#' + tabId).querySelector('span').classList.remove('unsaved');
    var main = document.getElementById('main#' + tabId);
    checkSaved(null, tabId);
    var tabObj = tabObject(tabId);
    tabObj.zoom = main.style.zoom;
    tabObj.left = getNumber(main.style.left);
    tabObj.top = getNumber(main.style.top);
    tabObj.name = document.getElementById('tab#' + tabId).querySelector('span').innerText;
    // remove all component elems (only remove in export and not in "saves" var)
    // for (var i = 0; i < Object.keys(tabObj.components).length; i++) {
    //   var cObject = tabObj.components[Object.keys(tabObj.components)[i]];
    //   if (cObject.component !== undefined) delete cObject.component;
    // }
    saves.activeTab = active_tab;
    localStorage.saves = JSON.stringify(saves);
  }

  if (exportFile === true) exportTab();
}
function exportTab() {
  var tabName = document.getElementById('tab#' + active_tab).querySelector('span').innerHTML;
  tabObject().name = tabName;
  exportToJsonFile(JSON.stringify(tabObject(), null, 2));
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
    // TODO: check for already existing
    var tabName = document.getElementById('tab#' + active_tab).querySelector('span').innerHTML;
    saves.tabs.push(obj);
    addTab(obj.name);
    loadObj(obj.name);
    sliderChange();
    updateMap(activeMain(), document.querySelector('.map_overlay'), true);
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
