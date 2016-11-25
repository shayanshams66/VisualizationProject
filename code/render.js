function renderScene() {
	forceCanvasSize(gl.canvas)
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT )
	//gl.bindBuffer( gl.ARRAY_BUFFER, meshVerts )
	//gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, meshIndis )
	
	
	//gl.drawArrays( gl.TRIANGLES, 0, nVerts ); 
	//gl.drawElements( gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 0 )
	
	//Draw slices in correct view order. 
	for( slice = 0; slice < N_SLICES; slice++ ) {
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
