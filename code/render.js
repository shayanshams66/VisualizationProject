function renderScene() {
	forceCanvasSize(gl.canvas)
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT )
	
	var offset = 0, count = 3
	
	gl.drawArrays( gl.TRIANGLES, offset, count ); 
}