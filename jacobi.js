var Rot = function(theta){
    Mat = [[Math.cos(theta),Math.sin(theta)],[-Math.sin(theta),Math.cos(theta)]];
    return Mat
}

var Rij = function(i,j,theta,N){
    Mat = Array(N) 
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
    Mat[i][i] = Rij[0][0] // 11
    Mat[j][j] = Rij[1][1] // 22
    Mat[i][j] = Rij[0][1] // 12
    Mat[j][i] = Rij[1][0] // 21
    return Mat
}