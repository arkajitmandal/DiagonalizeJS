var Rot = function(theta){
    Mat = [[Math.cos(theta),Math.sin(theta)],[-Math.sin(theta),Math.cos(theta)]];
    return Mat
}

var Rij = function(i,j,theta,N){
    Mat = Array(N) 
    for (var i = 0; i<N;i++){
        Mat[i] = Array(N) 
    }
    return Mat
}