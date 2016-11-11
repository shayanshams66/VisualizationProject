var gl; //gl context handle object 


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
	
	gl.enable( gl.DEPTH_TEST );
	gl.depthFunc( gl.LEQUAL );
	gl.clearColor( 0, 0, 0, 1 );
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
}



