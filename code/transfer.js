
//scalar is clamped to be between low and high 
//returns [r, g, b, a]
function fnTransfer(scalar, low, high) {
	//translate scalar so it starts at 0
	scalar -= low;
	
	//clamp scalar low 
	if( scalar < 0 )
		scalar = 0;
	
	//normalize scalar to 0 .. infinity range
	scalar /= high - low;
	
	//clamp scalar high 
	if( scalar > 1 )
		scalar = 1; 
	
	//scalar now in [0..1] 
	
	return [ 1.0 - scalar, 0, scalar, 1.0 ];
}
