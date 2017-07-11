//string 转换成Byte类型
//'B001'=>[0xb0, 0x01]
function stringToByte(str){
    var bytesTemp = new Array();   
    var bytes = new Array();   
    var len,d;  
    len = str.length;  

    for(var i = 0; i < len; i++){  
        d = str.charCodeAt(i).toString(16) - 30; 
        if (d >= 10)
            d -= 1;

        if (d < 0 || d > 15)
            return null;

        bytesTemp.push(d & 0xFF);
    }  

    for (var i = 0; i < bytesTemp.length; i++, i++)
    {    
        bytes.push(bytesTemp[i] << 4 | bytesTemp[i+1]);
    }

    return bytes.toString();  
}

function stringToByteTest(){
    //测试stringToByte方法
    // var stringTemp = 'B00103E901180024010E46363231335F53312E30312E3036065F48352E30330000FFFFFFFFFFFF0FFF00008C';
    // var reult = stringToByte(stringTemp);
    // alert(reult);

    var bytes = new Array();  
    var stringTemp = 'S1.0.2.1';
    var temp;
    for(var i = 0; i < stringTemp.length; i++){  
        temp = stringTemp.charCodeAt(i).toString(); 
        bytes.push(temp & 0xFF);
        alert(temp + ',' + i + ',' + bytes.length);
    }  
}

//时间戳转换为时间
function   formatDate(now){     
    return new Date(parseInt(now) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');     
}
