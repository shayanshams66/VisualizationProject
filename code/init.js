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

	gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
	
	if(!gl) {
		alert('Error initializing OpenGL context!')
		
		return;
	}
	
	//Create programs and get attribute bindings
	var v_shader = createShader( gl, gl.VERTEX_SHADER, v_shader_src )
	var f_shader2d = createShader( gl, gl.FRAGMENT_SHADER, f_shader2d_src )
	program2d = createProgram( gl, v_shader, f_shader2d )
	
	positionLoc = gl.getAttribLocation( program2d, "a_position" )
	uvLoc = gl.getAttribLocation( program2d, "a_uv")
	projModelviewLoc = gl.getUniformLocation( program2d, "proj_modelview" )
	
	gl.enableVertexAttribArray(uvLoc)
	gl.enableVertexAttribArray(positionLoc)
	
	gl.useProgram( program2d )
	
	var vertElems = 8;
	var vertSize = vertElems * 4;
	
	genAxisAlignedSlices2d( texData )
	
	/*
	for( i = 0; i < N_SLICES; i++ ) {
		console.log( xyPlus2dSlices[i][0] )
	}*/
	
	//create 2D slice mesh data for each orientation
	var sliceMeshes = [
		sliceMeshXyPlus,
		sliceMeshXyMinus,
		//sliceMeshYzPlus,
		//sliceMeshYzMinus,
		//sliceMeshXzPlus,
		//sliceMeshXzMinus,
	]
	
	//logical slices 
	var sliceSets = [
		xyPlus2dSlices,
		xyMinus2dSlices,
		//yzPlus2dSlices,
		//yzMinus2dSlices,
		//xzPlus2dSlices,
		//xzMinus2dSlices,
	]
	
	//slice mesh = [ v buffer, i buffer, texture ]
	for( i = 0; i < sliceMeshes.length; i++ ) {
		var sliceMesh = sliceMeshes[i]
		var sliceSet = sliceSets[i]
		
		for( slice = 0; slice < N_SLICES; slice++ ) {
			var verts = gl.createBuffer()
			gl.bindBuffer( gl.ARRAY_BUFFER, verts )
			
			var indis = gl.createBuffer()
			gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, indis )
			
			gl.vertexAttribPointer( positionLoc, 3, gl.FLOAT, false, vertSize, 0 )
			gl.vertexAttribPointer( uvLoc, 2, gl.FLOAT, false, vertSize, 16 )
			
			var tex = genTex2d();
			
			sliceMesh.push( [ verts, indis, tex ] )
			
			nIndis = genMesh2dSlice( texData, sliceSet[slice], verts, indis, tex );
		}
	}
	
	/*
	meshVerts = gl.createBuffer()
	gl.bindBuffer( gl.ARRAY_BUFFER, meshVerts )
	
	meshIndis = gl.createBuffer()
	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, meshIndis )
	
	gl.vertexAttribPointer( positionLoc, 3, gl.FLOAT, false, vertSize, 0 )
	gl.vertexAttribPointer( uvLoc, 2, gl.FLOAT, false, vertSize, 16 )
	*/
	gl.enable( gl.BLEND )
	gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
	gl.clearColor( 0, 0, 0, 1 )
	
	forceCanvasSize(gl.canvas)
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
	
	setInterval( function() {
		rotY += 0.01
		update()
	}, 30 )
}

function update() {
	var scale = 0.5
	var scaleInv = 1.0 / scale 
	
	var proj = mat4.create()
	var modelview = mat4.create()
	//mat4.perspective( modelview, 1.0, 1.333, 0.1, 1000.0 )
	mat4.ortho( proj, -100, 100, -100, 100, -100, 100 )
	
	//throw new Error();
	
	//mat4.ortho( proj, -45, 45, -45, 45, -45, 45 )
	//mat4.rotateY( modelview, modelview, rotY )
	mat4.rotateY( modelview, modelview, rotY )
	mat4.translate( modelview, modelview, [ -texData.width / 2, -texData.height / 2, texData.depth / 2 ] )
	
	var projModelview = mat4.create()
	mat4.multiply( projModelview, proj, modelview )
	
	gl.uniformMatrix4fv( projModelviewLoc, false, projModelview )
	
	/*
	console.log( projModelview[0], projModelview[1], projModelview[2], projModelview[3] )
	console.log( projModelview[4], projModelview[5], projModelview[6], projModelview[7] )
	console.log( projModelview[8], projModelview[9], projModelview[10], projModelview[11] )
	console.log( projModelview[12], projModelview[13], projModelview[14] ,projModelview[15] )*/
	//throw new Error();
	
	//gl.enable( gl.DEPTH_TEST )
	//gl.depthFunc( gl.LEQUAL )
	
	//tex = genTex2d()
	
	//nIndis = genMesh2d( texData, xyPlus2dSlices, meshVerts, meshIndis, tex )
	//nIndis = genMesh2dSlice( texData, xyPlus2dSlices[0], meshVerts, meshIndis, tex );
	
	//debug 
	//nIndis = 64000
	
	//meshVerts = vBuf 
	//meshIndis = iBuf
	
	renderScene()
}
