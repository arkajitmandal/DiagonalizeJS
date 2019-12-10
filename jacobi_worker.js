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
    var Rotij = Rot(theta);

    // Put Rotation part in i, j
    Mat[k][k] = Rotij[0][0] // 11
    Mat[l][l] = Rotij[1][1] // 22
    Mat[k][l] = Rotij[0][1] // 12
    Mat[l][k] = Rotij[1][0] // 21
    return Mat
}

// get angle
var getTheta = function(aii,ajj,aij){
    var  th = 0.0 
    var denom = (ajj - aii);
    if (Math.abs(denom) <= 1E-12){
        th = Math.PI/4.0
    }
    else {
        th = 0.5 * Math.atan(2.0 * aij / (ajj - aii) ) 
    }
    return th 
}
// get max off-diagonal value from Upper Diagonal
var getAij = function(Mij){
    var N = Mij.length;
    var maxMij = 0.0 ;
    var maxIJ  = [0,1];
    for (var i = 0; i<N;i++){
        for (var j = i+1; j<N;j++){ 
            if (Math.abs(maxMij) < Math.abs(Mij[i][j])){
                maxMij = Math.abs(Mij[i][j]);
                maxIJ  = [i,j];
            } 
        }
    }
    return [maxIJ,maxMij]
}
// Unitary Rotation UT x H x U
var unitary  = function(U,H){
    var N = U.length;
    // empty NxN matrix
    var Mat = Array(N) 
    for (var i = 0; i<N;i++){
        Mat[i] = Array(N) 
    }
    // compute element
    for (var i = 0; i<N;i++){
        for (var j = 0; j<N;j++){
            Mat[i][j] =  0 
            for (var k = 0; k<N;k++){
                for (var l = 0; l<N;l++){
                    Mat[i][j] = Mat[i][j] + U[k][i] * H[k][l] * U[l][j];
                }
            }
        }
    }
    return Mat;
}

var Hij1 = function(Hij, theta,i,j){
    let N = Hij.length;
    let c = Math.cos(theta);
    let s = Math.sin(theta);
    let c2 = c * c ; 
    let s2 = s * s ; 
    //var Ans = new Array(N).fill(Array(N).fill(0)); 
    let Aki =  new Array(N).fill(0);
    let Akj =  new Array(N).fill(0);
    // Aii
    let Aii = c2 * Hij[i][i] - 2 * c * s * Hij[i][j] + s2 * Hij[j][j];
    let Ajj = s2 * Hij[i][i] + 2 * c * s * Hij[i][j] + c2 * Hij[j][j];
    // 0  to i
    for (var k=0; k<N; k++){
        Aki[k] =  c * Hij[i][k] - s * Hij[j][k] ;
        //Ans[i][k] =  Ans[k][i] ; 
        Akj[k] =  s * Hij[i][k] + c * Hij[j][k] ;
        //Ans[j][k] =  Ans[k][j] ; 
    }
    // Modify Hij
    Hij[i][i] = Aii;
    Hij[j][j] = Ajj;
    Hij[i][j] = 0;
    Hij[j][i] = 0;
    // 0  to i
    for (var k=0; k<N; k++){
        if (k!==i && k!==j){
            Hij[i][k] = Aki[k];
            Hij[k][i] = Aki[k];
            Hij[j][k] = Akj[k];
            Hij[k][j] = Akj[k];
        }
    }
    return Hij;
 }
 
 var Sij1 =  function(Sij, theta,i,j){
    let N = Sij.length;
    let c = Math.cos(theta);
    let s = Math.sin(theta);
    let Ski =  new Array(N).fill(0);
    let Skj =  new Array(N).fill(0);
    for (var k=0; k<N; k++){
        Ski[k] = c * Sij[k][i] - s * Sij[k][j];
        Skj[k] = s * Sij[k][i] + c * Sij[k][j];
    }
    for (var k=0; k<N; k++){
        Sij[k][i] =  Ski[k] ;
        Sij[k][j] =  Skj[k] ;
    }
    return Sij;
}

// Matrix Multiplication
var AxB = function(A,B){
    var N = A.length;
    // empty NxN matrix
    var Mat = Array(N) 
    for (var i = 0; i<N;i++){
        Mat[i] = Array(N) 
    }
    for (var i = 0; i<N;i++){
        for (var j = 0; j<N;j++){
            Mat[i][j] =  0 
            for (var k = 0; k<N;k++){
                Mat[i][j] = Mat[i][j] + A[i][k] * B[k][j] ; 
            }
        }
    }
    return Mat;
}

var diag = function(Hij, convergence = 1E-7){
    let t1 = new Date()
    var N = Hij.length; 
    var Ei = Array(N);
    var e0 =  Math.abs(convergence / N)
    // initial vector
    var Sij = new Array(N);
    // Sij is Identity Matrix
    for (var i = 0; i<N;i++){
        Sij[i] = Array(N).fill(0)
        Sij[i][i] = 1.0;
    }
    // initial error
    var Vab = getAij(Hij); 
    var Vabold = Vab[1];
    var iter = 0 ;
    //  jacobi iterations
    while (Math.abs(Vab[1]) >= Math.abs(e0)){
        iter += 1;
        //console.log(Math.log(Vabold/Vab[1]));
        if (Math.log(Vabold/Vab[1])>1.0){
            Vabold = Vab[1];
            postMessage({'error':Vab[1],'cmd':'running','iter':iter});
        }
        // block index to be rotated
        var i =  Vab[0][0];
        var j =  Vab[0][1];
        // get theta
        var psi = getTheta(Hij[i][i], Hij[j][j], Hij[i][j]); 
        // Givens matrix
        //var Gij =  Rij(i,j,psi,N);
        // rotate Hamiltonian using Givens
        
        //Hij = unitary(Gij,Hij); 
        
        Hij = Hij1(Hij,psi,i,j);
        //console.log(Hij);
        //console.log(i,j);
        // Update vectors
        //Sij = AxB(Sij,Gij); 
        //console.log(Sij);
        Sij = Sij1(Sij,psi,i,j);
        
        // update error 
        Vab = getAij(Hij); 
    }
    for (var i = 0; i<N;i++){
        Ei[i] = Hij[i][i]; 
    }
    let t2 = new Date()
    console.log("Time: " + String(t2-t1));
    var ans = sorting(Ei , Sij) 
    postMessage({'ans':ans,'cmd':'done'});
    //return ans
}


var sorting = function(E, S){
    var N = E.length ; 
    var Ef = Array(N);
    var Sf = Array(N);
    for (var k = 0; k<N;k++){
        Sf[k] = Array(N);
    }
    for (var i = 0; i<N;i++){
        var minID = 0;
        var minE  = E[0];
        for (var j = 0; j<E.length;j++){
            if (E[j] < minE){
                minID = j ; 
                minE  = E[minID];
            }
        }
        Ef[i] = E.splice(minID,1)[0];
        for (var k = 0; k<N;k++){
            Sf[k][i]  = S[k][minID];
            S[k].splice(minID,1);
        }
    }
    return {'E':JSON.stringify(Ef),'U':JSON.stringify(Sf)}
}

onmessage = function(e) {
    console.log('received ' + e.data);
    let msg = e.data; // msg received
    
    if (msg.cmd === "Start"){
        
        var Hij = msg.Hij ;
        if (msg.conv != undefined){
            //console.log(Hij);
            diag(Hij,msg.conv);
        }else{
            diag(Hij);
            console.log("Default");
        }
    }
}