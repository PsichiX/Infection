attribute vec2 aPosition;
attribute vec2 aTexCoord;

uniform vec2 uTiles;

varying vec2 vTexCoord;

void main() {
  vec2 uv = aTexCoord * uTiles;

  gl_Position = vec4(aPosition, 0.0, 1.0);
  vTexCoord = vec2(uv.x, 1.0 - uv.y);
}
