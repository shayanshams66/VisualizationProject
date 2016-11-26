// The return value should be an array. Each element of the array should be a slice. Each slice is an array of 4 vertices, Each vertex is an array of 3 coordinates. The vertices represent the vertices on each corner of the slice. I'll write a function to tesselate these slices into a vertex buffer. The distance between each slice should be based on the distance between the object depthwise using the dimensions in "texture". Test your code by drawing the slices in the test code that I have up now. Go ahead and download it before I overwrite it. 

function pointTransform(x, y, z, Crotx, Croty, Crotz, Srotx, Sroty, Srotz)
{
    // I suppose such a rotating order: rotX -> rotY -> rotZ, so the rotation
    // matrix is applied as rotzMat.rotyMat.rotxMat.{x, y, z}
    var xprime = Croty*Crotz*x+(Crotz*Srotx*Sroty-Crotx*Srotz)*y+( Crotx*Crotz*Sroty+Srotx*Srotz)*z;
    var yprime = Croty*Srotz*x+(Crotx*Crotz+Srotx*Sroty*Srotz)*y+(-Crotz*Srotx+Crotx*Sroty*Srotz)*z;
    var zprime =-Sroty*x+Croty*Srotx*y+Crotx*Croty*z;
    return [xprime, yprime, zprime];
}


function genSlices(rotX, rotY, rotZ, nSlices, texture ) 
{
    // initallly viewing towards -z direction, with slice covering the front end
    // of the data, so 
    // key idea, no matter how you rotate the view (the camera location), you
    // always look towards the origin
    // then the central slice always cross the origin, other slices can be
    // generated from it by shifting in the camera-origin direction, there
    // should be both postive and negative shifts
    var Crotx = Math.cos(rotX); var Croty = Math.cos(rotY); var Crotz = Math.cos(rotZ);
    var Srotx = Math.sin(rotX); var Sroty = Math.sin(rotY); var Srotz = Math.sin(rotZ);
    // console.log(rotX, rotY, rotZ);
    //console.log("trig values");
    //console.log(Crotx, Croty, Crotz);
    //console.log(Srotx, Sroty, Srotz);
    // console.log(texture);

    // following the idea, we first get a slice 0 (origin crossing), then generate
    // from it other slices
    var pointll=pointTransform(-texture.width/2, -texture.height/2, 0.0, Crotx, Croty, Crotz, Srotx, Sroty, Srotz);
    var pointlr=pointTransform( texture.width/2, -texture.height/2, 0.0, Crotx, Croty, Crotz, Srotx, Sroty, Srotz);
    var pointur=pointTransform( texture.width/2,  texture.height/2, 0.0, Crotx, Croty, Crotz, Srotx, Sroty, Srotz);
    var pointul=pointTransform(-texture.width/2,  texture.height/2, 0.0, Crotx, Croty, Crotz, Srotx, Sroty, Srotz);
    slice0 = [pointll, pointlr, pointur, pointul];

    // get shfit direction, camera -> origin direction
    shift_dir  =[ Crotx*Crotz*Sroty + Srotx*Srotz,-Crotz*Srotx + Crotx*Sroty*Srotz,  Crotx*Croty];
    //console.log("shift direction");
    //console.log(shift_dir);
    shift_gap = 0.1; // XXX
    shift_num = nSlices/2; // number of postive slice OR negative slice

    var sliceArray = [];
	var sliceArrayPos = []
	var sliceArrayNeg = []
    for(i = 0; i < shift_num; i++)
    {
        var v0p = [slice0[0][0] + i*shift_gap*shift_dir[0],  //x 
                   slice0[0][1] + i*shift_gap*shift_dir[1],  //y
                   slice0[0][2] + i*shift_gap*shift_dir[2]]; //z
        var v1p = [slice0[1][0] + i*shift_gap*shift_dir[0],  //x 
                   slice0[1][1] + i*shift_gap*shift_dir[1],  //y
                   slice0[1][2] + i*shift_gap*shift_dir[2]]; //z
        var v2p = [slice0[2][0] + i*shift_gap*shift_dir[0],  //x 
                   slice0[2][1] + i*shift_gap*shift_dir[1],  //y
                   slice0[2][2] + i*shift_gap*shift_dir[2]]; //z
        var v3p = [slice0[3][0] + i*shift_gap*shift_dir[0],  //x 
                   slice0[3][1] + i*shift_gap*shift_dir[1],  //y
                   slice0[3][2] + i*shift_gap*shift_dir[2]]; //z		   
        slice_pos = [v0p, v1p, v2p, v3p]; // postive shift of slice

        var v0n = [slice0[0][0] - i*shift_gap*shift_dir[0],  //x 
                   slice0[0][1] - i*shift_gap*shift_dir[1],  //y
                   slice0[0][2] - i*shift_gap*shift_dir[2]]; //z
        var v1n = [slice0[1][0] - i*shift_gap*shift_dir[0],  //x 
                   slice0[1][1] - i*shift_gap*shift_dir[1],  //y
                   slice0[1][2] - i*shift_gap*shift_dir[2]]; //z
        var v2n = [slice0[2][0] - i*shift_gap*shift_dir[0],  //x 
                   slice0[2][1] - i*shift_gap*shift_dir[1],  //y
                   slice0[2][2] - i*shift_gap*shift_dir[2]]; //z
        var v3n = [slice0[3][0] - i*shift_gap*shift_dir[0],  //x 
                   slice0[3][1] - i*shift_gap*shift_dir[1],  //y
                   slice0[3][2] - i*shift_gap*shift_dir[2]]; //z
        slice_neg = [v0n, v1n, v2n, v3n]; // postive shift of slice

        sliceArray.push(slice_pos);
        sliceArray.push(slice_neg);
    }
    return sliceArray;
}

/*
function renderScene() {
	forceCanvasSize(gl.canvas)
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT )
	
	gl.bindBuffer(gl.ARRAY_BUFFER, meshVerts)
	gl.drawArrays( gl.TRIANGLES, 0, nVerts ); 

    czTest();
}

var texture = {
    width : 80,
    height : 80
}

function czTest() {
    rotX = 0.0;
    // rotY = 0.0;
    rotY = Math.PI/3;
    rotZ = 0.0;
    console.log(genSlices(rotX, rotY, rotZ, 3, texture));
    // for(x0 = -1; x0 < 1; x0+=0.3)
    // {
    //     gl.bindBuffer(gl.ARRAY_BUFFER, meshVerts);
    //     gl.bufferData(
    //         gl.ARRAY_BUFFER,
    //         new Float32Array([
    //                -1,   x0, 0, 0, 1, 1, 1, 1,
    //                 1, -0.5, 0, 0, 1, 1, 1, 1,
    //                 1,  0.5, 0, 0, 1, 1, 1, 1
    //              ]),
    //         gl.STATIC_DRAW);
    //     gl.drawArrays( gl.TRIANGLES, 0, nVerts ); 
    // }
}
*/