var worker 

var start = function(){
    var answer;
    worker = new Worker('jacobi_worker.js');
    var conv = document.getElementById("convergence").value;
    var Hij = eval(document.getElementById("matrix").value);
    worker.postMessage({"cmd":"Start","Hij":Hij,"conv":conv})
    worker.onmessage = function (event) {
        msg =  event.data;
        if (msg.cmd == 'done'){
            document.getElementById("answer").innerHTML += String(msg.ans[0]) + "<br>";
            console.log(msg.ans[1]);
        } else {
            document.getElementById("answer").innerHTML += "Running, Error " + String(msg.error) + "<br>"; 
        }
    };
}

var stop = function(){
    if (worker!==undefined){
        worker.terminate();
    } 
}