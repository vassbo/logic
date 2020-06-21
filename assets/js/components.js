var componentsTemplate = {
  'toggle': { // id / type
    name: 'Toggle', // display name
    documentation: 'Just a button, nothing special.', // additional info that might help the user
    classes: ['box'], // main classes
    innerClasses: [], // classes (mainly used for styling)
    children: '', // add elements inside object
    memory: {row: 16, column: 16}, // should there be created divs for memory TODO: JS memory
    connectors: { // add connactions
      left: {amount: 4, label: ['one', null, 'three']},
      bottom: {amount: 16, label: ['$i']},
      top: {
        label: 'Input #$i+',
        required: true // show red / notConnected (default: left / (top)... (but can be falsed?)) TODO:
      }
    },
    inspect: { // inspect element
      // {fromSide: 'right', side: 'left', 5: {}, 7: {pos: 1, side: 'top', label: 'test'}}
      connection: {side: 'left', fromSide: 'right', fromPos: 2, connections: [{id: 6}, {id: 6, pos: 2}, {}]}, connectors: {left: {amount: 4, label: ['one', null, 'three']}},
      0: {type: 'toggle', x: 4353, y: 4729, label: '1', connections: {side: 'left', 6: {}, '6__1': {pos: 1}, 8: {pos: 1}, 3: {}}},
      1: {type: 'toggle', x: 4353, y: 4841, label: '2', connections: {side: 'left', 7: {}, 8: {}, 4: {}}},
      2: {type: 'toggle', x: 4353, y: 4947, label: 'E', connections: {side: 'left', pos: 2, 5: {}, 6: {}, 7: {}, 8: {}}},
      3: {type: 'not', x: 4732, y: 4729, connections: {fromSide: 'right', side: 'left', 5: {}, 7: {pos: 1}}},
      4: {type: 'not', x: 4732, y: 4841, connections: {fromSide: 'right', side: 'left', pos: 1, 5: {}, 6: {}}}, // to side default: left
      5: {type: 'and', x: 4935, y: 4734, inputs: 3, connections: {fromSide: 'right', 9: {}}}, // fromSide-default: right
      6: {type: 'and', x: 4935, y: 4841, inputs: 3, connections: {fromSide: 'right', 10: {}}},
      7: {type: 'and', x: 4935, y: 4948, inputs: 3, connections: {fromSide: 'right', 11: {}}},
      8: {type: 'and', x: 4935, y: 5056, inputs: 3, connections: {fromSide: 'right', 12: {}}},
      9: {type: 'light', x: 5161, y: 4739, label: 'Output #1'},
      10: {type: 'light', x: 5161, y: 4846, label: 'Output #2'},
      11: {type: 'light', x: 5161, y: 4953, label: 'Output #3'},
      12: {type: 'light', x: 5161, y: 5061, label: 'Output #4'}
    }
  },
};

// TODO: add documentation

