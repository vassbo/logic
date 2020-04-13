var componentsTemplate = {
  'toggle': { // id / type
    name: 'Toggle', // display name
    documentation: 'Just a button, nothing special.', // additional info that might help the user
    classes: ['box'], // main classes
    innerClasses: [], // classes (mainly used for styling)
    children: '', // add elements inside object
    memory: {row: 16, column: 16}, // should there be created divs for memory TODO: JS memory
    connectors: { // add connactions
      left: {amount: 4, name: ['one', null, 'three']},
      bottom: {amount: 16, name: ['$i']},
      top: {
        name: 'Input #$i+',
        required: true // show red / notConnected (default right... (but can be falsed?)) TODO:
      }
    },
    inspect: { // inspect element
      // {fromSide: 'right', side: 'left', 5: {}, 7: {pos: 1, side: 'top', name: 'test'}}
      // TODO: LABEL vs NAME. Consictency!
      connection: {side: 'left', fromSide: 'right', fromPos: 2, connections: [{id: 6}, {id: 6, pos: 2}, {}]}, connectors: {left: {amount: 4, name: ['one', null, 'three']}},
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
  inputs: {
    name: 'Inputs',
    toggle: {
      name: 'Toggle Switch',
      documentation: "Click on me to toggle my states, I can be on or off.",
      classes: ['box'],
      children: '<div class="btn-light"></div>',
      connectors: {right: {}}
    },
    button: {
      name: 'Push Button',
      documentation: "Just a button, nothing special.",
      classes: ['box'],
      children: '',
      connectors: {right: {}}
    },
    clock: {
      name: 'Clock',
      documentation: "The clock is a timer.....<br><br>ms = milli seconds<br>s = seconds<br>m = minutes<br>h = hours<br><br>e.g. 1s == 1000ms",
      classes: ['box'],
      children: '<div class="display"><input class="clock_input textInput" id="clockInput#0" tabindex="-1" value="500ms" type="text"><div class="signal-light"></div></div>',
      connectors: {right: {}}
    },
    high_constant: {
      name: 'High constant',
      documentation: "I will be active forever, and you can't disable me! Muwhahahaha!!",
      classes: ['box'],
      innerClasses: ['constant', 'noselect'],
      children: '<span>1</span>',
      connectors: {right: {}}
    },
    low_constant: {
      name: 'Low constant',
      documentation: "What's the point of me, really??",
      classes: ['box'],
      innerClasses: ['constant', 'noselect'],
      children: '<span>0</span>',
      connectors: {right: {}}
    }
  },
  outputs: {
    name: 'Outputs',
    light: {
      name: 'Light Bulb',
      classes: ['box', 'round'],
      innerClasses: ['off'],
      children: '',
      connectors: {left: {}}
    },
    number_display: {
      name: '4-Bit Digit',
      classes: ['box'],
      innerClasses: ['constant', 'noselect'],
      children: '<span>0</span>',
      connectors: {left: {amount: 4}}
    },
    seven_segment: {
      name: 'Seven Segment Display',
      classes: ['box', 'big'],
      children: '<div id="number_1"></div><div id="number_2"></div><div id="number_3"></div><div id="number_4"></div><div id="number_5"></div><div id="number_6"></div><div id="number_7"></div>',
      connectors: {left: {amount: 7}}
    }
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
        3: {type: 'toggle', x: 4360, y: 4900, label: 'Input #1', connection: {connections: [{id: 0}, {id: 1}]}},
        4: {type: 'toggle', x: 4680, y: 4900, label: 'Input #2', connection: {pos: 1, connections: [{id: 0}, {id: 1}]}},
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
        // 9: {type: 'transistor', x: 4590, y: 4985, connection: {connections: [{id: 10}]}}, // y: 5000?
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
        6: {type: 'transistor_inv', x: 5250, y: 4958, connection: {connections: [{id: 7, side: 'top'}]}},
        7: {type: 'light', x: 5400, y: 4958, label: 'Output'}
      }
    },
  },
  flip_flops: {
    name: 'Flip-Flops'
  },
  // inspect VVV
  latches: {
    name: 'Latches',
    gated_latch: {
      name: 'Gated Latch',
      classes: ['box', 'latch'],
      innerClasses: [],
      children: '',
      connectors: {
        left: {amount: 2, name: ['Data in', 'Write enable']},
        right: {name: ['Data out']}
      },
      inspect: {}
    },
    gated_latch_grid: {
      name: 'Gated Latch Grid',
      classes: ['box', 'latch'],
      innerClasses: [],
      children: '',
      memory: {column: 1, row: 1},
      connectors: {
        left: {amount: 5, name: ['Data in (/ out)', 'Write enable', 'Read enable', 'Row', 'Column']},
        right: {name: ['Data out']}
      },
      inspect: {}
    }
  },
  other: {
    name: 'Other',
    transistor: {
      name: 'Transistor', // Tri-state
      classes: ['box'],
      innerClasses: [], // 'gate',
      children: '<div class="arrow"><span></span><span></span><span></span></div>',
      connectors: {left: {}, right: {}, top: {}},
      inspect: {}
    },
    transistor_inv: {
      name: 'Transistor Inverted',
      classes: ['box'],
      innerClasses: [], // 'gate',
      children: '<div class="arrow"><span></span><span></span><span></span><span></span></div>',
      connectors: {left: {}, right: {}, top: {}},
      inspect: {}
    },
  },
  components: {
    name: 'Components',
    seven_segment_decoder: {
      name: 'Seven Segment Display Decoder',
      classes: ['box', 'big'],
      innerClasses: [],
      children: '',
      connectors: {left: {amount: 4, name: ['8', '4', '2', '1']}, right: {amount: 7}},
      inspect: {}
    },
    multiplexer: {
      name: 'Multiplexer',
      classes: ['box', 'long'],
      innerClasses: [],
      children: '',
      connectors: {left: {amount: 4}, bottom: {amount: 16, name: ['$i']}},
      inspect: {}
    },
    '256_bit': {
      name: '256-bit Memory',
      classes: ['box', 'chip'],
      innerClasses: [],
      children: '',
      memory: {row: 16, column: 16},
      connectors: {
        left: {amount: 11, name: ['1 Col', '2 Col', '4 Col', '8 Col', '1 Row', '2 Row', '4 Row', '8 Row', 'Data (in)', 'Write enable', 'Read enable']},
        right: {name: ['Data out']}
      },
      inspect: {}
    },
    '256_byte': {
      name: '256-byte RAM',
      classes: ['box', 'chip', 'chip_bigger'],
      innerClasses: [],
      children: '',
      memory: {column: 16, row: 16, repeat: 8}, // 32 * 64 | 8 * 256
      connectors: {
        // TODO: same output as input
        left: {amount: 18, name: ['8-bit Data', null, null, null, null, null, null, null, '1 Col', '2 Col', '4 Col', '8 Col', '1 Row', '2 Row', '4 Row', '8 Row', 'Write enable', 'Read enable']},
        // right: {amount: 8, name: ['Data out']}
      },
      inspect: {}
    },
    register: {
      name: 'Register',
      classes: ['box', 'big'],
      innerClasses: [],
      children: '',
      memory: {column: 8, row: 1},
      connectors: {
        left: {amount: 10, name: ['In', null, null, null, null, null, null, null, 'Write enable', 'Read enable']},
        right: {amount: 8, name: ['Out']}
        // TODO: same output as input
      },
      inspect: {}
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
        left: {amount: 3, name: [null, null, 'E']},
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
        'vert_9': {type: 'light', x: 5161, y: 4739, spacing: 110, repeat: 4, label: ['Output #$i+']},
      }
    },
    'WIP_disabled_4_16': {
      name: '4 to 16 Decoder',
      classes: ['box'],
      innerClasses: [],
      children: '',
      connectors: {left: {amount: 4}, right: {amount: 16, name: ['$i']}},
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
        left: {amount: 20, name: ['$i', '@17:Data in', '@18:Data out', '@19:Write enable', '@20:Read enable'], required: [true, false, null, true]}, // show red / notConnected TODO: required
        right: {name: ['Data out']},
        top: {amount: 16}
      },
      inspect: {}
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
