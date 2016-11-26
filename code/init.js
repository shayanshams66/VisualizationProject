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

var vertElems = 8;
var vertSize = vertElems * 4;

//return sliceMesh from sliceSet
function loadSliceMesh( slices ) {
	var ret = new Array()
	
	for( s = 0; s < N_SLICES; s++ ) {
		var verts = gl.createBuffer()
		gl.bindBuffer( gl.ARRAY_BUFFER, verts )
		
		var indis = gl.createBuffer()
		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, indis )
		
		var tex = genTex2d();
		
		gl.vertexAttribPointer( positionLoc2d, 3, gl.FLOAT, false, vertSize, 0 )
		gl.vertexAttribPointer( uvLoc2d, 2, gl.FLOAT, false, vertSize, 16 )
		nIndis = genMesh2dSlice( texData, slices[s], verts, indis, tex );
		
		ret[s] = [verts, indis, tex];
		//sliceMesh.push( [ verts, indis, tex ] )
	}
	
	return ret
}

function loadSliceMesh3d( slices ) {
	var ret = new Array()
	
	for( s = 0; s < N_SLICES; s++ ) {
		var verts = gl.createBuffer()
		gl.bindBuffer( gl.ARRAY_BUFFER, verts )
		
		var indis = gl.createBuffer()
		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, indis )
		
		gl.vertexAttribPointer( positionLoc3d, 3, gl.FLOAT, false, vertSize, 0 )
		gl.vertexAttribPointer( uvLoc3d, 3, gl.FLOAT, false, vertSize, 16 )
		nIndis = genMesh3dSlice( texData, slices[s], verts, indis );
		
		ret[s] = [verts, indis, tex];
		//sliceMesh.push( [ verts, indis, tex ] )
	}
	
	return ret
}

function freeSliceMesh( sm ) {
	for( var i = 0; i < sm.length; i++ ) {
		var m = sm[i]
		gl.deleteBuffer( m[0] )
		gl.deleteBuffer( m[1] )
		gl.deleteTexture( m[2] )
	}
}


function init() {
	var canvas = document.getElementById("glcanvas")

	gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
	
	if(!gl) {
		alert('Error initializing OpenGL context!')
		
		return;
	}
	
	tex3d = genAndPopulateTex3d( texData );
	
	//load program 2d
	var v_shader2d = createShader( gl, gl.VERTEX_SHADER, v_shader_src );
	var f_shader2d = createShader( gl, gl.FRAGMENT_SHADER, f_shader2d_src );
	program2d = createProgram( gl, v_shader2d, f_shader2d );
	
	//load program 3d
	var v_shader3d = createShader( gl, gl.VERTEX_SHADER, v_shader3d_src );
	var f_shader3d = createShader( gl, gl.FRAGMENT_SHADER, f_shader3d_src );
	program3d = createProgram( gl, v_shader3d, f_shader3d );
	
	//load 2d attrib locations
	positionLoc2d = gl.getAttribLocation( program2d, "a_position" )
	uvLoc2d = gl.getAttribLocation( program2d, "a_uv")
	projModelviewLoc2d = gl.getUniformLocation( program2d, "proj_modelview" )
	clipPosLoc2d = gl.getUniformLocation( program2d, "posClip" )
	clipNegLoc2d = gl.getUniformLocation( program2d, "negClip" )
	
	gl.enableVertexAttribArray(uvLoc2d)
	gl.enableVertexAttribArray(positionLoc2d)
	
	//load 3d attrib locations
	positionLoc3d = gl.getAttribLocation( program3d, "a_position" )
	uvLoc3d = gl.getAttribLocation( program3d, "a_uv")
	projModelviewLoc3d = gl.getUniformLocation( program3d, "proj_modelview" )
	clipPosLoc3d = gl.getUniformLocation( program3d, "posClip" )
	clipNegLoc3d = gl.getUniformLocation( program3d, "negClip" )
	
	gl.enableVertexAttribArray(uvLoc3d)
	gl.enableVertexAttribArray(positionLoc3d)
	
	genAxisAlignedSlices2d( texData )
	
	//currentSliceMesh = loadSliceMesh( xyPlus2dSlices );
	//currentSliceSet = xyPlus2dSlices;
	
	gl.enable( gl.BLEND )
	gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
	gl.clearColor( 0, 0, 0, 1 )
	
	forceCanvasSize(gl.canvas)
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

	setInterval( function() {
		rotY += 0.02
		//rotZ += 0.009
		//rotX += 0.005
		update()
	}, 30 )
}

function update() {
	if( texMode === 'tex_2D' ) {
		gl.useProgram( program2d );
	}
	else if( texMode === 'tex_3D' ) {
		gl.useProgram( program3d );
	}
	else {
		console.log( "bad texture mode" );
	}
	/*
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
	
	if( texMode === 'tex_2D' ) {
		gl.uniformMatrix4fv( projModelviewLoc2d, false, projModelview )
	}
	else if( texMode === 'tex_3D' ) {
		gl.uniformMatrix4fv( projModelviewLoc3d, false, projModelview )
	}
	*/
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
