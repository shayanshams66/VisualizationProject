var gl; //gl context handle object 
var program2d; //shader program 
var program3d;

//shader attribute and uniform locations 
var positionLoc2d,
	uvLoc2d,
	projModelviewLoc2d,
	positionLoc3d,
	uvwLoc3d,
	projModelviewLoc3d;

var tex3d; //single 3d texture
	
var meshVerts; //vertex buffer 
var meshIndis; //index buffer
var vertsPerSlice = 4,
	nSlices = 0,
	nIndis;
	
var vBuf, iBuf, tex; 

//each slice mesh is an array of [ vBuf, iBuf, tex ]
var sliceMeshXyPlus = new Array(),
	sliceMeshXyMinus = new Array(),
	sliceMeshYzPlus = new Array(),
	sliceMeshYzMinus = new Array(),
	sliceMeshXzPlus = new Array(),
	sliceMeshXzMinus = new Array()

//globals that store axis aligned slices in drawing order
var xyPlus2dSlices = new Array(),
	yzPlus2dSlices = new Array(),
	xzPlus2dSlices = new Array(),
	xyMinus2dSlices = new Array(),
	yzMinus2dSlices = new Array(),
	xzMinus2dSlices = new Array()

var currentSliceMesh = new Array()
	
var N_SLICES = 80
	
//Modifiable globals 
var texMode = 'tex_2D'; //valid values: 'tex_2D', 'tex_3D'
//var clipMode = 'clip_none'; //valid values: 'clip_none', 'clip_plane', 'clip_box'
var modelview = mat4.create();
var projection = mat4.create();

//Rotation 
var rotX = 0,
	rotY = 0,
	rotZ = 0;
var autoRotate = true;

//to be used later	
var zoom = 1; 

//each element of this array is the value of one clip plane 
//the order is as follows: X+, X-, Y+, Y-, Z+, Z-
var clipPosLoc2d, clipNegLoc2d;
var clipPosLoc3d, clipNegLoc3d;
var clippingPlanes = [ 81, -1, 81, -1, 81, -1 ]

var TEX_DIM = 128; 
var TEX_DIM3D_X = 640;
var TEX_DIM3D_Y = 80;