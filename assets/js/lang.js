// class = lang_ + id
// ((don't translate things inside []))
// $ = attribute
var lang = {
  // ENGLISH
  en: {
    // GENERAL
    title: 'Logic Simulator', // don't change me
    $title_close: 'Close',
    // TOP BAR
    $title_save: 'Save to local storage', //  [ctrl+s]
    $title_export: 'Export selected tab(s)',
    $title_file: 'Open file',
    $title_undo: 'Undo',
    $title_redo: 'Redo',
    $title_delete: 'Delete selected',
    $title_duplicate: 'Duplicate selected',
    $title_rotate_right: 'Rotate selected right (90°)',
    $title_rotate_left: 'Rotate selected left (-90°)',
    $title_circuit: 'Create integrated circuit (by selection)',
    $title_thruth_table: 'Generate truth table',
    $title_clocks: 'View clocks',
    $title_settings: 'Settings',
    $title_about: 'About',
    // TABS
    $title_add_tab: 'Add tab',
    unnamed: 'unnamed', // TODO: WIP
    // BOTTOM BAR
    $title_retreat_sim: 'Retreat Simulation One Step',
    $title_reset: 'Reset',
    $title_pause: 'Pause',
    $title_play: 'Play',
    $title_advance_sim: 'Advance Simulation One Step',

    $title_home: 'Reset view',
    $title_zoom_out: 'Zoom out',
    $title_zoom_in: 'Zoom in',
    // CLOCKS
    no_clocks: 'No clocks active',
    standard_clock: 'Clock', // WIP
    // MODES (TBA)
    modes: 'Modes',
    mode_standard: 'Standard',
    mode_electric: 'Electric',
    mode_redstone: 'Redstone',
    mode_game: 'Game',
    $alt_circuit_board: 'Circuit Board',
    $alt_electricity: 'Electricity',
    $alt_redstone: 'Redstone Class',
    // SETTINGS
    settings_title: 'General',

    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    night: 'Night',
    neon: 'Neon',

    line_type: 'Line Type',
    lined: 'Lined',
    curved: 'Curved',
    straight: 'Straight',

    background: 'Background',
    dotted: 'Dotted',
    lines: 'Lines',
    blank: 'Blank',

    language: 'Language',
    en: 'English',
    de: 'German',
    no: 'Norwegian',
    // ABOUT
    about_title: 'About',
    created_by: 'created by',
    source_code: 'Source Code',
    support_me: 'Support me on Patreon', // exclude patreon...
    request: 'Do you have a Bug Report or Feature Request or something else?',
    issue: 'Open an <a href="https://github.com/Vassbo/logic/issues" target="_blank">issue on Github</a>, contact me on <a href="mailto:kristoffervassbo@gmail.com">Email</a> or social media',
    // WIP
    lang_info: 'If you want to help translate please....',
    lang_credits: 'Translators',
    lang_credits2: 'Translated to $s by $s', // E.g. Translated to English by Steve. (Don't replace $s...)
    roadmap: 'Roadmap', // Alias: todo
    /**/keyboard_title: 'Keyboard shortcuts',
    // CONTEXT
    cx_save: 'Save',
    cx_settings: 'Settings',
    cx_about: 'About',
    cx_select_all: 'Select all',
    cx_paste: 'Paste',
    cx_rename: 'Rename',
    cx_delete: 'Delete',
    cx_export: 'Export',
    cx_circuit: 'Create integrated circuit',
    cx_add_label: 'Add Label',
    cx_edit_label: 'Edit label',
    cx_cut: 'Cut',
    cx_copy: 'Copy',
    cx_duplicate: 'Duplicate',
    cx_documentation: 'Documentation',
    cx_inspect: 'Inspect',
    // TODO: More language support:
    // DRAWER
    // COMPONENTS
    // DOCUMENTATION
  },

  // NORWEGIAN
  no: { // test
    title: 'Logikk Simulator',
    $title_save: 'Lagre til lokalt minne',
    $title_export: 'Eksporter [valgt.valgte] [tab.tabs]...',
    $title_undo: 'Angre',
    $title_redo: 'Gjør om',
    en: 'Engelsk',
    de: 'Tysk',
    no: 'Norsk',
    add_label: 'Legg til etikett',
    edit_label: 'Rediger etikett',
  },

  // GERMAN
  de: { // test (google translate)
    // title: 'Logiksimulator',
    $title_save: 'Im lokalen Speicher speichern',
    $title_export: 'Ausgewählte Registerkarte(n) exportieren',
    en: 'Englisch',
    de: 'Deutsche',
    no: 'Norwegisch',
  },

};

var keys = { // ???
  save: 'ctrl+s',
  export: 'ctrl+e',
  file: 'ctrl+o',
  undo: 'ctrl+z',
  redo: 'ctrl+y',
  delete: 'delete' // + backspace
};
