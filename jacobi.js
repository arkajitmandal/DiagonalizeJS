var Rot = function(theta){
    var Mat = [[Math.cos(theta),Math.sin(theta)],[-Math.sin(theta),Math.cos(theta)]];
    return Mat
}

var Rij = function(k,l,theta,N){
    var Mat = Array(N) 
    for (var i = 0; i<N;i++){
        Mat[i] = Array(N) 
    }
    // Identity Matrix
    for (var i = 0; i<N;i++){
        for (var j = 0; i<N;i++){
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