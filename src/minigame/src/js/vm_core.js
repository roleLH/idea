// Raccoon virtual machine
// This is the worker script that gets executed inside a web worker

import {rcn} from "./config.js"

let global = window;

function rcn_vm_worker_function(vm) {

  const rcn_ram_size = rcn.ram_size;
  const rcn_mem_palette_offset = rcn.mem_palette_offset;
  const rcn_mem_sound_offset = rcn.mem_sound_offset;
  const rcn_mem_music_offset = rcn.mem_music_offset;
  const rcn_mem_gamepad_offset = rcn.mem_gamepad_offset;
  const rcn_mem_musicstate_offset = rcn.mem_musicstate_offset;
  const rcn_mem_soundstate_offset = rcn.mem_soundstate_offset;
  const rcn_mem_soundreg_offset = rcn.mem_soundreg_offset;
  const rcn_mem_soundreg_size = rcn.mem_soundreg_size;
  const rcn_mem_screen_offset = rcn.mem_screen_offset;
  const rcn_mem_screen_size = rcn.mem_screen_size;

  const ram_buffer = new ArrayBuffer(rcn_ram_size);
  const ram_view = new DataView(ram_buffer);
  const ram = new Uint8Array(ram_buffer);


  this.vm = vm;
  // Keep parts of the API local
  const _Array = Array;
  const _console = console;
  const _Function = Function;
  const _Math = Math;
  const _Object = Object;
  const _postMessage = function(msg) {
    vm.onmessage({data:msg})
  };
  const _self = self;
  const _String = String;
  const game_code = rcn.game_code;

  // Local helper functions
  const sprite_pixel_index = function(x, y) {
    return (y<<6)+(x>>1);
  }
  const screen_pixel_index = function(x, y) {
    return rcn_mem_screen_offset + sprite_pixel_index(x, y);
  }
  const pset_internal = function(x, y, c) {
    // No bounds-checking, no color palette support
    const index = screen_pixel_index(x, y);
    ram[index] = ((x % 2) < 1)
          ? ((ram[index] & 0xf0) | c)
          : ((ram[index] & 0x0f) | (c << 4));
  }
  const pset_internal_safe = function(x, y, c) {
    // No color palette support
    if(x < 0 || x >= 128 || y < 0 || y >= 128) {
      return;
    }
    pset_internal(x, y, c);
  }
  const cam_x = function() {
    return ram_view.getInt16(rcn.mem_cam_offset + 0);
  }
  const cam_y = function() {
    return ram_view.getInt16(rcn.mem_cam_offset + 2);
  }

  // Raccoon math API
  global.flr = _Math.floor;
  global.ceil = _Math.ceil;
  global.abs = _Math.abs;
  global.sign = _Math.sign;
  global.max = _Math.max;
  global.min = _Math.min;
  global.mid = function(a, b, c) {
    return max(min(a, b), min(max(a, b), c));
  }
  global.sqrt = _Math.sqrt;
  global.rnd = function(x) {
    return x ? _Math.floor(_Math.random()*x) : _Math.random();
  }
  global.sin = _Math.sin;
  global.cos = _Math.cos;
  global.atan2 = _Math.atan2;

  // Raccoon rendering API
  global.pset = function(x, y, c) {
    x -= cam_x();
    y -= cam_y();
    if(x < 0 || x >= 128 || y < 0 || y >= 128) {
      return;
    }
    pset_internal_safe(x, y, _palmget(c));
  }
  global.pget = function(x, y) {
    if(x < 0 || x >= 128 || y < 0 || y >= 128) {
      return 0;
    }
    const pixel = ram[screen_pixel_index(x, y)];
    if((x % 2) < 1) {
      return pixel & 0xf;
    } else {
      return pixel >> 4;
    }
  }
  global.palset = function(i, r, g, b) {
    ram[rcn_mem_palette_offset+i*4+0] = r;
    ram[rcn_mem_palette_offset+i*4+1] = g;
    ram[rcn_mem_palette_offset+i*4+2] = b;
  }
  const _palmget = function(c) {
    return ram[rcn_mem_palette_offset+c*4+3] & 0xf;
  }
  global.palm = function(src, dst) {
    ram[rcn_mem_palette_offset+src*4+3] = (ram[rcn_mem_palette_offset+src*4+3] & 0xf0) | dst;
  }
  const _paltget = function(c) {
    return (ram[rcn_mem_palette_offset+c*4+3] >> 7) != 0;
  }
  global.palt = function(c, t) {
    ram[rcn_mem_palette_offset+c*4+3] = (ram[rcn_mem_palette_offset+c*4+3] & 0x0f) | (t ? 0x80 : 0x00);
  }
  global.cls = function(c = 0) { // Default color is 0
    c |= c<<4; // Left and right pixel to same color
    ram.fill(c, rcn_mem_screen_offset, rcn_mem_screen_offset + rcn_mem_screen_size);
  }
  global.cam = function(x, y) {
    ram_view.setInt16(rcn.mem_cam_offset + 0, x);
    ram_view.setInt16(rcn.mem_cam_offset + 2, y);
  }
  global.spr = function(n, x, y, ow = 1.0, oh = 1.0, fx = false, fy = false) {
    x -= cam_x();
    y -= cam_y();

    // Clip
    const iw = max(0, -x / 8);
    const ih = max(0, -y / 8);
    const w = min(ow, (128 - x) / 8);
    const h = min(oh, (128 - y) / 8);

    // Early exit if nothing to draw
    if(w <= iw || h <= ih) {
      return;
    }

    const first_texel_index = ((n & 0xf) << 2) + ((n >> 4) << 9);
    const owp = ow * 8;
    const ohp = oh * 8;
    const iwp = iw * 8;
    const ihp = ih * 8;
    const wp = w * 8;
    const hp = h * 8;
    for(let i = iwp; i < wp; i++) {
      for(let j = ihp; j < hp; j++) {
        // Fetch sprite color
        const ti = fx ? (owp - i - 1) : i;
        const tj = fy ? (ohp - j - 1) : j;
        const tex_index = first_texel_index + sprite_pixel_index(ti, tj);
        const c = ((ti % 2) < 1)
          ? (ram[tex_index] & 0xf)
          : (ram[tex_index] >> 4);

        if(!_paltget(c)) {
          pset_internal(x + i, y + j, _palmget(c));
        }
      }
    }
  }
  global.fget = function(n, f) {
    const flags = ram[rcn.mem_spriteflags_offset + n];
    return f !== undefined ? ((flags & (1 << f)) != 0) : flags;
  }
  global.fset = function(n, f, v) {
    const i = rcn.mem_spriteflags_offset + n;
    ram[i] = v !== undefined ? (ram[i] & ~(1 << f)) | (v ? (1 << f) : 0) : f;
  }
  global.mget = function(celx, cely) {
    return ram[rcn.mem_map_offset + (cely << 7) + (celx << 0)];
  }
  global.mset = function(celx, cely, n) {
    ram[rcn.mem_map_offset + (cely << 7) + (celx << 0)] = n;
  }
  global.map = function(celx, cely, sx, sy, celw, celh, layer = 0xff) {
    for(let x = 0; x < celw; x++) {
      for(let y = 0; y < celh; y++) {
        spr(_mget(celx + x, cely + y), sx + (x << 3), sy + (y << 3));
      }
    }
  }
  const font = {
    // Numbers
    '0':[0,0,1,0,2,0,0,1,2,1,0,2,2,2,0,3,2,3,0,4,1,4,2,4],'1':[1,0,0,1,1,1,1,2,1,3,0,4,1,4,2,4],'2':[0,0,1,0,2,0,2,1,0,2,1,2,2,2,0,3,0,4,1,4,2,4],'3':[0,0,1,0,2,0,2,1,1,2,2,2,2,3,0,4,1,4,2,4],'4':[0,0,2,0,0,1,2,1,0,2,1,2,2,2,2,3,2,4],'5':[0,0,1,0,2,0,0,1,0,2,1,2,2,2,2,3,0,4,1,4,2,4],'6':[0,0,1,0,2,0,0,1,0,2,1,2,2,2,0,3,2,3,0,4,1,4,2,4],'7':[0,0,1,0,2,0,2,1,2,2,2,3,2,4],'8':[0,0,1,0,2,0,0,1,2,1,0,2,1,2,2,2,0,3,2,3,0,4,1,4,2,4],'9':[0,0,1,0,2,0,0,1,2,1,0,2,1,2,2,2,2,3,0,4,1,4,2,4],
    // Letters
    A:[1,0,0,1,2,1,0,2,1,2,2,2,0,3,2,3,0,4,2,4],B:[0,0,1,0,0,1,2,1,0,2,1,2,0,3,2,3,0,4,1,4],C:[1,0,2,0,0,1,0,2,0,3,1,4,2,4],D:[0,0,1,0,0,1,2,1,0,2,2,2,0,3,2,3,0,4,1,4],E:[0,0,1,0,2,0,0,1,0,2,1,2,0,3,0,4,1,4,2,4],F:[0,0,1,0,2,0,0,1,0,2,1,2,0,3,0,4],G:[1,0,2,0,0,1,0,2,0,3,2,3,1,4,2,4],H:[0,0,2,0,0,1,2,1,0,2,1,2,2,2,0,3,2,3,0,4,2,4],I:[0,0,1,0,2,0,1,1,1,2,1,3,0,4,1,4,2,4],J:[0,0,1,0,2,0,1,1,1,2,1,3,0,4,1,4],K:[0,0,2,0,0,1,2,1,0,2,1,2,0,3,2,3,0,4,2,4],L:[0,0,0,1,0,2,0,3,0,4,1,4,2,4],M:[0,0,2,0,0,1,1,1,2,1,0,2,2,2,0,3,2,3,0,4,2,4],N:[0,0,1,0,0,1,2,1,0,2,2,2,0,3,2,3,0,4,2,4],O:[1,0,0,1,2,1,0,2,2,2,0,3,2,3,1,4],P:[0,0,1,0,0,1,2,1,0,2,1,2,0,3,0,4],Q:[1,0,0,1,2,1,0,2,2,2,0,3,1,3,1,4,2,4],R:[0,0,1,0,0,1,2,1,0,2,1,2,0,3,2,3,0,4,2,4],S:[1,0,2,0,0,1,1,2,2,3,0,4,1,4],T:[0,0,1,0,2,0,1,1,1,2,1,3,1,4],U:[0,0,2,0,0,1,2,1,0,2,2,2,0,3,2,3,1,4],V:[0,0,2,0,0,1,2,1,0,2,2,2,0,3,1,3,2,3,1,4],W:[0,0,2,0,0,1,2,1,0,2,2,2,0,3,1,3,2,3,0,4,2,4],X:[0,0,2,0,0,1,2,1,1,2,0,3,2,3,0,4,2,4],Y:[0,0,2,0,0,1,2,1,0,2,1,2,2,2,1,3,1,4],Z:[0,0,1,0,2,0,2,1,1,2,0,3,0,4,1,4,2,4],a:[1,2,2,2,0,3,2,3,0,4,1,4,2,4],b:[0,0,0,1,0,2,1,2,0,3,2,3,0,4,1,4],c:[1,2,2,2,0,3,1,4,2,4],d:[2,0,2,1,1,2,2,2,0,3,2,3,1,4,2,4],e:[0,2,1,2,0,3,1,4,3],f:[1,0,0,1,0,2,1,2,0,3,0,4,3],g:[1,2,0,3,2,3,1,4,2,4,2,5,1,6],h:[0,0,0,1,0,2,1,2,0,3,2,3,0,4,2,4],i:[0,0,0,2,0,3,0,4,2],j:[1,0,1,2,1,3,1,4,1,5,0,6,3],k:[0,0,0,1,0,2,2,2,0,3,1,3,0,4,2,4],l:[0,0,0,1,0,2,0,3,0,4,2],m:[0,2,1,2,2,2,0,3,2,3,0,4,2,4],n:[0,2,1,2,0,3,2,3,0,4,2,4],o:[1,2,0,3,2,3,1,4],p:[0,2,1,2,0,3,2,3,0,4,1,4,0,5,0,6],q:[1,2,2,2,0,3,2,3,1,4,2,4,2,5,2,6],r:[1,2,0,3,0,4,3],s:[1,2,2,2,1,3,0,4,1,4],t:[0,0,0,1,1,1,0,2,0,3,1,4,3],u:[0,2,2,2,0,3,2,3,1,4],v:[0,2,2,2,0,3,1,3,2,3,1,4],w:[0,2,2,2,0,3,2,3,0,4,1,4,2,4],x:[0,2,2,2,1,3,0,4,2,4],y:[0,2,2,2,0,3,2,3,1,4,2,4,2,5,1,6],z:[0,2,1,2,1,3,1,4,2,4],
    // Punctuation
    '!':[0,0,0,1,0,2,0,4,2],'"':[0,0,2,0,0,1,2,1],'#':[1,0,3,0,0,1,1,1,2,1,3,1,4,1,1,2,3,2,0,3,1,3,2,3,3,3,4,3,1,4,3,4,6],'%':[0,0,2,0,2,1,1,2,0,3,0,4,2,4],'&':[1,0,0,1,2,1,1,2,3,2,0,3,2,3,1,4,3,4,5],'\'':[0,0,0,1,2],'(':[1,0,0,1,0,2,0,3,0,4,1,5,3],')':[0,0,1,1,1,2,1,3,1,4,0,5,3],'*':[0,1,2,1,1,2,0,3,2,3],',':[0,4,0,5,2],'-':[0,3,1,3,2,3],'.':[0,4,2],'/':[2,0,2,1,1,2,1,3,0,4,0,5],':':[0,2,0,4,2],';':[0,2,0,4,0,5,2],'?':[0,0,1,1,0,2,0,4,3],'@':[1,0,0,1,2,1,0,2,2,2,0,3,1,4,2,4],'[':[0,0,1,0,0,1,0,2,0,3,0,4,0,5,1,5,3],'\\':[0,0,0,1,1,2,1,3,2,4,2,5],']':[0,0,1,0,1,1,1,2,1,3,1,4,0,5,1,5,3],'_':[0,5,1,5,2,5],'{':[2,0,1,1,0,2,1,2,1,3,1,4,2,5],'}':[0,0,1,1,1,2,2,2,1,3,1,4,0,5],
    // Symbols
    '$':[1,-1,1,0,2,0,0,1,1,2,2,3,0,4,1,4,1,5],'+':[0,2,1,1,1,2,1,3,2,2],'<':[0,2,1,1,1,3,2,0,2,4],'=':[0,1,0,3,1,1,1,3,2,1,2,3],'>':[0,0,0,4,1,1,1,3,2,2],'^':[1,0,0,1,2,1],'`':[0,0,1,1,3],'|':[0,0,0,1,0,2,0,3,0,4,2],'~':[0,3,1,2,2,3,3,2,5],
    // Buttons
    '\ue000':[0,-1,1,-1,2,-1,3,-1,4,-1,5,-1,6,-1,0,0,1,0,2,0,4,0,5,0,6,0,0,1,1,1,4,1,5,1,6,1,0,2,6,2,0,3,1,3,4,3,5,3,6,3,0,4,1,4,2,4,4,4,5,4,6,4,0,5,1,5,2,5,3,5,4,5,5,5,6,5,8], // Keyboard left
    '\ue001':[0,-1,1,-1,2,-1,3,-1,4,-1,5,-1,6,-1,0,0,1,0,2,0,4,0,5,0,6,0,0,1,1,1,2,1,5,1,6,1,0,2,6,2,0,3,1,3,2,3,5,3,6,3,0,4,1,4,2,4,4,4,5,4,6,4,0,5,1,5,2,5,3,5,4,5,5,5,6,5,8], // Keyboard right
    '\ue002':[0,-1,1,-1,2,-1,3,-1,4,-1,5,-1,6,-1,0,0,1,0,2,0,4,0,5,0,6,0,0,1,1,1,5,1,6,1,0,2,6,2,0,3,1,3,2,3,4,3,5,3,6,3,0,4,1,4,2,4,4,4,5,4,6,4,0,5,1,5,2,5,3,5,4,5,5,5,6,5,8], // Keyboard up
    '\ue003':[0,-1,1,-1,2,-1,3,-1,4,-1,5,-1,6,-1,0,0,1,0,2,0,4,0,5,0,6,0,0,1,1,1,2,1,4,1,5,1,6,1,0,2,6,2,0,3,1,3,5,3,6,3,0,4,1,4,2,4,4,4,5,4,6,4,0,5,1,5,2,5,3,5,4,5,5,5,6,5,8], // Keyboard down
    '\ue004':[0,-1,1,-1,2,-1,3,-1,4,-1,5,-1,6,-1,0,0,1,0,3,0,5,0,6,0,0,1,1,1,3,1,5,1,6,1,0,2,1,2,2,2,4,2,5,2,6,2,0,3,1,3,3,3,5,3,6,3,0,4,1,4,3,4,5,4,6,4,0,5,1,5,2,5,3,5,4,5,5,5,6,5,8], // Keyboard first button
    '\ue005':[0,-1,1,-1,2,-1,3,-1,4,-1,5,-1,6,-1,0,0,1,0,2,0,5,0,6,0,0,1,1,1,3,1,4,1,5,1,6,1,0,2,1,2,3,2,4,2,5,2,6,2,0,3,1,3,3,3,4,3,5,3,6,3,0,4,1,4,2,4,5,4,6,4,0,5,1,5,2,5,3,5,4,5,5,5,6,5,8], // Keyboard second button
    '\ue006':[0,-1,1,-1,2,-1,3,-1,4,-1,5,-1,6,-1,0,0,1,0,3,0,5,0,6,0,0,1,1,1,3,1,5,1,6,1,0,2,1,2,3,2,5,2,6,2,0,3,1,3,3,3,5,3,6,3,0,4,1,4,2,4,4,4,5,4,6,4,0,5,1,5,2,5,3,5,4,5,5,5,6,5,8], // Keyboard third button
    '\ue007':[0,-1,1,-1,2,-1,3,-1,4,-1,5,-1,6,-1,0,0,1,0,4,0,5,0,6,0,0,1,1,1,3,1,5,1,6,1,0,2,1,2,4,2,5,2,6,2,0,3,1,3,3,3,5,3,6,3,0,4,1,4,4,4,5,4,6,4,0,5,1,5,2,5,3,5,4,5,5,5,6,5,8], // Keyboard fourth button
    '\ue008':[2,-1,3,-1,4,-1,1,0,2,0,4,0,5,0,0,1,1,1,4,1,5,1,6,1,0,2,6,2,0,3,1,3,4,3,5,3,6,3,1,4,2,4,4,4,5,4,2,5,3,5,4,5,8], // Gamepad left
    '\ue009':[2,-1,3,-1,4,-1,1,0,2,0,4,0,5,0,0,1,1,1,2,1,5,1,6,1,0,2,6,2,0,3,1,3,2,3,5,3,6,3,1,4,2,4,4,4,5,4,2,5,3,5,4,5,8], // Gamepad right
    '\ue00a':[2,-1,3,-1,4,-1,1,0,2,0,4,0,5,0,0,1,1,1,5,1,6,1,0,2,6,2,0,3,1,3,2,3,4,3,5,3,6,3,1,4,2,4,4,4,5,4,2,5,3,5,4,5,8], // Gamepad up
    '\ue00b':[2,-1,3,-1,4,-1,1,0,2,0,4,0,5,0,0,1,1,1,2,1,4,1,5,1,6,1,0,2,6,2,0,3,1,3,5,3,6,3,1,4,2,4,4,4,5,4,2,5,3,5,4,5,8], // Gamepad down
    '\ue00c':[2,-1,3,-1,4,-1,1,0,2,0,4,0,5,0,0,1,1,1,3,1,5,1,6,1,0,2,1,2,5,2,6,2,0,3,1,3,3,3,5,3,6,3,1,4,3,4,5,4,2,5,3,5,4,5,8], // Gamepad first button
    '\ue00d':[2,-1,3,-1,4,-1,1,0,4,0,5,0,0,1,1,1,3,1,5,1,6,1,0,2,1,2,4,2,5,2,6,2,0,3,1,3,3,3,5,3,6,3,1,4,4,4,5,4,2,5,3,5,4,5,8], // Gamepad second button
    '\ue00e':[2,-1,3,-1,4,-1,1,0,3,0,5,0,0,1,1,1,3,1,5,1,6,1,0,2,1,2,2,2,4,2,5,2,6,2,0,3,1,3,3,3,5,3,6,3,1,4,3,4,5,4,2,5,3,5,4,5,8], // Gamepad third button
    '\ue00f':[2,-1,3,-1,4,-1,1,0,3,0,5,0,0,1,1,1,3,1,5,1,6,1,0,2,1,2,5,2,6,2,0,3,1,3,2,3,4,3,5,3,6,3,1,4,2,4,4,4,5,4,2,5,3,5,4,5,8], // Gamepad fourth button
  };
  const font_ys = _Object.values(font).map(a => a.filter((v, i) => i&1)).flat();
  const font_min_y = font_ys.reduce((a, b) => min(a, b));
  const font_max_y = font_ys.reduce((a, b) => max(a, b));
  global.print = function(x, y, text, c) {
    x -= cam_x();
    y -= cam_y();
    c = _palmget(c);

    text = _String(text);

    const ox = x;
    let max_width = 0;
    for(let i = 0; i < text.length; i++) {
      const char = text.charAt(i);

      if(char == '\n') {
        x = ox;
        y += 8;
        continue;
      }

      const g = font[char];
      const advance = (g && g.length % 2 == 1) ? g[g.length - 1] : 4;
      if(g && x < 128 && x + advance > 0 &&
        y + font_min_y < 128 && y + font_max_y >= 0) {
        for(let j = 0; j < g.length - 1; j += 2) {
          const gx = g[j+0] + x;
          const gy = g[j+1] + y;
          pset_internal_safe(gx, gy, c);
        }
      }
      x += advance;
      max_width = max(max_width, x - ox);
    }
    return max_width;
  }
  const hline = function(x, y, w, c) {
    // No bounds-checking, no color palette support
    const cc = c | (c << 4);
    const x2 = x + (x & 1);
    if(x != x2) {
      pset_internal(x, y, c);
      w -= 1;
    }
    if((w & 1) != 0) {
      pset_internal(x2 + w - 1, y, c);
    }
    const index = screen_pixel_index(x2, y);
    ram.fill(cc, index, index + (w >> 1));
  }
  const hline_safe = function(x, y, w, c) {
    if(y >= 0 && y < 128) {
      w += min(0, x);
      x = max(0, x);
      w -= max(128, x + w) - 128;
      if(w > 0) {
        hline(x, y, w, c);
      }
    }
  }
  global.line = function(x0, y0, x1, y1, c) {
    x0 = flr(x0) + 0.5;
    x1 = flr(x1) + 0.5;
    y0 = flr(y0) + 0.5;
    y1 = flr(y1) + 0.5;

    x0 -= cam_x();
    y0 -= cam_y();
    x1 -= cam_x();
    y1 -= cam_y();
    c = _palmget(c);

    const dx = flr(x1 - x0);
    const dy = flr(y1 - y0);
    if(dx == 0 && dy == 0) {
      pset_internal_safe(x0, y0, c);
    } else if(abs(dx) >= abs(dy)) {
      if(x1 < x0) {
        let tmp = x1;
        x1 = x0;
        x0 = tmp;
        tmp = y1
        y1 = y0
        y0 = tmp
      }
      const de = dy / dx;
      let y = y0;
      for(let x = x0; x <= x1; x++) {
        pset_internal_safe(x, y, c);
        y += de;
      }
    } else {
      if(y1 < y0) {
        let tmp = x1;
        x1 = x0;
        x0 = tmp;
        tmp = y1
        y1 = y0
        y0 = tmp
      }
      const de = dx / dy;
      let x = x0;
      for(let y = y0; y <= y1; y++) {
        pset_internal_safe(x, y, c);
        x += de;
      }
    }
  }
  global.rect = function(x, y, w, h, c) {
    x -= cam_x();
    y -= cam_y();
    c = _palmget(c);

    x <<= 0;
    y <<= 0;
    w <<= 0;
    h <<= 0;
    for(let i = 0; i < w; i++) {
      pset_internal_safe(x + i, y, c);
      pset_internal_safe(x + i, y + h - 1, c);
    }
    for(let i = 1; i < h - 1; i++) {
      pset_internal_safe(x, y + i, c);
      pset_internal_safe(x + w - 1, y + i, c);
    }
  }
  global.rectfill = function(x, y, w, h, c) {
    x -= cam_x();
    y -= cam_y();

    x <<= 0;
    y <<= 0;
    w <<= 0;
    h <<= 0;
    w += min(0, x);
    x = max(0, x);
    h += min(0, y);
    y = max(0, y);
    w -= max(128, x + w) - 128;
    h -= max(128, y + h) - 128;
    if(w > 0 && h > 0) {
      c = _palmget(c);
      for(let i = 0; i < h; i++) {
        hline(x, y + i, w, c);
      }
    }
  }
  global.circ = function(x, y, r, c) {
    x -= cam_x();
    y -= cam_y();
    c = _palmget(c);

    x <<= 0;
    y <<= 0;
    r <<= 0;

    // Bresenham
    let d = 3 - (2 * r);
    let ox = 0;
    let oy = r;

    while(ox <= oy) {
      pset_internal_safe(x + ox, y + oy, c);
      pset_internal_safe(x + ox, y - oy, c);
      pset_internal_safe(x - ox, y + oy, c);
      pset_internal_safe(x - ox, y - oy, c);
      pset_internal_safe(x + oy, y + ox, c);
      pset_internal_safe(x + oy, y - ox, c);
      pset_internal_safe(x - oy, y + ox, c);
      pset_internal_safe(x - oy, y - ox, c);

      ox++;
      if(d < 0) {
        d += 4 * ox + 6;
      } else {
        d += 4 * (ox - oy) + 10;
        oy--;
      }
    }
  }
  global.circfill = function(x, y, r, c) {
    x -= cam_x();
    y -= cam_y();
    c = _palmget(c);

    x <<= 0;
    y <<= 0;
    r <<= 0;

    // Bresenham
    let d = 3 - (2 * r);
    let ox = 0;
    let oy = r;

    while(ox <= oy) {
      hline_safe(x - ox, y + oy, (ox << 1) + 1, c);
      hline_safe(x - ox, y - oy, (ox << 1) + 1, c);
      hline_safe(x - oy, y + ox, (oy << 1) + 1, c);
      hline_safe(x - oy, y - ox, (oy << 1) + 1, c);

      ox++;
      if(d < 0) {
        d += 4 * ox + 6;
      } else {
        d += 4 * (ox - oy) + 10;
        oy--;
      }
    }
  }

  // Raccoon sound API
  const _sfx_stop = function(channel) {
    const ram_offset = rcn_mem_soundstate_offset + channel * 5;
    ram.fill(0, ram_offset, ram_offset + 5);
  }
  const sfx_update = function() {
    for(let i = 0; i < 4; i++) {
      const sreg_offset = rcn_mem_soundreg_offset + i * 4;
      const state_ram_offset = rcn_mem_soundstate_offset + i * 5;
      const state_length = ram[state_ram_offset + 2];
      if(state_length == 0) {
        ram[sreg_offset + 0] &= 0x7f; // Switch off
        continue;
      }

      const state_n = ram[state_ram_offset + 0];
      const snd_offset = rcn_mem_sound_offset + state_n * 66;
      const period = ram[snd_offset + 0] + 4; // In audio frames

      const state_time = ram_view.getUint16(state_ram_offset + 3);
      const next_note_index = ceil(state_time / period);
      const next_note_time = next_note_index * period;
      if(state_time <= next_note_time && next_note_time < state_time + 4) {
        // Next note should be triggered in the next frame
        const offset = next_note_time - state_time;

        if(next_note_index >= state_length) {
          // We've reached the end of the sfx, stop
          ram[sreg_offset + 0] = 0x80; // Switch on and period 0
          ram[sreg_offset + 2] = (offset << 6); // Offset and pitch
          ram[sreg_offset + 3] = 0; // Volume and effect
          _sfx_stop(i);
          continue;
        } else {
          const state_offset = ram[state_ram_offset + 1];
          const note_offset = snd_offset + 2 + (state_offset + next_note_index) * 2;
          const note_1 = ram[note_offset + 0];
          const note_2 = ram[note_offset + 1];
          ram[sreg_offset + 0] = 0x80 | period; // Switch on and period
          ram[sreg_offset + 1] = ram[snd_offset + 1]; // Envelope and instrument
          ram[sreg_offset + 2] = (offset << 6) | (note_1 & 0x3f); // Offset and pitch
          ram[sreg_offset + 3] = note_2; // Volume and effect
        }
      } else {
        ram[sreg_offset + 0] &= 0x7f; // Switch off
      }

      ram_view.setUint16(state_ram_offset + 3, state_time + 4);
    }
  }
  global.sfx = function(n, channel = -1, offset = 0, length = 32) {
    if(channel < 0) {
      while(++channel < 3 && ram[rcn_mem_soundstate_offset + channel * 5 + 2] != 0);
    }
    const ram_offset = rcn_mem_soundstate_offset + channel * 5;
    ram[ram_offset] = n; // Sfx index
    ram[ram_offset + 1] = offset; // In notes
    ram[ram_offset + 2] = length; // In notes
    ram_view.setUint16(ram_offset + 3, 0); // In audio frames (120 per second)
  }
  const _mus_state = {
    get is_playing() { return !!(ram[rcn_mem_musicstate_offset] & 0x80); },
    stop: function() { ram[rcn_mem_musicstate_offset] = 0; },
    get n() { return ram[rcn_mem_musicstate_offset] & 0x7f; },
    set n(v) { ram[rcn_mem_musicstate_offset] = v | 0x80; },
    get max_time() { return ram_view.getUint16(rcn_mem_musicstate_offset + 1); },
    set max_time(v) { ram_view.setUint16(rcn_mem_musicstate_offset + 1, v); },
    get time() { return ram_view.getUint16(rcn_mem_musicstate_offset + 3); },
    set time(v) { ram_view.setUint16(rcn_mem_musicstate_offset + 3, v); },
  };
  const _mus_update = function() {
    if(!_mus_state.is_playing) return;
    let max_time = _mus_state.max_time;
    let n = _mus_state.n;
    let time = _mus_state.time;

    if(max_time > 0 && time >= max_time) {
      const mus_index = rcn_mem_music_offset + n * 4;
      if(ram[mus_index + 1] & 0x80) { // End flag
        for(let i = n; i >= 0; i--) {
          if(ram[rcn_mem_music_offset + i * 4 + 0] & 0x80) { // Begin flag
            _mus_state.n = n = i;
            break;
          }
        }
      } else if(ram[mus_index + 2] & 0x80) { // Stop flag
        _mus_state.stop();
        return;
      } else {
        _mus_state.n = n = (n + 1) % rcn.music_count;
      }
      _mus_state.time = time = 0;
    }

    if(time == 0) {
      const mus_index = rcn.mem_music_offset + n * 4;
      max_time = 0;
      for(let track = 0; track < rcn.music_track_count; track++) {
        if(ram[mus_index + track] & 0x40) {
          const track_sound = ram[mus_index + track] & 0x3f;
          _sfx(track_sound, track);
          const sound_offset = rcn_mem_sound_offset + track_sound * 66;
          const period = ram[sound_offset + 0] + 4;
          max_time = max(max_time, period * 32);
        }
      }
      _mus_state.max_time = max_time;
    }

    _mus_state.time = time + 4;
  }
  const _mus_stop = function() {
    const mus_index = rcn.mem_music_offset + _mus_state.n * 4;
    for(let track = 0; track < rcn.music_track_count; track++) {
      if(ram[mus_index + track] & 0x40) {
        _sfx_stop(track);
      }
    }
  }
  global.mus = function(n) {
    if(_mus_state.is_playing) {
      _mus_stop();
    }
    if(n < 0) {
      _mus_state.stop();
    } else {
      _mus_state.n = n;
      _mus_state.time = 0;
    }
  }

  // Raccoon input API
  global.btn = function(i, p = 0) { // First player by default
    return (ram[rcn_mem_gamepad_offset + p] & (1 << i)) != 0;
  }
  global.btnp = function(i, p = 0) { // First player by default
    return (ram[rcn_mem_gamepad_offset + p] & (1 << i)) != 0 &&
      (ram[rcn_mem_gamepad_offset + p + rcn.gamepad_count] & (1 << i)) == 0;
  }
  global.btns = function(i, p = 0) {
    const layout = ram[rcn_mem_gamepad_offset + p + rcn.gamepad_count * 2];
    if(layout == rcn.gamepad_layout_abxy) {
      i += 8;
    }
    return _String.fromCodePoint([0xe000 + i]);
  }

  // Raccoon memory API
  global.memcpy = function(dst, src, len) {
    ram.copyWithin(dst, src, src + len);
  }
  global.memset = function(dst, val, len) {
    ram.fill(val, dst, dst + len);
  }
  global.read = function(addr) {
    return ram[addr];
  }
  global.read16 = function(addr) {
    return ram_view.getInt16(addr);
  }
  global.read32 = function(addr) {
    return ram_view.getInt32(addr);
  }
  global.write = function(addr, val) {
    ram[addr] = val;
  }
  global.write16 = function(addr, val) {
    ram_view.setInt16(addr, val);
  }
  global.write32 = function(addr, val) {
    ram_view.setInt32(addr, val);
  }

  // Raccoon debug API
  global.debug = function(msg) {
    _postMessage({
      type: 'debug',
      msg: msg,
    });
  }

  const _firefox_stack_line_exp = /^([^@]+)@.+:([0-9]+):[0-9]+$/i;
  const _chrome_stack_line_exp = /^    at ([^\()]+) \(.+:([0-9]+):[0-9]+\)$/i;
  const _execute_user_func = function(user_func) {
    if(typeof user_func === 'undefined') {
      return;
    }
       user_func();
    // try {
    // } catch(e) {
    //   let stack = [];
    //   if(e.stack) {
    //     stack = (new _String(e.stack)).split('\n')
    //       .map(function(line) {
    //         const match =
    //           line.match(_firefox_stack_line_exp) ||
    //           line.match(_chrome_stack_line_exp);
    //         return match && {
    //           func: match[1],
    //           line: match[2] - 2, // Line numbers are off by 2 for some reason
    //         };
    //       })
    //       .filter(l => l && !['onmessage', '_execute_user_func'].includes(l.func));
    //     for(let i = 0; i < stack.length - 1; i++) {
    //       if(stack[i].func == '__'+stack[i+1].func) {
    //         stack[i].func = stack[i+1].func;
    //         stack.splice(i+1, 1);
    //       }
    //     }
    //   }
    //   _postMessage({
    //     type: 'error',
    //     message: e.message,
    //     stack: stack,
    //     line: stack.length > 0 && stack[0].line || e.lineNumber - 2,
    //   });
    // }
  }

  // User-defined functions
  let init = undefined;
  let update = undefined;
  let nupdate = undefined;
  let draw = undefined;

  onmessage = function(e) {
    switch(e.data.type) {
      case 'code':
        init = game_code.init;
        update = game_code.update;
        draw = game_code.draw;
        break;
      case 'init': _execute_user_func(init); break;
      case 'update':

        _execute_user_func(update);
        _mus_update();
        sfx_update();
        break;
      case 'draw': _execute_user_func(draw); break;
      case 'write':
        ram.set(e.data.bytes, e.data.offset);
        break;
      case 'read':
        _postMessage({
          type: e.data.name,
          bytes: ram.slice(e.data.offset, e.data.offset + e.data.size),
        });
        break;
    }
  }
  this.postMessage = function(msg) {
    onmessage({data: msg})
  }
  this.terminate = function() {}
  return this;
}


export default rcn_vm_worker_function