var gl; //gl context handle object 
var program; //shader program 


//Modifiable globals 
var texMode = 'tex_2D'; //valid values: 'tex_2D', 'tex_3D'
var clipMode = 'clip_none'; //valid values: 'clip_none', 'clip_plane', 'clip_box'
var modelview = mat4.create();

//Rotation 
var rotX = 0,
	rotY = 0,
	rotZ = 0;
	
