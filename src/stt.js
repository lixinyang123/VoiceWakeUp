var fs = require('fs');
var AipSpeechClient = require("baidu-aip-sdk").speech;

// 设置APPID/AK/SK
var APP_ID = "25877588";
var API_KEY = "gGoV5cO3lczxi9lcFleeCTM6";
var SECRET_KEY = "MPvXCZUCluiuQiUy7nojEgSUGo6v0jLQ";

// 新建一个对象，建议只保存一个对象调用服务接口
var client = new AipSpeechClient(APP_ID, API_KEY, SECRET_KEY);

async function stt(fileName) {

    if(!fileName.endsWith('.wav'))
        return;

    var voice = fs.readFileSync(fileName);
    var voiceBuffer = Buffer.from(voice);
    
    // 识别本地文件
    return await client.recognize(voiceBuffer, 'wav', 16000);
}

module.exports = stt;