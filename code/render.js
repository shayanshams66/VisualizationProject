
//plane normals 
var xyPlus = [ 0, 0, -1 ],
	xyMinus = [ 0, 0, 1],
	xzPlus = [ 0, 1, 0 ],
	xzMinus = [ 0, -1, 0 ],
	yzPlus = [ 1, 0, 0 ],
	yzMinus = [ -1, 0, 0 ];

var currentSliceSet = xyPlus2dSlices;
	
var bound3d = false;
var bound2d = false;
	
function renderScene() {
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT )
	
	if( texMode === 'tex_2D' ) {
		//currentSliceMesh = loadSliceMesh( xyPlus2dSlices );
		/*
		//calculate best plane set to use 
		var modelview = mat4.create();
		mat4.rotateZ( modelview, modelview, rotZ );
		mat4.rotateY( modelview, modelview, rotY );
		mat4.rotateX( modelview, modelview, rotX );
		
		var tf = []
		mat4.multiply( tf, modelview, [0, 0, 1, 0] )
		tf = [ tf[0], tf[1], tf[2] ]
		
		//Functional programming would make this much easier, but I'm not 
		//familiar enough with javascript
		var dots = [
			vec3.dot( tf, xyPlus ),
			vec3.dot( tf, xyMinus ),
			vec3.dot( tf, xzPlus ),
			vec3.dot( tf, xzMinus ),
			vec3.dot( tf, yzPlus ),
			vec3.dot( tf, yzMinus ;
		}
		else if( (vec3.dot( tf, yzPlus ) == minDot ) && (currentSliceSet != yzPlus2dSlices) ) {
			freeSliceMesh( currentSliceMesh );
			currentSliceMesh = loadSliceMesh( yzPlus2dSlices );
			currentSliceSet = yzPlus2dSlic)
		]
		
		var minDot = Math.min( dots[0], dots[1], dots[2], dots[3], dots[4], dots[5] )
		
		if( (vec3.dot( tf, xyPlus ) == minDot) && (currentSliceSet != xyPlus2dSlices) ) {
			freeSliceMesh( currentSliceMesh );
			currentSliceMesh = loadSliceMesh( xyPlus2dSlices );
			currentSliceSet = xyPlus2dSlices;
		}
		else if( (vec3.dot( tf, xyMinus ) == minDot ) && (currentSliceSet != xyMinus2dSlices) ) {
			freeSliceMesh( currentSliceMesh );
			currentSliceMesh = loadSliceMesh( xyMinus2dSlices );
			currentSliceSet = xyMinus2dSliceses;
		}
		else if( (vec3.dot( tf, yzMinus ) == minDot ) && (currentSliceSet != yzMinus2dSlices) ) {
			freeSliceMesh( currentSliceMesh );
			currentSliceMesh = loadSliceMesh( yzMinus2dSlices );
			currentSliceSet = yzMinus2dSlices;
		}
		else if( (vec3.dot( tf, xzPlus ) == minDot ) && (currentSliceSet != xzPlus2dSlices) ) {
			freeSliceMesh( currentSliceMesh );
			currentSliceMesh = loadSliceMesh( xzPlus2dSlices );
			currentSliceSet = xzPlus2dSlices;
		}
		else if( (vec3.dot( tf, xzMinus ) == minDot ) && (currentSliceSet != xzMinus2dSlices) ) {
			freeSliceMesh( currentSliceMesh );
			currentSliceMesh = loadSliceMesh( xzMinus2dSlices );
			currentSliceSet = xzMinus2dSlices;
		}
		*/
		
		if( !bound2d ) {
			currentSliceMesh = loadSliceMesh( xyPlus2dSlices );
			currentSliceSet = xyPlus2dSlices;
		}
		
		bound3d = false;
		bound2d = true;
		
		render2d();
		
		
		//freeSliceMesh( currentSliceMesh )
	} 
	else if( texMode === 'tex_3D' ) {
		bound2d = false;
		
		var viewSlices = genSlices(rotX, rotY, rotZ, N_SLICES, texData ); 
		
		
		for( var s = 0; s < viewSlices.length; s++ ) {
			for( var i = 0; i < 4; i++ ) {
				viewSlices[s][i][0] += texData.width / 2.0;
				viewSlices[s][i][1] += texData.height / 2.0;
				viewSlices[s][i][2] += texData.depth / 2.0;
			}
		}
		
		var sliceMesh = loadSliceMesh3d( viewSlices )
		
		//genMesh3dSlice( texData, viewSlices[0], sliceMesh[0][0], sliceMesh[0][1], sliceMesh[0][2] )
		if( !bound3d ) {
			gl.bindTexture( gl.TEXTURE_2D, tex3d );
			texBound3d = true;
		}
		
		render3d()
		
		freeSliceMesh( sliceMesh )
	}
}

