
var v_shader_src = 
`
attribute vec3 a_position;
attribute vec4 a_color;
mat4 modelview = mat4(1, 0, 0, 0, 0,1,0,0,0,0,1,0,0,0,0,1);

varying vec4 int_color;

void main() {
  gl_Position = modelview * vec4( a_position, 1.0 );
  int_color = a_color;
}`

var f_shader_src = 
`
precision mediump float;

varying vec4 int_color;

 
void main() {
  gl_FragColor = int_color; 
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