

//Populate the global variables xPlane2dSlices, yPlane2dSlices, and zPlane2dSlices
//Each slice is an array of 4 corner vertices in TL, TR, LL, LR order
function genAxisAlignedSlices2d( texture ) {
	xyPlus2dSlices = []
	yzPlus2dSlices = []
	xzPlus2dSlices = []
	xyMinus2dSlices = []
	yzMinus2dSlices = []
	xzMinus2dSlices = []
	
	/*
	var xMax = texture.width / 2,
		xMin = -xMax,
		yMax = texture.height / 2,
		yMin = -yMin, 
		zMax = texture.depth / 2,
		zMin = -zMax
	*/
	
	var xMin = 0, xMax = texture.width,
		yMin = 0, yMax = texture.height,
		zMin = 0, zMax = texture.depth
	
	var xStep = (xMax - xMin) / texture.width 
	var yStep = (yMax - yMin) / texture.height 
	var zStep = (zMax - zMin) / texture.depth 
	
	//XY plane 
	for( zSlice = 0; zSlice < texture.depth; zSlice++ ) {
		var zPos = zSlice * zStep + zMin
		
		slice = [
			[ xMin, yMax, zPos ],
			[ xMax, yMax, zPos ],
			[ xMin, yMin, zPos ],
			[ xMax, yMin, zPos ]
		]
		
		xyPlus2dSlices.push( slice )
	}
	
	//YZ plane 
	for( xSlice = 0; xSlice < texture.width; xSlice++ ) {
		var xPos = xSlice * xStep + xMin 
		
		slice = [
			[ xPos, yMax, zMin ],
			[ xPos, yMax, zMax ],
			[ xPos, yMin, zMin ],
			[ xPos, yMin, zMax ]
		]
		
		yzPlus2dSlices.push( slice )
	}
	
	//XZ plane 
	for( ySlice = 0; ySlice < texture.height; ySlice++ ) {
		var yPos = ySlice * yStep + yMin 
		
		slice = [
			[ xMin, yPos, zMin ],
			[ xMax, yPos, zMin ],
			[ xMin, yPos, zMax ],
			[ xMax, yPos, zMax ]
		]
		
		xzPlus2dSlices.push( slice )
	}
	
	xyMinus2dSlices = xyPlus2dSlices.reverse()
	yzMinus2dSlices = yzPlus2dSlices.reverse()
	xzMinus2dSlices = xzPlus2dSlices.reverse()
	
	/*
	for( slice = 0; slice < xyPlus2dSlices.length; slice++ ) {
		var s = xyPlus2dSlices[slice] 
		console.log( "[ " + s[0] + "; " + s[1] + "; " + s[2] + "; " + s[3] + " ]" )
	}
	*/
}

//globals that store axis aligned slices in drawing order
var xyPlus2dSlices = []
var yzPlus2dSlices = []
var xzPlus2dSlices = []
var xyMinus2dSlices = []
var yzMinus2dSlices = []
var xzMinus2dSlices = []
