function poweronReportMsgPack()
{
    var localTimeStamp = Math.round(new Date().getTime()/1000) ;  //UNIXʱ���
    var softwareArry = new Array();
    var hardwareArry = new Array();
    var myArray = new Array();
    var pos = 0;
    var temp = 0; 

    //����汾
    for(var i = 0; i < vehicleSoftVersion.length; i++){  
        temp = vehicleSoftVersion.charCodeAt(i).toString(); 
        softwareArry.push(temp & 0xFF);
    }

    //Ӳ���汾
    for(var i = 0; i < vehicleHardVersion.length; i++){  
        temp = vehicleHardVersion.charCodeAt(i).toString(); 
        hardwareArry.push(temp & 0xFF);
    }

    myArray.push(0xB0);    pos++;    //�豸��
    myArray.push(0x01);    pos++;    //�豸����
    myArray.push(0x03);    pos++;
    myArray.push(0xE9);    pos++;
    myArray.push(0x01);    pos++;
    myArray.push(0x18);    pos++;    //������
    myArray.push(packNum++);    pos++;    //����
    myArray.push(0x01);    pos++;    //����
    myArray.push(cmdVersion);    pos++;    //����汾
    myArray.push(softwareArry.length);    pos++;    //����汾����                    
    for (var i = 0; i < softwareArry.length; i++)    //����汾
        myArray.push(softwareArry[i]);
    pos += softwareArry.length;
    myArray.push(hardwareArry.length);    pos++;    //Ӳ���汾����                    
    for (var i = 0; i < hardwareArry.length; i++)    //Ӳ���汾
        myArray.push(hardwareArry[i]);
    pos += hardwareArry.length;
    myArray.push(0x00);    pos++;    //�����澯
    myArray.push(0x00);    pos++;    //�شŸ澯
    myArray.push(0xFF);    pos++;    //RSRP
    myArray.push(0xFF);    pos++;
    myArray.push(0xFF);    pos++;    //RSSI
    myArray.push(0xFF);    pos++;
    myArray.push(0xFF);    pos++;    //С��ID
    myArray.push(0xFF);    pos++;
    myArray.push(0x0F);    pos++;    //��ص�ѹ
    myArray.push(0xFF);    pos++; 
    myArray.push(0x00);    pos++;    //�����¶�
    myArray.push(0x00);    pos++;
    
    myArray.push(CluCheckData(myArray, 8, pos - 8));    //У���
    myArray[7] = pos - 7;

    return myArray.toString();
}

function poweronReportMsgUnpack(){
    var vehicleId;
    var pos = 0;
    var timestamps = 0;

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
            if(0x19 == vehicleRcvUdpTemp[pos])
            {
                pos++;
                showLogLableAdd('&Poweron Report');
            }
            else
            {
                showLogLableAdd('&ERROR:Command Type Error(' + vehicleRcvUdpTemp[pos].toString() + ')');
                return;
            }

            //����
            if(vehicleRcvUdpTemp[pos++] == (packNum - 1))
                showLogLableAdd('&Package Num:' + (packNum - 1));
            else
            {
                showLogLableAdd('&ERROR:Package Num Error(' + (vehicleRcvUdpTemp[pos - 1]) + ')');
                return;
            }
            //�����
            showLogLableAdd('&Cmd length:' + vehicleRcvUdpTemp[pos++]);
            //����汾
            showLogLableAdd('&Cmd version:' + vehicleRcvUdpTemp[pos++]);
            //ʱ���
            timestamps |= vehicleRcvUdpTemp[pos++] << 24;
            timestamps |= vehicleRcvUdpTemp[pos++] << 16;
            timestamps |= vehicleRcvUdpTemp[pos++] << 8;
            timestamps |= vehicleRcvUdpTemp[pos++] << 0;
            showLogLableAdd('&Time:' + formatDate(timestamps));              
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

function handlePoweronMsg(){
    showLogLableAdd('\r\nhandlePoweronMsg\r\n');
    //�������
    var result = poweronReportMsgPack();
    //��ս��ܻ�����
    vehicleRcvBufClean();
    //����UDP����
    sendMsg(result);
    //�ȴ�2S�鿴���Ƿ���ܵ�����
    setTimeout("poweronReportMsgUnpack()",2000)
}