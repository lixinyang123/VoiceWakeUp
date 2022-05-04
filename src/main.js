var fs = require('fs');
var path = require('path');
var AudioRecorder = require('node-audiorecorder');
var stt = require('./stt');

var DIRECTORY = 'records';

if (!fs.existsSync(DIRECTORY)) {
  fs.mkdirSync(DIRECTORY);
}

const options = {
  program: `sox`,
  silence: 0,
  bits: 16,
  rate: 16000,
  type: `wav`,
  silence: 2,
  thresholdStart: 0.9,
  thresholdStop: 0.9,
  keepSilence: true
}

var audioRecorder = new AudioRecorder(options, console);
var audioAwaker = new AudioRecorder(options, console);

audioAwaker.start();

var fileName = undefined;
var stopTimeout = undefined;

// wav编码格式
// https://blog.csdn.net/sunlifeall/article/details/119172001
// https://www.cnblogs.com/ranson7zop/p/7657874.html

audioAwaker.stream().on('data', chunk => {
  let num = chunk.readInt16LE(chunk.length - 2);
  if(num < 4000)
    return;

  if(!stopTimeout) {
    startRecord();
  }

  clearTimeout(stopTimeout);
  stopTimeout = setTimeout(async() => {
    stopRecord();
    stopTimeout = undefined;
  }, 1500);
})

audioRecorder.on('end', async(fileName) => {
  var res = await stt(fileName);
  console.log(res);
  fs.unlinkSync(fileName);
});

function randomName() {
  return path.join(
    DIRECTORY,
    Math.random()
      .toString(36)
      .replace(/[^0-9a-zA-Z]+/g, '')
      .concat('.wav')
  );
}

function startRecord() {
  fileName = randomName();
  var fileStream = fs.createWriteStream(fileName, { encoding: 'binary' });
  audioRecorder.start().stream().pipe(fileStream);
  console.warn('Start');
}

async function stopRecord() {
  audioRecorder.stop();
  audioRecorder.emit('end', fileName);
  console.warn('End');
}

process.stdin.resume();
console.warn('Press ctrl+c to exit.');
