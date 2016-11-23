function renderScene() {
	forceCanvasSize(gl.canvas)
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT )
	gl.bindBuffer(gl.ARRAY_BUFFER, meshVerts)
	
	gl.drawArrays( gl.TRIANGLES, 0, nVerts ); 
}