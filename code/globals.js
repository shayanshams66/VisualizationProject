var gl; //gl context handle object 
var program2d; //shader program 
var program3d;

//shader attribute and uniform locations 
var positionLoc,
	uvLoc,
	modelviewLoc

var meshVerts; //vertex buffer 
var meshIndis; //index buffer
var vertsPerSlice = 4,
	nSlices = 0,
	nIndis;
	
var vBuf, iBuf; 

//Modifiable globals 
var texMode = 'tex_2D'; //valid values: 'tex_2D', 'tex_3D'
var clipMode = 'clip_none'; //valid values: 'clip_none', 'clip_plane', 'clip_box'
var modelview = mat4.create();

//Rotation 
var rotX = 0,
	rotY = 0,
	rotZ = 0;

//to be used later	
var zoom = 1; 

//each element of this array is the value of one clip plane 
//the order is as follows: X+, X-, Y+, Y-, Z+, Z-
var clippingPlanes = [ -1, 81, -1, 81, -1, 81 ]

