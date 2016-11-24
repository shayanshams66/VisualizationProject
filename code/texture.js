
function vecAdd( v1, v2 ) {
	return [ v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2] ]
}

function vecDiff( v1, v2 ) {
	return [ v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2] ]
}

function vecDist( v1, v2 ) {
	var v = vecDiff( v2, v1 )
	return Math.sqrt( v[0]*v[0] + v[1]*v[1] + v[2]*v[2] )
}

function vecScale( v, scale ) {
	return [ v[0] * scale, v[1] * scale, v[2] * scale ]
}

//return a vector pointing one notch forward 
function vecStep( v1, v2, steps ) {
	var diff = vecDiff( v1, v2 )
	return vecScale( v, 1.0 / steps )
}

//sample texture with trilinear filtering
function sample( texture, x, y, z ) {
	if( x < 0 || x >= texture.width ) {
		return 0;
	}
	
	if( y < 0 || y >= texture.height ) {
		return 0;
	}
	
	if( z < 0 || z >= texture.depth ) {
		return 0;
	}
	
	/*
	var points = [
		[ Math.floor(x), Math.floor(y), Math.floor(z) ],
		[ Math.ceil(x),  Math.floor(y), Math.floor(z) ],
		[ Math.floor(x), Math.ceil(y),  Math.floor(z) ],
		[ Math.floor(x), Math.floor(y), Math.ceil(z) ],
		[ Math.ceil(x),  Math.floor(y), Math.ceil(z) ],
		[ Math.floor(x), Math.ceil(y),  Math.ceil(z) ],
		[ Math.ceil(x),  Math.ceil(y),  Math.floor(z) ],
		[ Math.ceil(x),  Math.ceil(y),  Math.ceil(z) ],
	]
	*/
	
	var xLo = Math.floor(x),
		xHi = Math.ceil(x),
		yLo = Math.floor(y),
		yHi = Math.ceil(y),
		zLo = Math.floor(z),
		zHi = Math.ceil(z)
	
	var samples = [
		texture.samples[ zLo ][ yLo ][ xLo ],
		texture.samples[ zLo ][ yLo ][ zHi ], 
		texture.samples[ zLo ][ yHi ][ xLo ], 
		texture.samples[ zHi ][ yLo ][ xLo ],
		texture.samples[ zHi ][ yLo ][ zHi ],
		texture.samples[ zHi ][ yHi ][ xLo ],
		texture.samples[ zLo ][ yHi ][ zHi ],
		texture.samples[ zHi ][ yHi ][ zHi ],
	]
	
	var xI = x - xLo,
		yI = y - yLo,
		zI = z - zLo,
		xC = 1.0 - xI,
		yC = 1.0 - yI,
		zC = 1.0 - zI
		
	return (
		samples[0] * xC * yC * zC +
		samples[1] * xI * yC * zC +
		samples[2] * xC * yI * zC +
		samples[3] * xC * yC * zI +
		samples[4] * xI * yC * zI +
		samples[5] * xC * yI * zI +
		samples[6] * xI * yI * zC +
		samples[7] * xI * yI * zI )
}

//Creates a set of 2D textures and the mesh
//Sets the "id2d" parameter of the texture object to an array of texture ids
//	- one for each slice. 
//Writes to vBuf and iBuf 
function genMesh2D( texture, slices, vBuf, iBuf ) {
	var nHorizChunks = vecDist( slices[0][1], slices[0][0] )
	var nVertChunks = vecDist( slices[0][2], slices[0][0] )
	
	var horizStep = vecStep( slices[0][1], slices[0][0] )
	var vertStep = vecStep( slices[0][2], slices[0][0] )
	
	//format: x, y, z, 0, u, v, 0, 0 
	var vertData = []
	var indis = []
	
	//For each slice, generate mesh data with vertices at each sample point
	for( i = 0; i < slices.length; i++ ) {
		
		//texture data in RGBA 8-bit per channel format 
		var texData = []
		var point = slices[i][0]
		
		//generate vertices, tex coords, and tex colors 
		for( row = 0; row < nVertChunks; row++ ) {
			for( col = 0; col < nHorizChunks; col++ ) {
				var samp = sample( texture, point[0], point[1], point[2] )
				var color = fnTransfer( samp, texture.min, texture.max )
				texData.push( color[0], color[1], color[2], color[3] )
				vertData.push( point[0], point[1], point[2], 0, 
					col / nHorizChunks, row / nVertChunks, 0, 0 )
					
				point = vecAdd( point, horizStep )
			}
			
			point = vecAdd( point, vertStep )
		}
		
		//generate indices
		for( row = 0; row < nVertChunks - 1; row++ ) {
			var indiStart = 0
			
			for( col = 0; col < nHorizChunks - 1; col++ ) {
				indis.push( indiStart, indiStart + 1, indiStart + 2, 
					indiStart + 1, indiStart + 2, indiStart + 3 )
				indiStart += 4
			}
		}
	}
	
	gl.bindBuffer( gl.ARRAY_BUFFER, vBuf )
	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, iBuf )
	
	gl.bufferData( gl.ARRAY_BUFFER, new Uint8Array(vertData), gl.STATIC_DRAW )
	gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, 
		new Uint16Array(indis), gl.STATIC_DRAW )
}


//TODO
function loadColorMap3D( texture ) {
	
}