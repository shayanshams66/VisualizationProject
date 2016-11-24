function renderScene() {
	forceCanvasSize(gl.canvas)
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT )
	gl.bindBuffer( gl.ARRAY_BUFFER, meshVerts )
	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, meshIndis )
	
	//gl.drawArrays( gl.TRIANGLES, 0, nVerts ); 
	gl.drawElements( gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 0 )
	
	/* Draw slices in reverse view order. 
	for( slice = 0; slice < nSlices; slice++ ) {
		//Take complement of slice if we're iterating in the other order
	}
	*/
}