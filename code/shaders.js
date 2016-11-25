
var v_shader_src = 
`
attribute vec3 a_position;
attribute vec2 a_uv;
/*mat4 modelview = mat4(
	0.01, 0,    0,    0, 
	0,    0.01, 0,    0, 
	0,    0,    0.01, 0,
	0,    0,    0,    1);*/
uniform mat4 proj_modelview;

varying vec2 i_uv;

void main() {
  gl_Position = proj_modelview * vec4( a_position, 1.0 );
  i_uv = a_uv;
}`

var f_shader2d_src = 
`
precision mediump float;

varying vec2 i_uv;
uniform sampler2D samp;

 
void main() {
  //gl_FragColor = vec4( 1.0, 1.0, 1.0, 0.5); 
  gl_FragColor = texture2D( samp, i_uv.xy );
}`


/*
from: https://www.khronos.org/webgl/wiki/WebGL_and_OpenGL_Differences#No_3D_Texture_support
vec4 sampleAs3DTexture(sampler2D tex, vec3 texCoord, float size) {
   float sliceSize = 1.0 / size;                         // space of 1 slice
   float slicePixelSize = sliceSize / size;              // space of 1 pixel
   float sliceInnerSize = slicePixelSize * (size - 1.0); // space of size pixels
   float zSlice0 = min(floor(texCoord.z * size), size - 1.0);
   float zSlice1 = min(zSlice0 + 1.0, size - 1.0);
   float xOffset = slicePixelSize * 0.5 + texCoord.x * sliceInnerSize;
   float s0 = xOffset + (zSlice0 * sliceSize);
   float s1 = xOffset + (zSlice1 * sliceSize);
   vec4 slice0Color = texture2D(tex, vec2(s0, texCoord.y));
   vec4 slice1Color = texture2D(tex, vec2(s1, texCoord.y));
   float zOffset = mod(texCoord.z * size, 1.0);
   return mix(slice0Color, slice1Color, zOffset);
}
*/


function createShader(gl, type, source) {
	var shader = gl.createShader(type)
  
	gl.shaderSource(shader, source)
	gl.compileShader(shader)

	var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
	
	if (success) {
		return shader
	}
	
	var err = gl.getShaderInfoLog(shader)
	
	console.log(err)
	gl.deleteShader(shader)
	
	return err;
}

function createProgram(gl, v_shader, f_shader) {
	var program = gl.createProgram()
	
	gl.attachShader(program, v_shader)
	gl.attachShader(program, f_shader)
	gl.linkProgram(program)
	
	var success = gl.getProgramParameter(program, gl.LINK_STATUS)
	if (success) {
		return program
	}

	var err = gl.getProgramInfoLog(program)
	
	console.log(err)
	gl.deleteProgram(program)
	
	return err 
}