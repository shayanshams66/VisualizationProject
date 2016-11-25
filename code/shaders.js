
var v_shader_src = 
`
attribute vec3 a_position;
attribute vec2 a_uv;
/*mat4 modelview = mat4(
	0.01, 0,    0,    0, 
	0,    0.01, 0,    0, 
	0,    0,    0.01, 0,
	0,    0,    0,    1);*/
uniform mat4 modelview;

varying vec2 i_uv;

void main() {
  gl_Position = modelview * vec4( a_position, 1.0 );
  i_uv = a_uv;
}`

var f_shader2d_src = 
`
precision mediump float;

varying vec2 i_uv;

 
void main() {
  gl_FragColor = vec4( 1.0, 1.0, 1.0, 0.5); 
}`

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