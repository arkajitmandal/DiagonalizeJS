// Rotation Matrix
var Rot = function(theta){
    var Mat = [[Math.cos(theta),Math.sin(theta)],[-Math.sin(theta),Math.cos(theta)]];
    return Mat
}
// Givens Matrix
var Rij = function(k,l,theta,N){
    var Mat = Array(N) 
    for (var i = 0; i<N;i++){
        Mat[i] = Array(N) 
    }
    // Identity Matrix
    for (var i = 0; i<N;i++){
        for (var j = 0; j<N;j++){
            Mat[i][j] = (i===j)*1.0;
        }
    }
    Rij = Rot(theta);

    // Put Rotation part in i, j
    Mat[k][k] = Rij[0][0] // 11
    Mat[l][l] = Rij[1][1] // 22
    Mat[k][l] = Rij[0][1] // 12
    Mat[l][k] = Rij[1][0] // 21
    return Mat
}

// get angle
var getTheta = function(aii,ajj,aij){
    var  th = 0.0 
    var denom = (ajj - aii);
    if (abs(denom) <= 1E-10){
        th = (aij/abs(aij)) * Math.PI/4.0
    }
    else {
        th = 0.5 * Math.atan(2.0 * aij / (ajj - aii) ) 
    }
    return th 
}
// get max off-diagonal value
var getAij = function(Mij){
    var N = Mij.length;
    var maxMij = 0.0 ;
    var maxIJ  = [0,1];
    for (var i = 0; i<N;i++){
        for (var j = i+1; j<N;j++){ 
            if (Math.abs(maxMij) <= Math.abs(Mij[i][j])){
                maxMij = Math.abs(Mij[i][j]);
                maxIJ  = [i,j];
            } 
        }
    }
    return maxIJ
}