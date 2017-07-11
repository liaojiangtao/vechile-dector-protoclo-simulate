function warmingMsgPack()
{
    var myArray = new Array();
    var pos = 0;

    myArray.push(0xB0);    pos++;    //设备字
    myArray.push(0x01);    pos++;    //设备号码
    myArray.push(0x03);    pos++;
    myArray.push(0xE9);    pos++;
    myArray.push(0x01);    pos++;
    myArray.push(0x1A);    pos++;    //命令字
    myArray.push(packNum++);    pos++;    //包号
    myArray.push(0x01);    pos++;    //长度
    myArray.push(cmdVersion);    pos++;    //命令版本
    myArray.push(0x01);    pos++;    //电量告警
    myArray.push(0x07);    pos++;    //地磁告警 
    myArray.push(0xFF);    pos++;    //RSRP
    myArray.push(0xFF);    pos++;
    myArray.push(0xFF);    pos++;    //RSSI
    myArray.push(0xFF);    pos++;
    myArray.push(0xFF);    pos++;    //小区ID
    myArray.push(0xFF);    pos++;
    myArray.push(0x0F);    pos++;    //电池电压
    myArray.push(0xFF);    pos++; 
    myArray.push(0x00);    pos++;    //环境温度
    myArray.push(0x00);    pos++;
    
    myArray.push(CluCheckData(myArray, 8, pos - 8));    //校验和
    myArray[7] = pos - 7;

    return myArray.toString();
}

function warmingMsgUnpack(){
    var vehicleId;
    var pos = 0;

    if (true == vehicleRcvUdpFlag)
    {
        if (0xA0 == vehicleRcvUdpTemp[0])
        {
            if (vehicleRcvUdpTemp[1] < 10)
                vehicleId = '0' + vehicleRcvUdpTemp[1].toString();
            else
                vehicleId = vehicleRcvUdpTemp[1].toString();
            var baseStation = vehicleRcvUdpTemp[2] << 8 | vehicleRcvUdpTemp[3];
            if (baseStation < 10)
                vehicleId += '0000' + baseStation.toString();
            else if(baseStation < 100)
                vehicleId += '000' + baseStation.toString();
            else if(baseStation < 1000)
                vehicleId += '00' + baseStation.toString();
            else if(baseStation < 10000)
                vehicleId += '0' + baseStation.toString();
            else
                vehicleId += baseStation.toString();

            if (vehicleRcvUdpTemp[4] < 10)
                vehicleId += '0' + vehicleRcvUdpTemp[4].toString();
            else
                vehicleId += vehicleRcvUdpTemp[4].toString();

            showLogLableAdd('\r\nUnpack=>Vehicle ID:' + vehicleId);
            pos += 5;
            if(0x1B == vehicleRcvUdpTemp[pos])
            {
                pos++;
                showLogLableAdd('&Poweron Report');
            }
            else
            {
                showLogLableAdd('&ERROR:Command Type Error(' + vehicleRcvUdpTemp[pos].toString() + ')');
                return;
            }

            //包号
            if(vehicleRcvUdpTemp[pos++] == (packNum - 1))
                showLogLableAdd('&Package Num:' + (packNum - 1));
            else
            {
                showLogLableAdd('&ERROR:Package Num Error(' + (vehicleRcvUdpTemp[pos - 1]) + ')');
                return;
            }
            //命令长度
            showLogLableAdd('&Cmd length:' + vehicleRcvUdpTemp[pos++]);
            //命令版本
            showLogLableAdd('&Cmd version:' + vehicleRcvUdpTemp[pos++]);
        }
        else
        {
            showLogLableAdd('\r\nERROR:No 0xA0 in Buff[0]');
        }

    }
    else
    {
        showLogLableAdd('\r\nERROR:None Ack!!!');
    }
}

function handleWarmingReport(){
    showLogLableAdd('\r\nhandleWarmingReport\r\n');
    var result = warmingMsgPack();
    //清空接受缓冲区
    vehicleRcvBufClean();
    //发送UDP数据
    sendMsg(result);
    //等待2S查看是是否接受到数据
    setTimeout("warmingMsgUnpack()",2000)
}