
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
	return vecScale( diff, 1.0 / steps )
}

//sample texture with trilinear filtering
function sample( texture, x, y, z ) {
	/*
	if( x < 0 || x >= texture.width ) {
		return 0;
	}
	
	if( y < 0 || y >= texture.height ) {
		return 0;
	}
	
	if( z < 0 || z >= texture.depth ) {
		return 0;
	}*/
	
	if ( x < 0 ) { x = 0 } 
	if ( x >= texture.width ) { x = texture.width - 1 }
	if ( y < 0 ) { y = 0 } 
	if ( y >= texture.height ) { y = texture.height - 1 }
	if ( z < 0 ) { z = 0 } 
	if ( z >= texture.depth ) { z = texture.depth - 1 }
	
	
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

//generate a 2d texture. returns a texture id 
function genTex2d( texture ) {
	/*
	var buf = []
	for( i = 0; i < TEX_DIM * TEX_DIM * 4; i += 4 ) {
		buf[i] = 255;
		buf[i + 3] = 255;
	}
	*/
	var tex = gl.createTexture();
	
	gl.bindTexture( gl.TEXTURE_2D, tex );
	//gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, TEX_DIM, TEX_DIM, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array( buf ) )
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST );
	
	
	return tex;
}

var w = 0

function genMesh2dSlice( texture, slice, vBuf, iBuf, tex ) {
	var nHorizChunks = vecDist( slice[1], slice[0] )
	var nVertChunks = vecDist( slice[2], slice[0] )
	
	var steps = 80
	
	var horizStep = vecStep( slice[1], slice[0], steps )
	var vertStep = vecStep( slice[2], slice[0], steps )
	
	//format: x, y, z, 0, u, v, 0, 0 
	var vertData = []
	var indis = []
	
	var texData = []
	var point = slice[0]
	
	for( row = 0; row < nVertChunks; row++ ) {
		for( col = 0; col < nHorizChunks; col++ ) {
			var samp = sample( texture, point[0], point[1], point[2] )
			var color = fnTransfer( samp, texture.min, texture.max )
			texData.push( color[0], color[1], color[2], color[3] )
			vertData.push( point[0], point[1], point[2], 0, 
				col / TEX_DIM, row / TEX_DIM, 0, 0 )
				
			point = vecAdd( point, horizStep )
		}
		
		//pad texData 
		for( col = nHorizChunks; col < TEX_DIM; col++ ) {
			texData.push( 0, 0, 0, 0 )
		}
		
		point = vecAdd( point, vecScale( horizStep, -nHorizChunks ) )
		point = vecAdd( point, vertStep )
	}
	
	//pad texData 
	for( row = nVertChunks; row < TEX_DIM; row++ ) {
		for( col = 0; col < TEX_DIM; col++ ) {
			texData.push( 0, 0, 0, 0 );
		}
	}
	
	gl.bindTexture( gl.TEXTURE_2D, tex );
	
	gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, TEX_DIM, TEX_DIM, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array( texData ) )
	
	gl.generateMipmap( gl.TEXTURE_2D );
	
	/*
	for( i = 6300; i < 6400; i++ ) {
		console.log( vertData[i * 8], vertData[i * 8 + 1], vertData[i * 8 + 2] )
	}
	*/
	
	var indiStart = 0
	
	//generate indices
	for( row = 0; row < nVertChunks - 1; row++ ) {
		for( col = 0; col < nHorizChunks - 1; col++ ) {
			var indiStart = row * steps + col 
			indis.push( indiStart, indiStart + 1, indiStart + steps, 
				indiStart + 1, indiStart + steps, indiStart + steps + 1 )
			//indiStart += 1
			
			//console.log( indiStart, indiStart + 1, indiStart + steps, 
			//	indiStart + 1, indiStart + steps, indiStart + steps + 1 )
		}
		//indiStart += 1
	}
	
	gl.bindBuffer( gl.ARRAY_BUFFER, vBuf )
	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, iBuf )

	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(vertData), gl.STATIC_DRAW )
	gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, 
		new Uint16Array(indis), gl.STATIC_DRAW )
		
	return indis.length
}

function genMesh2d( texture, slices, vBuf, iBuf, tex ) {
	
}




//TODO
function loadColorMap3D( texture ) {
	
}