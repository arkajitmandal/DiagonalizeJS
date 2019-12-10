var worker 

var start = function(){
    try {
        worker.terminate();
    } catch (error) {
        //pass;
    }
    var iter = 0;
    var answer;
    worker = new Worker('jacobi_worker.js');
    var conv = document.getElementById("convergence").value;
    var Hij = eval(document.getElementById("matrix").value);
    worker.postMessage({"cmd":"Start","Hij":Hij,"conv":conv})
    worker.onmessage = function (event) {
        msg =  event.data;
        if (msg.cmd == 'done'){
            document.getElementById("eigen").value = msg.ans.E;
            document.getElementById("vector").value = msg.ans.U;
            //worker.terminate();
        } else {
            iter += 1;
            document.getElementById("answer").innerHTML = String(msg.iter) + "<br> Running, Error " + String(msg.error) + "<br>"; 
        }
    };
}

var stop = function(){
    if (worker!==undefined){
        worker.terminate();
    } 
}

var rand = function(){
    var N = document.getElementById("Nstate").value;
    var Hij = Array(N);
    for (var i=0; i<N; i++){
        Hij[i] = Array(N);
    }
    for (var i=0; i<N; i++){
        Hij[i][i] = Math.random()*10.0 - 5.0; 
        for (var j=i+1; j<N; j++){
            Hij[i][j] = Math.random()*10.0 - 5.0; 
            Hij[j][i] = Hij[i][j] ;
        }
    }
    var txt = JSON.stringify(Hij);
    document.getElementById("matrix").value = txt;
}