function render3d() {
	var proj = mat4.create()
	
	mat4.ortho( proj, -100, 100, -100, 100, -100, 100 );
	
	
	//Draw slices in correct view order. 
	for( slice = 0; slice < N_SLICES; slice++ ) {
		var modelview = mat4.create();
		mat4.rotateZ( modelview, modelview, rotZ );
		mat4.rotateY( modelview, modelview, rotY );
		mat4.rotateX( modelview, modelview, rotX );
		mat4.translate( modelview, modelview, [ -texData.width / 2, -texData.height / 2, slice - N_SLICES / 2.0, 1 ] );
		
		var projModelview = mat4.create();
		mat4.multiply( projModelview, proj, modelview );
		
		gl.uniformMatrix4fv( projModelviewLoc3d, false, projModelview );
		
		var cPlanes = clippingPlanes;
		var posPlanes = [ cPlanes[0], cPlanes[2], cPlanes[4] ];
		var negPlanes = [ cPlanes[1], cPlanes[3], cPlanes[5] ];
		
		gl.uniform3fv( clipPosLoc3d, posPlanes )
		gl.uniform3fv( clipNegLoc3d, negPlanes )
		
		var sliceMesh = currentSliceMesh[slice];
		var vbuf = sliceMesh[0],
			ibuf = sliceMesh[1],
			tex = sliceMesh[2];
			
		gl.bindBuffer( gl.ARRAY_BUFFER, vbuf );
		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, ibuf );
		gl.bindTexture( gl.TEXTURE_2D, tex );
		
		gl.drawElements( gl.TRIANGLES, nIndis, gl.UNSIGNED_SHORT, 0 );
	}
}

function render2d() {
	var proj = mat4.create()
	
	mat4.ortho( proj, -100, 100, -100, 100, -100, 100 );
	
	
	//Draw slices in correct view order. 
	for( slice = 0; slice < N_SLICES; slice++ ) {
		var modelview = mat4.create();
		mat4.rotateZ( modelview, modelview, rotZ );
		mat4.rotateY( modelview, modelview, rotY );
		mat4.rotateX( modelview, modelview, rotX );
		
		//need to do this due to Z-clearing bug 
		if( currentSliceSet == xyPlus2dSlices ) {
			mat4.translate( modelview, modelview, [ -texData.width / 2, -texData.height / 2, slice - N_SLICES / 2.0, 1 ] );
		}
		
		var projModelview = mat4.create();
		mat4.multiply( projModelview, proj, modelview );
		
		gl.uniformMatrix4fv( projModelviewLoc2d, false, projModelview );
		
		var cPlanes = clippingPlanes;
		var posPlanes = [ cPlanes[0], cPlanes[2], cPlanes[4] ];
		var negPlanes = [ cPlanes[1], cPlanes[3], cPlanes[5] ];
		
		gl.uniform3fv( clipPosLoc2d, posPlanes )
		gl.uniform3fv( clipNegLoc2d, negPlanes )
		
		var sliceMesh = currentSliceMesh[slice];
		var vbuf = sliceMesh[0],
			ibuf = sliceMesh[1],
			tex = sliceMesh[2];
			
		gl.bindBuffer( gl.ARRAY_BUFFER, vbuf );
		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, ibuf );
		gl.bindTexture( gl.TEXTURE_2D, tex );
		
		gl.drawElements( gl.TRIANGLES, nIndis, gl.UNSIGNED_SHORT, 0 );
	}
}