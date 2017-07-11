var packNum = 0;
var vehicleSoftVersion = 'F6213_S1.01.06';
var vehicleHardVersion = '_H5.03';
var vehicleRcvUdpFlag = false;
var vehicleRcvUdpTemp = new Array();
var vehicleRcvUdpTempLen = 0;
var cmdVersion = 0x02;

function showLogLableClean(){
    document.getElementById('resultMsgLable').value = '';
}

function showLogLableAdd(str){
    var temp = document.getElementById('resultMsgLable').value;
    temp += str;
    document.getElementById('resultMsgLable').value = temp;
}

function CluCheckData(str_data, offset, len){   
    var checksum = 0;
    var strTemp = str_data.toString();
    var arrTemp = strTemp.split(',');

    for(var i = 0; i < len; i++)
    {
        checksum ^= arrTemp[i + offset];
    }

    return checksum ;
}

function vehicleRcvBufClean(){
    vehicleRcvUdpFlag = false;
    vehicleRcvUdpTemp = [];
}

function handleUdpRcv(str, len){
    var strTemp = '';
    var temp = 0;

    vehicleRcvUdpFlag = true;
    vehicleRcvUdpTempLen = len / 2;
    strTemp = stringToByte(str);

    vehicleRcvUdpTemp = strTemp.split(',');
    showLogLableAdd(vehicleRcvUdpTemp);
}