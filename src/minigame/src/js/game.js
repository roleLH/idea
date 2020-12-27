// Raccoon game mode functionality
'use strict';

import rcn_vm from "./vm.js"

function rcn_start_game_mode(params) {
  console.log('Starting game mode');

  const vm = new rcn_vm({
    no_network: !!params.export,
  });
  vm.load_bin(params.bin);

  document.body.appendChild(vm.canvas.node);
  vm.canvas.node.focus();


}

export default rcn_start_game_mode