

//Populate the global variables xPlane2dSlices, yPlane2dSlices, and zPlane2dSlices
//Each slice is an array of 4 corner vertices in TL, TR, LL, LR order
function genAxisAlignedSlices2d( texture ) {
	xyPlus2dSlices = new Array()
	yzPlus2dSlices = new Array()
	xzPlus2dSlices = new Array()
	xyMinus2dSlices = new Array()
	yzMinus2dSlices = new Array()
	xzMinus2dSlices = new Array()
	
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
		
		var slc = [
			[ xMin, yMax, zPos ],
			[ xMax, yMax, zPos ],
			[ xMin, yMin, zPos ],
			[ xMax, yMin, zPos ]
		]
		
		xyMinus2dSlices.push( slc )
	}
	
	//YZ plane 
	for( xSlice = 0; xSlice < texture.width; xSlice++ ) {
		var xPos = xSlice * xStep + xMin 
		
		var slc = [
			[ xPos, yMax, zMin ],
			[ xPos, yMax, zMax ],
			[ xPos, yMin, zMin ],
			[ xPos, yMin, zMax ]
		]
		
		yzMinus2dSlices.push( slc )
	}
	
	//XZ plane 
	for( ySlice = 0; ySlice < texture.height; ySlice++ ) {
		var yPos = ySlice * yStep + yMin 
		
		var slc = [
			[ xMin, yPos, zMin ],
			[ xMax, yPos, zMin ],
			[ xMin, yPos, zMax ],
			[ xMax, yPos, zMax ]
		]
		
		xzMinus2dSlices.push( slc )
	}
	
	xyPlus2dSlices = xyMinus2dSlices.slice(0);
	yzPlus2dSlices = yzMinus2dSlices.slice(0);
	xzPlus2dSlices = xzMinus2dSlices.slice(0)
	
	xyPlus2dSlices.reverse();
	yzPlus2dSlices.reverse();
	xzPlus2dSlices.reverse();
	
	/*
	for( slice = 0; slice < xyPlus2dSlices.length; slice++ ) {
		var s = xyPlus2dSlices[slice] 
		console.log( "[ " + s[0] + "; " + s[1] + "; " + s[2] + "; " + s[3] + " ]" )
	}*/
}


