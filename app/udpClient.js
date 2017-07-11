var dgram = require('dgram');
var clientSocket = dgram.createSocket('udp4');
var clientIp = 'localhost';
var clientPort = 8080;
var localPort = 6969;

//·¢ËÍUDPÏûÏ¢
function sendMsg(msg){//send to server
    clientSocket.send(msg, 0, msg.length, clientPort, clientIp);
}

//Send a hello message
function udpConnect(){
    clientIp = document.getElementById('clientIpInput').value;
    clientPort = document.getElementById('clientPortInput').value;
    localPort = document.getElementById('localPortInput').value;

    // alert('client ip:' + clientIp + 'client port:' + clientPort + 'local port' + localPort);
    sendMsg('Vehicle Dector Protocol Simulate!\r\n');
}

clientSocket.on('message', function(msg, rinfo){
    handleUdpRcv(msg.toString(), msg.length);
});

clientSocket.on('error', function(err){
    // console.log('error, msg - %s, stack - %s\n', err.message, err.stack);
});

clientSocket.bind(localPort);