var components = {
  inputs: { // TODO: remove this <--
    name: 'Inputs', // <---
    toggle: {
      name: 'Toggle Switch',
      documentation: "Click on me to toggle my states, I can be on or off.",
      classes: ['box', 'input'],
      children: '<div class="btn-light"></div>',
      connectors: {right: {}},
      // thruth: '0:1'
    },
    button: {
      name: 'Push Button',
      documentation: "Just a button, nothing special.",
      classes: ['box', 'input'],
      children: '',
      connectors: {right: {}}
    },
    clock: {
      name: 'Clock',
      documentation: "The clock is a timer.....<br><br>ms = milli seconds<br>s = seconds<br>m = minutes<br>h = hours<br><br>e.g. 1s == 1000ms",
      classes: ['box', 'input'],
      children: '<div class="display"><input class="clock_input textInput" id="clockInput#0" tabindex="-1" value="500ms" type="text"><div class="signal-light"></div></div>',
      connectors: {right: {}}
    },
    high_constant: {
      name: 'High constant',
      documentation: "I will be active forever, and you can't disable me! Muwhahahaha!!",
      classes: ['box', 'input'],
      innerClasses: ['constant', 'noselect'],
      children: '<span>1</span>',
      connectors: {right: {}}
    },
    low_constant: {
      name: 'Low constant',
      documentation: "What's the point of me, really??",
      classes: ['box', 'input'],
      innerClasses: ['constant', 'noselect'],
      children: '<span>0</span>',
      connectors: {right: {}}
    }
  },
  outputs: {
    name: 'Outputs',
    light: {
      name: 'Light Bulb',
      classes: ['box', 'output', 'round'],
      innerClasses: ['off'],
      children: '',
      connectors: {left: {}}
    },
    number_display: {
      name: '4-Bit Digit',
      classes: ['box', 'output'],
      innerClasses: ['constant', 'noselect'],
      children: '<span style="font-family:\'digital-clock\';text-shadow:0px 0px 5px rgb(255, 255, 255);">0</span>',
      connectors: {left: {amount: 4}}
    },
    seven_segment: {
      name: 'Seven Segment Display',
      classes: ['box', 'output', 'big'],
      children: '<div id="number_1"></div><div id="number_2"></div><div id="number_3"></div><div id="number_4"></div><div id="number_5"></div><div id="number_6"></div><div id="number_7"></div>',
      connectors: {left: {amount: 7}}
    },
  // },
  // screens: {
  //   name: 'Screens',
    pixel: {
      name: 'Pixel',
      documentation: 'Contains a red, green and blue light with can be combined to create different lights',
      classes: ['box', 'output'],
      innerClasses: [''],
      // children: '<div class="off" id="red"></div><div class="off" id="green"></div><div class="off" id="blue"></div>',
      // children: '<div></div>',
      children: '',
      // TODO: turn on lights
      connectors: {left: {amount: 3}}
    },
    // screen: {
    //   // https://www.allaboutcircuits.com/worksheets/digital-display-circuits/
    //   name: '10*10px screen',
    //   classes: ['box', 'output'],
    //   innerClasses: ['constant', 'noselect'],
    //   children: '',
    //   connectors: {left: {amount: 4}}
    // },
    // hd_screen: {
    //   name: 'HD Screen',
    //   classes: ['box', 'output'],
    //   children: '',
    //   connectors: {left: {amount: 7}}
    // },
    speaker: {
      name: 'Speaker',
      classes: ['box', 'output', 'speakerBigger'],
      // children: '<input id="soundtype" list="soundtypeList" type="range" value="0" min="0" max="11" step="1"><input id="tone" value="0" type="range" min="0" max="3" step="1">' +
      // '<datalist id="soundtypeList">' +
      //   '<option value="261.6"></option>' +
      //   '<option value="277.2"></option>' +
      //   '<option value="293.7"></option>' +
      //   '<option value="311.1"></option>' +
      //   '<option value="329.6"></option>' +
      //   '<option value="349.2"></option>' +
      //   '<option value="370.0"></option>' +
      //   '<option value="392.0"></option>' +
      //   '<option value="415.3"></option>' +
      //   '<option value="440.0"></option>' +
      //   '<option value="466.2"></option>' +
      //   '<option value="493.9.2"></option>' +
      // '</datalist>',
      // https://marcgg.com/blog/2016/11/01/javascript-audio/
      children: '<div><span class="curve pointer-event material-icons">remove</span><input class="curveInput" tabindex="-1" value="sine"><span class="curve pointer-event material-icons">add</span><br>' + // curve / sine
      '<span class="pitch pointer-event material-icons">remove</span><input class="pitchInput" tabindex="-1" value="C"><span class="pitch pointer-event material-icons">add</span><br>' + // tone / pitch
      '<span class="octave pointer-event material-icons">remove</span><input class="octaveInput" tabindex="-1" value="4"><span class="octave pointer-event material-icons">add</span></div>', // octave
      connectors: {left: {amount: 1}}
    },
    // music: {
    //   name: 'Music',
    //   classes: ['box', 'output'],
    //   children: '',
    //   inspect: {
    //     // super mario
    //     // triangle 5...
    //     // https://codepen.io/gregh/post/recreating-legendary-8-bit-games-music-with-web-audio-api
    //     // 0: {type: 'toggle', x: 4640, y: 4910, label: 'Input', connection: {connections: [{id: 1}]}},
    //     // 1: {type: 'light', x: 4990, y: 4910, label: 'Output'},
    //   }
    // }
  },
  logic_gates: {
    name: 'Logic Gates',
    buffer: {
      name: 'Buffer',
      classes: ['box', 'bufferc'],
      innerClasses: ['gate'],
      children: '',
      connectors: {left: {}, right: {}},
      inspect: {
        0: {type: 'toggle', x: 4640, y: 4910, label: 'Input', connection: {connections: [{id: 1}]}},
        1: {type: 'light', x: 4990, y: 4910, label: 'Output'},
      }
    },
    not: {
      name: 'NOT Gate',
      classes: ['box', 'notc'],
      innerClasses: ['gate'],
      children: '',
      connectors: {left: {}, right: {}},
      inspect: {
        0: {type: 'toggle', x: 4650, y: 4850, label: 'Input', connection: {connections: [{id: 2, side: 'top'}]}},
        1: {type: 'high_constant', x: 4650, y: 5000, connection: {connections: [{id: 2}]}},
        2: {type: 'transistor_inv', x: 4810, y: 5000, connection: {connections: [{id: 3}]}},
        3: {type: 'light', x: 4970, y: 5000, label: 'Output'},
      }
    },
    and: {
      name: 'AND Gate',
      classes: ['box', 'andc'],
      innerClasses: ['gate'],
      children: '<input class="gate_input textInput" value="2" tabindex="-1" type="number" min="2" max="999">', // id="gateInput#0"
      connectors: {left: {amount: 2}, right: {}},
      inspect: {
        0: {type: 'high_constant', x: 4600, y: 5000, connection: {connections: [{id: 1}]}},
        'hor_1': {type: 'transistor', x: 4800, y: 5000, spacing: 200, repeat: 2, connection: [{connections: [{id: 2}]}, {connections: [{id: 5}]}]},
        'hor_3': {type: 'toggle', x: 4700, y: 4800, spacing: 200, repeat: 2, label: ['Input #$i+'], connection: [{connections: [{id: 1, side: 'top'}]}, {connections: [{id: 2, side: 'top'}]}]},
        5: {type: 'light', x: 5200, y: 5000, label: 'Output'},

        // 'hor_1': {type: 'transistor', x: 4800, y: 5000, spacing: 200, repeat: 3, connection: [{connections: [{id: 2}]}, {connections: [{id: 3}]}, {connections: [{id: 7}]}]},
        // 'hor_4': {type: 'toggle', x: 4700, y: 4800, spacing: 200, repeat: 3, label: ['Input #$i+'], connection: [{connections: [{id: 1, side: 'top'}]}, {connections: [{id: 2, side: 'top'}]}, {connections: [{id: 3, side: 'top'}]}]},
        // 7: {type: 'light', x: 5400, y: 5000, label: 'Output'},
      }
    },
    nand: {
      name: 'NAND Gate',
      classes: ['box', 'andc'],
      innerClasses: ['gate'],
      children: '<input class="gate_input textInput" value="2" tabindex="-1" type="number" min="2" max="999">', // id="gateInput#0"
      connectors: {left: {amount: 2}, right: {}},
      inspect: { 
        0: {type: 'high_constant', x: 4600, y: 5100, connection: {connections: [{id: 1}, {id: 3}]}},
        1: {type: 'transistor', x: 4800, y: 5000, connection: {connections: [{id: 2}]}},
        2: {type: 'transistor', x: 5000, y: 5000, connection: {connections: [{id: 3, side: 'top'}]}},
        3: {type: 'transistor_inv', x: 5150, y: 5100, connection: {connections: [{id: 6}]}},
        4: {type: 'toggle', x: 4700, y: 4800, label: 'Input #1', connection: {connections: [{id: 1, side: 'top'}]}},
        5: {type: 'toggle', x: 4900, y: 4800, label: 'Input #2', connection: {connections: [{id: 2, side: 'top'}]}},
        6: {type: 'light', x: 5300, y: 5000, label: 'Output'},
      }
    },
    or: {
      name: 'OR Gate',
      classes: ['box', 'orc'],
      innerClasses: ['gate'],
      children: '<input class="gate_input textInput" value="2" tabindex="-1" type="number" min="2" max="999">',
      connectors: {left: {amount: 2}, right: {}},
      inspect: {
        0: {type: 'high_constant', x: 4500, y: 5000, connection: {connections: [{id: 1}, {id: 2}]}},
        1: {type: 'transistor', x: 4800, y: 4942, connection: {connections: [{id: 2, side: 'top'}]}},
        2: {type: 'transistor', x: 5000, y: 5000, connection: {connections: [{id: 5}]}},
        3: {type: 'toggle', x: 4700, y: 4800, label: 'Input #1', connection: {connections: [{id: 1, side: 'top'}]}},
        4: {type: 'toggle', x: 4900, y: 4800, label: 'Input #2', connection: {connections: [{id: 2, side: 'top'}]}},
        5: {type: 'light', x: 5200, y: 5000, label: 'Output'},
      }
    },
    nor: {
      name: 'NOR Gate',
      classes: ['box', 'orc'],
      innerClasses: ['gate'],
      children: '<input class="gate_input textInput" value="2" tabindex="-1" type="number" min="2" max="999">',
      connectors: {left: {amount: 2}, right: {}},
      inspect: {
        0: {type: 'high_constant', x: 4500, y: 5000, connection: {connections: [{id: 1}, {id: 2}]}},
        1: {type: 'transistor', x: 4800, y: 4942, connection: {connections: [{id: 2, side: 'top'}]}},
        2: {type: 'transistor_inv', x: 5000, y: 5000, connection: {connections: [{id: 5}]}},
        3: {type: 'toggle', x: 4700, y: 4800, label: 'Input #1', connection: {connections: [{id: 1, side: 'top'}]}},
        4: {type: 'toggle', x: 4900, y: 4800, label: 'Input #2', connection: {connections: [{id: 2, side: 'top'}]}},
        5: {type: 'light', x: 5200, y: 5000, label: 'Output'},
      }
    },
    xor: {
      name: 'XOR Gate',
      classes: ['box', 'xorc'],
      innerClasses: ['gate'],
      children: '<input class="gate_input textInput" value="2" tabindex="-1" type="number" min="2" max="999">',
      connectors: {left: {amount: 2}, right: {}},
      inspect: {
        0: {type: 'nand', x: 4850, y: 4800, connection: {connections: [{id: 2}]}},
        1: {type: 'or', x: 4850, y: 5000, connection: {connections: [{id: 2, pos: 1}]}},
        2: {type: 'and', x: 5100, y: 4900, connection: {connections: [{id: 5}]}},
        3: {type: 'toggle', x: 4360, y: 4900, label: 'Input #1', connection: {connections: [{id: 0}, {id: 1, pos: 1}]}},
        4: {type: 'toggle', x: 4680, y: 4900, label: 'Input #2', connection: {connections: [{id: 0, pos: 1}, {id: 1}]}},
        5: {type: 'light', x: 5300, y: 4900, label: 'Output'}

        // 0: {type: 'toggle', x: 4170, y: 4840, label: 'Input #1', connection: {side: 'top', connections: [{id: 6}, {id: 9}]}},
        // 1: {type: 'toggle', x: 4590, y: 4840, label: 'Input #2', connection: {side: 'top', connections: [{id: 7}, {id: 10}]}},
        // 2: {type: 'light', x: 5350, y: 5101, label: 'Output'},
        // 3: {type: 'high_constant', x: 4500, y: 4750, connection: {connections: [{id: 6}, {id: 12}]}},
        // 4: {type: 'high_constant', x: 4800, y: 4840, connection: {connections: [{id: 8}]}},
        // 5: {type: 'high_constant', x: 4430, y: 5043, connection: {connections: [{id: 9}, {id: 10}]}},
        // 6: {type: 'transistor', x: 4650, y: 4650, connection: {connections: [{id: 7}]}},
        // 7: {type: 'transistor', x: 4800, y: 4650, connection: {connections: [{id: 12, side: 'top'}]}},
        // 8: {type: 'transistor', x: 5000, y: 4840, connection: {connections: [{id: 11}]}}, // x: 5010
        // 9: {type: 'transistor', x: 4590, y: 4985, connection: {connections: [{id: 10, side: 'top'}]}}, // y: 5000?
        // 10: {type: 'transistor', x: 4800, y: 5043, connection: {connections: [{id: 11, side: 'top'}]}},
        // 11: {type: 'transistor', x: 5180, y: 5101, connection: {connections: [{id: 2}]}},
        // 12: {type: 'transistor_inv', x: 4900, y: 4750, connection: {connections: [{id: 8, side: 'top'}]}} // x: 4910
      }
    },
    xnor: {
      name: 'XNOR Gate',
      classes: ['box', 'xorc'],
      innerClasses: ['gate'],
      children: '<input class="gate_input textInput" value="2" tabindex="-1" type="number" min="2" max="999">',
      connectors: {left: {amount: 2}, right: {}},
      inspect: {
        0: {type: 'nand', x: 4850, y: 4800, connection: {connections: [{id: 2}]}},
        1: {type: 'or', x: 4850, y: 5000, connection: {connections: [{id: 2, pos: 1}]}},
        2: {type: 'and', x: 5100, y: 4900, connection: {connections: [{id: 6, side: 'top'}]}},
        3: {type: 'toggle', x: 4360, y: 4900, label: 'Input #1', connection: {connections: [{id: 0}, {id: 1, pos: 1}]}},
        4: {type: 'toggle', x: 4680, y: 4900, label: 'Input #2', connection: {connections: [{id: 0, pos: 1}, {id: 1}]}},
        5: {type: 'high_constant', x: 5100, y: 5000, connection: {connections: [{id: 6}]}},
        6: {type: 'transistor_inv', x: 5250, y: 4958, connection: {connections: [{id: 7}]}},
        7: {type: 'light', x: 5400, y: 4958, label: 'Output'}
      }
    },
  },
  // flip_flops: {
  //   name: 'Flip-Flops'
  // },
  // inspect VVV
  latches: {
    name: 'Latches',
    gated_latch: {
      name: 'Gated Latch',
      classes: ['box', 'latch'],
      innerClasses: [],
      children: '',
      connectors: {
        left: {amount: 2, label: ['Data in', 'Write enable']},
        right: {label: ['Data out']}
      },
      inspect: {
        'vert_0': {type: 'toggle', x: 4330, y: 4825, spacing: 178, repeat: 2, label: ['Data in', 'Write enable'], connection: [{connections: [{id: 3}, {id: 7}]}, {connections: [{id: 3, pos: 1}, {id: 5, pos: 1}]}]},
        2: {type: 'light', x: 5410, y: 4900, label: 'Data out'},
        3: {type: 'and', x: 4739, y: 4839, connection: {connections: [{id: 6, pos: 1}]}},
        4: {type: 'and', x: 5246, y: 4900, connection: {connections: [{id: 6}, {id: 2}]}},
        5: {type: 'and', x: 4800, y: 4990, connection: {connections: [{id: 8}]}},
        6: {type: 'or', x: 5000, y: 4826, connection: {connections: [{id: 4}]}},
        7: {type: 'not', x: 4628, y: 4940, connection: {connections: [{id: 5}]}},
        8: {type: 'not', x: 5000, y: 4990, connection: {connections: [{id: 4, pos: 1}]}}
      }
    },
    gated_latch_grid: {
      name: 'Gated Latch Grid',
      classes: ['box', 'latch'],
      innerClasses: [],
      children: '',
      memory: {column: 1, row: 1},
      connectors: {
        left: {amount: 5, label: ['Data in (/ out)', 'Write enable', 'Read enable', 'Row', 'Column']},
        right: {label: ['Data out']}
      },
      inspect: {
        0: {type: 'gated_latch', x: 4921, y: 4847, connection: {connections: [{id: 1}]}},
        1: {type: 'transistor', x: 5223, y: 4881, connection: {connections: [{id: 5}]}},
        2: {type: 'and', x: 4939, y: 5105, connection: {connections: [{id: 1, side: 'top'}]}},
        3: {type: 'and', x: 4541, y: 5091, connection: {connections: [{id: 4, pos: 1}, {id: 2}]}},
        4: {type: 'and', x: 4693, y: 4910, connection: {connections: [{id: 0, pos: 1}]}},
        5: {type: 'light', x: 5395, y: 4881, label: 'Data out'},
        6: {type: 'toggle', x: 4481, y: 4774, label: 'Data in', connection: {connections: [{id: 0}]}},
        7: {type: 'toggle', x: 4482, y: 4896, label: 'Write enable', connection: {connections: [{id: 4}]}},
        8: {type: 'toggle', x: 4679, y: 5169, label: 'Read enable', connection: {connections: [{id: 2, pos: 1}]}},
        9: {type: 'toggle', x: 4320, y: 5027, label: 'Row', connection: {connections: [{id: 3}]}},
        10: {type: 'toggle', x: 4318, y: 5143, label: 'Column', connection: {connections: [{id: 3, pos: 1}]}}
      }
    },
  },
  other: {
    name: 'Other',
    transistor: {
      name: 'Transistor', // Tri-state
      classes: ['box'],
      innerClasses: [], // 'gate',
      children: '<div class="arrow"><span></span><span></span><span></span></div>',
      connectors: {left: {}, right: {}, top: {}}
    },
    transistor_inv: {
      name: 'Transistor Inverted',
      classes: ['box'],
      innerClasses: [], // 'gate',
      children: '<div class="arrow"><span></span><span></span><span></span><span></span></div>',
      connectors: {left: {}, right: {}, top: {}}
    },
  },
  components: {
    name: 'Components',
    seven_segment_decoder: {
      name: 'Seven Segment Display Decoder',
      classes: ['box', 'big'],
      innerClasses: [],
      children: '',
      connectors: {left: {amount: 4, label: ['8', '4', '2', '1']}, right: {amount: 7}},
      inspect: {
        'vert_0': {type: 'toggle', x: 4550, y: 4700, spacing: 150, repeat: 4, label: ['8', '4', '2', '1'], connection: [{connections: [{id: 16, pos: 2}, {id: 18}, {id: 20, pos: 3}, {id: 21, pos: 2}]}, {connections: [{id: 4}, {id: 7}, {id: 22}, {id: 14}, {id: 15}]}, {connections: [{id: 5}, {id: 16, pos: 3}, {id: 9}, {id: 11}, {id: 12, pos: 1}]}, {connections: [{id: 6}, {id: 7, pos: 1}, {id: 9, pos: 1}, {id: 22, pos: 2}, {id: 13}]}]},
        'vert_4': {type: 'not', x: 4775, y: 4900, spacing: 150, repeat: 3, connection: [{connections: [{id: 8}, {id: 17, pos: 1}, {id: 12}]}, {connections: [{id: 10}, {id: 22, pos: 1}, {id: 14, pos: 1}]}, {connections: [{id: 8, pos: 1}, {id: 10, pos: 1}, {id: 11, pos: 1}, {id: 15, pos: 1}]}]},
        'vert_7': {type: 'and', x: 5760, y: 4726, spacing: 110, repeat: 9, connection: [{connections: [{id: 16}]}, {connections: [{id: 16, pos: 1}, {id: 18, pos: 1}, {id: 19, pos: 1}]}, {connections: [{id: 17}]}, {connections: [{id: 17, pos: 2}, {id: 20}]}, {connections: [{id: 18, pos: 2}, {id: 19}, {id: 21}]}, {connections: [{id: 18, pos: 3}, {id: 21, pos: 3}]}, {connections: [{id: 18, pos: 4}]}, {connections: [{id: 13, pos: 1}, {id: 20, pos: 2}, {id: 21, pos: 1}]}, {connections: [{id: 20, pos: 1}]}]},
        'vert_16': {type: 'or', x: 6000, y: 4911, spacing: 130, repeat: 6, inputs: [4, 3, 5, 2, 4, 4], connection: [{connections: [{id: 23}]}, {connections: [{id: 24}]}, {connections: [{id: 26}]}, {connections: [{id: 27}]}, {connections: [{id: 28}]}, {connections: [{id: 29}]}]}, // TODO: auto increase (fromSide: 'right', )
        22: {type: 'or', x: 5560, y: 5105, input: 3, connection: {connections: [{id: 25}]}},
        'vert_23': {type: 'light', x: 6200, y: 5121, spacing: 120, repeat: 7, label: ['Output #$i+']}, // , connection: [{connections: [{id: 2}]}, {connections: [{id: 5}]}]
        // TODO: inputs
        // 1: {type: 'transistor', x: 4800, y: 5000, connection: {connections: [{id: 2}]}},
        // 2: {type: 'transistor', x: 5000, y: 5000, connection: {connections: [{id: 3, side: 'top'}]}},
        // 3: {type: 'transistor_inv', x: 5150, y: 5100, connection: {connections: [{id: 6}]}},
        // 4: {type: 'toggle', x: 4700, y: 4800, label: 'Input #1', connection: {connections: [{id: 1, side: 'top'}]}},
        // 5: {type: 'toggle', x: 4900, y: 4800, label: 'Input #2', connection: {connections: [{id: 2, side: 'top'}]}},
        // 6: {type: 'light', x: 5300, y: 5000, label: 'Output'},
      }
    },
    multiplexer: {
      name: 'Multiplexer',
      classes: ['box', 'long'],
      innerClasses: [],
      children: '',
      connectors: {left: {amount: 4}, bottom: {amount: 16, label: ['$i']}},
      inspect: {
        0: {type: '2_4', x: 4600, y: 5130, connection: {connections: [{id: 1, pos: 2}, {fromPos: 1, id: 2, pos: 2}, {fromPos: 2, id: 3, pos: 2}, {fromPos: 3, id: 4, pos: 2}]}},
        'vert_1': {type: '2_4', x: 4937, y: 4765, spacing: 95, repeat: 4, connection: [
          {connections: [{id: 10}, {fromPos: 1, id: 11}, {fromPos: 2, id: 12}, {fromPos: 3, id: 13}]},
          {connections: [{id: 14}, {fromPos: 1, id: 15}, {fromPos: 2, id: 16}, {fromPos: 3, id: 17}]},
          {connections: [{id: 18}, {fromPos: 1, id: 19}, {fromPos: 2, id: 20}, {fromPos: 3, id: 21}]},
          {connections: [{id: 22}, {fromPos: 1, id: 23}, {fromPos: 2, id: 24}, {fromPos: 3, id: 25}]},
        ]},
        // 'vert_5': {type: 'toggle', x: 4290, y: 4700, spacing: 110, repeat: 4, label: ['2', '1', '8', '4'], connection: [{connections: [{id: 1}, {id: 2}, {id: 3}, {id: 4}]}, {connections: [{id: 1, pos: 1}, {id: 2, pos: 1}, {id: 3, pos: 1}, {id: 4, pos: 1}]}, {connections: [{id: 0}]}, {connections: [{id: 0, pos: 1}]}]},
        'vert_5': {type: 'toggle', x: 4290, y: 4700, spacing: 110, repeat: 4, label: ['1', '2', '4', '8'], connection: [{connections: [{id: 1}, {id: 2}, {id: 3}, {id: 4}]}, {connections: [{id: 1, pos: 1}, {id: 2, pos: 1}, {id: 3, pos: 1}, {id: 4, pos: 1}]}, {connections: [{id: 0}]}, {connections: [{id: 0, pos: 1}]}]},
        9: {type: 'high_constant', x: 4291, y: 5150, connection: {connections: [{id: 0, pos: 2}]}},
        'vert_10': {type: 'light', x: 5250, y: 4100, spacing: 110, repeat: 16, label: ['$i']}
        // 'hor_10': {type: 'light', x: 5200, y: 4400, spacing: 110, repeat: 16, label: ['$i']}
      }
    },
    '256_bit': {
      name: '256-bit Memory',
      classes: ['box', 'chip'],
      innerClasses: [],
      children: '',
      // memory: {row: 16, column: 16},
      connectors: {
        left: {amount: 11, label: ['1 Col', '2 Col', '4 Col', '8 Col', '1 Row', '2 Row', '4 Row', '8 Row', 'Data (in)', 'Write enable', 'Read enable']},
        right: {label: ['Data out']}
      },
      inspect: {
        0: {type: 'latch_grid', x: 5111, y: 5000, connection: {connections: [{id: 6}]}},
        1: {type: 'multiplexer', x: 4863, y: 4748, label: 'Column address', connection: {connections: [{fromSide: 'bottom', fromPos: '*15', id: 0, side: 'top', pos: '*16'}]}},
        2: {type: 'multiplexer', x: 4392, y: 4901, label: 'Row address', connection: {connections: [{fromSide: 'bottom', fromPos: '*15', id: 0, pos: '*16'}]}},
        'hor_3': {type: 'toggle', x: 4500, y: 5105, spacing: 150, repeat: 3, label: ['Data in', 'Write enable', 'Read enable'], connection: [{connections: [{id: 0, pos: 16}]}, {connections: [{id: 0, pos: 18}]}, {connections: [{id: 0, pos: 19}]}]},
        6: {type: 'light', x: 5625, y: 5160, label: 'Data out'},
        7: {type: 'toggle', x: 4687, y: 4585, label: 'Col 4-bit #1', connection: {connections: [{id: 1}]}},
        8: {type: 'toggle', x: 4590, y: 4643, label: 'Col 4-bit #2', connection: {connections: [{id: 1, pos: 1}]}},
        9: {type: 'toggle', x: 4501, y: 4702, label: 'Col 4-bit #3', connection: {connections: [{id: 1, pos: 2}]}},
        10: {type: 'toggle', x: 4409, y: 4772, label: 'Col 4-bit #4', connection: {connections: [{id: 1, pos: 3}]}},
        11: {type: 'toggle', x: 4227, y: 4758, label: 'Row 4-bit #1', connection: {connections: [{id: 2}]}},
        12: {type: 'toggle', x: 4126, y: 4813, label: 'Row 4-bit #2', connection: {connections: [{id: 2, pos: 1}]}},
        13: {type: 'toggle', x: 4032, y: 4869, label: 'Row 4-bit #3', connection: {connections: [{id: 2, pos: 2}]}},
        14: {type: 'toggle', x: 3941, y: 4925, label: 'Row 4-bit #4', connection: {connections: [{id: 2, pos: 3}]}}
      }
    },
    '256_byte': {
      name: '256-byte RAM',
      classes: ['box', 'chip', 'chip_bigger'],
      innerClasses: [],
      children: '',
      // memory: {column: 16, row: 16, repeat: 8}, // 32 * 64 | 8 * 256
      connectors: {
        // TODO: same output as input
        left: {amount: 18, label: ['8-bit Data', null, null, null, null, null, null, null, '1 Col', '2 Col', '4 Col', '8 Col', '1 Row', '2 Row', '4 Row', '8 Row', 'Write enable', 'Read enable']},
        // right: {amount: 8, label: ['Data out']}
      },
      inspect: {
        'vert_0': {type: 'toggle', x: 4700, y: 5400, spacing: 110, repeat: 2, label: ['Write enable', 'Read enable'], connection: [{connections: [{id: [10, 8], pos: 9}]}, {connections: [{id: [10, 8], pos: 10}]}]},
        // 2: {type: 'toggle', x: 4700, y: 4585, label: 'Col 4-bit #1', connection: {connections: [{id: [10, 8]}]}},
        // 3: {type: 'toggle', x: 4590, y: 4643, label: 'Col 4-bit #2', connection: {connections: [{id: [10, 8], pos: 1}]}},
        // 4: {type: 'toggle', x: 4501, y: 4702, label: 'Col 4-bit #3', connection: {connections: [{id: [10, 8], pos: 2}]}},
        // 5: {type: 'toggle', x: 4409, y: 4772, label: 'Col 4-bit #4', connection: {connections: [{id: [10, 8], pos: 3}]}},
        // 6: {type: 'toggle', x: 4227, y: 4758, label: 'Row 4-bit #1', connection: {connections: [{id: [10, 8], pos: 4}]}},
        // 7: {type: 'toggle', x: 4126, y: 4813, label: 'Row 4-bit #2', connection: {connections: [{id: [10, 8], pos: 5}]}},
        // 8: {type: 'toggle', x: 4032, y: 4869, label: 'Row 4-bit #3', connection: {connections: [{id: [10, 8], pos: 6}]}},
        // 9: {type: 'toggle', x: 3941, y: 4925, label: 'Row 4-bit #4', connection: {connections: [{id: [10, 8], pos: 7}]}},
        'vert_2': {type: 'toggle', x: 4700, y: 4473, spacing: 110, repeat: 8, label: ['Col 4-bit #1', 'Col 4-bit #2', 'Col 4-bit #3', 'Col 4-bit #4', 'Row 4-bit #1', 'Row 4-bit #2', 'Row 4-bit #3', 'Row 4-bit #4'], connection: [{connections: [{id: [10, 8]}]}, {connections: [{id: [10, 8], pos: 1}]}, {connections: [{id: [10, 8], pos: 2}]}, {connections: [{id: [10, 8], pos: 3}]}, {connections: [{id: [10, 8], pos: 4}]}, {connections: [{id: [10, 8], pos: 5}]}, {connections: [{id: [10, 8], pos: 6}]}, {connections: [{id: [10, 8], pos: 7}]}]},
        'vert_10': {type: '256_bit', x: 5050, y: 4363, spacing: 210, repeat: 8, connectionRel: {connections: [{id: 26}]}},
        'vert_18': {type: 'toggle', x: 4500, y: 4473, spacing: 210, repeat: 8, label: ['Input #$i+'], connectionRel: {connections: [{id: 10, pos: 8}]}},
        'vert_26': {type: 'light', x: 5347, y: 4423, spacing: 210, repeat: 8, label: ['Output #$i+']}
      }
    },
    register: {
      name: 'Register',
      classes: ['box', 'big'],
      innerClasses: [],
      children: '',
      memory: {column: 8, row: 1},
      connectors: {
        left: {amount: 10, label: ['In', null, null, null, null, null, null, null, 'Write enable', 'Read enable']},
        right: {amount: 8, label: ['Out']}
        // TODO: same output as input
      },
      inspect: {
        'hor_0': {type: 'gated_latch', x: 4550, y: 4920, spacing: 240, repeat: 8, connectionRel: {connections: [{id: 16}]}},
        'hor_8': {type: 'toggle', x: 4390, y: 4780, spacing: 240, repeat: 8, label: ['Input #$i+'], connectionRel: {connections: [{id: 0}]}},
        'hor_16': {type: 'light', x: 4785, y: 5080, spacing: 240, repeat: 8, label: ['Output #$i+']},
        24: {type: 'toggle', x: 4390, y: 5109, label: 'Write enable', connection: {connections: [{id: [0, 8], pos: 1}]}},
      }
    }
  },
  custom: {
    name: 'Custom'
  },
  decoders: {
    name: 'Decoders',
    '2_4': {
      name: '2 to 4 Decoder',
      classes: ['box'],
      children: '',
      connectors: {
        left: {amount: 3, label: [null, null, 'E']},
        right: {amount: 4}
      },
      inspect: {
        // 0: {type: 'toggle', x: 4353, y: 4729, label: '1', connection: {side: 'left', connections: [{id: 6}, {id: 8, pos: 1}, {id: 3}]}},
        // 1: {type: 'toggle', x: 4353, y: 4841, label: '2', connection: {side: 'left', connections: [{id: 7}, {id: 8}, {id: 4}]}},
        // 2: {type: 'toggle', x: 4353, y: 4947, label: 'E', connection: {side: 'left', pos: 2, connections: [{id: 5}, {id: 6}, {id: 7}, {id: 8}]}},
        // 3: {type: 'not', x: 4732, y: 4729, connection: {fromSide: 'right', side: 'left', connections: [{id: 5}, {id: 7, pos: 1}]}},
        // 4: {type: 'not', x: 4732, y: 4841, connection: {fromSide: 'right', side: 'left', pos: 1, connections: [{id: 5}, {id: 6}]}},
        // 5: {type: 'and', x: 4935, y: 4734, inputs: 3, connection: {fromSide: 'right', connections: [{id: 9}]}},
        // 6: {type: 'and', x: 4935, y: 4841, inputs: 3, connection: {fromSide: 'right', connections: [{id: 10}]}},
        // 7: {type: 'and', x: 4935, y: 4948, inputs: 3, connection: {fromSide: 'right', connections: [{id: 11}]}},
        // 8: {type: 'and', x: 4935, y: 5056, inputs: 3, connection: {fromSide: 'right', connections: [{id: 12}]}},
        // 9: {type: 'light', x: 5161, y: 4739, label: 'Output #1'},
        // 10: {type: 'light', x: 5161, y: 4846, label: 'Output #2'},
        // 11: {type: 'light', x: 5161, y: 4953, label: 'Output #3'},
        // 12: {type: 'light', x: 5161, y: 5061, label: 'Output #4'}
        'vert_0': {type: 'toggle', x: 4353, y: 4729, spacing: 110, repeat: 3, label: ['1', '2', 'E'], connection: [
          {side: 'left', connections: [{id: 6}, {id: 8, pos: 1}, {id: 3}]},
          {side: 'left', connections: [{id: 7}, {id: 8}, {id: 4}]},
          {side: 'left', pos: 2, connections: [{id: 5}, {id: 6}, {id: 7}, {id: 8}]},
        ]},
        3: {type: 'not', x: 4732, y: 4729, connection: {fromSide: 'right', side: 'left', connections: [{id: 5}, {id: 7, pos: 1}]}},
        4: {type: 'not', x: 4732, y: 4839, connection: {fromSide: 'right', side: 'left', pos: 1, connections: [{id: 5}, {id: 6}]}},
        'vert_5': {type: 'and', x: 4935, y: 4734, inputs: [3, 3, 3, 3], spacing: 110, repeat: 4, connection: [
          {fromSide: 'right', connections: [{id: 9}]},
          {fromSide: 'right', connections: [{id: 10}]},
          {fromSide: 'right', connections: [{id: 11}]},
          {fromSide: 'right', connections: [{id: 12}]},
        ]},
        'vert_9': {type: 'light', x: 5161, y: 4739, spacing: 110, repeat: 4, label: ['Output #$i']},
      }
    },
    'WIP_disabled_4_16': {
      name: '4 to 16 Decoder',
      classes: ['box'],
      innerClasses: [],
      children: '',
      connectors: {left: {amount: 4}, right: {amount: 16, label: ['$i']}},
      inspect: {}
    }
  },
  not_in_drawer: {
    // TODO: not in drawer
    name: 'test',
    latch_grid: {
      name: 'latch_grid',
      classes: ['box', 'big_sqare'],
      innerClasses: [],
      children: '',
      memory: {row: 16, column: 16},
      connectors: {
        // left: {amount: 20, label: ['$i', '@17:Data in', '@18:Data out', '@19:Write enable', '@20:Read enable'], required: [true, false, null, true]}, // show red / notConnected TODO: required
        left: {amount: 20, label: ['$i', '@17:Data in', '@18:Data out', '@19:Write enable', '@20:Read enable']},
        right: {label: ['Data out']},
        top: {amount: 16}
      },
      inspect: {
        // 'alert': 'WARNING! This will take a long time (up to 30 minutes) and cause much lag. Do you want to procceed?',
        // 'grid_0': {type: 'gated_latch_grid', x: 5114, y: 4887, spacing: [270, 180], repeat: [16, 16]}, // spacing: [180, 120]
        'grid_0': {type: 'gated_latch_grid', x: 5114, y: 4887, spacing: [270, 180], repeat: [2, 2], connectionAll: {connections: [{id: 291}]}}, // TODO: [16, 16]
        // TODO: [0, 256] x5 V !!!
        'hor_256': {type: 'toggle', x: 5114, y: 4687, spacing: 270, repeat: 16, label: ['#$i+'], connectionAll: {connections: [{id: [0, 4], pos: 4}]}}, // TODO: .....
        'vert_272': {type: 'toggle', x: 4914, y: 4887, spacing: 180, repeat: 16, label: ['#$i+'], connectionAll: {connections: [{id: [0, 4], pos: 3}]}}, // TODO: .....
        'hor_288': {type: 'toggle', x: 4300, y: 5105, spacing: 180, repeat: 3, label: ['Data in', 'Write enable', 'Read enable'], connection: [{connections: [{id: [0, 4]}]}, {connections: [{id: [0, 4], pos: 1}]}, {connections: [{id: [0, 4], pos: 2}]}]},
        291: {type: 'light', x: 9780, y: 6400, label: 'Data out'} //, connection: {fromSide: 'right', side: 'left', connections: [{id: 5}, {id: 7, pos: 1}]}},
      }
    },
    screen: { // TODO: screen storage.....
      name: 'Screen decoder...',
      classes: ['box', 'screenDiv'],
      children: ['<span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>'],
      connectors: {
        left: {amount: 10, label: ['1 Col', '2 Col', '4 Col', '1 Row', '2 Row', '4 Row', 'Write Enable', 'R', 'G', 'B']}
      }
    }
  }
};



// -----------------------

// grid

// connections default to: left, from: right.....

// var array = [6, {8: {pos: 1}}, 3];

// var connections = {
//   fromSide: 'right',
//   side: 'left',
//   6: {},
//   8: { pos: 1 },
//   3: { fromSide: 'bottom', fromPos: 2 }
// };
