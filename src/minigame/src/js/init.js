// Basic functionality, bootstrap, config
// 'use strict';

import rcn_bin from "./bin.js"
import rcn_start_game_mode from "./game.js";

function rcn_load_styles(styles) {
  return Promise.all(styles.map(function(style) {
    const style_node = document.createElement('link');
    style_node.rel = 'stylesheet';
    style_node.media = 'screen';
    style_node.type = 'text/css';
    style_node.href = './minigame/src/css/'+style+'.css';
    document.head.appendChild(style_node);
    return new Promise(function(resolve) {
      style_node.onload = resolve;
    });
  }));
}

window.addEventListener('load', async function() {
    fetch('./minigame/src/test.rcn.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(test) {
      let static_bin = new rcn_bin();
      static_bin.from_json(test);
      return rcn_start_game_mode({
        bin: static_bin,
        export: true,
      });
    });

});
