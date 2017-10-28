
const image = new Image();
image.src = 'image.jpg';
image.onload = function () {
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);

  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  const gl = canvas.getContext('webgl');

  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  gl.clearColor(1.0, 0.8, 0.1, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const vertShaderSource = `
    attribute vec2 position;
    varying vec2 texCoords;
    void main() {
      texCoords = (position + 1.0) / 2.0;
      texCoords.y = 1.0 - texCoords.y;
      gl_Position = vec4(position, 0, 1.0);
    }
  `;

  const fragShaderSource = `
    precision highp float;
    varying vec2 texCoords;
    uniform sampler2D textureSampler;
    void main() {
      float warmth = -0.2;
      float brightness = 0.2;
      vec4 color = texture2D(textureSampler, texCoords);
      //color.r += warmth;
      //color.b -= warmth;
      //color.rgb += brightness;
      gl_FragColor = color;
    }
  `;

  const vertShader = gl.createShader(gl.VERTEX_SHADER);
  const fragShader = gl.createShader(gl.FRAGMENT_SHADER);

  gl.shaderSource(vertShader, vertShaderSource);
  gl.shaderSource(fragShader, fragShaderSource);

  gl.compileShader(vertShader);
  gl.compileShader(fragShader);

  const program = gl.createProgram();
  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);

  gl.linkProgram(program);

  gl.useProgram(program);

  const vertices = new Float32Array([
    -1, -1,
    -1, 1,
    1, 1,

    -1, -1,
    1, 1,
    1, -1,
  ]);

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const positionLocation = gl.getAttribLocation(program, 'position');

  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionLocation);

  const texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
};
