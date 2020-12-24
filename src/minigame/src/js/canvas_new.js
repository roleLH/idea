// Raccoon canvas
'use strict';

function rcn_canvas() {
  this.node = document.createElement('canvas');
  this.node.rcn_canvas = this;

  this.padding_x = 0;
  this.padding_y = 0;
  this.min_vp_mul = 1;

  this.onpostflush = [];

  const gl = this.gl = this.node.getContext('webgl');
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  this.texture = gl.createTexture();
  this.other = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, this.other);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  this.img_program = rcn_gl_create_program(gl, `
    attribute vec4 vert;
    varying highp vec2 uv;
    void main(void) {
      uv = vert.zw;
      gl_Position = vec4(vert.xy, 0, 1);
    }
  `, `
    varying highp vec2 uv;
    uniform sampler2D sampler;

    void main(void) {
      gl_FragColor = texture2D(sampler, uv);
    }
  `);
  this.color_program = rcn_gl_create_program(gl, `
    attribute vec4 vert;
    void main(void) {
      gl_Position = vec4(vert.xy, 0, 1);
    }
  `, `
    uniform highp vec4 color;

    void main(void) {
      gl_FragColor = color;
    }
  `);
  this.vbo = rcn_gl_create_array_buffer(gl, new Float32Array([
    -1, -1, 0, 1,
    -1, 3, 0, -1,
    3, -1, 2, 1,
  ]));
}

rcn_canvas.prototype.blit = function(x_start, y_start, width, height, pixels, palette) {
  if(!palette) {
    // Use current bin palette if unspecified
    palette = rcn_global_bin.rom.slice(rcn.mem_palette_offset, rcn.mem_palette_offset + rcn.mem_palette_size);
  }

  const x_end = x_start + width;
  const y_end = y_start + height;
  for(let x = x_start; x < x_end; x++) {
    for(let y = y_start; y < y_end; y++) {
      const pixel_index = y*(width>>1) + (x>>1); // Bitshift because pixels are 4bits
      let pixel = pixels[pixel_index];
      pixel = ((x & 1) == 0) ? (pixel & 0xf) : (pixel >> 4); // Deal with left or right pixel

      const cpixel_index = y*width + x;
      this.img[cpixel_index*3+0] = palette[pixel*4+0];
      this.img[cpixel_index*3+1] = palette[pixel*4+1];
      this.img[cpixel_index*3+2] = palette[pixel*4+2];
    }
  }

  const gl = this.gl;
  gl.bindTexture(gl.TEXTURE_2D, this.other);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, this.width, this.height, 0, gl.RGB, gl.UNSIGNED_BYTE, this.img);
}

rcn_canvas.prototype.draw_quad = function(x, y, width, height, r, g, b, a) {
  const gl = this.gl;

  gl.viewport(x, this.node.height - height - y, width, height);

  gl.useProgram(this.color_program);
  gl.uniform4f(gl.getUniformLocation(this.color_program, 'color'), r, g, b, a);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
  gl.vertexAttribPointer(gl.getAttribLocation(this.color_program, 'vert'), 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(gl.getAttribLocation(this.color_program, 'vert'));

  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

rcn_canvas.prototype.draw_outline = function(x, y, w, h, t, r, g, b, a) {
  this.draw_quad(x - t, y - t, t, h + t * 2, r, g, b, a);
  this.draw_quad(x + w, y - t, t, h + t * 2, r, g, b, a);
  this.draw_quad(x, y - t, w, t, r, g, b, a);
  this.draw_quad(x, y + h, w, t, r, g, b, a);
}

rcn_canvas.prototype.flush = function() {
  if(this.img) {
    const gl = this.gl;

    // Clear all to black
    gl.viewport(0, 0, this.node.width, this.node.height);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // I think this resets the aspect ratio of the canvas
    this.node.width = this.width;
    this.node.height = this.height;

    // Render at the client size
    const client_width = this.node.clientWidth;
    const client_height = this.node.clientHeight;
    this.node.width = client_width;
    this.node.height = client_height;

    const vp = this.compute_viewport();
    gl.viewport(vp.x, vp.y, vp.width, vp.height);

    // // Set and upload texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.other);

    gl.useProgram(this.img_program);
    gl.uniform4i(gl.getUniformLocation(this.img_program, 'sampler'), 300, 40, 60, 90);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.vertexAttribPointer(gl.getAttribLocation(this.img_program, 'vert'), 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(gl.getAttribLocation(this.img_program, 'vert'));

    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  for(let ops of this.onpostflush) {
    ops.apply(this);
  }
}

rcn_canvas.prototype.set_size = function(width, height) {
  if(this.width === width && this.height === height) {
    // Nothing to do
    return;
  }

  this.width = width;
  this.height = height;
  this.img = new Uint8Array(width * height * 3);
}

rcn_canvas.prototype.compute_viewport = function() {
  // We want to render pixel perfect, so we find a viewport size
  // that is a multiple of the texture size and fits the actual size
  const inner_width = this.node.width - this.padding_x;
  const inner_height = this.node.height - this.padding_y;
  const vp_mul = Math.max(this.min_vp_mul, Math.floor(Math.min(inner_width / this.width, inner_height / this.height)));
  const vp_width = vp_mul * this.width;
  const vp_height = vp_mul * this.height;
  const vp_x = (this.node.width - vp_width) / 2;
  const vp_y = (this.node.height - vp_height) / 2;
  return {
    mul: vp_mul,
    x: vp_x, y: vp_y,
    width: vp_width, height: vp_height,
  };
}


