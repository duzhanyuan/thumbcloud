var pathElement = document.getElementById("path")
var contentElement = document.getElementById("content")

var wsUri = 'ws:' + window.location.host + ':80/ws/';
console.log('Trying to connect to: ' + wsUri);
var conn = new WebSocket(wsUri);

conn.onopen = function(e) {
    console.log('Connected.');
    requestFiles(".");
}

conn.onmessage = function(e) {
    decode(e.data);
};

conn.onclose = function() {
    console.log('Disconnected.');
    conn = null;
};

window.onhashchange = function(e) {
    path = str = e.newURL.split("#").pop();
    requestFiles(path);
    console.log(path);
}

function requestFiles(path) {
    msg = {
        "action": "requestFilelist",
        "path": path
    };

    conn.send(JSON.stringify(msg));
    console.log(JSON.stringify(msg));
}

function decode(input) {
    obj = JSON.parse(input)
    path = obj.path + "/";

    if (obj.action == 'sendFilelist') {
        renderFiles(path, obj.folders, obj.files);
        
    } else if (obj.action == 'sendError') {
        console.log('Got Error from Server:' + obj.message);
    } else {
        console.log('Got invalid "' + obj.action + '" as action from sever')
    }
}

function renderFiles(path, folders, files) {
    // Create the path navigation element
    if (path != '') {
        pathOutput = '';
        pathList = path.split("/");
        console.log(pathList);

        for (i = 0; i < pathList.length; i++) {
            var fullPath  = ""; 
            for (j = 0; j <= i; j++) {
                fullPath += pathList[j];
                if (j != i) {
                    fullPath += '/';
                }
            }
            pathOutput += '<a href="#' + fullPath + '">' + pathList[i] + '</a>/';
        }

        pathOutput = pathOutput.substring(0, pathOutput.length - 1);
        pathElement.innerHTML = pathOutput;
    } 

    // Create the file and folder list
    var output = '';

    for (i = 0; i < folders.length; i++) {
        var name = folders[i];
        output += '<a href="#' + path + name + '" >' + name + "/</a><br>";
    }

    for (i = 0; i < files.length; i++) {
        output += files[i] + "<br>";
    }

    contentElement.innerHTML = output;
}

