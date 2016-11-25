function renderScene() {
	//forceCanvasSize(gl.canvas)
	//gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT )
	//gl.bindBuffer( gl.ARRAY_BUFFER, meshVerts )
	//gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, meshIndis )
	
	
	//gl.drawArrays( gl.TRIANGLES, 0, nVerts ); 
	//gl.drawElements( gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 0 )
	var proj = mat4.create()
	
	mat4.ortho( proj, -100, 100, -100, 100, -100, 100 )
	
		
	//Draw slices in correct view order. 
	for( slice = 0; slice < N_SLICES; slice++ ) {
		var modelview = mat4.create()
		mat4.rotateY( modelview, modelview, rotY )
		mat4.translate( modelview, modelview, [ -texData.width / 2, -texData.height / 2, slice - N_SLICES / 2.0, 1 ] )
		
		var projModelview = mat4.create()
		mat4.multiply( projModelview, proj, modelview )
		
		gl.uniformMatrix4fv( projModelviewLoc, false, projModelview )
		
		var sliceMesh = sliceMeshXyPlus[slice]
		var vbuf = sliceMesh[0],
			ibuf = sliceMesh[1],
			tex = sliceMesh[2]
			
		gl.bindBuffer( gl.ARRAY_BUFFER, vbuf )
		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, ibuf )
		gl.bindTexture( gl.TEXTURE_2D, tex );
		
		gl.drawElements( gl.TRIANGLES, nIndis, gl.UNSIGNED_SHORT, 0 )
	}
     
}
