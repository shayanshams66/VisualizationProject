var gl; //gl context handle object 
var program; //shader program 

//Force the canvas to be the right size. Adapted from: http://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html
function forceCanvasSize(canvas) {
	var displayWidth  = canvas.clientWidth,
		displayHeight = canvas.clientHeight
 
  // Check if the canvas is not the same size.
	if (canvas.width  != displayWidth ||
		canvas.height != displayHeight) {
			
		canvas.width  = displayWidth;
		canvas.height = displayHeight;
	}
}

function init() {
	var canvas = document.getElementById("glcanvas")
	
	/*
	var context = canvas.getContext('2d')
	var devicePixelRatio = window.devicePixelRatio || 1,
        backingStoreRatio = context.webkitBackingStorePixelRatio ||
                            context.mozBackingStorePixelRatio ||
                            context.msBackingStorePixelRatio ||
                            context.oBackingStorePixelRatio ||
                            context.backingStorePixelRatio || 1,
		ratio = devicePixelRatio / backingStoreRatio;

	var old_w = canvas.width,
		old_h = canvas.height
	
	canvas.width = old_w * ratio 
	canvas.height = old_h * ratio 
	canvas.style.width = old_w + 'px'
	canvas.style.height = old_h + 'px'
	
	context.scale(ratio, ratio);
	*/
	
	gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
	
	if(!gl) {
		/*context.font= "16px Arial";
		context.fillStyle = 'red';
		context.fillText('Error initializing OpenGL context!', 25, 25)*/
		alert('Error initializing OpenGL context!')
		
		return;
	}
	
	var v_shader = createShader( gl, gl.VERTEX_SHADER, v_shader_src )
	var f_shader = createShader( gl, gl.FRAGMENT_SHADER, f_shader_src )
	var program = createProgram( gl, v_shader, f_shader )
	
	var positionLoc = gl.getAttribLocation(program, "a_position")
	var positionBuf = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuf)
	
	//position attribute buf parameters
	var size = 3,
		type = gl.FLOAT,
		normalize = false,
		stride = 0,
		offset = 0
	
	gl.vertexAttribPointer( positionBuf, size, type, normalize, stride, offset)

	// three 2d points
	var positions = [
	  -0.5, -0.5, 0,
	  0.5, -0.5, 0,
	  0, 0.5, 0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
		
	//gl.enable( gl.DEPTH_TEST )
	//gl.depthFunc( gl.LEQUAL )
	gl.clearColor( 0, 0, 1, 1 )
	
	gl.useProgram(program)
	gl.enableVertexAttribArray(positionLoc)
	
	renderScene()
}

function renderScene() {
	forceCanvasSize(gl.canvas)
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT )
	
	var offset = 0, count = 3
	
	gl.drawArrays( gl.TRIANGLES, offset, count ); 
}

